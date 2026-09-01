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
- `wiki-data.js` — Echo Wiki topic *metadata*: `wikiCategories`, `wikiTopics` (id/category/title/
  summary/keywords/sources — everything the list view and search need eagerly). Loaded before
  `app.js`. Does **not** hold topic bodies — see `wiki-topics/` below. **If wiki search stops finding
  a topic someone expects it to** (a support complaint like "I searched for X and nothing came up"),
  see "Wiki search troubleshooting" further down before assuming it's a bug.
- `wiki-topics/<id>.js` — one file per "deep" wiki topic, holding its `body` HTML and any inline-SVG
  figure builders it embeds. Loaded on demand only when that topic is opened (`loadWikiTopicBody()` in
  `app.js`), not up front — keeps the eager page-load payload flat as the wiki grows. Still listed in
  `sw.js` `PRECACHE_URLS` so it's downloaded during install/update and works offline like everything
  else; "lazy" here means "not parsed into the page until opened," not "not on the phone yet." Each
  file registers itself into `window.wikiTopicBodies[id] = { en, hu }` — see the comment above
  `loadWikiTopicBody()`. "card"-kind topics have no body and no file here.
- `prosthetic-data/aortic-valves.js` — reference data (valve model + size -> expected normal Doppler
  values) for the prosthetic aortic valve type/size picker, transcribed from Zoghbi et al. 2024 (see
  the file's own header comment for the full citation and, importantly, which valves' mechanical/
  biological classification is *inferred* rather than an explicit label in the source table —
  double-check those against the source or another reference before trusting them clinically). Lazy-
  loaded the same way as `wiki-topics/<id>.js` (`loadProstheticAorticValves()` in `app.js`) — not
  needed until prosthetic-AV mode is turned on, so it costs nothing otherwise; still listed in `sw.js`
  `PRECACHE_URLS` so it works offline.
- `app.js` — everything else: translations, calculation logic, severity grading, field templating,
  app state, the Echo Wiki *rendering/routing* logic (search, `#wiki` hash routing, lazy body loading —
  as opposed to the data itself, which lives in `wiki-data.js`/`wiki-topics/`), the prosthetic aortic
  valve type/size picker (`#valveOverlay`, reusing the wiki overlay's full-screen searchable-list
  pattern), report/clipboard building, and DOM event wiring.
- `sw.js` — service worker for offline caching (cache-first for same-origin GET requests). Its
  `PRECACHE_URLS` list must include every file above (`wiki-topics/*.js` and `prosthetic-data/*.js`
  included) — a file missing from that list works online but silently breaks for offline/installed
  users.
- `manifest.json` — PWA manifest (icons, theme colors, standalone display).
- `icons/`, `Icon.png`, `constriction-diagram.png` — static image assets.
- `jsconfig.json` — dev-only: lets `tsc` type-check the JSDoc annotations in `app.js`/`wiki-data.js`/
  `wiki-topics/*.js` (see "Running / testing changes"). Not loaded by the app; nothing here ships to
  the browser.
- `global.d.ts` — dev-only: ambient type for `window.wikiTopicBodies`, used only by the `tsc` check
  above. Not loaded by the app.

