import './style.css'
import { HEXES, WALLS, SHELVES, VOLUMES, PAGES, BASE, pad2, pad3, children } from './babel.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

function parsePath() {
  const h = location.hash.slice(1)
  return h ? h.split('/').filter(Boolean) : []
}

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────

function renderCrumb(parts) {
  const el = document.getElementById('crumb')
  if (!parts.length) { el.innerHTML = ''; return }
  el.innerHTML = parts
    .map((seg, i) => `<a href="#${parts.slice(0, i + 1).join('/')}">${seg}</a>`)
    .join('<span class="sep">›</span>')
}

// ── Sidebar nav ───────────────────────────────────────────────────────────────

function renderNav(parts) {
  const list = document.getElementById('nav-list')
  const isPage = parts.length === 5
  const parentParts = isPage ? parts.slice(0, 4) : parts.slice(0, -1)
  const items = children(parentParts)
  if (!items.length) { list.innerHTML = ''; return }

  const labelText = parentParts.length === 4 ? 'pages'
    : parentParts.length === 0 ? 'hexagons'
    : parentParts[parentParts.length - 1]

  const currentSeg = parts[parentParts.length]

  list.innerHTML =
    `<li class="nav-label">${labelText}</li>` +
    items.map(({ label, hash: h }) =>
      `<li><a href="#${h}"${label === currentSeg ? ' class="active"' : ''}>${label}</a></li>`
    ).join('')
}

// ── List view ─────────────────────────────────────────────────────────────────

function renderList(parts) {
  const items = children(parts)
  const levelNames = ['', 'walls', 'shelves', 'volumes', 'pages']
  const heading = parts.length === 0 ? 'Hexagons' : parts[parts.length - 1]

  document.getElementById('content').innerHTML = `
    <div class="list-header">
      <h1>${esc(heading)}</h1>
      <p>${items.length} ${levelNames[parts.length] || ''}</p>
    </div>
    <div class="item-grid">
      ${items.map(({ label, hash: h }) => `<a href="#${h}">${label}</a>`).join('')}
    </div>`
}

// ── Page view ─────────────────────────────────────────────────────────────────

async function renderPage(parts) {
  const page    = parts[4]
  const pageNum = parseInt(page.replace('page-', ''))
  const base    = parts.slice(0, 4).join('/')
  const prev    = pageNum > 1     ? `page-${pad3(pageNum - 1)}` : null
  const next    = pageNum < PAGES ? `page-${pad3(pageNum + 1)}` : null

  document.getElementById('content').innerHTML = `
    <p class="page-address">
      ${parts[0]} &middot; ${parts[1]} &middot; ${parts[2]} &middot; ${parts[3]} &middot; ${page}
    </p>
    <div class="page-frame">
      <p class="page-num">&mdash; ${pageNum} &mdash;</p>
      <pre id="page-text"><span class="loading">loading&hellip;</span></pre>
      <p class="page-num">&mdash; ${pageNum} &mdash;</p>
    </div>
    <div class="page-nav">
      ${prev ? `<a href="#${base}/${prev}">&larr; ${prev}</a>` : '<span class="dim">&larr; prev</span>'}
      <span class="dim">${pageNum} / ${PAGES}</span>
      ${next ? `<a href="#${base}/${next}">${next} &rarr;</a>` : '<span class="dim">next &rarr;</span>'}
    </div>`

  try {
    const res = await fetch(`${BASE}/${parts.join('/')}.txt`)
    if (!res.ok) throw new Error(res.status)
    document.getElementById('page-text').textContent = await res.text()
  } catch {
    document.getElementById('page-text').innerHTML =
      `<span class="error">Could not load file — run via npm run dev, not file://</span>`
  }
}

// ── Welcome ───────────────────────────────────────────────────────────────────

function renderWelcome() {
  document.getElementById('content').innerHTML = `
    <div class="welcome">
      <div class="glyph">&#x2B21;</div>
      <h1>THE LIBRARY<br>OF BABEL</h1>
      <blockquote>
        &ldquo;The Library is a sphere whose exact centre is any one of its hexagons
        and whose circumference is inaccessible.&rdquo;
        <cite>&mdash; Jorge Luis Borges, 1941</cite>
      </blockquote>
      <p>
        ${HEXES.length} hexagonal galleries have been charted, each containing
        ${WALLS} walls, ${SHELVES} shelves, ${VOLUMES} volumes, and ${PAGES} pages.
      </p>
      <p>Select a hexagon from the sidebar, or
        <a href="#${HEXES[0]}">enter ${HEXES[0]}</a>.
      </p>
    </div>`

  document.getElementById('nav-list').innerHTML =
    '<li class="nav-label">hexagons</li>' +
    HEXES.map(h => `<li><a href="#${h}">${h}</a></li>`).join('')
}

// ── Router ────────────────────────────────────────────────────────────────────

function route() {
  const parts = parsePath()
  renderCrumb(parts)

  if (parts.length === 0) {
    renderWelcome()
  } else if (parts.length === 5) {
    renderNav(parts)
    renderPage(parts)
  } else {
    renderNav(parts)
    renderList(parts)
  }
}

window.addEventListener('hashchange', route)
route()
