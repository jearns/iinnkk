import{readFile,writeFile,copyFile}from'node:fs/promises';import{execFileSync}from'node:child_process';
execFileSync(process.execPath,['scripts/system-input275.mjs'],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/handwriting254.mjs'],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/lazy257.mjs'],{stdio:'inherit'});
const previous=JSON.parse(await readFile('runtime-history154.json','utf8'));
execFileSync(process.execPath,['scripts/runtime224.mjs'],{stdio:'inherit'});await writeFile('writer257.html',(await readFile('writer.html','utf8')).trimEnd()+'\n');
execFileSync(process.execPath,['scripts/home224.mjs'],{stdio:'inherit'});execFileSync(process.execPath,['scripts/version278.mjs'],{stdio:'inherit'});execFileSync(process.execPath,['scripts/offline198.mjs'],{stdio:'inherit'});
const current=JSON.parse(await readFile('runtime-history154.json','utf8'));current.previous=[...new Set([...previous.current,...previous.previous])].filter(n=>!current.current.includes(n));await writeFile('runtime-history154.json',JSON.stringify(current,null,2)+'\n');
