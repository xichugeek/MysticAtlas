import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Clock3, Compass, Download, RotateCcw } from 'lucide-react';
import {
  CALENDAR_VERSION,
  GRID,
  PALACE,
  QIMEN_VERSION,
  calculateQimen,
  type QimenChart,
} from '../engines/qimen';
import {
  ELEMENT_NAMES,
  QIMEN_READING_VERSION,
  TOPICS,
  exportQimen,
  qimenReading,
  type QimenTopic,
} from '../engines/qimen/reading';
import { qimenCopy, qimenName } from './qimen-copy';
import type { Lang } from './i18n';
import './qimen.css';

const currentTime = () => new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 19);
export default function Qimen({ lang }: { lang: Lang }) {
  const t = qimenCopy[lang],
    zh = lang === 'zh';
  const [dateTime, setDateTime] = useState(currentTime);
  const [topic, setTopic] = useState<QimenTopic>('general');
  const [question, setQuestion] = useState('');
  const [chart, setChart] = useState<QimenChart | null>(null);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState(1);
  const [includeQuestion, setIncludeQuestion] = useState(false);
  const result = useRef<HTMLElement>(null);
  const reading = chart ? qimenReading(chart, topic, lang) : null;
  const name = (value: string) => qimenName(value, lang);
  function changed() {
    setChart(null);
    setError(false);
    setIncludeQuestion(false);
  }
  function generate(value = dateTime, nextTopic = topic) {
    try {
      const next = calculateQimen({ dateTime: value });
      setChart(next);
      setError(false);
      setSelected(qimenReading(next, nextTopic, lang).targetPalace);
    } catch {
      setChart(null);
      setError(true);
    }
  }
  useLayoutEffect(() => {
    if (chart) {
      result.current?.focus({ preventScroll: true });
      result.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [chart]);
  function download() {
    if (!chart) return;
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            exportQimen(chart, topic, lang, includeQuestion ? question : undefined),
            null,
            2,
          ),
        ],
        { type: 'application/json' },
      ),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mysticatlas-qimen.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const chosen = chart?.palaces.find((p) => p.id === selected);
  return (
    <div className="page qimen-page">
      <div className="page-heading qimen-heading">
        <span className="eyebrow">
          <Compass size={16} /> QIMEN DUNJIA · 02
        </span>
        <h1>{t.title}</h1>
        <p className="qimen-lead">{t.intro}</p>
        <p>{t.description}</p>
        <span className="qimen-convention">{t.convention}</span>
      </div>
      <form
        className="qimen-form"
        onSubmit={(e) => {
          e.preventDefault();
          generate();
        }}
      >
        <div className="qimen-inputs">
          <label>
            {t.date}
            <input
              aria-label={t.date}
              required
              type="datetime-local"
              step="1"
              min="1901-01-01T00:00:00"
              max="2099-12-31T23:59:59"
              value={dateTime}
              onChange={(e) => {
                changed();
                setDateTime(e.target.value);
              }}
            />
          </label>
          <label>
            {t.topic}
            <select
              aria-label={t.topic}
              value={topic}
              onChange={(e) => {
                changed();
                setTopic(e.target.value as QimenTopic);
              }}
            >
              {TOPICS.map((key) => (
                <option key={key} value={key}>
                  {t.topics[key]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="small muted">{t.dateNote}</p>
        <label className="qimen-question">
          {t.question}
          <textarea
            aria-label={t.question}
            maxLength={300}
            rows={2}
            value={question}
            placeholder={t.placeholder}
            onChange={(e) => {
              changed();
              setQuestion(e.target.value);
            }}
          />
        </label>
        <div className="qimen-form-actions">
          <button className="button primary" type="submit">
            {t.submit}
            <ArrowRight size={17} />
          </button>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              changed();
              setDateTime(currentTime());
            }}
          >
            <Clock3 size={15} />
            {t.now}
          </button>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setDateTime('2026-03-18T15:20:00');
              setTopic('general');
              setQuestion('');
              setIncludeQuestion(false);
              generate('2026-03-18T15:20:00', 'general');
            }}
          >
            {t.sample}
          </button>
        </div>
        {error && (
          <p className="notice error" role="alert">
            {t.error}
          </p>
        )}
        <p className="qimen-privacy">{t.privacy}</p>
      </form>
      {chart && reading ? (
        <>
          <section className="qimen-reading" ref={result} tabIndex={-1} aria-label={t.result}>
            <div className="qimen-reading-top">
              <span className="eyebrow">{t.symbolic}</span>
              <span className="mono">{chart.input.dateTime.replace('T', ' ')} · UTC+8</span>
            </div>
            <h2>{t.result}</h2>
            <p className="qimen-result-question">{question || t.emptyQuestion}</p>
            <span className="pill available">{t.topics[topic]}</span>
            <h3 className="qimen-verdict" data-testid="qimen-verdict">
              {reading.verdict}
            </h3>
            <p className="qimen-answer">{reading.answer}</p>
            <div className="qimen-next">
              <strong>{t.action}</strong>
              <p>{reading.action}</p>
            </div>
            <details className="qimen-evidence" open>
              <summary>{t.evidence}</summary>
              <ul>
                {reading.evidence.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </details>
            <div className="qimen-scenarios" aria-label={t.scenarios}>
              {reading.scenarios.map((s, i) => (
                <article key={s.kind} data-scenario={s.kind}>
                  <span className="mono">0{i + 1}</span>
                  <h4>{s.condition}</h4>
                  <p>{s.outlook}</p>
                  <small>
                    {t.observe}：{s.observe}
                  </small>
                </article>
              ))}
            </div>
            <p className="qimen-revision">
              <strong>{t.revision}</strong> · {reading.revision}
            </p>
            <p className="qimen-method">{reading.method}</p>
            <p className="qimen-limitation">{t.limitation}</p>
          </section>
          <section className="qimen-chart-section" aria-label={t.chart}>
            <div className="qimen-section-title">
              <div>
                <span className="eyebrow">NINE PALACES</span>
                <h2>{t.chart}</h2>
              </div>
              <strong className="qimen-ju" data-testid="qimen-ju">
                {chart.dun === 'yang' ? t.yang : t.yin} {chart.ju} {t.ju}
              </strong>
            </div>
            <div className="qimen-pillars">
              {Object.entries(chart.pillars).map(([key, value], i) => (
                <div key={key}>
                  <small>{t.pillars[i]}</small>
                  <strong data-testid={`qimen-pillar-${key}`}>{value}</strong>
                </div>
              ))}
            </div>
            <dl className="qimen-metadata">
              {[
                [t.term, `${name(chart.term)} · ${t.yuanNames[chart.yuan]}`],
                [t.head, chart.head],
                [t.xun, `${chart.xun} · ${chart.hiddenStem}`],
                [t.chiefStar, `${name(chart.chiefStar)} → ${chart.chiefPalace}`],
                [t.chiefDoor, `${name(chart.chiefDoor)} → ${chart.doorPalace}`],
                [t.void, chart.voids.join('、')],
                [t.horse, chart.horseBranch],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            {chart.nearTermBoundary && (
              <p className="notice" role="status">
                {t.termBoundary}
              </p>
            )}
            <p className="qimen-orientation">{t.orientation}</p>
            <div className="qimen-board-layout">
              <div className="qimen-board" aria-label={t.chart}>
                {GRID.map((id) => {
                  const p = chart.palaces[id - 1],
                    info = PALACE[id];
                  return (
                    <button
                      type="button"
                      key={id}
                      data-testid={`qimen-palace-${id}`}
                      className={`qimen-palace ${selected === id ? 'selected' : ''} ${id === 5 ? 'qimen-center' : ''}`}
                      aria-pressed={selected === id}
                      aria-label={`${name(info.name)} ${id} ${t.palace}`}
                      onClick={() => setSelected(id)}
                    >
                      <span className="qimen-palace-heading">
                        <strong>
                          {name(info.name)} <b>{id}</b>
                        </strong>
                        <small>{info.direction}</small>
                      </span>
                      {id === 5 ? (
                        <>
                          <Compass size={26} />
                          <span className="qimen-center-note">
                            {zh ? '中五寄坤' : 'Lodges in Kun'}
                          </span>
                          <span className="qimen-stems">
                            {t.earth} {p.earth}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="qimen-deity">{name(p.deity)}</span>
                          <span className="qimen-star">{p.stars.map(name).join(' · ')}</span>
                          <span className="qimen-door">{name(p.door)}</span>
                          <span className="qimen-stems">
                            <span>
                              {t.heaven} {p.heaven.join('·')}
                            </span>
                            <span>
                              {t.earth} {p.earth}
                            </span>
                          </span>
                          <span className="qimen-palace-tags">
                            {chart.chiefPalace === id && <i>{zh ? '值符' : 'Chief star'}</i>}
                            {chart.doorPalace === id && <i>{zh ? '值使' : 'Chief door'}</i>}
                            {p.voidBranches.length > 0 && <i>{t.empty}</i>}
                            {p.horse && <i>{t.horseShort}</i>}
                            {p.doorPressure && <i>{t.pressure}</i>}
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
              {chosen && (
                <aside className="qimen-palace-detail" aria-label={t.detail}>
                  <span className="eyebrow">PALACE {chosen.id.toString().padStart(2, '0')}</span>
                  <h3>
                    {name(PALACE[chosen.id].name)} {chosen.id} {t.palace}
                  </h3>
                  <span className="mono">
                    {PALACE[chosen.id].direction} · {ELEMENT_NAMES[lang][PALACE[chosen.id].element]}
                  </span>
                  <dl>
                    {[
                      [t.heaven, chosen.heaven.join(' · ') || '—'],
                      [t.earth, chosen.earth],
                      [t.star, chosen.stars.map(name).join(' · ') || '—'],
                      [t.door, name(chosen.door) || '—'],
                      [t.deity, name(chosen.deity) || '—'],
                      [t.void, chosen.voidBranches.join('、') || '—'],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="qimen-detail-badges">
                    {chosen.id === reading.selfPalace && <span className="pill">{t.self}</span>}
                    {chosen.id === reading.targetPalace && (
                      <span className="pill available">{t.target}</span>
                    )}
                  </div>
                  <p className="small muted">{t.lodge}</p>
                  <p className="small muted">{t.useRule}</p>
                </aside>
              )}
            </div>
            <div className="qimen-export">
              <div>
                <button type="button" className="button secondary" onClick={download}>
                  <Download size={16} />
                  {t.export}
                </button>
                <label>
                  <input
                    type="checkbox"
                    checked={includeQuestion}
                    onChange={(e) => setIncludeQuestion(e.target.checked)}
                  />
                  {t.includeQuestion}
                </label>
              </div>
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  changed();
                  setQuestion('');
                }}
              >
                <RotateCcw size={16} />
                {t.reset}
              </button>
            </div>
          </section>
          <details className="qimen-rules">
            <summary>{t.rules}</summary>
            <ol>
              <li>
                <strong>{t.stepNames[0]}</strong>
                <p>
                  {name(chart.term)} {chart.termTime} (UTC+8) → {t.yuanNames[chart.yuan]} ·{' '}
                  {chart.head} → {chart.dun === 'yang' ? t.yang : t.yin} {chart.ju} {t.ju}
                </p>
                <p>
                  {t.nextTerm}：{name(chart.nextTerm)} {chart.nextTermTime}
                </p>
              </li>
              <li>
                <strong>{t.stepNames[1]}</strong>
                <p>
                  {zh
                    ? '从局数起戊，按宫数阳顺阴逆布'
                    : 'From Ju, place stems by palace number; forward for Yang, backward for Yin:'}{' '}
                  戊 己 庚 辛 壬 癸 丁 丙 乙
                </p>
              </li>
              <li>
                <strong>{t.stepNames[2]}</strong>
                <p>
                  {chart.xun} → {chart.hiddenStem} → {zh ? '原宫' : 'original palace'}{' '}
                  {chart.origin} / {zh ? '寄宫' : 'effective palace'} {chart.effectiveOrigin}；
                  {zh ? '时干地盘宫' : 'hour-stem earth palace'} {chart.hourStemPalace}
                </p>
              </li>
              <li>
                <strong>{t.stepNames[3]}</strong>
                <p>
                  {zh ? '外圈顺序' : 'Outer ring'} 1 → 8 → 3 → 4 → 9 → 2 → 7 → 6；
                  {zh ? '值使数九宫落点' : 'chief-door numeric destination'} {chart.rawDoorPalace} →{' '}
                  {chart.doorPalace}
                </p>
                <p>
                  {t.pattern}：{t.patterns[chart.starPattern as keyof typeof t.patterns]} /{' '}
                  {t.patterns[chart.doorPattern as keyof typeof t.patterns]}
                </p>
              </li>
            </ol>
            <p>{t.sourceNote}</p>
            <p className="mono">
              {QIMEN_VERSION}
              <br />
              {CALENDAR_VERSION}
              <br />
              {QIMEN_READING_VERSION}
            </p>
          </details>
        </>
      ) : (
        <div className="qimen-empty">
          <Compass size={60} />
          <h2>{t.noResult}</h2>
          <p>{t.noResultNote}</p>
        </div>
      )}
      <details className="qimen-sources">
        <summary>{t.sources}</summary>
        <p>{t.sourceNote}</p>
        <ul>
          <li>
            <a href="https://6tail.cn/calendar/api.html" target="_blank" rel="noreferrer">
              lunar-typescript 1.8.7 · {zh ? '历法 API 与 MIT 许可' : 'Calendar API & MIT license'}
            </a>
          </li>
          <li>
            <a href="https://www.guyujian.cn/learn/qimen/07" target="_blank" rel="noreferrer">
              {zh
                ? '古语鉴学堂：星、门、神排盘核验例（Q1）'
                : 'Guyujian: worked star/door/deity chart (Q1)'}
            </a>
          </li>
          <li>
            <a
              href="https://www.hko.gov.hk/tc/gts/astronomy/Solar_Term.htm"
              target="_blank"
              rel="noreferrer"
            >
              {zh
                ? '香港天文台：节气与 UTC+8 时间说明'
                : 'Hong Kong Observatory: solar terms & UTC+8'}
            </a>
          </li>
        </ul>
        <p className="small muted">{t.limitation}</p>
      </details>
    </div>
  );
}
