import { test, expect, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

async function manual(page: Page, values: number[] = [9, 7, 7, 7, 7, 7]) {
  await page.goto('/#cast');
  await page.getByRole('tab', { name: '手动录入', exact: true }).click();
  for (const v of values) {
    await page.locator(`input[name="line-value"][value="${v}"]`).check();
    await page.getByRole('button', { name: '记录这一爻', exact: true }).click();
  }
  await page.getByRole('link', { name: '查看卦象', exact: true }).click();
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
}

test('local forecasting gives source-based scenarios, actions and moving-line prompts without a POST', async ({
  page,
}, info) => {
  const posts: string[] = [];
  page.on('request', (r) => {
    if (r.method() === 'POST') posts.push(r.url());
  });
  await page.goto('/#cast');
  await page.getByLabel('想推演的主题').fill('PRIVATE_SCENARIO_THEME');
  await manual(page);
  const forecast = page.getByRole('region', { name: '推演预测', exact: true });
  await expect(forecast).toBeVisible();
  await expect(forecast.locator('.forecast-readings article')).toHaveCount(3);
  await expect(forecast.locator('.forecast-readings article').nth(1)).toContainText('新因素与边界');
  await expect(forecast.locator('[data-scenario]')).toHaveCount(3);
  await expect(forecast.locator('.forecast-actions>li')).toHaveCount(3);
  await expect(forecast).toContainText('核实一个新出现的因素，暂缓扩大承诺。');
  await forecast.locator('.forecast-moving summary').click();
  await expect(forecast.locator('.forecast-moving article')).toContainText('初爻 · 9');
  await expect(forecast.locator('.forecast-moving blockquote')).toContainText('潜龙勿用');
  expect(posts).toEqual([]);
  expect(page.url()).not.toContain('PRIVATE');
  await noOverflow(page);
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.querySelectorAll<HTMLElement>('.site-header,.skip-link').forEach((el) => {
      el.hidden = true;
    });
  });
  await forecast.screenshot({
    path: `artifacts/video-evidence/forecast-zh-${info.project.name}.png`,
  });
  await page.evaluate(() =>
    document.querySelectorAll<HTMLElement>('.site-header,.skip-link').forEach((el) => {
      el.hidden = false;
    }),
  );
});

test('unchanged forecasting and English narrow layouts do not invent a turning point', async ({
  page,
}) => {
  await manual(page, [7, 7, 7, 7, 7, 7]);
  const zh = page.getByRole('region', { name: '推演预测', exact: true });
  await expect(zh).toContainText('不额外假定一次转折');
  await zh.locator('.forecast-moving summary').click();
  await expect(zh.locator('.forecast-moving article')).toHaveCount(0);
  await page.getByRole('button', { name: 'Switch to English' }).click();
  const en = page.getByRole('region', { name: 'Predictive scenarios', exact: true });
  await expect(en).toContainText('no reversal is assumed');
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await noOverflow(page);
  }
});

test('MOCK AI forecast renders separately and AI failure preserves the local forecast', async ({
  page,
}) => {
  await manual(page);
  let requestBody: Record<string, unknown> | undefined;
  await page.route('**/api/interpret', async (route) => {
    requestBody = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'success',
        interpretation: {
          primaryId: 1,
          changedId: 44,
          nuclearId: 1,
          summary: 'MOCK_PROVIDER_SUMMARY',
          citations: [{ hexagramId: 1, kind: 'judgment', quote: '乾，元亨利贞。' }],
          context: 'Mock cultural context.',
          questions: ['What changed?', 'What can you check?'],
          limitations: 'Mock only; not a real provider.',
          forecast: {
            trend: 'MOCK_THEME_TREND',
            scenarios: ['opening', 'continuity', 'friction'].map((kind) => ({
              kind,
              condition: 'If the stated conditions hold.',
              outlook: 'Consider a small trial.',
              observe: 'Check an actual response.',
              reviseIf: 'Revise when conditions differ.',
            })),
            recommendations: [
              {
                action: 'MOCK_SMALL_ACTION',
                observe: 'Record actual feedback.',
                reconsiderIf: 'Revise if it does not help.',
              },
              {
                action: 'Ask a clarifying question.',
                observe: 'Look for a clear response.',
                reconsiderIf: 'Reconsider if the premise changes.',
              },
            ],
          },
        },
      }),
    });
  });
  await page.getByRole('button', { name: '请求 AI 推演预测', exact: true }).click();
  await expect(page.getByRole('region', { name: '结合主题的 AI 推演', exact: true })).toContainText(
    'MOCK_THEME_TREND',
  );
  await expect(page.getByRole('region', { name: '推演预测', exact: true })).toBeVisible();
  expect(requestBody?.values).toEqual([9, 7, 7, 7, 7, 7]);
  await noOverflow(page);
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await page.unroute('**/api/interpret');
  await page.route('**/api/interpret', (route) =>
    route.fulfill({
      status: 502,
      contentType: 'application/json',
      body: JSON.stringify({ code: 'INVALID_AI_FORECAST' }),
    }),
  );
  await page.getByRole('button', { name: 'Request an AI forecast', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Local scenarios remain available');
  await expect(
    page.getByRole('region', { name: 'Predictive scenarios', exact: true }),
  ).toBeVisible();
});

