# Control Room: límites de seguridad y evolución

## Estado actual

La aplicación React es un **Control Room de prototipo**. Puede visualizar work
items, estados, artefactos declarados y simulaciones de conversación. No es el
motor de ejecución autorizado de expedientes reales.

Una simulación nunca puede:

- aprobar una etapa;
- cambiar una compuerta de emisión;
- crear evidencia válida;
- marcar un criterio normativo como verificado;
- registrar aprobación humana;
- emitir o distribuir un entregable.

## Frontera de ejecución

El navegador no almacena secretos de producción ni ejecuta CLIs nativos. Las
integraciones con Codex CLI, Claude Code, Antigravity o APIs se ejecutarán
solamente desde un worker autorizado que tenga:

1. identidad y permisos explícitos;
2. un expediente aislado;
3. acceso limitado a los artefactos del caso;
4. registros de auditoría;
5. un adaptador verificable para el arnés elegido.

La aplicación web se comunica con una API segura. La API orquesta workers; los
workers leen el repositorio, validan contratos y producen artefactos trazables.

## Flujo obligatorio

```text
UI → API de orquestación → worker autorizado → adaptador de arnés/modelo
                                  ↓
                          validación JSON Schema
                                  ↓
                         registros inmutables y compuertas
```

Una respuesta de modelo se considera borrador hasta que produce un registro
estructurado válido y la compuerta requerida lo acepta.

## Datos de demostración

Todo dato de `src/data/mockData.ts` es sintético. No representa una planta,
norma aplicada, lectura de campo ni recomendación válida. En particular, ningún
umbral genérico de resistencia puede atribuirse a una norma sin fuente, edición,
cláusula y aplicabilidad verificables para el caso.

## Próximos pasos técnicos

1. Persistencia de casos, revisiones y artefactos.
2. API de orquestación y workers de documentos, imágenes y hojas de cálculo.
3. Validación de registros contra los contratos de `contracts/`.
4. Adaptador real, documentado y autorizado para un solo arnés.
5. Caso ficticio de punta a punta antes de utilizar evidencia real.
