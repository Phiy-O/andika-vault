"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

type LoginFormProps = {
  callbackUrl: string;
};

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const showToast = useToast();
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      });

      if (!result?.ok || result.error) {
        setError(
          "Those credentials did not match this workspace. Check your email and password, then try again."
        );
        return;
      }

      showToast("Access granted. Welcome back to the studio.");
      router.replace(callbackUrl);
      router.refresh();
    } catch {
      setError(
        "We could not reach the sign-in service. Check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full border-2 border-foreground bg-background shadow-[6px_6px_0_var(--foreground)]">
      <div className="flex items-start justify-between gap-3 border-b-2 border-foreground px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-[.16em] text-[#a9362e]">
            Auth / Credentials
          </p>
          <h2
            id="signin-heading"
            className="mt-1.5 whitespace-nowrap uppercase"
          >
            Sign in
          </h2>
        </div>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-foreground bg-[#e76f51] sm:h-10 sm:w-10"
          aria-hidden="true"
        >
          <KeyRound size={17} />
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        aria-labelledby="signin-heading"
        className="space-y-5 p-5 sm:p-6"
      >
        <p className="text-sm leading-6 text-muted">
          Use the administrator credentials assigned to this workspace.
        </p>

        {error ? (
          <div
            id="login-error"
            ref={errorRef}
            role="alert"
            tabIndex={-1}
            className="flex items-start gap-3 border-2 border-[#a9362e] bg-[#f7e2da] px-3 py-3 text-sm leading-5 text-[#7d231d]"
          >
            <AlertCircle
              size={16}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <div>
              <strong className="mb-0.5 block font-mono text-[9px] uppercase tracking-[.12em]">
                Access denied
              </strong>
              {error}
            </div>
          </div>
        ) : null}

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="email"
              className="font-mono text-[10px] font-semibold uppercase tracking-[.12em]"
            >
              Email address
            </label>
            <span
              className="font-mono text-[9px] tracking-[.12em] text-muted"
              aria-hidden="true"
            >
              01
            </span>
          </div>
          <div className="relative">
            <Mail
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError("");
              }}
              disabled={isSubmitting}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "login-error" : undefined}
              placeholder="you@studio.com"
              className={`w-full border-2 bg-[#fffdf7] py-3 pl-9 pr-3 text-sm text-foreground transition-colors placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60 ${
                error
                  ? "border-[#a9362e]"
                  : "border-foreground focus:border-amber"
              }`}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="password"
              className="font-mono text-[10px] font-semibold uppercase tracking-[.12em]"
            >
              Password
            </label>
            <span
              className="font-mono text-[9px] tracking-[.12em] text-muted"
              aria-hidden="true"
            >
              02
            </span>
          </div>
          <div className="relative">
            <KeyRound
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError("");
              }}
              disabled={isSubmitting}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "login-error" : undefined}
              placeholder="Enter your password"
              className={`w-full border-2 bg-[#fffdf7] py-3 pl-9 pr-12 text-sm text-foreground transition-colors placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60 ${
                error
                  ? "border-[#a9362e]"
                  : "border-foreground focus:border-amber"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center border-l-2 border-foreground text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-offset-[-3px]"
            >
              {showPassword ? (
                <EyeOff size={15} aria-hidden="true" />
              ) : (
                <Eye size={15} aria-hidden="true" />
              )}
            </button>
          </div>
          <p className="mt-2 font-mono text-[8px] uppercase tracking-[.1em] text-muted">
            Case-sensitive credentials
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="group flex w-full items-center justify-center gap-2.5 border-2 border-foreground bg-[#e76f51] px-5 py-3.5 text-xs font-bold uppercase tracking-[.08em] shadow-[4px_4px_0_var(--foreground)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--foreground)] active:translate-x-0 active:translate-y-0 active:shadow-none disabled:pointer-events-none disabled:opacity-60 disabled:shadow-none"
        >
          {isSubmitting ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground"
                aria-hidden="true"
              />
              Verifying access
            </>
          ) : (
            <>
              Sign in to studio
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
        <p className="sr-only" role="status">
          {isSubmitting ? "Verifying credentials" : ""}
        </p>
      </form>

      <div className="flex flex-col gap-2 border-t-2 border-foreground bg-surface/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[8px] uppercase tracking-[.12em] text-muted">
          Administrator access only
        </span>
        <Link
          href="/contact"
          className="w-fit font-mono text-[8px] font-semibold uppercase tracking-[.12em] underline decoration-amber decoration-2 underline-offset-4 transition-colors hover:text-amber"
        >
          Request access
        </Link>
      </div>
    </div>
  );
}
