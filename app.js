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
    prostheticAv: "Prosthetic valve", avAt: "AT", avEt: "Ejection time", avAtEt: "AT/ET",
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
    mvPeakE: "MV peak E velocity", mvMeanGradient: "MV mean gradient",
    mvDvi: "MV DVI (VTI PrMV / LVOT)", mvEoa: "MV EOA", mvEoai: "MV EOAi", mvEoaRef: "MV EOA vs. valve reference",
    mvVerdictTitle: "Prosthetic MV assessment", mvNormal: "Normal prosthetic mitral valve function",
    mvPossibleStenosis: "Possible stenosis", mvStenosis: "Suggests significant stenosis",
    mvMr: "Suggests significant prosthetic MR",
    mvHighFlow: "Elevated flow parameters with normal PHT",
    mvDiscordant: "Discordant findings — double-check measurements",
    mvMrNote: "Peak E ≥ 1.9 m/s and DVI ≥ 2.5 with a normal PHT: specificity close to 100% in mechanical valves. Confirm with TEE.",
    mvHighFlowNote: "Consider prosthetic MR, a high-flow state, or PPM.",
    mvDiscordantNote: "PHT > 200 ms, but peak E, mean gradient and DVI are all normal.",
    heartRateAbbr: "HR", prostheticMvReport: "Prosthetic MV",
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
    prostheticAv: "Műbillentyű", avAt: "AT", avEt: "Ejekciós idő", avAtEt: "AT/ET",
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
    mvPeakE: "MV csúcs E sebesség", mvMeanGradient: "MV átlag gradiens",
    mvDvi: "MV DVI (VTI PrMV / LVOT)", mvEoa: "MV EOA", mvEoai: "MV EOAi", mvEoaRef: "MV EOA a referenciához képest",
    mvVerdictTitle: "Mitrális műbillentyű értékelés", mvNormal: "Normál mitrális műbillentyű-funkció",
    mvPossibleStenosis: "Lehetséges stenosis", mvStenosis: "Jelentős stenosisra utal",
    mvMr: "Jelentős műbillentyű MR-re utal",
    mvHighFlow: "Emelkedett flow-paraméterek normál PHT mellett",
    mvDiscordant: "Ellentmondó eredmények — ellenőrizd a méréseket",
    mvMrNote: "Csúcs E ≥ 1,9 m/s és DVI ≥ 2,5 normál PHT mellett: mechanikus billentyűknél a specificitás közel 100%. TEE-vel érdemes megerősíteni.",
    mvHighFlowNote: "Gondolj műbillentyű MR-re, magas flow-ra (gyorsult keringés) vagy PPM-re.",
    mvDiscordantNote: "A PHT > 200 ms, de a csúcs E, az átlag gradiens és a DVI is normális.",
    heartRateAbbr: "Pulzus", prostheticMvReport: "Mitrális műbillentyű",
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

// Prosthetic MV DVI: VTI through the prosthetic mitral valve (CW, the same
// "MV VTI (CW)" field the native MVA(VTI) uses) over LVOT VTI — the inverse
// of the aortic DVI, per Zoghbi et al. 2024 (Figure 5, Table 11).
/**
 * @param {string} mvVtiCw
 * @param {string} lvotVti
 * @param {string} lang
 * @returns {number | null}
 */
const calculateMvDvi = (mvVtiCw, lvotVti, lang) => {
  const mv = parseNumber(mvVtiCw, lang), lv = parseNumber(lvotVti, lang);
  if (mvVtiCw && lvotVti && !isNaN(mv) && !isNaN(lv) && mv > 0 && lv > 0) return mv / lv;
  return null;
};

// Prosthetic MV overall verdict. Unlike the aortic one, the guideline has
// no decision-tree figure for prosthetic mitral stenosis, so this is a
// synthesis of two of its tables (per user direction), not a transcription:
//   - Table 11 (stenosis): peak E, mean gradient, DVI and PHT bands.
//   - Table 12 (significant MR in mechanical valves *with normal PHT*):
//     peak E >= 1.9 m/s and DVI >= 2.5 together give specificity close to
//     100%; the guideline also notes that peak E, mean gradient and DVI are
//     raised by significant prosthetic MR, not only by stenosis.
// PHT is the discriminator: flow-dependent parameters rise with both
// stenosis and MR (or high flow / PPM), but PHT only lengthens with
// stenosis. So PHT is required; without it this returns null.
//   PHT < 130 (normal):   E >= 1.9 AND DVI >= 2.5 -> "mr";
//                         any of E >= 1.9 / mean > 5 / DVI >= 2.2 -> "highFlow";
//                         otherwise -> "normal".
//   PHT 130-200:          -> "possibleStenosis".
//   PHT > 200:            any flow-dependent parameter raised -> "stenosis";
//                         all normal -> "discordant" (a long PHT with
//                         normal gradients doesn't fit either picture).
// "Raised" uses Table 11's own normal cutoffs (E >= 1.9, mean > 5, DVI
// >= 2.2). EOA is graded on its own row and deliberately left out here,
// since it's derived from the same VTI as DVI.
/**
 * @param {string} peakE
 * @param {string} meanGradient
 * @param {number | null} dvi
 * @param {string} pht
 * @param {string} lang
 * @returns {{ category: string, note: string | null } | null}
 */
