# Arquitectura

## Núcleo portable

El repositorio es la fuente de verdad del sistema. Contiene políticas, agentes, skills, métodos, contratos, flujos y evaluaciones. Los adaptadores permiten ejecutar este núcleo sobre Codex, Claude Code, Antigravity u otros arneses compatibles.

## Roles del loop

| Rol | Responsabilidad | No debe hacer |
|---|---|---|
| Orquestador | Interpretar intención, planificar, delegar y comprobar el resultado frente al mandato original. | Sustituir el análisis especializado o ignorar criterios de aceptación. |
| Especialista | Producir una parte concreta del trabajo con evidencia. | Aprobar su propio resultado como definitivo. |
| Revisor técnico | Validar calidad, exactitud, trazabilidad, criterios y riesgos técnicos. | Reescribir todo por un error localizado. |
| Integrador | Unir componentes aprobados y comprobar coherencia entre ellos. | Alterar hallazgos técnicos sin registrar la razón. |
| Auditor | Verificar que la aprobación, rechazo o escalamiento está justificado por evidencia y reglas. | Duplicar el análisis técnico del revisor. |

## Flujo de autoridad

- El especialista propone.
- El revisor técnico valida el contenido.
- El integrador compone el artefacto.
- El orquestador valida la alineación con el mandato original.
- El auditor valida la razonabilidad de la decisión.
- Ante desacuerdo material, se escala al usuario o responsable humano.
