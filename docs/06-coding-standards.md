# 06 · Estándares de código

**Estado:** vigente · **Owner:** Arquitectura · **Última actualización:** 2026-09-28

## Propósito

Que el proyecto se lea como escrito por una sola persona. Las reglas de dependencia están en [02-architecture.md](02-architecture.md). Dónde va cada archivo, en [03-folder-structure.md](03-folder-structure.md).

## 1. Principios

Claridad antes que ingenio. Funciones chicas. No se abstrae algo que tiene un solo uso. Se borra el código que ya no se llama.

Antes de crear una carpeta o sumar una dependencia: **¿esto sigue teniendo sentido cuando varias empresas usen Ámbito y más de una persona trabaje en el código?** Si la respuesta es no, no se implementa. Si es sí pero no es obvio, el motivo queda en el documento del tema o en un ADR.

La prueba de una regla de dominio es concreta: **¿este archivo se puede ejecutar si mañana no está Next.js?** Para `domain/` y `application/`, la respuesta es sí. `npm test` corre esas reglas sin levantar la aplicación.

## 2. TypeScript

Modo estricto. Sin `any`. Los tipos del expediente salen de `domain/model.ts`. Se valida en el borde: el modal y los adaptadores traducen entrada cruda; el caso de uso recibe un comando ya tipado.

## 3. React

La landing puede ser un Server Component. `/app` es cliente porque la sesión y el expediente están en el navegador. Un componente no decide si una versión se borra: llama `deletePendingVersion` o `canDeleteVersion`.

## 4. Errores

La función de dominio devuelve un resultado (`ok` y, si falla, un `reason` estable: `not-found`, `not-deletable`, `not-allowed`, `signer-required`). La pantalla elige el texto en español. El dominio no arma frases de la interfaz, salvo los rótulos de estado (`Al día`, `Por vencer`, `Vencido`, `Falta`).

## 5. Nombres e idioma

Código en inglés. Textos de la interfaz en español. Los imports relativos dentro de `src/modules/` incluyen la extensión (`.ts` o `.tsx`). Así el mismo archivo corre en Next y en `npm test`, que usa el runner de Node. Campos ya persistidos (`tecnico`, `firmanteOk`, `ingresoDate`) no se renombran: están en los datos del navegador. La excepción está en [03-folder-structure.md](03-folder-structure.md).

## 6. Pruebas

Las pruebas viven al lado del código, con sufijo `.test.ts`. `describe` nombra la función. `it` es una frase en español que dice el comportamiento.

En dominio y casos de uso, primero el comportamiento que tiene que cumplirse y después el código mínimo. No se exige ese ciclo para la disposición visual de la landing o de la pantalla.

Una prueba que pasa sin el código nuevo no está probando nada. Un refactor deja las mismas pruebas en verde.

## 7. Comentarios

Un comentario explica una restricción que el código no muestra (por qué un archivo grande no se persiste, por qué un campo quedó en español). No narra qué hace la línea siguiente.

## 8. Definición de terminado

Un cambio de comportamiento está terminado cuando el caso de uso o la regla tiene prueba, la pantalla llama esa regla, y el documento dueño dice lo mismo que el código.