const calculateMvVerdict = (peakE, meanGradient, dvi, pht, lang) => {
  const p = parseNumber(pht, lang);
  if (!pht || isNaN(p) || p <= 0) return null;
  const e = parseNumber(peakE, lang), m = parseNumber(meanGradient, lang);
  const eVal = peakE && !isNaN(e) && e > 0 ? e : null;
  const mVal = meanGradient && !isNaN(m) && m >= 0 ? m : null;
  if (eVal === null && mVal === null && dvi === null) return null;

  const eHigh = eVal !== null && eVal >= 1.9;
  const mHigh = mVal !== null && mVal > 5;
  const dviHigh = dvi !== null && dvi >= 2.2;
  const anyHigh = eHigh || mHigh || dviHigh;

  if (p < 130) {
    if (eHigh && dvi !== null && dvi >= 2.5) return { category: "mr", note: "mrNote" };
    if (anyHigh) return { category: "highFlow", note: "highFlowNote" };
    return { category: "normal", note: null };
  }
  if (p <= 200) return { category: "possibleStenosis", note: null };
  if (anyHigh) return { category: "stenosis", note: null };
  return { category: "discordant", note: "discordantNote" };
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
  // Prosthetic MR, Table 13 (Zoghbi et al. 2024): EROA <0.20 / 0.20-0.39 /
  // >=0.40 cm² — identical to mrEro above except exactly 0.40 is severe
  // here. Used via the rows array's gradeKey when state.prostheticMV is on.
  // (Reg. vol./fraction cutoffs in Table 13 match mrRegVol/mrRegFraction.)
  mrEroProsthetic: v => v < 0.2 ? "mild" : v < 0.4 ? "moderate" : "severe",
  mrRegVol: v => v < 30 ? "mild" : v < 60 ? "moderate" : "severe",
  mrRegFraction: v => v < 30 ? "mild" : v < 50 ? "moderate" : "severe",
  arEro: v => v < 0.1 ? "mild" : v < 0.3 ? "moderate" : "severe",
  arRegVol: v => v < 30 ? "mild" : v < 60 ? "moderate" : "severe",
  arRegFraction: v => v < 30 ? "mild" : v < 50 ? "moderate" : "severe",
  trEro: v => v < 0.2 ? "mild" : v < 0.4 ? "moderate" : v < 0.6 ? "severe" : v < 0.8 ? "massive" : "torrential",
  trRegVol: v => v < 30 ? "mild" : v < 45 ? "moderate" : v < 60 ? "severe" : v < 75 ? "massive" : "torrential",
  ava: v => v >= 1.5 ? "mild" : v > 1.0 ? "moderate" : "severe",
  avai: v => v > 0.85 ? "mild" : v > 0.6 ? "moderate" : "severe",
  // Mitral stenosis valve area: progressive (mild) >2.5, progressive
  // (moderate) 2.5-1.6, severe <=1.5 cm². The source table leaves a gap
  // between 1.5 and 1.6; anything above 1.5 is treated as moderate.
  mvaVti: v => v > 2.5 ? "mild" : v > 1.5 ? "moderate" : "severe",
  mvaPht: v => v > 2.5 ? "mild" : v > 1.5 ? "moderate" : "severe",
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
  // Prosthetic MV, Table 11 (Zoghbi et al. 2024): Normal / Possible
  // stenosis / Suggests significant stenosis, for mechanical and biological
  // valves alike (the table notes slightly higher peak E, mean gradient and
  // DVI cutoffs may apply to some bioprostheses). "stenosis" here is the
  // table's "suggests significant stenosis" column. Only used when
  // state.prostheticMV is on — see computeResults.
  // Peak E: <1.9 / 1.9-2.5 / >=2.5 m/s (2.5 itself is significant).
  mvPeakE: v => v < 1.9 ? "normal" : v < 2.5 ? "possibleStenosis" : "stenosis",
  // Mean gradient: <=5 / 6-10 / >10 mmHg — the source leaves a 5-6 gap;
  // anything above 5 is treated as possible stenosis.
  mvMeanGradient: v => v <= 5 ? "normal" : v <= 10 ? "possibleStenosis" : "stenosis",
  // DVI (VTI PrMV / VTI LVOT): <2.2 / 2.2-2.5 / >2.5.
  mvDvi: v => v < 2.2 ? "normal" : v <= 2.5 ? "possibleStenosis" : "stenosis",
  // EOA: >=2.0 / 1-2 / <1 cm². (Graded a second way, against the selected
  // valve's own reference EOA, by gradeMvEoaVsReference — per user
  // direction both are shown, on separate rows.)
  mvEoa: v => v >= 2.0 ? "normal" : v >= 1 ? "possibleStenosis" : "stenosis",
  // PHT: <130 / 130-200 / >200 ms. Replaces the native "MVA (PHT)" row in
  // prosthetic mode — the guideline warns 220/PHT is inaccurate for
  // prostheses (overestimates EOA, particularly in normal valves).
  mvPht: v => v < 130 ? "normal" : v <= 200 ? "possibleStenosis" : "stenosis",
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
// Prosthetic MV EOAi grading, Table 7 "Mitral EOA*" row: BMI < 30 kg/m²
// normal >1.2, moderate 1.2-0.91, severe <=0.90 cm²/m²; BMI >= 30 normal
// >1.0, moderate 1.0-0.76, severe <=0.75. Same precomputed-grade path as
// gradeEoaiPPM above.
/**
 * @param {number} eoai
 * @param {number} bmi
 * @returns {string}
 */
const gradeMvEoaiPPM = (eoai, bmi) => {
  if (bmi >= 30) return eoai > 1.0 ? "normal" : eoai > 0.75 ? "moderate" : "severe";
  return eoai > 1.2 ? "normal" : eoai > 0.90 ? "moderate" : "severe";
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
      outcome1a: "Normál", outcome1b: "aorta", outcome1c: "műbillentyű",
      outcome2a: "Lehetséges", outcome2b: "stenosis", outcome3: "Stenosis",
      eoaiHigh: "EOAi > 0,85", eoaiHighLabel: "Magas flow",
      eoaiLow: "EOAi < 0,85", eoaiLowLabel: "PPM",
    }
    : {
      caption: "The ASE 2024 decision algorithm for an elevated prosthetic aortic valve gradient.",
      trigger1: "Prosthetic aortic valve", trigger2: "Vmax > 3 m/s",
      earlyTitle: "Early-peaking jet", earlyAt: "AT < 100 ms", earlyRatio: "AT/ET < 0.37",
      lateTitle: "Late-peaking jet", lateAt: "AT > 100 ms", lateRatio: "AT/ET > 0.37",
      dvi1: "DVI ≥ 0.30", dvi2: "DVI 0.25–0.29", dvi3: "DVI < 0.25",
      outcome1a: "Normal", outcome1b: "prosthetic", outcome1c: "aortic valve",
      outcome2a: "Possible", outcome2b: "stenosis", outcome3: "Stenosis",
      eoaiHigh: "EOAi > 0.85", eoaiHighLabel: "High-flow",
      eoaiLow: "EOAi < 0.85", eoaiLowLabel: "PPM",
    };
  return `
    <figure class="wiki-figure">
      <svg viewBox="0 0 380 380" role="img" aria-label="${t.caption}">
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
        <text x="65" y="260" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--grade-mild-text)">${t.outcome1a}</text>
        <text x="65" y="271" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--grade-mild-text)">${t.outcome1b}</text>
        <text x="65" y="282" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--grade-mild-text)">${t.outcome1c}</text>

        <rect x="140" y="242" width="100" height="52" rx="10" fill="var(--grade-moderate-bg)"></rect>
        <text x="190" y="264" text-anchor="middle" font-size="11" font-weight="700" fill="var(--grade-moderate-text)">${t.outcome2a}</text>
        <text x="190" y="279" text-anchor="middle" font-size="11" font-weight="700" fill="var(--grade-moderate-text)">${t.outcome2b}</text>

        <rect x="265" y="242" width="100" height="52" rx="10" fill="var(--grade-severe-bg)"></rect>
        <text x="315" y="272" text-anchor="middle" font-size="11" font-weight="700" fill="var(--grade-severe-text)">${t.outcome3}</text>

        <!-- The Normal outcome splits further by EOAi (folded in from what
             used to be a separate footnote — see figureNotes above this
             function's call site): a high-flow state raises Vmax the same
             way stenosis does but isn't stenosis, while PPM is a mismatch
             between a normally-functioning valve and the patient's body
             size, not valve dysfunction either. Both still read as
             "Normal" (mild-colored), just split two ways under it. -->
        <line x1="65" y1="294" x2="39" y2="312" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#av-arrow)"></line>
        <line x1="65" y1="294" x2="123" y2="312" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#av-arrow)"></line>

        <rect x="0" y="314" width="78" height="56" rx="10" fill="var(--grade-mild-bg)" opacity="0.6" stroke="var(--grade-mild-text)" stroke-opacity="0.3" stroke-width="1"></rect>
        <text x="39" y="335" text-anchor="middle" font-size="11" font-weight="700" fill="var(--grade-mild-text)">${t.eoaiHigh}</text>
        <text x="39" y="350" text-anchor="middle" font-size="11" fill="var(--grade-mild-text)">${t.eoaiHighLabel}</text>

        <rect x="84" y="314" width="78" height="56" rx="10" fill="var(--grade-mild-bg)" opacity="0.6" stroke="var(--grade-mild-text)" stroke-opacity="0.3" stroke-width="1"></rect>
        <text x="123" y="335" text-anchor="middle" font-size="11" font-weight="700" fill="var(--grade-mild-text)">${t.eoaiLow}</text>
        <text x="123" y="350" text-anchor="middle" font-size="11" fill="var(--grade-mild-text)">${t.eoaiLowLabel}</text>
      </svg>
      <figcaption>${t.caption}</figcaption>
    </figure>
  `;
}

