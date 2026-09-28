import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

test('public cross-device catalogue loads without a token, and one atomic commit publishes metadata',async()=>{
 const writes=[],calls=[];
 const data={version:74,entries:{oracle:{title:'甲骨文',place:'中国·河南安阳',museum:'殷墟',pages:['timeline/pages/oracle/a.jpg']}}};
 const payload=Buffer.from(JSON.stringify(data)).toString('base64');
 const respond=(body,status=200)=>({ok:status<400,status,json:async()=>body});
 const fetch=async(url,opts={})=>{calls.push([url,opts]);if(url.endsWith('/contents/timeline/manifest.json?ref=main'))return respond({content:payload});if(url.endsWith('/git/ref/heads/main'))return respond({object:{sha:'parent'}});if(url.endsWith('/git/commits/parent'))return respond({tree:{sha:'base-tree'}});if(url.endsWith('/git/blobs'))return respond({sha:'manifest-blob'});if(url.endsWith('/git/trees')){writes.push(JSON.parse(opts.body));return respond({sha:'new-tree'})}if(url.endsWith('/git/commits'))return respond({sha:'new-commit'});if(url.endsWith('/git/refs/heads/main'))return respond({ref:'heads/main'});throw Error(url)};
 const sandbox={window:{},location:{href:'https://iinnkk.me/'},fetch,URL,Blob,Uint8Array,TextDecoder,atob,btoa,Date,CustomEvent:class{constructor(type){this.type=type}},document:{dispatchEvent:()=>{}}};
 vm.runInNewContext(readFileSync('timeline74-cloud.js','utf8'),sandbox);
 const cloud=sandbox.window.TimelineCloud74;
 await cloud.ready;
 assert.equal(cloud.get('oracle').pages[0],'timeline/pages/oracle/a.jpg');
 assert.equal(calls[0][1].headers.Authorization,undefined);
 cloud.connect('github_pat_example_secret');
 await cloud.publish('oracle',{title:'甲骨文（已修订）',place:'中国·安阳',museum:'殷墟',pages:[]});
 assert.equal(cloud.get('oracle').pages.length,0);
 assert.deepEqual(writes[0].tree.map(item=>item.path),['timeline/manifest.json']);
 assert.ok(calls.filter(([,opts])=>opts.method==='POST').every(([,opts])=>opts.headers.Authorization==='Bearer github_pat_example_secret'));
});
