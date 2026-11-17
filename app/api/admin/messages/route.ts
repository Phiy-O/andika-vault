import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth";
import { getAllMessages } from "@/src/actions/message";

export async function GET() {
  if (!(await requireAdmin())) return new NextResponse("Unauthorized", { status: 401 });

  const result = await getAllMessages();
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json(result.data);
}