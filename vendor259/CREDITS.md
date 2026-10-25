MediaPipe Tasks Vision 0.10.14, Apache-2.0. See LICENSE.
https://github.com/google-ai-edge/mediapipe
Selfie segmenter and BlazeFace short-range model, official MediaPipe model assets:
https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite
https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite
Runtime and models are fetched only after choosing 去景. Images are processed locally and never uploaded. Person segmentation and the largest detected face determine the head, neck and upper shoulder region; results vary with framing and occlusion.

Release 272 photo/video occlusion uses DeepLab-v3 (PASCAL VOC person class 15), official MediaPipe model, Apache-2.0.
https://storage.googleapis.com/mediapipe-models/image_segmenter/deeplab_v3/float32/1/deeplab_v3.tflite
Stored as release272/person.tflite. Lazy local-only inference; no photo upload. User-painted scenery masks are stored with each media item.
