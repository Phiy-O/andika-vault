import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowUpRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { authOptions } from "@/src/lib/auth";
import { ADMIN_ROLE } from "@/src/lib/auth-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio Access | Andika",
  description: "Secure sign-in for the Andika Studio content workspace.",
  robots: {
    index: false,
    follow: false,
  },
};

const accessRows = [
  { label: "Access level", value: "Administrator" },
  { label: "Workspace", value: "Content studio / CMS", online: true },
  { label: "Session", value: "JWT / Encrypted" },
];

function getSafeCallbackUrl(raw?: string | string[]): string {
  const fallback = "/admin";
  const value = Array.isArray(raw) ? raw[0] : raw;

  if (!value) return fallback;

  try {
    const parsed = new URL(value, "http://studio.local");

    if (parsed.origin !== "http://studio.local") return fallback;
    if (
      parsed.pathname !== "/admin" &&
      !parsed.pathname.startsWith("/admin/")
    ) {
      return fallback;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const [{ callbackUrl }, session] = await Promise.all([
    searchParams,
    getServerSession(authOptions),
  ]);
  const destination = getSafeCallbackUrl(callbackUrl);

  if (session?.user?.role === ADMIN_ROLE) {
    redirect(destination);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b-2 border-foreground">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 border-x-2 border-foreground px-5 py-3.5 sm:px-8 lg:px-10">
          <Link
            href="/"
            aria-label="Go to Andika portfolio home"
            className="group flex min-w-0 items-center gap-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-foreground bg-[#e76f51] text-sm font-extrabold shadow-[3px_3px_0_var(--foreground)] transition-transform duration-200 group-hover:-translate-y-0.5">
              A/
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-bold uppercase leading-none tracking-[-.06em] sm:text-lg">
                Andika <span className="text-amber">/ Studio</span>
              </span>
              <span className="mt-1.5 hidden font-mono text-[9px] uppercase tracking-[.16em] text-muted sm:block">
                Portfolio content studio
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 border border-foreground px-2.5 py-2 font-mono text-[9px] uppercase tracking-[.1em] sm:inline-flex">
              <LockKeyhole
                size={12}
                className="text-amber"
                aria-hidden="true"
              />
              Private workspace
            </span>
            <Link
              href="/"
              aria-label="Public site"
              className="inline-flex min-h-10 items-center gap-1.5 border-2 border-foreground bg-background px-3 py-2 font-mono text-[9px] uppercase tracking-[.1em] shadow-[2px_2px_0_var(--foreground)] transition-colors hover:bg-surface"
            >
              <span className="hidden sm:inline">Public site</span>
              <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1500px] flex-1 border-x-2 border-foreground lg:grid-cols-[1.08fr_.92fr]">
        <section
          aria-labelledby="login-heading"
          className="flex flex-col justify-between gap-10 border-b-2 border-foreground px-5 py-7 sm:px-8 sm:py-12 lg:border-b-0 lg:border-r-2 lg:px-12 lg:py-14 xl:px-16"
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <p className="font-mono text-[9px] uppercase tracking-[.16em] text-muted">
                <span
                  className="mr-2 inline-block h-2 w-2 bg-[#50a878]"
                  aria-hidden="true"
                />
                Workspace / Access
              </p>
              <span className="shrink-0 rotate-[-2deg] border-2 border-foreground bg-[#e76f51] px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-[.16em] shadow-[2px_2px_0_var(--foreground)]">
                Admin only
              </span>
            </div>

            <h1
              id="login-heading"
              className="mt-8 max-w-[11ch] uppercase"
            >
              Welcome back to the <em className="normal-case">studio.</em>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-muted sm:text-[15px]">
              Sign in to publish projects, draft technical dispatches, and keep
              every page of the portfolio current.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 lg:hidden">
              {["JWT session", "Server verified", "No registration"].map(
                (item) => (
                  <span
                    key={item}
                    className="border border-foreground px-2 py-1 font-mono text-[8px] uppercase tracking-[.1em]"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <dl className="hidden max-w-md divide-y divide-line border-2 border-foreground bg-background shadow-[4px_4px_0_var(--foreground)] sm:block">
              {accessRows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[7.5rem_1fr]"
                >
                  <dt className="border-r border-line bg-surface px-3 py-2.5 font-mono text-[9px] uppercase tracking-[.12em] text-muted">
                    {row.label}
                  </dt>
                  <dd className="flex items-center gap-2 px-3 py-2.5 font-mono text-[10px] uppercase tracking-[.08em]">
                    {row.online ? (
                      <span
                        className="h-1.5 w-1.5 shrink-0 bg-[#50a878]"
                        aria-hidden="true"
                      />
                    ) : null}
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 flex max-w-md items-start gap-2 font-mono text-[9px] uppercase leading-5 tracking-[.1em] text-muted">
              <ShieldCheck
                size={13}
                className="mt-0.5 shrink-0 text-amber"
                aria-hidden="true"
              />
              Credentials are verified server-side before a session is issued.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="signin-heading"
          className="flex items-center justify-center bg-surface/40 px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 xl:px-14"
        >
          <div className="w-full max-w-[440px]">
            <LoginForm callbackUrl={destination} />
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-foreground">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-2 border-x-2 border-foreground px-5 py-4 font-mono text-[9px] uppercase tracking-[.1em] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span>
            © {new Date().getFullYear()} Andika Studio / Content management
          </span>
          <span className="flex items-center gap-3">
            <span>Auth / Credentials</span>
            <span aria-hidden="true">·</span>
            <span>NextAuth secured</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
