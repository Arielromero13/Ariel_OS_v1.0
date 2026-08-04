import { put, list } from '@vercel/blob';

// Tipado mínimo compatible con el runtime de Vercel Functions, sin depender
// del paquete @vercel/node (mismo patrón que api/claude.ts).
interface VercelLikeRequest {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
}
interface VercelLikeResponse {
  status(code: number): VercelLikeResponse;
  json(body: unknown): void;
}

/**
 * Webhook serverless de Telegram — capa de captura de evidencia de campo.
 *
 * Responsabilidad única: recibir una foto con su etiqueta ("Planta X,
 * medición 2 de 10"), guardarla en Vercel Blob y actualizar un manifiesto
 * de campaña. NO interpreta la lectura del instrumento ni evalúa nada —
 * esa lectura se hace después, en una sesión normal de Claude, sin costo
 * de API adicional (decisión explícita: sin lectura de visión en tiempo
 * real). Ver skills/capture-telegram-evidence/SKILL.md para el contrato
 * completo y docs/telegram-capture.md para el diseño.
 *
 * Variables de entorno requeridas (Vercel → Settings → Environment
 * Variables, nunca en el cliente ni con valores reales en este repo):
 * - TELEGRAM_BOT_TOKEN
 * - TELEGRAM_WEBHOOK_SECRET   (valor arbitrario; debe coincidir con el
 *                              secret_token registrado en setWebhook)
 * - BLOB_READ_WRITE_TOKEN     (la crea Vercel automáticamente al enlazar
 *                              un Blob Store al proyecto)
 */

const TELEGRAM_API = 'https://api.telegram.org';

interface CampaignManifest {
  plant: string;
  total: number;
  points: Record<string, { photoUrl: string; caption: string; receivedAt: string }>;
}

function slugify(text: string): string {
  const cleaned = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
  return cleaned || 'campana-sin-nombre';
}

function parseCaption(caption: string): { plant: string; index: number; total: number } | null {
  const match = caption.match(/medici[oó]n\s*(\d+)\s*(?:de|\/|-)\s*(\d+)/i);
  if (!match) return null;
  const index = Number(match[1]);
  const total = Number(match[2]);
  if (!Number.isInteger(index) || !Number.isInteger(total) || index < 1 || total < 1 || index > total) {
    return null;
  }
  const plant = caption
    .replace(match[0], '')
    .replace(/[,;:.\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { plant: plant || 'sin-planta', index, total };
}

async function sendTelegramMessage(token: string, chatId: number, text: string): Promise<void> {
  await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch(() => {
    // No bloquea la respuesta al webhook si el aviso al usuario falla.
  });
}

async function getTelegramFileUrl(token: string, fileId: string): Promise<string | null> {
  const resp = await fetch(`${TELEGRAM_API}/bot${token}/getFile?file_id=${fileId}`);
  if (!resp.ok) return null;
  const data = (await resp.json()) as { result?: { file_path?: string } };
  const filePath = data.result?.file_path;
  if (!filePath) return null;
  return `${TELEGRAM_API}/file/bot${token}/${filePath}`;
}

async function readManifest(pathname: string, blobToken: string): Promise<CampaignManifest | null> {
  const { blobs } = await list({ prefix: pathname, token: blobToken, limit: 1 });
  const match = blobs.find((b) => b.pathname === pathname);
  if (!match) return null;
  const resp = await fetch(match.url, { cache: 'no-store' });
  if (!resp.ok) return null;
  return (await resp.json()) as CampaignManifest;
}

export default async function handler(req: VercelLikeRequest, res: VercelLikeResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (!botToken || !blobToken) {
    res.status(500).json({ error: 'server_misconfigured', detail: 'Faltan TELEGRAM_BOT_TOKEN o BLOB_READ_WRITE_TOKEN.' });
    return;
  }

  if (webhookSecret) {
    const incomingSecret = req.headers?.['x-telegram-bot-api-secret-token'];
    if (incomingSecret !== webhookSecret) {
      res.status(401).json({ error: 'invalid_secret' });
      return;
    }
  }

  const update = (req.body || {}) as {
    message?: {
      chat?: { id?: number };
      caption?: string;
      photo?: Array<{ file_id: string }>;
    };
  };
  const message = update.message;

  // Telegram exige 200 para cualquier update reconocido, aunque no
  // contenga una foto — de lo contrario reintenta indefinidamente.
  if (!message || !message.chat?.id) {
    res.status(200).json({ ok: true, ignored: true });
    return;
  }

  const chatId = message.chat.id;

  if (!message.photo || message.photo.length === 0) {
    await sendTelegramMessage(
      botToken,
      chatId,
      'Envía la foto de la medición con el texto: "Planta X, medición 2 de 10".'
    );
    res.status(200).json({ ok: true, ignored: true });
    return;
  }

  const parsed = parseCaption(message.caption || '');
  if (!parsed) {
    await sendTelegramMessage(
      botToken,
      chatId,
      '⚠️ No pude leer el punto. Usa el formato "Planta X, medición N de M" en el texto de la foto.'
    );
    res.status(200).json({ ok: true, ignored: true });
    return;
  }

  const { plant, index, total } = parsed;
  const campaignSlug = slugify(plant);

  try {
    // El último elemento de photo[] es la resolución más alta.
    const fileId = message.photo[message.photo.length - 1].file_id;
    const fileUrl = await getTelegramFileUrl(botToken, fileId);
    if (!fileUrl) throw new Error('telegram_file_not_found');

    const imageResp = await fetch(fileUrl);
    if (!imageResp.ok) throw new Error('telegram_file_download_failed');
    const imageBuffer = await imageResp.arrayBuffer();

    const photoPathname = `campaigns/${campaignSlug}/punto-${String(index).padStart(3, '0')}.jpg`;
    const photoBlob = await put(photoPathname, imageBuffer, {
      access: 'public',
      contentType: 'image/jpeg',
      addRandomSuffix: false,
      allowOverwrite: true,
      token: blobToken,
    });

    const manifestPathname = `campaigns/${campaignSlug}/manifest.json`;
    const existing = await readManifest(manifestPathname, blobToken);
    const manifest: CampaignManifest = existing || { plant, total, points: {} };
    manifest.total = total; // el último mensaje de la ruta manda el total vigente
    manifest.points[String(index)] = {
      photoUrl: photoBlob.url,
      caption: message.caption || '',
      receivedAt: new Date().toISOString(),
    };

    await put(manifestPathname, JSON.stringify(manifest, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      token: blobToken,
    });

    const registered = Object.keys(manifest.points).length;
    const routeComplete = registered >= total;

    await sendTelegramMessage(
      botToken,
      chatId,
      routeComplete
        ? `✅ Medición ${index}/${total} registrada. Ruta completa (${registered}/${total}) — lista para procesar en la próxima sesión.`
        : `✅ Medición ${index}/${total} registrada (${registered}/${total} recibidas hasta ahora).`
    );

    res.status(200).json({ ok: true, campaign: campaignSlug, registered, total, routeComplete });
  } catch (error) {
    await sendTelegramMessage(
      botToken,
      chatId,
      '⚠️ No pude guardar esta foto. Vuelve a enviarla; si se repite, avísale a Ariel.'
    );
    res.status(200).json({ ok: false, error: 'capture_failed' });
  }
}
