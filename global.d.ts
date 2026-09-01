// Dev-only type info for `tsc --noEmit -p jsconfig.json` (see CLAUDE.md) — not
// loaded by the app, nothing here ships to the browser. Declares the shape of
// window.wikiTopicBodies, the registry each wiki-topics/<id>.js file writes
// itself into when loaded (see loadWikiTopicBody() in app.js), and
// window.prostheticAorticValves, registered by
// prosthetic-data/aortic-valves.js (see loadProstheticAorticValves()).
interface ProstheticValveSize {
  size: string;
  peak?: string;
  mean?: string;
  eoa?: string;
  dvi?: string;
}
interface ProstheticValve {
  name: string;
  category: "mechanical" | "biological";
  transcatheter?: boolean;
  viv?: boolean;
  inferred?: boolean;
  sizes: ProstheticValveSize[];
}
interface Window {
  wikiTopicBodies?: Record<string, { en: string; hu: string }>;
  prostheticAorticValves?: ProstheticValve[];
}
