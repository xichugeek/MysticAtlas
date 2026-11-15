# Third-party notices

MysticAtlas original code is MIT (see LICENSE). This does not relicense third-party material.

## Classical data and English labels

The Chinese Zhouyi core text is public-domain ancient material. Its simplified digital arrangement, trigram records, pinyin and short English labels are adapted from **Ann1949/iching-kit**, commit `6a32e5faa737b0d6facfcd571856fd8ae18d4439`.

Copyright (c) 2026 I Ching Oracle (https://theichingoracle.com). MIT. The complete required notice is preserved verbatim in `knowledge/sources/iching-kit-LICENSE.txt`, and the imported source is retained as `knowledge/sources/iching-kit-classic.ts.txt`. No upstream computational code or proprietary website articles/modern translations are used. Short English labels are not a translation of the judgments or line statements.

Independent comparison corpus: **gujilab/chinese-classical-corpus**, commit `09a6873e46760f20027e20bf48814f5c5cc05d66`, `output/wujing/zhouyi.json`. Upstream dedicates structured classical data under **CC0 1.0 Universal**. Full upstream license and attribution are preserved in `knowledge/sources/corpus-LICENSE.txt`. Its declared source is 殆知阁 with Chinese Text Project gap completion. Only Zhouyi text is retained; no modern translation/training dataset is included. See https://creativecommons.org/publicdomain/zero/1.0/.

Both are digital transcriptions, not a verified facsimile or critical edition. Differences are retained in `knowledge/collation.json` and disclosed in the UI. See `docs/SOURCES.md` for provenance, checks and limits.

## Software

Runtime dependencies: React / React DOM (MIT), Express (MIT), Zod (MIT), Helmet (MIT), lucide-react (ISC; Lucide icon artwork ISC). Development dependencies include Vite (MIT), Vitest (MIT), TypeScript (Apache-2.0), tsx (MIT), esbuild (MIT), Prettier (MIT), Playwright (Apache-2.0), and DefinitelyTyped type declarations (MIT). Exact versions and transitive packages are locked in `package-lock.json`; their original notices remain in the installed packages. Review with `npm ls --all` and each package's LICENSE before redistributing a dependency bundle.

UI illustration, coin rendering and logo mark are original CSS/SVG. Fonts use operating-system fallbacks; no font files, stock videos, trackers or analytics are distributed.

## Qimen calendar (1.4.0)

The installed npm artifact is pinned by lockfile integrity; npm's gitHead metadata refers to a commit whose package.json still says 1.8.6. See SOURCES for this provenance detail; no exact source-to-artifact reproducibility claim is made.

`lunar-typescript` **1.8.7**, Copyright (c) 2020 6tail, MIT. Locked npm integrity is in `package-lock.json`. The complete upstream notice is preserved verbatim in `knowledge/sources/lunar-typescript-LICENSE.txt` and `public/licenses/lunar-typescript-LICENSE.txt`, the latter included in production browser assets. Source: [6tail/lunar-typescript](https://github.com/6tail/lunar-typescript), inspected commit `293f91ece5e5f437f1b86ded179f45eedaf7920f`. Only calendar fields are used; library divination/almanac recommendations are not presented as application forecasts.

Qimen arrangement code, UI and reading text are original MysticAtlas code/commentary. Public-domain classical rule terminology and factual palace tables are not modern translations. Contemporary tutorials and Hong Kong Observatory tables are linked for rule/sample verification; no article bodies, textbook images or almanac PDFs are redistributed. The worked Q1 fixture records factual symbol placements, not the tutorial's authored explanatory prose. See QIMEN_RULES and SOURCES for the distinction between school conventions, independent samples and original interpretation.

## Face detector and example (1.3.0)

MediaPipe Tasks Vision **0.10.21** (Google / MediaPipe authors) is Apache-2.0. The browser worker bundles its JavaScript and serves its unmodified WASM locally. The full upstream license, including its additional notices, is retained at `public/face/APACHE-2.0.txt` and copied beside generated runtime assets. Original bundle legal comments are preserved by esbuild. Package integrity is pinned in `package-lock.json`.

The unmodified Face Landmarker **float16/1** task is served from `public/face/face_landmarker.task`. The [official Face Mesh V2 model card](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20MediaPipe%20Face%20Mesh%20V2.pdf) identifies Apache-2.0 licensing. Exact official download URL, byte size and SHA-256 are in `public/face/assets.json`. These third-party artifacts are not relicensed under the project's MIT license.

`public/face/example.png`: public-domain NASA portrait supplied by scikit-image, pinned to scikit-image v0.25.2 commit `e8a42ba85aaf5fd9322ef9ca51bc21063b22fcae`. The [official data reference](https://scikit-image.org/docs/stable/api/skimage.data.html#skimage.data.astronaut) credits NASA's Great Images database and records public-domain status. Attribution is displayed with the example. Use is demonstrative; no endorsement is implied. Browser evidence includes this same example with landmark overlays.

The “three regions / five eyes” notes are short original educational paraphrases with a link to a [Tsinghua University Press portrait-drawing sample](https://www.tup.tsinghua.edu.cn/upload/books/yz/043619-01.pdf). No textbook illustrations, scans or passages are copied. These drawing conventions are not personal-trait or fate claims.
