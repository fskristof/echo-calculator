// Echo Wiki content: topic data and the inline-SVG figure builders topics
// embed. Split out of index.html per the deferred-work note that used to
// live here — this file only holds data + pure render-to-HTML-string
// helpers; the interactive list/search/routing logic (renderWikiList,
// openWikiTopic, goWiki, etc.) stays in app.js since it depends on that
// file's state/translations/DOM helpers. Loaded before app.js (see
// index.html) so wikiTopics/wikiCategories exist by the time app.js's
// own top-level code runs. Must be listed in sw.js PRECACHE_URLS with the
// same version-bump discipline as index.html, or offline users get an
// app with an empty wiki.

// ---- Echo Wiki ----
// Add new topics here as they're written — each needs a stable id, a
// category (must match a wikiCategories id below), and a title. Two
// shapes, controlled by `kind` (optional, defaults to "deep"):
//   kind: "deep" — full entry: optional summary, optional table, body,
//         sources. body is raw HTML (wrapped in .wiki-body), so <p>, <h3>,
//         <ul>/<li>, <ol>, .wiki-figure, .wiki-callout, and
//         .info-table-wrap/.info-table (via buildSeverityTable()) all
//         work. No <h2>/<h4>.
//   kind: "card" — quick card: summary (+ optional table), no body. A
//         card omits `body` entirely — every topic.body access must be
//         guarded, and so must the drift/summary-parity audit below.
// `summary` is the "at the machine" block rendered above the body (deep)
// or as the main content (card): an array of short plain strings, same
// language order and *line count* on both sides — not an HTML string, so
// it can't quietly grow into a paragraph and so EN/HU parity is a simple
// length check (see auditWikiTopics). Inline <strong> is fine; no block
// elements.
// `keywords` (optional) extends what the list-view search matches beyond
// the title.
// Topics render in category order (see wikiCategories), then array order
// within a category; card rows get a small "Card" chip so it's clear
// before opening whether it's five lines or a full entry.
//
// Example entries:
// { id: "pisa", category: "methods", kind: "deep", reviewed: "2026-08",
//   title:    { en: "The PISA method", hu: "A PISA módszer" },
//   summary:  { en: ["Set aliasing 15–40 cm/s...", "..."], hu: ["...", "..."] },
//   keywords: { en: ["pisa", "eroa"], hu: ["pisa", "eroa"] },
//   body: { en: "<p>...</p>", hu: "<p>...</p>" },
//   sources: [
//     { url: "https://...", label: { en: "...", hu: "..." } },
//     { label: { en: "Textbook ref, no URL", hu: "Könyv hivatkozás, URL nélkül" } },
//   ] }
// { id: "continuity-equation", category: "methods", kind: "card",
//   title: { en: "The continuity equation", hu: "A kontinuitási egyenlet" },
//   summary: { en: ["..."], hu: ["..."] } }

// Deferred work, recorded so it isn't rediscovered later — check this list
// when adding a new topic, since several of these trigger on topic count.
//   - Split wikiTopics out of index.html into wiki.js. Trigger: index.html
//     past ~200 KB, or the topics array getting hard to navigate. One
//     topic costs ~100 lines / ~14 KB. Must be added to sw.js
//     PRECACHE_URLS and share the same version-bump discipline, or
//     offline users get an app with an empty wiki.
//   - Cross-link severityInfo (MR/AR/TR/AS) and wikiTopics: a
//     `wikiTopic: "<id>"` field on a severity entry, rendering a "read
//     more" link at the bottom of the info overlay. Natural once a valve
//     topic exists.
//   - constriction-diagram.png's labels are brittle: absolutely positioned
//     by hardcoded percentage over a raster image, with a fixed dark
//     label color because the image background doesn't invert in dark
//     mode. Recropping/replacing the image silently misaligns every
//     label. If a second photo figure is ever needed, prefer a themed
//     inline SVG like cpAlgorithmFigure instead — none of these problems.

// Wiki categories, in list display order. A topic whose `category` is
// missing or unknown falls into the "other" bucket, rendered last.
const wikiCategories = [
  { id: "methods",      label: { en: "Methods & measurement", hu: "Módszerek és mérés" } },
  { id: "pericardium",  label: { en: "Pericardium",   hu: "Pericardium" } },
  { id: "valves",       label: { en: "Valves",        hu: "Billentyűk" } },
  { id: "myocardium",   label: { en: "Myocardium",    hu: "Myocardium" } },
  { id: "right-heart",  label: { en: "Right heart",   hu: "Jobb szív" } },
  { id: "hemodynamics", label: { en: "Haemodynamics", hu: "Hemodinamika" } },
  { id: "aorta",        label: { en: "Aorta",         hu: "Aorta" } },
  { id: "other",        label: { en: "Other",         hu: "Egyéb" } },
];

// SVG id convention: every id inside a figure helper (markers, gradients,
// etc.) is prefixed with that figure's own slug, e.g. "cp-arrow" below.
// url(#...) references bind to the first DOM match, so an unprefixed id
// silently breaks the moment two figures using it are ever on the page
// together — namespace it up front rather than discovering that later.

