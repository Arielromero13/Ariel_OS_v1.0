# Gobernanza

## Autoridad y responsabilidad

- El usuario o responsable humano define el mandato, aprueba cambios de alcance y autoriza emisiones externas.
- El orquestador controla secuencia, delegación, corrección y escalamiento; no sustituye la aprobación humana.
- Los especialistas proponen resultados dentro de evidencia y alcance.
- Revisor, revisor visual y auditor actúan como controles de calidad; sus decisiones deben quedar registradas.
- Las decisiones sensibles no se autoaprueban por el mismo contexto que redactó el entregable.

## Evidencia y fuentes

1. La evidencia de la revisión actual es la fuente principal de hechos.
2. Plantillas gobiernan estructura y presentación, no hechos técnicos.
3. Históricos aprobados orientan estilo y contexto; no se copian como hechos actuales.
4. Las fuentes normativas o especificaciones deben indicar edición, requisito o cláusula y aplicabilidad.
5. Cuando haya contradicción, se registra y se escala; no se elige silenciosamente la fuente conveniente.

## Integridad del expediente

- Cada work item está ligado a un caso y una revisión.
- Las revisiones son inmutables: evidencia o alcance nuevo crea una revisión sucesora.
- El sistema debe registrar artefactos preservados, modificados o invalidados.
- No se inventan valores, fechas, fuentes, criterios, configuraciones, lecturas ni resultados.
- Datos faltantes, ilegibles o ambiguos se marcan explícitamente.

## Autonomía y compuertas

- El sistema puede organizar, analizar y preparar borradores dentro del alcance autorizado.
- Acciones externas, distribución, cambios irreversibles o uso de datos sensibles requieren la aprobación definida en el work item.
- Ante restricciones desconocidas, aplica la postura más restrictiva: análisis interno, sin distribución externa.
- La emisión externa exige Definition of Done, revisión técnica, QA visual, auditoría y aprobación humana cuando corresponda.
- El estado `no_emit` conserva el trabajo interno, pero prohíbe distribución hasta resolver el bloqueo.

## Corrección y escalamiento

- Un work item tiene un máximo de tres ciclos internos de corrección.
- Se usa patch, partial rework, full rework o user clarification según impacto.
- Un desacuerdo entre revisor, orquestador y auditor se escala.
- Al agotarse los ciclos, se emite un reporte de bloqueo con evidencia disponible, pendientes y siguiente acción recomendada.

## Datos y repositorio

- El repositorio almacena arquitectura, instrucciones, contratos, plantillas no sensibles y pruebas controladas.
- Expedientes corporativos, evidencias de campo y entregables reales no se incorporan al repositorio por defecto.
- Cada dominio debe respetar las fuentes autorizadas y sus condiciones de uso, incluidas normas o documentos sujetos a licencia.
