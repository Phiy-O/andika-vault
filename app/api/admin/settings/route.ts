import { getSiteSettings } from "@/src/actions/site-setting";
import { requireAdmin } from "@/src/lib/auth";

export async function GET() {
  if (!(await requireAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await getSiteSettings();
  if (result.error) {
    return Response.json({ error: result.error }, { status: 500 });
  }

  return Response.json({ data: result.data });
}