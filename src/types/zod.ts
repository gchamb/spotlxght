import { z } from "zod";

export const credentialsSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must contain at least 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type Credentials = z.infer<typeof credentialsSchema>;
