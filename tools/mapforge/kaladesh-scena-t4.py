#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Budowniczy sceny mapy Kaladeshu (T4 — rekonstrukcja kanoniczna, atlas).

Kanon nie podaje mapy planu ani współrzędnych (research T1→T4 z 2026-09-09,
docs/research/RESEARCH_2026-09-09-kaladesh-gearsmith-prodigy.md): mapa jest
rekonstrukcją RELACYJNĄ w mapforge — prawdziwe są sąsiedztwa i przebiegi
rzek, umowne kształty i odległości (zob. maps/kaladesh/zrodlo-research.md).

Decyzje właściciela (2026-09-08/09): JEDNA mapa całego planu; Ghirapur jako
gęste ognisko miejskie na zlewisku rzek; domyślne otwarcie mapy na Ghirapurze
(ADR 0045, `widok_domyslny` w map.json). Epoka: Kaladesh za Konsulatu —
przed buntem eterowym (KLD/AER): kuźnia Konsulów cała stoi (ruina na mapie
to pomyłka — patrz niżej), Targowisko Nocne Gontiego w Bomat.

Kanon geograficzny użyty w scenie (MTG Wiki: Avishkar, Ghirapur — za
„The Art of Magic: The Gathering — Kaladesh"):
  * Trzy rzeki miasta: Vinday płynie przez dzicz Peemy i wpada do Ghirapuru
    od zachodu; Suramal spływa z północy; zlewisko w mieście tworzy wielką
    Vasavati, która niesie handel do ODLEGŁEGO WYBRZEŻA na południu.
  * Mapani to największy dopływ Vindaya i jedna z granic Vahd.
  * Vahd (Złote Stopnie): pola i wsie na północnym wschodzie, ośrodek
    budowy i prób sterowców.
  * Peema: dziesiątki tysięcy akrów dzikiego lasu na zachodzie, elfy.
  * Lathnu: wysunięta placówka na PÓŁNOCNYM skraju cywilizacji, pod urwiskiem
    Devra; za nią Wielka Wspinka (lodowe góry, śmierć).
  * Ghirapur: stolica na zlewisku; Kanał Dukhara przez środek dzielnicy
    Jedenastu Mostów (First Bridge NAJPODNIEJSZY); Iglica Eteru w centrum;
    stacja Aradara (wielki węzeł kolei z kopułą); Bastion Czcigodnych;
    Bomat (port, molo, targowiska); Embraal (huty, dzielnica przemysłowa);
    Ovalchase (tor wyścigowy); Greenwheel (kopuły ogrodowe, „Zoo”
    konstruktów); Kujar (elfia dzielnica rezydencjonalna); Freejam
    (pionowe pomosty, awiacje); Aleja Olbrzymów (wzgórza NAD Vindayem);
    Weldfast (węzeł eterowy, metaloplastyka); Przykrycie (las łęgowy);
    Akhara (okrągły plac-arena); Kuźnia Konsulów (spalona przez Chandrę).

Rozstrzygnięcia rekonstrukcji (umowne, do weryfikacji z kanonem):
  * Morze na południu BEZ nazwy (kanon: „morze”, „odległe wybrzeże").
  * Kuźnia Konsulów jako RUINA: epoka mapy to schyłek Konsulatu — pożar
    Chandry już się dokonał (naprawiono opis epoki wyżej: mapa pokazuje
    plan w dobie KLD/AER, po spaleniu kuźni).
  * Mosty 2–11 na kanale: pozycje umowne wzdłuż kanału; Ninth Bridge
    oznaczony bez roszczenia do kolejności kanonicznej.
  * Ovalchase poza murami (tor potrzebuje miejsca); Shaila's Claim jako
    pastwisko za murami; wieże eterowe rozproszone po prowincji (4).
  * Skala liniowa WYŁĄCZONA (kanon nie podaje odległości); kompas tak
    (północ = góra arkusza, konwencja rekonstrukcji).

Deterministyczny: pisze maps/kaladesh/scena.json. Renderować przez
    node tools/mapforge/cli.mjs maps/kaladesh/scena.json -o maps/kaladesh/podklad.svg
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'maps' / 'kaladesh' / 'scena.json'

SZER, WYS = 2000, 1400

# Zlewisko Ghirapuru (ognisko mapy, ADR 0045).
CX, CY = 1290.0, 800.0


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


# ── Rzeki (osie kanoniczne) ──────────────────────────────────────────────
VINDAY = [[30, 600], [250, 610], [450, 630], [650, 660], [850, 700],
          [1050, 745], [1200, 775], [CX, CY]]
SURAMAL = [[1130, 240], [1150, 380], [1180, 520], [1220, 650], [1260, 740],
           [CX, CY]]
VASAVATI = [[CX, CY], [1315, 880], [1350, 960], [1390, 1030], [1445, 1100]]
MAPANI = [[1420, 330], [1310, 440], [1190, 550], [1070, 650], [975, 722]]
DUKHARA = [[1205, 776], [1250, 786], [1290, 792], [1310, 830], [1320, 880]]

# Jedenastu Mostów: 11 przepraw wzdłuż kanału (most→prostopadle do osi).
MOSTY = []
for i in range(11):
    (x, y), kat = punkt_na(DUKHARA, 0.06 + 0.88 * i / 10)
    MOSTY.append({'x': x, 'y': y, 'kat': round(kat + 90, 1)})

# ── Ląd: kontynent pod ramą N/E/W (passe-partout), morze na południu ─────
WYBRZEZE = [[2050, 1150], [1850, 1180], [1700, 1160], [1560, 1100],
            [1490, 1070], [1460, 1095], [1430, 1095], [1400, 1070],
            [1360, 1080], [1280, 1120], [1150, 1180], [1000, 1200],
            [850, 1180], [700, 1130], [560, 1100], [420, 1120],
            [300, 1080], [220, 1000], [120, 960], [-50, 980]]
LAD = [[-50, -50], [2050, -50]] + WYBRZEZE + [[-50, -50]]

scena = {
    'nazwa': 'kaladesh-t4',
    'szerokosc': SZER,
    'wysokosc': WYS,
    'styl': 'atlas',
    'opis': ('Kaladesh T4 (rekonstrukcja kanoniczna, epoka KLD/AER): '
             'schematyczny plan + gęsty Ghirapur na zlewisku Vinday–Suramal; '
             'Vasavati do bezimiennego morza; Peema (las, zachód), Vahd '
             '(pola i sterowce, północny wschód), Lathnu pod Devra '
             '(północ); morze bez nazwy — kanon nie podaje; skala '
             'wyłączona (brak odległości w kanonie).'),
    'ocean': {},
    'lądy': [{'id': 'kaladesh', 'punkty': LAD}],
    'rzeki': [
        {'id': 'vinday', 'punkty': VINDAY, 'opcje': {'s0': 4, 's1': 8}},
        {'id': 'suramal', 'punkty': SURAMAL, 'opcje': {'s0': 3, 's1': 6}},
        {'id': 'vasavati', 'punkty': VASAVATI,
         'opcje': {'s0': 7, 's1': 11, 'zrodlo': False}},
    ],
    'pasma': [
        {'id': 'devra', 'punkty': [[520, 180], [700, 160], [900, 170],
                                  [1100, 155], [1280, 175]],
         'opcje': {'szer': 46}},
        {'id': 'aleja-olbrzymow', 'punkty': [[920, 600], [1020, 625],
                                             [1110, 665]],
         'opcje': {'szer': 40}},
    ],
    'biomy': [
        # Przykrycie WCZEŚNIE (strefa zajęta dla późniejszej tkaniny).
        {'id': 'przykrycie', 'typ': 'las',
         'punkty': [[1110, 786], [1290, 820], [1290, 838], [1110, 804]],
         'opcje': {'gestosc': 1.2, 'skala': 0.7}},
        {'id': 'peema-pln', 'typ': 'las',
         'punkty': [[80, 430], [500, 410], [900, 480], [1050, 600],
                    [1030, 640], [850, 600], [500, 590], [150, 580]],
         'opcje': {'gestosc': 1.0}},
        {'id': 'peema-pld', 'typ': 'las',
         'punkty': [[120, 680], [500, 690], [900, 760], [1030, 790],
                    [1000, 860], [600, 840], [200, 780]],
         'opcje': {'gestosc': 1.0}},
        {'id': 'vahd-step', 'typ': 'step',
         'punkty': [[1450, 350], [1750, 300], [1850, 450], [1750, 600],
                    [1550, 620], [1430, 500]],
         'opcje': {'gestosc': 0.9}},
        {'id': 'shaila-pastwisko', 'typ': 'step',
         'punkty': [[950, 950], [1100, 950], [1120, 1010], [980, 1030]],
         'opcje': {'gestosc': 0.8}},
        # Tkanina miejska: poligony omijają rzeki z konstrukcji (rzeki nie
        # tworzą stref zajętych); Przykrycie wykluczone jako wcześniejszy biom.
        {'id': 'tkanina-kujar', 'typ': 'tkanina',
         'punkty': [[1255, 610], [1360, 605], [1370, 715], [1262, 715]],
         'opcje': {'gestosc': 0.9}},
        {'id': 'tkanina-eleven-pln', 'typ': 'tkanina',
         'punkty': [[1215, 725], [1360, 725], [1375, 780], [1330, 800],
                    [1300, 788], [1255, 781], [1210, 771]],
         'opcje': {'gestosc': 1.0}},
        {'id': 'tkanina-eleven-pld', 'typ': 'tkanina',
         'punkty': [[1225, 802], [1290, 810], [1305, 840], [1308, 880],
                    [1250, 880], [1215, 840]],
         'opcje': {'gestosc': 1.0}},
        {'id': 'tkanina-bomat', 'typ': 'tkanina',
         'punkty': [[1255, 890], [1300, 890], [1315, 950], [1330, 1000],
                    [1245, 1005], [1220, 950]],
         'opcje': {'gestosc': 1.0}},
        {'id': 'tkanina-embraal', 'typ': 'tkanina',
         'punkty': [[1390, 725], [1470, 765], [1495, 855], [1455, 945],
                    [1415, 995], [1390, 900], [1392, 800]],
         'opcje': {'gestosc': 1.1}},
        {'id': 'tkanina-freejam', 'typ': 'tkanina',
         'punkty': [[1095, 645], [1200, 645], [1200, 710], [1150, 725],
                    [1085, 695]],
         'opcje': {'gestosc': 0.9}},
        {'id': 'tkanina-greenwheel', 'typ': 'tkanina',
         'punkty': [[1095, 795], [1205, 795], [1230, 885], [1205, 945],
                    [1105, 915]],
         'opcje': {'gestosc': 0.7}},
        {'id': 'tkanina-przedmiescie-wsch', 'typ': 'tkanina',
         'punkty': [[1560, 700], [1700, 700], [1700, 900], [1560, 900]],
         'opcje': {'gestosc': 0.3}},
        {'id': 'tkanina-przedmiescie-zach', 'typ': 'tkanina',
         'punkty': [[800, 780], [1030, 795], [1030, 830], [800, 815]],
         'opcje': {'gestosc': 0.3}},
        {'id': 'tkanina-przedmiescie-pln', 'typ': 'tkanina',
         'punkty': [[1000, 450], [1140, 450], [1120, 570], [1020, 570]],
         'opcje': {'gestosc': 0.3}},
    ],
    'dzielnice': [
        {'id': 'jedenascie-mostow',
         'punkty': [[1210, 720], [1360, 720], [1380, 800], [1340, 880],
                    [1250, 880], [1200, 810]],
         'opcje': {'ton': 8}},
        {'id': 'bomat',
         'punkty': [[1255, 885], [1345, 885], [1380, 960], [1360, 1010],
                    [1240, 1010], [1215, 950]],
         'opcje': {'ton': 4}},
        {'id': 'embraal',
         'punkty': [[1385, 720], [1470, 760], [1500, 850], [1460, 950],
                    [1415, 1000], [1385, 900], [1390, 800]],
         'opcje': {'ton': 12}},
        {'id': 'kujar',
         'punkty': [[1190, 600], [1360, 600], [1370, 715], [1215, 715]],
         'opcje': {'ton': 2}},
        {'id': 'freejam',
         'punkty': [[1090, 640], [1205, 640], [1205, 715], [1150, 730],
                    [1080, 700]],
         'opcje': {'ton': 6}},
        {'id': 'greenwheel',
         'punkty': [[1090, 800], [1210, 800], [1235, 885], [1210, 950],
                    [1100, 920]],
         'opcje': {'ton': 3}},
    ],
    # Mury z bramami: przerwy na rzekach (Vinday W, Suramal N, Vasavati S)
    # i traktach (brama wschodnia, północna, południowa).
    'mury': [
        {'id': 'mur-pn-wsch', 'punkty': [[1218, 583], [1415, 583], [1520, 760]]},
        {'id': 'mur-wsch-pld', 'punkty': [[1527, 815], [1470, 930], [1410, 1005]]},
        {'id': 'mur-pld-1', 'punkty': [[1355, 1028], [1300, 1022]]},
        {'id': 'mur-pld-2', 'punkty': [[1200, 1017], [1165, 1017], [1100, 920]]},
        {'id': 'mur-zach', 'punkty': [[1062, 862], [1050, 795]]},
        {'id': 'mur-pn-1', 'punkty': [[1095, 700], [1120, 610]]},
        {'id': 'mur-pn-2', 'punkty': [[1145, 592], [1180, 583]]},
    ],
    'drogi': [
        {'id': 'trakt-vahd', 'typ': 'droga',
         'punkty': [[1545, 800], [1650, 760], [1720, 680], [1750, 580]]},
        {'id': 'trakt-lathnu', 'typ': 'droga',
         'punkty': [[1130, 595], [1080, 480], [1000, 380], [920, 290]]},
        {'id': 'trakt-poludniowy', 'typ': 'droga',
         'punkty': [[1250, 1030], [1220, 1100], [1150, 1150]]},
        {'id': 'sciezka-holownicza', 'typ': 'szlak',
         'punkty': [[1060, 805], [950, 795], [800, 775]]},
        {'id': 'tor-ovalchase', 'typ': 'droga',
         'punkty': elipsa(1680, 830, 100, 60) + [elipsa(1680, 830, 100, 60)[0]]},
    ],
    'poi': [
        {'typ': 'iglica', 'x': 1300, 'y': 742, 'id': 'iglica-eteru',
         'opcje': {'skala': 1.8}},
        {'typ': 'kopula', 'x': 1355, 'y': 835, 'id': 'stacja-aradara',
         'opcje': {'skala': 1.3}},
        {'typ': 'fort', 'x': 1240, 'y': 845, 'id': 'bastion',
         'opcje': {'skala': 0.8}},
        {'typ': 'plac', 'x': 1330, 'y': 775, 'id': 'akhara',
         'opcje': {'skala': 1.1}},
        {'typ': 'kopula', 'x': 1360, 'y': 690, 'id': 'wezel-eterowy',
         'opcje': {'skala': 1.0}},
        {'typ': 'ruina', 'x': 1420, 'y': 900, 'id': 'kuznia-konsulow',
         'opcje': {'skala': 0.9}},
        {'typ': 'plac', 'x': 1290, 'y': 950, 'id': 'bomat-targ',
         'opcje': {'skala': 1.0}},
        {'typ': 'kopula', 'x': 1170, 'y': 860, 'id': 'greenwheel-kopula-1',
         'opcje': {'skala': 0.9}},
        {'typ': 'kopula', 'x': 1215, 'y': 895, 'id': 'greenwheel-kopula-2',
         'opcje': {'skala': 0.7}},
        {'typ': 'drzewo', 'x': 1190, 'y': 875, 'id': 'greenwheel-drzewo',
         'opcje': {'skala': 1.5}},
        {'typ': 'platforma', 'x': 1140, 'y': 680, 'id': 'freejam-pomost',
         'opcje': {'skala': 1.0}},
        {'typ': 'miasto', 'x': 880, 'y': 255, 'id': 'lathnu',
         'opcje': {'skala': 1.1}},
        {'typ': 'szczyt', 'x': 980, 'y': 95, 'id': 'wielka-wspinka',
         'opcje': {'skala': 1.1, 'snieg': True}},
        {'typ': 'miasto', 'x': 1600, 'y': 450, 'id': 'vahd-wies-1',
         'opcje': {'skala': 0.9}},
        {'typ': 'miasto', 'x': 1700, 'y': 520, 'id': 'vahd-wies-2',
         'opcje': {'skala': 0.9}},
        {'typ': 'miasto', 'x': 1550, 'y': 540, 'id': 'vahd-wies-3',
         'opcje': {'skala': 0.9}},
        {'typ': 'platforma', 'x': 1650, 'y': 420, 'id': 'vahd-przystan',
         'opcje': {'skala': 1.2}},
        {'typ': 'iglica', 'x': 500, 'y': 380, 'id': 'wieza-eterowa-1',
         'opcje': {'skala': 1.3}},
        {'typ': 'iglica', 'x': 1650, 'y': 640, 'id': 'wieza-eterowa-2',
         'opcje': {'skala': 1.3}},
        {'typ': 'iglica', 'x': 850, 'y': 980, 'id': 'wieza-eterowa-3',
         'opcje': {'skala': 1.3}},
        {'typ': 'ruina', 'x': 1050, 'y': 1010, 'id': 'bunarat',
         'opcje': {'skala': 0.8}},
    ] + [
        {'typ': 'most', 'x': m['x'], 'y': m['y'], 'id': f'most-{i + 1}',
         'opcje': {'skala': 0.7, 'kat': m['kat']}}
        for i, m in enumerate(MOSTY)
    ],
    'etykiety': [
        {'tekst': 'Ghirapur', 'x': 1300, 'y': 550,
         'opcje': {'fs': 38, 'duze': True}},
        {'tekst': 'Eleven Bridges', 'x': 1345, 'y': 755,
         'opcje': {'fs': 12}},
        {'tekst': 'Bomat', 'x': 1290, 'y': 950,
         'opcje': {'fs': 12, 'przyDo': [1290, 950]}},
        {'tekst': 'Embraal', 'x': 1445, 'y': 860, 'opcje': {'fs': 12}},
        {'tekst': 'Kujar', 'x': 1310, 'y': 650, 'opcje': {'fs': 12}},
        {'tekst': 'Freejam', 'x': 1140, 'y': 680,
         'opcje': {'fs': 11, 'przyDo': [1140, 680]}},
        {'tekst': 'Greenwheel', 'x': 1108, 'y': 835, 'opcje': {'fs': 11}},
        {'tekst': 'Weldfast', 'x': 1400, 'y': 665, 'opcje': {'fs': 11}},
        {'tekst': 'Aether Spire', 'x': 1300, 'y': 742,
         'opcje': {'fs': 12, 'przyDo': [1300, 742]}},
        {'tekst': 'Aradara Station', 'x': 1355, 'y': 835,
         'opcje': {'fs': 10, 'przyDo': [1355, 835]}},
        {'tekst': 'Bastion', 'x': 1240, 'y': 845,
         'opcje': {'fs': 10, 'przyDo': [1240, 845]}},
        {'tekst': 'Akhara', 'x': 1330, 'y': 775,
         'opcje': {'fs': 10, 'przyDo': [1330, 775]}},
        {'tekst': 'Aether Hub', 'x': 1360, 'y': 690,
         'opcje': {'fs': 10, 'przyDo': [1360, 690]}},
        {'tekst': 'Foundry of the Consuls', 'x': 1420, 'y': 900,
         'opcje': {'fs': 10, 'przyDo': [1420, 900]}},
        {'tekst': 'First Bridge', 'x': MOSTY[10]['x'], 'y': MOSTY[10]['y'],
         'opcje': {'fs': 10, 'przyDo': [MOSTY[10]['x'], MOSTY[10]['y']]}},
        {'tekst': 'Ninth Bridge', 'x': MOSTY[2]['x'], 'y': MOSTY[2]['y'],
         'opcje': {'fs': 10, 'przyDo': [MOSTY[2]['x'], MOSTY[2]['y']]}},
        {'tekst': 'The Cowl', 'x': 1200, 'y': 812, 'opcje': {'fs': 11}},
        {'tekst': 'Dukhara Canal', 'x': 1262, 'y': 768,
         'opcje': {'fs': 10, 'ital': True}},
        {'tekst': 'Peema', 'x': 450, 'y': 500, 'opcje': {'fs': 22}},
        {'tekst': 'Vahd', 'x': 1640, 'y': 475, 'opcje': {'fs': 20}},
        {'tekst': 'Złote Stopnie', 'x': 1640, 'y': 500,
         'opcje': {'fs': 12, 'ital': True}},
        {'tekst': 'Lathnu', 'x': 880, 'y': 255,
         'opcje': {'fs': 12, 'przyDo': [880, 255]}},
        {'tekst': 'Devra Cliffs', 'x': 650, 'y': 215, 'opcje': {'fs': 13}},
        {'tekst': 'The Great Climb', 'x': 980, 'y': 95,
         'opcje': {'fs': 12, 'przyDo': [980, 95]}},
        {'tekst': 'Bunarat', 'x': 1050, 'y': 1010,
         'opcje': {'fs': 11, 'przyDo': [1050, 1010]}},
        {'tekst': "Shaila's Claim", 'x': 1035, 'y': 990,
         'opcje': {'fs': 11}},
        {'tekst': "Giants' Walk", 'x': 1015, 'y': 572,
         'opcje': {'fs': 12}},
        {'tekst': 'Ovalchase', 'x': 1680, 'y': 832, 'opcje': {'fs': 13}},
        {'tekst': 'Aether Collection Tower', 'x': 500, 'y': 380,
         'opcje': {'fs': 10, 'przyDo': [500, 380]}},
        {'tekst': 'Aether Collection Tower', 'x': 1650, 'y': 640,
         'opcje': {'fs': 10, 'przyDo': [1650, 640]}},
        {'tekst': 'Aether Collection Tower', 'x': 850, 'y': 980,
         'opcje': {'fs': 10, 'przyDo': [850, 980]}},
        {'tekst': 'Greenwheel Domes', 'x': 1170, 'y': 860,
         'opcje': {'fs': 10, 'przyDo': [1170, 860]}},
        {'tekst': 'The Zoo', 'x': 1190, 'y': 875,
         'opcje': {'fs': 10, 'przyDo': [1190, 875]}},
        {'tekst': 'wsie Vahd', 'x': 1600, 'y': 450,
         'opcje': {'fs': 10, 'przyDo': [1600, 450]}},
        {'tekst': 'przystań sterowców', 'x': 1650, 'y': 420,
         'opcje': {'fs': 10, 'przyDo': [1650, 420]}},
    ],
    'etykietyLukowe': [
        {'id': 'luk-vinday', 'tekst': 'Vinday',
         'punkty': [[300, 610], [600, 645], [900, 700]],
         'opcje': {'fs': 13}},
        {'id': 'luk-suramal', 'tekst': 'Suramal',
         'punkty': [[1160, 400], [1200, 560]],
         'opcje': {'fs': 13}},
        {'id': 'luk-vasavati', 'tekst': 'Vasavati',
         'punkty': [[1330, 920], [1400, 1030]],
         'opcje': {'fs': 13}},
        {'id': 'luk-mapani', 'tekst': 'Mapani',
         'punkty': [[1330, 420], [1150, 560]],
         'opcje': {'fs': 12}},
    ],
    'kompas': {'x': 1880, 'y': 1260, 'r': 40},
    'skala': False,
    'ramka': {'margines': 22, 'passePartout': True},
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(scena, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'OK — {OUT} ({len(scena["poi"])} POI, {len(scena["etykiety"])} etykiet, '
      f'{len(MOSTY)} mostów na kanale)')