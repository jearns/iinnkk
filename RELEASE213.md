# 213 — Stop duplicate featured-image downloads

The 212 homepage displayed each signed original image and then fetched it again to generate a local thumbnail. It also replaced cached thumbnails with newly signed remote images on later visits.

The homepage now reads recommendation metadata first and keys its persistent thumbnail cache by work ID, image path and updated_at. Unchanged work reuses the local Blob without requesting a signed URL or downloading the image. A cache miss downloads once, creates a thumbnail, persists it and displays that same local thumbnail. Only changed work is downloaded again. Removed recommendations are excluded from the new cache. Failed downloads are not retried within the load operation; a local cache-write failure does not discard a successfully generated display image.

Fix the standalone homepage cloud loader to explicitly load Gallery210 before creating its Supabase client. Default diagnostics remain in local memory; flush no longer uploads and the 20-second upload interval is removed. A Supabase 402 response opens a 30-minute project-specific fetch circuit shared through localStorage across tabs and reloads. Other origins remain available. This does not restore exhausted provider quota, stop old already-open clients, or block native img requests in other views.

Homepage runtime rebuilt from the same source list with the added thumbnail service, without minification. Immutable bundle URL, offline manifest, service-worker cache and visible home release updated. Writing engine bundles remain unchanged from 212.

Validation: 7 executable offline regression tests cover repeat visits, selective invalidation, deletion from cache, no failure retry, persistence failure, cross-tab 402 cooldown/expiry and zero diagnostics uploads. Syntax checks pass for the generated homepage runtime and changed scripts. No repeated real image downloads were used for tests. Real iPad/iPhone touch and post-quota recovery have not been verified. The previously established Oct 12 storage attribution (10,585 requests, roughly 1.29 GB from response headers) is prior evidence, not a new measurement from these tests.
