/**
 * Haversine formula — distance between two GPS coords in meters
 * @param {{lat: number, lng: number}} a
 * @param {{lat: number, lng: number}} b
 */
export function getDistanceBetween(a, b) {
  const R = 6371000
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

/**
 * Total distance from array of {lat, lng} points in meters
 * @param {{lat: number, lng: number}[]} points
 */
export function getTotalDistance(points) {
  let total = 0
  for (let i = 1; i < points.length; i++) {
    total += getDistanceBetween(points[i - 1], points[i])
  }
  return total
}

/**
 * Pace in seconds per km
 * @param {number} distanceMeters
 * @param {number} durationSeconds
 */
export function getPace(distanceMeters, durationSeconds) {
  if (distanceMeters < 10) return 0
  return (durationSeconds / distanceMeters) * 1000
}

/**
 * Format pace as mm:ss /km
 * @param {number} paceSeconds
 */
export function formatPace(paceSeconds) {
  if (!paceSeconds || paceSeconds === 0) return "--:--"
  const mins = Math.floor(paceSeconds / 60)
  const secs = Math.floor(paceSeconds % 60)
  return `${mins}:${String(secs).padStart(2, "0")}`
}

/**
 * Format duration seconds as HH:MM:SS
 * @param {number} seconds
 */
export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

/**
 * Elevation gain from array of {lat, lng, alt} points
 * @param {{alt?: number}[]} points
 */
export function getElevationGain(points) {
  let gain = 0
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1].alt ?? 0
    const curr = points[i].alt ?? 0
    if (curr > prev) gain += curr - prev
  }
  return Math.round(gain)
}

/**
 * Format meters — show km if >= 1000m
 * @param {number} meters
 */
export function formatDistance(meters) {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`
  return `${Math.round(meters)} m`
}
