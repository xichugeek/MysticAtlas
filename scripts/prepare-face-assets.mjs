import { mkdir, copyFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
const destination = new URL('../public/vision/', import.meta.url);
await mkdir(destination, { recursive: true });
for (const name of [
  'vision_wasm_internal.js',
  'vision_wasm_internal.wasm',
  'vision_wasm_nosimd_internal.js',
  'vision_wasm_nosimd_internal.wasm',
]) {
  await copyFile(
    new URL(`../node_modules/@mediapipe/tasks-vision/wasm/${name}`, import.meta.url),
    new URL(name, destination),
  );
}
await build({
  entryPoints: [fileURLToPath(new URL('../src/workers/face.worker.ts', import.meta.url))],
  outfile: fileURLToPath(new URL('face-worker.js', destination)),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'es2022',
  minify: true,
  legalComments: 'linked',
});
await copyFile(
  new URL('../public/face/APACHE-2.0.txt', import.meta.url),
  new URL('APACHE-2.0.txt', destination),
);
console.log('Prepared same-origin face worker and WASM assets.');
