#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Budowniczy sceny mapy Tarkiru (T4 — rekonstrukcja kanoniczna, atlas).

Tarkir nie ma oficjalnej mapy (Planeswalker's Guide KTK 2014 i TDM 2025
to same opisy; MTG Wiki bez kategorii map planu). Research T2→T3→T4
z 2026-09-07: maps/tarkir/zrodlo-research.md. Właściciel wybrał T4
i dostarczył (2026-09-07) raster fanowski „Tarkir Map 2025 (EN)” —
Lore Café / MTG Wiki Italia, grafika 3d4 („Dedicated to MTG Wiki Italia,
a Lore Café production; All Rights Reserved”) — jako ŹRÓDŁO POMOCNICZE
GEOMETRII (ADR 0031): układ terytoriów i względne położenie POI są
przeniesione z tego rastra, a KANON TEKSTOWY rozstrzyga, co jest na mapie
i jak się nazywa. Raster nie trafia do repo (ADR 0008/0031).

Zgodność rastra z kanonem (sprawdzona przed adopcją): Mardu w centrum
dotyka wszystkich klanów; Sultai na południu; Tiansun na wschodzie;
Qal Sisma na północy; Abzan na zachodzie (graniczy tylko z Mardu
i Sultai); Salt Road Arashin → Sandsteppe Gateway → step → Dirgur/
Purugir; The Scour z gór Temur w step; Qadat między Jeskai a Temur;
Lookout Roost przy górach granicznych Abzan–Sultai; Sage-Eye („Dragon's
Eye”) nad zatoką jeziora; Marang River z gór przez Molderfang Falls
do delty; Screamreach na styku Abzan/Mardu/Sultai — wszystko zgodne
z KTK 2014 i TDM 2025.

EPOKA (ADR 0033 §1–2, analogia Mirrodinu): JEDNA mapa fizyczna Tarkiru
z etykietami osad EPOKI KHANÓW (karta 509KTK jest z KTK — linia czasowa
przed Khanfall). Topografia jest wspólna dla obu linii czasowych;
osady istniejące dopiero w linii smoczych lordów / po Stormnexus
(Qatros Karst, Mistrise, Summer Landing, Storm Crane, Dalkovan cities,
Thunder Stadium, Dragonsong Rock, Jigme, Khava, Kishla, Riverwheel
Village) NIE są rysowane — lista w map.json `poza_epoka`. Obiekty
czysto fizyczne poświadczone tylko w TDM (Glintglaze Lake, Rainveil
Forest, Pearl Lake, Bloomvine Jungle, Marang River, Whisperwood, Brine
Lake, Stormplains, Dusyut Forest, Niraj River, Objung Swamp, The Sagu)
są dopuszczone — góry, jeziora i lasy nie powstają od zmiany khana.

Układ współrzędnych: raster 1568×1208 px → płótno 2000×1400
(skala 1.1589, offset x = 91.4; N u góry). Funkcja R(px, py) przelicza
odczyt z rastra. Kontynent bez oceanu (Sarkhan): ląd wychodzi poza
ramkę (full-bleed), jedynym wielkim akwenem jest południowe morze
śródlądowe, w które uchodzi delta Gudul.

Deterministyczny: pisze maps/tarkir/scena.json. Renderować przez
    node tools/mapforge/cli.mjs maps/tarkir/scena.json -o maps/tarkir/podklad.svg
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'maps' / 'tarkir' / 'scena.json'

W, H = 2000, 1400
S = min(W / 1568, H / 1208)          # 1.1589
OX = (W - 1568 * S) / 2              # 91.4
OY = 0.0


def R(px, py):
    """Odczyt z rastra Lore Café (px) → współrzędne płótna."""
    return [round(OX + px * S, 1), round(OY + py * S, 1)]


def szum(x, y, amp):
    v = math.sin(x * 0.0173 + y * 0.0291) * 43758.5453
    return (v - math.floor(v) - 0.5) * 2 * amp


def poly(pts, j=0.0):
    """Lista punktów rastra → płótno (opcjonalny deterministyczny jitter)."""
    out = []
    for px, py in pts:
        x, y = R(px, py)
        if j:
            x = round(x + szum(x, y, j), 1)
            y = round(y + szum(y, x, j), 1)
        out.append([x, y])
    return out


# ------------------------------------------------------------------ ląd
# Kontynent full-bleed: prostokąt większy niż płótno, z „wygryzionym”
# południowym morzem śródlądowym (zatoka Gudul). Morze = jezioro `d`
# (biały ląd pod spodem, tafla nad nim), więc maska lądu obejmuje całość
# arkusza, a klip dróg/rzek działa jak dotąd.
LAD = [[-60, -60], [W + 60, -60], [W + 60, H + 60], [-60, H + 60]]

