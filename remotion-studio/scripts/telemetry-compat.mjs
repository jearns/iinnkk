// Remotion 4.0.539 fires successful-render telemetry without a rejection handler.
// Keep its request, payload, timeout and retry policy intact; only contain rejection.
// See https://www.remotion.dev/docs/telemetry: telemetry must never fail a render.
export function containTelemetryRejection(source) {
  const pattern = /await LicensingInternals\.internalRegisterUsageEvent\(\{([\s\S]*?)\}\);/g;
  let matches = 0;
  const patched = source.replace(pattern, (_, payload) => {
    matches++;
    return `await LicensingInternals.internalRegisterUsageEvent({${payload}}).catch((error) => { console.warn('[作品成影] Remotion usage event unavailable; video export is unaffected.', error); });`;
  });
  if (matches !== 1) throw new Error('Remotion telemetry implementation changed; review compatibility patch before building');
  return patched;
}
