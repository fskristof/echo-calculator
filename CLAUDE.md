# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Echo Calculator: a single-page, installable PWA for echocardiography calculations (valve severity,
PISA/ERO, AVA, cardiac output, etc.), used as a bedside reference tool. It is a reproduction built
from the reference app's own source (`calculatorUtils.js`) — not for diagnostic use, per the footer
in `index.html`. UI text is bilingual (English/Hungarian).

There is no build step, package manager, or test suite. The entire app is:

- `index.html` — everything: markup, `<style>` block, and the app's `<script>` block (translations,
  calculation logic, severity grading, the Echo Wiki content and renderer, DOM wiring).
- `sw.js` — service worker for offline caching (cache-first for same-origin GET requests).
- `manifest.json` — PWA manifest (icons, theme colors, standalone display).
- `icons/`, `Icon.png`, `constriction-diagram.png` — static image assets.

## Running / testing changes

No build/lint/test commands exist. To check a change, serve the directory and open it in a browser:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000/`. A plain `file://` open also mostly works but the service worker
won't register over `file://`.

There are no automated tests. Verify manually in the browser: exercise the changed calculator fields,
check both languages (language toggle, top right), and check both themes (light/dark toggle).

## The service worker cache-bust convention

`sw.js` is cache-first: visitors keep the old cached app until the cache name changes. **Any change to
`index.html`, `manifest.json`, the icons, or `sw.js` itself requires bumping the `CACHE` version
string at the top of `sw.js`** (e.g. `echo-calc-v4.6` → `echo-calc-v4.7`), or the change won't reach
already-installed users. Commit messages in this repo tag releases with the same version, e.g.
`... (v4.6)`.

## Architecture inside `index.html`

The `<script>` is one IIFE, organized top-to-bottom roughly as:

1. **`translations`** — `{ en: {...}, hu: {...} }` string tables keyed by the same `data-t` attribute
   used in the markup. `applyTranslations()` walks all `[data-t]` elements and sets `textContent`.
2. **Calculation functions** (`calculateBSA`, `calculateEro`, `calculateSV`, `calculateAVA`, etc.) —
   pure functions taking raw string field values, parsing them with `parseNumber`, and returning a
   number or `null` if inputs are incomplete/invalid. These mirror the reference app's
   `calculatorUtils.js`; `parseNumber` intentionally diverges (see the comment above it) by accepting
   both `.` and `,` as the decimal separator regardless of active language.
3. **Severity grading** — `gradeFns` maps a result key (e.g. `mrEro`, `ava`, `dviVti`) to a function
   from numeric value to a grade key (`mild`/`moderate`/`severe`/...), transcribed from a checklist
   spreadsheet (see the comment above `gradeFns` for how boundary ties are resolved). `gradeLabels`
   holds the display strings per language. `severityInfo` holds the full reference tables shown in the
   info-icon overlay for each valve lesion.
4. **Echo Wiki** (`wikiCategories`, `wikiTopics`, and the `render*`/`open*`/`goWiki`/hash-routing
   functions) — a separate in-app reference encyclopedia, navigated via `#wiki` / `#wiki/<topicId>`
   URL hashes and rendered into `#wikiOverlay`. Topics can embed figures built by dedicated functions
   (e.g. `cpAlgorithmFigure`, `ventInterdependenceFigure`, `pisaFigure`) and can cross-link to
   `severityInfo` sections and to each other. `auditWikiTopics()` sanity-checks the topic data at
   load time (e.g. catches malformed entries) — check it after editing `wikiTopics`.
5. **App state** — a single `state` object (current language, BSA-entry mode, and one entry per input
   field in `fieldNames`) plus `lastResults` (a snapshot of the last computed results, reused by the
   "Copy to Report" feature so it doesn't recompute everything). There's no framework: inputs write
   into `state` on the `input` event, which triggers `computeResults()`.
6. **`computeResults()`** — the central pipeline: reads `state`, calls the calculation functions in
   dependency order (e.g. BSA before SVI/AVAi, SV before cardiac output), grades each result via
   `gradeFns`, and renders the results list into `#resultsList`. This is the function to trace when
   adding a new derived value or changing how an existing one depends on inputs.
7. **Report text / clipboard** (`buildReportText`, `rawInput`, `pisaLine`, `legacyCopy`,
   `flashCopyButton`) — formats `lastResults` and raw field values into a plain-text report for the
   "Copy to Report" button, with a `document.execCommand`-based fallback for browsers/contexts without
   `navigator.clipboard`.
8. Card/subgroup expand-collapse, info-overlay, theme toggle, and other DOM event wiring live at the
   bottom of the script.

## Conventions to follow when editing

- New input fields: add the `<input data-field="...">` markup, add the field name to `fieldNames`,
  add `data-t` label keys to **both** `translations.en` and `translations.hu`, then wire it into
  `computeResults()`.
- New severity bands or reference tables go in `gradeFns`/`severityInfo`; note the source (e.g. which
  guideline table) in a comment the way existing entries do, especially where cutoffs are ambiguous.
- Keep language parity: every `data-t` key must exist in both `en` and `hu`, and every wiki topic's
  bilingual fields should be filled for both languages.
- Bump the `sw.js` `CACHE` version on any shipped change.
