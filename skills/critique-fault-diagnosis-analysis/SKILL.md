---
id: critique-fault-diagnosis-analysis
name: Crítica de ingeniería de protecciones en análisis de falla
kind: domain
status: draft
version: 0.1.0
---

# Crítica de ingeniería de protecciones en análisis de falla

## Propósito

Aplicar criterio real de ingeniería de protecciones — no solo describir la forma de onda — a un diagnóstico de evento COMTRADE, contrastando contra los ajustes de protección vigentes, la topología declarada y el comportamiento eléctrico esperable. Existe porque "el relé disparó y hay una forma de onda de falla" y "esto fue una falla real de tipo X en el circuito Y" son afirmaciones distintas, y la segunda requiere las preguntas de esta skill.

Esta skill no reemplaza `analyze-comtrade-event` ni `research-normative-criterion`: se compone con ellas. `analyze-comtrade-event` consolida el evento y produce el diagnóstico preliminar; `research-normative-criterion` verifica fuente y aplicabilidad de una norma de protección citada; esta skill cuestiona si, incluso con el evento bien extraído y los ajustes bien documentados, el diagnóstico realmente se sostiene.

## Tres modos de uso — según quién la invoca

Igual que en `critique-grounding-safety-analysis`, no es la misma pasada repetida tres veces:

**Modo propuesta (`domain_specialist`, en `technical_analysis`).** Se aplica antes de proponer una causa de falla. El resultado entregado a `technical_reviewer` debe incluir las respuestas a las preguntas de la sección siguiente, no solo las gráficas y el elemento que operó.

**Modo revisión independiente (`technical_reviewer`, en `technical_review`).** `technical_reviewer` responde las mismas preguntas por su cuenta, con el evento y el contexto de planta, **sin leer primero las respuestas del especialista**. Solo después compara — coincidencia razonada explícita, o desacuerdo que dispara corrección.

**Modo auditoría de proceso (`auditor`, en `decision_audit`).** El auditor no vuelve a interpretar la oscilografía ni rehace el diagnóstico — eso está fuera de su autoridad. Verifica que el registro de `domain_specialist` y de `technical_reviewer` contiene respuestas razonadas a cada pregunta aplicable. Su ausencia bloquea la aprobación, igual que en el dominio P.A.T.

## Preguntas de ingeniería obligatorias

Responder cada una que aplique al caso; marcar explícitamente "no aplica" con motivo cuando corresponda, no omitir en silencio.

1. **Coherencia con la ecuación de disparo.** ¿El elemento que efectivamente operó según el registro es consistente con la ecuación de disparo documentada para ese relé (OR de elementos, lógica de bloqueo/supervisión)? Un disparo que no corresponde a ningún elemento de la ecuación documentada es una alarma a resolver, no un diagnóstico cerrado.
2. **Ajuste vs. corriente medida.** ¿La corriente (o tensión) de falla medida cruza efectivamente el pickup del elemento que se afirma que operó, considerando el CTR/PTR declarado? Una operación atribuida a un elemento cuyo pickup no fue cruzado en primario es una contradicción a resolver.
3. **Tiempo de operación vs. ajuste temporizado.** ¿El tiempo entre pickup y trip observado es compatible con el delay configurado del elemento, más el tiempo de interruptor conocido de ese circuito? Una discrepancia sistemática sugiere revisar si el elemento identificado es el correcto.
4. **Clasificación de falla vs. patrón de fases.** ¿La clasificación propuesta (monofásica a tierra, bifásica, bifásica a tierra, trifásica) es consistente con el patrón de corrientes y tensiones de fase observado, no solo con qué elemento operó?
5. **Plausibilidad frente al contexto de planta.** ¿El comportamiento observado (depresión de frecuencia, desbalance pre-pickup, dirección de flujo) es consistente con lo esperado para esa topología y ese circuito según el contexto de planta disponible? Un desbalance pre-pickup anómalo para un circuito normalmente balanceado es un hallazgo, no ruido a descartar.
6. **Descarte de falso disparo.** Antes de cerrar el diagnóstico como falla real, ¿se evaluó explícitamente la hipótesis de falso disparo (saturación de TC, ruido, maniobra, arranque de motor, falla externa con embalamiento) y se descartó con evidencia — no por default porque el relé disparó?
7. **Alcance de la conclusión.** Cuando se declare una causa, ¿queda claro si es "causa confirmada" (con evidencia de inspección de campo) o "causa probable" (solo con evidencia de oscilografía)? No presentar una inferencia de oscilografía como confirmación de campo sin decirlo explícitamente.

## Salida

```yaml
technical_critique_record:
  mode: proposal | independent_review | process_audit
  questions_applied:      # cuáles de las 7 aplicaron y cuáles no, con motivo
  findings_raised:        # hallazgos de esta crítica, o ausencia justificada de hallazgos
  false_trip_hypothesis_addressed: true | false
  conclusion_scope: causa_confirmada | causa_probable | no_concluyente
  independent_conclusion:  # solo en modo independent_review, antes de comparar con el especialista
  agreement_with_specialist:  # solo en modo independent_review
```

## Límites

- No inventa un ajuste de relé, CTR/PTR o dato de campo no verificado; los marca como dato faltante.
- No sustituye a `research-normative-criterion` para verificar fuente/edición/cláusula de una norma de protección citada.
- En modo `process_audit`, no reinterpreta la oscilografía ni emite un diagnóstico propio — solo confirma que el registro de los otros dos modos existe y está razonado.
- "Sin hallazgos" es una salida válida, pero solo cuando cada pregunta aplicable fue respondida explícitamente — nunca por omisión.
