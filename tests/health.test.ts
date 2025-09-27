import request from 'supertest'
import app from '../src/app'

describe('Health endpoints', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })

  it('GET /health/db returns db ok', async () => {
    const res = await request(app).get('/health/db')
    expect(res.status).toBe(200)
    expect(res.body.db).toBe(true)
  })
})
