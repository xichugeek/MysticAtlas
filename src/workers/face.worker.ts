import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let model: Promise<FaceLandmarker> | undefined;
// A classic worker is intentional: this pinned runtime loads its WASM glue via importScripts.
self.onmessage = async (event: MessageEvent<{ id: number; bitmap: ImageBitmap }>) => {
  const { id, bitmap } = event.data;
  try {
    self.postMessage({ id, phase: 'loading' });
    model ??= FilesetResolver.forVisionTasks('/vision').then((files) =>
      FaceLandmarker.createFromOptions(files, {
        baseOptions: { modelAssetPath: '/face/face_landmarker.task', delegate: 'CPU' },
        runningMode: 'IMAGE',
        numFaces: 2,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false,
      }),
    );
    const detector = await model;
    self.postMessage({ id, phase: 'detecting' });
    const result = detector.detect(bitmap);
    self.postMessage({
      id,
      count: result.faceLandmarks.length,
      points: result.faceLandmarks.length === 1 ? result.faceLandmarks[0] : [],
    });
  } catch {
    model = undefined;
    self.postMessage({ id, error: 'MODEL_ERROR' });
  } finally {
    bitmap.close();
  }
};
