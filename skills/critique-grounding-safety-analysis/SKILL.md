---
id: critique-grounding-safety-analysis
name: Crítica de ingeniería eléctrica en verificaciones P.A.T.
kind: domain
status: draft
version: 0.1.0
---

# Crítica de ingeniería eléctrica en verificaciones P.A.T.

## Propósito

Aplicar criterio real de ingeniería eléctrica — no solo comparar un valor contra un umbral — a los resultados de una verificación P.A.T., contrastando contra IEEE 80, IEEE 142, IEEE 2760-2020, IEC 61936-1 u otra fuente aplicable al caso. Existe porque "el número dio dentro del rango" y "el sistema de puesta a tierra es adecuado" son afirmaciones distintas, y la segunda requiere las preguntas de esta skill, no solo la primera.

Esta skill no reemplaza `analyze-grounding-report` ni `research-normative-criterion`: se compone con ellas. `analyze-grounding-report` consolida evidencia y produce el resultado; `research-normative-criterion` verifica fuente y aplicabilidad de un criterio citado; esta skill cuestiona si, incluso con evidencia trazable y criterio bien citado, la conclusión de ingeniería realmente se sostiene.

## Tres modos de uso — según quién la invoca

Esta skill se invoca en tres puntos del workflow `grounding-report`, con un rol distinto en cada uno. No es la misma pasada repetida tres veces:

**Modo propuesta (`domain_specialist`, en `technical_analysis`).** Se aplica mientras se construye el análisis, antes de proponer un estado de evaluación. El resultado entregado a `technical_reviewer` debe incluir las respuestas a las preguntas de la sección siguiente, no solo la matriz y el estado Conforme/No conforme.

**Modo revisión independiente (`technical_reviewer`, en `technical_review`).** `technical_reviewer` responde las mismas preguntas por su cuenta, con la matriz y evidencia pero **sin leer primero las respuestas del especialista**. Solo después compara. Si coincide con el especialista, lo declara como coincidencia razonada ("verifiqué X de forma independiente y llegué a la misma conclusión por Y motivo"), nunca como "sin comentarios" — un review que no deja rastro de haber pensado el problema no cumple esta skill, aunque apruebe.

**Modo auditoría de proceso (`auditor`, en `decision_audit`).** El auditor no vuelve a responder las preguntas ni rehace el juicio de ingeniería — eso está fuera de su autoridad (ver `agents/auditor/AGENT.md`). Verifica que el registro de `domain_specialist` y de `technical_reviewer` contiene respuestas razonadas a cada pregunta aplicable, no casillas vacías o un "Conforme" sin desarrollo. Si falta el registro de esta skill en cualquiera de los dos roles, el auditor no puede aprobar el proceso — es una compuerta, igual que la trazabilidad o el DoD.

## Preguntas de ingeniería obligatorias

Responder cada una que aplique al caso; marcar explícitamente "no aplica" con motivo cuando corresponda, no omitir en silencio.

1. **Suficiencia del criterio.** ¿El criterio aplicado (p. ej. Rg ≤ 1.0 Ω) es autosuficiente, o la propia fuente lo condiciona a un estudio adicional (GPR, tensiones de paso y contacto)? Si el criterio se declara "preliminar" en su propia fuente, no tratarlo como aceptación definitiva sin decirlo explícitamente en la conclusión.
2. **Consistencia por tipo de activo.** ¿Los valores medidos son razonables para el tipo de electrodo/activo (malla de subestación, jabalina aislada, verja perimetral, pórtico, transformador)? Una diferencia sistemática entre grupos de activos (p. ej. verjas con lecturas notablemente más altas que estructuras de equipo) merece una nota explícita, no silencio, aunque todos los valores individuales cumplan el criterio.
3. **Outliers dentro de la campaña.** ¿Algún punto se aparta del patrón del resto de la campaña, aunque cumpla el criterio numérico? Un valor "conforme" pero atípico frente a sus pares es información, no ruido a descartar.
4. **Tendencia histórica.** Si existe una campaña previa del mismo punto: ¿la lectura sube, baja o se mantiene? Una tendencia ascendente sostenida es un hallazgo aunque el valor absoluto siga dentro del criterio.
5. **Compatibilidad de método y geometría.** ¿La separación de picas, geometría y condición de suelo declaradas son compatibles con el método usado (62 %, general, u otro)? Si esa validación no está documentada, es una limitación a declarar, no un supuesto a dar por hecho.
6. **Corriente de falla y alcance de la conclusión.** Si se conoce o puede estimarse la corriente de falla esperada en el punto, ¿es compatible con tratar Rg como única variable relevante? Si no se conoce, la conclusión debe decir explícitamente que falta ese dato para una evaluación de seguridad completa — no callarlo.
7. **Precisión del término "Conforme".** Cuando se declare un estado de evaluación, debe quedar claro contra qué exactamente se declaró: ¿resistencia de electrodo? ¿continuidad de conexión? ¿seguridad de paso y contacto? "Conforme" sin ese alcance explícito es ambiguo — un lector no debe poder leerlo como "el sistema es seguro" si eso no fue lo que se verificó.

## Salida

```yaml
technical_critique_record:
  mode: proposal | independent_review | process_audit
  questions_applied:      # cuáles de las 7 aplicaron y cuáles no, con motivo
  findings_raised:        # hallazgos de esta crítica, o ausencia justificada de hallazgos
  criterion_sufficiency_assessment:
  scope_limitations_flagged:
  independent_conclusion: # solo en modo independent_review, antes de comparar con el especialista
  agreement_with_specialist: # solo en modo independent_review
```

## Límites

- No inventa un estudio de GPR, corriente de falla o resistividad de suelo no medidos; los marca como dato faltante.
- No sustituye a `research-normative-criterion` para verificar fuente/edición/cláusula — asume que ese criterio ya está verificado y cuestiona si con él alcanza.
- En modo `process_audit`, no rehace el análisis técnico ni emite un juicio de ingeniería propio — solo confirma que el registro de los otros dos modos existe y está razonado.
- "Sin hallazgos" es una salida válida de esta skill, pero solo cuando cada pregunta aplicable fue respondida explícitamente — nunca por omisión.
