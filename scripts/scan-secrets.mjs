import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
const skip = new Set(['.git', 'node_modules', 'dist', 'output', '.playwright-cli', 'Agent']);
const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,})\b/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
];
let files = 0;
const failures = [];
function walk(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(item.name)) continue;
    const path = join(dir, item.name);
    if (item.isDirectory()) {
      walk(path);
      continue;
    }
    if (/^\.env(?:\.|$)/.test(item.name) && item.name !== '.env.example') {
      failures.push(relative(process.cwd(), path));
      continue;
    }
    if (
      !/\.(?:[cm]?[jt]sx?|py|json|md|ya?ml|txt|html|css)$/.test(item.name) &&
      item.name !== '.env.example'
    )
      continue;
    files++;
    const text = readFileSync(path, 'utf8');
    if (patterns.some((pattern) => pattern.test(text)))
      failures.push(relative(process.cwd(), path));
  }
}
walk(process.cwd());
console.log(
  `Secret-pattern scan: ${files} text files, ${failures.length} findings. Heuristic only; does not replace manual review.`,
);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
