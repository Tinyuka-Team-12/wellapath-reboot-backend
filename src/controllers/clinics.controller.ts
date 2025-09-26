// src/controllers/clinics.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
export const listClinics = async (_req: Request, res: Response) => {
  const data = await prisma.clinic.findMany({ orderBy: { name: 'asc' } })
  res.json({ data })
}