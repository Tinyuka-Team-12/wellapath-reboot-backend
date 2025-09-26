// src/controllers/symptoms.controller.ts
import { Request, Response } from 'express'
import { createSymptomSchema } from '../validators/symptoms.schema'
export const listSymptoms = async (_req: Request, res: Response) => res.json({ data: [] })
export const createSymptom = async (req: Request, res: Response) => {
  const parse = createSymptomSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() })
  res.status(201).json({ data: { id: 'stub', ...parse.data } })
}
export const analyzeSymptoms = async (_req: Request, res: Response) => {
  res.json({ possible_causes: [], recommendations: [], raw: { message: 'Analyzer stub' } })
}
