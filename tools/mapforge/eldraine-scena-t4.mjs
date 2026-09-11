#!/usr/bin/env node
/** Eldraine T4 (ADR 0038): Autorska rekonstrukcja relacji przestrzennych
 * Pięciu Dworów (The Five Courts) i Kniei (The Wilds) w silniku mapforge.
 *
 * Uruchomienie: node tools/mapforge/eldraine-scena-t4.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderuj, sprawdzWiazania } from './render.mjs';
import { chaikin, punktNa } from './geom.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const W = 2000, H = 1400;
const WIKI = 'https://mtg.wiki/page/';
const GUIDE = 'https://magic.wizards.com/en/news/feature/planeswalkers-guide-eldraine-2019-10-31';

export const MIEJSCA_ELDRAINE = [
  // --- REGIONY GŁÓWNE (DWORY I KNIEJE) ---
  { id: 'the-wilds-n', nazwa: 'The Wilds', x: 820, y: 130, typ: 'region', fs: 36, duze: true,
    z: 'The_Wilds', opis: 'Północne bezkresne Knieje, kraina pierwotnej magii fae i leśnych bestii' },
  { id: 'the-wilds-s', nazwa: 'The Wilds', x: 960, y: 1320, typ: 'region', fs: 34, duze: true,
    z: 'The_Wilds', opis: 'Południowe rubieże Dziczy poza domenami Królestwa' },
  { id: 'the-wilds-w', nazwa: 'The Wilds', x: 190, y: 560, typ: 'region', fs: 30, duze: true,
    z: 'The_Wilds', opis: 'Zachodnie ostępy Kniei otaczające Lochmere i bagniska' },
  { id: 'the-wilds-e', nazwa: 'The Wilds', x: 1820, y: 680, typ: 'region', fs: 30, duze: true,
    z: 'The_Wilds', opis: 'Wschodnie rubieże Kniei rozciągające się ku odległym szczytom' },

  { id: 'ardenvale-region', nazwa: 'Highlands of Arden', x: 1000, y: 740, typ: 'region', fs: 26, duze: true,
    z: 'Ardenvale', opis: 'Słoneczne wyżyny Arden i serce Białego Dworu Lojalności' },
  { id: 'vantress-region', nazwa: 'Vantress', x: 480, y: 260, typ: 'region', fs: 28, duze: true,
    z: 'Vantress', opis: 'Dolina jeziora Lochmere i Niebieski Dwór Wiedzy' },
  { id: 'locthwain-region', nazwa: 'Locthwain Fens', x: 470, y: 1180, typ: 'region', fs: 26, duze: true,
    z: 'Locthwain', opis: 'Mroczne mokradła, Czarne Jezioro i Czarny Dwór Wytrwałości' },
  { id: 'embereth-region', nazwa: 'Embereth', x: 1530, y: 860, typ: 'region', fs: 28, duze: true,
    z: 'Embereth', opis: 'Wulkaniczne wzgórza, wolne miasto i Czerwony Dwór Odwagi' },
  { id: 'garenbrig-region', nazwa: 'Garen Valley', x: 1560, y: 560, typ: 'region', fs: 26, duze: true,
    z: 'Garenbrig', opis: 'Pradawna dolina megalitycznych kręgów i Zielony Dwór Siły' },

  // --- ARDENVALE (BIAŁY DWÓR) ---
  { id: 'castle-ardenvale', nazwa: 'Castle Ardenvale', x: 1000, y: 650, typ: 'twierdza', glif: 'fort', fs: 20, skala: 1.5,
    z: 'Castle_Ardenvale', opis: 'Monumentalna biała twierdza i historyczna stolica Najwyższego Króla' },
  { id: 'circle-of-loyalty', nazwa: 'The Circle of Loyalty', x: 940, y: 600, typ: 'miejsce_mocy', glif: 'kolumny', fs: 16, skala: 1.2,
    z: 'The_Circle_of_Loyalty', opis: 'Święty krąg białego płomienia próby rycerskiej' },
  { id: 'archers-tower', nazwa: "Archer's Tower", x: 1070, y: 620, typ: 'wieza', glif: 'iglica', fs: 15, skala: 1.1,
    z: 'Ardenvale', opis: 'Wysoka wieża strażnicza strzegąca wschodnich podejść pod zamek' },
  { id: 'wealdrum', nazwa: 'Wealdrum', x: 860, y: 550, typ: 'osada', glif: 'miasto', fs: 15, skala: 1.0,
    z: 'Ardenvale', opis: 'Malownicza wieś rolnicza na zachodnich wyżynach Arden' },
  { id: 'wesling', nazwa: 'Wesling', x: 1150, y: 560, typ: 'osada', glif: 'miasto', fs: 15, skala: 1.0,
    z: 'Ardenvale', opis: 'Rycerska wieś na północno-wschodnich traktach Arden' },
  { id: 'trekell', nazwa: 'Trekell', x: 1120, y: 790, typ: 'osada', glif: 'miasto', fs: 15, skala: 1.0,
    z: 'Ardenvale', opis: 'Miasteczko targowe na południowo-wschodnim trakcie' },

  // --- VANTRESS (NIEBIESKI DWÓR) ---
  { id: 'castle-vantress', nazwa: 'Castle Vantress', x: 480, y: 400, typ: 'twierdza', glif: 'fort', fs: 19, skala: 1.4,
    z: 'Castle_Vantress', opis: 'Twierdza na wyspie otoczonej wodospadem na jeziorze Lochmere' },
  { id: 'lochmere', nazwa: 'Lochmere', x: 480, y: 490, typ: 'akwen', fs: 17, woda: true,
    z: 'Vantress', opis: 'Głębokie jezioro skrywające sekrety i podwodne groty syren' },
  { id: 'indrelon', nazwa: 'Indrelon (Magic Mirror)', x: 550, y: 360, typ: 'miejsce_mocy', glif: 'plac', fs: 15, skala: 1.1,
    z: 'The_Magic_Mirror', opis: 'Zatopione sanktuarium Magicznego Zwierciadła Indrelon' },

  // --- LOCTHWAIN (CZARNY DWÓR) ---
  { id: 'castle-locthwain', nazwa: 'Castle Locthwain', x: 470, y: 1010, typ: 'twierdza', glif: 'fort', fs: 19, skala: 1.4,
    z: 'Castle_Locthwain', opis: 'Lewitujący zamek z czarnego kamienia unoszący się nad moczarami' },
  { id: 'loch-locthwain', nazwa: 'The Black Tarns', x: 470, y: 1090, typ: 'akwen', fs: 16, woda: true,
    z: 'Locthwain', opis: 'Czarne, mgliste wody i bagniska u stóp lewitującej twierdzy' },
  { id: 'cauldron-eternity', nazwa: 'Cauldron of Eternity', x: 540, y: 970, typ: 'miejsce_mocy', glif: 'plac', fs: 15, skala: 1.1,
    z: 'The_Cauldron_of_Eternity', opis: 'Mityczny kocioł wskrzeszenia spoczywający w Locthwain' },

  // --- EMBERETH (CZERWONY DWÓR) ---
  { id: 'castle-embereth', nazwa: 'Castle Embereth', x: 1510, y: 960, typ: 'twierdza', glif: 'fort', fs: 19, skala: 1.4,
    z: 'Castle_Embereth', opis: 'Warowny ośrodek i siedziba rady rycerskiej Czerwonego Dworu' },
  { id: 'the-burning-yard', nazwa: 'The Burning Yard', x: 1430, y: 1020, typ: 'arena', glif: 'plac', fs: 17, skala: 1.3,
    z: 'Embereth', opis: 'Monumentalny poligon, szranki i areny rycerskich prób ognia (lokacja karty 209ELD)' },
  { id: 'the-irencrag', nazwa: 'The Irencrag', x: 1590, y: 920, typ: 'szczyt', glif: 'szczyt', fs: 16, skala: 1.6,
    z: 'The_Irencrag', opis: 'Mistyczny wulkaniczny głaz, w którym rycerze hartują swe miecze' },
  { id: 'tournament-grounds', nazwa: 'Tournament Grounds', x: 1360, y: 940, typ: 'miejsce', glif: 'plac', fs: 15, skala: 1.1,
    z: 'Tournament_Grounds', opis: 'Błonia wielkich turniejów rycerskich Królestwa' },

  // --- GARENBRIG (ZIELONY DWÓR) ---
  { id: 'castle-garenbrig', nazwa: 'Castle Garenbrig', x: 1480, y: 430, typ: 'twierdza', glif: 'fort', fs: 19, skala: 1.4,
    z: 'Castle_Garenbrig', opis: 'Wielka twierdza olbrzymów wzniesiona na naturalnym skalnym okapie' },
  { id: 'the-great-henge', nazwa: 'The Great Henge', x: 1420, y: 370, typ: 'miejsce_mocy', glif: 'kolumny', fs: 16, skala: 1.4,
    z: 'The_Great_Henge', opis: 'Starożytny megalityczny portal i kręgi menhirów' },
  { id: 'gnomon-stone', nazwa: 'Gnomon Stone', x: 1530, y: 390, typ: 'miejsce', glif: 'szczyt', fs: 15, skala: 1.2,
    z: 'Garenbrig', opis: 'Potężny kamień górujący nad tronem króla Yorvo' },

  // --- KNIEJE / THE WILDS (PUNKTY ORIENTACYJNE) ---
  { id: 'tuinvale', nazwa: 'Tuinvale', x: 790, y: 280, typ: 'las', glif: 'drzewo', fs: 18, skala: 2.0,
    z: 'Tuinvale_Treefolk', opis: 'Pradawny las prastarych drzew, wróżek i dzikich stworzeń' },
  { id: 'the-heart-land', nazwa: 'The Heart Land', x: 1090, y: 270, typ: 'ruina', glif: 'ruina', fs: 17, skala: 1.3,
    z: 'The_Heart_Land', opis: 'Ruiny dawnego serca imperium elfów z czterema piramidami i obeliskami' },
  { id: 'edgewall-inn', nazwa: 'Edgewall Inn', x: 740, y: 790, typ: 'osada', glif: 'miasto', fs: 16, skala: 1.1,
    z: 'Edgewall_Inn', opis: 'Słynna karczma i osada na samej granicy Królestwa i Kniei' },
  { id: 'stormkeld', nazwa: 'Stormkeld', x: 1780, y: 310, typ: 'twierdza', glif: 'iglica', fs: 17, skala: 1.3,
    z: 'Beluna_Grandsquall', opis: 'Podniebny zamek burzowej olbrzymki Beluny Grandsquall' },
  { id: 'witchs-cottage', nazwa: "Witch's Cottage", x: 230, y: 730, typ: 'miejsce', glif: 'jaskinia', fs: 15, skala: 1.1,
    z: "Witch%27s_Cottage", opis: 'Piernikowa chatka czarownicy pośród zdradliwych bagien i lasów Kniei' },
  { id: 'dynnistan', nazwa: 'Dynnistan', x: 220, y: 230, typ: 'twierdza', glif: 'fort', fs: 16, skala: 1.1,
    z: 'Dynnistan', opis: 'Lodowy zamek Królowej Cieni w odległych północno-zachodnich rubieżach' },
  { id: 'river-crossing', nazwa: "Syr Carenth's Crossing", x: 1220, y: 920, typ: 'miejsce', glif: 'most', fs: 14, skala: 1.0,
    z: 'Eldraine', opis: 'Strategiczny most i przeprawa na trakcie ku Embereth' },
];

const rzekaKrolewskaPts = [
  [1540, 220], [1370, 310], [1230, 420], [1190, 620], [1180, 850], [1140, 1060], [1100, 1230], [1080, 1510]
];
const zbiegKrolewski = (t) => punktNa(chaikin(rzekaKrolewskaPts, 2, false), t).map((v) => Math.round(v * 10) / 10);

const WODY = MIEJSCA_ELDRAINE.filter((m) => m.woda).map((m) => m.nazwa);

export function scenaEldraine() {
  return {
    nazwa: 'eldraine-t4-plan-krolestwo-i-knieje',
    szerokosc: W,
    wysokosc: H,
    styl: 'atlas',
    opis: 'Autorska rekonstrukcja relacji przestrzennych Pięciu Dworów i Kniei planu Eldraine, ADR 0038. Wymiary 2000×1400 px, styl atlasowy achromatyczny.',
    ocean: { kolor: '#e6e6e6' },
    lądy: [
      { id: 'kontynent-eldraine', punkty: [[-60, -60], [2060, -60], [2060, 1460], [-60, 1460]] }
    ],
    jeziora: [
      // Jezioro Lochmere (Vantress)
      { cx: 480, cy: 420, rx: 170, ry: 120, opcje: { fale: true } },
      // Czarne Moczary (Loch Locthwain)
      { cx: 470, cy: 1040, rx: 140, ry: 90, opcje: { fale: true } },
    ],
    rzeki: [
      // Rzeka Królewska (spływa z Gór Północnych, mija Ardenvale i uchodzi na południu poza kadr)
      {
        id: 'rzeka-krolewska',
        punkty: rzekaKrolewskaPts,
        opcje: { s0: 3, s1: 10, zrodlo: true, ujscie: { typ: 'morze' } },
        doplywy: [
          // Dopływ z Wyżyn Arden
          { id: 'doplyw-arden', punkty: [[960, 770], [1040, 820], zbiegKrolewski(0.55)], opcje: { s0: 1.5, s1: 4 } },
          // Dopływ z Kniei Północnych (Tuinvale)
          { id: 'doplyw-tuinvale', punkty: [[870, 300], [1050, 360], zbiegKrolewski(0.22)], opcje: { s0: 1.5, s1: 4.5 } },
        ]
      },
      // Rzeka wpadająca do Lochmere z północnych gór
      {
        id: 'rzeka-lochmere-n',
        punkty: [[270, 120], [350, 230], [420, 320]],
        opcje: { s0: 2, s1: 6, zrodlo: true, ujscie: { typ: 'jezioro' } }
      },
      // Rzeka wypływająca z Loch Locthwain na zachód poza kadr
      {
        id: 'rzeka-locthwain-w',
        punkty: [[340, 1050], [250, 1120], [160, 1210], [-90, 1310]],
        opcje: { s0: 4, s1: 9, zrodlo: false, ujscie: { typ: 'morze' } }
      }
    ],
    pasma: [
      // Góry Północno-Zachodnie (wokół Dynnistan)
      { id: 'gory-polnocny-zachod', punkty: [[80, 160], [220, 110], [380, 140]], opcje: { szer: 48 } },
      // Góry Północno-Wschodnie (wokół Garenbrig i Stormkeld)
      { id: 'gory-garenbrig-stormkeld', punkty: [[1280, 180], [1480, 130], [1680, 180], [1880, 260]], opcje: { szer: 54 } },
      // Pasmo Wulkaniczne Irencrag (Embereth)
      { id: 'pasmo-irencrag', punkty: [[1380, 1100], [1520, 1160], [1680, 1190], [1850, 1120]], opcje: { szer: 52 } },
      // Wzgórza Południowo-Zachodnie (za Locthwain)
      { id: 'wzgorza-poludniowo-zachodnie', punkty: [[120, 940], [180, 1080], [260, 1260]], opcje: { szer: 42 } },
    ],
    biomy: [
      // Knieje Tuinvale i północne lasy
      { id: 'las-tuinvale', typ: 'las', punkty: [[640, 160], [920, 150], [980, 340], [880, 420], [670, 390]], opcje: { gestosc: 0.62, skala: 1.05 } },
      // Las Garenbrig wokół Doliny Garen
      { id: 'las-garenbrig', typ: 'las', punkty: [[1320, 320], [1640, 300], [1720, 480], [1620, 620], [1360, 580], [1280, 440]], opcje: { gestosc: 0.58, skala: 1.0 } },
      // Bagna i moczary Locthwain
      { id: 'mokradla-locthwain', typ: 'bagno', punkty: [[310, 930], [620, 910], [640, 1140], [480, 1220], [290, 1170]], opcje: { gestosc: 0.65 } },
      // Lasy Kniei Zachodnich (wokół Chatki Czarownicy)
      { id: 'las-zachodni-dzicz', typ: 'las', punkty: [[100, 610], [330, 590], [350, 820], [120, 850]], opcje: { gestosc: 0.55, skala: 0.95 } },
      // Słoneczne pola Wyżyn Arden
      { id: 'pola-ardenvale', typ: 'step', punkty: [[780, 500], [1220, 490], [1250, 760], [1130, 900], [820, 890], [740, 710]], opcje: { gestosc: 0.32 } },
      // Płaskowyż turniejowy i pola Embereth
      { id: 'step-embereth', typ: 'step', punkty: [[1300, 840], [1680, 820], [1720, 1040], [1320, 1060]], opcje: { gestosc: 0.28 } },
      // Wschodnie Knieje
      { id: 'las-wschodnie-knieje', typ: 'las', punkty: [[1680, 520], [1920, 500], [1940, 880], [1720, 860]], opcje: { gestosc: 0.52, skala: 1.0 } },
    ],
    drogi: [
      // Trakt Królewski Zachodni: Ardenvale -> Wealdrum -> Vantress
      { id: 'trakt-vantress', punkty: [[1000, 650], [860, 550], [710, 470], [580, 420], [480, 400]], opcje: { typ: 'droga' } },
      // Trakt Królewski Południowo-Zachodni: Ardenvale -> Edgewall -> Locthwain
      { id: 'trakt-locthwain', punkty: [[1000, 650], [860, 720], [740, 790], [610, 890], [470, 1010]], opcje: { typ: 'droga' } },
      // Trakt Królewski Południowo-Wschodni: Ardenvale -> Trekell -> Syr Carenth's Crossing -> Tournament Grounds -> Burning Yard -> Castle Embereth
      { id: 'trakt-embereth', punkty: [[1000, 650], [1120, 790], [1220, 920], [1360, 940], [1430, 1020], [1510, 960]], opcje: { typ: 'droga' } },
      // Trakt Królewski Północno-Wschodni: Ardenvale -> Wesling -> Garen Valley -> Castle Garenbrig
      { id: 'trakt-garenbrig', punkty: [[1000, 650], [1150, 560], [1320, 510], [1480, 430]], opcje: { typ: 'droga' } },
      // Szlak do The Heart Land i Tuinvale
      { id: 'szlak-serce-elfow', punkty: [[1000, 650], [1040, 450], [1090, 270]], opcje: { typ: 'szlak' } },
    ],
    poi: MIEJSCA_ELDRAINE.filter((m) => m.glif).map((m) => ({
      id: m.id,
      typ: m.glif,
      x: m.x,
      y: m.y,
      opcje: { skala: m.skala ?? 1, ...(m.glif === 'szczyt' ? { snieg: false } : {}) }
    })),
    etykiety: MIEJSCA_ELDRAINE.map((m) => ({
      tekst: m.nazwa,
      x: m.x,
      y: m.y,
      opcje: {
        fs: m.fs,
        kotwica: 'middle',
        ...(m.glif ? { przyDo: [m.x, m.y] } : {}),
        ...(m.duze ? { duze: true } : {})
      }
    })),
    strefyWodne: WODY,
    etykietyWodne: WODY,
    kompas: { x: 1860, y: 1280, r: 38 },
    skala: false,
    ramka: { margines: 22, passePartout: true },
  };
}

export function modelMapyEldraine() {
  const zrodlo = {
    url: GUIDE,
    url2: `${WIKI}Eldraine`,
    tytul: "Planeswalker's Guide to Eldraine — oficjalny kanon geograficzny Pięciu Dworów i Kniei; autorska rekonstrukcja relacji T4",
    autor: 'MTG Lore Codex, silnik mapforge (rekonstrukcja T4 wg ADR 0038)',
    licencja: 'praca własna; glify gór i lasów mapome CC-BY-4.0 (ADR 0020)',
    pobrano: '2026-09-11',
    notka: 'Autorska rekonstrukcja wektorowa T4 dla planu Eldraine w układzie 2000×1400 px. Wobec braku oficjalnej mapy WotC oraz niskiej jakości i niekanoniczności fanowskich rastrów, mapa realizuje kanoniczną geometrię Pięciu Dworów (Ardenvale w centrum, Vantress na jeziorze Lochmere, lewitujące Locthwain na moczarach, Embereth przy głazie Irencrag i poligonach Burning Yard, Garenbrig przy Great Henge) opasanych przez Knieje (The Wilds). Rzeki, trakty królewskie i biomy są w pełni spójne z zasadami hydrologii i etykietowania Codexu.'
  };

  return {
    plan: 'eldraine',
    tytul: 'Eldraine',
    wariant: 'T4',
    podklad: 'podklad.svg',
    wymiary: { szerokosc: W, wysokosc: H },
    rekonstrukcja: true,
    epoka: 'Era Pięciu Dworów (przed i w trakcie wydarzeń Throne of Eldraine / Wilds of Eldraine)',
    zrodlo,
    uklad_wspolrzednych: 'Autorski układ sceny T4 2000×1400 px wygenerowany deterministycznie w silniku mapforge (ADR 0018, ADR 0038).',
    kotwice: MIEJSCA_ELDRAINE.map((m) => ({
      nazwa: m.nazwa,
      x: m.x / W,
      y: m.y / H,
      typ: m.typ,
      pozycja_zrodlo: `${m.opis}; ${WIKI}${m.z}. Rekonstrukcja relacyjna Codexu.`
    })),
    pinezki: [
      {
        karta: '209eld-burning-yard-trainer',
        x: 0.715,
        y: 0.7286,
        pewnosc: 'dokladna',
        uzasadnienie: 'Scena 209ELD: Instruktor szermierki i młody rycerz na piaszczystej arenie przed płonącym torem przeszkód — poligon The Burning Yard przy Czerwonym Dworze Embereth / rycerskich szrankach Królestwa (x: 1430, y: 1020).'
      }
    ],
    scena: 'scena.json',
    generator: 'tools/mapforge/eldraine-scena-t4.mjs',
    silnik: 'mapforge atlas; pełna geometria T4 z hydrologią i kompletem kotwic Pięciu Dworów',
    zrodlo_fanmapa: null,
    poza_zakresem: [
      'Głębokie, pozawymiarowe enklawy Kniei nieposiadające stałych współrzędnych przestrzennych',
      'Inwazja Nowej Fyreksji — stan planu w erze klasycznej Dworów'
    ]
  };
}

export function zapiszEldraine(katalog = path.join(ROOT, 'maps/eldraine')) {
  fs.mkdirSync(katalog, { recursive: true });
  const scena = scenaEldraine();
  const uwagi = sprawdzWiazania(scena);
  if (uwagi.length) throw new Error(`Błędy wiązań sceny Eldraine: ${uwagi.join('; ')}`);

  fs.writeFileSync(path.join(katalog, 'scena.json'), JSON.stringify(scena, null, 1) + '\n');
  fs.writeFileSync(path.join(katalog, 'podklad.svg'), renderuj(scena));

  const mapaPlik = path.join(katalog, 'map.json');
  fs.writeFileSync(mapaPlik, JSON.stringify(modelMapyEldraine(), null, 1) + '\n');
  console.log(`Eldraine T4 wygenerowane pomyślnie: ${MIEJSCA_ELDRAINE.length} kotwic w ${katalog}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  zapiszEldraine(process.argv[2]);
}
