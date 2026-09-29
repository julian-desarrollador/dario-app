import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Requirement } from "./model.ts";
import { deriveStatus, pendingSignerOk } from "./requirement-status.ts";

const today = "2026-09-28";

function fileRequirement(patch: Partial<Requirement> = {}): Requirement {
  return {
    id: "req",
    name: "Permiso",
    kind: "file",
    previous: [],
    history: [],
    ...patch,
  };
}

describe("deriveStatus", () => {
  it("marca falta cuando no hay archivo ni evidencia", () => {
    assert.equal(deriveStatus(fileRequirement(), today), "missing");
  });

  it("marca vencido cuando la fecha ya pasó, aunque haya archivo", () => {
    assert.equal(
      deriveStatus(
        fileRequirement({
          dueDate: "2026-08-15",
          current: {
            id: "v1",
            version: 1,
            fileName: "permiso.pdf",
            uploaded: true,
            firmanteOk: true,
            createdAt: today,
          },
        }),
        today,
      ),
      "expired",
    );
  });

  it("marca por vencer dentro de los 30 días", () => {
    assert.equal(
      deriveStatus(fileRequirement({ dueDate: "2026-10-12", declared: true }), today),
      "due-soon",
    );
  });

  it("marca al día cuando vence más adelante", () => {
    assert.equal(
      deriveStatus(fileRequirement({ dueDate: "2026-11-14", declared: true }), today),
      "ok",
    );
  });

  it("una tarea sin marcar es falta", () => {
    assert.equal(
      deriveStatus(
        { id: "t", name: "Alta", kind: "task", taskDone: false, previous: [], history: [] },
        today,
      ),
      "missing",
    );
  });
});

describe("pendingSignerOk", () => {
  it("detecta un archivo subido sin OK", () => {
    assert.equal(
      pendingSignerOk(
        fileRequirement({
          current: {
            id: "v",
            version: 1,
            uploaded: true,
            firmanteOk: false,
            createdAt: today,
          },
        }),
      ),
      true,
    );
  });
});
