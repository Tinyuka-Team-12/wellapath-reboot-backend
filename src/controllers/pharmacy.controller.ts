import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { bbox, distanceKm } from '../lib/geo'

export const listPharmacies = async (req: Request, res: Response) => {
  const lat = req.query.lat ? Number(req.query.lat) : undefined
  const lng = req.query.lng ? Number(req.query.lng) : undefined
  const radiusKm = req.query.radiusKm ? Number(req.query.radiusKm) : 5
  const premium = typeof req.query.premium !== 'undefined'
    ? String(req.query.premium).toLowerCase() === 'true'
    : undefined

  const where: any = {}
  if (premium !== undefined) where.premium = premium

  let data
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    const box = bbox(lat!, lng!, radiusKm)
    where.lat = { gte: box.minLat, lte: box.maxLat }
    where.lng = { gte: box.minLng, lte: box.maxLng }

    const candidates = await prisma.pharmacy.findMany({ where })
    data = candidates
      .map(p => ({ ...p, distanceKm: distanceKm(lat!, lng!, p.lat, p.lng) }))
      .filter(p => p.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm)
  } else {
    data = await prisma.pharmacy.findMany({ where, orderBy: { name: 'asc' } })
  }

  res.json({ data })
}
