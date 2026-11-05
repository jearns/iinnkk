import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const css=await readFile('video-studio.css');
const name='video-studio.'+createHash('sha256').update(css).digest('hex').slice(0,16)+'.css';
await writeFile(name,css);
const html=await readFile('video-studio.html','utf8');
await writeFile('video-studio.html',html.replace(/href="video-studio(?:\.[a-f0-9]+)?\.css(?:\?[^" ]*)?"/g,'href="'+name+'?v=316-layout"'));
console.log('Documentary stylesheet:',name);
