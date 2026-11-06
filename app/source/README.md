# Maintained application sources

Edit `writer.js` for the shared writing enhancements and `interface.css` for shared page styles. These are the sole copies of the former numbered patches. Do not create another `revision*.js/css` or a release-number directory.

Sections preserve existing initialization and cascade order. Their original names are provenance IDs used by the build, diagnostics and regression checks; they are not browser requests and must not be recreated as standalone files. `sections.json` identifies the blocks. `read.mjs` supplies a section to builders and tests without materializing duplicate sources.

`runtime-sources106.json` retains the writing initialization order. The compiler still emits one immutable writing script and stylesheet. `scripts/styles.mjs` combines each page's stylesheet sequence, shares identical outputs across pages, and keeps optional styles lazy. It never loads models or images while building the first writing screen.

Independent features remain in their functional directories. In particular, video, handwriting recognition and foreground models remain lazy rather than being added to the writing startup download.
