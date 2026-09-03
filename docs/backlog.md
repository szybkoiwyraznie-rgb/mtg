# Backlog (rozpoznanie, NIE kolejka zadań)

> Wpis w backlogu nie upoważnia sesji do pracy. Zadania przychodzą od
> właściciela albo z Pętli Jakości. Tu zapisujemy rozpoznanie, żeby nie
> robić go drugi raz. (Konwencja dziedziczona z mtg-game.)

## Kolejka link-miningu: encje czekające na drugą kartę (Śródziemie)

Hasło powstaje, gdy ≥2 karty odwołują się do encji w treści (zasada
właściciela 2026-08-31; SZKIELET_HASLA.md). Licznik wzmianek — karty
mówiące o encji **w treści** (nie samym tagiem):

| Encja | Klasa (docelowa) | Karty wspominające | Do hasła brakuje |
|---|---|---|---|
| crebain | fauna | 1ltr-dunland-crebain | 1 karta |
| dunland | geografia | 1ltr-dunland-crebain | 1 karta |
| isengard | geografia | 1ltr-dunland-crebain | 1 karta |
| Saruman | postac | 1ltr-dunland-crebain | 1 karta |
| Uruk-hai | spolecznosc | 1ltr-dunland-crebain | 1 karta |
| Biała Ręka | koncepcja | 1ltr-dunland-crebain | 1 karta |
| rohan | geografia | — (plan srodziemie wspomina) | licznik od kart, nie planów |

## Kolejka link-miningu: encje czekające na drugą kartę (Zendikar)

| Encja | Klasa (docelowa) | Karty wspominające | Do hasła brakuje |
|---|---|---|---|
| tazeem | geografia | 2bfz-coralhelm-guide | 1 karta |
| halimar | geografia | 2bfz-coralhelm-guide | 1 karta |
| coralhelm | geografia | 2bfz-coralhelm-guide | 1 karta |
| sea gate | geografia | 2bfz-coralhelm-guide, plan zendikar | licznik od kart, nie planów |
| Jori En | postac | 2bfz-coralhelm-guide | 1 karta |
| merfolk | spolecznosc | 2bfz-coralhelm-guide | 1 karta |
| Roil | koncepcja | 2bfz-coralhelm-guide, plan zendikar | licznik od kart, nie planów |
| Eldrazi | koncepcja | 2bfz-coralhelm-guide, plan zendikar | licznik od kart, nie planów |

## Kolejka link-miningu: encje czekające na drugą kartę (Ravnica)

Sesja PR-14 (2026-09-03) — link-mining po dostawie 137GPT: encje
Rawnicy są już wspólnym mianownikiem karty, planu i mapy, ale licznik
progowy idzie od KART (zasada właściciela 2026-08-31) — hasła ruszą
przy drugiej karcie planu.

| Encja | Klasa (docelowa) | Karty wspominające | Do hasła brakuje |
|---|---|---|---|
| Boros | spolecznosc | 137gpt-withstand | 1 karta |
| Legion Boros | spolecznosc | 137gpt-withstand, plan ravnica | licznik od kart, nie planów |
| Dziesiąty Dystrykt | geografia | 137gpt-withstand, plan ravnica | licznik od kart, nie planów |
| Sunhome | geografia | 137gpt-withstand, plan ravnica | licznik od kart, nie planów |
| Tin Street | geografia | 137gpt-withstand, plan ravnica | licznik od kart, nie planów |
| Pakt Gildii | magia | 137gpt-withstand, plan ravnica | licznik od kart, nie planów |

## Mapa Zendikaru — WYKONANA (ADR 0012)

