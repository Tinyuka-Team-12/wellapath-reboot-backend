import type { NextFunction, Request, Response } from 'express'

const AUTH_ENABLED = String(process.env.AUTH_ENABLED ?? 'true') === 'true'
const DEV_BYPASS   = String(process.env.AUTH_DEV_BYPASS ?? 'false') === 'true'

const REGION       = process.env.COGNITO_REGION
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID
const CLIENT_ID    = process.env.COGNITO_CLIENT_ID

const ISSUER = REGION && USER_POOL_ID
  ? `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`
  : undefined

// cache for lazily created JWKS and verifier
let _jwks: any | null = null
let _jwtVerify: any | null = null

async function getVerifier() {
  if (!_jwtVerify || !_jwks) {
    // Lazy import ESM-only 'jose' so Jest (CJS) won't parse it in tests
    const jose = await import('jose')
    _jwks = jose.createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`))
    _jwtVerify = jose.jwtVerify
  }
  return { jwtVerify: _jwtVerify, JWKS: _jwks }
}

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

    if (DEV_BYPASS) {
      req.user = { sub: 'dev-bypass', email: 'dev@wellapath.local', role: 'USER' }
      return next()
    }

    if (!ISSUER || !CLIENT_ID) {
      return res.status(500).json({ error: 'Auth not configured on server' })
    }

    const auth = req.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : ''
    if (!token) return res.status(401).json({ error: 'Missing Bearer token' })

    const { jwtVerify, JWKS } = await getVerifier()
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: CLIENT_ID,
    })

    req.user = {
      sub: String(payload.sub),
      email: (payload.email as string) || undefined,
      'cognito:groups': payload['cognito:groups'],
      ...payload,
    }

    return next()
  } catch (err: any) {
    // Optional extra visibility during local debugging
    // console.error('JWT verify error:', err?.message)
    return res.status(401).json({ error: 'Invalid or expired token', detail: err?.message })
  }
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const groups = (req.user?.['cognito:groups'] as string[]) || []
    if (groups.includes(role)) return next()
    return res.status(403).json({ error: 'Forbidden' })
  }
}
