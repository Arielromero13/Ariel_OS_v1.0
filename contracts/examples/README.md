# Ejemplos ficticios de contratos

Un caso ficticio único y coherente que atraviesa los 7 contratos, para validar que cada schema acepta una estructura real de extremo a extremo — no 7 fragmentos sueltos.

**Caso de referencia:** `CASE-PAT-FICT-001`, revisión `REV-01` — verificación P.A.T. de una subestación ficticia ("Planta Ficticia Norte"), workflow `grounding-report`.

| Archivo | Contrato | Rol en la cadena |
|---|---|---|
| `work-item.example.json` | work-item | Expediente inicial que arma el orquestador |
| `handoff.example.json` | handoff | Entrega de domain_specialist a technical_reviewer tras el análisis técnico |
| `evidence.example.json` | evidence | Evidencia fotográfica del punto P-01 |
| `finding.example.json` | finding | Hallazgo de resistencia de puesta a tierra conforme en P-01 |
| `review.example.json` | review | Revisión técnica que aprueba el hallazgo |
| `audit-decision.example.json` | audit-decision | Auditoría que aprueba el paquete para aprobación humana |
| `report-manifest.example.json` | report-manifest | Manifiesto del paquete de entrega candidato |

Los identificadores (`FND-FICT-001`, `EVD-FICT-001`, `ART-MATRIX-001`, etc.) se referencian entre archivos a propósito, para que se pueda seguir la trazabilidad completa medición → evidencia → hallazgo → revisión → auditoría → manifiesto, tal como la exige `docs/governance.md`.

Todos los archivos fueron validados contra su schema real (`contracts/*.schema.json`) con `jsonschema` (Draft 2020-12) antes de subirlos — los 7 pasan sin errores.

No usan datos de ninguna planta, cliente o expediente real — todos los valores, nombres y ubicaciones (`fictional://...`) son inventados para esta prueba.
