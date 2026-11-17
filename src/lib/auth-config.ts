export const ADMIN_ROLE = "admin" as const;

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isBcryptHash(value: string): boolean {
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value);
}
