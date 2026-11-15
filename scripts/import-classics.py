"""Reproducible import of licensed classical text; never downloads at app runtime."""
import hashlib
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'knowledge' / 'sources'
DEST.mkdir(parents=True, exist_ok=True)
ANN = '6a32e5faa737b0d6facfcd571856fd8ae18d4439'


def get(url, filename):
    data = urllib.request.urlopen(url, timeout=30).read()
    (DEST / filename).write_bytes(data)
    return data


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


# The independent corpus commit is pinned after first import in manifest.json.
manifest_path = DEST / 'manifest.json'
old = json.loads(manifest_path.read_text(encoding='utf-8')) if manifest_path.exists() else {}
guji = old.get('independentCommit') or json.load(urllib.request.urlopen(
    'https://api.github.com/repos/gujilab/chinese-classical-corpus/commits/main'))['sha']
base = f'https://raw.githubusercontent.com/Ann1949/iching-kit/{ANN}/'
raw = get(base + 'src/data/classic.ts', 'iching-kit-classic.ts.txt')
get(base + 'LICENSE', 'iching-kit-LICENSE.txt')
independent = get(f'https://raw.githubusercontent.com/gujilab/chinese-classical-corpus/{guji}/output/wujing/zhouyi.json', 'zhouyi-independent.json')
get(f'https://raw.githubusercontent.com/gujilab/chinese-classical-corpus/{guji}/LICENSE', 'corpus-LICENSE.txt')

text = raw.decode('utf-8').split('export const HEXAGRAMS: Hexagram[] = [', 1)[1]
objects = re.findall(r'\n  \{\n(.*?)\n  \},', text, re.S)
records = []
codes = ['111', '110', '101', '100', '011', '010', '001', '000']
for obj in objects:
    def field(name):
        match = re.search(r'^    ' + name + r': (.*),$', obj, re.M)
        return json.loads(match[1]) if match else None
    identifier = field('id')
    yao = re.search(r'    yaoCi: \[\n(.*?)\n    \],', obj, re.S)[1]
    lines = [json.loads(s.strip().rstrip(',')) for s in yao.splitlines()]
    name = field('name')
    records.append({
        'id': identifier, 'name': name[0] if identifier in [1, 2, 29, 30, 51, 52, 57, 58] else name[2:],
        'fullName': name, 'pinyin': field('pinyin'), 'english': field('keyword'),
        'upper': codes[field('upper') - 1], 'lower': codes[field('lower') - 1],
        'bits': field('binary'), 'judgment': field('guaCi'), 'lineTexts': lines,
        'special': field('yong'), 'textLayer': '经 / Zhouyi core text',
        'source': {'title': '周易（简体整理本）', 'url': f'https://github.com/Ann1949/iching-kit/blob/{ANN}/src/data/classic.ts',
                   'version': ANN, 'license': 'Public-domain classical text; MIT data arrangement',
                   'checkedAt': '2026-11-15', 'status': 'versioned-transcription'},
        'version': '1.0.0',
    })
assert len(records) == 64 and all(len(h['lineTexts']) == 6 for h in records)
write(ROOT / 'knowledge' / 'hexagrams.json', records)

# Parse the independent corpus' explicit lower/upper labels, not our engine.
corpus = json.loads(independent)
joined = '\n'.join(item['content'] for item in corpus)
pairs = re.findall(r'（([乾兑离震巽坎艮坤])下([乾兑离震巽坎艮坤])上）', joined)
names = list('乾兑离震巽坎艮坤')
matrix = [{ 'id': i + 1, 'lowerName': lo, 'upperName': up,
            'lower': codes[names.index(lo)], 'upper': codes[names.index(up)] }
          for i, (lo, up) in enumerate(pairs[:64])]
write(ROOT / 'tests' / 'fixtures' / 'independent-mapping.json', matrix)
write(manifest_path, {
    'checkedAt': '2026-11-15', 'primaryCommit': ANN, 'independentCommit': guji,
    'files': {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(DEST.iterdir()) if p.name != 'manifest.json'},
    'independentPairCount': len(pairs),
})
print(f'Imported {len(records)} hexagrams, {sum(len(h["lineTexts"]) for h in records)} line texts; independent pairs: {len(pairs)}')
differences = [(h['id'], h['lower'], h['upper'], m['lower'], m['upper']) for h, m in zip(records, matrix)
               if (h['lower'], h['upper']) != (m['lower'], m['upper'])]
print('Mapping differences:', differences)
