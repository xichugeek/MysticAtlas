# MysticAtlas 1.1.0 — 推演预测

Executed 2026-11-15, Asia/Shanghai. Requested by the owner after V1.0: “推演预测的能力加进去”. Local workspace `D:\Project\Web\MysticAtlas`; base commit `5573a3d`, branch `main`. Public push and production deployment remain outside this extension.

## Delivered behavior

After six casts or manual entry, the result page now automatically presents **推演预测 / Predictive scenarios** before the classical text:

- Present, direction and inner lenses derived from the actual primary/transformed/nuclear IDs.
- Moving positions, original stage prompts, yin/yang transition and source-linked classical passage. Pending textual variants remain labeled.
- Exactly three conditional scenarios: improving conditions, similar conditions and increasing friction. Each has assumptions, an outlook, observations and conditions for revision.
- Three small reversible action suggestions with observations and reconsideration conditions.
- Source-linked classical judgments, clearly separated from original commentary.

All 64 profiles have independently written Chinese/English motifs, readings, actions and review questions. `engines/forecast/index.ts` deterministically composes them; no extra random values, fortune score, probability, accuracy rate or calendar event is invented. With no moving lines, it explicitly reads continuity and small adjustments rather than forcing a reversal. Version: `symbolic-scenarios/1.0.0`. Core casting algorithm/data versions remain unchanged.

The local report is available without an AI key or request and does not analyze or upload theme text. An explicit **请求 AI 推演预测 / Request an AI forecast** submits the chart, local rule report and optional theme to the configured provider. The AI output must include a separate structured forecast with three distinct scenario kinds and actionable observation/revision fields. IDs and citations remain verified. Unsupported numeric probabilities/fixed dates, invalid/missing fields, duplicate kinds and unsafe content are rejected by the implemented checks. A provider failure preserves the local report. Checks are bounded schema/pattern checks, not a proof of all semantic safety or forecast accuracy.

This is symbolic conditional forecasting, not an empirically validated prediction model. Classical quotations are the versioned transcription; trend/stage/scenario prompts are original commentary. Existing textual-source uncertainties remain disclosed. No new third-party predictive dataset, dependency, model credential or external service was added.

## Actual verification

| Check                                              | Result                                                                                                                                              | Evidence                                                        |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| TypeScript, production bundle, secret-pattern scan | PASS                                                                                                                                                | `forecast-verification.txt`                                     |
| All unit/API tests                                 | **62 PASS / 0 FAIL**: 23 original engine/data + 6 forecast + 33 API/AI                                                                              | Same log; Linux build also runs all 62                          |
| Forecast coverage                                  | 64 IDs, distinct bilingual actions, stable/mixed/full-change cases, disputed line disclosure, invalid inputs, deterministic output                  | `tests/forecast.test.ts`                                        |
| Exhaustive forecast cases                          | 4096 valid inputs in **both languages**, 8192 reports checked within one unit test                                                                  | Same test; not claimed as 8192 separately registered tests      |
| Forecast API                                       | Server recalculation, zh/en, no theme/extra fields, invalid language/values, no AI budget/provider consumption                                      | `tests/api.test.ts`                                             |
| AI adapter extension                               | Ordinary predictive request accepted; structured forecast success, duplicate scenarios, invented percentage/date, unsafe/nonsensical shape rejected | Mock provider tests, not live AI                                |
| First browser pass, existing dev listener 3000     | **22 PASS / 0 FAIL**, 51.1 s                                                                                                                        | `forecast-e2e.txt`; explicitly development evidence             |
| Final production-container browser pass, port 3003 | **22 PASS / 0 FAIL**, 38.2 s                                                                                                                        | `forecast-e2e-production.txt`                                   |
| Actual production mode                             | Health 1.1.0 + forecast version, strict CSP, no Vite client                                                                                         | `forecast-production.json`                                      |
| Responsive forecast UI                             | Desktop + Chromium iPhone viewport; English layouts additionally checked at 320/390/768px; no horizontal overflow                                   | Browser tests and actual component screenshots                  |
| Local privacy/fallback                             | No POST while generating local scenarios; theme absent from URL; mock AI output separate; AI error preserves local forecast                         | Browser tests                                                   |
| Linux container                                    | Build, 62 tests, production startup/health and forecast API pass                                                                                    | `forecast-container-build.txt`, `forecast-container-smoke.json` |
| Real HTTP smoke/concurrency                        | Seven checks PASS including forecast, invalid values, AI-off 503 and 20 concurrent health requests                                                  | `forecast-container-smoke.json`; local timings only             |
| Occupied-port startup                              | Correct error, actual exit **1**, no false success                                                                                                  | `forecast-port-conflict.txt`                                    |

Short evidence names are under `artifacts/video-evidence/`. Screenshots `forecast-zh-desktop.png` and `forecast-zh-mobile.png` are real Chromium captures of the new component. Unrelated sticky navigation is hidden only in the component screenshot to avoid viewport-overlap artifacts; forecast content is unchanged. Full result/home screenshots are refreshed for V1.1. HTML browser report and traces remain in ignored `output/playwright/`.

The first new unit run found an overstrict test assertion on short Chinese motif labels; corrected to permit concise labels while requiring complete body fields. Subsequent unit suites pass. The existing listener on 3000 was identified as development mode, so production acceptance was rerun on a separately owned listener with CSP evidence. No development run is mislabeled as production. The companion Express listen-error callback issue was fixed and directly reproduced as failure on an occupied port.

## How to see it

Final review removes duplicate action suggestions when lenses share a hexagram; exhaustive cases enforce three distinct suggestions. The AI guard also accepts an honest statement that no accuracy rate is supplied. Component screenshots use the native `hidden` attribute on unrelated navigation during capture, instead of injecting inline style under the strict production CSP.

Use the existing local development page if running; refresh and complete a reading. Otherwise run `npm run dev` in this project and open `http://localhost:3000`. For a production preview on a free port in PowerShell:

```powershell
npm run build
$env:PORT='3002'
npm start
```

Reproducible golden input: `[9,7,7,7,7,7]` bottom-to-top. Expected/actual: primary 1 乾, transformed 44 姤, nuclear 1 乾; direction motif **新因素与边界 / An encounter**, moving bottom line, three scenarios and three suggestions. No-moving example `[7,7,7,7,7,7]` explicitly avoids an assumed turning point.

## Release limits

- Real provider remains disabled/unconfigured; API success and browser AI UI are **mock-tested** only. No real-model quality, billing or latency claim.
- Existing user/development listener on 3000 is left untouched. Owned production preview 3002, browser session and isolated `mysticatlas-forecast-qa` container/network are stopped after verification; image retained.
- No public push, online domain, DNS/TLS, Forge operation, physical-phone/Safari test or forecast accuracy backtest. Baseline text variants and container OS-CVE scan limits remain in the V1 report.
- README, architecture, source distinctions, implementation plan, progress, video handoff and evidence index are updated. Original Agent requirements remain intact; this owner-requested extension is documented as the subsequent scope change.
