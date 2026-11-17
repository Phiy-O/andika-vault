import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import { createCertificate } from "@/src/actions/certificate";

export async function POST(req: Request) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const result = await createCertificate(body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result.data);
}
