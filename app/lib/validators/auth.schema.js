import z from "zod";

export const SignupSchema = z
  .object({
    email: z.string().email().trim().toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number",
      })
      .refine((val) => /[!_@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Password must contain at least one special character",
      })
      .refine((val) => !/\s/.test(val), {
        message: "Password must not contain spaces",
      }),
  })
  .strict();
