---
id: validate-event-file-input
name: Validación de archivos de evento
kind: transversal
status: draft
version: 0.1.0
---

# Propósito

Validar la estructura y calidad visible de un archivo de evento (registro oscilográfico) antes de que un rol técnico lo use. Esta skill no juzga si el evento corresponde a una falla real — solo si el archivo es legible, consistente y consolidable.

# Entradas

- Archivo de evento (`.cfg`/`.dat` en formato COMTRADE, o formato propietario como `.evzip`/`.CEV`).
- Contexto de planta declarado (ajustes de relé vigentes, CTR/PTR, topología) cuando exista.
- Estructura o canales esperados según el work item.

# Procedimiento

1. Registrar artefacto de fuente, planta, circuito y fecha del evento.
2. Confirmar que el par `.cfg`/`.dat` es consistente (mismo número de canales declarados y presentes, misma frecuencia de muestreo, sin truncamiento) o que el contenedor propietario se pudo extraer sin corrupción.
3. Identificar canales de corriente y tensión por fase, y su relación declarada con el circuito y relé del contexto de planta.
4. Verificar que el CTR/PTR usado para convertir a valores primarios coincide con el declarado en el contexto de planta; si no hay contexto de planta con esos valores, marcarlo como dato faltante — no asumir un valor típico.
5. Detectar archivos con muestreo insuficiente, canales vacíos, timestamps inconsistentes o metadata contradictoria (ej. frecuencia nominal distinta a la de la red).
6. Preservar el valor y unidad originales del registro; no normalizar por suposición.
7. Producir un registro de validación y una lista de incidencias.

# Salidas

- Registro de validación del archivo de evento, con canales identificados y su relación con el circuito/relé.
- Lista de problemas de calidad de datos (truncamiento, canal faltante, CTR/PTR no verificable, metadata inconsistente).

# Límites

- No modifica el archivo fuente.
- No decide si el evento corresponde a una falla real, un falso disparo o una maniobra — eso es competencia de `analyze-comtrade-event` y `critique-fault-diagnosis-analysis`.
- No asume un CTR/PTR ni una frecuencia nominal no declarados; un archivo sin ese contexto queda con esa limitación explícita, no se completa por suposición.
