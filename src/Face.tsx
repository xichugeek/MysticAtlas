import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Download, ScanFace, ShieldCheck, Trash2, Upload } from 'lucide-react';
import {
  FACE_VERSION,
  faceReport,
  MAX_FILE_BYTES,
  measureFace,
  validImageHeader,
  verticalShares,
  type FaceMetrics,
  type Point,
} from '../engines/face';
import type { Lang } from './i18n';
import './face.css';

const text = {
  zh: {
    title: '面相文化与五官图谱',
    intro: '从一张照片，读懂五官的几何关系。',
    detail:
      '本地识别 478 个面部关键点，给出图像比例与可核对的测量方式。文化资料单独阅读，不据外貌推断性格、健康、财富或命运。',
    local: '照片在浏览器内处理，不上传、不保存',
    upload: '选择照片',
    demo: '使用公开示例',
    formats: 'PNG / JPEG / WebP · 最大 8 MiB · 单人正面、光线均匀、无遮挡',
    empty: '放入一张照片，展开五官图谱',
    emptyNote: '也可以先使用 NASA 公开示例体验真实检测。',
    clear: '清除照片与结果',
    retry: '重新检测',
    export: '导出几何报告',
    points: '显示关键点',
    guides: '显示测量线',
    results: '几何分析结果',
    waiting: '等待照片',
    loading: '正在加载本地模型…',
    decoding: '正在读取照片…',
    detecting: '正在检测关键点…',
    done: '检测完成 · 478 个关键点',
    pending: '检测完成后，这里会显示实际比例结果。',
    labels: [
      '额部至下颏 / 面部宽度',
      '内眼角间距 / 平均眼宽',
      '平均眼宽 / 面部宽度',
      '鼻翼宽 / 面部宽度',
      '口宽 / 面部宽度',
      '眼线倾角',
    ],
    units: '倍',
    vertical: '纵向参考分段',
    verticalNote:
      '自动参考：额部点 10 → 眉间点 9 → 鼻底点 2 → 下颏点 152。额部点不是发际线，不能直接当作“三庭”。',
    manual: '手动标记发际线等参考线',
    manualNote:
      '输入照片从顶部起的纵向位置（%），由你标定，不是模型检测。请使用正面、头部端正的照片。',
    refs: ['发际线', '眉线', '鼻底', '下颏'],
    segments: ['上段', '中段', '下段'],
    invalidRefs: '四条线须在 0–100% 内，并自上而下严格递增。',
    manualResult: '手动参考分段',
    limitation:
      '比例基于照片的二维投影，受角度、表情、镜头和遮挡影响，不是实际身体尺寸，也不评分。',
    warnings: {
      tilted: '眼线倾斜较明显，建议使用头部端正的照片。',
      small: '面部在画面中偏小，建议换用清晰近照。',
      edge: '部分轮廓靠近画面边缘，可能存在裁切。',
    },
    errors: {
      FILE: '请选择格式正确的 PNG、JPEG 或 WebP 图片。',
      SIZE: '图片超过 8 MiB，请压缩后重试。',
      DIMENSIONS: '图片尺寸过大或无效，请使用不超过 3200 万像素的图片。',
      DECODE: '无法读取这张图片，请换一张重试。',
      NO_FACE: '没有检测到面部。请使用光线均匀、五官清晰的正面照片。',
      MULTIPLE_FACES: '检测到多张面部。请裁切为单人照片后重试。',
      MODEL_ERROR: '本地模型未能运行，请重新检测；也可检查浏览器是否支持 WebAssembly 与 Worker。',
      TIMEOUT: '检测超时，请重新检测或换用较小的图片。',
      INVALID_GEOMETRY: '这张照片的参考点无法形成有效比例，请换用端正的正面照片。',
    },
    source:
      '示例：NASA 公开照片，经 scikit-image 提供；公有领域。仅用于演示，不代表照片人物认可本项目。',
    culture: '文化阅读 · 与个人检测结果分开',
    cards: [
      [
        '三庭：纵向分区的术语',
        '绘画教学常用发际线、眉线、鼻底、下颏划分三个区域。这里仅解释分区方法；模型不能可靠确定发际线，因此提供手动参考线。',
      ],
      [
        '五眼：横向观察的参照',
        '“五眼”在人物头像教学中用作比较眼宽与横向间距的示意。这里展示实测比值，不把教学示意当作适用于所有人的标准。',
      ],
      [
        '从面相术语到可观察图谱',
        '传统面相叙事不能从照片验证一个人的经历或未来。本页只呈现位置、距离和资料，不生成吉凶、性格或人生判断。',
      ],
    ],
    sources: '资料与测量说明',
    drawingSource: '清华大学出版社《设计素描》样章：人物头像比例教学',
    modelSource: 'Google MediaPipe：Face Landmarker 官方说明',
    photoSource: 'scikit-image：公开示例来源与权利说明',
    formula:
      '面宽：234–454；额颏长：10–152；眼宽：33–133 与 362–263 的均值；眼间距：133–362；鼻翼：98–327；口宽：61–291。距离先按图像宽高换算为像素，再取欧氏距离。自动纵向分段沿额颏轴投影；手动分段按纵坐标计算。报告不含照片、文件名或逐点坐标。',
  },
  en: {
    title: 'Face atlas · culture & geometry',
    intro: 'Explore the geometry in a portrait.',
    detail:
      'Detect 478 facial landmarks locally, with measured image ratios and transparent formulas. Read cultural material separately; appearance does not establish personality, health, wealth or fate.',
    local: 'Processed in your browser. No photo uploads or storage.',
    upload: 'Choose a photo',
    demo: 'Try public example',
    formats: 'PNG / JPEG / WebP · Up to 8 MiB · One clear, unobstructed, front-facing portrait',
    empty: 'A portrait becomes a map of landmarks',
    emptyNote: 'Try the public NASA example to run the actual detector.',
    clear: 'Clear photo and results',
    retry: 'Detect again',
    export: 'Export geometry report',
    points: 'Show landmarks',
    guides: 'Show measurement guides',
    results: 'Geometry results',
    waiting: 'Waiting for a photo',
    loading: 'Loading local model…',
    decoding: 'Reading photo…',
    detecting: 'Detecting landmarks…',
    done: 'Complete · 478 landmarks',
    pending: 'Measured ratios will appear here after detection.',
    labels: [
      'Forehead–chin / face width',
      'Inner-eye gap / mean eye width',
      'Mean eye width / face width',
      'Nose width / face width',
      'Mouth width / face width',
      'Eye-line tilt',
    ],
    units: '×',
    vertical: 'Vertical reference segments',
    verticalNote:
      'Automatic reference: forehead point 10 → brow point 9 → nose-base point 2 → chin point 152. The forehead point is not a hairline; these are not the traditional three regions.',
    manual: 'Manually mark hairline and reference lines',
    manualNote:
      'Enter vertical positions as % from the image top. These are your annotations, not model detections. Use an upright, front-facing photo.',
    refs: ['Hairline', 'Brow', 'Nose base', 'Chin'],
    segments: ['Upper', 'Middle', 'Lower'],
    invalidRefs: 'Four lines must be within 0–100% and strictly increase from top to bottom.',
    manualResult: 'Manually annotated segments',
    limitation:
      'Ratios describe a 2D image projection. Pose, expression, lens and occlusion affect them. They are not physical dimensions or scores.',
    warnings: {
      tilted: 'The eye line is tilted. Try an upright portrait.',
      small: 'The face is small in the frame. Try a clear close-up.',
      edge: 'Some landmarks are close to the image edge; the face may be cropped.',
    },
    errors: {
      FILE: 'Choose a valid PNG, JPEG or WebP image.',
      SIZE: 'The file exceeds 8 MiB. Compress it and try again.',
      DIMENSIONS: 'Invalid or oversized image. Use an image under 32 megapixels.',
      DECODE: 'This image could not be read. Try another photo.',
      NO_FACE: 'No face detected. Try an evenly lit, clear, front-facing portrait.',
      MULTIPLE_FACES: 'Multiple faces detected. Crop the image to a single person and try again.',
      MODEL_ERROR:
        'The local model could not run. Retry, or check browser support for WebAssembly and Workers.',
      TIMEOUT: 'Detection timed out. Retry or choose a smaller image.',
      INVALID_GEOMETRY:
        'The reference points could not form valid ratios. Try an upright, front-facing portrait.',
    },
    source:
      'Example: public-domain NASA photo supplied by scikit-image. Demonstration only; no endorsement by the person pictured.',
    culture: 'Cultural reading · separate from personal measurements',
    cards: [
      [
        'Three regions: vertical terminology',
        'Portrait instruction uses the hairline, brow, nose base and chin to describe three regions. The model does not reliably detect a hairline, so optional manual reference lines are provided.',
      ],
      [
        'Five eyes: a drawing reference',
        'The “five eyes” convention compares eye widths and horizontal gaps in portrait instruction. Measured ratios are shown here without treating the convention as a universal standard.',
      ],
      [
        'From traditional terminology to observation',
        'A photograph cannot validate traditional claims about someone’s life or future. This page presents positions, distances and sources, without fortune or personality judgments.',
      ],
    ],
    sources: 'Sources & measurement method',
    drawingSource: 'Tsinghua University Press: Design Sketch sample, portrait proportions',
    modelSource: 'Google MediaPipe: official Face Landmarker guide',
    photoSource: 'scikit-image: example attribution and rights',
    formula:
      'Face width: 234–454; forehead–chin: 10–152; eye width: mean of 33–133 and 362–263; inner-eye gap: 133–362; nose: 98–327; mouth: 61–291. Coordinates are converted to image pixels before Euclidean distances. Automatic vertical segments project onto the forehead–chin axis; manual segments use image y positions. Exports omit the photo, filename and individual coordinates.',
  },
};
type ErrorCode = keyof typeof text.zh.errors;
type Phase = 'waiting' | 'decoding' | 'loading' | 'detecting' | 'done';

