import path from 'node:path';

export const config = {
  port: Number(process.env.PORT || 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  dataRoot: path.resolve(process.env.ARIEL_OS_DATA_ROOT || '.ariel-os-data'),
  apiToken: process.env.ARIEL_OS_API_TOKEN || ''
};

export function assertSafeId(value: string, label: string): string {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$/.test(value)) {
    throw new Error(label + ' is invalid.');
  }
  return value;
}

export function assertProductionConfiguration(): void {
  if (config.nodeEnv === 'production' && !config.apiToken) {
    throw new Error('ARIEL_OS_API_TOKEN is required in production.');
  }
}
