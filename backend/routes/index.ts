import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import authRoutes from './auth';
import workOrderRoutes from './workOrders';
import inspectionRoutes from './inspections';
import mechanicRoutes from './mechanics';
import companyRoutes from './companies';

const router = Router();

router.use('/auth', authRoutes);
router.use('/mechanics', mechanicRoutes);
router.use('/companies', companyRoutes);
router.use(authMiddleware);
router.use('/work-orders', workOrderRoutes);
router.use('/', inspectionRoutes);

export default router;

