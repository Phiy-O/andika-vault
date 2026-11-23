import assert from "node:assert/strict";
import { z } from "zod";
import { blogPostUpdateSchema } from "../src/lib/validations/blog-post";
import { certificateUpdateSchema } from "../src/lib/validations/certificate";
import { projectUpdateSchema } from "../src/lib/validations/project";
import { skillUpdateSchema } from "../src/lib/validations/skill";

function assertOmittedFieldsStayAbsent(
  name: string,
  schema: z.ZodType,
  input: Record<string, unknown>,
  forbiddenKeys: string[]
): void {
  const parsed = schema.parse(input) as Record<string, unknown>;
  for (const key of forbiddenKeys) {
    assert.equal(
      Object.hasOwn(parsed, key),
      false,
      `${name}: omitted key "${key}" must not be injected into a partial update`
    );
  }
}

function main(): void {
  assertOmittedFieldsStayAbsent("blog", blogPostUpdateSchema, { isVisible: false }, [
    "bodyFormat",
    "tags",
    "sortOrder",
  ]);

  assertOmittedFieldsStayAbsent("project", projectUpdateSchema, { isVisible: false }, [
    "bodyFormat",
    "screenshots",
    "techStack",
    "featured",
    "sortOrder",
  ]);

  assertOmittedFieldsStayAbsent("certificate", certificateUpdateSchema, { isVisible: false }, [
    "sortOrder",
  ]);

  assertOmittedFieldsStayAbsent("skill", skillUpdateSchema, { isVisible: false }, [
    "sortOrder",
  ]);

  // A genuine explicit value must still survive the update parse.
  const explicit = projectUpdateSchema.parse({ isVisible: false, sortOrder: 7 }) as Record<string, unknown>;
  assert.equal(explicit.isVisible, false);
  assert.equal(explicit.sortOrder, 7);

  console.log("validation tests passed");
}

main();
