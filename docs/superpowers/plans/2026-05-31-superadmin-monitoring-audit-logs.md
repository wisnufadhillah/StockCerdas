# Superadmin Monitoring Audit Logs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make superadmin monitoring useful by adding real service refresh and user activity logs.

**Architecture:** Keep the feature lightweight inside the existing dashboard API. Add pure helper functions for health classification and audit log formatting, then expose controller endpoints consumed by the existing dashboard shell.

**Tech Stack:** Express, PostgreSQL `pg`, Node built-in test runner, Next.js/React dashboard.

---

### Task 1: Backend Monitoring Logic

**Files:**
- Create: `back-end/src/services/system-monitoring-service.js`
- Create: `back-end/test/system-monitoring-service.test.js`
- Modify: `back-end/package.json`

- [ ] Add tests for latency/status classification and audit log normalization using `node:test`.
- [ ] Run `npm test -- system-monitoring-service.test.js` and confirm missing module failure.
- [ ] Implement pure helpers: `classifyServiceResult`, `normalizeAuditLogRow`, and `buildServiceCheckResult`.
- [ ] Re-run tests and confirm pass.

### Task 2: Dashboard API Endpoints

**Files:**
- Modify: `back-end/src/controllers/dashboard-controller.js`
- Modify: `back-end/src/routes/dashboard-routes.js`

- [ ] Add `GET /api/dashboard/audit-logs` returning latest audit rows with actor name/email.
- [ ] Add `POST /api/dashboard/system-services/refresh` that checks configured service endpoints and updates `system_services`.
- [ ] Insert audit records for refresh actions.
- [ ] Verify syntax with `node --check`.

### Task 3: Activity Recording

**Files:**
- Create: `back-end/src/services/audit-log-service.js`
- Modify: `back-end/src/controllers/auth-controller.js`
- Modify: `back-end/src/controllers/tenants-controller.js`
- Modify: `back-end/src/controllers/import-controller.js`
- Modify: `back-end/src/controllers/predictions-controller.js`

- [ ] Add safe `recordAuditLog` helper that never breaks the user request if logging fails.
- [ ] Record login, register, tenant create/update/delete, import upload/sync, and prediction create.
- [ ] Verify syntax with `node --check`.

### Task 4: Frontend Monitoring UI

**Files:**
- Modify: `front-end/app/src/lib/api.ts`
- Modify: `front-end/app/src/dashboard/dashboard-shell.tsx`

- [ ] Add API functions for refresh status and audit logs.
- [ ] Make `Refresh Status` button call refresh endpoint and update service cards.
- [ ] Replace placeholder `Log Pengguna` with recent audit activity list.
- [ ] Show last checked time in service cards.
- [ ] Verify with `npm.cmd run build`.

### Task 5: Final Verification

**Files:**
- No new files.

- [ ] Run backend tests.
- [ ] Run backend syntax checks.
- [ ] Run frontend build.
- [ ] Inspect `git diff` for unintended changes.
