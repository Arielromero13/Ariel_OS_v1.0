---
id: write-document-from-template
name: Ensamblaje de documento desde plantilla
kind: transversal
status: draft
version: 0.1.0
---

# Propósito

Integrar contenido ya aprobado en una plantilla, preservando estructura, estilo y referencias del documento.

# Entradas

- Plantilla maestra identificada.
- Hallazgos, tablas, textos y evidencias aprobados.
- Referencias de artefactos y reglas de formato del workflow.

Para el workflow `grounding-report`, la implementación de referencia ya resuelta es [`templates/grounding-report/generate_report.js`](../../templates/grounding-report/generate_report.js) — portada con logo, encabezado/pie, TOC nativo y figuras estándar calcados de un informe aprobado. Usarla en vez de reconstruir el formato a mano; ver el README de esa carpeta para el detalle y para el paso obligatorio de normalizar fotos antes de insertarlas (JPEG progresivo se renderiza mal en Word).

# Procedimiento

1. Registrar versión de la plantilla y contenido aprobado recibido.
2. Insertar cada componente en la sección correspondiente.
3. Mantener referencias cruzadas entre matriz, galería, análisis y conclusiones.
4. Generar borrador Word y registro de integración.
5. Entregar el borrador para renderizado y QA visual.

# Salidas

- Borrador Word.
- Registro de integración.
- Referencias de artefactos incorporados.

# Límites

- Solo lo invoca el integrador.
- No altera datos, hallazgos, estados ni conclusiones aprobadas.
- No sustituye revisión técnica, visual, auditoría ni aprobación humana.
