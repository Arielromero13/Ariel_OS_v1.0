# Orchestration API (MVP)

Este servidor saca la ejecución del navegador. Es el primer arnés operativo de Ariel OS, no una autorización de emisión.

## Qué implementa

- casos y work items persistidos como JSON locales;
- subida de un artefacto por solicitud, SHA-256 y almacenamiento inmutable por contenido;
- extracción de columnas candidatas de Excel P.A.T. (resistencia, electrodo, geometría y distancia);
- extracción EXIF de imágenes (fecha, GPS y orientación);
- empaquetado mínimo de contexto por etapa;
- llamadas server-side a Gemini, OpenAI o Claude;
- validación JSON Schema de evidence, finding, review, handoff, audit decision y report manifest;
- máximo de tres correcciones internas por work item; después queda bloqueado.

## Qué no implementa todavía

- autenticación de usuarios, multi-tenancy, base de datos o almacenamiento cloud;
- validación visual real de orientación: EXIF solo produce una señal; el revisor visual debe decidir;
- mapeo semántico definitivo de columnas Excel;
- adaptador Codex CLI/Claude Code local;
- generación DOCX/PPTX, aprobación humana o distribución externa.

## Arranque local

1. Copiar .env.example a .env y configurar solo las credenciales del servidor.
2. Ejecutar npm install.
3. Ejecutar npm run server:dev.
4. Levantar el cockpit con npm run dev.

En producción, ARIEL_OS_API_TOKEN es obligatorio. Ninguna llave de proveedor se expone al cliente React.

## Flujo API inicial

- POST /api/cases con case_id y metadata.
- POST /api/work-items con task_id, case_id, workflow_id y Definition of Done.
- POST /api/artifacts (multipart): case_id, role y file.
- POST /api/execute-stage: task_id, stage_id, provider y model.

Una respuesta de modelo válida crea un registro validado, pero no autoriza por sí misma la emisión. Una respuesta inválida entra en patch; al tercer ciclo, el work item queda blocked.
