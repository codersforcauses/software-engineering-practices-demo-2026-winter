import { generateHexes } from '../library.config.js'

export const HEXES   = generateHexes(__HEX_COUNT__)
export const WALLS   = __WALLS__
export const SHELVES = __SHELVES__
export const VOLUMES = __VOLUMES__
export const PAGES   = __PAGES__

export const BASE = '/library'

export const pad2 = n => String(n).padStart(2, '0')
export const pad3 = n => String(n).padStart(3, '0')

const range = (n, start = 1) => Array.from({ length: n }, (_, i) => i + start)

export function children(parts) {
  if (parts.length === 0) return HEXES.map(h => ({ label: h, hash: h }))
  if (parts.length === 1) return range(WALLS).map(n   => ({ label: `wall-${n}`,      hash: `${parts[0]}/wall-${n}` }))
  if (parts.length === 2) return range(SHELVES).map(n => ({ label: `shelf-${n}`,     hash: `${parts.join('/')}/shelf-${n}` }))
  if (parts.length === 3) return range(VOLUMES).map(n => ({ label: `vol-${pad2(n)}`, hash: `${parts.join('/')}/vol-${pad2(n)}` }))
  if (parts.length === 4) return range(PAGES).map(n   => ({ label: `page-${pad3(n)}`, hash: `${parts.join('/')}/page-${pad3(n)}` }))
  return []
}
