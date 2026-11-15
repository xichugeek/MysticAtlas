// Exercises the actual running production service without personal data or a model key.
const base = process.argv[2] || 'http://127.0.0.1:3000';
const checks = [];
async function check(name, path, init, verify) {
  const r = await fetch(base + path, init);
  const body = await r.json();
  if (!verify(r, body)) throw Error(`${name} failed: HTTP ${r.status}`);
  checks.push({ name, status: 'PASS', http: r.status });
}
await check('health', '/api/health', undefined, (r, b) => r.ok && b.status === 'ok');
await check('64 records', '/api/hexagrams', undefined, (r, b) => r.ok && b.hexagrams.length === 64);
const init = (values) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ values }),
});
await check(
  'golden Qian to Gou',
  '/api/calculate',
  init([9, 7, 7, 7, 7, 7]),
  (r, b) => r.ok && b.primary.id === 1 && b.changed.id === 44 && b.nuclear.id === 1,
);
await check(
  'reject invalid values',
  '/api/calculate',
  init([5, 7, 7, 7, 7, 7]),
  (r) => r.status === 400,
);
await check(
  'local conditional forecast',
  '/api/forecast',
  init([9, 7, 7, 7, 7, 7]),
  (r, b) =>
    r.ok &&
    b.forecast.mode === 'local-rules' &&
    b.forecast.chartIds.primaryId === 1 &&
    b.forecast.chartIds.changedId === 44 &&
    b.forecast.scenarios.length === 3 &&
    b.forecast.recommendations.length === 3,
);
await check(
  'AI disabled fallback',
  '/api/interpret',
  init([7, 7, 7, 7, 7, 7]),
  (r, b) =>
    r.status === 503 && b.code === 'AI_DISABLED' && b.chart.primary.id === 1 && !b.interpretation,
);
await check(
  'Qimen chart and topic reading',
  '/api/qimen',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dateTime: '2026-03-18T15:20:00', topic: 'career', lang: 'en' }),
  },
  (r, b) =>
    r.ok &&
    b.chart.ju === 4 &&
    b.chart.chiefPalace === 2 &&
    b.chart.doorPalace === 9 &&
    b.reading.kind === 'opening',
);
const started = performance.now();
const results = await Promise.all(
  Array.from({ length: 20 }, () => fetch(base + '/api/health').then((r) => r.ok)),
);
if (results.some((r) => !r)) throw Error('Concurrent health check failed');
checks.push({
  name: '20 concurrent health requests',
  status: 'PASS',
  elapsedMs: Math.round(performance.now() - started),
});
console.log(
  JSON.stringify(
    { base, checks, mode: 'real HTTP; AI disabled; local diagnostic timing only' },
    null,
    2,
  ),
);
