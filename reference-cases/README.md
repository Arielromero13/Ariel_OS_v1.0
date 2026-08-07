# Casos de referencia — suite mínima de evaluación

Esta carpeta es la suite de regresión de Ariel Agent OS. No sustituye una evaluación automatizada con CI (el sistema es principalmente instrucciones en markdown/YAML, no código con tests unitarios), pero cumple el mismo propósito a la escala de este proyecto: cada caso documenta un expediente completo con su **resultado esperado**, para poder volver a correrlo cuando cambie una skill, un workflow o un contrato, y detectar si algo se rompió en silencio.

## Cómo usar esta suite

1. Antes de modificar una skill, un workflow o un contrato en `contracts/`, identificá qué caso(s) de esta carpeta ejercitan esa pieza (ver la tabla abajo).
2. Después del cambio, releé el caso: ¿el `work-item` sigue siendo válido contra su schema? ¿Los `finding`/`review`/`audit-decision` documentados siguen siendo el resultado que el sistema produciría hoy, dado el mismo expediente?
3. Si el cambio invalida un caso, no se corrige el caso para que "pase" — se decide explícitamente si el caso quedó obsoleto (y se documenta por qué) o si el cambio introdujo una regresión real (y se revierte o corrige el cambio).
4. Antes de subir un caso nuevo, validalo contra su contrato real:

```bash
python3 -c "
import json, jsonschema
schema = json.load(open('contracts/finding.schema.json'))
data = json.load(open('reference-cases/mi-caso/finding-X.json'))
jsonschema.validate(data, schema)
print('OK')
"
```

## Regla de anonimización (no negociable, ver `docs/governance.md`)

- Un caso derivado de un expediente real **debe** anonimizarse antes de subirse: nombre de planta, personal, códigos de proyecto y números de serie ficticios; los valores técnicos (mediciones, ajustes, criterios) se conservan porque son lo que le da valor al caso. Ver `pvground-001-anonymized/README.md` para el criterio aplicado.
- Un caso **construido** (no derivado de un expediente real) debe declararlo explícitamente en su propio README — nunca presentarse como si fuera un caso real anonimizado. Ver `comtrade-fault-002-fictional/README.md`.
- En ambos casos: cero datos que permitan identificar a un cliente, planta o persona real de EGEHAINA.

## Casos disponibles

| Caso | Dominio | Origen | Resultado esperado | Qué prueba específicamente |
|---|---|---|---|---|
| [`pvground-001-anonymized`](pvground-001-anonymized/README.md) | P.A.T. (`grounding-report`) | Campaña real anonimizada | `no_emit` | Trazabilidad foto-lectura (rich value de Excel), criterio mal aplicado por tipo de activo, outlier con contradicción interna, punto en el margen del criterio |
| [`comtrade-fault-002-fictional`](comtrade-fault-002-fictional/README.md) | COMTRADE (`comtrade-fault-analysis`) | Construido (ficticio) | `no_emit` | Cruce de ajuste correcto, descarte de falso disparo, y el caso central: una conclusión de "causa confirmada" que excede la evidencia de oscilografía disponible (pregunta 7 de `critique-fault-diagnosis-analysis`) |

Ningún caso de esta suite termina en `emitido` a propósito: un caso donde todo sale limpio prueba mucho menos que uno donde el sistema tiene que atrapar algo real.

## Pendiente

- Un tercer caso que sí llegue a `ready_for_emission` limpio, para probar el camino feliz completo (incluida la publicación vía `publish-approved-deliverable`) y no solo los caminos de rechazo.
- Casos que ejerciten específicamente los dominios Tier 2 (aunque ahí el bar de evidencia esperado es más bajo, por diseño — ver `docs/governance.md`, "Nivel de rigor por dominio").
