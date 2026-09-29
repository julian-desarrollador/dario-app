# 04 · Modelo de dominio

**Estado:** vigente · **Owner:** Producto + Arquitectura · **Última actualización:** 2026-09-28

## Propósito

Nombrar las piezas del expediente y las reglas que no dependen de la pantalla. El código dueño está en `src/modules/expediente/domain/` y `src/modules/clients/`.

## 1. Cliente

Un **cliente** es una empresa a la que la consultora le lleva el expediente ([ADR-006](05-decisions.md#adr-006--la-unidad-de-trabajo-es-el-cliente-de-la-consultora)). Tiene nombre, industria, provincia, municipio y año habilitante, y un conjunto de áreas.

El prototipo guarda varios clientes en el mismo navegador. Todavía no aísla consultoras entre sí.

## 2. Requisito

El **requisito** reemplaza al documento suelto y al checklist. Vive dentro de un tema, y el tema dentro de un área.

- **Archivo.** Pide una evidencia. Puede estar declarado (el catálogo dice que existe) o tener una versión con archivo.
- **Tarea.** Se marca hecha o pendiente. No tiene archivo.

El avance de un área es la proporción de requisitos al día o por vencer, sobre el total.

## 3. Estado

El estado no se elige a mano ([ADR-007](05-decisions.md#adr-007--el-estado-sale-del-vencimiento-y-de-la-evidencia)). `deriveStatus(requisito, hoy)` devuelve:

- **Falta.** No hay evidencia vigente y no está vencido.
- **Vencido.** La fecha de vencimiento ya pasó.
- **Por vencer.** Vence en 30 días o menos.
- **Al día.** Todo lo demás.

Una tarea sin marcar es falta. Si además tiene vencimiento pasado, es vencido.

## 4. Versión e historial

Cada carga es una **versión**. Mientras no tiene OK del firmante asignado, se puede eliminar. Los ejemplos del catálogo, que no se subieron en esta sesión, no se eliminan.

Si el archivo ya estaba aprobado, **Editar archivo** abre una versión nueva pendiente de OK. La aprobada pasa a `previous` y sigue en el historial ([ADR-008](05-decisions.md#adr-008--editar-un-archivo-aprobado-abre-una-versión-nueva)). Si se elimina la versión pendiente, vuelve la aprobada.

Cada acción (carga, reemplazo, OK, eliminación) agrega un evento con persona, momento y resumen. El historial no se reescribe desde la pantalla.

## 5. Migración

La clave vieja `ambito-prototype-areas-v1` se lee una vez y se convierte en el cliente "Planta demo" (`ambito-clients-v1`). Las fechas escritas como `15/08/2026` pasan a `dueDate`. Un ítem de checklist que repite el nombre de un documento del mismo tema no se copia: el requisito del documento ya lo cubre.
