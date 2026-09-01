// Echo Calculator: calculator/state/UI logic. Split out of index.html;
// wiki topic metadata (wikiCategories, wikiTopics) lives in wiki-data.js,
// loaded before this file (see index.html) since the wiki render/routing
// functions below reference it. A topic's body (and the figures it embeds)
// is loaded on demand from wiki-topics/<id>.js — see loadWikiTopicBody().

const translations = {
  en: {
    title: "Echo Calculator", patientData: "Patient Data", weight: "Weight", height: "Height",
    bsaResult: "BSA", bsaManual: "Enter BSA manually", bsaCalculate: "Calculate BSA",
    heartRateGroup: "Heart Rate", heartRate: "Heart Rate",
    mitralValveGroup: "Mitral Valve", mrPisaGroup: "MR PISA", mvVtiPw: "MV VTI (PW)",
    mvVtiPwNote: "(for regurgitation grading)",
    mitralStenosisGroup: "Mitral Stenosis", mvVtiCw: "MV VTI (CW)", mvPht: "MV PHT",
    aorticValveMainGroup: "Aortic Valve", lvotGroup: "LVOT", aorticValveGroup: "Aortic Valve", arPisaGroup: "AR PISA",
    tricuspidValveGroup: "Tricuspid Valve", trPisaGroup: "TR PISA",
    pisaRadius: "PISA radius", aliasingVelocity: "Aliasing velocity", vmax: "Vmax", vti: "VTI",
    lvotDiam: "LVOT diameter", lvotVti: "LVOT VTI", lvotVmax: "LVOT Vmax",
    aorticVmax: "AV Vmax", meanGradient: "Mean gradient", aorticVti: "AV VTI", optional: "optional",
    prostheticAv: "Prosthetic valve", avAt: "Acceleration time", avEt: "Ejection time", avAtEt: "AT/ET",
    valveType: "Valve type", mechanical: "Mechanical", biological: "Biological", valveSize: "Valve size",
    mrEro: "MR ERO", mrRegVol: "MR Reg. vol.", mrRegFraction: "MR Reg. fraction",
    arEro: "AR ERO", arRegVol: "AR Reg. vol.", arRegFraction: "AR Reg. fraction",
    trEro: "TR ERO", trRegVol: "TR Reg. vol.",
    sv: "SV", svi: "SV(i)", cardiacOutput: "Cardiac output", cardiacIndex: "Cardiac Index",
    ava: "AVA", avai: "AVAi", eoa: "EOA", eoai: "EOAi",
    dviVti: "DVI(VTI)", dviVmax: "DVI(Vmax)", mvVtiLvotVti: "MV VTI / LVOT VTI",
    mvaVti: "MVA (VTI)", mvaPht: "MVA (PHT)",
    clear: "Clear All", results: "Calculated Results",
    copyReport: "Copy to clipboard", copied: "Copied to clipboard",
    copyEmpty: "Nothing to copy yet", copyFailed: "Couldn't copy — select and copy manually",
    wikiTitle: "Echo Wiki", wikiEmpty: "No topics yet — check back soon.",
  },
  hu: {
    title: "Echo Kalkulátor", patientData: "Beteg adatok", weight: "Testsúly", height: "Testmagasság",
    bsaResult: "BSA", bsaManual: "BSA kézi bevitel", bsaCalculate: "BSA számítása",
    heartRateGroup: "Pulzusszám", heartRate: "Pulzusszám",
    mitralValveGroup: "Mitrális billentyű", mrPisaGroup: "MR PISA", mvVtiPw: "MV VTI (PW)",
    mvVtiPwNote: "(regurgitatio kvantifikációhoz)",
    mitralStenosisGroup: "Mitrális stenosis", mvVtiCw: "MV VTI (CW)", mvPht: "MV PHT",
    aorticValveMainGroup: "Aorta billentyű", lvotGroup: "LVOT", aorticValveGroup: "Aorta billentyű", arPisaGroup: "AR PISA",
    tricuspidValveGroup: "Tricuspidalis billentyű", trPisaGroup: "TR PISA",
    pisaRadius: "PISA radius", aliasingVelocity: "Aliasing sebesség", vmax: "Vmax", vti: "VTI",
    lvotDiam: "LVOT átmérő", lvotVti: "LVOT VTI", lvotVmax: "LVOT Vmax",
    aorticVmax: "AV Vmax", meanGradient: "Átlag gradiens", aorticVti: "AV VTI", optional: "opcionális",
    prostheticAv: "Műbillentyű", avAt: "Akceleraciós idő", avEt: "Ejekciós idő", avAtEt: "AT/ET",
    valveType: "Billentyű típusa", mechanical: "Mechanikus", biological: "Biológiai", valveSize: "Billentyű mérete",
    mrEro: "MR ERO", mrRegVol: "MR Reg. volumen", mrRegFraction: "MR Reg. frakció",
    arEro: "AR ERO", arRegVol: "AR Reg. volumen", arRegFraction: "AR Reg. frakció",
    trEro: "TR ERO", trRegVol: "TR Reg. volumen",
    sv: "SV", svi: "SV(i)", cardiacOutput: "Perctérfogat", cardiacIndex: "Cardiac Index",
    ava: "AVA", avai: "AVAi", eoa: "EOA", eoai: "EOAi",
    dviVti: "DVI(VTI)", dviVmax: "DVI(Vmax)", mvVtiLvotVti: "MV VTI / LVOT VTI",
    mvaVti: "MVA (VTI)", mvaPht: "MVA (PHT)",
    clear: "Összes törlése", results: "Számított eredmények",
    copyReport: "Másolás vágólapra", copied: "Vágólapra másolva",
    copyEmpty: "Nincs még mit másolni", copyFailed: "Sikertelen másolás — másold ki kézzel",
    wikiTitle: "Echo Wiki", wikiEmpty: "Még nincsenek témák — nézz vissza hamarosan.",
  },
};

// ---- based on calculatorUtils.js (parseNumber diverges intentionally) ----
// No number in this app runs into the thousands, so a lone "." or ","
// is unambiguously the decimal point either way — accept both regardless
// of the active language instead of flagging one as wrong. `lang` is kept
// in the signature for call-site compatibility but no longer used here.
// JSDoc types below are checked via `tsc --noEmit -p jsconfig.json` (see
// CLAUDE.md) — no build step, this only catches mistakes while editing.
// Raw field values come straight from `state` as typed-in strings (or "" if
// empty); every calculate* function returns a number or null (incomplete/
// invalid input), never NaN — callers rely on that to chain results safely.
/**
 * @param {string} value
 * @param {string} lang
 * @returns {number}
 */
const parseNumber = (value, lang) => {
  if (!value) return NaN;
  return parseFloat(String(value).replace(",", "."));
};
/**
 * @param {string} weight
 * @param {string} height
 * @param {boolean} manualMode
 * @param {string} manualValue
 * @param {string} lang
 * @returns {number | null}
 */
const calculateBSA = (weight, height, manualMode, manualValue, lang) => {
  if (manualMode) {
    const m = parseNumber(manualValue, lang);
    return !isNaN(m) && m > 0 ? m : null;
  }
  const w = parseNumber(weight, lang), h = parseNumber(height, lang);
  if (weight && height && !isNaN(w) && !isNaN(h) && w > 0 && h > 0) return Math.sqrt((h * w) / 3600);
  return null;
};
/**
 * @param {string} pisaRadius
 * @param {string} aliasing
 * @param {string} vmax
 * @param {string} lang
 * @returns {number | null}
 */
const calculateEro = (pisaRadius, aliasing, vmax, lang) => {
  const r = parseNumber(pisaRadius, lang), a = parseNumber(aliasing, lang), v = parseNumber(vmax, lang);
  if (pisaRadius && aliasing && vmax && !isNaN(r) && !isNaN(a) && !isNaN(v) && r > 0 && a > 0 && v > 0) {
    return (2 * Math.PI * Math.pow(r / 10, 2) * a) / (v * 100);
  }
  return null;
};
/**
 * @param {number | null} ero
 * @param {string} vti
 * @param {string} lang
 * @returns {number | null}
 */
const calculateRegVol = (ero, vti, lang) => {
  const v = parseNumber(vti, lang);
  if (ero !== null && vti && !isNaN(v) && v > 0) return ero * v;
  return null;
};
/**
 * @param {string} lvotDiam
 * @param {string} lvotVti
 * @param {string} lang
 * @returns {number | null}
 */
const calculateSV = (lvotDiam, lvotVti, lang) => {
  const d = parseNumber(lvotDiam, lang), v = parseNumber(lvotVti, lang);
  if (lvotDiam && lvotVti && !isNaN(d) && !isNaN(v) && d > 0 && v > 0) {
    return (Math.PI * Math.pow(d / 2, 2) * v) / 100;
  }
  return null;
};
/**
 * @param {number | null} regVol
 * @param {number | null} sv
 * @returns {number | null}
 */
const calculateRegFraction = (regVol, sv) => (regVol !== null && sv !== null && sv > 0) ? (regVol / (sv + regVol)) * 100 : null;
/**
 * @param {number | null} arRegVol
 * @param {number | null} sv
 * @returns {number | null}
 */
const calculateARRegFraction = (arRegVol, sv) => (arRegVol !== null && sv !== null && sv > 0) ? (arRegVol / sv) * 100 : null;
/**
 * @param {number | null} sv
 * @param {number | null} bsa
 * @returns {number | null}
 */
const calculateSVI = (sv, bsa) => (sv !== null && bsa !== null && bsa > 0) ? sv / bsa : null;
/**
 * @param {number | null} sv
 * @param {string} heartRate
 * @param {string} lang
 * @returns {number | null}
 */
const calculateCardiacOutput = (sv, heartRate, lang) => {
  const hr = parseNumber(heartRate, lang);
  if (sv !== null && heartRate && !isNaN(hr) && hr > 0) return (sv / 1000) * hr;
  return null;
};
/**
 * @param {number | null} co
 * @param {number | null} bsa
 * @returns {number | null}
 */
