# Matriz de roles

**Estado:** Draft  
**Propósito:** Definir responsabilidades lógicas, handoffs, límites e independencia requerida. Los roles no implican subagentes permanentes; el orquestador decide si los ejecuta secuencialmente o los delega según dependencias, riesgo y complejidad.

## Reglas de activación

- En tareas simples, el orquestador puede ejecutar varios roles de forma secuencial.
- Las tareas independientes pueden ejecutarse en paralelo después de que sus entradas estén disponibles.
- Antes de emisión externa o en decisiones técnicas sensibles, revisión y auditoría deben usar contexto independiente del productor del borrador.
- Ningún rol puede alterar silenciosamente evidencia, conclusiones aprobadas o el mandato original.

## Matriz

| Rol | Recibe | Produce | Puede decidir | No puede decidir | Escala cuando | Independencia |
|---|---|---|---|---|---|---|
| Orquestador | Solicitud, expediente, revisiones y resultados de otros roles. | Work item, execution brief, selección de workflow, decisión de flujo, reformulation brief. | Prioridad, secuencia, delegación, tipo de corrección y preservación de artefactos. | Validez técnica final de su propio resultado ni aprobación externa. | Faltan requisitos duros, intención ambigua, desacuerdo material o ciclos agotados. | Puede ejecutar otros roles en bajo riesgo; no debe auditar su propia decisión de emisión. |
| Especialista técnico | Evidencia actual, contexto de método/instrumento, alcance y skill del dominio. | Matriz validada, hallazgos, limitaciones, estados provisionales y trazabilidad. | Interpretaciones dentro de evidencia y alcance documentados. | Inventar datos, declarar criterio no sustentado o aprobar su propio análisis como definitivo. | Evidencia ilegible, método/configuración insuficiente o contradicción de campo. | Revisión independiente requerida para conclusiones materiales. |
| Investigador normativo | Contexto técnico, fuentes disponibles y pregunta de criterio. | Registro de criterios, citas, evaluación de aplicabilidad y pendientes normativos. | Si una fuente está verificada y aplica al caso documentado. | Convertir una referencia no verificada en límite de aceptación. | No existe fuente, edición, cláusula o aplicabilidad verificable. | Puede correr en paralelo con análisis técnico; revisión técnica consume su salida. |
| Revisor técnico | Matriz, evidencia, hallazgos, limitaciones y criterios. | Registro de revisión, aprobación técnica o solicitud de corrección. | Aprobar análisis, pedir patch o partial rework, rechazar conclusiones no sustentadas. | Cambiar la intención del usuario o reescribir todo sin causa base. | Hay riesgo técnico, evidencia conflictiva, criterio no aplicable o desacuerdo material. | Debe ser independiente del especialista que produjo el análisis cuando el resultado afecta emisión. |
| Integrador | Componentes técnicamente aprobados, plantilla y reglas de presentación. | Borrador Word/PDF, matriz integrada, galería y manifest de entregables. | Ordenar y maquetar artefactos; señalar inconsistencias entre piezas. | Alterar hallazgos, valores, criterio o recomendaciones aprobadas. | Las piezas aprobadas se contradicen o faltan componentes obligatorios. | Revisión visual independiente obligatoria antes de emisión. |
| Revisor visual | Documento renderizado, galería, matriz y referencias de evidencia. | Registro de QA visual, aprobación visual o solicitud de corrección. | Exigir corrección de orientación, orden, correspondencia, recorte, legibilidad y paginación. | Alterar interpretación técnica o aprobar evidencia ilegible como lectura válida. | Foto ambigua, falta de correspondencia o defecto visual que compromete trazabilidad. | Debe revisar el documento renderizado, no sólo los nombres de archivos. |
| Auditor | Registros de decisión, revisiones, QA, Definition of Done y entregable candidato. | Decisión razonada: aprobar, bloquear o escalar; registro de auditoría. | Evaluar si la decisión cumple evidencia, proceso y reglas. | Rehacer el análisis técnico por cuenta propia ni sustituir la aprobación humana requerida. | Revisor, orquestador y auditor discrepan; falta evidencia crítica; se agotaron ciclos. | Debe operar con contexto fresco y no haber sido autor principal del borrador. |

## Handoffs obligatorios

```text
Orquestador → Especialista: execution brief + evidencia y alcance congelados por revisión
Especialista → Revisor técnico: hallazgos + matriz + trazabilidad + limitaciones
Investigador normativo → Revisor técnico: criterio + fuente + edición + cláusula + aplicabilidad
Revisor técnico → Integrador: componentes aprobados + correcciones explícitas
Integrador → Revisor visual: documento renderizado + galería + matriz
Revisor visual → Orquestador: QA visual aprobado o corrección acotada
Orquestador → Auditor: Definition of Done + registros de decisión + entregable candidato
Auditor → Usuario/responsable: aprobación, bloqueo o escalamiento razonado
```

