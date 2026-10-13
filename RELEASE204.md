# Release 204

The 194 brush remains the base renderer. Ribbon segments now share their adjoining cross section; repeated body caps are limited to actual turns, reducing scalloped horizontal/sweeping edges. Coherent paper-distance noise changes radius by at most 0.9% in either direction, without white masks or full-stroke gray coating. Original point arrays are retained.

Writer Works uses a same-origin management iframe in a dialog and retains the drawing document. The capture-phase duplicate save was removed; concurrent checkpoint calls share one flight. Work index metadata is mirrored only after a completed save or successful read. Its fallback is read-only and never writes cached metadata back into the database. Standalone and embedded Works use the same page and management functions.

Passport uses a fixed-height modal and a dedicated native pan-y scrolling body, excluded from automatic modal shrink fitting. Title shows completed Top20 count. Tool defaults migrate once to Works / Paper & pen / Ink / Selection (after the home seal), with overflow scrolling and preview/random positions exchanged; subsequent manual ordering persists.

Lift motion waits are reduced; line-end detection considers the recent strokes in the current line/column rather than just the final pointer position. Reader content minimum width is removed; only a 36px control bound remains; excerpt draw bags shuffle by default. Era aliases merge chronologically; scripts group seal/clerical/regular/running/cursive and authors use a Chinese pinyin collator.

Initial offline preparation still loads only Lanting. The initialized writer asks the worker to cache the first five images of every live merged catalogue chapter. Opening one of a book's first five pages queues its remaining images. Worker requests are low priority, two at a time, and reuse cached pages. Original scroll preview uses native page images, with zoom and an original-image ZIP download, avoiding the former 900px stitched preview. Stamp inspector candidates use the rotated stamp bounds and a 24px gap to avoid its bounds.

Validation includes save-flight concurrency, metadata cache transaction timing and read-only fallback, preserving the canvas while Works opens, scroll body structure, catalogue ordering, five-page warm selection, line reach after upward hooks, baseline brush and generated writer startup. iOS/Harmony touch behaviour is not established by DOM/canvas tests.