# Południowe morze: od zatoki Sage-Eye („Dragon's Eye”) na E po Gudul na S.
MORZE_PTS = poly([
    (1000, 1215), (1020, 1150), (1060, 1105), (1105, 1080), (1150, 1060),
    (1200, 1050), (1250, 1055), (1300, 1075), (1360, 1085), (1420, 1100),
    (1480, 1120), (1540, 1135), (1580, 1160), (1600, 1215),
])


def gladka_d(pts, zamknij=True):
    n = len(pts)
    pk = lambda i: pts[max(0, min(n - 1, i))] if not zamknij else pts[(i + n) % n]
    f = lambda p: f'{p[0]:.1f},{p[1]:.1f}'
    d = f'M {f(pk(0))}'
    rng = range(n) if zamknij else range(n - 1)
    for i in rng:
        p0, p1, p2, p3 = pk(i - 1), pk(i), pk(i + 1), pk(i + 2)
        c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
        c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
        d += f' C {f(c1)} {f(c2)} {f(p2)}'
    return d + (' Z' if zamknij else '')


# ------------------------------------------------------------- terytoria
# Pięć terytoriów klanów (tinty, jak dzielnice Ravniki; bez arterii).
# Granice odczytane z rastra (przerywane linie), uproszczone do łamanych.
T_TEMUR = poly([(0, 0), (1040, 0), (1000, 120), (960, 200), (900, 300),
                (830, 370), (700, 395), (560, 400), (420, 350), (330, 380),
                (250, 420), (150, 420), (90, 400), (0, 380)])
T_JESKAI = poly([(1040, 0), (1568, 0), (1568, 780), (1500, 760), (1440, 720),
                 (1380, 700), (1300, 680), (1240, 640), (1200, 560),
                 (1180, 480), (1150, 420), (1100, 400), (1000, 380),
                 (900, 300), (960, 200), (1000, 120)])
T_ABZAN = poly([(0, 470), (150, 480), (260, 500), (330, 560), (300, 640),
                (330, 720), (420, 780), (520, 810), (620, 860), (700, 900),
                (760, 950), (820, 1000), (860, 1060), (900, 1120), (960, 1170),
                (1000, 1208), (0, 1208)])
T_SULTAI = poly([(760, 950), (820, 1000), (860, 1060), (900, 1120), (960, 1170),
                 (1000, 1208), (1568, 1208), (1568, 780), (1500, 760),
                 (1440, 720), (1380, 700), (1300, 680), (1240, 700),
                 (1180, 740), (1120, 780), (1060, 800), (980, 830),
                 (900, 860), (830, 900)])
T_MARDU = poly([(0, 380), (90, 400), (150, 420), (250, 420), (330, 380), (420, 350),
                (560, 400), (700, 395), (830, 370), (900, 300),
                (1000, 380), (1100, 400), (1150, 420), (1180, 480), (1200, 560),
                (1240, 640), (1300, 680), (1240, 700), (1180, 740), (1120, 780),
                (1060, 800), (980, 830), (900, 860), (830, 900), (760, 950),
                (700, 900), (620, 860), (520, 810), (420, 780), (330, 720),
                (300, 640), (330, 560), (260, 500), (150, 480), (0, 470)])

# Granice regionów (kreskowany szew): każdy szew RAZ.
GRANICE = [
    # Temur | Mardu (cały szew północny — klin Mardu dochodzi do krawędzi W, kanon TDM)
    poly([(0, 380), (90, 400), (150, 420), (250, 420), (330, 380), (420, 350),
          (560, 400), (700, 395), (830, 370), (900, 300)]),
    # Temur | Jeskai
    poly([(900, 300), (960, 200), (1000, 120), (1040, 0)]),
    # Jeskai | Mardu
    poly([(900, 300), (1000, 380), (1100, 400), (1150, 420), (1180, 480),
          (1200, 560), (1240, 640), (1300, 680)]),
    # Jeskai | Sultai
    poly([(1300, 680), (1380, 700), (1440, 720), (1500, 760), (1568, 780)]),
    # Mardu | Sultai
    poly([(1300, 680), (1240, 700), (1180, 740), (1120, 780), (1060, 800),
          (980, 830), (900, 860), (830, 900), (760, 950)]),
    # Mardu | Abzan (od krawędzi W: Stormplains i Sandsteppe Gateway po stronie Abzan)
    poly([(0, 470), (150, 480), (260, 500), (330, 560), (300, 640), (330, 720),
          (420, 780), (520, 810), (620, 860), (700, 900), (760, 950)]),
    # Abzan | Sultai
    poly([(760, 950), (820, 1000), (860, 1060), (900, 1120), (960, 1170),
          (1000, 1208)]),
]

