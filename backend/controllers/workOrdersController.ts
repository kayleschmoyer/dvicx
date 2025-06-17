import { Request, Response } from 'express';
import * as workOrdersService from '../services/workOrdersService';

export async function getWorkOrders(req: Request, res: Response): Promise<void> {
  const mechanicId = parseInt(req.params.mechanicId || '', 10);
  if (!mechanicId) {
    res.status(400).json({ message: 'mechanicId required' });
    return;
  }

  try {
    const orders = await workOrdersService.findByMechanicId(mechanicId);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
