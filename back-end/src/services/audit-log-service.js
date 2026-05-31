async function recordAuditLog(pool, { actorUserId = null, action, entityType, entityId = null, metadata = {} }) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [actorUserId, action, entityType, entityId, metadata]
    );
  } catch (error) {
    console.error("Gagal mencatat audit log:", error.message);
  }
}

module.exports = { recordAuditLog };