# ---------------------------------------------------------------- pasma
# Linie grzbietów odczytane z rastra (góry rysowane klastrami glifów).
PASMA = [
    # Qal Sisma — trzy równoległe grzbiety całej północy
    {'id': 'qal-sisma-n', 'punkty': poly([(40, 60), (200, 40), (380, 70), (560, 50), (720, 80), (880, 60), (1000, 70)]),
     'opcje': {'szer': 46, 'snieg': True}},
    {'id': 'qal-sisma-s', 'punkty': poly([(60, 205), (200, 240), (330, 215), (470, 250), (620, 235), (760, 262), (880, 235)]),
     'opcje': {'szer': 42, 'snieg': True}},
    {'id': 'qal-sisma-przedgorze', 'punkty': poly([(440, 330), (560, 312), (700, 340), (820, 322)]),
     'opcje': {'szer': 34}},
    # Góry graniczne Temur–Abzan (W) i The Scour u ich stóp
    {'id': 'grzbiet-zachodni', 'punkty': poly([(120, 300), (170, 360), (230, 420), (280, 470)]),
     'opcje': {'szer': 40}},
    # Tiansun — pasmo wschodnie (kilka grzbietów, wulkaniczne)
    {'id': 'tiansun-n', 'punkty': poly([(1060, 120), (1160, 60), (1280, 80), (1400, 50), (1520, 90)]),
     'opcje': {'szer': 46, 'snieg': True}},
    {'id': 'tiansun-c', 'punkty': poly([(1120, 260), (1220, 220), (1330, 250), (1440, 220), (1540, 260)]),
     'opcje': {'szer': 42, 'snieg': True}},
    {'id': 'tiansun-s', 'punkty': poly([(1180, 400), (1280, 385), (1340, 410)]),
     'opcje': {'szer': 40}},
    {'id': 'tiansun-s2', 'punkty': poly([(1400, 425), (1480, 415), (1550, 445)]),
     'opcje': {'szer': 40}},
    {'id': 'tiansun-brzeg', 'punkty': poly([(1330, 560), (1420, 545), (1500, 585), (1560, 640)]),
     'opcje': {'szer': 40}},
    # Góry Abzan (zachodnie krawędzie pustyni)
    {'id': 'gory-brine', 'punkty': poly([(20, 660), (80, 640), (150, 680), (210, 660)]),
     'opcje': {'szer': 36}},
    {'id': 'gory-arashin', 'punkty': poly([(180, 540), (240, 560), (300, 600)]),
     'opcje': {'szer': 30}},
    # Góry graniczne Abzan–Sultai (Lookout Roost) i Sultai–Mardu (pasmo Marang)
    {'id': 'gory-roost', 'punkty': poly([(620, 1000), (680, 1040), (720, 1100), (760, 1160)]),
     'opcje': {'szer': 40}},
    {'id': 'gory-marang', 'punkty': poly([(820, 880), (900, 800), (980, 780), (1060, 820), (1120, 860)]),
     'opcje': {'szer': 48}},
    {'id': 'gory-sultai-wsch', 'punkty': poly([(1140, 900), (1180, 960), (1230, 1010)]),
     'opcje': {'szer': 34}},
]

# --------------------------------------------------------------- wulkany
WULKANY = [
    ('wulkan', R(1080, 165), 'qadat', {'skala': 1.3}),          # Qadat, the Fire Rim
    ('wulkan', R(1360, 305), 'cori-mountain', {'skala': 1.05}),  # Cori Mountain (zalana kaldera)
]

# ---------------------------------------------------------------- jeziora
JEZIORA = [
    {'d': gladka_d(MORZE_PTS), 'cx': 1350, 'cy': 1330, 'rx': 250, 'ry': 60, 'opcje': {'fale': True}},
    # Glintglaze Lake (Temur, NW)
    {'cx': R(260, 150)[0], 'cy': R(260, 150)[1], 'rx': 42, 'ry': 12},
    # Dragon's Throat — wyjąca dolina z jeziorkiem (raster: podłużne jezioro)
    {'cx': R(780, 190)[0], 'cy': R(780, 190)[1], 'rx': 50, 'ry': 10},
    # Pearl Lake (Jeskai, NE)
    {'cx': R(1320, 120)[0], 'cy': R(1320, 120)[1], 'rx': 20, 'ry': 12},
    # Zatoka Sage-Eye („Dragon's Eye”) — zatoka górskiego jeziora pod twierdzą
    {'cx': R(1440, 372)[0], 'cy': R(1440, 372)[1], 'rx': 30, 'ry': 14},
    # Dirgur Lake (Jeskai — Dirgur Stronghold na wyspie)
    {'cx': R(1215, 470)[0], 'cy': R(1215, 470)[1], 'rx': 46, 'ry': 26},
    # Brine Lake (Abzan, W)
    {'cx': R(110, 700)[0], 'cy': R(110, 700)[1], 'rx': 30, 'ry': 12},
    # Objung Swamp — rozlewisko przy Bloomvine
    {'cx': R(1330, 930)[0], 'cy': R(1330, 930)[1], 'rx': 40, 'ry': 16},
]

