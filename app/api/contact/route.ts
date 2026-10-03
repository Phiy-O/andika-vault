import { NextResponse } from "next/server";
import { createMessage } from "@/src/actions/message";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const requests = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: Request) {
  const body = await req.json();
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const now = Date.now();
  if (requests.size > 1000) {
    for (const [key, value] of requests) {
      if (value.resetAt <= now) requests.delete(key);
    }
  }
  const ip = getClientIp(req);
  const current = requests.get(ip);
  if (current && current.resetAt > now && current.count >= MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((current.resetAt - now) / 1000)) } }
    );
  }
  requests.set(ip, {
    count: current && current.resetAt > now ? current.count + 1 : 1,
    resetAt: current && current.resetAt > now ? current.resetAt : now + WINDOW_MS,
  });

  const result = await createMessage(body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result.data, { status: 201 });
}