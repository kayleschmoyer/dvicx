import { Router } from 'express';
import { getLineItems, submitInspection } from '../controllers/inspectionController';

const router = Router();

/**
 * @openapi
 * /api/line-items/{orderId}:
 *   get:
 *     summary: Get inspection line items for a work order
 *     tags:
 *       - Inspections
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Array of line items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LineItem'
 */
router.get('/line-items/:orderId', getLineItems);

/**
 * @openapi
 * /api/inspections/submit:
 *   post:
 *     summary: Submit inspection results
 *     tags:
 *       - Inspections
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitInspection'
 *     responses:
 *       '200':
 *         description: Inspection submitted
 */
router.post('/inspections/submit', submitInspection);

export default router;
