# 手筆 release defaults

- After every web release, synchronize all new and changed visible UI text into English, French, Russian, Arabic and Spanish (`locales218`). Preserve control identifiers and option values. Check compact navigation and Arabic direction. Users select language on the homepage; other pages inherit it.
- Use 手筆 for the product brand in titles, slides and interfaces. Do not alter genuine quoted literary text merely because it contains 亲笔.
- Automatic writing saves are local. Do not add Supabase traffic, automatic full-book image prefetch, polling or retry loops. Keep the image-cache and copy-session regression tests passing.
- Camera and photo editor are fixed, frameless viewport dialogs; generic dialog dragging and fitting must skip `data-fixed224`.
- Keep source URLs and approximate-coordinate labels for geographical data. Do not represent cultural places as live exhibitions or promise exact entrances from approximate coordinates.
- Build current immutable runtime bundles, retain published historical assets, run relevant regression tests and verify deployment before reporting a release as live.

## Standing user authorization (2026-10-20)

- The user explicitly approved automatic execution of this project's requested development, validation, GitHub synchronization and publishing. Continue without asking for the same authorization each release.
- The user explicitly approved sending the project's public new UI, topic, clue, answer and chapter text to the Microsoft Edge translation endpoint to complete English, French, Russian, Arabic and Spanish localization. This approval does not require sending source code or private user content.
- Before every synchronization/release, run `npm run check:release`, including `scripts/check-context269.mjs`. All writing pages and overlays must keep right-click, native touch callouts, copying and non-input text selection disabled; use a new resource path when changing this guard so older offline caches cannot restore it.

- Keep first writing under the 5-second target: run `tests/startup270.test.mjs` and the startup budgets in `check:release`. Cache only resources actually used after first writing is ready; never restore full-manifest caching at installation or make camera/account/cache readiness a prerequisite for a writable canvas. Human foreground models remain lazy and off the writing thread.
