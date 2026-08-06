---
id: design-presentation-narrative
name: Diseño de narrativa de presentación
kind: domain
status: draft
version: 0.1.0
---

# Propósito

Convertir un brief o contenido crudo en una narrativa de presentación trazable: audiencia, objetivo, estructura de slides y mensajes clave, sin exceder el contenido fuente disponible.

# Entradas

- Brief o solicitud de presentación (audiencia, objetivo, ocasión).
- Contenido fuente: datos, informes, resultados, notas, material previo.
- Definition of Done y restricciones (ej. número máximo de slides, tiempo disponible).

# Procedimiento

1. Identificar audiencia, objetivo, tipo de presentación (ejecutiva / técnica / mixta) y restricciones.
2. Inventariar el contenido fuente disponible y marcar lo que falta o es insuficiente.
3. Definir mensajes clave — máximo los que la audiencia puede retener, priorizados.
4. Proponer estructura de slides: portada, agenda, bloques temáticos, cierre — según el tipo de presentación.
5. Aplicar la regla de un mensaje por slide; si un bloque tiene dos ideas, se separa en dos slides.
6. Registrar qué contenido queda pendiente de fuente o de aprobación.

# Salidas

- Estructura de slides (outline).
- Mensajes clave jerarquizados.
- Registro de fuentes de contenido usadas.
- Lista de pendientes o supuestos.

# Límites

- No inventa cifras, resultados ni citas.
- No decide paleta, tipografía ni maquetación — corresponde a `apply-visual-identity-system`.
- No aprueba su propio resultado como definitivo — requiere revisión de `narrative-reviewer`.
- Si el contenido fuente es insuficiente para un bloque, ese bloque queda marcado como pendiente, no relleno con generalidades.
