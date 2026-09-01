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
    avVerdictTitle: "Prosthetic AV assessment", avNormal: "Normal prosthetic aortic valve",
    avPossibleStenosis: "Possible stenosis", avStenosis: "Stenosis",
    avDiscordant: "Discordant findings — double-check measurements",
    avHighFlow: "Normal prosthetic valve function without PPM (high-flow state, e.g. accelerated circulation)",
    avPpm: "Normal prosthetic valve function with PPM (patient-prosthesis mismatch)",
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
    avVerdictTitle: "Műbillentyű értékelés", avNormal: "Normál aorta műbillentyű",
    avPossibleStenosis: "Lehetséges stenosis", avStenosis: "Stenosis",
    avDiscordant: "Ellentmondó eredmények — ellenőrizd a méréseket",
    avHighFlow: "Normál műbillentyű-funkció PPM nélkül (gyorsult keringés)",
    avPpm: "Normál műbillentyű-funkció PPM-mel (patient-prosthesis mismatch)",
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
// Body mass index, needed for the prosthetic-AV EOAi grading (Table 7 of
// the same guideline has a separate BMI < 30 / >= 30 kg/m² cutoff pair —
// see gradeEoaiPPM below). Always computed from actual weight/height,
// unlike BSA above, which can instead come from a manually entered value.
/**
 * @param {string} weight
 * @param {string} height
 * @param {string} lang
 * @returns {number | null}
 */
