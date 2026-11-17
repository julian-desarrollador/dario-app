import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { authenticate, userForRole, type Account } from "./authenticate.ts";

const ACCOUNTS: Account[] = [
  { id: "dario", username: "dario", password: "123", name: "Dario", role: "tecnico" },
  { id: "tecnico", username: "tecnico", password: "ambito", name: "Técnico", role: "tecnico" },
  { id: "firmante", username: "firmante", password: "ambito", name: "Firmante", role: "firmante" },
];

describe("authenticate", () => {
  it("acepta la cuenta demo del técnico", () => {
    const user = authenticate("tecnico", "ambito", ACCOUNTS);
    assert.equal(user?.name, "Técnico");
    assert.equal(user?.role, "tecnico");
  });

  it("acepta la cuenta de Dario", () => {
    const user = authenticate("Dario", "123", ACCOUNTS);
    assert.equal(user?.name, "Dario");
    assert.equal(user?.role, "tecnico");
  });

  it("rechaza una clave incorrecta", () => {
    assert.equal(authenticate("tecnico", "otra", ACCOUNTS), null);
  });

  it("rechaza una clave vacía", () => {
    assert.equal(authenticate("dario", "", ACCOUNTS), null);
  });

  it("arma el par operario y dueño para probar sin escribir la clave", () => {
    assert.equal(userForRole("tecnico").name, "Dario");
    assert.equal(userForRole("firmante").role, "firmante");
  });
});