export default function Face({ lang }: { lang: Lang }) {
  const t = text[lang];
  const [image, setImage] = useState<ImageBitmap | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [metrics, setMetrics] = useState<FaceMetrics | null>(null);
  const [phase, setPhase] = useState<Phase>('waiting');
  const [error, setError] = useState<ErrorCode | null>(null);
  const [showPoints, setShowPoints] = useState(true);
  const [guides, setGuides] = useState(true);
  const [example, setExample] = useState(false);
  const [manual, setManual] = useState(false);
  const [refs, setRefs] = useState<number[]>([NaN, NaN, NaN, NaN]);
  const canvas = useRef<HTMLCanvasElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const memory = useRef<ImageBitmap | null>(null);
  const worker = useRef<Worker | null>(null);
  const generation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fetchController = useRef<AbortController | null>(null);
  const busy = ['loading', 'decoding', 'detecting'].includes(phase) && !error;
  let shares: number[] | null = null;
  try {
    shares = verticalShares(refs);
  } catch {
    /* Validation is shown next to the inputs. */
  }
  function stop() {
    worker.current?.terminate();
    worker.current = null;
    clearTimeout(timer.current);
    fetchController.current?.abort();
    fetchController.current = null;
  }
  function release() {
    generation.current++;
    stop();
    memory.current?.close();
    memory.current = null;
  }
  function clear() {
    release();
    setImage(null);
    setPoints([]);
    setMetrics(null);
    setPhase('waiting');
    setError(null);
    setExample(false);
    setManual(false);
    setRefs([NaN, NaN, NaN, NaN]);
    if (input.current) input.current.value = '';
  }
  useEffect(() => () => release(), []);
  function fail(code: ErrorCode, id: number) {
    if (id !== generation.current) return;
    stop();
    setError(code);
  }
  async function detect(bitmap: ImageBitmap, id: number) {
    setPhase('loading');
    try {
      const transfer = await createImageBitmap(bitmap);
      if (id !== generation.current) {
        transfer.close();
        return;
      }
      const task = new Worker('/vision/face-worker.js');
      worker.current = task;
      timer.current = setTimeout(() => fail('TIMEOUT', id), 45000);
      task.onerror = () => fail('MODEL_ERROR', id);
      task.onmessage = (
        event: MessageEvent<{
          id: number;
          phase?: 'loading' | 'detecting';
          error?: string;
          count: number;
          points: Point[];
        }>,
      ) => {
        const data = event.data;
        if (data.id !== generation.current) return;
        if (data.phase) {
          setPhase(data.phase);
          return;
        }
        if (data.error) {
          fail('MODEL_ERROR', id);
          return;
        }
        if (data.count !== 1) {
          fail(data.count === 0 ? 'NO_FACE' : 'MULTIPLE_FACES', id);
          return;
        }
        try {
          const result = measureFace(data.points, bitmap.width, bitmap.height);
          setMetrics(result);
          setPoints(data.points);
          setPhase('done');
          stop();
        } catch {
          fail('INVALID_GEOMETRY', id);
        }
      };
      task.postMessage({ id, bitmap: transfer }, [transfer]);
    } catch {
      fail('MODEL_ERROR', id);
    }
  }
  async function load(file?: File, publicExample = false) {
    clear();
    const id = generation.current;
    setPhase('decoding');
    let decoded: ImageBitmap | undefined;
    try {
      let blob: Blob;
      if (publicExample) {
        fetchController.current = new AbortController();
        const response = await fetch('/face/example.png', {
          signal: fetchController.current.signal,
        });
        if (!response.ok) throw new Error('DECODE');
        blob = await response.blob();
      } else {
        if (!file) {
          setPhase('waiting');
          return;
        }
        blob = file;
      }
      if (id !== generation.current) return;
      if (blob.size > MAX_FILE_BYTES) {
        fail('SIZE', id);
        return;
      }
      const header = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
      if (id !== generation.current) return;
      if (!validImageHeader(header, blob.type)) {
        fail('FILE', id);
        return;
      }
      decoded = await createImageBitmap(blob, { imageOrientation: 'from-image' });
      if (id !== generation.current) {
        decoded.close();
        return;
      }
      if (
        decoded.width * decoded.height > 32_000_000 ||
        decoded.width < 32 ||
        decoded.height < 32
      ) {
        decoded.close();
        fail('DIMENSIONS', id);
        return;
      }
      const scale = Math.min(1, 1440 / Math.max(decoded.width, decoded.height));
      if (scale < 1) {
        const resized = await createImageBitmap(decoded, {
          resizeWidth: Math.round(decoded.width * scale),
          resizeHeight: Math.round(decoded.height * scale),
          resizeQuality: 'high',
        });
        decoded.close();
        decoded = resized;
      }
      if (id !== generation.current) {
        decoded.close();
        return;
      }
      memory.current = decoded;
      setImage(decoded);
      setExample(publicExample);
      await detect(decoded, id);
    } catch {
      decoded?.close();
      fail('DECODE', id);
    }
  }
  useEffect(() => {
    const node = canvas.current;
    if (!node || !image) return;
    node.width = image.width;
    node.height = image.height;
    const context = node.getContext('2d');
    if (!context) return;
    context.drawImage(image, 0, 0);
    const line = (ids: number[]) => {
      context.beginPath();
      ids.forEach((id, i) => {
        const p = points[id];
        if (i) context.lineTo(p.x * node.width, p.y * node.height);
        else context.moveTo(p.x * node.width, p.y * node.height);
      });
      context.stroke();
    };
    if (points.length && guides) {
      context.strokeStyle = '#ffe5a4';
      context.lineWidth = Math.max(1.5, node.width / 400);
      for (const ids of [
        [234, 454],
        [10, 152],
        [33, 133],
        [362, 263],
        [133, 362],
        [98, 327],
        [61, 291],
      ])
        line(ids);
    }
    if (points.length && showPoints) {
      context.fillStyle = '#adf0df';
      for (const p of points) {
        context.beginPath();
        context.arc(
          p.x * node.width,
          p.y * node.height,
          Math.max(1, node.width / 450),
          0,
          Math.PI * 2,
        );
        context.fill();
      }
    }
    if (manual && shares) {
      context.strokeStyle = '#fff';
      context.setLineDash([6, 6]);
      context.lineWidth = Math.max(1.5, node.width / 400);
      for (const value of refs) {
        context.beginPath();
        context.moveTo(0, (node.height * value) / 100);
        context.lineTo(node.width, (node.height * value) / 100);
        context.stroke();
      }
    }
  }, [image, points, showPoints, guides, manual, refs]);
  function download() {
    if (!metrics || !image || (manual && !shares)) return;
    const blob = new Blob(
      [
        JSON.stringify(
          faceReport(metrics, image.width, image.height, manual ? refs : undefined),
          null,
          2,
        ),
      ],
      { type: 'application/json' },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mysticatlas-face-geometry.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const values = metrics
    ? [
        metrics.heightToWidth,
        metrics.eyeGapToEye,
        metrics.eyeToWidth,
        metrics.noseToWidth,
        metrics.mouthToWidth,
        metrics.eyeTilt,
      ]
    : [];
  return (
    <div className="page face-page">
      <div className="page-heading face-heading">
        <span className="eyebrow">
          <ScanFace size={16} /> FACE ATLAS · 03
        </span>
        <h1>{t.title}</h1>
        <p className="face-lead">{t.intro}</p>
        <p>{t.detail}</p>
        <span className="face-local">
          <ShieldCheck size={17} />
          {t.local}
        </span>
      </div>
      <div className="face-grid">
        <section className="face-workbench" aria-label={t.title}>
          <div className="face-toolbar">
            <label className="button primary face-file">
              <Upload size={17} />
              {t.upload}
              <input
                ref={input}
                aria-label={t.upload}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  void load(e.currentTarget.files?.[0]);
                }}
              />
            </label>
            <button
              className="button secondary"
              onClick={() => {
                void load(undefined, true);
              }}
            >
              {t.demo}
            </button>
          </div>
          <p className="small muted">{t.formats}</p>
          <div className="face-stage">
            {image ? (
              <canvas
                ref={canvas}
                role="img"
                aria-label={
                  lang === 'zh' ? '照片与面部关键点叠加图' : 'Photo with facial landmark overlay'
                }
                data-testid="face-canvas"
              />
            ) : (
              <div className="face-placeholder">
                <FaceArt />
                <h2>{t.empty}</h2>
                <p>{t.emptyNote}</p>
              </div>
            )}
            {busy && (
              <div className="face-progress" role="status">
                {t[phase]}
              </div>
            )}
          </div>
          {example && <p className="face-attribution">{t.source}</p>}
          {error && (
            <p className="notice error" role="alert">
              {t.errors[error]}
            </p>
          )}
          {image && (
            <div className="face-controls">
              <label>
                <input
                  type="checkbox"
                  checked={showPoints}
                  onChange={(e) => setShowPoints(e.target.checked)}
                />
                {t.points}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={guides}
                  onChange={(e) => setGuides(e.target.checked)}
                />
                {t.guides}
              </label>
            </div>
          )}
          {(image || busy || error) && (
            <div className="face-actions">
              {image && error && (
                <button
                  className="button secondary small-button"
                  onClick={() => {
                    stop();
                    generation.current++;
                    setError(null);
                    void detect(image, generation.current);
                  }}
                >
                  {t.retry}
                </button>
              )}
              <button className="text-link" onClick={clear}>
                <Trash2 size={16} />
                {t.clear}
              </button>
            </div>
          )}
        </section>
        <section className="face-results" aria-label={t.results}>
          <span className="eyebrow">LOCAL MEASUREMENTS</span>
          <h2>{t.results}</h2>
          <p
            className={`face-status ${metrics ? 'gold' : 'muted'}`}
            role="status"
            data-testid="face-status"
          >
            {error ? t.waiting : t[phase]}
          </p>
          {metrics ? (
            <>
              <dl className="face-metrics">
                {values.map((value, i) => (
                  <div key={t.labels[i]}>
                    <dt>{t.labels[i]}</dt>
                    <dd data-testid={`face-metric-${i}`}>
                      {value.toFixed(2)}
                      <small>{i === 5 ? '°' : t.units}</small>
                    </dd>
                  </div>
                ))}
              </dl>
              <h3>{t.vertical}</h3>
              <Segments values={metrics.vertical} labels={t.segments} />
              <p className="small muted">{t.verticalNote}</p>
              {metrics.warnings.map((code) => (
                <p className="face-warning" key={code}>
                  {t.warnings[code]}
                </p>
              ))}
              <details className="face-calibration">
                <summary>{t.manual}</summary>
                <p className="small muted">{t.manualNote}</p>
                <label>
                  <input
                    type="checkbox"
                    checked={manual}
                    onChange={(e) => setManual(e.target.checked)}
                  />
                  {t.manualResult}
                </label>
                {manual && (
                  <>
                    <div className="face-ref-inputs">
                      {refs.map((value, i) => (
                        <label key={i}>
                          {t.refs[i]} (%)
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={Number.isNaN(value) ? '' : value}
                            onChange={(e) =>
                              setRefs(refs.map((v, j) => (j === i ? e.target.valueAsNumber : v)))
                            }
                          />
                        </label>
                      ))}
                    </div>
                    {shares ? (
                      <Segments values={shares} labels={t.segments} />
                    ) : (
                      <p role="alert">{t.invalidRefs}</p>
                    )}
                  </>
                )}
              </details>
              <button
                className="button secondary face-export"
                onClick={download}
                disabled={manual && !shares}
              >
                <Download size={16} />
                {t.export}
              </button>
            </>
          ) : (
            <div className="face-result-empty">
              <ScanFace size={40} />
              <p>{t.pending}</p>
            </div>
          )}
          <p className="face-limitation">{t.limitation}</p>
          <span className="mono">{FACE_VERSION}</span>
        </section>
      </div>
      <section className="face-culture">
        <div className="section-heading">
          <span className="eyebrow">CULTURAL NOTES</span>
          <h2>{t.culture}</h2>
        </div>
        <div className="face-culture-grid">
          {t.cards.map(([title, body], i) => (
            <article key={title}>
              <span className="mono">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <details className="face-sources">
        <summary>{t.sources}</summary>
        <p>{t.formula}</p>
        <ul>
          {[
            [t.drawingSource, 'https://www.tup.tsinghua.edu.cn/upload/books/yz/043619-01.pdf'],
            [
              t.modelSource,
              'https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js',
            ],
            [
              t.photoSource,
              'https://scikit-image.org/docs/stable/api/skimage.data.html#skimage.data.astronaut',
            ],
          ].map(([label, href]) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noreferrer">
                {label}
                <ArrowUpRight size={14} />
              </a>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
function Segments({ values, labels }: { values: number[]; labels: string[] }) {
  return (
    <div className="face-segments">
      {values.map((v, i) => (
        <div key={i}>
          <span>{labels[i]}</span>
          <strong>{v.toFixed(1)}%</strong>
          <meter min="0" max="100" value={v} aria-label={labels[i]} />
        </div>
      ))}
    </div>
  );
}
function FaceArt() {
  return (
    <svg viewBox="0 0 240 280" width="180" aria-hidden="true" fill="none">
      <ellipse cx="120" cy="136" rx="72" ry="103" stroke="currentColor" />
      <path
        d="M48 123Q80 93 104 123M136 123Q162 93 192 123M120 116L108 166H132M88 194Q120 214 152 194M40 85H200M32 137H208M40 191H200M120 20V255"
        stroke="currentColor"
        opacity=".55"
      />
      {[
        [48, 136],
        [192, 136],
        [120, 33],
        [120, 239],
        [76, 118],
        [98, 118],
        [142, 118],
        [164, 118],
        [108, 166],
        [132, 166],
        [88, 194],
        [152, 194],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="currentColor" />
      ))}
    </svg>
  );
}
