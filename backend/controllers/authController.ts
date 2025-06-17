import { Request, Response } from 'express';
import * as authService from '../services/authService';

export async function login(req: Request, res: Response): Promise<void> {
  const { mechanicId, pin } = req.body;
  if (!mechanicId && !pin) {
    res.status(400).json({ message: 'mechanicId or pin required' });
    return;
  }

  try {
    const mechanic = await authService.login(mechanicId, pin);
    if (!mechanic) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    res.json({
      mechanicId: mechanic.mechanicId,
      name: mechanic.name,
      role: mechanic.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

