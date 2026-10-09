/* Display crop never changes the original reference. */
(function(root){const clamp=(v,a,b,f)=>Number.isFinite(+v)?Math.max(a,Math.min(b,+v)):f;
function clean(raw={}){raw=raw&&typeof raw==='object'?raw:{};return {zoom:clamp(raw.zoom,1,4,1),x:clamp(raw.x,0,100,50),y:clamp(raw.y,0,100,50)}}
function apply(image,raw){const c=clean(raw);image.style.objectPosition=c.x+'% '+c.y+'%';image.style.transform='scale('+c.zoom+')';image.style.transformOrigin=c.x+'% '+c.y+'%'}
root.CoverCrop145={clean,apply};})(typeof window==='undefined'?globalThis:window);
