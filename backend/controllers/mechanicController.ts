import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as mechanicService from '../services/mechanicService';
import {
  mechanicsParamsSchema,
  mechanicLoginSchema,
} from '../validators/mechanicValidator';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function getMechanics(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { companyId } = mechanicsParamsSchema.parse(req.params);
    const list = await mechanicService.list(companyId);
    res.json(list);
  } catch (error: any) {
    if (error?.issues) {
      res.status(400).json({ error: error.issues[0].message, status: 400 });
      return;
    }
    next(error);
  }
}

export async function verifyLogin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { companyId, mechanicNumber, pin } = mechanicLoginSchema.parse(req.body);
    const mech = await mechanicService.verifyLogin(companyId, mechanicNumber, pin);
    if (!mech) {
      res.status(401).json({ error: 'Invalid credentials', status: 401 });
      return;
    }
    const token = jwt.sign(
      { mechanicNumber: mech.mechanicNumber, role: mech.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      mechanicNumber: mech.mechanicNumber,
      name: mech.name,
      role: mech.role,
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
