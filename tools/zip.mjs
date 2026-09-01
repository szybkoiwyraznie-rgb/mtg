/**
 * Minimalny zapis archiwum ZIP (metoda STORE, bez kompresji) — zero zależności
 * (ADR 0002). Pierwotnie do pakowania artefaktu Codex (jednoplik + ewentualne
 * osobne pliki map) do samodzielnego ZIP-a, który właściciel pobiera i
 * rozpakowuje lokalnie.
 *
 * Użycie:
 *   import { napiszZip } from './zip.mjs';
 *   const buf = napiszZip([
 *     { path: 'index.html',        data: Buffer.from('<h1>/</h1>') },
 *     { path: 'maps/x.svg',        data: fs.readFileSync('x.svg') },
 *   ]);
 *   fs.writeFileSync('dist/mtg-lore-codex.zip', buf);
 *
 * Format STORE: nagłówek lokalny + dane + katalog centralny + EOCD.
 * CRC-32 liczony przez node:zlib.crc32 (wbudowane, bez zależności).
 */

import zlib from 'node:zlib';

const SIG_LOCAL = 0x04034b50;        // PK\x03\x04
const SIG_CENTRAL = 0x02014b50;      // PK\x01\x02
const SIG_EOCD = 0x06054b50;         // PK\x05\x06

/** Data → DOS time (16 bit) i DOS date (16 bit). */
export function dosCzas(data = new Date()) {
  const h = data.getHours();
  const min = data.getMinutes();
  const s = data.getSeconds();
  const d = data.getDate();
  const m = data.getMonth() + 1;
  const r = Math.max(1980, data.getFullYear()) - 1980;
  const time = (h << 11) | (min << 5) | (s >> 1);
  const date = (r << 9) | (m << 5) | d;
  return { time, date };
}

/**
 * Buduje Buffer ZIP z listy plików [{ path, data }]. `path` musi być
 * względną ścieżką z `/`. Zachowuje kolejność podaną (nie sortuje),
 * ale nie wymaga tej samej kolejności w katalogu centralnym co w lokalnej.
 */
export function napiszZip(pliki, opcje = {}) {
  const now = opcje.czas ?? new Date();
  const { time, date } = dosCzas(now);
  const lokalne = [];
  const centralne = [];
  let offset = 0;

  for (const p of pliki) {
    const name = Buffer.from(p.path.replaceAll('\\', '/'), 'utf8');
    const data = Buffer.isBuffer(p.data) ? p.data : Buffer.from(p.data);
    const crc = zlib.crc32(data) >>> 0;
    const rozmiar = data.length;

    // ── nagłówek lokalny ──
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(SIG_LOCAL, 0);
    lh.writeUInt16LE(20, 4);          // version needed
    lh.writeUInt16LE(0, 6);           // general purpose bit flag
    lh.writeUInt16LE(0, 8);           // method: store
    lh.writeUInt16LE(time, 10);
    lh.writeUInt16LE(date, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(rozmiar, 18);
    lh.writeUInt32LE(rozmiar, 22);
    lh.writeUInt16LE(name.length, 26);
    lh.writeUInt16LE(0, 28);          // extra field len

    lokalne.push(Buffer.concat([lh, name, data]));

    // ── nagłówek centralny ──
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(SIG_CENTRAL, 0);
    ch.writeUInt16LE(20, 4);          // version made by
    ch.writeUInt16LE(20, 6);          // version needed
    ch.writeUInt16LE(0, 8);           // flags
    ch.writeUInt16LE(0, 10);          // method
    ch.writeUInt16LE(time, 12);
    ch.writeUInt16LE(date, 14);
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(rozmiar, 20);
    ch.writeUInt32LE(rozmiar, 24);
    ch.writeUInt16LE(name.length, 28);
    ch.writeUInt16LE(0, 30);          // extra len
    ch.writeUInt16LE(0, 32);          // comment len
    ch.writeUInt16LE(0, 34);          // disk start
    ch.writeUInt16LE(0, 36);          // internal attrs
    ch.writeUInt32LE(0, 38);          // external attrs
    ch.writeUInt32LE(offset, 42);     // offset lokalnego nagłówka

    centralne.push(Buffer.concat([ch, name]));
    offset += lh.length + name.length + data.length;
  }

  const katalogCentralny = Buffer.concat(centralne);
  const srKatalog = Buffer.alloc(22);
  srKatalog.writeUInt32LE(SIG_EOCD, 0);
  srKatalog.writeUInt16LE(0, 4);
  srKatalog.writeUInt16LE(0, 6);
  srKatalog.writeUInt16LE(pliki.length, 8);
  srKatalog.writeUInt16LE(pliki.length, 10);
  srKatalog.writeUInt32LE(katalogCentralny.length, 12);
  srKatalog.writeUInt32LE(offset, 16);   // offset początku katalogu centralnego
  srKatalog.writeUInt16LE(0, 20);

  return Buffer.concat([...lokalne, katalogCentralny, srKatalog]);
}
