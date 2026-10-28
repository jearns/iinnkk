import {build} from 'esbuild';
import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {containTelemetryRejection} from './telemetry-compat.mjs';
import {disposalPrelude} from './disposal-prelude.mjs';

let patched = false;
const result = await build({
  entryPoints: ['src/web.jsx'],
  outfile: '../video-studio.bundle.js',
  bundle: true,
  minify: true,
  platform: 'browser',
  format: 'iife',
  target: ['es2022', 'safari26'],
  jsx: 'automatic',
  write: false,
  banner: {js: disposalPrelude},
  plugins: [{name: 'remotion-telemetry-rejection', setup(builder) {
    builder.onLoad({filter: /@remotion\/web-renderer\/dist\/esm\/index\.mjs$/}, async ({path}) => {
      patched = true;
      return {contents: containTelemetryRejection(await readFile(path, 'utf8')), loader: 'js'};
    });
  }}],
});
if (!patched) throw new Error('Remotion compatibility guard was not applied');
const bytes = result.outputFiles[0].contents;
const bundle = 'video-studio.' + createHash('sha256').update(bytes).digest('hex').slice(0, 16) + '.js';
await writeFile('../' + bundle, bytes);
const css = await readFile('../video-studio.css');
const stylesheet = 'video-studio.' + createHash('sha256').update(css).digest('hex').slice(0, 16) + '.css';
await writeFile('../' + stylesheet, css);
const html = await readFile('../video-studio.html', 'utf8');
await writeFile('../video-studio.html', html.replace(/video-studio(?:\.bundle|\.[a-f0-9]+)\.js/g, bundle).replace(/video-studio(?:\.[a-f0-9]+)?\.css/g, stylesheet));
console.log('Created ' + bundle + ' and ' + stylesheet + ' (loaded only from video-studio.html)');
