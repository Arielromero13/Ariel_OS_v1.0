// Tipado mínimo compatible con el runtime de Vercel Functions, sin depender
// del paquete @vercel/node (no está entre las dependencias del proyecto).
interface VercelLikeRequest {
  method?: string;
  body?: unknown;
}
interface VercelLikeResponse {
  status(code: number): VercelLikeResponse;
  json(body: unknown): void;
}

/**
 * Proxy serverless hacia la API de Anthropic.
 *
 * El navegador nunca ve la API key: se lee exclusivamente de la variable
 * de entorno ANTHROPIC_API_KEY, configurada en el proyecto de Vercel
 * (Settings → Environment Variables), nunca en el código ni en el cliente.
 *
 * El frontend (src/harness/connectors/claudeConnector.ts) llama a este
 * endpoint same-origin (/api/claude) en vez de llamar directo a
 * api.anthropic.com.
 */
export default async function handler(req: VercelLikeRequest, res: VercelLikeResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'server_misconfigured', detail: 'ANTHROPIC_API_KEY no está configurada en el servidor.' });
    return;
  }

  const body = (req.body || {}) as {
    systemInstruction?: unknown;
    specificRequest?: unknown;
    modelName?: unknown;
    maxTokens?: unknown;
  };
  const { systemInstruction, specificRequest, modelName, maxTokens } = body;

  if (typeof systemInstruction !== 'string' || typeof specificRequest !== 'string') {
    res.status(400).json({ error: 'invalid_payload', detail: 'Se requieren systemInstruction y specificRequest como texto.' });
    return;
  }

  const model = typeof modelName === 'string' && modelName.trim()
    ? modelName
    : (process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6');

  const cappedMaxTokens = Math.min(Number(maxTokens) || 1024, 4096);

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: cappedMaxTokens,
        system: systemInstruction,
        messages: [{ role: 'user', content: specificRequest }],
      }),
    });

    if (!upstream.ok) {
      // No se reenvían los detalles internos de la respuesta de Anthropic al cliente.
      res.status(502).json({ error: 'upstream_error', status: upstream.status });
      return;
    }

    const data = await upstream.json();
    const text = data?.content?.[0]?.text ?? '';

    res.status(200).json({
      modelUsed: model,
      rawTextResponse: text,
    });
  } catch {
    res.status(502).json({ error: 'upstream_unreachable' });
  }
}
