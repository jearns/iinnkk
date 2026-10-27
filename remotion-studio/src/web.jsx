import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import {canRenderMediaOnWeb, renderMediaOnWeb} from '@remotion/web-renderer';
import {ShoubiShowcase} from './showcase.jsx';

const COMPOSITION = {
  id: 'ShoubiShowcase', component: ShoubiShowcase,
  durationInFrames: 240, fps: 30, width: 1080, height: 1440,
};

function Studio() {
  const [fileUrl, setFileUrl] = useState(null);
  const [title, setTitle] = useState('一纸一世界');
  const [signature, setSignature] = useState('手筆 · 以手为笔，随时写字');
  const [quality, setQuality] = useState('compact');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('请选择从《手筆》导出的作品图片。');
  const abortRef = useRef(null);
  const image = fileUrl || 'brand.svg';
  const inputProps = useMemo(() => ({artwork: image, title, signature, paperColor: '#e9dfca'}), [image, title, signature]);

  useEffect(() => () => {
    abortRef.current?.abort();
    if (fileUrl) URL.revokeObjectURL(fileUrl);
  }, [fileUrl]);

  function onPick(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setStatus('请选择 PNG、JPG 或 WebP 图片。'); return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setStatus('图片超过 30MB，请先从《手筆》重新导出较小版本。'); return;
    }
    setFileUrl(URL.createObjectURL(file));
    setStatus('作品已装载到本机预览，不会上传到云端。');
  }

  async function exportVideo() {
    if (!fileUrl || busy) return;
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const scale = quality === 'compact' ? 0.5 : 1;
      setStatus('正在检测本机 MP4 编码能力…');
      const support = await canRenderMediaOnWeb({width: 1080, height: 1440, scale, container: 'mp4', videoCodec: 'h264', muted: true});
      if (!support.canRender) throw new Error(support.issues.filter(x => x.severity === 'error').map(x => x.message).join('；') || '此浏览器无法编码 MP4');
      const {getBlob} = await renderMediaOnWeb({
        composition: COMPOSITION,
        inputProps,
        container: 'mp4', videoCodec: 'h264', muted: true,
        scale, pageResponsiveness: 'high', videoBitrate: quality === 'compact' ? 'medium' : 'high',
        signal: controller.signal,
        onProgress: ({progress}) => setStatus('正在本机合成视频 ' + Math.round(progress * 100) + '%'),
      });
      const blob = await getBlob();
      if (!blob?.size) throw new Error('导出结果为空');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '手筆-作品成影.mp4';
      document.body.appendChild(a);
      a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setStatus('视频已生成，请检查浏览器下载列表。');
    } catch (error) {
      setStatus(controller.signal.aborted ? '已取消合成。' : '暂无法导出：' + (error?.message || '未知错误'));
    } finally {
      abortRef.current = null;
      setBusy(false);
    }
  }

  return <div className="vsLayout">
    <section className="vsPreview" aria-label="作品动画预览">
      <Player component={ShoubiShowcase} inputProps={inputProps} durationInFrames={240} fps={30} compositionWidth={1080} compositionHeight={1440} controls loop autoPlay={false} style={{width: '100%', aspectRatio: '3/4'}} />
    </section>
    <section className="vsSide">
      <h1>让作品，慢慢入镜。</h1>
      <p>保留真实笔迹、纸张与印章，为你的《手筆》作品制作一段 8 秒影像。</p>
      <label className="vsField">导入已下载的作品图片<input type="file" accept="image/png,image/jpeg,image/webp" onChange={onPick} disabled={busy} /></label>
      <label className="vsField">作品标题<input value={title} maxLength={18} onChange={e => setTitle(e.target.value)} disabled={busy} /></label>
      <label className="vsField">落款<input value={signature} maxLength={35} onChange={e => setSignature(e.target.value)} disabled={busy} /></label>
      <label className="vsField">导出画质<select value={quality} onChange={e => setQuality(e.target.value)} disabled={busy}><option value="compact">轻量 · 540 × 720</option><option value="full">高清 · 1080 × 1440</option></select></label>
      <button type="button" className="vsButton" disabled={!fileUrl || busy} onClick={exportVideo}>{busy ? '正在生成视频…' : '下载 MP4 视频'}</button>
      {busy && <button type="button" className="vsButton" onClick={() => abortRef.current?.abort()}>取消合成</button>}
      <div className="vsStatus" role="status">{status}</div>
      <div className="vsNote">所有作品图片只在当前设备处理，不写入云端，也不修改原作品。视频生成需要浏览器支持 WebCodecs；如不支持，可先在电脑使用 Chrome 或新版 Safari。此页面仅在主动进入时加载视频模块。</div>
    </section>
  </div>;
}

createRoot(document.getElementById('videoStudioApp')).render(<Studio />);
