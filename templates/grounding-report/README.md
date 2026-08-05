# Plantillas — Informe P.A.T. (`grounding-report`)

Activos reutilizables del workflow [`grounding-report`](../../workflows/grounding-report.yaml) y la skill [`analyze-grounding-report`](../../skills/analyze-grounding-report/SKILL.md). No son expedientes: no contienen datos de ninguna planta, cliente o campaña real — ver `docs/governance.md` sobre por qué esos datos nunca se incorporan a este repositorio.

Las reglas transversales (jerarquía de fuentes, estados de evaluación, no inventar, trazabilidad, control previo a emisión) ya están definidas en `AGENTS.md`, `docs/governance.md` y `skills/analyze-grounding-report/SKILL.md` — este README no las repite, solo documenta lo específico de estos dos archivos.

## Contenido de esta carpeta

| Archivo | Uso |
|---|---|
| `plantilla_maestra_informe_pat.docx` | Estructura vigente del informe Word: portada, descripción de trabajos, datos de campaña, método de medición (62 %/tres puntos), registro de mediciones, galería de evidencias, criterio y análisis, conclusiones, lista de cierre técnico. Úsala como base en la etapa `report_integration`, vía la skill `write-document-from-template`. |
| `matriz_control_campana_pat.xlsx` | Plantilla en blanco (celdas `[[COMPLETAR]]`) para consolidar una campaña: hoja de control (planta, alcance, fecha, personal, instrumento, criterio) y hoja de mediciones (una fila por punto). Cópiala por campaña — nunca se edita esta plantilla con datos reales de un caso. |

## Esquema de la hoja de mediciones

Una fila por punto, como mínimo:

| Campo | Uso |
|---|---|
| ID punto | Identificador único, igual en informe, fotos y notas de campo. |
| Activo / electrodo | Equipo o bajante evaluado. |
| Ubicación | Área física o referencia de planta. |
| Método | Método aplicado al punto o grupo de puntos. |
| Lectura R (Ω) | Valor de campo, con la precisión visible en el instrumento. |
| Criterio y fuente | Requisito aplicable, documento, edición y cláusula/requisito. |
| Foto de lectura / Foto ubicación-configuración | Referencia de evidencia (ver codificación abajo). |
| Estado de datos | Integridad documental: completo, pendiente de evidencia, pendiente de criterio, etc. Es una columna calculada — no editar a mano; corregir los datos de entrada que la producen. |
| Resultado preliminar | Conforme, no conforme, no concluyente o pendiente. También calculado. |
| Observaciones | Hallazgos, limitaciones y aclaraciones. |

## Codificación de evidencia fotográfica

- Código `E-01`, `E-02`, `E-03`, ... por evidencia; una lectura de tabla la referencia por código, sin insertar la foto dentro de la tabla de resultados.
- Pie de foto mínimo: código de evidencia, ID de punto, lectura visible y descripción breve.
- Cuando aplique, incluir evidencia de ubicación/configuración de ensayo además de la pantalla del instrumento.

## Nomenclatura de salida sugerida

`PAT – [PLANTA] – [AAAAMMDD] – Rev [n].docx`

Ejemplo: `PAT – Girasol – 20260716 – Rev 00.docx`

## Pendiente

Falta incorporar un ejemplo de conversión (informe histórico reformateado a esta plantilla, sin datos identificables) y una tanda de informes finales aprobados como referencia de estilo — ambos deben anonimizarse antes de subirse, siguiendo el criterio ya aplicado en `reference-cases/pvground-001-anonymized/`.
