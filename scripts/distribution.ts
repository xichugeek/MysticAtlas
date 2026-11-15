import { tossCoins } from '../engines/iching';
const trials = 100_000;
const counts: Record<number, number> = { 6: 0, 7: 0, 8: 0, 9: 0 };
for (let i = 0; i < trials; i++) counts[tossCoins().value]++;
console.log(
  JSON.stringify(
    {
      trials,
      source: 'Node Web Crypto; diagnostic only, no statistical CI gate',
      counts,
      proportions: Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, v / trials])),
    },
    null,
    2,
  ),
);
