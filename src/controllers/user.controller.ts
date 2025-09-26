import { Request, Response } from 'express'

export const getMe = async (req: Request, res: Response) => {
  // set by auth middleware (or dev bypass)
  res.json({ user: req.user ?? null })
}
