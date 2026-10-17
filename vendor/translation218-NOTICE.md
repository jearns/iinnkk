# Translation adapter

translation-edge218.js ports the `service.edge` request/response adapter from
https://github.com/xnx3/translate/blob/master/translate.js/translate.js
(MIT, Copyright (c) 2025 xnx3; full license: translate-MIT-LICENSE.txt).

The Edge translation service is a hosted service, not an open-source model.
The client adapter and site integration are hosted with this site; no script CDN,
API key or site-user registration is required. Browser requests use CORS,
credentials are omitted, results are cached locally, and failures do not retry
automatically. Mainland carrier reachability is not inferred from this environment.

Site integration: five target languages, Chinese restoration, bounded serial
batches, cancellation, RTL for Arabic, dynamic text nodes and attributes while
retaining input values, event handlers, artwork pixels and document structure.
