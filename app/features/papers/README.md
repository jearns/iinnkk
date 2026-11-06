# 手筆 314

- Film preview, poster and MP4 use the artwork aspect ratio, rounded only to even encoder dimensions. Selected durations remain manual, 10–1800 seconds, default 120 seconds.
- Single-screen camera retains a centered gradual 1.00–1.12 push-in, including edge-filled pages. The native close-up ink renderer, column alternation and page shadow cuts from 313 remain active.
- Imported film drafts are shallow copies with bare mounting; saved originals remain intact.
- Five source-backed paper textures now tile seamlessly at any ratio. Original seals are separate transparent layers sized to the short edge. The writer, preview, poster and export share paper-tiles.mjs.
- The paper/pen panel adds a 0–100 dry-brush adjustment that reaches the brush renderer and persists in stroke settings.
- Core editor preparation starts after homepage paint. A shared bootstrap queue removes accumulated dependency timer delays, with backoff after boot. Cloud work modules download concurrently while preserving script execution order. No new cloud polling, automatic cloud saves, full-book prefetch or startup camera/model requests.
- Era buttons use canonical numeric catalogue dates rather than translated display headings. The stale base author of tengwang is corrected to 祝允明 without replacing its original images.
- Added 文徵明·行书滕王阁序并诗（1907年影印本）: 25 reading crops and 21 complete scans from the National Diet Library, Japan. PDM source, coordinates and source hashes are in wen-tengwang-source.json. The verified source is running script, not small regular script; 1907 is the facsimile publication date, not the Ming original's date.

## Validation

92 relevant Node regression tests passed, including camera determinism/focus, source-native ink, multi-page bounded playback, paper crop provenance/seams, timeline navigation, explicit flying-white rendering, and portrait capture. npm run check:release passed, including 鹍 handwriting candidate and vector capture checks.

Browser checks: real saved-stroke three-page portrait (1440×1920) and 8:1 landscape (1920×240); native 5× close-up focus in-frame; page change under opaque shade; shared paper picker and ultra-wide paper fill; legacy pen-panel opening and 0–100 dry control; manual duration and dynamic export sizes; selection of all three pages from My Works. Local work metadata refresh measured 12ms. A local standalone writable canvas reported 744ms; CPU/DOM route tests were below one second after preparation. These are local observations, not a universal network/device latency guarantee. Full MP4 encoding was not re-run in this release.
