import { NextResponse } from "next/server";
import { createMessage } from "@/src/actions/message";

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  // Honeypot: bots fill the hidden field; real users never see it.
  if (typeof payload.website === "string" && payload.website.trim()) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const result = await createMessage(
    payload as Parameters<typeof createMessage>[0],
    getClientIp(req)
  );
  if (result.error) {
    const limited = result.error === "Too many messages. Please try again later.";
    return NextResponse.json(
      { error: result.error },
      { status: limited ? 429 : 400, headers: limited ? { "Retry-After": "600" } : undefined }
    );
  }
  return NextResponse.json(result.data, { status: 201 });
}
