// Dev-only type info for `tsc --noEmit -p jsconfig.json` (see CLAUDE.md) — not
// loaded by the app, nothing here ships to the browser. Declares the shape of
// window.wikiTopicBodies, the registry each wiki-topics/<id>.js file writes
// itself into when loaded (see loadWikiTopicBody() in app.js), and
// window.prostheticAorticValves / window.prostheticMitralValves, registered
// by prosthetic-data/aortic-valves.js and prosthetic-data/mitral-valves.js
// (see loadProstheticValveData()).
interface ProstheticValveSize {
  size: string;
  peak?: string;
  mean?: string;
  eoa?: string;
  dvi?: string;
  // Mitral only (Table A5): peak velocity (m/s) and pressure half-time (ms).
  vel?: string;
  pht?: string;
}
interface ProstheticValve {
  name: string;
  category: "mechanical" | "biological";
  transcatheter?: boolean;
  viv?: boolean;
  inferred?: boolean;
  thirdParty?: boolean;
  sizes: ProstheticValveSize[];
}
interface Window {
  wikiTopicBodies?: Record<string, { en: string; hu: string }>;
  prostheticAorticValves?: ProstheticValve[];
  prostheticMitralValves?: ProstheticValve[];
}
