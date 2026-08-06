---
id: assemble-pptx-deck
name: Ensamblaje de presentación PPTX
kind: transversal
status: draft
version: 0.1.0
---

# Propósito

Ensamblar la narrativa y el sistema visual aprobados en un archivo PPTX, respetando arquetipos de slide, paleta y reglas de layout sin alterar contenido aprobado.

# Entradas

- Narrativa aprobada (`slide_outline`, mensajes clave).
- Copy final (afinado por marketing-copywriter si se activó).
- `visual_system_spec` aprobado (paleta, tipografía, arquetipos, layout).
- Material visual disponible (fotos, capturas, diagramas, iconografía).

# Procedimiento

1. Registrar la versión de narrativa y sistema visual recibidos.
2. Generar una slide por cada bloque del outline, aplicando el arquetipo correspondiente.
3. Insertar texto, datos y visuales respetando la regla de un mensaje por slide y la jerarquía título → visual → dato.
4. Aplicar paleta y tipografía del sistema visual de forma consistente en toda la presentación.
5. Insertar material visual real disponible en vez de genéricos cuando exista.
6. Generar el PPTX y el registro de integración.
7. Entregar el PPTX para renderizado y QA visual.

# Salidas

- Archivo PPTX.
- Registro de integración (qué slide corresponde a qué bloque de narrativa).

# Límites

- Solo la invoca el integrador.
- No altera mensajes, cifras, estructura ni sistema visual aprobados.
- No aprueba ni distribuye la presentación.
