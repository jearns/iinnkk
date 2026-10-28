// Must run before any renderer/mediabunny module captures its disposal symbols.
// Some Safari versions have neither symbol. Remotion's bundled helper and its
// own fallback used different registry names, causing "Object not disposable".
export const disposalPrelude = `(() => {
  if (typeof Symbol.dispose !== 'symbol') Object.defineProperty(Symbol, 'dispose', {value: Symbol.for('Symbol.dispose')});
  if (typeof Symbol.asyncDispose !== 'symbol') Object.defineProperty(Symbol, 'asyncDispose', {value: Symbol.for('Symbol.asyncDispose')});
})();`;
