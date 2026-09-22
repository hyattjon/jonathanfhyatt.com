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

React app (Vite + React 19): a scrollable one-pager for a PhD application website, plus standalone pages (see "Extra pages" below).

**Entry point:** `src/main.jsx` → `src/App.jsx`

`App.jsx` composes three full-page sections in order — `Home`, `CV`, `Projects` — plus a fixed `<Nav>` and `<Footer>`. Each section is a named anchor (`id="home"`, `id="cv"`, `id="projects"`) so the nav links smooth-scroll to them.

**Section files:** `src/sections/Home.jsx`, `src/sections/CV.jsx`, `src/sections/Projects.jsx`

Content (bio text, CV entries, project cards) lives as plain JS arrays/objects at the top of each section file — edit those to update the site content.

**Shared chrome:** `src/components/Nav.jsx` and `src/components/Footer.jsx` are used by every page. `<Nav onHomePage={false} />` (used by non-home pages) turns the section links into `/#section` links back to the one-pager; extra pages are listed in `PAGE_LINKS` inside `Nav.jsx`.

### Extra pages (multi-page build)

The site is a Vite multi-page app (`appType: 'mpa'`, inputs in `vite.config.js`). Each extra page has its own HTML entry at the repo root, so it deploys to GitHub Pages as `/<name>/` and its code and data only load there.

**`/circular-flow/`** — interactive county circular-flow map. Entry: `circular-flow/index.html` → `src/circular-flow/main.jsx` → `CircularFlowPage.jsx`.
- `model.js` — the flow itself (plain JS, no browser APIs): decodes the county-to-county matrix, then each round sends a small share of spending abroad (a sink), applies income shares, income tax, and re-spending. Everything is per $1; the UI scales by the chosen amount.
- `data.js` — loads `public/circular-flow/data/` (`meta.json`, `counties.json`, `totals.json`, `flow.bin.gz`, about 16 MB in total). `flow.bin.gz` is a raw gzip file; the loader inflates it with `DecompressionStream` unless the server already did.
- `Overview.jsx` — the static second map: every county is given the same amount, and it adds up what each county receives over all rounds (`totals.json`, with a store-county vs household-income toggle). `CountyMap` works without `selected`/`onSelect` for static maps.
- `Multiplier.jsx` — static map of each county's income multiplier (total income generated per $1 given to consumers there, `totals.multiplier`); uses a linear color scale because the range is narrow.
- `CountyMap.jsx` (SVG, `d3-geo` albersUsa; county colors are written straight onto the path elements), `Legend.jsx`, `colorScale.js` (log and linear scales over the `--heat-*` spectrum), `format.js`.
- Styles: `src/circular-flow/CircularFlow.css` (`.flow-*`), using tokens only. Data colors are the four-stop `--heat-1`…`--heat-4` spectrum (dark blue, light blue, yellow, red, blended in HCL) in `variables.css`, plus `--color-data-none` (gray) for counties with no money landing; the legend and the map both come from them.
- **The data files are generated, not hand-edited.** They come from the model in the `usa-dea-jhyatt` repo: `python models/simple_circular_flow/export_web_data.py` writes them here. Re-run it whenever the shares or tax rates change, then commit the regenerated files.

## Styling system

All design tokens live in `src/variables.css` as CSS custom properties and are imported by `src/index.css`. No component should hard-code a color, size, or font value — every value must reference a `--variable`. Component styles live in `src/App.css` and use BEM-style class names (`.section`, `.cv__entry`, `.project-card`, etc.).

To change the look of the site, edit `src/variables.css` only.

## Content to update

- **Home section** — bio, field tags, external links (GitHub URL is a placeholder)
- **CV section** — education, research experience, awards arrays; `href="/cv.pdf"` expects a PDF at `public/cv.pdf`
- **Projects section** — `projects` array; GitHub links are placeholders