// Inline SVG for the "prosthetic mitral valve regurgitation" integration
// algorithm (Zoghbi et al. 2024, Figure 21), same technique and color
// language as avAlgorithmFigure above: mild/moderate/severe columns reuse
// the --grade-mild/-moderate/-severe tokens. Laid out for phone width, so
// the long "specific criteria" bullet lists and the footnotes live in
// severityInfo.mvProsthetic.figureNotes as prose instead of inside the
// boxes. The "intermediate values + 3 specific criteria for severe MR ->
// severe" elbow is marked with † here and spelled out in those notes, since
// its source label doesn't fit between the boxes at this width.
function mvrAlgorithmFigure(lang) {
  const t = lang === "hu"
    ? {
      caption: "Az ASE 2024 algoritmusa az MR súlyosságának többparaméteres megítélésére mitrális billentyűcsere után.",
      title: "Mitrális műbillentyű regurgitáció",
      q1: "Teljesíti-e az MR az enyhe vagy", q2: "súlyos MR specifikus kritériumait?",
      yesMild: "Igen, enyhe", yesSevere: "Igen, súlyos",
      mild: ["Enyhe MR", "specifikus", "kritériumai*"],
      mid: ["Köztes értékek:", "MR valószínűleg", "közepes"],
      severe: ["Súlyos MR", "specifikus", "kritériumai*"],
      twoThree: "2–3 kritérium",
      quant1: "Kvantitatív módszerek", quant2: "alkalmazása, ahol lehetséges",
      defMild: "≥4 kritérium: biztosan enyhe", defSevere: "≥4 kritérium: biztosan súlyos",
      qMild: ["RVol < 30 ml", "RF < 30%", "EROA < 0,2 cm²**"],
      qMid: ["RVol 30–59 ml¶", "RF 30–49%", "EROA 0,2–0,39**"],
      qSevere: ["RVol ≥ 60 ml¶", "RF ≥ 50%", "EROA ≥ 0,4 cm²**"],
      outMild: "Enyhe MR", outMid: "Közepes MR", outSevere: "Súlyos MR",
      indLeft: ["Rossz TTE képminőség vagy", "bizonytalan Doppler mérés;", "ellentmondó adatok"],
      ind1: "Nem eldönthető MR", ind2: "TEE vagy CMR javasolt",
    }
    : {
      caption: "The ASE 2024 algorithm for integrating multiple parameters of MR severity after mitral valve replacement.",
      title: "Prosthetic mitral valve regurgitation",
      q1: "Does MR meet specific criteria", q2: "for mild or severe MR?",
      yesMild: "Yes, mild", yesSevere: "Yes, severe",
      mild: ["Specific criteria", "for mild MR*", "(list below)"],
      mid: ["Intermediate", "values: MR", "probably moderate"],
      severe: ["Specific criteria", "for severe MR*", "(list below)"],
      twoThree: "2–3 criteria",
      quant1: "Perform quantitative methods", quant2: "whenever possible",
      defMild: "≥4 criteria: definitely mild", defSevere: "≥4 criteria: definitely severe",
      qMild: ["RVol < 30 ml", "RF < 30%", "EROA < 0.2 cm²**"],
      qMid: ["RVol 30–59 ml¶", "RF 30–49%", "EROA 0.2–0.39**"],
      qSevere: ["RVol ≥ 60 ml¶", "RF ≥ 50%", "EROA ≥ 0.4 cm²**"],
      outMild: "Mild MR", outMid: "Moderate MR", outSevere: "Severe MR",
      indLeft: ["Poor TTE quality or low", "confidence in Doppler data;", "discordant findings"],
      ind1: "Indeterminate MR", ind2: "Consider TEE or CMR",
    };
  // Three stacked lines of text centered at x, starting at baseline y.
  const lines = (arr, x, y, step, size, fill, boldFirst = false) => arr.map((s, i) =>
    `<text x="${x}" y="${y + i * step}" text-anchor="middle" font-size="${size}" font-weight="${boldFirst && i > 0 ? 400 : 700}" fill="${fill}">${s}</text>`).join("");
  const arrow = (x1, y1, x2, y2) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#mvr-arrow)"></line>`;
  const g = { mild: "var(--grade-mild-", mid: "var(--grade-moderate-", sev: "var(--grade-severe-" };
  return `
    <figure class="wiki-figure">
      <svg viewBox="0 0 380 432" role="img" aria-label="${t.caption}">
        <defs>
          <marker id="mvr-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--text-sub)"></path>
          </marker>
        </defs>

        <!-- Title + question -->
        <rect x="60" y="6" width="260" height="28" rx="10" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.5"></rect>
        <text x="190" y="24" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text-main)">${t.title}</text>
        ${arrow(190, 34, 190, 46)}
        <rect x="40" y="48" width="300" height="40" rx="10" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.5"></rect>
        ${lines([t.q1, t.q2], 190, 64, 15, 11, "var(--text-main)")}

        <!-- Branches to the three criteria columns -->
        ${arrow(110, 88, 70, 112)}
        ${arrow(190, 88, 190, 112)}
        ${arrow(270, 88, 310, 112)}
        <text x="82" y="102" text-anchor="end" font-size="9.5" fill="var(--text-sub)">${t.yesMild}</text>
        <text x="298" y="102" text-anchor="start" font-size="9.5" fill="var(--text-sub)">${t.yesSevere}</text>

        <rect x="5" y="114" width="118" height="50" rx="10" fill="${g.mild}bg)"></rect>
        ${lines(t.mild, 64, 130, 13, 10, `${g.mild}text)`, true)}
        <rect x="131" y="114" width="118" height="50" rx="10" fill="${g.mid}bg)"></rect>
        ${lines(t.mid, 190, 130, 13, 10, `${g.mid}text)`)}
        <rect x="257" y="114" width="118" height="50" rx="10" fill="${g.sev}bg)"></rect>
        ${lines(t.severe, 316, 130, 13, 10, `${g.sev}text)`, true)}

        <!-- 2-3 criteria / intermediate -> quantitative methods -->
        ${arrow(92, 164, 104, 188)}
        ${arrow(190, 164, 190, 188)}
        ${arrow(288, 164, 276, 188)}
        <text x="58" y="182" text-anchor="middle" font-size="9" fill="var(--text-sub)">${t.twoThree}</text>
        <text x="200" y="180" text-anchor="start" font-size="9" fill="var(--text-sub)">**</text>
        <text x="322" y="182" text-anchor="middle" font-size="9" fill="var(--text-sub)">${t.twoThree}</text>
        <rect x="40" y="190" width="300" height="36" rx="8" fill="none" stroke="var(--text-sub)" stroke-width="1.2" stroke-dasharray="4 3"></rect>
        ${lines([t.quant1, t.quant2], 190, 205, 14, 10.5, "var(--text-main)")}

        <!-- >=4 criteria bypasses straight to the outcome -->
        <line x1="8" y1="164" x2="8" y2="328" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#mvr-arrow)"></line>
        <line x1="372" y1="164" x2="372" y2="328" stroke="var(--text-sub)" stroke-width="1.5" marker-end="url(#mvr-arrow)"></line>
        <text transform="translate(19 300) rotate(-90)" font-size="8.5" fill="var(--text-sub)">${t.defMild}</text>
        <text transform="translate(361 172) rotate(90)" font-size="8.5" fill="var(--text-sub)">${t.defSevere}</text>

        <!-- Quantitative bands -->
        ${arrow(110, 226, 70, 244)}
        ${arrow(190, 226, 190, 244)}
        ${arrow(270, 226, 310, 244)}
        <rect x="20" y="246" width="98" height="48" rx="8" fill="${g.mild}bg)"></rect>
        ${lines(t.qMild, 69, 261, 13, 9, `${g.mild}text)`)}
        <rect x="141" y="246" width="98" height="48" rx="8" fill="${g.mid}bg)"></rect>
        ${lines(t.qMid, 190, 261, 13, 9, `${g.mid}text)`)}
        <rect x="262" y="246" width="98" height="48" rx="8" fill="${g.sev}bg)"></rect>
        ${lines(t.qSevere, 311, 261, 13, 9, `${g.sev}text)`)}

        <!-- Down to outcomes; † = intermediate values + 3 specific severe criteria -> severe -->
        ${arrow(69, 294, 66, 328)}
        ${arrow(190, 294, 190, 328)}
        ${arrow(311, 294, 314, 328)}
        <path d="M239,282 H250 L270,328" fill="none" stroke="var(--text-sub)" stroke-width="1.2" stroke-dasharray="3 2" marker-end="url(#mvr-arrow)"></path>
        <text x="252" y="308" font-size="10" font-weight="700" fill="var(--text-sub)">†</text>

        <rect x="5" y="330" width="118" height="30" rx="10" fill="${g.mild}bg)" stroke="${g.mild}text)" stroke-opacity="0.35"></rect>
        <text x="64" y="350" text-anchor="middle" font-size="12" font-weight="700" fill="${g.mild}text)">${t.outMild}</text>
        <rect x="131" y="330" width="118" height="30" rx="10" fill="${g.mid}bg)" stroke="${g.mid}text)" stroke-opacity="0.35"></rect>
        <text x="190" y="350" text-anchor="middle" font-size="12" font-weight="700" fill="${g.mid}text)">${t.outMid}</text>
        <rect x="257" y="330" width="118" height="30" rx="10" fill="${g.sev}bg)" stroke="${g.sev}text)" stroke-opacity="0.35"></rect>
        <text x="316" y="350" text-anchor="middle" font-size="12" font-weight="700" fill="${g.sev}text)">${t.outSevere}</text>

        <!-- Indeterminate -->
        <rect x="5" y="372" width="200" height="52" rx="8" fill="var(--subtle-bg)" stroke="var(--divider)" stroke-width="1.2"></rect>
        ${lines(t.indLeft, 105, 390, 13, 9.5, "var(--text-sub)")}
        ${arrow(205, 398, 225, 398)}
        <rect x="227" y="372" width="148" height="52" rx="8" fill="var(--subtle-bg)" stroke="var(--text-sub)" stroke-width="1.5"></rect>
        ${lines([t.ind1, t.ind2], 301, 393, 16, 11, "var(--text-main)", true)}
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
        // "Possible stenosis" is the longest header by far; narrowing its
        // column and letting it wrap onto two lines (wrapHeaders) keeps it
        // from otherwise forcing the whole table wider than a phone screen.
        wrapHeaders: true,
        colWidths: ["29%", "24%", "24%", "23%"],
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
        "Possible stenosis — other possible causes: prosthesis-patient mismatch with a narrow LVOT, an incorrectly positioned LVOT PW Doppler sample volume, or underestimation of jet Doppler velocity.",
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
    // Prosthetic MV (Zoghbi et al. 2024). Like avProsthetic, tables are
    // numbered locally ("Table 1"-"Table 4"), not by their source numbers
    // (Tables 11, 7, 12 and 13; the figure is Figure 21) — see CLAUDE.md.
    // tableBeforeFigure is an array here (several tables before the
    // figure); renderInfo accepts either a single spec or an array.
    mvProsthetic: {
      title: "Prosthetic Mitral Valve",
      tableBeforeFigure: [
        {
          heading: "Table 1 — Doppler Findings Suggestive of Prosthetic Mitral Stenosis",
          headers: ["Parameter", "Normal", "Possible stenosis", "Suggests significant stenosis"],
          wrapHeaders: true,
          colWidths: ["31%", "21%", "24%", "24%"],
          rows: [
            ["Peak velocity (m/s)†", "<1.9", "1.9–2.5", "≥2.5"],
            ["Mean gradient (mmHg)†", "≤5", "6–10", ">10"],
            ["VTI PrMV / VTI LVOT (DVI)†", "<2.2", "2.2–2.5", ">2.5"],
            ["EOA (cm²)", "≥2.0", "1–2", "<1"],
            ["PHT (ms)", "<130", "130–200", ">200"],
          ],
        },
        {
          heading: "Table 2 — Mitral Prosthesis-Patient Mismatch (EOAi, cm²/m²)",
          headers: ["BMI", "Normal", "Moderate PPM", "Severe PPM"],
          wrapHeaders: true,
          colWidths: ["31%", "23%", "23%", "23%"],
          rows: [
            ["< 30 kg/m²", ">1.2", "1.2–0.91", "≤0.90"],
            ["≥ 30 kg/m²", ">1.0", "1.0–0.76", "≤0.75"],
          ],
        },
        {
          heading: "Table 3 — TTE Findings Suggestive of Significant Prosthetic MR (Mechanical Valves, Normal PHT)",
          // Sensitivity and specificity share one column so the table fits a
          // phone screen without horizontal scrolling.
          headers: ["Finding", "Sens. / spec.", "Comments"],
          plainHeaders: true,
          wrapHeaders: true,
          colWidths: ["34%", "24%", "42%"],
          rows: [
            ["Peak mitral velocity ≥1.9 m/s*", "90% / 89%", "Also consider high flow, PPM"],
            ["VTI PrMV / VTI LVOT ≥2.5*", "89% / 91%", "Measurement errors increase in atrial fibrillation; also consider PPM"],
            ["Mean gradient ≥5 mmHg*", "90% / 70%", "At physiologic heart rates; also consider high flow, PPM"],
            ["Maximal TR jet velocity >3 m/s*", "80% / 71%", "Consider residual postoperative pulmonary hypertension or other causes"],
            ["LV stroke volume (2D/3D) >30% higher than systemic Doppler stroke volume", "Moderate / specific", "Validation lacking; suspect significant MR when LV function is normal or hyperdynamic and LVOT VTI is small (<16 cm)"],
            ["Systolic flow convergence in the LV toward the prosthesis", "Low / specific", "Validation lacking; technically challenging to detect"],
          ],
        },
      ],
      figure: mvrAlgorithmFigure("en"),
      figureNotes: [
        "Specific criteria for mild MR: small, narrow central jet; VC width ≤0.3 cm; VC area <0.2 cm²; PISA radius absent or ≤0.3 cm at a Nyquist limit of 30–40 cm/s; mitral A-wave-dominant inflow; soft or incomplete jet by CW Doppler.",
        "Specific criteria for severe MR: valve dehiscence, incomplete occluder closure or a flail bioprosthetic leaflet; VC width ≥0.7 cm or ≥2 moderate jets; VC area (1 or 2 jets) ≥0.4 cm²; PISA radius ≥1.0 cm at a Nyquist limit of 30–40 cm/s**; central large jet >50% of LA area; pulmonary vein systolic flow reversal.",
        "≥4 specific criteria: definitely mild/severe. 2–3 criteria, or intermediate values: perform quantitative methods whenever possible. † Intermediate quantitative values together with 3 specific criteria for severe MR: severe MR.",
        "Poor TTE quality, low confidence in the measured Doppler parameters, or discordant quantitative, qualitative and/or clinical data: MR is indeterminate — consider TEE or CMR.",
        "* Color Doppler on TTE can underestimate MR severity because of flow masking (particularly in mechanical valves) and in eccentric, wall-impinging jets. ** EROA by PISA may overestimate severity if the PISA is ovoid, constrained by the LV wall. ¶ Regurgitant volume cutoffs for severe MR may be lower in low-flow conditions.",
      ],
      tableAfterFigure: {
        heading: "Table 4 — Severity of Prosthetic Mitral Regurgitation (TTE and TEE)",
        headers: ["Parameter", "Mild", "Moderate", "Severe"],
        wrapHeaders: true,
        colWidths: ["25%", "25%", "22%", "28%"],
        rows: [
          ["LV size", "Normal‡", "Normal or dilated", "Usually dilated"],
          ["Prosthetic valve", "Usually normal", "Abnormal§", "Abnormal§"],
          ["Color flow jet area", "Small, central (usually <4 cm² or <20% of LA area)", "Variable", "Large central (usually >8 cm² or >50% of LA area) or variable-size wall-impinging jet swirling in the LA"],
          ["Flow convergence", "None or minimal", "Intermediate", "Large"],
          ["Jet density (CW)", "Incomplete or faint", "Dense", "Dense"],
          ["Jet contour (CW)", "Parabolic", "Usually parabolic", "Early peaking: triangular"],
          ["Pulmonary venous flow", "Systolic dominance", "Systolic blunting", "Systolic flow reversal"],
          ["VC width (cm)", "<0.3", "0.3–0.69", "≥0.7"],
          ["RVol (ml/beat)", "<30", "30–59", "≥60"],
          ["RF (%)", "<30", "30–49", "≥50"],
          ["EROA (cm²)", "<0.20", "0.20–0.39", "≥0.40"],
        ],
      },
      notes: [
        "Table 1 applies to mechanical and biological valves alike; diagnostic accuracy is best when most parameters are normal, or most are abnormal. Values in the \"Possible stenosis\" column should prompt a closer look at valve function and at increased flow, increased heart rate, or PPM. † These parameters are also abnormal with significant prosthetic MR, and slightly higher cutoffs may be seen in some bioprostheses. Report the heart rate at which gradients were measured.",
        "EOA should be calculated with the continuity equation (stroke volume through the LVOT ÷ VTI through the prosthesis, when there's no significant AR). EOA from PHT (220/PHT) is frequently inaccurate for prostheses and overestimates EOA, so this app hides MVA (PHT) in prosthetic mode and grades PHT directly instead.",
        "Table 2: PPM is graded only when valve structure and motion are normal and the measured EOA is within 1 SD of the reference EOA. BMI is calculated in the background from weight/height, so this badge needs both (not a manually entered BSA).",
        "Table 3 (data from Olmos et al.): when both peak velocity and the VTI ratio are elevated with a normal PHT, specificity for significant MR is close to 100%.",
        "Table 4: ‡ LV size applies only to chronic lesions. § Abnormal mechanical valve: e.g. immobile occluder (valvular) or dehiscence/rocking (paravalvular regurgitation); abnormal biological valve: e.g. leaflet thickening or prolapse (valvular) or dehiscence/rocking (paravalvular). The quantitative parameters are less well validated than in native MR. In prosthetic mode, this app grades MR ERO with Table 4's cutoff (≥0.40 cm² severe).",
        "How this app grades: peak E, mean gradient, DVI, EOA and PHT use Table 1. \"MV EOA vs. valve reference\" compares the measured EOA with the selected valve/size's own reference EOA (in SDs from its mean): within 1 SD below is normal, 1–2 SD below possible stenosis, more than 2 SD below stenosis. The guideline gives these SD bands only for aortic prostheses, so applying them to mitral valves is an extrapolation.",
        "The overall \"Prosthetic MV assessment\" combines Tables 1 and 3; the guideline has no algorithm figure for prosthetic mitral stenosis. It needs PHT plus at least one of peak E, mean gradient or DVI. With a normal PHT (<130 ms): peak E ≥1.9 and DVI ≥2.5 suggest significant MR; any other raised value (peak E ≥1.9, mean gradient >5, DVI ≥2.2) flags MR, high flow or PPM; otherwise normal. PHT 130–200 ms: possible stenosis. PHT >200 ms: significant stenosis if any of those is raised, discordant if none is.",
      ],
    },
    ms: {
      title: "Mitral Stenosis",
      headers: ["Parameter", "Progressive (Mild)", "Progressive (Moderate)", "Severe"],
      rows: [
        ["Valve area (cm²)", ">2.5", "2.5–1.6", "≤1.5"],
        ["Pressure half-time (ms)", "<100", "100–149", "≥150"],
        ["Mean gradient (mmHg)*", "<5", "5–9", "≥10"],
        ["Systolic pulmonary artery pressure (mmHg)", "<30", "30–49", "≥50"],
      ],
      notes: [
        "*At a heart rate of 60–80 beats per minute.",
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
        wrapHeaders: true,
        colWidths: ["28%", "24%", "23%", "25%"],
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
        "Lehetséges stenosis — lehetséges egyéb okok: műbillentyű-stenosis szűk LVOT-val, a LVOT PW Doppler helytelen pozíciója, vagy Vmax alulbecslés - jet doppler sebességének alulbecslése.",
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
        "Az EOAi értékelését a patient-prosthesis mismatch határértékei alapján végezzük, amelyek a BMI-től függenek (háttérben, testsúlyból és testmagasságból számítva): >0,85 cm²/m² normális 30 kg/m² alatti BMI mellett (>0,70 cm²/m² 30 kg/m² fölött), és ≤0,65 cm²/m² (≤0,55 cm²/m² 30 kg/m² BMI fölött) súlyos mismatchre utal.",
        "A 2. táblázat (fent, strukturális műbillentyű-degeneráció) soros vizsgálatokat hasonlít össze, nem abszolút súlyossági fokozatot állapít meg, ezért nincs \"Normális\" oszlopa — a „Lehetséges SVD” határérték alatti változás egyszerűen nem SVD. Kombinált stenosis és regurgitáció esetén az SVD alacsonyabb határértékeknél is fennállhat.",
      ],
    },
    mvProsthetic: {
      title: "Mitrális műbillentyű",
      tableBeforeFigure: [
        {
          heading: "1. táblázat — Mitrális műbillentyű-stenosisra utaló Doppler eltérések",
          headers: ["Paraméter", "Normális", "Lehetséges stenosis", "Jelentős stenosisra utal"],
          wrapHeaders: true,
          colWidths: ["31%", "21%", "24%", "24%"],
          rows: [
            ["Csúcssebesség (m/s)†", "<1,9", "1,9–2,5", "≥2,5"],
            ["Átlag grádiens (Hgmm)†", "≤5", "6–10", ">10"],
            ["VTI PrMV / VTI LVOT (DVI)†", "<2,2", "2,2–2,5", ">2,5"],
            ["EOA (cm²)", "≥2,0", "1–2", "<1"],
            ["PHT (ms)", "<130", "130–200", ">200"],
          ],
        },
        {
          heading: "2. táblázat — Mitrális patient-prosthesis mismatch (EOAi, cm²/m²)",
          headers: ["BMI", "Normális", "Közepes PPM", "Súlyos PPM"],
          wrapHeaders: true,
          colWidths: ["31%", "23%", "23%", "23%"],
          rows: [
            ["< 30 kg/m²", ">1,2", "1,2–0,91", "≤0,90"],
            ["≥ 30 kg/m²", ">1,0", "1,0–0,76", "≤0,75"],
          ],
        },
        {
          heading: "3. táblázat — Jelentős műbillentyű MR-re utaló TTE eltérések (mechanikus billentyű, normál PHT)",
          headers: ["Eltérés", "Szenz. / spec.", "Megjegyzés"],
          plainHeaders: true,
          wrapHeaders: true,
          colWidths: ["34%", "24%", "42%"],
          rows: [
            ["Mitrális csúcssebesség ≥1,9 m/s*", "90% / 89%", "Gondolj magas flow-ra, PPM-re is"],
            ["VTI PrMV / VTI LVOT ≥2,5*", "89% / 91%", "Pitvarfibrillációban nő a mérési hiba; gondolj PPM-re is"],
            ["Átlag grádiens ≥5 Hgmm*", "90% / 70%", "Fiziológiás szívfrekvencián; gondolj magas flow-ra, PPM-re is"],
            ["Maximális TR jet sebesség >3 m/s*", "80% / 71%", "Gondolj reziduális posztoperatív pulmonalis hypertoniára vagy egyéb okra"],
            ["2D/3D bal kamrai verővolumen >30%-kal nagyobb a Doppler szisztémás verővolumennél", "Közepes / specifikus", "Nem validált; jelentős MR gyanúja normál vagy hiperdinám bal kamrai funkció és kis LVOT VTI (<16 cm) esetén"],
            ["Szisztolés flow-konvergencia a bal kamrában a műbillentyű felé", "Alacsony / specifikus", "Nem validált; technikailag nehezen észlelhető"],
          ],
        },
      ],
      figure: mvrAlgorithmFigure("hu"),
      figureNotes: [
        "Az enyhe MR specifikus kritériumai: kicsi, keskeny centrális jet; VC szélesség ≤0,3 cm; VC terület <0,2 cm²; PISA radius nincs vagy ≤0,3 cm 30–40 cm/s Nyquist-határnál; A-hullám domináns mitrális beáramlás; halvány vagy hiányos jet CW Dopplerrel.",
        "A súlyos MR specifikus kritériumai: billentyű-dehiscencia, az occluder hiányos záródása vagy flail biológiai vitorla; VC szélesség ≥0,7 cm vagy ≥2 közepes jet; VC terület (1 vagy 2 jet) ≥0,4 cm²; PISA radius ≥1,0 cm 30–40 cm/s Nyquist-határnál**; nagy centrális jet a bal pitvar területének >50%-a; pulmonalis vénás szisztolés reverz flow.",
        "≥4 specifikus kritérium: biztosan enyhe/súlyos. 2–3 kritérium vagy köztes értékek: kvantitatív módszerek, ahol lehetséges. † Köztes kvantitatív értékek és 3 súlyos MR-re specifikus kritérium együtt: súlyos MR.",
        "Rossz TTE képminőség, a mért Doppler paraméterek bizonytalansága, vagy ellentmondó kvantitatív, kvalitatív és/vagy klinikai adatok esetén az MR nem eldönthető — TEE vagy CMR javasolt.",
        "* A TTE color Doppler alábecsülheti az MR súlyosságát a flow-maszkolás miatt (főleg mechanikus billentyűknél), illetve excentrikus, falhoz tapadó jeteknél. ** A PISA-alapú EROA túlbecsülheti a súlyosságot, ha a PISA ovális, a bal kamra fala által korlátozott. ¶ Alacsony flow mellett a súlyos MR regurgitációs volumen határértéke alacsonyabb lehet.",
      ],
      tableAfterFigure: {
        heading: "4. táblázat — A mitrális műbillentyű-regurgitáció súlyossága (TTE és TEE)",
        headers: ["Paraméter", "Enyhe", "Közepes", "Súlyos"],
        wrapHeaders: true,
        colWidths: ["25%", "25%", "22%", "28%"],
        rows: [
          ["Bal kamra mérete", "Normális‡", "Normális vagy tágult", "Általában tágult"],
          ["Műbillentyű", "Általában normális", "Kóros§", "Kóros§"],
          ["Color jet területe", "Kicsi, centrális (általában <4 cm² vagy a bal pitvar <20%-a)", "Változó", "Nagy centrális (általában >8 cm² vagy a bal pitvar >50%-a) vagy változó méretű, falhoz tapadó, a pitvarban örvénylő jet"],
          ["Flow-konvergencia", "Nincs vagy minimális", "Köztes", "Nagy"],
          ["Jet denzitás (CW)", "Hiányos vagy halvány", "Denz", "Denz"],
          ["Jet kontúr (CW)", "Parabolikus", "Általában parabolikus", "Korai csúcsú: háromszög"],
          ["Pulmonalis vénás áramlás", "Szisztolés dominancia", "Szisztolés „blunting”", "Szisztolés reverz flow"],
          ["VC szélesség (cm)", "<0,3", "0,3–0,69", "≥0,7"],
          ["RVol (ml/ütés)", "<30", "30–59", "≥60"],
          ["RF (%)", "<30", "30–49", "≥50"],
          ["EROA (cm²)", "<0,20", "0,20–0,39", "≥0,40"],
        ],
      },
      notes: [
        "Az 1. táblázat mechanikus és biológiai billentyűkre egyaránt vonatkozik; a diagnosztikus pontosság akkor a legjobb, ha a paraméterek többsége normális, vagy többsége kóros. A „Lehetséges stenosis” oszlop értékei a billentyűfunkció alaposabb vizsgálatára, illetve fokozott flow, magas szívfrekvencia vagy PPM mérlegelésére kell, hogy késztessenek. † Ezek a paraméterek jelentős műbillentyű MR esetén is kórosak, és egyes biológiai billentyűknél kissé magasabb határértékek is előfordulhatnak. A grádiensek mellett a mérés közbeni szívfrekvenciát is rögzíteni kell.",
        "Az EOA-t a kontinuitási egyenlettel kell számolni (LVOT verővolumen ÷ a műbillentyűn mért VTI, ha nincs jelentős AR). A PHT-ból számolt EOA (220/PHT) műbillentyűknél gyakran pontatlan és túlbecsül, ezért az alkalmazás műbillentyű módban elrejti az MVA (PHT) sort, és helyette magát a PHT-t értékeli.",
        "2. táblázat: a PPM csak normális billentyűszerkezet és -mozgás mellett, és ha a mért EOA a referencia EOA 1 SD-n belül van, értékelhető. A BMI-t a háttérben, testsúlyból és testmagasságból számoljuk, ezért ehhez mindkettő kell (kézzel beírt BSA nem elég).",
        "3. táblázat (Olmos és mtsai adatai): ha normál PHT mellett a csúcssebesség és a VTI arány is emelkedett, a jelentős MR-re vonatkozó specificitás közel 100%.",
        "4. táblázat: ‡ A bal kamra mérete csak krónikus elváltozásnál értékelhető. § Kóros mechanikus billentyű: pl. mozdulatlan occluder (valvuláris) vagy dehiscencia/billegés (paravalvuláris regurgitáció); kóros biológiai billentyű: pl. vitorla-megvastagodás vagy prolapsus (valvuláris), illetve dehiscencia/billegés (paravalvuláris). A kvantitatív paraméterek kevésbé validáltak, mint natív MR-ben. Műbillentyű módban az alkalmazás az MR ERO-t a 4. táblázat határértékével értékeli (≥0,40 cm² súlyos).",
        "Az alkalmazás értékelése: a csúcs E, az átlag grádiens, a DVI, az EOA és a PHT az 1. táblázat szerint. Az „MV EOA a referenciához képest” sor a mért EOA-t a kiválasztott billentyű/méret saját referencia EOA-jához hasonlítja (az átlagtól mért SD-ben): legfeljebb 1 SD-vel alatta normális, 1–2 SD-vel alatta lehetséges stenosis, több mint 2 SD-vel alatta stenosis. Ezeket az SD-sávokat az irányelv csak aorta műbillentyűkre adja meg, így mitrális billentyűre alkalmazásuk extrapoláció.",
        "Az összesített „Mitrális műbillentyű értékelés” az 1. és 3. táblázatot kombinálja; az irányelvben nincs algoritmus-ábra a mitrális műbillentyű-stenosisra. PHT kell hozzá, plusz legalább egy a csúcs E, az átlag grádiens és a DVI közül. Normál PHT (<130 ms) mellett: csúcs E ≥1,9 és DVI ≥2,5 jelentős MR-re utal; bármely más emelkedett érték (csúcs E ≥1,9, átlag grádiens >5, DVI ≥2,2) MR-re, magas flow-ra vagy PPM-re utal; egyébként normális. PHT 130–200 ms: lehetséges stenosis. PHT >200 ms: jelentős stenosis, ha bármelyik emelkedett, ellentmondó, ha egyik sem.",
      ],
    },
    ms: {
      title: "Mitrális stenosis",
      headers: ["Paraméter", "Progresszív (enyhe)", "Progresszív (közepes)", "Súlyos"],
      rows: [
        ["Billentyűnyílás-terület (cm²)", ">2,5", "2,5–1,6", "≤1,5"],
        ["Pressure half-time (ms)", "<100", "100–149", "≥150"],
        ["Átlag grádiens (Hgmm)*", "<5", "5–9", "≥10"],
        ["Szisztolés pulmonalis artériás nyomás (Hgmm)", "<30", "30–49", "≥50"],
      ],
      notes: [
        "*60–80/perc szívfrekvencia mellett.",
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
    valvePeakVelocity: "Peak velocity", valvePht: "PHT",
    valveThirdPartyTag: "third-party data",
    valveThirdPartyNote: "Not from the official guideline: this valve is not included in Zoghbi et al. 2024 (ASE), so these values are third-party information and have not been verified against a primary source.",
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
    valvePeakVelocity: "Csúcssebesség", valvePht: "PHT",
    valveThirdPartyTag: "külső forrás",
    valveThirdPartyNote: "Nem a hivatalos irányelvből származik: ez a billentyű nem szerepel a Zoghbi et al. 2024 (ASE) irányelvben, ezért ezek az értékek harmadik féltől származó információk, és elsődleges forrással nem ellenőrizték őket.",
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
    mvProsthetic: "Prosthetic mitral valve reference",
  },
  hu: {
    mr: "Mitrális regurgitáció súlyossági referencia",
    ar: "Aorta regurgitáció súlyossági referencia",
    tr: "Tricuspidalis regurgitáció súlyossági referencia",
    as: "Aorta stenosis súlyossági referencia",
    ms: "Mitrális stenosis súlyossági referencia",
    avProsthetic: "Emelkedett aorta műbillentyű grádiens algoritmus",
    mvProsthetic: "Mitrális műbillentyű referencia",
  },
};
let currentInfoTopic = null;

// Builds the severity-table markup. Shared by the info overlay
// (severityInfo) and wiki bodies, so a table written in a wiki topic
// looks identical to the ones behind the calculator's ⓘ buttons —
// .info-table-wrap / .info-table are global CSS, not scoped to the info
// overlay, so this is safe to reuse anywhere in .wiki-body too.
// spec: { headers[], rows[], colWidths?, wide?, wrapHeaders?, plainHeaders? }
// plainHeaders skips the mild/moderate/severe header colors, for a table
// whose columns aren't severity grades (e.g. sensitivity/specificity).
// A row cell may be a plain string, or { text, span } for a colspan.
// wrapHeaders lets a long header (e.g. "Possible stenosis") wrap onto a
// second line instead of forcing its column wide enough for one — combine
// with a narrow colWidths entry for that column to actually shrink it.
function buildSeverityTable(spec) {
  const colClasses = ["", "col-mild", "col-moderate", "col-severe", "col-massive", "col-torrential"];
  const theadCells = spec.headers.map((h, i) => {
    const cls = spec.plainHeaders ? "" : colClasses[i] || "";
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
  // Skipped for percentage colWidths (wrapHeaders tables): there the whole
  // point is to fill the container's actual width, not a guessed px total.
  const usesPercentWidths = spec.colWidths && spec.colWidths.some(w => w.trim().endsWith("%"));
  const tableWidthPx = spec.colWidths && !usesPercentWidths
    ? spec.colWidths.reduce((sum, w) => sum + parseFloat(w), 0)
    : null;
  return `
    <div class="info-table-wrap">
      <table class="info-table${spec.wide ? " wide" : ""}${spec.wrapHeaders ? " wrap-headers" : ""}"${tableWidthPx ? ` style="width:${tableWidthPx}px"` : ""}>
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
  // Either may also be an array of specs (mvProsthetic has three tables
  // before its figure), rendered in order.
  const headedTables = (spec) => (spec ? [].concat(spec) : [])
    .map(t => (t.heading ? `<h3>${t.heading}</h3>` : "") + buildSeverityTable(t)).join("");
  const tableBeforeHtml = headedTables(info.tableBeforeFigure);
  const figureHtml = info.figure || "";
  // figureNotes are specifically about reading the figure/algorithm (e.g.
  // its footnotes, the outcomes it can produce) — rendered directly under
  // it rather than lumped in with the general `notes` at the very bottom,
  // since they're important context for the diagram right above them.
  const figureNotesHtml = info.figureNotes && info.figureNotes.length
    ? `<div class="info-notes"><ul>${info.figureNotes.map(n => `<li>${n}</li>`).join("")}</ul></div>`
    : "";
  const tableAfterHtml = headedTables(info.tableAfterFigure);
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

