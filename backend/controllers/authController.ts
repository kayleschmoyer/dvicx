import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as authService from '../services/authService';
import { loginSchema } from '../validators/authValidator';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { mechanicId, pin } = loginSchema.parse(req.body);
    const mechanic = await authService.login(mechanicId, pin);
    if (!mechanic) {
      res.status(401).json({ error: 'Invalid credentials', status: 401 });
      return;
    }
    const token = jwt.sign(
      { mechanicId: mechanic.mechanicId, role: mechanic.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      mechanicId: mechanic.mechanicId,
      name: mechanic.name,
      role: mechanic.role,
      token,
    });
  } catch (error: any) {
    if (error?.issues) {
      res.status(400).json({ error: error.issues[0].message, status: 400 });
      return;
    }
    next(error);
  }
}

