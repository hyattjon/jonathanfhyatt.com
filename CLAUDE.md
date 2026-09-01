# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the dist/ build locally
npm run lint       # lint with oxlint
```

If you hit npm cache permission errors, append `--cache /tmp/npm-cache` to any npm command.

## Architecture

Single-page React app (Vite + React 19) designed as a scrollable one-pager for a PhD application website.

**Entry point:** `src/main.jsx` → `src/App.jsx`

`App.jsx` composes three full-page sections in order — `Home`, `CV`, `Projects` — plus a fixed `<Nav>` and `<Footer>`. Each section is a named anchor (`id="home"`, `id="cv"`, `id="projects"`) so the nav links smooth-scroll to them.

**Section files:** `src/sections/Home.jsx`, `src/sections/CV.jsx`, `src/sections/Projects.jsx`

Content (bio text, CV entries, project cards) lives as plain JS arrays/objects at the top of each section file — edit those to update the site content.

## Styling system

All design tokens live in `src/variables.css` as CSS custom properties and are imported by `src/index.css`. No component should hard-code a color, size, or font value — every value must reference a `--variable`. Component styles live in `src/App.css` and use BEM-style class names (`.section`, `.cv__entry`, `.project-card`, etc.).

To change the look of the site, edit `src/variables.css` only.

## Content to update

- **Home section** — bio, field tags, external links (GitHub URL is a placeholder)
- **CV section** — education, research experience, awards arrays; `href="/cv.pdf"` expects a PDF at `public/cv.pdf`
- **Projects section** — `projects` array; GitHub links are placeholders
