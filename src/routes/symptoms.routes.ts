import { Router } from 'express'
import { listSymptoms, createSymptom, analyzeSymptoms } from '../controllers/symptoms.controller'

const router = Router()

router.get('/', listSymptoms)
router.post('/', createSymptom)
router.post('/analyze', analyzeSymptoms)

export default router


/**
 * @openapi
 * /api/symptoms:
 *   get:
 *     summary: List my symptom reports
 *     responses:
 *       200: { description: Array of reports }
 *   post:
 *     summary: Create a symptom report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description]
 *             properties:
 *               description: { type: string }
 *     responses:
 *       201: { description: Created }
 */
