import { describe, expect, it } from 'vitest';
import { classifyQuestion, generateDirectAnswer } from '../engines/forecast/answer';
import { SYMBOLIC_JUDGMENTS } from '../engines/forecast/judgments';
import { generateForecast } from '../engines/forecast';

describe('question-linked symbolic conclusions', () => {
  it('covers all 64 dispositions exactly once without a numerical score', () => {
    expect(SYMBOLIC_JUDGMENTS.map((r) => r.id)).toEqual(
      Array.from({ length: 64 }, (_, i) => i + 1),
    );
    expect(SYMBOLIC_JUDGMENTS.every((r) => !('score' in r))).toBe(true);
  });
  it('reproduces the screenshot numeric cast as 47 → 45 and gives a direct answer', () => {
    const q = '某位创始人会回到公司担任负责人吗？';
    const result = generateForecast([8, 9, 8, 7, 7, 8], 'zh', q);
    expect(result.chartIds).toEqual({ primaryId: 47, changedId: 45, nuclearId: 37 });
    expect(result.conclusion.question).toBe(q);
    expect(result.conclusion.questionKind).toBe('yes-no');
    expect(result.conclusion.verdict).toBe('暂偏否');
    expect(result.conclusion.answer).toContain('暂偏不会按原设想发生');
    expect(result.conclusion.trajectory).toContain('先受阻，后有转机');
    expect(result.conclusion.scope).toContain('未验证人物');
  });
  it('distinguishes a direct event question, adverse event, and ambiguous negation', () => {
    expect(generateDirectAnswer([7, 7, 7, 7, 7, 7], '这次沟通会成功吗？').stance).toBe('lean-yes');
    expect(generateDirectAnswer([7, 7, 7, 7, 7, 7], '这次沟通会失败吗？').stance).toBe('lean-no');
    expect(generateDirectAnswer([7, 7, 7, 7, 7, 7], '这次沟通会不会成功？').stance).toBe(
      'lean-yes',
    );
    expect(generateDirectAnswer([7, 7, 7, 7, 7, 7], '这次沟通不会成功吗？').stance).toBe('unclear');
  });
  it.each([
    ['什么时候可以开始？', 'timing'],
    ['选择甲还是乙？', 'choice'],
    ['如何推进沟通？', 'how'],
    ['Will the conversation work?', 'yes-no'],
    ['When can it start?', 'timing'],
    ['How can I proceed?', 'how'],
  ] as const)('matches question form %s', (q, kind) => {
    expect(classifyQuestion(q).kind).toBe(kind);
  });
  it('does not invent an event with no question, or supply a precise event date', () => {
    const overall = generateDirectAnswer([7, 7, 7, 7, 7, 7]);
    expect(overall.question).toBe('');
    expect(overall.verdict).toContain('整体');
    const timing = generateDirectAnswer([7, 7, 7, 7, 7, 7], '什么时候会发生？');
    expect(timing.answer).toContain('不能换算为某一天');
    expect(timing).not.toHaveProperty('date');
    expect(timing).not.toHaveProperty('probability');
  });
  it('uses real-world evidence handling for professional/high-risk questions', () => {
    const result = generateDirectAnswer([7, 7, 7, 7, 7, 7], '我应该停药吗？');
    expect(result.stance).toBe('evidence-required');
    expect(result.verdict).toBe('需要现实证据判断');
  });
  it('generates complete deterministic conclusions for all 4096 casts in both languages', () => {
    for (let n = 0; n < 4096; n++)
      for (const lang of ['zh', 'en'] as const) {
        const values = Array.from({ length: 6 }, (_, i) => 6 + ((n >> (i * 2)) & 3));
        const result = generateDirectAnswer(
          values,
          lang === 'zh' ? '这件事会推进吗？' : 'Will this move forward?',
          lang,
        );
        expect(
          result.verdict &&
            result.answer &&
            result.trajectory &&
            result.turningPoint &&
            result.nextStep,
        ).toBeTruthy();
        expect(result.reasons).toHaveLength(2);
        expect(result.mode).toBe('local-symbolic');
      }
  });
  it('rejects an oversized question and preserves escaped text as data', () => {
    expect(() => generateDirectAnswer([7, 7, 7, 7, 7, 7], 'x'.repeat(301))).toThrow();
    expect(generateDirectAnswer([7, 7, 7, 7, 7, 7], '<img onerror=alert(1)>').question).toBe(
      '<img onerror=alert(1)>',
    );
  });
});
