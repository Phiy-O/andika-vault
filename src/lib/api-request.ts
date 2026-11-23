/** Read a JSON object body without throwing on malformed input. */
export async function readJsonObject(
  req: Request
): Promise<Record<string, unknown> | null> {
  const body: unknown = await req.json().catch(() => null);
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }
  return body as Record<string, unknown>;
}
