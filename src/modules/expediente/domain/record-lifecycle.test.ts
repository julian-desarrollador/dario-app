import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Client } from "./model.ts";
import { approveVersion, deletePendingVersion, toggleTask, uploadVersion } from "./record-lifecycle.ts";

const actor = { id: "tecnico", name: "Técnico", role: "tecnico" as const };
const signer = { id: "firmante", name: "Firmante", role: "firmante" as const };

function clients(): Client[] {
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
          topics: [
            {
              id: "transporte",
              name: "Transporte",
              requirements: [
                {
                  id: "contrato",
                  name: "Contrato con transportista",
                  kind: "file",
                  dueDate: "2026-08-15",
                  declared: true,
                  previous: [],
                  history: [],
                },
                {
                  id: "recoleccion",
                  name: "Registrar recolección",
                  kind: "task",
                  dueDate: "2026-08-20",
                  taskDone: false,
                  previous: [],
                  history: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}

const file = {
  name: "contrato.pdf",
  mime: "application/pdf",
  dataUrl: "data:application/pdf;base64,aa",
  byteLength: 20,
};

describe("record lifecycle", () => {
  it("no elimina un requisito de ejemplo sin archivo subido", () => {
    const result = deletePendingVersion(clients(), "planta-demo", "contrato", actor, "2026-09-28T12:00:00.000Z");
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "not-deletable");
  });

  it("después del OK, editar abre una versión nueva y conserva la aprobada", () => {
    const uploaded = uploadVersion(clients(), {
      clientId: "planta-demo",
      requirementId: "contrato",
      actor,
      signer: { id: "firmante", name: "Firmante" },
      documentDate: "2026-09-28",
      dueDate: "2026-12-01",
      file,
      now: "2026-09-28T12:00:00.000Z",
      id: "up-1",
    });
    assert.equal(uploaded.ok, true);
    if (!uploaded.ok) return;

    const approved = approveVersion(
      uploaded.clients,
      "planta-demo",
      "contrato",
      signer,
      "2026-09-28T13:00:00.000Z",
    );
    assert.equal(approved.ok, true);
    if (!approved.ok) return;

    const edited = uploadVersion(approved.clients, {
      clientId: "planta-demo",
      requirementId: "contrato",
      actor,
      signer: { id: "firmante", name: "Firmante" },
      documentDate: "2026-09-28",
      file: { ...file, name: "contrato-v2.pdf" },
      now: "2026-09-28T14:00:00.000Z",
      id: "up-2",
    });
    assert.equal(edited.ok, true);
    if (!edited.ok) return;

    const requirement = edited.clients[0].areas[0].topics[0].requirements[0];
    assert.equal(requirement.current?.fileName, "contrato-v2.pdf");
    assert.equal(requirement.current?.firmanteOk, false);
    assert.equal(requirement.current?.version, 2);
    assert.equal(requirement.previous[0]?.firmanteOk, true);
    assert.equal(requirement.previous[0]?.fileName, "contrato.pdf");
    assert.equal(requirement.history[0]?.action, "replaced");

    const removed = deletePendingVersion(
      edited.clients,
      "planta-demo",
      "contrato",
      actor,
      "2026-09-28T15:00:00.000Z",
    );
    assert.equal(removed.ok, true);
    if (!removed.ok) return;
    const restored = removed.clients[0].areas[0].topics[0].requirements[0];
    assert.equal(restored.current?.firmanteOk, true);
    assert.equal(restored.current?.fileName, "contrato.pdf");
  });

  it("el técnico no puede dar el OK", () => {
    const uploaded = uploadVersion(clients(), {
      clientId: "planta-demo",
      requirementId: "contrato",
      actor,
      signer: { id: "firmante", name: "Firmante" },
      documentDate: "2026-09-28",
      file,
      now: "2026-09-28T12:00:00.000Z",
      id: "up-1",
    });
    assert.equal(uploaded.ok, true);
    if (!uploaded.ok) return;
    const approved = approveVersion(
      uploaded.clients,
      "planta-demo",
      "contrato",
      actor,
      "2026-09-28T13:00:00.000Z",
    );
    assert.equal(approved.ok, false);
  });

  it("guarda el plazo que había antes de subir, y lo conserva si se corrige sin OK", () => {
    const uploaded = uploadVersion(clients(), {
      clientId: "planta-demo",
      requirementId: "contrato",
      actor,
      signer: { id: "firmante", name: "Firmante" },
      documentDate: "2026-08-10",
      dueDate: "2027-08-15",
      file,
      now: "2026-08-20T12:00:00.000Z",
      id: "up-1",
    });
    assert.equal(uploaded.ok, true);
    if (!uploaded.ok) return;
    const first = uploaded.clients[0].areas[0].topics[0].requirements[0];
    assert.equal(first.current?.deadline, "2026-08-15");
    assert.equal(first.dueDate, "2027-08-15");

    const corrected = uploadVersion(uploaded.clients, {
      clientId: "planta-demo",
      requirementId: "contrato",
      actor,
      signer: { id: "firmante", name: "Firmante" },
      documentDate: "2026-08-10",
      dueDate: "2028-01-01",
      file,
      now: "2026-08-21T12:00:00.000Z",
      id: "up-1b",
    });
    assert.equal(corrected.ok, true);
    if (!corrected.ok) return;
    const second = corrected.clients[0].areas[0].topics[0].requirements[0];
    assert.equal(second.current?.deadline, "2026-08-15");
    assert.equal(second.dueDate, "2028-01-01");
    assert.equal(second.previous.length, 0);
  });

  it("después del OK, la carga siguiente guarda el plazo vigente", () => {
    const uploaded = uploadVersion(clients(), {
      clientId: "planta-demo",
      requirementId: "contrato",
      actor,
      signer: { id: "firmante", name: "Firmante" },
      documentDate: "2026-08-10",
      dueDate: "2027-08-15",
      file,
      now: "2026-08-10T12:00:00.000Z",
      id: "up-1",
    });
    assert.equal(uploaded.ok, true);
    if (!uploaded.ok) return;
    const approved = approveVersion(
      uploaded.clients,
      "planta-demo",
      "contrato",
      signer,
      "2026-08-11T12:00:00.000Z",
    );
    assert.equal(approved.ok, true);
    if (!approved.ok) return;
    const renewed = uploadVersion(approved.clients, {
      clientId: "planta-demo",
      requirementId: "contrato",
      actor,
      signer: { id: "firmante", name: "Firmante" },
      documentDate: "2027-08-01",
      dueDate: "2028-08-15",
      file,
      now: "2027-08-01T12:00:00.000Z",
      id: "up-2",
    });
    assert.equal(renewed.ok, true);
    if (!renewed.ok) return;
    const requirement = renewed.clients[0].areas[0].topics[0].requirements[0];
    assert.equal(requirement.current?.deadline, "2027-08-15");
    assert.equal(requirement.previous[0]?.deadline, "2026-08-15");
  });

  it("marca la tarea con la fecha de hoy y la borra al desmarcar", () => {
    const done = toggleTask(clients(), "planta-demo", "recoleccion", "2026-08-18");
    const task = done[0].areas[0].topics[0].requirements[1];
    assert.equal(task.taskDone, true);
    assert.equal(task.doneAt, "2026-08-18");
    const undone = toggleTask(done, "planta-demo", "recoleccion", "2026-08-19");
    const cleared = undone[0].areas[0].topics[0].requirements[1];
    assert.equal(cleared.taskDone, false);
    assert.equal(cleared.doneAt, undefined);
  });
});
