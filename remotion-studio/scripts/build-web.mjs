import {build} from 'esbuild';

await build({
  entryPoints: ['src/web.jsx'],
  outfile: '../video-studio.bundle.js',
  bundle: true,
  minify: true,
  platform: 'browser',
  format: 'iife',
  target: ['es2022', 'safari26'],
  jsx: 'automatic',
});
console.log('Created video-studio.bundle.js (loaded only from video-studio.html)');
