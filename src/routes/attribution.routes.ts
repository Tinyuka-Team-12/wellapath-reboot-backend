import { Router } from 'express'
const router = Router()
router.get('/osm', (_req, res) => {
  res.json({
    provider: 'OpenStreetMap Nominatim',
    terms: 'https://operations.osmfoundation.org/policies/nominatim/',
    attribution: '© OpenStreetMap contributors'
  })
})
export default router
