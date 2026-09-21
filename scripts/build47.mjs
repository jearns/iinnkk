import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
import {mkdir,copyFile,rm,cp,readFile,writeFile} from 'node:fs/promises';
await build({entryPoints:['scripts/qr-entry47.js'],outfile:'qr47.js',bundle:true,minify:true,platform:'browser',format:'iife'});
await build({entryPoints:['scripts/craft3d50-entry.js'],outfile:'craft3d50.js',bundle:true,minify:true,platform:'browser',format:'iife'});
await build({entryPoints:['scripts/supabase51-entry.js'],outfile:'supabase51.js',bundle:true,minify:true,platform:'browser',format:'iife'});
execFileSync('python',['scripts/offline-manifest.py'],{stdio:'inherit'});
execFileSync('python',['scripts/package-source.py'],{stdio:'inherit'});
await rm('dist',{recursive:true,force:true});await mkdir('dist/client',{recursive:true});
// Serve the same root homepage as the downloadable static bundle.
execFileSync('python',['-c',`import runpy,shutil,pathlib
root=pathlib.Path('.')
for name in runpy.run_path('scripts/package-source.py')['source_files']()+['downloads/manifest.json']:
 p=root/'dist/client'/name;p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/name,p)
`],{stdio:'inherit'});
console.log('Static frontend build complete: dist/client');
