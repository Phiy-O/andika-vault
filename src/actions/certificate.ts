"use server";

import { certificateService } from "@/src/services";
import {
  certificateSchema,
  certificateUpdateSchema,
} from "@/src/lib/validations";
import type {
  CertificateCreateInput,
  CertificateUpdateInput,
} from "@/src/types";
import type { Certificate } from "@prisma/client";

type ActionResult<T> = { data?: T; error?: string };

export async function getCertificates(): Promise<
  ActionResult<Certificate[]>
> {
  try {
    const certs = await certificateService.getVisible();
    return { data: certs as any };
  } catch (e: any) {
    return { error: e.message ?? "Failed to fetch certificates" };
  }
}

export async function getAllCertificates(): Promise<
  ActionResult<Certificate[]>
> {
  try {
    const certs = await certificateService.getAll();
    return { data: certs as any };
  } catch (e: any) {
    return { error: e.message ?? "Failed to fetch certificates" };
  }
}

export async function createCertificate(
  input: CertificateCreateInput
): Promise<ActionResult<Certificate>> {
  try {
    const parsed = certificateSchema.parse(input);
    const cert = await certificateService.create(parsed as any);
    return { data: cert as any };
  } catch (e: any) {
    if (e.issues)
      return { error: e.issues.map((i: any) => i.message).join(", ") };
    return { error: e.message ?? "Failed to create certificate" };
  }
}

export async function updateCertificate(
  id: string,
  input: CertificateUpdateInput
): Promise<ActionResult<Certificate>> {
  try {
    const parsed = certificateUpdateSchema.parse(input);
    const cert = await certificateService.update(id, parsed as any);
    return { data: cert as any };
  } catch (e: any) {
    if (e.issues)
      return { error: e.issues.map((i: any) => i.message).join(", ") };
    return { error: e.message ?? "Failed to update certificate" };
  }
}

export async function deleteCertificate(
  id: string
): Promise<ActionResult<void>> {
  try {
    await certificateService.delete(id);
    return {};
  } catch (e: any) {
    return { error: e.message ?? "Failed to delete certificate" };
  }
}
