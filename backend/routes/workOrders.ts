import { Router } from 'express';
import { getWorkOrders } from '../controllers/workOrderController';

const router = Router();

router.get('/:mechanicId', getWorkOrders);

export default router;
