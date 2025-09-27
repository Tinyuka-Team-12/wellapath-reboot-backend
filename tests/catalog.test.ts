import request from 'supertest'
import app from '../src/app'

describe('Clinics & Pharmacy', () => {
  it('GET /api/clinics returns an array', async () => {
    const res = await request(app).get('/api/clinics')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('GET /api/pharmacy returns an array', async () => {
    const res = await request(app).get('/api/pharmacy')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})
