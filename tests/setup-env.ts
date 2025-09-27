import * as dotenv from 'dotenv'
// Force Jest to use .env.test (NOT .env)
dotenv.config({ path: '.env.test' })

// Make sure test flags are applied early
process.env.NODE_ENV = 'test'
process.env.AUTH_ENABLED = process.env.AUTH_ENABLED ?? 'true'
process.env.AUTH_DEV_BYPASS = process.env.AUTH_DEV_BYPASS ?? 'true'
