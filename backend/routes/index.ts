import { Router } from 'express';
import authRoutes from './auth';
import workOrderRoutes from './workOrders';
import inspectionRoutes from './inspections';

const router = Router();

router.use('/auth', authRoutes);
router.use('/work-orders', workOrderRoutes);
router.use('/', inspectionRoutes);

export default router;

