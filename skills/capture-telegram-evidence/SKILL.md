---
name: capture-telegram-evidence
description: Captura fotos de campo enviadas por Telegram durante una ruta de mediciones, las etiqueta por punto y campaña, y las deja listas para análisis posterior. No lee ni evalúa ninguna medición.
version: 0.1.0
status: draft
---

# Captura de evidencia por Telegram

## Propósito

Reducir el trabajo de ensamblar el expediente después de una ruta de
mediciones de campo. El ingeniero envía cada foto al bot en el momento en
que la toma, con una etiqueta de texto; el bot guarda la foto y actualiza
un manifiesto de campaña. Nada más.

Esta skill es exclusivamente de **captura**, no de análisis. No lee el
valor del instrumento en la foto, no evalúa conformidad, no arma la matriz
de control ni el informe. Esa interpretación ocurre después, en una sesión
normal con el especialista de dominio, usando
[analyze-grounding-report](../analyze-grounding-report/SKILL.md) y sus
skills transversales — deliberadamente, para no requerir una llamada de
API en tiempo real por cada foto tomada en campo.

## Formato de etiqueta esperado

El ingeniero escribe, como texto o pie de foto del mensaje de Telegram:

```
<Planta o campaña>, medición <N> de <M>
```

Ejemplo: `Planta Higuamo, medición 2 de 10`.

- `N` es el número de este punto dentro de la ruta; `M` es el total de
  puntos previstos en la ruta.
- El texto libre antes o después del patrón "medición N de M" se toma
  como nombre de planta/campaña y define en qué carpeta se agrupan las
  fotos.
- Si el bot no reconoce el patrón, responde pidiendo que se reenvíe la
  foto con el formato correcto — no adivina el punto ni lo descarta en
  silencio.

## Flujo

1. Recibir la foto y el texto del mensaje de Telegram.
2. Si no hay foto o no hay patrón "medición N de M" reconocible, avisar
   al ingeniero y no registrar nada.
3. Determinar el slug de campaña a partir del nombre de planta detectado.
4. Guardar la foto en el almacenamiento de objetos bajo
   `campaigns/<campaña>/punto-<N>.jpg`.
5. Leer (si existe) o crear el manifiesto `campaigns/<campaña>/manifest.json`
   y registrar el punto `N`: URL de la foto, texto original del mensaje,
   hora de recepción.
6. Confirmar al ingeniero cuántos puntos van registrados sobre el total.
7. Cuando el conteo de puntos registrados alcanza `M`, avisar que la ruta
   está completa y lista para procesar.

## Qué NO hace esta skill

- No lee el valor medido en la foto (sin llamada de visión en tiempo real
  — decisión explícita para no incurrir en costo de API por foto).
- No evalúa conformidad ni aplica ningún criterio técnico.
- No construye la matriz de control ni el informe.
- No sustituye `manage-photo-evidence-gallery` ni `validate-technical-traceability`,
  que se ejecutan sobre el manifiesto ya cerrado, en sesión formal.

## Entradas requeridas

- Mensaje de Telegram con foto y texto (`telegram_field_capture`).
- Almacenamiento de objetos accesible por el webhook (`blob_object_store`).

## Salidas

- Fotos de campaña organizadas por punto.
- `manifest.json` de campaña: mapa punto → foto → texto original → hora.
- Aviso de ruta completa cuando corresponda.

## Reglas de calidad

- No inventar el punto, la campaña ni el total si la etiqueta es
  ambigua o está ausente — se pide reenvío.
- No sobrescribir un punto ya recibido sin que el ingeniero lo reenvíe
  explícitamente (un reenvío del mismo N reemplaza la foto anterior).
- El manifiesto es un artefacto de captura, no un contrato de evidencia
  validado — la promoción a `evidence.schema.json` ocurre en la sesión de
  análisis, con el especialista de dominio revisando cada foto.
