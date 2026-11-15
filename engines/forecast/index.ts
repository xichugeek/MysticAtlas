import { calculate } from '../iching';
import collation from '../../knowledge/collation.json';
import { getForecastProfile } from './profiles';

export const FORECAST_VERSION = 'symbolic-scenarios/1.0.0';
export type ForecastLang = 'zh' | 'en';
const positions = {
  zh: ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'],
  en: ['Bottom line', 'Second line', 'Third line', 'Fourth line', 'Fifth line', 'Top line'],
};
const stagePrompts = {
  zh: [
    '开端：核对出发点与第一步。',
    '落实：观察日常执行与回应。',
    '衔接：检查推进中的边界与负担。',
    '协同：确认外部支持与沟通。',
    '统筹：明确责任与整体安排。',
    '收束：辨别适合停止、交接或调整的部分。',
  ],
  en: [
    'Beginning: check the starting point and first step.',
    'Execution: observe everyday action and responses.',
    'Transition: check boundaries and the load of moving onward.',
    'Coordination: confirm outside support and communication.',
    'Responsibility: clarify ownership and overall arrangements.',
    'Completion: identify what to stop, hand over or revise.',
  ],
};

/** Deterministic symbolic scenarios. Does not infer real-world probabilities or analyze a theme. */
export function generateForecast(input: unknown, lang: ForecastLang = 'zh') {
  const chart = calculate(input);
  const primary = getForecastProfile(chart.primary.id, lang);
  const changed = getForecastProfile(chart.changed.id, lang);
  const inner = getForecastProfile(chart.nuclear.id, lang);
  const zh = lang === 'zh';
  const hasMoving = chart.movingLines.length > 0;
  const readings = [
    {
      role: 'present' as const,
      hexagramId: chart.primary.id,
      name: chart.primary.name,
      motif: primary[0],
      reading: primary[1],
    },
    {
      role: 'direction' as const,
      hexagramId: chart.changed.id,
      name: chart.changed.name,
      motif: changed[0],
      reading: hasMoving
        ? zh
          ? `变化方向可从「${changed[0]}」观察：${changed[1]}这是一种条件推演，需用现实反馈核对。`
          : `Explore ${changed[0].toLowerCase()} as a possible direction: ${changed[1]} Check this conditional reading against real feedback.`
        : zh
          ? `无动爻，本卦与变卦相同。围绕「${primary[0]}」观察延续与微调，不额外假定一次转折。`
          : `No moving lines: primary and transformed patterns are identical. Observe continuity and small adjustments around ${primary[0].toLowerCase()}; no reversal is assumed.`,
    },
    {
      role: 'inner' as const,
      hexagramId: chart.nuclear.id,
      name: chart.nuclear.name,
      motif: inner[0],
      reading: zh
        ? `互卦提供「${inner[0]}」这一辅助视角：${inner[1]}`
        : `The nuclear pattern adds the lens of ${inner[0].toLowerCase()}: ${inner[1]}`,
    },
  ];
  const moving = chart.movingLines.map((line) => ({
    line,
    label: positions[lang][line - 1],
    value: chart.values[line - 1],
    transition:
      chart.values[line - 1] === 6
        ? zh
          ? '阴 → 阳：从承接转向适度主动'
          : 'Yin → yang: consider a measured initiative'
        : zh
          ? '阳 → 阴：从推进转向适度收敛'
          : 'Yang → yin: consider restraint or receptivity',
    focus: stagePrompts[lang][line - 1],
    quote: chart.primary.lineTexts[line - 1],
    sourceUrl: chart.primary.source.url,
    reviewPending: collation.differences.some((d) => d.id === chart.primary.id && d.line === line),
  }));
  const scenarios = [
    {
      kind: 'opening' as const,
      title: zh ? '条件改善时' : 'If conditions improve',
      condition: zh
        ? '如果小步行动得到可核实的反馈，且必要支持逐渐到位。'
        : 'If a small action receives checkable feedback and the needed support develops.',
      outlook: zh
        ? `可沿「${changed[0]}」这个方向试探推进；用「${inner[0]}」检查配套条件，不据卦象预定结果。`
        : `Explore ${changed[0].toLowerCase()} in a limited way, using ${inner[0].toLowerCase()} to examine supporting conditions. The pattern does not establish the outcome.`,
      observe: changed[3],
      reviseIf: zh
        ? '若反馈不支持这一方向，或实际限制增加，应缩小范围并重做判断。'
        : 'Revise if feedback does not support this direction or practical constraints increase.',
    },
    {
      kind: 'continuity' as const,
      title: zh ? '条件延续时' : 'If conditions remain similar',
      condition: zh
        ? '如果外部条件没有明显变化，现有安排仍可运行。'
        : 'If external conditions stay similar and current arrangements remain workable.',
      outlook: zh
        ? `以本卦「${primary[0]}」为主线，优先验证已有做法，再考虑扩大投入。`
        : `Keep ${primary[0].toLowerCase()} as the working lens; test what already works before expanding the effort.`,
      observe: primary[3],
      reviseIf: zh
        ? '若关键前提已改变，不继续沿用旧判断。'
        : 'Reassess when an important premise changes.',
    },
    {
      kind: 'friction' as const,
      title: zh ? '出现阻力时' : 'If friction increases',
      condition: zh
        ? '如果沟通受阻、支持不足，或小步尝试反复缺少回应。'
        : 'If communication stalls, support is missing or small trials repeatedly receive no response.',
      outlook: zh
        ? `先用「${inner[0]}」检查局面，再减少无反馈的重复推进。阻力是待核实的信息，不是灾祸预言。`
        : `Re-examine the situation through ${inner[0].toLowerCase()} and reduce unresponsive repetition. Friction is information to check, not a prediction of disaster.`,
      observe: inner[3],
      reviseIf: zh
        ? '若阻力消退且支持恢复，可重新尝试一个可撤回的小步骤。'
        : 'If friction eases and support returns, reconsider one small reversible step.',
    },
  ];
  const recommendations = [
    {
      basisHexagramId: chart.primary.id,
      title: zh ? '先做一步' : 'Start with one step',
      action: primary[2],
      observe: primary[3],
      reconsiderIf: zh
        ? '若实际反馈与预期不同，先记录差异，不急于追加投入。'
        : 'If feedback differs from expectations, record the difference before committing more.',
    },
    {
      basisHexagramId: chart.changed.id,
      title: zh ? '试探方向' : 'Test the direction',
      action: hasMoving
        ? changed[2]
        : zh
          ? '保持一个有效步骤，只调整一处可检验的细节。'
          : 'Retain a useful step and change only one testable detail.',
      observe: changed[3],
      reconsiderIf: zh
        ? '若所需条件并未出现，暂缓放大这个方向。'
        : 'If the required conditions are absent, defer expanding this direction.',
    },
    {
      basisHexagramId: chart.nuclear.id,
      title: zh ? '复核内在条件' : 'Review supporting conditions',
      action:
        inner[2] === primary[2] || inner[2] === changed[2]
          ? zh
            ? '将已知事实与假设分开记录，先核对一个会改变判断的条件。'
            : 'Separate known facts from assumptions and check one condition that could change the reading.'
          : inner[2],
      observe:
        inner[2] === primary[2] || inner[2] === changed[2]
          ? zh
            ? '哪些新事实支持或推翻了当前判断？'
            : 'Which new observations support or challenge the current reading?'
          : inner[3],
      reconsiderIf: zh
        ? '若出现新事实或未考虑的限制，重新检查前提。'
        : 'Revisit the assumptions when new facts or overlooked limits emerge.',
    },
  ];
  const unique = new Map([chart.primary, chart.changed, chart.nuclear].map((h) => [h.id, h]));
  const citations = [...unique.values()].map((h) => ({
    hexagramId: h.id,
    quote: h.judgment,
    sourceUrl: h.source.url,
    sourceVersion: h.source.version,
  }));
  return {
    version: FORECAST_VERSION,
    mode: 'local-rules' as const,
    kind: 'conditional-symbolic-scenarios' as const,
    chartIds: {
      primaryId: chart.primary.id,
      changedId: chart.changed.id,
      nuclearId: chart.nuclear.id,
    },
    summary: zh
      ? `以「${primary[0]}」观察现状，${hasMoving ? `以「${changed[0]}」作为待验证的变化方向` : '以延续与微调作为待验证的方向'}；用「${inner[0]}」补充观察。`
      : `Read the present through ${primary[0].toLowerCase()}, explore ${hasMoving ? changed[0].toLowerCase() : 'continuity and small adjustments'} as a direction to test, and use ${inner[0].toLowerCase()} as a supporting lens.`,
    changeSummary: !hasMoving
      ? zh
        ? '无动爻：不把相同卦象解释成必有转折。'
        : 'No moving lines: an identical pattern is not treated as a required turning point.'
      : chart.movingLines.length >= 4
        ? zh
          ? '多爻同时变化：先缩小尝试范围，分别检查不同环节，避免只凭一条线索下结论。'
          : 'Several lines move: keep trials small and review different parts before drawing a conclusion.'
        : zh
          ? '动爻标记需要关注的变化位置；以下阶段比喻为自编提示，不是经典原文的固定预测法。'
          : 'Moving lines identify positions to examine. The stage metaphors below are original prompts, not a fixed classical forecasting method.',
    readings,
    moving,
    scenarios,
    recommendations,
    citations,
    authorship: zh
      ? '趋势、情景与行动提示为 MysticAtlas 自编规则解读；下列引用才是版本化经文。'
      : 'Trend, scenario and action prompts are original MysticAtlas rules; only the cited passages are classical text.',
    limitations: zh
      ? '这是传统卦象的条件推演，不是经过验证的事实预测模型。不提供命中率、固定应期或必然结论；请用现实信息复核，不用于投资、医疗、法律等重大决策。'
      : 'These are conditional readings of traditional symbols, not a validated factual prediction model. No accuracy rate, fixed event date or guaranteed outcome is supplied. Check real evidence; do not use this for major financial, medical or legal decisions.',
  };
}
export type LocalForecast = ReturnType<typeof generateForecast>;
