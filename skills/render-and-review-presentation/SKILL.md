---
id: render-and-review-presentation
name: Renderizado y revisión visual de presentación
kind: transversal
status: draft
version: 0.1.0
---

# Propósito

Renderizar la presentación y comprobar que su presentación visual es legible, consistente con el sistema visual aprobado y libre de defectos de maquetación.

# Entradas

- Archivo PPTX ensamblado.
- `visual_system_spec` aprobado.
- Reglas visuales del workflow (ej. máximo de líneas por slide, tamaño mínimo de KPI).

# Procedimiento

1. Renderizar cada slide a imagen o miniatura para inspección.
2. Revisar desbordes de texto, contraste, alineación, slides en blanco o duplicadas.
3. Verificar consistencia de paleta, tipografía y arquetipos frente al sistema visual aprobado.
4. Verificar que el material visual real está correctamente insertado, no recortado ni pixelado.
5. Registrar cada defecto visual y su gravedad.
6. Emitir QA visual aprobado, solicitud de patch o partial rework.

# Salidas

- Presentación renderizada (miniaturas o PDF).
- Registro de QA visual.
- Solicitud de corrección visual cuando corresponda.

# Límites

- No valida la narrativa ni el copy — eso corresponde a `critique-presentation-effectiveness`.
- No modifica el PPTX sin una corrección trazable.
- No aprueba emisión si el sistema visual aprobado no se respeta de forma consistente.
