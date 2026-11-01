import React,{useEffect,useRef,useState} from 'react';
import {Player} from '@remotion/player';
import {ShoubiShowcase} from './showcase.jsx';
export default function FilmPlayer({playerRef,inputProps,format,durationInFrames,fps,poster,title,onPlay}){
 const host303=useRef(null),[size303,setSize303]=useState({width:1,height:1});useEffect(()=>{const host=host303.current,fit=()=>{const r=host.getBoundingClientRect(),ratio=format.width/format.height,w=Math.min(r.width,r.height*ratio);setSize303({width:w,height:w/ratio})};const observer=new ResizeObserver(fit);observer.observe(host);fit();return()=>observer.disconnect()},[format.width,format.height]);
 useEffect(()=>{const player=playerRef.current;if(!player)return;player.addEventListener('play',onPlay);return()=>player.removeEventListener('play',onPlay)},[]);
 return <div className="vsPlayerFit303" ref={host303}><div style={size303}><Player ref={playerRef} component={ShoubiShowcase} inputProps={inputProps} durationInFrames={durationInFrames} fps={fps} compositionWidth={format.width} compositionHeight={format.height} controls autoPlay={false} showPosterWhenUnplayed showPosterWhenEnded renderPoster={()=>poster?<img data-poster291="" className="vsStill291" src={poster} alt={title||''}/>:null} style={{width:'100%',height:'100%'}}/></div></div>;
}