// ---- Prosthetic valve type/size picker (aortic + mitral) ----
// Type + size -> expected normal Doppler values, per Zoghbi et al. 2024
// (see prosthetic-data/aortic-valves.js and mitral-valves.js for the full
// citations and data-entry notes). Started as a display-only lookup, but
// the selection now also feeds grading: the aortic EOA badge
// (gradeEoaAgainstReference) and the mitral "EOA vs. reference" row
// (gradeMvEoaVsReference) both compare against the picked valve+size.
//
// One implementation serves both positions: valvePositions maps a position
// key ("av"/"mv") to its data file, the window global that file registers,
// and the ids of its own copy of the controls in index.html. The full-
// screen #valveOverlay is shared — activeValvePos records which position
// opened it. Selection state lives in state.valveSel[pos].
//
// Same lazy-load-on-first-need pattern as loadWikiTopicBody: the data
// isn't loaded until that position's prosthetic toggle is turned on or its
// picker is opened. Both files are still listed in sw.js PRECACHE_URLS, so
// they work offline too.
const valvePositions = {
  av: {
    src: "./prosthetic-data/aortic-valves.js", global: "prostheticAorticValves",
    categoryToggle: "#valveCategoryToggle", typeBtn: "#valveTypeBtn",
    sizeRow: "#valveSizeRow", sizeSelect: "#valveSizeSelect", reference: "#valveReference",
  },
  mv: {
    src: "./prosthetic-data/mitral-valves.js", global: "prostheticMitralValves",
    categoryToggle: "#mvValveCategoryToggle", typeBtn: "#mvValveTypeBtn",
    sizeRow: "#mvValveSizeRow", sizeSelect: "#mvValveSizeSelect", reference: "#mvValveReference",
  },
};
/** @type {Record<string, Promise<ProstheticValve[]>>} */
const valveDataPromises = {};
/**
 * @param {string} pos
 * @returns {Promise<ProstheticValve[]>}
 */
