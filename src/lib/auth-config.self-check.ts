import assert from "node:assert/strict";
import { isBcryptHash, normalizeAdminEmail } from "./auth-config";

assert.equal(normalizeAdminEmail("  ADMIN@Example.COM "), "admin@example.com");
assert.equal(isBcryptHash("$2b$12$12345678901234567890123456789012345678901234567890123"), true);
assert.equal(isBcryptHash("not-a-bcrypt-hash"), false);
console.log("auth config self-check passed");
