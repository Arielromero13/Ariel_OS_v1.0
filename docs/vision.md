# Visión

## Propósito

Ariel Agent OS es un sistema portable de agentes para convertir expedientes técnicos en análisis, entregables y decisiones trazables. El repositorio contiene la arquitectura; Codex u otro arnés compatible la ejecuta.

El sistema busca reducir retrabajo documental y mejorar consistencia sin sustituir el juicio, la evidencia de campo ni la aprobación del ingeniero responsable.

## Problema que resuelve

Los trabajos técnicos suelen requerir reunir documentos heterogéneos, identificar faltantes, contrastar evidencia, aplicar criterios, redactar entregables, ordenar fotografías y revisar coherencia. Un asistente aislado puede generar un borrador; un sistema gobernado debe además preservar trazabilidad, declarar límites y detenerse cuando no puede concluir.

## Principios

1. Evidencia antes que narrativa.
2. El caso y su revisión actual prevalecen sobre referencias históricas.
3. El método pertenece a skills y workflows; el expediente describe el caso.
4. Todo entregable tiene Definition of Done y criterio de emisión.
5. El sistema preserva trabajo válido y corrige proporcionalmente.
6. Ninguna conclusión técnica se presenta como definitiva sin evidencia y revisión apropiadas.
7. La arquitectura debe ser portable entre arneses; el proveedor no es la fuente de verdad.
8. La aprobación humana conserva la decisión externa y de alto impacto.

## Primer piloto

El primer workflow es el informe de verificación de sistemas de puesta a tierra (P.A.T.). Recibe una revisión de expediente con matriz de mediciones, fotografías, registros, plantilla, referencias históricas y fuentes normativas disponibles; produce matriz validada, análisis trazable, galería de evidencias, borrador Word y lista de pendientes.

Este piloto valida la arquitectura antes de extenderla a análisis COMTRADE, informes de fallas, presentaciones técnicas y otros dominios.

## Éxito

El sistema es exitoso cuando:

- Un expediente puede clasificarse sin inventar datos.
- Los resultados preservan vínculo entre evidencia, análisis, criterio y recomendación.
- El flujo detecta faltantes y bloqueos antes de emisión.
- Las correcciones no destruyen secciones válidas.
- Un entregable puede revisarse con rapidez por un experto humano.
- El mismo núcleo puede ejecutarse en Codex y adaptarse después a otros arneses.

## Fuera de alcance inicial

- Automatizar la medición o el juicio físico de campo.
- Sustituir la responsabilidad profesional del ingeniero.
- Emitir automáticamente documentos externos sin aprobación.
- Reentrenar modelos con documentación histórica.
- Construir un swarm permanente de agentes conversando sin una tarea concreta.
