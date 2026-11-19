import { cp, readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const site = new URL('./site/', import.meta.url);
const output = new URL('./dist/', import.meta.url);
const syntax = spawnSync(process.execPath, ['--check', 'site/app.js'], { stdio: 'inherit' });
if (syntax.status !== 0) process.exit(1);

const html = await readFile(new URL('index.html', site), 'utf8');
const script = await readFile(new URL('app.js', site), 'utf8');
const dependencies = [
  ...Array.from(html.matchAll(/(?:src|href)="((?!#)[^":]+)"/g), (match) => match[1]),
  ...Array.from(script.matchAll(/art: '([^']+)'/g), (match) => 'art/' + match[1])
];
for (const path of dependencies) {
  if (!(await stat(new URL(path, site))).isFile()) throw new Error('Recurso inválido: ' + path);
}
if (/\bvicky\b/i.test(html + script)) throw new Error('Revisa la grafía de Viki.');
await cp(site, output, { recursive: true });
console.log('Producción lista en dist/ (' + dependencies.length + ' referencias verificadas).');