const calculateCardiacIndex = (co, bsa) => (co !== null && bsa !== null && bsa > 0) ? co / bsa : null;
/**
 * @param {string} lvotDiam
 * @param {string} lvotVti
 * @param {string} aorticVti
 * @param {string} lang
 * @returns {number | null}
 */
const calculateAVA = (lvotDiam, lvotVti, aorticVti, lang) => {
  const d = parseNumber(lvotDiam, lang), lv = parseNumber(lvotVti, lang), av = parseNumber(aorticVti, lang);
  if (lvotDiam && lvotVti && aorticVti && !isNaN(d) && !isNaN(lv) && !isNaN(av) && d > 0 && lv > 0 && av > 0) {
    return (Math.pow(d / 2, 2) * Math.PI * lv) / av / 100;
  }
  return null;
};
/**
 * @param {number | null} ava
 * @param {number | null} bsa
 * @returns {number | null}
 */
const calculateAVAI = (ava, bsa) => (ava !== null && bsa !== null && bsa > 0) ? ava / bsa : null;
/**
 * @param {string} lvotVti
 * @param {string} aorticVti
 * @param {string} lang
 * @returns {number | null}
 */
const calculateDVIVti = (lvotVti, aorticVti, lang) => {
  const lv = parseNumber(lvotVti, lang), av = parseNumber(aorticVti, lang);
  if (lvotVti && aorticVti && !isNaN(lv) && !isNaN(av) && av > 0) return lv / av;
  return null;
};
/**
 * @param {string} lvotVmax
 * @param {string} aorticVmax
 * @param {string} lang
 * @returns {number | null}
 */
const calculateDVIVmax = (lvotVmax, aorticVmax, lang) => {
  const lv = parseNumber(lvotVmax, lang), av = parseNumber(aorticVmax, lang);
  if (lvotVmax && aorticVmax && !isNaN(lv) && !isNaN(av) && av > 0) return lv / av;
  return null;
};
// MVA (PHT): Hatle's PHT-based estimate, MVA = 220 / PHT.
/**
 * @param {string} mvPht
 * @param {string} lang
 * @returns {number | null}
 */
const calculateMVAPht = (mvPht, lang) => {
  const p = parseNumber(mvPht, lang);
  if (mvPht && !isNaN(p) && p > 0) return 220 / p;
  return null;
};
// Prosthetic AV: AT/ET ratio (acceleration time / ejection time), used
// alongside EOA/EOAi (the same AVA/AVAi formula, relabeled — see gradeFns
// and computeResults) when the "Prosthetic valve" toggle is on.
/**
 * @param {string} at
 * @param {string} et
 * @param {string} lang
 * @returns {number | null}
 */
const calculateAtEt = (at, et, lang) => {
  const a = parseNumber(at, lang), e = parseNumber(et, lang);
  if (at && et && !isNaN(a) && !isNaN(e) && a > 0 && e > 0) return a / e;
  return null;
};

// ---- severity grading ----
// Grading bands transcribed from Echo checklist.xlsx.
// Ambiguous range boundaries are resolved toward the higher-severity side.
const gradeLabels = {
  en: { mild: "Mild", moderate: "Moderate", severe: "Severe", massive: "Massive", torrential: "Torrential",
    normal: "Normal", reduced: "Reduced", mildlyReduced: "Mildly reduced", elevated: "Elevated" },
  hu: { mild: "Enyhe", moderate: "Közepes", severe: "Súlyos", massive: "Masszív", torrential: "Torrentialis",
    normal: "Normális", reduced: "Csökkent", mildlyReduced: "Enyhén csökkent", elevated: "Emelkedett" },
};
const gradeFns = {
  mrEro: v => v < 0.2 ? "mild" : v <= 0.4 ? "moderate" : "severe",
  mrRegVol: v => v < 30 ? "mild" : v < 60 ? "moderate" : "severe",
  mrRegFraction: v => v < 30 ? "mild" : v < 50 ? "moderate" : "severe",
  arEro: v => v < 0.1 ? "mild" : v < 0.3 ? "moderate" : "severe",
  arRegVol: v => v < 30 ? "mild" : v < 60 ? "moderate" : "severe",
  arRegFraction: v => v < 30 ? "mild" : v < 50 ? "moderate" : "severe",
  trEro: v => v < 0.2 ? "mild" : v < 0.4 ? "moderate" : v < 0.6 ? "severe" : v < 0.8 ? "massive" : "torrential",
  trRegVol: v => v < 30 ? "mild" : v < 45 ? "moderate" : v < 60 ? "severe" : v < 75 ? "massive" : "torrential",
  ava: v => v >= 1.5 ? "mild" : v > 1.0 ? "moderate" : "severe",
  avai: v => v > 0.85 ? "mild" : v > 0.6 ? "moderate" : "severe",
  // Same cutoffs as AVA (>1.5 mild, 1.0–1.5 moderate, <1.0 severe) —
  // per the mitral stenosis severity table, not a reuse of the AS bands.
  mvaVti: v => v >= 1.5 ? "mild" : v > 1.0 ? "moderate" : "severe",
  mvaPht: v => v >= 1.5 ? "mild" : v > 1.0 ? "moderate" : "severe",
  dviVti: v => v > 0.5 ? "mild" : v >= 0.25 ? "moderate" : "severe",
  dviVmax: v => v > 0.5 ? "mild" : v >= 0.25 ? "moderate" : "severe",
  // Prosthetic AV, per user direction: DVI uses a different two-band
  // scheme than the native-valve bands above — normal at/above 0.3,
  // reduced below it (0.29 and down). Same cutoff for both the VTI and
  // Vmax variant. Selected instead of dviVti/dviVmax via the rows array's
  // gradeKey (4th tuple element) in computeResults when
  // state.prostheticAV is on — see the comment there.
  dviProsthetic: v => v < 0.3 ? "reduced" : "normal",
  // Prosthetic AV, per user direction: AT/ET < 0.37 is abnormal (reduced),
  // >= 0.37 is normal. No "eoa"/"eoai" entry here on purpose — EOA/EOAi
  // (prosthetic AV) reuses the AVA/AVAi *values* but must not be graded
  // with the native-valve ava/avai cutoffs above; real EOA/EOAi cutoffs
  // are still to be defined, so they render with no severity badge for now.
  avAtEt: v => v < 0.37 ? "reduced" : "normal",
  // Only a single cutoff is defined for this metric (per user direction):
  // below 1 reads as mild, at/above 1 reads as severe, moderate is unused.
  mvVtiLvotVti: v => v < 1 ? "mild" : "severe",
  // Cardiac output: normal 4–8 l/min (per user direction).
  cardiacOutput: v => v < 4 ? "reduced" : v <= 8 ? "normal" : "elevated",
  // Cardiac index: normal 2.5–4.2 l/min/m², <2.2 reduced, 2.2–2.5 mildly reduced (per user direction).
  cardiacIndex: v => v < 2.2 ? "reduced" : v < 2.5 ? "mildlyReduced" : v <= 4.2 ? "normal" : "elevated",
};

// ---- severity reference content ----
// Layout-only metadata for the wide TR table (identical in both languages).
const trLayout = {
  wide: true,
  // Parameter + Mild/Moderate/Severe fit on screen without scrolling;
  // Massive/Torrential sit past that width and are reached by scrolling.
  colWidths: ["104px", "80px", "88px", "80px", "84px", "84px"],
};

