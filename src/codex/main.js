/**
 * MTG Lore Codex — punkt startowy witryny.
 *
 * Montuje router (ADR 0001) i renderery; po każdym renderze dokleja
 * interakcje wymagające DOM (tory obrazów karty — ADR 0008, mapa — ADR 0009).
 */

import { uruchomRouter } from './router.js';
import { rama, tytulStrony, nieZnalesc } from './render.js';
import { renderGlowna } from './render-home.js';
import { renderKarte, zamontujToryObrazow } from './render-card.js';
import { renderHaslo } from './render-lore.js';
import { renderPlan } from './render-plane.js';
import { renderListeKart, zamontujFiltryKart, renderListeHasel, renderListePlanow, renderChmoreTagow, renderTag } from './render-lists.js';
import { renderCoNowego } from './render-whatsnew.js';
import { renderSzukanie } from './render-search.js';
import { renderMape, renderMapeIframe, zamontujMape, zamontujWarstweMapy } from './render-map.js';

function renderuj(trasa) {
  const app = globalThis.document?.getElementById('app');
  if (!app) return;

  let aktywna = trasa.nazwa;
  let tytul = 'MTG Lore Codex';
  let html;

  switch (trasa.nazwa) {
    case 'glowna': html = renderGlowna(); tytul = 'MTG Lore Codex'; break;
    case 'karty': html = renderListeKart(); tytul = 'Karty'; break;
    case 'karta': html = renderKarte(trasa.param); tytul = trasa.param ?? 'Karta'; aktywna = 'karty'; break;
    case 'hasla': html = renderListeHasel(); tytul = 'Hasła'; break;
    case 'haslo': html = renderHaslo(trasa.param); tytul = trasa.param ?? 'Hasło'; aktywna = 'hasla'; break;
    case 'plany': html = renderListePlanow(); tytul = 'Plany'; break;
    case 'plan': html = renderPlan(trasa.param); tytul = trasa.param ?? 'Plan'; aktywna = 'plany'; break;
    case 'mapa': html = renderMapeIframe(trasa.param, trasa.query); tytul = trasa.param ? `Mapa: ${trasa.param}` : 'Mapa'; aktywna = 'plany'; break;
    case 'tagi': html = renderChmoreTagow(); tytul = 'Tagi'; break;
    case 'tag': html = renderTag(trasa.param); tytul = `Tag: ${trasa.param ?? ''}`; aktywna = 'tagi'; break;
    case 'co-nowego': html = renderCoNowego(); tytul = 'Co nowego'; break;
    case 'szukaj': html = renderSzukanie(trasa.query.q); tytul = 'Szukaj'; break;
    default: html = nieZnalesc(trasa.param ?? 'strona'); break;
  }

  app.innerHTML = rama(aktywna, tytul, html);
  tytulStrony(tytul);
  zamontujToryObrazow(app);
  zamontujWarstweMapy(app);
  zamontujFiltryKart(app);

  const tresc = app.querySelector('.tresc');
  if (tresc) tresc.scrollTop = 0;
  globalThis.scrollTo?.(0, 0);
}


// ── Tryb strony mapy (ADR 0027 v2): plik maps/<plan>.html ustawia
// globalThis.CODEX_MAPA i dostaje pełny bundle — zamiast routera
// renderujemy jedną mapę (deep-link ?pin=… z query) i montujemy
// interakcje. Nawigacja treściowa idzie postMessage do rodzica.
if (globalThis.CODEX_MAPA) {
  const app = globalThis.document?.getElementById('app');
  if (app) {
    const q = new URLSearchParams(globalThis.location?.search ?? '');
    app.innerHTML = renderMape(globalThis.CODEX_MAPA, { pin: q.get('pin') ?? '' }, { osadzona: true });
    // Warstwa karty i nawigacja żyją w rodzicu (postMessage) — strona
    // mapy montuje tylko pan/zoom/nakładkę.
    zamontujMape(app, { doRodzica: true });
  }
} else {
  // ── Artefakt główny: router + odbiór komunikatów ze stron map w iframe:
  //    codexHash  → zmiana trasy;
  //    codexKarta → warstwa karty NAD CAŁYM Codexem (feedback właściciela).
  globalThis.addEventListener?.('message', (e) => {
    const d = e?.data ?? {};
    if (typeof d.codexHash === 'string' && d.codexHash.startsWith('#/')) {
      globalThis.location.hash = d.codexHash;
    }
    if (typeof d.codexKarta === 'string' && /^[a-z0-9-]+$/.test(d.codexKarta)) {
      const app = globalThis.document?.getElementById('app');
      const warstwa = app?.querySelector?.('[data-map-warstwa]');
      const tresc = warstwa?.querySelector?.('[data-map-warstwa-tresc]');
      if (!warstwa || !tresc) { globalThis.location.hash = `#/karta/${d.codexKarta}`; return; }
      tresc.innerHTML = renderKarte(d.codexKarta);
      warstwa.hidden = false;
      zamontujToryObrazow(warstwa);
      warstwa.querySelector?.('[data-map-warstwa-zamknij]')?.focus?.();
    }
  });
  const stop = uruchomRouter(renderuj);
  if (globalThis.__CODEX_TEST__) globalThis.__CODEX_STOP__ = stop;
}
