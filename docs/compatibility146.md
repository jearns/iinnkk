# V146 verification

## Startup
The navigation service worker previously awaited all release runtime downloads before returning HTML. It now returns HTML immediately and warms the coherent offline release in the background. A concurrency test holds runtime responses pending and verifies HTML delivery precedes those responses. The self-contained inline SVG loading screen appears on HTML parse and reports actual runtime load events. It includes a retry state and does not require external fonts or editor initialization.

This removes a client-side blocking step, not origin/network time. No browser first-paint measurement or real-device speed claim is made.

## Cross-device reference alignment
Drafts now carry source crop, exact detected column/glyph data, and a reference rectangle in paper coordinates. Rendering and source/ink mapping use that shared rectangle; paper expansion moves the reference and ink together. Shared pages take the room’s source geometry rather than a device’s unrelated copy-book state. Crop changes are locked during shared writing.

Legacy cloud works without source-crop metadata cannot reconstruct the original device’s crop. Reopen and save on the original device to populate the new metadata before comparing on another device.

## Mobile dialogs
All native showModal openings pass through a visual-viewport guard. Size, position and sticky close headers respond to viewport offsets, rotation and keyboard changes. The music picker has compact controls and a scrollable list. Bounds tests cover 320/360/390/430px portrait screens, short landscape and an offset keyboard viewport, including keyboard dismissal.

Sites-managed container browser controls are unavailable, so browser visual QA and physical iOS, Android, HarmonyOS, Windows and macOS checks were not performed. Build targets Safari 13 and Chrome 79; viewport fallback uses innerWidth/innerHeight when visualViewport is unavailable. SVG has reduced-motion styling and outlined glyphs.

## Validation
216 automated tests passed, zero failures. Production runtime and offline build completed. Tests include nonblocking navigation/cache coherence, cloud geometry serialization, screen-to-paper consistency, paper expansion, shared room menu permissions and viewport bounds.
