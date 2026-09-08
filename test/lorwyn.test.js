/** ADR 0036/0037: niezmienność kolekcji i wspólna geometria oblicz. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter } from '../src/codex/frontmatter.js';
import { scenaLorwynu, MIEJSCA_LORWYNU, zapiszLorwyn } from '../tools/mapforge/lorwyn-scena-t4.mjs';
import { renderuj, sprawdzWiazania } from '../tools/mapforge/render.mjs';

const mapa = JSON.parse(fs.readFileSync('maps/lorwyn/map.json','utf8'));
const dzien = scenaLorwynu('lorwyn'), noc = scenaLorwynu('shadowmoor');
const bezEtykiet = ({etykiety, ...reszta}) => reszta;
const geometriaSvg = (s) => s.replace(/<text\b[\s\S]*?<\/text>/g,'').replace(/>\s+</g,'><');

test('Lorwyn/Shadowmoor: identyczne sceny i nietekstowa geometria SVG', () => {
  assert.deepEqual(bezEtykiet(dzien), bezEtykiet(noc));
  assert.equal(geometriaSvg(renderuj(dzien)), geometriaSvg(renderuj(noc)));
  assert.deepEqual(sprawdzWiazania(dzien), []);
  assert.deepEqual(sprawdzWiazania(noc), []);
});

test('Lorwyn: pochodne scen i SVG odtwarzają się z generatora', () => {
  for (const [s,j,svg] of [[noc,'scena.json','podklad.svg'],[dzien,'scena-lorwyn.json','podklad-lorwyn.svg']]) {
    assert.deepEqual(JSON.parse(fs.readFileSync(`maps/lorwyn/${j}`,'utf8')),s);
    assert.equal(fs.readFileSync(`maps/lorwyn/${svg}`,'utf8'),renderuj(s));
  }
  for (const m of MIEJSCA_LORWYNU) {
    const k = mapa.kotwice.find((k) => k.nazwa === (m.noc && m.noc !== m.dzien ? `${m.dzien} / ${m.noc}` : m.dzien));
    assert.ok(k,`brak kotwicy ${m.id}`);
    assert.equal(k.x,m.x/2000); assert.equal(k.y,m.y/1400);
    assert.ok(k.pozycja_zrodlo.includes('https://'));
  }
});

test('Lorwyn: nazwy właściwego oblicza, brak Eclipsed i wymyślonych aliasów', () => {
  const d=dzien.etykiety.map((e)=>e.tekst),n=noc.etykiety.map((e)=>e.tekst);
  for (const [a,b] of [['Goldmeadow','Mistmeadow'],['Kinsbaile','Kinscaer'],['Lys Alana','Cayr Ulios'],['Wanderwine','Wanderbrine']]) {
    assert.ok(d.includes(a)&&!d.includes(b)); assert.ok(n.includes(b)&&!n.includes(a));
  }
  assert.ok(d.includes('The Great Forest') && !n.includes('The Great Forest'));
  for (const s of [d,n]) {
    assert.ok(s.includes('Glen Elendra')&&s.includes('Velis Vel'));
    for (const obce of ['Eirdu','Isilu','Glen Priseil','Boreal Ridge','Caer Flur','Grove of the Aurora Queen']) assert.ok(!s.includes(obce));
  }
  assert.equal(mapa.zrodlo_fanmapa,null);
});

test('605SHM: archiwum, karta, snapshot i pinezka zachowują tożsamość właściciela', () => {
  const wpis=parseFrontmatter(fs.readFileSync('collection/entries/605shm-consign-to-dream.md','utf8'));
  const karta=parseFrontmatter(fs.readFileSync('content/cards/605shm-consign-to-dream.md','utf8'));
  const snap=JSON.parse(fs.readFileSync('scryfall/605shm-consign-to-dream.json','utf8'));
  assert.equal(wpis.data.imgId,'605SHM'); assert.equal(karta.data.imgId,'605SHM');
  assert.equal(karta.data.slug,'605shm-consign-to-dream'); assert.equal(snap.slug,karta.data.slug);
  assert.equal(mapa.pinezki.filter((p)=>p.karta===karta.data.slug).length,1);
  assert.equal(karta.data.pinezka.mapa,'lorwyn');
  const fab=fs.readFileSync('docs/plans/PLAN_2026-09-07-lorwyn-shadowmoor-consign-to-dream-research.md','utf8').match(/^> (W spowitych.*)$/m)[1];
  assert.equal(wpis.body.trim(),fab,'Fabuła verbatim');
  for(const w of mapa.warianty) {
    assert.equal(w.wariant,'T4'); assert.deepEqual(w.kalibracja,{sx:1,sy:1,ox:0,oy:0});
  }
  assert.equal(mapa.warianty.find((w)=>w.domyslny).id,'shadowmoor');
});

test('generator Lorwynu nigdy nie nadpisuje istniejącego rejestru pinezek', () => {
  const kat=fs.mkdtempSync(path.join(os.tmpdir(),'codex-lorwyn-'));
  const rejestr='{"pinezki":[{"karta":"kolejna-karta-wlasciciela"}],"wlasna_notka":"zachowaj"}\n';
  try {
    fs.writeFileSync(path.join(kat,'map.json'),rejestr);
    zapiszLorwyn(kat);
    assert.equal(fs.readFileSync(path.join(kat,'map.json'),'utf8'),rejestr);
  } finally {fs.rmSync(kat,{recursive:true,force:true});}
});
