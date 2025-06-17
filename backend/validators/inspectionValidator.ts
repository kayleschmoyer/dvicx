import { z } from 'zod';

export const workOrdersParamSchema = z.object({
  mechanicId: z.coerce.number().int().positive(),
});

const inspectionItemSchema = z.object({
  lineItemId: z.number(),
  status: z.string(),
  reason: z.string().optional(),
  photo: z.string().optional(),
});

export const submitInspectionSchema = z.object({
  orderId: z.number(),
  mechanicId: z.number(),
  items: z.array(inspectionItemSchema),
});
