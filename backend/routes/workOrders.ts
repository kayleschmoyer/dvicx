import { Router } from 'express';
import { getWorkOrders } from '../controllers/workOrdersController';

const router = Router();

/**
 * @openapi
 * /api/work-orders/{mechanicId}:
 *   get:
 *     summary: Retrieve work orders assigned to a mechanic
 *     tags:
 *       - WorkOrders
 *     parameters:
 *       - in: path
 *         name: mechanicId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: List of work orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkOrder'
 */
router.get('/:mechanicId', getWorkOrders);

export default router;
