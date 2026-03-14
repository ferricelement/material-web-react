# Session Handoff — material-web-react

## Project Overview
React component library wrapping Google's Material Design 3 (`@material/web`). Components that don't exist in `@material/web` are built as custom Lit elements (`LitElement` + shadow DOM), then wrapped for React using `@lit/react`'s `createComponent()`.

## Architecture

- **Wrappers for `@material/web`**: `src/components/<name>/<name>.ts` uses `createComponent()` to wrap the official MD web component
- **Custom Lit elements**: `src/components/<name>/md-<name>.ts` extends `LitElement`, registered via `customElements.define()`
- **React wrapper**: `src/components/<name>/<name>.ts` wraps the custom element with `createComponent()`
- **Barrel export**: `src/components/<name>/index.ts` re-exports both
- **Build config**: Each component has an entry in `vite.config.ts` and export map in `package.json`
- **Global exports**: `src/index.ts` barrel-exports all components
- **Dev app**: `dev/App.tsx` — single-page demo of all components, run with `npm run dev` (Vite, port 5173)

## Key Technical Gotchas

1. **Lit class field shadowing**: Must use `declare` + constructor defaults, NOT class field initializers (`foo = 'bar'` in class body). Class fields shadow Lit's accessors.
2. **`createComponent()` sets properties, not attributes**: So Lit's JSON attribute parsing doesn't apply. Pass actual JS arrays/objects from React, not JSON strings.
3. **SVG namespace in Lit**: `<path>` elements inside interpolated `html` template expressions get XHTML namespace. Use Lit's `svg` template tag for SVG child elements.
4. **HMR + custom elements**: Vite HMR can't re-register custom elements — causes `NotSupportedError`. Must restart dev server after modifying custom element files.
5. **Shadow DOM styling**: `::slotted()` only selects direct slotted children, not deeper descendants.

## Components (46 total)

### Official MD Web wrappers
badge, button, card, checkbox, chips, dialog, divider, elevation, fab, focus-ring, icon, icon-button, list, menu, progress, radio, ripple, segmented-button, select, slider, snackbar, switch, tabs, text-field

### Custom Lit elements
accordion, autocomplete, avatar, bottom-app-bar, bottom-sheet, carousel, data-table, date-picker, navigation-bar, navigation-drawer, navigation-rail, popover, rating, search-bar, side-sheet, skeleton, stepper, time-picker, timeline, tooltip, top-app-bar

## Recent Changes (this session)

### Data Table (`md-data-table`)
- Added `maxHeight` prop (attribute: `max-height`) — enables vertical scrolling with sticky `<th>` headers
- Added ellipsis truncation on `<td>` cells (`text-overflow: ellipsis`, `max-width: 200px`) with `title` attribute for full text on hover
- Demo: 11-row table with `maxHeight="200px"`, includes long content row to demo truncation

### Popover (`md-popover`)
- Fixed broken positioning — was using `position: absolute` with `display: contents` host (no positioning context)
- Now uses `position: fixed` with JS-calculated coordinates from anchor element's `getBoundingClientRect()`
- `_updatePosition()` runs when `open` changes, supports top/bottom/left/right positions

### Search Bar (`md-search-bar`)
- Added built-in autocomplete via `options` string array prop
- When `options` provided: renders filtered results internally with hover highlights, keyboard nav (ArrowUp/Down/Enter/Escape)
- When `options` empty: falls back to slotted `suggestions` content (existing behavior)
- Added `search-select` event (fired on option selection), registered in React wrapper
- Demo: search bar with slotted suggestions (using `ListItem type="button"` for hover/ripple) + autocomplete search bar with `options`

## Dev Server
Configured in `.claude/launch.json` as `"dev"`. Start with `preview_start` tool (name: "dev"). Port 5173.

## Last Commit
`8505453` — "Enhance Data Table, Popover, and Search Bar components"
