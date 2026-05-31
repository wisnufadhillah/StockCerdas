const assert = require("node:assert/strict");
const test = require("node:test");

const {
  classifyServiceResult,
  normalizeAuditLogRow,
} = require("../src/services/system-monitoring-service");

test("classifyServiceResult marks fast successful checks online", () => {
  assert.equal(classifyServiceResult({ ok: true, latencyMs: 180 }), "online");
});

test("classifyServiceResult marks slow successful checks warning", () => {
  assert.equal(classifyServiceResult({ ok: true, latencyMs: 1600 }), "warning");
});

test("classifyServiceResult marks failed checks offline", () => {
  assert.equal(classifyServiceResult({ ok: false, latencyMs: 30 }), "offline");
});

test("normalizeAuditLogRow exposes actor and fallback metadata safely", () => {
  const row = normalizeAuditLogRow({
    id: 12,
    action: "login",
    entity_type: "user",
    entity_id: 7,
    actor_name: "Dina Putri",
    actor_email: "dina@example.com",
    metadata: null,
    created_at: "2026-05-31T10:00:00.000Z",
  });

  assert.deepEqual(row, {
    id: 12,
    action: "login",
    entity_type: "user",
    entity_id: 7,
    actor: {
      name: "Dina Putri",
      email: "dina@example.com",
    },
    metadata: {},
    created_at: "2026-05-31T10:00:00.000Z",
  });
});
