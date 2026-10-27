import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

export const ShoubiShowcase = ({artwork, title, signature, paperColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = interpolate(frame, [0, fps * 1.3], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const depart = interpolate(frame, [fps * 6.9, fps * 7.9], [1, 0], clamp);
  const drift = interpolate(frame, [0, fps * 8], [1.045, 1], clamp);
  // Treat exported artwork as a complete image. Never synthesize or redraw user strokes.
  const source = /^(https?:|data:|blob:)/.test(artwork) ? artwork : staticFile(artwork);

  return (
    <AbsoluteFill style={{backgroundColor: '#171b19', fontFamily: '"Songti SC", "Noto Serif CJK SC", serif'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 38%, #54564b 0%, #202824 65%, #0b100e 100%)'}} />
      <AbsoluteFill style={{opacity: 0.18, background: 'repeating-linear-gradient(105deg, transparent 0px, transparent 21px, #e3d6b8 22px, transparent 23px)'}} />
      <div style={{position: 'absolute', top: 122, left: 104, color: '#e6decc', opacity: enter * depart, fontSize: 30, letterSpacing: 12}}>手筆 · 作品成影</div>
      <div style={{position: 'absolute', left: 114, top: 235, width: 852, height: 970, opacity: enter * depart, scale: drift, translate: `0px ${Math.round((1 - enter) * 80)}px`, boxShadow: '0 24px 80px #0008', backgroundColor: paperColor, overflow: 'hidden'}}>
        <Img src={source} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
      </div>
      <div style={{position: 'absolute', left: 116, right: 110, bottom: 156, color: '#eee7d7', display: 'flex', justifyContent: 'space-between', alignItems: 'end', opacity: interpolate(frame, [fps * 1.8, fps * 2.6], [0, 1], clamp) * depart}}>
        <div style={{fontSize: 54, letterSpacing: 9}}>{title}</div>
        <div style={{fontSize: 21, letterSpacing: 3, opacity: 0.76}}>{signature}</div>
      </div>
      <div style={{position: 'absolute', width: 4, height: 78, background: '#b63d2c', bottom: 135, left: 108, opacity: enter * depart}} />
    </AbsoluteFill>
  );
};
