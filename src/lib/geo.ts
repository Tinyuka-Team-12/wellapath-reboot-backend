// Haversine distance in kilometers
export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const R = 6371 // Earth radius (km)
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const lat1 = toRad(aLat)
  const lat2 = toRad(bLat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Simple bounding box (approx) for a given radius in km (near equator acceptable for MVP)
export function bbox(lat: number, lng: number, radiusKm: number) {
  const deg = radiusKm / 111 // ~111km per degree
  return { minLat: lat - deg, maxLat: lat + deg, minLng: lng - deg, maxLng: lng + deg }
}
