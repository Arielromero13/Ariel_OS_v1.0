---
id: generate-pptx-deck
name: Ensamblaje de presentación técnica desde plantilla
kind: transversal
status: draft
version: 0.1.0
---

# Propósito

Construir un borrador de presentación PowerPoint a partir de una plantilla y de
contenido ya aprobado. Esta skill sirve a informes ejecutivos, diagnósticos
técnicos y presentaciones de ingeniería; no interpreta ni crea resultados.

# Entradas

- Plantilla PPTX identificada y autorizada.
- Contenido técnico aprobado: hallazgos, tablas, gráficos, fotos y referencias.
- Definition of Done y reglas visuales del workflow.
- Referencias trazables de cada artefacto usado.

# Procedimiento

1. Registrar plantilla, versión y artefactos fuente.
2. Diseñar la estructura de diapositivas sin alterar el mandato ni los hallazgos.
3. Insertar únicamente contenido aprobado y conservar sus referencias.
4. Renderizar la presentación para revisión visual.
5. Entregar un registro de integración y el borrador para QA visual.

# Salidas

- Borrador PPTX.
- Presentación renderizada.
- Registro de integración y referencias de artefactos.

# Límites

- No calcula, interpreta ni aprueba resultados técnicos.
- No usa datos ficticios para llenar diapositivas de un caso real.
- No inventa gráficos, tendencias, fotos o fuentes.
- No distribuye externamente ni sustituye revisión visual, auditoría o aprobación humana.
