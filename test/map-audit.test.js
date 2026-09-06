/**
 * Weryfikator map (tools/map-audit.py) — brama integralności podkładów
 * (SKILL_MAPA_PLANU §11 pkt 3: „0 problemów obowiązkowe”) + test reguły
 * „TYTUŁ NA OBIEKCIE” (znalezisko B2 audytu PR-20: tytuły regionów Alary v2
 * leżały na forcie/paśmie, a audyt raportował 0, bo kolizje liczył tylko
 * tekst×tekst).
 *
 * Skrypt jest w Pythonie (stdlib). Gdy w środowisku nie ma python3, testy
 * są pomijane z adnotacją — nie udajemy zieleni, ale też nie blokujemy
 * reszty pakietu.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const SKRYPT = path.resolve('tools/map-audit.py');
const python = (() => {
  for (const kandydat of ['python3', 'python']) {
    const r = spawnSync(kandydat, ['--version'], { encoding: 'utf8' });
    if (r.status === 0) return kandydat;
  }
  return null;
})();

function audyt(...args) {
  const r = spawnSync(python, [SKRYPT, ...args], { encoding: 'utf8' });
  return { status: r.status, out: `${r.stdout}\n${r.stderr}` };
}

/** Minimalny podkład w konwencji mapforge (atlas): kwadratowy ląd (≥16
 * wierzchołków — próg map-audit), tytuł regionu i jeden glif fortu. */
function podklad({ fortX, fortY }) {
  const pts = [];
  for (let i = 0; i <= 10; i++) pts.push(`${100 + i * 80} 100`);
  for (let i = 1; i <= 10; i++) pts.push(`900 ${100 + i * 80}`);
  for (let i = 1; i <= 10; i++) pts.push(`${900 - i * 80} 900`);
  for (let i = 1; i < 10; i++) pts.push(`100 ${900 - i * 80}`);
  const d = `M ${pts.join(' L ')} Z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
<rect width="1000" height="1000" fill="#d4e2ee"/>
<path d="${d}" fill="#f7f7f7" stroke="#333"/>
<g class="mf-fort" data-x="${fortX}" data-y="${fortY}"><circle cx="${fortX}" cy="${fortY}" r="12" fill="#f7f7f7" stroke="#6b6b6b"/></g>
<text x="500" y="500" font-size="66" fill="#000000" class="tytul-kontynentu" text-anchor="middle">Kraina</text>
</svg>
`;
}

function katalogZ(svg) {
  const kat = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-map-audit-'));
  fs.writeFileSync(path.join(kat, 'podklad.svg'), svg, 'utf8');
  return kat;
}

test('map-audit: wszystkie podkłady repo bez problemów (brama passu mapowego)', (t) => {
  if (!python) return t.skip('brak python3 w środowisku');
  const { status, out } = audyt();
  assert.equal(status, 0, `map-audit zgłasza problemy:\n${out}`);
  assert.match(out, /RAZEM PROBLEMÓW: 0/);
});

test('map-audit: tytuł regionu na glifie obiektu = problem (B2, audyt PR-20)', (t) => {
  if (!python) return t.skip('brak python3 w środowisku');
  // Fort w polu tytułu „Kraina” fs66 @(500,500): box ≈ x 377–623, y 446–516.
  const kat = katalogZ(podklad({ fortX: 560, fortY: 480 }));
  try {
    const { status, out } = audyt(kat);
    assert.equal(status, 1, `oczekiwany kod 1, wyjście:\n${out}`);
    assert.match(out, /TYTUŁ NA OBIEKCIE: 'Kraina' @\(500,500\) × mf-fort @\(560,480\)/);
  } finally {
    fs.rmSync(kat, { recursive: true, force: true });
  }
});

test('map-audit: tytuł regionu obok glifu (poza boxem + margines 6) = OK', (t) => {
  if (!python) return t.skip('brak python3 w środowisku');
  // Ten sam fort 60 px pod dolną krawędzią boxu tytułu — napis go nie zakrywa.
  const kat = katalogZ(podklad({ fortX: 560, fortY: 580 }));
  try {
    const { status, out } = audyt(kat);
    assert.equal(status, 0, `oczekiwany kod 0, wyjście:\n${out}`);
    assert.doesNotMatch(out, /TYTUŁ NA OBIEKCIE/);
  } finally {
    fs.rmSync(kat, { recursive: true, force: true });
  }
});
