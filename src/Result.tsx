import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookmarkPlus, Check, Copy, RotateCcw, Sparkles } from 'lucide-react';
import { getHexagram, type CastResult } from '../engines/iching';
import type { Interpretation } from '../server/ai';
import { ClassicalText, DiagramCard } from './components';
import { copy, type Lang } from './i18n';
import { AIForecastReading, Forecast } from './Forecast';
import { generateDirectAnswer } from '../engines/forecast/answer';
import { DirectAnswerCard } from './DirectAnswer';

export function Result({
  result,
  lang,
  theme,
  onSave,
  reset,
  onEdit,
}: {
  result: CastResult;
  lang: Lang;
  theme: string;
  onSave: (withTheme: boolean) => boolean;
  reset: () => void;
  onEdit: () => void;
}) {
  const t = copy[lang];
  const localAnswer = useMemo(
    () => generateDirectAnswer(result.values, theme, lang),
    [result, theme, lang],
  );
  const [saved, setSaved] = useState(false);
  const [withTheme, setWithTheme] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const [aiStatus, setAiStatus] = useState('');
  const [ai, setAi] = useState<Interpretation | null>(null);
  const [busy, setBusy] = useState(false);
  const [aiMode, setAiMode] = useState('unknown');
  const readingRequest = useRef<AbortController | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/health', { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setAiMode(d.ai))
      .catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    setSaved(false);
    setCopied(false);
    setAi(null);
    setAiStatus('');
    setMessage('');
    setBusy(false);
    return () => {
      readingRequest.current?.abort();
      readingRequest.current = null;
    };
  }, [result, lang]);
  async function share() {
    try {
      await navigator.clipboard.writeText(
        `MysticAtlas | ${result.primary.id} ${result.primary.fullName} → ${result.changed.id} ${result.changed.fullName}\n${t.nuclear}: ${result.nuclear.id} ${result.nuclear.fullName}\n${t.moving}: ${result.movingLines.join(', ') || '—'}\n[${result.values.join(',')}] (bottom-to-top)\n${result.algorithmVersion}\n${t.disclaimer}`,
      );
      setCopied(true);
    } catch {
      setMessage(t.copyError);
    }
  }
  async function interpret() {
    const controller = new AbortController();
    readingRequest.current = controller;
    setBusy(true);
    setAiStatus('');
    setAi(null);
    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: result.values, theme, lang }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(65000)]),
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') setAi(data.interpretation);
      else
        setAiStatus(
          data.code === 'AI_DISABLED'
            ? 'disabled'
            : data.code === 'UNSAFE_THEME'
              ? 'unsafe'
              : response.status === 429
                ? 'limited'
                : 'failure',
        );
    } catch {
      if (!controller.signal.aborted) setAiStatus('failure');
    } finally {
      if (readingRequest.current === controller) {
        setBusy(false);
        readingRequest.current = null;
      }
    }
  }
  return (
    <div className="page result-page">
      <div className="page-heading">
        <span className="eyebrow">A MOMENT FOR REFLECTION / 02</span>
        <h1>{t.resultTitle}</h1>
        <p>{t.resultSub}</p>
      </div>
      <DirectAnswerCard
        local={localAnswer}
        ai={ai?.forecast.conclusion || null}
        lang={lang}
        busy={busy}
        aiMode={aiMode}
        onRequest={interpret}
        statusText={
          aiStatus
            ? aiStatus === 'disabled'
              ? t.aiDisabled
              : aiStatus === 'unsafe'
                ? t.aiUnsafe
                : aiStatus === 'limited'
                  ? t.aiLimited
                  : t.aiFailure
            : ''
        }
      />
      <div className="result-toolbar">
        <div className="raw-values">
          <span>{t.raw}</span>
          <code>{result.values.join(' · ')}</code>
        </div>
        <div className="toolbar-actions">
          <button className="button secondary small-button" onClick={onEdit}>
            {lang === 'zh' ? '修改最后一爻' : 'Edit last line'}
          </button>
          <button
            className="button secondary small-button"
            onClick={() => {
              if (onSave(withTheme)) setSaved(true);
            }}
            disabled={saved}
          >
            {saved ? <Check size={16} /> : <BookmarkPlus size={16} />}
            {saved ? t.saved : t.save}
          </button>
          <button className="icon-button" aria-label={t.share} title={t.share} onClick={share}>
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>
      {theme && (
        <label className="checkbox save-theme">
          <input
            type="checkbox"
            checked={withTheme}
            onChange={(e) => setWithTheme(e.target.checked)}
            disabled={saved}
          />
          {t.includeTheme}
        </label>
      )}
      {(message || copied) && (
        <p className="notice" role="status">
          {copied ? t.copied : message}
        </p>
      )}
      <div className="result-diagrams">
        <DiagramCard
          h={result.primary}
          label={t.primary}
          lang={lang}
          bits={result.primaryBits}
          moving={result.movingLines}
          values={result.values}
        />
        <span className="diagram-arrow">
          <ArrowRight size={23} />
        </span>
        <DiagramCard h={result.changed} label={t.changed} lang={lang} bits={result.changedBits} />
        <DiagramCard h={result.nuclear} label={t.nuclear} lang={lang} bits={result.nuclearBits} />
      </div>
      <div className="result-explainer">
        <p>
          <span className="gold">◇</span>{' '}
          {result.movingLines.length
            ? `${t.moving}：${result.movingLines.map((n) => t.positionNames[n - 1]).join('、')}`
            : t.noMoving}
        </p>
        <p>{t.nuclearHelp}</p>
      </div>
      <Forecast result={result} lang={lang} />
      <ClassicalText h={result.primary} lang={lang} moving={result.movingLines} />
      <section className="reading-note">
        <span className="eyebrow">{t.readingNote}</span>
        <p>{t.readingText}</p>
      </section>
      <section className="ai-panel">
        <div className="ai-panel-heading">
          <span className="ai-icon">
            <Sparkles size={22} />
          </span>
          <div>
            <h2>{t.aiTitle}</h2>
          </div>
        </div>
        <p className="muted">{t.aiSub}</p>
        {ai && (
          <div className="ai-reading">
            <h3>{t.summary}</h3>
            <p>{ai.summary}</p>
            {ai.citations.map((c, i) => (
              <blockquote key={i}>
                <p lang="zh-CN">{c.quote}</p>
                <cite>
                  <a
                    className="text-link"
                    href={getHexagram(c.hexagramId).source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.classic} · #{c.hexagramId} ·{' '}
                    {c.kind === 'judgment' ? t.judgment : `${t.line} ${c.line}`}
                  </a>
                </cite>
              </blockquote>
            ))}
            <h3>{t.context}</h3>
            <p>{ai.context}</p>
            <AIForecastReading forecast={ai.forecast} lang={lang} />
            <h3>{t.reflection}</h3>
            <ul>
              {ai.questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
            <h3>{t.limitations}</h3>
            <p>{ai.limitations}</p>
          </div>
        )}
      </section>
      <div className="result-footer">
        <a href="#cast" className="button primary" onClick={reset}>
          <RotateCcw size={17} />
          {t.restart}
        </a>
        <a href="#principles" className="text-link">
          {t.principles}
          <ArrowRight size={16} />
        </a>
        <span className="mono muted">{result.algorithmVersion}</span>
      </div>
      <p className="page-disclaimer">{t.disclaimer}</p>
    </div>
  );
}