const severityInfo = {
  en: {
    mr: {
      title: "Mitral Regurgitation",
      headers: ["Parameter", "Mild", "Moderate", "Severe"],
      rows: [
        ["Vena contracta (mm)", "<3.0", "3.0–6.9", "≥7.0"],
        ['<button type="button" class="wiki-inline-link" data-wiki-topic="pisa-method">PISA</button> radius (mm)', "<4", "4–10", ">10"],
        ["EROA (cm²)", "<0.2", "0.2–0.4", ">0.4"],
        ["Reg. vol. (ml)", "<30", "30–59", "≥60"],
        ["Reg. fraction (%)", "<30", "30–49", "≥50"],
        ["3D VCA (cm²)", "—", "—", "≥0.5"],
        ["MV VTI / LVOT VTI", "<1", "—", ">1.4"],
      ],
      notes: [
        "Reg. volume cutoff is lower (~40 ml may already be severe) when LV EF is reduced.",
        "Look for tenting, tethering, coaptation defect, or prolapse/flail leaflet.",
        "Pulmonary vein systolic reverse flow suggests severe regurgitation.",
        "If PISA isn't available, “Simpson (3D) SV − LVOT forward SV” can estimate reg. volume, but is often inaccurate — avoid when possible.",
      ],
    },
    ar: {
      title: "Aortic Regurgitation",
      headers: ["Parameter", "Mild", "Moderate", "Severe"],
      rows: [
        ["Vena contracta (mm)", "<3", "3–6", ">6"],
        ["EROA (cm²)", "<0.1", "0.1–0.29", "≥0.3"],
        ["Reg. vol. (ml)", "<30", "30–59", "≥60"],
        ["Reg. fraction (%)", "<30", "30–49", "≥50"],
        ["Jet / LVOT diameter", "<0.25", "0.25–0.64", ">0.64"],
        ["PHT (ms)", ">500", "500–200", "<200"],
        ["Descending aorta flow", "—", "—", "Holodiastolic reverse flow"],
      ],
      notes: [
        "Jet/LVOT diameter is measured at PLAX, at the LVOT/annulus junction — use caution with eccentric jets.",
        "PHT is less sensitive to severity in chronic AR.",
        "If reverse diastolic flow is present in the descending aorta: at least moderate, and definitely severe if end-diastolic velocity ≥ 20 cm/s or VTI ≥ 15 cm.",
        "In chronic severe AR, serial ESV / end-systolic diameter and strain are important to follow.",
      ],
    },
    tr: {
      title: "Tricuspid Regurgitation",
      ...trLayout,
      headers: ["Parameter", "Mild", "Moderate", "Severe", "Massive", "Torrential"],
      rows: [
        ["Vena contracta avg (mm)", "<3", "3–6.9", "7–13.9", "14–20", ">20"],
        ['<button type="button" class="wiki-inline-link" data-wiki-topic="pisa-method">PISA</button> radius (mm)', "<5", "6–9", ">9", "", ""],
        ["EROA (cm²)", "<0.2", "0.2–0.39", "0.4–0.59", "0.6–0.79", "≥0.8"],
        ["Reg. vol. (ml)", "<30", "30–44", "45–59", "60–74", "≥75"],
        ["Hepatic vein flow", "S dominant (normal)", "S “blunting”", { text: "Systolic reverse flow", span: 3 }],
        ["Color jet", "Small, central", "Moderate", { text: "Large, central/eccentric", span: 3 }],
        ["CW density", "Faint, incomplete", "Dense", "Dense", "Dense", "Dense"],
        ["CW shape", "Parabolic", "Parabolic", "Triangular", "", ""],
        ["3D VCA (cm²)", "<0.43", "0.43–0.67", "0.67–0.94", "0.95–1.14", ">1.14"],
        ["Jet area (cm²)", "<5", "5–10", ">10", "", ""],
      ],
      notes: [
        "Vena contracta should be averaged across several views.",
        "CW shape/density are not always reliable; if Vmax < 2 m/s, likely massive.",
      ],
    },
    as: {
      title: "Aortic Stenosis",
      headers: ["Parameter", "Mild", "Moderate", "Severe"],
      rows: [
        ["Vmax (m/s)", "2.6–2.9", "3–3.9", "≥4"],
        ["Mean gradient (mmHg)", "<20", "20–40", ">40"],
        ["AVA (cm²)", "≥1.5", "1.5–1.0", "≤1.0"],
        ["AVAi (cm²/m²)", ">0.85", "0.85–0.6", "≤0.6"],
        ["DVI", ">0.5", "0.5–0.25", "<0.25"],
        ["Acceleration time (ms)", "—", "—", ">100"],
        ["CW contour", "Triangle", "—", "Parabola"],
      ],
      notes: [
        "If Vmax ≤ 2.5 m/s, consider a sclerotic (non-stenotic) aortic valve instead.",
        "Blood pressure outside the normal range affects gradients (lower gradient at higher BP) — always document BP alongside measurements.",
        "Combined lesions can raise the gradient and overestimate severity — affects AVA and DVI too.",
        "Rule of thumb for small discrepancies: 1 cm² of AVA ≈ 35 mmHg of mean gradient. AVA is more sensitive, gradient is more specific.",
        "Always check GLS (and LA strain) — roughly 10% of severe AS is amyloidosis.",
        "AVAi is most useful at body-size extremes (e.g. very tall/short); it underestimates in obese patients — avoid using it there.",
        "AT/ET is a risk marker. In high-gradient severe AS with preserved EF, AT/ET >0.35 predicted higher mortality rather than defining the severity. The values is lowered by high systolic blood pressure and by significant AR, and raised by low flow and reduced LV function.",
      ],
    },
    ms: {
      title: "Mitral Stenosis",
      headers: ["Parameter", "Mild", "Moderate", "Severe"],
      rows: [
        ["Mean gradient (mmHg)", "<5", "5–10", ">10"],
        ["PHT (ms)", "71–139", "140–219", "≥220"],
        ["MVA (cm²)", ">1.5", "1.5–1.0", "<1.0"],
      ],
      notes: [
        "MVA <1.5 cm² is already considered clinically significant, even though this table grades it as mild.",
      ],
    },
  },
  hu: {
    mr: {
      title: "Mitrális regurgitáció",
      headers: ["Paraméter", "Enyhe", "Közepes", "Súlyos"],
      rows: [
        ["Vena contracta (mm)", "<3,0", "3,0–6,9", "≥7,0"],
        ['<button type="button" class="wiki-inline-link" data-wiki-topic="pisa-method">PISA</button> radius (mm)', "<4", "4–10", ">10"],
        ["EROA (cm²)", "<0,2", "0,2–0,4", ">0,4"],
        ["Reg. volumen (ml)", "<30", "30–59", "≥60"],
        ["Reg. frakció (%)", "<30", "30–49", "≥50"],
        ["3D VCA (cm²)", "—", "—", "≥0,5"],
        ["MV VTI / LVOT VTI", "<1", "—", ">1,4"],
      ],
      notes: [
        "A reg. volumen határértéke alacsonyabb (már ~40 ml is súlyos lehet), ha a bal kamrai EF csökkent.",
        "Figyeljünk tentingre, tetheringre, coaptatiós defektusra, illetve prolapsusra/flail vitorlára.",
        "A pulmonalis vénás szisztolés reverz flow súlyos regurgitációra utal.",
        "Ha nincs PISA, a „Simpson (3D) SV − LVOT forward SV” becslést adhat a reg. volumenre, de gyakran pontatlan — kerüljük, ha lehet.",
      ],
    },
    ar: {
      title: "Aorta regurgitáció",
      headers: ["Paraméter", "Enyhe", "Közepes", "Súlyos"],
      rows: [
        ["Vena contracta (mm)", "<3", "3–6", ">6"],
        ["EROA (cm²)", "<0,1", "0,1–0,29", "≥0,3"],
        ["Reg. volumen (ml)", "<30", "30–59", "≥60"],
        ["Reg. frakció (%)", "<30", "30–49", "≥50"],
        ["Jet / LVOT átmérő", "<0,25", "0,25–0,64", ">0,64"],
        ["PHT (ms)", ">500", "500–200", "<200"],
        ["Descendens aorta flow", "—", "—", "Holodiasztolés reverz flow"],
      ],
      notes: [
        "A jet/LVOT átmérőt PLAX nézetben, az LVOT/anulus találkozásánál mérjük — excentrikus jetnél legyünk óvatosak.",
        "A PHT krónikus AR-ban kevésbé érzékeny a súlyosságra.",
        "Ha reverz diasztolés flow van jelen az aorta descendensben: legalább közepes, és biztosan súlyos, ha a végdiasztolés sebesség ≥20 cm/s vagy a VTI ≥15 cm.",
        "Krónikus, súlyos AR-ban fontos a soros ESV / végszisztolés átmérő és a strain követése.",
      ],
    },
    tr: {
      title: "Tricuspidalis regurgitáció",
      ...trLayout,
      headers: ["Paraméter", "Enyhe", "Közepes", "Súlyos", "Masszív", "Torrentialis"],
      rows: [
        ["Vena contracta átlag (mm)", "<3", "3–6,9", "7–13,9", "14–20", ">20"],
        ['<button type="button" class="wiki-inline-link" data-wiki-topic="pisa-method">PISA</button> radius (mm)', "<5", "6–9", ">9", "", ""],
        ["EROA (cm²)", "<0,2", "0,2–0,39", "0,4–0,59", "0,6–0,79", "≥0,8"],
        ["Reg. volumen (ml)", "<30", "30–44", "45–59", "60–74", "≥75"],
        ["V. hepatica áramlás", "S domináns (norm.)", "S „blunting”", { text: "Szisztolés reverz flow", span: 3 }],
        ["Color jet", "Kicsi, centrális", "Közepes", { text: "Nagy, centrális/excentrikus", span: 3 }],
        ["CW denzitás", "Halvány, hiányos", "Denz", "Denz", "Denz", "Denz"],
        ["CW alakja", "Parabolikus", "Parabolikus", "Háromszög", "", ""],
        ["3D VCA (cm²)", "<0,43", "0,43–0,67", "0,67–0,94", "0,95–1,14", ">1,14"],
        ["Jet terület (cm²)", "<5", "5–10", ">10", "", ""],
      ],
      notes: [
        "A vena contractát több nézetből érdemes átlagolni.",
        "A CW alakja/denzitása nem mindig megbízható; ha a Vmax < 2 m/s, valószínűleg masszív.",
      ],
    },
    as: {
      title: "Aorta stenosis",
      headers: ["Paraméter", "Enyhe", "Közepes", "Súlyos"],
      rows: [
        ["Vmax (m/s)", "2,6–2,9", "3–3,9", "≥4"],
        ["Átlag grádiens (Hgmm)", "<20", "20–40", ">40"],
        ["AVA (cm²)", "≥1,5", "1,5–1,0", "≤1,0"],
        ["AVAi (cm²/m²)", ">0,85", "0,85–0,6", "≤0,6"],
        ["DVI", ">0,5", "0,5–0,25", "<0,25"],
        ["Akcelerációs idő (ms)", "—", "—", ">100"],
        ["CW kontúr", "Háromszög", "—", "Parabola"],
      ],
      notes: [
        "Ha a Vmax ≤ 2,5 m/s, inkább szklerotikus (nem stenotikus) aortabillentyűre gondoljunk.",
        "A normál tartományon kívüli vérnyomás befolyásolja a grádienst (magasabb vérnyomásnál alacsonyabb a grádiens) — mindig dokumentáljuk a vérnyomást is.",
        "Kombinált vitium megemelheti a grádienst és túlbecsülheti a súlyosságot — ez érinti az AVA-t és a DVI-t is.",
        "Ökölszabály kis eltérésekre: 1 cm² AVA ≈ 35 Hgmm átlag grádiens. Az AVA érzékenyebb, a grádiens specifikusabb.",
        "Mindig nézzünk GLS-t (és LA straint) — a súlyos AS kb. 10%-a amyloidosis.",
        "Az AVAi testméret-szélsőségeknél (pl. nagyon magas/alacsony testalkatnál) a leghasznosabb; obes betegeknél alábecsül — ott kerüljük a használatát.",
        "Az AT/ET risk prediktor. High grade súlyos AS-ben megtartott EF mellett a 0,35 feletti AT/ET magasabb mortalitást jelzett előre nem a súlyosságot definiálja. Csökkenti a magas szisztolés vérnyomás és a jelentős AR, növeli az alacsony flow és a csökkent bal kamrai funkció.",
      ],
    },
    ms: {
      title: "Mitrális stenosis",
      headers: ["Paraméter", "Enyhe", "Közepes", "Súlyos"],
      rows: [
        ["Átlag grádiens (Hgmm)", "<5", "5–10", ">10"],
        ["PHT (ms)", "71–139", "140–219", "≥220"],
        ["MVA (cm²)", ">1,5", "1,5–1,0", "<1,0"],
      ],
      notes: [
        "Az 1,5 cm² alatti MVA már klinikailag szignifikánsnak számít, annak ellenére, hogy ez a táblázat enyhének minősíti.",
      ],
    },
  },
};

