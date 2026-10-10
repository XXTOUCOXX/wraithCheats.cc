// Copies folders that live at the repo root and must be served untouched.
// java/script.js is uploaded directly via GitHub, so it never moves into public/.
import { cpSync, existsSync } from 'node:fs';

for (const dir of ['java', 'uploads']) {
  if (existsSync(dir)) {
    cpSync(dir, `dist/${dir}`, { recursive: true });
    console.log(`copied ${dir}/ -> dist/${dir}/`);
  }
}
