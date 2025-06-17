import { z } from 'zod';

export const loginSchema = z
  .object({
    mechanicId: z.number().optional(),
    pin: z.string().optional(),
  })
  .refine((data) => data.mechanicId !== undefined || data.pin !== undefined, {
    message: 'mechanicId or pin required',
  });
