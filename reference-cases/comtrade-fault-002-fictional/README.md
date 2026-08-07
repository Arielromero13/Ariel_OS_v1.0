# Expediente de referencia — CASE-REF-COMTRADE-002

Caso **construido, no histórico** — a diferencia de `pvground-001-anonymized` (que deriva de una campaña real anonimizada), este caso no parte de ningún evento, planta ni relé real de EGEHAINA. Se diseñó específicamente para poner a prueba `workflows/comtrade-fault-analysis.yaml` y, en particular, la pregunta 7 de `critique-fault-diagnosis-analysis` (alcance de la conclusión).

No presentarlo nunca como un caso real anonimizado — es un ejercicio de regresión, y así debe quedar declarado si se referencia en otro lado.

## Escenario

- Planta ficticia: "REF-WIND-01", alimentador 210, relé genérico SEL-751.
- Evento ficticio del 2026-06-15: corriente de Fase A alcanza 3.8 pu (5,700 A primario, CTR 300:1), cruza el pickup de 50P1 (3.5 pu, delay instantáneo), dispara a 1.5 ciclos — consistente con el ajuste declarado.
- Clasificación: falla monofásica a tierra, Fase A. Hipótesis de falso disparo (arranque de motor, saturación de TC) evaluada y descartada por la forma de la señal.
- El defecto deliberado: el borrador inicial redacta la causa como **"Causa confirmada: contacto con vegetación en Fase A"**, apoyado solo en la oscilografía — sin ningún reporte de inspección de campo en el expediente. Confirmar QUE hubo falla y CÓMO operó la protección no es lo mismo que confirmar POR QUÉ ocurrió.

## Qué debe atrapar el sistema

Un análisis que solo compare "¿el relé disparó según sus ajustes?" pasaría este caso sin problema — el cruce de ajuste, el tiempo de operación y el descarte de falso disparo están todos correctamente sustentados. Lo que debe fallar es específicamente la pregunta 7 de `critique-fault-diagnosis-analysis`: si `technical_reviewer` la aplica de forma independiente antes de leer la propuesta del especialista, debería llegar a la misma conclusión de sobre-alcance sin que nadie se lo señale.

El resultado esperado de correr el workflow contra este caso es `no_emit` — con la revisión técnica exigiendo `patch` sobre la sección de conclusiones, no sobre el análisis de señal (que está bien). Ver `audit-decision-ref-comtrade-001.json` y `review-ref-comtrade-001.json`.

## Contenido

| Archivo | Contrato | Contenido |
|---|---|---|
| `work-item-ref-comtrade.json` | work-item | Expediente inicial del evento |
| `finding-ref-comtrade-001-cruce-ajuste.json` | finding | Cruce de ajuste correcto (positivo) |
| `finding-ref-comtrade-002-falso-disparo-descartado.json` | finding | Descarte de falso disparo (positivo) |
| `finding-ref-comtrade-003-alcance-conclusion.json` | finding | El defecto: causa "confirmada" sin respaldo de campo |
| `review-ref-comtrade-001.json` | review | Revisión técnica — outcome `partial_rework` |
| `audit-decision-ref-comtrade-001.json` | audit-decision | Auditoría — outcome `no_emit` |

Los 6 archivos están validados contra sus schemas reales (`contracts/*.schema.json`, Draft 2020-12).

## Hallazgo que produjo este ejercicio

Construir este caso encontró un bug real: `contracts/finding.schema.json` tenía el enum de `evaluation.state` hardcodeado al vocabulario de P.A.T. (Conforme/No conforme/No concluyente/Pendiente), pese a declararse "contrato universal". Se corrigió ampliando el enum para incluir los estados de diagnóstico de COMTRADE (Falla confirmada/Falla probable/Falso disparo) — ver el commit correspondiente. Es exactamente el tipo de regresión que esta suite de referencia existe para detectar.
