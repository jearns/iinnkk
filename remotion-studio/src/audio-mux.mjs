import {Input, BlobSource, ALL_FORMATS, Output, BufferTarget, Mp4OutputFormat, EncodedPacketSink, EncodedVideoPacketSource, EncodedAudioPacketSource} from 'mediabunny';
// Copy pre-encoded AAC packets: no second video encode or native AAC encoder.
export async function addMusic(video, source, {signal, metadata, duration} = {}) {
  const response = await fetch(source, {signal});
  if (!response.ok) throw new Error('配乐暂未加载，请重试。');
  const audio = await response.blob();
  const vInput = new Input({source: new BlobSource(video), formats: ALL_FORMATS});
  const aInput = new Input({source: new BlobSource(audio), formats: ALL_FORMATS});
  let output;
  const aborted = () => {if (signal?.aborted) throw new DOMException('已取消', 'AbortError');};
  try {
    aborted();
    const vTrack = await vInput.getPrimaryVideoTrack(), aTrack = await aInput.getPrimaryAudioTrack();
    if (!vTrack || !aTrack) throw new Error('配乐合成未完成，请重试。');
    const videoSource = new EncodedVideoPacketSource(await vTrack.getCodec());
    const audioSource = new EncodedAudioPacketSource(await aTrack.getCodec());
    const target = new BufferTarget();output = new Output({format: new Mp4OutputFormat({fastStart: 'in-memory'}), target});
    output.addVideoTrack(videoSource, {frameRate: 30});output.addAudioTrack(audioSource);
    output.setMetadataTags(metadata);await output.start();
    async function pipe(track, to, audioTrack) {
      const decoderConfig = await track.getDecoderConfig();
      for await (const packet of new EncodedPacketSink(track).packets()) {
        aborted();if (audioTrack && packet.timestamp >= duration) break;
        await to.add(packet, {decoderConfig});
      }
      to.close();
    }
    await Promise.all([pipe(vTrack, videoSource, false), pipe(aTrack, audioSource, true)]);
    aborted();await output.finalize();aborted();
    return new Blob([target.buffer], {type: 'video/mp4'});
  } catch (error) {await output?.cancel().catch(() => {}); throw error;}
  finally {vInput.dispose();aInput.dispose();}
}
