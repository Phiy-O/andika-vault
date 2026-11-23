import { NextResponse } from "next/server";
import { readJsonObject } from "@/src/lib/api-request";
import { requireAdmin } from "@/src/lib/auth";
import { createCertificate } from "@/src/actions/certificate";

export async function POST(req: Request) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const body = await readJsonObject(req);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  const result = await createCertificate(body as Parameters<typeof createCertificate>[0]);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result.data);
}
