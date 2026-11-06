import {Input, BlobSource, ALL_FORMATS, Output, BufferTarget, Mp4OutputFormat, EncodedPacketSink, EncodedVideoPacketSource, EncodedAudioPacketSource} from 'mediabunny';
// MP4 players need AAC audio. Normalize other codecs; copy the video without re-encoding.
export async function addMusic(video, source, {signal, metadata, duration} = {}) {
  let audio=source;if(!(source instanceof Blob)){const response=await fetch(source,{signal});if(!response.ok)throw new Error('配乐暂未加载，请重试。');audio=await response.blob();}
  const vInput = new Input({source: new BlobSource(video), formats: ALL_FORMATS});
  let aInput = new Input({source: new BlobSource(audio), formats: ALL_FORMATS});
  let output;
  const aborted = () => {if (signal?.aborted) throw new DOMException('已取消', 'AbortError');};
  try {
    aborted();
    const vTrack = await vInput.getPrimaryVideoTrack();
    let aTrack = await aInput.getPrimaryAudioTrack();
    if (!vTrack || !aTrack) throw new Error('配乐合成未完成，请重试。');
    duration = duration ?? await vInput.computeDuration();
    if (!Number.isFinite(duration) || duration <= 0) throw Error('音频时长无效');
    if (await aTrack.getCodec() !== 'aac') {
      const {compressMusic295} = await import('./custom-music.mjs');
      audio = await compressMusic295(audio, {signal, maxDuration: duration});
      aborted();
      aInput.dispose();
      aInput = new Input({source: new BlobSource(audio), formats: ALL_FORMATS});
      aTrack = await aInput.getPrimaryAudioTrack();
      if (!aTrack || await aTrack.getCodec() !== 'aac') throw new Error('配乐合成未完成，请重试。');
    }
    const videoSource = new EncodedVideoPacketSource(await vTrack.getCodec());
    const audioSource = new EncodedAudioPacketSource(await aTrack.getCodec());
    const target = new BufferTarget();output = new Output({format: new Mp4OutputFormat({fastStart: 'in-memory'}), target});
    output.addVideoTrack(videoSource, {frameRate: 30});output.addAudioTrack(audioSource);
    if (metadata) output.setMetadataTags(metadata);
    await output.start();
    async function pipe(track, to, audioTrack) {
      const decoderConfig = await track.getDecoderConfig();
      if (audioTrack) {
        const packets = [];
        for await (const packet of new EncodedPacketSink(track).packets()) {
          aborted();
          if (packet.timestamp >= duration) break;
          if (packet.timestamp >= 0) packets.push(packet);
        }
        const span = packets.reduce((end, packet) => Math.max(end, packet.timestamp + packet.duration), 0);
        if (!span) throw Error('音频时长无效');
        for (let offset = 0; offset < duration; offset += span) {
          for (const packet of packets) {
            aborted();
            const timestamp = packet.timestamp + offset;
            if (timestamp >= duration) break;
            await to.add(packet.clone({timestamp, duration: Math.min(packet.duration, duration - timestamp)}), {decoderConfig});
          }
        }
      } else {
        for await (const packet of new EncodedPacketSink(track).packets()) {
          aborted();
          await to.add(packet, {decoderConfig});
        }
      }
      to.close();
    }
    await Promise.all([pipe(vTrack, videoSource, false), pipe(aTrack, audioSource, true)]);
    aborted();await output.finalize();aborted();
    return new Blob([target.buffer], {type: 'video/mp4'});
  } catch (error) {await output?.cancel().catch(() => {}); throw error;}
  finally {vInput.dispose();aInput.dispose();}
}
