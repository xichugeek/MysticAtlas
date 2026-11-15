import { describe, expect, it } from 'vitest';
import { generateForecast, FORECAST_VERSION } from '../engines/forecast';
import { FORECAST_PROFILES, getForecastProfile } from '../engines/forecast/profiles';
import { getHexagram } from '../engines/iching';

describe('original bilingual scenario profiles', () => {
  it('covers all 64 IDs exactly once with distinct bilingual actions', () => {
    expect(FORECAST_PROFILES.map((p) => p.id)).toEqual(Array.from({ length: 64 }, (_, i) => i + 1));
    for (const lang of ['zh', 'en'] as const) {
      expect(new Set(FORECAST_PROFILES.map((p) => p[lang][2])).size).toBe(64);
      for (const p of FORECAST_PROFILES) {
        expect(p[lang]).toHaveLength(4);
        expect(p[lang].every((s, i) => s.trim().length >= (i === 0 ? 2 : 6))).toBe(true);
      }
    }
    expect(() => getForecastProfile(65, 'zh')).toThrow();
  });
});
describe('deterministic symbolic forecasting', () => {
  it('uses primary 1, transformed 44 and nuclear 1 in the golden case, not invented dates or scores', () => {
    const f = generateForecast([9, 7, 7, 7, 7, 7], 'zh');
    expect(f.chartIds).toEqual({ primaryId: 1, changedId: 44, nuclearId: 1 });
    expect(f.readings.map((r) => r.motif)).toEqual(['主动开局', '新因素与边界', '主动开局']);
    expect(f.moving).toMatchObject([
      { line: 1, value: 9, transition: '阳 → 阴：从推进转向适度收敛' },
    ]);
    expect(f.moving[0].quote).toBe('初九：潜龙勿用。');
    expect(f.scenarios.map((s) => s.kind)).toEqual(['opening', 'continuity', 'friction']);
    expect(f.recommendations[1].action).toBe('核实一个新出现的因素，暂缓扩大承诺。');
    expect(f.mode).toBe('local-rules');
    expect(f.version).toBe(FORECAST_VERSION);
    expect(f).not.toHaveProperty('probability');
    expect(f).not.toHaveProperty('date');
  });
  it('handles unchanged and fully changing casts explicitly', () => {
    const stable = generateForecast([8, 8, 8, 8, 8, 8]);
    expect(stable.moving).toHaveLength(0);
    expect(stable.readings[1].reading).toContain('不额外假定一次转折');
    expect(stable.recommendations[1].action).toContain('只调整一处');
    const changed = generateForecast([6, 6, 6, 6, 6, 6], 'en');
    expect(changed.chartIds).toEqual({ primaryId: 2, changedId: 1, nuclearId: 2 });
    expect(changed.moving).toHaveLength(6);
    expect(changed.changeSummary).toContain('Several lines move');
    expect(changed.moving.every((m) => m.transition.startsWith('Yin → yang'))).toBe(true);
  });
  it('discloses disputed moving-line source text instead of upgrading it to authority', () => {
    // 37 家人 is 101011, bottom to top. Its fourth line is yin and has a disclosed variant.
    const f = generateForecast([7, 8, 7, 6, 7, 7]);
    expect(f.chartIds.primaryId).toBe(37);
    expect(f.moving[0].line).toBe(4);
    expect(f.moving[0].reviewPending).toBe(true);
  });
  it('covers every one of 4096 inputs with complete, source-consistent scenarios in both languages', () => {
    for (let n = 0; n < 4096; n++) {
      const values = Array.from({ length: 6 }, (_, i) => 6 + ((n >> (i * 2)) & 3));
      for (const lang of ['zh', 'en'] as const) {
        const f = generateForecast(values, lang);
        expect(f.scenarios).toHaveLength(3);
        expect(f.recommendations).toHaveLength(3);
        expect(new Set(f.recommendations.map((a) => a.action)).size).toBe(3);
        expect(f.moving.map((m) => m.line)).toEqual(
          values.flatMap((v, i) => ([6, 9].includes(v) ? [i + 1] : [])),
        );
        expect(f.scenarios.every((s) => s.condition && s.outlook && s.observe && s.reviseIf)).toBe(
          true,
        );
        expect(f.recommendations.every((a) => a.action && a.observe && a.reconsiderIf)).toBe(true);
        for (const c of f.citations) {
          expect(c.quote).toBe(getHexagram(c.hexagramId).judgment);
          expect(c.sourceUrl).toBe(getHexagram(c.hexagramId).source.url);
        }
      }
    }
  });
  it('is reproducible and rejects invalid values', () => {
    expect(generateForecast([7, 8, 9, 6, 7, 8], 'en')).toEqual(
      generateForecast([7, 8, 9, 6, 7, 8], 'en'),
    );
    expect(() => generateForecast([7, 7, 7])).toThrow();
    expect(() => generateForecast(['7', 7, 7, 7, 7, 7])).toThrow();
  });
});
