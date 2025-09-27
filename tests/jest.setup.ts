import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

beforeAll(() => {
  // Force test env file to be respected if needed
  process.env.NODE_ENV = 'test'
  process.env.AUTH_ENABLED = 'true'
  process.env.AUTH_DEV_BYPASS = 'true'
})

afterAll(async () => {
  await prisma.$disconnect()
})
