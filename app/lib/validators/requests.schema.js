import { z } from "zod";

export const createRequestSchema = z.object({
  title: z.string().trim().min(5).max(100),

  description: z.string().trim().min(10).max(1000),

  pricePerHour: z.number().int().positive(),
});
