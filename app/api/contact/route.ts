import { NextResponse } from "next/server";
import { createMessage } from "@/src/actions/message";

export async function POST(req: Request) {
  const body = await req.json();
  const result = await createMessage(body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result.data, { status: 201 });
}