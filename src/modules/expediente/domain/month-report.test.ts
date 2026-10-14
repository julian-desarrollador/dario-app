import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Client, Requirement } from "./model.ts";
import { figuresForClient, scheduleInYear, scheduleItems } from "./month-report.ts";
import { uploadVersion } from "./record-lifecycle.ts";

const today = "2026-10-13";

function fileRequirement(patch: Partial<Requirement> & Pick<Requirement, "id" | "name">): Requirement {
  return {
    kind: "file",
    previous: [],
    history: [],
    ...patch,
  };
}

function plant(requirements: Requirement[]): Client[] {
  return [
    {
      id: "planta-demo",
      name: "Planta demo",
      industry: "Alimenticia",
      province: "Córdoba",
      municipality: "Córdoba",
      enablingYear: "2025",
      areas: [
        {
          id: "asimilables",
          name: "Residuos asimilables",
          topics: [{ id: "transporte", name: "Transporte", requirements }],
        },
      ],
    },
  ];
}

describe("scheduleItems", () => {
  it("cuenta la carga en el mes del plazo, a tiempo o fuera de tiempo", () => {
    const clients = plant([
      fileRequirement({
        id: "a-tiempo",
        name: "A tiempo",
        dueDate: "2027-08-15",
        current: {
          id: "v-a",
          version: 1,
          uploaded: true,
          firmanteOk: true,
          deadline: "2026-08-15",
          createdAt: "2026-08-10T12:00:00.000Z",
        },
      }),
      fileRequirement({
        id: "tarde",
        name: "Tarde",
        dueDate: "2027-08-15",
        current: {
          id: "v-b",
          version: 1,
          uploaded: true,
          firmanteOk: false,
          deadline: "2026-08-15",
          createdAt: "2026-08-20T12:00:00.000Z",
        },
      }),
    ]);
    const august = scheduleInYear(clients, "2026").find((group) => group.month === 8);
    assert.equal(august?.done.length, 2);
    assert.equal(august?.pending.length, 0);
    assert.equal(august?.done.find((item) => item.id === "v-a")?.timing, "on-time");
    assert.equal(august?.done.find((item) => item.id === "v-b")?.timing, "late");
    const figures = figuresForClient(clients, "planta-demo", "2026-08", today);
    assert.deepEqual(figures, { done: 2, onTime: 1, late: 1, pending: 0, dueSoon: 0, expired: 0 });
  });

  it("no duplica un archivo subido sin cambiar el vencimiento", () => {
    const clients = plant([
      fileRequirement({
        id: "mismo",
        name: "Mismo plazo",
        dueDate: "2026-11-02",
        current: {
          id: "v-c",
          version: 1,
          uploaded: true,
          firmanteOk: false,
          deadline: "2026-11-02",
          createdAt: "2026-10-01T12:00:00.000Z",
        },
      }),
    ]);
    const items = scheduleItems(clients).filter((item) => item.requirement.id === "mismo");
    assert.equal(items.length, 1);
    assert.equal(items[0]?.done, true);
  });

  it("deja pendiente el vencimiento nuevo y cuenta por vencerse", () => {
    const clients = plant([
      fileRequirement({
        id: "proximo",
        name: "Próximo",
        dueDate: "2026-10-20",
        current: {
          id: "v-d",
          version: 1,
          uploaded: true,
          firmanteOk: true,
          deadline: "2025-10-20",
          createdAt: "2025-10-01T12:00:00.000Z",
        },
      }),
    ]);
    const october = scheduleInYear(clients, "2026").find((group) => group.month === 10);
    assert.equal(october?.pending.length, 1);
    assert.equal(october?.done.length, 0);
    const figures = figuresForClient(clients, "planta-demo", "2026-10", today);
    assert.equal(figures.dueSoon, 1);
    assert.equal(figures.pending, 1);
    assert.equal(figures.expired, 0);
    assert.equal(figures.done, 0);
  });

  it("una tarea hecha sin fecha cuenta como realizada y no como a tiempo", () => {
    const clients = plant([
      {
        id: "vieja",
        name: "Tarea vieja",
        kind: "task",
        dueDate: "2026-10-01",
        taskDone: true,
        previous: [],
        history: [],
      },
      {
        id: "tarde",
        name: "Tarea tarde",
        kind: "task",
        dueDate: "2026-10-01",
        taskDone: true,
        doneAt: "2026-10-05",
        previous: [],
        history: [],
      },
    ]);
    const figures = figuresForClient(clients, "planta-demo", "2026-10", today);
    assert.deepEqual(figures, { done: 2, onTime: 0, late: 1, pending: 0, dueSoon: 0, expired: 0 });
  });

  it("un archivo declarado sin carga queda pendiente y uno sin plazo no entra", () => {
    const clients = plant([
      fileRequirement({ id: "catalogo", name: "Catálogo", dueDate: "2026-11-14", declared: true }),
      fileRequirement({ id: "sin-plazo", name: "Sin plazo", declared: true }),
    ]);
    const items = scheduleItems(clients);
    assert.deepEqual(
      items.map((item) => item.requirement.id),
      ["catalogo"],
    );
    assert.equal(items[0]?.done, false);
    const figures = figuresForClient(clients, "planta-demo", "2026-11", today);
    assert.equal(figures.pending, 1);
    assert.equal(figures.expired, 0);
  });

  it("una pendiente con el plazo vencido cuenta como vencida", () => {
    const clients = plant([
      fileRequirement({ id: "paso", name: "Pasó", dueDate: "2026-10-01" }),
    ]);
    const figures = figuresForClient(clients, "planta-demo", "2026-10", today);
    assert.deepEqual(figures, { done: 0, onTime: 0, late: 0, pending: 1, dueSoon: 0, expired: 1 });
  });

  it("la carga real guarda el plazo y el informe lo lee", () => {
    const uploaded = uploadVersion(
      plant([fileRequirement({ id: "contrato", name: "Contrato", dueDate: "2026-08-15" })]),
      {
        clientId: "planta-demo",
        requirementId: "contrato",
        actor: { id: "tecnico", name: "Técnico", role: "tecnico" },
        signer: { id: "firmante", name: "Firmante" },
        documentDate: "2026-08-10",
        dueDate: "2027-08-15",
        now: "2026-08-20T12:00:00.000Z",
        id: "up-1",
        file: {
          name: "contrato.pdf",
          mime: "application/pdf",
          dataUrl: "data:application/pdf;base64,aa",
          byteLength: 20,
        },
      },
    );
    assert.equal(uploaded.ok, true);
    if (!uploaded.ok) return;
    const figures = figuresForClient(uploaded.clients, "planta-demo", "2026-08", today);
    assert.deepEqual(figures, { done: 1, onTime: 0, late: 1, pending: 0, dueSoon: 0, expired: 0 });
    const next = figuresForClient(uploaded.clients, "planta-demo", "2027-08", today);
    assert.equal(next.done, 0);
    assert.equal(scheduleInYear(uploaded.clients, "2027")[0]?.pending.length, 1);
  });
});
