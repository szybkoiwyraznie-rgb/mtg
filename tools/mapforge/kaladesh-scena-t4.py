#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Budowniczy sceny mapy Kaladeshu (T4 — rekonstrukcja kanoniczna, atlas).

Kanon nie podaje mapy planu ani współrzędnych (research T1→T4 z 2026-09-09,
docs/research/RESEARCH_2026-09-09-kaladesh-gearsmith-prodigy.md): mapa jest
rekonstrukcją RELACYJNĄ w mapforge — prawdziwe sąsiedztwa i przebiegi
rzek, umowne kształty i odległości (zob. maps/kaladesh/zrodlo-research.md).

Decyzje właściciela (2026-09-08/09): JEDNA mapa całego planu; Ghirapur jako
gęste ognisko miejskie na zlewisku rzek; domyślne otwarcie mapy na Ghirapurze
(ADR 0045, `widok_domyslny` w map.json). Epoka: Kaladesh za Konsulatu —
doba KLD/AER: kuźnia Konsulów spalona przez Chandrę, przed buntem eterowym.

SKALA (korekta właściciela 2026-09-09): miasto nie może zajmować 20%
planu. Arkusz 16000×11000; Ghirapur w obrysie murów (~500×440 j.)
to ~0,1% powierzchni — z oddalenia kropka z nazwą, detale (fs<17)
kryje LOD silnika. Zoom domyślny 18 kadruje miasto jak poprzednio.
Prowincja jest schematyczna celowo: rzadkie biomy-znaczki (gestosc
~0,03–0,06), pełny detal tylko w ognisku.

Kanon geograficzny użyty w scenie (MTG Wiki: Avishkar, Ghirapur — za
„The Art of Magic: The Gathering — Kaladesh"): trzy rzeki (Vinday przez
Peemę z zachodu, Suramal z północy, zlewisko → Vasavati do odległego
wybrzeża), Mapani (największy dopływ Vindaya, granica Vahd), Vahd
(Złote Stopnie, sterowce), Peema (las, elfy), Lathnu pod Devra,
Wielka Wspinka, Bunarat (spalona wieś), wieże eterowe, dzielnice
Ghirapuru (osobna lista w zrodlo-research.md).

Rozstrzygnięcia rekonstrukcji (umowne): morze bez nazwy; mosty 2–11
wzdłuż kanału; Ovalchase i Shaila's Claim poza murami; wieże i wsie
symbolicznie; osady rodzajowe („osada leśna”, „osada rybacka”) to
opisy, nie nazwy własne; linia brzegu; północ = góra; skala wyłączona.

Deterministyczny: pisze maps/kaladesh/scena.json. Miasto w identycznej
geometrii względnej (przesunięcie DX/DY, te same ziarna PRNG) —
render ogniska bajtowo zgodny z wersją z arkusza 2000×1400.
Renderować przez
    node tools/mapforge/cli.mjs maps/kaladesh/scena.json -o maps/kaladesh/podklad.svg
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'maps' / 'kaladesh' / 'scena.json'

SZER, WYS = 16000, 11000

# Przesunięcie ogniska miejskiego (stare współrzędne 2000×1400 + DX/DY).
DX, DY = 9210, 6000


def T(p):
    """Stary punkt miasta → nowy arkusz."""
    return [p[0] + DX, p[1] + DY]


def TL(lamana):
    return [T(p) for p in lamana]


# Zlewisko Ghirapuru (ognisko mapy, ADR 0045).
CX, CY = 1290.0 + DX, 800.0 + DY


def dlugosc(lamana):
    return sum(math.hypot(b[0] - a[0], b[1] - a[1])
               for a, b in zip(lamana, lamana[1:]))


def punkt_na(lamana, frac):
    """Punkt + kąt stycznej w ułamku długości łamanej."""
    cel = dlugosc(lamana) * frac
    przebyto = 0.0
    for a, b in zip(lamana, lamana[1:]):
        odc = math.hypot(b[0] - a[0], b[1] - a[1])
        if przebyto + odc >= cel:
            t = (cel - przebyto) / odc if odc else 0
            x = a[0] + (b[0] - a[0]) * t
            y = a[1] + (b[1] - a[1]) * t
            kat = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
            return [round(x, 1), round(y, 1)], round(kat, 1)
    (x, y), kat = lamana[-1], 0.0
    return [x, y], kat