function loadProstheticValveData(pos) {
  const cfg = valvePositions[pos];
  if (window[cfg.global]) return Promise.resolve(window[cfg.global]);
  if (valveDataPromises[pos]) return valveDataPromises[pos];
  valveDataPromises[pos] = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = cfg.src;
    script.onload = () => {
      if (window[cfg.global]) resolve(window[cfg.global]);
      else reject(new Error(`${cfg.src} loaded but didn't register data`));
    };
    script.onerror = () => reject(new Error(`Failed to load ${cfg.src}`));
    document.head.appendChild(script);
  });
  return valveDataPromises[pos];
}

let valveSearchQuery = "";
// Which position ("av"/"mv") the shared #valveOverlay was opened for.
let activeValvePos = "av";
/**
 * @param {string} pos
 * @returns {ProstheticValve[]}
 */
function currentCategoryValves(pos) {
  return (window[valvePositions[pos].global] || []).filter(v => v.category === state.valveSel[pos].category);
}
/**
 * @param {string} pos
 * @returns {ProstheticValve | null}
 */
function selectedValve(pos) {
  return (window[valvePositions[pos].global] || []).find(v => v.name === state.valveSel[pos].name) || null;
}
/**
 * @param {string} pos
 * @returns {ProstheticValveSize | null}
 */
