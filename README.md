# ASIS&T UAlbany website

The website for the University at Albany student chapter of the Association for Information Science and Technology,
served at https://asist-ualbany.github.io/.

It is a small static site built with [Vite](https://vite.dev/) and deployed to GitHub Pages by GitHub Actions on
every push to `main`.

## Adding events

Upload a flyer to the [`flyers/`](flyers/) folder, named like `2026-11-05 Fall Mixer.pdf`.
Full step-by-step instructions for non-technical officers are in [`flyers/README.md`](flyers/README.md).

## Editing content

| What | Where |
| --- | --- |
| About, mission, vision | `index.html` |
| Email, Instagram, MyInvolvement links | `src/site.js` (empty links are hidden) |
| Colors and layout | `src/style.css` |
| Logo and favicons | `public/` |

## One-time GitHub setup

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

After that, every push to `main` (including flyer uploads through the GitHub website) rebuilds and publishes the site.
Progress is visible in the **Actions** tab.

## Local development

```sh
npm install
npm run dev       # local server with live reload
npm run build     # production build into dist/
npm run preview   # serve the production build
```

The build prints a warning for any file in `flyers/` that will not appear (wrong format) or has no date.
