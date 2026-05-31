function classifyServiceResult({ ok, latencyMs }) {
  if (!ok) return "offline";
  if (latencyMs >= 1500) return "warning";
  return "online";
}

function normalizeAuditLogRow(row) {
  return {
    id: row.id,
    action: row.action,
    entity_type: row.entity_type,
    entity_id: row.entity_id,
    actor: {
      name: row.actor_name || "Sistem",
      email: row.actor_email || null,
    },
    metadata: row.metadata || {},
    created_at: row.created_at,
  };
}

function buildServiceCheckResult(service, { ok, latencyMs }) {
  return {
    id: service.id,
    status: classifyServiceResult({ ok, latencyMs }),
    latency_ms: Math.max(0, Math.round(latencyMs || 0)),
    last_checked_at: new Date().toISOString(),
  };
}

module.exports = {
  buildServiceCheckResult,
  classifyServiceResult,
  normalizeAuditLogRow,
};
