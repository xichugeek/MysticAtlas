import { describe, expect, it } from 'vitest';
import {
  CYCLE,
  DEITIES,
  INSTRUMENTS,
  JU_TABLE,
  PALACE,
  RING,
  TERMS,
  buildPlate,
  calculateQimen,
  controls,
  generates,
  parseCivilDate,
} from '../engines/qimen';
import { TOPICS, exportQimen, qimenReading } from '../engines/qimen/reading';

describe('independent Qimen worked vectors', () => {
  it('matches the published 2026-03-18 15:20 Q1 palace table, not generated expectations', () => {
    // Authored worked example: https://www.guyujian.cn/learn/qimen/07 (Q1).
    const chart = calculateQimen({ dateTime: '2026-03-18T15:20:00' });
    expect(chart.pillars).toEqual({ year: '丙午', month: '辛卯', day: '辛卯', hour: '丙申' });
    expect([chart.term, chart.yuan, chart.head, chart.dun, chart.ju]).toEqual([
      '惊蛰',
      2,
      '己丑',
      'yang',
      4,
    ]);
    expect([
      chart.xun,
      chart.hiddenStem,
      chart.chiefStar,
      chart.chiefPalace,
      chart.chiefDoor,
      chart.doorPalace,
    ]).toEqual(['甲午', '辛', '天柱', 2, '惊门', 9]);
    const expected = [
      ['丁', '壬', '天任', '伤门', '六合'],
      ['丙', '辛', '天柱', '开门', '值符'],
      ['乙', '戊', '天辅', '景门', '玄武'],
      ['戊', '癸', '天英', '死门', '九地'],
      ['己', '', '', '', ''],
      ['庚', '丁', '天蓬', '生门', '太阴'],
      ['辛', '庚', '天心', '休门', '腾蛇'],
      ['壬', '乙', '天冲', '杜门', '白虎'],
      ['癸', '丙己', '天芮天禽', '惊门', '九天'],
    ];
    expect(
      chart.palaces.map((p) => [p.earth, p.heaven.join(''), p.stars.join(''), p.door, p.deity]),
    ).toEqual(expected);
    expect(chart.palaces[3].voidBranches).toEqual(['辰', '巳']);
    expect(chart.palaces[7].horse).toBe(true);
    // Center has only its earth stem; the center heaven stem travels with Tianqin.
  });
  it('matches an independently hand-traced Yin 9 / Yi-chou full plate', () => {
    const chart = buildPlate('yin', 9, '乙丑');
    expect([chart.origin, chart.chiefPalace, chart.doorPalace, chart.starPattern]).toEqual([
      9,
      1,
      8,
      'opposed',
    ]);
    expect(
      chart.palaces.map((p) => [p.earth, p.heaven.join(''), p.stars.join(''), p.door, p.deity]),
    ).toEqual([
      ['乙', '戊', '天英', '杜门', '值符'],
      ['丙', '己', '天任', '休门', '六合'],
      ['丁', '庚', '天柱', '死门', '九地'],
      ['癸', '辛', '天心', '惊门', '玄武'],
      ['壬', '', '', '', ''],
      ['辛', '癸', '天辅', '伤门', '腾蛇'],
      ['庚', '丁', '天冲', '生门', '太阴'],
      ['己', '丙壬', '天芮天禽', '景门', '九天'],
      ['戊', '乙', '天蓬', '开门', '白虎'],
    ]);
    expect(chart.palaces[5].voidBranches).toEqual(['戌', '亥']);
    expect(chart.palaces[5].horse).toBe(true);
    expect(chart.palaces[3].doorPressure).toBe(true);
  });
  it('retains original center 5 for chief-door counting before lodging', () => {
    const a = buildPlate('yang', 5, '甲子'),
      b = buildPlate('yang', 5, '乙丑');
    expect([
      a.origin,
      a.effectiveOrigin,
      a.chiefStar,
      a.chiefPalace,
      a.rawDoorPalace,
      a.doorPalace,
    ]).toEqual([5, 2, '天禽', 2, 5, 2]);
    expect([b.origin, b.chiefPalace, b.rawDoorPalace, b.doorPalace, b.chiefDoor]).toEqual([
      5,
      4,
      6,
      6,
      '死门',
    ]);
    expect(b.palaces[3].stars).toEqual(['天芮', '天禽']);
    // Yang 1 / Ding-mao: instrument Wu starts in 1, 3 steps land on 4.
    expect(buildPlate('yang', 1, '丁卯').rawDoorPalace).toBe(4);
  });
});
describe('calendar and boundary conventions', () => {
  it('agrees within one minute with the 12 major terms in HKO 2026 SolarTerms24', () => {
    // Official UTC+8 minute-level table: https://www.hko.gov.hk/tc/gts/astron2026/files/2026SolarTerms24.pdf
    const terms = [
      ['大寒', '01-20T09:45'],
      ['雨水', '02-18T23:52'],
      ['春分', '03-20T22:46'],
      ['谷雨', '04-20T09:39'],
      ['小满', '05-21T08:37'],
      ['夏至', '06-21T16:25'],
      ['大暑', '07-23T03:13'],
      ['处暑', '08-23T10:19'],
      ['秋分', '09-23T08:05'],
      ['霜降', '10-23T17:38'],
      ['小雪', '11-22T15:23'],
      ['冬至', '12-22T04:50'],
    ];
    for (const [term, time] of terms) {
      const stamp = Date.parse('2026-' + time + ':00Z');
      const probe = new Date(stamp + 120000).toISOString().slice(0, 19);
      const chart = calculateQimen({ dateTime: probe });
      expect(chart.term).toBe(term);
      expect(
        Math.abs(Date.parse(chart.termTime.replace(' ', 'T') + 'Z') - stamp),
      ).toBeLessThanOrEqual(60000);
    }
  });
  it('uses the library instant, including the exact equality, to switch summer/winter Dun', () => {
    expect(calculateQimen({ dateTime: '2026-06-21T16:24:29' }).dun).toBe('yang');
    const after = calculateQimen({ dateTime: '2026-06-21T16:24:30' });
    expect(after.term).toBe('夏至');
    expect(after.dun).toBe('yin');
    expect(after.nearTermBoundary).toBe(true);
    expect(calculateQimen({ dateTime: '2026-12-22T04:50:13' }).dun).toBe('yin');
    expect(calculateQimen({ dateTime: '2026-12-22T04:50:14' }).dun).toBe('yang');
  });
  it('changes day at 23:00 consistently with the hour pillar, and year/month at Lichun', () => {
    const at = (dateTime: string) => calculateQimen({ dateTime }).pillars;
    expect(at('2026-03-18T22:59:59').day).toBe('辛卯');
    expect(at('2026-03-18T23:00:00')).toMatchObject({ day: '壬辰', hour: '庚子' });
    expect(at('2026-03-19T00:00:00')).toMatchObject({ day: '壬辰', hour: '庚子' });
    expect(at('2026-03-19T01:00:00').hour).toBe('辛丑');
    expect(at('2026-02-04T04:02:07')).toMatchObject({ year: '乙巳', month: '己丑' });
    expect(at('2026-02-04T04:02:08')).toMatchObject({ year: '丙午', month: '庚寅' });
    // HKO May calendar explicitly gives Ji-mao for 5 May 2026.
    expect(at('2026-05-05T12:00:00').day).toBe('己卯');
  });
  it('finds upper/middle/lower yuan from each 5-day head and has all 24 term rows', () => {
    expect(TERMS).toHaveLength(24);
    expect(new Set(TERMS).size).toBe(24);
    expect(JU_TABLE).toHaveLength(24);
    expect(JU_TABLE.flat().every((v) => v >= 1 && v <= 9)).toBe(true);
    const yuanByHead: Record<string, number> = {
      甲子: 0,
      己巳: 1,
      甲戌: 2,
      己卯: 0,
      甲申: 1,
      己丑: 2,
      甲午: 0,
      己亥: 1,
      甲辰: 2,
      己酉: 0,
      甲寅: 1,
      己未: 2,
    };
    for (let day = 1; day <= 60; day++) {
      const stamp = new Date(Date.UTC(2026, 0, day, 12)).toISOString().slice(0, 19),
        chart = calculateQimen({ dateTime: stamp });
      expect(chart.yuan).toBe(yuanByHead[chart.head]);
    }
  });
  it('rejects invalid dates, offsets, overflow, nonfinite plate values and unsupported range', () => {
    for (const value of [
      '2026-02-29T12:00',
      '2026-04-31T12:00',
      '2026-13-01T12:00',
      '2026-01-01T24:00',
      '2026-01-01T00:60',
      '2026-01-01T00:00:60',
      '2026-01-01T00:00Z',
      '2026-01-01T00:00+08:00',
      '1900-12-31T12:00',
      '2100-01-01T12:00',
      '',
      null,
    ])
      expect(() => parseCivilDate(value as string)).toThrow();
    expect(() => buildPlate('yang', NaN, '甲子')).toThrow();
    expect(() => buildPlate('yin', 10, '甲子')).toThrow();
    expect(() => buildPlate('yang', 1, '甲丑')).toThrow();
    for (const dateTime of ['1901-01-01T00:00:00', '2099-12-31T23:59:59', '2024-02-29T12:00:00'])
      expect(calculateQimen({ dateTime }).palaces).toHaveLength(9);
  });
});
describe('all 18 configurations × 60 hour pillars', () => {
  it('preserves unique earth/heaven stems, stars, doors, deities and correct leader anchors', () => {
    for (const dun of ['yang', 'yin'] as const)
      for (let ju = 1; ju <= 9; ju++)
        for (const hour of CYCLE) {
          const c = buildPlate(dun, ju, hour),
            outer = c.palaces.filter((p) => p.id !== 5);
          expect(c.palaces.map((p) => p.earth).sort()).toEqual([...INSTRUMENTS].sort());
          expect(outer.flatMap((p) => p.heaven).sort()).toEqual([...INSTRUMENTS].sort());
          expect(outer.flatMap((p) => p.stars).sort()).toEqual(
            Object.values(PALACE)
              .map((p) => p.star)
              .sort(),
          );
          expect(outer.map((p) => p.door).sort()).toEqual(RING.map((id) => PALACE[id].door).sort());
          expect(outer.map((p) => p.deity).sort()).toEqual([...DEITIES].sort());
          expect(c.palaces[c.chiefPalace - 1].stars).toContain(c.chiefStar);
          expect(c.palaces[c.doorPalace - 1].door).toBe(c.chiefDoor);
          expect(c.palaces[c.chiefPalace - 1].deity).toBe('值符');
          expect(outer.filter((p) => p.horse)).toHaveLength(1);
          expect(c.palaces[4].heaven).toEqual([]);
          if (hour[0] === '甲') expect(c.starPattern).toBe('repeated');
        }
  });
  it('distinguishes generation from control and door pressure from palace control', () => {
    expect(generates('wood', 'fire')).toBe(true);
    expect(generates('water', 'wood')).toBe(true);
    expect(controls('metal', 'wood')).toBe(true);
    expect(controls('wood', 'metal')).toBe(false);
    const c = calculateQimen({ dateTime: '2026-03-18T15:20' });
    expect(c.palaces[7].doorPressure).toBe(true);
    expect(c.palaces[5].doorPressure).toBe(false);
  });
});
describe('actual chart-based symbolic results', () => {
  it('gives specific conclusions and evidence for every topic in both languages', () => {
    const c = calculateQimen({ dateTime: '2026-03-18T15:20' });
    for (const topic of TOPICS)
      for (const lang of ['zh', 'en'] as const) {
        const r = qimenReading(c, topic, lang);
        expect(r.verdict.length).toBeGreaterThan(5);
        expect(r.answer.length).toBeGreaterThan(25);
        expect(r.evidence.length).toBeGreaterThanOrEqual(3);
        expect(r.scenarios).toHaveLength(3);
        expect(RING).toContain(r.selfPalace);
        expect(RING).toContain(r.targetPalace);
        expect(r.action.length).toBeGreaterThan(15);
      }
    expect(qimenReading(c, 'general').kind).toBe('friction');
    expect(qimenReading(c, 'career')).toMatchObject({ targetPalace: 2, kind: 'opening' });
    expect(qimenReading(c, 'study').targetPalace).toBe(3);
    expect(qimenReading(c, 'cooperation').targetPalace).toBe(1);
    expect(() => qimenReading(c, 'fake' as never)).toThrow();
  });
  it('keeps question out of exports unless explicitly provided, and caps opt-in text', () => {
    const c = calculateQimen({ dateTime: '2026-03-18T15:20' });
    expect(exportQimen(c, 'general', 'zh')).not.toHaveProperty('question');
    expect(exportQimen(c, 'general', 'zh', ' PRIVATE ')).toHaveProperty('question', 'PRIVATE');
    expect(exportQimen(c, 'general', 'zh', 'a'.repeat(301)).question).toHaveLength(300);
  });
});
