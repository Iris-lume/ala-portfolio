import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
function exactFile(relative) {
  let dir = root;
  for (const part of relative.split('/')) {
    if (!readdirSync(dir).includes(part)) throw new Error(`Missing file or case mismatch: ${relative}`);
    dir = join(dir, part);
  }
  if (!statSync(dir).isFile()) throw new Error(`Not a file: ${relative}`);
  return dir;
}
const files = new Set(['index.html']);
function inspect(relative) {
  const source = readFileSync(exactFile(relative), 'utf8');
  const references = [...source.matchAll(/\/(?:public|src)\/[\w./-]+/g)].map(m => m[0].slice(1));
  if (relative.endsWith('.js')) for (const match of source.matchAll(/\b(?:from\s*|import\s*)['"](\.\.?\/[^'"]+)['"]/g)) {
    references.push(new URL(match[1], `https://build.invalid/${relative}`).pathname.slice(1));
  }
  for (const ref of references) {
    if (!/^(src|public)\//.test(ref) || ref.split('/').some(part => part === '..' || part === '.')) throw new Error(`Unexpected build path: ${ref}`);
    if (files.has(ref)) continue;
    files.add(ref);
    exactFile(ref);
    if (ref.startsWith('src/')) inspect(ref);
  }
}
inspect('index.html');
rmSync(output, { recursive: true, force: true });
for (const file of files) {
  const target = join(output, file);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(exactFile(file), target);
}
console.log(`Built ${files.size} files into dist/`);
