---
id: render-and-review-document
name: Renderizado y revisión visual documental
kind: transversal
status: draft
version: 0.1.0
---

# Propósito

Renderizar el documento y comprobar que su presentación visual permite una lectura correcta y conserva la relación entre texto, tablas y evidencias.

# Entradas

- Borrador Word identificado.
- Lista de artefactos o report manifest.
- Reglas visuales del workflow.

# Procedimiento

1. Renderizar una copia derivada en PDF y, si hace falta, en imágenes de página.
2. Revisar paginación, cortes, encabezados, tablas, numeración y legibilidad.
3. Revisar la galería: orden, orientación visible, foto, ID, lectura y pie de foto.
4. Registrar cada defecto visual y su gravedad.
5. Emitir QA visual aprobado, solicitud de patch o partial rework.

# Salidas

- Documento renderizado.
- Registro de QA visual.
- Solicitud de corrección visual cuando corresponda.

# Límites

- No valida la ingeniería ni aprueba findings técnicos.
- No cambia el Word sin una corrección trazable.
- No permite emisión si una evidencia relevante está mal orientada, ilegible o mal vinculada.
