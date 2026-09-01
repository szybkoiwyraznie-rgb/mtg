#!/usr/bin/env node
/**
 * mapforge/cli.mjs — generator SVG ze sceny (ADR 0018).
 *
 *   node tools/mapforge/cli.mjs scena.json -o podklad.svg
 *   node tools/mapforge/cli.mjs --demo [plik.svg]   # wyspa pokazowa (wszystkie klocki)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderuj } from './render.mjs';

export { renderuj };

/** Scena pokazowa: „Wyspa Próbna" — katalog klocków mapforge na jednym obrazie. */
export function scenaDemo() {
  return {
    nazwa: 'demo-wyspa-probna',
    szerokosc: 2000,
    wysokosc: 1400,
    ocean: { seed: 'demo-ocean', plamy: 30 },
    lądy: [
      { id: 'glowna', punkty: [
        [420, 520], [560, 360], [760, 300], [980, 330], [1180, 300], [1360, 380],
        [1500, 540], [1540, 720], [1440, 900], [1500, 1040], [1360, 1180],
        [1160, 1220], [980, 1180], [820, 1240], [640, 1180], [500, 1060],
        [380, 900], [300, 720],
      ] },
      { id: 'ostial', punkty: [[1700, 1030], [1762, 985], [1832, 1028], [1812, 1092], [1732, 1102]] },
    ],
    biomy: [
      { id: 'polnoc', typ: 'las', punkty: [[620, 430], [900, 385], [1140, 420], [1170, 545], [980, 600], [710, 560]] },
      { id: 'poludnie-zachod', typ: 'las', punkty: [[465, 865], [640, 805], [795, 862], [815, 975], [660, 1035], [510, 980]], opcje: { gestosc: 0.8 } },
      { id: 'mokradla', typ: 'bagno', punkty: [[845, 1060], [1075, 1040], [1175, 1120], [1040, 1195], [885, 1178]] },
      { id: 'step', typ: 'step', punkty: [[900, 700], [1180, 680], [1280, 780], [1160, 900], [945, 862]] },
    ],
    pasma: [
      { id: 'gracz-burzowa', punkty: [[1120, 470], [1280, 430], [1420, 470], [1490, 575]], opcje: { szer: 50, snieg: true } },
    ],
    wulkany: [{ x: 1330, y: 622, opcje: { skala: 1.1 } }],
    jeziora: [
      { cx: 1180, cy: 560, rx: 46, ry: 28 },
      { cx: 1000, cy: 1120, rx: 26, ry: 14 },
    ],
    rzeki: [
      { id: 'srebrna', punkty: [[1182, 590], [1150, 680], [1122, 780], [1082, 880], [1062, 990], [1078, 1100], [1086, 1178]], opcje: { s0: 3, s1: 9 },
        doplywy: [{ id: 'zachodni', punkty: [[648, 822], [800, 862], [950, 902], [1058, 905]] }] },
    ],
    drogi: [
      { id: 'szlak-ruiny', punkty: [[545, 688], [680, 622], [780, 562], [848, 515]], opcje: { typ: 'szlak' } },
      { id: 'trakt', punkty: [[545, 702], [700, 762], [880, 822], [975, 885]], opcje: { typ: 'droga' } },
    ],
    poi: [
      { typ: 'miasto', x: 520, y: 690 },
      { typ: 'miasto', x: 980, y: 900 },
      { typ: 'ruina', x: 860, y: 500 },
      { typ: 'hedron', x: 1250, y: 760, opcje: { opacity: 0.75 } },
      { typ: 'hedron', x: 1630, y: 940, opcje: { opacity: 0.6, skala: 0.8 } },
    ],
    etykiety: [
      { tekst: 'Wyspa Próbna', x: 950, y: 748, opcje: { fs: 42, duze: true } },
      { tekst: 'Las Północny', x: 700, y: 452, opcje: { fs: 16, ital: true, kat: -5 } },
      { tekst: 'Las Dębowy', x: 640, y: 940, opcje: { fs: 15, ital: true, kat: 8 } },
      { tekst: 'Mokradła Południowe', x: 1000, y: 1160, opcje: { fs: 15, ital: true, kat: 3 } },
      { tekst: 'Step Środkowy', x: 1090, y: 790, opcje: { fs: 15, ital: true } },
      { tekst: 'Grań Burzowa', x: 1300, y: 418, opcje: { fs: 16, ital: true } },
      { tekst: 'Rzeka Srebrna', x: 1112, y: 862, opcje: { fs: 13, ital: true, kat: 70 } },
      { tekst: 'Biały Brod', x: 520, y: 726, opcje: { fs: 14 } },
      { tekst: 'Port Ciszy', x: 980, y: 936, opcje: { fs: 14 } },
      { tekst: 'Ruiny Vhal', x: 860, y: 532, opcje: { fs: 14, ital: true } },
      { tekst: 'Góra Ash', x: 1330, y: 662, opcje: { fs: 14, ital: true } },
      { tekst: 'Wyspa Ostial', x: 1766, y: 1064, opcje: { fs: 14, ital: true } },
    ],
    etykietyLukowe: [
      { id: 'zatoka', punkty: [[880, 1258], [1010, 1292], [1140, 1262]], tekst: 'Zatoka Ciszy', opcje: { fs: 16 } },
    ],
    kompas: { x: 1870, y: 180, r: 42 },
    skala: { x: 1700, y: 1300, px: 150, km: 150 },
    ramka: true,
  };
}

export function main(argv = process.argv.slice(2)) {
  const args = argv;
  const demoIdx = args.indexOf('--demo');
if (demoIdx !== -1) {
  const cel = args[demoIdx + 1]?.endsWith('.svg') ? args[demoIdx + 1] : 'maps/_warsztat/podklad.svg';
  fs.mkdirSync(path.dirname(cel), { recursive: true });
  fs.writeFileSync(cel, renderuj(scenaDemo()), 'utf8');
  console.log(`OK — demo zapisane: ${cel}`);
} else if (args[0]) {
  const scena = JSON.parse(fs.readFileSync(args[0], 'utf8'));
  const outIdx = args.indexOf('-o');
  const cel = outIdx !== -1 ? args[outIdx + 1] : 'podklad.svg';
  fs.writeFileSync(cel, renderuj(scena), 'utf8');
  console.log(`OK — ${scena.nazwa ?? 'scena'} → ${cel}`);
} else {
  console.log('użycie: cli.mjs scena.json -o out.svg | cli.mjs --demo [out.svg]');
  return 1;
}
  return 0;
}

const jestMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (jestMain) process.exit(main());
