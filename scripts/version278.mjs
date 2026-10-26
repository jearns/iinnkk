import{readFile,writeFile,readdir}from'node:fs/promises';
const release=(await readFile('VERSION.txt','utf8')).match(/网页版\s*(\d+)/)[1],stamp=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date()).replaceAll('-','.')+'.'+release;
// Stamp every retained page at build time, using the same source/date as homepage.
for(const file of await readdir('.')){if(!file.endsWith('.html'))continue;const s=await readFile(file,'utf8'),next=s.replace(/((?:版本[：:]\s*|手筆 · iinnkk\.me · |手筆<\/span> · ))\d{4}\.\d{1,2}\.\d{1,2}\.\d+(?:\.\d+)?/g,'$1'+stamp);if(next!==s)await writeFile(file,next)}
