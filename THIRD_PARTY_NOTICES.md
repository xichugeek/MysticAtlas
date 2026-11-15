# Third-party notices

MysticAtlas original code is MIT (see LICENSE). This does not relicense third-party material.

## Classical data and English labels

The Chinese Zhouyi core text is public-domain ancient material. Its simplified digital arrangement, trigram records, pinyin and short English labels are adapted from **Ann1949/iching-kit**, commit `6a32e5faa737b0d6facfcd571856fd8ae18d4439`.

Copyright (c) 2026 I Ching Oracle (https://theichingoracle.com). MIT. The complete required notice is preserved verbatim in `knowledge/sources/iching-kit-LICENSE.txt`, and the imported source is retained as `knowledge/sources/iching-kit-classic.ts.txt`. No upstream computational code or proprietary website articles/modern translations are used. Short English labels are not a translation of the judgments or line statements.

Independent comparison corpus: **gujilab/chinese-classical-corpus**, commit `09a6873e46760f20027e20bf48814f5c5cc05d66`, `output/wujing/zhouyi.json`. Upstream dedicates structured classical data under **CC0 1.0 Universal**. Full upstream license and attribution are preserved in `knowledge/sources/corpus-LICENSE.txt`. Its declared source is 殆知阁 with Chinese Text Project gap completion. Only Zhouyi text is retained; no modern translation/training dataset is included. See https://creativecommons.org/publicdomain/zero/1.0/.

Both are digital transcriptions, not a verified facsimile or critical edition. Differences are retained in `knowledge/collation.json` and disclosed in the UI. See `docs/SOURCES.md` for provenance, checks and limits.

## Software

Runtime dependencies: React / React DOM (MIT), Express (MIT), Zod (MIT), Helmet (MIT), lucide-react (ISC; Lucide icon artwork ISC). Development dependencies include Vite (MIT), Vitest (MIT), TypeScript (Apache-2.0), tsx (MIT), esbuild (MIT), Prettier (MIT), Playwright (Apache-2.0), and DefinitelyTyped type declarations (MIT). Exact versions and transitive packages are locked in `package-lock.json`; their original notices remain in the installed packages. Review with `npm ls --all` and each package's LICENSE before redistributing a dependency bundle.

UI illustration, coin rendering and logo mark are original CSS/SVG. Fonts use operating-system fallbacks; no font files, external images, stock videos, trackers or analytics are distributed.