function selectedValveSize(pos) {
  const valve = selectedValve(pos);
  return (valve && valve.sizes.find(s => s.size === state.valveSel[pos].size)) || null;
}
function renderValvePickerList() {
  const query = valveSearchQuery.trim();
  const list = currentCategoryValves(activeValvePos);
  const matches = query ? list.filter(v => foldWikiText(v.name).includes(foldWikiText(query))) : list;
  $("#valvePickerContent").innerHTML = matches.length
    ? `<div class="wiki-topic-list">${matches.map(v => `
        <button class="wiki-topic-item" type="button" data-valve="${v.name}">
          <span class="wiki-topic-title">${v.name}${v.thirdParty ? ` <span class="valve-third-party-tag">${uiStrings[state.language].valveThirdPartyTag}</span>` : ""}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>
        </button>`).join("")}</div>`
    : `<div class="wiki-empty">${uiStrings[state.language].noResults}</div>`;
  $$("[data-valve]", $("#valvePickerContent")).forEach(btn => {
    btn.addEventListener("click", () => selectProstheticValve(btn.dataset.valve));
  });
}
/** @param {string} pos */
function openValvePicker(pos) {
  activeValvePos = pos;
  valveSearchQuery = "";
  /** @type {HTMLInputElement} */ ($("#valveSearchInput")).value = "";
  // Cleared first so the other position's list never flashes while this
  // position's data loads.
  $("#valvePickerContent").innerHTML = "";
  $("#valveOverlay").hidden = false;
  setupOverlay($("#valveSearchInput"));
  loadProstheticValveData(pos).then(renderValvePickerList).catch(err => {
    console.error(err);
    $("#valvePickerContent").innerHTML = `<div class="wiki-empty">${uiStrings[state.language].wikiBodyLoadFailed}</div>`;
  });
}
function closeValvePicker() {
  $("#valveOverlay").hidden = true;
  teardownOverlay();
}
function selectProstheticValve(name) {
  const pos = activeValvePos;
  state.valveSel[pos].name = name;
  state.valveSel[pos].size = "";
  closeValvePicker();
  refreshValveControls(pos);
  // Picking a valve clears the size, and with it any grade based on the
  // previous selection — re-render so a stale badge doesn't linger until
  // the next unrelated input event.
  computeResults();
}
/** @param {string} pos */
function updateValveTypeButton(pos) {
  const t = uiStrings[state.language];
  const name = state.valveSel[pos].name;
  $(valvePositions[pos].typeBtn).innerHTML = name
    ? `<span>${name}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>`
    : `<span class="placeholder">${t.selectValve}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>`;
}
/** @param {string} pos */
function updateValveSizeOptions(pos) {
  const cfg = valvePositions[pos], sel = state.valveSel[pos];
  const row = $(cfg.sizeRow), select = $(cfg.sizeSelect);
  const valve = currentCategoryValves(pos).find(v => v.name === sel.name);
  if (!valve) { row.hidden = true; select.innerHTML = ""; return; }
  const t = uiStrings[state.language];
  select.innerHTML = `<option value="" disabled ${sel.size ? "" : "selected"}>${t.selectSize}</option>`
    + valve.sizes.map(s => `<option value="${s.size}" ${s.size === sel.size ? "selected" : ""}>${s.size} mm</option>`).join("");
  row.hidden = false;
}
/** @param {string} pos */
function renderValveReference(pos) {
  const el = $(valvePositions[pos].reference);
  const valve = selectedValve(pos);
  const sizeEntry = selectedValveSize(pos);
  if (!sizeEntry) { el.hidden = true; el.innerHTML = ""; return; }
  const t = uiStrings[state.language];
  const rows = [];
  if (sizeEntry.peak) rows.push(`<li><strong>${t.valvePeakGradient}:</strong> ${sizeEntry.peak} mmHg</li>`);
  if (sizeEntry.mean) rows.push(`<li><strong>${t.valveMeanGradient}:</strong> ${sizeEntry.mean} mmHg</li>`);
  if (sizeEntry.vel) rows.push(`<li><strong>${t.valvePeakVelocity}:</strong> ${sizeEntry.vel} m/s</li>`);
  if (sizeEntry.pht) rows.push(`<li><strong>${t.valvePht}:</strong> ${sizeEntry.pht} ms</li>`);
  if (sizeEntry.eoa) rows.push(`<li><strong>${t.valveEoa}:</strong> ${sizeEntry.eoa} cm²</li>`);
  if (sizeEntry.dvi) rows.push(`<li><strong>${t.valveDvi}:</strong> ${sizeEntry.dvi}</li>`);
  const note = valve.thirdParty ? `<p class="valve-third-party-note">${t.valveThirdPartyNote}</p>` : "";
  el.innerHTML = rows.length ? `<h3>${t.valveNormalValues}</h3><ul>${rows.join("")}</ul>${note}` : "";
  el.hidden = rows.length === 0;
}
/** @param {string} pos */
function refreshValveControls(pos) {
  updateValveTypeButton(pos);
  updateValveSizeOptions(pos);
  renderValveReference(pos);
}
// Parses a "mean ± SD" display string (the format every numeric field in
// prosthetic-data/*.js is stored in) into actual numbers. Needed for the
// reference-based EOA grading below — everywhere else these strings are
// shown as-is (see renderValveReference above), never parsed. A value
// printed without an SD in the source (e.g. "2.3") doesn't match, so it
// can't be graded against.
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
  const sizeEntry = selectedValveSize("av");
  const ref = sizeEntry && parseMeanSd(sizeEntry.eoa);
  if (!ref) return null;
  const belowMean = ref.mean - eoa;
  if (belowMean <= ref.sd) return "normal";
  if (belowMean <= 2 * ref.sd) return "possibleStenosis";
  return "stenosis";
}
// Prosthetic MV EOA against the selected valve's own reference EOA (Table
// A5), shown as its own row next to the Table 11 absolute grade (per user
// direction: both). The guideline only gives SD bands for aortic EOA
// (Table 5); for mitral, Table 7's footnote only says a normal valve's EOA
// is "within 1 SD of the reference EOA". The 1 SD / 2 SD bands are applied
// here by analogy with the aortic table — an extrapolation, stated as such
// in the mvProsthetic info notes. Expressed as a z-score (SDs from the
// reference mean) so the row has a value to show. Null when there's no
// selection, no EOA in the table for it, or no usable SD.
/**
 * @param {number} eoa
 * @returns {{ z: number, grade: string } | null}
 */