// Inline SVG figure for the CP diagnostic algorithm — themed with the
// app's own CSS custom properties so it matches light/dark automatically.
function cpAlgorithmFigure(lang) {
  const t = lang === "hu"
    ? {
      caption: "Az ESC/EACVI diagnosztikus echo algoritmus döntési útja constrictiv pericarditis gyanúja esetén.",
      step1a: "Mitralis E/A > 0,8", step1b: "+ tágult VCI?",
      exit1: "Valószínűtlen",
      step2a: "Kóros légzésfüggő", step2b: "septum elmozdulás?",
      exit2a: "További képalkotás", exit2b: "ha a gyanú fennáll", exit2c: "(CT / kateterezés)",
      step3: "Medialis e′ (septalis)",
      pillCP: "Constrictio", pillMixed: "Kevert", pillRestr: "Restrictio",
      step4a: "Annulus reversus, vagy vena hepatica", step4b: "diasztolés reverz áramlás (kilégzési",
      step4c: "retrográd/antegrád arány ≥ 0,8)?",
      finalCP: "Constrictio", finalMixed: "Kevert",
      yes: "igen", no: "nem",
    }
    : {
      caption: "The ESC/EACVI diagnostic echo algorithm's decision path when constriction is suspected.",
      step1a: "Mitral E/A > 0.8", step1b: "+ dilated IVC?",
      exit1: "Unlikely",
      step2a: "Abnormal respirophasic", step2b: "septal shift?",
      exit2a: "Further imaging", exit2b: "if still suspected", exit2c: "(CT / catheterization)",
      step3: "Medial e′ (septal)",
      pillCP: "Constriction", pillMixed: "Mixed", pillRestr: "RCM",
      step4a: "Annulus reversus, or hepatic vein", step4b: "diastolic reversal (expiratory",
      step4c: "retrograde/antegrade flow ≥ 0.8)?",
      finalCP: "Constriction", finalMixed: "Mixed",
      yes: "yes", no: "no",
    };
  return `
    <figure class="wiki-figure">
      <svg viewBox="0 0 380 572" role="img" aria-label="${t.caption}">
        <defs>
          <marker id="cp-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--text-sub)"></path>
          </marker>
        </defs>

        <!-- Step 1 -->
        <rect x="15" y="16" width="220" height="54" rx="10" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.5"></rect>
        <text x="125" y="38" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">${t.step1a}</text>
        <text x="125" y="54" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">${t.step1b}</text>
        <rect x="255" y="16" width="110" height="54" rx="10" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.5"></rect>
        <text x="310" y="47" text-anchor="middle" font-size="11" fill="var(--text-sub)">${t.exit1}</text>
        <line x1="125" y1="70" x2="125" y2="106" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#cp-arrow)"></line>
        <rect x="131" y="82" width="26" height="14" fill="var(--bg)"></rect>
        <text x="144" y="93" text-anchor="middle" font-size="11" fill="var(--text-sub)">${t.yes}</text>
        <line x1="235" y1="43" x2="251" y2="43" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#cp-arrow)"></line>
        <rect x="232" y="26" width="26" height="14" fill="var(--bg)"></rect>
        <text x="245" y="37" text-anchor="middle" font-size="11" fill="var(--text-sub)">${t.no}</text>

        <!-- Step 2 -->
        <rect x="15" y="110" width="220" height="54" rx="10" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.5"></rect>
        <text x="125" y="132" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">${t.step2a}</text>
        <text x="125" y="148" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">${t.step2b}</text>
        <rect x="255" y="110" width="110" height="64" rx="10" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.5"></rect>
        <text x="310" y="129" text-anchor="middle" font-size="10" fill="var(--text-sub)">${t.exit2a}</text>
        <text x="310" y="143" text-anchor="middle" font-size="10" fill="var(--text-sub)">${t.exit2b}</text>
        <text x="310" y="157" text-anchor="middle" font-size="10" fill="var(--text-sub)">${t.exit2c}</text>
        <line x1="125" y1="164" x2="125" y2="200" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#cp-arrow)"></line>
        <rect x="131" y="176" width="26" height="14" fill="var(--bg)"></rect>
        <text x="144" y="187" text-anchor="middle" font-size="11" fill="var(--text-sub)">${t.yes}</text>
        <line x1="235" y1="137" x2="251" y2="137" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#cp-arrow)"></line>
        <rect x="232" y="120" width="26" height="14" fill="var(--bg)"></rect>
        <text x="245" y="131" text-anchor="middle" font-size="11" fill="var(--text-sub)">${t.no}</text>

        <!-- Step 3: medial e' three-way split -->
        <rect x="15" y="204" width="220" height="48" rx="10" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.5"></rect>
        <text x="125" y="233" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">${t.step3}</text>

        <line x1="125" y1="252" x2="70" y2="297" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#cp-arrow)"></line>
        <line x1="125" y1="252" x2="190" y2="297" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#cp-arrow)"></line>
        <line x1="125" y1="252" x2="310" y2="297" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#cp-arrow)"></line>
        <rect x="76" y="264" width="42" height="14" fill="var(--bg)"></rect>
        <text x="97" y="275" text-anchor="middle" font-size="10.5" fill="var(--text-sub)">&gt; 8 cm/s</text>
        <rect x="136" y="264" width="52" height="14" fill="var(--bg)"></rect>
        <text x="162" y="275" text-anchor="middle" font-size="10.5" fill="var(--text-sub)">6–8 cm/s</text>
        <rect x="248" y="264" width="42" height="14" fill="var(--bg)"></rect>
        <text x="269" y="275" text-anchor="middle" font-size="10.5" fill="var(--text-sub)">&lt; 6 cm/s</text>

        <rect x="20" y="300" width="100" height="44" rx="10" fill="var(--grade-mild-bg)"></rect>
        <text x="70" y="326" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--grade-mild-text)">${t.pillCP}</text>
        <rect x="140" y="300" width="100" height="44" rx="10" fill="var(--grade-moderate-bg)"></rect>
        <text x="190" y="326" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--grade-moderate-text)">${t.pillMixed}</text>
        <rect x="260" y="300" width="100" height="44" rx="10" fill="var(--grade-severe-bg)"></rect>
        <text x="310" y="326" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--grade-severe-text)">${t.pillRestr}</text>

        <!-- Step 4: only reached from the Mixed pill -->
        <line x1="190" y1="344" x2="190" y2="396" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#cp-arrow)"></line>
        <rect x="40" y="400" width="300" height="76" rx="10" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.5"></rect>
        <text x="190" y="418" text-anchor="middle" font-size="11.5" font-weight="700" fill="var(--text-main)">${t.step4a}</text>
        <text x="190" y="432" text-anchor="middle" font-size="11.5" font-weight="700" fill="var(--text-main)">${t.step4b}</text>
        <text x="190" y="446" text-anchor="middle" font-size="11.5" font-weight="700" fill="var(--text-main)">${t.step4c}</text>

        <line x1="160" y1="476" x2="115" y2="498" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#cp-arrow)"></line>
        <rect x="104" y="482" width="26" height="14" fill="var(--bg)"></rect>
        <text x="117" y="493" text-anchor="middle" font-size="11" fill="var(--text-sub)">${t.yes}</text>
        <line x1="220" y1="476" x2="265" y2="498" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#cp-arrow)"></line>
        <rect x="252" y="482" width="26" height="14" fill="var(--bg)"></rect>
        <text x="265" y="493" text-anchor="middle" font-size="11" fill="var(--text-sub)">${t.no}</text>

        <rect x="60" y="502" width="110" height="44" rx="10" fill="var(--grade-mild-bg)"></rect>
        <text x="115" y="529" text-anchor="middle" font-size="11.5" font-weight="700" fill="var(--grade-mild-text)">${t.finalCP}</text>
        <rect x="210" y="502" width="110" height="44" rx="10" fill="var(--grade-moderate-bg)"></rect>
        <text x="265" y="529" text-anchor="middle" font-size="11.5" font-weight="700" fill="var(--grade-moderate-text)">${t.finalMixed}</text>
      </svg>
      <figcaption>${t.caption}</figcaption>
    </figure>
  `;
}

// Photo figure: ventricular interdependence across the respiratory cycle.
// The source image (constriction-diagram.png) has had its original Spanish
// labels erased; the labels here are real HTML text overlaid by percentage
// position, so they stay crisp and swap with the language toggle instead
// of being baked into the image.
function ventInterdependenceFigure(lang) {
  const t = lang === "hu"
    ? {
      caption: "Kamrai interdependencia apnoéban, belégzésben és kilégzésben — a belégzés fokozza a jobb kamrai, a kilégzés a bal kamrai telődést.",
      source: "Forrás",
      apnea: "Apnoe", insp: "Belégzés", exp: "Kilégzés",
      rv: "JK", lv: "BK",
      ivc1: "Vena cava", ivc2: "inferior",
      pv: "Pulmonalis vénák",
    }
    : {
      caption: "Ventricular interdependence across apnea, inspiration, and expiration — inspiration boosts RV filling, expiration boosts LV filling.",
      source: "Source",
      apnea: "Apnea", insp: "Inspiration", exp: "Expiration",
      rv: "RV", lv: "LV",
      ivc1: "Inferior", ivc2: "vena cava",
      pv: "Pulmonary veins",
    };
  return `
    <figure class="wiki-figure">
      <div class="anatomy-figure">
        <img src="./constriction-diagram.png" alt="${t.caption}" loading="lazy">
        <span class="lbl title" style="left:18.9%;top:7.5%;">${t.apnea}</span>
        <span class="lbl title" style="left:50.6%;top:7.5%;">${t.insp}</span>
        <span class="lbl title" style="left:82.0%;top:7.5%;">${t.exp}</span>
        <span class="lbl chamber" style="left:12.6%;top:32.8%;">${t.rv}</span>
        <span class="lbl chamber" style="left:21.9%;top:29.1%;">${t.lv}</span>
        <span class="lbl small" style="left:8.5%;top:92.4%;">${t.ivc1}<br>${t.ivc2}</span>
        <span class="lbl small" style="left:32.7%;top:96.8%;">${t.pv}</span>
      </div>
      <figcaption>${t.caption}<br>${t.source}: <a href="https://doi.org/10.1016/S0304-5412(13)70664-4" target="_blank" rel="noopener">doi.org/10.1016/S0304-5412(13)70664-4</a></figcaption>
    </figure>
  `;
}

