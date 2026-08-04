# Captura de evidencia por Telegram

## Por qué existe

El primer piloto (P.A.T.) empieza con un Excel armado después de la ruta
de mediciones. Esta capa adelanta esa recopilación al momento en que se
toma cada foto en campo, para llegar a la sesión de análisis con la
mayoría del expediente ya organizado.

## Decisión de diseño: sin lectura de visión en tiempo real

Se evaluó que el bot leyera el valor del instrumento directamente en cada
foto (visión, en el momento). Se descartó a propósito: requeriría llamar
a la API de Anthropic por cada foto tomada en campo, con costo por uso —
algo que el proyecto evita deliberadamente (Vercel no tiene
`ANTHROPIC_API_KEY` configurada en producción; ver estado del componente
"Herramientas y adaptadores" en el README).

En su lugar, el bot solo captura y etiqueta. La lectura del valor ocurre
después, en una sesión normal de Claude (sin costo adicional, incluida en
la suscripción), donde el especialista de dominio revisa cada foto como
parte del flujo habitual de `analyze-grounding-report`.

## Cómo se asocia cada foto a su punto

El ingeniero escribe, en el pie de foto del mensaje de Telegram:

```
<Planta o campaña>, medición <N> de <M>
```

El texto es la única fuente de verdad para la asociación — no hay orden
implícito ni inferencia por secuencia de llegada. Ver
[skills/capture-telegram-evidence/SKILL.md](../skills/capture-telegram-evidence/SKILL.md)
para el contrato completo.

## Dónde vive la implementación

- `api/telegram-webhook.ts` — función serverless de Vercel (plan Hobby,
  gratuito) que recibe el update de Telegram, descarga la foto y la sube
  a Vercel Blob.
- Vercel Blob — almacenamiento de objetos, también dentro del plan
  gratuito, para las fotos y el `manifest.json` de cada campaña. No es
  el almacenamiento de artefactos del expediente formal; es una bandeja
  de entrada temporal hasta la sesión de análisis.
- El manifiesto de campaña **no** es un `evidence.schema.json` validado.
  Es un artefacto de captura crudo — la promoción al contrato formal
  ocurre en sesión, con revisión humana de cada foto.

## Puesta en marcha (pendiente de hacer una vez)

1. Crear el bot con [@BotFather](https://t.me/BotFather) en Telegram y
   obtener el token.
2. En el proyecto de Vercel: Storage → crear un Blob Store (gratuito) y
   enlazarlo al proyecto — esto genera `BLOB_READ_WRITE_TOKEN`
   automáticamente.
3. Configurar `TELEGRAM_BOT_TOKEN` y `TELEGRAM_WEBHOOK_SECRET` en Vercel
   → Settings → Environment Variables.
4. Tras el deploy, registrar el webhook una sola vez:

   ```
   curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
     -d "url=https://<tu-dominio-vercel>/api/telegram-webhook" \
     -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
   ```

## Portabilidad entre arneses

Esta capa no depende de qué arnés (Claude Code, Codex Cloud, Antigravity)
esté generando cambios en el repositorio — es infraestructura corriendo
sola, 24/7, en Vercel. Cualquier arnés puede seguir extendiéndola: el
contrato de comportamiento está en la SKILL.md, no en el código.
