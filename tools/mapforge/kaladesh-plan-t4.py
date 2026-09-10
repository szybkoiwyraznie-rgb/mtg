#!/usr/bin/env python3
"""Kaladesh T4 — PLAN (mapa ogólna, skala planu jak Zendikar).

ADR 0047 (dwie osobne mapy): plan rysuje się w skali planu (płótno
2000×1400, jak Zendikar i pozostałe plany T3/T4), a NIE w skali mastera
miasta. Ghirapur to POI-KROPKA z etykietą — miasto ma własną, osobną mapę
(`kaladesh-ghirapur-l2.py` → `ghirapur.svg`), podgrywaną twardą podmianą
deep-zoom od progu (wariant `bbox`+`prog` w map.json). Góry i biomy planu
są DUŻE i proporcjonalne do arkusza planu (benchmark: Zendikar, ADR 0015).

Geometria wywodzi się z poprzedniej sceny 16000×11000 przez jednolite
przeskalowanie do 2000×1400 (SX=0.125, SY=1400/11000) — układ normalizowany
0–1 (pinezki, kotwice) pozostaje bez zmian. Densyty i skale glifów ustawione
na wartości „planu" (jak Zendikar), nie „mastera miasta".

Determinizm: PRNG z hasha id (mapforge). Renderować przez
    node tools/mapforge/cli.mjs maps/kaladesh/scena.json -o maps/kaladesh/podklad.svg
"""
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent.parent / 'maps' / 'kaladesh' / 'scena.json'

# Skala planu (arkusz jak Zendikar) — wszystkie inne plany T3/T4 = 2000×1400.
SZER, WYS = 2000, 1400

# Współczynniki z poprzedniej sceny 16000×11000 → 2000×1400 (układ 0–1 stały).
SX = SZER / 16000          # 0.125
SY = WYS / 11000           # 0.127272…


def T(x, y):
    return [round(x * SX, 1), round(y * SY, 1)]


def TL(lamana):
    return [T(x, y) for x, y in lamana]


# ── Rzeki (osie kanoniczne; Kanał Dukhara to detal mapy miasta) ─────────
VINDAY = TL([[150, 5300], [1500, 5400], [3500, 5600], [5500, 5900],
             [7500, 6300], [9000, 6600], [10000, 6720], [10260, 6755],
             [10410, 6785], [10500, 6800]])
SURAMAL = TL([[9800, 900], [9900, 2500], [10000, 4000], [10100, 5200],
              [10250, 6100], [10430, 6650], [10470, 6740], [10500, 6800]])
VASAVATI = TL([[10500, 6800], [10525, 6880], [10560, 6960], [10620, 7600],
               [10700, 8300], [10800, 8900], [10850, 9300]])
MAPANI = TL([[13200, 2000], [12400, 3000], [11400, 4000], [10400, 5200],
             [9900, 6050], [9800, 6705]])

# ── Ląd: kontynent pod ramą N/E/W, morze na południu ───────────────────
WYBRZEZE = TL([[16100, 9300], [15000, 9500], [13800, 9300], [12800, 9600],
               [11800, 9400], [11200, 9100], [10950, 9050], [10850, 9260],
               [10750, 9050], [10200, 9300], [9000, 9600], [7500, 9400],
               [6000, 9700], [4500, 9500], [3000, 9800], [1500, 9600],
               [-100, 9800]])
LAD = TL([[-100, -100], [16100, -100]]) + WYBRZEZE + TL([[-100, -100]])

# Kropka Ghirapuru na planie (zlewisko Vinday–Suramal → Vasavati).
GHIRAPUR = T(10500, 6800)   # [1312.5, 865.5]

