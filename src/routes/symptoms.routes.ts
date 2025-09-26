// symptoms.routes.ts
import { Router } from 'express'
const router = Router()
router.get('/', (_req, res) => res.json({ data: [] }))
router.post('/', (_req, res) => res.status(201).json({ data: { id: 'stub' } }))
router.post('/analyze', (_req, res) => res.json({ possible_causes: [], recommendations: [], raw: {} }))
export default router
