import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { LegacyArea } from "../../expediente/domain/legacy.ts";
import { dueDateFromText, deleteClient, legacyAreasToClient, DEMO_CLIENT, updateClient } from "./legacy-migration.ts";

describe("dueDateFromText", () => {
  it("lee una fecha del detalle viejo", () => {
    assert.equal(dueDateFromText("Vence el 15/08/2026"), "2026-08-15");
    assert.equal(dueDateFromText("Vigente hasta 14/11/2026"), "2026-11-14");
    assert.equal(dueDateFromText("Sin fecha"), undefined);
  });
});

describe("legacyAreasToClient", () => {
  const areas: LegacyArea[] = [
    {
      id: "peligrosos",
      name: "Residuos peligrosos",
      subAreas: [
        {
          id: "inscripcion",
          name: "Inscripción",
          docs: [
            {
              id: "p-d1",
              name: "Inscripción provincial",
              status: "warn",
              detail: "Vence el 15/08/2026",
            },
          ],
          checklist: [
            { id: "p1", label: "Inscripción provincial vigente", done: true },
            { id: "p9", label: "Carpeta física en planta", done: false },
          ],
        },
      ],
    },
  ];

  it("arma la planta demo y no duplica el checklist del documento", () => {
    const client = legacyAreasToClient(areas, DEMO_CLIENT);
    assert.equal(client.name, "Planta demo");
    const requirements = client.areas[0].topics[0].requirements;
    assert.equal(requirements.some((item) => item.name === "Inscripción provincial"), true);
    assert.equal(requirements.some((item) => item.id === "p1"), false);
    assert.equal(requirements.some((item) => item.id === "p9"), true);
    assert.equal(requirements[0].dueDate, "2026-08-15");
  });

  it("cambia la ficha y conserva el expediente", () => {
    const client = legacyAreasToClient(areas, DEMO_CLIENT);
    const [updated] = updateClient([client], client.id, {
      name: "Otra planta",
      industry: "Química",
      province: client.province,
      municipality: client.municipality,
      enablingYear: client.enablingYear,
    });
    assert.equal(updated.name, "Otra planta");
    assert.equal(updated.industry, "Química");
    assert.equal(updated.areas[0].topics[0].requirements[0].id, client.areas[0].topics[0].requirements[0].id);
  });

  it("elimina solo el cliente pedido", () => {
    const client = legacyAreasToClient(areas, DEMO_CLIENT);
    const other = { ...client, id: "otro", name: "Otro" };
    const left = deleteClient([client, other], client.id);
    assert.deepEqual(
      left.map((item) => item.id),
      ["otro"],
    );
  });
});
