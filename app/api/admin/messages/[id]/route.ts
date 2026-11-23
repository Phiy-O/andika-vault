import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import { markMessageRead, deleteMessage } from "@/src/actions/message";
import { z } from "zod";

const patchSchema = z.object({ isRead: z.boolean().optional() });

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  const isRead = parsed.success ? (parsed.data.isRead ?? true) : true;
  const result = await markMessageRead(id, isRead);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;
  const result = await deleteMessage(id);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}