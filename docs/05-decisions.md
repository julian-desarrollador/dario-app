# 05 · Registro de decisiones (ADR)

**Estado:** vigente · **Owner:** Arquitectura · **Última actualización:** 2026-09-28

## Propósito

Conservar por qué el sistema es como es. Una decisión aceptada no se edita: si deja de valer, una decisión nueva la declara obsoleta.

## Cómo se usa

Toda decisión costosa de revertir se escribe acá antes de implementarse. Una decisión en estado *propuesta* no habilita código.

Cada entrada tiene número, título, fecha, estado, contexto, decisión, alternativas y consecuencias.

## Índice

| # | Decisión | Fecha | Estado |
| --- | --- | --- | --- |
| [001](#adr-001--clean-architecture-rige-las-dependencias) | Clean Architecture rige las dependencias | 2026-09-28 | Aceptada |
| [002](#adr-002--el-prototipo-persiste-en-el-navegador) | El prototipo persiste en el navegador | 2026-09-28 | Aceptada |
| [003](#adr-003--el-acceso-del-prototipo-es-local-y-no-es-producción) | El acceso del prototipo es local y no es producción | 2026-09-28 | Aceptada |
| [004](#adr-004--el-código-se-organiza-por-módulo-de-dominio) | El código se organiza por módulo de dominio | 2026-09-28 | Aceptada |
| [005](#adr-005--la-documentación-es-la-fuente-de-verdad) | La documentación es la fuente de verdad | 2026-09-28 | Aceptada |
| [006](#adr-006--la-unidad-de-trabajo-es-el-cliente-de-la-consultora) | La unidad de trabajo es el cliente de la consultora | 2026-09-28 | Aceptada |
| [007](#adr-007--el-estado-sale-del-vencimiento-y-de-la-evidencia) | El estado sale del vencimiento y de la evidencia | 2026-09-28 | Aceptada |
| [008](#adr-008--editar-un-archivo-aprobado-abre-una-versión-nueva) | Editar un archivo aprobado abre una versión nueva | 2026-09-28 | Aceptada |
| [009](#adr-009--los-diálogos-y-menús-usan-base-ui) | Los diálogos y menús usan Base UI | 2026-09-28 | Aceptada |
| [010](#adr-010--la-consultora-es-el-tenant) | La consultora es el tenant | 2026-09-28 | Propuesta |
| [011](#adr-011--clerk-identifica-y-la-base-guarda-los-roles) | Clerk identifica y la base guarda los roles | 2026-09-28 | Propuesta |
| [012](#adr-012--postgresql-y-r2) | PostgreSQL y R2 | 2026-09-28 | Propuesta |
| [013](#adr-013--el-historial-no-se-edita) | El historial no se edita | 2026-09-28 | Propuesta |

## Decisiones

### ADR-001 · Clean Architecture rige las dependencias

**Fecha:** 2026-09-28 · **Estado:** aceptada

**Contexto.** El prototipo acumuló reglas del expediente dentro de la pantalla: quién puede borrar, quién da el OK, cómo se arma un registro. Eso se puede seguir haciendo mientras hay un solo archivo, y se vuelve imposible de probar o de cambiar cuando aparezca una base de datos o una segunda pantalla.

**Decisión.** Las dependencias apuntan hacia el dominio. Las reglas viven en `domain/` y los casos de uso en `application/`. React, Next.js y el almacenamiento son adaptadores. No se crean interfaces ni carpetas vacías para completar un diagrama.

**Alternativas consideradas.** Dejar la lógica en los componentes hasta tener backend. Se descarta porque el costo de extraerla crece con cada regla nueva, y las reglas del OK y del borrado ya son reglas de negocio.

**Consecuencias.** Un caso de uso se prueba sin navegador. A cambio, una acción de la UI da un paso más: la pantalla llama el caso de uso en lugar de mutar el objeto ella misma.

### ADR-002 · El prototipo persiste en el navegador

**Fecha:** 2026-09-28 · **Estado:** aceptada

**Contexto.** Ámbito se muestra en vivo, sin servidor de datos. Hace falta que un registro cargado siga ahí al recargar, y que un área nueva del catálogo aparezca aunque ya haya datos viejos.

**Decisión.** El expediente se guarda en `localStorage` bajo `ambito-prototype-areas-v1`. La sesión, en `sessionStorage` bajo `ambito-session-user`. El adaptador `browser-expediente-store` es el único que lee y escribe el expediente. Al cargar, se fusionan las áreas guardadas con las que falten del catálogo. Un archivo mayor a 1,5 MB no se persiste.

**Alternativas consideradas.** Base de datos desde ahora. Se descarta: no hay todavía una decisión de aislamiento entre empresas, y una tabla creada por adelantado fija un esquema que el producto todavía está descubriendo con Dario.

**Consecuencias.** El prototipo funciona sin cuentas reales ni despliegue de datos. Los datos son de ese navegador. Cuando exista más de una empresa, esta decisión se reemplaza: el caso de uso no debería cambiar, el adaptador sí.

### ADR-003 · El acceso del prototipo es local y no es producción

**Fecha:** 2026-09-28 · **Estado:** aceptada

**Contexto.** El técnico del registro tiene que ser quien entró, y el firmante tiene que ser una persona de la lista, no un nombre escrito a mano. Hace falta distinguir las dos sesiones en la demo.

**Decisión.** Hay dos cuentas en el cliente, `tecnico` y `firmante`, con la misma clave de demostración. `authenticate` no toca el navegador. El adaptador de sesión guarda solo el usuario, nunca la clave. El expediente recibe un `Actor` (`id`, `name`, `role`) y no lee la sesión.

**Alternativas consideradas.** Un campo de técnico editable, o un proveedor de identidad real. Lo primero no cumple el pedido. Lo segundo es una decisión aparte, para cuando el prototipo deje de ser una demo.

**Consecuencias.** Se puede mostrar el flujo técnico → firmante sin backend. Las claves están en el código del cliente y no protegen nada. No se reutiliza este mecanismo como login de producción.

### ADR-004 · El código se organiza por módulo de dominio

**Fecha:** 2026-09-28 · **Estado:** aceptada

**Contexto.** Agrupar por tipo (`components/`, `hooks/`, `utils/`) es cómodo al principio y mezcla reglas de productos distintos en cuanto hay más de una persona en el repositorio.

**Decisión.** Cada módulo vive en `src/modules/<modulo>/` con dominio, casos de uso y adaptadores adentro. La superficie pública es `index.ts`. Hoy los módulos son `expediente` y `session`. La landing queda en `src/components/` porque no usa el expediente.

**Alternativas consideradas.** Feature-Sliced Design, o dejar `src/app/app/` como único lugar del prototipo. El segundo ya mezclaba datos, reglas y pantalla. El primero agrega capas (pages, widgets, features, entities) que este tamaño no usa.

**Consecuencias.** Un cambio del OK se busca dentro de `expediente`. Un módulo no importa el interior de otro. No se abre un tercer módulo hasta que tenga una responsabilidad propia.

### ADR-005 · La documentación es la fuente de verdad

**Fecha:** 2026-09-28 · **Estado:** aceptada

**Contexto.** Las reglas del producto (qué se puede borrar, qué significa el avance, qué es demo y qué no) se perdían en el chat y en la pantalla. Quien retoma el proyecto no tiene un lugar único para leerlas.

**Decisión.** `docs/` se versiona con el código. Cada tema tiene un documento dueño. Un cambio de comportamiento actualiza ese documento en el mismo cambio. No se crean documentos vacíos para temas que el producto todavía no tiene.

**Alternativas consideradas.** Comentarios en el código, o un wiki aparte. Los comentarios no se encuentran. Un wiki se desfasa del commit.

**Consecuencias.** El repositorio explica por qué está armado así. Hay que tocar un markdown cuando cambia una regla, no solo el componente.

### ADR-006 · La unidad de trabajo es el cliente de la consultora

**Fecha:** 2026-09-28 · **Estado:** aceptada

**Contexto.** La pantalla trataba un solo expediente anónimo. Industria, provincia y año eran selectores que no cambiaban los datos. La consultora de Dario necesita llevar varias empresas.

**Decisión.** La unidad de trabajo es el cliente. Cada cliente tiene su ficha y su expediente. La pantalla de inicio lista clientes. `src/modules/clients/` existe porque el alta y la migración no son reglas de un requisito.

**Alternativas consideradas.** Seguir con un expediente único y filtros de industria. Se descarta: no representa a la consultora y los filtros no filtraban nada.

**Consecuencias.** Hay una ruta por cliente y por área. El prototipo sigue en un solo navegador: varios clientes no significa todavía varias consultoras aisladas.

### ADR-007 · El estado sale del vencimiento y de la evidencia

**Fecha:** 2026-09-28 · **Estado:** aceptada

**Contexto.** El estado se cambiaba tocando una etiqueta. No había fecha de vencimiento, así que "por vencer" no significaba nada.

**Decisión.** `deriveStatus` calcula falta, vencido, por vencer (30 días) o al día a partir de la evidencia y de `dueDate`. La etiqueta no es un botón.

**Alternativas consideradas.** Dejar el ciclo manual ok → por vencer → falta. Se descarta porque contradice lo que la landing promete.

**Consecuencias.** Un requisito cambia de estado solo porque pasó el tiempo o porque se cargó evidencia. Las pruebas fijan la fecha de "hoy".

### ADR-008 · Editar un archivo aprobado abre una versión nueva

**Fecha:** 2026-09-28 · **Estado:** aceptada

**Contexto.** Dario pidió poder eliminar un registro hasta el OK del firmante, y que editar el archivo siguiera disponible. Si editar pisa el archivo aprobado, se pierde la evidencia que el firmante ya aceptó. Esta regla se construye porque el plan de producto la fijó para esta fase: la versión aprobada queda en el historial y la nueva espera OK.

**Decisión.** Una versión subida y sin OK se puede eliminar. Una versión con OK no se borra. Editarla crea la versión siguiente, pendiente de OK, y la aprobada pasa a `previous`. Cada paso deja un evento de historial.

**Alternativas consideradas.** Sobrescribir el archivo aprobado. Se descarta: borra la trazabilidad que el producto promete mostrar.

**Consecuencias.** El firmante vuelve a dar OK cuando hay una versión nueva. Eliminar la pendiente restaura la aprobada.

### ADR-009 · Los diálogos y menús usan Base UI

**Fecha:** 2026-09-28 · **Estado:** aceptada

**Contexto.** Confirmar un borrado y abrir el menú de un requisito necesitan foco atrapado, cierre con Escape y navegación por teclado. Escribirlo a mano se desalinea en cuanto hay dos diálogos.

**Decisión.** Los primitivos de diálogo, menú y botón salen de Base UI (`@base-ui/react`), con estilos propios en `src/components/ui/`. No se adopta el tema oscuro ni el resto del catálogo de shadcn.

**Alternativas consideradas.** Diálogos con un `div` fijo, como el modal anterior. Se descarta para las acciones destructivas y los menús.

**Consecuencias.** Hay dependencias nuevas (`@base-ui/react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`). El color de acción de la app es el verde de la marca, no el azul.

### ADR-010 · La consultora es el tenant

**Fecha:** 2026-09-28 · **Estado:** propuesta

**Contexto.** La fase 2 tiene que separar los datos de cada consultora. El modelo de la fase 1 ya tiene clientes adentro de un solo espacio.

**Decisión propuesta.** Una consultora es el tenant. Los clientes son entidades hijas, no tenants. El aislamiento es el de una base compartida con columna de tenant, como en `saas-turnos`, y se cierra en un ADR de datos cuando esta decisión se acepte.

**Alternativas consideradas.** Un tenant por empresa cliente. Se deja de lado en la propuesta: la consultora es quien paga y quien opera varios clientes.

**Consecuencias.** No se escribe código de tenant hasta aceptar esta decisión. El detalle operativo está en [07-fase-2.md](07-fase-2.md).

### ADR-011 · Clerk identifica y la base guarda los roles

**Fecha:** 2026-09-28 · **Estado:** propuesta

**Contexto.** El login demo no sirve para dos dispositivos ni para invitar a un firmante de una empresa.

**Decisión propuesta.** Clerk responde quién es la persona. El rol (técnico, firmante, consultor) y la pertenencia a la consultora viven en la base propia.

**Alternativas consideradas.** Seguir con usuarios en el cliente. No alcanza para un lanzamiento.

**Consecuencias.** Sustituye a [ADR-003](#adr-003--el-acceso-del-prototipo-es-local-y-no-es-producción) cuando se acepte. Hasta entonces ADR-003 sigue vigente.

### ADR-012 · PostgreSQL y R2

**Fecha:** 2026-09-28 · **Estado:** propuesta

**Contexto.** `localStorage` no se comparte y no admite archivos grandes.

**Decisión propuesta.** PostgreSQL con Prisma para clientes, requisitos, versiones e historial. Los archivos van a Cloudflare R2 y se descargan con un enlace firmado. El adaptador nuevo reemplaza a `browser-client-store`. Los casos de uso no cambian.

**Alternativas consideradas.** Guardar el binario en la base. Se deja de lado: mezcla documentos pesados con el expediente.

**Consecuencias.** Hace falta backup y un entorno de base antes de aceptar la decisión.

### ADR-013 · El historial no se edita

**Fecha:** 2026-09-28 · **Estado:** propuesta

**Contexto.** La trazabilidad que se muestra en la fase 1 es un arreglo en el requisito. En una base, alguien podría actualizar esa fila.

**Decisión propuesta.** Los eventos de historial se insertan y no se actualizan ni se borran. Una corrección es un evento nuevo.

**Alternativas consideradas.** Un historial editable por el consultor. Se deja de lado: deja de servir como evidencia.

**Consecuencias.** La auditoría depende de que la base no ofrezca un update de esa tabla al rol de la aplicación.

