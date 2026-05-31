import assert from "node:assert/strict";
import test from "node:test";

import { createCookieSession, createStoredSession } from "./session.ts";

test("createCookieSession removes profile images from the dashboard cookie", () => {
  const session = createCookieSession({
    id: 1,
    tenant_id: 2,
    name: "Admin",
    email: "admin@example.com",
    role: "useradmin",
    business_name: "Toko Admin",
    profile_image_url: "data:image/png;base64," + "a".repeat(500_000),
    plan: "pro",
  });

  assert.equal(session.profile_image_url, null);
});

test("createStoredSession keeps small profile images for dashboard avatars", () => {
  const image = "data:image/jpeg;base64," + "a".repeat(10_000);
  const session = createStoredSession({
    name: "Admin",
    email: "admin@example.com",
    role: "useradmin",
    profile_image_url: image,
  });

  assert.equal(session.profile_image_url, image);
});

test("createStoredSession drops oversized profile images before localStorage write", () => {
  const session = createStoredSession({
    name: "Admin",
    email: "admin@example.com",
    role: "useradmin",
    profile_image_url: "data:image/png;base64," + "a".repeat(500_000),
  });

  assert.equal(session.profile_image_url, null);
});
