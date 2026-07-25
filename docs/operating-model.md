# Modelo operativo

## Principio

El sistema opera como un proyecto portable: el repositorio contiene las políticas, agentes, skills, contratos y flujos; un arnés compatible ejecuta el trabajo.

El sistema debe producir resultados verificables sin iterar indefinidamente, preservando todo trabajo válido durante las correcciones.

## Loop de ejecución

1. El usuario formula una solicitud.
2. El orquestador interpreta la intención, define el alcance y crea un brief de trabajo.
3. Los especialistas ejecutan partes concretas y devuelven evidencia y resultados estructurados.
4. El revisor técnico verifica exactitud, trazabilidad, cumplimiento de criterios y riesgos.
5. El integrador ensambla las partes aprobadas en un entregable coherente.
6. El orquestador contrasta el resultado integrado contra la intención original y los criterios de aceptación.
7. El auditor evalúa si la decisión de aprobar, rechazar o escalar está justificada por la evidencia y las reglas del sistema.
8. El sistema entrega, solicita una aclaración o emite un reporte de bloqueo.

## Presupuesto de iteración

- Un work item tiene un máximo de tres ciclos internos de corrección.
- Una solicitud de aclaración al usuario pausa el contador; no equivale a un intento fallido.
- Si al agotar el presupuesto no se cumple el criterio de aceptación, el sistema detiene la ejecución y emite un reporte de bloqueo.
- El reporte de bloqueo incluye: estado alcanzado, evidencia disponible, inconsistencias, decisiones pendientes, trabajo preservado y recomendación de siguiente acción.

## Tipos de corrección

| Tipo | Uso | Alcance |
|---|---|---|
| Patch | Error local y aislado. | Un dato, referencia, cálculo, foto o párrafo. |
| Partial rework | Una sección dejó de ser válida. | Sólo la sección afectada y sus dependencias directas. |
| Full rework | Una premisa base invalida el enfoque o gran parte del resultado. | Rehacer lo dependiente de la premisa; preservar evidencia y componentes aún válidos. |
| User clarification | Falta información crítica o hay desacuerdo no resoluble. | Pausar y solicitar una decisión o dato específico. |

## Preservación de trabajo válido

- Las secciones, evidencias y resultados correctos no se modifican durante una corrección sin justificación explícita.
- Cada corrección declara qué se preserva, qué se modifica y por qué.
- Un full rework no autoriza a borrar trazabilidad ni a perder trabajo verificadamente válido.

## Reformulación obligatoria

Si el orquestador detecta que la intención fue mal entendida, no puede reenviar el mismo prompt. Debe emitir un brief corregido con:

1. Mandato original.
2. Interpretación anterior.
3. Error detectado.
4. Interpretación corregida.
5. Tipo de corrección.
6. Secciones o artefactos a preservar.
7. Secciones o artefactos a modificar.
8. Agente responsable.
9. Criterio de aceptación.

## Desacuerdo

Si revisor técnico, orquestador y auditor no coinciden, el sistema escala la decisión. No ejecuta un full rework automático ni presenta una conclusión como definitiva.
