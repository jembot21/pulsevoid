import { cpSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';
const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
writeFileSync(join(out, 'dossier.json'), buildDossier(out, {
  text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993, game_max_bytes: 50331648, game_path_max_bytes: 1000,
}));

const expectedScreenshots = ['1-cover.jpg', '2-title.jpg', '3-boss.jpg', '4-end.jpg'];
for (const name of expectedScreenshots) {
  const path = join(out, 'screenshots', name);
  if (!statSync(path, { throwIfNoEntry: false })?.isFile()) {
    throw new Error(`Output verification failed: missing expected screenshot ${path}`);
  }
}

function countFiles(directory: string): { files: number; bytes: number } {
  const total = { files: 0, bytes: 0 };
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      const nested = countFiles(path);
      total.files += nested.files;
      total.bytes += nested.bytes;
    } else if (entry.isFile()) {
      total.files++;
      total.bytes += statSync(path).size;
    }
  }
  return total;
}

const game = countFiles(join(out, 'game'));
const screenshots = countFiles(join(out, 'screenshots'));
console.log(`Output verified: ${game.files} game files (${game.bytes} bytes), ${screenshots.files} screenshots (${screenshots.bytes} bytes), ${game.bytes + screenshots.bytes} total bytes.`);
