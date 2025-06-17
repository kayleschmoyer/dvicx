import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import authRoutes from './auth';
import workOrderRoutes from './workOrders';
import inspectionRoutes from './inspections';
import mechanicRoutes from './mechanics';

const router = Router();

router.use('/auth', authRoutes);
router.use('/mechanics', mechanicRoutes);
router.use(authMiddleware);
router.use('/work-orders', workOrderRoutes);
router.use('/', inspectionRoutes);

export default router;

