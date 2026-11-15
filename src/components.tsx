import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { getHexagram, trigram, type Hexagram } from '../engines/iching';
import { copy, type Lang } from './i18n';
import collation from '../knowledge/collation.json';

export function Mark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
export function HexLines({
  bits,
  moving = [],
  values,
  compact = false,
}: {
  bits: readonly number[];
  moving?: number[];
  values?: number[];
  compact?: boolean;
}) {
  return (
    <div
      className={`hex-lines ${compact ? 'compact' : ''}`}
      role="img"
      aria-label={`Bottom to top: ${bits.join(' ')}${moving.length ? `; changing: ${moving.join(', ')}` : ''}`}
    >
      {Array.from({ length: 6 }, (_, j) => {
        const i = 5 - j;
        const bit = bits[i];
        return (
          <div
            key={i}
            className={`hex-row ${moving.includes(i + 1) ? 'is-moving' : ''} ${bit === undefined ? 'is-pending' : ''}`}
          >
            {values && <span className="line-index">{i + 1}</span>}
            <span className={`yao ${bit === 0 ? 'yin' : 'yang'}`}>
              <i />
              <i />
            </span>
            {values && (
              <span className="line-value">
                {values[i] ?? '—'}
                {moving.includes(i + 1) ? ' ◇' : ''}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
export function HexCard({ h, lang }: { h: Hexagram; lang: Lang }) {
  return (
    <a className="hex-card" href={`#hexagram/${h.id}`}>
      <div className="card-top">
        <span className="mono">{String(h.id).padStart(2, '0')} / 64</span>
        <ArrowUpRight size={17} />
      </div>
      <HexLines bits={h.bits.split('').map(Number)} compact />
      <div className="hex-card-title">
        <h3>{h.name}</h3>
        <span>{h.pinyin}</span>
      </div>
      <p>{lang === 'zh' ? h.fullName : h.english}</p>
    </a>
  );
}
export function ClassicalText({
  h,
  lang,
  moving = [],
}: {
  h: Hexagram;
  lang: Lang;
  moving?: number[];
}) {
  const t = copy[lang];
  return (
    <section className="classics">
      <div className="section-title">
        <div>
          <span className="eyebrow">
            {t.classic} · {String(h.id).padStart(2, '0')}
          </span>
          <h2>
            {h.name} <small>{h.english}</small>
          </h2>
        </div>
        <a href={h.source.url} target="_blank" rel="noreferrer" className="text-link">
          {t.source}
          <ArrowUpRight size={15} />
        </a>
      </div>
      <p className="muted small">{t.original}</p>
      <div className="judgment">
        <span>{t.judgment}</span>
        <p lang="zh-CN">{h.judgment}</p>
      </div>
      <h3 className="subheading">{t.lineTexts}</h3>
      <div className="line-texts">
        {h.lineTexts.map((line, i) => (
          <div key={i} className={moving.includes(i + 1) ? 'highlight' : ''}>
            <span className="mono">0{i + 1}</span>
            <p lang="zh-CN">{line}</p>
            {moving.includes(i + 1) && <span className="pill">{t.moving}</span>}
          </div>
        ))}
      </div>
      {h.special && (
        <p className="special" lang="zh-CN">
          {h.special}
        </p>
      )}
      {collation.differences.some((d) => d.id === h.id) && (
        <details className="textual-variants">
          <summary>
            {lang === 'zh'
              ? '版本异文 · 待核验（非校勘定本）'
              : 'Textual differences · pending review (not a critical edition)'}
          </summary>
          <p>
            {lang === 'zh'
              ? '两份数字整理本在以下爻辞中存在文字差异。保留主来源，展示独立语料对照，不将任何一方视为权威定本。'
              : 'The two digital transcriptions differ below. We preserve the primary source and show the alternate; neither is presented as an authoritative edition.'}
          </p>
          {collation.differences
            .filter((d) => d.id === h.id)
            .map((d) => (
              <div key={d.line}>
                <span className="mono">{t.positionNames[d.line - 1]}</span>
                <p lang="zh-CN">A · {d.primary}</p>
                <p lang="zh-CN">B · {d.independent}</p>
              </div>
            ))}
        </details>
      )}
      <p className="muted small">{t.englishNote}</p>
      <p className="source-meta">
        {h.source.title} · {h.source.checkedAt} · {h.source.version.slice(0, 7)} ·{' '}
        {h.source.license}
      </p>
    </section>
  );
}
export function DiagramCard({
  h,
  label,
  lang,
  bits,
  moving = [],
  values,
}: {
  h: Hexagram;
  label: string;
  lang: Lang;
  bits: number[];
  moving?: number[];
  values?: number[];
}) {
  const t = copy[lang];
  const upper = trigram(h.upper);
  const lower = trigram(h.lower);
  return (
    <article className="diagram-card">
      <div className="card-top">
        <span className="eyebrow">{label}</span>
        <span className="mono">NO. {String(h.id).padStart(2, '0')}</span>
      </div>
      <HexLines bits={bits} moving={moving} values={values} />
      <div className="diagram-name">
        <h2>{h.name}</h2>
        <span>
          {h.pinyin} · {h.english}
        </span>
      </div>
      <div className="trigram-pair">
        <span>
          {t.upper} {upper.symbol}{' '}
          {lang === 'zh' ? upper.name + ' · ' + upper.nature : upper.english}
        </span>
        <span>
          {t.lower} {lower.symbol}{' '}
          {lang === 'zh' ? lower.name + ' · ' + lower.nature : lower.english}
        </span>
      </div>
      <a href={`#hexagram/${h.id}`} className="text-link">
        {t.classic}
        <ChevronRight size={15} />
      </a>
    </article>
  );
}
export function SampleArt({ lang }: { lang: Lang }) {
  const h = getHexagram(24);
  return (
    <div className="sample-art">
      <div className="orbit orbit-outer" />
      <div className="orbit orbit-middle" />
      <div className="orbit orbit-inner" />
      <div className="art-axis axis-h" />
      <div className="art-axis axis-v" />
      <div className="art-label label-top">
        {lang === 'zh' ? '阴阳相生 · 变易不息' : 'YIN & YANG · IN CONSTANT CHANGE'}
      </div>
      <div className="art-hex">
        <HexLines bits={h.bits.split('').map(Number)} />
        <span>地雷复</span>
        <small>24 · RETURN</small>
      </div>
      <div className="art-dot dot-one" />
      <div className="art-dot dot-two" />
      <span className="orbit-symbol symbol-one">☷</span>
      <span className="orbit-symbol symbol-two">☳</span>
      <div className="art-caption">
        <span className="tiny-square" />
        {copy[lang].sample} ·{' '}
        {lang === 'zh' ? '第二十四卦，地上有雷' : 'No. 24 · Earth above thunder'}
      </div>
    </div>
  );
}
