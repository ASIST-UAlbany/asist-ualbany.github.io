import { flyers } from './flyers.js'

const list = document.querySelector('#events')

const today = new Date()
today.setHours(0, 0, 0, 0)

const formatDate = (d) =>
  d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

function el(tag, className, text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text) node.textContent = text
  return node
}

function pdfPlaceholder(thumb) {
  thumb.replaceChildren(el('span', 'pdf-label', 'PDF flyer'))
  thumb.classList.add('is-placeholder')
}

let pdfjs
async function renderPdf(url, thumb) {
  try {
    if (!pdfjs) {
      const [lib, worker] = await Promise.all([
        import('pdfjs-dist'),
        import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
      ])
      lib.GlobalWorkerOptions.workerSrc = worker.default
      pdfjs = lib
    }
    const doc = await pdfjs.getDocument({ url }).promise
    const page = await doc.getPage(1)
    const width = thumb.clientWidth || 400
    const scale = (width / page.getViewport({ scale: 1 }).width) * Math.min(window.devicePixelRatio || 1, 2)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvas, viewport }).promise
    thumb.replaceChildren(canvas)
  } catch (err) {
    console.warn('Could not preview PDF', url, err)
    pdfPlaceholder(thumb)
  }
}

const observer =
  'IntersectionObserver' in window
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            observer.unobserve(entry.target)
            renderPdf(entry.target.dataset.pdf, entry.target)
          }
        },
        { rootMargin: '300px' },
      )
    : null

function card(flyer) {
  const link = el('a', 'card')
  link.href = flyer.url
  link.target = '_blank'
  link.rel = 'noopener'

  const thumb = el('div', 'thumb')
  if (flyer.type === 'image') {
    const img = el('img')
    img.src = flyer.url
    img.alt = `Flyer for ${flyer.title}`
    img.loading = 'lazy'
    thumb.append(img)
  } else {
    thumb.append(el('span', 'pdf-label', 'Loading flyer…'))
    thumb.dataset.pdf = flyer.url
    if (observer) observer.observe(thumb)
    else renderPdf(flyer.url, thumb)
  }

  const body = el('div', 'card-body')
  if (flyer.date && flyer.date >= today) body.append(el('span', 'tag', 'Upcoming'))
  body.append(el('h2', null, flyer.title))
  if (flyer.date) body.append(el('p', 'date', formatDate(flyer.date)))
  if (flyer.type === 'pdf') body.append(el('p', 'hint', 'Open PDF'))

  link.append(thumb, body)
  return link
}

if (flyers.length) {
  list.replaceChildren(...flyers.map(card))
} else {
  list.replaceChildren(el('p', 'empty', 'New events will be posted here soon. Check back shortly.'))
}
