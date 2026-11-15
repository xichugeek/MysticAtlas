"""Compare core line statements against the separately downloaded corpus.

Ignores punctuation/whitespace and expands the repetition mark only; does not silently
replace differences or pretend the two digital transcriptions are critical editions.
"""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
primary = json.loads((root / 'knowledge/hexagrams.json').read_text(encoding='utf-8'))
corpus = json.loads((root / 'knowledge/sources/zhouyi-independent.json').read_text(encoding='utf-8'))
joined = '\n'.join(h['content'] for h in corpus)
markers = list(re.finditer(r'（([乾兑离震巽坎艮坤])下([乾兑离震巽坎艮坤])上）', joined))
normal = lambda s: re.sub(r'[^\u3400-\u9fff]', '', re.sub(r'([\u3400-\u9fff])々', r'\1\1', s))
line_pattern = r'(?:^|\n)\s*((?:初[六九]|[六九][二三四五]|上[六九]))[：，、．:]?\s*'
compared = 0
differences = []
unparsed = []
for idx, marker in enumerate(markers[:64]):
    segment = joined[marker.end():markers[idx+1].start() if idx+1 < len(markers) else len(joined)]
    entries = list(re.finditer(line_pattern, segment))
    for pos in range(6):
        h = primary[idx]
        if len(entries) < 6:
            unparsed.append({'id': idx+1, 'line':pos+1})
            continue
        match = entries[pos]
        end = entries[pos+1].start() if pos+1 < len(entries) else len(segment)
        independent = re.split(r'《[象彖文]|用[六九]|[\n\r]\s*象曰|[\n\r]\s*\d+[．.]', segment[match.end():end])[0].strip()
        source_line = match[1] + '：' + independent
        compared += 1
        if normal(h['lineTexts'][pos]) != normal(source_line):
            differences.append({'id':idx+1,'line':pos+1,'primary':h['lineTexts'][pos],'independent':source_line})
report = {'checkedAt':'2026-11-15','method':'Two independent digital transcriptions; punctuation and whitespace ignored. No automatic textual corrections. Not a critical edition.', 'compared':compared,'equal':compared-len(differences),'differences':differences,'unparsed':unparsed}
(root/'knowledge/collation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
