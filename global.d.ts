// Dev-only type info for `tsc --noEmit -p jsconfig.json` (see CLAUDE.md) — not
// loaded by the app, nothing here ships to the browser. Declares the shape of
// window.wikiTopicBodies, the registry each wiki-topics/<id>.js file writes
// itself into when loaded (see loadWikiTopicBody() in app.js).
interface Window {
  wikiTopicBodies?: Record<string, { en: string; hu: string }>;
}
