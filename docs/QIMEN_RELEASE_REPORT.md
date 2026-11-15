# Qimen Dunjia 1.4.0 · 验收报告

Date: 2026-11-15, Asia/Shanghai. Owner explicitly requested real Qimen charts, inference results and a GitHub update. This supersedes the planned-only Qimen scope; production/DNS/Forge remain outside the request.

## Delivered behavior

Open **奇门遁甲 / Qimen** in the main navigation or `/#qimen`. Enter a valid China civil datetime (1901–2099), choose a topic and calculate. The first result is an explicit symbolic conclusion, not a chart-only screen. It includes actual palace evidence, three conditional scenarios, an action and revision conditions. Changing input removes stale results. No AI key or network prediction service is required.

The real shared engine implements hourly rotating-plate Chaibu, fixed UTC+8, 23:00 day rollover and declared center lodging. It displays four pillars, solar term/yuan/Ju, Xun leader/hidden instrument, chief star/door, the nine palaces, earth/heaven stems, stars, doors, deities, hourly void branches, hour-branch horse and door pressure. Select a palace for details, inspect the calculation trace, export JSON or clear. Chinese/English and responsive layouts are implemented. Exact conventions, reading priorities and unimplemented schools/layers are documented in [QIMEN_RULES](QIMEN_RULES.md).

## Reproducible worked result

Use the verified example: **2026-03-18 15:20:00 UTC+8**. Actual output: 丙午/辛卯/辛卯/丙申, 惊蛰下元, 阳遁四局, 己丑符头, 甲午旬遁辛, **天柱值符落坤二、惊门值使落离九**. Hourly void 辰巳 in palace 4, horse 寅 in palace 8. The palace facts match an independently authored published Q1 table; its different configuration method happens to yield the same configuration here, as explicitly documented.

General topic uses the chief door in palace 9 and returns **存在阻力，宜调整路径**. Work topic uses Open door in palace 2, the same palace as the day-stem reference, and returns **有条件可推，先做小试**. These are actual deterministic outputs under the stated priority rules, not factual predictions about a real event. Question text is displayed but not semantically analyzed; topic selection determines the references. No accuracy rates, amounts or event dates are invented.

## Executed verification

| Gate                                              | Actual result                                                                                                                                                           |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript, production build, secret-pattern scan | PASS via `npm run check`; no secret findings                                                                                                                            |
| Unit/API suite                                    | **99/99 PASS**: baseline 85 + 12 Qimen/calendar/reading tests + 2 API tests                                                                                             |
| Full production-container browser regression      | **38/38 PASS**, about 1.2 minutes; real Chromium desktop/mobile emulation, strict production CSP                                                                        |
| Qimen browser flows                               | Six new desktop/mobile cases: direct result, real full chart, selected-palace details, trace, changing topic, private question/export, clear, boundaries and validation |
| Structural coverage                               | All **18 Ju × 60 hour pillars = 1080** plates checked for unique/complete stems, stars, doors, deities and chief anchors                                                |
| Independent vectors                               | Published full Q1 palace facts; hand-derived complete Yin 9 / Yi-chou plate; center-origin original-vs-lodged counting cases                                            |
| Calendar samples                                  | 12 HKO 2026 major terms within 60 seconds of minute-level table; HKO May 5 Ji-mao; solstice/Lichun/day/hour/leap-day/range edges                                        |
| Linux build and runtime                           | Real Docker build: typecheck, 99 tests, app/face-worker/calendar bundle; isolated `mysticatlas-qimen-qa` on 3003 healthy                                                |
| Actual HTTP smoke                                 | Eight checks PASS, including Qimen result, expected AI-off 503 and 20 concurrent health requests                                                                        |
| Dependency audit                                  | `npm audit --audit-level=high`: **0 vulnerabilities**                                                                                                                   |
| Formatting/whitespace                             | `npm run format:check`, `git diff --check`: PASS                                                                                                                        |

The new browser suite initially exposed a select-label locator problem: implicit label text included option text. Explicit accessible labels were added to the topic select and question textarea, then all six cases passed. A prematurely overlapping retry also conflicted with the previous test reporter's temporary artifacts; final full verification ran as a single suite, with no retries or suppressed failures. Screenshot capture was corrected to return to page top before full-page output so sticky navigation does not obscure content; chart contents were not edited.

Qimen browser checks observe GET-only same-origin requests, no new persistent storage beyond the existing language preference, safe text rendering of synthetic HTML, no question in URL/localStorage/default export, and explicit question inclusion only after checking the export option. Mobile/English widths 320/390/768/900/1024/1440px have no page overflow; navigation is horizontally scrollable on narrow screens. First-screen verdict visibility is asserted on both layouts.

All implemented modules were covered by the final container suite, including the actual face detector. Earlier AI-adapter success remains mock-only. No physical-phone, Safari, live AI, full-range observatory certification, empirical prediction study or base-image OS CVE scan is claimed. Solar-term seconds are calculated estimates; other school/time conventions can differ.

## Sources, evidence and operation

The final packaged image was restarted, returned healthy, and passed all eight HTTP checks again. Actual post-restart output is retained in [qimen-container-smoke.json](../artifacts/video-evidence/qimen-container-smoke.json). The production license file's SHA-256 matched the upstream notice. Later documentation/license-only packaging kept the tested application JavaScript/CSS bundle hashes unchanged.

- Engine: `engines/qimen/index.ts`, `engines/qimen/reading.ts`; UI: `src/Qimen.tsx`, `src/qimen-copy.ts`, `src/qimen.css`.
- Tests: `tests/qimen.test.ts`, `tests/api.test.ts`, `tests/e2e/qimen.spec.ts`. Reproduce with `npm ci`, `npm run check`, `npx playwright install chromium`, `npm run test:e2e`. For production QA, build/start on a free owned port and set `E2E_BASE_URL`.
- Screenshots: [Chinese desktop](../artifacts/video-evidence/qimen-zh-desktop.png), [Chinese mobile](../artifacts/video-evidence/qimen-zh-mobile.png), [English desktop](../artifacts/video-evidence/qimen-en-desktop.png), [English mobile](../artifacts/video-evidence/qimen-en-mobile.png). Genuine originals are generated in ignored `output/playwright/qimen/`; existing home/result captures were refreshed with the new navigation.
- Sources and license: [SOURCES](SOURCES.md), [THIRD_PARTY_NOTICES](../THIRD_PARTY_NOTICES.md). Locked calendar dependency is MIT; the full notice is included in `public/licenses/` and checked through the production HTTP service. Modern tutorial prose and observatory PDFs are not redistributed.
- Shared API: `POST /api/qimen` accepts dateTime, topic and language only. Server recomputes with strict validation; no questions, chart overrides or provider requests.

The existing development preview remains `http://localhost:3000/#qimen`. Owned QA listeners/container/network are removed after verification; Docker Desktop and the user's 3000 listener are left running. The source is committed and pushed to the explicitly authorized GitHub `main`; live production domain/TLS/Forge are not part of this delivery. No proxy/network configuration was changed.
