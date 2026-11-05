# 手笔 200 — 2026.10.13

- Remove the top-collapse button and handler. Normalize persisted collapsed state to expanded; rename the intermediate excerpt caption to 文摘.
- New copy pages skip non-existent random-ID draft reads. Saved/owned pages still require their original draft before restoration. Unsaved album records are not read; in-memory saved page drafts are reused.
- Increase stored-read timeout to eight seconds and reset an unhealthy connection after timeout. No IndexedDB deletion or blank fallback for saved works.
- Wait for the current toolbar, reference controls and export controls before exposing the writer. Failed standalone routes retain their loading/error surface and retry the same route instead of marking startup successful.
- Home opens writer200.html and requires the 200 release handshake. Older engine aliases redirect to the current versioned writer. Remove obsolete compiled home/writer bundles; retain source and current chunks.
- Yan hooks recognize terminal change of direction across a bounded paper-distance window. Taper the outgoing hook from the turn rather than from a generic whole-stroke cutoff. Preserve thin horizontals/heavy verticals.
- Zhang uses one solid contour: remove full-stroke texture bands, outlines, grey wash and round turn patches. Taper actual stroke endings; named profile is 90 with diameter 600. Wang remains profile 75 with diameter 400.
- Actual paper-pen panel adds diameter shortcuts 50, 200, 600 alongside existing values.

Validation: 27 focused tests cover renderer behaviour, hook endings with sparse/dense samples, fresh copy reads, saved-draft protection, versioned startup, live diameter controls, blocked local reads, existing hall/works/offline behaviours. Canvas brush samples inspected. Real iPhone/iPad gestures and handwriting feel remain device verification.
