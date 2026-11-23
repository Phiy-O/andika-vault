import { NextResponse } from "next/server";
import { readJsonObject } from "@/src/lib/api-request";
import { requireAdmin } from "@/src/lib/auth";
import { skillService } from "@/src/services";
import { updateSkill } from "@/src/actions/skill";
import { revalidatePublicContent } from "@/src/lib/revalidate-public";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const body = await readJsonObject(req);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  const result = await updateSkill(id, body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result.data);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  try {
    await skillService.delete(id);
    revalidatePublicContent();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
