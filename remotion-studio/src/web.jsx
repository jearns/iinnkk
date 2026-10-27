import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import {canRenderMediaOnWeb, renderMediaOnWeb} from '@remotion/web-renderer';
import {ShoubiShowcase} from './showcase.jsx';
import {decodeArtwork} from './artwork.mjs';

const COMPOSITION = {
  id: 'ShoubiShowcase', component: ShoubiShowcase,
  durationInFrames: 240, fps: 30, width: 1080, height: 1440,
};

function Studio() {
  const [, refreshLanguage] = useState(0);
  const [fileUrl, setFileUrl] = useState(null);
  const [title, setTitle] = useState('一纸一世界');
  const [signature, setSignature] = useState('手筆 · 以手为笔，随时写字');
  const [quality, setQuality] = useState('compact');
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState({key: '请选择从《手筆》导出的作品图片。'});
  const abortRef = useRef(null);
  const pickRef = useRef(0);
  const pendingRef = useRef(new Set());
  const t = text => window.I18n218?.text(text) || text;
  const language = window.I18n218?.language || 'zh';
  const image = fileUrl || 'brand.svg';
  const heading = t('手筆 · 作品成影');
  const inputProps = useMemo(() => ({artwork: image, title, signature, heading, paperColor: '#e9dfca'}), [image, title, signature, heading]);

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
  useEffect(() => () => { if (fileUrl) URL.revokeObjectURL(fileUrl); }, [fileUrl]);
  useEffect(() => () => {
    pickRef.current++;
    abortRef.current?.abort();
    for (const url of pendingRef.current) URL.revokeObjectURL(url);
  }, []);

  async function onPick(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const pick = ++pickRef.current;
    setChecking(false);
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setStatus({key: '请选择 PNG、JPG 或 WebP 图片。'}); return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setStatus({key: '图片超过 30MB，请先从《手筆》重新导出较小版本。'}); return;
    }
    setChecking(true);
    setStatus({key: '正在读取图片…'});
    const candidate = URL.createObjectURL(file);
    pendingRef.current.add(candidate);
    let accepted = false;
    try {
      await decodeArtwork(candidate);
      if (pick !== pickRef.current) return;
      accepted = true;
      setFileUrl(candidate);
      setStatus({key: '作品已装载到本机预览，不会上传到云端。'});
    } catch (error) {
      if (pick === pickRef.current) setStatus({key: error.message});
    } finally {
      pendingRef.current.delete(candidate);
      if (!accepted) URL.revokeObjectURL(candidate);
      if (pick === pickRef.current) setChecking(false);
    }
  }

  async function exportVideo() {
    if (!fileUrl || busy || checking) return;
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
      <Player component={ShoubiShowcase} inputProps={inputProps} durationInFrames={240} fps={30} compositionWidth={1080} compositionHeight={1440} controls loop autoPlay={false} style={{width: '100%', aspectRatio: '3/4'}} />
    </section>
    <section className="vsSide">
      <h1>{t('让作品，慢慢入镜。')}</h1>
      <p>{t('保留真实笔迹、纸张与印章，为你的《手筆》作品制作一段 8 秒影像。')}</p>
      <label className="vsField">{t('导入已下载的作品图片')}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={onPick} disabled={busy} /></label>
      <label className="vsField">{t('作品标题')}<input value={title} maxLength={18} onChange={e => setTitle(e.target.value)} disabled={busy} translate="no" /></label>
      <label className="vsField">{t('落款')}<input value={signature} maxLength={35} onChange={e => setSignature(e.target.value)} disabled={busy} translate="no" /></label>
      <label className="vsField">{t('导出画质')}<select value={quality} onChange={e => setQuality(e.target.value)} disabled={busy}><option value="compact">{t('轻量 · 540 × 720')}</option><option value="full">{t('高清 · 1080 × 1440')}</option></select></label>
      <button type="button" className="vsButton" disabled={!fileUrl || busy || checking} onClick={exportVideo}>{t(busy ? '正在生成视频…' : '下载 MP4 视频')}</button>
      {busy && <button type="button" className="vsButton" onClick={() => abortRef.current?.abort()}>{t('取消合成')}</button>}
      <div className="vsStatus" role="status">{t(status.key).replace('{progress}', status.progress ?? '')}{status.detail ? t(status.detail) : ''}</div>
      <div className="vsNote">{t('所有作品图片只在当前设备处理，不写入云端，也不修改原作品。视频生成需要浏览器支持 WebCodecs；如不支持，可先在电脑使用 Chrome 或新版 Safari。此页面仅在主动进入时加载视频模块。')}<p>{t('Remotion 会向其服务发送不含作品内容的使用统计，包括站点来源、网络地址及生成状态。')}</p><p>{t('手机和平板兼容性仍在验证中，建议先使用轻量画质。')}</p></div>
    </section>
  </div>;
}

createRoot(document.getElementById('videoStudioApp')).render(<Studio />);
