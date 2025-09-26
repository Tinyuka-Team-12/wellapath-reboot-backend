import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { createSymptomSchema } from '../validators/symptoms.schema'
import type { Prisma } from '@prisma/client'

export const listSymptoms = async (req: Request, res: Response) => {
  const userId = req.user?.sub
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })
  const data = await prisma.symptomReport.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
  res.json({ data })
}

export const createSymptom = async (req: Request, res: Response) => {
  const userId = req.user?.sub
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const parsed = createSymptomSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() })
  }

  const { description, severity, gender, yearOfBirth, meta } = parsed.data

  const created = await prisma.symptomReport.create({
    data: {
      userId,
      description,
      // default to a safe value when not provided
      severity: severity ?? 'mild',            // <- key line
      gender,
      yearOfBirth,
      meta: meta as Prisma.InputJsonValue | undefined
    }
  })

  res.status(201).json({ data: created })
}

export const analyzeSymptoms = async (_req: Request, res: Response) => {
  // Placeholder; returns normalized shape for FE
  res.json({
    possible_causes: [],
    recommendations: [],
    raw: { message: 'Analyzer not yet connected' }
  })
}
