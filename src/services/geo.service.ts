import ms from 'ms'
import NodeCache from 'node-cache'

type NearbyType = 'clinic' | 'pharmacy'

// Simple in-memory cache
const ttlMs = ms(process.env.GEO_CACHE_TTL || '5m')
const cache = new NodeCache({ stdTTL: Math.max(1, Math.floor(ttlMs / 1000)) })

// Global throttle: at most N requests per second to Nominatim
const MAX_RPS = Number(process.env.GEO_RATE_PER_SECOND || 1)
let lastTick = 0
let tokens = MAX_RPS

function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}

async function takeToken() {
  while (true) {
    const now = Date.now()
    // Refill each second
    if (now - lastTick >= 1000) {
      tokens = MAX_RPS
      lastTick = now
    }
    if (tokens > 0) {
      tokens -= 1
      return
    }
    await sleep(50)
  }
}

function buildHeaders() {
  const contact = process.env.NOMINATIM_CONTACT || 'contact@wellapath.local'
  // Per Nominatim policy: include valid identifying User-Agent
  const ua = `WellaPath/1.0 (${contact})`
  return {
    'User-Agent': ua,
    'Accept': 'application/json'
  }
}

const BASE = process.env.NOMINATIM_BASE || 'https://nominatim.openstreetmap.org'

export async function reverseGeocode(lat: number, lng: number) {
  const key = `rev:${lat.toFixed(5)},${lng.toFixed(5)}`
  const cached = cache.get(key)
  if (cached) return cached

  await takeToken()

  const url = new URL(`${BASE}/reverse`)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lng))
  url.searchParams.set('addressdetails', '1')

  const res = await fetch(url, { headers: buildHeaders() })
  if (!res.ok) throw new Error(`Nominatim reverse ${res.status}`)
  const json = await res.json()

  const data = {
    lat,
    lng,
    address: json?.display_name || null,
    raw: json
  }
  cache.set(key, data)
  return data
}

// For nearby we’ll lean on "search" with a simple keyword within a viewbox around the point.
// (MVP; later we can switch to Overpass if needed.)
export async function nearbyPlaces(lat: number, lng: number, type: NearbyType) {
  const key = `near:${type}:${lat.toFixed(4)},${lng.toFixed(4)}`
  const cached = cache.get(key)
  if (cached) return cached

  await takeToken()

  // small bbox ~1.5km around point (approx deg): 0.02 ≈ 2km near equator
  const delta = 0.02
  const left = lng - delta
  const right = lng + delta
  const top = lat + delta
  const bottom = lat - delta

  // map type to keyword
  const q = type === 'clinic' ? 'clinic' : 'pharmacy'

  const url = new URL(`${BASE}/search`)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('q', q)
  url.searchParams.set('bounded', '1')
  url.searchParams.set('limit', '20')
  url.searchParams.set('viewbox', `${left},${top},${right},${bottom}`)

  const res = await fetch(url, { headers: buildHeaders() })
  if (!res.ok) throw new Error(`Nominatim search ${res.status}`)
  const json: any[] = await res.json()

  const items = json.map((it: any) => ({
    name: it?.display_name?.split(',')[0]?.trim() || q,
    lat: Number(it?.lat),
    lng: Number(it?.lon),
    address: it?.display_name || null
  }))

  const data = { lat, lng, type, count: items.length, data: items }
  cache.set(key, data)
  return data
}
