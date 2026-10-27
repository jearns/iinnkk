import React from 'react';
import {Composition} from 'remotion';
import {ShoubiShowcase} from './showcase.jsx';

export const Root = () => (
  <Composition
    id="ShoubiShowcase"
    component={ShoubiShowcase}
    durationInFrames={240}
    fps={30}
    width={1080}
    height={1440}
    defaultProps={{
      artwork: 'sample-paper.svg',
      title: '一纸一世界',
      signature: '手筆 · 以手为笔，随时写字',
      paperColor: '#e9dfca',
    }}
  />
);
