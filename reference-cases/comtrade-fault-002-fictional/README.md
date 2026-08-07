# Expediente de referencia — CASE-REF-COMTRADE-002

Caso **construido, no histórico** — a diferencia de `pvground-001-anonymized` (que deriva de una campaña real anonimizada), este caso no parte de ningún evento, planta ni relé real de EGEHAINA.

**Los registros de este caso (`finding-*`, `review-*`, `audit-decision-*`) documentan una corrida real del workflow, no una hipótesis escrita a mano.** El 2026-08-07 se despachó `domain_specialist` y `technical_reviewer` como agentes genuinamente aislados (no la misma sesión jugando dos roles) contra la evidencia cruda de este expediente, y `auditor` con el resultado de ambos. Lo que sigue es lo que produjeron, no lo que se anticipó.

## Escenario (input, sin cambios desde la versión original)

- Planta ficticia: "REF-WIND-01", alimentador 210, relé genérico SEL-751.
- Evento ficticio del 2026-06-15: corriente de Fase A alcanza 3.8 pu (5,700 A primario, CTR 300:1), cruza el pickup de 50P1 (3.5 pu, delay instantáneo), dispara a 1.5 ciclos.
- Clasificación: falla monofásica, Fase A. Sin corriente de tierra/secuencia cero en el expediente — no se puede confirmar "a tierra" específicamente, solo "monofásica".
- Sin reporte de inspección de campo en el expediente.

## Lo que se anticipó vs. lo que pasó de verdad

La primera versión de este caso asumía que `domain_specialist` redactaría "Causa confirmada" sin respaldo de campo (violando la pregunta 7 de `critique-fault-diagnosis-analysis`), y que `technical_reviewer` tendría que atraparlo. **Eso no pasó.** En la corrida real, `domain_specialist` llegó directo a "Causa probable" citando DOD-03 correctamente desde el primer intento — la pregunta 7 se aplicó bien sin que nadie tuviera que corregir nada.

En cambio, la corrida real encontró un problema distinto y más sutil, que la versión original del caso no había anticipado: **el descarte de falso disparo quedó incompleto** (pregunta 6, DOD-02). `domain_specialist` evaluó las cuatro hipótesis típicas, descartó dos con evidencia (arranque de motor, ruido) y declaró honestamente las otras dos (saturación de TC, maniobra) como limitación sin resolver. `technical_reviewer`, llegando de forma independiente a la misma evaluación antes de ver el borrador del especialista, elevó ese mismo hueco a hallazgo bloqueante — una limitación declarada no es lo mismo que una hipótesis descartada con evidencia, y DOD-02 exige lo segundo. Además encontró por su cuenta un hallazgo que el especialista no había señalado: ambigüedad sobre qué mide exactamente el intervalo de "1.5 ciclos" reportado.

Esta es exactamente la razón por la que esta suite existe: un caso escrito a mano prueba lo que el autor imaginó que podía salir mal. Correr el workflow de verdad revela lo que efectivamente sale mal, que no siempre es lo mismo.

## Resultado real

`technical_reviewer` devolvió el expediente con outcome **`patch`** (no `partial_rework` — el diagnóstico de fondo, el elemento operante y el alcance de la conclusión están bien fundamentados y coinciden entre ambos roles; falta evidencia puntual, no una premisa base). `auditor`, con ambos registros, decidió **`no_emit`** — pero con un matiz que tampoco se anticipó: como `technical_reviewer` no aprobó, el expediente ni siquiera llega a compuerta de auditoría plena todavía (no hay entregable integrado); debe volver primero a `domain_specialist`, cerrar el ciclo 1 de 3, y recién después seguir la secuencia normal.

Ver `audit-decision-ref-comtrade-001.json` y `review-ref-comtrade-001.json` para el detalle completo.

## Contenido

| Archivo | Contrato | Contenido |
|---|---|---|
| `work-item-ref-comtrade.json` | work-item | Expediente inicial del evento (evidencia cruda tal como se le dio a los agentes) |
| `finding-ref-comtrade-001-cruce-ajuste.json` | finding | Cruce de ajuste correcto — coincidencia independiente (positivo) |
| `finding-ref-comtrade-002-alcance-conclusion-conforme.json` | finding | Alcance de la conclusión correctamente limitado — coincidencia independiente (positivo) |
| `finding-ref-comtrade-003-falso-disparo-incompleto.json` | finding | El problema real: descarte de falso disparo incompleto (DOD-02) |
| `finding-ref-comtrade-004-ambiguedad-medicion-tiempo.json` | finding | Hallazgo propio de technical_reviewer, no anticipado por domain_specialist |
| `review-ref-comtrade-001.json` | review | Revisión técnica — outcome `patch` |
| `audit-decision-ref-comtrade-001.json` | audit-decision | Auditoría — outcome `no_emit`, ciclo 1 de 3 |

Los 7 archivos están validados contra sus schemas reales (`contracts/*.schema.json`, Draft 2020-12).

## Hallazgo que produjo este ejercicio (versión original, seguía vigente)

Construir la primera versión de este caso encontró un bug real de portabilidad: `contracts/finding.schema.json` tenía el enum de `evaluation.state` hardcodeado al vocabulario de P.A.T., pese a declararse "contrato universal". Se corrigió ampliando el enum para incluir los estados de diagnóstico de COMTRADE — ver el historial de `contracts/finding.schema.json`.
