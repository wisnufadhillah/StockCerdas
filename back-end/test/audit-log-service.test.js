const assert = require("node:assert/strict");
const test = require("node:test");

const { recordAuditLog } = require("../src/services/audit-log-service");

test("recordAuditLog inserts a structured audit row", async () => {
  const calls = [];
  const pool = {
    query: async (sql, params) => {
      calls.push({ sql, params });
    },
  };

  await recordAuditLog(pool, {
    actorUserId: 3,
    action: "login",
    entityType: "user",
    entityId: 3,
    metadata: { email: "admin@example.com" },
  });

  assert.equal(calls.length, 1);
  assert.match(calls[0].sql, /INSERT INTO audit_logs/);
  assert.deepEqual(calls[0].params, [3, "login", "user", 3, { email: "admin@example.com" }]);
});

test("recordAuditLog does not throw when audit insert fails", async () => {
  const pool = {
    query: async () => {
      throw new Error("database unavailable");
    },
  };
  const originalError = console.error;
  console.error = () => {};

  try {
    await assert.doesNotReject(() => recordAuditLog(pool, {
      action: "system_services_refreshed",
      entityType: "system_service",
    }));
  } finally {
    console.error = originalError;
  }
});