def elipsa(cx, cy, rx, ry, n=14):
    return [[round(cx + rx * math.cos(2 * math.pi * i / n), 1),
             round(cy + ry * math.sin(2 * math.pi * i / n), 1)]
            for i in range(n)]


# ── Rzeki (osie kanoniczne; końcówki miejskie = T(stare)) ────────────────
VINDAY = [[150, 5300], [1500, 5400], [3500, 5600], [5500, 5900], [7500, 6300],
          [9000, 6600], [10000, 6720]] + TL([[1050, 745], [1200, 775], [1290, 800]])
SURAMAL = [[9800, 900], [9900, 2500], [10000, 4000], [10100, 5200],
           [10250, 6100]] + TL([[1220, 650], [1260, 740], [1290, 800]])
VASAVATI = (TL([[1290, 800], [1315, 880], [1350, 960]])
            + [[10620, 7600], [10700, 8300], [10800, 8900], [10850, 9300]])
MAPANI = [[13200, 2000], [12400, 3000], [11400, 4000], [10400, 5200],
          [9900, 6050], [9800, 6705]]
DUKHARA = TL([[1205, 776], [1250, 786], [1290, 792], [1310, 830], [1320, 880]])

# Jedenastu Mostów: 11 przepraw wzdłuż kanału (most→prostopadle do osi).
MOSTY = []
for i in range(11):
    (x, y), kat = punkt_na(DUKHARA, 0.06 + 0.88 * i / 10)
    MOSTY.append({'x': x, 'y': y, 'kat': round(kat + 90, 1)})

# ── Ląd: kontynent pod ramą N/E/W (passe-partout), morze na południu ─────
WYBRZEZE = [[16100, 9300], [15000, 9500], [13800, 9300], [12800, 9600],
            [11800, 9400], [11200, 9100], [10950, 9050], [10850, 9260],
            [10750, 9050], [10200, 9300], [9000, 9600],
            [7500, 9400], [6000, 9700], [4500, 9500], [3000, 9800],
            [1500, 9600], [-100, 9800]]
LAD = [[-100, -100], [16100, -100]] + WYBRZEZE + [[-100, -100]]

