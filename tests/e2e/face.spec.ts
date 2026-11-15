import { test, expect, type Page } from '@playwright/test';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

async function example(page: Page) {
  await page.goto('/#face');
  await page.getByRole('button', { name: '使用公开示例', exact: true }).click();
  await expect(page.getByTestId('face-status')).toHaveText('检测完成 · 478 个关键点', {
    timeout: 45000,
  });
}
async function png(page: Page, faces = false) {
  return Buffer.from(
    await page.evaluate(async (multiple) => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 400;
      const context = canvas.getContext('2d')!;
      context.fillStyle = '#888';
      context.fillRect(0, 0, 800, 400);
      if (multiple) {
        const image = await createImageBitmap(await (await fetch('/face/example.png')).blob());
        context.drawImage(image, 140, 30, 180, 220, 30, 0, 330, 400);
        context.drawImage(image, 140, 30, 180, 220, 440, 0, 330, 400);
        image.close();
      }
      return Array.from(
        new Uint8Array(
          await (
            await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), 'image/png'))
          ).arrayBuffer(),
        ),
      );
    }, faces),
  );
}
test('real face detector produces ratios, annotations and a private export on both layouts', async ({
  page,
}, info) => {
  test.setTimeout(90000);
  const requests: { url: string; method: string }[] = [];
  const errors: string[] = [];
  page.on('request', (r) => requests.push({ url: r.url(), method: r.method() }));
  page.on('pageerror', (e) => errors.push(e.message));
  await example(page);
  const result = page.getByRole('region', { name: '几何分析结果', exact: true });
  await expect(page.getByTestId('face-metric-0')).toHaveText(/\d+\.\d{2}/);
  await expect(result).toContainText('额部点不是发际线');
  for (let i = 0; i < 6; i++)
    expect(
      Number.isFinite(
        Number.parseFloat((await page.getByTestId(`face-metric-${i}`).textContent())!),
      ),
    ).toBe(true);
  await page.getByLabel('显示关键点', { exact: true }).uncheck();
  await page.getByLabel('显示测量线', { exact: true }).uncheck();
  await page.getByLabel('显示关键点', { exact: true }).check();
  await page.getByLabel('显示测量线', { exact: true }).check();
  await page.getByText('手动标记发际线等参考线', { exact: true }).click();
  await page.getByLabel('手动参考分段', { exact: true }).check();
  for (const [label, value] of [
    ['发际线 (%)', '10'],
    ['眉线 (%)', '30'],
    ['鼻底 (%)', '60'],
    ['下颏 (%)', '90'],
  ])
    await page.getByLabel(label, { exact: true }).fill(value);
  await expect(result).toContainText('37.5%');
  await page.getByLabel('眉线 (%)', { exact: true }).fill('95');
  await expect(page.getByRole('button', { name: '导出几何报告', exact: true })).toBeDisabled();
  await page.getByLabel('眉线 (%)', { exact: true }).fill('30');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: '导出几何报告', exact: true }).click();
  const report = JSON.parse(readFileSync((await (await download).path())!, 'utf8'));
  expect(report.landmarkCount).toBe(478);
  expect(report.manualVerticalPercent).toEqual([25, 37.5, 37.5]);
  expect(Object.keys(report).sort()).toEqual(
    [
      'version',
      'method',
      'dimensions',
      'landmarkCount',
      'metrics',
      'manualVerticalPercent',
      'limitation',
    ].sort(),
  );
  await page.getByLabel('手动参考分段', { exact: true }).uncheck();
  mkdirSync(resolve('output/playwright/face'), { recursive: true });
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    (document.activeElement as HTMLElement)?.blur();
  });
  await page.screenshot({
    path: `output/playwright/face/result-zh-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.getByRole('heading', { name: 'Geometry results', exact: true })).toBeVisible();
  await expect(page.getByTestId('face-status')).toHaveText('Complete · 478 landmarks');
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.setViewportSize(
    info.project.name === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
  );
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    (document.activeElement as HTMLElement)?.blur();
  });
  mkdirSync(resolve('output/playwright/face'), { recursive: true });
  await page.screenshot({
    path: `output/playwright/face/result-${info.project.name}.png`,
    fullPage: true,
  });
  expect(requests.filter((r) => r.method !== 'GET')).toEqual([]);
  expect(requests.filter((r) => new URL(r.url).origin !== new URL(page.url()).origin)).toEqual([]);
  expect(requests.some((r) => r.url.endsWith('.wasm'))).toBe(true);
  expect(requests.some((r) => r.url.endsWith('/face/face_landmarker.task'))).toBe(true);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(['mysticatlas.lang']);
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  expect(await page.evaluate(async () => (await indexedDB.databases()).length)).toBe(0);
  expect(errors).toEqual([]);
  await page.getByRole('button', { name: 'Clear photo and results', exact: true }).click();
  await expect(page.getByTestId('face-canvas')).toHaveCount(0);
  await expect(page.getByTestId('face-metric-0')).toHaveCount(0);
  await expect(page.getByTestId('face-status')).toHaveText('Waiting for a photo');
});
test('real detector rejects empty and multiple-face images and accepts a local upload', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto('/#face');
  const input = page.getByLabel('选择照片', { exact: true });
  await input.setInputFiles({ name: 'blank.png', mimeType: 'image/png', buffer: await png(page) });
  await expect(page.getByRole('alert')).toContainText('没有检测到面部', { timeout: 45000 });
  await input.setInputFiles({
    name: 'two.png',
    mimeType: 'image/png',
    buffer: await png(page, true),
  });
  await expect(page.getByRole('alert')).toContainText('检测到多张面部', { timeout: 45000 });
  await input.setInputFiles(resolve('public/face/example.png'));
  await expect(page.getByTestId('face-status')).toContainText('478', { timeout: 45000 });
  await expect(page.locator('.face-attribution')).toHaveCount(0);
});
test('invalid uploads, model failure/retry and cancellation remain usable', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('/#face');
  const input = page.getByLabel('选择照片', { exact: true });
  await input.setInputFiles({
    name: 'bad.png',
    mimeType: 'image/png',
    buffer: Buffer.from('<svg/>'),
  });
  await expect(page.getByRole('alert')).toContainText('格式正确');
  await input.setInputFiles({
    name: 'large.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(8 * 1024 * 1024 + 1),
  });
  await expect(page.getByRole('alert')).toContainText('超过 8 MiB');
  await page.route('**/face/face_landmarker.task', (r) => r.abort());
  await page.getByRole('button', { name: '使用公开示例', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('本地模型未能运行', { timeout: 45000 });
  await page.unroute('**/face/face_landmarker.task');
  await page.getByRole('button', { name: '重新检测', exact: true }).click();
  await expect(page.getByTestId('face-status')).toContainText('478', { timeout: 45000 });
  await page.getByRole('button', { name: '使用公开示例', exact: true }).click();
  await page.getByRole('button', { name: '清除照片与结果', exact: true }).click();
  await expect(page.getByTestId('face-status')).toHaveText('等待照片');
  await expect(page.getByTestId('face-canvas')).toHaveCount(0);
  await page.getByRole('link', { name: '首页', exact: true }).click();
  await expect(page.locator('.roadmap-grid article').nth(2)).toContainText('当前版本');
  await page
    .locator('.roadmap-grid article')
    .nth(2)
    .getByRole('link', { name: '面相图谱', exact: true })
    .click();
  await expect(page.getByTestId('face-status')).toHaveText('等待照片');
});
