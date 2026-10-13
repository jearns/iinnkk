# Brush contour 201

Perfect-Freehand 1.2.3 is vendored locally with its MIT license. Upstream: https://github.com/steveruizok/perfect-freehand/tree/v1.2.3 . No CDN or new runtime network requests.

`brush-contour201.js` supplies paper-space stroke points directly to `getStrokeOutlinePoints`. It preserves the input path, resamples each segment, filters velocity using actual timestamps (32 ms exponential time constant), and supplies custom pressure with `simulatePressure:false`. Yan width depends on direction; terminal turns use a physical-span detector and a local outgoing taper. Grass uses one solid filled outline and unchanged ink color. No texture masks or extra turn disks.

Only strokes with `settings.contourVersion201 === 201` use the new renderer. New pointer strokes and explicitly restyled strokes set that field; existing saved strokes retain their original appearance. Seal and clerical channels retain their established renderer. Preset sizes remain Wang 400 and Zhang 600.

The active stroke surface is cleared before rebuilding its contour; completed strokes continue to use existing tiles/raster caches. Export uses the same contour in paper coordinates. Rebuilding cost is proportional to the active stroke length, not all previously written characters. Extremely long single uninterrupted strokes still need device performance validation.

Validation: `node --test tests/brush201.test.mjs tests/brush194.test.mjs tests/copy200.test.mjs tests/features198.test.mjs tests/loading199.test.mjs tests/offline198.test.mjs tests/save197.test.mjs`. Tests compare identical trajectories at different event densities, centerline coverage through hooks, live/export equality, scale independence, solid ink, timestamp response, legacy routing, and a long stroke benchmark. Native mobile touch feel is not established by these tests.
