// Every file in /flyers is bundled at build time. The file name sets the date and title:
//   "2026-11-05 Fall Mixer.pdf"  ->  November 5, 2026, "Fall Mixer"
const files = import.meta.glob('/flyers/*', { eager: true, query: '?url', import: 'default' })

const IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'webp', 'gif']

function parse(path, url) {
  const name = path.split('/').pop()
  const dot = name.lastIndexOf('.')
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : ''
  const type = ext === 'pdf' ? 'pdf' : IMAGE_TYPES.includes(ext) ? 'image' : null
  if (!type) return null

  let base = dot > 0 ? name.slice(0, dot) : name
  let date = null
  const m = base.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) {
    // Local date on purpose: new Date('2026-11-05') would be UTC and show as Nov 4 in New York.
    date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    base = base.slice(m[0].length)
  }
  const title = base.replace(/[-_]+/g, ' ').trim() || 'Event'

  return { url, type, date, title }
}

export const flyers = Object.entries(files)
  .map(([path, url]) => parse(path, url))
  .filter(Boolean)
  .sort((a, b) => {
    if (a.date && b.date) return b.date - a.date || a.title.localeCompare(b.title)
    if (a.date) return -1
    if (b.date) return 1
    return a.title.localeCompare(b.title)
  })
