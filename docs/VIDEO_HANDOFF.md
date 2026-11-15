# MysticAtlas V1 video handoff

**Current: 1.3.0 face atlas is implemented.** Open the main navigation's 面相图谱 / Face atlas or `/#face`, then choose a photo or use the public NASA example. Record the real 478-point overlay and six measured values, manually entered reference lines, geometry-only export and clear. Photos remain in browser memory. Do not present geometry as personality, health or fortune inference. The cultural/drawing notes have separate sources. Chinese/English desktop/mobile captures are `face-*`; current verification is [FACE_RELEASE_REPORT](FACE_RELEASE_REPORT.md): 85 unit/API tests, 32 full production E2E and 6 focused container E2E pass. Earlier version descriptions below are historical. Qimen remains planned; face is no longer planned-only.

**Latest: V1.2 direct prediction result.** Six completed lines now open the result automatically. Record the first-screen question and explicit symbolic verdict before showing the supporting diagrams/scenarios. Reproduce the feedback with `[8,9,8,7,7,8]` and the synthetic theme “某位创始人会回到公司担任负责人吗？”: 47 困 → 45 萃, nuclear 37 家人, second line moves, verdict 暂偏否, trajectory 先受阻，后有转机. Do not imply this verifies a real executive’s current/future role. The new card identifies it as a local rule-based reading; real AI remains unconfigured/mock-tested. See DIRECT_ANSWER_RELEASE_REPORT and `direct-answer-*` evidence. The earlier V1/V1.1 sections below are retained as historical handoff notes.

Current application update: **1.1.0 — 推演预测**, requested by the owner after the baseline below. Complete a reading and show the new section between the three diagrams and classic text: present/direction/inner lenses, moving-line prompts, three conditional scenarios and reversible action suggestions with observations/revision conditions. In `[9,7,7,7,7,7]`, the direction theme is “新因素与边界 / An encounter” from 44 姤. Source engine: `engines/forecast/`; UI: `src/Forecast.tsx`. The 64 bilingual prompt profiles are original commentary, not classical quotes or an empirical predictor. Mode works locally without a key; theme-based AI forecasts remain opt-in and mocked in verification. Use the latest `docs/FORECAST_RELEASE_REPORT.md` and `forecast-*` evidence files for current counts/status; the V1 baseline below remains historical.

## Product and actual state

- Name/version: MysticAtlas · 易境 / AI 国学图谱, 1.0.0, XichuGeek / 西楚极客.
- Relative root: repository root; actual path `D:\Project\Web\MysticAtlas`.
- Start: `npm ci` then `npm run dev`; local URL `http://localhost:3000`. Production: `npm run build` then `npm start`. Container QA uses loopback `http://127.0.0.1:3001` during verification. A local service running during development is not an online deployment; final run status is in RELEASE_REPORT.
- Real features: six incremental casts, manual values/coin faces, three diagrams, moving lines, 64 searchable source-linked records, Chinese/English core UI, local journal/export/clear, reduced motion and keyboard support, AI-off fallback plus mock-tested adapter.
- Not completed: live AI/provider verification, Forge integration, DNS/TLS/public demo, physical phone/Safari testing, authoritative critical text collation. Qimen remains planned; face became available in 1.3.0 as described above. Public source push was subsequently authorized and completed on 2026-11-15.

## Actual Codex development evidence

- Original requirements: `Agent/MysticAtlas_01_项目开发任务书.md` (preserved); plan and decisions: `docs/IMPLEMENTATION_PLAN.md`, `docs/PROGRESS.md`, `docs/ARCHITECTURE.md`.
- Representative actual request: “请读取本地文件…项目开发任务书.md 并执行开发工作…开发框架…不一定要跟文档框架一样。” Scope derives from the supplied task; do not invent additional prompts or video-agent conversations.
- Key implementation: `engines/iching/index.ts`; `knowledge/hexagrams.json`; `src/Cast.tsx`, `src/Result.tsx`; `server/ai.ts`; `tests/engine.test.ts`, `tests/api.test.ts`, `tests/e2e/flows.spec.ts`.
- Source proof: immutable upstream commits and hashes in `knowledge/sources/manifest.json`; actual text differences in `knowledge/collation.json`.
- Git: initialized locally on branch `main`, first real commit `aeb649a` (`docs: establish V1 scope and local delivery plan`). Milestone history is retained in the evidence index. The owner subsequently authorized publication: all source commits through `121320f` were actually pushed to `origin/main` on 2026-11-15 and verified against the remote SHA.

## Reproducible recording sequence

1. Open local home and explain cultural/reflection boundaries.
2. Enter casting, choose 手动录入, select **9**, Record, then record **7** five times. Input is bottom-to-top `[9,7,7,7,7,7]`.
3. Expected and actually verified: primary **1 乾**, transformed **44 天风姤**, nuclear **1 乾**, moving **初爻**. Bottom line changes yang → yin. UI shows six raw values and highlights the original bottom line text.
4. Browse the source-linked 64-hexagram atlas. Filter upper 乾 + lower 巽 to obtain 姤. Open a disputed-text page such as 37 家人 and expand the pending-review section; do not present the transcription as an authoritative edition.
5. Request AI with no configuration: actual disabled message appears, all classical/rule content remains available. This is a graceful fallback demonstration, not a successful real model reading.
6. Save locally with theme unchecked, open history, export synthetic JSON, clear with confirmation; switch English and repeat the core navigation.

## Safe terminal demonstrations

```sh
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run test:distribution
node scripts/smoke.mjs http://127.0.0.1:3000
git log --oneline
```

Use synthetic themes only. Never record `.env`, provider configuration pages, shell history containing credentials, SSH sessions, authorization headers, or real private questions. Do not show a mock provider's answer as a live model call. Actual test counts and remaining unexecuted gates belong to RELEASE_REPORT; retained command output belongs to `artifacts/video-evidence/`.

## AI mode and redaction

Default and recorded browser mode: **disabled**. API unit tests: **mock provider**, named `mock-provider` solely inside tests. No real model name is verified for public reporting. Credentials are absent. Server logs startup only; provider errors are mapped to fixed codes; outputs are schema/source checked and rendered as text. Saved histories do not include AI text. All evidence uses synthetic values/topics.

## Assets and release labels

- Material directory: `artifacts/video-evidence/INDEX.md`, real desktop/mobile home and result screenshots plus final safe command output. Browser report and traces: `output/playwright/` (ignored). Large recordings must remain ignored.
- README and local app: **已验收** in the stated local scope; 47 unit/API tests and 16 production-container browser tests pass. See RELEASE_REPORT and retained command output.
- GitHub: public source on `xichugeek/MysticAtlas`, branch `main`, **已推送 / published** after the owner's 2026-11-15 authorization. Workflow results are tracked on the repository Actions page; source publication is not a demo/Forge deployment.
- Docker: real local build, health/smoke, restart recovery, resource confinement and production-browser regression **已验收**. QA containers are removed at handoff; image retained. Local timings are not production performance benchmarks.
- Production demo/Forge/DNS/TLS: **未执行**. The proposed domain is not evidence of availability. No fabricated online address, performance benchmark, recording, commit or test result.
