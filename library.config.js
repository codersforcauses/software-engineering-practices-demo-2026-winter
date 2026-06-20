export const HEX_COUNT = 50
export const WALLS     = 4
export const SHELVES   = 2
export const VOLUMES   = 5
export const PAGES     = 10

export function generateHexes(count) {
  let s = 0xba5eba11
  const rng = () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0x100000000 }
  const h = '0123456789abcdef'
  return Array.from({ length: count }, () =>
    Array.from({ length: 8 }, () => h[Math.floor(rng() * 16)]).join('')
  )
}
