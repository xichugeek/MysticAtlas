import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Download,
  Code2 as Github,
  Globe2,
  History,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  ALGORITHM_VERSION,
  calculate,
  DATA_VERSION,
  getHexagram,
  type LineValue,
} from '../engines/iching';
import { HexCard, Mark, SampleArt } from './components';
import { Cast } from './Cast';
import { Library, HexagramDetail } from './Library';
import { Result } from './Result';
import { copy, type Lang } from './i18n';
import { exportHistory, HISTORY_KEY, loadHistory, saveHistory, type HistoryEntry } from './history';
import { FORECAST_VERSION } from '../engines/forecast';

const repo = 'https://github.com/xichugeek/MysticAtlas';
function initialLang(): Lang {
  try {
    return localStorage.getItem('mysticatlas.lang') === 'en' ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
}
export function App() {
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = copy[lang];
  const [route, setRoute] = useState(location.hash.slice(1) || 'home');
  const [values, setValues] = useState<LineValue[]>([]);
  const [theme, setTheme] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [storageError, setStorageError] = useState('');
  const main = useRef<HTMLElement>(null);
  const result = useMemo(() => (values.length === 6 ? calculate(values) : null), [values]);
  useEffect(() => {
    if (route === 'cast' && result) location.hash = 'result';
  }, [route, result]);
  useEffect(() => {
    const navigate = () => {
      setRoute(location.hash.slice(1) || 'home');
    };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useLayoutEffect(() => {
    main.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route]);
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = `MysticAtlas · ${lang === 'zh' ? '易境' : 'An atlas of change'}`;
    try {
      localStorage.setItem('mysticatlas.lang', lang);
    } catch {
      /* Language remains usable in memory. */
    }
  }, [lang]);
  function reset() {
    setValues([]);
    setTheme('');
    setStorageError('');
  }
  function save(withTheme: boolean) {
    try {
      const next = [
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          values: [...values],
          ...(withTheme && theme ? { theme } : {}),
        },
        ...history,
      ].slice(0, 100);
      saveHistory(next);
      setHistory(next);
      return true;
    } catch {
      setStorageError(t.storageError);
      return false;
    }
  }
  function open(entry: HistoryEntry) {
    setValues([...entry.values]);
    setTheme(entry.theme || '');
    location.hash = 'result';
  }
  const active = route.startsWith('hexagram') ? 'library' : route === 'result' ? 'cast' : route;
  const detailId = route.startsWith('hexagram/') ? Number(route.split('/')[1]) : 0;
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        {t.skipLink}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a href="#home" className="brand" aria-label="MysticAtlas home">
            <Mark />
            <span>
              MysticAtlas
              <small>
                {t.brand} · {lang === 'zh' ? 'AI 国学图谱' : 'AN ATLAS OF CHANGE'}
              </small>
            </span>
          </a>
          <nav aria-label={lang === 'zh' ? '主导航' : 'Main navigation'}>
            {(['home', 'cast', 'library', 'principles', 'about'] as const).map((page) => (
              <a
                href={`#${page}`}
                key={page}
                className={active === page ? 'active' : ''}
                aria-current={active === page ? 'page' : undefined}
              >
                {t[page]}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a
              href="#history"
              aria-label={t.history}
              className={`icon-button ${active === 'history' ? 'active' : ''}`}
              title={t.history}
            >
              <History size={19} />
              {history.length > 0 && <i className="history-dot" />}
            </a>
            <span className="header-divider" />
            <button
              className="language-button"
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              aria-label={lang === 'zh' ? 'Switch to English' : '切换为中文'}
            >
              <Globe2 size={16} />
              <span>{lang === 'zh' ? 'EN' : '中文'}</span>
            </button>
          </div>
        </div>
      </header>
      <main id="main-content" ref={main} tabIndex={-1}>
        {route === 'home' ? (
          <>
            <section className="hero page">
              <div className="hero-copy">
                <span className="eyebrow">
                  <span className="tiny-square" />
                  {t.eyebrow}
                </span>
                <h1>
                  {t.hero1}
                  <br />
                  <em>{t.hero2}</em>
                </h1>
                <p>{t.intro}</p>
                <div className="hero-actions">
                  <a href="#cast" className="button primary">
                    {t.start}
                    <ArrowRight size={18} />
                  </a>
                  <a href="#library" className="text-link">
                    {t.explore}
                    <ArrowUpRight size={17} />
                  </a>
                </div>
                <div className="hero-meta">
                  <span>01 — 64</span>
                  <i />
                  {t.culture}
                </div>
              </div>
              <SampleArt lang={lang} />
              <div className="hero-bottom">
                <span>{t.tagline}</span>
                <a
                  href="#ritual"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('ritual')?.scrollIntoView({
                      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
                        ? 'instant'
                        : 'smooth',
                    });
                  }}
                >
                  {t.scroll}
                  <ArrowDown size={14} />
                </a>
              </div>
            </section>
            <div className="trust-strip">
              <span>
                <ShieldCheck size={15} />
                {t.local}
              </span>
              <span>
                <Check size={15} />
                {t.private}
              </span>
              <span>
                <Check size={15} />
                {t.noAccount}
              </span>
            </div>
            <section id="ritual" className="section page">
              <div className="section-heading">
                <span className="eyebrow">A QUIETER WAY TO EXPLORE</span>
                <h2>{t.ritual}</h2>
                <p>{t.ritualSub}</p>
              </div>
              <div className="ritual-grid">
                {t.steps.map((s, i) => (
                  <article key={s}>
                    <span className="step-number">
                      0{i + 1}
                      <i />
                    </span>
                    <h3>{s}</h3>
                    <p>{t.stepTexts[i]}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="section page collection">
              <div className="section-title">
                <div>
                  <span className="eyebrow">THE BOOK OF CHANGE</span>
                  <h2>{t.collection}</h2>
                  <p className="muted">{t.collectionSub}</p>
                </div>
                <a href="#library" className="text-link">
                  {t.all}
                  <ArrowRight size={17} />
                </a>
              </div>
              <div className="featured-grid">
                {[1, 2, 11, 24].map((id) => (
                  <HexCard h={getHexagram(id)} key={id} lang={lang} />
                ))}
              </div>
            </section>
            <Roadmap lang={lang} />
          </>
        ) : route === 'cast' ? (
          <Cast
            lang={lang}
            values={values}
            setValues={setValues}
            theme={theme}
            setTheme={setTheme}
            reset={reset}
          />
        ) : route === 'result' && result ? (
          <Result
            key={result.values.join(',')}
            result={result}
            lang={lang}
            theme={theme}
            onSave={save}
            reset={reset}
            onEdit={() => {
              setValues(values.slice(0, -1));
              location.hash = 'cast';
            }}
          />
        ) : route === 'library' ? (
          <Library lang={lang} />
        ) : detailId >= 1 && detailId <= 64 && Number.isInteger(detailId) ? (
          <HexagramDetail id={detailId} lang={lang} />
        ) : route === 'principles' ? (
          <Principles lang={lang} />
        ) : route === 'about' ? (
          <About lang={lang} />
        ) : route === 'history' ? (
          <Journal
            lang={lang}
            entries={history}
            open={open}
            clear={() => {
              try {
                localStorage.removeItem(HISTORY_KEY);
                setHistory([]);
              } catch {
                setStorageError(t.storageError);
              }
            }}
          />
        ) : (
          <div className="page empty-state">
            <BookOpen size={32} />
            <p>
              {lang === 'zh'
                ? '当前没有待查看的卦象，请先起卦。未保存的卦象不会在刷新后保留。'
                : 'Begin a reading to view a chart. Unsaved readings do not survive a page reload.'}
            </p>
            <a href="#cast" className="button primary">
              {t.start}
              <ArrowRight size={17} />
            </a>
          </div>
        )}
        {storageError && (
          <div className="page notice error" role="alert">
            {storageError}
          </div>
        )}
      </main>
      <footer className="site-footer page">
        <div className="footer-top">
          <a href="#home" className="brand">
            <Mark />
            <span>
              MysticAtlas<small>BY XICHUGEEK · 西楚极客</small>
            </span>
          </a>
          <div>
            <a href="#principles">{t.principles}</a>
            <a href="#about">{t.privacy}</a>
            <a href={repo} target="_blank" rel="noreferrer">
              <Github size={15} />
              {t.repo}
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
        <p>{t.disclaimer}</p>
        <div className="footer-bottom">
          <span>© 2026 XichuGeek · MIT</span>
          <span>根植经典 · BUILT WITH CURIOSITY</span>
        </div>
      </footer>
    </>
  );
}
function Roadmap({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <section className="roadmap-section">
      <div className="page section">
        <div className="section-heading">
          <span className="eyebrow">A LIVING ATLAS</span>
          <h2>{t.roadmap}</h2>
          <p>{t.roadmapSub}</p>
        </div>
        <div className="roadmap-grid">
          {[t.iching, t.qimen, t.face].map((name, i) => (
            <article key={name}>
              <div>
                <span className="mono">0{i + 1}</span>
                <span className={`pill ${i ? '' : 'available'}`}>{i ? t.planned : t.current}</span>
              </div>
              <h3>{name}</h3>
              <p>{i === 0 ? t.ritualSub : i === 1 ? t.qimenNote : t.faceNote}</p>
              {i === 0 && (
                <a className="text-link" href="#cast">
                  {t.start}
                  <ArrowRight size={15} />
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function Principles({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <div className="page prose-page">
      <div className="page-heading">
        <span className="eyebrow">THE LOGIC BEHIND THE LINES</span>
        <h1>{t.principlesTitle}</h1>
        <p>{t.principlesSub}</p>
      </div>
      <div className="principle-list">
        {t.ruleTitles.map((title, i) => (
          <section key={title}>
            <span className="step-number">0{i + 1}</span>
            <div>
              <h2>{title}</h2>
              <p>{t.ruleTexts[i]}</p>
              {i === 0 && (
                <table>
                  <thead>
                    <tr>
                      <th>{t.raw.split('（')[0].split('(')[0]}</th>
                      <th>{t.yinYang}</th>
                      <th>{t.toChanged}</th>
                      <th>{t.probability}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[6, 7, 8, 9].map((v, j) => (
                      <tr key={v}>
                        <td>{v}</td>
                        <td>{t.valueNames[j]}</td>
                        <td>{t.valueNotes[j]}</td>
                        <td>{j === 0 || j === 3 ? '1/8' : '3/8'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        ))}
      </div>
      <section className="sources-panel" aria-labelledby="forecast-method-title">
        <h2 id="forecast-method-title">
          {lang === 'zh' ? '推演预测怎样形成？' : 'How are predictive scenarios formed?'}
        </h2>
        <p>
          {lang === 'zh'
            ? '本卦提供现状主线，变卦提供待验证的变化方向，互卦提供辅助视角；动爻位置用于自编的阶段提示。没有动爻时，明确按延续与微调观察。'
            : 'The primary pattern supplies a present lens, the transformed pattern a direction to test, and the nuclear pattern a supporting lens. Moving positions use original stage prompts. With no moving lines, observe continuity and small adjustments.'}
        </p>
        <p>
          {lang === 'zh'
            ? '64 卦各有自编的中英文主题、阅读提示、行动与复核问题。规则组合为“条件改善、条件延续、出现阻力”三种情景，每种列出成立条件、观察信号与修正条件。这些是象征性推演，不是历史回测、概率模型或固定应期法。'
            : 'Each of the 64 patterns has original bilingual themes, prompts, actions and review questions. Rules compose improving, continuing and friction scenarios with assumptions, observations and revision conditions. This is symbolic inference, not a backtested probability model or fixed event-date method.'}
        </p>
        <p>
          {lang === 'zh'
            ? '本地推演不分析或上传主题；主动请求 AI 后，可结合主题展开结构化情景。经典引用与自编提示分开标注，AI 异常不会影响本地推演。'
            : 'Local scenarios do not analyze or upload your theme. An explicit AI request can develop the theme into structured scenarios. Classical quotations and original prompts remain distinct, and local scenarios survive AI failures.'}
        </p>
      </section>
      <section className="sources-panel">
        <h2>{t.versions}</h2>
        <code>
          {ALGORITHM_VERSION} · {DATA_VERSION} · {FORECAST_VERSION}
        </code>
        <p>{t.sourcesText}</p>
        <a className="text-link" href="/api/hexagrams" target="_blank" rel="noreferrer">
          {lang === 'zh' ? '查看版本化数据与来源' : 'View versioned data and sources'}
          <ArrowUpRight size={15} />
        </a>
      </section>
      <p className="page-disclaimer">{t.disclaimer}</p>
    </div>
  );
}
function About({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <>
      <div className="page prose-page about-page">
        <div className="page-heading">
          <span className="eyebrow">ABOUT MYSTICATLAS</span>
          <h1>{t.aboutTitle}</h1>
          <p>{t.aboutText}</p>
        </div>
        <section className="privacy-panel">
          <ShieldCheck size={28} />
          <h2>{t.privacyTitle}</h2>
          <p>{t.privacyText}</p>
        </section>
        <p className="page-disclaimer">{t.disclaimer}</p>
        <a href={repo} className="button secondary" target="_blank" rel="noreferrer">
          <Github size={18} />
          {t.repo}
          <ArrowUpRight size={16} />
        </a>
      </div>
      <Roadmap lang={lang} />
    </>
  );
}
function Journal({
  lang,
  entries,
  open,
  clear,
}: {
  lang: Lang;
  entries: HistoryEntry[];
  open: (e: HistoryEntry) => void;
  clear: () => void;
}) {
  const t = copy[lang];
  const [confirm, setConfirm] = useState(false);
  function download() {
    const blob = new Blob([exportHistory(entries)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mysticatlas-journal-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="page journal-page">
      <div className="page-heading">
        <span className="eyebrow">YOUR LOCAL JOURNAL</span>
        <h1>{t.historyTitle}</h1>
        <p>{t.historySub}</p>
      </div>
      {entries.length > 0 ? (
        <>
          <div className="journal-toolbar">
            <span className="mono">{entries.length} / 100</span>
            <div>
              <button className="button secondary small-button" onClick={download}>
                <Download size={16} />
                {t.export}
              </button>
              <button className="text-link" onClick={() => setConfirm(true)}>
                <Trash2 size={15} />
                {t.clearHistory}
              </button>
            </div>
          </div>
          {confirm && (
            <div className="notice confirm-clear" role="alert">
              <p>{t.confirmClear}</p>
              <button className="button secondary small-button" onClick={() => setConfirm(false)}>
                {t.cancel}
              </button>
              <button
                className="button primary small-button"
                onClick={() => {
                  clear();
                  setConfirm(false);
                }}
              >
                {t.confirm}
              </button>
            </div>
          )}
          <div className="journal-list">
            {entries.map((entry) => {
              const h = calculate(entry.values).primary;
              return (
                <button
                  key={entry.id}
                  className="journal-entry"
                  onClick={() => open(entry)}
                  aria-label={`${t.open}: ${h.name}`}
                >
                  <span className="journal-symbol" aria-hidden="true">
                    {String.fromCodePoint(0x4dc0 + h.id - 1)}
                  </span>
                  <div>
                    <h3>
                      {h.name} <span>{h.english}</span>
                    </h3>
                    <p>
                      {new Date(entry.createdAt).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}{' '}
                      · {entry.values.join(' · ')}
                    </p>
                    {entry.theme && <p className="journal-theme">{entry.theme}</p>}
                  </div>
                  <ChevronRight size={20} />
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <History size={32} />
          <p>{t.historyEmpty}</p>
          <a href="#cast" className="button primary">
            {t.start}
            <ArrowRight size={16} />
          </a>
        </div>
      )}
    </div>
  );
}
