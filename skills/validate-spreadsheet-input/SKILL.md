---
id: validate-spreadsheet-input
name: Validación de matrices y hojas de cálculo
kind: transversal
status: draft
version: 0.1.0
---

# Propósito

Validar la estructura y calidad visible de una matriz antes de que un rol técnico la use. Esta skill no juzga la aceptación de los resultados.

# Entradas

- Hoja de cálculo o tabla fuente.
- Estructura esperada o campos declarados en el work item.
- Contexto de unidades, si existe.

# Procedimiento

1. Registrar artefacto de fuente y revisión.
2. Identificar hojas, encabezados, filas y unidades.
3. Verificar columnas requeridas, celdas vacías, duplicados, tipos y valores no legibles.
4. Preservar el valor y precisión visibles; no normalizar mediante suposición.
5. Producir una tabla normalizada de trabajo y un registro de incidencias.

# Salidas

- Tabla normalizada con referencias a la fuente.
- Registro de validación de hoja de cálculo.
- Lista de problemas de calidad de datos.

# Límites

- No modifica el archivo fuente.
- No redondea valores ni completa campos faltantes.
- No determina si una medición es Conforme o No conforme.
- Una tabla incompleta se marca como limitación o pendiente, no se corrige inventando datos.
