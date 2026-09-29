# 07 · Fase 2 · Producto real

**Estado:** propuesta · **Owner:** Producto + Arquitectura · **Última actualización:** 2026-09-28

## Propósito

Dejar escrito qué tiene que decidirse antes de que Ámbito deje el navegador. Ninguna decisión de esta página está aceptada: no habilitan código. El detalle vive en los ADR propuestos de [05-decisions.md](05-decisions.md).

## Por qué existe esta fase

La fase 1 ya tiene el modelo de clientes, el estado por vencimiento y el historial. Sigue guardando todo en un navegador. Dos personas no comparten el expediente, y borrar los datos del sitio los pierde.

## Decisiones que hay que cerrar antes de escribir código

1. La consultora es el tenant y los clientes son entidades hijas ([ADR-010](05-decisions.md#adr-010--la-consultora-es-el-tenant)).
2. La identidad la resuelve Clerk. Los roles de técnico, firmante y consultor viven en la base propia ([ADR-011](05-decisions.md#adr-011--clerk-identifica-y-la-base-guarda-los-roles)).
3. PostgreSQL con Prisma para los datos y Cloudflare R2 para los archivos, con enlaces firmados ([ADR-012](05-decisions.md#adr-012--postgresql-y-r2)).
4. El historial de un requisito no se edita ([ADR-013](05-decisions.md#adr-013--el-historial-no-se-edita)).

El stack sigue al de `saas-turnos`: Next.js, Clerk, Prisma y PostgreSQL. No se contrata un servicio hasta que el ADR correspondiente esté aceptado.

## Qué tiene que ser cierto para lanzar

- El técnico y el firmante, en dos dispositivos, ven el mismo expediente.
- Hay backups de la base.
- Hay textos de privacidad y términos.
- Hay un dominio propio.
- El cobro de la consultora se factura a mano hasta que exista un ADR de pagos.

## Qué no cambia

Los casos de uso de la fase 1 (`uploadVersion`, `approveVersion`, `deletePendingVersion`, `deriveStatus`) no conocen el navegador. La fase 2 reemplaza el adaptador `browser-client-store` por uno de base de datos. No reescribe las reglas.
