/** Testy renderera markdown — escaping, wikilinki, tabele, listy. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown } from '../src/codex/markdown.js';
import { slugify, parseWikilinks, SLUG_RE } from '../src/codex/links.js';

const resolverOK = (slug) => ({ href: `#/haslo/${slug}`, tytul: slug, typ: 'haslo' });

test("escape'uje HTML w treści (bezpieczeństwo)", () => {
  const { html } = renderMarkdown('<script>alert(1)</script>');
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('<script>'));
});

test('wikilink rozwiązany przez resolver staje się linkiem wewnętrznym', () => {
  const { html, problemy } = renderMarkdown('Zobacz [[crebain]] oraz [[crebain|kruki]].', { resolveLink: resolverOK });
  assert.equal(problemy.length, 0);
  assert.ok(html.includes('<a href="#/haslo/crebain">crebain</a>'));
  assert.ok(html.includes('<a href="#/haslo/crebain">kruki</a>'));
});

test('martwy wikilink jest zgłoszony jako problem (nie cichy)', () => {
  const { html, problemy } = renderMarkdown('Zobacz [[nieistniejace]].', { resolveLink: () => null });
  assert.equal(problemy.length, 1);
  assert.ok(problemy[0].includes('nieistniejace'));
  assert.ok(html.includes('martwy-link'));
});

test('linki zewnętrzne otwierają się w nowej karcie; javascript: zablokowany', () => {
  const { html } = renderMarkdown('[a](https://example.com) [b](javascript:alert(1)) [c](#/karta/x)');
  assert.ok(html.includes('href="https://example.com" target="_blank" rel="noopener"'));
  assert.ok(!html.includes('javascript:'));
  assert.ok(html.includes('href="#/karta/x"'));
});

test('nagłówki, listy, cytat, hr, pogrubienie', () => {
  const { html } = renderMarkdown('## Tytuł\n\n- a\n- b\n\n> cytat\n\n---\n\n**grube** i *kursywa* i `kod`');
  assert.ok(html.includes('<h2>Tytuł</h2>'));
  assert.ok(html.includes('<ul><li>a</li><li>b</li></ul>'));
  assert.ok(html.includes('<blockquote>'));
  assert.ok(html.includes('<hr>'));
  assert.ok(html.includes('<strong>grube</strong>'));
  assert.ok(html.includes('<em>kursywa</em>'));
  assert.ok(html.includes('<code>kod</code>'));
});

test('tabela pipe z nagłówkiem i wierszami', () => {
  const { html } = renderMarkdown('| A | B |\n|---|---|\n| 1 | 2 |');
  assert.ok(html.includes('<table>'));
  assert.ok(html.includes('<th>A</th>'));
  assert.ok(html.includes('<td>1</td>'));
});

test('slugify transliteruje polskie znaki i czyści interpunkcję', () => {
  assert.equal(slugify('Śródziemie'), 'srodziemie');
  assert.equal(slugify('Wiedźmin: Dziki Gon!'), 'wiedzmin-dziki-gon');
  assert.equal(slugify('Dunland Crebain'), 'dunland-crebain');
  assert.ok(SLUG_RE.test(slugify('1LTR Dunland Crebain')));
  assert.ok(!SLUG_RE.test('Zły Slug!'));
});

test('parseWikilinks wyciąga slugi i etykiety', () => {
  const linki = parseWikilinks('[[a]] i [[b|etykieta]]');
  assert.deepEqual(linki.map((l) => l.slug), ['a', 'b']);
  assert.equal(linki[1].etykieta, 'etykieta');
});
