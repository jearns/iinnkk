# 手筆 260 — 2026-10-23

Unified catalogue maintenance retains cover drag/pinch gestures and now reuses the original album gallery and accessible drag ordering. Files append in selection order; filename sorting is explicit. Album groups, reading direction, transcript, metadata, writing presets and canonical parent relationships persist in the same GitHub entry. Drafts stay local. Publishing checks repository write permission, uses a non-force reference update, and rejects concurrent page changes.

Public hall selection creates 256px thumbnails only for explicitly selected works. Static catalogue associations use stable work IDs and repository thumbnail paths. No new database table or homepage Supabase query is introduced. Direct hall links filter one public work by ID and preserve the existing authenticated likes/comments controls.

Portrait controls are consolidated; handwriting uses fixed viewport geometry with a one-row horizontal candidate list and blocked context menus. Mobile font, practice, copying, archive and 3D panels share compact navigation. Five UI languages are synchronized.

Validation:
- `node --test tests/catalogue260.test.mjs tests/gallery148.test.mjs tests/reference136.test.mjs tests/reference-upload138.test.mjs tests/copy200.test.mjs tests/copy-lifecycle179.test.mjs tests/release210.test.mjs`: 28 passing checks.
- `node tests/ui260-maintenance.cjs`: upload order, RTL, reorder, real IndexedDB restore, independent cover, intercepted GitHub publication, stable canvas, candidate overflow, context-menu blocking, rotation, mobile navigation and Arabic layout.
- `node tests/ui260-hall.cjs`: intercepted public feed, actual chosen image thumbnail, preserved unsaved editor draft, direct filtered work route, existing comment panel, homepage parent/child thumbnails and navigation; actual reader RTL/LTR placement without double reversal.
- `npm run build:current`; `npm run check:release -- /tmp/inventory260.json`.

Cloud availability: a single public SELECT with limit=1 returned HTTP 402 / exceed_egress_quota on 2026-10-23. Tests intercept external writes. Existing public cloud works and interactions remain subject to restoration of that service; no cloud recovery is claimed.
