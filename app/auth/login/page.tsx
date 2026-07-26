"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading("credentials");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(null);
        if (result?.error) {
            setError("Invalid credentials");
        } else {
            router.push("/admin");
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-[10vw]">
            {/* glow */}
            <div
                className="pointer-events-none absolute -inset-40 bg-gradient-radial from-purple/5 to-transparent"
                aria-hidden="true"
            />

            <div className="relative w-full max-w-sm">
                {/* header */}
                <div className="mb-10 text-center">
                    <p className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-400/10 px-4 py-2 my-3 text-xs font-medium text-red-400 inset-ring inset-ring-gray-400/20 uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                        </span>
                        <span className="flex items-center">
                            Warning: Admin Only
                        </span>
                    </p>
                    <h1 className="text-[clamp(32px,5vw,43px)] font-medium tracking-[-.065em] leading-[.96] text-foreground">
                        Welcome back
                    </h1>
                    <p className="mt-4 text-muted text-[15px] leading-[1.7]">
                        Sign in to manage your portfolio
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex w-full flex-col gap-5 rounded-xl border border-line bg-surface/50 p-8"
                >
                    {error && (
                        <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-muted text-[10px] tracking-[.12em] uppercase"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="admin@andikavault.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border border-line bg-transparent px-4 py-3 text-sm text-foreground placeholder-muted/50 outline-none transition-all duration-200 focus:border-purple"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-muted text-[10px] tracking-[.12em] uppercase"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-line bg-transparent px-4 py-3 text-sm text-foreground placeholder-muted/50 outline-none transition-all duration-200 focus:border-purple"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading !== null}
                        className="mt-2 inline-flex items-center justify-center gap-3 rounded-lg bg-gradient-to-br from-[#a98bff] to-[#7391ff] px-6 py-3.5 text-sm font-medium text-[#f0f0f0] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-[1.05] hover:shadow-[0_0_16px_rgba(255,255,255,.25)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                        {loading === "credentials" ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : null}
                        Sign In
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-line" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-surface px-2 text-muted">or</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={loading !== null}
                        onClick={() => {
                            setLoading("github");
                            signIn("github", { callbackUrl: "/admin" });
                        }}
                        className="inline-flex items-center justify-center gap-3 rounded-lg border border-line px-6 py-3.5 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-purple hover:shadow-[0_0_2px_var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-line disabled:hover:shadow-none"
                    >
                        {loading === "github" ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted/30 border-t-foreground" />
                        ) : (
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                        )}
                        Sign in with GitHub
                    </button>
                </form>
            </div>
        </main>
    );
}
