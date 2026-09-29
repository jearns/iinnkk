/* Stable homepage attribution, keeping writing dates free of time-of-day. */
(function(root){
 function dateOnly(value){const date=new Date(value||Date.now());if(Number.isNaN(date.getTime()))return '';const parts=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date),get=type=>parts.find(p=>p.type===type)?.value;return [get('year'),get('month'),get('day')].join('.')}
 function quote(title=''){const bracket=/写【([^】]+)】/.exec(title);if(bracket){const parts=bracket[1].split('·');return {author:parts.length>1?parts.shift().trim():'',title:parts.join('·').trim()}}const old=/写\s*(.+?)《([^》]+)》/.exec(title);return old?{author:old[1].trim(),title:old[2].trim()}:{author:'',title:''}}
 function owner(title=''){return /^(.+?)\s*·\s*\d{4}[./-]\d{1,2}[./-]\d{1,2}\s*写【/.exec(title)?.[1]?.trim()||''}
 function day(title='',fallback){const match=/(\d{4})[./-](\d{1,2})[./-](\d{1,2})/.exec(title);return match?[match[1],match[2].padStart(2,'0'),match[3].padStart(2,'0')].join('.'):dateOnly(fallback)}
 function format(name,title,created,author='',work=''){const q=quote(title);author=author||q.author;work=work||q.title;const subject=work?[author,work].filter(Boolean).join('·'):String(title||'亲笔真迹').replace(/^亲笔真迹\s*·\s*.+$/,'随手书写');return (name||owner(title)||'亲笔书家')+' · '+day(title,created)+' 写【'+subject+'】'}
 root.WorkMeta84={dateOnly,quote,owner,day,format};
})(typeof window==='undefined'?globalThis:window);
