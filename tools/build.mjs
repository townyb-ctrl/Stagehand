// Release build: a smaller copy of the app in ../dist, for the live site and the desktop installer.
// index.html stays the readable source; this only minifies its one <style> and one <script> block.
// Usage: cd tools && npm install && npm run build
import { transform } from 'esbuild';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..'), out = join(root, 'dist');
const src = readFileSync(join(root, 'index.html'), 'utf8');

// the app's own style and script are the first <style> in the head and the last <script> in the body
const s0 = src.indexOf('<style>'), s1 = src.indexOf('</style>', s0);
const j0 = src.lastIndexOf('<script>'), j1 = src.lastIndexOf('</script>');
if (s0 < 0 || s1 < 0 || j0 < 0 || j1 < j0 || s1 > j0) throw new Error('Could not find the app style and script blocks');

const css = (await transform(src.slice(s0 + 7, s1), { loader: 'css', minify: true })).code;
// a classic script: top-level names stay as they are (other code and the tests call them by name)
const js = (await transform(src.slice(j0 + 8, j1), { loader: 'js', minify: true, target: 'es2020', legalComments: 'none' })).code;
if (js.includes('</script')) throw new Error('Minified script contains a closing script tag');

const html = src.slice(0, s0) + '<style>' + css.trim() + '</style>' + src.slice(s1 + 8, j0) + '<script>' + js.trim() + '</script>' + src.slice(j1 + 9);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'index.html'), html);
for (const f of ['manifest.webmanifest', 'sw.js']) cpSync(join(root, f), join(out, f));
cpSync(join(root, 'icons'), join(out, 'icons'), { recursive: true });
const kb = n => `${Math.round(n / 1024)} KB`;
console.log(`dist/index.html: ${kb(html.length)} (source ${kb(src.length)})`);
