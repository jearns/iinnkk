import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

function fitLine(text, maxSize, spacing) {
  if (typeof document === 'undefined') return maxSize;
  const context = document.createElement('canvas').getContext('2d');
  if (!context) return maxSize;
  context.font = '100px "Songti SC", "Noto Serif CJK SC", serif';
  const width = context.measureText(text || '').width;
  return width ? Math.min(maxSize, Math.max(14, (844 - spacing * [...(text || '')].length) * 100 / width)) : maxSize;
}

export const ShoubiShowcase = ({artwork, artworkFrames, title, signature, paperColor, heading = '手筆 · 作品成影'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = interpolate(frame, [0, fps * 1.3], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const depart = interpolate(frame, [fps * 6.9, fps * 7.9], [1, 0], clamp);
  const drift = interpolate(frame, [0, fps * 8], [1.045, 1], clamp);
  // Treat exported artwork as a complete image. Never synthesize or redraw user strokes.
  const replayIndex = Math.min((artworkFrames?.length || 1) - 1, Math.floor(interpolate(frame, [fps * .7, fps * 6.5], [0, (artworkFrames?.length || 1) - 1], clamp)));
  const image = artworkFrames?.[replayIndex] || artwork;
  const source = /^(https?:|data:|blob:)/.test(image) ? image : staticFile(image);
  const titleSize = useMemo(() => fitLine(title, 54, 4), [title]);
  const signatureSize = useMemo(() => fitLine(signature, 23, 2), [signature]);

  return (
    <AbsoluteFill style={{direction: 'ltr', backgroundColor: '#171b19', fontFamily: '"Songti SC", "Noto Serif CJK SC", serif'}}>
      <AbsoluteFill style={{background: 'linear-gradient(130deg, #353d35 0%, #202824 55%, #0b100e 100%)'}} />
      <div style={{position: 'absolute', top: 122, left: 104, right: 104, whiteSpace: 'nowrap', overflow: 'hidden', color: '#e6decc', opacity: enter * depart, fontSize: 26, letterSpacing: 4}}>{heading}</div>
      <div data-artwork289="" data-frame290={frame} data-replay290={replayIndex} style={{position: 'absolute', left: 114, top: 235, width: 852, height: 900, opacity: enter * depart, scale: drift, translate: `0px ${Math.round((1 - enter) * 80)}px`, boxShadow: '0 24px 80px #0008', backgroundColor: paperColor, overflow: 'hidden'}}>
        <Img src={source} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
      </div>
      <div data-caption289="" style={{position: 'absolute', left: 114, width: 852, top: 1214, height: 126, color: '#eee7d7', overflow: 'hidden', opacity: interpolate(frame, [fps * 1.8, fps * 2.6], [0, 1], clamp) * depart}}>
        <div data-title289="" style={{height: 72, lineHeight: '72px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: titleSize, letterSpacing: 4}}>{title}</div>
        <div data-signature289="" style={{marginTop: 12, height: 36, lineHeight: '36px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right', fontSize: signatureSize, letterSpacing: 2, opacity: 0.76}}>{signature}</div>
      </div>
      <div style={{position: 'absolute', width: 4, height: 126, background: '#b63d2c', top: 1214, left: 100, opacity: enter * depart}} />
    </AbsoluteFill>
  );
};
