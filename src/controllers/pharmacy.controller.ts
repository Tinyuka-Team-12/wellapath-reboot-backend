// src/controllers/pharmacy.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
export const listPharmacies = async (_req: Request, res: Response) => {
  const data = await prisma.pharmacy.findMany({ orderBy: { name: 'asc' } })
  res.json({ data })
}