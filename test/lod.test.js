/**
 * Piramida LOD (ADR 0039): matematyka siatki kafelków + spójność
 * manifestu z plikami + integracja narzędzia tnącego (skip bez convert).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siatkaKafli, kafleDlaRect } from '../src/codex/render-map.js';
import { tnij, czyDostepnyConvert } from '../tools/kafle.mjs';

test('siatka 8100×5200 / 512 → 16×11, brzegowe kafelki węższe', () => {
  const s = siatkaKafli(8100, 5200, 512);
  assert.equal(s.kolumny, 16);
  assert.equal(s.wiersze, 11);
  assert.deepEqual(s.prost(0), { c: 0, r: 0, x: 0, y: 0, w: 512, h: 512 });
  const ostatni = s.prost(16 * 11 - 1);
  assert.equal(ostatni.c, 15);
  assert.equal(ostatni.r, 10);
  assert.equal(ostatni.w, 8100 - 15 * 512); // 420
  assert.equal(ostatni.h, 5200 - 10 * 512); // 80
});

test('kafleDlaRect: całość → 176, wycinek → kilka, clamp poza [0,1]', () => {
  const m = { kolumny: 16, wiersze: 11 };
  assert.equal(kafleDlaRect(m, 0, 0, 1, 1).length, 176);
  const wycinek = kafleDlaRect(m, 0.1, 0.1, 0.2, 0.2);
  assert.ok(wycinek.length >= 1 && wycinek.length <= 9, `wycinek: ${wycinek.length}`);
  // determinizm i row-major: posortowane rosnąco
  assert.deepEqual([...wycinek].sort((a, b) => a - b), wycinek);
  const poza = kafleDlaRect(m, -0.5, -0.5, 1.5, 1.5);
  assert.equal(poza.length, 176);
});

test('manifest Dominarii zgadza się z plikami kafelków na dysku', (t) => {
  const manifestSciezka = 'maps/dominaria/manifest.json';
  if (!fs.existsSync(manifestSciezka)) return t.skip('brak maps/dominaria/manifest.json (najpierw tnij master)');
  const manifest = JSON.parse(fs.readFileSync(manifestSciezka, 'utf8'));
  const kat = 'maps/dominaria/kafle';
  const pliki = fs.readdirSync(kat).filter((f) => /^k\d{3}\.jpg$/.test(f)).sort();
  assert.equal(pliki.length, manifest.kolumny * manifest.wiersze);
  assert.equal(pliki[0], 'k000.jpg');
  assert.equal(pliki[pliki.length - 1], `k${String(manifest.kolumny * manifest.wiersze - 1).padStart(3, '0')}.jpg`);
  for (const f of ['l0.jpg', 'mini.jpg']) {
    assert.ok(fs.existsSync(path.join('maps/dominaria', f)), `brak ${f}`);
  }
});

test('tnij() na mini-obrazku daje siatkę 4×2 + manifest', (t) => {
  if (!czyDostepnyConvert()) return t.skip('brak ImageMagicka w środowisku');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kafle-'));
  try {
    execFileSync('convert', ['-size', '100x60', 'plasma:fractal', path.join(tmp, 'm.jpg')]);
    const manifest = tnij({ master: path.join(tmp, 'm.jpg'), out: path.join(tmp, 'o'), rozmiar: 32, l0: 96, mini: 48 });
    assert.equal(manifest.kolumny, 4);
    assert.equal(manifest.wiersze, 2);
    assert.equal(fs.readdirSync(path.join(tmp, 'o', 'kafle')).length, 8);
    assert.ok(fs.existsSync(path.join(tmp, 'o', 'manifest.json')));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
