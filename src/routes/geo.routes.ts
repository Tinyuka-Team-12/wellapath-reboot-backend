// geo.routes.ts
import { Router } from 'express'
const router = Router()
router.get('/reverse', (req, res) => {
  const { lat, lng } = req.query
  if (!lat || !lng) return res.status(400).json({ error: 'lat and lng are required' })
  res.json({ lat, lng, address: null, note: 'reverse geocode stub' })
})
router.get('/nearby', (req, res) => {
  const { lat, lng, type } = req.query
  if (!lat || !lng || !type) return res.status(400).json({ error: 'lat, lng, and type are required' })
  res.json({ lat, lng, type, data: [], note: 'nearby search stub' })
})
export default router
