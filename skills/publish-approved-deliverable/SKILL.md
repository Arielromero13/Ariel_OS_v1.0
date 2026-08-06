---
id: publish-approved-deliverable
name: Publicación de entregable aprobado
kind: transversal
status: draft
version: 0.1.0
---

# Propósito

Publicar el documento final ya aprobado (auditor + aprobación humana registrada) en el almacén externo de entregables (capacidad `external_deliverable_store` de `registry/tools.yaml`; en el arnés Claude Code, Google Drive — ver `CLAUDE.md` para el binding concreto y la convención de carpetas), y actualizar el registro de la campaña con la referencia resultante.

Esta skill actúa **después** de la compuerta de emisión (`emission_gate` en `workflows/grounding-report.yaml`), nunca antes. `write-document-from-template` produce el borrador; esta skill distribuye el entregable ya emitible, no un borrador en revisión.

# Entradas

- Documento final (`.docx`, y su render `.pdf` si existe) que ya satisface `emission_gate`.
- Identidad de planta y campaña, para resolver la carpeta de destino.
- Página de campaña asociada en el almacén de datos de campaña.
- Confirmación de que las tres condiciones de emisión de `CLAUDE.md` sección 5 están satisfechas: aprobación del auditor, trazabilidad intacta, aprobación humana registrada.

# Procedimiento

1. Verificar antes de publicar que `emission_gate` está satisfecho — esta skill no re-evalúa esas condiciones, pero se niega a ejecutar si no se le confirman explícitamente.
2. Resolver la carpeta de destino según la convención `EGEHAINA — Contextos de Planta/[Planta]/Informes P.A.T./`; crearla si la planta todavía no tiene subcarpeta de informes.
3. Subir el documento final con un nombre trazable (`PAT – [PLANTA] – [AAAAMMDD] – Rev [n].docx`, ver `templates/grounding-report/README.md`).
4. Actualizar en la página de campaña: `Documento final` (enlace al archivo publicado), `Carpeta Drive` (si no estaba ya vinculada) y `Estado del expediente` → `emitido`.
5. Invocar `sync-agent-log` para dejar la fila de cierre con Decisión `aprobado` y el enlace al entregable publicado.

# Salidas

- Referencia del archivo publicado (enlace compartible).
- Página de campaña actualizada con el estado final.
- Entrada de bitácora de cierre (vía `sync-agent-log`).

# Límites

- Solo publica lo que ya pasó `emission_gate`; no publica borradores, versiones parciales ni resultados de un ciclo rechazado.
- No modifica el contenido del documento — si algo hay que corregir, eso ocurre antes, en `report_integration` o en el loop de corrección.
- No decide por sí sola que algo puede emitirse — ejecuta la publicación una vez que el orquestador y el auditor ya lo decidieron.
- Datos reales de planta/cliente en el archivo publicado y en la página de campaña actualizada viven en Drive/Notion, nunca en el repositorio (`docs/governance.md`).
