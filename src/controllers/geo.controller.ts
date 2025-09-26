import { Request, Response } from 'express'
import { reverseGeocode as doReverse, nearbyPlaces as doNearby } from '../services/geo.service'

export const reverseGeocode = async (req: Request, res: Response) => {
  const lat = Number(req.query.lat)
  const lng = Number(req.query.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ error: 'lat and lng are required numbers' })
  }
  try {
    const result = await doReverse(lat, lng)
    res.json(result)
  } catch (e: any) {
    res.status(502).json({ error: 'reverse geocode failed', detail: e.message })
  }
}

export const nearbyPlaces = async (req: Request, res: Response) => {
  const lat = Number(req.query.lat)
  const lng = Number(req.query.lng)
  const type = String(req.query.type)
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !['clinic', 'pharmacy'].includes(type)) {
    return res.status(400).json({ error: 'lat,lng,type=clinic|pharmacy required' })
  }
  try {
    const result = await doNearby(lat, lng, type as 'clinic' | 'pharmacy')
    res.json(result)
  } catch (e: any) {
    res.status(502).json({ error: 'nearby search failed', detail: e.message })
  }
}
