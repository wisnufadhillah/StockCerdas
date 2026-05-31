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

function resolveServiceUrl(service, env = {}) {
  if (!service.endpoint) return null;
  if (/^https?:\/\//i.test(service.endpoint)) return service.endpoint;
  if (service.service_type === "ai") return env.aiServiceUrl || null;
  if (service.endpoint.startsWith("/")) return `http://localhost:${env.port || 5000}${service.endpoint}`;
  return null;
}

function getServiceTimeoutMs(service) {
  if (service.service_type === "data-science") return 10000;
  if (/^https?:\/\//i.test(service.endpoint || "")) return 10000;
  return 3000;
}

function getServiceFetchOptions() {
  return {
    method: "GET",
    redirect: "manual",
  };
}

function isServiceHttpStatusReachable(service, status) {
  if (status >= 200 && status < 300) return true;
  return service.service_type === "data-science" && status >= 300 && status < 400;
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
  getServiceFetchOptions,
  getServiceTimeoutMs,
  isServiceHttpStatusReachable,
  normalizeAuditLogRow,
  resolveServiceUrl,
};
