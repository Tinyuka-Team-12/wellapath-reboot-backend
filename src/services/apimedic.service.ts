import axios from 'axios'
import ms from 'ms'

const AUTH_BASE = process.env.APIMEDIC_AUTH_BASE || 'https://sandbox-authservice.priaid.ch'
const BASE = process.env.APIMEDIC_BASE || 'https://sandbox-healthservice.priaid.ch'
const USER = process.env.APIMEDIC_USER!
const KEY  = process.env.APIMEDIC_KEY!
const LANG = process.env.APIMEDIC_LANG || 'en-gb'
const FORMAT = process.env.APIMEDIC_FORMAT || 'json'

// simple in-memory token cache
let tokenCache: { token: string; exp: number } | null = null

async function getToken(): Promise<string> {
  const now = Date.now()
  if (tokenCache && tokenCache.exp - now > 10_000) return tokenCache.token

  // ApiMedic auth host!
  const url = `${AUTH_BASE}/login?user=${encodeURIComponent(USER)}&password=${encodeURIComponent(KEY)}&format=${FORMAT}`
  const { data } = await axios.get(url, { headers: { 'accept-language': LANG } })

  /**
   * ApiMedic can return:
   *  - { Token: "<jwt>", ValidThrough: "2025-09-27T..." }
   *  - or just a token string
   */
  const token = (data?.Token ?? data) as string
  const validThrough = (data?.ValidThrough as string | undefined)
  const exp = validThrough ? new Date(validThrough).getTime() : now + ms('50m')

  tokenCache = { token, exp }
  return token
}


export async function searchSymptoms(query: string) {
  const token = await getToken()
  const url = `${BASE}/symptoms/proposed?language=${LANG}&symptoms=${encodeURIComponent(query)}&format=${FORMAT}`
  const { data } = await axios.get(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  // Normalize to FE contract (simple pass-through array for now)
  return Array.isArray(data) ? data : []
}

export type DiagnoseInput = {
  age: number
  sex: 'male' | 'female'
  symptomIds: number[]
  locale?: string
}

export async function diagnose(payload: DiagnoseInput) {
  const token = await getToken()
  const url = `${BASE}/diagnosis?language=${LANG}&format=${FORMAT}`
  // ApiMedic expects symptoms as JSON array string; include gender/age
  const params = new URLSearchParams({
    symptoms: JSON.stringify(payload.symptomIds),
    gender: payload.sex,
    year_of_birth: String(new Date().getFullYear() - payload.age),
  })
  const { data } = await axios.get(url + `&${params.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  // Normalize top-3 results with minimal fields
  const items = Array.isArray(data) ? data.slice(0, 3) : []
  return items.map((it: any) => ({
    id: it?.Issue?.ID,
    name: it?.Issue?.Name,
    accuracy: it?.Issue?.Accuracy,
    icd: it?.Issue?.IcdName,
    triage: it?.Specialisation?.[0]?.Name ?? null
  }))
}

export async function issueDetails(issueId: string | number) {
  const token = await getToken()
  const url = `${BASE}/issues/${issueId}/info?language=${LANG}&format=${FORMAT}`
  const { data } = await axios.get(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return {
    id: data?.ID ?? issueId,
    name: data?.Name ?? null,
    profName: data?.ProfName ?? null,
    description: data?.DescriptionShort ?? null
  }
}
