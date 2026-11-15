import { calculate } from '../iching';
import { dispositionOf, type Disposition } from './judgments';
import { getForecastProfile } from './profiles';

export type QuestionKind = 'yes-no' | 'timing' | 'choice' | 'how' | 'general' | 'evidence-required';
export type AnswerStance =
  | 'lean-yes'
  | 'lean-no'
  | 'conditional'
  | 'wait'
  | 'hold'
  | 'unclear'
  | 'evidence-required';
export const ANSWER_VERSION = 'symbolic-answer/1.0.0';
export function classifyQuestion(question: string): {
  kind: QuestionKind;
  adverseEvent: boolean;
  ambiguousNegation: boolean;
  continuation: boolean;
} {
  const q = question.trim();
  const cleaned = q.replace(/会不会|能不能|是不是|可不可以|有没有|是否|能否|要不要/g, '');
  const kind: QuestionKind =
    /(停药|诊断|癌症|死亡|寿命|消灾|买哪只股票|买入股票|卖出股票|官司胜诉|medication|diagnos|cancer|death|which stock|buy stock)/i.test(
      q,
    )
      ? 'evidence-required'
      : /(什么时候|何时|多久|哪天|几月|几点|when\b|how (?:long|soon))/i.test(q)
        ? 'timing'
        : /(还是|二选一|选哪个|选择哪个|which (?:one|option)|\bor\b)/i.test(q)
          ? 'choice'
          : /(怎么|如何|怎样|how\b)/i.test(q)
            ? 'how'
            : /(是否|能否|会不会|能不能|是不是|可不可以|有没有|要不要|会.*[吗么？?]|能.*[吗么？?]|[吗么]\s*[？?]?$|^(?:will|can|could|would|is|are|does|do|should)\b)/i.test(
                  q,
                )
              ? 'yes-no'
              : 'general';
  return {
    kind,
    adverseEvent: /(失败|失利|被拒|拒绝|落选|倒闭|\bfail\b|\bfailure\b|rejected|\blose\b)/i.test(q),
    ambiguousNegation:
      /(不会|不能|不是|没有|不该|不应该|不成功|不发生|不回来|\bnot\b|never|won't|can't|isn't)/i.test(
        cleaned,
      ),
    continuation: /(保持|继续|维持|持续|remain|continue|still)/i.test(q),
  };
}
const baseStance: Record<Disposition, AnswerStance> = {
  favorable: 'lean-yes',
  conditional: 'conditional',
  delayed: 'wait',
  blocked: 'lean-no',
  stable: 'hold',
  unclear: 'unclear',
};
const dispositions = {
  zh: {
    favorable: '偏向顺势推进',
    conditional: '有机会，但依赖条件',
    delayed: '进展偏慢，需要等待或调整',
    blocked: '当下推进受阻',
    stable: '偏向维持现状',
    unclear: '局面尚不明朗',
  },
  en: {
    favorable: 'a favorable opening',
    conditional: 'an opening dependent on conditions',
    delayed: 'a slower path requiring preparation',
    blocked: 'obstruction in the present',
    stable: 'continuity of the current situation',
    unclear: 'an unsettled picture',
  },
};

