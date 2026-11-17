import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import { createProject } from "@/src/actions/project";

export async function POST(req: Request) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const result = await createProject(body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result.data);
}
