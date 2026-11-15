# Sources, editions and textual limits

Checked **2026-11-15, Asia/Shanghai**. Dataset release `zhouyi/1.0.0`.

## Shipped sources

| Use                                                                             | Source and immutable version                                                                                                                                    | License and scope                                                                     |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 64 records, 384 line statements, judgments, 用九/用六, names and English labels | [iching-kit classic.ts](https://github.com/Ann1949/iching-kit/blob/6a32e5faa737b0d6facfcd571856fd8ae18d4439/src/data/classic.ts)                                | Ancient text public domain; arrangement and English labels MIT. Full notice retained. |
| Independent verification of all 64 lower/upper pairs, textual comparison        | [Chinese classical corpus, Zhouyi](https://github.com/gujilab/chinese-classical-corpus/blob/09a6873e46760f20027e20bf48814f5c5cc05d66/output/wujing/zhouyi.json) | Structured source text CC0. Full upstream license retained.                           |
| Source license A                                                                | [MIT license](https://github.com/Ann1949/iching-kit/blob/6a32e5faa737b0d6facfcd571856fd8ae18d4439/LICENSE)                                                      | Copyright 2026 I Ching Oracle.                                                        |
| Source license B                                                                | [Corpus license](https://github.com/gujilab/chinese-classical-corpus/blob/09a6873e46760f20027e20bf48814f5c5cc05d66/LICENSE)                                     | CC0 data; MIT upstream scripts (not copied).                                          |

Exact downloaded bytes and SHA-256 hashes are in `knowledge/sources/manifest.json`. Tests verify these hashes. `scripts/import-classics.py` reproduces the primary JSON and independently extracts `(lower, upper)` labels from the separate corpus, without using our engine. The independent 64 pair fixture is checked against every shipped record.

## What this edition means

This is a **versioned simplified digital transcription**, not an authoritative scholarly edition. The primary upstream does not identify a single historical printed exemplar, so that attribution remains unknown. The separate corpus describes 殆知阁 + ctext.org gap completion. We do not claim the two sources establish textual authority or independent manuscript transmission.

Only the core **经** layer (卦辞 / 爻辞 / 用九 / 用六) is displayed as classical material. The independent file contains 传 as well, but those passages are not presented as core text in the product. Original reflection prompts are explicitly labeled 自编阅读提示 / Original reflection prompt. The English flow is complete, while Chinese classical text is intentionally retained. English short titles are licensed reading labels, never attributed to a historical English translation. No modern translation or commentary is copied.

## Collation and unresolved differences

Run `python scripts/audit-classics.py` to compare 384 line statements, ignoring punctuation and whitespace and expanding the repetition mark `々`. **366 match; 18 differ**. Exact pairs are retained in `knowledge/collation.json`; the affected pages expose a “版本异文 · 待核验 / Textual differences · pending review” section. The primary text is preserved unchanged. Neither side is labeled authoritative. Judgment wording is source-versioned but has not undergone a full critical collation.

Differences include 即/既 (6.4), 啕/咷 (13.5, 56.6), 佑/祐 (14.6), 撝/捴 (15.4), 畲/畬 and 有/用 (25.2), 寘/窴 (29.6), 遁/遯 (33.1, 33.3–6), 涂/途 (38.6), a damaged private-use glyph (47.6), 冽/洌 (48.5), 己/巳 (49.2), 亿/意 (51.5), and a line-label inconsistency 六四/九四 in the independent corpus (37.4). That last label conflicts with its own trigram structure; it is disclosed, not copied over our record.

Remaining scholarly work: compare disputed readings and all judgments against a licensed facsimile/critical edition before advertising a definitive text. This is not a blocker for an openly labeled cultural transcription, but it blocks claims of authoritative textual accuracy.

## Original V1.1 forecast prompts

V1.2 adds `engines/forecast/judgments.ts` and `answer.ts`: an original 64-entry disposition table, explicit combination rules and limited question-form matching. The labels “偏向会 / 暂偏否 / 有条件可成” are authored symbolic judgments, not a recovered ancient yes/no method, an empirical prediction, a factual premise check or a full local language model. A blocked primary followed by a favorable transformed pattern is presented as present obstruction with a possible later opening. This authorship/boundary is displayed beside the direct result. AI direct conclusions retain the same source/ID checks and are separately labeled.

`engines/forecast/profiles.ts` contains MysticAtlas-authored Chinese/English prompts for all 64 hexagrams. Motifs are symbolic reading lenses, not new classical quotations, licensed modern translations, traditional event-date rules or claims of empirical accuracy. Stage metaphors, scenarios and action suggestions are original MIT-licensed commentary. Source-linked judgments and moving-line quotations continue to use the pinned classical dataset and disclose pending variants. No new third-party source or predictive dataset was added for this extension.

## References inspected, not redistributed

- [Unicode Yijing Hexagram Symbols](https://www.unicode.org/charts/PDF/U4DC0.pdf): symbol range U+4DC0–U+4DFF and King Wen labels inspected. No chart PDF or font copied into the product. Algorithm mapping is independently checked using explicit corpus trigram labels, not font appearance.
- Wikisource and ctext.org direct retrieval returned access errors/403 in this session. Do not claim direct verification of those sites. Their text was not scraped during this task.
- [Vite official guide](https://vite.dev/guide/): Node prerequisite checked; actual package versions resolved with npm and pinned. Installed versions are the authoritative engineering evidence.
