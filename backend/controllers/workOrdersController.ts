import { Request, Response, NextFunction } from 'express';
import * as workOrdersService from '../services/workOrdersService';
import { workOrdersParamSchema } from '../validators/inspectionValidator';

export async function getWorkOrders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { mechanicId } = workOrdersParamSchema.parse(req.params);
    const orders = await workOrdersService.findByMechanicId(mechanicId);
    res.json(orders);
  } catch (error: any) {
    if (error?.issues) {
      res.status(400).json({ error: error.issues[0].message, status: 400 });
      return;
    }
    next(error);
  }
}
