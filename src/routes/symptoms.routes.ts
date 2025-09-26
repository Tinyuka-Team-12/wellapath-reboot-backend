// symptoms.routes.ts
import { Router } from 'express'
const router = Router()
router.get('/', (_req, res) => res.json({ data: [] }))
router.post('/', (_req, res) => res.status(201).json({ data: { id: 'stub' } }))
router.post('/analyze', (_req, res) => res.json({ possible_causes: [], recommendations: [], raw: {} }))
export default router

/**
 * @openapi
 * /api/symptoms:
 *   get:
 *     summary: List my symptom reports
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of my symptoms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SymptomReport'
 *   post:
 *     summary: Create a symptom report
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description]
 *             properties:
 *               description:
 *                 type: string
 *               severity:
 *                 type: string
 *                 enum: [mild, moderate, severe]
 *               gender:
 *                 type: string
 *               yearOfBirth:
 *                 type: integer
 *               meta:
 *                 type: object
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/SymptomReport'
 */
