"use server";

import { certificateService } from "@/src/services";
import {
  certificateSchema,
  certificateUpdateSchema,
} from "@/src/lib/validations";
import type {
  CertificateCreateInput,
  CertificateListItem,
  CertificateUpdateInput,
} from "@/src/types";
import type { Certificate } from "@prisma/client";
import { requireAdmin } from "@/src/lib/auth";
import { actionError } from "./action-error";

type ActionResult<T> = { data?: T; error?: string };

export async function getCertificates(): Promise<
  ActionResult<CertificateListItem[]>
> {
  try {
    const certs = await certificateService.getVisible();
    return { data: certs };
  } catch (e) {
    return { error: actionError(e, "Failed to fetch certificates") };
  }
}

export async function getAllCertificates(): Promise<
  ActionResult<CertificateListItem[]>
> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    const certs = await certificateService.getAll();
    return { data: certs };
  } catch (e) {
    return { error: actionError(e, "Failed to fetch certificates") };
  }
}

export async function createCertificate(
  input: CertificateCreateInput
): Promise<ActionResult<Certificate>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    const parsed = certificateSchema.parse(input);
    const cert = await certificateService.create(parsed);
    return { data: cert };
  } catch (e) {
    return { error: actionError(e, "Failed to create certificate") };
  }
}

export async function updateCertificate(
  id: string,
  input: CertificateUpdateInput
): Promise<ActionResult<Certificate>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    const parsed = certificateUpdateSchema.parse(input);
    const cert = await certificateService.update(id, parsed);
    return { data: cert };
  } catch (e) {
    return { error: actionError(e, "Failed to update certificate") };
  }
}

export async function deleteCertificate(
  id: string
): Promise<ActionResult<void>> {
  if (!(await requireAdmin())) return { error: "Unauthorized" };
  try {
    await certificateService.delete(id);
    return {};
  } catch (e) {
    return { error: actionError(e, "Failed to delete certificate") };
  }
}
