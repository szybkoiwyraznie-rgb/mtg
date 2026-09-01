/**
 * mapforge/geom.mjs — geometria deterministyczna (warsztat T4, ADR 0018).
 *
 * Zero zależności. Wszystkie funkcje czyste; „losowość" wyłącznie
 * przez prng() inicjowany stabilnym seedem (hash id obiektu sceny),
 * żeby przy edycji jednego obiektu pozostałe się nie przetasowały.
 */

/** FNV-1a → uint32 (stabilny hash stringa). */
export function hash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — deterministyczny PRNG; seed: liczba lub string. */
export function prng(seed) {
  let a = typeof seed === 'string' ? hash(seed) : seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const zaokr = (v, p = 1) => {
  const m = 10 ** p;
  return Math.round(v * m) / m;
};

const P = (pt) => `${zaokr(pt[0])},${zaokr(pt[1])}`;

/** Chaikin — wygładzanie łamanej (zachowuje końce, jeśli !closed). */
export function chaikin(pts, iter = 2, closed = false) {
  let w = pts;
  for (let k = 0; k < iter; k++) {
    const n = w.length;
    if (n < 3) return w;
    const out = [];
    if (!closed) out.push(w[0]);
    const ostatni = closed ? n : n - 1;
    for (let i = 0; i < ostatni; i++) {
      const a = w[i];
      const b = w[(i + 1) % n];
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
      out.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    if (!closed) out.push(w[n - 1]);
    w = out;
  }
  return w;
}

/** Łamana → path d (odcinki proste). */
export function prosta(pts, closed = false) {
  if (!pts.length) return '';
  return `M ${P(pts[0])} ${pts.slice(1).map((p) => `L ${P(p)}`).join(' ')}${closed ? ' Z' : ''}`;
}

/** Catmull-Rom → krzywa złożona z cubic Bezier — path d. */
export function gladka(pts, { closed = false, t = 1 } = {}) {
  const n = pts.length;
  if (n < 3) return prosta(pts, closed);
  const pkt = (i) => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  let d = `M ${P(pkt(0))}`;
  const ostatni = closed ? n : n - 1;
  for (let i = 0; i < ostatni; i++) {
    const p0 = pkt(i - 1), p1 = pkt(i), p2 = pkt(i + 1), p3 = pkt(i + 2);
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * t, p1[1] + ((p2[1] - p0[1]) / 6) * t];
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * t, p2[1] - ((p3[1] - p1[1]) / 6) * t];
    d += ` C ${P(c1)} ${P(c2)} ${P(p2)}`;
  }
  return closed ? `${d} Z` : d;
}

/** Point-in-polygon (ray casting). */
export function pit([x, y], poly) {
  let w = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) w = !w;
  }
  return w;
}

/** Pole wielokąta (wzór sznurowadłowy) — do kalibracji gęstości rozsiewu. */
export function pole(poly) {
  let s = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    s += poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1];
  }
  return Math.abs(s / 2);
}

export function bbox(poly) {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
}

/**
 * Deterministyczny rozsiew punktów w wielokącie z minimalnym odstępem
 * (blue-noise-ish: odrzucanie kandydatów zbyt blisko istniejących).
 * `maski` (poligony lądu) — gdy podane, punkt musi leżeć na lądzie:
 * otoczka biomu bywa szersza niż kontynent (wypukłość nad zatoką),
 * bez maski las „pływa" po oceanie.
 */
