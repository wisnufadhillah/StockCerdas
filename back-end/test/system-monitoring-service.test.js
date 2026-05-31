const assert = require("node:assert/strict");
const test = require("node:test");

const {
  classifyServiceResult,
  normalizeAuditLogRow,
  resolveServiceUrl,
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

test("resolveServiceUrl keeps full Streamlit Cloud URL for dashboard data", () => {
  assert.equal(
    resolveServiceUrl({ service_type: "data-science", endpoint: "https://stockcerdas.streamlit.app/" }, { port: 5000 }),
    "https://stockcerdas.streamlit.app/"
  );
});

test("resolveServiceUrl resolves local API paths to backend health URLs", () => {
  assert.equal(
    resolveServiceUrl({ service_type: "worker", endpoint: "/api/import/health" }, { port: 5000 }),
    "http://localhost:5000/api/import/health"
  );
});
