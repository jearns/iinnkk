import React, {useEffect, useMemo, useRef, useState, lazy, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {prepareReplay, strokeCount} from './replay.mjs';
import {VIDEO_FPS, normalizeDuration, VIDEO_DURATIONS, DEFAULT_VIDEO_DURATION310, MAX_VIDEO_DURATION310} from './timing.mjs';
import {MUSIC_TRACKS, musicTrack, musicSource} from './music.mjs';

import{paperViewport311}from'./matte311.mjs';
import {artworkRatio,videoFormat} from './format.mjs';
import{prepareSequence294}from'./sequence.mjs';
import{localItems294,filmFilename294}from'../../features/portrait/catalogue/selection.mjs';
const FilmPlayer=lazy(()=>import('./player.jsx'));

function Studio() {
  const [panel301,setPanel301]=useState(null);
  const [effects301,setEffects301]=useState({style:'original',blur:0,veil235:0,hd241:false});
  const [spot301,setSpot301]=useState(null);
  const [, refreshLanguage] = useState(0);
  const [work, setWork] = useState(null);
  const [replay, setReplay] = useState(null);
  const [poster, setPoster] = useState(null);
  const transition='push';
  const [cameraMode311,setCameraMode311]=useState('combo');
  const [durationSeconds, setDurationSeconds] = useState(DEFAULT_VIDEO_DURATION310);
  const [durationDraft310,setDurationDraft310]=useState(DEFAULT_VIDEO_DURATION310);
  function commitDuration310(value){const n=normalizeDuration(value);playerRef.current?.pause();stopAudition();setDurationDraft310(n);setDurationSeconds(n)}
  const [retry, setRetry] = useState(0);
  const initial = new URLSearchParams(location.search);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSource, setPickerSource] = useState(initial.get('work290') ? {work290: initial.get('work290'), source290: initial.get('source290') || 'local'} : {});
  const title=work?.title||'手筆纪录',signature='iinnkk.me';
  const [music, setMusic] = useState('qiannian');
  const [showOriginal295,setShowOriginal295]=useState(false);
  const [inkColor296,setInkColor296]=useState('original'),[customInk296,setCustomInk296]=useState('#171717');
  const [background296,setBackground296]=useState(null),backgroundRef296=useRef(null);
  const renderStyle296=useMemo(()=>({showOriginal295,effects301,inkColor296:inkColor296==='custom'?customInk296:inkColor296}),[showOriginal295,inkColor296,customInk296,effects301]);
  const [audition, setAudition] = useState(false);
  const musicRef = useRef(null);
  const [customMusic295,setCustomMusic295]=useState(null);
  const customURL295=useRef(null);
  const selectedTrack = music==='custom295'&&customMusic295?{title:customMusic295.name,credit:'用户本机导入音频'}:musicTrack(music);
  const sourceMusic295=()=>musicURLs302.current[music]||(music==='custom295'?customURL295.current:musicSource(music,durationSeconds));
  const [quality, setQuality] = useState('full');
  const [musicLibrary302,setMusicLibrary302]=useState({});const musicURLs302=useRef({});const importTrack302=useRef(null);
  useEffect(()=>{let active=true;window.DraftStore?.get('documentary-music302').then(rows=>{if(!active)return;const next={};for(const [id,row]of Object.entries(rows||{})){if(row.file instanceof Blob){musicURLs302.current[id]=URL.createObjectURL(row.file);next[id]=row}}setMusicLibrary302(next)}).catch(()=>{});return()=>{active=false;for(const url of Object.values(musicURLs302.current))URL.revokeObjectURL(url)}},[]);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);const [stylePreparing297,setStylePreparing297]=useState(false);
  const [status, setStatus] = useState({key: '从我的作品选择一幅保存了笔画轨迹的作品。'});
  const abortRef = useRef(null);
  const pickerRef = useRef(null), playerRef = useRef(null), prepareRef = useRef(null), replayRef = useRef(null), workRef = useRef(null);
  const posterRef = useRef(null);
  const channel = useRef(crypto.randomUUID?.()||Array.from(crypto.getRandomValues(new Uint32Array(4)),n=>n.toString(16)).join('-'));
  const t = (text,values={}) => (window.I18n218?.text(text)||text).replace(/\{(\w+)\}/g,(whole,key)=>values[key]??whole);
  const language = window.I18n218?.language || 'zh';
  const heading = t('手筆 · 纪录大片');
  const format=videoFormat(artworkRatio(work?.draft,replay));
  const inputProps=useMemo(()=>({surface:replay?.surface,artwork:poster,title,signature,music,renderStyle296,background296,musicUrl295:musicURLs302.current[music]||(music==='custom295'?customURL295.current:null),transition,cameraMode311}),[poster,replay,title,signature,music,transition,cameraMode311,customMusic295,musicLibrary302,renderStyle296,background296]);
  const durationInFrames=durationSeconds*VIDEO_FPS;


  useEffect(() => {
    let active = true;
    const update = async () => {
      await window.I18n218?.prepare();
      if (active) refreshLanguage(n => n + 1);
    };
    update();
    document.addEventListener('language-changed279', update);
    return () => { active = false; document.removeEventListener('language-changed279', update); };
  }, []);
  useEffect(() => {
    const receive = event => {
      if (event.origin !== location.origin || event.source !== pickerRef.current?.contentWindow || event.data?.channel290 !== channel.current) return;
      const data = event.data;
      if(data.type==='shoubi-video-selection294'){const selected={items:data.items,title:data.items.map(x=>x.collectionTitle296||x.title).filter((x,i,a)=>a.indexOf(x)===i).join(' · ')};workRef.current=selected;setWork(selected);setPickerOpen(false);}
      else if (data.type === 'shoubi-video-work290') {
        if (!strokeCount(data.draft)) {setStatus({key: '这幅作品没有保存笔画轨迹，暂不能生成书写影片。'}); return;}
        const selected = {draft: data.draft, title: data.title, owner: data.owner, id: data.workId};
        workRef.current = selected; setWork(selected); setPickerOpen(false);
      } else if (data.type === 'shoubi-video-error290') setStatus({key: '作品读取未完成：', detail: data.message});
      else if (data.type === 'shoubi-video-account290' && workRef.current?.owner && data.owner !== workRef.current.owner) {
        abortRef.current?.abort(); prepareRef.current?.abort(); workRef.current = null; setWork(null);
        setStatus({key: '账号已切换，请重新选择作品。'});
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);
  useEffect(()=>{const changed=e=>{if(e.key!=='sb-mymubscofhvnjixdupbh-auth-token')return;let owner=null;try{owner=JSON.parse(e.newValue||'null')?.user?.id}catch{}const current=workRef.current;if(current?.items?.some(item=>item.owner&&item.owner!==owner)||current?.owner&&current.owner!==owner){abortRef.current?.abort();prepareRef.current?.abort();workRef.current=null;setWork(null);setStatus({key:'账号已切换，请重新选择作品。'})}};window.addEventListener('storage',changed);return()=>window.removeEventListener('storage',changed)},[]);
  useEffect(()=>{let active=true;const p=new URLSearchParams(location.search);(async()=>{
   let items;if(p.has('selection294')){const saved=await window.DraftStore.get(p.get('selection294'));items=saved?.items;if(!items?.length)throw Error('所选作品已不存在，请重新选择。');}
   else if(p.has('work290')&&p.get('source290')!=='cloud')items=await localItems294(window.DraftStore,p.get('work290'));
   if(items&&active){const selected={items,title:items.map(x=>x.collectionTitle296||x.title).filter((x,i,a)=>a.indexOf(x)===i).join(' · ')};workRef.current=selected;setWork(selected);}
  })().catch(e=>{if(active)setStatus({key:'作品读取未完成：',detail:e.message})});return()=>active=false},[]);
  useEffect(() => {
    replayRef.current?.close(); replayRef.current = null; setReplay(null);
    if (posterRef.current) URL.revokeObjectURL(posterRef.current); posterRef.current = null; setPoster(null);
    if (!work) {setChecking(false); return;}
    const controller = new AbortController(); prepareRef.current = controller; let active = true;
    setChecking(true);
    setStatus({key: '正在准备书写回放 {progress}%', progress: 0});
    const prepareOptions={signal: controller.signal, maxSide: 1920,showOriginal295:false,initialStyle297:renderStyle296,
      onPoster: blob => {
        if (!active || controller.signal.aborted) return;
        const url = URL.createObjectURL(blob); posterRef.current = url; setPoster(url);
      },
      onProgress: progress => {if (active && !controller.signal.aborted) setStatus({key: '正在准备书写回放 {progress}%', progress: Math.round(progress * 100)});},
    };
    prepareSequence294(work.items||[{draft:work.draft,title:work.title}],prepareOptions).then(result => {
      if (!active || controller.signal.aborted) {result.close(); return;}
      replayRef.current = result; setReplay(result); setStatus({key: '原始笔迹已就绪，可预览纪录大片。'});
    }).catch(error => {
      if (active) setStatus(controller.signal.aborted ? {key: '已取消准备，可点击重新准备。'} : {key: '作品读取未完成：', detail: error.message});
    }).finally(() => {if (active) setChecking(false);});
    return () => {active = false; controller.abort();};
  }, [work, retry]);
  useEffect(() => () => {prepareRef.current?.abort(); abortRef.current?.abort(); replayRef.current?.close(); if (posterRef.current) URL.revokeObjectURL(posterRef.current);}, []);
  useEffect(()=>{if(!replay){setStylePreparing297(false);return}if(replay.surface.color297===renderStyle296.inkColor296){setStylePreparing297(false);return}let active=true;playerRef.current?.pause();setStylePreparing297(true);replay.surface.warmStyle297(renderStyle296,p=>{if(active)setStatus({key:'正在准备书写回放 {progress}%',progress:Math.round(p*100)})}).then(()=>{if(active)setStatus({key:'原始笔迹已就绪，可预览纪录大片。'})}).catch(e=>{if(active)setStatus({key:'作品读取未完成：',detail:e.message})}).finally(()=>{if(active)setStylePreparing297(false)});return()=>{active=false}},[replay,renderStyle296.inkColor296]);
  const pickerUrl = 'works206.html?' + new URLSearchParams({selectVideo290: '1', channel290: channel.current, ...pickerSource});

  function stopAudition() {musicRef.current?.pause(); setAudition(false);}
  async function auditionMusic() {
    if (!selectedTrack) return;if(!sourceMusic295()){setStatus({key:'这首配乐尚未添加音源，请从本机配乐库添加。'});return;}
    if (audition) return stopAudition();
    playerRef.current?.pause();
    if (!musicRef.current) {musicRef.current = new Audio(); musicRef.current.volume = 1; musicRef.current.onended = () => setAudition(false);}
    musicRef.current.src = sourceMusic295();
    try {await musicRef.current.play(); setAudition(true);} catch {setStatus({key: '配乐暂未加载，请重试。'});}
  }
  useEffect(() => () => musicRef.current?.pause(), []);
  useEffect(() => {
    const player = playerRef.current; if (!player) return;
    player.addEventListener('play', stopAudition);
    return () => player.removeEventListener('play', stopAudition);
  }, [replay, durationSeconds]);

  useEffect(()=>()=>{if(customURL295.current)URL.revokeObjectURL(customURL295.current)},[]);
  async function importMusic295(event){const file=event.target.files?.[0];if(!file)return;stopAudition();const id=importTrack302.current||'custom295';importTrack302.current=null;if(id==='custom295'){if(customURL295.current)URL.revokeObjectURL(customURL295.current);customURL295.current=URL.createObjectURL(file);setCustomMusic295({file,name:file.name});setMusic(id);}else{if(musicURLs302.current[id])URL.revokeObjectURL(musicURLs302.current[id]);musicURLs302.current[id]=URL.createObjectURL(file);const row={file,name:file.name,title:musicTrack(id)?.title,updated:Date.now()},next={...musicLibrary302,[id]:row};setMusicLibrary302(next);setMusic(id);try{await window.DraftStore.set('documentary-music302',next);setStatus({key:'配乐已加入本机配乐库，下次打开仍可使用。'})}catch{setStatus({key:'音源可在本次使用，未能保存到本机配乐库。'})}}event.target.value='';}

  useEffect(()=>()=>backgroundRef296.current?.close(),[]);
  async function applyBackground312(selected){const {prepareBackground296}=await import('./background.mjs');const next=await prepareBackground296(selected);backgroundRef296.current?.close();backgroundRef296.current=next;setBackground296(next);}
  async function chooseBackground296(kind,event){playerRef.current?.pause();stopAudition();try{let selected;if(kind==='catalogue'){const {pickPaper312}=await import('../../features/papers/paper-picker.mjs');const selectCatalogue=async()=>{const {pickCatalogue296}=await import('../../features/portrait/catalogue/catalogue.mjs');return pickCatalogue296()};selected=await pickPaper312({catalogue:selectCatalogue});if(!selected)return;}else{let file=event?.target.files?.[0];if(!file)return;if(file.type.startsWith('video/')){const {editVideos297}=await import('../../features/film/editor/video.mjs');file=await editVideos297([...event.target.files].filter(x=>x.type.startsWith('video/')));if(!file){event.target.value='';return}}selected={file,kind:file.type.startsWith('video/')?'video':'image',title:file.name};event.target.value='';}await applyBackground312(selected);}catch(e){setStatus({key:'背景读取未完成：',detail:e.message})}}
  async function capturePoster296(surface=replay.surface){const im=await surface.hero({style:renderStyle296,transparent:!!background296});const c=document.createElement('canvas');c.width=format.width;c.height=format.height;const t=c.getContext('2d');t.fillStyle='#08090b';t.fillRect(0,0,c.width,c.height);if(background296?.paint314){background296.paint314(t,paperViewport311(im.width,im.height,c.width,c.height))}else if(background296){const bg=await background296.frame(0,showOriginal295),k=Math.max(c.width/bg.width,c.height/bg.height);t.drawImage(bg,(c.width-bg.width*k)/2,(c.height-bg.height*k)/2,bg.width*k,bg.height*k)}const k=Math.min(c.width/im.width,c.height/im.height);t.drawImage(im,(c.width-im.width*k)/2,(c.height-im.height*k)/2,im.width*k,im.height*k);return new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('作品封面未能生成')),'image/jpeg',.94))}
  useEffect(()=>{if(!replay)return;let active=true;capturePoster296().then(blob=>{if(!active)return;const url=URL.createObjectURL(blob);if(posterRef.current)URL.revokeObjectURL(posterRef.current);posterRef.current=url;setPoster(url)}).catch(()=>{});return()=>active=false},[replay,renderStyle296,background296]);
  async function exportVideo() {
    if (!replay?.surface || busy || checking || stylePreparing297) return;if(selectedTrack?.requiresImport301&&!sourceMusic295()){setPanel301('音乐');setStatus({key:'这首配乐尚未添加音源，请从本机配乐库添加。'});return;}
    playerRef.current?.pause(); stopAudition();
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;let exportReplay297;
    try {
      setStatus({key:'正在加载导出组件…'});
      const {canRenderMediaOnWeb,renderMediaOnWeb,ShoubiShowcase,coverMetadata,addMusic}=await import('./export-engine.mjs');
      if(controller.signal.aborted)throw new Error('cancelled');
      const output302={width:format.width*(quality==='ultra'?2:1),height:format.height*(quality==='ultra'?2:1)};
      const composition={id:'ShoubiDocumentary',component:ShoubiShowcase,durationInFrames,fps:VIDEO_FPS,...output302};
      const scale=1;
      setStatus({key: '正在检测本机 MP4 编码能力…'});
      const audioOptions = {muted: true};
      const support = await canRenderMediaOnWeb({width:output302.width,height:output302.height,scale, container: 'mp4', videoCodec: 'h264', ...audioOptions});
      if (!support.canRender) throw new Error(quality==='ultra'?'当前设备不支持4K合成，请切回1080高清后导出。':'此浏览器暂不支持 MP4 导出，请尝试其他浏览器。');
      if (controller.signal.aborted) throw new Error('cancelled');
      exportReplay297=await replay.surface.fork297(quality==='ultra'?3840:1920,renderStyle296);
      const coverURL296=URL.createObjectURL(await capturePoster296(exportReplay297.surface));let metadata;try{metadata = await coverMetadata(coverURL296, {signal: controller.signal, title, signature, credit: selectedTrack?.credit || '', width:format.width, height:format.height});}finally{URL.revokeObjectURL(coverURL296)}
      const {getBlob} = await renderMediaOnWeb({
        composition, inputProps:{...inputProps,surface:exportReplay297.surface},
        container: 'mp4', videoCodec: 'h264', ...audioOptions, metadata,
        scale, pageResponsiveness: 'high', videoBitrate:'high',
        signal: controller.signal,
        onProgress: ({progress}) => {
          if (!controller.signal.aborted) setStatus({key: '正在本机合成视频 {progress}%', progress: Math.round(progress * 100)});
        },
      });
      let blob = await getBlob();
      if (selectedTrack) {
        setStatus({key: '正在加入配乐与作品封面…'});
        const source295=musicLibrary302[music]?.file||(music==='custom295'?customMusic295.file:sourceMusic295());blob = await addMusic(blob, source295, {signal: controller.signal, metadata, duration: durationSeconds});
      }
      if (controller.signal.aborted) throw new Error('cancelled');
      if (!blob?.size) throw new Error('导出结果为空，请重新生成。');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filmFilename294(work?.title);
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setStatus({key: '视频已生成，请检查浏览器下载列表。'});
    } catch (error) {
      console.warn('[纪录大片] render:', error);
      setStatus(controller.signal.aborted ? {key: '已取消合成。'} : {key: '暂无法导出：', detail: error?.message || '未知错误'});
    } finally {
      exportReplay297?.close();abortRef.current = null; setBusy(false);
    }
  }

  return <div className="vsLayout" data-no-translate218="" dir={language === 'ar' ? 'rtl' : 'ltr'}>
    <div className="vsPreviewSlot311"><section className="vsPreview" inert={stylePreparing297||undefined} style={{'--film-ratio311':format.width/format.height}} aria-label={t('作品动画预览')} translate="no" onPointerDown={e=>{if(!spot301)return;e.preventDefault();const r=e.currentTarget.getBoundingClientRect();const point={x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height,radius:.16};setEffects301(v=>({...v,[spot301]:[...(v[spot301]||[]).slice(-3),point]}));}}>
      {replay ? <Suspense fallback={<img className="vsStill291" src={poster} alt={work?.title||''}/>}><FilmPlayer key={durationSeconds+format.orientation} playerRef={playerRef} inputProps={inputProps} format={format} durationInFrames={durationInFrames} fps={VIDEO_FPS} poster={poster} title={work?.title} onPlay={stopAudition}/></Suspense>
        : poster ? <img data-poster291="" className="vsStill291" src={poster} alt={work?.title || ''} />
        : <div className="vsEmpty291">{t(work ? '正在读取作品预览…' : '选择作品后在此预览')}</div>}
    </section></div>
    <nav className="vsTools301" aria-label={t('影片操作')}>{[['作品','M3 4h18v16H3zM7 8h10M7 12h10'],['背景','M3 4h18v16H3zM3 16l6-7 6 7 3-3 3 3'],['墨色','M12 3l7 10a8 8 0 1 1-14 0z'],['滤镜','M4 4h16l-6 8v7l-4 2V12z'],['运镜','M3 6h13v12H3zM16 10l5-3v10l-5-3'],['时长','M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16M12 7v5l3 2'],['音乐','M9 18V5l11-2v13M9 7l11-2M9 18a3 3 0 1 1-3-3h3M20 16a3 3 0 1 1-3-3h3'],['画质','M3 5h18v14H3zM7 9v6M11 9v6M7 12h4M15 9v6h3'],['下载','M12 3v12M7 10l5 5 5-5M4 17v4h16v-4']].map(([label,path])=><button key={label} title={t(label)} aria-label={t(label)} aria-pressed={panel301===label} disabled={busy&&(label!=='下载')} onClick={()=>{if(label==='作品'){setPickerSource({});setPickerOpen(true)}else if(label==='下载'){if(busy)abortRef.current?.abort();else exportVideo()}else setPanel301(v=>v===label?null:label)}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={path}/></svg><span>{t(label)}</span></button>)}</nav>
    <section className="vsSide" data-panel301={panel301||''}>
      <h1>{t('每一次手笔，都值得一部纪录大片')}</h1>
      <p>{t('从保存的真实笔画轨迹生成书写影片，保留原有纸张、笔刷与印章。')}</p>
      <button type="button" className="vsButton" disabled={busy || checking} onClick={() => {setPickerSource({}); setPickerOpen(true);}}>{t(work ? '更换作品' : '从我的作品选择')}</button>
      {work && <p className="vsSelected" translate="no">{work.title} · {work.items?work.items.length:strokeCount(work.draft)} {t(work.items?'页 / 幅':'笔')}</p>}
      {checking && <button type="button" className="vsButton" onClick={() => prepareRef.current?.abort()}>{t('取消准备')}</button>}
      {work && !checking && !replay && <button type="button" className="vsButton" onClick={() => setRetry(n => n + 1)}>{t('重新准备')}</button>}
{panel301==='背景'&&<div className="vsPanel301"><header><strong>{t('背景')}</strong><button onClick={()=>setPanel301(null)} aria-label={t('关闭')}>×</button></header><div className="vsBackground302">{[['show','原帖有字'],['clean','原帖无字'],['catalogue','全站选帖'],['local','本地添加']].map(([id,label])=><button key={id} disabled={busy} aria-pressed={id==='show'?showOriginal295&&!background296:id==='clean'?!showOriginal295&&!background296:id==='catalogue'?['catalogue','paper312'].includes(background296?.kind):background296&&!['catalogue','paper312'].includes(background296.kind)} onClick={()=>{if(id==='catalogue')chooseBackground296('catalogue');else if(id==='local')document.getElementById('backgroundLocal302').click();else{backgroundRef296.current?.close();backgroundRef296.current=null;setBackground296(null);setShowOriginal295(id==='show')}}}>{t(label)}</button>)}</div><input hidden id="backgroundLocal302" type="file" accept="image/*,video/*" multiple onChange={e=>chooseBackground296('file',e)}/>{background296&&<small translate="no">{background296.title}</small>}</div>}{panel301==='墨色'&&<div className="vsPanel301"><header><strong>{t('墨色')}</strong><button onClick={()=>{setPanel301(null);setSpot301(null)}} aria-label={t('关闭')}>×</button></header>      <div className="vsInk303" role="group" aria-label={t('回放墨色')}>{[['original','临写原墨色',null],['#111111','黑','#111111'],['#ffffff','白','#ffffff'],['#b62118','红','#b62118'],['#ffdd00','黄','#ffdd00'],['#703ca0','紫','#703ca0']].map(([value,label,color])=><button key={value} aria-label={t(label)} aria-pressed={inkColor296===value} disabled={busy} onClick={()=>setInkColor296(value)} style={{'--ink303':color||'conic-gradient(#222 0 33%,#b62118 0 66%,#ffdd00 0)'}}><i/><span>{t(label==='临写原墨色'?'原色':label)}</span></button>)}<label><input type="color" aria-label={t('自定义墨色')} value={customInk296} disabled={busy} onChange={e=>{setInkColor296('custom');setCustomInk296(e.target.value)}}/><span>{t('自定')}</span></label></div>
</div>}{panel301==='时长'&&<div className="vsPanel301"><header><strong>{t('时长')}</strong><button onClick={()=>{setPanel301(null);setSpot301(null)}} aria-label={t('关闭')}>×</button></header>      <label className="vsField vsDuration310">{t('影片时长')}<span className="vsSeconds311" dir="ltr"><button type="button" aria-label={t('减少 1 秒')} disabled={busy||durationDraft310<=10} onClick={()=>commitDuration310(durationDraft310-1)}>−</button><output aria-live="polite">{Math.floor(durationDraft310/60)}:{String(durationDraft310%60).padStart(2,'0')}</output><button type="button" aria-label={t('增加 1 秒')} disabled={busy||durationDraft310>=MAX_VIDEO_DURATION310} onClick={()=>commitDuration310(durationDraft310+1)}>+</button></span><input aria-label={t('影片时长')} type="range" min="10" max={MAX_VIDEO_DURATION310} step="1" value={durationDraft310} disabled={busy} onPointerDown={()=>{playerRef.current?.pause();stopAudition()}} onChange={e=>setDurationDraft310(normalizeDuration(e.target.value))} onPointerUp={e=>commitDuration310(e.currentTarget.value)} onKeyUp={e=>commitDuration310(e.currentTarget.value)} onBlur={e=>commitDuration310(e.currentTarget.value)}/></label>
      <div className="vsPresets310" role="group" aria-label={t('常用时长')}>{VIDEO_DURATIONS.map(seconds=><button type="button" key={seconds} disabled={busy} aria-pressed={durationDraft310===seconds} onClick={()=>commitDuration310(seconds)}>{t(({10:'10 秒',30:'30 秒',60:'1 分钟',120:'2 分钟',180:'3 分钟',300:'5 分钟'})[seconds])}</button>)}</div>
      <p className="vsTiming291">{t('最长 30 分钟')}</p>
      <p className="vsTiming291">{t('片头、片尾各 2 秒，其余时间展示作品。')}</p>
      <p className="vsTiming291">{t('按作品原始比例自动适配')}</p>
</div>}{panel301==='运镜'&&<div className="vsPanel301"><header><strong>{t('运镜')}</strong><button onClick={()=>{setPanel301(null);setSpot301(null)}} aria-label={t('关闭')}>×</button></header>      <div className="vsCamera311" role="group" aria-label={t('运镜')}>{[['fixed','单屏画面'],['track','线条跟踪'],['combo','组合运镜']].map(([id,label])=><button type="button" key={id} disabled={busy} aria-pressed={cameraMode311===id} onClick={()=>{playerRef.current?.pause();stopAudition();setCameraMode311(id)}}>{t(label)}</button>)}</div><p className="vsNote">{t(cameraMode311==='fixed'?'全景缓缓推近，结束后停留欣赏，换页渐变。':cameraMode311==='combo'?'全景与线条跟踪持续交替，收笔后拉远停留，换页接续交替。':'稳定取景，沿书写区域平移，最高 5 倍特写。')}</p><p>{t('原作保持比例，自动添加黑边。')}</p>
</div>}{panel301==='音乐'&&<div className="vsPanel301"><header><strong>{t('音乐')}</strong><button onClick={()=>{setPanel301(null);setSpot301(null)}} aria-label={t('关闭')}>×</button></header>      <label className="vsField">{t('背景音乐')}<select value={music} disabled={busy} onChange={e=>{stopAudition();setMusic(e.target.value);if(musicTrack(e.target.value)?.requiresImport301&&!musicURLs302.current[e.target.value])setStatus({key:'这首配乐尚未添加音源，请从本机配乐库添加。'})}}><option value="none">{t('无音乐')}</option>{customMusic295&&<option value="custom295">{customMusic295.name}</option>}{MUSIC_TRACKS.map(track => <option key={track.id} value={track.id}>{t(track.title)}</option>)}</select></label>
      <button className="vsSecondary292" disabled={busy} onClick={()=>{importTrack302.current=selectedTrack?.requiresImport301?music:'custom295';document.getElementById('localMusic301').click()}}>{t(musicLibrary302[music]?'更换本机音源':'添加本机音源')}</button><input hidden type="file" id="localMusic301" accept="audio/*,.m4a,.mp3,.wav,.ogg,.flac" onChange={importMusic295}/>{musicLibrary302[music]&&<small translate="no">{musicLibrary302[music].name}</small>}{selectedTrack?.requiresImport301&&!musicLibrary302[music]&&<p>{t('已列入配乐清单；原曲外链失效，添加本机录音后即可试听和导出。')}</p>}
      {selectedTrack && <div className="vsMusic292"><button type="button" className="vsSecondary292" disabled={busy} onClick={auditionMusic}>{t(audition ? '停止试听' : '试听')}</button><small>{t('仅按需加载所选配乐。')}</small></div>}
</div>}{panel301==='画质'&&<div className="vsPanel301"><header><strong>{t('画质')}</strong><button onClick={()=>{setPanel301(null);setSpot301(null)}} aria-label={t('关闭')}>×</button></header>      <label className="vsField">{t('导出画质')}<select value={quality} onChange={e => setQuality(e.target.value)} disabled={busy || checking}><option value="full">{t('高清 · {width} × {height}',{width:format.width,height:format.height})}</option><option value="ultra">{t('超清 · {width} × {height}',{width:format.width*2,height:format.height*2})}</option></select></label>
</div>}{panel301==='滤镜'&&<div className="vsPanel301"><header><strong>{t('滤镜')}</strong><button onClick={()=>{setPanel301(null);setSpot301(null)}} aria-label={t('关闭')}>×</button></header><div className="vsFilter301">{[['original','原片'],['veil','蒙板'],['noir','黑白'],['blur','虚化'],['hd','高清']].map(([id,label])=><button key={id} onClick={()=>{setSpot301(id==='noir'?'colorSpots':id==='blur'?'clearSpots235':id==='veil'?'lightSpots238':null);setEffects301(v=>id==='hd'?{...v,hd241:!v.hd241}:id==='veil'?{...v,veil235:.42}: {...v,style:id==='noir'?'noir':'original',blur:id==='blur'?12:0,colorSpots:[],clearSpots235:[]})}}>{t(label)}</button>)}<label>{t('滤镜程度')}<input type="range" min="0" max="100" value={spot301==='lightSpots238'?effects301.veil235*100:effects301.blur} onChange={e=>setEffects301(v=>({...v,[spot301==='lightSpots238'?'veil235':'blur']:+e.target.value/(spot301==='lightSpots238'?100:1)}))}/></label><p>{t('轻点预览添加局部亮区、彩色或清晰区域。')}</p></div></div>}      <div className="vsStatus" role="status">{t(status.key).replace('{progress}', status.progress ?? '')}{status.detail ? t(status.detail) : ''}</div>
      <details className="vsNote"><summary>{t('关于本机合成与配乐')}</summary><div>{t('无需上传图片。按保存的笔画顺序回放，不推测图片中的笔顺，也不修改原作品。仅有图片的旧作品需要先保存原笔迹；多页临帖使用当前保存页。云端原笔迹仅在点选该作品后读取。视频在当前设备生成。')}<p>{t('Remotion 会向其服务发送不含作品内容的使用统计，包括站点来源、网络地址及生成状态。')}</p><p>{t('4K 合成需要更多时间和本机内存。')}</p>{selectedTrack && <p translate="no">{selectedTrack.credit}</p>}<p><a href={selectedTrack?.directory?selectedTrack.directory+'/CREDITS.md':'music/library/CREDITS.md'} target="_blank" rel="noreferrer">{t('配乐来源与许可')}</a></p></div></details>
    </section>
    {(pickerOpen || (initial.get('source290')==='cloud'&&initial.get('work290'))) && <section className="vsPicker290" hidden={!pickerOpen} role="dialog" aria-modal="true" aria-label={t('选择作品')}>
      <header><strong>{t('选择作品')}</strong><button type="button" onClick={() => setPickerOpen(false)}>{t('关闭')}</button></header>
      <iframe ref={pickerRef} src={pickerUrl} title={t('我的作品')} />
    </section>}
  </div>;
}

createRoot(document.getElementById('videoStudioApp')).render(<Studio />);
