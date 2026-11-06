# 274: 图片裁切与轮廓选区

主画面：单指点图不调用旧图片编辑；书写保持单指落笔。两指同落一张图时，取消当前临时笔画，改为一个图片裁切事务。只改 crop.zoom/x/y，保持纸张、frame、原笔迹不变。纸张锁定不阻止显式裁切按钮。裁切面板使用 body 下固定原生 dialog，避免被画布裁掉或挡住；外框编辑单独提供。

图层面板：data-fixed224="true"（空属性值不能通过旧通用弹窗代码的真值检查），禁止面板拖动。双指只改变画布视图；第二指落下撤销未提交的细修痕迹，自动选区只在单指抬起后触发。图片放大后，归一化坐标及笔刷半径同步换算，显示缩放不写入作品。

自动轮廓：独立 worker 按点击位置运行 MagicTouch，取 subject 类并保留点击位置所在连通区域。选区按 RLE 存入每个媒体项 effects.occlusion272，预览和下载共用解码与合成。可撤回、与细修叠加。视频静态景物选区固定在源画面中，导出时随相机缩放映射；不承诺追踪移动景物。

模型来源： https://storage.googleapis.com/mediapipe-models/interactive_segmenter/magic_touch/float32/1/magic_touch.tflite
SHA-256: e24338a717c1b7ad8d159666677ef400babb7f33b8ad60c4d96db4ecf694cd25
