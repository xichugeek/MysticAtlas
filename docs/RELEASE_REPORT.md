# MysticAtlas 1.0.0 release report

Historical V1 baseline. The current application is **1.4.0**, with real Qimen charts/readings, the local face atlas and earlier direct I Ching results. Use [QIMEN_RELEASE_REPORT](QIMEN_RELEASE_REPORT.md) for current verification; earlier evidence is retained in [FACE_RELEASE_REPORT](FACE_RELEASE_REPORT.md) and [DIRECT_ANSWER_RELEASE_REPORT](DIRECT_ANSWER_RELEASE_REPORT.md). The original evidence below is retained as executed.

Date: **2026-11-15 (Asia/Shanghai)**. Workspace: `D:\Project\Web\MysticAtlas`. Branch: `main`. Tested application milestone: **`9652137`**; final evidence/documentation is committed afterward. Exact history is in `artifacts/video-evidence/git-history.txt` and `git log --oneline`.

## Conclusion

**V1 is locally runnable, built, tested, containerized, and prepared for source review/open-source release.** All implemented core flows pass local automated acceptance. This is a cultural-learning digital transcription, not a critical text edition or a prediction service.

**Production release is not executed or approved by this report.** No public push, real provider call, DNS/TLS, CloudCone/Forge operation or online availability is claimed. The unresolved textual readings are visibly labeled pending review; definitive textual authority is not a release claim.

## Executed gates

| Gate                            | Actual result                                                                                                                 | Reproducible evidence                                                             |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Formatting                      | PASS after fixing `server/app.ts`; original failure retained in log                                                           | `verification.txt` ends with successful `npm run format:check`                    |
| TypeScript                      | PASS, zero errors                                                                                                             | `npm run typecheck`, `verification.txt`                                           |
| Engine/data                     | **23 passed, 0 failed**                                                                                                       | `tests/engine.test.ts`; unit output in `verification.txt` and container build log |
| Exhaustive inputs               | **4096/4096 combinations checked** inside one unit test; not misreported as 4096 separate tests                               | Independent corpus pair fixture + explicit yin/transform truth tables             |
| Golden cases                    | Eight explicit vectors including six supplied cases and two mixed/manual derivations                                          | `tests/engine.test.ts`                                                            |
| Data                            | 64 unique combinations, 384 line statements, licenses/sources/hashes present; all 64 independent pairs agree                  | `knowledge/sources/manifest.json`, fixture and source hash tests                  |
| Text collation                  | **366 equal / 18 different**, no missing line comparison; differences marked pending review                                   | `knowledge/collation.json`, `docs/SOURCES.md`, visible variant sections           |
| Coin probabilities              | All 8 fair combinations give exact 1/3/3/1 counts                                                                             | Deterministic coin-combination test                                               |
| Random diagnostic               | 100,000 actual Web Crypto casts; counts 6=12425, 7=37315, 8=37757, 9=12503                                                    | `distribution.txt`; diagnostic only, no statistical CI threshold                  |
| HTTP and AI adapter             | **24 passed, 0 failed**, all real AI calls mocked                                                                             | `tests/api.test.ts`, `verification.txt`                                           |
| Browser on dev service          | **16 passed, 0 failed** after installing missing matching Chromium                                                            | Recorded tool output and PROGRESS; original browser launch failure disclosed      |
| Browser on production container | **16 passed, 0 failed**, 25.9 s total on this local run                                                                       | `e2e.txt`, ignored `output/playwright/report/`, four refreshed screenshots        |
| Production build                | PASS on Windows and Node Alpine Linux                                                                                         | `verification.txt`, `container-build.txt`                                         |
| Secret pattern scan             | PASS, zero findings; final archive rescan recorded                                                                            | `verification.txt`; heuristic scope in script and architecture                    |
| npm vulnerability audit         | **0 low / 0 moderate / 0 high / 0 critical** at time of audit                                                                 | `audit.json`; this is not a guarantee of future advisories                        |
| Compose syntax                  | PASS                                                                                                                          | Actual `docker compose config --quiet` execution                                  |
| Container build/start/health    | PASS, isolated project on loopback 3001, production mode                                                                      | `container-build.txt`, `container-smoke.json`, `container-log.txt`                |
| Container API smoke             | Five expected status/content checks PASS, including invalid input 400 and AI-disabled 503                                     | `container-smoke.json`                                                            |
| Concurrent access               | 20 simultaneous health requests PASS before and after restart                                                                 | `container-smoke.json`, `container-restart.txt`; timing is local diagnostic only  |
| Restart recovery                | PASS; became healthy and repeated all six smoke checks successfully                                                           | `container-restart.txt`                                                           |
| Runtime confinement             | PASS: user node, read-only rootfs, ALL capabilities dropped, no-new-privileges, 256 MiB / 0.5 CPU / 64 PIDs and rotating logs | `container-security.json`                                                         |
| Git diff whitespace             | PASS                                                                                                                          | Actual `git diff --check` execution                                               |