// Flow convergence geometry: isovelocity shells above the orifice, the first
// aliasing boundary highlighted, and the radius drawn where it is actually
// measured — from that boundary to the vena contracta, not to the leaflet tips.
// Themed entirely with the app's CSS custom properties, so it follows light/dark.
function pisaFigure(lang) {
  const t = lang === "hu"
    ? {
      caption: "Az áramlási konvergencia geometriája: az orificium felett azonos sebességű héjak alakulnak ki. A sugarat az első aliasing határtól a vena contractáig mérjük.",
      prox: "BK", dist: "BP",
      alias1: "első aliasing", alias2: "határ",
      orif1: "orificium /", orif2: "vena contracta",
    }
    : {
      caption: "Flow convergence geometry: isovelocity shells form above the orifice. The radius is measured from the first aliasing boundary to the vena contracta.",
      prox: "LV", dist: "LA",
      alias1: "first aliasing", alias2: "boundary",
      orif1: "orifice /", orif2: "vena contracta",
    };
  return `
    <figure class="wiki-figure">
      <svg viewBox="0 0 340 252" role="img" aria-label="${t.caption}">
        <defs>
          <marker id="pisa-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"></path>
          </marker>
          <marker id="pisa-tick" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--text-sub)"></path>
          </marker>
        </defs>

        <text x="22" y="34" font-size="12" font-weight="700" fill="var(--text-sub)">${t.prox}</text>
        <text x="22" y="230" font-size="12" font-weight="700" fill="var(--text-sub)">${t.dist}</text>

        <path d="M158,152 L128,240 L212,240 L182,152 Z" fill="var(--accent)" opacity="0.16"></path>

        <path d="M52,150 L152,150" stroke="var(--text-main)" stroke-width="5" stroke-linecap="round"></path>
        <path d="M188,150 L288,150" stroke="var(--text-main)" stroke-width="5" stroke-linecap="round"></path>

        <path d="M142,150 A28,28 0 0 1 198,150" fill="none" stroke="var(--text-sub)" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.7"></path>
        <path d="M126,150 A44,44 0 0 1 214,150" fill="none" stroke="var(--text-sub)" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.7"></path>
        <path d="M110,150 A60,60 0 0 1 230,150" fill="none" stroke="var(--accent)" stroke-width="2.5"></path>

        <line x1="140" y1="110" x2="159" y2="140" stroke="var(--text-sub)" stroke-width="1.2" marker-end="url(#pisa-tick)" opacity="0.8"></line>
        <line x1="200" y1="110" x2="181" y2="140" stroke="var(--text-sub)" stroke-width="1.2" marker-end="url(#pisa-tick)" opacity="0.8"></line>

        <line x1="170" y1="149" x2="170" y2="91" stroke="var(--accent)" stroke-width="1.5" marker-start="url(#pisa-arrow)" marker-end="url(#pisa-arrow)"></line>
        <!-- Label mask: must match .wiki-figure's own background (--subtle-bg),
             NOT --bg. In dark mode --bg is darker than --subtle-bg, so a --bg
             mask shows up as a visible box. -->
        <rect x="174" y="110" width="16" height="18" fill="var(--subtle-bg)"></rect>
        <text x="182" y="124" text-anchor="middle" font-size="13" font-weight="700" font-style="italic" fill="var(--accent)">r</text>

        <line x1="232" y1="90" x2="214" y2="105" stroke="var(--accent)" stroke-width="1" opacity="0.7"></line>
        <text x="236" y="84" font-size="10" fill="var(--accent)">${t.alias1}</text>
        <text x="236" y="96" font-size="10" fill="var(--accent)">${t.alias2}</text>

        <line x1="238" y1="172" x2="184" y2="154" stroke="var(--text-sub)" stroke-width="1" opacity="0.7"></line>
        <text x="238" y="178" font-size="10" fill="var(--text-sub)">${t.orif1}</text>
        <text x="238" y="190" font-size="10" fill="var(--text-sub)">${t.orif2}</text>
      </svg>
      <figcaption>${t.caption}</figcaption>
    </figure>
  `;
}

