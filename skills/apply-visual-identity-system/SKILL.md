---
id: apply-visual-identity-system
name: Aplicación de sistema de identidad visual
kind: transversal
status: draft
version: 0.1.0
---

# Propósito

Traducir una guía de marca (o criterios visuales por defecto, si no existe guía declarada) en un sistema visual concreto para una presentación: paleta, tipografía, arquetipos de slide y reglas de layout.

# Entradas

- Narrativa aprobada (estructura de slides, tipo de presentación).
- Guía de marca aplicable, si existe (paleta, tipografía, logotipo, reglas de uso).
- Material visual disponible (fotos reales, capturas, diagramas).

# Procedimiento

1. Confirmar la guía de marca aplicable. Si no existe, usar criterios visuales por defecto declarados por el usuario o el dominio, dejando constancia de la fuente.
2. Definir paleta y su uso por rol (fondo, estructura, acento, alerta, texto).
3. Definir tipografía y tamaños por tipo de elemento (título, cuerpo, KPI, caption).
4. Definir arquetipos de slide según la estructura narrativa recibida.
5. Señalar dónde usar material visual real disponible frente a elementos genéricos o iconografía.
6. Registrar reglas de jerarquía visual (título → visual → dato) y densidad máxima de texto por tipo de slide.

# Salidas

- `visual_system_spec` (paleta, tipografía, arquetipos, reglas de layout).
- Registro de la fuente de la guía de marca usada.

# Límites

- No modifica mensajes, datos ni estructura narrativa aprobada.
- No decide contenido persuasivo.
- Si no hay guía de marca ni criterio por defecto aplicable, lo declara como pendiente en vez de inventar una paleta.
