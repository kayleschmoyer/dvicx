import { Router } from 'express';
import { getMechanics, verifyLogin } from '../controllers/mechanicController';

const router = Router();

router.get('/:companyId', getMechanics);
router.post('/login', verifyLogin);

export default router;