`wiki-data.js` and `app.js` are both plain (non-module) top-level scripts, not IIFEs — they share one
global scope by design (`wiki-data.js`'s `wikiTopics`/`wikiCategories` are read directly by `app.js`),
so `wiki-data.js` must stay listed first in `index.html`. Don't wrap either in an IIFE or convert to
`type="module"` without accounting for that. Each `wiki-topics/<id>.js`, by contrast, *is* wrapped in
its own IIFE (it's loaded independently, later, via a dynamically injected `<script>` tag) and reaches
app.js only through the `window.wikiTopicBodies` registry — never rely on a topic file's own local
`const`/`function` names being visible anywhere else.

## Running / testing changes

No build/lint/test commands exist. To check a change, serve the directory and open it in a browser:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000/`. A plain `file://` open also mostly works but the service worker
won't register over `file://`.

There are no automated tests. Verify manually in the browser: exercise the changed calculator fields,
check both languages (language toggle, top right), and check both themes (light/dark toggle).

Optionally, `app.js` and `wiki-data.js` carry JSDoc type annotations on the calculation functions,
checked against `jsconfig.json` by TypeScript's compiler — this is dev-only tooling, not a build step
(nothing it checks changes what ships to the browser). Run it after editing calculation logic:

```
tsc --noEmit -p jsconfig.json
```

If `tsc` isn't on `PATH`, `npx typescript --noEmit -p jsconfig.json` works without installing anything
project-local (no `package.json`/`node_modules` here by design). Add `@param`/`@returns` JSDoc to new
calculation functions the same way the existing ones are annotated.

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
   operating on the `wikiCategories`/`wikiTopics` metadata defined in `wiki-data.js`) — navigated via
   `#wiki` / `#wiki/<topicId>` URL hashes and rendered into `#wikiOverlay`. Topics can cross-link to
   `severityInfo` sections and to each other. `renderWikiTopic()` renders summary/table/sources
   immediately (eager metadata) with a loading placeholder for the body, then calls
   `loadWikiTopicBody()` to fetch `wiki-topics/<id>.js` on demand and swaps the body in once it
   resolves — re-checking `currentWikiTopic` first, since the user may have navigated away while it
   loaded. `wikiTopicMatchesQuery()` can only search a topic's body text if it's already been loaded
   this session (see the comment above it in `wiki-data.js`); give a topic thorough `keywords` to
   compensate. `auditWikiTopics()` (in `wiki-data.js`) sanity-checks topic metadata at load time (e.g.
   summary EN/HU line-count parity); `auditTopicBody()` does the same for a topic's body (EN/HU
   numeric drift), called from `loadWikiTopicBody()` once a body loads, since bodies aren't all
   available up front any more.
6. **App state** — a single `state` object (current language, BSA-entry mode, and one entry per input
   field in `fieldNames`) plus `lastResults` (a snapshot of the last computed results, reused by the
   "Copy to Report" feature so it doesn't recompute everything). There's no framework: inputs write
   into `state` on the `input` event, which triggers `computeResults()`.
7. **`computeResults()`** — the central pipeline: reads `state`, calls the calculation functions in
   dependency order (e.g. BSA before SVI/AVAi, SV before cardiac output), grades each result via
   `gradeFns`, and renders the results list into `#resultsList`. This is the function to trace when
   adding a new derived value or changing how an existing one depends on inputs. The prosthetic aortic
   valve toggle (`state.prostheticAV`, wired via `#prostheticAvToggle`) is the pattern to copy for any
   future "this changes which fields/labels are relevant" switch: it doesn't change the AVA/AVAi
   *values* (`calculateAVA`/`calculateAVAI` are unaware of it) — `computeResults()` just picks a
   different result-row key (`"eoa"`/`"eoai"` vs `"ava"`/`"avai"`) so the label changes, and there's
   deliberately no `gradeFns.eoa`/`.eoai` entry (see the comment above `gradeFns.avAtEt`), so those
   rows render with no severity badge until real prosthetic-valve cutoffs replace the native ones. The
   on/off switch itself (`.switch`/`.switch-row` in `styles.css`) is a real checkbox styled as a track +
   thumb — reuse that markup pattern for any future flip-switch control (e.g. a mechanical/biological
   valve-type switch) rather than inventing a new one.
8. **Report text / clipboard** (`buildReportText`, `rawInput`, `pisaLine`, `legacyCopy`,
   `flashCopyButton`) — formats `lastResults` and raw field values into a plain-text report for the
   "Copy to Report" button, with a `document.execCommand`-based fallback for browsers/contexts without
   `navigator.clipboard`.
9. Card/subgroup expand-collapse, info-overlay, theme toggle, and other DOM event wiring live at the
   bottom of the file.

## Wiki search troubleshooting

Since the lazy-body-loading change (search for "growth-readiness" in git log), wiki search can only
match a topic's body text once that topic has actually been opened this session — it can no longer
scan every topic's full body up front, only title/keywords/summary (see the comment above
`wikiTopicMatchesQuery` in `app.js` and the one above `wikiTopics` in `wiki-data.js`). **If the user
reports "I searched for a term and the topic I expected didn't show up," this trade-off is the first
thing to check** — before assuming something is actually broken:

1. Check whether the missing term appears only in that topic's `body` (in `wiki-topics/<id>.js`) and
   not in its `title`, `keywords`, or `summary` (in `wiki-data.js`). If so, this is that trade-off, not
   a bug.
2. **First fix to try**: add the missing term (and likely synonyms/related terms) to that topic's
   `keywords` in `wiki-data.js`. Cheap, low-risk, and fixes that specific search gap immediately.
