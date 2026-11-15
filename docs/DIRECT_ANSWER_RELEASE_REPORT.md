# MysticAtlas 1.2.0 — Direct prediction result

2026-11-15, Asia/Shanghai. Base commit `0e2dfc2`; local branch `main` in `D:\Project\Web\MysticAtlas`. This addresses the owner's screenshot and feedback: “你这也没有给出预测结果啊”.

## Corrected behavior

Six completed values now automatically open results. An already-completed cast retained by hot reload also transitions. The result starts with **预测结果 / Prediction result**, showing the exact question, an explicit symbolic verdict, the answer sentence, trajectory, reasons, turning point and suggested next step **before diagrams or general scenarios**. Edit last line returns to five values and keeps the question. The AI request and status are beside the verdict.

`answer.ts` and the original 64-entry `judgments.ts` implement a transparent rule-based symbolic judgment. Local matching recognizes question form and selected adverse/negative wording; it is not full semantic understanding or fact research. A question-free reading is explicitly overall; timing output does not manufacture a calendar date; selected professional/high-risk questions require real evidence. Every result identifies its mode and limits. Classic text, original rules and optional model content remain distinct.

Reproducible screenshot cast (bottom to top): **`[8,9,8,7,7,8]`**. Actual result: **47 困 → 45 萃**, nuclear **37 家人**, moving line **2**. With the synthetic question “某位创始人会回到公司担任负责人吗？”, the local card now displays:

> **暂偏否**
>
> 就你所问的事情，本次卦断暂偏不会按原设想发生。
>
> 先受阻，后有转机：当下不宜判断为顺利达成，后续要看支持是否重新聚合。

This is an authored divinatory reading, **not** verified knowledge of any executive's current/future role, a checked question premise, an empirical forecast or a promised outcome. The actual numeric cast is taken from the user's screenshot; public-person wording is replaced by a synthetic theme in captured evidence. No current-company factual assertion is made.

## AI and privacy

AI now must return `forecast.conclusion` with verdict, actual answer, reasons, turningPoint and nextStep. Scenario-only responses are rejected. The system prompt instructs the model to answer the submitted question directly before scenarios, and to identify unverified premises. Existing strict schema, chart IDs, exact citations, unsafe output screening and quota/timeout protections remain. Success replaces the top card with a labeled AI reading; failure preserves local output. Default max output is now 1800 tokens (allowed maximum 2400) to fit the expanded structure; existing explicit operator overrides remain available.

Local question matching makes **no POST**. History remains opt-in, topic storage remains an additional checkbox, and sharing still omits the question. The local forecast API still accepts no question/theme field and produces an explicit overall conclusion; it does not silently collect a user's theme. Only an explicit AI request submits the question. No key was configured, no actual model call made, and no factual verification service is implemented. AI success/rendering tests are mock-only.

## Actual checks

| Gate                                                              | Actual result                                                                                                                                          | Evidence under `artifacts/video-evidence/`                                          |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| TypeScript, unit/API suite, production build, secret-pattern scan | PASS; **77 tests passed**                                                                                                                              | `direct-answer-verification.txt`                                                    |
| Unit counts                                                       | 23 engine/data + 6 scenario + **13 direct answer** + **35 API/AI**                                                                                     | Same log and container build log                                                    |
| Direct rule coverage                                              | All 64 dispositions; screenshot golden case; yes/no/adverse/ambiguous questions; timing/choice/how; no question; evidence-required; oversized question | `tests/answer.test.ts`                                                              |
| Exhaustive direct readings                                        | 4096 inputs in both languages, within one unit test; no probability/date claims                                                                        | Same test; not misreported as 8192 separately registered tests                      |
| Missing AI answer                                                 | Rejected rather than returning generic scenarios as success                                                                                            | API tests                                                                           |
| Initial production E2E                                            | **25 passed / 1 failed**, mobile initial verdict placement                                                                                             | `direct-answer-e2e.txt` retained                                                    |
| Actual mobile fix                                                 | Instant scroll in a route layout effect after the new result DOM commits                                                                               | `src/App.tsx`; viewport assertion unchanged                                         |
| Final production-container E2E                                    | **26 passed / 0 failed**, 44.5 s locally                                                                                                               | `direct-answer-e2e-final.txt`                                                       |
| First-screen conclusion                                           | Screenshot cast, exact question, explicit 暂偏否 / Leans no for now, reasons and trajectory; verdict is inside initial desktop/mobile viewport         | Direct-answer E2E and `direct-answer-zh-desktop.png`, `direct-answer-zh-mobile.png` |
| Responsive/core flows                                             | English 320/390/768px, automatic coin/manual completion, last-line edit, restart, keyboard/reduced motion, history/export and old core routes          | Final E2E                                                                           |
| Text rendering/privacy                                            | Question HTML is rendered as text; no POST, URL topic or automatic saved history; AI failure preserves local result                                    | Final E2E                                                                           |
| Linux Docker build                                                | Typecheck, all 77 tests and bundle PASS                                                                                                                | `direct-answer-container-build.txt`                                                 |
| Container health/API/fallback/concurrency                         | Healthy; seven smoke checks PASS incl. expected AI-disabled 503 and 20 concurrent health requests                                                      | `direct-answer-container-smoke.json`                                                |
| Production mode                                                   | Health **1.2.0**, strict self-only CSP, no Vite client                                                                                                 | `direct-answer-production.json`                                                     |

The first API test run also encountered an ephemeral Windows port rejected by Fetch. Test setup now retries **only** that listen/readiness condition and never retries test assertions or masks other application errors. No user listener is stopped to obtain a port.

## Running and release state

Refresh the existing development page, then complete a reading. If not running, use `npm run dev` and open `http://localhost:3000`. For the numeric reproduction, enter the six values above in manual mode; no final “查看卦象” click is needed. Unsaved state is intentionally not persisted across a full refresh, so re-enter the question/values if refreshing clears them.

Owned QA uses project `mysticatlas-answer-qa` on 3003; its container/network are removed afterward. Owned Node preview 3002 is stopped. The existing user development service on 3000 remains untouched. Images/evidence remain local for review. No public push, production domain/TLS, Forge operation, live AI call or physical-device/Safari verification is claimed. Prior scholarly-text and base-image scan limitations remain in the baseline reports.
