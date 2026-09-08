#!/usr/bin/env node
/**
 * Kafelkowanie master-rastra do piramidy LOD (ADR 0039).
 *
 * Wejście: ciężki master (np. Dominaria 8100×5200, ~10 MB).
 * Wyjście w katalogu docelowym:
 *   l0.jpg          — przeglądowa (~FHD), pierwszy render
 *   mini.jpg        — tylko podgląd lokalny warsztatu; mini-mapy kart
 *                     generuje build sam (ADR 0027 v3) — nie commitujemy
 *   kafle/kNNN.jpg  — kafelki L1 (row-major, N = wiersz·kolumny + kolumna)
 *   manifest.json   — geometria siatki (czyta ją silnik i testy)
 *
 * Użycie:
 *   node tools/kafle.mjs <master.jpg> --out maps/dominaria [--rozmiar 512]
 *       [--l0 1920] [--mini 800] [--jakosc 82]
 *
 * Wymaga ImageMagicka (`convert`) — zewnętrzny binarik, zero zależności
 * npm (ADR 0002). Matematyka siatki (single source of truth) mieszka
 * w src/codex/render-map.js i jest importowana stamtąd.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { siatkaKafli } from '../src/codex/render-map.js';

export function czyDostepnyConvert() {
  try {
    execFileSync('convert', ['-version'], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function wymiaryObrazu(plik) {
  const out = execFileSync('identify', ['-format', '%w %h', plik], { encoding: 'utf8' });
  const [szer, wys] = out.trim().split(/\s+/).map(Number);
  if (!Number.isFinite(szer) || !Number.isFinite(wys)) throw new Error(`identify nie odczytał wymiarów: ${plik}`);
  return { szerokosc: szer, wysokosc: wys };
}

function parsujArgs(argv) {
  const o = { rozmiar: 512, l0: 1920, mini: 800, jakosc: 82, out: null, master: null };
  const a = [...argv];
  if (a.length > 0 && !a[0].startsWith('--')) o.master = a.shift();
  while (a.length > 0) {
    const k = a.shift();
    const v = a.shift();
    if (k === '--out') o.out = v;
    else if (k === '--rozmiar') o.rozmiar = Number(v);
    else if (k === '--l0') o.l0 = Number(v);
    else if (k === '--mini') o.mini = Number(v);
    else if (k === '--jakosc') o.jakosc = Number(v);
    else throw new Error(`nieznana flaga: ${k}`);
  }
  if (!o.master || !o.out) throw new Error('użycie: kafle.mjs <master.jpg> --out <katalog> [opcje]');
  return o;
}

export function tnij({ master, out, rozmiar = 512, l0 = 1920, mini = 800, jakosc = 82 } = {}) {
  if (!czyDostepnyConvert()) throw new Error('brak ImageMagicka (`convert`) w środowisku');
  if (!fs.existsSync(master)) throw new Error(`brak mastera: ${master}`);
  const m = wymiaryObrazu(master);
  const siatka = siatkaKafli(m.szerokosc, m.wysokosc, rozmiar);
  fs.mkdirSync(out, { recursive: true });
  const katKafle = path.join(out, 'kafle');
  fs.mkdirSync(katKafle, { recursive: true });

  const l0plik = path.join(out, 'l0.jpg');
  execFileSync('convert', [master, '-resize', `${l0}x`, '-quality', '84', '-strip', l0plik]);
  const miniPlik = path.join(out, 'mini.jpg');
  execFileSync('convert', [master, '-resize', `${mini}x`, '-quality', '80', '-strip', miniPlik]);
  // %03d: row-major, zero-padded (k000.jpg …) — determinystyczne URL-e silnika.
  execFileSync('convert', [master, '-crop', `${rozmiar}x${rozmiar}`, '+repage', '-quality', String(jakosc),
    '-strip', '+adjoin', path.join(katKafle, 'k%03d.jpg')]);

  const pliki = fs.readdirSync(katKafle).filter((f) => /^k\d{3}\.jpg$/.test(f)).sort();
  if (pliki.length !== siatka.kolumny * siatka.wiersze) {
    throw new Error(`kafelków jest ${pliki.length}, siatka wymaga ${siatka.kolumny * siatka.wiersze}`);
  }
  const manifest = {
    narzedzie: 'tools/kafle.mjs (ADR 0039)',
    master: { plik: path.basename(master), szerokosc: m.szerokosc, wysokosc: m.wysokosc },
    rozmiar,
    kolumny: siatka.kolumny,
    wiersze: siatka.wiersze,
    format: 'jpg',
    wzorzec: 'kafle/k{nnn}.jpg (row-major, zero-padded)',
    l0: { plik: 'l0.jpg', ...wymiaryObrazu(l0plik) },
    mini: { plik: 'mini.jpg', ...wymiaryObrazu(miniPlik) },
    jakosc,
  };
  fs.writeFileSync(path.join(out, 'manifest.json'), `${JSON.stringify(manifest, null, 1)}\n`);
  return manifest;
}

// CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const o = parsujArgs(process.argv.slice(2));
  const manifest = tnij(o);
  console.log(`L0: ${manifest.l0.szerokosc}×${manifest.l0.wysokosc}, mini: ${manifest.mini.szerokosc}×${manifest.mini.wysokosc}, `
    + `kafelki: ${manifest.kolumny}×${manifest.wiersze} po ${manifest.rozmiar}px → ${o.out}`);
  console.log('Fragment do map.json ("kafle" w wariancie domyślnym):');
  console.log(JSON.stringify({
    katalog: 'kafle', rozmiar: manifest.rozmiar, kolumny: manifest.kolumny,
    wiersze: manifest.wiersze, wzorzec: 'k{nnn}.jpg', prog: 2.5,
  }, null, 1));
}
