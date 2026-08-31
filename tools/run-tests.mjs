#!/usr/bin/env node
/**
 * Runner testów wg tierów (konwencja mtg-game ADR 0019, tu bez benchmarków):
 * `npm test` = szybki rdzeń deweloperski, `npm run test:slow` = pliki z
 * manifestu, `npm run test:all` = pełny pakiet (brama PR/CI).
 *
 * Manifest wolnych plików: tools/test-manifest.json. Zasada dopisywania:
 * plik trafia tam, gdy jego samodzielny czas przekracza ~5 s.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'tools', 'test-manifest.json');

const mode = process.argv[2] ?? 'fast';
if (!['fast', 'slow', 'all'].includes(mode)) {
  console.error(`Użycie: node tools/run-tests.mjs [fast|slow|all] (dostałem: ${mode ?? '—'})`);
  process.exit(2);
}

const allFiles = fs.readdirSync(path.join(root, 'test'))
  .filter((name) => name.endsWith('.test.js'))
  .sort();
const slowSet = new Set(JSON.parse(fs.readFileSync(manifestPath, 'utf8')).slow);

const files = mode === 'slow'
  ? allFiles.filter((name) => slowSet.has(name))
  : mode === 'fast'
    ? allFiles.filter((name) => !slowSet.has(name))
    : allFiles;

if (files.length === 0) {
  console.error('Brak plików testowych dla trybu', mode);
  process.exit(1);
}

const concurrency = Math.max(4, Number(process.env.TEST_CONCURRENCY ?? 0) || 4);
const args = ['--test', `--test-concurrency=${concurrency}`, ...files.map((f) => path.join('test', f))];
console.error(`[run-tests] tryb=${mode} pliki=${files.length} konkurencja=${concurrency}`);
const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
process.exit(result.status ?? 1);
