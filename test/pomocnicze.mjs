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

/**
 * Mini-shim DOM dla testu dymnego UI (konwencja mtg-game: własny harness,
 * zero jsdom). Patchuje PRAWDZIWY globalThis (kod artefaktu czyta
 * globalThis.document/location) i przywraca stan po teście.
 *
 * Każdy plik testowy node --test biega w osobnym procesie, więc mutacja
 * globalu jest bezpieczna, o ile przywracamy w tym samym pliku.
 */
export function stworzShim() {
  const app = {
    _innerHTML: '',
    set innerHTML(v) { this._innerHTML = String(v); },
    get innerHTML() { return this._innerHTML; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    scrollTop: 0,
  };

  const nasluch = {};
  const zapisane = {
    document: globalThis.document,
    location: globalThis.location,
    addEventListener: globalThis.addEventListener,
    removeEventListener: globalThis.removeEventListener,
    scrollTo: globalThis.scrollTo,
  };

  globalThis.document = {
    title: 'MTG Lore Codex',
    getElementById: (id) => (id === 'app' ? app : null),
    querySelector: () => null,
  };
  globalThis.location = { hash: '#/' };
  globalThis.addEventListener = (typ, fn) => { nasluch[typ] = fn; };
  globalThis.removeEventListener = () => {};
  globalThis.scrollTo = () => {};

  return {
    app,
    nasluch,
    get tytul() { return globalThis.document.title; },
    /** Nawigacja testowa: ustawia hash i odpala hashchange. */
    idz(hash) {
      globalThis.location.hash = hash;
      nasluch.hashchange?.();
    },
    /** Przywraca oryginalne globaly (wywołać po teście). */
    przywroc() {
      for (const [k, v] of Object.entries(zapisane)) {
        if (v === undefined) delete globalThis[k];
        else globalThis[k] = v;
      }
    },
  };
}
