import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const FLYER_TYPES = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'gif']

// Warn about files in flyers/ that the events page will not show (e.g. .heic, .docx).
function checkFlyers() {
  return {
    name: 'check-flyers',
    buildStart() {
      const dir = resolve(import.meta.dirname, 'flyers')
      for (const file of readdirSync(dir)) {
        if (file === 'README.md' || file.startsWith('.')) continue
        const ext = file.split('.').pop().toLowerCase()
        if (!FLYER_TYPES.includes(ext)) {
          this.warn(`flyers/${file} will not appear on the events page. Use PDF, JPG or PNG.`)
        } else if (!/^\d{4}-\d{2}-\d{2}/.test(file)) {
          this.warn(`flyers/${file} has no date at the start of its name, so it will be listed last.`)
        }
      }
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [checkFlyers()],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        events: resolve(import.meta.dirname, 'events/index.html'),
      },
      output: {
        // Flyer names can contain spaces, "&", "#" and so on. Give them plain hashed names.
        assetFileNames: (info) => {
          const original = (info.originalFileNames || [])[0] || ''
          if (!original.includes('flyers/')) return 'assets/[name]-[hash][extname]'
          return `flyers/[hash].${original.split('.').pop().toLowerCase()}`
        },
      },
    },
  },
})
