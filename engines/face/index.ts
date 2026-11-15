export const FACE_VERSION = 'geometry-1.0.0';
export type Point = { x: number; y: number; z?: number };
export type FaceMetrics = {
  heightToWidth: number;
  eyeGapToEye: number;
  eyeToWidth: number;
  noseToWidth: number;
  mouthToWidth: number;
  eyeTilt: number;
  vertical: number[];
  warnings: ('tilted' | 'small' | 'edge')[];
};
export const MAX_FILE_BYTES = 8 * 1024 * 1024;
export function validImageHeader(bytes: Uint8Array, mime: string) {
  if (mime === 'image/png')
    return [137, 80, 78, 71, 13, 10, 26, 10].every((n, i) => bytes[i] === n);
  if (mime === 'image/jpeg') return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (mime === 'image/webp')
    return (
      String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
      String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
    );
  return false;
}
export function verticalShares(refs: number[]) {
  if (
    refs.length !== 4 ||
    refs.some((v) => !Number.isFinite(v) || v < 0 || v > 100) ||
    refs.some((v, i) => i > 0 && v <= refs[i - 1])
  )
    throw new Error('INVALID_REFERENCES');
  const total = refs[3] - refs[0];
  return refs.slice(1).map((v, i) => ((v - refs[i]) / total) * 100);
}
export function measureFace(points: Point[], width: number, height: number): FaceMetrics {
  if (
    points.length !== 478 ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0 ||
    points.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y))
  )
    throw new Error('INVALID_GEOMETRY');
  const p = (id: number) => ({ x: points[id].x * width, y: points[id].y * height });
  const distance = (a: number, b: number) => Math.hypot(p(a).x - p(b).x, p(a).y - p(b).y);
  const faceWidth = distance(234, 454);
  const faceHeight = distance(10, 152);
  const eyeWidth = (distance(33, 133) + distance(362, 263)) / 2;
  if (Math.min(faceWidth, faceHeight, eyeWidth) < 1) throw new Error('INVALID_GEOMETRY');
  const axis = { x: p(152).x - p(10).x, y: p(152).y - p(10).y };
  const project = (id: number) =>
    ((p(id).x - p(10).x) * axis.x + (p(id).y - p(10).y) * axis.y) / faceHeight ** 2;
  const refs = [0, project(9) * 100, project(2) * 100, 100];
  const eyeTilt = (Math.atan2(p(263).y - p(33).y, p(263).x - p(33).x) * 180) / Math.PI;
  const warnings: FaceMetrics['warnings'] = [];
  if (Math.abs(eyeTilt) > 12) warnings.push('tilted');
  if (faceWidth / width < 0.22) warnings.push('small');
  if (
    [10, 152, 234, 454].some(
      (id) =>
        points[id].x < 0.025 ||
        points[id].x > 0.975 ||
        points[id].y < 0.025 ||
        points[id].y > 0.975,
    )
  )
    warnings.push('edge');
  return {
    heightToWidth: faceHeight / faceWidth,
    eyeGapToEye: distance(133, 362) / eyeWidth,
    eyeToWidth: eyeWidth / faceWidth,
    noseToWidth: distance(98, 327) / faceWidth,
    mouthToWidth: distance(61, 291) / faceWidth,
    eyeTilt,
    vertical: verticalShares(refs),
    warnings,
  };
}
// Deliberately omits the photo, filename, individual coordinates and identity data.
export function faceReport(metrics: FaceMetrics, width: number, height: number, manual?: number[]) {
  return {
    version: FACE_VERSION,
    method: 'MediaPipe Face Landmarker 0.10.21; model float16/1; 2D pixel geometry',
    dimensions: { width, height },
    landmarkCount: 478,
    metrics,
    ...(manual ? { manualVerticalPercent: verticalShares(manual) } : {}),
    limitation:
      'Image geometry only; not physical measurements or personal trait/fate predictions.',
  };
}
