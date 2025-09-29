// clinics.routes.ts
import { Router } from 'express'
import { prisma } from '../lib/prisma'
const router = Router()
router.get('/', async (_req, res) => {
  const data = await prisma.clinic.findMany({ orderBy: { name: 'asc' } })
  res.json({ data })
})
export default router



/**
 * @openapi
 * /api/clinics:
 *   get:
 *     summary: List clinics
 *     responses:
 *       200:
 *         description: Array of clinics
 */
