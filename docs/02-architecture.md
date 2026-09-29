# 02 · Arquitectura

**Estado:** vigente · **Owner:** Arquitectura · **Última actualización:** 2026-09-28

## Propósito

Describir cómo se reparte la responsabilidad en Ámbito y qué reglas de dependencia no se negocian. La ubicación de los archivos está en [03-folder-structure.md](03-folder-structure.md).

## 1. Vista general

Hoy Ámbito es una aplicación Next.js. La landing es una página de servidor. `/app` es una página de cliente: la sesión y el expediente viven en el navegador (`sessionStorage` y `localStorage`). No hay API propia ni base de datos.

Eso es una decisión de prototipo ([ADR-002](05-decisions.md#adr-002--el-prototipo-persiste-en-el-navegador)), no la forma final del producto. El borde que habla con el navegador es reemplazable porque las reglas no viven ahí.

## 2. Capas

Clean Architecture rige las dependencias ([ADR-001](05-decisions.md#adr-001--clean-architecture-rige-las-dependencias)).

1. **Dominio.** Cliente, requisito, estado derivado del vencimiento, versiones e historial. TypeScript puro, sin React ni `window`.
2. **Aplicación.** Alta de cliente y migración del expediente anterior. Coordinan el dominio y no conocen el framework.
3. **Adaptadores.** La pantalla traduce clics y archivos. El almacenamiento del navegador implementa la persistencia.
4. **Framework.** Next.js y React componen las rutas. No deciden si una versión se puede borrar ni qué estado tiene un requisito.

Las dependencias apuntan hacia adentro. La cantidad de carpetas es proporcional: un módulo sin reglas propias no necesita `domain/`, y no se crean directorios vacíos para simular capas.

## 3. Flujo de una acción

Una acción de `/app` no cambia el expediente por su cuenta. Pasa el estado actual a una función de dominio y, si el resultado es válido, pinta el estado nuevo y lo guarda. Ejemplo: **Eliminar** llama `deletePendingVersion`. Si la versión ya tiene OK, la función la rechaza y la pantalla no la borra. El estado visible sale de `deriveStatus`, no de un clic en la etiqueta.

La lectura del archivo es del diálogo de carga, porque es entrada/salida del navegador. La decisión de guardarlo en `localStorage` o dejarlo solo en la sesión es de `keepsBinary`, no del componente. La clave vigente es `ambito-clients-v1`. Si esa clave no existe, el adaptador lee el expediente anterior (`ambito-prototype-areas-v1`) y lo convierte en el cliente Planta demo.

## 4. Restricciones

No se rompen sin un ADR:

- Toda operación de negocio entra por una función de dominio o de aplicación.
- Dominio y aplicación no importan React, Next.js ni `window`.
- `src/app/` no contiene las reglas del expediente. Compone módulos.
- Un módulo se importa desde su `index.ts`. No se importa el interior de otro módulo.
- No se accede a `localStorage` o `sessionStorage` fuera del adaptador de salida de ese módulo.
