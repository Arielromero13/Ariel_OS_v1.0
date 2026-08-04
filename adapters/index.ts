// Ariel Agent OS Model Harness Adapters
import { ModelConfig } from '../src/harness/types';
import { BaseModelConnector } from '../src/harness/connectors/base';
import { GeminiModelConnector } from '../src/harness/connectors/geminiConnector';
import { OpenAIModelConnector } from '../src/harness/connectors/openaiConnector';
import { ClaudeModelConnector } from '../src/harness/connectors/claudeConnector';
import { LocalSimulatorConnector } from '../src/harness/connectors/simulatorConnector';
import { NativeAntigravityAdapter } from './antigravity/antigravityAdapter';
import { NativeCodexCliAdapter } from './codexCliAdapter';
import { NativeCodexCloudAdapter } from './codexCloudAdapter';

/**
 * NativeClaudeCodeAdapter y NativeCodexCloudAdapter usan child_process/util
 * de Node para invocar binarios CLI locales (`claude`, `codex`) — módulos
 * que no existen en el navegador. Este proyecto es una SPA de Vite sin
 * backend propio (salvo las funciones serverless de api/), así que estos
 * dos NO se importan de forma estática: eso rompía `npm run build` porque
 * Vite intentaba resolver `child_process` para todo el bundle del cliente,
 * incluso para quien nunca selecciona esos proveedores.
 *
 * Se cargan bajo demanda solo si alguien selecciona ese proveedor. En un
 * despliegue web (Vercel) esa carga fallará con gracia y caerá a modo
 * simulación — son adaptadores para ejecución local (terminal propia),
 * no para el sitio desplegado.
 */
async function createNodeCliConnector(
  kind: 'native_claude_code' | 'native_codex_cloud',
  config: ModelConfig
): Promise<BaseModelConnector> {
  try {
    if (kind === 'native_claude_code') {
      const { NativeClaudeCodeAdapter } = await import('./claudeCodeAdapter');
      return new NativeClaudeCodeAdapter(config);
    }
    const { NativeCodexCloudAdapter } = await import('./codexCloudAdapter');
    return new NativeCodexCloudAdapter(config);
  } catch (err) {
    console.warn(
      `No se pudo cargar el adaptador '${kind}' — solo funciona en un entorno Node local con el binario CLI instalado, no en este despliegue web. Cayendo a simulador.`,
      err
    );
    return new LocalSimulatorConnector(config);
  }
}

export async function createModelConnector(config: ModelConfig): Promise<BaseModelConnector> {
  switch (config.provider) {
    case 'native_antigravity':
      return new NativeAntigravityAdapter(config);
    case 'native_claude_code':
      return createNodeCliConnector('native_claude_code', config);
    case 'native_codex_cli':
      return new NativeCodexCliAdapter(config);
    case 'native_codex_cloud':
      return new NativeCodexCloudAdapter(config);
    case 'gemini':
      return new GeminiModelConnector(config);
    case 'openai':
      return new OpenAIModelConnector(config);
    case 'claude':
      return new ClaudeModelConnector(config);
    case 'simulator':
    default:
      return new LocalSimulatorConnector(config);
  }
}

export {
  BaseModelConnector,
  GeminiModelConnector,
  OpenAIModelConnector,
  ClaudeModelConnector,
  LocalSimulatorConnector,
  NativeAntigravityAdapter,
  NativeCodexCliAdapter,
  NativeCodexCloudAdapter,
};

// NativeClaudeCodeAdapter y NativeCodexCloudAdapter ya no se re-exportan
// estáticamente aquí (ver createNodeCliConnector arriba). Para usarlos
// directamente, impórtalos desde su archivo: './claudeCodeAdapter',
// './codexCloudAdapter'.
