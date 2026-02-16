# Doors

Main site for the Doors project. A minimalistic landing page and a `/doors` hub page — a tiled wall of pixel-art doors, each leading to an independent web-game scene.

See [RFC-architecture-hub-site.md](./RFC-architecture-hub-site.md) for the full architecture spec.

## Project Structure

```
src/
  layouts/
    BaseLayout.astro          # Shared HTML shell, global styles, font
  pages/
    index.astro               # Landing page (/)
    doors/
      index.astro             # Doors hub page (/doors)
  components/
    Door.astro                # Single door tile (active/inactive states)
  content/
    doors.json                # Door registry — number, status, title
  styles/
    global.css                # CSS reset, custom properties, dark theme
    doors.css                 # Grid layout, void overlay
  scripts/
    doors.ts                  # Click handler: open animation + dark void transition
public/
  favicon.svg                 # Pixel-art door favicon
  assets/doors/               # Door sprites (when real pixel art is added)
```

## Commands

| Command              | Action                                             |
| :------------------- | :------------------------------------------------- |
| `npm install`        | Install dependencies                               |
| `npm run dev`        | Start dev server (`localhost:4321`)                 |
| `npm run dev:clean`  | Clear caches, then start dev server                |
| `npm run build`      | Production build to `./dist/`                      |
| `npm run build:clean`| Clear caches, then production build                |
| `npm run preview`    | Preview production build locally                   |

## Stale CSS / Cache Issues

Vite caches pre-bundled dependencies in `node_modules/.vite`. Astro generates types into `.astro/`. During rapid CSS iteration, HMR can serve stale styles even though source files are updated. Symptoms: changes in CSS don't appear in the browser, `Cmd+Shift+R` doesn't help.

**Fix:** run `npm run dev:clean` (or manually `rm -rf node_modules/.vite .astro` and restart). This nukes both caches and gives you a fresh dev server.

## Current State

- `/` — dark, minimal landing page with "Doors." title and "Enter" link
- `/doors` — 30-door grid (1 active red door, 29 inactive grey doors)
- Door 1 click: swing-open animation, dark void transition, navigates to `/doors/1/`
- No game scenes deployed yet — `/doors/1/` will 404 until a game build is placed there
