import crypto from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as XLSX from 'xlsx';
import exifr from 'exifr';
import { config, assertSafeId } from './config.js';
import type { ArtifactRole, StoredArtifact } from './types.js';

function safeFileName(name: string): string {
  const normalized = path.basename(name).replace(/[^A-Za-z0-9._-]/g, '_');
  return normalized || 'unnamed';
}
function isImage(mime: string, name: string): boolean {
  return mime.startsWith('image/') || /\.(jpe?g|png|heic|tiff?)$/i.test(name);
}
function isSheet(name: string): boolean {
  return /\.(xlsx|xls|csv)$/i.test(name);
}
function classifyColumns(headers: string[]): Record<string, string[]> {
  return {
    resistance_candidates: headers.filter((x) => /resist|ohm|Ω/i.test(x)),
    electrode_candidates: headers.filter((x) => /electrodo|activo|punto|id/i.test(x)),
    geometry_candidates: headers.filter((x) => /geometr|varilla|malla|conductor/i.test(x)),
    distance_candidates: headers.filter((x) => /dist|separ|metros|\bm\b/i.test(x))
  };
}
function extractSpreadsheet(buffer: Buffer): Record<string, unknown> {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const sheets = workbook.SheetNames.map((name) => {
    const rows = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[name], { header: 1, defval: null, raw: false });
    const headerRow = (rows.find((row) => Array.isArray(row) && row.some((cell) => String(cell ?? '').trim())) || []) as unknown[];
    const headers = headerRow.map((cell) => String(cell ?? '').trim()).filter(Boolean);
    return { sheet_name: name, row_count: rows.length, headers, candidate_columns: classifyColumns(headers), preview_rows: rows.slice(0, 6) };
  });
  return { parser: 'xlsx', sheets, interpretation_status: 'candidates_only_requires_mapping_review' };
}
function safeIso(value: unknown): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
async function extractImage(buffer: Buffer): Promise<Record<string, unknown>> {
  try {
    const metadata = await exifr.parse(buffer, ['Orientation', 'DateTimeOriginal', 'GPSLatitude', 'GPSLongitude']);
    const orientation = typeof metadata?.Orientation === 'number' ? metadata.Orientation : null;
    return {
      parser: 'exifr',
      captured_at: safeIso(metadata?.DateTimeOriginal),
      gps: metadata?.GPSLatitude !== undefined && metadata?.GPSLongitude !== undefined ? { latitude: metadata.GPSLatitude, longitude: metadata.GPSLongitude } : null,
      exif_orientation: orientation,
      orientation_assessment: orientation === 1 ? 'metadata_upright_visual_review_still_required' : 'visual_review_required',
      visual_orientation_status: 'not_reviewed'
    };
  } catch (error) {
    return { parser: 'exifr', parse_status: 'metadata_unavailable', parse_error: (error as Error).message, visual_orientation_status: 'not_reviewed' };
  }
}
export async function ingestArtifact(input: { caseId: string; role: ArtifactRole; file: Express.Multer.File }): Promise<StoredArtifact> {
  const caseId = assertSafeId(input.caseId, 'case_id');
  const sha256 = crypto.createHash('sha256').update(input.file.buffer).digest('hex');
  const originalName = safeFileName(input.file.originalname);
  const artifactId = 'art-' + sha256.slice(0, 20);
  const directory = path.join(config.dataRoot, 'cases', caseId, 'artifacts');
  await mkdir(directory, { recursive: true });
  const storageName = sha256 + '-' + originalName;
  const absolutePath = path.join(directory, storageName);
  await writeFile(absolutePath, input.file.buffer, { flag: 'wx' }).catch((error: unknown) => {
    if ((error as { code?: string }).code !== 'EEXIST') throw error;
  });
  let extraction: Record<string, unknown> = { parser: 'none' };
  if (isSheet(originalName)) extraction = extractSpreadsheet(input.file.buffer);
  if (isImage(input.file.mimetype, originalName)) extraction = await extractImage(input.file.buffer);
  return {
    artifact_id: artifactId, case_id: caseId, file_name: originalName, mime_type: input.file.mimetype || 'application/octet-stream',
    size_bytes: input.file.size, sha256, storage_path: path.join('cases', caseId, 'artifacts', storageName),
    uploaded_at: new Date().toISOString(), role: input.role, extraction
  };
}
