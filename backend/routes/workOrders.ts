import { Router } from 'express';
import { getWorkOrders } from '../controllers/workOrdersController';

const router = Router();

router.get('/:mechanicId', getWorkOrders);

export default router;
