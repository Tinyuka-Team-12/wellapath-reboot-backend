// pharmacy.routes.ts
import { Router } from 'express'
import { prisma } from '../lib/prisma'
const router = Router()
router.get('/', async (_req, res) => {
  const data = await prisma.pharmacy.findMany({ orderBy: { name: 'asc' } })
  res.json({ data })
})
export default router
