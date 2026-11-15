import { useEffect, useRef, useState } from 'react';
import { ArrowRight, RotateCcw, Undo2, Sparkles } from 'lucide-react';
import { tossCoins, sumCoins, type LineValue } from '../engines/iching';
import { HexLines } from './components';
import { copy, type Lang } from './i18n';

export function Cast({
  lang,
  values,
  setValues,
  theme,
  setTheme,
  reset,
}: {
  lang: Lang;
  values: LineValue[];
  setValues: (v: LineValue[]) => void;
  theme: string;
  setTheme: (s: string) => void;
  reset: () => void;
}) {
  const t = copy[lang];
  const [mode, setMode] = useState<'coins' | 'manual'>('coins');
  const [manualType, setManualType] = useState<'values' | 'coins'>('values');
  const [coins, setCoins] = useState([3, 2, 3]);
  const [manualValue, setManualValue] = useState<LineValue>(7);
  const [skip, setSkip] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef<ReturnType<typeof tossCoins> | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function finish() {
    const cast = pending.current;
    if (!cast) return;
    pending.current = null;
    if (timer.current) clearTimeout(timer.current);
    setCoins(cast.coins);
    setValues([...values, cast.value]);
    setBusy(false);
  }
  function toss() {
    if (busy || values.length >= 6) return;
    setError('');
    try {
      pending.current = tossCoins();
      if (skip || matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
      else {
        setBusy(true);
        timer.current = setTimeout(finish, 850);
      }
    } catch {
      setError(
        lang === 'zh'
          ? '安全随机源不可用，请使用手动录入。'
          : 'Secure randomness is unavailable. Please use manual entry.',
      );
    }
  }
  function restart() {
    if (timer.current) clearTimeout(timer.current);
    pending.current = null;
    setBusy(false);
    reset();
  }
  const bits = values.map((v) => v % 2);
  const moving = values.flatMap((v, i) => (v === 6 || v === 9 ? [i + 1] : []));
  return (
    <div className="page cast-page">
      <div className="page-heading">
        <span className="eyebrow">THE ART OF CHANGE / 01</span>
        <h1>{t.castTitle}</h1>
        <p>{t.castSub}</p>
      </div>
      <div className="cast-layout">
        <section className="cast-workspace">
          <label className="theme-label" htmlFor="theme">
            {t.theme}
            <span>{t.optional}</span>
          </label>
          <textarea
            id="theme"
            maxLength={300}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder={t.placeholder}
            rows={2}
          />
          <div className="theme-count">{theme.length} / 300</div>
          <div
            className="mode-tabs"
            role="tablist"
            aria-label={lang === 'zh' ? '起卦方式' : 'Casting method'}
          >
            <button
              role="tab"
              aria-selected={mode === 'coins'}
              disabled={busy}
              onClick={() => setMode('coins')}
            >
              {t.coinMode}
            </button>
            <button
              role="tab"
              aria-selected={mode === 'manual'}
              disabled={busy}
              onClick={() => setMode('manual')}
            >
              {t.manualMode}
            </button>
          </div>
          <div className="casting-stage">
            <div className="stage-kicker">
              <span className="tiny-square" />
              {values.length === 6
                ? t.complete
                : `${t.positionNames[values.length]} · ${values.length + 1} / 6`}
            </div>
            {(mode === 'coins' || manualType === 'coins') && (
              <div className={`coins ${busy ? 'tossing' : ''}`}>
                {coins.map((face, i) =>
                  mode === 'manual' ? (
                    <button
                      className={`coin face-${face}`}
                      key={i}
                      onClick={() =>
                        setCoins(coins.map((c, j) => (i === j ? (c === 2 ? 3 : 2) : c)))
                      }
                      disabled={values.length === 6}
                      aria-label={`${lang === 'zh' ? '铜钱' : 'Coin'} ${i + 1}: ${face}; ${lang === 'zh' ? '点击翻面' : 'click to flip'}`}
                    >
                      <span className="coin-letter">{face === 3 ? '乾' : '坤'}</span>
                      <span className="coin-hole" />
                      <span className="coin-number">{face}</span>
                    </button>
                  ) : (
                    <div
                      className={`coin face-${face}`}
                      key={i}
                      aria-label={`${lang === 'zh' ? '铜钱' : 'Coin'} ${i + 1}: ${face}`}
                    >
                      <span className="coin-letter">{face === 3 ? '乾' : '坤'}</span>
                      <span className="coin-hole" />
                      <span className="coin-number">{face}</span>
                    </div>
                  ),
                )}
              </div>
            )}
            {mode === 'manual' && (
              <>
                <div className="manual-types">
                  <button
                    className={manualType === 'values' ? 'selected' : ''}
                    onClick={() => setManualType('values')}
                  >
                    {t.manualValues}
                  </button>
                  <button
                    className={manualType === 'coins' ? 'selected' : ''}
                    onClick={() => setManualType('coins')}
                  >
                    {t.manualCoins}
                  </button>
                </div>
                {manualType === 'values' ? (
                  <fieldset className="value-picker">
                    <legend className="sr-only">{t.manualHelp}</legend>
                    {([6, 7, 8, 9] as const).map((v, i) => (
                      <label className={manualValue === v ? 'selected' : ''} key={v}>
                        <input
                          type="radio"
                          name="line-value"
                          value={v}
                          checked={manualValue === v}
                          onChange={() => setManualValue(v)}
                        />
                        <b>{v}</b>
                        <span>{t.valueNames[i]}</span>
                        <small>{t.valueNotes[i]}</small>
                      </label>
                    ))}
                  </fieldset>
                ) : (
                  <p className="coin-sum mono">
                    {coins.join(' + ')} = {sumCoins(coins)}
                  </p>
                )}
              </>
            )}
            <p className="stage-note">
              {mode === 'coins'
                ? t.convention
                : manualType === 'values'
                  ? t.manualHelp
                  : t.convention}
            </p>
            {values.length < 6 ? (
              <button
                className="button primary cast-button"
                onClick={
                  mode === 'coins'
                    ? toss
                    : () =>
                        setValues([
                          ...values,
                          manualType === 'values' ? manualValue : sumCoins(coins),
                        ])
                }
                disabled={busy}
              >
                {busy ? (
                  <>
                    <Sparkles size={18} />
                    {t.tossing}
                  </>
                ) : (
                  <>
                    {mode === 'coins' ? t.toss : t.add}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            ) : (
              <a href="#result" className="button primary cast-button">
                {t.viewResult}
                <ArrowRight size={18} />
              </a>
            )}
            {mode === 'coins' && (
              <label className="checkbox skip-animation">
                <input
                  type="checkbox"
                  checked={skip}
                  onChange={(e) => {
                    setSkip(e.target.checked);
                    if (e.target.checked && busy) finish();
                  }}
                />
                {t.skip}
              </label>
            )}
          </div>
          <div className="cast-bottom">
            <button className="text-link" onClick={restart}>
              <RotateCcw size={15} />
              {t.restart}
            </button>
            <button
              className="text-link"
              disabled={!values.length || busy}
              onClick={() => setValues(values.slice(0, -1))}
            >
              <Undo2 size={15} />
              {t.undo}
            </button>
          </div>
          {error && (
            <p role="alert" className="notice error">
              {error}
            </p>
          )}
        </section>
        <aside className="cast-progress">
          <div className="section-title">
            <span className="eyebrow">{t.round}</span>
            <span className="mono">
              <b>{String(values.length).padStart(2, '0')}</b> / 06
            </span>
          </div>
          <div className="progress-track">
            {Array.from({ length: 6 }, (_, i) => (
              <i key={i} className={i < values.length ? 'done' : ''} />
            ))}
          </div>
          <p className="muted small">{t.bottomUp}</p>
          <HexLines
            bits={bits}
            moving={moving}
            values={Array.from({ length: 6 }, (_, i) => values[i])}
          />
          <div className="progress-live" role="status" aria-live="polite">
            {values.length
              ? `${t.positionNames[values.length - 1]} · ${values.at(-1)} · ${t.valueNames[values.at(-1)! - 6]}`
              : t.noLines}
          </div>
          <div className="progress-legend">
            <span>
              <i className="legend-yang" />
              {lang === 'zh' ? '阳爻' : 'Yang'}
            </span>
            <span>
              <i className="legend-yin" />
              {lang === 'zh' ? '阴爻' : 'Yin'}
            </span>
            <span className="gold">◇ {t.moving}</span>
          </div>
        </aside>
      </div>
      <p className="page-disclaimer">{t.disclaimer}</p>
    </div>
  );
}
