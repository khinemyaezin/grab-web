import { describe, expect, it } from "vitest";
import type { IdentityProfile } from "@khinemyaezin/seller-contracts";
import { profileToSnapshot } from "./use-session-state";

const profile: IdentityProfile = {
  id: "user-1",
  email: "seller@example.com",
  name: "Seller One",
  avatar: "https://example.com/avatar.png",
  createdAt: "2026-01-01T00:00:00Z",
  accessContexts: [
    {
      assignmentId: "assignment-1",
      platformCode: "SELLER",
      roleCode: "OWNER",
      scopeKey: "merchant",
      scopeId: "merchant-1",
      status: "ACTIVE",
    },
  ],
  currentAccessContext: {
    assignmentId: "assignment-1",
    platformCode: "SELLER",
    roleCode: "OWNER",
    scopeKey: "merchant",
    scopeId: "merchant-1",
    status: "ACTIVE",
  },
};

describe("profileToSnapshot", () => {
  it("maps the identity profile into an authenticated snapshot with default empty roles and permissions", () => {
    const snapshot = profileToSnapshot(profile);

    expect(snapshot.status).toBe("authenticated");
    if (snapshot.status !== "authenticated") {
      return;
    }

    expect(snapshot.user).toMatchObject({
      id: "user-1",
      email: "seller@example.com",
      name: "Seller One",
      avatar: "https://example.com/avatar.png",
      currentAccessContext: { scopeId: "merchant-1" },
    });
    expect(snapshot.user).not.toHaveProperty("createdAt");
    expect(snapshot.roles).toEqual([]);
    expect(snapshot.permissions).toEqual([]);
  });

  it("passes through profile roles and permissions when present", () => {
    const profileWithPerms: IdentityProfile = {
      ...profile,
      roles: ["SELLER", "ADMIN"],
      permissions: ["catalog:write", "orders:read"],
    };

    const snapshot = profileToSnapshot(profileWithPerms);
    expect(snapshot.status).toBe("authenticated");
    if (snapshot.status !== "authenticated") {
      return;
    }

    expect(snapshot.roles).toEqual(["SELLER", "ADMIN"]);
    expect(snapshot.permissions).toEqual(["catalog:write", "orders:read"]);
  });
});