export function rozrzut(poly, n, rng, minOdl = 16, maski = null) {
  const { x0, x1, y0, y1 } = bbox(poly);
  const postawione = [];
  const min2 = minOdl * minOdl;
  let proby = 0;
  while (postawione.length < n && proby < n * 60) {
    proby++;
    const p = [x0 + rng() * (x1 - x0), y0 + rng() * (y1 - y0)];
    if (!pit(p, poly)) continue;
    if (maski && maski.length && !maski.some((m) => pit(p, m))) continue;
    if (postawione.some((q) => (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2 < min2)) continue;
    postawione.push(p);
  }
  return postawione;
}

/** Interpreter path d (M/L/C/Q/S/A/H/V/Z, małe = względne) → punkty NA ścieżce. */
export function parsujD(d) {
  const pts = [];
  let cur = [0, 0];
  let start = [0, 0];
  const segs = d.match(/[MLCQASTHVmlcqasthvZz][^MLCQASTHVmlcqasthvZz]*/g) ?? [];
  for (const seg of segs) {
    const c = seg[0];
    const args = (seg.slice(1).match(/-?[\d.]+/g) ?? []).map(Number);
    if (c === 'M' || c === 'm') {
      for (let j = 0; j < args.length - 1; j += 2) {
        cur = (c === 'm' && pts.length) ? [cur[0] + args[j], cur[1] + args[j + 1]] : [args[j], args[j + 1]];
        if (j === 0) start = [...cur];
        pts.push([...cur]);
      }
    } else if (c === 'L' || c === 'l' || c === 'T' || c === 't') {
      for (let j = 0; j < args.length - 1; j += 2) {
        cur = (c === 'l' || c === 't') ? [cur[0] + args[j], cur[1] + args[j + 1]] : [args[j], args[j + 1]];
        pts.push([...cur]);
      }
    } else if (c === 'H' || c === 'h') {
      for (const v of args) { cur = [c === 'h' ? cur[0] + v : v, cur[1]]; pts.push([...cur]); }
    } else if (c === 'V' || c === 'v') {
      for (const v of args) { cur = [cur[0], c === 'v' ? cur[1] + v : v]; pts.push([...cur]); }
    } else if (c === 'C' || c === 'c') {
      for (let j = 0; j < args.length - 5; j += 6) {
        cur = (c === 'c') ? [cur[0] + args[j + 4], cur[1] + args[j + 5]] : [args[j + 4], args[j + 5]];
        pts.push([...cur]);
      }
    } else if (c === 'Q' || c === 'q' || c === 'S' || c === 's') {
      for (let j = 0; j < args.length - 3; j += 4) {
        cur = (c === 'q' || c === 's') ? [cur[0] + args[j + 2], cur[1] + args[j + 3]] : [args[j + 2], args[j + 3]];
        pts.push([...cur]);
      }
    } else if (c === 'A' || c === 'a') {
      for (let j = 0; j < args.length - 6; j += 7) {
        cur = (c === 'a') ? [cur[0] + args[j + 5], cur[1] + args[j + 6]] : [args[j + 5], args[j + 6]];
        pts.push([...cur]);
      }
    } else if (c === 'Z' || c === 'z') {
      cur = [...start];
      pts.push([...cur]);
    }
  }
  return pts;
}

/** Długość łamanej. */
export function dlugosc(pts) {
  let s = 0;
  for (let i = 1; i < pts.length; i++) {
    s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return s;
}

/** Punkt w odległości t∈[0,1] wzdłuż łamanej (proporcjonalnie do długości). */
export function punktNa(pts, t) {
  const cel = t * dlugosc(pts);
  let przebyto = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (przebyto + d >= cel) {
      const u = d === 0 ? 0 : (cel - przebyto) / d;
      return [
        pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u,
        pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u,
      ];
    }
    przebyto += d;
  }
  return pts[pts.length - 1];
}

/** Kierunek łamiej w punkcie t (do obracania etykiet wzdłuż obiektu). */
export function kierunekNa(pts, t) {
  const a = punktNa(pts, Math.max(0, t - 0.02));
  const b = punktNa(pts, Math.min(1, t + 0.02));
  return Math.atan2(b[1] - a[1], b[0] - a[0]);
}

/**
 * Wstęga o liniowo rosnącej szerokości (rzeka, cieśnina) — path d.
 * Zwraca obiekt { d, lewo, prawo } (polilinie krawędzi, przydatne
 * przy ujściach i zbiegach dopływów).
 */
export function wstega(pts, s0 = 3, s1 = 9) {
  const g = chaikin(pts, 2, false);
  const n = g.length;
  const lewo = [];
  const prawo = [];
  for (let i = 0; i < n; i++) {
    const a = g[Math.max(0, i - 1)];
    const b = g[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0];
    let dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    dx /= L; dy /= L;
    const s = s0 + ((s1 - s0) * i) / Math.max(1, n - 1);
    lewo.push([g[i][0] - dy * s, g[i][1] + dx * s]);
    prawo.push([g[i][0] + dy * s, g[i][1] - dx * s]);
  }
  const prawoOdwrocone = [...prawo].reverse(); // kopia — nie mutujemy zwracanych danych
  const d = `${prosta(lewo)} L ${prosta(prawoOdwrocone).slice(1)} Z`;
  return { d, lewo, prawo };
}
