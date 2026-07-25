import type { Provider } from './types.js';

export function extractJson(text: string): unknown {
  const trimmed = text.trim().replace(/^\x60\x60\x60(?:json)?\s*/i, '').replace(/\s*\x60\x60\x60$/, '');
  return JSON.parse(trimmed);
}
export async function runModel(provider: Provider, model: string, prompt: string): Promise<string> {
  if (provider === 'gemini') {
    const key = process.env.GEMINI_API_KEY; if (!key) throw new Error('GEMINI_API_KEY is not configured.');
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent?key=' + encodeURIComponent(key), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] }) });
    if (!response.ok) throw new Error('Gemini request failed: ' + response.status);
    const json = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    return json.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
  }
  if (provider === 'openai') {
    const key = process.env.OPENAI_API_KEY; if (!key) throw new Error('OPENAI_API_KEY is not configured.');
    const response = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' }, body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], response_format: { type: 'json_object' } }) });
    if (!response.ok) throw new Error('OpenAI request failed: ' + response.status);
    const json = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    return json.choices?.[0]?.message?.content || '';
  }
  const key = process.env.ANTHROPIC_API_KEY; if (!key) throw new Error('ANTHROPIC_API_KEY is not configured.');
  const response = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify({ model, max_tokens: 4096, messages: [{ role: 'user', content: prompt }] }) });
  if (!response.ok) throw new Error('Claude request failed: ' + response.status);
  const json = await response.json() as { content?: Array<{ text?: string }> };
  return json.content?.map((part) => part.text || '').join('') || '';
}
