import './style.css'
import { site } from './site.js'

// Simple line icons (24x24, stroke-based).
const icons = {
  email: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  instagram:
    '<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  myinvolvement:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
}

const links = [
  site.email && { key: 'email', label: `Email ${site.email}`, href: `mailto:${site.email}` },
  site.instagram && { key: 'instagram', label: 'Instagram', href: site.instagram },
  site.facebook && { key: 'facebook', label: 'Facebook group', href: site.facebook },
  site.myinvolvement && { key: 'myinvolvement', label: 'MyInvolvement', href: site.myinvolvement },
].filter(Boolean)

function linkList() {
  const ul = document.createElement('ul')
  ul.className = 'links'
  for (const { key, label, href } of links) {
    const a = document.createElement('a')
    a.href = href
    a.title = label
    a.setAttribute('aria-label', label)
    a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[key]}</svg>`
    if (!href.startsWith('mailto:')) {
      a.target = '_blank'
      a.rel = 'noopener'
    }
    const li = document.createElement('li')
    li.append(a)
    ul.append(li)
  }
  return ul
}

document.querySelectorAll('[data-links]').forEach((el) => {
  if (links.length) el.append(linkList())
  else el.closest('[data-links-section]')?.remove()
})

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear()
})
