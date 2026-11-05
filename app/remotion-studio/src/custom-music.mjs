import{Input,ALL_FORMATS,BlobSource,Output,BufferTarget,Mp4OutputFormat,Conversion,canEncodeAudio}from'mediabunny';
let registered=false;
export async function compressMusic295(file,{signal}={}){
 if(!await canEncodeAudio('aac')&&!registered){const{registerAacEncoder}=await import('@mediabunny/aac-encoder');registerAacEncoder();registered=true;}
 const input=new Input({source:new BlobSource(file),formats:ALL_FORMATS}),output=new Output({format:new Mp4OutputFormat(),target:new BufferTarget()});let conversion;
 const cancel=()=>conversion?.cancel();signal?.addEventListener('abort',cancel,{once:true});
 try{const duration=await input.computeDuration();if(!Number.isFinite(duration)||duration<=0)throw Error('音频时长无效');if(signal?.aborted)throw new DOMException('已取消','AbortError');conversion=await Conversion.init({input,output,trim:{start:0,end:Math.min(duration,120)},video:{discard:true},audio:{codec:'aac',bitrate:32000,numberOfChannels:1,sampleRate:48000,forceTranscode:true}});if(!conversion.isValid)throw Error('音频格式或音源暂不可用');await conversion.execute();if(signal?.aborted)throw new DOMException('已取消','AbortError');return new Blob([output.target.buffer],{type:'audio/mp4'});}finally{signal?.removeEventListener('abort',cancel);input.dispose()}
}
