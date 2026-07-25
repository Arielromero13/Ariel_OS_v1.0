import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import type { ValidateFunction } from 'ajv';
import type { ValidationResult } from './types.js';

const schemaPaths: Record<string, string> = {
  finding: 'finding.schema.json',
  review: 'review-record.schema.json',
  handoff: 'handoff.schema.json',
  audit_decision: 'audit-decision.schema.json',
  evidence: 'evidence.schema.json',
  report_manifest: 'report-manifest.schema.json'
};
let validatorsPromise: Promise<Map<string, ValidateFunction>> | undefined;

async function getValidators(): Promise<Map<string, ValidateFunction>> {
  if (!validatorsPromise) validatorsPromise = (async () => {
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    const validators = new Map<string, ValidateFunction>();
    for (const [recordType, filename] of Object.entries(schemaPaths)) {
      const raw = await readFile(path.resolve(process.cwd(), 'contracts', filename), 'utf8');
      validators.set(recordType, ajv.compile(JSON.parse(raw)));
    }
    return validators;
  })();
  return validatorsPromise;
}

export async function validateRecord(recordType: string, record: unknown): Promise<ValidationResult> {
  const validate = (await getValidators()).get(recordType);
  if (!validate) return { valid: false, errors: ['Unsupported record type: ' + recordType] };
  const valid = validate(record);
  return { valid, errors: validate.errors?.map((error) => (error.instancePath || '/') + ' ' + (error.message || 'schema error')) || [] };
}
