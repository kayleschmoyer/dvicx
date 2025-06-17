import { Request, Response, NextFunction } from 'express';
import * as inspectionService from '../services/inspectionService';
import { submitInspectionSchema } from '../validators/inspectionValidator';

export async function getLineItems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const orderId = parseInt(req.params.orderId || '', 10);
  if (!orderId) {
    res.status(400).json({ error: 'orderId required', status: 400 });
    return;
  }

  try {
    const items = await inspectionService.findLineItems(orderId);
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function submitInspection(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { orderId, mechanicId, items } = submitInspectionSchema.parse(req.body);
    await inspectionService.submitInspection(orderId, mechanicId, items);
    res.json({ message: 'Inspection submitted' });
  } catch (error: any) {
    if (error?.issues) {
      res.status(400).json({ error: error.issues[0].message, status: 400 });
      return;
    }
    next(error);
  }
}