## Tipos de ejecución

| Situación | Ejecución recomendada |
|---|---|
| Inventario o tarea simple de bajo riesgo | Orquestador secuencial con autocheck. |
| Informe técnico estándar | Orquestador + especialista + revisor técnico + integrador + QA visual. |
| Criterio normativo relevante o incierto | Análisis técnico y normativo en paralelo; revisión técnica independiente. |
| Emisión externa o decisión sensible | Revisión técnica, QA visual, auditoría independiente y aprobación humana. |

## Extensión — equipo de presentaciones (workflow `presentation-deck`)

El trabajo creativo de una presentación no es una sola interpretación de evidencia: separa contenido, sistema visual y mensaje persuasivo como disciplinas distintas y en parte paralelas. Por eso este dominio no reutiliza `domain_specialist` / `normative_researcher` / `technical_reviewer` con una skill distinta — añade cuatro roles propios. `orchestrator`, `integrator`, `visual_reviewer` y `auditor` de la matriz principal se reutilizan sin cambios: el integrador actúa como maquetador (ensambla el PPTX), y el revisor visual hace QA sobre el renderizado igual que con un Word.

| Rol | Recibe | Produce | Puede decidir | No puede decidir | Escala cuando | Independencia |
|---|---|---|---|---|---|---|
| Estratega de contenido | Brief, contenido fuente, audiencia y Definition of Done. | Estructura de slides, mensajes clave, pendientes de contenido. | Priorización y estructura dentro del contenido fuente disponible. | Inventar cifras o resultados, decidir el sistema visual, aprobar su propia narrativa. | Contenido fuente insuficiente, audiencia/objetivo ambiguos, fuentes contradictorias. | Revisión independiente de narrativa requerida para presentaciones de alta visibilidad. |
| Diseñador visual | Narrativa aprobada, guía de marca o criterio por defecto, material visual disponible. | Sistema visual: paleta, tipografía, arquetipos de slide, reglas de layout. | Forma visual dentro de la narrativa aprobada. | Modificar mensajes, datos o estructura narrativa; decidir contenido persuasivo. | Ausencia de guía de marca sin criterio por defecto, material visual insuficiente para una slide crítica. | Su salida se audita en QA visual antes de emisión. |
| Copywriter de marketing | Narrativa aprobada, audiencia, decisión que se busca provocar. | Titulares, llamados a la acción y posicionamiento afinados. | Framing persuasivo dentro del contenido aprobado. | Inventar cifras, resultados o promesas no sustentadas. | El tono persuasivo solicitado excede lo que el contenido aprobado puede sostener. | Rol bajo demanda — solo se activa si el propósito persuasivo está declarado explícitamente. |
| Revisor de narrativa | Narrativa, copy, contenido fuente, audiencia y Definition of Done. | Registro de revisión, narrativa aprobada o solicitud de corrección. | Aprobar narrativa, pedir patch o partial rework, rechazar afirmaciones sin respaldo. | Decidir el sistema visual ni la maquetación. | Desacuerdo material con el estratega, cifra sin respaldo persistente, audiencia/objetivo cambiado sin reformulación. | Debe ser independiente del estratega de contenido en presentaciones de alta visibilidad. |

```text
Orquestador → Estratega de contenido: execution brief + audiencia, objetivo y contenido fuente congelados
Estratega de contenido → Diseñador visual: narrativa aprobada + tipo de presentación
Estratega de contenido → Copywriter de marketing (si aplica): narrativa aprobada + propósito persuasivo declarado
Diseñador visual / Copywriter de marketing → Revisor de narrativa: sistema visual + copy afinado
Revisor de narrativa → Integrador: narrativa aprobada + sistema visual + correcciones explícitas
Integrador → Revisor visual: PPTX renderizado + sistema visual aprobado
Revisor visual → Orquestador: QA visual aprobado o corrección acotada
Orquestador → Auditor: Definition of Done + registros de decisión + PPTX candidato
Auditor → Usuario/responsable: aprobación, bloqueo o escalamiento razonado
```

## Próximo uso

Cada archivo `AGENT.md` debe derivarse de esta matriz y contener: misión, entradas, salidas, autoridad, prohibiciones, criterios de handoff, escalamiento, herramientas permitidas y reglas de independencia.
