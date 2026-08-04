---
name: analyze-grounding-report
description: Prepara, revisa y controla informes de verificación de sistemas de puesta a tierra (P.A.T.) a partir de una matriz de campaña, fotografías, registros, planos y referencias aprobadas. Úsala para consolidar mediciones, verificar trazabilidad, analizar resultados con criterios técnicos verificables y preparar un informe Word para aprobación humana.
version: 0.2.0
status: draft
---

# Informe de verificación P.A.T.

## Propósito

Preparar informes técnicamente trazables, claros y consistentes para plantas de EGE Haina. La evidencia de campo de la revisión actual es la fuente principal; el Word es un entregable sujeto a revisión, no una fuente de hechos.

Esta skill opera sobre un work item y una revisión concreta definidos por el contrato de entrada.

## Composición con skills transversales

Esta skill interpreta el dominio P.A.T. y coordina resultados técnicos; no sustituye las responsabilidades transversales siguientes:

- `validate-spreadsheet-input`: verifica la matriz sin juzgar aceptación técnica.
- `manage-photo-evidence-gallery`: controla orientación, orden y vínculo foto–evidencia, sin inferir lecturas.
- `validate-technical-traceability`: verifica medición → evidencia → finding → criterio → recomendación.
- `research-normative-criterion`: verifica fuente, edición, cláusula y aplicabilidad de criterios.
- `write-document-from-template`: integra solo contenido aprobado en el Word.
- `render-and-review-document`: verifica la presentación visual del documento renderizado.

Los roles conservan la responsabilidad de decisión: el especialista analiza, el revisor técnico valida, el integrador ensambla, el revisor visual aprueba lo visual y el auditor evalúa si la decisión es razonable.

## Expediente de entrada

El anexo técnico del dominio debe identificar, cuando aplique:

- Planta, fecha, alcance, responsable, instrumento y criterio técnico aplicable.
- Matriz o tabla de mediciones.
- Fotografías de las mediciones.
- Registros y notas de campo.
- Plantilla maestra vigente.
- Informes históricos aprobados.
- Fuentes normativas o especificaciones de diseño disponibles.

La matriz debe consolidar por punto: ID, activo o electrodo, resistencia en Ω, referencia de evidencia fotográfica, observación y estado de evaluación.

## Jerarquía de fuentes

1. La evidencia de campo de la campaña y revisión actuales: matriz, fotos, registros y notas.
2. La plantilla maestra vigente: estructura y presentación.
3. Informes históricos aprobados: formato, activos conocidos, nivel de detalle y criterios previamente documentados; nunca hechos actuales sin confirmación.
4. Fuentes normativas o especificaciones verificables: criterio de aceptación, edición y aplicabilidad.

Si hay contradicción, prevalece la evidencia actual. Registra la discrepancia y solicita confirmación antes de una conclusión.

## Flujo

1. Identificar planta, campaña, revisión, alcance y entradas disponibles.
2. Clasificar el expediente como `draft`, `ready`, `needs_clarification` o `blocked`, según el contrato universal.
3. Inventariar y consolidar la matriz de mediciones.
4. Verificar trazabilidad: cada lectura debe corresponder con una evidencia identificada o un registro de campo.
5. Marcar como pendiente toda lectura ilegible, foto borrosa, punto sin ID o configuración de ensayo no verificable.
6. Redactar la descripción de trabajos según planta y alcance.
7. Mantener la explicación del método 62 % / tres puntos, conexiones y figuras en la metodología; no repetirla en la tabla de resultados.
8. Preparar una tabla de resultados limpia: ID, activo/electrodo, R (Ω), foto fuente, estado de evaluación y observación.
9. Ubicar fotografías exclusivamente en la galería de evidencias y conservar las referencias E-01, E-02, etc.
10. Analizar sólo contra criterios técnicos explícitos, verificables y aplicables.
11. Redactar conclusiones separadas: resultado de la verificación, estado general del sistema y recomendaciones.
12. Ejecutar QA técnico y visual del documento renderizado: portada, encabezados, alcance, puntos, tabla, fotos, análisis, conclusiones y referencias.

## Estados de evaluación

Usar exclusivamente:

- Conforme.
- No conforme.
- No concluyente.
- Pendiente.

El estado sólo se asigna contra un criterio técnico explícito y aplicable, documentado en el informe.

## Criterios, normas y análisis

- No atribuyas límites genéricos a IEC, IEEE, ANSI, NFPA u otra norma.
- Para cada criterio usado, documenta fuente, edición, cláusula o requisito, valor aplicable y justificación de aplicabilidad al activo y método evaluados.
- Si falta la fuente, cláusula o aplicabilidad, reporta el valor medido y deja el criterio pendiente de validación; no califiques la conformidad.
- Distingue resultado de resistencia medido, condición visual, validez del método y criterio de aceptación. Son afirmaciones diferentes.
- No declares una medición concluyente si su configuración, geometría o condiciones de ensayo no están suficientemente sustentadas.

