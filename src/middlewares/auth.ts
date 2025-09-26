import type { NextFunction, Request, Response } from 'express'
import { createRemoteJWKSet, jwtVerify } from 'jose'

const AUTH_ENABLED = String(process.env.AUTH_ENABLED ?? 'true') === 'true'
const DEV_BYPASS   = String(process.env.AUTH_DEV_BYPASS ?? 'false') === 'true'

const REGION       = process.env.COGNITO_REGION
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID
const CLIENT_ID    = process.env.COGNITO_CLIENT_ID // audience

// Derive issuer and JWKS URL (Cognito standard)
const ISSUER = REGION && USER_POOL_ID
  ? `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`
  : undefined

let JWKS: ReturnType<typeof createRemoteJWKSet> | null = null
if (ISSUER) {
  JWKS = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`))
}

// Attach a minimal user shape on Request
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      sub: string
      email?: string
      [k: string]: any
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    if (!AUTH_ENABLED) return next()

    // Dev bypass for local work (no tokens required)
    if (DEV_BYPASS) {
      req.user = { sub: 'dev-bypass', email: 'dev@wellapath.local', role: 'USER' }
      return next()
    }

    if (!ISSUER || !JWKS || !CLIENT_ID) {
      return res.status(500).json({ error: 'Auth not configured on server' })
    }

    const auth = req.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : ''

    if (!token) {
      return res.status(401).json({ error: 'Missing Bearer token' })
    }

    // Verify with JWKS & standard claims
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: CLIENT_ID, // your app client id as audience
    })

    // Map common Cognito claims
    req.user = {
      sub: String(payload.sub),
      email: (payload.email as string) || undefined,
      'cognito:groups': payload['cognito:groups'],
      ...payload, // keep extra claims if helpful
    }

    return next()
  } catch (err: any) {
    return res.status(401).json({ error: 'Invalid or expired token', detail: err?.message })
  }
}

// Optional helper to require specific roles (via a claim)
export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const groups = (req.user?.['cognito:groups'] as string[]) || []
    if (groups.includes(role)) return next()
    return res.status(403).json({ error: 'Forbidden' })
  }
}
