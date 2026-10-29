import React, {useEffect, useMemo, useRef, useState, lazy, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {prepareReplay, strokeCount} from './replay.mjs';
import {VIDEO_FPS, normalizeDuration} from './timing.mjs';
import {MUSIC_TRACKS, musicTrack, musicSource} from './music.mjs';

import {artworkRatio,videoFormat} from './format.mjs';
import{prepareSequence294}from'./sequence.mjs';
import{localItems294,filmFilename294}from'../../release296/selection.mjs';
import {TRANSITIONS} from './scene-plan.mjs';
const FilmPlayer=lazy(()=>import('./player.jsx'));

function Studio() {
  const [, refreshLanguage] = useState(0);
  const [work, setWork] = useState(null);
  const [replay, setReplay] = useState(null);
  const [poster, setPoster] = useState(null);
  const [transition,setTransition]=useState('shadow');
  const [durationSeconds, setDurationSeconds] = useState(30);
  const [retry, setRetry] = useState(0);
  const initial = new URLSearchParams(location.search);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSource, setPickerSource] = useState(initial.get('work290') ? {work290: initial.get('work290'), source290: initial.get('source290') || 'local'} : {});
  const title=work?.title||'手筆纪录',signature='iinnkk.me';
  const [music, setMusic] = useState('qiannian');
  const [showOriginal295,setShowOriginal295]=useState(false);
  const [inkColor296,setInkColor296]=useState('original'),[customInk296,setCustomInk296]=useState('#171717');
  const [background296,setBackground296]=useState(null),backgroundRef296=useRef(null);
  const renderStyle296=useMemo(()=>({showOriginal295,inkColor296:inkColor296==='custom'?customInk296:inkColor296}),[showOriginal295,inkColor296,customInk296]);
  const [audition, setAudition] = useState(false);
  const musicRef = useRef(null);
  const [customMusic295,setCustomMusic295]=useState(null);
  const customURL295=useRef(null);
  const selectedTrack = music==='custom295'&&customMusic295?{title:customMusic295.name,credit:'用户本机导入音频'}:musicTrack(music);
  const sourceMusic295=()=>music==='custom295'?customURL295.current:musicSource(music,durationSeconds);
  const [quality, setQuality] = useState('compact');
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);const [stylePreparing297,setStylePreparing297]=useState(false);
  const [status, setStatus] = useState({key: '从我的作品选择一幅保存了笔画轨迹的作品。'});
  const abortRef = useRef(null);
  const pickerRef = useRef(null), playerRef = useRef(null), prepareRef = useRef(null), replayRef = useRef(null), workRef = useRef(null);
  const posterRef = useRef(null);
  const channel = useRef(crypto.randomUUID());
  const t = text => window.I18n218?.text(text) || text;
  const language = window.I18n218?.language || 'zh';
  const heading = t('手筆 · 纪录大片');
  const format=videoFormat(artworkRatio(work?.draft,replay));
  const inputProps=useMemo(()=>({surface:replay?.surface,artwork:poster,title,signature,music,renderStyle296,background296,musicUrl295:music==='custom295'?customURL295.current:null,transition}),[poster,replay,title,signature,music,transition,customMusic295,renderStyle296,background296]);
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
  useEffect(()=>{if(!replay){setStylePreparing297(false);return}if(replay.surface.color297===renderStyle296.inkColor296){setStylePreparing297(false);replay.surface.warmStyle297(renderStyle296).catch(()=>{});return}let active=true;playerRef.current?.pause();setStylePreparing297(true);replay.surface.warmStyle297(renderStyle296,p=>{if(active)setStatus({key:'正在准备书写回放 {progress}%',progress:Math.round(p*100)})}).then(()=>{if(active)setStatus({key:'原始笔迹已就绪，可预览纪录大片。'})}).catch(e=>{if(active)setStatus({key:'作品读取未完成：',detail:e.message})}).finally(()=>{if(active)setStylePreparing297(false)});return()=>{active=false}},[replay,renderStyle296.inkColor296]);
  const pickerUrl = 'works206.html?' + new URLSearchParams({selectVideo290: '1', channel290: channel.current, ...pickerSource});

  function stopAudition() {musicRef.current?.pause(); setAudition(false);}
  async function auditionMusic() {
    if (!selectedTrack) return;
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
  function importMusic295(event){const file=event.target.files?.[0];if(!file)return;stopAudition();if(customURL295.current)URL.revokeObjectURL(customURL295.current);customURL295.current=URL.createObjectURL(file);setCustomMusic295({file,name:file.name});setMusic('custom295');event.target.value='';}
  useEffect(()=>()=>backgroundRef296.current?.close(),[]);
  async function chooseBackground296(kind,event){playerRef.current?.pause();stopAudition();try{let selected;if(kind==='catalogue'){const {pickCatalogue296}=await import('../../release296/catalogue.mjs');selected=await pickCatalogue296();if(!selected)return;}else{let file=event?.target.files?.[0];if(!file)return;if(file.type.startsWith('video/')){const {editVideos297}=await import('../../release297/video.mjs');file=await editVideos297([...event.target.files].filter(x=>x.type.startsWith('video/')));if(!file){event.target.value='';return}}selected={file,kind:file.type.startsWith('video/')?'video':'image',title:file.name};event.target.value='';}const {prepareBackground296}=await import('./background.mjs');const next=await prepareBackground296(selected);backgroundRef296.current?.close();backgroundRef296.current=next;setBackground296(next);}catch(e){setStatus({key:'背景读取未完成：',detail:e.message})}}
  async function capturePoster296(surface=replay.surface){const im=await surface.hero({style:renderStyle296,transparent:!!background296});const c=document.createElement('canvas');c.width=format.width;c.height=format.height;const t=c.getContext('2d');t.fillStyle='#08090b';t.fillRect(0,0,c.width,c.height);if(background296){const bg=await background296.frame(0,showOriginal295),k=Math.max(c.width/bg.width,c.height/bg.height);t.drawImage(bg,(c.width-bg.width*k)/2,(c.height-bg.height*k)/2,bg.width*k,bg.height*k)}const k=Math.min(c.width/im.width,c.height/im.height);t.drawImage(im,(c.width-im.width*k)/2,(c.height-im.height*k)/2,im.width*k,im.height*k);return new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('作品封面未能生成')),'image/jpeg',.94))}
  useEffect(()=>{if(!replay)return;let active=true;capturePoster296().then(blob=>{if(!active)return;const url=URL.createObjectURL(blob);if(posterRef.current)URL.revokeObjectURL(posterRef.current);posterRef.current=url;setPoster(url)}).catch(()=>{});return()=>active=false},[replay,renderStyle296,background296]);
  async function exportVideo() {
    if (!replay?.surface || busy || checking || stylePreparing297) return;
    playerRef.current?.pause(); stopAudition();
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;let exportReplay297;
    try {
      setStatus({key:'正在加载导出组件…'});
      const {canRenderMediaOnWeb,renderMediaOnWeb,ShoubiShowcase,coverMetadata,addMusic}=await import('./export-engine.mjs');
      if(controller.signal.aborted)throw new Error('cancelled');
      const composition={id:'ShoubiDocumentary',component:ShoubiShowcase,durationInFrames,fps:VIDEO_FPS,width:format.width,height:format.height};
      const scale=quality==='compact'?.5:1;
      setStatus({key: '正在检测本机 MP4 编码能力…'});
      const audioOptions = {muted: true};
      const support = await canRenderMediaOnWeb({width: format.width, height: format.height, scale, container: 'mp4', videoCodec: 'h264', ...audioOptions});
      if (!support.canRender) throw new Error('此浏览器暂不支持 MP4 导出，请尝试其他浏览器。');
      if (controller.signal.aborted) throw new Error('cancelled');
      exportReplay297=await replay.surface.fork297(quality==='compact'?960:1920,renderStyle296);
      const coverURL296=URL.createObjectURL(await capturePoster296(exportReplay297.surface));let metadata;try{metadata = await coverMetadata(coverURL296, {signal: controller.signal, title, signature, credit: selectedTrack?.credit || '', width:format.width, height:format.height});}finally{URL.revokeObjectURL(coverURL296)}
      const {getBlob} = await renderMediaOnWeb({
        composition, inputProps:{...inputProps,surface:exportReplay297.surface},
        container: 'mp4', videoCodec: 'h264', ...audioOptions, metadata,
        scale, pageResponsiveness: 'high', videoBitrate: quality === 'compact' ? 'medium' : 'high',
        signal: controller.signal,
        onProgress: ({progress}) => {
          if (!controller.signal.aborted) setStatus({key: '正在本机合成视频 {progress}%', progress: Math.round(progress * 100)});
        },
      });
      let blob = await getBlob();
      if (selectedTrack) {
        setStatus({key: '正在加入配乐与作品封面…'});
        let source295=sourceMusic295();if(music==='custom295'){const {compressMusic295}=await import('./custom-music.mjs');source295=await compressMusic295(customMusic295.file,{signal:controller.signal});}blob = await addMusic(blob, source295, {signal: controller.signal, metadata, duration: durationSeconds});
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
    <section className="vsPreview" inert={stylePreparing297||undefined} style={{aspectRatio:`${format.width}/${format.height}`,maxWidth:format.orientation==='landscape'?700:440}} aria-label={t('作品动画预览')} translate="no">
      {replay ? <Suspense fallback={<img className="vsStill291" src={poster} alt={work?.title||''}/>}><FilmPlayer key={durationSeconds+format.orientation} playerRef={playerRef} inputProps={inputProps} format={format} durationInFrames={durationInFrames} fps={VIDEO_FPS} poster={poster} title={work?.title} onPlay={stopAudition}/></Suspense>
        : poster ? <img data-poster291="" className="vsStill291" src={poster} alt={work?.title || ''} />
        : <div className="vsEmpty291">{t(work ? '正在读取作品预览…' : '选择作品后在此预览')}</div>}
    </section>
    <section className="vsSide">
      <h1>{t('让作品，慢慢入镜。')}</h1>
      <p>{t('从保存的真实笔画轨迹生成书写影片，保留原有纸张、笔刷与印章。')}</p>
      <button type="button" className="vsButton" disabled={busy || checking} onClick={() => {setPickerSource({}); setPickerOpen(true);}}>{t(work ? '更换作品' : '从我的作品选择')}</button>
      {work && <p className="vsSelected" translate="no">{work.title} · {work.items?work.items.length:strokeCount(work.draft)} {t(work.items?'页 / 幅':'笔')}</p>}
      {checking && <button type="button" className="vsButton" onClick={() => prepareRef.current?.abort()}>{t('取消准备')}</button>}
      {work && !checking && !replay && <button type="button" className="vsButton" onClick={() => setRetry(n => n + 1)}>{t('重新准备')}</button>}
      <label className="vsField">{t('原帖文字')}<select value={showOriginal295?'show':'clean'} disabled={busy} onChange={e=>setShowOriginal295(e.target.value==='show')}><option value="clean">{t('不带原帖字，保留背景纸')}</option><option value="show">{t('带原帖文字')}</option></select></label>
      <label className="vsField">{t('回放墨色')}<select value={inkColor296} disabled={busy} onChange={e=>setInkColor296(e.target.value)}>{[['original','临写原墨色'],['#111111','黑'],['#ffffff','白'],['#b62118','红'],['#ffdd00','黄'],['#703ca0','紫'],['custom','自定义色']].map(([value,label])=><option key={value} value={value}>{t(label)}</option>)}</select>{inkColor296==='custom'&&<input type="color" aria-label={t('自定义墨色')} value={customInk296} disabled={busy} onChange={e=>setCustomInk296(e.target.value)}/>}</label>
      <div className="vsBackground296"><button disabled={busy} onClick={()=>chooseBackground296('catalogue')}>{t('全站名帖背景')}</button><label>{t('拍照作背景')}<input type="file" accept="image/*" capture="environment" disabled={busy} onChange={e=>chooseBackground296('file',e)}/></label><label>{t('本机图片或视频背景')}<input type="file" accept="image/*,video/*" multiple disabled={busy} onChange={e=>chooseBackground296('file',e)}/></label>{background296&&<><span translate="no">{background296.title}</span><button disabled={busy} onClick={()=>{backgroundRef296.current?.close();backgroundRef296.current=null;setBackground296(null)}}>{t('恢复作品背景')}</button></>}</div>
      <label className="vsField">{t('影片时长')}<select value={durationSeconds} onChange={e => {stopAudition(); setDurationSeconds(normalizeDuration(e.target.value));}} disabled={busy}><option value={8}>{t('8 秒')}</option><option value={15}>{t('15 秒')}</option><option value={30}>{t('30 秒')}</option><option value={60}>{t('1 分钟')}</option><option value={120}>{t('2 分钟')}</option></select></label>
      <p className="vsTiming291">{t('片头、片尾各 2 秒，其余时间展示作品。')}</p>
      <p className="vsTiming291">{t(format.orientation==='landscape'?'横屏 16:9 · 自动适配横向作品':'竖屏 9:16 · 自动适配纵向作品')}</p>
      <label className="vsField">{t('镜头转场')}<select value={transition} disabled={busy} onChange={e=>setTransition(e.target.value)}>{TRANSITIONS.map(mode=><option key={mode.id} value={mode.id}>{t(mode.label)}</option>)}</select></label>
      <p className="vsTiming291">{t('长片增加不同字与笔画的取景场景，按原始点位绘制。')}</p>
      <label className="vsField">{t('背景音乐')}<select value={music} disabled={busy} onChange={e => {stopAudition(); setMusic(e.target.value);}}><option value="none">{t('无音乐')}</option>{customMusic295&&<option value="custom295">{customMusic295.name}</option>}{MUSIC_TRACKS.map(track => <option key={track.id} value={track.id}>{t(track.title)}</option>)}</select></label>
      <label className="vsField">{t('导入本机音乐')}<input type="file" accept="audio/*,.m4a,.mp3,.wav,.ogg,.flac" disabled={busy} onChange={importMusic295}/></label>
      {selectedTrack && <div className="vsMusic292"><button type="button" className="vsSecondary292" disabled={busy} onClick={auditionMusic}>{t(audition ? '停止试听' : '试听')}</button><small>{t('仅加载所选配乐，音轨约每分钟增加 240 KB。')}</small></div>}
      <label className="vsField">{t('导出画质')}<select value={quality} onChange={e => setQuality(e.target.value)} disabled={busy || checking}><option value="compact">{t(format.orientation==='landscape'?'轻量 · 960 × 540':'轻量 · 540 × 960')}</option><option value="full">{t(format.orientation==='landscape'?'1080 高清 · 1920 × 1080':'1080 高清 · 1080 × 1920')}</option></select></label>
      <button type="button" className="vsButton" disabled={!replay || busy || checking || stylePreparing297} onClick={exportVideo}>{t(busy ? '正在生成视频…' : '下载 MP4 视频')}</button>
      {busy && <button type="button" className="vsButton" onClick={() => abortRef.current?.abort()}>{t('取消合成')}</button>}
      <div className="vsStatus" role="status">{t(status.key).replace('{progress}', status.progress ?? '')}{status.detail ? t(status.detail) : ''}</div>
      <details className="vsNote"><summary>{t('关于本机合成与配乐')}</summary><div>{t('无需上传图片。按保存的笔画顺序回放，不推测图片中的笔顺，也不修改原作品。仅有图片的旧作品需要先保存原笔迹；多页临帖使用当前保存页。云端原笔迹仅在点选该作品后读取。视频在当前设备生成。')}<p>{t('Remotion 会向其服务发送不含作品内容的使用统计，包括站点来源、网络地址及生成状态。')}</p><p>{t('手机和平板兼容性仍在验证中，建议先使用轻量画质。')}</p>{selectedTrack && <p translate="no">{selectedTrack.credit}</p>}<p><a href={selectedTrack?.directory?selectedTrack.directory+'/CREDITS.md':'video-music292/CREDITS.md'} target="_blank" rel="noreferrer">{t('配乐来源与许可')}</a></p></div></details>
    </section>
    {(pickerOpen || (initial.get('source290')==='cloud'&&initial.get('work290'))) && <section className="vsPicker290" hidden={!pickerOpen} role="dialog" aria-modal="true" aria-label={t('选择作品')}>
      <header><strong>{t('选择作品')}</strong><button type="button" onClick={() => setPickerOpen(false)}>{t('关闭')}</button></header>
      <iframe ref={pickerRef} src={pickerUrl} title={t('我的作品')} />
    </section>}
  </div>;
}

createRoot(document.getElementById('videoStudioApp')).render(<Studio />);
