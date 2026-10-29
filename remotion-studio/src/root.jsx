import React from 'react';
import {Composition} from 'remotion';
import {ShoubiShowcase} from './showcase.jsx';
import {videoFormat} from './format.mjs';
import {normalizeDuration, VIDEO_FPS} from './timing.mjs';

export const Root = () => (
  <Composition
    id="ShoubiShowcase"
    component={ShoubiShowcase}
    durationInFrames={30 * VIDEO_FPS}
    fps={VIDEO_FPS}
    calculateMetadata={({props}) => ({...videoFormat(props.artworkRatio||.75),durationInFrames: normalizeDuration(props.durationSeconds) * VIDEO_FPS})}
    width={1080}
    height={1920}
    defaultProps={{
      artwork: 'sample-paper.svg',
      title: '一纸一世界',
      signature: '手筆 · 以手为笔，随时写字',
      paperColor: '#e9dfca',
      durationSeconds: 30,
    }}
  />
);
