#!/usr/bin/env node
/** Lorwyn–Shadowmoor T4 (ADR 0037): JEDNA geometria, dwa słowniki nazw.
 * Autorska rekonstrukcja z tekstu, bez geometrii odrzuconych fanmap.
 * Standardowe sceny można niezależnie renderować cli.mjs.
 * node tools/mapforge/lorwyn-scena-t4.mjs [katalog wyjściowy]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderuj, sprawdzWiazania } from './render.mjs';
import { chaikin, punktNa } from './geom.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const W = 2000, H = 1400;
const WIKI = 'https://mtg.wiki/page/';
const GUIDE = 'https://web.archive.org/web/20071102030827/http://www.wizards.com/default.asp?x=mtgcom/daily/db8';

// Każda lokalizacja jest deklarowana RAZ. Współrzędne są rekonstrukcją
// relacji (nie pomiarem z rastra); niepewność zapisana w map.json.
export const MIEJSCA_LORWYNU = [
  { id: 'zachod', dzien: 'Western Lorwyn', noc: 'Western Shadowmoor', x: 560, y: 1210, typ: 'region', fs: 40, duze: true,
    z: 'Lorwyn-Shadowmoor', opis: 'zachodnia część znanej krainy, po zachodniej/północnej stronie Wanderwine; pozycja tytułu umowna' },
  { id: 'great-forest', dzien: 'The Great Forest', noc: null, x: 470, y: 790, typ: 'region', fs: 28,
    z: 'Great_Forest', opis: 'wielki las zachodniej części Lorwynu; brak wymyślonego odpowiednika nazwy w Shadowmoor (nie utożsamiamy z Creakwood)' },
  { id: 'gilt-leaf', dzien: 'Gilt-Leaf Wood', noc: 'Wilt-Leaf Wood', x: 1490, y: 665, typ: 'region', fs: 33,
    z: 'Gilt-Leaf_Wood/Wilt-Leaf_Wood', opis: 'wschodni las; Wilt-Leaf leży na wschód od Mistmeadow, po drugiej stronie Wanderbrine' },
  { id: 'wrens-run', dzien: "Wren's Run", noc: "Raven's Run", x: 525, y: 340, typ: 'kraina', fs: 20,
    z: "Wren%27s_Run/Raven%27s_Run", opis: 'łowiska w obrębie zachodniego Wielkiego Lasu; dokładne miejsce w lesie jest rekonstrukcją' },
  { id: 'burrenton', dzien: 'Burrenton', noc: 'Barrenton', x: 720, y: 485, typ: 'osada', glif: 'miasto', fs: 17,
    z: 'Burrenton/Barrenton', opis: 'osada kithkin, kowale i kuźnie; orientacyjna pozycja przy północnych podnóżach, nie kanoniczne współrzędne' },
  { id: 'ballyrush', dzien: 'Ballyrush', noc: 'Ballynock', x: 410, y: 670, typ: 'osada', glif: 'miasto', fs: 17,
    z: 'Ballynock', opis: 'clachan/doun kithkin; lokalizacja wewnątrz krainy osad jest umowna' },
  { id: 'cloverdell', dzien: 'Cloverdell', noc: 'Thistledown', x: 340, y: 1035, typ: 'osada', glif: 'miasto', fs: 17,
    z: 'Cloverdell/Thistledown', opis: 'clachan chroniony przez treefolk; położenie przy lesie jako rekonstrukcja, para nazw poświadczona w wiki' },
  { id: 'goldmeadow', dzien: 'Goldmeadow', noc: 'Mistmeadow', x: 890, y: 670, typ: 'osada', glif: 'miasto', fs: 18,
    z: 'Goldmeadow/Mistmeadow', opis: 'Mistmeadow na północ od Kinscaer i na zachód od Wilt-Leaf, za Wanderbrine' },
  { id: 'kinsbaile', dzien: 'Kinsbaile', noc: 'Kinscaer', x: 895, y: 1030, typ: 'osada', glif: 'miasto', fs: 20, skala: 1.35,
    z: 'Kinsbaile/Kinscaer', opis: 'duża osada kithkin; Kinscaer na południe od Mistmeadow; wspólna pozycja atlasowa nie opisuje losu mieszkańców po przemianie' },
  { id: 'lys-alana', dzien: 'Lys Alana', noc: 'Cayr Ulios', x: 1500, y: 445, typ: 'osada', glif: 'miasto', fs: 20, skala: 1.4,
    z: 'Lys_Alana/Caer_Ulios', opis: 'stolica Gilt-Leaf / safehold Wilt-Leaf; pisownia Cayr z Eventide; osada wewnątrz wschodniego lasu' },
  { id: 'mudbutton', dzien: 'Mudbutton Warren', noc: 'Greasewretch Warren', x: 1195, y: 855, typ: 'osada', glif: 'miasto', fs: 15, skala: 0.9,
    z: 'Lorwyn-Shadowmoor', opis: 'para osad boggartów; pozycja przy mokradłach jest rekonstrukcją, nie odczytem z mapy fanowskiej' },
  { id: 'bosk', dzien: 'Murmuring Bosk', noc: 'Weeping Bosk', x: 920, y: 395, typ: 'gaj', glif: 'drzewo', fs: 16, skala: 1.9,
    z: 'Murmuring_Bosk/Weeping_Bosk', opis: 'gaj nad Wanderwine/Wanderbrine, w Wielkim Lesie i daleko od Kinsbaile; pozycja przy górnym biegu rzeki jest relacyjna' },
  { id: 'glen-elendra', dzien: 'Glen Elendra', noc: 'Glen Elendra', x: 1560, y: 1130, typ: 'gaj', glif: 'drzewo', fs: 22, skala: 2.7,
    z: 'Glen_Elendra', opis: 'ukryta górska dolina na południe od Lys Alana/Cayr Ulios, osłaniana przez Oonę; symbol gaju nie oznacza położenia tronu ani granicy stu akrów glen' },
  { id: 'tanufel', dzien: 'Mount Tanufel', noc: 'Mount Kulrath', x: 945, y: 225, typ: 'szczyt', glif: 'szczyt', fs: 18, skala: 2,
    z: 'Mount_Tanufel/Mount_Kulrath', opis: 'najwyższy szczyt i obszar źródłowy Wanderwine; umieszczenie na północy jest wyborem rekonstrukcji, nie kanonicznym azymutem' },
  { id: 'zrodlo', dzien: 'Source of Lanes', noc: '(źródło Wanderbrine)', x: 1020, y: 290, typ: 'akwen', fs: 14, woda: true,
    z: 'Mount_Tanufel', opis: 'małe jezioro źródłowe blisko szczytu Tanufel; nocny napis jest opisem funkcji na wspólnym układzie, nie dopisanym kanonicznym imieniem' },
  { id: 'wanderwine', dzien: 'Wanderwine', noc: 'Wanderbrine', x: 1020, y: 1190, typ: 'rzeka', fs: 21, kat: -79, woda: true,
    z: 'Wanderwine_River/Wanderbrine_River', opis: 'główna arteria rozdzielająca zachodnią krainę od Gilt-Leaf/Wilt-Leaf; dolny bieg wychodzi poza kadr, bez wymyślonego morza' },
  { id: 'velis-vel', dzien: 'Velis Vel', noc: 'Velis Vel', x: 620, y: 995, typ: 'grota', glif: 'jaskinia', fs: 17, skala: 1.3,
    z: 'Velis_Vel', opis: 'podziemna grota changelingów, dostępna przez sieć Dark Meanders; położenie symboliczne w zachodniej krainie, nie pomiar wejścia' },
];

const rzekaGlowna = [[1020,290],[1020,360],[1080,505],[1040,650],[995,785],[1095,940],[1075,1100],[1100,1250],[1090,1510]];
const zbieg = (t) => punktNa(chaikin(rzekaGlowna, 2, false), t).map((v) => Math.round(v * 10) / 10);
const WODY = MIEJSCA_LORWYNU.filter((m) => m.woda).flatMap((m) => [m.dzien, m.noc]);

// Wspólny szkielet atlasu. Rzeki, lasy, polany, góry i znaczniki nie
// odczytują oblicza. Nazwy NIE zmieniają rozsiewu biomów (ADR 0025).
export function scenaLorwynu(oblicze) {
  if (!['lorwyn', 'shadowmoor'].includes(oblicze)) throw new Error(`Nieznane oblicze: ${oblicze}`);
  const nazwaDla = (m) => oblicze === 'lorwyn' ? m.dzien : m.noc;
  return {
    nazwa: 'lorwyn-shadowmoor-t4-wspolny-uklad', szerokosc: W, wysokosc: H, styl: 'atlas',
    opis: 'Autorska rekonstrukcja relacji przestrzennych epoki Oony, ADR 0037. Wspólna geometria, zmieniają się tylko etykiety. Bez matrycy odrzuconych map; znana kraina, nie cały glob. Rzeka kontynuuje bieg poza kadrem.',
    ocean: { kolor: '#e9e9e9' },
    lądy: [{ id: 'poznana-kraina', punkty: [[-60,-60],[2060,-60],[2060,1460],[-60,1460]] }],
    jeziora: [{ cx: 1020, cy: 290, rx: 24, ry: 15, opcje: { fale: false } }],
    rzeki: [{ id: 'wanderwine', punkty: rzekaGlowna, opcje: { s0: 3, s1: 10, zrodlo: false },
      doplywy: [
        { id: 'doplyw-zachodni', punkty: [[245,560],[440,555],[645,595],[815,605],zbieg(0.32)], opcje: { s0: 1.5, s1: 4 } },
        { id: 'doplyw-wschodni', punkty: [[1775,825],[1610,835],[1420,930],[1245,945],zbieg(0.58)], opcje: { s0: 1.5, s1: 4 } },
      ] }],
    pasma: [
      { id: 'gory-polnocne-z', punkty: [[115,175],[260,110],[430,150],[630,100],[805,140]], opcje: { szer: 52 } },
      { id: 'gory-polnocne-w', punkty: [[1100,140],[1310,100],[1550,150],[1780,110],[1880,185]], opcje: { szer: 52 } },
      { id: 'gory-zachodnie-n', punkty: [[110,200],[80,360],[120,480]], opcje: { szer: 43 } },
      { id: 'gory-zachodnie-s', punkty: [[110,640],[75,800],[100,960],[180,1180],[300,1280]], opcje: { szer: 47 } },
      { id: 'gory-wschodnie', punkty: [[1850,240],[1880,425],[1835,625],[1880,780]], opcje: { szer: 48 } },
      { id: 'glen-zachod', punkty: [[1340,1030],[1315,1150],[1390,1260]], opcje: { szer: 32 } },
      { id: 'glen-wschod', punkty: [[1800,935],[1860,1100],[1760,1270]], opcje: { szer: 40 } },
    ],
    biomy: [
      { id: 'las-zachodni-polnoc', typ: 'las', punkty: [[180,260],[760,245],[935,340],[945,480],[835,530],[380,500],[170,435]], opcje: { gestosc: 0.48, skala: 0.95 } },
      { id: 'las-zachodni-poludnie', typ: 'las', punkty: [[180,640],[530,620],[775,665],[865,760],[790,930],[650,1040],[360,1100],[170,910]], opcje: { gestosc: 0.5, skala: 1 } },
      { id: 'las-wschodni', typ: 'las', punkty: [[1210,315],[1700,300],[1795,470],[1780,660],[1660,800],[1490,860],[1280,760],[1200,510]], opcje: { gestosc: 0.65, skala: 1.05 } },
      { id: 'otoczenie-glen', typ: 'las', punkty: [[1450,965],[1630,950],[1740,1060],[1700,1215],[1480,1240],[1405,1130]], opcje: { gestosc: 0.75, skala: 1 } },
      { id: 'mokradla-przy-rzece', typ: 'bagno', punkty: [[1140,760],[1260,785],[1320,865],[1210,910],[1140,875]], opcje: { gestosc: 0.6 } },
      { id: 'pola-osad-zachodu', typ: 'step', punkty: [[220,560],[725,555],[930,650],[915,895],[950,1110],[835,1340],[330,1350],[230,1180]], opcje: { gestosc: 0.36 } },
      { id: 'wschodnie-polany', typ: 'step', punkty: [[1200,970],[1340,880],[1720,845],[1900,900],[1850,1320],[1190,1340]], opcje: { gestosc: 0.18 } },
    ],
    // Wyłącznie orientacyjne połączenia osad kithkin; żadnej drogi do
    // ukrytej Glen Elendra i żadnych wymyślonych nazw traktów.
    drogi: [
      { id: 'osady-kithkin', punkty: [[720,485],[820,565],[890,670],[890,815],[895,1030],[740,1130],[510,1120],[340,1035]], opcje: { typ: 'szlak' } },
      { id: 'ballyrush-goldmeadow', punkty: [[410,670],[570,585],[700,595],[890,670]], opcje: { typ: 'szlak' } },
    ],
    poi: MIEJSCA_LORWYNU.filter((m) => m.glif).map((m) => ({ id: m.id, typ: m.glif, x: m.x, y: m.y,
      opcje: { skala: m.skala ?? 1, ...(m.glif === 'szczyt' ? { snieg: false } : {}) } })),
    etykiety: MIEJSCA_LORWYNU.filter(nazwaDla).map((m) => ({ tekst: nazwaDla(m), x: m.x, y: m.y,
      opcje: { fs: m.fs, kotwica: 'middle', ...(m.glif ? { przyDo: [m.x,m.y] } : {}),
        ...(m.kat ? { kat: m.kat } : {}), ...(m.duze ? { duze: true } : {}) } })),
    strefyWodne: WODY, etykietyWodne: WODY,
    kompas: { x: 1860, y: 1280, r: 38 }, skala: false,
    ramka: { margines: 22, passePartout: true },
  };
}

export function modelMapyLorwynu() {
  const zrodlo = { url: GUIDE, url2: `${WIKI}Lorwyn-Shadowmoor`, tytul: 'Lorwyn–Shadowmoor — kanon tekstowy epoki Oony; autorska rekonstrukcja relacji',
    autor: 'MTG Lore Codex, mapforge (bez użycia geometrii odrzuconych fanmap)',
    licencja: 'praca własna; glify gór mapome CC-BY-4.0 (ADR 0020)', pobrano: '2026-09-07',
    notka: 'Jeden wspólny układ T4 i dwa zestawy nazw (ADR 0037). Wspólna geometria jest konwencją atlasową, nie zaprzeczeniem przemian Wielkiej Zorzy. Pozycje umowne realizują opisane relacje; brak kanonicznych współrzędnych i skali. Zasięgi lasów/bezimiennych dopływów i połączenia osad są rekonstrukcją, nie odczytem z grafiki. Rzeka wychodzi poza kadr; brak wymyślonego oceanu. Eclipsed i nowe po nim lokacje poza zakresem.' };
  return {
    plan: 'lorwyn', tytul: 'Lorwyn–Shadowmoor', wariant: 'T4', podklad: 'podklad.svg', wymiary: { szerokosc: W, wysokosc: H },
    rekonstrukcja: true, epoka: 'epoka Oony — klasyczne oblicza Lorwyn i Shadowmoor', zrodlo,
    uklad_wspolrzednych: 'Autorski układ wspólnej sceny T4 2000×1400. Warianty różnią się wyłącznie etykietami; obie kalibracje tożsamościowe z konstrukcji i testu identyczności geometrii, nie z proporcji odrębnych rastrów.',
    warianty: ['shadowmoor','lorwyn'].map((id) => ({ id, ...(id === 'shadowmoor' ? { domyslny: true } : {}),
      tytul: id === 'shadowmoor' ? 'Shadowmoor' : 'Lorwyn', wariant: 'T4',
      epoka: `${id === 'shadowmoor' ? 'nocne' : 'dzienne'} oblicze — epoka Oony`,
      podklad: id === 'shadowmoor' ? 'podklad.svg' : 'podklad-lorwyn.svg',
      wymiary: { szerokosc: W, wysokosc: H }, etykiety: true,
      kalibracja: { sx: 1, sy: 1, ox: 0, oy: 0 }, zrodlo })),
    kotwice: MIEJSCA_LORWYNU.map((m) => ({ nazwa: m.noc && m.noc !== m.dzien ? `${m.dzien} / ${m.noc}` : m.dzien,
      x: m.x/W, y: m.y/H, typ: m.typ,
      pozycja_zrodlo: `${m.opis}; ${WIKI}${m.z}. Współrzędne: rekonstrukcja relacyjna Kodeksu, nie pomiar kanoniczny.`,
      notka: m.noc ? `Lorwyn: ${m.dzien}; Shadowmoor: ${m.noc}.` : 'Nazwa występuje tylko w dziennym zestawie; nie wymyślono nocnego aliasu.' })),
    pinezki: [{ karta: '605shm-consign-to-dream', x: 0.755, y: 0.7714, pewnosc: 'region',
      uzasadnienie: 'Fabuła właściciela: ostępy Glen Elendra, Oona, wróżki i usypiany olbrzym. Punkt w zalesionym otoczeniu górskiej doliny na południe od Lys Alana/Cayr Ulios; bez przypisywania sceny do konkretnego miejsca pałacu. Współrzędne są wspólne w obu obliczach T4, zgodnie z ADR 0037.' }],
    regiony: [], scena: 'scena.json', generator: 'tools/mapforge/lorwyn-scena-t4.mjs',
    silnik: 'mapforge atlas; wspólna geometria, dwa słowniki etykiet; jaskinia Velis Vel ma własny glif',
    zrodlo_fanmapa: null,
    poza_zakresem: ['Lorwyn Eclipsed — dopiero przy karcie wymagającej tego stanu', 'Niepotwierdzone odpowiedniki nazw i nowe lokacje po upadku Oony', 'Odrzucone rastry Varghedina i pozostałych autorów — nie są matrycą geometrii'],
  };
}

export function zapiszLorwyn(katalog = path.join(ROOT, 'maps/lorwyn')) {
  fs.mkdirSync(katalog, { recursive: true });
  for (const oblicze of ['shadowmoor','lorwyn']) {
    const scena = scenaLorwynu(oblicze);
    const uwagi = sprawdzWiazania(scena);
    if (uwagi.length) throw new Error(`${oblicze}: ${uwagi.join('; ')}`);
    fs.writeFileSync(path.join(katalog, oblicze === 'shadowmoor' ? 'scena.json' : 'scena-lorwyn.json'), JSON.stringify(scena, null, 1)+'\n');
    fs.writeFileSync(path.join(katalog, oblicze === 'shadowmoor' ? 'podklad.svg' : 'podklad-lorwyn.svg'), renderuj(scena));
  }
  // Rejestr pinezek jest źródłem danych kolekcji, nie wynikiem renderu.
  // Inicjalizujemy go tylko raz; rerender NIE usuwa kolejnych kart ani
  // ręcznie uzasadnionych kotwic. Zmiany kotwic wymagają świadomej edycji
  // map.json i przechodzą test spójności z geometrią.
  const mapaPlik = path.join(katalog, 'map.json');
  if (!fs.existsSync(mapaPlik)) fs.writeFileSync(mapaPlik, JSON.stringify(modelMapyLorwynu(),null,1)+'\n');
  console.log(`Lorwyn–Shadowmoor: wspólna geometria, ${MIEJSCA_LORWYNU.length} kotwic; ${katalog}`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) zapiszLorwyn(process.argv[2]);