# ------------------------------------------------------------------ rzeki
RZEKI = [
    # Sandsteppe — rzeka „wypływająca z ziem Abzan” przez Sandsteppe Gateway w step
    {'id': 'sandsteppe', 'punkty': poly([(160, 300), (150, 380), (180, 430), (260, 520), (310, 580),
                                         (330, 640), (360, 680), (430, 720), (480, 760), (540, 790), (620, 800)]),
     'opcje': {'s0': 2.5, 's1': 7}},
    # Niraj River — z gór wschodnich Mardu/Jeskai do Gurmag i morza
    {'id': 'niraj', 'punkty': poly([(1350, 560), (1300, 620), (1280, 700), (1230, 760), (1200, 800),
                                    (1220, 860), (1250, 920), (1280, 980), (1300, 1050), (1320, 1090)]),
     'opcje': {'s0': 2.5, 's1': 7}},
    # Marang River — z roztopów gór (przełęcz z fortecą) przez Molderfang Falls do delty
    {'id': 'marang', 'punkty': poly([(1000, 815), (1015, 850), (1035, 885), (1070, 915), (1120, 940), (1160, 980), (1200, 1000),
                                     (1250, 1010), (1300, 1030), (1360, 1050), (1400, 1085)]),
     'opcje': {'s0': 3, 's1': 9},
     'doplywy': [
         {'id': 'marang-kheru', 'punkty': poly([(980, 1010), (1010, 1050), (1050, 1080), (1100, 1100)])},
     ]},
    # Rzeki Tiansun — wielkie rzeki z roztopów, ku Dirgur Lake
    {'id': 'tiansun-rzeka', 'punkty': poly([(1330, 130), (1320, 200), (1300, 260), (1290, 330), (1260, 400), (1230, 445)]),
     'opcje': {'s0': 2, 's1': 5}},
    {'id': 'dirgur-odplyw', 'punkty': poly([(1230, 495), (1280, 540), (1330, 560)]),
     'opcje': {'s0': 3, 's1': 4, 'zrodlo': False}},
]

# ------------------------------------------------------------------ drogi
DROGI = [
    # Salt Road — W→E: Khava/Arashin → Sandsteppe Gateway → step → Dirgur/Purugir
    {'id': 'salt-road', 'punkty': poly([(130, 800), (200, 730), (250, 690), (300, 640), (320, 600),
                                        (330, 560), (380, 560), (460, 620), (540, 700), (620, 760),
                                        (760, 780), (900, 780), (1050, 720), (1160, 650), (1220, 560),
                                        (1215, 500)]),
     'opcje': {'typ': 'droga'}},
    # Salt Road (odnoga N): Sandsteppe Gateway → stopy Qal Sisma (Staircase of Bones)
    {'id': 'salt-road-n', 'punkty': poly([(330, 560), (400, 500), (520, 420), (640, 360)]),
     'opcje': {'typ': 'szlak'}},
    # Trail of Dead Emperors — droga w górach Tiansun znaczona menhirami
    {'id': 'trail-dead-emperors', 'punkty': poly([(1300, 300), (1360, 260), (1420, 230), (1480, 190)]),
     'opcje': {'typ': 'szlak'}},
    # Dead Reckoning — droga przez bagna na SE Jeskai
    {'id': 'dead-reckoning', 'punkty': poly([(1400, 560), (1440, 620), (1480, 680), (1520, 740)]),
     'opcje': {'typ': 'szlak'}},
    # Szlak Sultai: Kheru → Ukud
    {'id': 'szlak-kheru-ukud', 'punkty': poly([(980, 1050), (1060, 960), (1160, 880), (1280, 830), (1400, 800)]),
     'opcje': {'typ': 'szlak'}},
]

# ---------------------------------------------------------------- szczelina
# The Scour — rozpadlina z Qal Sisma (Temur) „jak blizna” w ziemie Mardu.
SZCZELINY = [
    {'id': 'the-scour', 'punkty': poly([(210, 420), (260, 450), (320, 480), (380, 500), (440, 520), (490, 505)]),
     'opcje': {'szer': 26}},
]