All short evidence filenames above are relative to `artifacts/video-evidence/`. A 503 AI-disabled response is an **expected fallback**, not an AI success. The first missing-browser and initial formatting failures were corrected and rerun; they are not omitted from the development record.

## Browser acceptance scope

Real Chromium at desktop 1440×1000 and iPhone 13 viewport emulation. Tested both languages and persistence; every core page for horizontal overflow; six incremental coin casts; one animated cast and skip; manual values and manual coin faces; primary/transformed/nuclear patterns; restart/undo; atlas search + two trigram filters + classic detail; local history opt-in, JSON download, restore and clear; no POST on save; no theme in default stored history; reduced-motion and keyboard activation; malicious saved HTML renders as text. Source links are versioned. Screenshots are actual rendering, not design mockups.

Not claimed: physical phones, Safari/Firefox, assistive-technology certification, a formal WCAG audit, production-load benchmark or a penetration test.

## AI evidence and limits

Mode: **disabled in app/container; mock provider in unit tests**. Mock tests cover structured success and untrusted theme separation; invalid schemas/extra fields; malicious/high-stakes themes; inconsistent chart IDs; fabricated/off-chart quotes; HTML/unsafe claims/key leakage; provider errors and rate limit; oversize/malformed responses; timeout; IP limit; concurrency; request budget and fail-closed configuration. No credential/model is needed or provisioned. No real provider quality, billing, latency or privacy acceptance is claimed. Pattern-based safety checks cannot prove semantic safety. Keep public AI disabled until the operator reviews a real provider, durable quota policy and provider-side spending cap.

## Open gates and required authorization

| Item                      | Status / next action                                                                                                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public GitHub push        | **待审核 / not executed**. Review local commits, notices and reports; then owner may authorize `git push -u origin main`. Remote returned no advertised refs at initial inspection. |
| GitHub Actions            | Workflow supplied; **remote run not executed**. Run only after approved push; local checks are the actual evidence.                                                                 |
| Production/Forge          | **未执行**. Needs scoped authorization and actual inspection of interfaces, routes, resource budget and access. Follow DEPLOYMENT; no guessed Controller or Caddy config.           |
| DNS/TLS/public demo       | **未执行**. `mysticatlas.demo.xichugeek.com` is a proposed target, not an actual live URL.                                                                                          |
| Forge sleep/wake/rollback | **未执行**. 30-minute sleep / zero-click wake not assumed. Local container restart is not Forge acceptance.                                                                         |
| Real AI                   | **未执行**. Owner must choose/configure provider and a secret through a private mechanism; no extra key is required for V1 core.                                                    |
| Scholarly text authority  | **待核验**: 18 line differences and full judgment collation. Publish only with current transcription/variant labels; do not claim an authoritative critical edition.                |
| Container OS CVE scan     | **未执行**. npm audit covers JS dependencies, not base-OS CVEs. Scan the pinned image again before production; refresh digest as advisories require.                                |

V2 Qimen and V3 face work were not started. No unrelated project, production service, global proxy environment variable or Windows network/registry setting was modified. Docker Desktop was started to run authorized local container tests; only the MysticAtlas container/network is cleaned up afterward.

## Start and delivery

```powershell
Set-Location 'D:\Project\Web\MysticAtlas'
npm ci
npm run dev
```

Then open **http://localhost:3000**. Production: `npm run build` and `npm start`. Compose: `docker compose up --build -d --wait`; set a private `MYSTICATLAS_PORT` if 3000 is occupied. Development/QA processes are stopped after verification, so these are startup instructions, not an assertion that a background preview remains running.

Read `README.zh-CN.md`, `docs/DEPLOYMENT.md` and `docs/VIDEO_HANDOFF.md`. No unresolved core runtime/test failure remains in the verified scope. Remaining gates above require external configuration, production authorization or further scholarly review.