scena = {
    'nazwa': 'kaladesh-t4',
    'szerokosc': SZER,
    'wysokosc': WYS,
    'styl': 'atlas',
    'opis': ('Kaladesh T4 (rekonstrukcja kanoniczna, epoka KLD/AER; arkusz '
             '16000×11000): prowincja w skali planu — Ghirapur (~0,1% '
             'powierzchni) jest z oddalenia kropką z nazwą; pełny detal '
             'tylko w ognisku na zlewisku Vinday–Suramal; Vasavati do '
             'bezimiennego morza; Peema, Vahd, Lathnu/Devra; skala '
             'wyłączona (brak odległości w kanonie).'),
    'ocean': {},
    'lądy': [{'id': 'kaladesh', 'punkty': LAD}],
    'rzeki': [
        {'id': 'vinday', 'punkty': VINDAY, 'opcje': {'s0': 4, 's1': 8}},
        {'id': 'suramal', 'punkty': SURAMAL, 'opcje': {'s0': 3, 's1': 6}},
        {'id': 'vasavati', 'punkty': VASAVATI,
         'opcje': {'s0': 7, 's1': 11, 'zrodlo': False}},
        {'id': 'dukhara', 'punkty': DUKHARA,
         'opcje': {'s0': 2.5, 's1': 4, 'zrodlo': False}},
    ],
    'pasma': [
        {'id': 'devra', 'punkty': [[5500, 1400], [7000, 1250], [8500, 1350],
                                  [10000, 1250], [11200, 1400]],
         'opcje': {'szer': 60}},
        # Aleja Olbrzymów na zachód od miasta, z prześwitem od murów
        # i od Vindaya (kolizje wersji 2000×1400 — uwaga 2 właściciela).
        {'id': 'aleja-olbrzymow', 'punkty': [[8500, 6250], [9100, 6400],
                                             [9500, 6600]],
         'opcje': {'szer': 44}},
    ],
    'biomy': [
        # Przykrycie WCZEŚNIE (strefa zajęta dla późniejszej tkaniny);
        # odsunięte od zachodniego muru (kolizja v1).
        {'id': 'przykrycie', 'typ': 'las',
         'punkty': TL([[1160, 790], [1290, 820], [1290, 838], [1160, 808]]),
         'opcje': {'gestosc': 1.2, 'skala': 0.7}},
        # Peema: znaczki puszczy, nie pełny rozsiew (skala planu).
        {'id': 'peema-pln', 'typ': 'las',
         'punkty': [[1500, 3800], [4500, 3600], [7000, 4200], [8000, 5200],
                    [7800, 5800], [6000, 5600], [3000, 5400], [1200, 5000]],
         'opcje': {'gestosc': 0.04, 'skala': 1.4}},
        {'id': 'peema-pld', 'typ': 'las',
         'punkty': [[1000, 5620], [3500, 5850], [6000, 6220], [7500, 6600],
                    [7200, 7400], [4500, 7400], [1500, 6800]],
         'opcje': {'gestosc': 0.04, 'skala': 1.4}},
        {'id': 'vahd-step', 'typ': 'step',
         'punkty': [[12800, 2400], [14800, 2300], [15400, 3400],
                    [14700, 4500], [13000, 4600], [12500, 3500]],
         'opcje': {'gestosc': 0.06}},
        # Bezimienne pustkowia: rzadki step, żeby środek arkusza nie był
        # białą plamą; poligony omijają Vinday/Suramal/Mapani/Vasavati.
        {'id': 'step-centralny', 'typ': 'step',
         'punkty': [[8100, 4300], [9700, 4300], [9750, 5900], [8200, 6000]],
         'opcje': {'gestosc': 0.03}},
        {'id': 'step-wschodni', 'typ': 'step',
         'punkty': [[10800, 5000], [13000, 5000], [13200, 7800],
                    [11000, 8000], [10800, 6800]],
         'opcje': {'gestosc': 0.03}},
        {'id': 'shaila-pastwisko', 'typ': 'step',
         'punkty': TL([[950, 950], [1100, 950], [1120, 1010], [980, 1030]]),
         'opcje': {'gestosc': 0.8}},
        # Tkanina miejska: poligony omijają rzeki z konstrukcji (rzeki nie
        # tworzą stref zajętych); Przykrycie wykluczone jako wcześniejszy
        # biom. Wcięcia od murów po uwadze 2 (prześwit ≥12 j.).
        {'id': 'tkanina-kujar', 'typ': 'tkanina',
         'punkty': TL([[1255, 610], [1360, 605], [1370, 715], [1262, 715]]),
         'opcje': {'gestosc': 0.9}},
        {'id': 'tkanina-eleven-pln', 'typ': 'tkanina',
         'punkty': TL([[1215, 725], [1360, 725], [1375, 780], [1330, 800],
                       [1300, 788], [1255, 781], [1210, 771]]),
         'opcje': {'gestosc': 1.0}},
        {'id': 'tkanina-eleven-pld', 'typ': 'tkanina',
         'punkty': TL([[1225, 802], [1290, 810], [1305, 840], [1308, 880],
                       [1250, 880], [1215, 840]]),
         'opcje': {'gestosc': 1.0}},
        {'id': 'tkanina-bomat', 'typ': 'tkanina',
         'punkty': TL([[1255, 890], [1300, 890], [1315, 950], [1330, 1000],
                       [1245, 1005], [1220, 950]]),
         'opcje': {'gestosc': 1.0}},
        {'id': 'tkanina-embraal', 'typ': 'tkanina',
         'punkty': TL([[1390, 725], [1470, 765], [1485, 855], [1440, 940],
                       [1400, 985], [1390, 900], [1392, 800]]),
         'opcje': {'gestosc': 1.1}},
        {'id': 'tkanina-freejam', 'typ': 'tkanina',
         'punkty': TL([[1110, 640], [1200, 640], [1200, 710], [1150, 725],
                       [1110, 692]]),
         'opcje': {'gestosc': 0.9}},
        {'id': 'tkanina-greenwheel', 'typ': 'tkanina',
         'punkty': TL([[1095, 795], [1205, 795], [1230, 885], [1205, 945],
                       [1115, 910]]),
         'opcje': {'gestosc': 0.7}},
        {'id': 'tkanina-przedmiescie-wsch', 'typ': 'tkanina',
         'punkty': TL([[1560, 700], [1700, 700], [1700, 900], [1560, 900]]),
         'opcje': {'gestosc': 0.3}},
        {'id': 'tkanina-przedmiescie-zach', 'typ': 'tkanina',
         'punkty': TL([[800, 780], [1030, 795], [1030, 830], [800, 815]]),
         'opcje': {'gestosc': 0.3}},
        {'id': 'tkanina-przedmiescie-pln', 'typ': 'tkanina',
         'punkty': TL([[1000, 450], [1140, 450], [1120, 570], [1020, 570]]),
         'opcje': {'gestosc': 0.3}},
    ],
    'dzielnice': [
        {'id': 'jedenascie-mostow',
         'punkty': TL([[1210, 720], [1360, 720], [1380, 800], [1340, 880],
                       [1250, 880], [1200, 810]]),
         'opcje': {'ton': 8}},
        {'id': 'bomat',
         'punkty': TL([[1255, 885], [1345, 885], [1380, 960], [1360, 1010],
                       [1240, 1010], [1215, 950]]),
         'opcje': {'ton': 4}},
        {'id': 'embraal',
         'punkty': TL([[1385, 720], [1470, 760], [1500, 850], [1460, 950],
                       [1415, 1000], [1385, 900], [1390, 800]]),
         'opcje': {'ton': 12}},
        {'id': 'kujar',
         'punkty': TL([[1190, 600], [1360, 600], [1370, 715], [1215, 715]]),
         'opcje': {'ton': 2}},
        {'id': 'freejam',
         'punkty': TL([[1090, 640], [1205, 640], [1205, 715], [1150, 730],
                       [1080, 700]]),
         'opcje': {'ton': 6}},
        {'id': 'greenwheel',
         'punkty': TL([[1090, 800], [1210, 800], [1235, 885], [1210, 950],
                       [1100, 920]]),
         'opcje': {'ton': 3}},
    ],
    # Mury z bramami: przerwy na rzekach i traktach (geometria v1 + T).
    'mury': [
        {'id': 'mur-pn-wsch',
         'punkty': TL([[1218, 583], [1415, 583], [1520, 760]])},
        {'id': 'mur-wsch-pld',
         'punkty': TL([[1527, 815], [1470, 930], [1410, 1005]])},
        {'id': 'mur-pld-1', 'punkty': TL([[1355, 1028], [1300, 1022]])},
        {'id': 'mur-pld-2',
         'punkty': TL([[1200, 1017], [1165, 1017], [1100, 920]])},
        {'id': 'mur-zach', 'punkty': TL([[1062, 862], [1050, 795]])},
        {'id': 'mur-pn-1', 'punkty': TL([[1095, 700], [1120, 610]])},
        {'id': 'mur-pn-2', 'punkty': TL([[1145, 592], [1180, 583]])},
    ],
    'drogi': [
        {'id': 'trakt-vahd', 'typ': 'droga',
         'punkty': [[10755, 6800], [11400, 6500], [12200, 5800],
                    [13000, 5000], [13400, 4650]]},
        {'id': 'trakt-lathnu', 'typ': 'droga',
         'punkty': [[10340, 6595], [9900, 5200], [9200, 3800],
                    [8600, 2600], [8350, 2050]]},
        {'id': 'trakt-poludniowy', 'typ': 'droga',
         'punkty': [[10460, 7030], [10550, 7700], [10650, 8300],
                    [10700, 8700]]},
        {'id': 'sciezka-holownicza', 'typ': 'szlak',
         'punkty': TL([[1060, 805], [950, 795], [800, 775]])},
        {'id': 'tor-ovalchase', 'typ': 'droga',
         'punkty': TL(elipsa(1680, 830, 100, 60) + [elipsa(1680, 830, 100, 60)[0]])},
    ],
    'poi': [
        {'typ': 'iglica', 'id': 'iglica-eteru', 'x': 1300 + DX, 'y': 742 + DY,
         'opcje': {'skala': 1.8}},
        {'typ': 'kopula', 'id': 'stacja-aradara', 'x': 1355 + DX, 'y': 835 + DY,
         'opcje': {'skala': 1.3}},
        {'typ': 'fort', 'id': 'bastion', 'x': 1240 + DX, 'y': 845 + DY,
         'opcje': {'skala': 0.8}},
        {'typ': 'plac', 'id': 'akhara', 'x': 1330 + DX, 'y': 775 + DY,
         'opcje': {'skala': 1.1}},
        {'typ': 'kopula', 'id': 'wezel-eterowy', 'x': 1360 + DX, 'y': 690 + DY,
         'opcje': {'skala': 1.0}},
        {'typ': 'ruina', 'id': 'kuznia-konsulow', 'x': 1420 + DX, 'y': 900 + DY,
         'opcje': {'skala': 0.9}},
        {'typ': 'plac', 'id': 'bomat-targ', 'x': 1290 + DX, 'y': 950 + DY,
         'opcje': {'skala': 1.0}},
        {'typ': 'kopula', 'id': 'greenwheel-kopula-1',
         'x': 1170 + DX, 'y': 860 + DY, 'opcje': {'skala': 0.9}},
        {'typ': 'kopula', 'id': 'greenwheel-kopula-2',
         'x': 1215 + DX, 'y': 895 + DY, 'opcje': {'skala': 0.7}},
        {'typ': 'drzewo', 'id': 'greenwheel-drzewo',
         'x': 1190 + DX, 'y': 875 + DY, 'opcje': {'skala': 1.5}},
        {'typ': 'platforma', 'id': 'freejam-pomost',
         'x': 1140 + DX, 'y': 680 + DY, 'opcje': {'skala': 1.0}},
        {'typ': 'ruina', 'id': 'bunarat', 'x': 1050 + DX, 'y': 1010 + DY,
         'opcje': {'skala': 0.8}},
        {'typ': 'miasto', 'id': 'lathnu', 'x': 8300, 'y': 1900,
         'opcje': {'skala': 1.1}},
        {'typ': 'szczyt', 'id': 'wielka-wspinka', 'x': 8300, 'y': 750,
         'opcje': {'skala': 1.1, 'snieg': True}},
        {'typ': 'miasto', 'id': 'vahd-wies-1', 'x': 14000, 'y': 3200,
         'opcje': {'skala': 0.9}},
        {'typ': 'miasto', 'id': 'vahd-wies-2', 'x': 14600, 'y': 3800,
         'opcje': {'skala': 0.9}},
        {'typ': 'miasto', 'id': 'vahd-wies-3', 'x': 13600, 'y': 4100,
         'opcje': {'skala': 0.9}},
        {'typ': 'platforma', 'id': 'vahd-przystan', 'x': 14200, 'y': 2900,
         'opcje': {'skala': 1.2}},
        {'typ': 'iglica', 'id': 'wieza-eterowa-1', 'x': 2500, 'y': 7500,
         'opcje': {'skala': 1.3}},
        {'typ': 'iglica', 'id': 'wieza-eterowa-2', 'x': 9500, 'y': 7800,
         'opcje': {'skala': 1.3}},
        {'typ': 'iglica', 'id': 'wieza-eterowa-3', 'x': 13500, 'y': 6000,
         'opcje': {'skala': 1.3}},
        {'typ': 'iglica', 'id': 'wieza-eterowa-4', 'x': 6000, 'y': 3000,
         'opcje': {'skala': 1.3}},
        {'typ': 'iglica', 'id': 'wieza-eterowa-5', 'x': 14500, 'y': 8000,
         'opcje': {'skala': 1.3}},
        {'typ': 'miasto', 'id': 'osada-rybacka', 'x': 11200, 'y': 8800,
         'opcje': {'skala': 0.9}},
        {'typ': 'miasto', 'id': 'osada-lesna', 'x': 4500, 'y': 6300,
         'opcje': {'skala': 0.9}},
    ] + [
        {'typ': 'most', 'x': m['x'], 'y': m['y'], 'id': f'most-{i + 1}',
         'opcje': {'skala': 0.7, 'kat': m['kat']}}
        for i, m in enumerate(MOSTY)
    ],
    'etykiety': [
        {'tekst': 'Ghirapur', 'x': 1300 + DX, 'y': 550 + DY,
         'opcje': {'fs': 38, 'duze': True}},
        {'tekst': 'Eleven Bridges', 'x': 1345 + DX, 'y': 755 + DY,
         'opcje': {'fs': 12}},
        {'tekst': 'Bomat', 'x': 1290 + DX, 'y': 950 + DY,
         'opcje': {'fs': 12, 'przyDo': [1290 + DX, 950 + DY]}},
        {'tekst': 'Embraal', 'x': 1445 + DX, 'y': 860 + DY,
         'opcje': {'fs': 12}},
        {'tekst': 'Kujar', 'x': 1310 + DX, 'y': 650 + DY,
         'opcje': {'fs': 12}},
        {'tekst': 'Freejam', 'x': 1140 + DX, 'y': 680 + DY,
         'opcje': {'fs': 11, 'przyDo': [1140 + DX, 680 + DY]}},
        {'tekst': 'Greenwheel', 'x': 1108 + DX, 'y': 835 + DY,
         'opcje': {'fs': 11}},
        {'tekst': 'Weldfast', 'x': 1400 + DX, 'y': 665 + DY,
         'opcje': {'fs': 11}},
        {'tekst': 'Aether Spire', 'x': 1300 + DX, 'y': 742 + DY,
         'opcje': {'fs': 12, 'przyDo': [1300 + DX, 742 + DY]}},
        {'tekst': 'Aradara Station', 'x': 1355 + DX, 'y': 835 + DY,
         'opcje': {'fs': 10, 'przyDo': [1355 + DX, 835 + DY]}},
        {'tekst': 'Bastion', 'x': 1240 + DX, 'y': 845 + DY,
         'opcje': {'fs': 10, 'przyDo': [1240 + DX, 845 + DY]}},
        {'tekst': 'Akhara', 'x': 1330 + DX, 'y': 775 + DY,
         'opcje': {'fs': 10, 'przyDo': [1330 + DX, 775 + DY]}},
        {'tekst': 'Aether Hub', 'x': 1360 + DX, 'y': 690 + DY,
         'opcje': {'fs': 10, 'przyDo': [1360 + DX, 690 + DY]}},
        {'tekst': 'Foundry of the Consuls', 'x': 1420 + DX, 'y': 900 + DY,
         'opcje': {'fs': 10, 'przyDo': [1420 + DX, 900 + DY]}},
        {'tekst': 'First Bridge', 'x': MOSTY[10]['x'], 'y': MOSTY[10]['y'],
         'opcje': {'fs': 10, 'przyDo': [MOSTY[10]['x'], MOSTY[10]['y']]}},
        {'tekst': 'Ninth Bridge', 'x': MOSTY[2]['x'], 'y': MOSTY[2]['y'],
         'opcje': {'fs': 10, 'przyDo': [MOSTY[2]['x'], MOSTY[2]['y']]}},
        {'tekst': 'The Cowl', 'x': 1185 + DX, 'y': 814 + DY,
         'opcje': {'fs': 11}},
        {'tekst': 'Dukhara Canal', 'x': 1262 + DX, 'y': 768 + DY,
         'opcje': {'fs': 10, 'ital': True}},
        {'tekst': 'Greenwheel Domes', 'x': 1170 + DX, 'y': 860 + DY,
         'opcje': {'fs': 10, 'przyDo': [1170 + DX, 860 + DY]}},
        {'tekst': 'The Zoo', 'x': 1190 + DX, 'y': 875 + DY,
         'opcje': {'fs': 10, 'przyDo': [1190 + DX, 875 + DY]}},
        {'tekst': 'Bunarat', 'x': 1050 + DX, 'y': 1010 + DY,
         'opcje': {'fs': 11, 'przyDo': [1050 + DX, 1010 + DY]}},
        {'tekst': "Shaila's Claim", 'x': 1035 + DX, 'y': 990 + DY,
         'opcje': {'fs': 11}},
        # Prowincja: tytuły planu (duze = tier-kontynent, zawsze widoczne)
        # i nazwy główne (fs 17 = widoczne od pełnego widoku).
        {'tekst': 'Peema', 'x': 4500, 'y': 4500,
         'opcje': {'fs': 24, 'duze': True}},
        {'tekst': 'Vahd', 'x': 13900, 'y': 3400,
         'opcje': {'fs': 22, 'duze': True}},
        {'tekst': 'Złote Stopnie', 'x': 13900, 'y': 3470,
         'opcje': {'fs': 12, 'ital': True}},
        {'tekst': 'Lathnu', 'x': 8300, 'y': 1900,
         'opcje': {'fs': 17, 'przyDo': [8300, 1900]}},
        {'tekst': 'Devra Cliffs', 'x': 6800, 'y': 1900,
         'opcje': {'fs': 17}},
        {'tekst': 'The Great Climb', 'x': 8300, 'y': 750,
         'opcje': {'fs': 17, 'przyDo': [8300, 750]}},
        {'tekst': "Giants' Walk", 'x': 9000, 'y': 6150,
         'opcje': {'fs': 12}},
        {'tekst': 'Ovalchase', 'x': 1680 + DX, 'y': 832 + DY,
         'opcje': {'fs': 13}},
        {'tekst': 'wieś', 'x': 14000, 'y': 3200,
         'opcje': {'fs': 10, 'przyDo': [14000, 3200]}},
        {'tekst': 'wieś', 'x': 14600, 'y': 3800,
         'opcje': {'fs': 10, 'przyDo': [14600, 3800]}},
        {'tekst': 'wieś', 'x': 13600, 'y': 4100,
         'opcje': {'fs': 10, 'przyDo': [13600, 4100]}},
        {'tekst': 'przystań sterowców', 'x': 14200, 'y': 2900,
         'opcje': {'fs': 10, 'przyDo': [14200, 2900]}},
        {'tekst': 'Aether Collection Tower', 'x': 2500, 'y': 7500,
         'opcje': {'fs': 10, 'przyDo': [2500, 7500]}},
        {'tekst': 'Aether Collection Tower', 'x': 9500, 'y': 7800,
         'opcje': {'fs': 10, 'przyDo': [9500, 7800]}},
        {'tekst': 'Aether Collection Tower', 'x': 13500, 'y': 6000,
         'opcje': {'fs': 10, 'przyDo': [13500, 6000]}},
        {'tekst': 'Aether Collection Tower', 'x': 6000, 'y': 3000,
         'opcje': {'fs': 10, 'przyDo': [6000, 3000]}},
        {'tekst': 'Aether Collection Tower', 'x': 14500, 'y': 8000,
         'opcje': {'fs': 10, 'przyDo': [14500, 8000]}},
        {'tekst': 'osada rybacka', 'x': 11200, 'y': 8800,
         'opcje': {'fs': 10, 'przyDo': [11200, 8800]}},
        {'tekst': 'osada leśna', 'x': 4500, 'y': 6300,
         'opcje': {'fs': 10, 'przyDo': [4500, 6300]}},
    ],
    'etykietyLukowe': [
        {'id': 'luk-vinday', 'tekst': 'Vinday',
         'punkty': [[2500, 5450], [5000, 5800], [7500, 6250]],
         'opcje': {'fs': 17}},
        {'id': 'luk-suramal', 'tekst': 'Suramal',
         'punkty': [[9920, 2500], [10050, 4200]],
         'opcje': {'fs': 17}},
        {'id': 'luk-vasavati', 'tekst': 'Vasavati',
         'punkty': [[10650, 8000], [10780, 8700]],
         'opcje': {'fs': 17}},
        {'id': 'luk-mapani', 'tekst': 'Mapani',
         'punkty': [[12400, 3100], [11000, 4300]],
         'opcje': {'fs': 12}},
    ],
    'kompas': {'x': 15200, 'y': 10200, 'r': 60},
    'skala': False,
    'ramka': {'margines': 22, 'passePartout': True},
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(scena, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'OK — {OUT} ({len(scena["poi"])} POI, {len(scena["etykiety"])} etykiet, '
      f'{len(MOSTY)} mostów na kanale)')
