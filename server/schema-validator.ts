import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import type { ValidationResult } from './types.js';

const schemaPaths: Record<string, string> = {
  finding: 'finding.schema.json',
  review: 'review-record.schema.json',
  handoff: 'handoff.schema.json',
  audit_decision: 'audit-decision.schema.json',
  evidence: 'evidence.schema.json',
  report_manifest: 'report-manifest.schema.json'
};
let validatorPromise: Promise<Ajv2020> | undefined;

async function getAjv(): Promise<Ajv2020> {
  if (!validatorPromise) validatorPromise = (async () => {
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    for (const filename of Object.values(schemaPaths)) {
      const raw = await readFile(path.resolve(process.cwd(), 'contracts', filename), 'utf8');
      ajv.addSchema(JSON.parse(raw));
    }
    return ajv;
  })();
  return validatorPromise;
}

export async function validateRecord(recordType: string, record: unknown): Promise<ValidationResult> {
  const filename = schemaPaths[recordType];
  if (!filename) return { valid: false, errors: ['Unsupported record type: ' + recordType] };
  const ajv = await getAjv();
  const schema = ajv.getSchema(path.resolve(process.cwd(), 'contracts', filename));
  if (!schema) {
    const all = Object.values((ajv as unknown as { schemas: Record<string, unknown> }).schemas);
    const candidate = all.find((item) => JSON.stringify(item).includes(filename));
    if (!candidate) return { valid: false, errors: ['Schema not available: ' + filename] };
  }
  const validate = Array.from(Object.values((ajv as unknown as { schemas: Record<string, (value: unknown) => boolean> }).schemas)).find((fn) => typeof fn === 'function' && String(fn).includes('validate')) || schema;
  if (!validate) return { valid: false, errors: ['Schema compiler failed: ' + filename] };
  const valid = schema ? schema(record) : false;
  return { valid: Boolean(valid), errors: schema?.errors?.map((error) => (error.instancePath || '/') + ' ' + error.message) || [] };
}
