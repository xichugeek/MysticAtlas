import { test, expect, type Page } from '@playwright/test';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

async function sample(page: Page) {
  await page.goto('/#qimen');
  await page.getByRole('button', { name: '使用核验示例', exact: true }).click();
  await expect(page.getByTestId('qimen-ju')).toHaveText('阳遁 4 局');
}
async function exported(page: Page, name = '导出排盘与推演') {
  const next = page.waitForEvent('download');
  await page.getByRole('button', { name, exact: true }).click();
  return JSON.parse(readFileSync((await (await next).path())!, 'utf8'));
}
test('actual chart opens a first-screen verdict, full layers, palace details and trace', async ({
  page,
}, info) => {
  const requests: { url: string; method: string }[] = [];
  const errors: string[] = [];
  page.on('request', (r) => requests.push({ url: r.url(), method: r.method() }));
  page.on('pageerror', (e) => errors.push(e.message));
  await sample(page);
  await expect(page.getByRole('region', { name: '奇门推演结果', exact: true })).toBeVisible();
  await expect(page.getByTestId('qimen-verdict')).toHaveText('存在阻力，宜调整路径');
  const verdict = await page.getByTestId('qimen-verdict').boundingBox();
  expect(verdict!.y).toBeGreaterThanOrEqual(0);
  expect(verdict!.y).toBeLessThan(page.viewportSize()!.height);
  await expect(page.getByTestId('qimen-pillar-day')).toHaveText('辛卯');
  await expect(page.getByTestId('qimen-pillar-hour')).toHaveText('丙申');
  await expect(page.locator('.qimen-palace')).toHaveCount(9);
  await expect(page.locator('.qimen-palace').first()).toHaveAttribute(
    'data-testid',
    'qimen-palace-4',
  );
  await expect(page.getByTestId('qimen-palace-2')).toContainText('天柱');
  await expect(page.getByTestId('qimen-palace-2')).toContainText('开门');
  await expect(page.getByTestId('qimen-palace-9')).toContainText('天禽');
  await expect(page.getByTestId('qimen-palace-9')).toContainText('惊门');
  await page.getByTestId('qimen-palace-4').click();
  await expect(page.getByRole('complementary', { name: '宫位明细' })).toContainText('辰、巳');
  await page.getByTestId('qimen-palace-5').click();
  await expect(page.getByRole('complementary', { name: '宫位明细' })).toContainText('己');
  await page.getByText('排盘过程与规则', { exact: true }).click();
  await expect(page.locator('.qimen-rules')).toContainText('原宫 7 / 寄宫 7');
  await expect(page.locator('.qimen-scenarios article')).toHaveCount(3);
  const file = await exported(page);
  expect(file.chart.chiefPalace).toBe(2);
  expect(file).not.toHaveProperty('question');
  await page.getByTestId('qimen-palace-9').click();
  mkdirSync(resolve('output/playwright/qimen'), { recursive: true });
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.screenshot({
    path: `output/playwright/qimen/result-zh-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.getByTestId('qimen-verdict')).toHaveText('Friction; revise the approach');
  await expect(page.getByTestId('qimen-palace-2')).toContainText('Tianzhu');
  for (const width of [320, 390, 768, 900, 1024, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.setViewportSize(
    info.project.name === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
  );
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.screenshot({
    path: `output/playwright/qimen/result-en-${info.project.name}.png`,
    fullPage: true,
  });
  expect(requests.filter((r) => r.method !== 'GET')).toEqual([]);
  expect(requests.filter((r) => new URL(r.url).origin !== new URL(page.url()).origin)).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(['mysticatlas.lang']);
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  expect(errors).toEqual([]);
});
test('selected topic changes actual conclusion, question stays private, export is opt-in', async ({
  page,
}) => {
  await sample(page);
  await page.getByLabel('推演事项', { exact: true }).selectOption('career');
  await expect(page.getByTestId('qimen-verdict')).toHaveCount(0);
  const question = '<img src=x onerror="window.QIMEN_XSS=1"> PRIVATE_QIMEN_QUESTION';
  await page.getByLabel('想推演的问题（选填）', { exact: true }).fill(question);
  await page.getByRole('button', { name: '排盘并查看推演', exact: true }).click();
  await expect(page.getByTestId('qimen-verdict')).toHaveText('有条件可推，先做小试');
  await expect(page.locator('.qimen-result-question')).toHaveText(question);
  await expect(page.locator('.qimen-result-question img')).toHaveCount(0);
  expect(
    await page.evaluate(() => (window as unknown as { QIMEN_XSS?: number }).QIMEN_XSS),
  ).toBeUndefined();
  const clean = await exported(page);
  expect(JSON.stringify(clean)).not.toContain('PRIVATE_QIMEN_QUESTION');
  await page.getByLabel('导出时包含问题正文', { exact: true }).check();
  expect((await exported(page)).question).toBe(question);
  expect(page.url()).not.toContain('PRIVATE');
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('PRIVATE');
  await page.getByRole('button', { name: '清空结果', exact: true }).click();
  await expect(page.getByTestId('qimen-verdict')).toHaveCount(0);
  await expect(page.getByLabel('想推演的问题（选填）', { exact: true })).toHaveValue('');
});
test('real time inputs cross solstice/day boundaries and invalid dates never leave stale results', async ({
  page,
}) => {
  await page.goto('/#qimen');
  const input = page.getByLabel('起局时间（北京时间 UTC+8）', { exact: true });
  const submit = page.getByRole('button', { name: '排盘并查看推演', exact: true });
  for (const [time, label] of [
    ['2026-06-21T16:24:29', '阳遁 6 局'],
    ['2026-06-21T16:24:30', '阴遁 9 局'],
  ]) {
    await input.fill(time);
    await submit.click();
    await expect(page.getByTestId('qimen-ju')).toHaveText(label);
    await expect(page.getByText(/接近交节时刻/)).toBeVisible();
  }
  await input.fill('2026-03-18T23:00:00');
  await submit.click();
  await expect(page.getByTestId('qimen-pillar-day')).toHaveText('壬辰');
  await expect(page.getByTestId('qimen-pillar-hour')).toHaveText('庚子');
  await input.fill('2100-01-01T12:00:00');
  await submit.click();
  await expect(page.getByTestId('qimen-verdict')).toHaveCount(0);
  await page.getByRole('button', { name: '填入当前时间', exact: true }).click();
  await expect(input).not.toHaveValue('2100-01-01T12:00');
  await page.getByRole('link', { name: '首页', exact: true }).click();
  await expect(page.locator('.roadmap-grid article').nth(1)).toContainText('当前版本');
  await page
    .locator('.roadmap-grid article')
    .nth(1)
    .getByRole('link', { name: '奇门遁甲', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: '奇门遁甲 · 九宫推演', exact: true }),
  ).toBeVisible();
});
