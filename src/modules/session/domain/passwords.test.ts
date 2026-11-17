import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { authenticate } from "./authenticate.ts";
import { accountsForEnv } from "./passwords.ts";

describe("accountsForEnv", () => {
  it("en desarrollo acepta 123 si no hay variable", () => {
    const accounts = accountsForEnv({ nodeEnv: "development" });
    assert.equal(authenticate("dario", "123", accounts)?.name, "Dario");
  });

  it("en producción no acepta 123 si la variable no está", () => {
    const accounts = accountsForEnv({ nodeEnv: "production" });
    assert.equal(authenticate("dario", "123", accounts), null);
  });

  it("usa AUTH_PASSWORD y deja de aceptar 123", () => {
    const accounts = accountsForEnv({ authPassword: "secreta", nodeEnv: "production" });
    assert.equal(authenticate("Dario", "secreta", accounts)?.role, "tecnico");
    assert.equal(authenticate("dario", "123", accounts), null);
  });

  it("ignora espacios alrededor de la variable", () => {
    const accounts = accountsForEnv({ authPassword: "  secreta  ", nodeEnv: "production" });
    assert.equal(authenticate("dario", "secreta", accounts)?.id, "dario");
  });

  it("mantiene las cuentas demo en el servidor", () => {
    const accounts = accountsForEnv({ authPassword: "secreta", nodeEnv: "production" });
    assert.equal(authenticate("tecnico", "ambito", accounts)?.name, "Técnico");
    assert.equal(authenticate("firmante", "ambito", accounts)?.role, "firmante");
  });
});
