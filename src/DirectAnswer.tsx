import { ArrowUpRight, Sparkles } from 'lucide-react';
import type { DirectAnswer as SymbolicAnswer } from '../engines/forecast/answer';
import type { AIForecast } from '../engines/forecast/schema';
import type { Lang } from './i18n';

export function DirectAnswerCard({
  local,
  ai,
  lang,
  busy,
  aiMode,
  statusText,
  onRequest,
}: {
  local: SymbolicAnswer;
  ai: AIForecast['conclusion'] | null;
  lang: Lang;
  busy: boolean;
  aiMode: string;
  statusText: string;
  onRequest: () => void;
}) {
  const zh = lang === 'zh',
    answer = ai || local;
  return (
    <section
      className={`direct-answer stance-${local.stance}`}
      aria-labelledby="direct-answer-title"
    >
      <div className="direct-answer-heading">
        <div>
          <span className="eyebrow">
            {zh ? '六爻已成 · 先看结论' : 'SIX LINES COMPLETE · THE VERDICT'}
          </span>
          <h2 id="direct-answer-title">{zh ? '预测结果' : 'Prediction result'}</h2>
        </div>
        <span className="pill available">
          {ai
            ? zh
              ? 'AI 问题解读'
              : 'AI question reading'
            : zh
              ? '规则卦断'
              : 'Rule-based divination'}
        </span>
      </div>
      <div className="prediction-question">
        <span>{zh ? '你的问题' : 'Your question'}</span>
        <p>
          {local.question ||
            (zh
              ? '未填写具体问题，显示整体卦象倾向。'
              : 'No specific question was entered; this is an overall symbolic reading.')}
        </p>
      </div>
      <div className="prediction-verdict">
        <span>{zh ? '卦象倾向' : 'Symbolic verdict'}</span>
        <strong data-testid="prediction-verdict">{answer.verdict}</strong>
        <p>{answer.answer}</p>
      </div>
      <p className="prediction-trajectory">{local.trajectory}</p>
      <div className="prediction-reasons">
        <h3>{zh ? '判断依据' : 'Why this verdict'}</h3>
        <ul>
          {(ai ? ai.reasons : local.reasons.map((r) => r.text)).map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
      <div className="prediction-next">
        <div>
          <span>{zh ? '什么会改变判断' : 'What would change the reading'}</span>
          <p>{answer.turningPoint}</p>
        </div>
        <div>
          <span>{zh ? '下一步建议' : 'Suggested next step'}</span>
          <p>{answer.nextStep}</p>
        </div>
      </div>
      <p className="prediction-scope">{local.scope}</p>
      <div className="prediction-ai">
        <div>
          <span className="mono">
            AI · {aiMode === 'enabled' ? 'ON' : aiMode === 'disabled' ? 'OFF' : '—'}
          </span>
          <p>
            {aiMode === 'disabled'
              ? zh
                ? '当前是本地规则结论。配置模型后，可进一步结合问题细节解读。'
                : 'This is the local rule verdict. A configured model can develop the details of your question.'
              : zh
                ? '仅在点击后提交本次卦象和问题。AI 不参与投币或更改卦象。'
                : 'Only a click submits this chart and question. AI does not cast or change the chart.'}
          </p>
        </div>
        {!ai && (
          <button className="button secondary" onClick={onRequest} disabled={busy}>
            <Sparkles size={16} />
            {busy
              ? zh
                ? '正在解读这个问题…'
                : 'Reading your question…'
              : zh
                ? '请求 AI 推演预测'
                : 'Request an AI forecast'}
            <ArrowUpRight size={15} />
          </button>
        )}
      </div>
      {statusText && (
        <p className="notice" role="status">
          {statusText}
        </p>
      )}
    </section>
  );
}
