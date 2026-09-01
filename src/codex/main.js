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
import { renderMape, zamontujMape } from './render-map.js';

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
    case 'mapa': html = renderMape(trasa.param, trasa.query); tytul = trasa.param ? `Mapa: ${trasa.param}` : 'Mapa'; aktywna = 'plany'; break;
    case 'tagi': html = renderChmoreTagow(); tytul = 'Tagi'; break;
    case 'tag': html = renderTag(trasa.param); tytul = `Tag: ${trasa.param ?? ''}`; aktywna = 'tagi'; break;
    case 'co-nowego': html = renderCoNowego(); tytul = 'Co nowego'; break;
    case 'szukaj': html = renderSzukanie(trasa.query.q); tytul = 'Szukaj'; break;
    default: html = nieZnalesc(trasa.param ?? 'strona'); break;
  }

  app.innerHTML = rama(aktywna, tytul, html);
  tytulStrony(tytul);
  zamontujToryObrazow(app);
  zamontujMape(app, { renderKarty: renderKarte, zamontujKarte: zamontujToryObrazow });
  zamontujFiltryKart(app);

  const tresc = app.querySelector('.tresc');
  if (tresc) tresc.scrollTop = 0;
  globalThis.scrollTo?.(0, 0);
}


const stop = uruchomRouter(renderuj);
if (globalThis.__CODEX_TEST__) globalThis.__CODEX_STOP__ = stop;
