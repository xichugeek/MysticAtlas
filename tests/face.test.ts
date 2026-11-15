import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import {
  faceReport,
  measureFace,
  validImageHeader,
  verticalShares,
  type Point,
} from '../engines/face';
import assets from '../public/face/assets.json';

function portrait(): Point[] {
  const points = Array.from({ length: 478 }, () => ({ x: 0.5, y: 0.5 }));
  for (const [id, x, y] of [
    [10, 0.5, 0.1],
    [152, 0.5, 0.9],
    [234, 0.2, 0.5],
    [454, 0.8, 0.5],
    [9, 0.5, 0.35],
    [2, 0.5, 0.6],
    [33, 0.32, 0.36],
    [133, 0.42, 0.36],
    [362, 0.58, 0.36],
    [263, 0.68, 0.36],
    [98, 0.45, 0.6],
    [327, 0.55, 0.6],
    [61, 0.4, 0.72],
    [291, 0.6, 0.72],
  ])
    points[id] = { x, y };
  return points;
}
describe('face geometry in image pixels', () => {
  it('computes hand-checked distances and vertical shares', () => {
    const m = measureFace(portrait(), 600, 600);
    expect(m.heightToWidth).toBeCloseTo(4 / 3);
    expect(m.eyeGapToEye).toBeCloseTo(1.6);
    expect(m.eyeToWidth).toBeCloseTo(1 / 6);
    expect(m.noseToWidth).toBeCloseTo(1 / 6);
    expect(m.mouthToWidth).toBeCloseTo(1 / 3);
    expect(m.eyeTilt).toBeCloseTo(0);
    expect(m.vertical).toEqual([31.25, 31.25, 37.5]);
    expect(m.warnings).toEqual([]);
  });
  it('preserves ratios under uniform resize and uses actual aspect ratio', () => {
    const a = measureFace(portrait(), 600, 600);
    expect(measureFace(portrait(), 1200, 1200)).toEqual(a);
    expect(measureFace(portrait(), 600, 900).heightToWidth).toBeCloseTo(2);
  });
  it('preserves lengths and projected shares under an in-plane rotation', () => {
    const angle = Math.PI / 12;
    const rotated = portrait().map(({ x, y }) => ({
      x: 0.5 + (x - 0.5) * Math.cos(angle) - (y - 0.5) * Math.sin(angle),
      y: 0.5 + (x - 0.5) * Math.sin(angle) + (y - 0.5) * Math.cos(angle),
    }));
    const m = measureFace(rotated, 600, 600);
    expect(m.heightToWidth).toBeCloseTo(4 / 3);
    expect(m.eyeTilt).toBeCloseTo(15);
    expect(m.vertical[0]).toBeCloseTo(31.25);
    expect(m.warnings).toContain('tilted');
  });
  it('rejects missing, nonfinite and degenerate landmarks', () => {
    expect(() => measureFace([], 600, 600)).toThrow('INVALID_GEOMETRY');
    const p = portrait();
    p[9].y = NaN;
    expect(() => measureFace(p, 600, 600)).toThrow('INVALID_GEOMETRY');
    expect(() =>
      measureFace(
        Array.from({ length: 478 }, () => ({ x: 0.5, y: 0.5 })),
        600,
        600,
      ),
    ).toThrow();
    expect(() => measureFace(portrait(), 0, 600)).toThrow();
  });
  it('validates manual references and computes actual shares without an ideal score', () => {
    expect(verticalShares([10, 30, 60, 90])).toEqual([25, 37.5, 37.5]);
    for (const p of [
      [0, 30, 30, 100],
      [-1, 30, 60, 100],
      [0, 30, 60, 101],
      [0, NaN, 60, 100],
      [0, 50, 100],
    ])
      expect(() => verticalShares(p)).toThrow();
  });
  it('exports measurements without photo, name or raw landmarks', () => {
    const report = faceReport(measureFace(portrait(), 600, 600), 600, 600, [10, 30, 60, 90]);
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
    expect(JSON.stringify(report)).not.toMatch(/data:image|filename|"points"|"x"|"y"/);
  });
});
describe('pinned local face assets', () => {
  it('matches every checked-in asset size and SHA-256', () => {
    for (const [name, meta] of Object.entries(assets)) {
      const bytes = readFileSync(new URL(`../public/face/${name}`, import.meta.url));
      expect(bytes.length).toBe(meta.bytes);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(meta.sha256);
    }
  });
  it('accepts only the three supported MIME/signature pairs', () => {
    expect(
      validImageHeader(
        readFileSync(new URL('../public/face/example.png', import.meta.url)).subarray(0, 12),
        'image/png',
      ),
    ).toBe(true);
    expect(validImageHeader(new Uint8Array([255, 216, 255]), 'image/jpeg')).toBe(true);
    expect(validImageHeader(new TextEncoder().encode('RIFF0000WEBP'), 'image/webp')).toBe(true);
    expect(validImageHeader(new TextEncoder().encode('<svg>'), 'image/png')).toBe(false);
    expect(validImageHeader(new Uint8Array([255, 216, 255]), 'image/svg+xml')).toBe(false);
  });
});
