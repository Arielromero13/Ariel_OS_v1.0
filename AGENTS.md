# AGENTS.md — Instrucciones globales de Ariel Agent OS

## Propósito

Este repositorio contiene un sistema portable de agentes para trabajos técnicos trazables. El repositorio es la fuente de verdad para arquitectura, roles, skills, workflows, contratos y políticas; el arnés de ejecución puede ser Codex, Claude Code u otro adaptador compatible.

El piloto actual es la preparación y revisión de informes de verificación de sistemas de puesta a tierra (P.A.T.). El sistema debe poder ampliarse a otros dominios sin duplicar reglas transversales.

## Antes de actuar

1. Identificar el `work item`, el caso y la revisión aplicables.
2. Leer el workflow seleccionado en `workflows/`.
3. Consultar los contratos referenciados en `contracts/`.
4. Activar únicamente los roles declarados en `registry/agents.yaml`.
5. Usar únicamente skills declaradas en `registry/skills.yaml` y herramientas autorizadas en `registry/tools.yaml`.
6. Respetar las restricciones, la Definition of Done y el estado del expediente.

Si falta un requisito duro del expediente, no asumirlo: registrar la brecha y solicitar aclaración o bloquear la fase afectada.

## Fuentes de verdad

- `docs/`: visión, gobernanza, arquitectura, glosario y modelo operativo.
- `contracts/`: estructuras obligatorias de work item, evidencia, finding, handoff, review, auditoría y paquete de entrega.
- `registry/`: catálogos de roles, skills, herramientas y workflows.
- `agents/`: instrucciones y límites de cada rol.
- `skills/`: procedimientos de dominio y capacidades reutilizables.
- `workflows/`: secuencia de etapas, compuertas y criterios de emisión.
- `adapters/`: enlace específico entre este sistema y cada arnés de ejecución.

Ante discrepancia, prevalecen las instrucciones del usuario, luego los contratos y workflow aplicables, y después las instrucciones particulares de roles y skills.

## Almacenamiento externo de datos de campaña, entregables y bitácora

Los datos reales de un caso (matriz de campaña, fotos, entregables finales) y el registro de trazabilidad de cada work item no viven en el repositorio ni dependen de que la sesión activa permanezca abierta. `registry/tools.yaml` declara tres capacidades abstractas para esto: `structured_campaign_store` (datos de campaña), `external_deliverable_store` (entregables publicados) y `traceability_log_store` (bitácora de agentes). El binding concreto de cada capacidad a una implementación real es responsabilidad del arnés activo, no de este archivo — para Claude Code, ver `CLAUDE.md`.

## Reglas no negociables

- No inventar valores, fechas, evidencia, criterios, configuraciones, fuentes normativas ni conclusiones.
- No mezclar datos entre casos, plantas, campañas o revisiones.
- Conservar la trazabilidad desde la evidencia hasta el finding, criterio, recomendación y entregable.
- Tratar los informes históricos como referencia, no como evidencia actual.
- No atribuir un límite a IEC, IEEE, ANSI, NFPA u otra fuente sin documento, edición, cláusula o requisito y aplicabilidad verificables.
- No emitir externamente sin que el workflow lo permita y sin aprobación humana registrada.
- Mantener `NO EMITIR` cuando existan inconsistencias críticas, evidencia insuficiente o decisiones abiertas que afecten la validez del entregable.
- No guardar secretos, credenciales, información corporativa sensible ni expedientes reales en el repositorio salvo autorización explícita.

## Modelo de ejecución

El orquestador interpreta la solicitud y crea o valida el work item. Los roles se activan de forma secuencial o paralela según el workflow. Cada transición entre roles debe usar un handoff válido y enlazar artefactos, limitaciones, decisiones abiertas y elementos que deben preservarse.

Los roles conservan responsabilidades separadas:

- El especialista de dominio analiza.
- El investigador normativo verifica fuentes y aplicabilidad.
- El revisor técnico valida el contenido técnico.
- El integrador ensambla contenido aprobado.
- El revisor visual valida la presentación renderizada.
- El orquestador valida intención y Definition of Done.
- El auditor evalúa si aprobar, bloquear o escalar es razonable.

Las skills transforman, verifican o recuperan información; no sustituyen la autoridad de decisión de un rol.

## Correcciones y bloqueo

Cada work item permite hasta tres ciclos internos de corrección. La ejecución inicial no consume un ciclo. Una aclaración del usuario pausa el conteo. Nueva evidencia material genera una nueva revisión con su propio presupuesto de corrección.

Usar el tipo mínimo necesario:

- `patch`: corrección local.
- `partial_rework`: rehacer una sección y dependencias directas.
- `full_rework`: rehacer la base solo cuando una premisa la invalida.
- `user_clarification`: falta información crítica o existe desacuerdo.

Preservar todo trabajo válido. Si el rechazo es por mala interpretación de la intención, crear un brief de reformulación; no reenviar el mismo mandato sin corrección explícita.

Al agotarse los tres ciclos sin un entregable válido, bloquear el trabajo y emitir un reporte de bloqueo.

## Estado de madurez

Los workflows, roles, skills, herramientas y contratos con estado `draft` pueden usarse únicamente para diseño, pruebas controladas y revisión interna. No asumir capacidad operativa, conexión externa o autorización de emisión hasta que su registro y adaptador lo declaren expresamente.

## Cambios en el repositorio

Mantener cambios pequeños, trazables y coherentes con los contratos existentes. No eliminar ni reemplazar una versión válida de un artefacto de caso; crear una nueva revisión y registrar la relación de sustitución.

Cuando se agregue un workflow, una skill, un rol o una herramienta:

1. Crear o actualizar su archivo fuente.
2. Actualizar el registro YAML correspondiente.
3. Declarar contratos, entradas, salidas, límites y criterios de aceptación.
4. Verificar que el workflow y los roles que lo usan estén alineados.