function gradeMvEoaVsReference(eoa) {
  const sizeEntry = selectedValveSize("mv");
  const ref = sizeEntry && parseMeanSd(sizeEntry.eoa);
  if (!ref || ref.sd <= 0) return null;
  const z = (eoa - ref.mean) / ref.sd;
  const grade = z >= -1 ? "normal" : z >= -2 ? "possibleStenosis" : "stenosis";
  return { z, grade };
}
function refreshValvePickerLanguage() {
  refreshValveControls("av");
  refreshValveControls("mv");
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
  "mrPisaRadius","mrAliasingVelocity","mrVmax","mrVti","mvVtiPw","mvVtiCw","mvPht","mvPeakE","mvMeanGradient",
  "arPisaRadius","arAliasingVelocity","arVmax","arVti",
  "trPisaRadius","trAliasingVelocity","trVmax","trVti",
  "lvotDiam","lvotVti","lvotVmax","aorticVmax","meanGradient","aorticVti","avAt","avEt"
];
fieldNames.forEach(f => state[f] = "");
// Prosthetic aortic/mitral valve modes — separate from fieldNames since
// they're boolean toggles, not text input fields.
state.prostheticAV = false;
state.prostheticMV = false;
// Valve type/size picker selection, per position (see valvePositions).
// Choosing "biological" also shows the transcatheter valves (see
// prosthetic-data/*.js) alongside surgical bioprostheses.
state.valveSel = {
  av: { category: "mechanical", name: "", size: "" },
  mv: { category: "mechanical", name: "", size: "" },
};

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
  mvPeakE: { label: "mvPeakE", unit: "m/s" },
  mvMeanGradient: { label: "mvMeanGradient", unit: "mmHg" },
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

// Prosthetic valve toggles (AV, MV) and their type/size pickers — one
// wiring loop over valvePositions, since both positions have the same
// controls under different ids (see index.html).
[["av", "#prostheticAvToggle", "prostheticAV", "#avProstheticFields", "#avProstheticValveBlock"],
 ["mv", "#prostheticMvToggle", "prostheticMV", "#mvProstheticFields", "#mvProstheticValveBlock"]]
  .forEach(([pos, toggleSel, stateKey, fieldsSel, blockSel]) => {
    $(toggleSel).addEventListener("change", (e) => {
      state[stateKey] = /** @type {HTMLInputElement} */ (e.target).checked;
      $(fieldsSel).hidden = !state[stateKey];
      $(blockSel).hidden = !state[stateKey];
      if (state[stateKey]) refreshValveControls(pos);
      computeResults();
    });
  });
