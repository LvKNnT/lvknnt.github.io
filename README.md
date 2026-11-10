# Lâm Vĩnh Khang · Personal site

Static research portfolio and writing archive at [lvknnt.github.io](https://lvknnt.github.io/).

## Stack

- Astro 7 with static output and content collections
- Markdown posts with GitHub-flavored Markdown, syntax highlighting, and build-time MathJax SVG
- GitHub Pages deployment through GitHub Actions

## Local development

Use Node.js 22.12 or newer and npm:

```bash
npm ci
npm run dev
```

Run the production checks with `npm run check` and `npm run build`. Preview the output with `npm run preview`.

## Editing content

- Profile and featured project copy: `src/pages/index.astro`
- Full project list: `src/data/projects.ts`
- Posts: `src/content/posts/*.md`
- Images and downloadable résumé: `public/`

Every post requires `title` and `date` front matter. `description`, `series`, and `seriesOrder` are optional. Set `hidden: true` to keep a post out of the public index and static routes. Lowercase filenames determine the public URL at `/posts/<filename>/`. The older uppercase `/posts/PRNGs-survey/` URL redirects to its lowercase route.

```md
---
title: "Example note"
date: 2026-11-10
description: "A brief summary."
series: "Lattice Notes"
seriesOrder: 1
---

Markdown content goes here. Inline math uses `$...$` and display math uses `$$...$$`.
```

Post dates are explicit so builds are reproducible. The four previously undated posts use their latest Git commit date from the prior site.

## Deployment

GitHub Pages is configured to use **GitHub Actions** as its source. Every push to `main` builds and deploys the static site. The workflow is in `.github/workflows/deploy.yml`; `astro.config.mjs` sets the root URL to `https://lvknnt.github.io` with no base path.

The site has no server-side runtime. To add a feature that requires a backend, host that service separately and call it from the browser.

## License

GNU Affero General Public License v3.0; see [LICENSE](LICENSE).
