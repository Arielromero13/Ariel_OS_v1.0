---
id: sync-agent-log
name: Sincronización de bitácora de agentes
kind: transversal
status: draft
version: 0.1.0
---

# Propósito

Registrar, en el almacén externo de trazabilidad (capacidad `traceability_log_store` de `registry/tools.yaml`; en el arnés Claude Code, la base de datos "Bitácora de Agentes — Ariel Agent OS" en Notion — ver `CLAUDE.md` para el binding concreto), una entrada por cada etapa de workflow que se cierra: quién actuó, sobre qué evidencia, con qué hallazgo, contra qué criterio, y qué decisión tomó.

Esto es la implementación operativa de la regla no negociable 2 (trazabilidad completa evidencia → finding → criterio → entregable) y de la regla 4 (máximo tres ciclos de corrección): sin esta skill, esa traza solo existía dentro de la sesión activa y se perdía al cerrarla.

Solo la invoca el orquestador — el mismo rol responsable de contar ciclos y decidir emisión/bloqueo/escalamiento (`CLAUDE.md`, secciones 3–5). No es una skill de análisis: no juzga si el resultado es correcto, solo lo registra.

# Entradas

- Identificador de la página de campaña (expediente) a la que pertenece el work item, cuando exista.
- Nombre del work item o etapa de `workflows/*.yaml` que se está cerrando.
- Subagente responsable de esa etapa (o `orquestador` si la etapa la resuelve el propio orquestador).
- Ciclo actual del work item (0 = intento inicial, no consume ciclo de corrección).
- Tipo de acción: `inicial`, `patch`, `partial_rework`, `full_rework` o `user_clarification`.
- Referencia a la evidencia usada, el finding producido, el criterio aplicado y el entregable (si existe en esa etapa).
- Decisión resultante: `aprobado`, `rechazado`, `bloqueado`, `escalado` o `pendiente`.

# Procedimiento

1. Al cerrar cualquier etapa de `stages` en el workflow activo (con resultado aprobado, rechazado, bloqueado o escalado), reunir los campos de entrada arriba listados.
2. Si el expediente todavía no tiene una página de campaña asociada (fase de análisis de brechas, antes de `ready`), registrar la entrada sin relación a campaña — no bloquear el registro por esa ausencia.
3. Crear una fila nueva en la Bitácora de Agentes. No editar ni sobrescribir filas anteriores: cada ciclo, cada etapa y cada rechazo es una fila propia — la bitácora es un historial, no un estado mutable.
4. Si la etapa cerró con `user_clarification`, registrarla igual que cualquier otra fila, dejando explícito en Notas que no consume ciclo (regla de `AGENTS.md`, sección "Correcciones y bloqueo").
5. Si el work item alcanza el límite de tres ciclos (regla no negociable 4) y se escala, registrar una fila de cierre con Decisión `escalado` y un resumen en Notas de qué se intentó en cada ciclo y por qué falló — este resumen es lo que el orquestador usa para reportarle a Ariel (`CLAUDE.md`, sección 4).

# Salidas

- Fila nueva en la Bitácora de Agentes, con enlace a la página de campaña cuando corresponda.
- Confirmación de escritura o error de sincronización (si el almacén externo no está disponible, la etapa del workflow no se bloquea por esto, pero el orquestador debe advertir la brecha en el handoff en vez de asumir que quedó registrada).

# Límites

- No decide si un resultado se aprueba, rechaza o bloquea — solo registra la decisión ya tomada por el rol responsable.
- No inventa evidencia, finding o criterio para completar una fila; un campo sin dato disponible se deja vacío o se marca explícitamente como no aplicable.
- No sustituye el handoff formal entre roles (`contracts/handoff.schema.json`) ni la trazabilidad interna del work item — es un registro externo adicional, no la única fuente de verdad durante la ejecución.
- Los datos reales de campaña/planta que se escriben acá viven fuera del repositorio, igual que en Notion/Drive en general (`docs/governance.md`).
