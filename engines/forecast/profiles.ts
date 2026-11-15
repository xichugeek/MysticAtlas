/** Original MysticAtlas symbolic reading prompts. Not classical quotations or an empirical model.
 * Each tuple is [motif, reading, reversible action, review question].
 */
export type ReadingPrompt = readonly [string, string, string, string];
export interface ForecastProfile {
  id: number;
  zh: ReadingPrompt;
  en: ReadingPrompt;
}
export const FORECAST_PROFILES: readonly ForecastProfile[] = [
  {
    id: 1,
    zh: [
      '主动开局',
      '把注意力放在方向、主动性与持续推进。',
      '先完成一个目标清楚、范围有限的起步动作。',
      '下一步的责任与完成标准是否明确？',
    ],
    en: [
      'Initiative',
      'Look at direction, initiative and sustained effort.',
      'Complete one small first step with a clear goal.',
      'Are ownership and completion criteria clear?',
    ],
  },
  {
    id: 2,
    zh: [
      '承接与配合',
      '先观察现实条件，再选择怎样配合与承接。',
      '整理已有资源，向相关的人确认实际需求。',
      '你的支持是否回应了真实需求？',
    ],
    en: [
      'Receptivity',
      'Observe the conditions before deciding how to support them.',
      'List available resources and ask what support is actually needed.',
      'Does your support meet an expressed need?',
    ],
  },
  {
    id: 3,
    zh: [
      '初始阻力',
      '新开端可能伴随信息不足与协作磨合。',
      '把当前困难拆开，只试一个最小可行步骤。',
      '阻力来自缺少信息，还是步骤过大？',
    ],
    en: [
      'A difficult beginning',
      'A new start can involve missing information and coordination.',
      'Separate the obstacles and try one minimal step.',
      'Is the obstacle missing information or an oversized step?',
    ],
  },
  {
    id: 4,
    zh: [
      '学习与求证',
      '把暂时不懂的地方当作需要澄清的学习任务。',
      '列出一个具体疑问，向可靠资料或合适的人求证。',
      '问题是否变得更清楚，而非只是反复询问？',
    ],
    en: [
      'Learning',
      'Treat uncertainty as a specific learning task.',
      'Write one precise question and check a suitable source.',
      'Is the question becoming clearer rather than merely repeated?',
    ],
  },
  {
    id: 5,
    zh: [
      '等待条件',
      '关注准备程度与条件成熟，避免把等待当作停滞。',
      '先补齐一项准备，并写下开始行动所需的条件。',
      '等待期间是否积累了有用的准备？',
    ],
    en: [
      'Waiting for conditions',
      'Attend to readiness while waiting for conditions to develop.',
      'Finish one preparation and name a condition for starting.',
      'Is the waiting producing useful preparation?',
    ],
  },
  {
    id: 6,
    zh: [
      '分歧与边界',
      '分歧需要先区分事实、诉求与各自的边界。',
      '用中性语言记下分歧，约定一次澄清沟通。',
      '双方能否复述彼此的实际诉求？',
    ],
    en: [
      'Disagreement',
      'Separate facts, needs and boundaries in a disagreement.',
      'Describe the disagreement neutrally and arrange a clarification.',
      'Can each side restate the other side’s actual need?',
    ],
  },
  {
    id: 7,
    zh: [
      '组织与纪律',
      '群体行动需要明确职责、共同目标和基本秩序。',
      '确认一个共同目标与各自负责的下一步。',
      '分工是否清楚，反馈是否有人接收？',
    ],
    en: [
      'Coordination',
      'Collective effort needs roles, a shared goal and workable routines.',
      'Confirm a common goal and each person’s next responsibility.',
      'Are roles clear and is feedback reaching someone?',
    ],
  },
  {
    id: 8,
    zh: [
      '连接与互信',
      '观察关系是否建立在共同意愿和可靠回应上。',
      '向一个相关的人确认合作意愿与可承担的承诺。',
      '联系是否双向，承诺是否得到回应？',
    ],
    en: [
      'Connection',
      'Look for shared willingness and reliable responses.',
      'Ask a relevant person what cooperation they can commit to.',
      'Is the connection reciprocal and responsive?',
    ],
  },
  {
    id: 9,
    zh: [
      '小步积累',
      '以有限资源积累进展，先把细节与节奏稳住。',
      '选择一个能持续的小习惯，先记录几次实际执行。',
      '小动作能否稳定重复？',
    ],
    en: [
      'Small accumulation',
      'Build progress with modest resources and a steady rhythm.',
      'Choose a small repeatable practice and record its execution.',
      'Can the small action be repeated reliably?',
    ],
  },
  {
    id: 10,
    zh: [
      '谨慎履行',
      '在关系与规则之间，留意分寸、次序和实际后果。',
      '行动前确认一项边界与退出方式。',
      '是否理解了规则与对方的边界？',
    ],
    en: [
      'Careful conduct',
      'Attend to boundaries, sequence and consequences.',
      'Confirm a boundary and an exit option before acting.',
      'Are the rules and other people’s boundaries understood?',
    ],
  },
  {
    id: 11,
    zh: [
      '沟通与通达',
      '观察上下游能否交流，资源与需求能否相互接通。',
      '疏通一个信息断点，确认反馈是否真正传达。',
      '不同环节是否开始交换有效信息？',
    ],
    en: [
      'Open exchange',
      'Look at whether information and resources can circulate.',
      'Close one communication gap and confirm the message arrived.',
      'Are different parts exchanging useful information?',
    ],
  },
  {
    id: 12,
    zh: [
      '阻隔与调整',
      '先识别沟通受阻的位置，再调整推进方式。',
      '记录当前受阻的一环，暂停无反馈的重复投入。',
      '原有路径是否持续得不到回应？',
    ],
    en: [
      'Blocked exchange',
      'Locate the blockage before changing how you proceed.',
      'Name the blocked link and pause unresponsive repetition.',
      'Is the existing path still receiving no response?',
    ],
  },
  {
    id: 13,
    zh: [
      '共同目标',
      '共同目标需要公开说明，也需要容纳真实差异。',
      '说清共同目标，邀请不同意见补充。',
      '共识是否建立在理解而非附和上？',
    ],
    en: [
      'Shared purpose',
      'A common purpose needs clarity and room for differences.',
      'State the shared goal and invite a differing view.',
      'Is agreement based on understanding rather than conformity?',
    ],
  },
  {
    id: 14,
    zh: [
      '善用已有',
      '把已有条件转化为可共享、可持续的支持。',
      '盘点一项已有优势，并确认如何合理使用。',
      '资源是否得到负责而透明的使用？',
    ],
    en: [
      'Using what is available',
      'Turn existing capacity into responsible support.',
      'Inventory one useful resource and agree how to use it.',
      'Is the resource being used responsibly and transparently?',
    ],
  },
  {
    id: 15,
    zh: [
      '谦逊校准',
      '减少自我预设，让反馈帮助校准能力与位置。',
      '邀请一个具体反馈，选一处可以改进的细节。',
      '是否愿意据事实修正自己的判断？',
    ],
    en: [
      'Modest calibration',
      'Let feedback revise assumptions about your position.',
      'Invite specific feedback and improve one detail.',
      'Are you willing to revise a view when facts change?',
    ],
  },
  {
    id: 16,
    zh: [
      '准备与动员',
      '热情若有准备与协同，更容易形成实际行动。',
      '把一个想法写成可执行的准备清单。',
      '热情是否落实为具体准备？',
    ],
    en: [
      'Readiness and enthusiasm',
      'Enthusiasm becomes more useful with preparation and coordination.',
      'Turn one idea into a short preparation checklist.',
      'Is enthusiasm producing concrete preparation?',
    ],
  },
  {
    id: 17,
    zh: [
      '跟随与选择',
      '在适应外部变化时，保留自己的判断与边界。',
      '确认你正在跟随什么，以及为什么愿意跟随。',
      '选择是否仍符合自己的目标与边界？',
    ],
    en: [
      'Following with judgment',
      'Adapt while keeping your own judgment and boundaries.',
      'Name what you are following and why it makes sense.',
      'Does the choice still fit your own goals and boundaries?',
    ],
  },
  {
    id: 18,
    zh: [
      '修复积弊',
      '将注意力放在积累已久的问题与可修复的环节。',
      '找出一个重复出现的问题，试着修复其具体原因。',
      '同一问题是否仍以相同方式重复？',
    ],
    en: [
      'Repair',
      'Attend to recurring problems and repairable causes.',
      'Choose one repeating issue and test a repair to its cause.',
      'Is the same problem recurring in the same way?',
    ],
  },
  {
    id: 19,
    zh: [
      '靠近与支持',
      '靠近问题需要了解现场，也需要给他人留出空间。',
      '先听一次现场反馈，再决定怎样提供帮助。',
      '你的介入是否让问题更清楚？',
    ],
    en: [
      'Approach',
      'Come closer to the situation while leaving others room.',
      'Listen to first-hand feedback before offering help.',
      'Does your involvement clarify the situation?',
    ],
  },
  {
    id: 20,
    zh: [
      '观察与理解',
      '先扩大观察范围，再决定是否需要改变。',
      '写下已知事实与尚未核实的推测。',
      '判断中有多少来自实际观察？',
    ],
    en: [
      'Observation',
      'Widen observation before deciding what to change.',
      'Separate known facts from unchecked assumptions.',
      'How much of the judgment comes from observation?',
    ],
  },
  {
    id: 21,
    zh: [
      '处理障碍',
      '阻碍需要被具体说明，并用明确步骤处理。',
      '识别一个阻塞点，约定可检验的处理步骤。',
      '障碍是否有了明确责任与处理标准？',
    ],
    en: [
      'Addressing an obstacle',
      'Name the obstacle and work through explicit steps.',
      'Assign a testable step to one concrete blockage.',
      'Does the obstacle have clear ownership and criteria?',
    ],
  },
  {
    id: 22,
    zh: [
      '形式与实质',
      '表达和呈现可以改进，但要与真实内容相称。',
      '检查一处呈现方式是否准确说明了实际内容。',
      '外在表达是否掩盖了实质问题？',
    ],
    en: [
      'Form and substance',
      'Improve presentation while keeping it faithful to substance.',
      'Check whether one presentation choice reflects the underlying work.',
      'Is appearance concealing a substantive issue?',
    ],
  },
  {
    id: 23,
    zh: [
      '减损与保全',
      '条件减弱时，先关注可保留的基础与必要边界。',
      '减少一项低价值消耗，保留基本支持。',
      '基础支持是否正在减弱？',
    ],
    en: [
      'Preserving a foundation',
      'When support weakens, attend to essentials and boundaries.',
      'Reduce one low-value drain and preserve basic support.',
      'Is essential support becoming weaker?',
    ],
  },
  {
    id: 24,
    zh: [
      '回归与重启',
      '把转机理解为重新建立节奏，而非一次解决所有问题。',
      '恢复一个曾经有效的小步骤。',
      '是否出现了可以持续的小幅恢复？',
    ],
    en: [
      'Return and renewal',
      'Treat renewal as rebuilding a rhythm rather than solving everything at once.',
      'Restart one small practice that has worked before.',
      'Is a modest recovery becoming repeatable?',
    ],
  },
  {
    id: 25,
    zh: [
      '真实与不妄',
      '以事实和诚实行动为基础，少作额外假设。',
      '核对一项关键事实，去掉一个未经验证的预设。',
      '行动是否依赖了未经证实的假设？',
    ],
    en: [
      'Acting without fabrication',
      'Ground action in facts and avoid added assumptions.',
      'Check one important fact and remove one unsupported assumption.',
      'Does the action depend on an untested assumption?',
    ],
  },
  {
    id: 26,
    zh: [
      '积蓄与约束',
      '积累能力的同时，也要明确使用能力的边界。',
      '安排一次练习或整理，暂缓超出准备程度的承诺。',
      '能力与承诺是否匹配？',
    ],
    en: [
      'Building capacity',
      'Build capacity while defining limits on its use.',
      'Practice or organize before making a larger commitment.',
      'Does capacity match the commitment?',
    ],
  },
  {
    id: 27,
    zh: [
      '滋养与选择',
      '留意日常输入、交流与习惯如何支持你的行动。',
      '选择一项更有帮助的信息输入或日常习惯。',
      '日常输入是在支持还是分散注意力？',
    ],
    en: [
      'Nourishing attention',
      'Notice how inputs, conversations and habits support action.',
      'Choose one more useful information source or daily practice.',
      'Are daily inputs supporting or scattering attention?',
    ],
  },
  {
    id: 28,
    zh: [
      '承载与减压',
      '当负担超出结构承载时，先调整负荷与支撑。',
      '识别一项过量任务，协商拆分或减少。',
      '任务量是否超过了当前支撑条件？',
    ],
    en: [
      'Load and support',
      'Adjust the load when it exceeds available support.',
      'Identify one oversized task and negotiate a smaller scope.',
      'Does the load exceed present support?',
    ],
  },
  {
    id: 29,
    zh: [
      '重复难点',
      '面对反复出现的难点，靠核实、练习与边界逐步应对。',
      '为一个重复难点准备检查清单与停止条件。',
      '是否能识别何时需要暂停或求助？',
    ],
    en: [
      'Recurring difficulty',
      'Meet recurring difficulty with checks, practice and boundaries.',
      'Prepare a checklist and stopping condition for one recurring issue.',
      'Can you recognize when to pause or ask for help?',
    ],
  },
  {
    id: 30,
    zh: [
      '清晰与依托',
      '看清所依托的条件，让判断获得持续的信息支持。',
      '明确一项判断依赖的信息，并核对其可靠性。',
      '你依赖的信息是否仍然有效？',
    ],
    en: [
      'Clarity and support',
      'Clarify the conditions and information supporting a judgment.',
      'Name an important information dependency and check it.',
      'Is the information you rely on still valid?',
    ],
  },
  {
    id: 31,
    zh: [
      '回应与感通',
      '观察彼此是否有真实回应，不代替对方表达意愿。',
      '用一个开放问题确认对方的想法。',
      '互动是否有双方明确的回应？',
    ],
    en: [
      'Mutual response',
      'Look for genuine responses without assuming another person’s wishes.',
      'Ask an open question about the other person’s view.',
      'Is there an explicit response from both sides?',
    ],
  },
  {
    id: 32,
    zh: [
      '持续与调整',
      '持续需要稳定的原则，也需要可调整的执行方式。',
      '保留一个有效习惯，同时调整一个不合时宜的步骤。',
      '坚持的是目标，还是已经失效的方法？',
    ],
    en: [
      'Continuity',
      'Keep useful principles while adapting execution.',
      'Retain a helpful habit and revise an outdated step.',
      'Are you preserving the goal or an ineffective method?',
    ],
  },
  {
    id: 33,
    zh: [
      '退让与留白',
      '适当退让可以保存空间，先辨别需要退出的部分。',
      '暂停一项无效争执，并说明自己的边界。',
      '退让是否让你获得重新判断的空间？',
    ],
    en: [
      'Stepping back',
      'A measured retreat can restore room for judgment.',
      'Pause one unproductive dispute and state a boundary.',
      'Does stepping back create room to reassess?',
    ],
  },
  {
    id: 34,
    zh: [
      '力量与分寸',
      '行动能力增强时，更需要关注分寸与他人空间。',
      '在推进前确认一项约束，避免一次扩张过多。',
      '推进是否获得了相应支持与同意？',
    ],
    en: [
      'Strength with restraint',
      'Greater capacity calls for proportion and respect for others.',
      'Confirm one constraint before expanding an action.',
      'Does the action have corresponding support and consent?',
    ],
  },
  {
    id: 35,
    zh: [
      '进展与反馈',
      '进展需要被看见，也需要由反馈确认是否有效。',
      '展示一个已完成的小成果，收集具体反馈。',
      '成果是否产生了可见而有用的反馈？',
    ],
    en: [
      'Progress and feedback',
      'Let feedback establish whether apparent progress is useful.',
      'Show one completed piece of work and ask for specific feedback.',
      'Is the work producing visible and useful feedback?',
    ],
  },
  {
    id: 36,
    zh: [
      '保护与韬养',
      '表达受限时，先保护必要边界并保留清楚的判断。',
      '选择更合适的表达场合，记录需要保留的事实。',
      '当前环境是否允许安全而清楚的表达？',
    ],
    en: [
      'Protecting clarity',
      'When expression is constrained, preserve boundaries and clear judgment.',
      'Choose a more suitable setting and record essential facts.',
      'Does the setting allow safe and clear expression?',
    ],
  },
  {
    id: 37,
    zh: [
      '内部关系',
      '内部协作依赖清楚角色、日常沟通与相互尊重。',
      '就一项共同事务确认分工与沟通方式。',
      '日常角色与期待是否已经说清？',
    ],
    en: [
      'Internal relationships',
      'Internal cooperation needs clear roles and respectful communication.',
      'Agree on responsibilities and communication for a shared task.',
      'Have everyday roles and expectations been made explicit?',
    ],
  },
  {
    id: 38,
    zh: [
      '差异与求同',
      '差异不必立即消除，可以先找到可共同处理的小事。',
      '保留分歧，先约定一个双方都能接受的小步骤。',
      '差异是否仍允许有限合作？',
    ],
    en: [
      'Difference and common ground',
      'Differences can remain while a small shared task is attempted.',
      'Agree on one small step without forcing full agreement.',
      'Do the differences still allow limited cooperation?',
    ],
  },
  {
    id: 39,
    zh: [
      '受阻与求助',
      '前路受阻时，换角度或借助支持比重复硬推更值得尝试。',
      '说明卡点，向合适的人请求一次具体帮助。',
      '障碍是否需要外部支持或替代路径？',
    ],
    en: [
      'Obstruction and support',
      'Consider assistance or another angle when a path is blocked.',
      'Describe the blockage and request one specific form of help.',
      'Does the obstacle call for support or an alternative path?',
    ],
  },
  {
    id: 40,
    zh: [
      '松动与解除',
      '条件松动时，及时处理遗留事项并减少不必要的束缚。',
      '解决一个可解除的牵连，确认剩余责任。',
      '哪些限制已经可以解除？',
    ],
    en: [
      'Release',
      'When conditions loosen, resolve loose ends and unnecessary constraints.',
      'Remove one avoidable dependency and confirm remaining duties.',
      'Which constraints can now be released?',
    ],
  },
  {
    id: 41,
    zh: [
      '减法与取舍',
      '通过取舍让重要事项得到足够注意与支持。',
      '删去一个非必要步骤，把时间留给优先事项。',
      '减少之后，核心事项是否得到更多支持？',
    ],
    en: [
      'Subtraction',
      'Use deliberate trade-offs to support what matters.',
      'Remove one unnecessary step and protect a priority.',
      'Does reducing scope improve support for the priority?',
    ],
  },
  {
    id: 42,
    zh: [
      '增益与互助',
      '增益要看是否形成可共享、可持续的实际改善。',
      '做一项能同时改善协作与实际结果的小调整。',
      '改善是否惠及参与者而非只增加负担？',
    ],
    en: [
      'Useful increase',
      'Look for sustainable improvements that can be shared.',
      'Make a small change that improves both cooperation and the work.',
      'Does the improvement help participants rather than add a burden?',
    ],
  },
  {
    id: 43,
    zh: [
      '决断与说明',
      '需要作出取舍时，把理由、边界与后续安排说清。',
      '就一项待定事务写下依据与可撤回的小决定。',
      '决定是否有清楚依据与后续检验？',
    ],
    en: [
      'A clear decision',
      'Explain reasons, boundaries and follow-up when making a choice.',
      'Make a small reversible decision with a written reason.',
      'Does the decision have a basis and a follow-up check?',
    ],
  },
  {
    id: 44,
    zh: [
      '新因素与边界',
      '留意突然进入局面的新信息或新关系，先确认边界。',
      '核实一个新出现的因素，暂缓扩大承诺。',
      '新因素是否已被核实并纳入边界？',
    ],
    en: [
      'An encounter',
      'Notice a new factor entering the situation and check its boundaries.',
      'Verify a new factor before extending a commitment.',
      'Has the new factor been checked and bounded?',
    ],
  },
  {
    id: 45,
    zh: [
      '汇聚与共识',
      '人和资源聚集之后，需要明确共同目标和参与方式。',
      '确认一次合作的目标、参与意愿与信息入口。',
      '聚集是否形成了清楚的共同任务？',
    ],
    en: [
      'Gathering',
      'A gathering needs a shared goal and ways to participate.',
      'Clarify the task, willingness to join and communication channel.',
      'Has the gathering formed a clear shared task?',
    ],
  },
  {
    id: 46,
    zh: [
      '渐进与积累',
      '把推进拆成可积累的层级，以实际完成支持下一步。',
      '设定一个稍高但可完成的里程碑。',
      '上一阶段的完成是否支持下一步？',
    ],
    en: [
      'Stepwise growth',
      'Build the next stage on completed work.',
      'Set a slightly more demanding but achievable milestone.',
      'Does completed work support the next step?',
    ],
  },
  {
    id: 47,
    zh: [
      '约束与耐心',
      '条件有限时，先辨别可控部分与必要的支持。',
      '减少一个可避免的消耗，保留最必要的任务。',
      '有限的精力是否用在可控事项上？',
    ],
    en: [
      'Working within limits',
      'Identify what is controllable and what support is needed.',
      'Reduce an avoidable drain and retain an essential task.',
      'Is limited effort going toward controllable matters?',
    ],
  },
  {
    id: 48,
    zh: [
      '基础与共享',
      '关注长期可用的基础支持，以及它是否容易被取用。',
      '检查一项基础资料或公共流程是否仍然可用。',
      '支持资源是否可靠且能被实际使用？',
    ],
    en: [
      'A shared foundation',
      'Attend to dependable resources and access to them.',
      'Check whether a shared resource or basic process is usable.',
      'Is the resource reliable and accessible in practice?',
    ],
  },
  {
    id: 49,
    zh: [
      '更新与准备',
      '改变旧安排需要条件、说明与真实参与。',
      '先试一个范围有限的调整，并说明调整理由。',
      '改变是否有准备、反馈与参与意愿？',
    ],
    en: [
      'Renewal',
      'Changing an arrangement needs readiness, explanation and participation.',
      'Try a limited change and explain its reason.',
      'Is the change supported by preparation, feedback and willingness?',
    ],
  },
  {
    id: 50,
    zh: [
      '转化与承载',
      '让已有材料与协作方式形成更合适的共同成果。',
      '整理一个协作流程，使输入与输出更清楚。',
      '现有安排是否能承载新的用途？',
    ],
    en: [
      'Transformation',
      'Organize materials and cooperation into a useful result.',
      'Clarify the inputs and outputs of a shared process.',
      'Can the present arrangement support its new purpose?',
    ],
  },
  {
    id: 51,
    zh: [
      '扰动与定心',
      '变化带来扰动时，先辨事实、稳住必要的步骤。',
      '遇到新情况先核实，再恢复一个基本流程。',
      '回应是否来自核实而非一时惊慌？',
    ],
    en: [
      'Responding to disruption',
      'Check facts and keep essential steps when something unsettles the situation.',
      'Verify a new development and restore a basic routine.',
      'Is the response based on checks rather than alarm?',
    ],
  },
  {
    id: 52,
    zh: [
      '暂停与界限',
      '适时暂停有助于识别边界和重新集中注意。',
      '为一项事务设置明确的暂停点。',
      '是否能够在合适的位置停止？',
    ],
    en: [
      'A deliberate pause',
      'Pause to recognize limits and regain attention.',
      'Set a clear stopping point for one activity.',
      'Can you stop at an appropriate point?',
    ],
  },
  {
    id: 53,
    zh: [
      '循序渐进',
      '让步骤与条件相配，避免跳过必要的成熟过程。',
      '按顺序完成一个前置条件，再推进下一层。',
      '下一步的前置条件是否已经满足？',
    ],
    en: [
      'Gradual development',
      'Match the sequence of steps to developing conditions.',
      'Complete one prerequisite before moving to the next stage.',
      'Have the prerequisites for the next step been met?',
    ],
  },
  {
    id: 54,
    zh: [
      '位置与期待',
      '先明确自己的位置、选择空间与彼此的期待。',
      '沟通一项未说清的角色或期待。',
      '是否有尚未表达的限制与不同期待？',
    ],
    en: [
      'Position and expectations',
      'Clarify your role, room to choose and shared expectations.',
      'Discuss one unspoken role or expectation.',
      'Are there unexpressed limits or differing expectations?',
    ],
  },
  {
    id: 55,
    zh: [
      '繁盛与取舍',
      '事情集中展开时，保持清楚的优先级与信息流。',
      '从当前事项中选一个优先项，并安排复盘。',
      '繁忙是否仍然围绕清楚的重点？',
    ],
    en: [
      'Abundance and priorities',
      'Keep priorities and information clear when much is happening.',
      'Choose one priority and arrange a review.',
      'Is activity still organized around a clear focus?',
    ],
  },
  {
    id: 56,
    zh: [
      '过渡与适应',
      '在暂时或陌生的环境里，先熟悉规则与必要支持。',
      '了解一个新环境的基本规则与可求助的人。',
      '是否掌握了过渡阶段需要的基本信息？',
    ],
    en: [
      'Transition',
      'In an unfamiliar setting, learn the rules and available support.',
      'Check the basic rules and who can help in the new setting.',
      'Do you have the information needed for the transition?',
    ],
  },
  {
    id: 57,
    zh: [
      '渐入与沟通',
      '以持续而温和的沟通逐步理解并影响局面。',
      '用一次简短沟通确认理解，再根据反馈微调。',
      '沟通是否带来了可以确认的理解？',
    ],
    en: [
      'Gradual influence',
      'Use patient communication to understand and adjust a situation.',
      'Confirm understanding in a short conversation and adapt to feedback.',
      'Has communication produced a checkable understanding?',
    ],
  },
  {
    id: 58,
    zh: [
      '交流与信任',
      '交流带来轻松与连接，也需要真实表达和兑现。',
      '表达一个真实想法，同时听取一个具体回应。',
      '愉快交流是否包含真实且可兑现的内容？',
    ],
    en: [
      'Exchange',
      'Enjoyable exchange also needs honesty and follow-through.',
      'Share an honest view and listen for a concrete response.',
      'Does the pleasant exchange include something real and dependable?',
    ],
  },
  {
    id: 59,
    zh: [
      '疏解与重连',
      '分散的注意与关系可以通过澄清重新连接。',
      '清理一个信息误解，重新确认共同关注点。',
      '分散是否减少，共同关注点是否清楚？',
    ],
    en: [
      'Dissolving a separation',
      'Clarification can reconnect scattered attention and relationships.',
      'Resolve one misunderstanding and restate the shared concern.',
      'Is fragmentation easing and the shared concern clearer?',
    ],
  },
  {
    id: 60,
    zh: [
      '节制与尺度',
      '用适合现实的尺度管理投入，避免边界过松或过紧。',
      '为一项投入设置可调整的上限与复盘点。',
      '限制是否适度，并允许根据反馈调整？',
    ],
    en: [
      'Proportionate limits',
      'Use limits that fit the situation and can be revised.',
      'Set an adjustable limit and a review point for one effort.',
      'Are the limits proportionate and responsive to feedback?',
    ],
  },
  {
    id: 61,
    zh: [
      '诚意与验证',
      '信任需要真实表达，也需要行动和反馈相互印证。',
      '说明一个真实意图，并用一项小行动兑现。',
      '表达与实际行动是否相符？',
    ],
    en: [
      'Sincerity',
      'Let actions and feedback substantiate an expressed intention.',
      'State an honest intention and follow through on a small promise.',
      'Do words and actual actions agree?',
    ],
  },
  {
    id: 62,
    zh: [
      '细节与谨慎',
      '把注意力放在细节与小范围修正，避免超过当前条件。',
      '检查一个容易遗漏的细节，先做小幅修正。',
      '小处是否已经核对，行动是否适度？',
    ],
    en: [
      'Attention to small things',
      'Attend to details and small corrections within current limits.',
      'Check an easily missed detail and make a small correction.',
      'Have details been checked and is the action proportionate?',
    ],
  },
  {
    id: 63,
    zh: [
      '完成与维护',
      '阶段完成之后，关注维护、交接与新的变化。',
      '为一个已完成事项补上验收或维护检查。',
      '完成之后是否仍有持续维护与反馈？',
    ],
    en: [
      'Completion and maintenance',
      'After a milestone, attend to maintenance and new developments.',
      'Add an acceptance or maintenance check to completed work.',
      'Is there continued maintenance and feedback after completion?',
    ],
  },
  {
    id: 64,
    zh: [
      '未竟与过渡',
      '事情尚未收束时，先确认缺口与衔接条件。',
      '列出尚未完成的一项关键条件，核实后再交接。',
      '收尾条件与下一阶段的衔接是否清楚？',
    ],
    en: [
      'An unfinished transition',
      'Identify the remaining gap and conditions for a handover.',
      'Check one outstanding condition before handing work onward.',
      'Are completion conditions and the next handover clear?',
    ],
  },
];

export function getForecastProfile(id: number, lang: 'zh' | 'en'): ReadingPrompt {
  const profile = FORECAST_PROFILES.find((p) => p.id === id);
  if (!profile) throw new RangeError('Unknown forecast profile');
  return profile[lang];
}