Object.entries(valvePositions).forEach(([pos, cfg]) => {
  $(cfg.categoryToggle).addEventListener("change", (e) => {
    state.valveSel[pos].category = /** @type {HTMLInputElement} */ (e.target).checked ? "biological" : "mechanical";
    // A previously selected valve almost certainly doesn't belong to the
    // newly chosen category (names aren't shared across mechanical/
    // biological), so clear it rather than show a stale, now-invalid pick.
    state.valveSel[pos].name = "";
    state.valveSel[pos].size = "";
    refreshValveControls(pos);
    // Clearing the selection can also clear an EOA grade that was based on
    // it — re-render so the badge disappears too.
    computeResults();
  });
  $(cfg.typeBtn).addEventListener("click", () => openValvePicker(pos));
  $(cfg.sizeSelect).addEventListener("change", (e) => {
    state.valveSel[pos].size = /** @type {HTMLSelectElement} */ (e.target).value;
    renderValveReference(pos);
    // The EOA grades (gradeEoaAgainstReference / gradeMvEoaVsReference)
    // depend on the selected valve+size, unlike the rest of this picker,
    // which is display-only — so a size pick needs to re-run
    // computeResults(), not just the reference-card render above.
    computeResults();
  });
});
$("#valveOverlayClose").addEventListener("click", closeValvePicker);
$("#valveSearchInput").addEventListener("input", (e) => {
  valveSearchQuery = /** @type {HTMLInputElement} */ (e.target).value;
  renderValvePickerList();
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
// The mitral verdict (calculateMvVerdict) reuses the same callout: "mr"
// (suggests significant prosthetic MR) reads as red like stenosis, and
// "highFlow" (raised flow parameters with a normal PHT — MR, high flow or
// PPM, not yet decided) as amber like possible stenosis.
const avVerdictColor = { normal: "normal", possibleStenosis: "caution", stenosis: "danger", discordant: "neutral",
  mr: "danger", highFlow: "caution" };
// Verdict strings are translation keys built from a prefix ("av"/"mv")
// plus the capitalized category/note, e.g. "mv" + "highFlow" -> mvHighFlow.
const verdictKey = (prefix, key) => prefix + key[0].toUpperCase() + key.slice(1);
function renderAvVerdict(verdict, lang, prefix = "av") {
  const t = translations[lang];
  const el = document.createElement("div");
  el.className = `av-verdict av-verdict-${avVerdictColor[verdict.category]}`;
  const noteHtml = verdict.note ? `<p>${t[verdictKey(prefix, verdict.note)]}</p>` : "";
  el.innerHTML = `<h3>${t[prefix + "VerdictTitle"]}</h3><p class="av-verdict-headline">${t[verdictKey(prefix, verdict.category)]}</p>${noteHtml}`;
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
  // Prosthetic MV (Table 11 / Table 7 / Table 12 — see gradeFns.mvPeakE
  // and calculateMvVerdict). EOA is the same continuity value as the
  // native MVA(VTI) below, relabeled; peak E / mean gradient / PHT are
  // inputs that only become graded result rows in prosthetic mode.
  /** @param {string} raw */
  const positiveOrNull = (raw) => {
    const n = parseNumber(raw, lang);
    return raw && !isNaN(n) && n > 0 ? n : null;
  };
  const pmv = s.prostheticMV;
  const mvPeakENum = pmv ? positiveOrNull(s.mvPeakE) : null;
  const mvMeanNum = pmv ? positiveOrNull(s.mvMeanGradient) : null;
  const mvPhtNum = pmv ? positiveOrNull(s.mvPht) : null;
  const mvDvi = pmv ? calculateMvDvi(s.mvVtiCw, s.lvotVti, lang) : null;
  const mvVerdict = pmv ? calculateMvVerdict(s.mvPeakE, s.mvMeanGradient, mvDvi, s.mvPht, lang) : null;
  let mvVtiLvotVti = null;
  if (s.mvVtiPw && s.lvotVti) {
    const r = parseFloat(s.mvVtiPw) / parseFloat(s.lvotVti);
    if (!isNaN(r)) mvVtiLvotVti = r.toFixed(2);
  }
  const mvaVti = calculateAVA(s.lvotDiam, s.lvotVti, s.mvVtiCw, lang);
  const mvaPht = pmv ? null : calculateMVAPht(s.mvPht, lang);
  const mvEoai = pmv ? calculateAVAI(mvaVti, bsa) : null;
  const mvBmi = pmv ? calculateBMI(s.weight, s.height, lang) : null;
  const mvEoaiGrade = mvEoai !== null && mvBmi !== null ? gradeMvEoaiPPM(mvEoai, mvBmi) : null;
  const mvEoaRef = pmv && mvaVti !== null ? gradeMvEoaVsReference(mvaVti) : null;

  const t = translations[lang];
  const rows = [
    ["bsaResult", bsa, "m²"],
    ["mrEro", mrEro, "cm²", s.prostheticMV ? "mrEroProsthetic" : undefined],
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
    // Prosthetic MV rows (all null, so skipped, when the toggle is off).
    ["mvPeakE", mvPeakENum, "m/s"],
    ["mvMeanGradient", mvMeanNum, "mmHg"],
    ["mvPht", mvPhtNum, "ms"],
    ["mvDvi", mvDvi, ""],
    [pmv ? "mvEoa" : "mvaVti", mvaVti, "cm²"],
    ["mvEoai", mvEoai, "cm²/m²", undefined, mvEoaiGrade],
    // Value is a z-score (SDs from the selected valve's reference EOA) —
    // see gradeMvEoaVsReference.
    ["mvEoaRef", mvEoaRef ? mvEoaRef.z : null, "SD", undefined, mvEoaRef ? mvEoaRef.grade : undefined],
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
  if (mvVerdict) { any = true; list.appendChild(renderAvVerdict(mvVerdict, lang, "mv")); }
  $("#resultsCard").hidden = !any;

  lastResults = { bsa, mrEro, mrRegVol, mrRegFraction, arEro, arRegVol, arRegFraction,
    trEro, trRegVol, sv, svi, cardiacOutput, cardiacIndex, ava, avai, dviVti, dviVmax, avAtEt, avVerdict,
    mvVtiLvotVti, mvaVti, mvaPht, mvPeakENum, mvMeanNum, mvPhtNum, mvDvi, mvEoai, mvEoaRef, mvVerdict };
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

// One PISA block: "<Group>:" on its own line, then one "<label>: <val> <unit>"
// line per item, in the fixed order radius, ERO, Reg vol, Reg fraction, Vmax, VTI, Aliasing
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
  return `${groupLabel}:\n${parts.join("\n")}`;
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

  // Mitral Stenosis — just the computed MVA(s), one per line, no group heading
  const msLines = [];
  if (s.prostheticMV) {
    // Prosthetic MV: the selected valve (if any) as a heading, heart rate
    // (the guideline asks for gradients to be reported with the HR they
    // were measured at), then the Table 11 parameters and the verdict.
    // PHT/peak E/mean gradient are echoed as typed, like AT for the AV.
    const sel = s.valveSel.mv;
    const valveText = sel.name ? `: ${sel.name}${sel.size ? ` ${sel.size} mm` : ""}` : "";
    const hr = rawInput(s.heartRate, lang);
    if (hr !== null) msLines.push(`${t.heartRateAbbr}: ${hr} bpm`);
    const peakE = rawInput(s.mvPeakE, lang);
    if (peakE !== null) msLines.push(`${t.mvPeakE}: ${peakE} m/s`);
    const meanG = rawInput(s.mvMeanGradient, lang);
    if (meanG !== null) msLines.push(`${t.mvMeanGradient}: ${meanG} mmHg`);
    const pht = rawInput(s.mvPht, lang);
    if (pht !== null) msLines.push(`${t.mvPht}: ${pht} ms`);
    if (lastResults.mvDvi !== null) msLines.push(`MV DVI: ${fmt(lastResults.mvDvi)}`);
    if (lastResults.mvaVti !== null) msLines.push(`${t.mvEoa}: ${fmt(lastResults.mvaVti)} cm²`);
    if (lastResults.mvEoai !== null) msLines.push(`${t.mvEoai}: ${fmt(lastResults.mvEoai)} cm²/m²`);
    if (lastResults.mvVerdict) {
      const v = lastResults.mvVerdict;
      msLines.push(`${t.mvVerdictTitle}: ${t[verdictKey("mv", v.category)]}`);
    }
    if (msLines.length || valveText) msLines.unshift(`${t.prostheticMvReport}${valveText}`);
  } else {
    if (lastResults.mvaPht !== null) msLines.push(`${t.mvaPht}: ${fmt(lastResults.mvaPht)} cm²`);
    if (lastResults.mvaVti !== null) msLines.push(`${t.mvaVti}: ${fmt(lastResults.mvaVti)} cm²`);
  }
  blocks.push(msLines.length ? msLines.join("\n") : null);

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
  if (lastResults.sv !== null) lvotLines.push(`${t.sv}: ${fmt(lastResults.sv)} ml`);
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
