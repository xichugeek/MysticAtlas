import { describe, expect, it } from 'vitest';
import {
  calculate,
  fromBits,
  fromPair,
  getHexagram,
  HEXAGRAMS,
  sumCoins,
  tossCoins,
  trigram,
} from '../engines/iching';
import independent from './fixtures/independent-mapping.json';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import manifest from '../knowledge/sources/manifest.json';

describe('classical mapping and data', () => {
  it('covers 64 unique pairs and exact independent corpus labels', () => {
    expect(HEXAGRAMS).toHaveLength(64);
    expect(independent).toHaveLength(64);
    expect(new Set(HEXAGRAMS.map((h) => h.bits)).size).toBe(64);
    for (const record of independent) {
      const actual = fromPair(record.upper, record.lower);
      expect(actual.id).toBe(record.id);
      expect(actual.bits).toBe(record.lower + record.upper);
      expect(trigram(record.upper).name).toBe(record.upperName);
    }
  });
  it('has six ordered line texts, versioned provenance and two special passages', () => {
    for (const h of HEXAGRAMS) {
      expect(h.lineTexts).toHaveLength(6);
      expect(h.judgment.length).toBeGreaterThan(2);
      expect(h.source.version).toMatch(/^[a-f0-9]{40}$/);
      expect(h.source.license).toContain('MIT');
      expect(h.lineTexts[0]).toMatch(/^初[六九]/);
      expect(h.lineTexts[5]).toMatch(/^上[六九]/);
    }
    expect(getHexagram(1).special).toContain('用九');
    expect(getHexagram(2).special).toContain('用六');
  });
  it('preserves downloaded source hashes', () => {
    for (const [file, expected] of Object.entries(manifest.files)) {
      const bytes = readFileSync(new URL(`../knowledge/sources/${file}`, import.meta.url));
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(expected);
    }
  });
});

describe('deterministic rules', () => {
  it.each([
    [[7, 7, 7, 7, 7, 7], 1, 1, []],
    [[8, 8, 8, 8, 8, 8], 2, 2, []],
    [[6, 6, 6, 6, 6, 6], 2, 1, [1, 2, 3, 4, 5, 6]],
    [[9, 9, 9, 9, 9, 9], 1, 2, [1, 2, 3, 4, 5, 6]],
    [[9, 7, 7, 7, 7, 7], 1, 44, [1]],
    [[6, 8, 8, 8, 8, 8], 2, 24, [1]],
    // Independently hand-derived: 101111 -> 101110 (13 -> 49); nuclear 111111 (1).
    [[7, 8, 7, 7, 7, 9], 13, 49, [6]],
    // 111000 -> 011001 (11 -> 18); nuclear 110100 (54).
    [[9, 7, 7, 8, 8, 6], 11, 18, [1, 6]],
  ])('golden %j', (values, primary, changed, moving) => {
    const result = calculate(values);
    expect(result.primary.id).toBe(primary);
    expect(result.changed.id).toBe(changed);
    expect(result.movingLines).toEqual(moving);
    if (primary === 11) expect(result.nuclear.id).toBe(54);
  });
  it('exhausts all 4096 inputs against independent lookup and truth tables', () => {
    const oracle = new Map(independent.map((h) => [h.lower + h.upper, h.id]));
    const yinYang: Record<number, number> = { 6: 0, 7: 1, 8: 0, 9: 1 };
    const transformed: Record<number, number> = { 6: 1, 7: 1, 8: 0, 9: 0 };
    for (let n = 0; n < 4096; n++) {
      const values = Array.from({ length: 6 }, (_, i) => 6 + ((n >> (i * 2)) & 3));
      const result = calculate(values);
      const bits = values.map((v) => yinYang[v]);
      const next = values.map((v) => transformed[v]);
      const nuclear = [bits[1], bits[2], bits[3], bits[2], bits[3], bits[4]];
      expect(result.primary.id).toBe(oracle.get(bits.join('')));
      expect(result.changed.id).toBe(oracle.get(next.join('')));
      expect(result.nuclear.id).toBe(oracle.get(nuclear.join('')));
      expect(result.values).toEqual(values);
      expect(result.movingLines).toEqual(
        values.flatMap((v, i) => ([6, 9].includes(v) ? [i + 1] : [])),
      );
      next.forEach((b, i) => expect(b !== bits[i]).toBe([6, 9].includes(values[i])));
    }
  });
  it.each([
    null,
    {},
    [],
    [7, 7, 7],
    [7, 7, 7, 7, 7, 7, 7],
    [5, 7, 7, 7, 7, 7],
    ['7', 7, 7, 7, 7, 7],
    [NaN, 7, 7, 7, 7, 7],
    [7.5, 7, 7, 7, 7, 7],
  ])('rejects invalid input %j', (input) => {
    expect(() => calculate(input)).toThrow();
  });
  it('rejects invalid low-level lookups', () => {
    expect(() => fromBits([1, 1])).toThrow();
    expect(() => fromBits([2, 1, 1, 1, 1, 1])).toThrow();
    expect(() => fromPair('xxx', '111')).toThrow();
    expect(() => getHexagram(65)).toThrow();
  });
  it('enumerates eight equally likely coin combinations: 1/3/3/1', () => {
    const counts: Record<number, number> = { 6: 0, 7: 0, 8: 0, 9: 0 };
    for (let n = 0; n < 8; n++) {
      let i = 0;
      const toss = tossCoins(() => (n >> i++) & 1);
      expect(toss.value).toBe(sumCoins(toss.coins));
      counts[toss.value]++;
    }
    expect(counts).toEqual({ 6: 1, 7: 3, 8: 3, 9: 1 });
    expect(() => tossCoins(() => 0.5)).toThrow();
    expect(() => sumCoins([1, 2, 3])).toThrow();
  });
});
