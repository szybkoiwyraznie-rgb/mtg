/**
 * Wspólny graf zależności modułów ESM — używany przez build.mjs i testy.
 *
 * Sklejony artefakt ma jeden wspólny zasięg (dziedziczone z mtg-game
 * ADR 0011/0002; lekcja L3), więc:
 * - cykliczny import po cichu zgubiłby moduł — jest twardym błędem;
 * - kolizja nazw na najwyższym poziomie modułów nadpisałaby symbol —
 *   jest wykrywana przed sklejeniem.
 */

import fs from 'node:fs';
import path from 'node:path';

export const IMPORT_RE = /^[ \t]*import\s+(?:[\s\S]*?\s+from\s+)?['"](\.[^'"]+)['"];?[ \t]*$/gm;
export const REEXPORT_RE = /^[ \t]*export\s+\{[^}]*\}\s+from\s+['"](\.[^'"]+)['"];?[ \t]*$/gm;

function dependenciesOf(source) {
  return [...source.matchAll(IMPORT_RE), ...source.matchAll(REEXPORT_RE)].map((m) => m[1]);
}

/** Rozwiązuje graf importów w kolejności „najgłębsze pierwsze"; rzutuje przy cyklu. */
export function collectModules(entry, { rootDir = '.' } = {}) {
  const modules = [];
  const state = new Map(); // abs -> 'visiting' | 'done'

  function visit(abs, stack) {
    const seen = state.get(abs);
    if (seen === 'done') return;
    if (seen === 'visiting') {
      const cycle = [...stack.slice(stack.indexOf(abs)), abs]
        .map((p) => path.relative(rootDir, p))
        .join(' -> ');
      throw new Error(
        `Wykryto cykliczny import: ${cycle}\n` +
        'Sklejony plik ma jeden zasięg, więc cykl po cichu zgubiłby moduł. Rozerwij zależność.',
      );
    }
    state.set(abs, 'visiting');

    const source = fs.readFileSync(abs, 'utf8');
    for (const dep of dependenciesOf(source)) {
      visit(path.resolve(path.dirname(abs), dep), [...stack, abs]);
    }

    state.set(abs, 'done');
    modules.push({ abs, source });
  }

  visit(path.resolve(rootDir, entry), []);
  return modules;
}

/** Wykrywa kolizje nazw — jeden zasięg oznacza brak izolacji modułów. */
export function assertNoNameCollisions(modules, { rootDir = '.' } = {}) {
  const declared = new Map();
  // Tylko poziom modułu: deklaracja zaczyna się w kolumnie 0.
  // Zmienne lokalne (z wcięciem) po sklejeniu zostają w swoich funkcjach.
  const declRe = /^(?:export\s+)?(?:async\s+)?(?:function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/gm;
  const problems = [];

  for (const { abs, source } of modules) {
    const rel = path.relative(rootDir, abs);
    for (const m of source.matchAll(declRe)) {
      const name = m[1];
      if (declared.has(name)) {
        problems.push(`  "${name}" — ${declared.get(name)} oraz ${rel}`);
      } else {
        declared.set(name, rel);
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(
      'Kolizje nazw na poziomie modułów (po sklejeniu byłoby ciche nadpisanie):\n' +
      problems.join('\n'),
    );
  }
}