const wikiTopics = [
  {
    id: "constrictive-pericarditis",
    category: "pericardium",
    reviewed: "2026-08",
    title: { en: "Constrictive Pericarditis", hu: "Constrictiv Pericarditis" },
    summary: {
      en: [
        "Respirophasic septal shift is the entry finding — look for it on the first beat of inspiration.",
        "Medial e′ preserved or high (&ge; 8–9 cm/s), often exceeding lateral e′ — “annulus reversus”.",
        "Hepatic vein expiratory diastolic flow reversal; stays reliable in AF, unlike mitral inflow variation.",
        "<strong>Do not use E/e′ to estimate filling pressure here</strong> — annular motion is exaggerated despite high pressures.",
        "Longitudinal strain preserved, circumferential impaired — the reverse of restrictive cardiomyopathy.",
        '<button type="button" class="wiki-inline-link" data-scroll-target="cp-diagnostic-algorithm">Diagnostic algorithm</button>',
      ],
      hu: [
        "A légzésfüggő septum-elmozdulás a belépő jel — a belégzés első ütésében keressük.",
        "A medialis e′ megtartott vagy magas (&ge; 8–9 cm/s), gyakran meghaladja a lateralist — „annulus reversus”.",
        "Vena hepatica kilégzési diasztolés reverz áramlás; pitvarfibrillációban is megbízható, a mitralis beáramlással ellentétben.",
        "<strong>Az E/e′ itt nem használható a telődési nyomás becslésére</strong> — az annulus mozgása a magas nyomások ellenére fokozott.",
        "A longitudinális strain megtartott, a circumferentialis beszűkült — fordítva, mint restriktív cardiomyopathiában.",
        '<button type="button" class="wiki-inline-link" data-scroll-target="cp-diagnostic-algorithm">Diagnosztikus algoritmus</button>',
      ],
    },
    body: {
      en: `
        <h3>Definition &amp; pathophysiology</h3>
        <p>A chronically thickened, fibrotic — sometimes calcified — pericardium loses its elasticity and encases the heart like a rigid shell, mechanically limiting diastolic filling. Two hemodynamic hallmarks follow:</p>
        <ul>
          <li>Inspiratory drops in intrathoracic pressure don't transmit fully to the encased LA/LV, so LV filling falls with inspiration.</li>
          <li>Exaggerated ventricular interdependence: as LV filling falls, RV filling rises reciprocally — this drives the respirophasic septal shift and the discordant RV/LV systolic pressures.</li>
          <li>Kussmaul's sign (an inspiratory <em>rise</em> in jugular venous pressure, instead of the normal fall) has a separate mechanism: the encased heart is already maximally filled, so it cannot accommodate the extra venous return that inspiration drives forward, and the pressure backs up into the jugular veins. This is why Kussmaul's sign is seen in constriction but not in tamponade.</li>
        </ul>
        <p>Restrictive cardiomyopathy (RCM) produces a similar filling pattern, but from myocardial stiffness rather than pericardial constraint — pericardial compliance is normal, so respiratory pressure changes transmit normally. Telling the two apart matters: constriction is often surgically curable (pericardiectomy).</p>

        <h3>Echocardiographic findings in constriction</h3>
        ${ventInterdependenceFigure("en")}
        <ul>
          <li><strong>2D/M-mode:</strong> septal bounce — an abrupt early-diastolic shift of the septum toward the LV, following the respiratory cycle (most pronounced on the first beat of inspiration); septal "shudder". Adhesions may be visible tethering the ventricular wall, and the pericardium can appear thickened and echodense — but normal pericardial thickness on echo does <em>not</em> exclude constriction — TTE is unreliable for thickness; TEE, CT or MRI are better suited for that.</li>
          <li><strong>Mitral inflow:</strong> E/A &gt; 1.6 in expiration with a deceleration time usually &lt; 160 ms — the established restrictive filling pattern. (The algorithm below enters at the more permissive E/A &gt; 0.8: that is a deliberately sensitive screening threshold, not a description of established constriction.) Peak E velocity falls &ge; 25% on the first beat of inspiration — the Mayo criterion; a looser &gt; 15% is sometimes used, at the cost of specificity. The variation is absent in up to a third of patients with constriction, and unreliable in AF.</li>
          <li><strong>Tricuspid inflow:</strong> peak E velocity rises &gt; 40% with inspiration, reciprocal to the mitral change.</li>
          <li><strong>Hepatic veins:</strong> prominent diastolic flow reversal in expiration — stays reliable even in AF.</li>
          <li><strong>Tissue Doppler (medial e′):</strong> preserved or high (≥ 8–9 cm/s) despite elevated filling pressures — the opposite of restriction. "Annulus reversus": medial e′ ≥ lateral e′, seen in up to 75% of surgically proven constriction.</li>
          <li><strong>Strain:</strong> longitudinal strain preserved, circumferential strain impaired — the reverse pattern from RCM, where longitudinal strain is reduced. Regionally the gradient flips too: the adherent pericardium tethers the lateral wall, so lateral longitudinal strain drops while septal strain stays preserved.</li>
          <li><strong>IVC:</strong> dilated, &lt;50% collapse with sniff — reflects elevated RA pressure but isn't specific to constriction.</li>
        </ul>
        <p class="wiki-callout"><strong>Important! – "annulus reversus":</strong> because annular motion is exaggerated despite high filling pressures, E/e′ should not be used to estimate LV filling pressure in suspected constriction.</p>

        <h3>Constriction vs. restriction — quick comparison</h3>
        <ul>
          <li><strong>Septum:</strong> constriction → respirophasic shift; restriction → absent.</li>
          <li><strong>Medial e′:</strong> constriction → preserved/high (≥8–9 cm/s); restriction → globally reduced.</li>
          <li><strong>Annulus reversus (medial e′ ≥ lateral e′):</strong> constriction → often present; restriction → absent.</li>
          <li><strong>Mitral inflow respiratory variation:</strong> constriction → &ge;25% fall on inspiration (&gt;15% is the looser threshold); restriction → minimal.</li>
          <li><strong>Hepatic vein expiratory diastolic reversal:</strong> constriction → prominent; restriction → minimal.</li>
          <li><strong>Longitudinal strain:</strong> constriction → preserved; restriction → reduced.</li>
          <li><strong>RV/LV systolic pressure with inspiration:</strong> constriction → discordant (opposite directions); restriction → concordant (same direction).</li>
        </ul>

        <h3 id="cp-diagnostic-algorithm">Diagnostic algorithm (ESC/EACVI echo algorithm)</h3>
        ${cpAlgorithmFigure("en")}
        <p><strong>Findings favoring restriction</strong> (when suspicion of a restrictive component persists): DT &lt; 150 ms, IVRT &lt; 50 ms, PV systolic fraction &lt; 40%, E/e′ &gt; 15, LAVI &gt; 48 ml/m².</p>
        <p>When a comprehensive TTE study is diagnostic for constriction, no further testing is usually necessary; cardiac catheterization is reserved for inconclusive or discordant cases.</p>

        <h3>Common causes</h3>
        <p>Post-cardiac surgery, prior radiation therapy, tuberculosis, and recurrent/viral pericarditis are the most common etiologies. Post-radiation cases often show a mixed constriction/restriction pattern.</p>

        <h3>Pitfalls</h3>
        <ul>
          <li>COPD can mimic constriction's respiratory inflow variation, but shows a lower E/A ratio, longer deceleration time, and marked inspiratory forward flow in the SVC (absent in constriction).</li>
          <li>Atrial fibrillation makes mitral inflow variation unreliable — lean on medial e′ and hepatic vein findings instead.</li>
          <li>Normal pericardial thickness on imaging does not exclude constriction.</li>
        </ul>
      `,
      hu: `
        <h3>Definíció és patofiziológia</h3>
        <p>A krónikusan megvastagodott, fibrotikus — néha meszes — pericardium elveszti rugalmasságát, és merev héjként veszi körül a szívet, mechanikusan korlátozva a diasztolés telődést. Ebből két hemodinamikai jellegzetesség következik:</p>
        <ul>
          <li>A belégzés során csökkenő intrathoracalis nyomás nem terjed át teljesen a körülzárt bal pitvarra/kamrára, ezért a bal kamrai telődés belégzéskor csökken.</li>
          <li>Fokozott kamrai interdependencia: ahogy a bal kamrai telődés csökken, a jobb kamrai telődés reciprok módon nő — ez áll a légzésfüggő septum-elmozdulás és a diszkordáns jobb/bal kamrai szisztolés nyomások hátterében.</li>
          <li>A Kussmaul-jel (a jugularis vénás nyomás belégzéskori <em>emelkedése</em> a normális csökkenés helyett) mechanizmusa ettől eltér: a körülzárt szív már maximálisan telt, ezért nem tudja befogadni a belégzés által előrehajtott többlet vénás visszaáramlást, így a nyomás a jugularis vénákra tevődik át. Ezért látunk Kussmaul-jelet constrictióban, de tamponádban nem.</li>
        </ul>
        <p>A restriktív cardiomyopathia (RCM) hasonló telődési mintázatot okoz, de a myocardium merevsége, nem a pericardialis korlátozás miatt — a pericardialis compliance normális, így a légzési nyomásváltozások normálisan terjednek át. A kettő elkülönítése azért fontos, mert a constrictio gyakran sebészileg (pericardectomiával) gyógyítható.</p>

        <h3>Echokardiográfiás jelek constrictióban</h3>
        ${ventInterdependenceFigure("hu")}
        <ul>
          <li><strong>2D/M-mode:</strong> septum "bounce" — a septum hirtelen, korai diasztolés elmozdulása a bal kamra felé, a légzési ciklust követve (a belégzés első ütésében a legkifejezettebb); septalis "shudder". Adhéziók láthatók lehetnek, amik "tartják" a kamrafalat, a pericardium pedig megvastagodottnak és echodenznek tűnhet — de a normális pericardialis vastagság echoval <em>nem</em> zárja ki a constrictiót — a TTE megbízhatatlan a vastagság megítélésében, erre a TEE, CT vagy MRI alkalmasabb.</li>
          <li><strong>Mitralis beáramlás:</strong> E/A &gt; 1,6 kilégzésben, a decelerációs idő általában &lt; 160 ms — ez a kialakult restriktív telődési mintázat. (Az alábbi algoritmus a megengedőbb E/A &gt; 0,8 értéknél lép be: ez szándékosan érzékeny szűrőküszöb, nem a kialakult constrictio leírása.) A csúcs E sebesség &ge; 25%-kal csökken a belégzés első ütésében — ez a Mayo-kritérium; a lazább &gt; 15% is használatos, a specificitás rovására. A variabilitás a constrictiós betegek akár egyharmadánál hiányzik, és pitvarfibrillációban nem megbízható.</li>
          <li><strong>Tricuspidalis beáramlás:</strong> a csúcs E sebesség &gt; 40%-kal nő belégzéskor, reciprok a mitralis változással.</li>
          <li><strong>Vena hepaticák:</strong> kifejezett diasztolés reverz áramlás kilégzéskor — pitvarfibrillációban is megbízható marad.</li>
          <li><strong>Szöveti Doppler (medialis e′):</strong> megtartott vagy magas (≥ 8–9 cm/s) az emelkedett telődési nyomások ellenére — ez az ellenkezője a restrictiónak. "Annulus reversus": medialis e′ ≥ lateralis e′, a sebészileg igazolt constrictiós esetek akár 75%-ában megfigyelhető.</li>
          <li><strong>Strain:</strong> a longitudinális strain megtartott, a circumferentialis strain beszűkült — ez fordított mintázat az RCM-hez képest, ahol a longitudinális strain csökkent. Regionálisan is megfordul a gradiens: a letapadt pericardium megköti a lateralis falat, így a lateralis longitudinális strain csökken, miközben a septalis megtartott marad.</li>
          <li><strong>V. cava inferior:</strong> tágult, &lt;50%-os collapsus szimatolásra (sniff) — emelkedett jobb pitvari nyomást tükröz, de nem specifikus constrictióra.</li>
        </ul>
        <p class="wiki-callout"><strong>Fontos! – "annulus reversus":</strong> mivel az annulus mozgása fokozott a magas telődési nyomások ellenére, az E/e′ hányados nem használható a bal kamrai telődési nyomás becslésére feltételezett constrictio esetén.</p>

        <h3>Constrictio vs. restrictio — gyors összehasonlítás</h3>
        <ul>
          <li><strong>Septum:</strong> constrictio → légzésfüggő elmozdulás; restrictio → hiányzik.</li>
          <li><strong>Medialis e′:</strong> constrictio → megtartott/magas (≥8–9 cm/s); restrictio → globálisan csökkent.</li>
          <li><strong>Annulus reversus (medialis e′ ≥ lateralis e′):</strong> constrictio → gyakran jelen van; restrictio → hiányzik.</li>
          <li><strong>Mitralis beáramlás légzési variabilitása:</strong> constrictio → &ge;25%-os csökkenés belégzéskor (&gt;15% a lazább küszöb); restrictio → minimális.</li>
          <li><strong>Vena hepatica kilégzési diasztolés reverz áramlás:</strong> constrictio → kifejezett; restrictio → minimális.</li>
          <li><strong>Longitudinális strain:</strong> constrictio → megtartott; restrictio → csökkent.</li>
          <li><strong>Jobb/bal kamrai szisztolés nyomás belégzéskor:</strong> constrictio → diszkordáns (ellentétes irányú); restrictio → konkordáns (azonos irányú).</li>
        </ul>

        <h3 id="cp-diagnostic-algorithm">Diagnosztikus algoritmus (ESC/EACVI echo algoritmus)</h3>
        ${cpAlgorithmFigure("hu")}
        <p><strong>Restrictiót valószínűsítő jelek</strong> (ha restriktív komponens gyanúja továbbra is fennáll): DT &lt; 150 ms, IVRT &lt; 50 ms, pulmonalis vénás szisztolés frakció &lt; 40%, E/e′ &gt; 15, LAVI &gt; 48 ml/m².</p>
        <p>Ha egy átfogó TTE vizsgálat diagnosztikus constrictióra, további vizsgálat általában nem szükséges; a szívkatéterezés a nem egyértelmű vagy ellentmondó esetek számára van fenntartva.</p>

        <h3>Gyakori okok</h3>
        <p>A leggyakoribb etiológiák: szívműtét utáni állapot, korábbi sugárkezelés, tuberkulózis, valamint recidiváló/virális pericarditis. A sugárkezelés utáni esetek gyakran kevert constrictiv/restriktiv mintázatot mutatnak.</p>

        <h3>Buktatók</h3>
        <ul>
          <li>A COPD utánozhatja a constrictio légzésfüggő beáramlási variabilitását, de alacsonyabb E/A hányadossal, hosszabb decelerációs idővel és kifejezett belégzési előremenő áramlással jár a vena cava superiorban (ami constrictióban hiányzik).</li>
          <li>Pitvarfibrillációban a mitralis beáramlás variabilitása nem megbízható — ilyenkor a medialis e′-re és a vena hepatica jelekre érdemes támaszkodni.</li>
          <li>A normális pericardialis vastagság képalkotáson nem zárja ki a constrictiót.</li>
        </ul>
      `,
    },
    sources: [
      {
        url: "https://www.cardioserv.net/constrictive-pericarditis-vs-restrictive-cardiomyopathy-echo-findings/",
        label: { en: "Cardioserv — Constrictive Pericarditis vs Restrictive Cardiomyopathy", hu: "Cardioserv — Constrictive Pericarditis vs Restrictive Cardiomyopathy" },
      },
      {
        url: "https://www.escardio.org/communities/councils/cardiology-practice/scientific-documents-and-publications/ejournal/volume-15/Constrictive-pericarditis-role-of-echocardiography-and-magnetic-resonance-imaging/",
        label: { en: "ESC e-Journal — Constrictive pericarditis: role of echocardiography and MRI", hu: "ESC e-Journal — Constrictive pericarditis: role of echocardiography and MRI" },
      },
      {
        label: { en: "EACVI Imaging Summer School, Graz 2026 (slide reference)", hu: "EACVI Imaging Summer School, Graz 2026 (dia hivatkozás)" },
      },
    ],
  },
  {
    id: "pisa-method",
    category: "methods",
    kind: "deep",
    reviewed: "2026-08",
    title: { en: "The PISA method", hu: "A PISA módszer" },
    keywords: {
      en: ["pisa", "eroa", "ero", "regurgitant volume", "flow convergence", "aliasing", "nyquist"],
      hu: ["pisa", "eroa", "ero", "regurgitációs volumen", "áramlási konvergencia", "aliasing", "nyquist"],
    },
    summary: {
      en: [
        "Zoom the valve, shift the color baseline in the direction of the jet, aliasing 20–40 cm/s.",
        "Measure <strong>r</strong> from the first aliasing boundary to the vena contracta — mid-systole for MR/TR, early diastole for AR.",
        "<strong>r is squared:</strong> 1 mm of error moves ERO by 20–27% at a typical 8–10 mm radius. Measure it twice.",
        "Trace the whole CW envelope; a misaligned or faint trace underestimates Vmax and VTI. In AF, match beats of similar RR interval or average several consecutive beats.",
        "Invalid for multiple jets. Overestimates when the regurgitation is not holosystolic.",
      ],
      hu: [
        "Nagyítsunk rá a billentyűre, toljuk el a color baseline-t a jet irányába, aliasing 20–40 cm/s.",
        "Az <strong>r</strong>-t az első aliasing határtól a vena contractáig mérjük — MR/TR esetén mid-szisztoléban, AR esetén koradiasztoléban.",
        "<strong>Az r négyzeten szerepel:</strong> 1 mm mérési hiba 20–27%-kal mozdítja el az ERO-t egy tipikus 8–10 mm-es sugárnál. Mérjük meg kétszer.",
        "A teljes CW burkológörbét trace-eljük; a rossz beállás vagy a halvány burkológörbe alábecsüli a Vmax-ot és a VTI-t. Pitvarfibrillációban hasonló RR-távolságú ütéseket mérjünk, vagy átlagoljunk több egymást követő ütést.",
        "Több jet esetén nem érvényes. Túlbecsül, ha a regurgitáció nem holoszisztolés.",
      ],
    },
    body: {
      en: `
        <h3>The principle</h3>
        <p>Blood converging on a small orifice organises itself into shells of equal velocity. Color Doppler draws the shell where velocity equals the aliasing velocity as a sharp color reversal, and that boundary is the one thing in the flow field you can actually measure.</p>
        ${pisaFigure("en")}
        <p>If that shell is a hemisphere, its surface area is 2&pi;r&sup2;, so the flow crossing it is <strong>Q = 2&pi;r&sup2; &times; V<sub>aliasing</sub></strong>. All of that flow then passes through the orifice at the jet's peak velocity, which gives <strong>ERO = Q / V<sub>max</sub></strong> and <strong>Reg. volume = ERO &times; VTI</strong>.</p>
        <p>Two assumptions carry the entire method: <em>the shell is a hemisphere</em>, and <em>the flow crossing it equals the flow through the orifice at that instant</em>. Every limitation below is one of those two failing — which is more useful to remember than the list itself.</p>

        <h3>How to measure it</h3>
        <ol>
          <li>Zoom on the valve and narrow the sector. Frame rate matters more here than field of view.</li>
          <li>Color on, with the smallest box that contains the convergence zone.</li>
          <li>Shift the color baseline <em>in the direction the jet is travelling</em> — downward for a jet moving away from the transducer, which is the usual apical MR and TR case. Target an aliasing velocity of 20–40 cm/s.</li>
          <li>Adjust until the first aliasing boundary is <em>well-defined and hemispherical</em>. That is the goal — not the largest possible convergence zone.</li>
          <li>Freeze and scroll to mid-systole for MR and TR, or early diastole for AR.</li>
          <li>Measure r from the first aliasing boundary to the vena contracta — the narrowest point of the jet, <em>not</em> the leaflet tips.</li>
          <li>CW through the jet, tracing the whole regurgitant envelope: the peak gives V<sub>max</sub>, the traced integral gives the VTI. Whether either is usable comes down to alignment and envelope density — see Limitations. In AF, match beats of similar RR interval, or average several consecutive beats.</li>
        </ol>
        <p class="wiki-callout"><strong>Important!</strong> The radius is squared, so every measurement error is squared with it. At a typical 8–10 mm radius, being 1 mm out moves the ERO by roughly a fifth to a quarter. It is the single largest source of error in the whole calculation, and the one most worth repeating.</p>

        <h3>Valve-specific notes</h3>
        <ul>
          <li><strong>Mitral:</strong> apical 4-chamber or 3-chamber, color baseline shifted down. A visible flow convergence at a Nyquist limit around 50 cm/s is itself a flag for significant MR, before any measurement. The leaflets funnel the converging flow, so the angle it converges through is often nearer 120&deg; than a full hemisphere — see angle correction under Limitations. Secondary MR needs the caveat below.</li>
          <li><strong>Aortic:</strong> the hardest of the three, and the least relied upon — vena contracta width, pressure half-time and holodiastolic reversal in the descending aorta usually carry more weight. Apical 5-chamber or 3-chamber for central jets, parasternal long axis for eccentric ones. Measure in early diastole at the first aliasing. Feasibility is often limited by valve calcification, and the Nyquist limit usually needs raising in apical views to bring the convergence zone to a measurable size.</li>
          <li><strong>Tricuspid:</strong> apical 4-chamber, RV-focused. Velocities are lower — a large convergence zone at a Nyquist limit around 28 cm/s flags significant TR. Tricuspid orifices are often markedly non-circular, particularly in atrial functional TR with annular dilatation, which is where PISA underestimates most.</li>
        </ul>

        <h3>Limitations</h3>
        <p><strong>When the shell isn't a hemisphere:</strong></p>
        <ul>
          <li><strong>Constrained convergence.</strong> When leaflets or a chamber wall bound the inflow, the shell is a wedge rather than a full hemisphere, so assuming 2&pi;r&sup2; credits it with more surface than it has and the flow is overestimated. Correct by multiplying the area by &alpha;/180, where &alpha; is the angle the flow actually converges through — typically around 120&deg; at the mitral valve, and close to 180&deg; in the aortic root, where no correction is needed.</li>
          <li><strong>Non-circular orifices.</strong> The crescentic orifice of secondary MR and the dilated tricuspid annulus both flatten the shell, and PISA underestimates.</li>
          <li>These two act in opposite directions, and in secondary MR both are present at once — the leaflet funnel pushes the number up, the crescentic orifice pushes it down. That is a large part of why PISA is unreliable there, and why the number should not be trusted in isolation.</li>
          <li><strong>Aliasing set wrong.</strong> Too low and the shell is large and distorted by nearby structures; too high and it is so small that a single pixel of measurement error dominates.</li>
        </ul>
        <p><strong>When flow through the shell isn't flow through the orifice:</strong></p>
        <ul>
          <li><strong>Non-holosystolic MR</strong> — prolapse and late-systolic MR in particular. The peak instant is not representative of the whole cycle, so applying it to the whole cycle overestimates severity.</li>
          <li><strong>Secondary (functional) MR.</strong> The orifice is dynamic across systole, typically peaking in early and late systole, so a single mid-systolic frame underestimates the true regurgitant burden.</li>
          <li><strong>Multiple jets.</strong> PISA measures one convergence zone. Adding two PISA-derived orifices together is not a valid way to grade a two-jet valve.</li>
          <li><strong>Atrial fibrillation</strong> and other beat-to-beat variation — match beats of similar RR interval, or average several consecutive beats, and treat any single measurement with suspicion.</li>
        </ul>
        <p><strong>When the CW trace is the problem:</strong></p>
        <ul>
          <li>An eccentric jet that can't be aligned gives an underestimated V<sub>max</sub> and VTI. The direction of the resulting error is worth knowing because it is counterintuitive: V<sub>max</sub> sits in the <em>denominator</em> of ERO, so underestimating it <em>inflates</em> the ERO, while the underestimated VTI <em>deflates</em> the regurgitant volume. The two partly cancel in the regurgitant volume — but not in the ERO, which is left overstated.</li>
          <li>A faint or incomplete CW envelope does the same thing. If you cannot get a full, dense envelope, do not report an ERO from it.</li>
        </ul>

        <h3>When to use something else</h3>
        <ul>
          <li><strong>3D vena contracta area</strong> — direct planimetry of the orifice, which sidesteps the geometric assumption entirely. The best option when the orifice is known to be non-circular.</li>
          <li><strong>Vena contracta width</strong> — simpler and robust for a single central jet, and unaffected by the hemisphere problem.</li>
          <li><strong>Volumetric method</strong> (total SV minus LVOT forward SV) — available, but often inaccurate; treat it as a cross-check rather than a primary number.</li>
        </ul>
        <p>PISA is one input, not a verdict. Grade with it alongside the vena contracta, the jet, the pulmonary or hepatic vein pattern, chamber size and ventricular function — the severity tables behind the calculator's info buttons carry the cutoffs and the supporting signs for each valve.</p>
      `,
      hu: `
        <h3>Az elv</h3>
        <p>A szűk orificium felé konvergáló vér azonos sebességű héjakba rendeződik. A color Doppler éles színátcsapásként rajzolja ki azt a héjat, ahol a sebesség eléri az aliasing sebességet — és ez az egyetlen olyan határ az áramlási térben, amit ténylegesen meg tudunk mérni.</p>
        ${pisaFigure("hu")}
        <p>Ha ez a héj félgömb, akkor a felszíne 2&pi;r&sup2;, tehát a rajta átáramló vérmennyiség <strong>Q = 2&pi;r&sup2; &times; V<sub>aliasing</sub></strong>. Ez a teljes áramlás halad át az orificiumon a jet csúcssebességével, amiből <strong>ERO = Q / V<sub>max</sub></strong>, illetve <strong>Reg. volumen = ERO &times; VTI</strong>.</p>
        <p>Az egész módszert két feltevés tartja: <em>a héj félgömb alakú</em>, és <em>a rajta átáramló mennyiség megegyezik az orificiumon abban a pillanatban átáramló mennyiséggel</em>. Az alább felsorolt összes korlát e kettő valamelyikének a sérülése — ezt érdemesebb megjegyezni, mint magát a felsorolást.</p>

        <h3>A mérés menete</h3>
        <ol>
          <li>Nagyítsunk rá a billentyűre, szűkítsük a szektort. Itt a képfrissítési frekvencia fontosabb, mint a látótér mérete.</li>
          <li>Color Doppler bekapcsolva, a lehető legkisebb box-szal, ami még tartalmazza a konvergencia zónát.</li>
          <li>Toljuk el a color baseline-t <em>a jet haladási irányába</em> — lefelé, ha a jet a transzducertől távolodik, ami a szokásos apicalis MR és TR helyzet. A cél 20–40 cm/s aliasing sebesség.</li>
          <li>Állítsuk addig, amíg az első aliasing határ <em>jól kivehető és félgömb alakú</em> lesz. Ez a cél — nem a lehető legnagyobb konvergencia zóna.</li>
          <li>Fagyasszuk le a képet, és keressük meg a mid-szisztolés (MR, TR), illetve koradiasztolés (AR) fázist.</li>
          <li>Mérjük az r-t az első aliasing határtól a vena contractáig — a jet legszűkebb pontjáig, <em>nem</em> a vitorlavégekig.</li>
          <li>CW Doppler a jeten keresztül, a teljes regurgitációs burkológörbét trace-elve: a csúcs adja a V<sub>max</sub>-ot, a trace integrálja a VTI-t. Hogy bármelyik használható-e, a beállástól és a burkológörbe denzitásától függ — lásd a Korlátokat. Pitvarfibrillációban hasonló RR-távolságú ütéseket mérjünk, vagy átlagoljunk több egymást követő ütést.</li>
        </ol>
        <p class="wiki-callout"><strong>Fontos!</strong> A sugár négyzeten szerepel, így minden mérési hiba is négyzetre emelődik. Egy tipikus 8–10 mm-es sugárnál 1 mm tévedés nagyjából egyötöd–egynegyed résznyit mozdít az ERO-n. Ez a teljes számítás legnagyobb hibaforrása, és ezt éri meg a leginkább megismételni.</p>

        <h3>Billentyű-specifikus megjegyzések</h3>
        <ul>
          <li><strong>Mitralis:</strong> apicalis 4-üregű vagy 3-üregű nézet, a color baseline lefelé tolva. A kb. 50 cm/s-os Nyquist-limitnél is látható áramlási konvergencia önmagában jelzi a szignifikáns MR-t, még bármilyen mérés előtt. A vitorlák tölcsérszerűen szűkítik a konvergáló áramlást, így a konvergencia szöge gyakran inkább 120&deg; körüli, mint teljes félgömb — lásd a szögkorrekciót a Korlátok alatt. A szekunder MR-re a lenti megszorítás vonatkozik.</li>
          <li><strong>Aorta:</strong> a három közül a legnehezebb, és amelyikre a legkevésbé támaszkodunk — a vena contracta szélessége, a nyomásfelezési idő és az aorta descendens holodiasztolés reverz áramlása általában többet nyom a latban. Centrális jetnél apicalis 5-üregű vagy 3-üregű nézet, excentrikusnál parasternalis hossztengely. Koradiasztoléban mérjünk, az első aliasingnál. A kivitelezhetőséget gyakran korlátozza a billentyű meszesedése, és apicalis nézetekben rendszerint emelni kell a Nyquist-limitet, hogy a konvergencia zóna mérhető méretű legyen.</li>
          <li><strong>Tricuspidalis:</strong> apicalis 4-üregű, jobb kamrára fókuszált nézet. A sebességek alacsonyabbak — a kb. 28 cm/s-os Nyquist-limitnél látható nagy konvergencia zóna jelzi a szignifikáns TR-t. A tricuspidalis orificium gyakran kifejezetten nem kör alakú, különösen anulus tágulattal járó pitvari funkcionális TR-ben, és a PISA itt becsül alá a leginkább.</li>
        </ul>

        <h3>Korlátok</h3>
        <p><strong>Ha a héj nem félgömb:</strong></p>
        <ul>
          <li><strong>Korlátozott konvergencia zóna.</strong> Ha a beáramlást vitorlák vagy üregfal határolják, a héj nem teljes félgömb, hanem ék alakú, így a 2&pi;r&sup2; feltételezés nagyobb felszínt tulajdonít neki a valósnál, és túlbecsüli az áramlást. Korrigáljunk úgy, hogy a felszínt megszorozzuk &alpha;/180-nal, ahol &alpha; az a szög, amelyen keresztül az áramlás ténylegesen konvergál — a mitralis billentyűnél jellemzően 120&deg; körül, az aortagyökben viszont közel 180&deg;, ahol nincs szükség korrekcióra.</li>
          <li><strong>Nem kör alakú orificium.</strong> A szekunder MR félhold alakú orificiuma és a tágult tricuspidalis anulus egyaránt ellapítja a héjat, és a PISA alábecsül.</li>
          <li>Ez a kettő ellentétes irányba hat, és szekunder MR-ben egyszerre van jelen — a vitorlatölcsér felfelé, a félhold alakú orificium lefelé tolja az értéket. Nagyrészt ezért megbízhatatlan itt a PISA, és ezért nem szabad az értéket önmagában elfogadni.</li>
          <li><strong>Rosszul beállított aliasing.</strong> Túl alacsonyan a héj nagy lesz, és a környező struktúrák torzítják; túl magasan pedig olyan kicsi, hogy már egyetlen pixelnyi mérési hiba is dominál.</li>
        </ul>
        <p><strong>Ha a héjon átáramló mennyiség nem egyezik az orificiumon átáramlóval:</strong></p>
        <ul>
          <li><strong>Nem holoszisztolés MR</strong> — különösen prolapsus és későszisztolés MR esetén. A csúcspillanat nem reprezentatív az egész ciklusra, így az egész ciklusra vetítve túlbecsüli a súlyosságot.</li>
          <li><strong>Szekunder (funkcionális) MR.</strong> Az orificium a szisztolé során dinamikusan változik, jellemzően a korai és a késői szisztoléban a legnagyobb, ezért egyetlen mid-szisztolés kép alábecsüli a valódi regurgitációs terhet.</li>
          <li><strong>Több jet.</strong> A PISA egyetlen konvergencia zónát mér. Két PISA-ból származó orificium összeadása nem érvényes módja egy kétjetes billentyű megítélésének.</li>
          <li><strong>Pitvarfibrilláció</strong> és egyéb ütésről ütésre változó helyzet — hasonló RR-távolságú ütéseket válasszunk, vagy átlagoljunk több egymást követő ütést, és kezeljünk gyanakvással minden egyetlen mérésből származó értéket.</li>
        </ul>
        <p><strong>Ha a CW görbével van a baj:</strong></p>
        <ul>
          <li>A nem beállítható excentrikus jetnél alábecsüljük a V<sub>max</sub>-ot és a VTI-t. Az ebből adódó hiba iránya azért fontos, mert nem magától értetődő: a V<sub>max</sub> az ERO képletének <em>nevezőjében</em> áll, így az alábecslése <em>felfelé</em> tolja az ERO-t, míg az alábecsült VTI <em>lefelé</em> tolja a regurgitációs volument. A kettő a regurgitációs volumenben részben kiegyenlíti egymást — az ERO-ban viszont nem, az túlbecsült marad.</li>
          <li>A halvány vagy hiányos CW burkológörbe ugyanezt okozza. Ha nem sikerül teljes, denz burkológörbét kapni, ne közöljünk belőle ERO-t.</li>
        </ul>

        <h3>Mikor használjunk mást</h3>
        <ul>
          <li><strong>3D vena contracta terület</strong> — az orificium közvetlen planimetriája, ami teljesen megkerüli a geometriai feltevést. Ez a legjobb választás, ha tudjuk, hogy az orificium nem kör alakú.</li>
          <li><strong>Vena contracta szélesség</strong> — egyszerűbb és megbízható egyetlen centrális jetnél, és nem érinti a félgömb-probléma.</li>
          <li><strong>Volumetrikus módszer</strong> (teljes SV mínusz LVOT forward SV) — rendelkezésre áll, de gyakran pontatlan; kontrollértéknek kezeljük, ne elsődleges számnak.</li>
        </ul>
        <p>A PISA egy adat, nem ítélet. A súlyosságot mindig a vena contractával, a jettel, a pulmonalis vagy vena hepatica mintázattal, az üregek méretével és a szívfunkcióval együtt ítéljük meg — a határértékeket és az egyes billentyűkhöz tartozó kiegészítő jeleket a kalkulátor info gombjai mögötti súlyossági táblázatok tartalmazzák.</p>
      `,
    },
    sources: [
      {
        url: "https://academic.oup.com/ehjcimaging/article/14/7/611/2465068",
        label: {
          en: "EACVI — Recommendations for the echocardiographic assessment of native valvular regurgitation (executive summary)",
          hu: "EACVI — Ajánlás a natív billentyű-regurgitáció echokardiográfiás megítéléséhez (vezetői összefoglaló)",
        },
      },
      {
        url: "https://www.sciencedirect.com/science/article/pii/S089473171730007X",
        label: {
          en: "ASE — Recommendations for Noninvasive Evaluation of Native Valvular Regurgitation (Zoghbi et al.)",
          hu: "ASE — Ajánlás a natív billentyű-regurgitáció noninvazív megítéléséhez (Zoghbi és mtsai)",
        },
      },
      {
        url: "https://www.cardioserv.net/echo-mr-pisa/",
        label: {
          en: "Cardioserv — A complete guide to performing MR PISA",
          hu: "Cardioserv — Teljes útmutató az MR PISA kivitelezéséhez",
        },
      },
    ],
  },
];

