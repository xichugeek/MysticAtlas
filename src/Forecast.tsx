import { useMemo } from 'react';
import { ArrowUpRight, Compass, GitBranch } from 'lucide-react';
import { generateForecast } from '../engines/forecast';
import type { AIForecast } from '../engines/forecast/schema';
import type { CastResult } from '../engines/iching';
import type { Lang } from './i18n';

const words = {
  zh: {
    title: '推演预测',
    kicker: '从卦象，到可观察的变化',
    local: '本地卦象推演',
    ai: 'AI 主题推演',
    intro: '查看现状主线、变化方向与可能情景，再用现实信号检验判断。未配置 AI 也能使用。',
    present: '现状主线 · 本卦',
    direction: '变化方向 · 变卦',
    inner: '内在视角 · 互卦',
    change: '动爻提示',
    scenarios: '三种可能情景',
    actions: '行动建议',
    observe: '观察信号',
    revise: '何时修正',
    condition: '成立条件',
    none: '当前没有动爻。先观察现有安排的延续与微调。',
    source: '经文依据',
    themes:
      '上方规则卦断会在本地匹配问题类型；这里补充卦象细节。人物、事件和问题前提均未联网查证；AI 可在主动请求后进一步解读。',
    scope: '阶段比喻与趋势提示为自编解读，不是经典原文或必然预言。',
    pending: '此条经文有待核验异文。',
    aiTitle: '结合主题的 AI 推演',
    aiNote: '以下为模型生成的条件推演，与上方本地规则解读分开展示。',
    labels: { opening: '条件改善时', continuity: '条件延续时', friction: '出现阻力时' },
  },
  en: {
    title: 'Predictive scenarios',
    kicker: 'FROM SYMBOLS TO OBSERVABLE CHANGE',
    local: 'Local symbolic forecast',
    ai: 'AI theme forecast',
    intro:
      'Explore the present, a possible direction and conditional scenarios, then check them against real observations. Available without AI.',
    present: 'Present · primary',
    direction: 'Direction · transformed',
    inner: 'Inner lens · nuclear',
    change: 'Moving-line prompts',
    scenarios: 'Three possible scenarios',
    actions: 'Suggested actions',
    observe: 'What to observe',
    revise: 'When to revise',
    condition: 'Assumptions',
    none: 'No moving lines. Observe continuity and small adjustments in existing arrangements.',
    source: 'Classical references',
    themes:
      'The verdict above matches question form locally; these are supporting chart details. People, events and premises are not fact-checked. An explicit AI request can refine the reading.',
    scope:
      'Stage metaphors and trends are original prompts, not classical quotations or inevitable predictions.',
    pending: 'This line has a textual variant pending review.',
    aiTitle: 'AI scenarios for your theme',
    aiNote:
      'Model-generated conditional scenarios are shown separately from the local rule reading above.',
    labels: {
      opening: 'If conditions improve',
      continuity: 'If conditions stay similar',
      friction: 'If friction increases',
    },
  },
};
export function Forecast({ result, lang }: { result: CastResult; lang: Lang }) {
  const forecast = useMemo(() => generateForecast(result.values, lang), [result, lang]);
  const t = words[lang];
  return (
    <section className="forecast-panel" aria-labelledby="forecast-title">
      <div className="forecast-heading">
        <span className="forecast-icon">
          <Compass size={24} />
        </span>
        <div>
          <span className="eyebrow">{t.kicker}</span>
          <h2 id="forecast-title">{t.title}</h2>
        </div>
        <span className="pill available">{t.local}</span>
      </div>
      <p className="forecast-intro">{t.intro}</p>
      <p className="forecast-summary">{forecast.summary}</p>
      <div className="forecast-readings">
        {forecast.readings.map((r) => (
          <article key={r.role}>
            <span className="eyebrow">
              {r.role === 'present' ? t.present : r.role === 'direction' ? t.direction : t.inner}
            </span>
            <h3>
              <a href={`#hexagram/${r.hexagramId}`}>
                {r.name}
                <small>#{String(r.hexagramId).padStart(2, '0')}</small>
              </a>
            </h3>
            <strong>{r.motif}</strong>
            <p>{r.reading}</p>
          </article>
        ))}
      </div>
      <details className="forecast-moving">
        <summary>
          <GitBranch size={16} />
          {t.change}
          <span className="mono">{forecast.moving.length} / 6</span>
        </summary>
        <p>{forecast.changeSummary}</p>
        {forecast.moving.length ? (
          <>
            <p className="small muted">{t.scope}</p>
            {forecast.moving.map((m) => (
              <article key={m.line}>
                <h4>
                  {m.label} · {m.value}
                  <span>{m.transition}</span>
                </h4>
                <p>{m.focus}</p>
                <blockquote lang="zh-CN">{m.quote}</blockquote>
                <a className="text-link" href={m.sourceUrl} target="_blank" rel="noreferrer">
                  {t.source}
                  <ArrowUpRight size={13} />
                </a>
                {m.reviewPending && <p className="small muted">{t.pending}</p>}
              </article>
            ))}
          </>
        ) : (
          <p>{t.none}</p>
        )}
      </details>
      <h3 className="forecast-subtitle">{t.scenarios}</h3>
      <div className="forecast-scenarios">
        {forecast.scenarios.map((s, i) => (
          <article key={s.kind} data-scenario={s.kind}>
            <div className="scenario-top">
              <span className="mono">0{i + 1}</span>
              <h4>{s.title}</h4>
            </div>
            <dl>
              <dt>{t.condition}</dt>
              <dd>{s.condition}</dd>
            </dl>
            <p>{s.outlook}</p>
            <dl>
              <dt>{t.observe}</dt>
              <dd>{s.observe}</dd>
              <dt>{t.revise}</dt>
              <dd>{s.reviseIf}</dd>
            </dl>
          </article>
        ))}
      </div>
      <h3 className="forecast-subtitle">{t.actions}</h3>
      <ol className="forecast-actions">
        {forecast.recommendations.map((a, i) => (
          <li key={i}>
            <span className="mono">0{i + 1}</span>
            <div>
              <h4>{a.title}</h4>
              <p>{a.action}</p>
              <dl>
                <dt>{t.observe}</dt>
                <dd>{a.observe}</dd>
                <dt>{t.revise}</dt>
                <dd>{a.reconsiderIf}</dd>
              </dl>
            </div>
          </li>
        ))}
      </ol>
      <details className="forecast-sources">
        <summary>{t.source}</summary>
        {forecast.citations.map((c) => (
          <blockquote key={c.hexagramId}>
            <p lang="zh-CN">{c.quote}</p>
            <a className="text-link" href={c.sourceUrl} target="_blank" rel="noreferrer">
              #{c.hexagramId} · {c.sourceVersion.slice(0, 7)}
              <ArrowUpRight size={12} />
            </a>
          </blockquote>
        ))}
        <p>{forecast.authorship}</p>
      </details>
      <p className="forecast-theme-note">{t.themes}</p>
      <p className="forecast-limitations">{forecast.limitations}</p>
      <span className="source-meta">{forecast.version}</span>
    </section>
  );
}
export function AIForecastReading({ forecast, lang }: { forecast: AIForecast; lang: Lang }) {
  const t = words[lang];
  return (
    <section className="ai-forecast-reading" aria-labelledby="ai-forecast-title">
      <span className="pill available">{t.ai}</span>
      <h3 id="ai-forecast-title">{t.aiTitle}</h3>
      <p className="muted small">{t.aiNote}</p>
      <p>{forecast.trend}</p>
      <div className="forecast-scenarios">
        {forecast.scenarios.map((s) => (
          <article key={s.kind}>
            <h4>{t.labels[s.kind]}</h4>
            <dl>
              <dt>{t.condition}</dt>
              <dd>{s.condition}</dd>
            </dl>
            <p>{s.outlook}</p>
            <dl>
              <dt>{t.observe}</dt>
              <dd>{s.observe}</dd>
              <dt>{t.revise}</dt>
              <dd>{s.reviseIf}</dd>
            </dl>
          </article>
        ))}
      </div>
      <h4>{t.actions}</h4>
      <ol className="forecast-actions">
        {forecast.recommendations.map((a, i) => (
          <li key={i}>
            <span className="mono">0{i + 1}</span>
            <div>
              <p>{a.action}</p>
              <dl>
                <dt>{t.observe}</dt>
                <dd>{a.observe}</dd>
                <dt>{t.revise}</dt>
                <dd>{a.reconsiderIf}</dd>
              </dl>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
