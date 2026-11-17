import "next-auth";
import "next-auth/jwt";

export type AdminRole = "admin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AdminRole;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role: AdminRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: AdminRole;
  }
}