// Dev guard: a topic's EN and HU bodies should contain the same numbers. A
// mismatch almost always means a cutoff was corrected in one language only
// — the single largest maintenance risk here, since every cutoff exists
// twice, in two long strings, with nothing else to catch a missed pair.
// HU decimal commas are normalised to dots first. SVG coordinates appear
// in both bodies identically, so they cancel out. Console-only, dev-gated
// — never runs for production users.
// Dev guard: EN/HU should carry the same numbers, and a summary's two
// language arrays should have the same line count. A mismatch almost
// always means one language got edited and the other didn't — the single
// largest maintenance risk here, since every fact exists twice. Topics
// lacking a body (cards) or a summary are skipped for that respective
// check rather than erroring; a topic with *one* language present and the
// other missing is a genuine contract violation and is left to throw
// loudly instead of being silently swallowed.
function auditWikiTopics() {
  const tokens = (html) => (html
    .replace(/<[^>]*>/g, " ")
    .replace(/(\d),(\d)/g, "$1.$2")
    .match(/\d+(?:\.\d+)?/g) || []).sort().join(" ");
  wikiTopics.forEach(t => {
    if (t.body) {
      const en = tokens(t.body.en), hu = tokens(t.body.hu);
      if (en !== hu) {
        console.warn(`[wiki] numeric drift in "${t.id}"\n  en: ${en}\n  hu: ${hu}`);
      }
    }
    if (t.summary) {
      const enLen = t.summary.en.length, huLen = t.summary.hu.length;
      if (enLen !== huLen) {
        console.warn(`[wiki] summary line-count mismatch in "${t.id}": en=${enLen} hu=${huLen}`);
      }
    }
  });
}
if (location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.search.includes("audit")) {
  auditWikiTopics();
}
