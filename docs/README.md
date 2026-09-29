# Documentación de Ámbito

La documentación técnica es la fuente de verdad del proyecto y se versiona junto al código. Describe el sistema que existe hoy. No se adelantan carpetas, módulos ni integraciones que todavía no tienen contenido.

## Índice

| Documento | Contenido |
| --- | --- |
| [01-product.md](01-product.md) | Qué es Ámbito, para quién y qué cubre el prototipo |
| [02-architecture.md](02-architecture.md) | Capas, dependencias y restricciones |
| [03-folder-structure.md](03-folder-structure.md) | Dónde va cada archivo |
| [04-domain-model.md](04-domain-model.md) | Expediente, registros e invariantes |
| [05-decisions.md](05-decisions.md) | Decisiones de arquitectura (ADR) |
| [06-coding-standards.md](06-coding-standards.md) | Cómo se escribe el código |
| [07-fase-2.md](07-fase-2.md) | Qué hay que decidir antes de salir del navegador |

## Cómo trabajar con esta documentación

1. Una decisión costosa de revertir se registra en [05-decisions.md](05-decisions.md) antes de implementarse. Una decisión aceptada no se reescribe: se reemplaza por otra que la declara obsoleta.
2. Cada tema tiene un documento dueño. El resto lo referencia y no lo redefine.
3. Un cambio de comportamiento actualiza el documento correspondiente en el mismo cambio de código.
4. Si el código y la documentación difieren, se corrige la documentación en el momento.
5. Una carpeta o un documento nuevo se crean cuando hay contenido real. Un esqueleto vacío no comunica la arquitectura.
