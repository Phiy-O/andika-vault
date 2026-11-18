import { notFound } from "next/navigation";
import { skillService } from "@/src/services";
import { SkillForm } from "@/components/admin/SkillForm";

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const skill = await skillService.getById(id);
  if (!skill) notFound();

  return <SkillForm skill={skill} />;
}