const calculateBMI = (weight, height, lang) => {
  const w = parseNumber(weight, lang), h = parseNumber(height, lang);
  if (weight && height && !isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
    const hM = h / 100;
    return w / (hM * hM);
  }
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

// Prosthetic AV "elevated gradient" diagnostic algorithm (Zoghbi et al.
// 2024, same guideline as prosthetic-data/aortic-valves.js). Per user
// direction this is NOT gated on Vmax > 3 m/s (the algorithm's own entry
// condition) — a reduced LV EF can make that threshold too low, and most
// users won't enter AV Vmax anyway — so it fires whenever AT/ET and DVI
// are both available, regardless of Vmax.
//
// Jet contour (early vs. late peaking): the source diagram draws this as
// AT < 100ms AND AT/ET < 0.37 for "early," AT > 100ms AND AT/ET > 0.37 for
// "late" — but per user direction this is OR, not AND, and it's "late"
// that's the OR-based side: late if EITHER AT > 100 OR AT/ET > 0.37; early
// is the complement (AT <= 100 AND AT/ET <= 0.37). This isn't just a
// looser threshold — it collapses what would otherwise be an undefined
// third case (the two criteria disagreeing, e.g. AT < 100 but AT/ET >
// 0.37) into a clean two-way split, since "early" only holds when
// *neither* late-criterion is true. So every AT/AT-ET pair lands in
// exactly one contour, with no leftover ambiguous case at this step.
//
// The diagram itself only draws four of the six (contour x DVI-band)
// combinations — early+>=0.30 (normal), early-or-late+0.25-0.29 (possible
// stenosis), late+<0.25 (stenosis). The other two (early+<0.25,
// late+>=0.30) aren't addressed by the source algorithm at all; per user
// direction these render as "discordant" rather than guessing an outcome.
//
// Picks dviVti over dviVmax when both are present (matching the rest of
// the app's own preference — see buildReportText's DVI line).
/**
 * @param {string} at
 * @param {number | null} atEt
 * @param {number | null} dviVti
 * @param {number | null} dviVmax
 * @param {number | null} eoai
 * @param {string} lang
 * @returns {{ category: string, note: string | null } | null}
 */
const calculateAvVerdict = (at, atEt, dviVti, dviVmax, eoai, lang) => {
  const atNum = parseNumber(at, lang);
  if (!at || isNaN(atNum) || atNum <= 0 || atEt === null) return null;
  const dvi = dviVti !== null ? dviVti : dviVmax;
  if (dvi === null) return null;

  const late = atNum > 100 || atEt > 0.37;
  const early = !late;
  let category;
  if (dvi >= 0.30) category = early ? "normal" : "discordant";
  else if (dvi >= 0.25) category = "possibleStenosis";
  else category = early ? "discordant" : "stenosis";

  let note = null;
  if (category === "normal" && eoai !== null) note = eoai > 0.85 ? "highFlow" : "ppm";
  return { category, note };
};

// ---- severity grading ----
// Grading bands transcribed from Echo checklist.xlsx.
// Ambiguous range boundaries are resolved toward the higher-severity side.
const gradeLabels = {
  en: { mild: "Mild", moderate: "Moderate", severe: "Severe", massive: "Massive", torrential: "Torrential",
    normal: "Normal", reduced: "Reduced", mildlyReduced: "Mildly reduced", elevated: "Elevated",
    possibleStenosis: "Possible stenosis", stenosis: "Stenosis" },
  hu: { mild: "Enyhe", moderate: "Közepes", severe: "Súlyos", massive: "Masszív", torrential: "Torrentialis",
    normal: "Normális", reduced: "Csökkent", mildlyReduced: "Enyhén csökkent", elevated: "Emelkedett",
    possibleStenosis: "Lehetséges stenosis", stenosis: "Stenosis" },
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
  // Prosthetic AV, Table 5 (Zoghbi et al. 2024) "SAVR" row for DVI: normal
  // >0.35, possible stenosis 0.25-0.35, stenosis <0.25. Same cutoff for
  // both the VTI and Vmax variant. Selected instead of dviVti/dviVmax via
  // the rows array's gradeKey (4th tuple element) in computeResults when
  // state.prostheticAV is on — see the comment there. Note this is a
  // different scale than the >=0.30/0.25-0.29/<0.25 bands
  // calculateAvVerdict() uses internally for the elevated-gradient
  // algorithm (Figure 13 in the same guideline) — the two features draw on
  // different tables and are graded independently.
  dviProsthetic: v => v > 0.35 ? "normal" : v >= 0.25 ? "possibleStenosis" : "stenosis",
  // Prosthetic AV, Table 5: acceleration time normal <80ms, possible
  // stenosis 80-100ms, stenosis >100ms. Only shown (as its own graded
  // result row) when state.prostheticAV is on — see computeResults.
  avAt: v => v < 80 ? "normal" : v <= 100 ? "possibleStenosis" : "stenosis",
  // Prosthetic AV, Table 5: AT/LV ejection time ratio normal <0.32,
  // possible stenosis 0.32-0.37, stenosis >0.37. (Distinct from the
  // <100ms/0.37 cutoffs calculateAvVerdict() uses for its early/late-peak
  // split, per Figure 13 in the same guideline — see the dviProsthetic
  // comment above for why these two features use different numbers.)
  // No "eoa"/"eoai" entry here — those are graded dynamically
  // (per-selected-valve SD bands from Table 5, and BMI-dependent Table 7
  // cutoffs, respectively) via a precomputed grade passed straight into
  // the rows array in computeResults, not a static gradeFns lookup.
  avAtEt: v => v < 0.32 ? "normal" : v <= 0.37 ? "possibleStenosis" : "stenosis",
  // Only a single cutoff is defined for this metric (per user direction):
  // below 1 reads as mild, at/above 1 reads as severe, moderate is unused.
  mvVtiLvotVti: v => v < 1 ? "mild" : "severe",
  // Cardiac output: normal 4–8 l/min (per user direction).
  cardiacOutput: v => v < 4 ? "reduced" : v <= 8 ? "normal" : "elevated",
  // Cardiac index: normal 2.5–4.2 l/min/m², <2.2 reduced, 2.2–2.5 mildly reduced (per user direction).
  cardiacIndex: v => v < 2.2 ? "reduced" : v < 2.5 ? "mildlyReduced" : v <= 4.2 ? "normal" : "elevated",
};

// Prosthetic AV EOAi grading, per Table 7 (Zoghbi et al. 2024) "Aortic
// EOA*" row — patient-prosthesis mismatch criteria, with a separate cutoff
// pair depending on obesity (BMI >= 30 kg/m² vs < 30). Not a static
// gradeFns entry because it needs the patient's BMI as well as EOAi —
// computeResults calls this directly and passes the result in as a
// precomputed grade (rows array's 5th tuple element) instead.
/**
 * @param {number} avai
 * @param {number} bmi
 * @returns {string}
 */
const gradeEoaiPPM = (avai, bmi) => {
  if (bmi >= 30) return avai > 0.70 ? "normal" : avai >= 0.56 ? "moderate" : "severe";
  return avai > 0.85 ? "normal" : avai >= 0.66 ? "moderate" : "severe";
};

// ---- severity reference content ----
// Layout-only metadata for the wide TR table (identical in both languages).
const trLayout = {
  wide: true,
  // Parameter + Mild/Moderate/Severe fit on screen without scrolling;
  // Massive/Torrential sit past that width and are reached by scrolling.
  colWidths: ["104px", "80px", "88px", "80px", "84px", "84px"],
};

// Inline SVG for the "elevated prosthetic aortic valve gradient" decision
// tree (Zoghbi et al. 2024 — same source as calculateAvVerdict and
// prosthetic-data/aortic-valves.js), themed with the app's CSS custom
// properties so it matches light/dark automatically. Scoped to just the
// decision-tree boxes/arrows; the EOAi sub-split, "other possible causes"
// lists, and footnotes are plain prose in severityInfo.avProsthetic.notes
// below instead of packed into SVG text, since they're easier to read (and
// translate) as wrapped HTML than hand-wrapped SVG <text>. The three
// outcome boxes reuse the same --grade-mild/-moderate/-severe tokens as
// .av-verdict, so the diagram and the app's own computed verdict card read
// as the same color language.
function avAlgorithmFigure(lang) {
  const t = lang === "hu"
    ? {
      caption: "Az ASE 2024 döntési algoritmusa emelkedett aorta műbillentyű grádiens esetén.",
      trigger1: "Aorta műbillentyű", trigger2: "Vmax > 3 m/s",
      earlyTitle: "Korai csúcs", earlyAt: "AT < 100 ms", earlyRatio: "AT/ET < 0,37",
      lateTitle: "Késői csúcs", lateAt: "AT > 100 ms", lateRatio: "AT/ET > 0,37",
      dvi1: "DVI ≥ 0,30", dvi2: "DVI 0,25–0,29", dvi3: "DVI < 0,25",
      outcome1a: "Normál", outcome1b: "aorta műbillentyű",
      outcome2: "Lehetséges stenosis", outcome3: "Stenosis",
    }
    : {
      caption: "The ASE 2024 decision algorithm for an elevated prosthetic aortic valve gradient.",
      trigger1: "Prosthetic aortic valve", trigger2: "Vmax > 3 m/s",
      earlyTitle: "Early-peaking jet", earlyAt: "AT < 100 ms", earlyRatio: "AT/ET < 0.37",
      lateTitle: "Late-peaking jet", lateAt: "AT > 100 ms", lateRatio: "AT/ET > 0.37",
      dvi1: "DVI ≥ 0.30", dvi2: "DVI 0.25–0.29", dvi3: "DVI < 0.25",
      outcome1a: "Normal", outcome1b: "prosthetic aortic valve",
      outcome2: "Possible stenosis", outcome3: "Stenosis",
    };
  return `
    <figure class="wiki-figure">
      <svg viewBox="0 0 380 300" role="img" aria-label="${t.caption}">
        <defs>
          <marker id="av-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--text-sub)"></path>
          </marker>
        </defs>

        <!-- Trigger -->
        <rect x="40" y="8" width="300" height="44" rx="10" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.5"></rect>
        <text x="190" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">${t.trigger1}</text>
        <text x="190" y="43" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">${t.trigger2}</text>

        <!-- Split to jet-contour boxes -->
        <line x1="190" y1="52" x2="100" y2="76" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#av-arrow)"></line>
        <line x1="190" y1="52" x2="280" y2="76" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#av-arrow)"></line>

        <!-- Jet contour -->
        <rect x="15" y="80" width="160" height="60" rx="10" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.5"></rect>
        <text x="95" y="100" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">${t.earlyTitle}</text>
        <text x="95" y="116" text-anchor="middle" font-size="11" fill="var(--text-sub)">${t.earlyAt}</text>
        <text x="95" y="131" text-anchor="middle" font-size="11" fill="var(--text-sub)">${t.earlyRatio}</text>

        <rect x="205" y="80" width="160" height="60" rx="10" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.5"></rect>
        <text x="285" y="100" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">${t.lateTitle}</text>
        <text x="285" y="116" text-anchor="middle" font-size="11" fill="var(--text-sub)">${t.lateAt}</text>
        <text x="285" y="131" text-anchor="middle" font-size="11" fill="var(--text-sub)">${t.lateRatio}</text>

        <!-- Split to DVI boxes (middle band reachable from both sides) -->
        <line x1="95" y1="140" x2="65" y2="176" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#av-arrow)"></line>
        <line x1="95" y1="140" x2="190" y2="176" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#av-arrow)"></line>
        <line x1="285" y1="140" x2="190" y2="176" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#av-arrow)"></line>
        <line x1="285" y1="140" x2="315" y2="176" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#av-arrow)"></line>

        <!-- DVI bands -->
        <rect x="15" y="180" width="100" height="40" rx="10" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.5"></rect>
        <text x="65" y="204" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">${t.dvi1}</text>
        <rect x="140" y="180" width="100" height="40" rx="10" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.5"></rect>
        <text x="190" y="204" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">${t.dvi2}</text>
        <rect x="265" y="180" width="100" height="40" rx="10" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.5"></rect>
        <text x="315" y="204" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">${t.dvi3}</text>

        <!-- Down to outcomes -->
        <line x1="65" y1="220" x2="65" y2="238" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#av-arrow)"></line>
        <line x1="190" y1="220" x2="190" y2="238" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#av-arrow)"></line>
        <line x1="315" y1="220" x2="315" y2="238" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#av-arrow)"></line>

        <!-- Outcomes -->
        <rect x="15" y="242" width="100" height="52" rx="10" fill="var(--grade-mild-bg)"></rect>
        <text x="65" y="264" text-anchor="middle" font-size="11" font-weight="700" fill="var(--grade-mild-text)">${t.outcome1a}</text>
        <text x="65" y="279" text-anchor="middle" font-size="11" font-weight="700" fill="var(--grade-mild-text)">${t.outcome1b}</text>

        <rect x="140" y="242" width="100" height="52" rx="10" fill="var(--grade-moderate-bg)"></rect>
        <text x="190" y="272" text-anchor="middle" font-size="11" font-weight="700" fill="var(--grade-moderate-text)">${t.outcome2}</text>

        <rect x="265" y="242" width="100" height="52" rx="10" fill="var(--grade-severe-bg)"></rect>
        <text x="315" y="272" text-anchor="middle" font-size="11" font-weight="700" fill="var(--grade-severe-text)">${t.outcome3}</text>
      </svg>
      <figcaption>${t.caption}</figcaption>
    </figure>
  `;
}

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
    avProsthetic: {
      title: "Elevated Prosthetic AV Gradient",
      tableBeforeFigure: {
        heading: "Table 1 — Doppler Parameters of Prosthetic Aortic Valves",
        headers: ["Parameter", "Normal", "Possible stenosis", "Stenosis"],
        rows: [
          ["Jet velocity contour", "Triangular, early peaking", "Triangular to intermediate", "Rounded, symmetric"],
          ["Acceleration time (ms)", "<80", "80–100", ">100"],
          ["AT / LV ejection time ratio", "<0.32", "0.32–0.37", ">0.37"],
          ["Peak velocity (m/s)", "<3", "3–4", "≥4"],
          ["Mean gradient (mmHg) — SAVR", "<20", "20–34", "≥35"],
          ["DVI — SAVR", ">0.35", "0.25–0.35", "<0.25"],
          ["EOA — SAVR", "Reference EOA ± 1 SD", ">1 SD below reference EOA", ">2 SD below reference EOA"],
        ],
      },
      figure: avAlgorithmFigure("en"),
      // These are specifically about reading the algorithm above (its own
      // footnotes, and what each of its outcomes can mean) — rendered
      // directly under it, not lumped in with the general notes at the
      // bottom, since they're important context for the diagram itself.
      figureNotes: [
        "Within a Normal result, EOAi further splits the finding: EOAi > 0.85 cm²/m² suggests a high-flow state (e.g. anemia, hyperthyroidism, an AV fistula); EOAi < 0.85 cm²/m² suggests patient-prosthesis mismatch (PPM).",
        "Possible stenosis — other possible causes: prosthesis-patient mismatch with a narrow LVOT, an incorrectly positioned LVOT PW Doppler sample volume, or underestimation of Vmax.",
        "Stenosis — other possible causes: valvular stenosis (e.g. thrombosis) or subvalvular stenosis.",
        "Assessing mechanical valve motion: fluoroscopy (cine angiography), CT, or TEE. Determining the cause of stenosis: CT angiography, TEE, or cardiac MRI.",
        "This app's own verdict (in Calculated Results, once AT/ET and DVI are available) doesn't require Vmax > 3 m/s to appear, and treats the jet as late-peaking if either AT > 100 ms or AT/ET > 0.37 holds, not only when both do.",
      ],
      tableAfterFigure: {
        heading: "Table 2 — Hemodynamic Criteria for Structural Valve Deterioration",
        headers: ["Criterion", "Possible SVD", "Significant SVD"],
        rows: [
          ["Mean gradient", "Increase ≥10 mm Hg to a mean ≥20 mm Hg, with EOA decrease ≥0.3 cm² or ≥25% and/or DVI decrease ≥0.1 or ≥20% vs. baseline", "Increase ≥20 mm Hg to a mean ≥30 mm Hg, with EOA decrease ≥0.6 cm² or ≥50% and/or DVI decrease ≥0.2 or ≥40% vs. baseline"],
          ["New/worsening regurgitation", "New or increased intraprosthetic AR, resulting in moderate or greater AR", "New or increased intraprosthetic AR of ≥2 grades, resulting in severe AR"],
        ],
      },
      notes: [
        "Table 1 (above) requires at least one flow-dependent parameter (velocity, mean gradient) and one flow-independent parameter (EOA or DVI) to call significant stenosis; it only applies to SAVR — TAVI change-from-baseline criteria aren't reproduced here since this app doesn't track serial studies.",
        "This app's own Calculated Results grade DVI, AT, and AT/ET using Table 1's SAVR cutoffs directly; EOA is graded against the selected valve type/size's own reference EOA ± SD (see the picker above) using the same table's ±1 SD / ±2 SD bands, and only appears once a valve and size are picked.",
        "EOAi is graded using patient-prosthesis-mismatch cutoffs that depend on BMI (calculated in the background from weight/height): >0.85 cm²/m² is normal under BMI 30 kg/m² (>0.70 cm²/m² at/above it), down to ≤0.65 cm²/m² (≤0.55 cm²/m² at/above BMI 30) for severe mismatch.",
        "Table 2 (above, structural valve deterioration) compares serial studies rather than staging absolute severity, so it has no \"Normal\" column — a change below the \"Possible SVD\" thresholds simply isn't SVD. In combined stenosis and regurgitation, SVD may be present at lower thresholds than shown.",
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
    avProsthetic: {
      title: "Emelkedett aorta műbillentyű grádiens",
      tableBeforeFigure: {
        heading: "1. táblázat — Aorta műbillentyűk Doppler paraméterei",
        headers: ["Paraméter", "Normális", "Lehetséges stenosis", "Stenosis"],
        rows: [
          ["Jet sebességi kontúr", "Háromszög, korai csúcsú", "Háromszög-köztes", "Kerekített, szimmetrikus"],
          ["Akcelerációs idő (ms)", "<80", "80–100", ">100"],
          ["AT / bal kamrai ejekciós idő arány", "<0,32", "0,32–0,37", ">0,37"],
          ["Csúcssebesség (m/s)", "<3", "3–4", "≥4"],
          ["Átlag grádiens (Hgmm) — SAVR", "<20", "20–34", "≥35"],
          ["DVI — SAVR", ">0,35", "0,25–0,35", "<0,25"],
          ["EOA — SAVR", "Referencia EOA ± 1 SD", ">1 SD-vel a referencia EOA alatt", ">2 SD-vel a referencia EOA alatt"],
        ],
      },
      figure: avAlgorithmFigure("hu"),
      // Az algoritmus saját lábjegyzetei és az egyes kimenetek jelentése —
      // közvetlenül alatta jelenik meg, nem az általános jegyzetek között a
      // legalul, mivel fontos kontextust adnak magához az ábrához.
      figureNotes: [
        "Normál eredményen belül az alábbi, alkalmazás által adott értékelésnél az EOAi tovább bontja a leletet: EOAi > 0,85 cm²/m² gyorsult keringésre (pl. anaemia, hyperthyreosis, AV fistula) utal; EOAi < 0,85 cm²/m² patient-prosthesis mismatch-re (PPM) utal.",
        "Lehetséges stenosis — lehetséges egyéb okok: műbillentyű-stenosis szűk LVOT-val, a LVOT PW Doppler helytelen pozíciója, vagy a Vmax alulbecslése.",
        "Stenosis — lehetséges egyéb okok: valvuláris stenosis (pl. trombózis) vagy szubvalvuláris stenosis.",
        "Mechanikus műbillentyű mozgásának megítélése: fluoroszkópia (cine angiográfia), CT, vagy TEE. A stenosis okának megállapítása: CT angiográfia, TEE, vagy szív MRI.",
        "Az alkalmazás saját értékelése (a Számított eredmények között, amint az AT/ET és a DVI is rendelkezésre áll) nem követeli meg a Vmax > 3 m/s feltételt, és késői csúcsú jetnek tekinti, ha az AT > 100 ms VAGY az AT/ET > 0,37 teljesül — nem csak akkor, ha mindkettő.",
      ],
      tableAfterFigure: {
        heading: "2. táblázat — A strukturális műbillentyű-degeneráció hemodinamikai kritériumai",
        headers: ["Kritérium", "Lehetséges SVD", "Jelentős SVD"],
        rows: [
          ["Átlag grádiens", "≥10 Hgmm-es emelkedés ≥20 Hgmm-es átlag grádiensre, egyidejűleg ≥0,3 cm² vagy ≥25%-os EOA csökkenéssel és/vagy ≥0,1 vagy ≥20%-os DVI csökkenéssel a kiindulási értékhez képest", "≥20 Hgmm-es emelkedés ≥30 Hgmm-es átlag grádiensre, egyidejűleg ≥0,6 cm² vagy ≥50%-os EOA csökkenéssel és/vagy ≥0,2 vagy ≥40%-os DVI csökkenéssel a kiindulási értékhez képest"],
          ["Új/súlyosbodó regurgitáció", "Új vagy fokozódó intraprosztetikus AR, közepes vagy súlyosabb AR-t eredményezve", "Új vagy ≥2 fokozattal fokozódó intraprosztetikus AR, súlyos AR-t eredményezve"],
        ],
      },
      notes: [
        "Az 1. táblázat (fent) szerint a jelentős stenosishoz legalább egy flow-függő paraméter (sebesség, átlag grádiens) és egy flow-független paraméter (EOA vagy DVI) szükséges; csak SAVR-ra vonatkozik — a TAVI kiindulási-értékhez viszonyított kritériumait itt nem közöljük, mivel az alkalmazás nem követ soros vizsgálatokat.",
        "Az alkalmazás saját Számított eredményei a DVI-t, az AT-t és az AT/ET-t az 1. táblázat SAVR határértékeivel értékelik; az EOA-t a kiválasztott műbillentyű típus/méret saját referencia EOA ± SD értékéhez viszonyítva (lásd a fenti választót), ugyanazon táblázat ±1 SD / ±2 SD sávjaival — és csak akkor jelenik meg, ha műbillentyű és méret is ki van választva.",
        "Az EOAi értékelését a patient-prosthesis mismatch határértékei alapján végezzük, amelyek a BMI-től (háttérben, testsúlyból és testmagasságból számítva) függenek: >0,85 cm²/m² normális 30 kg/m² alatti BMI mellett (>0,70 cm²/m² 30 kg/m² fölött), egészen ≤0,65 cm²/m²-ig (≤0,55 cm²/m² 30 kg/m² BMI fölött) súlyos mismatch esetén.",
        "A 2. táblázat (fent, strukturális műbillentyű-degeneráció) soros vizsgálatokat hasonlít össze, nem abszolút súlyossági fokozatot állapít meg, ezért nincs \"Normális\" oszlopa — a „Lehetséges SVD” határérték alatti változás egyszerűen nem SVD. Kombinált stenosis és regurgitáció esetén az SVD alacsonyabb határértékeknél is fennállhat.",
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
    avProsthetic: "Elevated prosthetic aortic valve gradient algorithm",
  },
  hu: {
    mr: "Mitrális regurgitáció súlyossági referencia",
    ar: "Aorta regurgitáció súlyossági referencia",
    tr: "Tricuspidalis regurgitáció súlyossági referencia",
    as: "Aorta stenosis súlyossági referencia",
    ms: "Mitrális stenosis súlyossági referencia",
    avProsthetic: "Emelkedett aorta műbillentyű grádiens algoritmus",
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
  // Most topics are a single severity table (headers/rows straight on
  // info); avProsthetic instead has a figure sandwiched between two
  // tables, via tableBeforeFigure/tableAfterFigure. buildSeverityTable()
  // needs headers/rows, so only call it when a given piece is actually
  // present.
  // An optional `heading` on tableBeforeFigure/tableAfterFigure (unlike
  // buildSeverityTable's own spec fields) gets its own <h3> above the
  // table, since two tables sandwiching one figure need distinguishing —
  // a single top-level info.title isn't enough for both.
  const tableBeforeHtml = info.tableBeforeFigure
    ? (info.tableBeforeFigure.heading ? `<h3>${info.tableBeforeFigure.heading}</h3>` : "") + buildSeverityTable(info.tableBeforeFigure)
    : "";
  const figureHtml = info.figure || "";
  // figureNotes are specifically about reading the figure/algorithm (e.g.
  // its footnotes, the outcomes it can produce) — rendered directly under
  // it rather than lumped in with the general `notes` at the very bottom,
  // since they're important context for the diagram right above them.
  const figureNotesHtml = info.figureNotes && info.figureNotes.length
    ? `<div class="info-notes"><ul>${info.figureNotes.map(n => `<li>${n}</li>`).join("")}</ul></div>`
    : "";
  const tableAfterHtml = info.tableAfterFigure
    ? (info.tableAfterFigure.heading ? `<h3>${info.tableAfterFigure.heading}</h3>` : "") + buildSeverityTable(info.tableAfterFigure)
    : "";
  const tableHtml = info.headers ? buildSeverityTable(info) : "";
  const notesHtml = info.notes && info.notes.length
    ? `<div class="info-notes"><h3>${uiStrings[state.language].notes}</h3><ul>${info.notes.map(n => `<li>${n}</li>`).join("")}</ul></div>`
    : "";
  $("#infoContent").innerHTML = tableBeforeHtml + figureHtml + figureNotesHtml + tableAfterHtml + tableHtml + notesHtml;
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
  // Picking a valve clears the size, and with it any EOA grade from the
  // previous selection (gradeEoaAgainstReference) — re-render so a stale
  // badge doesn't linger until the next unrelated input event.
  computeResults();
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
// Parses a "mean ± SD" display string (the format every numeric field in
// prosthetic-data/aortic-valves.js is stored in) into actual numbers.
// Needed for gradeEoaAgainstReference below — everywhere else these
// strings are shown as-is (see renderValveReference above), never parsed.
/**
 * @param {string} str
 * @returns {{ mean: number, sd: number } | null}
 */
function parseMeanSd(str) {
  const m = /^\s*([\d.,]+)\s*±\s*([\d.,]+)\s*$/.exec(str || "");
  if (!m) return null;
  const mean = parseFloat(m[1].replace(",", "."));
  const sd = parseFloat(m[2].replace(",", "."));
  if (isNaN(mean) || isNaN(sd)) return null;
  return { mean, sd };
}
// Prosthetic AV EOA grading, per Table 5 (Zoghbi et al. 2024) "SAVR" row:
// normal within the selected valve/size's reference EOA ± 1 SD, possible
// stenosis more than 1 SD below it, stenosis more than 2 SD below it (an
// EOA *above* reference + 1 SD is still normal — a stenotic valve doesn't
// open too well). Returns null when no valve+size is selected, or its
// table has no EOA entry — computeResults then leaves the EOA row
// ungraded, same as before this cutoff existed.
/**
 * @param {number} eoa
 * @returns {string | null}
 */
function gradeEoaAgainstReference(eoa) {
  const valve = (window.prostheticAorticValves || []).find(v => v.name === state.prostheticValveName);
  const sizeEntry = valve && valve.sizes.find(s => s.size === state.prostheticValveSize);
  const ref = sizeEntry && parseMeanSd(sizeEntry.eoa);
  if (!ref) return null;
  const belowMean = ref.mean - eoa;
  if (belowMean <= ref.sd) return "normal";
  if (belowMean <= 2 * ref.sd) return "possibleStenosis";
  return "stenosis";
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
  // Clearing the selection can also clear an EOA grade that was based on
  // it (gradeEoaAgainstReference) — re-render so the badge disappears too.
  computeResults();
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
  // The EOA badge (gradeEoaAgainstReference) depends on the selected
  // valve+size, unlike the rest of this picker, which is display-only —
  // so a size pick needs to re-run computeResults(), not just the
  // reference-card render above.
  computeResults();
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

// A category, not a value+unit, so it doesn't fit the .result-row shape
// the numeric rows above use — rendered as its own colored callout
// instead. "discordant" is deliberately its own neutral color, not red —
// it's a data-quality flag ("recheck your inputs"), not a severity level,
// so it shouldn't read as alarming as an actual stenosis finding.
const avVerdictColor = { normal: "normal", possibleStenosis: "caution", stenosis: "danger", discordant: "neutral" };
function renderAvVerdict(verdict, lang) {
  const t = translations[lang];
  const el = document.createElement("div");
  el.className = `av-verdict av-verdict-${avVerdictColor[verdict.category]}`;
  const noteHtml = verdict.note ? `<p>${t["av" + verdict.note[0].toUpperCase() + verdict.note.slice(1)]}</p>` : "";
  el.innerHTML = `<h3>${t.avVerdictTitle}</h3><p class="av-verdict-headline">${t["av" + verdict.category[0].toUpperCase() + verdict.category.slice(1)]}</p>${noteHtml}`;
  return el;
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
  const avVerdict = s.prostheticAV ? calculateAvVerdict(s.avAt, avAtEt, dviVti, dviVmax, avai, lang) : null;
  // AT itself only becomes a graded row (Table 5 cutoffs, via gradeFns.avAt)
  // in prosthetic mode — natively it's just an input, never a result.
  let avAtNum = null;
  if (s.prostheticAV && s.avAt) {
    const n = parseNumber(s.avAt, lang);
    if (!isNaN(n) && n > 0) avAtNum = n;
  }
  // EOA/EOAi grading is dynamic (per-valve SD bands / BMI-dependent Table 7
  // cutoffs) rather than a static gradeFns lookup — see
  // gradeEoaAgainstReference and gradeEoaiPPM. Both stay null (no badge)
  // when the inputs they need (a selected valve+size, or weight+height)
  // aren't available, same as before these cutoffs existed.
  const eoaGrade = s.prostheticAV && ava !== null ? gradeEoaAgainstReference(ava) : null;
  const bmi = s.prostheticAV ? calculateBMI(s.weight, s.height, lang) : null;
  const eoaiGrade = s.prostheticAV && avai !== null && bmi !== null ? gradeEoaiPPM(avai, bmi) : null;
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
    // 5th tuple element (precomputed grade) overrides gradeFns entirely —
    // see the rows.forEach loop below. Only prosthetic mode uses it, so
    // it's undefined (falls through to the normal gradeFns lookup) for
    // native ava/avai.
    [s.prostheticAV ? "eoa" : "ava", ava, "cm²", undefined, s.prostheticAV ? eoaGrade : undefined],
    [s.prostheticAV ? "eoai" : "avai", avai, "cm²/m²", undefined, s.prostheticAV ? eoaiGrade : undefined],
    // Label stays "DVI(VTI)"/"DVI(Vmax)" either way — only the grading
    // band changes for a prosthetic valve, via the 4th tuple element
    // (gradeKey), which the render loop below falls back to `key` for
    // every other row that doesn't need this split.
    ["dviVti", dviVti, "", s.prostheticAV ? "dviProsthetic" : "dviVti"],
    ["dviVmax", dviVmax, "", s.prostheticAV ? "dviProsthetic" : "dviVmax"],
    // AT only appears as its own graded row in prosthetic mode (native AT
    // has no severity cutoff of its own — see gradeFns.avAt).
    ["avAt", avAtNum, "ms"],
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
  rows.forEach(([key, val, unit, gradeKey, precomputedGrade]) => {
    if (val === null || val === undefined || (typeof val === "number" && isNaN(val))) return;
    any = true;
    const row = document.createElement("div");
    row.className = "result-row";
    const numeric = typeof val === "number" ? val : parseFloat(val);
    const formatted = fmt(numeric);
    const gradeFn = gradeFns[gradeKey || key];
    const grade = precomputedGrade !== undefined ? precomputedGrade : (gradeFn ? gradeFn(numeric) : null);
    const badge = grade ? `<span class="grade grade-${grade}">${gradeLabels[lang][grade]}</span>` : "<span></span>";
    row.innerHTML = `<span class="label">${t[key]}</span>${badge}<span class="value">${formatted}${unit ? " " + unit : ""}</span>`;
    list.appendChild(row);
  });
  // Not a graded numeric row like the ones above (it's a category, not a
  // value+unit), so it's appended directly rather than going through the
  // rows/gradeFn machinery — see renderAvVerdict().
  if (avVerdict) { any = true; list.appendChild(renderAvVerdict(avVerdict, lang)); }
  $("#resultsCard").hidden = !any;

  lastResults = { bsa, mrEro, mrRegVol, mrRegFraction, arEro, arRegVol, arRegFraction,
    trEro, trRegVol, sv, svi, cardiacOutput, cardiacIndex, ava, avai, dviVti, dviVmax, avAtEt, avVerdict,
    mvVtiLvotVti, mvaVti, mvaPht };
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
  if (lastResults.avVerdict) {
    const v = lastResults.avVerdict;
    const category = t["av" + v.category[0].toUpperCase() + v.category.slice(1)];
    const note = v.note ? ` (${t["av" + v.note[0].toUpperCase() + v.note.slice(1)]})` : "";
    lvotLines.push(`${t.avVerdictTitle}: ${category}${note}`);
  }
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
