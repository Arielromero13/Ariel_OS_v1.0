# Expediente de referencia — CASE-REF-PVGROUND-001

Caso histórico real, anonimizado, usado como expediente de referencia para probar y calibrar el workflow `grounding-report` de punta a punta.

## Origen y anonimización

Deriva de una campaña de verificación P.A.T. real (planta solar fotovoltaica, 14 Power Stations + subestación, 48 puntos de medición). Se anonimizó:

- Nombre de planta → "Parque Solar Fotovoltaico Altavista" (ficticio)
- Personal de campo → roles genéricos, sin nombres
- Código de proyecto y números de serie de instrumento → genéricos

Se conservó sin cambios: la estructura completa de la campaña, los 48 valores de resistencia medidos, los criterios normativos citados (IEEE Std 142-1991, IEEE Std 80, IEEE Std 2760-2020, IEC 62305-3:2006), y el análisis técnico completo — es lo que le da valor como caso de prueba.

No se incluyen las fotografías de evidencia originales, solo los hallazgos que documentan lo que se vio en ellas (ver `finding-ref-pvground-006-orientacion-fotos.json`).

## Por qué es un buen caso de referencia

No es un caso limpio de manual — tiene complejidad real: 48 puntos con tres tipos de electrodo distintos, un valor marcadamente fuera de rango con nota de campo contradictoria (PS12_03), un punto en el margen exacto del criterio (PS4_02), un criterio normativo mal aplicado por un cálculo automático de Excel a 14 de 48 puntos, y una particularidad técnica del archivo fuente (fotos insertadas como rich value de Excel) que exige lectura cuidadosa antes de declarar evidencia faltante.

El resultado de correr el workflow contra este caso fue `no_emit` — la revisión técnica exigió corrección antes de continuar. Ver `audit-decision-ref-pvground-001.json` y `review-ref-pvground-001.json` para el detalle.

## Contenido

| Archivo | Contrato | Contenido |
|---|---|---|
| `work-item-ref-pvground.json` | work-item | Expediente inicial de la campaña |
| `handoff-ref-pvground-001.json` | handoff | Entrega de domain_specialist a technical_reviewer |
| `finding-ref-pvground-001-trazabilidad.json` | finding | Trazabilidad foto-lectura (resuelto vía rich value) |
| `finding-ref-pvground-002-criterio-franklin.json` | finding | Criterio mal aplicado en 14 puntos Franklin |
| `finding-ref-pvground-003-ps12-outlier.json` | finding | Punto con valor fuera de rango y contradicción interna |
| `finding-ref-pvground-004-mesh-conforme.json` | finding | 33 puntos de malla conformes |
| `finding-ref-pvground-005-ps4-margen.json` | finding | Punto en el margen del criterio — evaluación no binaria |
| `finding-ref-pvground-006-orientacion-fotos.json` | finding | QA visual — orientación de fotos de muestra |
| `review-ref-pvground-001.json` | review | Revisión técnica — outcome `partial_rework` |
| `audit-decision-ref-pvground-001.json` | audit-decision | Auditoría — outcome `no_emit` |

Los 10 archivos están validados contra sus schemas reales (`contracts/*.schema.json`, Draft 2020-12) antes de subirse.