/** Direct symbolic verdict. Theme matching is local and limited to question form, not factual research. */
export function generateDirectAnswer(input: unknown, question = '', lang: 'zh' | 'en' = 'zh') {
  if (typeof question !== 'string' || question.length > 300)
    throw new RangeError('Question must be at most 300 characters');
  const chart = calculate(input),
    q = question.trim(),
    form = classifyQuestion(q),
    zh = lang === 'zh';
  const primary = dispositionOf(chart.primary.id),
    changed = dispositionOf(chart.changed.id);
  const hasMoving = chart.movingLines.length > 0;
  let stance = baseStance[primary];
  if (form.kind === 'evidence-required') stance = 'evidence-required';
  else if (form.kind === 'yes-no' && form.ambiguousNegation) stance = 'unclear';
  else if (form.kind === 'yes-no' && primary === 'stable')
    stance = form.continuation ? 'lean-yes' : 'hold';
  if (form.kind === 'yes-no' && form.adverseEvent && !form.ambiguousNegation) {
    if (stance === 'lean-yes') stance = 'lean-no';
    else if (stance === 'lean-no') stance = 'lean-yes';
  }
  const labels = {
    zh: {
      'lean-yes': '偏向会',
      'lean-no': '暂偏否',
      conditional: '有条件可成',
      wait: '暂未到时机',
      hold: '现状延续为主',
      unclear: '暂难明确判断',
      'evidence-required': '需要现实证据判断',
    },
    en: {
      'lean-yes': 'Leans yes',
      'lean-no': 'Leans no for now',
      conditional: 'Possible with conditions',
      wait: 'Not ready yet',
      hold: 'Continuity is favored',
      unclear: 'No clear verdict yet',
      'evidence-required': 'Real-world evidence is needed',
    },
  };
  let verdict = labels[lang][stance];
  if (!q || form.kind === 'general')
    verdict = zh ? `整体：${dispositions.zh[primary]}` : `Overall: ${dispositions.en[primary]}`;
  if (form.kind === 'timing' && stance !== 'evidence-required')
    verdict = zh ? '先看条件，再看时机' : 'Conditions before timing';
  if (form.kind === 'how')
    verdict = zh ? '先处理当前关口，再推进' : 'Address the present obstacle first';
  if (form.kind === 'choice')
    verdict = zh ? '倾向条件更成熟的一项' : 'Favor the better-prepared option';
  let answer = zh
    ? `本次卦象式预测结论为「${verdict}」。`
    : `The symbolic prediction reads: ${verdict.toLowerCase()}.`;
  if (form.kind === 'yes-no') {
    const yesNo = {
      zh: {
        'lean-yes': '就你所问的事情，本次卦断偏向会发生或能够推进。',
        'lean-no': '就你所问的事情，本次卦断暂偏不会按原设想发生。',
        conditional: '就你所问的事情，本次卦断认为有实现空间，但关键条件尚不能省略。',
        wait: '就你所问的事情，本次卦断偏向尚未到可以推进的阶段，先等待准备与回应。',
        hold: '就你所问的变化，本次卦断偏向现状延续，暂不把它读为即将发生明显转变。',
        unclear: form.ambiguousNegation
          ? '问题带有否定或复合表述，本地规则不强行把它折算成是或否；下面给出卦象的具体走势。'
          : '本次卦象尚不支持明确的是或否，当前的判断为局面未明。',
        'evidence-required':
          '这类问题需要可靠的现实信息或专业判断，不能用卦象给出诊断、交易或结局指令。',
      },
      en: {
        'lean-yes':
          'For the event you asked about, this symbolic reading leans toward it happening or moving forward.',
        'lean-no':
          'For the event you asked about, this symbolic reading leans against it happening as envisaged for now.',
        conditional:
          'The symbolic reading sees room for the event, provided the important conditions are met.',
        wait: 'The symbolic reading suggests the matter is not ready to advance; preparation and responses come first.',
        hold: 'The symbolic reading favors continuity rather than an imminent change.',
        unclear: form.ambiguousNegation
          ? 'The question contains negation or a compound phrasing, so the local rule avoids forcing a yes/no answer; the trajectory below is the reading.'
          : 'The symbolic reading does not support a clear yes/no verdict yet.',
        'evidence-required':
          'This question needs reliable real-world evidence or professional judgment, not a divinatory instruction.',
      },
    };
    answer = yesNo[lang][stance];
  } else if (form.kind === 'timing')
    answer = zh
      ? '节奏判断：先满足眼前条件，再等反馈和支持出现；这组卦象不能换算为某一天或具体月份。'
      : 'Timing reading: resolve the present condition, then look for feedback and support. The pattern does not establish a particular day or month.';
  else if (form.kind === 'how') answer = getForecastProfile(chart.primary.id, lang)[2];
  else if (form.kind === 'choice')
    answer = zh
      ? '选择判断：优先考虑已有支持、边界明确且能小步验证的一项；本地规则没有比较你未提供的选项事实。'
      : 'Choice reading: prefer an option with support, clear boundaries and room for a small trial. The local rule has not compared facts about unspecified options.';
  if (form.kind === 'evidence-required')
    answer = zh
      ? '这个问题不适合用卦象断定事实结局。请先取得可靠信息；下方仅保留文化阅读与一般性观察。'
      : 'This question cannot be settled as fact by a hexagram. Obtain reliable evidence; the remaining material is cultural reading and general observation.';
  const trajectory = !hasMoving
    ? zh
      ? `无动爻，${chart.primary.name}卦的主线延续：${dispositions.zh[primary]}。`
      : `No lines move: the ${chart.primary.pinyin} lens continues, suggesting ${dispositions.en[primary]}.`
    : primary === 'blocked' && changed === 'favorable'
      ? zh
        ? '先受阻，后有转机：当下不宜判断为顺利达成，后续要看支持是否重新聚合。'
        : 'Obstruction first, then a possible opening: the present reading is difficult, while later support may gather.'
      : primary === 'favorable' && changed === 'blocked'
        ? zh
          ? '前段有推进空间，后段可能遇到阻力；不要把开始顺利等同于结果已定。'
          : 'An opening first, with possible friction later; an encouraging start does not settle the outcome.'
        : zh
          ? `走势由「${dispositions.zh[primary]}」转向「${dispositions.zh[changed]}」。`
          : `The symbolic trajectory moves from ${dispositions.en[primary]} toward ${dispositions.en[changed]}.`;
  const profile = getForecastProfile(chart.primary.id, lang),
    next = getForecastProfile(chart.changed.id, lang);
  return {
    version: ANSWER_VERSION,
    mode: 'local-symbolic' as const,
    question: q,
    questionKind: form.kind,
    stance,
    verdict,
    answer,
    trajectory,
    reasons: [
      {
        hexagramId: chart.primary.id,
        text: zh
          ? `本卦「${chart.primary.name}」：${profile[1]} 本规则将其读为「${dispositions.zh[primary]}」。`
          : `Primary ${chart.primary.pinyin}: ${profile[1]} This rule reads it as ${dispositions.en[primary]}.`,
      },
      {
        hexagramId: chart.changed.id,
        text: zh
          ? `${hasMoving ? '变卦' : '同卦'}「${chart.changed.name}」：${next[1]}`
          : `${hasMoving ? 'Transformed' : 'Unchanged'} ${chart.changed.pinyin}: ${next[1]}`,
      },
    ],
    turningPoint: zh
      ? `判断转变要看现实条件是否出现变化：${next[3]}`
      : `A revision depends on real conditions: ${next[3]}`,
    nextStep: profile[2],
    scope: zh
      ? '规则卦断 · 象征判断，不是事实核查。本地仅匹配问题类型，未验证人物、事件或问题前提；AI 可在主动请求后细化。'
      : 'Rule-based divination · symbolic, not fact-checked. Local matching identifies question form only; people, events and premises are unverified. An explicit AI request can refine the reading.',
  };
}
export type DirectAnswer = ReturnType<typeof generateDirectAnswer>;
