# 人像与景物遮挡（272）

默认合成顺序：原图背景、手写笔迹、仅人物前景。使用 DeepLab-v3 的 person 类（15），而非自拍模型的宽泛前景。模型只在开启遮挡时于 worker 中加载；不参与书写引擎启动。

来源：https://storage.googleapis.com/mediapipe-models/image_segmenter/deeplab_v3/float32/1/deeplab_v3.tflite
SHA-256: ff36e24d40547fe9e645e2f4e8745d1876d6e38b332d39a82f0bf0f5d1d561b3

每个媒体项的 effects.occlusion272 独立保存规范化画笔轨迹。add 在人物蒙版上补充景物，clear 让选区退到文字后。默认仅人像；不声称自动分割山或栏杆。取消不提交；完成后预览和导出使用同一蒙版。静态景物选区固定在视频画面中，不追踪移动的景物；人物逐帧分割。视频导出按录制时的选区快照及缩放同步映射。
