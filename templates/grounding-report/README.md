# Plantillas — Informe P.A.T. (`grounding-report`)

Activos reutilizables del workflow [`grounding-report`](../../workflows/grounding-report.yaml) y la skill [`analyze-grounding-report`](../../skills/analyze-grounding-report/SKILL.md). No son expedientes: no contienen datos de ninguna planta, cliente o campaña real — ver `docs/governance.md` sobre por qué esos datos nunca se incorporan a este repositorio.

Las reglas transversales (jerarquía de fuentes, estados de evaluación, no inventar, trazabilidad, control previo a emisión) ya están definidas en `AGENTS.md`, `docs/governance.md` y `skills/analyze-grounding-report/SKILL.md` — este README no las repite, solo documenta lo específico de estos dos archivos.

## Contenido de esta carpeta

| Archivo | Uso |
|---|---|
| `plantilla_maestra_informe_pat.docx` | Estructura de referencia original (portada, secciones, tabla de resultados) tal como la entregó Ariel. No tiene encabezado/pie ni logo de portada — eso se resolvió aparte, ver `generate_report.js` abajo. |
| `matriz_control_campana_pat.xlsx` | Plantilla en blanco (celdas `[[COMPLETAR]]`) para consolidar una campaña: hoja de control (planta, alcance, fecha, personal, instrumento, criterio) y hoja de mediciones (una fila por punto). Cópiala por campaña — nunca se edita esta plantilla con datos reales de un caso. |
| `generate_report.js` | **Generador de referencia** del `.docx` final — portada con logo, encabezado/pie calcados campo a campo del XML de `Informe_PAT_Girasol_Rev03` (la referencia aprobada por Ariel), TOC nativo de Word, figuras estándar de las secciones 1 y 3, colores de tabla NAVY/LIGHT_BLUE. Ver detalle abajo. |
| `assets/` | Las 4 imágenes genéricas y reutilizables que usa `generate_report.js`: logo EGE Haina (versión portada y versión encabezado) y las dos figuras fijas de método/instrumento (secciones 1 y 3). Ninguna tiene datos de una planta o campaña real. |
| `scripts/normalize_photos.py` | Reconvierte fotos a JPEG baseline antes de insertarlas — ver "Fotos de teléfono" abajo. Paso obligatorio, no opcional. |

## `generate_report.js` — por qué existe

La primera vez que se armó un informe (caso de prueba SIBA Energy) hubo que reconstruir a mano, mirando el XML de `Informe_PAT_Girasol_Rev03`, el encabezado de 2 filas con logo, los colores de las tablas, la separación de portada/TOC sin encabezado, el campo de TOC nativo y las figuras fijas de las secciones 1 y 3 — varias iteraciones, varios detalles que se pasaron por alto la primera vez. Ese trabajo ya está resuelto acá: **no se debe repetir a mano con la próxima planta o parque.**

Quien arme un informe nuevo arma un objeto de datos (planta, código de documento, datos de campaña, puntos con su foto y lectura, conclusiones) y llama:

```
node generate_report.js datos-del-caso.json salida.docx
```

El JSON de datos de un caso real (nombres de planta, mediciones, rutas a fotos) **nunca se commitea a este repositorio** — vive fuera del repo, local a la sesión del caso, igual que las fotos y la matriz de origen (`AGENTS.md` / `docs/governance.md`). Lo que sí vive acá es el generador y los 4 assets genéricos.

### Fotos de teléfono: JPEG progresivo

Fotos de teléfono (o extraídas como *rich value* de una celda de Excel) suelen venir en JPEG progresivo, que Word renderiza mal — la foto aparece de lado o distorsionada sin que el archivo tenga ningún problema real. `generate_report.js` **rechaza con error** cualquier imagen progresiva en vez de generar un documento con fotos rotas en silencio; correr `scripts/normalize_photos.py <entrada> <salida>` sobre la carpeta de fotos antes de generar el informe.

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

- `generate_report.js` valida el `.docx` contra el esquema XSD (`office/validate.py` de la skill `docx`), pero no se pudo verificar el render visual en este entorno (LibreOffice headless no convierte a PDF en este sandbox, ni siquiera un archivo trivial). Revisar visualmente el primer informe que salga de cada sesión nueva antes de asumir que el renderer no introdujo nada raro.
- Falta incorporar un ejemplo de conversión (informe histórico reformateado a esta plantilla, sin datos identificables) y una tanda de informes finales aprobados como referencia de estilo — ambos deben anonimizarse antes de subirse, siguiendo el criterio ya aplicado en `reference-cases/pvground-001-anonymized/`.
