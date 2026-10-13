# Brush 202 repair

201 whole-stroke Perfect-Freehand outlines self-intersected on small finger reversals. Straight synthetic traces missed the split heads and cavities visible in user feedback. The locally vendored MIT source and license remain for reference; new rendering does not call its whole-stroke outline function.

`brush-contour201.js` now uses shared cross sections split into positive-winding triangles, with only true-corner contact joins. One Canvas nonzero fill unions contacts without cancelling ink or compounding opacity. Physical neighbourhood smoothing and bounded width response reduce direction noise. Raw input points remain stored unchanged. A short settling interval smooths initial micro reversals; Yan caps use a shallow ellipse, running/cursive starts grow gradually and terminal strokes taper. Hook detection uses the un-smoothed trajectory to preserve actual terminal turns.

New strokes carry `contourVersion201:202`. Both 201- and 202-tagged strokes receive the repairs. Pre-201 saved strokes retain their original renderer unless explicitly restyled. Seal/clerical channels and Wang/Zhang preset values are unchanged. Active-stroke repaint uses the existing separate surface; completed strokes retain raster/tile caches.

The top arrow was also recreated by `revision97.js` and `revision135.js`; both creation paths are now removed while preview gestures and logo anchoring remain.

Tests cover jitter and pauses, settling reversals, enclosed white cavities in wide hooks, body-width noise, transparency at self intersections, running start/end pressure, legacy routing, sparse/dense trajectories, paper scaling, live/export equality, and generated writer/entry/offline regressions. Canvas renders are simulated finger traces, not replayed user stroke data. Native iOS/Harmony touch feel still requires device validation.