3. **If this keeps happening repeatedly** across many topics (keywords aren't keeping up, or curating
   them per-topic is becoming a burden) — that's the sign the lazy-loading trade-off isn't paying for
   itself for how this app is actually used, and it's worth reverting `wiki-data.js`/`wiki-topics/`
   back to the original single-file design (all topics' full `body` eagerly in one `wikiTopics` array,
   like before this change), which searches full body text for every topic unconditionally. That
   reintroduces the "editing one topic re-downloads/re-parses everything" cost this change was meant
   to avoid — worth it only if it actually happens and search correctness matters more than that cost.

## Conventions to follow when editing

- New input fields: add the field to `fieldDefs` and `fieldNames` in `app.js`, list it in the right
  container's `data-fields="..."` attribute in `index.html`, add `data-t` label keys to **both**
  `translations.en` and `translations.hu`, then wire it into `computeResults()`.
- New severity bands or reference tables go in `gradeFns`/`severityInfo`; note the source (e.g. which
  guideline table) in a comment the way existing entries do, especially where cutoffs are ambiguous.
- Keep language parity: every `data-t` key must exist in both `en` and `hu`, and every wiki topic's
  bilingual fields should be filled for both languages.
- New wiki topics: metadata (id/category/title/summary/keywords/sources) goes in `wiki-data.js`; a
  "deep" topic's `body` (and any figure builders it embeds) goes in a new `wiki-topics/<id>.js` — copy
  the registration pattern (`window.wikiTopicBodies["<id>"] = { en, hu }` inside an IIFE) from an
  existing file. Add the new file to `sw.js`'s `PRECACHE_URLS`, or it won't work offline until opened
  once online. A "card"-kind topic needs no `wiki-topics/` file.
- Bump the `sw.js` `CACHE` version on any shipped change to `index.html`, `styles.css`, `app.js`,
  `wiki-data.js`, a `wiki-topics/*.js` file, `manifest.json`, or `sw.js` itself — and if you add a new
  file like these, add it to `sw.js`'s `PRECACHE_URLS` too.

## Prosthetic aortic valve — deferred work

The "Prosthetic valve" toggle (AV subgroup) currently ships with one piece intentionally incomplete,
by user direction — don't treat it as an oversight:

- **EOA/EOAi have no severity badge.** `gradeFns` has no `eoa`/`eoai` entry on purpose (native-valve
  AVA/AVAi cutoffs don't apply to a prosthetic valve). Add real prosthetic EOA/EOAi cutoffs to
  `gradeFns` (and matching rows to a prosthetic-valve reference table, likely a new `severityInfo`
  entry) once available.

DVI's prosthetic-valve cutoffs (`gradeFns.dviProsthetic`, a two-band normal/reduced scheme at 0.3,
selected via the rows array's `gradeKey` 4th element in `computeResults()` when `state.prostheticAV`
is on) are already implemented — that's the pattern to copy for the EOA/EOAi cutoffs above once
they're available, if they turn out to need a different grading band count than the native ava/avai
two-key swap did.

The valve type/size picker and normal-value display (plan items 4-5) are also implemented: a
mechanical/biological switch (`#valveCategoryToggle`) filters a full-screen searchable list
(`#valveOverlay`, `openValvePicker()`/`renderValvePickerList()` in `app.js`) built from
`prosthetic-data/aortic-valves.js`; picking a valve populates a size `<select>`
(`updateValveSizeOptions()`), and picking a size shows that valve+size's normal Peak/Mean gradient,
EOA, and DVI (where the source table has them) via `renderValveReference()`. This is a **reference
lookup only** — it never feeds into the AVA/EOA/DVI/AT-ET calculations above; changing category or
valve clears the current selection rather than trying to reconcile it.

**Data-quality note**: `prosthetic-data/aortic-valves.js`'s header comment lists every valve whose
mechanical/biological `category` was *inferred* from general knowledge rather than read directly off
an explicit label in the source table (the table doesn't repeat a mechanism label for every row in a
manufacturer group, and a few manufacturers — e.g. ATS — make both mechanical and biological models
under the same name). If a user reports a valve showing under the wrong mechanical/biological switch
position, check that list first.

Also still planned, not yet started: a valve type + size selector (populated from a guideline
reference table) that, once both are picked, shows that specific valve's normal reference values.
