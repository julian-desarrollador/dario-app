import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Client, Requirement } from "../../expediente/domain/model.ts";
import { addScheduleExamples } from "./demo-examples.ts";

const today = "2026-10-13";

function requirement(id: string, name: string, kind: Requirement["kind"]): Requirement {
  return { id, name, kind, previous: [], history: [], current: kind === "file" ? undefined : undefined };
}

function plant(): Client {
  return {
    id: "planta-demo",
    name: "Planta demo",
    industry: "Alimenticia",
    province: "Córdoba",
    municipality: "Córdoba",
    enablingYear: "2025",
    areas: [
      {
        id: "emisiones",
        name: "Emisiones gaseosas",
        topics: [
          {
            id: "g-fuentes",
            name: "Fuentes",
            requirements: [
              {
                ...requirement("g-d1", "Monitoreo de chimeneas", "file"),
                dueDate: "2026-05-18",
                current: {
                  id: "g-d1-v",
                  version: 1,
                  uploaded: false,
                  firmanteOk: false,
                  createdAt: "2026-05-18",
                },
              },
            ],
          },
        ],
      },
      {
        id: "hys",
        name: "Higiene y Seguridad",
        topics: [
          {
            id: "hs-monitoreos",
            name: "Monitoreos",
            requirements: [
              requirement("hs-d4", "Medición de ruido laboral", "file"),
              { ...requirement("hs8", "Monitoreo de iluminación al día", "task"), taskDone: false },
            ],
          },
        ],
      },
      {
        id: "efluentes",
        name: "Efluentes líquidos",
        topics: [
          {
            id: "e-monitoreo",
            name: "Monitoreo",
            requirements: [requirement("e-d2", "Análisis de laboratorio", "file")],
          },
        ],
      },
    ],
  };
}

function find(client: Client, id: string): Requirement {
  for (const area of client.areas) {
    for (const topic of area.topics) {
      const requirement = topic.requirements.find((item) => item.id === id);
      if (requirement) return requirement;
    }
  }
  throw new Error(id);
}

describe("addScheduleExamples", () => {
  it("deja una carga a tiempo, una fuera de tiempo y una por vencer, sin tocar el archivo actual", () => {
    const next = addScheduleExamples(plant(), today);
    const chimeneas = find(next, "g-d1");
    assert.equal(chimeneas.current?.id, "g-d1-v");
    assert.equal(chimeneas.previous[0]?.deadline, "2026-10-28");
    assert.equal(chimeneas.previous[0]?.createdAt.slice(0, 10), "2026-10-26");
    assert.equal(chimeneas.previous[0]?.firmanteOk, true);
    assert.equal(chimeneas.previous[0]?.fileName, "ejemplo-chimeneas.pdf");

    const ruido = find(next, "hs-d4");
    assert.equal(ruido.previous[0]?.deadline, "2026-10-28");
    assert.equal(ruido.current, undefined);

    const laboratorio = find(next, "e-d2");
    assert.equal(laboratorio.previous[0]?.deadline, "2026-10-10");
    assert.equal(laboratorio.previous[0]?.createdAt.slice(0, 10), "2026-10-13");

    const luz = find(next, "hs8");
    assert.equal(luz.dueDate, "2026-10-23");
    assert.equal(luz.taskDone, false);
    assert.equal(next.demoExamples, 1);
  });

  it("no agrega los ejemplos una segunda vez", () => {
    const once = addScheduleExamples(plant(), today);
    const twice = addScheduleExamples(once, today);
    assert.equal(find(twice, "g-d1").previous.length, 1);
  });
});
