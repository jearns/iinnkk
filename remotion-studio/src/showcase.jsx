import React, {useMemo} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {OUTRO_SLOGAN, OUTRO_SITE, videoTimeline} from './timing.mjs';
import {cameraLayers} from './camera.mjs';
import {musicTrack, musicSource} from './music.mjs';
const unit = n => Math.max(0, Math.min(1, n));
function fitLine(text, maxSize, spacing) {
  if (typeof document === 'undefined') return maxSize;
  const context = document.createElement('canvas').getContext('2d');
  if (!context) return maxSize;
  context.font = '600 100px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
  const width = context.measureText(text || '').width;
  return width ? Math.min(maxSize, Math.max(16, (880 - spacing * [...(text || '')].length) * 100 / width)) : maxSize;
}
export const ShoubiShowcase = ({artwork, artworkFrames, artworkFocuses, artworkAspect, title, signature, music = 'none'}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const timing = videoTimeline(frame, durationInFrames, fps);
  const replayIndex = Math.min((artworkFrames?.length || 1) - 1, Math.floor(timing.progress * ((artworkFrames?.length || 1) - 1)));
  const image = timing.phase === 'cover' ? artwork || artworkFrames?.at(-1) : artworkFrames?.[replayIndex] || artwork;
  const source = image ? /^(https?:|data:|blob:)/.test(image) ? image : staticFile(image) : null;
  const titleSize = useMemo(() => fitLine(title, 64, 0), [title]);
  const signatureSize = useMemo(() => fitLine(signature, 28, 1), [signature]);
  const shot = timing.phase === 'cover' ? {shot: -1, opacity: 1, scale: 1, x: 0, y: 0, rotate: 0, shade: 0} : cameraLayers(frame, timing, fps, artworkAspect, artworkFocuses)[0];
  const brand = timing.phase === 'intro' || timing.phase === 'outro';
  const brandAlpha = timing.phase === 'intro' ? Math.min(unit((frame - 1) / (fps * .15)), unit((timing.introEnd - frame) / (fps * .2))) : unit((frame - timing.outroStart) / (fps * .2));
  const artAlpha = timing.phase === 'cover' ? 1 : Math.min(unit((frame - timing.introEnd) / (fps * .2)), unit((timing.outroStart - frame) / (fps * .2)));
  const elapsed = frame - timing.introEnd, titleEnd = Math.min(fps * 2.5, (timing.outroStart - timing.introEnd) * .42);
  const titleAlpha = timing.phase === 'artwork' ? Math.min(unit(elapsed / (fps * .18)), unit((titleEnd - elapsed) / (fps * .35))) : 0;
  const track = musicTrack(music);
  return <AbsoluteFill data-phase291={timing.phase} data-frame290={frame} data-replay290={replayIndex} style={{direction: 'ltr', backgroundColor: '#f5f5f7', fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'}}>
    {track && <Audio src={staticFile(musicSource(music, durationInFrames / fps))} premountFor={fps} volume={1} />}
    {brand ? <AbsoluteFill data-brand-card291="" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: brandAlpha}}>
      <Img data-brand291="" src={staticFile('apple-touch-icon.png')} style={{width: 96, height: 96, objectFit: 'contain'}} />
      {timing.phase === 'outro' && <div data-slogan291="" style={{marginTop: 32, textAlign: 'center', color: '#1d1d1f'}}>
        <div style={{fontSize: 38, lineHeight: '58px', fontWeight: 500, letterSpacing: 2}}>{OUTRO_SLOGAN}</div>
        <div data-site292="" style={{marginTop: 12, fontSize: 30, lineHeight: '44px', letterSpacing: 2, opacity: .56}}>{OUTRO_SITE}</div>
      </div>}
    </AbsoluteFill> : <>
      <div data-artwork289="" style={{position: 'absolute', inset: 32, borderRadius: 12, backgroundColor: '#fff', boxShadow: '0 8px 36px #0000000c', overflow: 'hidden', opacity: artAlpha}}>
        {source && <div data-shot291={shot.shot} style={{position: 'absolute', inset: 0, scale: shot.scale, translate: `${shot.x}px ${shot.y}px`}}><Img src={source} style={{width: '100%', height: '100%', objectFit: 'contain'}} /></div>}
        <AbsoluteFill data-shadow292="" style={{opacity: shot.shade, background: 'linear-gradient(115deg, #08090b, #17191e)'}} />
        {titleAlpha > 0 && <AbsoluteFill data-announcement292="" style={{opacity: titleAlpha}}>
          <AbsoluteFill style={{background: 'linear-gradient(to bottom, transparent 35%, rgba(0,0,0,.12) 55%, rgba(0,0,0,.76) 100%)'}} />
          <div style={{position: 'absolute', left: 64, right: 64, bottom: 132, color: '#fff'}}>
            <div data-title289="" style={{fontSize: titleSize, fontWeight: 600, lineHeight: 1.2, letterSpacing: -1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{title}</div>
            <div data-signature289="" style={{marginTop: 18, fontSize: signatureSize, lineHeight: 1.5, letterSpacing: 1, opacity: .82, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{signature}</div>
          </div>
        </AbsoluteFill>}
      </div>
    </>}
  </AbsoluteFill>;
};
