# Remove Unused Superadmin Settings CTA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the non-functional superadmin `Tambah Konfigurasi` CTA and prevent the empty add-settings route from showing a blank form.

**Architecture:** Keep the change in the existing `DashboardShell` because the dashboard UI is already centralized there. Do not add backend CRUD because the project currently only supports reading system settings.

**Tech Stack:** Next.js app UI, React components, TypeScript, existing dashboard route/action handling.

---

### Task 1: Remove Dead CTA And Guard Empty Route

**Files:**
- Modify: `front-end/app/src/dashboard/dashboard-shell.tsx`

- [ ] **Step 1: Remove header CTA for superadmin settings**

Change the `pageTitles` entry for `superadmin-pengaturan` so `cta` is empty and no `ctaHref` exists.

- [ ] **Step 2: Hide empty CTA rendering**

Only render the header CTA link when `page.cta` has text.

- [ ] **Step 3: Remove panel action**

Change the `Konfigurasi Global` panel to omit `action` and `actionHref`.

- [ ] **Step 4: Guard direct add route**

In `ActionPage`, when `role === "superadmin"`, `view === "pengaturan"`, and `action === "tambah"`, render a small message explaining the feature is unavailable and provide the existing `Kembali` action.

- [ ] **Step 5: Verify**

Run `npm.cmd run build` from `front-end/app`. Expected: build completes successfully.
