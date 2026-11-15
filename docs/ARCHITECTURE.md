# Architecture and API contract

React 19, TypeScript, Vite 8, Express 5; Node 22.12+ (verified locally on 22.22.2). A single HTTP service serves the browser and API. `engines/iching/index.ts` and the versioned JSON are imported by both. The production server is bundled with esbuild; Vite only runs in development. No database, external frontend calls, accounts, remote fonts or analytics.

## Data flow

1. The browser draws three independent Web Crypto bits on each click. An animation only delays revealing an already generated cast. Only six explicit casts form a chart.
2. Values are stored bottom-to-top in ephemeral React state. All computations are synchronous and deterministic.
3. Result cards reverse the rendering order. Primary, transformed and nuclear records share one lookup module.
4. History uses a versioned localStorage key only after Save. Theme storage is an additional unchecked opt-in. At most 100 records; malformed entries are discarded. JSON export may contain a theme only if the user explicitly saved it. Clipboard sharing never contains the theme; no share URLs are generated.
5. Only Request AI makes a POST containing the six values, language and optional theme. Backend recalculates the chart. Neither client-supplied chart metadata nor model-supplied changes are trusted.

## V1.1 symbolic forecasting

`engines/forecast/index.ts` composes deterministic, bilingual conditional scenarios from the validated six values. `profiles.ts` contains 64 original prompt tuples (motif, reading, reversible action, review question); no empirical model, random outcome, hidden score or calendar prediction. The primary supplies the present lens, transformed the direction and nuclear the supporting lens. Moving-line positions have explicitly original stage metaphors; disputed line text remains marked. With no moving lines, the engine states continuity rather than inventing a transition.

`src/Forecast.tsx` runs the engine locally on the result page without a POST or theme semantic analysis. It shows three conditional scenarios, signals, revision conditions, suggestions and source-linked quotations. Optional AI receives the same local report alongside the chart and explicitly submitted theme, then returns a separately displayed structured `forecast`. Exactly three distinct scenario kinds are required. Every action has an observation and a reconsideration condition. Unsupported percentages/dates, missing fields, duplicate kinds, unsafe prose and chart/citation mismatches fail validation; the local forecast survives provider failure. Themes and generated AI text remain outside saved history unless the existing explicit theme-save checkbox is used for the theme itself.

## HTTP endpoints

All API responses use `Cache-Control: no-store`. No CORS allow header. Cross-origin browser POSTs are rejected. Upstream identity is never accepted from `X-Forwarded-For` unless the operator explicitly enables the documented single-proxy topology.

| Endpoint               | Contract                                                                                                                                                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET /api/health        | status, application/rule/data/forecast versions, AI enabled/disabled. No credentials/model/base URL.                                                                                                                                                   |
| GET /api/hexagrams     | version + 64 complete source-linked records.                                                                                                                                                                                                           |
| GET /api/hexagrams/:id | Canonical integer 1..64; 404 otherwise.                                                                                                                                                                                                                |
| POST /api/calculate    | Strict `{values:[6 values of 6/7/8/9]}`; 400 for invalid/extra fields. Returns chart, bits, moving line numbers (1-based), ordering and versions.                                                                                                      |
| POST /api/forecast     | Strict `{values,lang?:string}`; language is zh or en. No theme or client chart metadata. Returns a recomputed `local-rules` report and `symbolic-scenarios/1.0.0`. No provider call or AI budget usage.                                                |
| POST /api/interpret    | Strict `{values,theme?:string <=300,lang?:string}`; language is zh or en. Backend recalculates chart and local forecast. Success includes structured `forecast` alongside reading/citations. Failure returns verified chart, not fabricated AI output. |

Errors are stable machine codes. JSON bodies are limited to 8 KiB. General API limit: 180 requests/minute/IP, excluding health; AI default 10 requests/hour/IP. State is process-local and bounded to 10,000 hashed-IP buckets with expiry. At scale use a trusted shared gateway/quota system; do not run several AI-enabled replicas under the illusion of a global quota.

## AI trust boundary

The adapter accepts HTTPS OpenAI-compatible `/chat/completions` endpoints configured by the administrator, never browser input. No model or key is required for the core product. All real provider access is disabled by default. A ChatGPT/Codex subscription is not API credit.

The theme is an explicitly untrusted JSON field in a user message; the system message allows conditional symbolic forecasts and reversible everyday suggestions, without claiming empirical prediction. Common injection/high-stakes themes are rejected before provider access. Output uses a strict Zod schema, exact chart-ID comparison, source membership + exact quote verification, size cap 64 KiB, timeout, HTML/URL/selected harmful-claim screening and secret-value exclusion. Forecasts also require three distinct scenario kinds and assumption/observation/revision fields. React renders text nodes only. Every quotation links to a versioned source. No `dangerouslySetInnerHTML` or Markdown HTML parser.

Default concurrency 2, timeout 15 seconds, max output 1200 tokens, and lifetime request budget 100 **per process**. Failed requests consume budget. Restarting clears the counter; these limits do not substitute for a provider spending cap. Use AI disabled for a shared public demo until budget, provider privacy terms and a durable/shared rate policy are reviewed. Textual variants remain disclosed; exact quote validation is not proof of scholarly authority. Pattern filters reduce risk but cannot guarantee semantic accuracy or eliminate prompt injection; retain the permanent disclaimer and an operator kill switch.

Application logs contain startup only; no request logger, theme storage, prompts, AI output, credentials or upstream error bodies. Reverse-proxy access logs must likewise exclude request bodies and authorization headers. AI content is never cached in local history.

## Deployment

Production enforces a same-origin CSP with self-only scripts/styles/connect, no inline script, no frames and no objects. Docker runs unprivileged with read-only filesystem, dropped capabilities, bounded resources and rotating logs. No server-side durable volume is necessary; histories belong to users' browsers. Domain-specific Forge integration remains a separate inspected and authorized operation.