const uiStrings = {
  en: {
    notes: "Notes", close: "Close", back: "Back",
    sources: "Sources", reviewed: "Last reviewed",
    disclaimer: "Reference summary — not a substitute for clinical judgement or current guidelines.",
    atMachine: "At the machine", card: "Card",
    searchPlaceholder: "Search topics", noResults: "No matching topics.",
    wikiBodyLoading: "Loading…", wikiBodyLoadFailed: "Couldn't load this topic — check your connection and try again.",
    selectValve: "Select valve", selectSize: "Select size",
    valveNormalValues: "Normal values for this valve", valvePeakGradient: "Peak gradient",
    valveMeanGradient: "Mean gradient", valveEoa: "EOA", valveDvi: "DVI",
  },
  hu: {
    notes: "Megjegyzések", close: "Bezárás", back: "Vissza",
    sources: "Források", reviewed: "Utoljára ellenőrizve",
    disclaimer: "Referencia-összefoglaló — nem helyettesíti a klinikai megítélést vagy az aktuális irányelveket.",
    atMachine: "A gép mellett", card: "Kártya",
    searchPlaceholder: "Témák keresése", noResults: "Nincs találat.",
    wikiBodyLoading: "Betöltés…", wikiBodyLoadFailed: "Nem sikerült betölteni ezt a témát — ellenőrizd a kapcsolatot, és próbáld újra.",
    selectValve: "Billentyű kiválasztása", selectSize: "Méret kiválasztása",
    valveNormalValues: "Normál értékek erre a billentyűre", valvePeakGradient: "Csúcs gradiens",
    valveMeanGradient: "Átlag gradiens", valveEoa: "EOA", valveDvi: "DVI",
  },
};
const infoAriaLabels = {
  en: {
    mr: "Mitral regurgitation severity reference",
    ar: "Aortic regurgitation severity reference",
    tr: "Tricuspid regurgitation severity reference",
    as: "Aortic stenosis severity reference",
    ms: "Mitral stenosis severity reference",
  },
  hu: {
    mr: "Mitrális regurgitáció súlyossági referencia",
    ar: "Aorta regurgitáció súlyossági referencia",
    tr: "Tricuspidalis regurgitáció súlyossági referencia",
    as: "Aorta stenosis súlyossági referencia",
    ms: "Mitrális stenosis súlyossági referencia",
  },
};
let currentInfoTopic = null;

// Builds the severity-table markup. Shared by the info overlay
// (severityInfo) and wiki bodies, so a table written in a wiki topic
// looks identical to the ones behind the calculator's ⓘ buttons —
// .info-table-wrap / .info-table are global CSS, not scoped to the info
// overlay, so this is safe to reuse anywhere in .wiki-body too.
// spec: { headers[], rows[], colWidths?, wide? }
// A row cell may be a plain string, or { text, span } for a colspan.
function buildSeverityTable(spec) {
  const colClasses = ["", "col-mild", "col-moderate", "col-severe", "col-massive", "col-torrential"];
  const theadCells = spec.headers.map((h, i) => {
    const cls = colClasses[i] || "";
    return `<th${cls ? ` class="${cls}"` : ""}>${h}</th>`;
  }).join("");
  const bodyRows = spec.rows.map(r => {
    const [label, ...cells] = r;
    const tds = cells.map(c => {
      if (c && typeof c === "object") return `<td colspan="${c.span}">${c.text}</td>`;
      return `<td>${c}</td>`;
    }).join("");
    return `<tr><th scope="row">${label}</th>${tds}</tr>`;
  }).join("");
  const colgroup = spec.colWidths
    ? `<colgroup>${spec.colWidths.map(w => `<col style="width:${w}">`).join("")}</colgroup>`
    : "";
  // A fixed-layout table with width:auto still expands columns to fit
  // unbreakable content in some browsers, ignoring the colgroup — so the
  // table width has to be pinned explicitly to the sum of the columns.
  const tableWidthPx = spec.colWidths
    ? spec.colWidths.reduce((sum, w) => sum + parseFloat(w), 0)
    : null;
  return `
    <div class="info-table-wrap">
      <table class="info-table${spec.wide ? " wide" : ""}"${tableWidthPx ? ` style="width:${tableWidthPx}px"` : ""}>
        ${colgroup}
        <thead><tr>${theadCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
  `;
}

function renderInfo(topicKey) {
  const info = severityInfo[state.language][topicKey];
  if (!info) return;
  $("#infoTitle").textContent = info.title;
  const notesHtml = info.notes && info.notes.length
    ? `<div class="info-notes"><h3>${uiStrings[state.language].notes}</h3><ul>${info.notes.map(n => `<li>${n}</li>`).join("")}</ul></div>`
    : "";
  $("#infoContent").innerHTML = buildSeverityTable(info) + notesHtml;
}

// Shared by both full-screen overlays (info + wiki), which are mutually
// exclusive in practice — the header controls needed to open one are
// covered by the other while it's open, so a single focus-return slot
// and body scroll lock is safe to share between them.
let overlayReturnFocus = null;
function setupOverlay(focusTarget) {
  overlayReturnFocus = document.activeElement;
  document.body.style.overflow = "hidden";
  if (focusTarget) focusTarget.focus();
}
function teardownOverlay() {
  document.body.style.overflow = "";
  if (overlayReturnFocus && document.contains(overlayReturnFocus)) overlayReturnFocus.focus();
  overlayReturnFocus = null;
}

function openInfo(topicKey) {
  currentInfoTopic = topicKey;
  renderInfo(topicKey);
  $("#infoOverlay").hidden = false;
  setupOverlay($("#infoClose"));
}
function closeInfo() {
  currentInfoTopic = null;
  $("#infoOverlay").hidden = true;
  teardownOverlay();
}
function refreshInfoLanguage() {
  $$(".info-btn[data-info]").forEach(btn => {
    const label = infoAriaLabels[state.language][btn.dataset.info];
    if (label) btn.setAttribute("aria-label", label);
  });
  $("#infoClose").setAttribute("aria-label", uiStrings[state.language].close);
  if (currentInfoTopic) renderInfo(currentInfoTopic);
}

// ---- Echo Wiki data (wikiCategories, wikiTopics, figure builders) ----
// Moved to wiki-data.js, loaded before this script (see index.html). Add
// new topics there.

// A topic's body (prose + figures — the heavy part) loads on demand from
// wiki-topics/<id>.js rather than up front with everything else, so the
// app doesn't have to download and parse every topic's full HTML on every
// launch as the wiki grows. That file is still listed in sw.js
// PRECACHE_URLS, so it's already on the phone (downloaded during
// install/update, same as any other app file) by the time this runs —
// this only defers *parsing it into the page*, not the download, so it
// works the same offline as everything else. Each script registers itself
// into window.wikiTopicBodies[id] = { en, hu } on load; cached here after
// the first load so re-opening a topic doesn't re-inject the script tag.
const wikiTopicBodyPromises = {};
function loadWikiTopicBody(id) {
  if (window.wikiTopicBodies && window.wikiTopicBodies[id]) {
    return Promise.resolve(window.wikiTopicBodies[id]);
  }
  if (wikiTopicBodyPromises[id]) return wikiTopicBodyPromises[id];
  wikiTopicBodyPromises[id] = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `./wiki-topics/${id}.js`;
    script.onload = () => {
      const body = window.wikiTopicBodies && window.wikiTopicBodies[id];
      if (body) { auditTopicBody(id, body); resolve(body); }
      else reject(new Error(`wiki-topics/${id}.js loaded but didn't register a body`));
    };
    script.onerror = () => reject(new Error(`Failed to load wiki-topics/${id}.js`));
    document.head.appendChild(script);
  });
  return wikiTopicBodyPromises[id];
}

// ---- Prosthetic aortic valve type/size picker ----
// Reference-only lookup (type + size -> expected normal Doppler values,
// per Zoghbi et al. 2024 — see prosthetic-data/aortic-valves.js for the
// full citation and data-entry notes) — never feeds into a calculation.
// Same lazy-load-on-first-need pattern as loadWikiTopicBody: the data
// isn't needed until the picker is opened or the size/reference already
// has a valve chosen, so it costs nothing for anyone not using prosthetic-
// AV mode. Still listed in sw.js PRECACHE_URLS, so it works offline too.
let prostheticAorticValvesPromise = null;
function loadProstheticAorticValves() {
  if (window.prostheticAorticValves) return Promise.resolve(window.prostheticAorticValves);
  if (prostheticAorticValvesPromise) return prostheticAorticValvesPromise;
  prostheticAorticValvesPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "./prosthetic-data/aortic-valves.js";
    script.onload = () => {
      if (window.prostheticAorticValves) resolve(window.prostheticAorticValves);
      else reject(new Error("prosthetic-data/aortic-valves.js loaded but didn't register data"));
    };
    script.onerror = () => reject(new Error("Failed to load prosthetic-data/aortic-valves.js"));
    document.head.appendChild(script);
  });
  return prostheticAorticValvesPromise;
}

