---
id: validate-campaign-input
name: Validación de datos de campaña
kind: transversal
status: draft
version: 0.1.0
---

# Propósito

Validar la estructura y calidad visible de los datos de una campaña antes de que un rol técnico los use. Esta skill no juzga la aceptación de los resultados.

Reemplaza a `validate-spreadsheet-input` (retirada): la fuente de datos de campaña dejó de ser un Excel suelto y pasó a ser una página estructurada del almacén externo de datos de campaña (capacidad `structured_campaign_store` de `registry/tools.yaml`; en el arnés Claude Code, la base de datos "Campañas P.A.T." y su sub-base relacionada "Puntos de medición P.A.T." — ver `CLAUDE.md` para el binding concreto). Un `.xlsx` suelto ya no basta para que el expediente alcance el estado `ready` (`docs/input-contract.md`); si un expediente llega solo con Excel, se bloquea y se solicita migrar los datos a la página de campaña antes de continuar.

# Entradas

- Página de campaña con sus propiedades (planta, código de expediente, revisión, alcance, fecha, personal, instrumento, criterio y fuente).
- Tabla de puntos de medición relacionada (una fila por punto).
- Estructura esperada o campos declarados en el work item.
- Contexto de unidades, si existe.

# Procedimiento

1. Registrar el identificador de la página de campaña y su revisión.
2. Confirmar que las propiedades obligatorias de la campaña están presentes (planta, código de expediente, revisión, alcance, instrumento, criterio y fuente).
3. Leer la tabla de puntos de medición completa: ID, activo/electrodo, ubicación, método, lectura R (Ω), límite aplicable, criterio y fuente, fotos de lectura y de ubicación/configuración, observaciones.
4. Verificar campos requeridos vacíos, IDs de punto duplicados, tipos de dato inconsistentes y lecturas no legibles o fuera de rango físico plausible.
5. Verificar que cada punto tenga al menos una foto de lectura adjunta como archivo, no solo como texto o enlace roto.
6. Preservar el valor y precisión visibles; no normalizar mediante suposición ni completar campos vacíos.
7. Producir una tabla normalizada de trabajo y un registro de incidencias, con referencia a la página de campaña de origen.

# Salidas

- Tabla normalizada con referencias a la página de campaña y a cada punto.
- Registro de validación de datos de campaña.
- Lista de problemas de calidad de datos (campos vacíos, duplicados, fotos faltantes, inconsistencias de unidades).

# Límites

- No modifica la página de campaña de origen salvo para marcar el estado de datos por punto que ya define su esquema (`Estado de datos`), y solo cuando ese campo está vacío o desactualizado.
- No redondea valores ni completa campos faltantes.
- No determina si una medición es Conforme o No conforme.
- Una campaña incompleta se marca como limitación o pendiente, no se corrige inventando datos.