test('home and every core page render in both languages without overflow', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '观万象， 见自己。' })).toBeVisible();
  mkdirSync('artifacts/video-evidence', { recursive: true });
  if (info.project.name === 'desktop')
    await page.screenshot({ path: 'artifacts/video-evidence/home-zh-desktop.png', fullPage: true });
  else
    await page.screenshot({ path: 'artifacts/video-evidence/home-zh-mobile.png', fullPage: true });
  for (const route of [
    'home',
    'cast',
    'library',
    'principles',
    'about',
    'history',
    'hexagram/64',
  ]) {
    await page.goto('/#' + route);
    await noOverflow(page);
  }
  await page.getByRole('button', { name: 'Switch to English' }).click();
  for (const route of ['home', 'cast', 'library', 'principles', 'about', 'history', 'hexagram/1']) {
    await page.goto('/#' + route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await noOverflow(page);
  }
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(errors).toEqual([]);
});

test('six incremental Web Crypto casts, animation skip, undo and restart', async ({ page }) => {
  await page.goto('/#cast');
  await page.getByRole('button', { name: '投掷铜钱', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('初爻');
  await expect(page.locator('.cast-progress .hex-row:not(.is-pending)')).toHaveCount(1);
  await page.getByLabel('跳过动画', { exact: true }).check();
  for (let i = 1; i < 6; i++) {
    await page.getByRole('button', { name: '投掷铜钱', exact: true }).click();
    await expect(page.locator('.cast-progress .hex-row:not(.is-pending)')).toHaveCount(i + 1);
  }
  await expect(page.getByRole('link', { name: '查看卦象', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '撤回一爻', exact: true }).click();
  await expect(page.locator('.cast-progress .hex-row:not(.is-pending)')).toHaveCount(5);
  await page.getByRole('button', { name: '投掷铜钱', exact: true }).click();
  await page.getByRole('link', { name: '查看卦象', exact: true }).click();
  await expect(page.locator('.result-diagrams .diagram-card')).toHaveCount(3);
  await noOverflow(page);
  await page.getByRole('link', { name: '重新开始', exact: true }).click();
  await expect(page.locator('.cast-progress .hex-row:not(.is-pending)')).toHaveCount(0);
});

test('manual golden case 乾 → 姤, moving bottom line and nuclear 乾', async ({ page }, info) => {
  await manual(page);
  await expect(page.locator('.diagram-name h2')).toHaveText(['乾', '姤', '乾']);
  await expect(page.locator('.raw-values code')).toHaveText('9 · 7 · 7 · 7 · 7 · 7');
  await expect(page.locator('.result-explainer')).toContainText('初爻');
  await expect(page.locator('.line-texts .highlight')).toContainText('潜龙勿用');
  await expect(page.getByText('AI · OFF', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '请求 AI 推演预测', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('AI 尚未启用');
  await noOverflow(page);
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.screenshot({
    path: `artifacts/video-evidence/result-zh-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(
    page.getByRole('heading', { name: 'The pattern is formed. Take a closer look.' }),
  ).toBeVisible();
  await noOverflow(page);
});

test('manual coin faces produce all old yin then transformed heaven', async ({ page }) => {
  await page.goto('/#cast');
  await page.getByRole('tab', { name: '手动录入', exact: true }).click();
  await page.getByRole('button', { name: '按铜钱录入', exact: true }).click();
  await page.getByRole('button', { name: /铜钱 1: 3/ }).click();
  await page.getByRole('button', { name: /铜钱 3: 3/ }).click();
  await expect(page.locator('.coin-sum')).toHaveText('2 + 2 + 2 = 6');
  for (let i = 0; i < 6; i++)
    await page.getByRole('button', { name: '记录这一爻', exact: true }).click();
  await expect(page.getByRole('button', { name: /铜钱 1: 2/ })).toBeDisabled();
  await page.getByRole('link', { name: '查看卦象', exact: true }).click();
  await expect(page.locator('.diagram-name h2')).toHaveText(['坤', '乾', '坤']);
  await expect(page.locator('.line-texts .highlight')).toHaveCount(6);
});

test('atlas search, upper/lower filters and full source detail', async ({ page }) => {
  await page.goto('/#library');
  await expect(page.locator('.library-grid .hex-card')).toHaveCount(64);
  await page.getByLabel('上卦', { exact: true }).selectOption('111');
  await expect(page.locator('.library-grid .hex-card')).toHaveCount(8);
  await page.getByLabel('下卦', { exact: true }).selectOption('011');
  await expect(page.locator('.library-grid .hex-card')).toHaveCount(1);
  await expect(page.locator('.library-grid')).toContainText('姤');
  await page.locator('.library-grid .hex-card').click();
  await expect(page.locator('h1')).toHaveText('天风姤');
  await expect(page.locator('.line-texts>div')).toHaveCount(6);
  await expect(page.getByRole('link', { name: '查看版本化来源', exact: true })).toHaveAttribute(
    'href',
    /6a32e5f/,
  );
  await page.getByRole('link', { name: '返回知识库', exact: true }).click();
  await page.getByRole('textbox', { name: '搜索卦名、拼音、卦序或经文…' }).fill('不存在的卦');
  await expect(page.locator('.library-grid .hex-card')).toHaveCount(0);
  await page.getByRole('button', { name: '清除筛选', exact: true }).last().click();
  await expect(page.locator('.library-grid .hex-card')).toHaveCount(64);
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await page
    .getByRole('textbox', { name: 'Search name, pinyin, number or classical text…' })
    .fill('Qian');
  await expect(page.locator('.library-grid .hex-card')).toHaveCount(2);
});

test('history is opt-in, exportable, restorable and clearable; theme is omitted by default', async ({
  page,
}, info) => {
  const posts: string[] = [];
  page.on('request', (r) => {
    if (r.method() === 'POST') posts.push(r.url());
  });
  await page.goto('/#cast');
  await page.getByLabel('想推演的主题').fill('PRIVATE_THEME_NEVER_UPLOAD');
  await manual(page);
  expect(await page.evaluate(() => localStorage.getItem('mysticatlas.history.v1'))).toBeNull();
  await page.getByRole('button', { name: '保存到本机', exact: true }).click();
  await expect(page.getByRole('button', { name: '已保存到本机', exact: true })).toBeDisabled();
  expect(await page.evaluate(() => localStorage.getItem('mysticatlas.history.v1'))).not.toContain(
    'PRIVATE_THEME',
  );
  expect(posts).toEqual([]);
  await page.getByRole('link', { name: '本地记录', exact: true }).click();
  await expect(page.locator('.journal-entry')).toHaveCount(1);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出 JSON', exact: true }).click();
  const download = await downloadPromise;
  await download.saveAs(resolve(info.outputPath('journal.json')));
  await page.locator('.journal-entry').click();
  await expect(page.locator('.diagram-name h2')).toHaveText(['乾', '姤', '乾']);
  await page.getByRole('link', { name: '本地记录', exact: true }).click();
  await page.getByRole('button', { name: '清空记录', exact: true }).click();
  await page.getByRole('button', { name: '确认清空', exact: true }).click();
  await expect(page.locator('.journal-entry')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('mysticatlas.history.v1'))).toBeNull();
});

test('reduced motion and keyboard controls complete an English reading', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#cast');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  const toss = page.getByRole('button', { name: 'Toss the coins', exact: true });
  for (let i = 0; i < 6; i++) {
    await toss.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.cast-progress .hex-row:not(.is-pending)')).toHaveCount(i + 1);
  }
  await page.getByRole('link', { name: 'View reading', exact: true }).click();
  await expect(page.locator('.result-diagrams .diagram-card')).toHaveCount(3);
  await noOverflow(page);
  await page.getByRole('button', { name: 'Request an AI forecast', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('AI is not enabled');
});

test('corrupted local storage fails safely and saved HTML is rendered as text', async ({
  page,
}) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('mysticatlas.history.v1', 'invalid json'));
  await page.reload();
  await page.goto('/#history');
  await expect(page.locator('.empty-state')).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem(
      'mysticatlas.history.v1',
      JSON.stringify([
        {
          id: 'safe-test',
          createdAt: '2026-11-15T12:00:00Z',
          values: [7, 7, 7, 7, 7, 7],
          theme: '<img src=x onerror="window.XSS=1">',
        },
      ]),
    ),
  );
  await page.reload();
  await expect(page.locator('.journal-theme')).toContainText('<img');
  expect(await page.evaluate(() => (window as unknown as { XSS?: number }).XSS)).toBeUndefined();
  await expect(page.locator('.journal-theme img')).toHaveCount(0);
});
