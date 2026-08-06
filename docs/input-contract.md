# Contrato de entrada de trabajo

**Estado:** Draft  
**Alcance:** Contrato universal para cualquier trabajo gestionado por el orquestador.

## Decisiones acordadas

1. El usuario entrega un expediente de entrada; el orquestador crea un work item ejecutable.
2. Todo expediente declara objetivo, alcance, entregables, Definition of Done, restricciones e inventario de entradas.
3. Los detalles técnicos pertenecen al anexo del dominio dentro del expediente. No se mezclan campos de todos los dominios en una sola plantilla universal.
4. El workflow y las skills describen el método. El usuario puede sugerir un workflow, pero el orquestador confirma o justifica su selección.
5. La Definition of Done usa criterios verificables y define cuándo el trabajo puede cerrarse.
6. El expediente puede entrar incompleto. El orquestador debe clasificarlo sin completar información crítica por invención.
7. Toda modificación posterior crea una nueva revisión del caso. Los expedientes y entregables anteriores no se sobrescriben silenciosamente.
8. Cada work item se vincula a una revisión concreta y debe declarar el trabajo preservado, modificado o invalidado.

## Modelo

```text
Expediente de entrada
  → clasificación e inventario
  → work item de una revisión
  → workflow y skills
  → validación contra Definition of Done
  → entrega, aclaración o reporte de bloqueo
```

## Estructura universal

- Solicitud: objetivo, solicitante y contexto.
- Alcance: lo incluido y excluido.
- Dominio: nombre del tipo de trabajo y solicitud técnica específica.
- Entregables.
- Definition of Done.
- Restricciones y aprobaciones.
- Inventario de documentos, datos y fuentes.
- Decisiones pendientes.
- Sugerencia opcional de workflow.
- Estado del ciclo de vida y revisión.

## Compuertas de preparación

Un expediente no requiere todos los documentos para ser útil. Debe diferenciarse entre estar listo para ejecutar un workflow y estar listo para emitir un entregable externo.

| Estado | Significado |
|---|---|
| `draft` | Solicitud registrada, pero falta uno o más requisitos duros para crear un work item ejecutable. |
| `ready` | El work item está definido y la evidencia disponible es suficiente para la fase de trabajo solicitada. |
| `ready_for_emission` | El resultado también tiene evidencia, validaciones y aprobaciones suficientes para emitirlo externamente. |
| `no_emit` | El trabajo puede conservar borradores y análisis, pero no puede distribuirse externamente hasta resolver un bloqueo crítico. |

### Requisitos duros para `ready`

1. Identidad de caso y revisión.
2. Objetivo claro.
3. Dominio o tipo de trabajo identificable.
4. Alcance mínimo: lo incluido y, cuando sea relevante, lo excluido.
5. Definition of Done con al menos un criterio verificable.
6. Inventario de entradas: cada archivo o fuente se declara disponible, faltante, ilegible o sustituido.
7. Restricciones operativas y de aprobación. Si faltan, el sistema aplica postura restrictiva: análisis interno sin acciones o distribución externa.
8. Workflow seleccionado por el orquestador, con la skill o expertise correspondiente.

Si falta uno de estos elementos, el expediente permanece en `draft`, pasa a `needs_clarification` o se bloquea. No se inicia el análisis técnico como si estuviera definido.

### Suficiencia de evidencia

La evidencia requerida depende de la fase y del dominio:

- Para análisis de brechas: basta con objetivo, dominio e inventario de entradas.
- Para análisis técnico: se exige la evidencia mínima declarada por la skill del dominio.
- Para emisión externa: se exige Definition of Done completa, revisión, trazabilidad y aprobaciones requeridas.

Por tanto, `ready` nunca equivale por sí solo a “puede emitirse”.

## Revisión

Una revisión es una fotografía inmutable del expediente en un momento dado. Una nueva foto, una matriz corregida, un cambio de alcance o una nueva fuente normativa relevante crea una revisión sucesora. El orquestador evalúa el impacto y selecciona patch, partial rework, full rework o user clarification según el modelo operativo.

## Anexo técnico por dominio: informes P.A.T.

Para el workflow `grounding-report`, el inventario de entradas (punto 6 de las compuertas de preparación) no acepta una hoja de cálculo suelta como evidencia suficiente. La identidad del expediente y la matriz de mediciones viven en una página estructurada del almacén de datos de campaña (capacidad `structured_campaign_store`, `registry/tools.yaml`) — ver `skills/validate-campaign-input/SKILL.md` y `CLAUDE.md` para el binding concreto en el arnés activo. Un `.xlsx` recibido de un cliente o colega se migra a esa página antes de que el expediente pueda pasar de `draft`/`needs_clarification` a `ready`; el archivo original se conserva como referencia, no como fuente activa.

## Pendiente de definir

- Convención de identificadores de caso, revisión y work item.
- Formato del anexo técnico por dominio para dominios distintos de P.A.T. (ej. COMTRADE).
- Evidencia mínima por fase para cada skill.
- Nivel de detalle del manifest de evidencias: hash, fechas, autor y relaciones entre archivos.
