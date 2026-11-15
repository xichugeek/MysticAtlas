# Architecture and API contract

React 19, TypeScript, Vite 8, Express 5; Node 22.12+ (verified locally on 22.22.2). A single HTTP service serves the browser and API. `engines/iching/index.ts` and the versioned JSON are imported by both. The production server is bundled with esbuild; Vite only runs in development. No database, external frontend calls, accounts, remote fonts or analytics.

## Data flow

1. The browser draws three independent Web Crypto bits on each click. An animation only delays revealing an already generated cast. Only six explicit casts form a chart.
2. Values are stored bottom-to-top in ephemeral React state. All computations are synchronous and deterministic.
3. Result cards reverse the rendering order. Primary, transformed and nuclear records share one lookup module.
4. History uses a versioned localStorage key only after Save. Theme storage is an additional unchecked opt-in. At most 100 records; malformed entries are discarded. JSON export may contain a theme only if the user explicitly saved it. Clipboard sharing never contains the theme; no share URLs are generated.
5. Only Request AI makes a POST containing the six values, language and optional theme. Backend recalculates the chart. Neither client-supplied chart metadata nor model-supplied changes are trusted.

## V1.1 symbolic forecasting

### V1.2 direct results

At six values, the app automatically opens results, including a completed cast retained by hot reload. A route layout effect focuses the main content and scrolls instantly after the new DOM commits, avoiding mobile scroll anchoring that could hide the verdict. Edit last line returns to five values and retains the question.

`engines/forecast/answer.ts` supplies a first-screen question-linked conclusion. `judgments.ts` is an original 64-entry disposition table, not an ancient yes/no authority or an empirical model. Local matching is limited to question form, selected adverse-event words and ambiguous negation. The primary disposition gives the present tendency; the actual transformed pattern supplies the trajectory. A blocked primary followed by a favorable transformed pattern is stated as obstruction first and possible opening later. No-question output is explicitly overall. Selected high-risk questions require real-world evidence. This is not full semantic understanding or premise verification, and the UI states that boundary. Questions remain in browser memory unless explicitly saved or submitted to AI.

`DirectAnswerCard` appears before diagrams, with the question, verdict, explanation, reasons, turning point and next step. The AI request/status is adjacent. AI must now return `forecast.conclusion` with these fields; scenario-only output is rejected. Success replaces the top conclusion with a labeled AI reading; failure preserves local output. A live provider remains unverified.

`engines/forecast/index.ts` composes deterministic, bilingual conditional scenarios from the validated six values. `profiles.ts` contains 64 original prompt tuples (motif, reading, reversible action, review question); no empirical model, random outcome, hidden score or calendar prediction. The primary supplies the present lens, transformed the direction and nuclear the supporting lens. Moving-line positions have explicitly original stage metaphors; disputed line text remains marked. With no moving lines, the engine states continuity rather than inventing a transition.

`src/Forecast.tsx` runs the engine locally on the result page without a POST or theme semantic analysis. It shows three conditional scenarios, signals, revision conditions, suggestions and source-linked quotations. Optional AI receives the same local report alongside the chart and explicitly submitted theme, then returns a separately displayed structured `forecast`. Exactly three distinct scenario kinds are required. Every action has an observation and a reconsideration condition. Unsupported percentages/dates, missing fields, duplicate kinds, unsafe prose and chart/citation mismatches fail validation; the local forecast survives provider failure. Themes and generated AI text remain outside saved history unless the existing explicit theme-save checkbox is used for the theme itself.

## Face atlas (1.3.0)

`src/Face.tsx` is a lazy `#face` route. File MIME and magic bytes must match PNG/JPEG/WebP; limits are 8 MiB and 32 megapixels, with decoded images reduced locally to a maximum edge of 1440. Photos remain `ImageBitmap` objects in memory. A dedicated classic worker runs the pinned MediaPipe 0.10.21 CPU/IMAGE detector with `numFaces: 2`, no blendshapes and no transformation matrices. Zero or multiple detections are rejected. Only the single set of 478 positions returns to the UI; there are no identity embeddings or personal-trait predictions. The worker is terminated on completion, error, timeout, reset or route unmount; obsolete async results are ignored and decoded bitmaps closed. The public example uses the same real detector.

`engines/face/index.ts` computes pixel-space Euclidean ratios, eye-line tilt and projected vertical segments. Automatic forehead point 10 is explicitly not a hairline. Manual hairline/reference inputs start empty and must be entered in increasing order; no model output is relabeled as a manual annotation. JSON export omits the image, filename and raw coordinates. No photo/landmark persistence, remote model URL or AI-provider input is implemented. Cultural notes are original educational paraphrases, separate from measured results.

`prepare:face` bundles an IIFE classic worker and copies WASM from the locked package into ignored `public/vision/` before dev/build. The checked-in model, example and upstream license have SHA-256/size checks in `public/face/assets.json`. Production serves these resources under the existing same-origin policy; CSP adds only `wasm-unsafe-eval` for WebAssembly compilation and `worker-src 'self'`. It does not enable general JavaScript eval or inline scripts.

## HTTP contracts

### Qimen (1.4.0)

