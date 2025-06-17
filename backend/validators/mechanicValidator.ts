import { z } from 'zod';

export const mechanicsParamsSchema = z.object({
  companyId: z.coerce.number().int().positive(),
});

export const mechanicLoginSchema = z.object({
  companyId: z.number(),
  mechanicNumber: z.number(),
  pin: z.string(),
});
