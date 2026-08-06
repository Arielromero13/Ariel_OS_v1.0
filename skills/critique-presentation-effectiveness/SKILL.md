---
id: critique-presentation-effectiveness
name: Crítica de efectividad de presentación
kind: domain
status: draft
version: 0.1.0
---

# Propósito

Aplicar un criterio explícito de efectividad a una narrativa o borrador de presentación, respondiendo preguntas concretas en vez de una impresión general. La usan content-strategist (al proponer), narrative-reviewer (de forma independiente, antes de leer la propuesta) y auditor (para confirmar que las otras dos la usaron, sin rehacerla).

# Preguntas del rubric

1. ¿La audiencia y el objetivo están declarados y la narrativa responde a ambos?
2. ¿Cada slide tiene un solo mensaje? Si hay dos ideas, ¿están separadas?
3. ¿El texto describe el visual o lo repite? Repetir es un hallazgo.
4. ¿Cada cifra o afirmación clave tiene una fuente trazable en el contenido aprobado?
5. ¿Hay redundancia entre slides — el mismo mensaje repetido sin avanzar la narrativa?
6. ¿La progresión es lógica para la audiencia (general→específico en técnica; estado→implicación→acción en ejecutiva)?
7. Si hay copy persuasivo, ¿la promesa o llamado a la acción está sustentado por el contenido aprobado?

# Entradas

- Narrativa o borrador de presentación (outline, mensajes clave).
- Contenido fuente aprobado.
- Copy persuasivo, si el copywriter de marketing se activó.

# Salidas

- `technical_critique_record` con respuesta razonada a cada pregunta aplicable.

# Modos de uso

- `proposal`: content-strategist responde las 7 preguntas antes de entregar la narrativa.
- `independent_review`: narrative-reviewer responde las 7 preguntas por cuenta propia, sin leer antes el registro del estratega, y solo entonces compara.
- `process_audit`: auditor confirma que ambos registros existen y están razonados — no rehace la crítica.

# Límites

- No inventa contenido, cifras ni fuentes faltantes; las marca como pendientes.
- No sustituye la revisión del sistema visual (`render-and-review-presentation`).
- Declarar "sin hallazgos" solo es válido si cada pregunta aplicable fue respondida explícitamente.

# Validación

- content-strategist y narrative-reviewer registran un `technical_critique_record` propio y separado.
- narrative-reviewer llega a su conclusión antes de leer la del estratega.
- auditor verifica que ambos registros existen y están razonados, no solo que existen.
