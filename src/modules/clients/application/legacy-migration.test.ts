import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { LegacyArea } from "../../expediente/domain/legacy.ts";
import { dueDateFromText, legacyAreasToClient, DEMO_CLIENT } from "./legacy-migration.ts";

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
});
