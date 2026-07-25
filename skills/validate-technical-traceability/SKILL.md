---
id: validate-technical-traceability
name: Validación de trazabilidad técnica
kind: transversal
status: draft
version: 0.1.0
---

# Propósito

Comprobar que una conclusión pueda recorrerse desde su evidencia hasta el criterio y la recomendación, sin saltos no documentados.

# Entradas

- Registros de evidencia.
- Matriz o datos de fuente.
- Findings, criterios y recomendaciones.
- Referencias de revisión, si existen.

# Procedimiento

1. Construir enlaces datos o medición → evidencia.
2. Comprobar evidencia → finding.
3. Comprobar finding → estado de evaluación → criterio aplicable.
4. Comprobar finding → recomendación, cuando exista.
5. Reportar cada enlace ausente, ambiguo o inconsistente sin resolverlo por inferencia.

# Salidas

- Mapa de trazabilidad.
- Registro de revisión de trazabilidad.
- Lista de enlaces no resueltos.

# Límites

- No crea evidencia, criterio ni hallazgo.
- No reemplaza la revisión técnica independiente.
- Un enlace ausente se reporta; no se completa con una suposición.