let valveSearchQuery = "";
function currentCategoryValves() {
  return (window.prostheticAorticValves || []).filter(v => v.category === state.prostheticValveCategory);
}
function renderValvePickerList() {
  const query = valveSearchQuery.trim();
  const list = currentCategoryValves();
  const matches = query ? list.filter(v => foldWikiText(v.name).includes(foldWikiText(query))) : list;
  $("#valvePickerContent").innerHTML = matches.length
    ? `<div class="wiki-topic-list">${matches.map(v => `
        <button class="wiki-topic-item" type="button" data-valve="${v.name}">
          <span class="wiki-topic-title">${v.name}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>
        </button>`).join("")}</div>`
    : `<div class="wiki-empty">${uiStrings[state.language].noResults}</div>`;
  $$("[data-valve]", $("#valvePickerContent")).forEach(btn => {
    btn.addEventListener("click", () => selectProstheticValve(btn.dataset.valve));
  });
}
function openValvePicker() {
  valveSearchQuery = "";
  $("#valveSearchInput").value = "";
  $("#valveOverlay").hidden = false;
  setupOverlay($("#valveSearchInput"));
  loadProstheticAorticValves().then(renderValvePickerList).catch(err => {
    console.error(err);
    $("#valvePickerContent").innerHTML = `<div class="wiki-empty">${uiStrings[state.language].wikiBodyLoadFailed}</div>`;
  });
}
function closeValvePicker() {
  $("#valveOverlay").hidden = true;
  teardownOverlay();
}
function selectProstheticValve(name) {
  state.prostheticValveName = name;
  state.prostheticValveSize = "";
  closeValvePicker();
  updateValveTypeButton();
  updateValveSizeOptions();
  renderValveReference();
}
function updateValveTypeButton() {
  const t = uiStrings[state.language];
  const btn = $("#valveTypeBtn");
  btn.innerHTML = state.prostheticValveName
    ? `<span>${state.prostheticValveName}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>`
    : `<span class="placeholder">${t.selectValve}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>`;
}
function updateValveSizeOptions() {
  const row = $("#valveSizeRow"), select = $("#valveSizeSelect");
  const valve = currentCategoryValves().find(v => v.name === state.prostheticValveName);
  if (!valve) { row.hidden = true; select.innerHTML = ""; return; }
  const t = uiStrings[state.language];
  select.innerHTML = `<option value="" disabled ${state.prostheticValveSize ? "" : "selected"}>${t.selectSize}</option>`
    + valve.sizes.map(s => `<option value="${s.size}" ${s.size === state.prostheticValveSize ? "selected" : ""}>${s.size} mm</option>`).join("");
  row.hidden = false;
}
function renderValveReference() {
  const el = $("#valveReference");
  const valve = currentCategoryValves().find(v => v.name === state.prostheticValveName);
  const sizeEntry = valve && valve.sizes.find(s => s.size === state.prostheticValveSize);
  if (!sizeEntry) { el.hidden = true; el.innerHTML = ""; return; }
  const t = uiStrings[state.language];
  const rows = [];
  if (sizeEntry.peak) rows.push(`<li><strong>${t.valvePeakGradient}:</strong> ${sizeEntry.peak} mmHg</li>`);
  if (sizeEntry.mean) rows.push(`<li><strong>${t.valveMeanGradient}:</strong> ${sizeEntry.mean} mmHg</li>`);
  if (sizeEntry.eoa) rows.push(`<li><strong>${t.valveEoa}:</strong> ${sizeEntry.eoa} cm²</li>`);
  if (sizeEntry.dvi) rows.push(`<li><strong>${t.valveDvi}:</strong> ${sizeEntry.dvi}</li>`);
  el.innerHTML = rows.length ? `<h3>${t.valveNormalValues}</h3><ul>${rows.join("")}</ul>` : "";
  el.hidden = rows.length === 0;
}
function refreshValvePickerLanguage() {
  updateValveTypeButton();
  updateValveSizeOptions();
  renderValveReference();
  if (!$("#valveOverlay").hidden) renderValvePickerList();
}

let currentWikiTopic = null;
let wikiSearchQuery = "";
// Accent- and case-insensitive fold, e.g. "billentyu" matches "Billentyűk".
// Hungarian ő/ű decompose under NFD to a base letter + U+030B (COMBINING
// DOUBLE ACUTE ACCENT), which falls inside the combining-marks range
// stripped below, so double acutes fold correctly along with plain
// accents.
const foldWikiText = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function wikiTopicMatchesQuery(topic, foldedQuery) {
  const lang = state.language;
  if (foldWikiText(topic.title[lang]).includes(foldedQuery)) return true;
  const kw = topic.keywords && topic.keywords[lang];
  if (kw && kw.some(k => foldWikiText(k).includes(foldedQuery))) return true;
  const summary = topic.summary && topic.summary[lang];
  if (summary && summary.some(line => foldWikiText(line).includes(foldedQuery))) return true;
  // Body text isn't loaded for every topic up front any more (see
  // loadWikiTopicBody) — a topic opened earlier this session still gets
  // its body searched (strip tags before folding so markup never
  // accidentally matches), but one never opened only matches on
  // title/keywords/summary above. Give a topic thorough `keywords` to
  // compensate for anything that only appears in its body prose.
  const loadedBody = window.wikiTopicBodies && window.wikiTopicBodies[topic.id];
  const body = loadedBody && loadedBody[lang];
  if (body && foldWikiText(body.replace(/<[^>]*>/g, " ")).includes(foldedQuery)) return true;
  return false;
}

function renderWikiTopicButton(topic) {
  const chip = topic.kind === "card"
    ? `<span class="wiki-kind-chip">${uiStrings[state.language].card}</span>`
    : "";
  return `
    <button class="wiki-topic-item" type="button" data-wiki-topic="${topic.id}">
      <span class="wiki-topic-title">${topic.title[state.language]}</span>
      ${chip}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>
    </button>
  `;
}

function renderWikiList() {
  $("#wikiTitle").textContent = translations[state.language].wikiTitle;
  $("#wikiSearchRow").hidden = false;
  if (wikiTopics.length === 0) {
    $("#wikiContent").innerHTML = `<div class="wiki-empty">${translations[state.language].wikiEmpty}</div>`;
    $("#wikiContent").scrollTop = 0;
    return;
  }
  const query = wikiSearchQuery.trim();
  if (query) {
    // A targeted lookup wants a flat list, not browsing — drop the
    // category headings while a query is active.
    const folded = foldWikiText(query);
    const matches = wikiTopics.filter(t => wikiTopicMatchesQuery(t, folded));
    $("#wikiContent").innerHTML = matches.length
      ? `<div class="wiki-topic-list">${matches.map(renderWikiTopicButton).join("")}</div>`
      : `<div class="wiki-empty">${uiStrings[state.language].noResults}</div>`;
    $$("[data-wiki-topic]", $("#wikiContent")).forEach(btn => {
      btn.addEventListener("click", () => openWikiTopic(btn.dataset.wikiTopic));
    });
    $("#wikiContent").scrollTop = 0;
    return;
  }
  // Group by category (in wikiCategories order); unknown/missing category
  // falls into "other". Skip the heading entirely when only one category
  // is actually populated — a single topic shouldn't sprout a lone header.
  const byCategory = new Map(wikiCategories.map(c => [c.id, []]));
  wikiTopics.forEach(topic => {
    const key = byCategory.has(topic.category) ? topic.category : "other";
    byCategory.get(key).push(topic);
  });
  const populated = wikiCategories.filter(c => byCategory.get(c.id).length > 0);
  const showHeadings = populated.length > 1;
  $("#wikiContent").innerHTML = `
    <div class="wiki-topic-list">
      ${populated.map(cat => `
        ${showHeadings ? `<h3 class="wiki-cat">${cat.label[state.language]}</h3>` : ""}
        ${byCategory.get(cat.id).map(renderWikiTopicButton).join("")}
      `).join("")}
    </div>
  `;
  $$("[data-wiki-topic]", $("#wikiContent")).forEach(btn => {
    btn.addEventListener("click", () => openWikiTopic(btn.dataset.wikiTopic));
  });
  $("#wikiContent").scrollTop = 0;
}

function renderWikiSummary(topic, lang) {
  if (!topic.summary || !topic.summary[lang] || !topic.summary[lang].length) return "";
  const items = topic.summary[lang].map(line => `<li>${line}</li>`).join("");
  return `
    <div class="wiki-summary">
      <h3>${uiStrings[lang].atMachine}</h3>
      <ul>${items}</ul>
    </div>`;
}

function renderWikiSources(topic, lang) {
  if (!topic.sources || !topic.sources.length) return "";
  const items = topic.sources.map(s => {
    const label = s.label[lang];
    return s.url
      ? `<li><a href="${s.url}" target="_blank" rel="noopener">${label}</a></li>`
      : `<li>${label}</li>`;
  }).join("");
  const reviewed = topic.reviewed
    ? `<p class="wiki-reviewed">${uiStrings[lang].reviewed}: ${topic.reviewed}</p>`
    : "";
  return `
    <div class="wiki-sources">
      <h3>${uiStrings[lang].sources}</h3>
      <ul>${items}</ul>
      ${reviewed}
      <p class="wiki-disclaimer">${uiStrings[lang].disclaimer}</p>
    </div>`;
}

