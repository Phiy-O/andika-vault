export function actionError(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "issues" in error &&
    Array.isArray((error as { issues?: unknown }).issues)
  ) {
    const issues = (error as { issues: Array<{ message?: unknown }> }).issues;
    return issues
      .map((issue) =>
        typeof issue.message === "string" ? issue.message : "Invalid input"
      )
      .join(", ");
  }
  // Validation messages are safe to show; raw Error/Prisma/pg messages can
  // disclose schema details and must never be returned to the client.
  return fallback;
}
