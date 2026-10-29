import React,{useEffect} from 'react';
import {Player} from '@remotion/player';
import {ShoubiShowcase} from './showcase.jsx';
export default function FilmPlayer({playerRef,inputProps,format,durationInFrames,fps,poster,title,onPlay}){
 useEffect(()=>{const player=playerRef.current;if(!player)return;player.addEventListener('play',onPlay);return()=>player.removeEventListener('play',onPlay)},[]);
 return <Player ref={playerRef} component={ShoubiShowcase} inputProps={inputProps} durationInFrames={durationInFrames} fps={fps} compositionWidth={format.width} compositionHeight={format.height} controls autoPlay={false} showPosterWhenUnplayed showPosterWhenEnded renderPoster={()=>poster?<img data-poster291="" className="vsStill291" src={poster} alt={title||''}/>:null} style={{width:'100%',aspectRatio:`${format.width}/${format.height}`}}/>;
}
