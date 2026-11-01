// Copies the web app (one HTML file, its manifest and icons) next to the desktop shell, so the installer carries the same Stagehand the browser runs.
import { cpSync, existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url)), web = join(here, '..', '..'), out = join(here, '..', 'app');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
// the minified copy from tools/build.mjs when it has been built, otherwise the readable source
cpSync(existsSync(join(web, 'dist', 'index.html')) ? join(web, 'dist', 'index.html') : join(web, 'index.html'), join(out, 'index.html'));
cpSync(join(web, 'manifest.webmanifest'), join(out, 'manifest.webmanifest'));
cpSync(join(web, 'icons'), join(out, 'icons'), { recursive: true });
// the app icon for the installers: 1024 px with the margin Mac icons expect (electron-builder makes the .icns and .ico from it)
cpSync(join(here, '..', 'icon.png'), join(here, '..', 'build', 'icon.png'));
const pkg = JSON.parse(readFileSync(join(here, '..', 'package.json'), 'utf8'));
writeFileSync(join(out, 'version.json'), JSON.stringify({ version: pkg.version }));
console.log(`Prepared Stagehand ${pkg.version} in ${out}`);
