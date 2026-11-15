import { Solar } from 'lunar-typescript';

export const QIMEN_VERSION = 'qimen-zhuanpan-chaibu/1.0.0';
export const CALENDAR_VERSION = 'lunar-typescript/1.8.7';
export const STEMS = '甲乙丙丁戊己庚辛壬癸'.split('');
export const BRANCHES = '子丑寅卯辰巳午未申酉戌亥'.split('');
export const CYCLE = Array.from({ length: 60 }, (_, i) => STEMS[i % 10] + BRANCHES[i % 12]);
export const RING = [1, 8, 3, 4, 9, 2, 7, 6];
export const GRID = [4, 9, 2, 3, 5, 7, 8, 1, 6];
export const INSTRUMENTS = '戊己庚辛壬癸丁丙乙'.split('');
export const DEITIES = ['值符', '腾蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天'];
export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type Dun = 'yang' | 'yin';
export const PALACE: Record<
  number,
  { name: string; direction: string; element: Element; star: string; door: string }
> = {
  1: { name: '坎', direction: 'N', element: 'water', star: '天蓬', door: '休门' },
  2: { name: '坤', direction: 'SW', element: 'earth', star: '天芮', door: '死门' },
  3: { name: '震', direction: 'E', element: 'wood', star: '天冲', door: '伤门' },
  4: { name: '巽', direction: 'SE', element: 'wood', star: '天辅', door: '杜门' },
  5: { name: '中', direction: 'C', element: 'earth', star: '天禽', door: '' },
  6: { name: '乾', direction: 'NW', element: 'metal', star: '天心', door: '开门' },
  7: { name: '兑', direction: 'W', element: 'metal', star: '天柱', door: '惊门' },
  8: { name: '艮', direction: 'NE', element: 'earth', star: '天任', door: '生门' },
  9: { name: '离', direction: 'S', element: 'fire', star: '天英', door: '景门' },
};
export const DOOR_ELEMENT: Record<string, Element> = Object.fromEntries(
  RING.map((id) => [PALACE[id].door, PALACE[id].element]),
);
// Rows are winter-solstice-first; columns are upper/middle/lower yuan.
export const TERMS = [
  '冬至',
  '小寒',
  '大寒',
  '立春',
  '雨水',
  '惊蛰',
  '春分',
  '清明',
  '谷雨',
  '立夏',
  '小满',
  '芒种',
  '夏至',
  '小暑',
  '大暑',
  '立秋',
  '处暑',
  '白露',
  '秋分',
  '寒露',
  '霜降',
  '立冬',
  '小雪',
  '大雪',
];
export const JU_TABLE = [
  [1, 7, 4],
  [2, 8, 5],
  [3, 9, 6],
  [8, 5, 2],
  [9, 6, 3],
  [1, 7, 4],
  [3, 9, 6],
  [4, 1, 7],
  [5, 2, 8],
  [4, 1, 7],
  [5, 2, 8],
  [6, 3, 9],
  [9, 3, 6],
  [8, 2, 5],
  [7, 1, 4],
  [2, 5, 8],
  [1, 4, 7],
  [9, 3, 6],
  [7, 1, 4],
  [6, 9, 3],
  [5, 8, 2],
  [6, 9, 3],
  [5, 8, 2],
  [4, 7, 1],
];
export const VOID_BRANCHES = ['戌亥', '申酉', '午未', '辰巳', '寅卯', '子丑'];
const BRANCH_PALACES = [1, 8, 8, 3, 4, 4, 9, 2, 2, 7, 6, 6];
const mod = (n: number, base: number) => ((n % base) + base) % base;
const lodge = (id: number) => (id === 5 ? 2 : id);
export function generates(a: Element, b: Element) {
  return (
    ['wood', 'fire', 'earth', 'metal', 'water'][
      (['wood', 'fire', 'earth', 'metal', 'water'].indexOf(a) + 1) % 5
    ] === b
  );
}
export function controls(a: Element, b: Element) {
  return (
    ({ wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' } as const)[a] ===
    b
  );
}
export type Palace = {
  id: number;
  earth: string;
  heaven: string[];
  stars: string[];
  door: string;
  deity: string;
  voidBranches: string[];
  horse: boolean;
  doorPressure: boolean;
};
export function buildPlate(dun: Dun, ju: number, hour: string) {
  const hourIndex = CYCLE.indexOf(hour);
  if (!['yang', 'yin'].includes(dun) || !Number.isInteger(ju) || ju < 1 || ju > 9 || hourIndex < 0)
    throw new Error('INVALID_PLATE_INPUT');
  const sign = dun === 'yang' ? 1 : -1;
  const palaces: Palace[] = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    earth: '',
    heaven: [],
    stars: [],
    door: '',
    deity: '',
    voidBranches: [],
    horse: false,
    doorPressure: false,
  }));
  const p = (id: number) => palaces[id - 1];
  INSTRUMENTS.forEach((stem, i) => {
    p(mod(ju - 1 + sign * i, 9) + 1).earth = stem;
  });
  const xunIndex = Math.floor(hourIndex / 10);
  const hiddenStem = INSTRUMENTS[xunIndex];
  const origin = palaces.find((p) => p.earth === hiddenStem)!.id;
  const effectiveOrigin = lodge(origin);
  const hourStem = hour[0] === '甲' ? hiddenStem : hour[0];
  const hourStemPalace = palaces.find((p) => p.earth === hourStem)!.id;
  const chiefPalace = lodge(hourStemPalace);
  const starOffset = mod(RING.indexOf(chiefPalace) - RING.indexOf(effectiveOrigin), 8);
  const rawDoorPalace = mod(origin - 1 + sign * (hourIndex % 10), 9) + 1;
  const doorPalace = lodge(rawDoorPalace);
  const doorOffset = mod(RING.indexOf(doorPalace) - RING.indexOf(effectiveOrigin), 8);
  RING.forEach((source, i) => {
    const target = p(RING[mod(i + starOffset, 8)]);
    target.stars = [PALACE[source].star];
    target.heaven = [p(source).earth];
    if (source === 2) {
      target.stars.push('天禽');
      target.heaven.push(p(5).earth);
    }
    p(RING[mod(i + doorOffset, 8)]).door = PALACE[source].door;
    p(RING[mod(RING.indexOf(chiefPalace) + sign * i, 8)]).deity = DEITIES[i];
  });
  const voids = VOID_BRANCHES[xunIndex].split('');
  const horseBranch = ['寅', '亥', '申', '巳'][BRANCHES.indexOf(hour[1]) % 4];
  for (const palace of palaces) {
    palace.voidBranches = voids.filter((b) => BRANCH_PALACES[BRANCHES.indexOf(b)] === palace.id);
    palace.horse = palace.id === BRANCH_PALACES[BRANCHES.indexOf(horseBranch)];
    palace.doorPressure =
      !!palace.door && controls(DOOR_ELEMENT[palace.door], PALACE[palace.id].element);
  }
  return {
    dun,
    ju,
    hour,
    xun: CYCLE[xunIndex * 10],
    hiddenStem,
    origin,
    effectiveOrigin,
    hourStemPalace,
    chiefStar: origin === 5 ? '天禽' : PALACE[origin].star,
    chiefPalace,
    chiefDoor: PALACE[effectiveOrigin].door,
    doorPalace,
    rawDoorPalace,
    starOffset,
    doorOffset,
    voids,
    horseBranch,
    starPattern: starOffset === 0 ? 'repeated' : starOffset === 4 ? 'opposed' : 'rotated',
    doorPattern: doorOffset === 0 ? 'repeated' : doorOffset === 4 ? 'opposed' : 'rotated',
    palaces,
  };
}
export type QimenInput = { dateTime: string };
export function parseCivilDate(value: string) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(value))
    throw new Error('INVALID_QIMEN_DATE');
  const parts = value.split(/[-T:]/).map(Number);
  const [year, month, day, hour, minute, second = 0] = parts;
  if (
    year < 1901 ||
    year > 2099 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  )
    throw new Error('INVALID_QIMEN_DATE');
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  )
    throw new Error('INVALID_QIMEN_DATE');
  return { year, month, day, hour, minute, second, stamp: date.getTime() };
}
export function calculateQimen(input: QimenInput) {
  const { year, month, day, hour, minute, second, stamp } = parseCivilDate(input.dateTime);
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, second),
    lunar = solar.getLunar();
  const current = lunar.getPrevJieQi(false),
    next = lunar.getNextJieQi(false);
  const term = current.getName();
  const termIndex = TERMS.indexOf(term);
  if (termIndex < 0) throw new Error('UNKNOWN_SOLAR_TERM');
  const dayPillar = lunar.getDayInGanZhiExact();
  const dayIndex = CYCLE.indexOf(dayPillar);
  const headIndex = dayIndex - (dayIndex % 5);
  const head = CYCLE[headIndex];
  const branchIndex = BRANCHES.indexOf(head[1]);
  const yuan = [0, 3, 6, 9].includes(branchIndex) ? 0 : [2, 5, 8, 11].includes(branchIndex) ? 1 : 2;
  const dun: Dun = termIndex < 12 ? 'yang' : 'yin';
  const plate = buildPlate(dun, JU_TABLE[termIndex][yuan], lunar.getTimeInGanZhi());
  const termTime = current.getSolar().toYmdHms();
  const nextTermTime = next.getSolar().toYmdHms();
  // Adjacent terms can belong to 1900/2100 at the supported range edges.
  const termStamp = (value: string) => Date.parse(value.replace(' ', 'T') + 'Z');
  const normalized = solar.toYmdHms().replace(' ', 'T');
  return {
    version: QIMEN_VERSION,
    calendarVersion: CALENDAR_VERSION,
    input: {
      dateTime: normalized,
      timeZone: 'UTC+08:00',
      dayRollover: '23:00',
      method: '转盘拆补',
      center: '中五寄坤二，天禽随天芮；值使按原始旬首宫计数',
    },
    pillars: {
      year: lunar.getYearInGanZhiExact(),
      month: lunar.getMonthInGanZhiExact(),
      day: dayPillar,
      hour: lunar.getTimeInGanZhi(),
    },
    term,
    termTime,
    nextTerm: next.getName(),
    nextTermTime,
    nearTermBoundary:
      Math.min(Math.abs(stamp - termStamp(termTime)), Math.abs(stamp - termStamp(nextTermTime))) <=
      120000,
    yuan,
    head,
    ...plate,
  };
}
export type QimenChart = ReturnType<typeof calculateQimen>;