# ------------------------------------------------------------------- POI
# (typ, punkt, id, opcje). Osady w NAZWACH EPOKI KHANÓW; pozycje z rastra
# (uzasadnienie kanoniczne każdej kotwicy w map.json).
POI = WULKANY + [
    # --- Temur Frontier / Qal Sisma
    ('miasto', R(650, 145), 'karakyk-valley', {'skala': 1.0}),         # zimowe leże klanu (cyrk lodowcowy)
    ('szczyt', R(440, 150), 'eternal-ice', {'skala': 1.3}),          # święty szczyt szeptaczy (glif mapome) — u stóp czapy
    ('ognisko', R(760, 315), 'staircase-of-bones', {'skala': 0.9}),    # wzgórze zgromadzeń
    ('ruina', R(130, 190), 'crucible-spirit-dragon', {'skala': 0.9}),  # Grób/Krucybel Ugina (lodowa rozpadlina)
    ('ognisko', R(505, 288), 'ayagor', {'skala': 0.8}),                # Dragon's Bowl (w TDM: Summer Landing)
    # --- Jeskai Way / Tiansun
    ('fort', R(1398, 362), 'dragons-eye', {'skala': 1.1}),            # Sage-Eye Stronghold (zbocze nad zatoką)
    ('fort', R(1262, 338), 'riverwheel', {'skala': 0.95}),            # Riverwheel Stronghold (klif, wodospad)
    ('wodospad', R(1248, 362), 'icefall', {'skala': 0.9}),
    ('fort', R(1215, 470), 'dirgur', {'skala': 1.0}),                 # Dirgur Stronghold (wyspa na jeziorze)
    ('miasto', R(1195, 520), 'purugir', {'skala': 0.8}),              # faktoria Salt Road
    ('fort', R(1460, 165), 'highspire', {'skala': 0.85}),             # Highspire Stronghold (modliszki)
    ('iglica', R(1130, 285), 'initiates-stair', {'skala': 0.9}),      # biały pinakl, 1578 stopni
    # --- Mardu Horde / Sandsteppe
    ('fort', R(230, 580), 'sandsteppe-gateway', {'skala': 1.1}),      # most-forteca na granicy Abzan
    ('fort', R(740, 560), 'wingthrone', {'skala': 1.15}),             # stolica Zurgo (klify, czaszka smoka)
    # --- Abzan Houses / Shifting Wastes
    ('fort', R(230, 700), 'arashin', {'skala': 1.25}),                # Arashin + Mer-Ek (skaliste wzgórze)
    ('drzewo', R(340, 740), 'first-tree', {'skala': 1.6}),            # First Tree (w Arashin) — tu: Kin-Tree
    ('miasto', R(120, 790), 'kavah', {'skala': 0.8}),                 # Kavah — osada dwa dni od Arashin
    ('iglica', R(690, 1010), 'lookout-roost', {'skala': 1.1}),        # wieża 400 stóp z czerwonego kamienia
    ('ruina', R(640, 1110), 'aerie-unfettered', {'skala': 0.9}),      # Aerie of the Unfettered (pradawna)
    # --- Sultai Brood / Gudul
    ('kopula', R(975, 1050), 'kheru', {'skala': 1.15}),               # Kheru Temple (siedziba Sidisi)
    ('miasto', R(930, 1040), 'qarsi', {'skala': 0.85}),               # Qarsi Palace (na kanałach)
    ('ruina', R(1380, 800), 'ukud', {'skala': 1.0}),                  # Ukud Necropolis (Gurmag)
    ('fort', R(1050, 892), 'marang-fortress', {'skala': 0.95}),       # Marang River Fortress (przełęcz, rzeka wychodzi z gór)
    ('wodospad', R(1140, 945), 'molderfang', {'skala': 1.0}),         # Molderfang Falls (Silumgar spadł)
]

POZ = {p[2]: (p[1][0], p[1][1]) for p in POI}


def przy(id_, tekst, fs=15, ital=False):
    x, y = POZ[id_]
    op = {'fs': fs, 'kotwica': 'middle', 'przyDo': [x, y]}
    if ital:
        op['ital'] = True
    return {'tekst': tekst, 'x': x, 'y': y, 'opcje': op}


def obszar(tekst, pt, fs=16, kat=None, ital=True, duze=False, kolor=None):
    op = {'fs': fs, 'kotwica': 'middle'}
    if ital:
        op['ital'] = True
    if kat:
        op['kat'] = kat
    if duze:
        op['duze'] = True
    if kolor:
        op['kolor'] = kolor
    return {'tekst': tekst, 'x': pt[0], 'y': pt[1], 'opcje': op}


GRANAT = '#1c3a5e'

