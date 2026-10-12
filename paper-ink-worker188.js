importScripts('paper-ink188.js?v=192');
self.onmessage=event=>{const {id,data,width,height}=event.data;try{const result=PaperInkPixels188.reconstruct(data,width,height);self.postMessage({id,result},[result.data.buffer])}catch(error){self.postMessage({id,error:error.message})}};

