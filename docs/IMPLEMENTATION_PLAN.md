# MysticAtlas V1 implementation plan

Baseline: `Agent/MysticAtlas_01_项目开发任务书.md`, reviewed 2026-11-15 (Asia/Shanghai).

## Workspace and scope

The workspace initially contains only the supplied Agent documents, with no Git metadata or application. Preserve them. Work locally in this directory; do not publish, push, configure credentials, or modify production infrastructure. The provided remote is `https://github.com/xichugeek/MysticAtlas.git`. Proxy/network settings must remain unchanged.

## Architecture decision

Use React + TypeScript + Vite, one Express HTTP service, and versioned JSON. Browser and server import the same deterministic engine. Compared with separate Python and Next.js services this avoids duplicate rules, reduces memory and deployment operations, and keeps all core functionality available without an AI provider. No database, account, paid dependency, remote font, or face detection. AI uses a server-only OpenAI-compatible adapter with explicit enablement, quotas, timeout, validated output and verified citations. Classical Chinese text is distinguished from original English reading notes; no unlicensed modern translation.

## Milestones and acceptance

1. M1: review workspace/tools; record rules, sources and deployment constraints.
2. M2: import and audit 64 classical records; verify mapping against an independent source; implement engine; golden cases, 4096 exhaustive cases, illegal-input and coin-combination tests.
3. M3: build responsive obsidian/bronze UI; six incremental casts, animation controls, manual values/coins, result comparison, classics, filters, bilingual core flow and opt-in local history. Run real browser tests and save screenshots.
4. M4: implement HTTP APIs and AI degradation; test disabled/success/error/timeout/rate/concurrency/budget/citation/injection paths using an explicitly mocked provider. No real API claims without credentials.
5. M5: lock dependencies, add CI, non-root Docker/Compose, bilingual README, license/third-party notices, release and rollback instructions; run audit, secret scan, typecheck, tests and build. Record Docker execution limits honestly.
6. M6: update release report, progress and video evidence index; record exact commands, counts, local Git commits and remaining release gates.

## Rule contract

Arrays are bottom-to-top. Coins are 2 or 3. Values 6/8 are yin; 7/9 yang; only 6/9 change. Lower trigram = indices 0..2, upper = 3..5. Nuclear lower = indices 1,2,3; upper = 2,3,4. Codes are strings in bottom-to-top order, never King Wen numbers. Web Crypto supplies independent bits. Six values are always validated before lookup.

## Release boundaries

Local commits are authorized by the task document. Public push, credentials, production deployment, DNS/TLS and Forge changes require separate authorization and actual environment inspection. Docker availability is a verification gate; a file review is not a container run. V2/V3 are roadmap labels only.
