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
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
