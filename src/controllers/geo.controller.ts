// src/controllers/geo.controller.ts
import { Request, Response } from 'express'
export const reverseGeocode = async (req: Request, res: Response) => {
  const { lat, lng } = req.query
  if (!lat || !lng) return res.status(400).json({ error: 'lat and lng are required' })
  res.json({ lat, lng, address: null, note: 'reverse geocode stub' })
}
export const nearbyPlaces = async (req: Request, res: Response) => {
  const { lat, lng, type } = req.query
  if (!lat || !lng || !type) return res.status(400).json({ error: 'lat, lng, and type are required' })
  res.json({ lat, lng, type, data: [], note: 'nearby search stub' })
}