import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { prisma } from './lib/prisma'   // <— add this
import api from './routes/index'            // <— we’ll create routes/index.ts in step 3

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())

// Optional root message
app.get('/', (_req, res) => {
  res.type('text').send('WellaPath Backend is running. Try GET /health')
})

// Existing simple health
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'wellapath-backend', version: 1 })
})

// DB health (this is the one you were missing)
app.get('/health/db', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ok: true, db: true })
  } catch (e) {
    res.status(500).json({ ok: false, db: false, error: (e as Error).message })
  }
})

// Mount all API routes at /api
app.use('/api', api)

export default app
