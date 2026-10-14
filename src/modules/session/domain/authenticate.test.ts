import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { accountForRole, authenticate } from "./authenticate.ts";

describe("authenticate", () => {
  it("acepta la cuenta demo del técnico", () => {
    const user = authenticate("tecnico", "ambito");
    assert.equal(user?.name, "Técnico");
    assert.equal(user?.role, "tecnico");
  });

  it("acepta la cuenta de Dario", () => {
    const user = authenticate("Dario", "123");
    assert.equal(user?.name, "Dario");
    assert.equal(user?.role, "tecnico");
  });

  it("rechaza una clave incorrecta", () => {
    assert.equal(authenticate("tecnico", "otra"), null);
  });

  it("arma el par operario y dueño para probar sin escribir la clave", () => {
    const operario = accountForRole("tecnico");
    const dueno = accountForRole("firmante");
    assert.equal(authenticate(operario.username, operario.password)?.name, "Dario");
    assert.equal(authenticate(dueno.username, dueno.password)?.role, "firmante");
  });
});
