"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();
    const showToast = useToast();

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
            showToast("Login berhasil, selamat datang kembali!");
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
                            placeholder="youremail@domain.com"
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
                </form>
            </div>
        </main>
    );
}
