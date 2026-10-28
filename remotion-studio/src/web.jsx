import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import {canRenderMediaOnWeb, renderMediaOnWeb} from '@remotion/web-renderer';
import {ShoubiShowcase} from './showcase.jsx';
import {prepareReplay, strokeCount} from './replay.mjs';

const COMPOSITION = {
  id: 'ShoubiShowcase', component: ShoubiShowcase,
  durationInFrames: 240, fps: 30, width: 1080, height: 1440,
};

function Studio() {
  const [, refreshLanguage] = useState(0);
  const [work, setWork] = useState(null);
  const [replay, setReplay] = useState(null);
  const [retry, setRetry] = useState(0);
  const initial = new URLSearchParams(location.search);
  const [pickerOpen, setPickerOpen] = useState(!!initial.get('work290'));
  const [pickerSource, setPickerSource] = useState(initial.get('work290') ? {work290: initial.get('work290'), source290: initial.get('source290') || 'local'} : {});
  const [title, setTitle] = useState('一纸一世界');
  const [signature, setSignature] = useState('手筆 · 以手为笔，随时写字');
  const [quality, setQuality] = useState('compact');
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState({key: '从我的作品选择一幅保存了笔画轨迹的作品。'});
  const abortRef = useRef(null);
  const pickerRef = useRef(null), playerRef = useRef(null), prepareRef = useRef(null), replayRef = useRef(null), workRef = useRef(null);
  const channel = useRef(crypto.randomUUID());
  const t = text => window.I18n218?.text(text) || text;
  const language = window.I18n218?.language || 'zh';
  const image = 'brand.svg';
  const heading = t('手筆 · 作品成影');
  const inputProps = useMemo(() => ({artwork: image, artworkFrames: replay?.frames, title, signature, heading, paperColor: '#e9dfca'}), [replay, title, signature, heading]);

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
      if (data.type === 'shoubi-video-work290') {
        if (!strokeCount(data.draft)) {setStatus({key: '这幅作品没有保存笔画轨迹，暂不能逐笔成影。'}); return;}
        const selected = {draft: data.draft, title: data.title, owner: data.owner, id: data.workId};
        workRef.current = selected; setWork(selected); setTitle([...(data.title || '')].slice(0, 18).join('')); setPickerOpen(false);
      } else if (data.type === 'shoubi-video-error290') setStatus({key: '作品读取未完成：', detail: data.message});
      else if (data.type === 'shoubi-video-account290' && workRef.current?.owner && data.owner !== workRef.current.owner) {
        abortRef.current?.abort(); prepareRef.current?.abort(); workRef.current = null; setWork(null);
        setStatus({key: '账号已切换，请重新选择作品。'});
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);
  useEffect(() => {
    replayRef.current?.close(); replayRef.current = null; setReplay(null);
    if (!work) {setChecking(false); return;}
    const controller = new AbortController(); prepareRef.current = controller; let active = true;
    setChecking(true);
    setStatus({key: '正在准备书写回放 {progress}%', progress: 0});
    prepareReplay(work.draft, {signal: controller.signal, maxSide: quality === 'full' ? 1440 : 720,
      onProgress: progress => {if (active && !controller.signal.aborted) setStatus({key: '正在准备书写回放 {progress}%', progress: Math.round(progress * 100)});},
    }).then(result => {
      if (!active || controller.signal.aborted) {result.close(); return;}
      replayRef.current = result; setReplay(result); setStatus({key: '轨迹已就绪，点击播放可预览逐笔书写。'});
    }).catch(error => {
      if (active) setStatus(controller.signal.aborted ? {key: '已取消准备，可点击重新准备。'} : {key: '作品读取未完成：', detail: error.message});
    }).finally(() => {if (active) setChecking(false);});
    return () => {active = false; controller.abort();};
  }, [work, quality, retry]);
  useEffect(() => () => {prepareRef.current?.abort(); abortRef.current?.abort(); replayRef.current?.close();}, []);
  const pickerUrl = 'works206.html?' + new URLSearchParams({selectVideo290: '1', channel290: channel.current, ...pickerSource});

  async function exportVideo() {
    if (!replay?.frames?.length || busy || checking) return;
    playerRef.current?.pause();
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const scale = quality === 'compact' ? 0.5 : 1;
      setStatus({key: '正在检测本机 MP4 编码能力…'});
      const support = await canRenderMediaOnWeb({width: 1080, height: 1440, scale, container: 'mp4', videoCodec: 'h264', muted: true});
      if (!support.canRender) throw new Error('此浏览器暂不支持 MP4 导出，请尝试其他浏览器。');
      if (controller.signal.aborted) throw new Error('cancelled');
      const {getBlob} = await renderMediaOnWeb({
        composition: COMPOSITION, inputProps,
        container: 'mp4', videoCodec: 'h264', muted: true,
        scale, pageResponsiveness: 'high', videoBitrate: quality === 'compact' ? 'medium' : 'high',
        signal: controller.signal,
        onProgress: ({progress}) => {
          if (!controller.signal.aborted) setStatus({key: '正在本机合成视频 {progress}%', progress: Math.round(progress * 100)});
        },
      });
      const blob = await getBlob();
      if (controller.signal.aborted) throw new Error('cancelled');
      if (!blob?.size) throw new Error('导出结果为空，请重新生成。');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = '手筆-作品成影.mp4';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setStatus({key: '视频已生成，请检查浏览器下载列表。'});
    } catch (error) {
      console.warn('[作品成影] render:', error);
      setStatus(controller.signal.aborted ? {key: '已取消合成。'} : {key: '暂无法导出：', detail: error?.message || '未知错误'});
    } finally {
      abortRef.current = null; setBusy(false);
    }
  }

  return <div className="vsLayout" data-no-translate218="" dir={language === 'ar' ? 'rtl' : 'ltr'}>
    <section className="vsPreview" aria-label={t('作品动画预览')} translate="no">
      <Player ref={playerRef} component={ShoubiShowcase} inputProps={inputProps} durationInFrames={240} fps={30} compositionWidth={1080} compositionHeight={1440} controls loop autoPlay={false} style={{width: '100%', aspectRatio: '3/4'}} />
    </section>
    <section className="vsSide">
      <h1>{t('让作品，慢慢入镜。')}</h1>
      <p>{t('从保存的真实笔画轨迹生成 8 秒书写影片，保留原有纸张、笔刷与印章。')}</p>
      <button type="button" className="vsButton" disabled={busy || checking} onClick={() => {setPickerSource({}); setPickerOpen(true);}}>{t(work ? '更换作品' : '从我的作品选择')}</button>
      {work && <p className="vsSelected" translate="no">{work.title} · {strokeCount(work.draft)} {t('笔')}</p>}
      {checking && <button type="button" className="vsButton" onClick={() => prepareRef.current?.abort()}>{t('取消准备')}</button>}
      {work && !checking && !replay && <button type="button" className="vsButton" onClick={() => setRetry(n => n + 1)}>{t('重新准备')}</button>}
      <label className="vsField">{t('作品标题')}<input value={title} maxLength={18} onChange={e => setTitle(e.target.value)} disabled={busy} translate="no" /></label>
      <label className="vsField">{t('落款')}<input value={signature} maxLength={35} onChange={e => setSignature(e.target.value)} disabled={busy} translate="no" /></label>
      <label className="vsField">{t('导出画质')}<select value={quality} onChange={e => setQuality(e.target.value)} disabled={busy}><option value="compact">{t('轻量 · 540 × 720')}</option><option value="full">{t('高清 · 1080 × 1440')}</option></select></label>
      <button type="button" className="vsButton" disabled={!replay || busy || checking} onClick={exportVideo}>{t(busy ? '正在生成视频…' : '下载 MP4 视频')}</button>
      {busy && <button type="button" className="vsButton" onClick={() => abortRef.current?.abort()}>{t('取消合成')}</button>}
      <div className="vsStatus" role="status">{t(status.key).replace('{progress}', status.progress ?? '')}{status.detail ? t(status.detail) : ''}</div>
      <div className="vsNote">{t('无需上传图片。按保存的笔画顺序回放，不推测图片中的笔顺，也不修改原作品。仅有图片的旧作品需要先保存原笔迹；多页临帖使用当前保存页。云端原笔迹仅在点选该作品后读取。视频在当前设备生成。')}<p>{t('Remotion 会向其服务发送不含作品内容的使用统计，包括站点来源、网络地址及生成状态。')}</p><p>{t('手机和平板兼容性仍在验证中，建议先使用轻量画质。')}</p></div>
    </section>
    {(pickerOpen || work || initial.get('work290')) && <section className="vsPicker290" hidden={!pickerOpen} role="dialog" aria-modal="true" aria-label={t('选择作品')}>
      <header><strong>{t('选择作品')}</strong><button type="button" onClick={() => setPickerOpen(false)}>{t('关闭')}</button></header>
      <iframe ref={pickerRef} src={pickerUrl} title={t('我的作品')} />
    </section>}
  </div>;
}

createRoot(document.getElementById('videoStudioApp')).render(<Studio />);
