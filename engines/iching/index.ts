import dataset from '../../knowledge/hexagrams.json';

export const ALGORITHM_VERSION = 'iching-coins/1.0.0';
export const DATA_VERSION = 'zhouyi/1.0.0';
export type LineValue = 6 | 7 | 8 | 9;
export type Bit = 0 | 1;
export type Hexagram = (typeof dataset)[number];
export const HEXAGRAMS: readonly Hexagram[] = dataset;
export const TRIGRAMS = [
  { code: '111', name: '乾', nature: '天', english: 'Heaven', pinyin: 'Qian', symbol: '☰' },
  { code: '110', name: '兑', nature: '泽', english: 'Lake', pinyin: 'Dui', symbol: '☱' },
  { code: '101', name: '离', nature: '火', english: 'Fire', pinyin: 'Li', symbol: '☲' },
  { code: '100', name: '震', nature: '雷', english: 'Thunder', pinyin: 'Zhen', symbol: '☳' },
  { code: '011', name: '巽', nature: '风', english: 'Wind', pinyin: 'Xun', symbol: '☴' },
  { code: '010', name: '坎', nature: '水', english: 'Water', pinyin: 'Kan', symbol: '☵' },
  { code: '001', name: '艮', nature: '山', english: 'Mountain', pinyin: 'Gen', symbol: '☶' },
  { code: '000', name: '坤', nature: '地', english: 'Earth', pinyin: 'Kun', symbol: '☷' },
] as const;
const byBits = new Map(dataset.map((h) => [h.bits, h]));
const byPair = new Map(dataset.map((h) => [`${h.upper}/${h.lower}`, h]));

export function trigram(code: string) {
  const found = TRIGRAMS.find((t) => t.code === code);
  if (!found) throw new RangeError('Invalid trigram code');
  return found;
}

export function getHexagram(id: number): Hexagram {
  if (!Number.isInteger(id) || id < 1 || id > 64) throw new RangeError('Invalid hexagram ID');
  return dataset[id - 1];
}

export function fromBits(bits: readonly number[]): Hexagram {
  if (bits.length !== 6 || bits.some((b) => b !== 0 && b !== 1))
    throw new RangeError('Expected six binary lines');
  const result = byBits.get(bits.join(''));
  if (!result) throw new RangeError('Unknown hexagram');
  return result;
}

export function fromPair(upper: string, lower: string): Hexagram {
  const result = byPair.get(`${upper}/${lower}`);
  if (!result) throw new RangeError('Unknown trigram pair');
  return result;
}

export function validateValues(input: unknown): LineValue[] {
  if (
    !Array.isArray(input) ||
    input.length !== 6 ||
    input.some((v) => !Number.isInteger(v) || ![6, 7, 8, 9].includes(v))
  )
    throw new RangeError('Expected six values: 6, 7, 8 or 9, ordered bottom to top');
  return [...input] as LineValue[];
}

export function calculate(input: unknown) {
  const values = validateValues(input);
  const primaryBits = values.map((v) => (v % 2) as Bit);
  const changedBits = values.map((v) => (v === 6 ? 1 : v === 9 ? 0 : v % 2) as Bit);
  const nuclearBits = [
    primaryBits[1],
    primaryBits[2],
    primaryBits[3],
    primaryBits[2],
    primaryBits[3],
    primaryBits[4],
  ];
  return {
    values,
    primaryBits,
    changedBits,
    nuclearBits,
    primary: fromBits(primaryBits),
    changed: fromBits(changedBits),
    nuclear: fromBits(nuclearBits),
    movingLines: values.flatMap((v, i) => (v === 6 || v === 9 ? [i + 1] : [])),
    order: 'bottom-to-top' as const,
    algorithmVersion: ALGORITHM_VERSION,
    dataVersion: DATA_VERSION,
  };
}
export type CastResult = ReturnType<typeof calculate>;

export function sumCoins(coins: readonly number[]): LineValue {
  if (coins.length !== 3 || coins.some((c) => c !== 2 && c !== 3))
    throw new RangeError('Expected three coins, each 2 or 3');
  return coins.reduce((sum, c) => sum + c, 0) as LineValue;
}

export function tossCoins(
  randomBit: () => number = () => {
    if (!globalThis.crypto?.getRandomValues) throw new Error('Web Crypto is unavailable');
    return globalThis.crypto.getRandomValues(new Uint8Array(1))[0] & 1;
  },
) {
  const coins = Array.from({ length: 3 }, () => {
    const bit = randomBit();
    if (bit !== 0 && bit !== 1) throw new RangeError('Random source must return a bit');
    return 2 + bit;
  });
  return { coins, value: sumCoins(coins) };
}
