import { Router } from 'express';
import authRoutes from './auth';
import workOrderRoutes from './workOrders';

const router = Router();

router.use('/auth', authRoutes);
router.use('/workorders', workOrderRoutes);

export default router;

