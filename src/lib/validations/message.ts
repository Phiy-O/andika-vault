import { z } from "zod";

export const messageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(5000),
  consent: z.literal(true, {
    error: "Please consent to be contacted",
  }),
});