## Lecturas cerca del límite y comparación de tendencia

No trates el criterio numérico como un corte binario limpio. Una lectura que excede el límite por un margen pequeño no se declara automáticamente `No conforme`, y una lectura muy por debajo del límite no necesita comentario adicional — pero una lectura cercana al límite, en cualquiera de los dos sentidos, sí merece criterio explícito:

- Si la lectura excede el criterio por un margen reducido (orientativamente, dentro de un 10–15 % por encima del límite) y no hay otra señal de falla (observación de campo, contradicción, patrón atípico frente al resto de la campaña), clasifica el punto como `No concluyente`, no `No conforme`, con una recomendación explícita de repetir la medición o verificar el punto de contacto en la siguiente intervención.
- Cuando exista una lectura histórica aprobada del mismo punto (de una campaña previa), compara la tendencia. Si la lectura actual es mayor que la histórica — incluso si ambas siguen dentro del criterio — señala la tendencia al alza como hallazgo y recomienda revisar la conexión del punto con la malla. Una tendencia ascendente es una señal de alerta independiente del margen respecto al umbral absoluto de una sola lectura.
- Si no existe lectura histórica del punto (primera campaña registrada), documenta el valor como línea base explícita para la comparación de la próxima campaña, en vez de simplemente marcarlo conforme sin más.
- Un valor muy por encima del criterio (varias veces el límite, o con una observación de campo que señale falla) sí se trata como hallazgo de mayor severidad desde la primera lectura — la tolerancia de margen aplica a excesos pequeños, no sustituye el juicio técnico ante una desviación grande.

## Matrices con fotos insertadas en la celda (rich value)

Algunas matrices de Excel insertan las fotos directamente en la celda con la función moderna de Excel ("Insertar imagen en la celda" / rich value), en vez de como texto de referencia o imagen flotante. Herramientas de lectura basadas en `openpyxl` no interpretan este formato y muestran `#VALUE!` en la celda — eso no significa que la foto falte. Antes de declarar una columna sin evidencia por este motivo, verifica si la celda usa rich value: revisa `xl/richData/` y `xl/metadata.xml` dentro del paquete del archivo (`.xlsx` es un zip), rastrea el atributo `vm` de la celda hasta la imagen en `xl/media/`, y extrae la imagen para confirmar visualmente antes de concluir que la trazabilidad está rota.

## QA visual de evidencias y maquetación

La galería fotográfica debe pasar una revisión visual independiente después de integrar y renderizar el Word/PDF. No basta con validar los nombres de archivo o el orden de las etiquetas.

Verificar para cada evidencia:

- La foto correcta está vinculada al ID y lectura correctos de la matriz.
- La orientación es visualmente correcta para lectura humana; corregir giros de 90°, 180° o 270° cuando sean necesarios. No confiar sólo en metadatos EXIF.
- El orden de presentación sigue la secuencia de evidencias o la secuencia declarada en la tabla.
- Pie de foto, ID, activo y lectura no se asignan a una fotografía distinta.
- La imagen es legible, no está recortada de forma que oculte la lectura o conexión relevante, y no aparece duplicada sin justificación.
- El documento renderizado no muestra fotografías rotadas, pies separados de su imagen, imágenes desbordadas, cortes de página que rompan la evidencia ni páginas visualmente incoherentes.

Cualquier incumplimiento obliga a `patch` o `partial rework` de la galería y deja el entregable en `NO EMITIR` hasta que el revisor visual lo apruebe.

## Reglas de calidad

- No inventar valores, fechas, puntos, criterios, configuración de ensayo ni resultados.
- No mezclar plantas, campañas o fechas distintas.
- Conservar la precisión decimal visible en el instrumento o registro de campo.
- Señalar información faltante, discrepancias y limitaciones de validez.
- Marcar `NO EMITIR` cualquier borrador con inconsistencias críticas pendientes.
- Mantener español técnico neutro, directo y orientado a decisiones.
- Preservar secciones válidas en una corrección, de acuerdo con el modelo operativo.

## Entregables

1. Matriz de control validada.
2. Borrador de informe Word basado en la plantilla maestra.
3. Galería de evidencias con referencias cruzadas.
4. Análisis técnico y normativo trazable.
5. Lista breve de datos pendientes, discrepancias, limitaciones y decisiones requeridas antes de emisión.

## Uso del histórico aprobado

Los informes finales aprobados son referencias históricas validadas. Úsalos para orientar estructura, redacción, presentación, criterios documentados y recomendaciones. Prioriza misma planta, luego activos, tecnología o alcance similares.

No copies valores, fechas, alcance, hallazgos, fotos, conclusiones, criterios ni recomendaciones de otra campaña sin evidencia actual. Distingue siempre entre referencia histórica aprobada y dato de la campaña actual.
