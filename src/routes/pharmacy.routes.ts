// pharmacy.routes.ts
import { Router } from 'express'
import { prisma } from '../lib/prisma'
const router = Router()
router.get('/', async (_req, res) => {
  const data = await prisma.pharmacy.findMany({ orderBy: { name: 'asc' } })
  res.json({ data })
})
export default router



/**
 * @openapi
 * /api/pharmacy:
 *   get:
 *     summary: List pharmacies (optional geo + premium filters)
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema: { type: number }
 *       - in: query
 *         name: lng
 *         schema: { type: number }
 *       - in: query
 *         name: radiusKm
 *         schema: { type: number, default: 5 }
 *       - in: query
 *         name: premium
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Pharmacy list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pharmacy'
 */