Zrobione 2026-08-31 (feedback G właściciela): **rekonstrukcja własna
wariantu T3** w `maps/zendikar/` (podkład SVG + map.json z flagą
`rekonstrukcja: true`). Oficjalna mapa planu nigdy nie powstała;
układ kontynentów z kanonu tekstowego (Plane Shift: Zendikar),
wzorowany układem map fanowskich. Murasa ma linię przerywaną
(„położenie przybliżone” — w kanonie nieustalone). Kotwice etykiet
(Tazeem, Halimar, Sea Gate, Emeria, Akoum, Oko Ugina, Bala Ged,
Guul Draz, Malakir, Ondu, Agadeem, Beyeen, Wyspy Jwar, Sejiri,
Murasa) czekają na pinezki kolejnych kart Zendikaru. Jeśli Wizards
kiedyś opublikuje oficjalną mapę — ponowić decyzję (T2/T1).

Przy materializacji encji w drugiej karcie: utworzyć hasło wg
SZKIELET_HASLA.md i **dopisać wikilinki ze wszystkich stron, które ją
wspominają** (Pętla Jakości, krok 3). Wycofane 2026-08-31 hasła
przedwcześnie utworzone (crebain/dunland/isengard/rohan) — treść do
odzyskania z git history (commit e8fa07a) po odblokowaniu progów.

Regiony mapy Śródziemia (`maps/srodziemie/map.json`) wracają razem
z hasłami geograficznymi (MA4/MA5); wyliczone bboxy do odzyskania
z commit e8fa07a.

## Wyszukiwarka fuzzy

Domyślna wyszukiwarka to substring po tytułach/tagach/planach. Gdy baza
przerośnie ~50 stron: indeks n-gramowy albo odległość Levenshteina w
czystym JS (zero deps, ADR 0002). Koszt mały, priorytet niski dopóki
właściciel nie zaznaczy frustacji.

## Cache obrazów Scryfalla w repo (pełny offline)

ADR 0004 świadomie linkuje obrazy URL-em. Pełny offline (Pages bez sieci /
samolot) wymagałby pobierania `normal` do `assets/` — decyzja odroczona do
momentu, gdy offline stanie się realnym scenariuszem. Wymaga ADR
(budżet rozmiaru + narzędzie pobierania przez `fetch_page`).

## Grafiki dla Kart Haseł

Slot istnieje (ADR 0008 §5). Otwarte pytania właściciela: czy generować,
jaki styl, czy trzymać w repo (i pod jakim budżetem). Wznowić po
pierwszych 5+ hasłach, gdy zobaczymy, jak strony wyglądają bez grafik.

## Wektoryzacja T2 mapy Śródziemia

Decyzja po obejrzeniu T1 (K3/K4). Technika: własny skrypt śledzący
krawędzie po kwantyzacji kolorów; alternatywnie hybryda selektywna
(wektorowe tylko wybrzeża + rzeki + granice regionów lore).

## Podbicie akcji w workflowach (właściciel; wymaga uprawnienia `workflows`)

Runnery GitHub wymuszają Node 24 na akcjach targetujących Node 20 —
`ci.yml` i `pages.yml` używają `checkout@v4`/`setup-node@v4` (ostrzeżenie
deprekacji, nie błąd). Podbić na `@v5` przy okazji pierwszej zmiany
właściciela w `.github/`. Wariant hardeningu z sesji PR-4 (odrzucony
push): `configure-pages@v5` z `with: enablement: true` — tworzy site
Pages, gdyby kiedykolwiek został odrzucony/usunięty (L6).

## RSS/JSON „Co nowego"

`content/co-nowego.md` + strona HTML wystarczą na start. Ewentualny kanał
maszynowy — gdy pojawi się drugi konsument.

## Eksport bazy (backup poza git)

Repozytorium jest backupem treści; ewentualny eksport JSON/HTML poza
GitHub — niski priorytet, wymaga decyzji właściciela.

## Mapa globalna „wszystkie plany"

Pinezki kart na wielu mapach planów; pomysł na widok przeglądowy
(plan → liczba kart). Czysto UI, po K4.

## Normalizacja nazw wydruków (setów)

Snapshoty Scryfalla niosą `set`/`set_name`; przy dziesiątkach kart może
przydać się rejestr `content/sets.json` z polskimi opisami. Zbierać
potrzebę przy pierwszym panelu filtrów po wydaniach.
