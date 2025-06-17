import { Router } from 'express';
import { getLineItems, submitInspection } from '../controllers/inspectionController';

const router = Router();

router.get('/line-items/:orderId', getLineItems);
router.post('/inspections/submit', submitInspection);

export default router;
