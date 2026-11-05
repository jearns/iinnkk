import {execFileSync} from 'node:child_process';
import {existsSync,symlinkSync,copyFileSync} from 'node:fs';
const commands={'build':['scripts/build47.mjs'],'schema':['../node_modules/drizzle-kit/bin.cjs','generate'],'test':['--test','tests/*.test.mjs'],'test:ui':['tests/ui90.cjs'],'build:current':['scripts/build224.mjs'],'check:release':['scripts/check-release224.mjs']};
if(!existsSync('app/node_modules'))symlinkSync('../node_modules','app/node_modules','dir');
const task=process.argv[2],args=commands[task];if(!args)throw Error('Unknown application task: '+task);
copyFileSync('VERSION.txt','app/VERSION.txt');
execFileSync(process.execPath,args.concat(process.argv.slice(3)),{cwd:'app',stdio:'inherit'});
if(task==='build:current')execFileSync(process.execPath,['tools/structure.mjs','--prune'],{stdio:'inherit'});
if(task==='check:release')execFileSync(process.execPath,['tools/structure.mjs'],{stdio:'inherit'});
