// npm run generate
// Writes public/library/<hex>/wall-N/shelf-N/vol-NN/page-NNN.txt

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { HEX_COUNT, WALLS, SHELVES, VOLUMES, PAGES, generateHexes } from './library.config.js'

const HEXES = generateHexes(HEX_COUNT)

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Seeded text generation ───────────────────────────────────────────────────

function mulberry32(a) {
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0
    let t = Math.imul(a ^ a >>> 15, 1 | a)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function hash(s) {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193)
  return h >>> 0
}

const CHARS = 'abcdefghijklmnopqrstuvwxyz ,.'

function genPage(seed) {
  const rng = mulberry32(hash(seed))
  return Array.from({ length: 40 }, () =>
    Array.from({ length: 80 }, () => CHARS[Math.floor(rng() * CHARS.length)]).join('')
  ).join('\n')
}

// ── Write txt files ───────────────────────────────────────────────────────────

const pad2 = n => String(n).padStart(2, '0')
const pad3 = n => String(n).padStart(3, '0')

const outDir = path.join(__dirname, 'public', 'library')

let count = 0
for (const hex of HEXES) {
  for (let w = 1; w <= WALLS; w++) {
    for (let s = 1; s <= SHELVES; s++) {
      for (let v = 1; v <= VOLUMES; v++) {
        for (let p = 1; p <= PAGES; p++) {
          const rel  = path.join(hex, `wall-${w}`, `shelf-${s}`, `vol-${pad2(v)}`, `page-${pad3(p)}.txt`)
          const full = path.join(outDir, rel)
          fs.mkdirSync(path.dirname(full), { recursive: true })
          fs.writeFileSync(full, genPage(`${hex}|${w}|${s}|${v}|${p}`), 'utf8')
          count++
        }
      }
    }
  }
}

console.log(`${count} txt files written to public/library/`)
