import { Request, Response } from 'express';
import * as inspectionService from '../services/inspectionService';

export async function getLineItems(req: Request, res: Response): Promise<void> {
  const orderId = parseInt(req.params.orderId || '', 10);
  if (!orderId) {
    res.status(400).json({ message: 'orderId required' });
    return;
  }

  try {
    const items = await inspectionService.findLineItems(orderId);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function submitInspection(req: Request, res: Response): Promise<void> {
  const { orderId, mechanicId, items } = req.body;
  if (!orderId || !mechanicId || !Array.isArray(items)) {
    res.status(400).json({ message: 'orderId, mechanicId and items are required' });
    return;
  }

  try {
    await inspectionService.submitInspection(orderId, mechanicId, items);
    res.json({ message: 'Inspection submitted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
