import './style.css'
import { site } from './site.js'

const links = [
  site.email && { label: 'Email', href: `mailto:${site.email}` },
  site.instagram && { label: 'Instagram', href: site.instagram },
  site.myinvolvement && { label: 'MyInvolvement', href: site.myinvolvement },
].filter(Boolean)

function linkList() {
  const ul = document.createElement('ul')
  ul.className = 'links'
  for (const { label, href } of links) {
    const a = document.createElement('a')
    a.href = href
    a.textContent = label
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
