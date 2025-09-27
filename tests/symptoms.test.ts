import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/lib/prisma'

describe('Symptoms (dev bypass)', () => {
  beforeAll(async () => {
    // ensure clean table for this user
    await prisma.symptomReport.deleteMany({ where: { userId: 'dev-bypass' } })
  })

  it('GET /api/symptoms starts empty', async () => {
    const res = await request(app).get('/api/symptoms')
    expect(res.status).toBe(200)
    expect(res.body.data).toEqual([])
  })

  it('POST /api/symptoms creates a report', async () => {
    const res = await request(app)
      .post('/api/symptoms')
      .send({ description: 'headache' })
      .set('Content-Type', 'application/json')
    expect(res.status).toBe(201)
    expect(res.body.data.description).toBe('headache')
  })

  it('GET /api/symptoms now has 1', async () => {
    const res = await request(app).get('/api/symptoms')
    expect(res.status).toBe(200)
    expect(res.body.data.length).toBe(1)
  })
})
