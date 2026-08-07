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

## Nivel de rigor por dominio

No todo work item justifica el mismo costo de proceso. El sistema opera en dos niveles:

- **Tier 1 — pipeline completo.** Secuencia `domain_specialist → technical_reviewer → integrator → visual_reviewer → auditor` con loop de corrección tipado (máximo 3 ciclos), skill de crítica de ingeniería en modo `proposal`/`independent_review`/`process_audit`, bitácora de agentes por work item y `emission_gate` antes de cualquier publicación externa. Hoy: `grounding-report` (P.A.T.) y `comtrade-fault-analysis`. Ambos comparten perfil de riesgo — informes técnicos de EGEHAINA con peso operativo/legal, donde una conclusión de ingeniería incorrecta tiene consecuencias reales.
- **Tier 2 — liviano.** El orquestador delega directamente en la skill del dominio (sin la cadena completa de revisores independientes ni el loop de corrección tipado de tres ciclos) y hace su propia verificación de sanidad antes de entregar. Las cinco reglas no negociables de la sección "Autoridad y responsabilidad" y "Autonomía y compuertas" de este documento siguen aplicando sin excepción — en particular, ninguna distribución externa sin la aprobación humana que corresponda — solo se omite la maquinaria de revisión por roles separados, no la disciplina de evidencia ni la compuerta de aprobación.

Un dominio nuevo entra en Tier 2 por defecto. Pasar a Tier 1 es una decisión explícita de Ariel, no algo que el orquestador infiera por su cuenta — ver `workflows/` para los dominios que ya tienen pipeline completo definido. Un dominio Tier 2 no necesariamente tiene su propio archivo en `workflows/`: si la skill de ese dominio ya cubre el procedimiento (ej. una skill de Claude Code ya operativa como `presentaciones`, `rca-causa-raiz`, `homiletica` o `course-architect`), el orquestador la usa directamente sin necesitar una definición de workflow adicional.

## Datos y repositorio

- El repositorio almacena arquitectura, instrucciones, contratos, plantillas no sensibles y pruebas controladas.
- Expedientes corporativos, evidencias de campo y entregables reales no se incorporan al repositorio por defecto.
- Cada dominio debe respetar las fuentes autorizadas y sus condiciones de uso, incluidas normas o documentos sujetos a licencia.
