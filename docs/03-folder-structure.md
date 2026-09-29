# 03 · Estructura de carpetas

**Estado:** vigente · **Owner:** Arquitectura · **Última actualización:** 2026-09-28

## Propósito

Establecer dónde va cada archivo. El árbol de abajo es el que el repositorio usa hoy, no un mapa de carpetas futuras.

## 1. Principios

Se organiza por módulo de dominio, no por tipo técnico ([ADR-004](05-decisions.md#adr-004--el-código-se-organiza-por-módulo-de-dominio)). Lo que cambia junto, vive junto. Una carpeta nueva se crea cuando tiene contenido.

Antes de agregar una carpeta o una dependencia, la pregunta es si la decisión sigue teniendo sentido cuando varias empresas usen Ámbito y más de una persona toque el código. Si la respuesta es no, no se implementa. El criterio está en [06-coding-standards.md](06-coding-standards.md).

## 2. Árbol

```
dario-app/
├── docs/                         documentación: la fuente de verdad
├── public/                       estáticos servidos tal cual
└── src/
    ├── app/                      rutas de Next.js, borde de entrada
    │   ├── page.tsx              landing
    │   ├── layout.tsx
    │   └── app/
    │       ├── layout.tsx        sesión, encabezado
    │       ├── page.tsx          clientes
    │       ├── firmar/page.tsx   bandeja del firmante
    │       └── [clientId]/
    │           ├── page.tsx      pendientes y áreas
    │           └── [areaId]/page.tsx
    ├── components/
    │   ├── Landing.tsx
    │   └── ui/                   Button, Dialog y Menu sobre Base UI
    ├── lib/utils.ts              cn
    └── modules/
        ├── clients/              alta, migración y almacenamiento
        ├── expediente/           requisitos, estado, versiones, historial
        └── session/              cuentas demo y sesión del navegador
```

Los archivos de configuración viven en la raíz porque las herramientas los buscan ahí: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`.

## 3. Rutas

`src/app/` compone. Puede llamar casos de uso. No decide reglas ni lee `localStorage` por su cuenta.

| Ruta | Qué es |
| --- | --- |
| `/` | Landing comercial |
| `/app` | Clientes de la consultora |
| `/app/firmar` | Bandeja del firmante |
| `/app/[clientId]` | Pendientes y áreas de un cliente |
| `/app/[clientId]/[areaId]` | Requisitos del área |
| `/idea`, `/conversacion` | Redirigen a `/app` |

## 4. Módulos

| Módulo | Responsabilidad | Documento |
| --- | --- | --- |
| `clients` | Clientes de la consultora, migración del prototipo anterior y persistencia | [04-domain-model.md](04-domain-model.md) |
| `expediente` | Requisitos, vencimiento, versiones, OK e historial | [04-domain-model.md](04-domain-model.md) |
| `session` | Quién entró y la lista de firmantes | [01-product.md](01-product.md) |

`session` no importa `expediente`. La pantalla pasa el usuario de la sesión al caso de uso. Así el expediente no conoce `sessionStorage`.

## 5. Nombres

Archivos y carpetas en kebab-case. Un componente de React por archivo, en PascalCase. El código se escribe en inglés y los textos de interfaz en español.

Excepción deliberada: los campos ya guardados en el navegador (`tecnico`, `firmante`, `firmanteOk`, `ingresoDate`) conservan el nombre en español. Renombrarlos rompería los expedientes que la gente ya tiene en `localStorage`.

## 6. Dependencias entre capas

1. `domain/` importa solo TypeScript del mismo módulo.
2. `application/` importa `domain/`. No importa React, Next.js ni `window`.
3. `adapters/` y `components/` importan hacia adentro. Son el único lugar del módulo que toca el navegador o pinta UI.
4. `src/app/` importa la superficie pública del módulo (`index.ts`), nunca un archivo interno.
5. `src/components/` (la landing) no importa módulos de la aplicación.
