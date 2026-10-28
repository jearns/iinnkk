import React, {useMemo} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {OUTRO_SLOGAN, videoTimeline} from './timing.mjs';
import {cameraLayers} from './camera.mjs';

function fitLine(text, maxSize, spacing) {
  if (typeof document === 'undefined') return maxSize;
  const context = document.createElement('canvas').getContext('2d');
  if (!context) return maxSize;
  context.font = '100px "Songti SC", "Noto Serif CJK SC", serif';
  const width = context.measureText(text || '').width;
  return width ? Math.min(maxSize, Math.max(14, (844 - spacing * [...(text || '')].length) * 100 / width)) : maxSize;
}

export const ShoubiShowcase = ({artwork, artworkFrames, artworkFocuses, artworkAspect, title, signature, paperColor}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const timing = videoTimeline(frame, durationInFrames, fps);
  // Treat exported artwork as a complete image. Never synthesize or redraw user strokes.
  const replayIndex = Math.min((artworkFrames?.length || 1) - 1, Math.floor(timing.progress * ((artworkFrames?.length || 1) - 1)));
  const image = artworkFrames?.[replayIndex] || artwork;
  const source = image ? /^(https?:|data:|blob:)/.test(image) ? image : staticFile(image) : null;
  const titleSize = useMemo(() => fitLine(title, 54, 4), [title]);
  const signatureSize = useMemo(() => fitLine(signature, 23, 2), [signature]);
  const layers = cameraLayers(frame, timing, fps, artworkAspect, artworkFocuses);
  const unit = n => Math.max(0, Math.min(1, n));
  const brandAlpha = timing.phase === 'intro' ? Math.min(unit(frame / (fps * .15)), unit((timing.introEnd - frame) / (fps * .22))) : unit((frame - timing.outroStart) / (fps * .2));
  const artAlpha = Math.min(unit((frame - timing.introEnd) / (fps * .3)), unit((timing.outroStart - frame) / (fps * .3)));

  return (
    <AbsoluteFill data-phase291={timing.phase} data-frame290={frame} data-replay290={replayIndex} style={{direction: 'ltr', backgroundColor: '#171b19', fontFamily: '"Songti SC", "Noto Serif CJK SC", serif'}}>
      <AbsoluteFill style={{background: 'linear-gradient(130deg, #353d35 0%, #202824 55%, #0b100e 100%)'}} />
      {timing.phase !== 'artwork' ? <AbsoluteFill data-brand-card291="" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, opacity: brandAlpha}}>
        <Img data-brand291="" src={staticFile('apple-touch-icon.png')} style={{width: 96, height: 96, objectFit: 'contain'}} />
        {timing.phase === 'outro' && <div data-slogan291="" style={{fontSize: 36, lineHeight: '54px', whiteSpace: 'nowrap', letterSpacing: 2, color: '#eee7d7'}}>{OUTRO_SLOGAN}</div>}
      </AbsoluteFill> : <>
      <div data-artwork289="" style={{position: 'absolute', left: 56, top: 40, width: 968, height: 1160, boxShadow: '0 24px 80px #0008', backgroundColor: paperColor, overflow: 'hidden', opacity: artAlpha}}>
        {source && layers.map(layer => <div key={layer.shot} data-shot291={layer.shot} style={{position: 'absolute', inset: 0, backgroundColor: paperColor, opacity: layer.opacity, scale: layer.scale, translate: `${layer.x}px ${layer.y}px`, rotate: `${layer.rotate}deg`}}><Img src={source} style={{width: '100%', height: '100%', objectFit: 'contain'}} /></div>)}
      </div>
      <div data-caption289="" style={{position: 'absolute', left: 114, width: 852, top: 1240, height: 126, color: '#eee7d7', overflow: 'hidden', opacity: artAlpha}}>
        <div data-title289="" style={{height: 72, lineHeight: '72px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: titleSize, letterSpacing: 4}}>{title}</div>
        <div data-signature289="" style={{marginTop: 12, height: 36, lineHeight: '36px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right', fontSize: signatureSize, letterSpacing: 2, opacity: 0.76}}>{signature}</div>
      </div>
      <div style={{position: 'absolute', width: 4, height: 126, background: '#b63d2c', top: 1240, left: 100, opacity: artAlpha}} />
      </>}
    </AbsoluteFill>
  );
};