ETYKIETY = [
    # --- tytuły terytoriów (czerń, klasa tytul-kontynentu — ADR 0025)
    obszar('Temur Frontier', R(300, 285), fs=40, ital=False, duze=True),
    obszar('Jeskai Way', R(1395, 468), fs=44, ital=False, duze=True),
    obszar('Mardu Horde', R(820, 640), fs=44, ital=False, duze=True),
    obszar('Abzan Houses', R(430, 930), fs=44, ital=False, duze=True),
    obszar('Sultai Brood', R(960, 1150), fs=44, ital=False, duze=True),
    # --- regiony fizyczne (typografia obszarowa)
    obszar('Qal Sisma', R(880, 128), fs=26, kat=-4),
    obszar('Tiansun', R(1380, 195), fs=26, kat=-15),
    obszar('Sandsteppe', R(520, 455), fs=22, kat=-8),
    obszar('Shifting Wastes', R(170, 1060), fs=26),
    obszar('Stormplains', R(140, 590), fs=17, ital=False),
    obszar('Goldengrave', R(640, 700), fs=17, ital=False),
    obszar('Screamreach', R(830, 850), fs=17, ital=False),
    obszar('The Gurmag Swamp', R(1410, 730), fs=17, ital=False),
    obszar('Bloomvine Jungle', R(1290, 890), fs=20, kat=-28),
    obszar('The Sagu', R(1420, 1105), fs=22),
    obszar('Gudul Islands', R(1100, 1090), fs=16, ital=False),
    obszar('Rainveil Forest', R(680, 395), fs=17, ital=False),
    obszar('Whisperwood', R(548, 232), fs=15, ital=False),
    obszar('Dusyut Forest', R(560, 1020), fs=17, ital=False),
    obszar('Melting Wilds', R(560, 78), fs=15),
    obszar('The Scour', R(320, 425), fs=17, ital=False),
    obszar('Qadat, the Fire Rim', R(1170, 150), fs=18, kat=-8),
    # --- wody (granat, ADR 0024)
    obszar('Glintglaze Lake', R(240, 130), fs=14, ital=False, kolor=GRANAT),
    obszar("Dragon's Throat", R(790, 218), fs=14, ital=False, kolor=GRANAT),
    obszar('Pearl Lake', R(1320, 145), fs=14, ital=False, kolor=GRANAT),
    obszar('Dirgur Lake', R(1215, 445), fs=14, ital=False, kolor=GRANAT),
    obszar("Dragon's Eye Bay", R(1470, 400), fs=13, ital=False, kolor=GRANAT),
    obszar('Brine Lake', R(110, 725), fs=14, ital=False, kolor=GRANAT),
    obszar('Objung Swamp', R(1330, 955), fs=14, ital=False, kolor=GRANAT),
    obszar('Niraj River', R(1235, 785), fs=14, kat=62, kolor=GRANAT),
    obszar('Marang River', R(1215, 1030), fs=15, kat=14, kolor=GRANAT),
    obszar('Sandsteppe River', R(455, 735), fs=13, kat=28, kolor=GRANAT),
    obszar('Morze Południowe', R(1300, 1180), fs=20, kolor=GRANAT),
    # --- szlaki
    obszar('Salt Road', R(560, 735), fs=15, kat=22),
    obszar('Salt Road', R(1120, 700), fs=15, kat=-45),
    obszar('Trail of Dead Emperors', R(1500, 232), fs=13, kat=-30),
    obszar('Dead Reckoning', R(1490, 640), fs=13, kat=58),
    # --- obiekty (kotwica = POI; wzór „pod, konflikt ⇒ nad” — ADR 0022)
    przy('karakyk-valley', 'Karakyk Valley', 16),
    przy('eternal-ice', 'Eternal Ice', 15),
    przy('staircase-of-bones', 'Staircase of Bones', 15),
    przy('crucible-spirit-dragon', 'Tomb of the Spirit Dragon', 14),
    przy('ayagor', 'Ayagor', 14),
    przy('ayagor', "(Dragon's Bowl)", 12, ital=True),
    przy('qadat', 'Qadat', 14),
    przy('dragons-eye', 'Sage-Eye Stronghold', 16),
    przy('riverwheel', 'Riverwheel Stronghold', 15),
    przy('icefall', '(Icefall)', 12, ital=True),
    przy('dirgur', 'Dirgur Stronghold', 16),
    przy('purugir', 'Purugir', 14),
    przy('highspire', 'Highspire Stronghold', 14),
    przy('cori-mountain', 'Cori Mountain Stronghold', 15),
    przy('initiates-stair', "Initiate's Stair", 14),
    przy('sandsteppe-gateway', 'Sandsteppe Gateway', 15),
    przy('wingthrone', 'Wingthrone', 17),
    przy('arashin', 'Arashin', 17),
    przy('arashin', '(Mer-Ek Fortress)', 12, ital=True),
    przy('first-tree', 'First Tree', 13),
    przy('kavah', 'Kavah', 14),
    przy('lookout-roost', 'Lookout Roost', 15),
    przy('aerie-unfettered', 'Aerie of the Unfettered', 14),
    przy('kheru', 'Kheru Temple', 17),
    przy('qarsi', 'Qarsi Palace', 14),
    przy('ukud', 'Ukud Necropolis', 15),
    przy('marang-fortress', 'Marang River Fortress', 14),
    przy('molderfang', 'Molderfang Falls', 14),
]

