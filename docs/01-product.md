# 01 · Producto

**Estado:** vigente · **Owner:** Producto · **Última actualización:** 2026-09-29

## Propósito

Fijar qué es Ámbito y qué entra en esta fase. Las reglas del expediente están en [04-domain-model.md](04-domain-model.md). La fase siguiente, con cuentas reales y base de datos, está en [07-fase-2.md](07-fase-2.md).

## Qué es

Ámbito es la herramienta de una consultora ambiental para llevar el expediente de cada empresa cliente. Cada cliente tiene sus datos (industria, provincia, municipio, año habilitante) y sus áreas. Cada área tiene requisitos: unos piden un archivo y otros son tareas.

En inicio cada cliente muestra su estado: vencidos, por vencer, faltan y sin OK. Ver expediente abre el cliente. La ficha se toca desde el menú. No es un tablero de todas las áreas a la vez.

`/` redirige a `/app`. La landing comercial quedó en `src/components/Landing.tsx`, sin usarse.

## Quién lo usa hoy

En el prototipo hay dos roles, con sesión local:

- **Técnico.** Carga archivos. Su nombre queda en la versión y no se tipea a mano. La cuenta de Dario (`dario` / `123`) entra con este rol.
- **Firmante.** Ve su bandeja en `/app/firmar` y da el OK de lo que tiene asignado (`firmante` / `ambito`).

Las cuentas de demostración viven en el cliente. No son un acceso de producción ([ADR-003](05-decisions.md#adr-003--el-acceso-del-prototipo-es-local-y-no-es-producción)).

## Qué hace el prototipo

- Crear clientes, corregir su ficha y eliminarlos. Al eliminar un cliente se borra su expediente.
- Abrir el expediente de ejemplo "Planta demo".
- Al abrir un cliente se ve primero su estado: vencidos, por vencer, faltan y sin OK. Tocar uno filtra la lista. La ficha se edita o se elimina desde el menú.
- Ver primero lo vencido, lo que vence en 30 días y lo que falta.
- Cargar un archivo con fecha de documento, vencimiento y firmante. El código se arma solo y se puede cambiar en opciones avanzadas.
- Eliminar una versión subida hasta que el firmante da el OK.
- Editar un archivo ya aprobado: se abre una versión nueva pendiente de OK y la aprobada queda en el historial.
- Ver en cada requisito quién hizo qué y cuándo.
- Conservar los clientes en el navegador. Un archivo grande se descarga en la misma pestaña, pero no sobrevive a una recarga.

## Qué no entra todavía

No hay cuentas reales, base de datos ni archivos en la nube. Dos personas en dos dispositivos no ven lo mismo. Eso es la [fase 2](07-fase-2.md).
