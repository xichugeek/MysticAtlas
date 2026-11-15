# Face atlas 1.3.0 · 验收报告

Date: 2026-11-15, Asia/Shanghai. Owner request: “你的面相也没有加进去啊”. This supersedes the previous planned-only face roadmap; Qimen remains planned. Original project requirements are preserved unchanged.

## Delivered behavior

The main navigation and home module card open `/#face`. A local PNG/JPEG/WebP portrait or the attributed public-domain NASA example runs the real MediaPipe Face Landmarker, not simulated points. Results show 478 landmarks, forehead–chin/face width, eye gap/mean eye width, mean eye/face width, nose/face width, mouth/face width, eye-line tilt, and vertical reference segments. Overlay toggles, optional four manually entered reference lines, geometry-only JSON export, clear, error messages and Chinese/English are implemented. The model's forehead point is explicitly not a hairline; manual inputs start empty.

The module contains educational cultural/drawing notes and source links. It does not infer identity, personality, intelligence, health, wealth, marriage or fate, or assign beauty/fortune scores. Geometry is a 2D image projection affected by pose, lens and expression, not physical dimensions or a prediction.

## Actual verification

| Gate                                              | Executed result                                                                                             |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| TypeScript, production build, secret-pattern scan | PASS via `npm run check`; no findings                                                                       |
| Unit/API tests                                    | **85/85 PASS**: existing 77 plus 8 face geometry/file-signature/asset-hash tests                            |
| Full production browser regression                | **32/32 PASS**, real Chromium desktop/mobile emulation, about 1 minute; owned production Node listener 3002 |
| Linux container build                             | PASS with a clean generated-asset path; typecheck, 85 tests, worker/WASM/model packaging and app bundle     |
| Production-container face browser tests           | **6/6 PASS**, 17.4 seconds; isolated Compose project `mysticatlas-face-qa`, loopback 3003                   |
| Container HTTP smoke                              | Seven checks PASS, including expected AI-disabled 503 and 20 concurrent health requests                     |
| Dependency audit                                  | `npm audit --audit-level=high`: **0 vulnerabilities**                                                       |
| Formatting and diff whitespace                    | `npm run format:check`, `git diff --check`: PASS                                                            |

Real detector tests cover the public example and a local file upload, blank/no-face image, two-face image composed from the same public example, invalid signature, oversized file, blocked-model failure followed by successful retry, clear/reset, navigation and empty state. No detector result is mocked. Export tests check numeric results, manually calculated 25/37.5/37.5% segments, invalid ordering, and the exact report field set. The full regression retains I Ching/direct answer/history/AI-mock flows.

Privacy checks observe **GET-only, same-origin requests**, actual local `.wasm` and `.task` downloads, no page errors, no photo data in localStorage/sessionStorage/IndexedDB, and removal of the canvas/measurements on clear. Existing language preference is the only new-context localStorage item. Network failure is injected only to verify recovery; AI test providers remain explicitly mocked in the older suite.

Responsive checks cover English widths 320/390/768/1024/1440px without page overflow, plus Chinese and English desktop/mobile screenshots. This is Chromium emulation, not physical-phone or Safari verification. Browser compatibility/performance, photographic pose and model accuracy limits remain; no population accuracy or demographic fairness claim is made. No live AI call or base-image OS vulnerability scan was performed.

## Reproduction and evidence

```sh
npm ci
npm run check
npm run format:check
npx playwright install chromium
npm run test:e2e
npm audit --audit-level=high
```

For production verification, run the built server on a free local port and set `E2E_BASE_URL` for Playwright; do not replace an existing user service. `npm run dev` and `npm run build` automatically prepare self-hosted runtime assets from the locked package. No model/CDN download occurs at browser runtime outside the application origin.

Screenshots: [Chinese desktop](../artifacts/video-evidence/face-zh-desktop.png), [Chinese mobile](../artifacts/video-evidence/face-zh-mobile.png), [English desktop](../artifacts/video-evidence/face-en-desktop.png), [English mobile](../artifacts/video-evidence/face-en-mobile.png). Genuine browser outputs are also generated in ignored `output/playwright/face/`; test implementation is `tests/e2e/face.spec.ts`. Existing home/result screenshots were refreshed to include the new navigation.

Source files: `src/Face.tsx`, `src/workers/face.worker.ts`, `engines/face/index.ts`, `scripts/prepare-face-assets.mjs`. Exact model/example/license hashes: [assets.json](../public/face/assets.json). Rights: [THIRD_PARTY_NOTICES](../THIRD_PARTY_NOTICES.md), `public/face/NOTICE.txt`, `public/face/APACHE-2.0.txt`. All third-party artifacts retain their original license; no textbook illustrations or modern passages are redistributed.

Source updates continue to the previously authorized GitHub `main` destination. Production domain, DNS/TLS and Forge remain outside this delivery. QA teardown removes only the owned 3002 listener and isolated face QA container/network; the existing user preview on 3000 remains available at `http://localhost:3000/#face`. No proxy or network settings were modified.