WODY = ['Glintglaze Lake', "Dragon's Throat", 'Pearl Lake', 'Dirgur Lake', 'Brine Lake', "Dragon's Eye Bay",
        'Objung Swamp', 'Niraj River', 'Marang River', 'Sandsteppe River', 'Morze Południowe',
        'Gudul Islands', 'Molderfang Falls', '(Icefall)']

# ------------------------------------------------------------------ biomy
BIOMY = [
    # Qal Sisma — czapa lodowa na najwyższym grzbiecie (Melting Wilds)
    {'id': 'lodowiec-qal-sisma', 'typ': 'lod', 'punkty': poly([(300, 50), (380, 30), (470, 22), (560, 26), (640, 40), (690, 62), (660, 92), (590, 112), (500, 122), (410, 118), (330, 100), (290, 76)], j=5),
     'opcje': {'pekniecia': 4}},
    # Whisperwood i Rainveil Forest — lasy Temur
    {'id': 'whisperwood', 'typ': 'las', 'punkty': poly([(500, 160), (600, 150), (630, 185), (590, 215), (510, 210), (470, 185)], j=4),
     'opcje': {'gestosc': 0.7, 'skala': 0.9}},
    {'id': 'rainveil', 'typ': 'las', 'punkty': poly([(560, 345), (700, 340), (830, 355), (870, 390), (760, 425), (620, 430), (540, 390)], j=5),
     'opcje': {'gestosc': 0.75, 'skala': 0.95}},
    # Sandsteppe — step Mardu
    {'id': 'sandsteppe', 'typ': 'step', 'punkty': poly([(470, 470), (700, 440), (900, 420), (1100, 440), (1200, 560), (1260, 660),
                                                        (1180, 740), (1000, 810), (860, 870), (720, 900), (560, 830), (420, 770),
                                                        (340, 690), (380, 560)], j=8),
     'opcje': {'gestosc': 0.55}},
    {'id': 'stormplains', 'typ': 'step', 'punkty': poly([(40, 520), (240, 500), (300, 560), (250, 640), (120, 640), (40, 620)], j=6),
     'opcje': {'gestosc': 0.5}},
    # Screamreach — bagna na styku Abzan/Mardu/Sultai
    {'id': 'screamreach', 'typ': 'bagno', 'punkty': poly([(720, 820), (830, 800), (900, 850), (860, 910), (760, 920), (700, 880)], j=5),
     'opcje': {'gestosc': 0.9}},
    # Gurmag Swamp — pas bagien okalający górną część Sultai
    {'id': 'gurmag', 'typ': 'bagno', 'punkty': poly([(1240, 720), (1400, 690), (1560, 720), (1568, 820), (1440, 850), (1300, 820), (1230, 780)], j=6),
     'opcje': {'gestosc': 0.9}},
    # Bloomvine Jungle, The Sagu, delta Gudul — dżungle Sultai
    {'id': 'bloomvine', 'typ': 'las', 'punkty': poly([(1160, 850), (1300, 830), (1440, 860), (1560, 900), (1560, 1030), (1420, 1050),
                                                      (1280, 1060), (1200, 1040), (1150, 960)], j=6),
     'opcje': {'gestosc': 0.8}},
    {'id': 'sagu', 'typ': 'las', 'punkty': poly([(1420, 1060), (1568, 1040), (1568, 1208), (1470, 1208), (1400, 1140)], j=6),
     'opcje': {'gestosc': 0.85, 'skala': 1.1}},
    {'id': 'gudul-dzungla', 'typ': 'las', 'punkty': poly([(880, 990), (1000, 960), (1100, 980), (1140, 1040), (1080, 1090),
                                                          (960, 1110), (880, 1080)], j=5),
     'opcje': {'gestosc': 0.8}},
    {'id': 'gudul-bagna', 'typ': 'bagno', 'punkty': poly([(1000, 1100), (1140, 1080), (1240, 1100), (1200, 1160), (1060, 1170)], j=5),
     'opcje': {'gestosc': 0.8}},
    # Dusyut Forest — zielona plama w pustyni Abzan (raster: ciemnozielona)
    {'id': 'dusyut', 'typ': 'las', 'punkty': poly([(470, 920), (600, 900), (700, 960), (640, 1060), (520, 1080), (430, 1010)], j=5),
     'opcje': {'gestosc': 0.6, 'skala': 0.9}},
    # Shifting Wastes — pustynia (nowy klocek `pustynia`)
    {'id': 'shifting-wastes', 'typ': 'pustynia', 'punkty': poly([(0, 740), (200, 760), (400, 800), (460, 900), (420, 1010),
                                                                  (480, 1120), (560, 1208), (0, 1208)], j=8),
     'opcje': {'gestosc': 1.0}},
    {'id': 'wastes-n', 'typ': 'pustynia', 'punkty': poly([(0, 640), (40, 620), (120, 640), (250, 640), (300, 700), (200, 760), (0, 740)], j=6),
     'opcje': {'gestosc': 0.7}},
    # Tiansun — lasy niższych stoków wokół Dirgur
    {'id': 'tiansun-lasy', 'typ': 'las', 'punkty': poly([(1240, 560), (1330, 580), (1400, 640), (1340, 690), (1250, 660)], j=5),
     'opcje': {'gestosc': 0.55, 'skala': 0.85}},
]

