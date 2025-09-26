// src/validators/symptoms.schema.ts
import { z } from 'zod'
export const createSymptomSchema = z.object({
  description: z.string().min(3),
  severity: z.enum(['mild', 'moderate', 'severe']).optional(), // constrained but still optional
  gender: z.string().optional(),
  yearOfBirth: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  meta: z.any().optional()
})
export type CreateSymptomInput = z.infer<typeof createSymptomSchema>