import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())


app.get('/', (_req, res) => {
  res.type('text').send('WellaPath Backend is running. Try GET /health')
})
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'wellapath-backend', version: 1 })
})

export default app
