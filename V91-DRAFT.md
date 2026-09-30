# V91 implementation draft

Based on main commit 50ddf5caaa98662c6672e91ac610676ece822e26. This is NOT a tested release.

Implemented in source:
- Home-open class is present before app initialization, to suppress the writer flash.
- Remove the homepage My Works button; authenticated avatar opens cloud My Works.
- Render the history and local recommendation before cloud queries finish. Fetch public recommendations separately from copy works; deduplicate and cache recommendation requests for 60 seconds, invalidating after changes.
- Rename recommendation labels to 本站推荐; remove the first-chapter caption; use cover crop.
- Original generated cinematic constellation hero image, with desktop/mobile crop styles. Portraits are artistic historical interpretations.
- Reuse the existing toolbar owner: home seal, works, selection, recording, excerpts, expansion on the left; undo, redo, clear, preview/writing, download, settings menu on the right.
- Repair expansion: the former #bigPaper62 was removed by revision63; open #bigDialog62 directly.
- Hide the duplicated excerpt status bar. Excerpts open the reader with a category selector.
- Restore the existing previous/order/next reader buttons and their original handlers.
- Reader uses a single RGBA background based on current ink; random preview now calls the continuous palette generator.
- Short text swipes scroll; press and hold 180 ms on text to move the reader, while the header moves immediately.
- Display unbroken poetry as couplets without changing corpus text.
- Writing and preview zoom reach 1000%; bottom ink chooser has color swatches; recolor scope has a page glyph rather than hamburger glyph.
- Default head seal remains inside the 0.12 paper border.

Validation performed:
- All six modified JavaScript files were parsed with JavaScript Function compilation.
- Anchored replacements checked existing source; DOM IDs checked against their creator modules.
- No build, browser interaction, screenshot comparison, real-device testing, or deployment was available in this session.

Pending:
- Complete six-language UI and dynamic-content translation engine, service configuration, caching, Arabic direction handling.
- Video Channels cover default, multi-layer composition, subject segmentation, foreground/handwriting occlusion and perspective controls.
- Browser validation of every source change, including touch drag versus scroll, all four modes, header widths, painting/export consistency, cache update and startup.
- Corpus-wide formatting audit; this draft only adds display line breaks to eligible unbroken poetry.

Do not mark v91 complete or merge until the pending requirements and browser/build validation are finished.