// Cards have no body at all — nothing to load, renders synchronously like
// before. "deep" topics render summary/table/sources immediately (all
// eager metadata) with a loading placeholder standing in for the body,
// then swap the body in once wiki-topics/<id>.js loads. currentWikiTopic
// is re-checked after the async load resolves — if the user has since
// navigated to a different topic or closed the wiki, the now-stale result
// is dropped instead of overwriting whatever's on screen.
function renderWikiTopic(id) {
  const topic = wikiTopics.find(t => t.id === id);
  if (!topic) { renderWikiList(); return; }
  const lang = state.language;
  $("#wikiTitle").textContent = topic.title[lang];
  $("#wikiSearchRow").hidden = true;
  const summaryHtml = renderWikiSummary(topic, lang);
  const tableHtml = topic.table ? buildSeverityTable(topic.table) : "";
  const sourcesHtml = renderWikiSources(topic, lang);

  if (topic.kind === "card") {
    $("#wikiContent").innerHTML = `${summaryHtml}${tableHtml}${sourcesHtml}`;
    $("#wikiContent").scrollTop = 0;
    return;
  }

  const t = uiStrings[lang];
  $("#wikiContent").innerHTML = `${summaryHtml}${tableHtml}<div class="wiki-empty">${t.wikiBodyLoading}</div>${sourcesHtml}`;
  $("#wikiContent").scrollTop = 0;
  loadWikiTopicBody(id).then(body => {
    if (currentWikiTopic !== id) return;
    const bodyLang = state.language; // re-read: language may have changed while loading
    $("#wikiContent").innerHTML = `${renderWikiSummary(topic, bodyLang)}${tableHtml}<div class="wiki-body">${body[bodyLang]}</div>${renderWikiSources(topic, bodyLang)}`;
    $("#wikiContent").scrollTop = 0;
  }).catch(err => {
    console.error(err);
    if (currentWikiTopic !== id) return;
    $("#wikiContent").innerHTML = `${summaryHtml}${tableHtml}<div class="wiki-empty">${uiStrings[state.language].wikiBodyLoadFailed}</div>${sourcesHtml}`;
  });
}

// ---- wiki routing ----
// #wiki = topic list, #wiki/<id> = topic, no hash = closed. All view
// changes go through the URL so the phone/browser back gesture steps
// topic -> list -> closed instead of leaving the PWA entirely.
// history.state.wikiDepth tracks how many entries we've pushed, so the
// in-app back button can use a real history.back() when there's
// something of ours to go back to, and fall back to replaceState when
// the user arrived on a deep link (no "list" entry beneath them yet).
function parseWikiHash() {
  const h = location.hash;
  if (h === "#wiki") return { open: true, topic: null };
  const m = /^#wiki\/(.+)$/.exec(h);
  if (m && wikiTopics.some(t => t.id === decodeURIComponent(m[1]))) {
    return { open: true, topic: decodeURIComponent(m[1]) };
  }
  return { open: false, topic: null };
}

// Single source of truth: render whatever the current URL says.
function syncWikiToHash() {
  const route = parseWikiHash();
  const overlay = $("#wikiOverlay");
  if (!route.open) {
    if (!overlay.hidden) teardownOverlay();
    currentWikiTopic = null;
    overlay.hidden = true;
    clearWikiSearch();
    return;
  }
  const wasHidden = overlay.hidden;
  currentWikiTopic = route.topic;
  if (route.topic) renderWikiTopic(route.topic); else renderWikiList();
  overlay.hidden = false;
  if (wasHidden) setupOverlay($("#wikiBack"));
}

function goWiki(hash, { replace = false } = {}) {
  const depth = (history.state && history.state.wikiDepth) || 0;
  const url = hash || location.pathname + location.search;
  const nextState = { wikiDepth: replace ? depth : depth + 1 };
  if (replace) history.replaceState(nextState, "", url);
  else history.pushState(nextState, "", url);
  syncWikiToHash();
}

// Search is view state, not a route — it's reset (not persisted) across
// opens, closes, and language switches, and never pushes history.
function clearWikiSearch() {
  wikiSearchQuery = "";
  $("#wikiSearchInput").value = "";
}

function openWiki()        { clearWikiSearch(); goWiki("#wiki"); }
function openWikiTopic(id) { goWiki(`#wiki/${encodeURIComponent(id)}`); }
// The back button is always visible (list page included). From a topic
// it goes back to the list; from the list itself there's nowhere
// further "back" to go, so it just closes the wiki — same as the X.
function backToWikiList() {
  if ((history.state && history.state.wikiDepth) > 1) history.back();
  else goWiki("#wiki", { replace: true });
}
function closeWiki()      { goWiki(null); }
function handleWikiBack() { currentWikiTopic ? backToWikiList() : closeWiki(); }

window.addEventListener("popstate", syncWikiToHash);
function refreshWikiLanguage() {
  $("#wikiBack").setAttribute("aria-label", uiStrings[state.language].back);
  $("#wikiClose").setAttribute("aria-label", uiStrings[state.language].close);
  $("#wikiBtn").setAttribute("aria-label", translations[state.language].wikiTitle);
  $("#wikiSearchInput").placeholder = uiStrings[state.language].searchPlaceholder;
  clearWikiSearch();
  if (!$("#wikiOverlay").hidden) {
    if (currentWikiTopic) renderWikiTopic(currentWikiTopic);
    else renderWikiList();
  }
}

// ---- state ----
const state = { language: "hu", bsaManualMode: false };
// Snapshot of the last computeResults() output, kept for the "Copy to Report"
// feature so it doesn't need to recompute everything itself.
let lastResults = {};
const fieldNames = [
  "weight","height","bsaManual","heartRate",
  "mrPisaRadius","mrAliasingVelocity","mrVmax","mrVti","mvVtiPw","mvVtiCw","mvPht",
  "arPisaRadius","arAliasingVelocity","arVmax","arVti",
  "trPisaRadius","trAliasingVelocity","trVmax","trVti",
  "lvotDiam","lvotVti","lvotVmax","aorticVmax","meanGradient","aorticVti","avAt","avEt"
];
fieldNames.forEach(f => state[f] = "");
// Prosthetic aortic valve mode — separate from fieldNames since it's a
// boolean toggle, not a text input field.
state.prostheticAV = false;
// Valve type/size picker (reference lookup only — see renderValveReference;
// this never feeds into a calculation). prostheticValveCategory choosing
// "biological" also shows the transcatheter valves (see
// prosthetic-data/aortic-valves.js) alongside surgical bioprostheses.
state.prostheticValveCategory = "mechanical";
state.prostheticValveName = "";
state.prostheticValveSize = "";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ---- field templates ----
// Every calculator input row (label + input + unit) has the same shape, so
// it's defined once here instead of as hand-written markup per field. The
// markup only carries an empty container per group, tagged
// data-fields="fieldA,fieldB,..." — renderFieldSlots() fills each one in
// from this table. To add a field: add it here and to fieldNames above,
// then list it in the right container's data-fields attribute.
const fieldDefs = {
  weight: { label: "weight", unit: "kg" },
  height: { label: "height", unit: "cm" },
  bsaManual: { label: "bsaResult", unit: "m²" },
  heartRate: { label: "heartRate", unit: "bpm" },
  mrPisaRadius: { label: "pisaRadius", unit: "mm" },
  mrAliasingVelocity: { label: "aliasingVelocity", unit: "cm/s" },
  mrVmax: { label: "vmax", unit: "m/s" },
  mrVti: { label: "vti", unit: "cm" },
  mvVtiPw: { label: "vti", unit: "cm" },
  mvVtiCw: { label: "mvVtiCw", unit: "cm" },
  mvPht: { label: "mvPht", unit: "ms" },
  lvotDiam: { label: "lvotDiam", unit: "mm" },
  lvotVti: { label: "lvotVti", unit: "cm" },
  lvotVmax: { label: "lvotVmax", unit: "m/s" },
  aorticVmax: { label: "aorticVmax", unit: "m/s", optional: true },
  meanGradient: { label: "meanGradient", unit: "mmHg", optional: true },
  aorticVti: { label: "aorticVti", unit: "cm" },
  avAt: { label: "avAt", unit: "ms" },
  avEt: { label: "avEt", unit: "ms" },
  arPisaRadius: { label: "pisaRadius", unit: "mm" },
  arAliasingVelocity: { label: "aliasingVelocity", unit: "cm/s" },
  arVmax: { label: "vmax", unit: "m/s" },
  arVti: { label: "vti", unit: "cm" },
  trPisaRadius: { label: "pisaRadius", unit: "mm" },
  trAliasingVelocity: { label: "aliasingVelocity", unit: "cm/s" },
  trVmax: { label: "vmax", unit: "m/s" },
  trVti: { label: "vti", unit: "cm" },
};

function renderField(name) {
  const def = fieldDefs[name];
  const field = document.createElement("div");
  field.className = "field";

  const label = document.createElement("label");
  const labelText = document.createElement("span");
  labelText.dataset.t = def.label;
  label.appendChild(labelText);
  if (def.optional) {
    const optNote = document.createElement("span");
    optNote.className = "field-label-optional";
    optNote.dataset.t = "optional";
    label.appendChild(optNote);
  }

  const input = document.createElement("input");
  input.type = "text";
  input.setAttribute("inputmode", "decimal");
  input.placeholder = "0";
  input.className = "has-unit";
  input.dataset.field = name;
  const unit = document.createElement("span");
  unit.className = "field-unit";
  unit.textContent = def.unit;
  const wrap = document.createElement("div");
  wrap.className = "field-input-wrap";
  wrap.append(input, unit);

  const value = document.createElement("div");
  value.className = "field-value";
  value.appendChild(wrap);

  field.append(label, value);
  return field;
}

function renderFieldSlots() {
  $$("[data-fields]").forEach(slot => {
    slot.dataset.fields.split(",").forEach(name => slot.appendChild(renderField(name.trim())));
  });
}
renderFieldSlots();

// ---- theme (light is always the default for a first visit; a manual
// choice is remembered locally so it persists between launches) ----
let theme = "light";
try {
  if (localStorage.getItem("echo-theme") === "dark") theme = "dark";
} catch (e) { /* localStorage unavailable (e.g. private mode) — fall back to light */ }

function applyTheme() {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}
applyTheme();

function applyTranslations() {
  const t = translations[state.language];
  document.documentElement.lang = state.language;
  $$("[data-t]").forEach(el => {
    const key = el.getAttribute("data-t");
    if (t[key] !== undefined) el.textContent = t[key];
  });
  $("#bsaModeToggle").textContent = state.bsaManualMode ? t.bsaCalculate : t.bsaManual;
  $("#langToggle").textContent = state.language === "en" ? "HU" : "EN";
  document.title = t.title;
}

$$("input[data-field]").forEach(input => {
  input.addEventListener("input", () => {
    const key = input.dataset.field === "bsaManual" ? "bsaManualValue" : input.dataset.field;
    state[key] = input.value;
    computeResults();
  });
});

