import z from "zod";

export const SignupSchema = z
  .object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(4),
  })
  .strict();
