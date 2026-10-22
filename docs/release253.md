# Release 253 — focused handwriting crosswords

The game writes directly with ParticleBrush. Opening a cell does not initialize the full writer, mount controls, preview or export studio. The top toolbar has the logo, paper/pen, ink, undo, redo, clear and artwork actions. Pen size and style are stored independently of level/session state. English banks load on demand; handwriting resources load in a worker on the first recognition request.

All source252 copybook bonus questions and the active 字里寻帖 feature are removed. There are 19 Chinese themes, including 94 idioms with head-to-tail crossings and 79 poetry lines with mood/place clues. Historical artwork records remain editable. New runs have unique IDs, random answer sets and independently packed layouts. Each rank adds two entries and one crossing; every rank has across/down clues. Recent words are avoided when the remaining bank can support the required rank. The finite banks inevitably recur across sufficiently many runs.

Recognition combines ordered strokes with pen-lift/order tolerant shape matching. Conservative score and margin gates accept only the actual top result; the expected answer is not sent to the recognizer. Uncertain writing retains candidates. This improves connected writing without claiming general cursive-script OCR. Local Latin templates support single letters and evenly spaced whole words. A confirmed word advances within its remaining cells, then returns to the board. Character-based encouragement uses locally spoken positive compounds and idiomatic phrases.

Save renders vector strokes into a bare PNG and writes a typed crossword work record into the existing local My Works store. Supported browsers use file sharing; others download the image. If transient activation has expired before image generation finishes, a small Save Image action renews the browser gesture. A website cannot silently write into the photo library. No export iframe or download-settings panel is loaded. GPS coordinates are reverse geocoded by Nominatim with permission; manual/timezone guesses are excluded. Unresolved cities omit the location seal instead of printing a fabricated city.

Poetry lines are public-domain text. References include Wikisource search links stored on each entry, and the poem texts/context at:
- https://zh.wikisource.org/zh-hans/黃鶴樓送孟浩然之廣陵
- https://www.gushiwen.cn/shiwenv_d3f231047aef.aspx
- https://www.gushiwen.cn/shiwenv_7ef63cf7f13c.aspx
Uncertain composition locations are explicitly identified in clues; no exact tourist entrances or coordinates are invented.

Validation: release253 tests exercise both languages across all 19 themes and nine ranks, variant layouts, answer uniqueness, clue disclosure, head/tail idioms, Latin segmentation, joined-stroke candidates, rejection of uncertain recognition and geolocation. ui253 tests the mobile toolbar and pointer path, confidence gating, continuous writing, pen persistence, random replay, direct PNG sharing, saved-work editing and English whole-word confirmation. Existing copy lifecycle, traffic and export regression tests remain included.

The focused 33-test regression run and mobile UI flow pass. The repository-wide historical suite is not clean: a five-file sample reproduces 13 failures on the untouched release-252 baseline (legacy brush, controls, copy-switch and brand expectations); another historical brush fixture references an unavailable shallow-clone commit. These existing failures are not reported as passing and are outside this game iteration.
