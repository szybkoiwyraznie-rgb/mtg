/** Pomocnicy testowe współdzielone między plikami testów. */
import { writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

/** Sprawdza składnię JS przez node --check (bez uruchamiania). */
export async function checkSkładni(kod) {
  const plik = path.join(tmpdir(), `codex-check-${process.pid}-${Date.now()}.js`);
  await writeFile(plik, kod, 'utf8');
  try {
    execFileSync(process.execPath, ['--check', plik], { stdio: 'pipe' });
  } finally {
    await rm(plik, { force: true });
  }
}
