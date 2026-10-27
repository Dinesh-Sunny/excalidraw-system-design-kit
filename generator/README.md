# Generator

The library is generated from code, so every item has the same style, sizes and naming, and a change is one edit plus a rebuild.

## How it works

1. Item data lives in `src/`:
   - `core.js` - colour themes, drawing primitives, icons (drawn from shapes, no logos), the component card.
   - `components.js` - building-block sections: `[title, icon, search tags]`.
   - `diagram.js` - grid layout for patterns and full designs (nodes on a column/row grid, bound arrows, key-decision notes).
   - `templates.js`, `agentic.js` - patterns and full designs.
   - `ui.js` - UI parts, device frames, screens.
   - `main.js` - order, sections, naming (`sd:<section>/ ...`), build.
2. `run.cjs` opens a headless Chromium page that loads Excalidraw's own `convertToExcalidrawElements`, so text is measured with the real Excalifont and arrows are bound to boxes. It writes `out/System Design Kit.excalidrawlib` and one SVG preview per item.
3. `sheet.cjs` renders a contact sheet per section (the images in `previews/`). `one.cjs <item-id>` renders one item large. `hero.cjs` builds the hero image.

## Build

```bash
npm install
npx playwright install chromium   # if you don't have Chromium for Playwright
npm run build
npm run sheets
```

Fonts for measuring are loaded from `node_modules/@excalidraw/excalidraw/dist/prod/fonts` (see `www/index.html`).

## Adding an item

- A card: add `["Title", "icon", "search tags"]` to a section in `components.js`. New icon? Add it to `ICONS` in `core.js` (40 x 40 box).
- A diagram: add `{ name, spec: { title?, nodes, edges, notes? } }` to `templates.js` or `agentic.js`. Nodes: `[id, title, icon, theme, col, row, width?]`. Edges: `[from, to, label?, { dash, dot, both, via }]`.
- Keep the naming rule (docs/naming.md) and run the sheets to check the result by eye.

## Sponsors

Everything about sponsoring comes from `sponsor.json`:

- `card` (per tier): Stripe Payment Link. When set, card is the main button everywhere and GitHub is the alternative.
- `github` / `kofi`: set once GitHub Sponsors or Ko-fi is live. Until then the personal tiers show "opening soon" and companies get an email button.
- `sponsors[]`: `{ "name", "url", "logo", "tier" }` with tier `featured`, `gold`, `silver`, `bronze`, `supporter`, `backer` or `coffee`.

Then run `python3 build-showcase.py` (site + sponsor page) and `python3 readme-sponsors.py ..` (README block, BACKERS.md, .github/FUNDING.yml).