// In a .head-row layout the button's sibling is the info button, not the
// collapsible body — the body follows the whole .head-row instead.
function setCardExpanded(btn, expanded) {
  btn.setAttribute("aria-expanded", String(expanded));
  (btn.closest(".head-row") || btn).nextElementSibling.hidden = !expanded;
}
$$(".card-header").forEach(btn => {
  // Recorded so "Clear All" can restore each card/subgroup to how it
  // shipped (main cards collapsed, MR PISA/MV VTI(PW)/LVOT/AV expanded,
  // Mitral Stenosis/AR PISA collapsed) instead of leaving whatever the
  // user happened to have open.
  btn.dataset.defaultExpanded = btn.getAttribute("aria-expanded");
  btn.addEventListener("click", () => {
    setCardExpanded(btn, btn.getAttribute("aria-expanded") !== "true");
  });
});
// Standalone chevrons (moved outside the button in .head-row layouts so
// the info button can sit between the title and the chevron) still need
// to trigger the same collapse toggle when clicked directly.
$$(".head-row > svg.chevron").forEach(chevron => {
  chevron.addEventListener("click", () => {
    chevron.closest(".head-row").querySelector(".card-header").click();
  });
});

$("#bsaModeToggle").addEventListener("click", () => {
  state.bsaManualMode = !state.bsaManualMode;
  $("#bsaAutoFields").hidden = state.bsaManualMode;
  $("#bsaManualFields").hidden = !state.bsaManualMode;
  applyTranslations();
  computeResults();
});

$("#prostheticAvToggle").addEventListener("change", (e) => {
  state.prostheticAV = /** @type {HTMLInputElement} */ (e.target).checked;
  $("#avProstheticFields").hidden = !state.prostheticAV;
  $("#avProstheticValveBlock").hidden = !state.prostheticAV;
  if (state.prostheticAV) { updateValveTypeButton(); updateValveSizeOptions(); renderValveReference(); }
  computeResults();
});

$("#valveCategoryToggle").addEventListener("change", (e) => {
  state.prostheticValveCategory = /** @type {HTMLInputElement} */ (e.target).checked ? "biological" : "mechanical";
  // A previously selected valve almost certainly doesn't belong to the
  // newly chosen category (names aren't shared across mechanical/
  // biological), so clear it rather than show a stale, now-invalid pick.
  state.prostheticValveName = "";
  state.prostheticValveSize = "";
  updateValveTypeButton();
  updateValveSizeOptions();
  renderValveReference();
});
$("#valveTypeBtn").addEventListener("click", openValvePicker);
$("#valveOverlayClose").addEventListener("click", closeValvePicker);
$("#valveSearchInput").addEventListener("input", (e) => {
  valveSearchQuery = /** @type {HTMLInputElement} */ (e.target).value;
  renderValvePickerList();
});
$("#valveSizeSelect").addEventListener("change", (e) => {
  state.prostheticValveSize = /** @type {HTMLSelectElement} */ (e.target).value;
  renderValveReference();
});

$("#langToggle").addEventListener("click", () => {
  state.language = state.language === "en" ? "hu" : "en";
  applyTranslations();
  computeResults();
  refreshInfoLanguage();
  refreshWikiLanguage();
  refreshValvePickerLanguage();
});

$("#themeToggle").addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme();
  try { localStorage.setItem("echo-theme", theme); } catch (e) { /* ignore */ }
});

$$(".info-btn").forEach(btn => {
  btn.addEventListener("click", () => openInfo(btn.dataset.info));
});
$("#infoClose").addEventListener("click", closeInfo);

// Inline .wiki-inline-link buttons (see the CSS comment above their rule)
// — delegated on document since their markup is (re)rendered dynamically,
// both in the info overlay (severity tables) and inside wiki bodies
// (summary lines, table row labels). A data-wiki-topic link closes the
// info overlay first if that's where the click came from — the wiki and
// info overlays share a single focus-return slot (setupOverlay/
// teardownOverlay) and are meant to be mutually exclusive. A
// data-scroll-target link just scrolls the (already-open) wiki body.
document.addEventListener("click", (e) => {
  const link = /** @type {HTMLElement} */ (/** @type {Element} */ (e.target).closest(".wiki-inline-link"));
  if (!link) return;
  if (link.dataset.scrollTarget) {
    const target = document.getElementById(link.dataset.scrollTarget);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (!$("#infoOverlay").hidden) closeInfo();
  openWikiTopic(link.dataset.wikiTopic);
});

$("#wikiBtn").addEventListener("click", openWiki);
$("#wikiClose").addEventListener("click", closeWiki);
$("#wikiBack").addEventListener("click", handleWikiBack);
$("#wikiSearchInput").addEventListener("input", (e) => {
  wikiSearchQuery = e.target.value;
  renderWikiList();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!$("#infoOverlay").hidden) closeInfo();
  // Escape steps back (topic -> list -> closed), same as the on-screen
  // back button, instead of closing the wiki outright from a topic.
  if (!$("#wikiOverlay").hidden) handleWikiBack();
  if (!$("#valveOverlay").hidden) closeValvePicker();
});

$("#clearBtn").addEventListener("click", () => {
  fieldNames.forEach(f => state[f] = "");
  state.bsaManualValue = "";
  $$("input[data-field]").forEach(i => { i.value = ""; });
  $$(".card-header").forEach(btn => setCardExpanded(btn, btn.dataset.defaultExpanded === "true"));
  computeResults();
});

function fmt(value) {
  if (value === null || value === undefined || isNaN(value)) return null;
  return state.language === "hu" ? value.toFixed(2).replace(".", ",") : value.toFixed(2);
}

function computeResults() {
  const s = state, lang = s.language;
  const bsa = calculateBSA(s.weight, s.height, s.bsaManualMode, s.bsaManualValue, lang);
  const mrEro = calculateEro(s.mrPisaRadius, s.mrAliasingVelocity, s.mrVmax, lang);
  const mrRegVol = calculateRegVol(mrEro, s.mrVti, lang);
  const sv = calculateSV(s.lvotDiam, s.lvotVti, lang);
  const mrRegFraction = calculateRegFraction(mrRegVol, sv);
  const arEro = calculateEro(s.arPisaRadius, s.arAliasingVelocity, s.arVmax, lang);
  const arRegVol = calculateRegVol(arEro, s.arVti, lang);
  const arRegFraction = calculateARRegFraction(arRegVol, sv);
  const trEro = calculateEro(s.trPisaRadius, s.trAliasingVelocity, s.trVmax, lang);
  const trRegVol = calculateRegVol(trEro, s.trVti, lang);
  const svi = calculateSVI(sv, bsa);
  const cardiacOutput = calculateCardiacOutput(sv, s.heartRate, lang);
  const cardiacIndex = calculateCardiacIndex(cardiacOutput, bsa);
  // AVA/AVAi: same formula and value whether the valve is native or
  // prosthetic — see gradeFns.avAtEt for why "eoa"/"eoai" (below) don't
  // get graded the same way.
  const ava = calculateAVA(s.lvotDiam, s.lvotVti, s.aorticVti, lang);
  const avai = calculateAVAI(ava, bsa);
  const dviVti = calculateDVIVti(s.lvotVti, s.aorticVti, lang);
  const dviVmax = calculateDVIVmax(s.lvotVmax, s.aorticVmax, lang);
  const avAtEt = s.prostheticAV ? calculateAtEt(s.avAt, s.avEt, lang) : null;
  let mvVtiLvotVti = null;
  if (s.mvVtiPw && s.lvotVti) {
    const r = parseFloat(s.mvVtiPw) / parseFloat(s.lvotVti);
    if (!isNaN(r)) mvVtiLvotVti = r.toFixed(2);
  }
  const mvaVti = calculateAVA(s.lvotDiam, s.lvotVti, s.mvVtiCw, lang);
  const mvaPht = calculateMVAPht(s.mvPht, lang);

  const t = translations[lang];
  const rows = [
    ["bsaResult", bsa, "m²"],
    ["mrEro", mrEro, "cm²"],
    ["mrRegVol", mrRegVol, "ml"],
    ["mrRegFraction", mrRegFraction, "%"],
    ["arEro", arEro, "cm²"],
    ["arRegVol", arRegVol, "ml"],
    ["arRegFraction", arRegFraction, "%"],
    ["trEro", trEro, "cm²"],
    ["trRegVol", trRegVol, "ml"],
    [s.prostheticAV ? "eoa" : "ava", ava, "cm²"],
    [s.prostheticAV ? "eoai" : "avai", avai, "cm²/m²"],
    // Label stays "DVI(VTI)"/"DVI(Vmax)" either way — only the grading
    // band changes for a prosthetic valve, via the 4th tuple element
    // (gradeKey), which the render loop below falls back to `key` for
    // every other row that doesn't need this split.
    ["dviVti", dviVti, "", s.prostheticAV ? "dviProsthetic" : "dviVti"],
    ["dviVmax", dviVmax, "", s.prostheticAV ? "dviProsthetic" : "dviVmax"],
    ["avAtEt", avAtEt, ""],
    ["mvVtiLvotVti", mvVtiLvotVti === null ? null : parseFloat(mvVtiLvotVti.replace(",", ".")), ""],
    ["mvaVti", mvaVti, "cm²"],
    ["mvaPht", mvaPht, "cm²"],
    ["sv", sv, "ml"],
    ["svi", svi, "ml/m²"],
    ["cardiacOutput", cardiacOutput, "l/min"],
    ["cardiacIndex", cardiacIndex, "l/min/m²"],
  ];

  const list = $("#resultsList");
  list.innerHTML = "";
  let any = false;
  rows.forEach(([key, val, unit, gradeKey]) => {
    if (val === null || val === undefined || (typeof val === "number" && isNaN(val))) return;
    any = true;
    const row = document.createElement("div");
    row.className = "result-row";
    const numeric = typeof val === "number" ? val : parseFloat(val);
    const formatted = fmt(numeric);
    const gradeFn = gradeFns[gradeKey || key];
    const grade = gradeFn ? gradeFn(numeric) : null;
    const badge = grade ? `<span class="grade grade-${grade}">${gradeLabels[lang][grade]}</span>` : "<span></span>";
    row.innerHTML = `<span class="label">${t[key]}</span>${badge}<span class="value">${formatted}${unit ? " " + unit : ""}</span>`;
    list.appendChild(row);
  });
  $("#resultsCard").hidden = !any;

  lastResults = { bsa, mrEro, mrRegVol, mrRegFraction, arEro, arRegVol, arRegFraction,
    trEro, trRegVol, sv, svi, cardiacOutput, cardiacIndex, ava, avai, dviVti, dviVmax, avAtEt, mvVtiLvotVti,
    mvaVti, mvaPht };
}