`engines/qimen/index.ts` imports locked `lunar-typescript@1.8.7` for calendar calculations. It validates a fixed UTC+8 civil datetime, uses the 23:00 day pillar paired with the hour pillar, and deterministically implements the declared rotating-plate Chaibu method. The earth numerical order, eight-palace ring, original center origin and effective lodged origin are separate fields. Tianqin and its center stem move with Tianrui; center has no duplicate heaven stem, door or deity. Independent Q1 and hand-derived Yin/center vectors accompany exhaustive 18×60 structural checks. See QIMEN_RULES for all conventions and limits.

`reading.ts` chooses day-stem and topic references, compares palace elements, and applies explicit priority rules for a direct symbolic verdict. It supplies traceable evidence, three scenarios, actions and revision conditions without AI. It does not parse question semantics or verify facts. `src/Qimen.tsx` is a lazy route, so the calendar bundle loads only when opening Qimen. Changed inputs remove old results; calculation focuses and scrolls to the verdict. Palace details, trace, bilingual layout, clear and JSON export are local. Question text stays in memory and is excluded from export unless separately opted in.

`POST /api/qimen`: strict `{dateTime, topic?, lang?}`; recomputes with the same engine and returns `{status, chart, reading}`. Unsupported dates/options/topics/languages and question/chart payloads return 400 `INVALID_QIMEN_INPUT`. It inherits same-origin policy, JSON cap, generic API rate limit and no-store. No Qimen AI endpoint or provider input exists. Health now includes `qimenVersion` and app version 1.4.0. Browser runtime has no external calendar request. The MIT notice is preserved in the repository and `public/licenses/` for the browser distribution.

All API responses use `Cache-Control: no-store`. No CORS allow header. Cross-origin browser POSTs are rejected. Upstream identity is never accepted from `X-Forwarded-For` unless the operator explicitly enables the documented single-proxy topology.

| Endpoint               | Contract                                                                                                                                                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET /api/health        | status, application/rule/data/forecast versions, AI enabled/disabled. No credentials/model/base URL.                                                                                                                                                   |
| GET /api/hexagrams     | version + 64 complete source-linked records.                                                                                                                                                                                                           |
| GET /api/hexagrams/:id | Canonical integer 1..64; 404 otherwise.                                                                                                                                                                                                                |
| POST /api/calculate    | Strict `{values:[6 values of 6/7/8/9]}`; 400 for invalid/extra fields. Returns chart, bits, moving line numbers (1-based), ordering and versions.                                                                                                      |
| POST /api/forecast     | Strict `{values,lang?:string}`; language is zh or en. No theme or client chart metadata. Returns a recomputed `local-rules` report and `symbolic-scenarios/1.1.0`. No provider call or AI budget usage.                                                |
| POST /api/interpret    | Strict `{values,theme?:string <=300,lang?:string}`; language is zh or en. Backend recalculates chart and local forecast. Success includes structured `forecast` alongside reading/citations. Failure returns verified chart, not fabricated AI output. |

Errors are stable machine codes. JSON bodies are limited to 8 KiB. General API limit: 180 requests/minute/IP, excluding health; AI default 10 requests/hour/IP. State is process-local and bounded to 10,000 hashed-IP buckets with expiry. At scale use a trusted shared gateway/quota system; do not run several AI-enabled replicas under the illusion of a global quota.

## AI trust boundary

The adapter accepts HTTPS OpenAI-compatible `/chat/completions` endpoints configured by the administrator, never browser input. No model or key is required for the core product. All real provider access is disabled by default. A ChatGPT/Codex subscription is not API credit.

The theme is an explicitly untrusted JSON field in a user message; the system message allows conditional symbolic forecasts and reversible everyday suggestions, without claiming empirical prediction. Common injection/high-stakes themes are rejected before provider access. Output uses a strict Zod schema, exact chart-ID comparison, source membership + exact quote verification, size cap 64 KiB, timeout, HTML/URL/selected harmful-claim screening and secret-value exclusion. Forecasts also require three distinct scenario kinds and assumption/observation/revision fields. React renders text nodes only. Every quotation links to a versioned source. No `dangerouslySetInnerHTML` or Markdown HTML parser.

Default concurrency 2, timeout 15 seconds, max output 1800 tokens (2400 maximum), and lifetime request budget 100 **per process**. Failed requests consume budget. Restarting clears the counter; these limits do not substitute for a provider spending cap. Use AI disabled for a shared public demo until budget, provider privacy terms and a durable/shared rate policy are reviewed. Textual variants remain disclosed; exact quote validation is not proof of scholarly authority. Pattern filters reduce risk but cannot guarantee semantic accuracy or eliminate prompt injection; retain the permanent disclaimer and an operator kill switch.

Application logs contain startup only; no request logger, theme storage, prompts, AI output, credentials or upstream error bodies. Reverse-proxy access logs must likewise exclude request bodies and authorization headers. AI content is never cached in local history.

## Deployment

Production enforces a same-origin CSP with self-only scripts/styles/connect, no inline script, no frames and no objects. Docker runs unprivileged with read-only filesystem, dropped capabilities, bounded resources and rotating logs. No server-side durable volume is necessary; histories belong to users' browsers. Domain-specific Forge integration remains a separate inspected and authorized operation.