# ------------------------------------------------------------------ scena
SCENA = {
    'nazwa': 'tarkir-t4',
    'szerokosc': W,
    'wysokosc': H,
    'styl': 'atlas',
    'opis': (
        'Tarkir T4 (rekonstrukcja kanoniczna, epoka khanów — ADR 0033): kontynent bez oceanu '
        '(full-bleed), południowe morze śródlądowe z deltą Gudul. Układ terytoriów i względne '
        'pozycje POI przeniesione z rastra fanowskiego Lore Café / MTG Wiki Italia (3d4, 2025) '
        'dostarczonego przez właściciela 2026-09-07 (ADR 0031, źródło pomocnicze geometrii); '
        'zgodność z kanonem KTK 2014 / TDM 2025 sprawdzona relacja po relacji (zrodlo-research.md). '
        'Pięć terytoriów jako tinty (dzielnice bez arterii) + kreskowane szwy granic; Qal Sisma N, '
        'Tiansun E, Sandsteppe centrum, Shifting Wastes W (biom pustynia), Gudul S. Osady w nazwach '
        'epoki khanów; osady linii smoczych lordów/TDM poza mapą (map.json: poza_epoka).'
    ),
    'ocean': {'kolor': '#e9e9e9'},
    'lądy': [{'id': 'kontynent-tarkiru', 'punkty': LAD}],
    'dzielnice': [
        {'id': 'temur', 'punkty': T_TEMUR, 'opcje': {'ton': 0, 'bezGranicy': True}},
        {'id': 'jeskai', 'punkty': T_JESKAI, 'opcje': {'ton': 7, 'bezGranicy': True}},
        {'id': 'mardu', 'punkty': T_MARDU, 'opcje': {'ton': 14, 'bezGranicy': True}},
        {'id': 'abzan', 'punkty': T_ABZAN, 'opcje': {'ton': 4, 'bezGranicy': True}},
        {'id': 'sultai', 'punkty': T_SULTAI, 'opcje': {'ton': 20, 'bezGranicy': True}},
    ],
    'granice': [{'id': f'szew-{i}', 'punkty': g} for i, g in enumerate(GRANICE)],
    'jeziora': JEZIORA,
    'rzeki': RZEKI,
    'pasma': PASMA,
    'szczeliny': SZCZELINY,
    'biomy': BIOMY,
    'drogi': DROGI,
    'poi': [{'typ': t, 'x': pt[0], 'y': pt[1], 'id': i, **({'opcje': o} if o else {})}
            for t, pt, i, o in POI],
    'etykiety': ETYKIETY,
    'strefyWodne': WODY,
    'etykietyWodne': WODY,
    'kompas': {'x': 1880, 'y': 120, 'r': 42},
    'skala': False,
    'ramka': True,
}


def main():
    # kontrola: każdy POI na płótnie i poza morzem
    from math import inf
    for p in SCENA['poi']:
        assert 30 < p['x'] < W - 30 and 30 < p['y'] < H - 30, f"POI {p['id']} poza płótnem"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(SCENA, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'zapisano {OUT.relative_to(ROOT)}: {len(SCENA["poi"])} POI, {len(ETYKIETY)} etykiet, '
          f'{len(BIOMY)} biomów, {len(PASMA)} pasm')


if __name__ == '__main__':
    main()
