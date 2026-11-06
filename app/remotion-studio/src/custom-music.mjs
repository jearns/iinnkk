import {Input, ALL_FORMATS, BlobSource, Output, BufferTarget, Mp4OutputFormat, Conversion, canEncodeAudio} from 'mediabunny';
let encoderReady;
export async function compressMusic295(file, {signal, maxDuration = 120} = {}) {
  const aborted = () => {if (signal?.aborted) throw new DOMException('已取消', 'AbortError');};
  aborted();
  if (!await canEncodeAudio('aac')) {
    encoderReady ??= import('@mediabunny/aac-encoder').then(({registerAacEncoder}) => registerAacEncoder()).catch(error => {encoderReady = undefined; throw error;});
    await encoderReady;
  }
  aborted();
  const input = new Input({source: new BlobSource(file), formats: ALL_FORMATS});
  const output = new Output({format: new Mp4OutputFormat(), target: new BufferTarget()});
  let conversion;
  const cancel = () => {conversion?.cancel().catch(() => {});};
  signal?.addEventListener('abort', cancel, {once: true});
  try {
    const duration = await input.computeDuration();
    if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(maxDuration) || maxDuration <= 0) throw Error('音频时长无效');
    aborted();
    conversion = await Conversion.init({input, output, trim: {start: 0, end: Math.min(duration, maxDuration)}, video: {discard: true}, audio: {codec: 'aac', bitrate: 128000, numberOfChannels: 2, sampleRate: 48000, forceTranscode: true}});
    aborted();
    if (!conversion.isValid) throw Error('音频格式或音源暂不可用');
    await conversion.execute();
    aborted();
    return new Blob([output.target.buffer], {type: 'audio/mp4'});
  } catch (error) {await output.cancel().catch(() => {}); throw error;}
  finally {signal?.removeEventListener('abort', cancel); input.dispose();}
}
