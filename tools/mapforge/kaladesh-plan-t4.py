#!/usr/bin/env python3
"""Kaladesh T4 — PLAN (mapa ogólna, scena złota LOD).

Lekki podkład całej prowincji (ADR 0039): rzeki, regiony, trakty, Ghirapur
wyłącznie jako plama z nazwą. Detal miasta mieszka w osobnej scenie L2
(`kaladesh-ghirapur-l2.py` → `ghirapur.svg`), podgrywanej od progu zoomu
(`bbox`+`prog` w map.json). Geometria wspólna (rzeki, trakty, Aleja
Olbrzymów) ma TE SAME współrzędne w obu scenach — L2 dorysowuje się
dokładnie na planie, bez szwów.

Determinizm jak wprost: PRNG z hasha id (mapforge).
"""
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent.parent / 'maps' / 'kaladesh' / 'scena.json'
SZER, WYS = 16000, 11000

# ── Rzeki (osie kanoniczne; Kanał Dukhara to detal L2) ────────────────
VINDAY = [[150, 5300], [1500, 5400], [3500, 5600], [5500, 5900], [7500, 6300],
          [9000, 6600], [10000, 6720], [10260, 6755], [10410, 6785],
          [10500, 6800]]
SURAMAL = [[9800, 900], [9900, 2500], [10000, 4000], [10100, 5200],
           [10250, 6100], [10430, 6650], [10470, 6740], [10500, 6800]]
VASAVATI = [[10500, 6800], [10525, 6880], [10560, 6960], [10620, 7600],
            [10700, 8300], [10800, 8900], [10850, 9300]]
MAPANI = [[13200, 2000], [12400, 3000], [11400, 4000], [10400, 5200],
          [9900, 6050], [9800, 6705]]

# ── Ląd: kontynent pod ramą N/E/W, morze na południu ───────────────────
WYBRZEZE = [[16100, 9300], [15000, 9500], [13800, 9300], [12800, 9600],
            [11800, 9400], [11200, 9100], [10950, 9050], [10850, 9260],
            [10750, 9050], [10200, 9300], [9000, 9600], [7500, 9400],
            [6000, 9700], [4500, 9500], [3000, 9800], [1500, 9600],
            [-100, 9800]]
LAD = [[-100, -100], [16100, -100]] + WYBRZEZE + [[-100, -100]]

# Ognisko miasta w starych współrzędnych miejskich (2000×1400) + T.
# TUTAJ plan nie zna detalu — tylko tłumaczenie punktu zlewiska.
DX, DY = 9210, 6000
ZLEW = (1290 + DX, 800 + DY)  # (10500, 6800)

scena = {
    'nazwa': 'kaladesh-plan-t4',
    'szerokosc': SZER,
    'wysokosc': WYS,
    'styl': 'atlas',
    'opis': ('Kaladesh T4 — PLAN (scena złota LOD, ADR 0039): prowincja '
             'w skali planu; Ghirapur wyłącznie jako plama z nazwą; detal '
             'miasta w nakładce L2 (ghirapur.svg od progu zoomu). Trzy '
             'rzeki i zlewisko, Peema, Vahd, Lathnu/Devra; skala wyłączona '
             '(brak odległości w kanonie).'),
    'ocean': {},
    'lądy': [{'id': 'kaladesh', 'punkty': LAD}],
    'rzeki': [
        {'id': 'vinday', 'punkty': VINDAY, 'opcje': {'s0': 4, 's1': 8}},
        {'id': 'suramal', 'punkty': SURAMAL, 'opcje': {'s0': 3, 's1': 6}},
        {'id': 'vasavati', 'punkty': VASAVATI,
         'opcje': {'s0': 7, 's1': 11, 'zrodlo': False}},
        {'id': 'mapani', 'punkty': MAPANI, 'opcje': {'s0': 2, 's1': 4}},
    ],
    'pasma': [
        {'id': 'devra', 'punkty': [[5500, 1400], [7000, 1250], [8500, 1350],
                                  [10000, 1250], [11200, 1400]],
         'opcje': {'szer': 60}},
        # Aleja Olbrzymów Z POWROTEM u bram (kanon: „nad Vindayem”) —
        # ta sama łamana co w L2 (dorysowanie bez szwów).
        {'id': 'aleja-olbrzymow',
         'punkty': [[9860, 6560], [10030, 6600], [10210, 6660]],
         'opcje': {'szer': 44}},
    ],
    'biomy': [
        # Peema: znaczki puszczy (skala planu) — lekko, bo każde drzewo
        # to ~1,4 kB SVG, a plan ma być szybki.
        {'id': 'peema-pln', 'typ': 'las',
         'punkty': [[1500, 3800], [4500, 3600], [7000, 4200], [8000, 5200],
                    [7800, 5800], [6000, 5600], [3000, 5400], [1200, 5000]],
         'opcje': {'gestosc': 0.0025, 'skala': 1.5}},
        {'id': 'peema-pld', 'typ': 'las',
         'punkty': [[1000, 5620], [3500, 5850], [6000, 6220], [7500, 6600],
                    [7200, 7400], [4500, 7400], [1500, 6800]],
         'opcje': {'gestosc': 0.0025, 'skala': 1.5}},
        {'id': 'vahd-step', 'typ': 'step',
         'punkty': [[12800, 2400], [14800, 2300], [15400, 3400],
                    [14700, 4500], [13000, 4600], [12500, 3500]],
         'opcje': {'gestosc': 0.06}},
        {'id': 'step-centralny', 'typ': 'step',
         'punkty': [[8100, 4300], [9700, 4300], [9750, 5900], [8200, 6000]],
         'opcje': {'gestosc': 0.03}},
        {'id': 'step-wschodni', 'typ': 'step',
         'punkty': [[10800, 5000], [13000, 5000], [13200, 7800],
                    [11000, 8000], [10800, 6800]],
         'opcje': {'gestosc': 0.03}},
    ],
    'dzielnice': [
        # Plama miasta (bez granicy): z oddalenia kropka; L2 ją przykrywa.
        {'id': 'ghirapur-plama',
         'punkty': [[10260, 6620], [10580, 6580], [10730, 6760],
                    [10720, 6900], [10620, 7030], [10340, 7030],
                    [10260, 6900]],
         'opcje': {'ton': 5, 'bezGranicy': True}},
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
    ],
    'poi': [
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
    ],
    'etykiety': [
        {'tekst': 'Ghirapur', 'x': 10510, 'y': 6550,
         'opcje': {'fs': 38, 'duze': True}},
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
        # Aleja u bram (overlay; L2 jej nie dubluje — schodzi z drogi).
        {'tekst': "Giants' Walk", 'x': 10030, 'y': 6540,
         'opcje': {'fs': 12}},
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
print(f'OK — {OUT} (plan: {len(scena["poi"])} POI, '
      f'{len(scena["etykiety"])} etykiet)')
