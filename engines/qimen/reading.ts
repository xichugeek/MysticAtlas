import { CYCLE, INSTRUMENTS, PALACE, controls, generates, type QimenChart } from './index';
export const QIMEN_READING_VERSION = 'qimen-reading/1.0.0';
export const TOPICS = ['general', 'career', 'study', 'cooperation', 'travel'] as const;
export type QimenTopic = (typeof TOPICS)[number];
type Lang = 'zh' | 'en';
export const ELEMENT_NAMES = {
  zh: { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' },
  en: { wood: 'Wood', fire: 'Fire', earth: 'Earth', metal: 'Metal', water: 'Water' },
};
export function selectUse(chart: QimenChart, topic: QimenTopic) {
  if (!TOPICS.includes(topic)) throw new Error('INVALID_QIMEN_TOPIC');
  const day = chart.pillars.day;
  const stem = day[0] === '甲' ? INSTRUMENTS[Math.floor(CYCLE.indexOf(day) / 10)] : day[0];
  const self = chart.palaces.find((p) => p.heaven.includes(stem))!;
  const target = chart.palaces.find((p) =>
    topic === 'cooperation'
      ? p.deity === '六合'
      : topic === 'study'
        ? p.stars.includes('天辅')
        : p.door === (topic === 'general' ? chart.chiefDoor : '开门'),
  )!;
  return { self, target, stem };
}
export function qimenReading(chart: QimenChart, topic: QimenTopic, lang: Lang = 'zh') {
  const { self, target, stem } = selectUse(chart, topic);
  const a = PALACE[self.id].element,
    b = PALACE[target.id].element;
  const relation =
    a === b
      ? 'same'
      : generates(b, a)
        ? 'supports'
        : generates(a, b)
          ? 'invests'
          : controls(b, a)
            ? 'restrains'
            : 'manages';
  const supportive = relation === 'same' || relation === 'supports';
  const restrictive = ['死门', '惊门', '伤门'].includes(target.door);
  const kind = target.voidBranches.length
    ? 'verify'
    : restrictive || relation === 'restrains'
      ? 'friction'
      : supportive && !target.doorPressure && ['开门', '休门', '生门'].includes(target.door)
        ? 'opening'
        : 'trial';
  const zh = lang === 'zh';
  const relations = {
    same: zh
      ? '用神宫与日干宫同属一行，取“同类可协同”的象意。'
      : 'The topic and day-stem palaces share an element: a symbolic lens of coordination.',
    supports: zh
      ? '用神宫五行生日干宫，取“外部条件可支持自身”的象意。'
      : 'The topic palace generates the day-stem palace: a lens of external support.',
    invests: zh
      ? '日干宫五行生用神宫，取“需要先投入精力”的象意。'
      : 'The day-stem palace generates the topic palace: a lens of effort before response.',
    restrains: zh
      ? '用神宫五行克日干宫，取“外部要求形成约束”的象意。'
      : 'The topic palace controls the day-stem palace: a lens of external constraints.',
    manages: zh
      ? '日干宫五行克用神宫，取“需要主动协调与管理”的象意。'
      : 'The day-stem palace controls the topic palace: a lens of active coordination.',
  };
  const verdicts = {
    verify: [
      zh ? '先核实，暂缓强推' : 'Verify before pushing',
      zh
        ? '本盘所取用神落空亡宫，暂把结果视为条件尚未落实；先确认承诺、材料或行程，再判断能否推进。'
        : 'The selected topic palace contains an hourly void branch. Treat this as an unresolved-condition symbol; verify commitments, materials or plans before proceeding.',
    ],
    friction: [
      zh ? '存在阻力，宜调整路径' : 'Friction; revise the approach',
      zh
        ? '本盘出现约束或较紧张的门象，当前倾向先处理阻力；若关键条件改善，仍可重新评估，并非判定事情必败。'
        : 'The chart contains a constraining relationship or a tense door symbol. Address the obstacle first and reconsider if conditions improve; this does not establish failure.',
    ],
    opening: [
      zh ? '有条件可推，先做小试' : 'An opening, with conditions',
      zh
        ? '所取门象与宫间关系提供了较顺的象征组合，倾向可以推进一个可回退的小步骤；能否落实仍要看现实反馈。'
        : 'The selected door and palace relationship form a supportive symbolic combination. Try one reversible step and judge progress by real feedback.',
    ],
    trial: [
      zh ? '可小步试行，保留余地' : 'Try a small, reversible step',
      zh
        ? '本盘支持与限制并存，当前倾向先试行、后确认；不宜把尚未兑现的条件当成确定结果。'
        : 'The chart presents mixed conditions. Test a small step before committing further; unresolved conditions are not established outcomes.',
    ],
  };
  const evidence = [
    zh
      ? `日干 ${chart.pillars.day} 取 ${stem}，天盘落 ${PALACE[self.id].name}${self.id}宫；本事项取用落 ${PALACE[target.id].name}${target.id}宫。`
      : `Day ${chart.pillars.day} uses ${stem} in palace ${self.id}; the selected topic uses palace ${target.id}.`,
    relations[relation],
    zh
      ? `用神宫：${target.door}、${target.stars.join('·')}、${target.deity}；门${target.doorPressure ? '有门迫（门克宫）' : '未见门迫'}，${target.voidBranches.length ? `时旬空支为 ${target.voidBranches.join('、')}` : '未见时旬空支'}。`
      : `Topic palace: ${target.door}, ${target.stars.join(' / ')}, ${target.deity}; ${target.doorPressure ? 'door controls palace (pressure)' : 'no door-pressure condition'}; ${target.voidBranches.length ? 'hourly void: ' + target.voidBranches.join(', ') : 'no hourly void branch'}.`,
  ];
  if (chart.starPattern === 'repeated' || chart.doorPattern === 'repeated')
    evidence.push(
      zh
        ? `${chart.starPattern === 'repeated' ? '星盘伏吟' : ''}${chart.starPattern === 'repeated' && chart.doorPattern === 'repeated' ? '、' : ''}${chart.doorPattern === 'repeated' ? '门盘伏吟' : ''}：对应层回到原位，取“宜复查、重整”的象意。`
        : 'A repeated star/door layer returns to its original positions: use this as a prompt to review and consolidate.',
    );
  if (chart.starPattern === 'opposed' || chart.doorPattern === 'opposed')
    evidence.push(
      zh
        ? '星盘或门盘反吟：对应层整体到对宫，取“可能反复、需留调整空间”的象意。'
        : 'A star/door layer is fully opposite its original positions: allow room to revise the approach.',
    );
  const actions = {
    general: zh
      ? '把目标缩成一个可检验的小步骤，约定何种反馈算进展。'
      : 'Reduce the goal to one testable step and define what feedback counts as progress.',
    career: zh
      ? '先核实岗位要求、负责人和下一次沟通安排，再决定投入。'
      : 'Verify role requirements, the responsible contact and the next discussion before committing effort.',
    study: zh
      ? '完成一份小练习并找出错误，用实际掌握程度调整计划。'
      : 'Complete a short exercise, inspect errors and adjust the plan using demonstrated understanding.',
    cooperation: zh
      ? '把双方责任、交付和确认方式写清，先完成一次小范围协作。'
      : 'Agree responsibilities, deliverables and acceptance in writing, then try a small collaboration.',
    travel: zh
      ? '核实行程、开放时间和交通情况，准备可变更的备选路线。'
      : 'Verify travel arrangements, opening hours and transport, and prepare a flexible alternative route.',
  };
  const scenarios = zh
    ? [
        {
          kind: 'opening',
          condition: '如果关键条件被明确确认',
          outlook: '可逐步推进，但每一步都以实际反馈复核。',
          observe: '对方是否确认具体安排，资源是否真正到位。',
        },
        {
          kind: 'continuity',
          condition: '如果目前条件没有改变',
          outlook:
            kind === 'opening'
              ? '保留小规模试行，避免一次扩大承诺。'
              : '维持准备与核实，暂不扩大投入。',
          observe: '目前的阻碍是否持续，试行是否获得有效回应。',
        },
        {
          kind: 'friction',
          condition: '如果承诺反复或新障碍出现',
          outlook: '缩小范围或暂停，补充信息后再评估。',
          observe: '时间、责任或可用资源是否出现新的冲突。',
        },
      ]
    : [
        {
          kind: 'opening',
          condition: 'If key conditions are explicitly confirmed',
          outlook: 'Proceed gradually and validate each step with real feedback.',
          observe: 'Are arrangements confirmed and resources actually available?',
        },
        {
          kind: 'continuity',
          condition: 'If current conditions remain unchanged',
          outlook:
            kind === 'opening'
              ? 'Keep the trial small and avoid expanding commitments at once.'
              : 'Continue preparation and verification without increasing commitment.',
          observe: 'Do obstacles persist, and does the trial receive a useful response?',
        },
        {
          kind: 'friction',
          condition: 'If commitments change or new obstacles appear',
          outlook: 'Reduce the scope or pause until more information is available.',
          observe: 'Are new conflicts appearing in timing, responsibility or resources?',
        },
      ];
  return {
    version: QIMEN_READING_VERSION,
    topic,
    kind,
    verdict: verdicts[kind][0],
    answer: verdicts[kind][1],
    selfPalace: self.id,
    targetPalace: target.id,
    relation,
    evidence,
    scenarios,
    action: actions[topic],
    revision: zh
      ? '当关键承诺、实际资源或执行反馈发生变化时，以这些事实修正判断；不要仅为追求想要的结果反复换时起盘。'
      : 'Revise the assessment when commitments, resources or actual feedback change; do not repeatedly change the chart time to seek a preferred result.',
    method: zh
      ? '自编规则解读：按所选事项取用与五行关系生成，不分析问题正文，不核验现实事实；不代表古籍原断或经验证的预测。'
      : 'Original rule-based commentary using the selected topic and elemental relationships. It does not analyze question text or verify real-world facts, and is not an ancient quotation or empirically validated prediction.',
  };
}
export function exportQimen(chart: QimenChart, topic: QimenTopic, lang: Lang, question?: string) {
  return {
    chart,
    reading: qimenReading(chart, topic, lang),
    ...(question?.trim() ? { question: question.trim().slice(0, 300) } : {}),
  };
}
