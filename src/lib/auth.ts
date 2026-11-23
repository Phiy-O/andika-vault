import { NextAuthOptions, getServerSession } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { basePrisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ADMIN_ROLE, isBcryptHash, normalizeAdminEmail } from "./auth-config";
import { checkRateLimit } from "./rate-limit";

// Vercel/Auth.js uses AUTH_SECRET while older deployments use NEXTAUTH_SECRET.
// NextAuth already accepts either, so the credentials guard must as well.
const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

export async function requireAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return session?.user?.role === ADMIN_ROLE;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(basePrisma),
  secret: authSecret,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        // In-process fixed-window limiter. On serverless each instance has its
        // own bucket, so this slows attacks but is not a distributed lockout.
        const forwarded = req?.headers?.["x-forwarded-for"];
        const ip =
          (Array.isArray(forwarded) ? forwarded[0] : forwarded) ||
          req?.headers?.["x-real-ip"] ||
          "unknown";
        try {
          checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
        } catch {
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const passwordHash = process.env.ADMIN_PASSWORD_HASH;
        if (!adminEmail || !passwordHash || !authSecret) return null;
        if (!isBcryptHash(passwordHash)) return null;
        if (normalizeAdminEmail(String(credentials.email)) !== normalizeAdminEmail(adminEmail)) return null;

        const passwordMatches = await bcrypt.compare(String(credentials.password), passwordHash);
        if (!passwordMatches) return null;

        return { id: "1", name: "Admin", email: adminEmail, role: ADMIN_ROLE };
      },
    }),
  ],
  pages: { signIn: "/auth/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id && token.role === ADMIN_ROLE) {
        session.user.id = token.id;
        session.user.role = ADMIN_ROLE;
      }
      return session;
    },
  },
};