scena = {
    'nazwa': 'kaladesh-plan-t4',
    'szerokosc': SZER,
    'wysokosc': WYS,
    'styl': 'atlas',
    'opis': ('Kaladesh T4 — PLAN (skala planu, ADR 0047): prowincja jak '
             'Zendikar; Ghirapur jako POI-kropka z etykietą; osobna mapa '
             'miasta (ghirapur.svg) podgrywana twardą podmianą deep-zoom. '
             'Trzy rzeki i zlewisko, Peema, Vahd, Lathnu/Devra; duże, '
             'proporcjonalne góry i lasy; skala wyłączona (brak odległości '
             'w kanonie).'),
    'ocean': {},
    'lądy': [{'id': 'kaladesh', 'punkty': LAD}],
    'rzeki': [
        {'id': 'vinday', 'punkty': VINDAY, 'opcje': {'s0': 1.5, 's1': 3.5}},
        {'id': 'suramal', 'punkty': SURAMAL, 'opcje': {'s0': 1.2, 's1': 2.6}},
        {'id': 'vasavati', 'punkty': VASAVATI,
         'opcje': {'s0': 3, 's1': 5, 'zrodlo': False}},
        {'id': 'mapani', 'punkty': MAPANI, 'opcje': {'s0': 1, 's1': 2}},
    ],
    'pasma': [
        {'id': 'devra', 'punkty': TL([[5500, 1400], [7000, 1250],
                                      [8500, 1350], [10000, 1250],
                                      [11200, 1400]]),
         'opcje': {'szer': 42, 'snieg': True}},
    ],
    'biomy': [
        # Peema: puszcza jak lasy Zendikaru (gęsta masa kęp, nie kropki).
        {'id': 'peema-pln', 'typ': 'las',
         'punkty': TL([[1500, 3800], [4500, 3600], [7000, 4200], [8000, 5200],
                       [7800, 5800], [6000, 5600], [3000, 5400],
                       [1200, 5000]]),
         'opcje': {'gestosc': 0.34, 'skala': 1.12}},
        {'id': 'peema-pld', 'typ': 'las',
         'punkty': TL([[1000, 5620], [3500, 5850], [6000, 6220], [7500, 6600],
                       [7200, 7400], [4500, 7400], [1500, 6800]]),
         'opcje': {'gestosc': 0.34, 'skala': 1.12}},
        {'id': 'vahd-step', 'typ': 'step',
         'punkty': TL([[12800, 2400], [14800, 2300], [15400, 3400],
                       [14700, 4500], [13000, 4600], [12500, 3500]]),
         'opcje': {'gestosc': 0.7}},
        {'id': 'step-centralny', 'typ': 'step',
         'punkty': TL([[8100, 4300], [9700, 4300], [9750, 5900],
                       [8200, 6000]]),
         'opcje': {'gestosc': 0.6}},
        {'id': 'step-wschodni', 'typ': 'step',
         'punkty': TL([[10800, 5000], [13000, 5000], [13200, 7800],
                       [11000, 8000], [10800, 6800]]),
         'opcje': {'gestosc': 0.6}},
    ],
    'drogi': [
        {'id': 'trakt-vahd', 'typ': 'droga',
         'punkty': TL([[10600, 6720], [11400, 6500], [12200, 5800],
                       [13000, 5000], [13400, 4650]])},
        {'id': 'trakt-lathnu', 'typ': 'droga',
         'punkty': TL([[10380, 6680], [9900, 5200], [9200, 3800],
                       [8600, 2600], [8350, 2050]])},
        {'id': 'trakt-poludniowy', 'typ': 'droga',
         'punkty': TL([[10560, 6960], [10550, 7700], [10650, 8300],
                       [10700, 8700]])},
    ],
    'poi': [
        # Ghirapur — stolica na zlewisku: KROPKA (miasto) na planie.
        {'typ': 'miasto', 'id': 'ghirapur', 'x': GHIRAPUR[0], 'y': GHIRAPUR[1],
         'opcje': {'skala': 1.15}},
        {'typ': 'miasto', 'id': 'lathnu', 'x': T(8300, 1900)[0],
         'y': T(8300, 1900)[1], 'opcje': {'skala': 0.8}},
        {'typ': 'szczyt', 'id': 'wielka-wspinka', 'x': T(8300, 750)[0],
         'y': T(8300, 750)[1], 'opcje': {'skala': 1.0, 'snieg': True}},
        {'typ': 'miasto', 'id': 'vahd-wies-1', 'x': T(14000, 3200)[0],
         'y': T(14000, 3200)[1], 'opcje': {'skala': 0.65}},
        {'typ': 'miasto', 'id': 'vahd-wies-2', 'x': T(14600, 3800)[0],
         'y': T(14600, 3800)[1], 'opcje': {'skala': 0.65}},
        {'typ': 'platforma', 'id': 'vahd-przystan', 'x': T(14200, 2900)[0],
         'y': T(14200, 2900)[1], 'opcje': {'skala': 0.9}},
        {'typ': 'iglica', 'id': 'wieza-eterowa-1', 'x': T(2500, 7500)[0],
         'y': T(2500, 7500)[1], 'opcje': {'skala': 1.0}},
        {'typ': 'iglica', 'id': 'wieza-eterowa-2', 'x': T(9500, 7800)[0],
         'y': T(9500, 7800)[1], 'opcje': {'skala': 1.0}},
        {'typ': 'iglica', 'id': 'wieza-eterowa-3', 'x': T(13500, 6000)[0],
         'y': T(13500, 6000)[1], 'opcje': {'skala': 1.0}},
        {'typ': 'iglica', 'id': 'wieza-eterowa-4', 'x': T(6000, 3000)[0],
         'y': T(6000, 3000)[1], 'opcje': {'skala': 1.0}},
        {'typ': 'iglica', 'id': 'wieza-eterowa-5', 'x': T(14500, 8000)[0],
         'y': T(14500, 8000)[1], 'opcje': {'skala': 1.0}},
        {'typ': 'miasto', 'id': 'osada-rybacka', 'x': T(11200, 8800)[0],
         'y': T(11200, 8800)[1], 'opcje': {'skala': 0.65}},
        {'typ': 'miasto', 'id': 'osada-lesna', 'x': T(4500, 6300)[0],
         'y': T(4500, 6300)[1], 'opcje': {'skala': 0.65}},
    ],
    'etykiety': [
        {'tekst': 'Ghirapur', 'x': GHIRAPUR[0], 'y': GHIRAPUR[1],
         'opcje': {'fs': 20, 'przyDo': GHIRAPUR}},
        {'tekst': 'Peema', 'x': T(4500, 4500)[0], 'y': T(4500, 4500)[1],
         'opcje': {'fs': 24, 'duze': True}},
        {'tekst': 'Vahd', 'x': T(13900, 3400)[0], 'y': T(13900, 3400)[1],
         'opcje': {'fs': 22, 'duze': True}},
        {'tekst': 'Złote Stopnie', 'x': T(13900, 3520)[0],
         'y': T(13900, 3520)[1], 'opcje': {'fs': 11, 'ital': True}},
        {'tekst': 'Lathnu', 'x': T(8300, 1900)[0], 'y': T(8300, 1900)[1],
         'opcje': {'fs': 14, 'przyDo': T(8300, 1900)}},
        {'tekst': 'Devra Cliffs', 'x': T(6800, 1900)[0],
         'y': T(6800, 1900)[1], 'opcje': {'fs': 13}},
        {'tekst': 'The Great Climb', 'x': T(8300, 750)[0], 'y': T(8300, 750)[1],
         'opcje': {'fs': 12, 'przyDo': T(8300, 750)}},
        {'tekst': 'wieś', 'x': T(14000, 3200)[0], 'y': T(14000, 3200)[1],
         'opcje': {'fs': 9, 'przyDo': T(14000, 3200)}},
        {'tekst': 'wieś', 'x': T(14600, 3800)[0], 'y': T(14600, 3800)[1],
         'opcje': {'fs': 9, 'przyDo': T(14600, 3800)}},
        {'tekst': 'przystań sterowców', 'x': T(14200, 2900)[0],
         'y': T(14200, 2900)[1], 'opcje': {'fs': 9, 'przyDo': T(14200, 2900)}},
        {'tekst': 'Aether Collection Tower', 'x': T(2500, 7500)[0],
         'y': T(2500, 7500)[1], 'opcje': {'fs': 9, 'przyDo': T(2500, 7500)}},
        {'tekst': 'Aether Collection Tower', 'x': T(9500, 7800)[0],
         'y': T(9500, 7800)[1], 'opcje': {'fs': 9, 'przyDo': T(9500, 7800)}},
        {'tekst': 'Aether Collection Tower', 'x': T(13500, 6000)[0],
         'y': T(13500, 6000)[1], 'opcje': {'fs': 9, 'przyDo': T(13500, 6000)}},
        {'tekst': 'Aether Collection Tower', 'x': T(6000, 3000)[0],
         'y': T(6000, 3000)[1], 'opcje': {'fs': 9, 'przyDo': T(6000, 3000)}},
        {'tekst': 'Aether Collection Tower', 'x': T(14500, 8000)[0],
         'y': T(14500, 8000)[1], 'opcje': {'fs': 9, 'przyDo': T(14500, 8000)}},
        {'tekst': 'osada rybacka', 'x': T(11200, 8800)[0],
         'y': T(11200, 8800)[1], 'opcje': {'fs': 9, 'przyDo': T(11200, 8800)}},
        {'tekst': 'osada leśna', 'x': T(4500, 6300)[0], 'y': T(4500, 6300)[1],
         'opcje': {'fs': 9, 'przyDo': T(4500, 6300)}},
    ],
    'etykietyLukowe': [
        {'id': 'luk-vinday', 'tekst': 'Vinday',
         'punkty': TL([[2500, 5450], [5000, 5800], [7500, 6250]]),
         'opcje': {'fs': 13}},
        {'id': 'luk-suramal', 'tekst': 'Suramal',
         'punkty': TL([[9920, 2500], [10050, 4200]]),
         'opcje': {'fs': 13}},
        {'id': 'luk-vasavati', 'tekst': 'Vasavati',
         'punkty': TL([[10650, 8000], [10780, 8700]]),
         'opcje': {'fs': 13}},
        {'id': 'luk-mapani', 'tekst': 'Mapani',
         'punkty': TL([[12400, 3100], [11000, 4300]]),
         'opcje': {'fs': 11}},
    ],
    'kompas': {'x': T(15200, 10200)[0], 'y': T(15200, 10200)[1], 'r': 42},
    'skala': False,
    'ramka': {'margines': 18, 'passePartout': True},
}

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(scena, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'OK — {OUT} (plan {SZER}×{WYS}: {len(scena["poi"])} POI, '
      f'{len(scena["etykiety"])} etykiet; Ghirapur kropką w {GHIRAPUR})')
