import { Request, Response, NextFunction } from 'express';
import * as companyService from '../services/companyService';

export async function getCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const companies = await companyService.list();
    res.json(companies);
  } catch (error) {
    next(error);
  }
}
