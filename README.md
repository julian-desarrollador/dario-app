# Ámbito

Sistema online para documentación ambiental.

La documentación técnica es la fuente de verdad y vive en [`docs/`](docs/README.md). Ahí están el producto, la arquitectura, el modelo del expediente y las decisiones.

```bash
npm run dev
npm test
```

Abrí [http://localhost:8464](http://localhost:8464).

- `/` — landing
- `/app` — prototipo del expediente

El código de negocio está en `src/modules/`. `clients` lleva las empresas de la consultora. `expediente` decide requisitos, vencimientos, versiones y el OK del firmante. `session` decide quién entró. Las pantallas de `src/app/app/` componen esos módulos.

La fase siguiente, todavía sin código, está en [`docs/07-fase-2.md`](docs/07-fase-2.md).
