import { defineConfig } from 'vite'
import { HEX_COUNT, WALLS, SHELVES, VOLUMES, PAGES } from './library.config.js'

export default defineConfig({
  define: {
    __HEX_COUNT__: HEX_COUNT,
    __WALLS__:     WALLS,
    __SHELVES__:   SHELVES,
    __VOLUMES__:   VOLUMES,
    __PAGES__:     PAGES,
  },
})
