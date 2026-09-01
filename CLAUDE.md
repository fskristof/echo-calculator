# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Echo Calculator: a single-page, installable PWA for echocardiography calculations (valve severity,
PISA/ERO, AVA, cardiac output, etc.), used as a bedside reference tool. It is a reproduction built
from the reference app's own source (`calculatorUtils.js`) — not for diagnostic use, per the footer
in `index.html`. UI text is bilingual (English/Hungarian).

There is no build step, package manager, or test suite. The app is plain HTML/CSS/JS split across a
few files, loaded via plain `<link>`/`<script src>` tags — no bundler, no modules:

- `index.html` — markup only, plus a per-field-group `data-fields="..."` attribute (see "Field
  templates" below) instead of hand-written input rows.
- `styles.css` — all styling (was an inline `<style>` block).
- `wiki-data.js` — Echo Wiki content: `wikiCategories`, `wikiTopics`, and the inline-SVG figure
  builders topics embed (`cpAlgorithmFigure`, `ventInterdependenceFigure`, `pisaFigure`). Pure data
  plus render-to-HTML-string helpers, no DOM/state dependency. Loaded before `app.js`.
- `app.js` — everything else: translations, calculation logic, severity grading, field templating,
  app state, the Echo Wiki *rendering/routing* logic (search, `#wiki` hash routing — as opposed to
  its data, which lives in `wiki-data.js`), report/clipboard building, and DOM event wiring.
- `sw.js` — service worker for offline caching (cache-first for same-origin GET requests). Its
  `PRECACHE_URLS` list must include every file above — a file missing from that list works online but
  silently breaks for offline/installed users.
- `manifest.json` — PWA manifest (icons, theme colors, standalone display).
- `icons/`, `Icon.png`, `constriction-diagram.png` — static image assets.

`wiki-data.js` and `app.js` are both plain (non-module) top-level scripts, not IIFEs — they share one
global scope by design (`wiki-data.js`'s `wikiTopics`/`wikiCategories` are read directly by `app.js`),
so `wiki-data.js` must stay listed first in `index.html`. Don't wrap either in an IIFE or convert to
`type="module"` without accounting for that.

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

## Architecture inside `app.js`

Organized top-to-bottom roughly as:

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
4. **Field templates** — `fieldDefs` (a `{ fieldName: { label, unit, optional? } }` table) and
   `renderField()`/`renderFieldSlots()` generate every calculator input row (label + input + unit)
   from one shape instead of hand-written markup per field. `index.html` only carries empty
   containers tagged `data-fields="fieldA,fieldB,..."`; `renderFieldSlots()` fills each one in at load,
   before the `input[data-field]` listeners are wired up. To add a field: add it to `fieldDefs` *and*
   to `fieldNames`, then list it in the right container's `data-fields` attribute in `index.html`.
5. **Echo Wiki rendering/routing** (`render*`/`open*`/`goWiki`/hash-routing functions in this file,
   operating on the `wikiCategories`/`wikiTopics` data defined in `wiki-data.js`) — navigated via
   `#wiki` / `#wiki/<topicId>` URL hashes and rendered into `#wikiOverlay`. Topics can cross-link to
   `severityInfo` sections and to each other. `auditWikiTopics()` (in `wiki-data.js`) sanity-checks the
   topic data at load time (e.g. catches EN/HU numeric drift) — check it after editing `wikiTopics`.
6. **App state** — a single `state` object (current language, BSA-entry mode, and one entry per input
   field in `fieldNames`) plus `lastResults` (a snapshot of the last computed results, reused by the
   "Copy to Report" feature so it doesn't recompute everything). There's no framework: inputs write
   into `state` on the `input` event, which triggers `computeResults()`.
7. **`computeResults()`** — the central pipeline: reads `state`, calls the calculation functions in
   dependency order (e.g. BSA before SVI/AVAi, SV before cardiac output), grades each result via
   `gradeFns`, and renders the results list into `#resultsList`. This is the function to trace when
   adding a new derived value or changing how an existing one depends on inputs.
8. **Report text / clipboard** (`buildReportText`, `rawInput`, `pisaLine`, `legacyCopy`,
   `flashCopyButton`) — formats `lastResults` and raw field values into a plain-text report for the
   "Copy to Report" button, with a `document.execCommand`-based fallback for browsers/contexts without
   `navigator.clipboard`.
9. Card/subgroup expand-collapse, info-overlay, theme toggle, and other DOM event wiring live at the
   bottom of the file.

## Conventions to follow when editing

- New input fields: add the field to `fieldDefs` and `fieldNames` in `app.js`, list it in the right
  container's `data-fields="..."` attribute in `index.html`, add `data-t` label keys to **both**
  `translations.en` and `translations.hu`, then wire it into `computeResults()`.
- New severity bands or reference tables go in `gradeFns`/`severityInfo`; note the source (e.g. which
  guideline table) in a comment the way existing entries do, especially where cutoffs are ambiguous.
- Keep language parity: every `data-t` key must exist in both `en` and `hu`, and every wiki topic's
  bilingual fields should be filled for both languages.
- New wiki topics go in `wiki-data.js`, not `app.js`.
- Bump the `sw.js` `CACHE` version on any shipped change to `index.html`, `styles.css`, `app.js`,
  `wiki-data.js`, `manifest.json`, or `sw.js` itself — and if you add a new file like these, add it to
  `sw.js`'s `PRECACHE_URLS` too.