// ---- report text for "Copy to Report" ----
// Raw inputs are echoed as typed, trimmed, and only if non-empty — but
// the decimal separator is normalized to match the active language
// (a user can type either "." or "," in the fields; input parsing
// already accepts both), so a report copied in HU always reads with
// commas and one copied in EN always reads with dots, regardless of
// which separator was actually typed into each field.
function rawInput(raw, lang) {
  if (raw === undefined || raw === null) return null;
  const trimmed = String(raw).trim();
  if (trimmed === "") return null;
  const targetSep = lang === "hu" ? "," : ".";
  return trimmed.replace(/[.,]/, targetSep);
}

// One PISA line: "<Group>: <label>: <val> <unit>; <label>: <val> <unit>; ..."
// in the fixed order radius, ERO, Reg vol, Reg fraction, Vmax, VTI, Aliasing
// velocity — regFractionLabel is omitted entirely for TR (not calculated).
// Raw inputs (radius/Vmax/VTI/aliasing) are echoed as typed (decimal
// separator normalized to lang); ERO/Reg vol/Reg fraction are calculated
// results and stay formatted via fmt().
function pisaLine(t, lang, groupLabel, eroLabel, regVolLabel, regFractionLabel,
                   radiusRaw, vmaxRaw, vtiRaw, aliasingRaw, eroVal, regVolVal, regFractionVal) {
  const parts = [];
  const radius = rawInput(radiusRaw, lang);
  if (radius !== null) parts.push(`${t.pisaRadius}: ${radius} mm`);
  if (eroVal !== null) parts.push(`${eroLabel}: ${fmt(eroVal)} cm²`);
  if (regVolVal !== null) parts.push(`${regVolLabel}: ${fmt(regVolVal)} ml`);
  if (regFractionLabel && regFractionVal !== null) parts.push(`${regFractionLabel}: ${fmt(regFractionVal)} %`);
  const vmax = rawInput(vmaxRaw, lang);
  if (vmax !== null) parts.push(`${t.vmax}: ${vmax} m/s`);
  const vti = rawInput(vtiRaw, lang);
  if (vti !== null) parts.push(`${t.vti}: ${vti} cm`);
  const aliasing = rawInput(aliasingRaw, lang);
  if (aliasing !== null) parts.push(`${t.aliasingVelocity}: ${aliasing} cm/s`);
  if (parts.length === 0) return null;
  return `${groupLabel}: ${parts.join("; ")}`;
}

function buildReportText() {
  const lang = state.language;
  const t = translations[lang];
  const s = state;
  const blocks = [];

  // BSA — echoed as typed if manually entered, otherwise a calculated result
  if (lastResults.bsa !== null) {
    const bsaText = s.bsaManualMode ? rawInput(s.bsaManualValue, lang) : fmt(lastResults.bsa);
    if (bsaText !== null) blocks.push(`${t.bsaResult}: ${bsaText} m²`);
  }

  // MR PISA
  blocks.push(pisaLine(t, lang, t.mrPisaGroup, t.mrEro, t.mrRegVol, t.mrRegFraction,
    s.mrPisaRadius, s.mrVmax, s.mrVti, s.mrAliasingVelocity,
    lastResults.mrEro, lastResults.mrRegVol, lastResults.mrRegFraction));

  // Mitral Stenosis — raw inputs echoed, then whichever MVA(s) computed
  const msParts = [];
  const mvVtiCw = rawInput(s.mvVtiCw, lang);
  if (mvVtiCw !== null) msParts.push(`${t.mvVtiCw}: ${mvVtiCw} cm`);
  const mvPht = rawInput(s.mvPht, lang);
  if (mvPht !== null) msParts.push(`${t.mvPht}: ${mvPht} ms`);
  if (lastResults.mvaVti !== null) msParts.push(`${t.mvaVti}: ${fmt(lastResults.mvaVti)} cm²`);
  if (lastResults.mvaPht !== null) msParts.push(`${t.mvaPht}: ${fmt(lastResults.mvaPht)} cm²`);
  blocks.push(msParts.length ? `${t.mitralStenosisGroup}: ${msParts.join("; ")}` : null);

  // LVOT / AV / AVA / DVI block — one line per item, no blank lines between them
  const lvotLines = [];
  const lvotDiam = rawInput(s.lvotDiam, lang);
  if (lvotDiam !== null) lvotLines.push(`LVOT Diam: ${lvotDiam} mm`);
  const lvotVti = rawInput(s.lvotVti, lang);
  if (lvotVti !== null) lvotLines.push(`${t.lvotVti}: ${lvotVti} cm`);
  const avVti = rawInput(s.aorticVti, lang);
  if (avVti !== null) lvotLines.push(`AV VTI: ${avVti} cm`);
  // Same AVA/AVAi values whichever label is showing (see computeResults).
  const avaLabel = s.prostheticAV ? t.eoa : t.ava, avaiLabel = s.prostheticAV ? t.eoai : t.avai;
  if (lastResults.ava !== null) lvotLines.push(`${avaLabel}: ${fmt(lastResults.ava)} cm²`);
  if (lastResults.avai !== null) lvotLines.push(`${avaiLabel}: ${fmt(lastResults.avai)} cm²/m²`);
  const hasDviVti = lastResults.dviVti !== null;
  const hasDviVmax = lastResults.dviVmax !== null;
  if (hasDviVti && hasDviVmax) {
    lvotLines.push(`DVI(VTI): ${fmt(lastResults.dviVti)}; DVI(Vmax): ${fmt(lastResults.dviVmax)}`);
  } else if (hasDviVti) {
    lvotLines.push(`DVI: ${fmt(lastResults.dviVti)}`);
  } else if (hasDviVmax) {
    lvotLines.push(`DVI: ${fmt(lastResults.dviVmax)}`);
  }
  // Prosthetic AV only: AT is echoed as typed, AT/ET is the calculated
  // ratio — ET itself isn't echoed (per user direction).
  const avAt = rawInput(s.avAt, lang);
  if (avAt !== null) lvotLines.push(`${t.avAt}: ${avAt} ms`);
  if (lastResults.avAtEt !== null) lvotLines.push(`${t.avAtEt}: ${fmt(lastResults.avAtEt)}`);
  if (lastResults.svi !== null) lvotLines.push(`${t.svi}: ${fmt(lastResults.svi)} ml/m²`);
  if (lastResults.cardiacOutput !== null) lvotLines.push(`CO: ${fmt(lastResults.cardiacOutput)} l/min`);
  if (lastResults.cardiacIndex !== null) lvotLines.push(`CI: ${fmt(lastResults.cardiacIndex)} l/min/m²`);
  blocks.push(lvotLines.length ? lvotLines.join("\n") : null);

  // AR PISA
  blocks.push(pisaLine(t, lang, t.arPisaGroup, t.arEro, t.arRegVol, t.arRegFraction,
    s.arPisaRadius, s.arVmax, s.arVti, s.arAliasingVelocity,
    lastResults.arEro, lastResults.arRegVol, lastResults.arRegFraction));

  // TR PISA — no regFraction (not calculated for TR)
  blocks.push(pisaLine(t, lang, t.trPisaGroup, t.trEro, t.trRegVol, null,
    s.trPisaRadius, s.trVmax, s.trVti, s.trAliasingVelocity,
    lastResults.trEro, lastResults.trRegVol, null));

  // The user's reporting software can't render superscript characters, so
  // "cm²" etc. would show up as a mangled glyph or drop the exponent
  // entirely — replace with a plain "2" here, at the last possible point,
  // rather than hunting down every unit string above (and every one added
  // later). Only the clipboard/report text is affected; on-screen results
  // keep the superscript.
  return blocks.filter(b => b !== null).join("\n\n").replace(/²/g, "2");
}

function flashCopyButton(message) {
  const btn = $("#copyBtn");
  btn.textContent = message;
  // Stashed directly on the function (rather than a module-level variable)
  // so the pending-revert timer travels with the one thing that uses it.
  clearTimeout(/** @type {any} */ (flashCopyButton)._t);
  /** @type {any} */ (flashCopyButton)._t = setTimeout(() => applyTranslations(), 1500);
}

function legacyCopy(text) {
  // execCommand fallback — needed because navigator.clipboard.writeText()
  // exists but unreliably rejects with a permission error specifically
  // inside iOS standalone home-screen PWAs (a known WebKit quirk); this
  // older API works there even when the modern one doesn't.
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
  document.body.removeChild(ta);
  return ok;
}

$("#copyBtn").addEventListener("click", async () => {
  const t = translations[state.language];
  const text = buildReportText();
  if (!text) {
    flashCopyButton(t.copyEmpty);
    return;
  }
  let ok = false;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch (e) { /* fall through to legacy fallback below */ }
  }
  if (!ok) ok = legacyCopy(text);
  flashCopyButton(ok ? t.copied : t.copyFailed);
});

applyTranslations();
computeResults();
refreshInfoLanguage();
refreshWikiLanguage();
// Cold load on a #wiki or #wiki/<id> URL should open straight to that
// view instead of requiring the wiki button to be clicked first.
syncWikiToHash();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
}
