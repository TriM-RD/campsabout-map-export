var Dl = Object.defineProperty;
var ql = (r, e, n) => e in r ? Dl(r, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : r[e] = n;
var ie = (r, e, n) => ql(r, typeof e != "symbol" ? e + "" : e, n);
import { Map as Rl } from "maplibre-gl";
class Tl {
  constructor(e) {
    ie(this, "map");
    ie(this, "width");
    ie(this, "height");
    ie(this, "svgCanvas");
    ie(this, "xLine");
    ie(this, "yLine");
    ie(this, "color", "#535353");
    this.map = e, this.mapResize = this.mapResize.bind(this);
  }
  create() {
    this.updateValues(), this.map !== void 0 ? (this.map.on("resize", this.mapResize), this.createCanvas(this.map.getCanvasContainer())) : console.error("map object is null");
  }
  updateValues() {
    var e, n;
    this.width = (e = this.map) == null ? void 0 : e.getCanvas().clientWidth, this.height = (n = this.map) == null ? void 0 : n.getCanvas().clientHeight;
  }
  mapResize() {
    this.updateValues(), this.updateCanvas();
  }
  updateCanvas() {
    if (this.svgCanvas !== void 0 && this.yLine !== void 0 && this.xLine !== void 0 && this.width !== void 0 && this.height !== void 0) {
      this.svgCanvas.setAttribute("width", `${this.width}px`), this.svgCanvas.setAttribute("height", `${this.height}px`);
      const e = this.width / 2, n = this.height / 2;
      this.yLine.setAttribute("x1", `${e}px`), this.yLine.setAttribute("y1", "0px"), this.yLine.setAttribute("x2", `${e}px`), this.yLine.setAttribute("y2", `${this.height}px`), this.xLine.setAttribute("x1", "0px"), this.xLine.setAttribute("y1", `${n}px`), this.xLine.setAttribute("x2", `${this.width}px`), this.xLine.setAttribute("y2", `${n}px`);
    } else
      console.error("element value is null");
  }
  createCanvas(e) {
    if (this.width !== void 0 && this.height !== void 0) {
      const n = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      n.style.position = "relative", n.setAttribute("width", `${this.width}px`), n.setAttribute("height", `${this.height}px`);
      const i = this.width / 2, s = this.height / 2;
      this.yLine = n.appendChild(
        this.createLine(i, 0, i, this.height, this.color, "2px")
      ), this.xLine = n.appendChild(
        this.createLine(0, s, this.width, s, this.color, "2px")
      ), e == null || e.appendChild(n), this.svgCanvas = n;
    }
  }
  createLine(e, n, i, s, o, l) {
    const u = document.createElementNS("http://www.w3.org/2000/svg", "line");
    return u.setAttribute("x1", e), u.setAttribute("y1", n), u.setAttribute("x2", i), u.setAttribute("y2", s), u.setAttribute("stroke-dasharray", "5,5"), u.setAttribute("stroke", o), u.setAttribute("stroke-width", l), u;
  }
  destroy() {
    this.xLine !== void 0 && (this.xLine.remove(), this.xLine = void 0), this.yLine !== void 0 && (this.yLine.remove(), this.yLine = void 0), this.svgCanvas !== void 0 && (this.svgCanvas.remove(), this.svgCanvas = void 0), this.map !== void 0 && (this.map.off("resize", this.mapResize), this.map = void 0);
  }
}
const uc = {
  72: 72,
  96: 96,
  200: 200,
  300: 300,
  400: 400
}, vo = {
  JPEG: "jpg",
  PNG: "png",
  PDF: "pdf",
  SVG: "svg"
}, so = {
  Landscape: "landscape",
  Portrait: "portrait"
}, Ii = {
  // A0, A1, B0, B1 are not working well.
  // A0: [1189, 841],
  // A1: [841, 594],
  LETTER: [279, 216],
  // 8.5x11 - works
  //TABLOID: [432,279] // 11x17 - not working currently prints to 11.68x8.27 in landscape
  A2: [594, 420],
  A3: [420, 297],
  A4: [297, 210],
  A5: [210, 148],
  A6: [148, 105],
  // B0: [1414, 1000],
  // B1: [1000, 707],
  B2: [707, 500],
  B3: [500, 353],
  B4: [353, 250],
  B5: [250, 176],
  B6: [176, 125]
}, Mi = {
  // don't use inch unit. because page size setting is using mm unit.
  in: "in",
  mm: "mm"
};
class zl {
  constructor(e) {
    ie(this, "map");
    ie(this, "width");
    ie(this, "height");
    ie(this, "unit");
    ie(this, "svgCanvas");
    ie(this, "svgPath");
    var l, u, f;
    if (this.map = e, this.map === void 0)
      return;
    this.mapResize = this.mapResize.bind(this), this.map.on("resize", this.mapResize);
    const n = (l = this.map) == null ? void 0 : l.getCanvas().clientWidth, i = (u = this.map) == null ? void 0 : u.getCanvas().clientHeight, s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.style.position = "absolute", s.style.top = "0px", s.style.left = "0px", s.setAttribute("width", `${n}px`), s.setAttribute("height", `${i}px`);
    const o = document.createElementNS("http://www.w3.org/2000/svg", "path");
    o.setAttribute("style", "fill:#888888;stroke-width:0"), o.setAttribute("fill-opacity", "0.5"), s.append(o), (f = this.map) == null || f.getCanvasContainer().appendChild(s), this.svgCanvas = s, this.svgPath = o;
  }
  mapResize() {
    this.generateCutOut();
  }
  updateArea(e, n) {
    this.width = e, this.height = n, this.unit = Mi.mm, this.generateCutOut();
  }
  generateCutOut() {
    var g, y;
    if (this.map === void 0 || this.svgCanvas === void 0 || this.svgPath === void 0)
      return;
    const e = this.toPixels(this.width), n = this.toPixels(this.height), i = (g = this.map) == null ? void 0 : g.getCanvas().clientWidth, s = (y = this.map) == null ? void 0 : y.getCanvas().clientHeight, o = i / 2 - e / 2, l = o + e, u = s / 2 - n / 2, f = u + n;
    this.svgCanvas.setAttribute("width", `${i}px`), this.svgCanvas.setAttribute("height", `${s}px`), this.svgPath.setAttribute(
      "d",
      `M 0 0 L ${i} 0 L ${i} ${s} L 0 ${s} M ${o} ${u} L ${o} ${f} L ${l} ${f} L ${l} ${u}`
    );
  }
  destroy() {
    this.svgCanvas !== void 0 && (this.svgCanvas.remove(), this.svgCanvas = void 0), this.map !== void 0 && (this.map = void 0);
  }
  /**
   * Convert mm/inch to pixel
   * @param length mm/inch length
   * @param conversionFactor DPI value. default is 96.
   */
  toPixels(e, n = 96) {
    return this.unit === Mi.mm && (n /= 25.4), n * e;
  }
}
const jc = {
  PageSize: "Page Size",
  PageOrientation: "Page Orientation",
  Format: "Format",
  DPI: "DPI",
  Generate: "Generate",
  LanguageName: "English",
  LanguageCode: "en"
}, Ul = {
  PageSize: "Taille de page",
  PageOrientation: "Orientation de la page",
  Format: "Format",
  DPI: "DPI",
  Generate: "Générer",
  LanguageName: "Français",
  LanguageCode: "fr"
}, Hl = {
  PageSize: "Sivukoko",
  PageOrientation: "Sivun suunta",
  Format: "Muoto",
  DPI: "DPI",
  Generate: "Generoi",
  LanguageName: "Suomalainen",
  LanguageCode: "fi"
}, Wl = {
  PageSize: "Papierformat",
  PageOrientation: "Papierausrichtung",
  Format: "Dateiformat",
  DPI: "Druckauflösung",
  Generate: "Erstellen",
  LanguageName: "Deutsch",
  LanguageCode: "de"
}, Vl = {
  PageSize: "Sidstorlek",
  PageOrientation: "Sidorientering",
  Format: "Format",
  DPI: "DPI",
  Generate: "Generera",
  LanguageName: "Svenska",
  LanguageCode: "sv"
}, Gl = {
  PageSize: "Tamaño de página",
  PageOrientation: "Orientación de página",
  Format: "Formato",
  DPI: "DPI",
  Generate: "Generar",
  LanguageName: "Española",
  LanguageCode: "es"
}, Jl = {
  PageSize: "Mida",
  PageOrientation: "Orientació",
  Format: "Format",
  DPI: "DPI",
  Generate: "Genera",
  LanguageName: "Catalan",
  LanguageCode: "ca"
}, Yl = {
  PageSize: "Kích thước trang",
  PageOrientation: "Loại trang",
  Format: "Định dạng",
  DPI: "Mật độ điểm ảnh (DPI)",
  Generate: "Tạo",
  LanguageName: "Tiếng Việt",
  LanguageCode: "vi"
}, Xl = {
  PageSize: "Розмір сторінки",
  PageOrientation: "Орієнтація сторінки",
  Format: "Формат",
  DPI: "DPI",
  Generate: "Згенерувати",
  LanguageName: "українська",
  LanguageCode: "uk"
}, $l = {
  PageSize: "页面大小",
  PageOrientation: "页面方向",
  Format: "格式",
  DPI: "像素",
  Generate: "导出",
  LanguageName: "简体字",
  LanguageCode: "zhHans"
}, Kl = {
  PageSize: "頁面大小",
  PageOrientation: "頁面方向",
  Format: "格式",
  DPI: "像素",
  Generate: "導出",
  LanguageName: "繁体字",
  LanguageCode: "zhHant"
}, Zl = {
  PageSize: "ページサイズ",
  PageOrientation: "ページ方向",
  Format: "フォーマット",
  DPI: "DPI（解像度）",
  Generate: "出力",
  LanguageName: "日本語",
  LanguageCode: "ja"
}, Ql = {
  PageSize: "Tamanho da página",
  PageOrientation: "Orientação da página",
  Format: "Formato",
  DPI: "DPI",
  Generate: "Gerar",
  LanguageName: "Português",
  LanguageCode: "pt"
}, th = [
  jc,
  Ul,
  Hl,
  Wl,
  Vl,
  Gl,
  Jl,
  Yl,
  Xl,
  $l,
  Kl,
  Zl,
  Ql
], ru = [
  "en",
  "fr",
  "fi",
  "de",
  "sv",
  "es",
  "ca",
  "vi",
  "uk",
  "zhHans",
  "zhHant",
  "ja",
  "pt"
], eh = (r) => th.find((e) => e.LanguageCode === r) ?? jc;
function de(r) {
  "@babel/helpers - typeof";
  return de = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, de(r);
}
var en = Uint8Array, bn = Uint16Array, Os = Int32Array, Lo = new en([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]), Ao = new en([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]), Ls = new en([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Oc = function(r, e) {
  for (var n = new bn(31), i = 0; i < 31; ++i)
    n[i] = e += 1 << r[i - 1];
  for (var s = new Os(n[30]), i = 1; i < 30; ++i)
    for (var o = n[i]; o < n[i + 1]; ++o)
      s[o] = o - n[i] << 5 | i;
  return { b: n, r: s };
}, Ec = Oc(Lo, 2), Bc = Ec.b, As = Ec.r;
Bc[28] = 258, As[258] = 28;
var Mc = Oc(Ao, 0), nh = Mc.b, fc = Mc.r, Ns = new bn(32768);
for (var xe = 0; xe < 32768; ++xe) {
  var Cr = (xe & 43690) >> 1 | (xe & 21845) << 1;
  Cr = (Cr & 52428) >> 2 | (Cr & 13107) << 2, Cr = (Cr & 61680) >> 4 | (Cr & 3855) << 4, Ns[xe] = ((Cr & 65280) >> 8 | (Cr & 255) << 8) >> 1;
}
var er = function(r, e, n) {
  for (var i = r.length, s = 0, o = new bn(e); s < i; ++s)
    r[s] && ++o[r[s] - 1];
  var l = new bn(e);
  for (s = 1; s < e; ++s)
    l[s] = l[s - 1] + o[s - 1] << 1;
  var u;
  if (n) {
    u = new bn(1 << e);
    var f = 15 - e;
    for (s = 0; s < i; ++s)
      if (r[s])
        for (var g = s << 4 | r[s], y = e - r[s], b = l[r[s] - 1]++ << y, N = b | (1 << y) - 1; b <= N; ++b)
          u[Ns[b] >> f] = g;
  } else
    for (u = new bn(i), s = 0; s < i; ++s)
      r[s] && (u[s] = Ns[l[r[s] - 1]++] >> 15 - r[s]);
  return u;
}, jr = new en(288);
for (var xe = 0; xe < 144; ++xe)
  jr[xe] = 8;
for (var xe = 144; xe < 256; ++xe)
  jr[xe] = 9;
for (var xe = 256; xe < 280; ++xe)
  jr[xe] = 7;
for (var xe = 280; xe < 288; ++xe)
  jr[xe] = 8;
var ma = new en(32);
for (var xe = 0; xe < 32; ++xe)
  ma[xe] = 5;
var rh = /* @__PURE__ */ er(jr, 9, 0), ih = /* @__PURE__ */ er(jr, 9, 1), ah = /* @__PURE__ */ er(ma, 5, 0), oh = /* @__PURE__ */ er(ma, 5, 1), ds = function(r) {
  for (var e = r[0], n = 1; n < r.length; ++n)
    r[n] > e && (e = r[n]);
  return e;
}, qn = function(r, e, n) {
  var i = e / 8 | 0;
  return (r[i] | r[i + 1] << 8) >> (e & 7) & n;
}, ps = function(r, e) {
  var n = e / 8 | 0;
  return (r[n] | r[n + 1] << 8 | r[n + 2] << 16) >> (e & 7);
}, Es = function(r) {
  return (r + 7) / 8 | 0;
}, Dc = function(r, e, n) {
  return (n == null || n > r.length) && (n = r.length), new en(r.subarray(e, n));
}, sh = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
], Tn = function(r, e, n) {
  var i = new Error(e || sh[r]);
  if (i.code = r, Error.captureStackTrace && Error.captureStackTrace(i, Tn), !n)
    throw i;
  return i;
}, ch = function(r, e, n, i) {
  var s = r.length, o = 0;
  if (!s || e.f && !e.l)
    return n || new en(0);
  var l = !n, u = l || e.i != 2, f = e.i;
  l && (n = new en(s * 3));
  var g = function(Lt) {
    var Ct = n.length;
    if (Lt > Ct) {
      var _t = new en(Math.max(Ct * 2, Lt));
      _t.set(n), n = _t;
    }
  }, y = e.f || 0, b = e.p || 0, N = e.b || 0, p = e.l, O = e.d, k = e.m, B = e.n, _ = s * 8;
  do {
    if (!p) {
      y = qn(r, b, 1);
      var E = qn(r, b + 1, 3);
      if (b += 3, E)
        if (E == 1)
          p = ih, O = oh, k = 9, B = 5;
        else if (E == 2) {
          var wt = qn(r, b, 31) + 257, tt = qn(r, b + 10, 15) + 4, z = wt + qn(r, b + 5, 31) + 1;
          b += 14;
          for (var rt = new en(z), dt = new en(19), P = 0; P < tt; ++P)
            dt[Ls[P]] = qn(r, b + P * 3, 7);
          b += tt * 3;
          for (var C = ds(dt), W = (1 << C) - 1, q = er(dt, C, 1), P = 0; P < z; ) {
            var st = q[qn(r, b, W)];
            b += st & 15;
            var G = st >> 4;
            if (G < 16)
              rt[P++] = G;
            else {
              var it = 0, ht = 0;
              for (G == 16 ? (ht = 3 + qn(r, b, 3), b += 2, it = rt[P - 1]) : G == 17 ? (ht = 3 + qn(r, b, 7), b += 3) : G == 18 && (ht = 11 + qn(r, b, 127), b += 7); ht--; )
                rt[P++] = it;
            }
          }
          var Z = rt.subarray(0, wt), ut = rt.subarray(wt);
          k = ds(Z), B = ds(ut), p = er(Z, k, 1), O = er(ut, B, 1);
        } else
          Tn(1);
      else {
        var G = Es(b) + 4, at = r[G - 4] | r[G - 3] << 8, lt = G + at;
        if (lt > s) {
          f && Tn(0);
          break;
        }
        u && g(N + at), n.set(r.subarray(G, lt), N), e.b = N += at, e.p = b = lt * 8, e.f = y;
        continue;
      }
      if (b > _) {
        f && Tn(0);
        break;
      }
    }
    u && g(N + 131072);
    for (var pt = (1 << k) - 1, It = (1 << B) - 1, L = b; ; L = b) {
      var it = p[ps(r, b) & pt], F = it >> 4;
      if (b += it & 15, b > _) {
        f && Tn(0);
        break;
      }
      if (it || Tn(2), F < 256)
        n[N++] = F;
      else if (F == 256) {
        L = b, p = null;
        break;
      } else {
        var M = F - 254;
        if (F > 264) {
          var P = F - 257, T = Lo[P];
          M = qn(r, b, (1 << T) - 1) + Bc[P], b += T;
        }
        var Y = O[ps(r, b) & It], Q = Y >> 4;
        Y || Tn(3), b += Y & 15;
        var ut = nh[Q];
        if (Q > 3) {
          var T = Ao[Q];
          ut += ps(r, b) & (1 << T) - 1, b += T;
        }
        if (b > _) {
          f && Tn(0);
          break;
        }
        u && g(N + 131072);
        var et = N + M;
        if (N < ut) {
          var nt = o - ut, At = Math.min(ut, et);
          for (nt + N < 0 && Tn(3); N < At; ++N)
            n[N] = i[nt + N];
        }
        for (; N < et; ++N)
          n[N] = n[N - ut];
      }
    }
    e.l = p, e.p = L, e.b = N, e.f = y, p && (y = 1, e.m = k, e.d = O, e.n = B);
  } while (!y);
  return N != n.length && l ? Dc(n, 0, N) : n.subarray(0, N);
}, pr = function(r, e, n) {
  n <<= e & 7;
  var i = e / 8 | 0;
  r[i] |= n, r[i + 1] |= n >> 8;
}, da = function(r, e, n) {
  n <<= e & 7;
  var i = e / 8 | 0;
  r[i] |= n, r[i + 1] |= n >> 8, r[i + 2] |= n >> 16;
}, gs = function(r, e) {
  for (var n = [], i = 0; i < r.length; ++i)
    r[i] && n.push({ s: i, f: r[i] });
  var s = n.length, o = n.slice();
  if (!s)
    return { t: Rc, l: 0 };
  if (s == 1) {
    var l = new en(n[0].s + 1);
    return l[n[0].s] = 1, { t: l, l: 1 };
  }
  n.sort(function(lt, wt) {
    return lt.f - wt.f;
  }), n.push({ s: -1, f: 25001 });
  var u = n[0], f = n[1], g = 0, y = 1, b = 2;
  for (n[0] = { s: -1, f: u.f + f.f, l: u, r: f }; y != s - 1; )
    u = n[n[g].f < n[b].f ? g++ : b++], f = n[g != y && n[g].f < n[b].f ? g++ : b++], n[y++] = { s: -1, f: u.f + f.f, l: u, r: f };
  for (var N = o[0].s, i = 1; i < s; ++i)
    o[i].s > N && (N = o[i].s);
  var p = new bn(N + 1), O = Ss(n[y - 1], p, 0);
  if (O > e) {
    var i = 0, k = 0, B = O - e, _ = 1 << B;
    for (o.sort(function(wt, tt) {
      return p[tt.s] - p[wt.s] || wt.f - tt.f;
    }); i < s; ++i) {
      var E = o[i].s;
      if (p[E] > e)
        k += _ - (1 << O - p[E]), p[E] = e;
      else
        break;
    }
    for (k >>= B; k > 0; ) {
      var G = o[i].s;
      p[G] < e ? k -= 1 << e - p[G]++ - 1 : ++i;
    }
    for (; i >= 0 && k; --i) {
      var at = o[i].s;
      p[at] == e && (--p[at], ++k);
    }
    O = e;
  }
  return { t: new en(p), l: O };
}, Ss = function(r, e, n) {
  return r.s == -1 ? Math.max(Ss(r.l, e, n + 1), Ss(r.r, e, n + 1)) : e[r.s] = n;
}, dc = function(r) {
  for (var e = r.length; e && !r[--e]; )
    ;
  for (var n = new bn(++e), i = 0, s = r[0], o = 1, l = function(f) {
    n[i++] = f;
  }, u = 1; u <= e; ++u)
    if (r[u] == s && u != e)
      ++o;
    else {
      if (!s && o > 2) {
        for (; o > 138; o -= 138)
          l(32754);
        o > 2 && (l(o > 10 ? o - 11 << 5 | 28690 : o - 3 << 5 | 12305), o = 0);
      } else if (o > 3) {
        for (l(s), --o; o > 6; o -= 6)
          l(8304);
        o > 2 && (l(o - 3 << 5 | 8208), o = 0);
      }
      for (; o--; )
        l(s);
      o = 1, s = r[u];
    }
  return { c: n.subarray(0, i), n: e };
}, pa = function(r, e) {
  for (var n = 0, i = 0; i < e.length; ++i)
    n += r[i] * e[i];
  return n;
}, qc = function(r, e, n) {
  var i = n.length, s = Es(e + 2);
  r[s] = i & 255, r[s + 1] = i >> 8, r[s + 2] = r[s] ^ 255, r[s + 3] = r[s + 1] ^ 255;
  for (var o = 0; o < i; ++o)
    r[s + o + 4] = n[o];
  return (s + 4 + i) * 8;
}, pc = function(r, e, n, i, s, o, l, u, f, g, y) {
  pr(e, y++, n), ++s[256];
  for (var b = gs(s, 15), N = b.t, p = b.l, O = gs(o, 15), k = O.t, B = O.l, _ = dc(N), E = _.c, G = _.n, at = dc(k), lt = at.c, wt = at.n, tt = new bn(19), z = 0; z < E.length; ++z)
    ++tt[E[z] & 31];
  for (var z = 0; z < lt.length; ++z)
    ++tt[lt[z] & 31];
  for (var rt = gs(tt, 7), dt = rt.t, P = rt.l, C = 19; C > 4 && !dt[Ls[C - 1]]; --C)
    ;
  var W = g + 5 << 3, q = pa(s, jr) + pa(o, ma) + l, st = pa(s, N) + pa(o, k) + l + 14 + 3 * C + pa(tt, dt) + 2 * tt[16] + 3 * tt[17] + 7 * tt[18];
  if (f >= 0 && W <= q && W <= st)
    return qc(e, y, r.subarray(f, f + g));
  var it, ht, Z, ut;
  if (pr(e, y, 1 + (st < q)), y += 2, st < q) {
    it = er(N, p, 0), ht = N, Z = er(k, B, 0), ut = k;
    var pt = er(dt, P, 0);
    pr(e, y, G - 257), pr(e, y + 5, wt - 1), pr(e, y + 10, C - 4), y += 14;
    for (var z = 0; z < C; ++z)
      pr(e, y + 3 * z, dt[Ls[z]]);
    y += 3 * C;
    for (var It = [E, lt], L = 0; L < 2; ++L)
      for (var F = It[L], z = 0; z < F.length; ++z) {
        var M = F[z] & 31;
        pr(e, y, pt[M]), y += dt[M], M > 15 && (pr(e, y, F[z] >> 5 & 127), y += F[z] >> 12);
      }
  } else
    it = rh, ht = jr, Z = ah, ut = ma;
  for (var z = 0; z < u; ++z) {
    var T = i[z];
    if (T > 255) {
      var M = T >> 18 & 31;
      da(e, y, it[M + 257]), y += ht[M + 257], M > 7 && (pr(e, y, T >> 23 & 31), y += Lo[M]);
      var Y = T & 31;
      da(e, y, Z[Y]), y += ut[Y], Y > 3 && (da(e, y, T >> 5 & 8191), y += Ao[Y]);
    } else
      da(e, y, it[T]), y += ht[T];
  }
  return da(e, y, it[256]), y + ht[256];
}, lh = /* @__PURE__ */ new Os([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), Rc = /* @__PURE__ */ new en(0), hh = function(r, e, n, i, s, o) {
  var l = o.z || r.length, u = new en(i + l + 5 * (1 + Math.ceil(l / 7e3)) + s), f = u.subarray(i, u.length - s), g = o.l, y = (o.r || 0) & 7;
  if (e) {
    y && (f[0] = o.r >> 3);
    for (var b = lh[e - 1], N = b >> 13, p = b & 8191, O = (1 << n) - 1, k = o.p || new bn(32768), B = o.h || new bn(O + 1), _ = Math.ceil(n / 3), E = 2 * _, G = function(zt) {
      return (r[zt] ^ r[zt + 1] << _ ^ r[zt + 2] << E) & O;
    }, at = new Os(25e3), lt = new bn(288), wt = new bn(32), tt = 0, z = 0, rt = o.i || 0, dt = 0, P = o.w || 0, C = 0; rt + 2 < l; ++rt) {
      var W = G(rt), q = rt & 32767, st = B[W];
      if (k[q] = st, B[W] = q, P <= rt) {
        var it = l - rt;
        if ((tt > 7e3 || dt > 24576) && (it > 423 || !g)) {
          y = pc(r, f, 0, at, lt, wt, z, dt, C, rt - C, y), dt = tt = z = 0, C = rt;
          for (var ht = 0; ht < 286; ++ht)
            lt[ht] = 0;
          for (var ht = 0; ht < 30; ++ht)
            wt[ht] = 0;
        }
        var Z = 2, ut = 0, pt = p, It = q - st & 32767;
        if (it > 2 && W == G(rt - It))
          for (var L = Math.min(N, it) - 1, F = Math.min(32767, rt), M = Math.min(258, it); It <= F && --pt && q != st; ) {
            if (r[rt + Z] == r[rt + Z - It]) {
              for (var T = 0; T < M && r[rt + T] == r[rt + T - It]; ++T)
                ;
              if (T > Z) {
                if (Z = T, ut = It, T > L)
                  break;
                for (var Y = Math.min(It, T - 2), Q = 0, ht = 0; ht < Y; ++ht) {
                  var et = rt - It + ht & 32767, nt = k[et], At = et - nt & 32767;
                  At > Q && (Q = At, st = et);
                }
              }
            }
            q = st, st = k[q], It += q - st & 32767;
          }
        if (ut) {
          at[dt++] = 268435456 | As[Z] << 18 | fc[ut];
          var Lt = As[Z] & 31, Ct = fc[ut] & 31;
          z += Lo[Lt] + Ao[Ct], ++lt[257 + Lt], ++wt[Ct], P = rt + Z, ++tt;
        } else
          at[dt++] = r[rt], ++lt[r[rt]];
      }
    }
    for (rt = Math.max(rt, P); rt < l; ++rt)
      at[dt++] = r[rt], ++lt[r[rt]];
    y = pc(r, f, g, at, lt, wt, z, dt, C, rt - C, y), g || (o.r = y & 7 | f[y / 8 | 0] << 3, y -= 7, o.h = B, o.p = k, o.i = rt, o.w = P);
  } else {
    for (var rt = o.w || 0; rt < l + g; rt += 65535) {
      var _t = rt + 65535;
      _t >= l && (f[y / 8 | 0] = g, _t = l), y = qc(f, y + 1, r.subarray(rt, _t));
    }
    o.i = l;
  }
  return Dc(u, 0, i + Es(y) + s);
}, Tc = function() {
  var r = 1, e = 0;
  return {
    p: function(n) {
      for (var i = r, s = e, o = n.length | 0, l = 0; l != o; ) {
        for (var u = Math.min(l + 2655, o); l < u; ++l)
          s += i += n[l];
        i = (i & 65535) + 15 * (i >> 16), s = (s & 65535) + 15 * (s >> 16);
      }
      r = i, e = s;
    },
    d: function() {
      return r %= 65521, e %= 65521, (r & 255) << 24 | (r & 65280) << 8 | (e & 255) << 8 | e >> 8;
    }
  };
}, uh = function(r, e, n, i, s) {
  if (!s && (s = { l: 1 }, e.dictionary)) {
    var o = e.dictionary.subarray(-32768), l = new en(o.length + r.length);
    l.set(o), l.set(r, o.length), r = l, s.w = o.length;
  }
  return hh(r, e.level == null ? 6 : e.level, e.mem == null ? s.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(r.length))) * 1.5) : 20 : 12 + e.mem, n, i, s);
}, zc = function(r, e, n) {
  for (; n; ++e)
    r[e] = n, n >>>= 8;
}, fh = function(r, e) {
  var n = e.level, i = n == 0 ? 0 : n < 6 ? 1 : n == 9 ? 3 : 2;
  if (r[0] = 120, r[1] = i << 6 | (e.dictionary && 32), r[1] |= 31 - (r[0] << 8 | r[1]) % 31, e.dictionary) {
    var s = Tc();
    s.p(e.dictionary), zc(r, 2, s.d());
  }
}, dh = function(r, e) {
  return ((r[0] & 15) != 8 || r[0] >> 4 > 7 || (r[0] << 8 | r[1]) % 31) && Tn(6, "invalid zlib data"), (r[1] >> 5 & 1) == +!e && Tn(6, "invalid zlib data: " + (r[1] & 32 ? "need" : "unexpected") + " dictionary"), (r[1] >> 3 & 4) + 2;
};
function _s(r, e) {
  e || (e = {});
  var n = Tc();
  n.p(r);
  var i = uh(r, e, e.dictionary ? 6 : 2, 4);
  return fh(i, e), zc(i, i.length - 4, n.d()), i;
}
function ph(r, e) {
  return ch(r.subarray(dh(r, e), -4), { i: 2 }, e, e);
}
var gh = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), mh = 0;
try {
  gh.decode(Rc, { stream: !0 }), mh = 1;
} catch {
}
/** @license
 *
 * jsPDF - PDF Document creation from JavaScript
 * Version 2.5.2 Built on 2024-09-17T13:29:57.859Z
 *                      CommitID 00000000
 *
 * Copyright (c) 2010-2021 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
 *               2015-2021 yWorks GmbH, http://www.yworks.com
 *               2015-2021 Lukas Holländer <lukas.hollaender@yworks.com>, https://github.com/HackbrettXXX
 *               2016-2018 Aras Abbasi <aras.abbasi@gmail.com>
 *               2010 Aaron Spike, https://github.com/acspike
 *               2012 Willow Systems Corporation, https://github.com/willowsystems
 *               2012 Pablo Hess, https://github.com/pablohess
 *               2012 Florian Jenett, https://github.com/fjenett
 *               2013 Warren Weckesser, https://github.com/warrenweckesser
 *               2013 Youssef Beddad, https://github.com/lifof
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2013 Stefan Slonevskiy, https://github.com/stefslon
 *               2013 Jeremy Morel, https://github.com/jmorel
 *               2013 Christoph Hartmann, https://github.com/chris-rock
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Makes, https://github.com/dollaruw
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 Steven Spungin, https://github.com/Flamenco
 *               2014 Kenneth Glassey, https://github.com/Gavvers
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Contributor(s):
 *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
 *    kim3er, mfo, alnorth, Flamenco
 */
var Ht = /* @__PURE__ */ function() {
  return typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : this;
}();
function ms() {
  Ht.console && typeof Ht.console.log == "function" && Ht.console.log.apply(Ht.console, arguments);
}
var be = { log: ms, warn: function(r) {
  Ht.console && (typeof Ht.console.warn == "function" ? Ht.console.warn.apply(Ht.console, arguments) : ms.call(null, arguments));
}, error: function(r) {
  Ht.console && (typeof Ht.console.error == "function" ? Ht.console.error.apply(Ht.console, arguments) : ms(r));
} };
function vs(r, e, n) {
  var i = new XMLHttpRequest();
  i.open("GET", r), i.responseType = "blob", i.onload = function() {
    Jr(i.response, e, n);
  }, i.onerror = function() {
    be.error("could not download file");
  }, i.send();
}
function gc(r) {
  var e = new XMLHttpRequest();
  e.open("HEAD", r, !1);
  try {
    e.send();
  } catch {
  }
  return e.status >= 200 && e.status <= 299;
}
function co(r) {
  try {
    r.dispatchEvent(new MouseEvent("click"));
  } catch {
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), r.dispatchEvent(e);
  }
}
var ga, Ps, Jr = Ht.saveAs || ((typeof window > "u" ? "undefined" : de(window)) !== "object" || window !== Ht ? function() {
} : typeof HTMLAnchorElement < "u" && "download" in HTMLAnchorElement.prototype ? function(r, e, n) {
  var i = Ht.URL || Ht.webkitURL, s = document.createElement("a");
  e = e || r.name || "download", s.download = e, s.rel = "noopener", typeof r == "string" ? (s.href = r, s.origin !== location.origin ? gc(s.href) ? vs(r, e, n) : co(s, s.target = "_blank") : co(s)) : (s.href = i.createObjectURL(r), setTimeout(function() {
    i.revokeObjectURL(s.href);
  }, 4e4), setTimeout(function() {
    co(s);
  }, 0));
} : "msSaveOrOpenBlob" in navigator ? function(r, e, n) {
  if (e = e || r.name || "download", typeof r == "string") if (gc(r)) vs(r, e, n);
  else {
    var i = document.createElement("a");
    i.href = r, i.target = "_blank", setTimeout(function() {
      co(i);
    });
  }
  else navigator.msSaveOrOpenBlob(function(s, o) {
    return o === void 0 ? o = { autoBom: !1 } : de(o) !== "object" && (be.warn("Deprecated: Expected third argument to be a object"), o = { autoBom: !o }), o.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(s.type) ? new Blob(["\uFEFF", s], { type: s.type }) : s;
  }(r, n), e);
} : function(r, e, n, i) {
  if ((i = i || open("", "_blank")) && (i.document.title = i.document.body.innerText = "downloading..."), typeof r == "string") return vs(r, e, n);
  var s = r.type === "application/octet-stream", o = /constructor/i.test(Ht.HTMLElement) || Ht.safari, l = /CriOS\/[\d]+/.test(navigator.userAgent);
  if ((l || s && o) && (typeof FileReader > "u" ? "undefined" : de(FileReader)) === "object") {
    var u = new FileReader();
    u.onloadend = function() {
      var y = u.result;
      y = l ? y : y.replace(/^data:[^;]*;/, "data:attachment/file;"), i ? i.location.href = y : location = y, i = null;
    }, u.readAsDataURL(r);
  } else {
    var f = Ht.URL || Ht.webkitURL, g = f.createObjectURL(r);
    i ? i.location = g : location.href = g, i = null, setTimeout(function() {
      f.revokeObjectURL(g);
    }, 4e4);
  }
});
/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * {@link   http://www.phpied.com/rgb-color-parser-in-javascript/}
 * @license Use it if you like it
 */
function Uc(r) {
  var e;
  r = r || "", this.ok = !1, r.charAt(0) == "#" && (r = r.substr(1, 6)), r = { aliceblue: "f0f8ff", antiquewhite: "faebd7", aqua: "00ffff", aquamarine: "7fffd4", azure: "f0ffff", beige: "f5f5dc", bisque: "ffe4c4", black: "000000", blanchedalmond: "ffebcd", blue: "0000ff", blueviolet: "8a2be2", brown: "a52a2a", burlywood: "deb887", cadetblue: "5f9ea0", chartreuse: "7fff00", chocolate: "d2691e", coral: "ff7f50", cornflowerblue: "6495ed", cornsilk: "fff8dc", crimson: "dc143c", cyan: "00ffff", darkblue: "00008b", darkcyan: "008b8b", darkgoldenrod: "b8860b", darkgray: "a9a9a9", darkgreen: "006400", darkkhaki: "bdb76b", darkmagenta: "8b008b", darkolivegreen: "556b2f", darkorange: "ff8c00", darkorchid: "9932cc", darkred: "8b0000", darksalmon: "e9967a", darkseagreen: "8fbc8f", darkslateblue: "483d8b", darkslategray: "2f4f4f", darkturquoise: "00ced1", darkviolet: "9400d3", deeppink: "ff1493", deepskyblue: "00bfff", dimgray: "696969", dodgerblue: "1e90ff", feldspar: "d19275", firebrick: "b22222", floralwhite: "fffaf0", forestgreen: "228b22", fuchsia: "ff00ff", gainsboro: "dcdcdc", ghostwhite: "f8f8ff", gold: "ffd700", goldenrod: "daa520", gray: "808080", green: "008000", greenyellow: "adff2f", honeydew: "f0fff0", hotpink: "ff69b4", indianred: "cd5c5c", indigo: "4b0082", ivory: "fffff0", khaki: "f0e68c", lavender: "e6e6fa", lavenderblush: "fff0f5", lawngreen: "7cfc00", lemonchiffon: "fffacd", lightblue: "add8e6", lightcoral: "f08080", lightcyan: "e0ffff", lightgoldenrodyellow: "fafad2", lightgrey: "d3d3d3", lightgreen: "90ee90", lightpink: "ffb6c1", lightsalmon: "ffa07a", lightseagreen: "20b2aa", lightskyblue: "87cefa", lightslateblue: "8470ff", lightslategray: "778899", lightsteelblue: "b0c4de", lightyellow: "ffffe0", lime: "00ff00", limegreen: "32cd32", linen: "faf0e6", magenta: "ff00ff", maroon: "800000", mediumaquamarine: "66cdaa", mediumblue: "0000cd", mediumorchid: "ba55d3", mediumpurple: "9370d8", mediumseagreen: "3cb371", mediumslateblue: "7b68ee", mediumspringgreen: "00fa9a", mediumturquoise: "48d1cc", mediumvioletred: "c71585", midnightblue: "191970", mintcream: "f5fffa", mistyrose: "ffe4e1", moccasin: "ffe4b5", navajowhite: "ffdead", navy: "000080", oldlace: "fdf5e6", olive: "808000", olivedrab: "6b8e23", orange: "ffa500", orangered: "ff4500", orchid: "da70d6", palegoldenrod: "eee8aa", palegreen: "98fb98", paleturquoise: "afeeee", palevioletred: "d87093", papayawhip: "ffefd5", peachpuff: "ffdab9", peru: "cd853f", pink: "ffc0cb", plum: "dda0dd", powderblue: "b0e0e6", purple: "800080", red: "ff0000", rosybrown: "bc8f8f", royalblue: "4169e1", saddlebrown: "8b4513", salmon: "fa8072", sandybrown: "f4a460", seagreen: "2e8b57", seashell: "fff5ee", sienna: "a0522d", silver: "c0c0c0", skyblue: "87ceeb", slateblue: "6a5acd", slategray: "708090", snow: "fffafa", springgreen: "00ff7f", steelblue: "4682b4", tan: "d2b48c", teal: "008080", thistle: "d8bfd8", tomato: "ff6347", turquoise: "40e0d0", violet: "ee82ee", violetred: "d02090", wheat: "f5deb3", white: "ffffff", whitesmoke: "f5f5f5", yellow: "ffff00", yellowgreen: "9acd32" }[r = (r = r.replace(/ /g, "")).toLowerCase()] || r;
  for (var n = [{ re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/, example: ["rgb(123, 234, 45)", "rgb(255,234,245)"], process: function(u) {
    return [parseInt(u[1]), parseInt(u[2]), parseInt(u[3])];
  } }, { re: /^(\w{2})(\w{2})(\w{2})$/, example: ["#00ff00", "336699"], process: function(u) {
    return [parseInt(u[1], 16), parseInt(u[2], 16), parseInt(u[3], 16)];
  } }, { re: /^(\w{1})(\w{1})(\w{1})$/, example: ["#fb0", "f0f"], process: function(u) {
    return [parseInt(u[1] + u[1], 16), parseInt(u[2] + u[2], 16), parseInt(u[3] + u[3], 16)];
  } }], i = 0; i < n.length; i++) {
    var s = n[i].re, o = n[i].process, l = s.exec(r);
    l && (e = o(l), this.r = e[0], this.g = e[1], this.b = e[2], this.ok = !0);
  }
  this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r, this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g, this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b, this.toRGB = function() {
    return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
  }, this.toHex = function() {
    var u = this.r.toString(16), f = this.g.toString(16), g = this.b.toString(16);
    return u.length == 1 && (u = "0" + u), f.length == 1 && (f = "0" + f), g.length == 1 && (g = "0" + g), "#" + u + f + g;
  };
}
/**
 * @license
 * Joseph Myers does not specify a particular license for his work.
 *
 * Author: Joseph Myers
 * Accessed from: http://www.myersdaily.org/joseph/javascript/md5.js
 *
 * Modified by: Owen Leong
 */
function bs(r, e) {
  var n = r[0], i = r[1], s = r[2], o = r[3];
  n = Ke(n, i, s, o, e[0], 7, -680876936), o = Ke(o, n, i, s, e[1], 12, -389564586), s = Ke(s, o, n, i, e[2], 17, 606105819), i = Ke(i, s, o, n, e[3], 22, -1044525330), n = Ke(n, i, s, o, e[4], 7, -176418897), o = Ke(o, n, i, s, e[5], 12, 1200080426), s = Ke(s, o, n, i, e[6], 17, -1473231341), i = Ke(i, s, o, n, e[7], 22, -45705983), n = Ke(n, i, s, o, e[8], 7, 1770035416), o = Ke(o, n, i, s, e[9], 12, -1958414417), s = Ke(s, o, n, i, e[10], 17, -42063), i = Ke(i, s, o, n, e[11], 22, -1990404162), n = Ke(n, i, s, o, e[12], 7, 1804603682), o = Ke(o, n, i, s, e[13], 12, -40341101), s = Ke(s, o, n, i, e[14], 17, -1502002290), n = Ze(n, i = Ke(i, s, o, n, e[15], 22, 1236535329), s, o, e[1], 5, -165796510), o = Ze(o, n, i, s, e[6], 9, -1069501632), s = Ze(s, o, n, i, e[11], 14, 643717713), i = Ze(i, s, o, n, e[0], 20, -373897302), n = Ze(n, i, s, o, e[5], 5, -701558691), o = Ze(o, n, i, s, e[10], 9, 38016083), s = Ze(s, o, n, i, e[15], 14, -660478335), i = Ze(i, s, o, n, e[4], 20, -405537848), n = Ze(n, i, s, o, e[9], 5, 568446438), o = Ze(o, n, i, s, e[14], 9, -1019803690), s = Ze(s, o, n, i, e[3], 14, -187363961), i = Ze(i, s, o, n, e[8], 20, 1163531501), n = Ze(n, i, s, o, e[13], 5, -1444681467), o = Ze(o, n, i, s, e[2], 9, -51403784), s = Ze(s, o, n, i, e[7], 14, 1735328473), n = Qe(n, i = Ze(i, s, o, n, e[12], 20, -1926607734), s, o, e[5], 4, -378558), o = Qe(o, n, i, s, e[8], 11, -2022574463), s = Qe(s, o, n, i, e[11], 16, 1839030562), i = Qe(i, s, o, n, e[14], 23, -35309556), n = Qe(n, i, s, o, e[1], 4, -1530992060), o = Qe(o, n, i, s, e[4], 11, 1272893353), s = Qe(s, o, n, i, e[7], 16, -155497632), i = Qe(i, s, o, n, e[10], 23, -1094730640), n = Qe(n, i, s, o, e[13], 4, 681279174), o = Qe(o, n, i, s, e[0], 11, -358537222), s = Qe(s, o, n, i, e[3], 16, -722521979), i = Qe(i, s, o, n, e[6], 23, 76029189), n = Qe(n, i, s, o, e[9], 4, -640364487), o = Qe(o, n, i, s, e[12], 11, -421815835), s = Qe(s, o, n, i, e[15], 16, 530742520), n = tn(n, i = Qe(i, s, o, n, e[2], 23, -995338651), s, o, e[0], 6, -198630844), o = tn(o, n, i, s, e[7], 10, 1126891415), s = tn(s, o, n, i, e[14], 15, -1416354905), i = tn(i, s, o, n, e[5], 21, -57434055), n = tn(n, i, s, o, e[12], 6, 1700485571), o = tn(o, n, i, s, e[3], 10, -1894986606), s = tn(s, o, n, i, e[10], 15, -1051523), i = tn(i, s, o, n, e[1], 21, -2054922799), n = tn(n, i, s, o, e[8], 6, 1873313359), o = tn(o, n, i, s, e[15], 10, -30611744), s = tn(s, o, n, i, e[6], 15, -1560198380), i = tn(i, s, o, n, e[13], 21, 1309151649), n = tn(n, i, s, o, e[4], 6, -145523070), o = tn(o, n, i, s, e[11], 10, -1120210379), s = tn(s, o, n, i, e[2], 15, 718787259), i = tn(i, s, o, n, e[9], 21, -343485551), r[0] = Fr(n, r[0]), r[1] = Fr(i, r[1]), r[2] = Fr(s, r[2]), r[3] = Fr(o, r[3]);
}
function No(r, e, n, i, s, o) {
  return e = Fr(Fr(e, r), Fr(i, o)), Fr(e << s | e >>> 32 - s, n);
}
function Ke(r, e, n, i, s, o, l) {
  return No(e & n | ~e & i, r, e, s, o, l);
}
function Ze(r, e, n, i, s, o, l) {
  return No(e & i | n & ~i, r, e, s, o, l);
}
function Qe(r, e, n, i, s, o, l) {
  return No(e ^ n ^ i, r, e, s, o, l);
}
function tn(r, e, n, i, s, o, l) {
  return No(n ^ (e | ~i), r, e, s, o, l);
}
function Hc(r) {
  var e, n = r.length, i = [1732584193, -271733879, -1732584194, 271733878];
  for (e = 64; e <= r.length; e += 64) bs(i, vh(r.substring(e - 64, e)));
  r = r.substring(e - 64);
  var s = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (e = 0; e < r.length; e++) s[e >> 2] |= r.charCodeAt(e) << (e % 4 << 3);
  if (s[e >> 2] |= 128 << (e % 4 << 3), e > 55) for (bs(i, s), e = 0; e < 16; e++) s[e] = 0;
  return s[14] = 8 * n, bs(i, s), i;
}
function vh(r) {
  var e, n = [];
  for (e = 0; e < 64; e += 4) n[e >> 2] = r.charCodeAt(e) + (r.charCodeAt(e + 1) << 8) + (r.charCodeAt(e + 2) << 16) + (r.charCodeAt(e + 3) << 24);
  return n;
}
ga = Ht.atob.bind(Ht), Ps = Ht.btoa.bind(Ht);
var mc = "0123456789abcdef".split("");
function bh(r) {
  for (var e = "", n = 0; n < 4; n++) e += mc[r >> 8 * n + 4 & 15] + mc[r >> 8 * n & 15];
  return e;
}
function yh(r) {
  return String.fromCharCode((255 & r) >> 0, (65280 & r) >> 8, (16711680 & r) >> 16, (4278190080 & r) >> 24);
}
function ks(r) {
  return Hc(r).map(yh).join("");
}
var wh = function(r) {
  for (var e = 0; e < r.length; e++) r[e] = bh(r[e]);
  return r.join("");
}(Hc("hello")) != "5d41402abc4b2a76b9719d911017c592";
function Fr(r, e) {
  if (wh) {
    var n = (65535 & r) + (65535 & e);
    return (r >> 16) + (e >> 16) + (n >> 16) << 16 | 65535 & n;
  }
  return r + e & 4294967295;
}
/**
 * @license
 * FPDF is released under a permissive license: there is no usage restriction.
 * You may embed it freely in your application (commercial or not), with or
 * without modifications.
 *
 * Reference: http://www.fpdf.org/en/script/script37.php
 */
function Cs(r, e) {
  var n, i, s, o;
  if (r !== n) {
    for (var l = (s = r, o = 1 + (256 / r.length >> 0), new Array(o + 1).join(s)), u = [], f = 0; f < 256; f++) u[f] = f;
    var g = 0;
    for (f = 0; f < 256; f++) {
      var y = u[f];
      g = (g + y + l.charCodeAt(f)) % 256, u[f] = u[g], u[g] = y;
    }
    n = r, i = u;
  } else u = i;
  var b = e.length, N = 0, p = 0, O = "";
  for (f = 0; f < b; f++) p = (p + (y = u[N = (N + 1) % 256])) % 256, u[N] = u[p], u[p] = y, l = u[(u[N] + u[p]) % 256], O += String.fromCharCode(e.charCodeAt(f) ^ l);
  return O;
}
/**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 * Author: Owen Leong (@owenl131)
 * Date: 15 Oct 2020
 * References:
 * https://www.cs.cmu.edu/~dst/Adobe/Gallery/anon21jul01-pdf-encryption.txt
 * https://github.com/foliojs/pdfkit/blob/master/lib/security.js
 * http://www.fpdf.org/en/script/script37.php
 */
var vc = { print: 4, modify: 8, copy: 16, "annot-forms": 32 };
function ki(r, e, n, i) {
  this.v = 1, this.r = 2;
  var s = 192;
  r.forEach(function(u) {
    if (vc.perm !== void 0) throw new Error("Invalid permission: " + u);
    s += vc[u];
  }), this.padding = "(¿N^NuAd\0NVÿú\b..\0¶Ðh>/\f©þdSiz";
  var o = (e + this.padding).substr(0, 32), l = (n + this.padding).substr(0, 32);
  this.O = this.processOwnerPassword(o, l), this.P = -(1 + (255 ^ s)), this.encryptionKey = ks(o + this.O + this.lsbFirstWord(this.P) + this.hexToBytes(i)).substr(0, 5), this.U = Cs(this.encryptionKey, this.padding);
}
function Ci(r) {
  if (/[^\u0000-\u00ff]/.test(r)) throw new Error("Invalid PDF Name Object: " + r + ", Only accept ASCII characters.");
  for (var e = "", n = r.length, i = 0; i < n; i++) {
    var s = r.charCodeAt(i);
    s < 33 || s === 35 || s === 37 || s === 40 || s === 41 || s === 47 || s === 60 || s === 62 || s === 91 || s === 93 || s === 123 || s === 125 || s > 126 ? e += "#" + ("0" + s.toString(16)).slice(-2) : e += r[i];
  }
  return e;
}
function bc(r) {
  if (de(r) !== "object") throw new Error("Invalid Context passed to initialize PubSub (jsPDF-module)");
  var e = {};
  this.subscribe = function(n, i, s) {
    if (s = s || !1, typeof n != "string" || typeof i != "function" || typeof s != "boolean") throw new Error("Invalid arguments passed to PubSub.subscribe (jsPDF-module)");
    e.hasOwnProperty(n) || (e[n] = {});
    var o = Math.random().toString(35);
    return e[n][o] = [i, !!s], o;
  }, this.unsubscribe = function(n) {
    for (var i in e) if (e[i][n]) return delete e[i][n], Object.keys(e[i]).length === 0 && delete e[i], !0;
    return !1;
  }, this.publish = function(n) {
    if (e.hasOwnProperty(n)) {
      var i = Array.prototype.slice.call(arguments, 1), s = [];
      for (var o in e[n]) {
        var l = e[n][o];
        try {
          l[0].apply(r, i);
        } catch (u) {
          Ht.console && be.error("jsPDF PubSub Error", u.message, u);
        }
        l[1] && s.push(o);
      }
      s.length && s.forEach(this.unsubscribe);
    }
  }, this.getTopics = function() {
    return e;
  };
}
function bo(r) {
  if (!(this instanceof bo)) return new bo(r);
  var e = "opacity,stroke-opacity".split(",");
  for (var n in r) r.hasOwnProperty(n) && e.indexOf(n) >= 0 && (this[n] = r[n]);
  this.id = "", this.objectNumber = -1;
}
function Wc(r, e) {
  this.gState = r, this.matrix = e, this.id = "", this.objectNumber = -1;
}
function Yr(r, e, n, i, s) {
  if (!(this instanceof Yr)) return new Yr(r, e, n, i, s);
  this.type = r === "axial" ? 2 : 3, this.coords = e, this.colors = n, Wc.call(this, i, s);
}
function Fi(r, e, n, i, s) {
  if (!(this instanceof Fi)) return new Fi(r, e, n, i, s);
  this.boundingBox = r, this.xStep = e, this.yStep = n, this.stream = "", this.cloneIndex = 0, Wc.call(this, i, s);
}
function Ut(r) {
  var e, n = typeof arguments[0] == "string" ? arguments[0] : "p", i = arguments[1], s = arguments[2], o = arguments[3], l = [], u = 1, f = 16, g = "S", y = null;
  de(r = r || {}) === "object" && (n = r.orientation, i = r.unit || i, s = r.format || s, o = r.compress || r.compressPdf || o, (y = r.encryption || null) !== null && (y.userPassword = y.userPassword || "", y.ownerPassword = y.ownerPassword || "", y.userPermissions = y.userPermissions || []), u = typeof r.userUnit == "number" ? Math.abs(r.userUnit) : 1, r.precision !== void 0 && (e = r.precision), r.floatPrecision !== void 0 && (f = r.floatPrecision), g = r.defaultPathOperation || "S"), l = r.filters || (o === !0 ? ["FlateEncode"] : l), i = i || "mm", n = ("" + (n || "P")).toLowerCase();
  var b = r.putOnlyUsedFonts || !1, N = {}, p = { internal: {}, __private__: {} };
  p.__private__.PubSub = bc;
  var O = "1.3", k = p.__private__.getPdfVersion = function() {
    return O;
  };
  p.__private__.setPdfVersion = function(c) {
    O = c;
  };
  var B = { a0: [2383.94, 3370.39], a1: [1683.78, 2383.94], a2: [1190.55, 1683.78], a3: [841.89, 1190.55], a4: [595.28, 841.89], a5: [419.53, 595.28], a6: [297.64, 419.53], a7: [209.76, 297.64], a8: [147.4, 209.76], a9: [104.88, 147.4], a10: [73.7, 104.88], b0: [2834.65, 4008.19], b1: [2004.09, 2834.65], b2: [1417.32, 2004.09], b3: [1000.63, 1417.32], b4: [708.66, 1000.63], b5: [498.9, 708.66], b6: [354.33, 498.9], b7: [249.45, 354.33], b8: [175.75, 249.45], b9: [124.72, 175.75], b10: [87.87, 124.72], c0: [2599.37, 3676.54], c1: [1836.85, 2599.37], c2: [1298.27, 1836.85], c3: [918.43, 1298.27], c4: [649.13, 918.43], c5: [459.21, 649.13], c6: [323.15, 459.21], c7: [229.61, 323.15], c8: [161.57, 229.61], c9: [113.39, 161.57], c10: [79.37, 113.39], dl: [311.81, 623.62], letter: [612, 792], "government-letter": [576, 756], legal: [612, 1008], "junior-legal": [576, 360], ledger: [1224, 792], tabloid: [792, 1224], "credit-card": [153, 243] };
  p.__private__.getPageFormats = function() {
    return B;
  };
  var _ = p.__private__.getPageFormat = function(c) {
    return B[c];
  };
  s = s || "a4";
  var E = { COMPAT: "compat", ADVANCED: "advanced" }, G = E.COMPAT;
  function at() {
    this.saveGraphicsState(), D(new Tt(jt, 0, 0, -jt, 0, vr() * jt).toString() + " cm"), this.setFontSize(this.getFontSize() / jt), g = "n", G = E.ADVANCED;
  }
  function lt() {
    this.restoreGraphicsState(), g = "S", G = E.COMPAT;
  }
  var wt = p.__private__.combineFontStyleAndFontWeight = function(c, v) {
    if (c == "bold" && v == "normal" || c == "bold" && v == 400 || c == "normal" && v == "italic" || c == "bold" && v == "italic") throw new Error("Invalid Combination of fontweight and fontstyle");
    return v && (c = v == 400 || v === "normal" ? c === "italic" ? "italic" : "normal" : v != 700 && v !== "bold" || c !== "normal" ? (v == 700 ? "bold" : v) + "" + c : "bold"), c;
  };
  p.advancedAPI = function(c) {
    var v = G === E.COMPAT;
    return v && at.call(this), typeof c != "function" || (c(this), v && lt.call(this)), this;
  }, p.compatAPI = function(c) {
    var v = G === E.ADVANCED;
    return v && lt.call(this), typeof c != "function" || (c(this), v && at.call(this)), this;
  }, p.isAdvancedAPI = function() {
    return G === E.ADVANCED;
  };
  var tt, z = function(c) {
    if (G !== E.ADVANCED) throw new Error(c + " is only available in 'advanced' API mode. You need to call advancedAPI() first.");
  }, rt = p.roundToPrecision = p.__private__.roundToPrecision = function(c, v) {
    var j = e || v;
    if (isNaN(c) || isNaN(j)) throw new Error("Invalid argument passed to jsPDF.roundToPrecision");
    return c.toFixed(j).replace(/0+$/, "");
  };
  tt = p.hpf = p.__private__.hpf = typeof f == "number" ? function(c) {
    if (isNaN(c)) throw new Error("Invalid argument passed to jsPDF.hpf");
    return rt(c, f);
  } : f === "smart" ? function(c) {
    if (isNaN(c)) throw new Error("Invalid argument passed to jsPDF.hpf");
    return rt(c, c > -1 && c < 1 ? 16 : 5);
  } : function(c) {
    if (isNaN(c)) throw new Error("Invalid argument passed to jsPDF.hpf");
    return rt(c, 16);
  };
  var dt = p.f2 = p.__private__.f2 = function(c) {
    if (isNaN(c)) throw new Error("Invalid argument passed to jsPDF.f2");
    return rt(c, 2);
  }, P = p.__private__.f3 = function(c) {
    if (isNaN(c)) throw new Error("Invalid argument passed to jsPDF.f3");
    return rt(c, 3);
  }, C = p.scale = p.__private__.scale = function(c) {
    if (isNaN(c)) throw new Error("Invalid argument passed to jsPDF.scale");
    return G === E.COMPAT ? c * jt : G === E.ADVANCED ? c : void 0;
  }, W = function(c) {
    return G === E.COMPAT ? vr() - c : G === E.ADVANCED ? c : void 0;
  }, q = function(c) {
    return C(W(c));
  };
  p.__private__.setPrecision = p.setPrecision = function(c) {
    typeof parseInt(c, 10) == "number" && (e = parseInt(c, 10));
  };
  var st, it = "00000000000000000000000000000000", ht = p.__private__.getFileId = function() {
    return it;
  }, Z = p.__private__.setFileId = function(c) {
    return it = c !== void 0 && /^[a-fA-F0-9]{32}$/.test(c) ? c.toUpperCase() : it.split("").map(function() {
      return "ABCDEF0123456789".charAt(Math.floor(16 * Math.random()));
    }).join(""), y !== null && (Xe = new ki(y.userPermissions, y.userPassword, y.ownerPassword, it)), it;
  };
  p.setFileId = function(c) {
    return Z(c), this;
  }, p.getFileId = function() {
    return ht();
  };
  var ut = p.__private__.convertDateToPDFDate = function(c) {
    var v = c.getTimezoneOffset(), j = v < 0 ? "+" : "-", R = Math.floor(Math.abs(v / 60)), X = Math.abs(v % 60), ct = [j, M(R), "'", M(X), "'"].join("");
    return ["D:", c.getFullYear(), M(c.getMonth() + 1), M(c.getDate()), M(c.getHours()), M(c.getMinutes()), M(c.getSeconds()), ct].join("");
  }, pt = p.__private__.convertPDFDateToDate = function(c) {
    var v = parseInt(c.substr(2, 4), 10), j = parseInt(c.substr(6, 2), 10) - 1, R = parseInt(c.substr(8, 2), 10), X = parseInt(c.substr(10, 2), 10), ct = parseInt(c.substr(12, 2), 10), yt = parseInt(c.substr(14, 2), 10);
    return new Date(v, j, R, X, ct, yt, 0);
  }, It = p.__private__.setCreationDate = function(c) {
    var v;
    if (c === void 0 && (c = /* @__PURE__ */ new Date()), c instanceof Date) v = ut(c);
    else {
      if (!/^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|-0[0-9]|-1[0-1])'(0[0-9]|[1-5][0-9])'?$/.test(c)) throw new Error("Invalid argument passed to jsPDF.setCreationDate");
      v = c;
    }
    return st = v;
  }, L = p.__private__.getCreationDate = function(c) {
    var v = st;
    return c === "jsDate" && (v = pt(st)), v;
  };
  p.setCreationDate = function(c) {
    return It(c), this;
  }, p.getCreationDate = function(c) {
    return L(c);
  };
  var F, M = p.__private__.padd2 = function(c) {
    return ("0" + parseInt(c)).slice(-2);
  }, T = p.__private__.padd2Hex = function(c) {
    return ("00" + (c = c.toString())).substr(c.length);
  }, Y = 0, Q = [], et = [], nt = 0, At = [], Lt = [], Ct = !1, _t = et, zt = function() {
    Y = 0, nt = 0, et = [], Q = [], At = [], ir = Be(), In = Be();
  };
  p.__private__.setCustomOutputDestination = function(c) {
    Ct = !0, _t = c;
  };
  var ft = function(c) {
    Ct || (_t = c);
  };
  p.__private__.resetCustomOutputDestination = function() {
    Ct = !1, _t = et;
  };
  var D = p.__private__.out = function(c) {
    return c = c.toString(), nt += c.length + 1, _t.push(c), _t;
  }, $t = p.__private__.write = function(c) {
    return D(arguments.length === 1 ? c.toString() : Array.prototype.join.call(arguments, " "));
  }, Mt = p.__private__.getArrayBuffer = function(c) {
    for (var v = c.length, j = new ArrayBuffer(v), R = new Uint8Array(j); v--; ) R[v] = c.charCodeAt(v);
    return j;
  }, xt = [["Helvetica", "helvetica", "normal", "WinAnsiEncoding"], ["Helvetica-Bold", "helvetica", "bold", "WinAnsiEncoding"], ["Helvetica-Oblique", "helvetica", "italic", "WinAnsiEncoding"], ["Helvetica-BoldOblique", "helvetica", "bolditalic", "WinAnsiEncoding"], ["Courier", "courier", "normal", "WinAnsiEncoding"], ["Courier-Bold", "courier", "bold", "WinAnsiEncoding"], ["Courier-Oblique", "courier", "italic", "WinAnsiEncoding"], ["Courier-BoldOblique", "courier", "bolditalic", "WinAnsiEncoding"], ["Times-Roman", "times", "normal", "WinAnsiEncoding"], ["Times-Bold", "times", "bold", "WinAnsiEncoding"], ["Times-Italic", "times", "italic", "WinAnsiEncoding"], ["Times-BoldItalic", "times", "bolditalic", "WinAnsiEncoding"], ["ZapfDingbats", "zapfdingbats", "normal", null], ["Symbol", "symbol", "normal", null]];
  p.__private__.getStandardFonts = function() {
    return xt;
  };
  var Nt = r.fontSize || 16;
  p.__private__.setFontSize = p.setFontSize = function(c) {
    return Nt = G === E.ADVANCED ? c / jt : c, this;
  };
  var Ft, kt = p.__private__.getFontSize = p.getFontSize = function() {
    return G === E.COMPAT ? Nt : Nt * jt;
  }, Dt = r.R2L || !1;
  p.__private__.setR2L = p.setR2L = function(c) {
    return Dt = c, this;
  }, p.__private__.getR2L = p.getR2L = function() {
    return Dt;
  };
  var Gt, Qt = p.__private__.setZoomMode = function(c) {
    var v = [void 0, null, "fullwidth", "fullheight", "fullpage", "original"];
    if (/^(?:\d+\.\d*|\d*\.\d+|\d+)%$/.test(c)) Ft = c;
    else if (isNaN(c)) {
      if (v.indexOf(c) === -1) throw new Error('zoom must be Integer (e.g. 2), a percentage Value (e.g. 300%) or fullwidth, fullheight, fullpage, original. "' + c + '" is not recognized.');
      Ft = c;
    } else Ft = parseInt(c, 10);
  };
  p.__private__.getZoomMode = function() {
    return Ft;
  };
  var te, ae = p.__private__.setPageMode = function(c) {
    if ([void 0, null, "UseNone", "UseOutlines", "UseThumbs", "FullScreen"].indexOf(c) == -1) throw new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "' + c + '" is not recognized.');
    Gt = c;
  };
  p.__private__.getPageMode = function() {
    return Gt;
  };
  var pe = p.__private__.setLayoutMode = function(c) {
    if ([void 0, null, "continuous", "single", "twoleft", "tworight", "two"].indexOf(c) == -1) throw new Error('Layout mode must be one of continuous, single, twoleft, tworight. "' + c + '" is not recognized.');
    te = c;
  };
  p.__private__.getLayoutMode = function() {
    return te;
  }, p.__private__.setDisplayMode = p.setDisplayMode = function(c, v, j) {
    return Qt(c), pe(v), ae(j), this;
  };
  var Wt = { title: "", subject: "", author: "", keywords: "", creator: "" };
  p.__private__.getDocumentProperty = function(c) {
    if (Object.keys(Wt).indexOf(c) === -1) throw new Error("Invalid argument passed to jsPDF.getDocumentProperty");
    return Wt[c];
  }, p.__private__.getDocumentProperties = function() {
    return Wt;
  }, p.__private__.setDocumentProperties = p.setProperties = p.setDocumentProperties = function(c) {
    for (var v in Wt) Wt.hasOwnProperty(v) && c[v] && (Wt[v] = c[v]);
    return this;
  }, p.__private__.setDocumentProperty = function(c, v) {
    if (Object.keys(Wt).indexOf(c) === -1) throw new Error("Invalid arguments passed to jsPDF.setDocumentProperty");
    return Wt[c] = v;
  };
  var ee, jt, Ye, se, Pn, me = {}, Le = {}, Hn = [], le = {}, Er = {}, Ne = {}, kn = {}, rr = null, Se = 0, Jt = [], he = new bc(p), Br = r.hotfixes || [], Ve = {}, Wn = {}, Vn = [], Tt = function c(v, j, R, X, ct, yt) {
    if (!(this instanceof c)) return new c(v, j, R, X, ct, yt);
    isNaN(v) && (v = 1), isNaN(j) && (j = 0), isNaN(R) && (R = 0), isNaN(X) && (X = 1), isNaN(ct) && (ct = 0), isNaN(yt) && (yt = 0), this._matrix = [v, j, R, X, ct, yt];
  };
  Object.defineProperty(Tt.prototype, "sx", { get: function() {
    return this._matrix[0];
  }, set: function(c) {
    this._matrix[0] = c;
  } }), Object.defineProperty(Tt.prototype, "shy", { get: function() {
    return this._matrix[1];
  }, set: function(c) {
    this._matrix[1] = c;
  } }), Object.defineProperty(Tt.prototype, "shx", { get: function() {
    return this._matrix[2];
  }, set: function(c) {
    this._matrix[2] = c;
  } }), Object.defineProperty(Tt.prototype, "sy", { get: function() {
    return this._matrix[3];
  }, set: function(c) {
    this._matrix[3] = c;
  } }), Object.defineProperty(Tt.prototype, "tx", { get: function() {
    return this._matrix[4];
  }, set: function(c) {
    this._matrix[4] = c;
  } }), Object.defineProperty(Tt.prototype, "ty", { get: function() {
    return this._matrix[5];
  }, set: function(c) {
    this._matrix[5] = c;
  } }), Object.defineProperty(Tt.prototype, "a", { get: function() {
    return this._matrix[0];
  }, set: function(c) {
    this._matrix[0] = c;
  } }), Object.defineProperty(Tt.prototype, "b", { get: function() {
    return this._matrix[1];
  }, set: function(c) {
    this._matrix[1] = c;
  } }), Object.defineProperty(Tt.prototype, "c", { get: function() {
    return this._matrix[2];
  }, set: function(c) {
    this._matrix[2] = c;
  } }), Object.defineProperty(Tt.prototype, "d", { get: function() {
    return this._matrix[3];
  }, set: function(c) {
    this._matrix[3] = c;
  } }), Object.defineProperty(Tt.prototype, "e", { get: function() {
    return this._matrix[4];
  }, set: function(c) {
    this._matrix[4] = c;
  } }), Object.defineProperty(Tt.prototype, "f", { get: function() {
    return this._matrix[5];
  }, set: function(c) {
    this._matrix[5] = c;
  } }), Object.defineProperty(Tt.prototype, "rotation", { get: function() {
    return Math.atan2(this.shx, this.sx);
  } }), Object.defineProperty(Tt.prototype, "scaleX", { get: function() {
    return this.decompose().scale.sx;
  } }), Object.defineProperty(Tt.prototype, "scaleY", { get: function() {
    return this.decompose().scale.sy;
  } }), Object.defineProperty(Tt.prototype, "isIdentity", { get: function() {
    return this.sx === 1 && this.shy === 0 && this.shx === 0 && this.sy === 1 && this.tx === 0 && this.ty === 0;
  } }), Tt.prototype.join = function(c) {
    return [this.sx, this.shy, this.shx, this.sy, this.tx, this.ty].map(tt).join(c);
  }, Tt.prototype.multiply = function(c) {
    var v = c.sx * this.sx + c.shy * this.shx, j = c.sx * this.shy + c.shy * this.sy, R = c.shx * this.sx + c.sy * this.shx, X = c.shx * this.shy + c.sy * this.sy, ct = c.tx * this.sx + c.ty * this.shx + this.tx, yt = c.tx * this.shy + c.ty * this.sy + this.ty;
    return new Tt(v, j, R, X, ct, yt);
  }, Tt.prototype.decompose = function() {
    var c = this.sx, v = this.shy, j = this.shx, R = this.sy, X = this.tx, ct = this.ty, yt = Math.sqrt(c * c + v * v), Ot = (c /= yt) * j + (v /= yt) * R;
    j -= c * Ot, R -= v * Ot;
    var qt = Math.sqrt(j * j + R * R);
    return Ot /= qt, c * (R /= qt) < v * (j /= qt) && (c = -c, v = -v, Ot = -Ot, yt = -yt), { scale: new Tt(yt, 0, 0, qt, 0, 0), translate: new Tt(1, 0, 0, 1, X, ct), rotate: new Tt(c, v, -v, c, 0, 0), skew: new Tt(1, 0, Ot, 1, 0, 0) };
  }, Tt.prototype.toString = function(c) {
    return this.join(" ");
  }, Tt.prototype.inversed = function() {
    var c = this.sx, v = this.shy, j = this.shx, R = this.sy, X = this.tx, ct = this.ty, yt = 1 / (c * R - v * j), Ot = R * yt, qt = -v * yt, Kt = -j * yt, Yt = c * yt;
    return new Tt(Ot, qt, Kt, Yt, -Ot * X - Kt * ct, -qt * X - Yt * ct);
  }, Tt.prototype.applyToPoint = function(c) {
    var v = c.x * this.sx + c.y * this.shx + this.tx, j = c.x * this.shy + c.y * this.sy + this.ty;
    return new hi(v, j);
  }, Tt.prototype.applyToRectangle = function(c) {
    var v = this.applyToPoint(c), j = this.applyToPoint(new hi(c.x + c.w, c.y + c.h));
    return new Ji(v.x, v.y, j.x - v.x, j.y - v.y);
  }, Tt.prototype.clone = function() {
    var c = this.sx, v = this.shy, j = this.shx, R = this.sy, X = this.tx, ct = this.ty;
    return new Tt(c, v, j, R, X, ct);
  }, p.Matrix = Tt;
  var Cn = p.matrixMult = function(c, v) {
    return v.multiply(c);
  }, Gn = new Tt(1, 0, 0, 1, 0, 0);
  p.unitMatrix = p.identityMatrix = Gn;
  var on = function(c, v) {
    if (!Er[c]) {
      var j = (v instanceof Yr ? "Sh" : "P") + (Object.keys(le).length + 1).toString(10);
      v.id = j, Er[c] = j, le[j] = v, he.publish("addPattern", v);
    }
  };
  p.ShadingPattern = Yr, p.TilingPattern = Fi, p.addShadingPattern = function(c, v) {
    return z("addShadingPattern()"), on(c, v), this;
  }, p.beginTilingPattern = function(c) {
    z("beginTilingPattern()"), Ba(c.boundingBox[0], c.boundingBox[1], c.boundingBox[2] - c.boundingBox[0], c.boundingBox[3] - c.boundingBox[1], c.matrix);
  }, p.endTilingPattern = function(c, v) {
    z("endTilingPattern()"), v.stream = Lt[F].join(`
`), on(c, v), he.publish("endTilingPattern", v), Vn.pop().restore();
  };
  var Re = p.__private__.newObject = function() {
    var c = Be();
    return dn(c, !0), c;
  }, Be = p.__private__.newObjectDeferred = function() {
    return Y++, Q[Y] = function() {
      return nt;
    }, Y;
  }, dn = function(c, v) {
    return v = typeof v == "boolean" && v, Q[c] = nt, v && D(c + " 0 obj"), c;
  }, Kr = p.__private__.newAdditionalObject = function() {
    var c = { objId: Be(), content: "" };
    return At.push(c), c;
  }, ir = Be(), In = Be(), Fn = p.__private__.decodeColorString = function(c) {
    var v = c.split(" ");
    if (v.length !== 2 || v[1] !== "g" && v[1] !== "G")
      v.length === 5 && (v[4] === "k" || v[4] === "K") && (v = [(1 - v[0]) * (1 - v[3]), (1 - v[1]) * (1 - v[3]), (1 - v[2]) * (1 - v[3]), "r"]);
    else {
      var j = parseFloat(v[0]);
      v = [j, j, j, "r"];
    }
    for (var R = "#", X = 0; X < 3; X++) R += ("0" + Math.floor(255 * parseFloat(v[X])).toString(16)).slice(-2);
    return R;
  }, jn = p.__private__.encodeColorString = function(c) {
    var v;
    typeof c == "string" && (c = { ch1: c });
    var j = c.ch1, R = c.ch2, X = c.ch3, ct = c.ch4, yt = c.pdfColorType === "draw" ? ["G", "RG", "K"] : ["g", "rg", "k"];
    if (typeof j == "string" && j.charAt(0) !== "#") {
      var Ot = new Uc(j);
      if (Ot.ok) j = Ot.toHex();
      else if (!/^\d*\.?\d*$/.test(j)) throw new Error('Invalid color "' + j + '" passed to jsPDF.encodeColorString.');
    }
    if (typeof j == "string" && /^#[0-9A-Fa-f]{3}$/.test(j) && (j = "#" + j[1] + j[1] + j[2] + j[2] + j[3] + j[3]), typeof j == "string" && /^#[0-9A-Fa-f]{6}$/.test(j)) {
      var qt = parseInt(j.substr(1), 16);
      j = qt >> 16 & 255, R = qt >> 8 & 255, X = 255 & qt;
    }
    if (R === void 0 || ct === void 0 && j === R && R === X) if (typeof j == "string") v = j + " " + yt[0];
    else switch (c.precision) {
      case 2:
        v = dt(j / 255) + " " + yt[0];
        break;
      case 3:
      default:
        v = P(j / 255) + " " + yt[0];
    }
    else if (ct === void 0 || de(ct) === "object") {
      if (ct && !isNaN(ct.a) && ct.a === 0) return v = ["1.", "1.", "1.", yt[1]].join(" ");
      if (typeof j == "string") v = [j, R, X, yt[1]].join(" ");
      else switch (c.precision) {
        case 2:
          v = [dt(j / 255), dt(R / 255), dt(X / 255), yt[1]].join(" ");
          break;
        default:
        case 3:
          v = [P(j / 255), P(R / 255), P(X / 255), yt[1]].join(" ");
      }
    } else if (typeof j == "string") v = [j, R, X, ct, yt[2]].join(" ");
    else switch (c.precision) {
      case 2:
        v = [dt(j), dt(R), dt(X), dt(ct), yt[2]].join(" ");
        break;
      case 3:
      default:
        v = [P(j), P(R), P(X), P(ct), yt[2]].join(" ");
    }
    return v;
  }, Jn = p.__private__.getFilters = function() {
    return l;
  }, yn = p.__private__.putStream = function(c) {
    var v = (c = c || {}).data || "", j = c.filters || Jn(), R = c.alreadyAppliedFilters || [], X = c.addLength1 || !1, ct = v.length, yt = c.objectId, Ot = function($e) {
      return $e;
    };
    if (y !== null && yt === void 0) throw new Error("ObjectId must be passed to putStream for file encryption");
    y !== null && (Ot = Xe.encryptor(yt, 0));
    var qt = {};
    j === !0 && (j = ["FlateEncode"]);
    var Kt = c.additionalKeyValues || [], Yt = (qt = Ut.API.processDataByFilters !== void 0 ? Ut.API.processDataByFilters(v, j) : { data: v, reverseChain: [] }).reverseChain + (Array.isArray(R) ? R.join(" ") : R.toString());
    if (qt.data.length !== 0 && (Kt.push({ key: "Length", value: qt.data.length }), X === !0 && Kt.push({ key: "Length1", value: ct })), Yt.length != 0) if (Yt.split("/").length - 1 == 1) Kt.push({ key: "Filter", value: Yt });
    else {
      Kt.push({ key: "Filter", value: "[" + Yt + "]" });
      for (var re = 0; re < Kt.length; re += 1) if (Kt[re].key === "DecodeParms") {
        for (var Ae = [], _e = 0; _e < qt.reverseChain.split("/").length - 1; _e += 1) Ae.push("null");
        Ae.push(Kt[re].value), Kt[re].value = "[" + Ae.join(" ") + "]";
      }
    }
    D("<<");
    for (var Me = 0; Me < Kt.length; Me++) D("/" + Kt[Me].key + " " + Kt[Me].value);
    D(">>"), qt.data.length !== 0 && (D("stream"), D(Ot(qt.data)), D("endstream"));
  }, Yn = p.__private__.putPage = function(c) {
    var v = c.number, j = c.data, R = c.objId, X = c.contentsObjId;
    dn(R, !0), D("<</Type /Page"), D("/Parent " + c.rootDictionaryObjId + " 0 R"), D("/Resources " + c.resourceDictionaryObjId + " 0 R"), D("/MediaBox [" + parseFloat(tt(c.mediaBox.bottomLeftX)) + " " + parseFloat(tt(c.mediaBox.bottomLeftY)) + " " + tt(c.mediaBox.topRightX) + " " + tt(c.mediaBox.topRightY) + "]"), c.cropBox !== null && D("/CropBox [" + tt(c.cropBox.bottomLeftX) + " " + tt(c.cropBox.bottomLeftY) + " " + tt(c.cropBox.topRightX) + " " + tt(c.cropBox.topRightY) + "]"), c.bleedBox !== null && D("/BleedBox [" + tt(c.bleedBox.bottomLeftX) + " " + tt(c.bleedBox.bottomLeftY) + " " + tt(c.bleedBox.topRightX) + " " + tt(c.bleedBox.topRightY) + "]"), c.trimBox !== null && D("/TrimBox [" + tt(c.trimBox.bottomLeftX) + " " + tt(c.trimBox.bottomLeftY) + " " + tt(c.trimBox.topRightX) + " " + tt(c.trimBox.topRightY) + "]"), c.artBox !== null && D("/ArtBox [" + tt(c.artBox.bottomLeftX) + " " + tt(c.artBox.bottomLeftY) + " " + tt(c.artBox.topRightX) + " " + tt(c.artBox.topRightY) + "]"), typeof c.userUnit == "number" && c.userUnit !== 1 && D("/UserUnit " + c.userUnit), he.publish("putPage", { objId: R, pageContext: Jt[v], pageNumber: v, page: j }), D("/Contents " + X + " 0 R"), D(">>"), D("endobj");
    var ct = j.join(`
`);
    return G === E.ADVANCED && (ct += `
Q`), dn(X, !0), yn({ data: ct, filters: Jn(), objectId: X }), D("endobj"), R;
  }, Mr = p.__private__.putPages = function() {
    var c, v, j = [];
    for (c = 1; c <= Se; c++) Jt[c].objId = Be(), Jt[c].contentsObjId = Be();
    for (c = 1; c <= Se; c++) j.push(Yn({ number: c, data: Lt[c], objId: Jt[c].objId, contentsObjId: Jt[c].contentsObjId, mediaBox: Jt[c].mediaBox, cropBox: Jt[c].cropBox, bleedBox: Jt[c].bleedBox, trimBox: Jt[c].trimBox, artBox: Jt[c].artBox, userUnit: Jt[c].userUnit, rootDictionaryObjId: ir, resourceDictionaryObjId: In }));
    dn(ir, !0), D("<</Type /Pages");
    var R = "/Kids [";
    for (v = 0; v < Se; v++) R += j[v] + " 0 R ";
    D(R + "]"), D("/Count " + Se), D(">>"), D("endobj"), he.publish("postPutPages");
  }, Zr = function(c) {
    he.publish("putFont", { font: c, out: D, newObject: Re, putStream: yn }), c.isAlreadyPutted !== !0 && (c.objectNumber = Re(), D("<<"), D("/Type /Font"), D("/BaseFont /" + Ci(c.postScriptName)), D("/Subtype /Type1"), typeof c.encoding == "string" && D("/Encoding /" + c.encoding), D("/FirstChar 32"), D("/LastChar 255"), D(">>"), D("endobj"));
  }, Qr = function() {
    for (var c in me) me.hasOwnProperty(c) && (b === !1 || b === !0 && N.hasOwnProperty(c)) && Zr(me[c]);
  }, ti = function(c) {
    c.objectNumber = Re();
    var v = [];
    v.push({ key: "Type", value: "/XObject" }), v.push({ key: "Subtype", value: "/Form" }), v.push({ key: "BBox", value: "[" + [tt(c.x), tt(c.y), tt(c.x + c.width), tt(c.y + c.height)].join(" ") + "]" }), v.push({ key: "Matrix", value: "[" + c.matrix.toString() + "]" });
    var j = c.pages[1].join(`
`);
    yn({ data: j, additionalKeyValues: v, objectId: c.objectNumber }), D("endobj");
  }, ei = function() {
    for (var c in Ve) Ve.hasOwnProperty(c) && ti(Ve[c]);
  }, va = function(c, v) {
    var j, R = [], X = 1 / (v - 1);
    for (j = 0; j < 1; j += X) R.push(j);
    if (R.push(1), c[0].offset != 0) {
      var ct = { offset: 0, color: c[0].color };
      c.unshift(ct);
    }
    if (c[c.length - 1].offset != 1) {
      var yt = { offset: 1, color: c[c.length - 1].color };
      c.push(yt);
    }
    for (var Ot = "", qt = 0, Kt = 0; Kt < R.length; Kt++) {
      for (j = R[Kt]; j > c[qt + 1].offset; ) qt++;
      var Yt = c[qt].offset, re = (j - Yt) / (c[qt + 1].offset - Yt), Ae = c[qt].color, _e = c[qt + 1].color;
      Ot += T(Math.round((1 - re) * Ae[0] + re * _e[0]).toString(16)) + T(Math.round((1 - re) * Ae[1] + re * _e[1]).toString(16)) + T(Math.round((1 - re) * Ae[2] + re * _e[2]).toString(16));
    }
    return Ot.trim();
  }, So = function(c, v) {
    v || (v = 21);
    var j = Re(), R = va(c.colors, v), X = [];
    X.push({ key: "FunctionType", value: "0" }), X.push({ key: "Domain", value: "[0.0 1.0]" }), X.push({ key: "Size", value: "[" + v + "]" }), X.push({ key: "BitsPerSample", value: "8" }), X.push({ key: "Range", value: "[0.0 1.0 0.0 1.0 0.0 1.0]" }), X.push({ key: "Decode", value: "[0.0 1.0 0.0 1.0 0.0 1.0]" }), yn({ data: R, additionalKeyValues: X, alreadyAppliedFilters: ["/ASCIIHexDecode"], objectId: j }), D("endobj"), c.objectNumber = Re(), D("<< /ShadingType " + c.type), D("/ColorSpace /DeviceRGB");
    var ct = "/Coords [" + tt(parseFloat(c.coords[0])) + " " + tt(parseFloat(c.coords[1])) + " ";
    c.type === 2 ? ct += tt(parseFloat(c.coords[2])) + " " + tt(parseFloat(c.coords[3])) : ct += tt(parseFloat(c.coords[2])) + " " + tt(parseFloat(c.coords[3])) + " " + tt(parseFloat(c.coords[4])) + " " + tt(parseFloat(c.coords[5])), D(ct += "]"), c.matrix && D("/Matrix [" + c.matrix.toString() + "]"), D("/Function " + j + " 0 R"), D("/Extend [true true]"), D(">>"), D("endobj");
  }, _o = function(c, v) {
    var j = Be(), R = Re();
    v.push({ resourcesOid: j, objectOid: R }), c.objectNumber = R;
    var X = [];
    X.push({ key: "Type", value: "/Pattern" }), X.push({ key: "PatternType", value: "1" }), X.push({ key: "PaintType", value: "1" }), X.push({ key: "TilingType", value: "1" }), X.push({ key: "BBox", value: "[" + c.boundingBox.map(tt).join(" ") + "]" }), X.push({ key: "XStep", value: tt(c.xStep) }), X.push({ key: "YStep", value: tt(c.yStep) }), X.push({ key: "Resources", value: j + " 0 R" }), c.matrix && X.push({ key: "Matrix", value: "[" + c.matrix.toString() + "]" }), yn({ data: c.stream, additionalKeyValues: X, objectId: c.objectNumber }), D("endobj");
  }, ni = function(c) {
    var v;
    for (v in le) le.hasOwnProperty(v) && (le[v] instanceof Yr ? So(le[v]) : le[v] instanceof Fi && _o(le[v], c));
  }, ba = function(c) {
    for (var v in c.objectNumber = Re(), D("<<"), c) switch (v) {
      case "opacity":
        D("/ca " + dt(c[v]));
        break;
      case "stroke-opacity":
        D("/CA " + dt(c[v]));
    }
    D(">>"), D("endobj");
  }, Po = function() {
    var c;
    for (c in Ne) Ne.hasOwnProperty(c) && ba(Ne[c]);
  }, Di = function() {
    for (var c in D("/XObject <<"), Ve) Ve.hasOwnProperty(c) && Ve[c].objectNumber >= 0 && D("/" + c + " " + Ve[c].objectNumber + " 0 R");
    he.publish("putXobjectDict"), D(">>");
  }, ko = function() {
    Xe.oid = Re(), D("<<"), D("/Filter /Standard"), D("/V " + Xe.v), D("/R " + Xe.r), D("/U <" + Xe.toHexString(Xe.U) + ">"), D("/O <" + Xe.toHexString(Xe.O) + ">"), D("/P " + Xe.P), D(">>"), D("endobj");
  }, ya = function() {
    for (var c in D("/Font <<"), me) me.hasOwnProperty(c) && (b === !1 || b === !0 && N.hasOwnProperty(c)) && D("/" + c + " " + me[c].objectNumber + " 0 R");
    D(">>");
  }, Co = function() {
    if (Object.keys(le).length > 0) {
      for (var c in D("/Shading <<"), le) le.hasOwnProperty(c) && le[c] instanceof Yr && le[c].objectNumber >= 0 && D("/" + c + " " + le[c].objectNumber + " 0 R");
      he.publish("putShadingPatternDict"), D(">>");
    }
  }, ri = function(c) {
    if (Object.keys(le).length > 0) {
      for (var v in D("/Pattern <<"), le) le.hasOwnProperty(v) && le[v] instanceof p.TilingPattern && le[v].objectNumber >= 0 && le[v].objectNumber < c && D("/" + v + " " + le[v].objectNumber + " 0 R");
      he.publish("putTilingPatternDict"), D(">>");
    }
  }, Io = function() {
    if (Object.keys(Ne).length > 0) {
      var c;
      for (c in D("/ExtGState <<"), Ne) Ne.hasOwnProperty(c) && Ne[c].objectNumber >= 0 && D("/" + c + " " + Ne[c].objectNumber + " 0 R");
      he.publish("putGStateDict"), D(">>");
    }
  }, Ce = function(c) {
    dn(c.resourcesOid, !0), D("<<"), D("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]"), ya(), Co(), ri(c.objectOid), Io(), Di(), D(">>"), D("endobj");
  }, wa = function() {
    var c = [];
    Qr(), Po(), ei(), ni(c), he.publish("putResources"), c.forEach(Ce), Ce({ resourcesOid: In, objectOid: Number.MAX_SAFE_INTEGER }), he.publish("postPutResources");
  }, xa = function() {
    he.publish("putAdditionalObjects");
    for (var c = 0; c < At.length; c++) {
      var v = At[c];
      dn(v.objId, !0), D(v.content), D("endobj");
    }
    he.publish("postPutAdditionalObjects");
  }, La = function(c) {
    Le[c.fontName] = Le[c.fontName] || {}, Le[c.fontName][c.fontStyle] = c.id;
  }, qi = function(c, v, j, R, X) {
    var ct = { id: "F" + (Object.keys(me).length + 1).toString(10), postScriptName: c, fontName: v, fontStyle: j, encoding: R, isStandardFont: X || !1, metadata: {} };
    return he.publish("addFont", { font: ct, instance: this }), me[ct.id] = ct, La(ct), ct.id;
  }, Fo = function(c) {
    for (var v = 0, j = xt.length; v < j; v++) {
      var R = qi.call(this, c[v][0], c[v][1], c[v][2], xt[v][3], !0);
      b === !1 && (N[R] = !0);
      var X = c[v][0].split("-");
      La({ id: R, fontName: X[0], fontStyle: X[1] || "" });
    }
    he.publish("addFonts", { fonts: me, dictionary: Le });
  }, On = function(c) {
    return c.foo = function() {
      try {
        return c.apply(this, arguments);
      } catch (R) {
        var v = R.stack || "";
        ~v.indexOf(" at ") && (v = v.split(" at ")[1]);
        var j = "Error in function " + v.split(`
`)[0].split("<")[0] + ": " + R.message;
        if (!Ht.console) throw new Error(j);
        Ht.console.error(j, R), Ht.alert && alert(j);
      }
    }, c.foo.bar = c, c.foo;
  }, ii = function(c, v) {
    var j, R, X, ct, yt, Ot, qt, Kt, Yt;
    if (X = (v = v || {}).sourceEncoding || "Unicode", yt = v.outputEncoding, (v.autoencode || yt) && me[ee].metadata && me[ee].metadata[X] && me[ee].metadata[X].encoding && (ct = me[ee].metadata[X].encoding, !yt && me[ee].encoding && (yt = me[ee].encoding), !yt && ct.codePages && (yt = ct.codePages[0]), typeof yt == "string" && (yt = ct[yt]), yt)) {
      for (qt = !1, Ot = [], j = 0, R = c.length; j < R; j++) (Kt = yt[c.charCodeAt(j)]) ? Ot.push(String.fromCharCode(Kt)) : Ot.push(c[j]), Ot[j].charCodeAt(0) >> 8 && (qt = !0);
      c = Ot.join("");
    }
    for (j = c.length; qt === void 0 && j !== 0; ) c.charCodeAt(j - 1) >> 8 && (qt = !0), j--;
    if (!qt) return c;
    for (Ot = v.noBOM ? [] : [254, 255], j = 0, R = c.length; j < R; j++) {
      if ((Yt = (Kt = c.charCodeAt(j)) >> 8) >> 8) throw new Error("Character at position " + j + " of string '" + c + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
      Ot.push(Yt), Ot.push(Kt - (Yt << 8));
    }
    return String.fromCharCode.apply(void 0, Ot);
  }, sn = p.__private__.pdfEscape = p.pdfEscape = function(c, v) {
    return ii(c, v).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  }, Ri = p.__private__.beginPage = function(c) {
    Lt[++Se] = [], Jt[Se] = { objId: 0, contentsObjId: 0, userUnit: Number(u), artBox: null, bleedBox: null, cropBox: null, trimBox: null, mediaBox: { bottomLeftX: 0, bottomLeftY: 0, topRightX: Number(c[0]), topRightY: Number(c[1]) } }, Na(Se), ft(Lt[F]);
  }, Aa = function(c, v) {
    var j, R, X;
    switch (n = v || n, typeof c == "string" && (j = _(c.toLowerCase()), Array.isArray(j) && (R = j[0], X = j[1])), Array.isArray(c) && (R = c[0] * jt, X = c[1] * jt), isNaN(R) && (R = s[0], X = s[1]), (R > 14400 || X > 14400) && (be.warn("A page in a PDF can not be wider or taller than 14400 userUnit. jsPDF limits the width/height to 14400"), R = Math.min(14400, R), X = Math.min(14400, X)), s = [R, X], n.substr(0, 1)) {
      case "l":
        X > R && (s = [X, R]);
        break;
      case "p":
        R > X && (s = [X, R]);
    }
    Ri(s), Ia(Hi), D(En), Vi !== 0 && D(Vi + " J"), Gi !== 0 && D(Gi + " j"), he.publish("addPage", { pageNumber: Se });
  }, jo = function(c) {
    c > 0 && c <= Se && (Lt.splice(c, 1), Jt.splice(c, 1), Se--, F > Se && (F = Se), this.setPage(F));
  }, Na = function(c) {
    c > 0 && c <= Se && (F = c);
  }, Oo = p.__private__.getNumberOfPages = p.getNumberOfPages = function() {
    return Lt.length - 1;
  }, Sa = function(c, v, j) {
    var R, X = void 0;
    return j = j || {}, c = c !== void 0 ? c : me[ee].fontName, v = v !== void 0 ? v : me[ee].fontStyle, R = c.toLowerCase(), Le[R] !== void 0 && Le[R][v] !== void 0 ? X = Le[R][v] : Le[c] !== void 0 && Le[c][v] !== void 0 ? X = Le[c][v] : j.disableWarning === !1 && be.warn("Unable to look up font label for font '" + c + "', '" + v + "'. Refer to getFontList() for available fonts."), X || j.noFallback || (X = Le.times[v]) == null && (X = Le.times.normal), X;
  }, Eo = p.__private__.putInfo = function() {
    var c = Re(), v = function(R) {
      return R;
    };
    for (var j in y !== null && (v = Xe.encryptor(c, 0)), D("<<"), D("/Producer (" + sn(v("jsPDF " + Ut.version)) + ")"), Wt) Wt.hasOwnProperty(j) && Wt[j] && D("/" + j.substr(0, 1).toUpperCase() + j.substr(1) + " (" + sn(v(Wt[j])) + ")");
    D("/CreationDate (" + sn(v(st)) + ")"), D(">>"), D("endobj");
  }, Ti = p.__private__.putCatalog = function(c) {
    var v = (c = c || {}).rootDictionaryObjId || ir;
    switch (Re(), D("<<"), D("/Type /Catalog"), D("/Pages " + v + " 0 R"), Ft || (Ft = "fullwidth"), Ft) {
      case "fullwidth":
        D("/OpenAction [3 0 R /FitH null]");
        break;
      case "fullheight":
        D("/OpenAction [3 0 R /FitV null]");
        break;
      case "fullpage":
        D("/OpenAction [3 0 R /Fit]");
        break;
      case "original":
        D("/OpenAction [3 0 R /XYZ null null 1]");
        break;
      default:
        var j = "" + Ft;
        j.substr(j.length - 1) === "%" && (Ft = parseInt(Ft) / 100), typeof Ft == "number" && D("/OpenAction [3 0 R /XYZ null null " + dt(Ft) + "]");
    }
    switch (te || (te = "continuous"), te) {
      case "continuous":
        D("/PageLayout /OneColumn");
        break;
      case "single":
        D("/PageLayout /SinglePage");
        break;
      case "two":
      case "twoleft":
        D("/PageLayout /TwoColumnLeft");
        break;
      case "tworight":
        D("/PageLayout /TwoColumnRight");
    }
    Gt && D("/PageMode /" + Gt), he.publish("putCatalog"), D(">>"), D("endobj");
  }, Bo = p.__private__.putTrailer = function() {
    D("trailer"), D("<<"), D("/Size " + (Y + 1)), D("/Root " + Y + " 0 R"), D("/Info " + (Y - 1) + " 0 R"), y !== null && D("/Encrypt " + Xe.oid + " 0 R"), D("/ID [ <" + it + "> <" + it + "> ]"), D(">>");
  }, Mo = p.__private__.putHeader = function() {
    D("%PDF-" + O), D("%ºß¬à");
  }, Do = p.__private__.putXRef = function() {
    var c = "0000000000";
    D("xref"), D("0 " + (Y + 1)), D("0000000000 65535 f ");
    for (var v = 1; v <= Y; v++)
      typeof Q[v] == "function" ? D((c + Q[v]()).slice(-10) + " 00000 n ") : Q[v] !== void 0 ? D((c + Q[v]).slice(-10) + " 00000 n ") : D("0000000000 00000 n ");
  }, ar = p.__private__.buildDocument = function() {
    zt(), ft(et), he.publish("buildDocument"), Mo(), Mr(), xa(), wa(), y !== null && ko(), Eo(), Ti();
    var c = nt;
    return Do(), Bo(), D("startxref"), D("" + c), D("%%EOF"), ft(Lt[F]), et.join(`
`);
  }, ai = p.__private__.getBlob = function(c) {
    return new Blob([Mt(c)], { type: "application/pdf" });
  }, oi = p.output = p.__private__.output = On(function(c, v) {
    switch (typeof (v = v || {}) == "string" ? v = { filename: v } : v.filename = v.filename || "generated.pdf", c) {
      case void 0:
        return ar();
      case "save":
        p.save(v.filename);
        break;
      case "arraybuffer":
        return Mt(ar());
      case "blob":
        return ai(ar());
      case "bloburi":
      case "bloburl":
        if (Ht.URL !== void 0 && typeof Ht.URL.createObjectURL == "function") return Ht.URL && Ht.URL.createObjectURL(ai(ar())) || void 0;
        be.warn("bloburl is not supported by your system, because URL.createObjectURL is not supported by your browser.");
        break;
      case "datauristring":
      case "dataurlstring":
        var j = "", R = ar();
        try {
          j = Ps(R);
        } catch {
          j = Ps(unescape(encodeURIComponent(R)));
        }
        return "data:application/pdf;filename=" + v.filename + ";base64," + j;
      case "pdfobjectnewwindow":
        if (Object.prototype.toString.call(Ht) === "[object Window]") {
          var X = "https://cdnjs.cloudflare.com/ajax/libs/pdfobject/2.1.1/pdfobject.min.js", ct = ' integrity="sha512-4ze/a9/4jqu+tX9dfOqJYSvyYd5M6qum/3HpCLr+/Jqf0whc37VUbkpNGHR7/8pSnCFw47T1fmIpwBV7UySh3g==" crossorigin="anonymous"';
          v.pdfObjectUrl && (X = v.pdfObjectUrl, ct = "");
          var yt = '<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><script src="' + X + '"' + ct + '><\/script><script >PDFObject.embed("' + this.output("dataurlstring") + '", ' + JSON.stringify(v) + ");<\/script></body></html>", Ot = Ht.open();
          return Ot !== null && Ot.document.write(yt), Ot;
        }
        throw new Error("The option pdfobjectnewwindow just works in a browser-environment.");
      case "pdfjsnewwindow":
        if (Object.prototype.toString.call(Ht) === "[object Window]") {
          var qt = '<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><iframe id="pdfViewer" src="' + (v.pdfJsUrl || "examples/PDF.js/web/viewer.html") + "?file=&downloadName=" + v.filename + '" width="500px" height="400px" /></body></html>', Kt = Ht.open();
          if (Kt !== null) {
            Kt.document.write(qt);
            var Yt = this;
            Kt.document.documentElement.querySelector("#pdfViewer").onload = function() {
              Kt.document.title = v.filename, Kt.document.documentElement.querySelector("#pdfViewer").contentWindow.PDFViewerApplication.open(Yt.output("bloburl"));
            };
          }
          return Kt;
        }
        throw new Error("The option pdfjsnewwindow just works in a browser-environment.");
      case "dataurlnewwindow":
        if (Object.prototype.toString.call(Ht) !== "[object Window]") throw new Error("The option dataurlnewwindow just works in a browser-environment.");
        var re = '<html><style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><iframe src="' + this.output("datauristring", v) + '"></iframe></body></html>', Ae = Ht.open();
        if (Ae !== null && (Ae.document.write(re), Ae.document.title = v.filename), Ae || typeof safari > "u") return Ae;
        break;
      case "datauri":
      case "dataurl":
        return Ht.document.location.href = this.output("datauristring", v);
      default:
        return null;
    }
  }), _a = function(c) {
    return Array.isArray(Br) === !0 && Br.indexOf(c) > -1;
  };
  switch (i) {
    case "pt":
      jt = 1;
      break;
    case "mm":
      jt = 72 / 25.4;
      break;
    case "cm":
      jt = 72 / 2.54;
      break;
    case "in":
      jt = 72;
      break;
    case "px":
      jt = _a("px_scaling") == 1 ? 0.75 : 96 / 72;
      break;
    case "pc":
    case "em":
      jt = 12;
      break;
    case "ex":
      jt = 6;
      break;
    default:
      if (typeof i != "number") throw new Error("Invalid unit: " + i);
      jt = i;
  }
  var Xe = null;
  It(), Z();
  var qo = function(c) {
    return y !== null ? Xe.encryptor(c, 0) : function(v) {
      return v;
    };
  }, Pa = p.__private__.getPageInfo = p.getPageInfo = function(c) {
    if (isNaN(c) || c % 1 != 0) throw new Error("Invalid argument passed to jsPDF.getPageInfo");
    return { objId: Jt[c].objId, pageNumber: c, pageContext: Jt[c] };
  }, Vt = p.__private__.getPageInfoByObjId = function(c) {
    if (isNaN(c) || c % 1 != 0) throw new Error("Invalid argument passed to jsPDF.getPageInfoByObjId");
    for (var v in Jt) if (Jt[v].objId === c) break;
    return Pa(v);
  }, Ro = p.__private__.getCurrentPageInfo = p.getCurrentPageInfo = function() {
    return { objId: Jt[F].objId, pageNumber: F, pageContext: Jt[F] };
  };
  p.addPage = function() {
    return Aa.apply(this, arguments), this;
  }, p.setPage = function() {
    return Na.apply(this, arguments), ft.call(this, Lt[F]), this;
  }, p.insertPage = function(c) {
    return this.addPage(), this.movePage(F, c), this;
  }, p.movePage = function(c, v) {
    var j, R;
    if (c > v) {
      j = Lt[c], R = Jt[c];
      for (var X = c; X > v; X--) Lt[X] = Lt[X - 1], Jt[X] = Jt[X - 1];
      Lt[v] = j, Jt[v] = R, this.setPage(v);
    } else if (c < v) {
      j = Lt[c], R = Jt[c];
      for (var ct = c; ct < v; ct++) Lt[ct] = Lt[ct + 1], Jt[ct] = Jt[ct + 1];
      Lt[v] = j, Jt[v] = R, this.setPage(v);
    }
    return this;
  }, p.deletePage = function() {
    return jo.apply(this, arguments), this;
  }, p.__private__.text = p.text = function(c, v, j, R, X) {
    var ct, yt, Ot, qt, Kt, Yt, re, Ae, _e, Me = (R = R || {}).scope || this;
    if (typeof c == "number" && typeof v == "number" && (typeof j == "string" || Array.isArray(j))) {
      var $e = j;
      j = v, v = c, c = $e;
    }
    if (arguments[3] instanceof Tt ? (z("The transform parameter of text() with a Matrix value"), _e = X) : (Ot = arguments[4], qt = arguments[5], de(re = arguments[3]) === "object" && re !== null || (typeof Ot == "string" && (qt = Ot, Ot = null), typeof re == "string" && (qt = re, re = null), typeof re == "number" && (Ot = re, re = null), R = { flags: re, angle: Ot, align: qt })), isNaN(v) || isNaN(j) || c == null) throw new Error("Invalid arguments passed to jsPDF.text");
    if (c.length === 0) return Me;
    var ze = "", Bn = !1, pn = typeof R.lineHeightFactor == "number" ? R.lineHeightFactor : qr, Kn = Me.internal.scaleFactor;
    function Ma(ye) {
      return ye = ye.split("	").join(Array(R.TabLen || 9).join(" ")), sn(ye, re);
    }
    function Ki(ye) {
      for (var we, Fe = ye.concat(), Te = [], hr = Fe.length; hr--; ) typeof (we = Fe.shift()) == "string" ? Te.push(we) : Array.isArray(ye) && (we.length === 1 || we[1] === void 0 && we[2] === void 0) ? Te.push(we[0]) : Te.push([we[0], we[1], we[2]]);
      return Te;
    }
    function Zi(ye, we) {
      var Fe;
      if (typeof ye == "string") Fe = we(ye)[0];
      else if (Array.isArray(ye)) {
        for (var Te, hr, oa = ye.concat(), xi = [], za = oa.length; za--; ) typeof (Te = oa.shift()) == "string" ? xi.push(we(Te)[0]) : Array.isArray(Te) && typeof Te[0] == "string" && (hr = we(Te[0], Te[1], Te[2]), xi.push([hr[0], hr[1], hr[2]]));
        Fe = xi;
      }
      return Fe;
    }
    var fi = !1, Qi = !0;
    if (typeof c == "string") fi = !0;
    else if (Array.isArray(c)) {
      var ta = c.concat();
      yt = [];
      for (var di, Ge = ta.length; Ge--; ) (typeof (di = ta.shift()) != "string" || Array.isArray(di) && typeof di[0] != "string") && (Qi = !1);
      fi = Qi;
    }
    if (fi === !1) throw new Error('Type of text must be string or Array. "' + c + '" is not recognized.');
    typeof c == "string" && (c = c.match(/[\r?\n]/) ? c.split(/\r\n|\r|\n/g) : [c]);
    var pi = Nt / Me.internal.scaleFactor, gi = pi * (pn - 1);
    switch (R.baseline) {
      case "bottom":
        j -= gi;
        break;
      case "top":
        j += pi - gi;
        break;
      case "hanging":
        j += pi - 2 * gi;
        break;
      case "middle":
        j += pi / 2 - gi;
    }
    if ((Yt = R.maxWidth || 0) > 0 && (typeof c == "string" ? c = Me.splitTextToSize(c, Yt) : Object.prototype.toString.call(c) === "[object Array]" && (c = c.reduce(function(ye, we) {
      return ye.concat(Me.splitTextToSize(we, Yt));
    }, []))), ct = { text: c, x: v, y: j, options: R, mutex: { pdfEscape: sn, activeFontKey: ee, fonts: me, activeFontSize: Nt } }, he.publish("preProcessText", ct), c = ct.text, Ot = (R = ct.options).angle, !(_e instanceof Tt) && Ot && typeof Ot == "number") {
      Ot *= Math.PI / 180, R.rotationDirection === 0 && (Ot = -Ot), G === E.ADVANCED && (Ot = -Ot);
      var mi = Math.cos(Ot), ea = Math.sin(Ot);
      _e = new Tt(mi, ea, -ea, mi, 0, 0);
    } else Ot && Ot instanceof Tt && (_e = Ot);
    G !== E.ADVANCED || _e || (_e = Gn), (Kt = R.charSpace || li) !== void 0 && (ze += tt(C(Kt)) + ` Tc
`, this.setCharSpace(this.getCharSpace() || 0)), (Ae = R.horizontalScale) !== void 0 && (ze += tt(100 * Ae) + ` Tz
`), R.lang;
    var cn = -1, Xo = R.renderingMode !== void 0 ? R.renderingMode : R.stroke, na = Me.internal.getCurrentPageInfo().pageContext;
    switch (Xo) {
      case 0:
      case !1:
      case "fill":
        cn = 0;
        break;
      case 1:
      case !0:
      case "stroke":
        cn = 1;
        break;
      case 2:
      case "fillThenStroke":
        cn = 2;
        break;
      case 3:
      case "invisible":
        cn = 3;
        break;
      case 4:
      case "fillAndAddForClipping":
        cn = 4;
        break;
      case 5:
      case "strokeAndAddPathForClipping":
        cn = 5;
        break;
      case 6:
      case "fillThenStrokeAndAddToPathForClipping":
        cn = 6;
        break;
      case 7:
      case "addToPathForClipping":
        cn = 7;
    }
    var Da = na.usedRenderingMode !== void 0 ? na.usedRenderingMode : -1;
    cn !== -1 ? ze += cn + ` Tr
` : Da !== -1 && (ze += `0 Tr
`), cn !== -1 && (na.usedRenderingMode = cn), qt = R.align || "left";
    var wn, vi = Nt * pn, qa = Me.internal.pageSize.getWidth(), Ra = me[ee];
    Kt = R.charSpace || li, Yt = R.maxWidth || 0, re = Object.assign({ autoencode: !0, noBOM: !0 }, R.flags);
    var br = [], zr = function(ye) {
      return Me.getStringUnitWidth(ye, { font: Ra, charSpace: Kt, fontSize: Nt, doKerning: !1 }) * Nt / Kn;
    };
    if (Object.prototype.toString.call(c) === "[object Array]") {
      var ln;
      yt = Ki(c), qt !== "left" && (wn = yt.map(zr));
      var nn, yr = 0;
      if (qt === "right") {
        v -= wn[0], c = [], Ge = yt.length;
        for (var sr = 0; sr < Ge; sr++) sr === 0 ? (nn = $n(v), ln = or(j)) : (nn = C(yr - wn[sr]), ln = -vi), c.push([yt[sr], nn, ln]), yr = wn[sr];
      } else if (qt === "center") {
        v -= wn[0] / 2, c = [], Ge = yt.length;
        for (var cr = 0; cr < Ge; cr++) cr === 0 ? (nn = $n(v), ln = or(j)) : (nn = C((yr - wn[cr]) / 2), ln = -vi), c.push([yt[cr], nn, ln]), yr = wn[cr];
      } else if (qt === "left") {
        c = [], Ge = yt.length;
        for (var bi = 0; bi < Ge; bi++) c.push(yt[bi]);
      } else if (qt === "justify" && Ra.encoding === "Identity-H") {
        c = [], Ge = yt.length, Yt = Yt !== 0 ? Yt : qa;
        for (var lr = 0, Ie = 0; Ie < Ge; Ie++) if (ln = Ie === 0 ? or(j) : -vi, nn = Ie === 0 ? $n(v) : lr, Ie < Ge - 1) {
          var ra = C((Yt - wn[Ie]) / (yt[Ie].split(" ").length - 1)), rn = yt[Ie].split(" ");
          c.push([rn[0] + " ", nn, ln]), lr = 0;
          for (var xn = 1; xn < rn.length; xn++) {
            var yi = (zr(rn[xn - 1] + " " + rn[xn]) - zr(rn[xn])) * Kn + ra;
            xn == rn.length - 1 ? c.push([rn[xn], yi, 0]) : c.push([rn[xn] + " ", yi, 0]), lr -= yi;
          }
        } else c.push([yt[Ie], nn, ln]);
        c.push(["", lr, 0]);
      } else {
        if (qt !== "justify") throw new Error('Unrecognized alignment option, use "left", "center", "right" or "justify".');
        for (c = [], Ge = yt.length, Yt = Yt !== 0 ? Yt : qa, Ie = 0; Ie < Ge; Ie++) ln = Ie === 0 ? or(j) : -vi, nn = Ie === 0 ? $n(v) : 0, Ie < Ge - 1 ? br.push(tt(C((Yt - wn[Ie]) / (yt[Ie].split(" ").length - 1)))) : br.push(0), c.push([yt[Ie], nn, ln]);
      }
    }
    var Ta = typeof R.R2L == "boolean" ? R.R2L : Dt;
    Ta === !0 && (c = Zi(c, function(ye, we, Fe) {
      return [ye.split("").reverse().join(""), we, Fe];
    })), ct = { text: c, x: v, y: j, options: R, mutex: { pdfEscape: sn, activeFontKey: ee, fonts: me, activeFontSize: Nt } }, he.publish("postProcessText", ct), c = ct.text, Bn = ct.mutex.isHex || !1;
    var ia = me[ee].encoding;
    ia !== "WinAnsiEncoding" && ia !== "StandardEncoding" || (c = Zi(c, function(ye, we, Fe) {
      return [Ma(ye), we, Fe];
    })), yt = Ki(c), c = [];
    for (var Ur, Hr, wr, Wr = 0, wi = 1, Vr = Array.isArray(yt[0]) ? wi : Wr, xr = "", aa = function(ye, we, Fe) {
      var Te = "";
      return Fe instanceof Tt ? (Fe = typeof R.angle == "number" ? Cn(Fe, new Tt(1, 0, 0, 1, ye, we)) : Cn(new Tt(1, 0, 0, 1, ye, we), Fe), G === E.ADVANCED && (Fe = Cn(new Tt(1, 0, 0, -1, 0, 0), Fe)), Te = Fe.join(" ") + ` Tm
`) : Te = tt(ye) + " " + tt(we) + ` Td
`, Te;
    }, Ln = 0; Ln < yt.length; Ln++) {
      switch (xr = "", Vr) {
        case wi:
          wr = (Bn ? "<" : "(") + yt[Ln][0] + (Bn ? ">" : ")"), Ur = parseFloat(yt[Ln][1]), Hr = parseFloat(yt[Ln][2]);
          break;
        case Wr:
          wr = (Bn ? "<" : "(") + yt[Ln] + (Bn ? ">" : ")"), Ur = $n(v), Hr = or(j);
      }
      br !== void 0 && br[Ln] !== void 0 && (xr = br[Ln] + ` Tw
`), Ln === 0 ? c.push(xr + aa(Ur, Hr, _e) + wr) : Vr === Wr ? c.push(xr + wr) : Vr === wi && c.push(xr + aa(Ur, Hr, _e) + wr);
    }
    c = Vr === Wr ? c.join(` Tj
T* `) : c.join(` Tj
`), c += ` Tj
`;
    var An = `BT
/`;
    return An += ee + " " + Nt + ` Tf
`, An += tt(Nt * pn) + ` TL
`, An += Rr + `
`, An += ze, An += c, D(An += "ET"), N[ee] = !0, Me;
  };
  var To = p.__private__.clip = p.clip = function(c) {
    return D(c === "evenodd" ? "W*" : "W"), this;
  };
  p.clipEvenOdd = function() {
    return To("evenodd");
  }, p.__private__.discardPath = p.discardPath = function() {
    return D("n"), this;
  };
  var Xn = p.__private__.isValidStyle = function(c) {
    var v = !1;
    return [void 0, null, "S", "D", "F", "DF", "FD", "f", "f*", "B", "B*", "n"].indexOf(c) !== -1 && (v = !0), v;
  };
  p.__private__.setDefaultPathOperation = p.setDefaultPathOperation = function(c) {
    return Xn(c) && (g = c), this;
  };
  var ka = p.__private__.getStyle = p.getStyle = function(c) {
    var v = g;
    switch (c) {
      case "D":
      case "S":
        v = "S";
        break;
      case "F":
        v = "f";
        break;
      case "FD":
      case "DF":
        v = "B";
        break;
      case "f":
      case "f*":
      case "B":
      case "B*":
        v = c;
    }
    return v;
  }, Ca = p.close = function() {
    return D("h"), this;
  };
  p.stroke = function() {
    return D("S"), this;
  }, p.fill = function(c) {
    return si("f", c), this;
  }, p.fillEvenOdd = function(c) {
    return si("f*", c), this;
  }, p.fillStroke = function(c) {
    return si("B", c), this;
  }, p.fillStrokeEvenOdd = function(c) {
    return si("B*", c), this;
  };
  var si = function(c, v) {
    de(v) === "object" ? Uo(v, c) : D(c);
  }, zi = function(c) {
    c === null || G === E.ADVANCED && c === void 0 || (c = ka(c), D(c));
  };
  function zo(c, v, j, R, X) {
    var ct = new Fi(v || this.boundingBox, j || this.xStep, R || this.yStep, this.gState, X || this.matrix);
    ct.stream = this.stream;
    var yt = c + "$$" + this.cloneIndex++ + "$$";
    return on(yt, ct), ct;
  }
  var Uo = function(c, v) {
    var j = Er[c.key], R = le[j];
    if (R instanceof Yr) D("q"), D(Ho(v)), R.gState && p.setGState(R.gState), D(c.matrix.toString() + " cm"), D("/" + j + " sh"), D("Q");
    else if (R instanceof Fi) {
      var X = new Tt(1, 0, 0, -1, 0, vr());
      c.matrix && (X = X.multiply(c.matrix || Gn), j = zo.call(R, c.key, c.boundingBox, c.xStep, c.yStep, X).id), D("q"), D("/Pattern cs"), D("/" + j + " scn"), R.gState && p.setGState(R.gState), D(v), D("Q");
    }
  }, Ho = function(c) {
    switch (c) {
      case "f":
      case "F":
        return "W n";
      case "f*":
        return "W* n";
      case "B":
        return "W S";
      case "B*":
        return "W* S";
      case "S":
        return "W S";
      case "n":
        return "W n";
    }
  }, Ui = p.moveTo = function(c, v) {
    return D(tt(C(c)) + " " + tt(q(v)) + " m"), this;
  }, Dr = p.lineTo = function(c, v) {
    return D(tt(C(c)) + " " + tt(q(v)) + " l"), this;
  }, gr = p.curveTo = function(c, v, j, R, X, ct) {
    return D([tt(C(c)), tt(q(v)), tt(C(j)), tt(q(R)), tt(C(X)), tt(q(ct)), "c"].join(" ")), this;
  };
  p.__private__.line = p.line = function(c, v, j, R, X) {
    if (isNaN(c) || isNaN(v) || isNaN(j) || isNaN(R) || !Xn(X)) throw new Error("Invalid arguments passed to jsPDF.line");
    return G === E.COMPAT ? this.lines([[j - c, R - v]], c, v, [1, 1], X || "S") : this.lines([[j - c, R - v]], c, v, [1, 1]).stroke();
  }, p.__private__.lines = p.lines = function(c, v, j, R, X, ct) {
    var yt, Ot, qt, Kt, Yt, re, Ae, _e, Me, $e, ze, Bn;
    if (typeof c == "number" && (Bn = j, j = v, v = c, c = Bn), R = R || [1, 1], ct = ct || !1, isNaN(v) || isNaN(j) || !Array.isArray(c) || !Array.isArray(R) || !Xn(X) || typeof ct != "boolean") throw new Error("Invalid arguments passed to jsPDF.lines");
    for (Ui(v, j), yt = R[0], Ot = R[1], Kt = c.length, $e = v, ze = j, qt = 0; qt < Kt; qt++) (Yt = c[qt]).length === 2 ? ($e = Yt[0] * yt + $e, ze = Yt[1] * Ot + ze, Dr($e, ze)) : (re = Yt[0] * yt + $e, Ae = Yt[1] * Ot + ze, _e = Yt[2] * yt + $e, Me = Yt[3] * Ot + ze, $e = Yt[4] * yt + $e, ze = Yt[5] * Ot + ze, gr(re, Ae, _e, Me, $e, ze));
    return ct && Ca(), zi(X), this;
  }, p.path = function(c) {
    for (var v = 0; v < c.length; v++) {
      var j = c[v], R = j.c;
      switch (j.op) {
        case "m":
          Ui(R[0], R[1]);
          break;
        case "l":
          Dr(R[0], R[1]);
          break;
        case "c":
          gr.apply(this, R);
          break;
        case "h":
          Ca();
      }
    }
    return this;
  }, p.__private__.rect = p.rect = function(c, v, j, R, X) {
    if (isNaN(c) || isNaN(v) || isNaN(j) || isNaN(R) || !Xn(X)) throw new Error("Invalid arguments passed to jsPDF.rect");
    return G === E.COMPAT && (R = -R), D([tt(C(c)), tt(q(v)), tt(C(j)), tt(C(R)), "re"].join(" ")), zi(X), this;
  }, p.__private__.triangle = p.triangle = function(c, v, j, R, X, ct, yt) {
    if (isNaN(c) || isNaN(v) || isNaN(j) || isNaN(R) || isNaN(X) || isNaN(ct) || !Xn(yt)) throw new Error("Invalid arguments passed to jsPDF.triangle");
    return this.lines([[j - c, R - v], [X - j, ct - R], [c - X, v - ct]], c, v, [1, 1], yt, !0), this;
  }, p.__private__.roundedRect = p.roundedRect = function(c, v, j, R, X, ct, yt) {
    if (isNaN(c) || isNaN(v) || isNaN(j) || isNaN(R) || isNaN(X) || isNaN(ct) || !Xn(yt)) throw new Error("Invalid arguments passed to jsPDF.roundedRect");
    var Ot = 4 / 3 * (Math.SQRT2 - 1);
    return X = Math.min(X, 0.5 * j), ct = Math.min(ct, 0.5 * R), this.lines([[j - 2 * X, 0], [X * Ot, 0, X, ct - ct * Ot, X, ct], [0, R - 2 * ct], [0, ct * Ot, -X * Ot, ct, -X, ct], [2 * X - j, 0], [-X * Ot, 0, -X, -ct * Ot, -X, -ct], [0, 2 * ct - R], [0, -ct * Ot, X * Ot, -ct, X, -ct]], c + X, v, [1, 1], yt, !0), this;
  }, p.__private__.ellipse = p.ellipse = function(c, v, j, R, X) {
    if (isNaN(c) || isNaN(v) || isNaN(j) || isNaN(R) || !Xn(X)) throw new Error("Invalid arguments passed to jsPDF.ellipse");
    var ct = 4 / 3 * (Math.SQRT2 - 1) * j, yt = 4 / 3 * (Math.SQRT2 - 1) * R;
    return Ui(c + j, v), gr(c + j, v - yt, c + ct, v - R, c, v - R), gr(c - ct, v - R, c - j, v - yt, c - j, v), gr(c - j, v + yt, c - ct, v + R, c, v + R), gr(c + ct, v + R, c + j, v + yt, c + j, v), zi(X), this;
  }, p.__private__.circle = p.circle = function(c, v, j, R) {
    if (isNaN(c) || isNaN(v) || isNaN(j) || !Xn(R)) throw new Error("Invalid arguments passed to jsPDF.circle");
    return this.ellipse(c, v, j, j, R);
  }, p.setFont = function(c, v, j) {
    return j && (v = wt(v, j)), ee = Sa(c, v, { disableWarning: !1 }), this;
  };
  var Wo = p.__private__.getFont = p.getFont = function() {
    return me[Sa.apply(p, arguments)];
  };
  p.__private__.getFontList = p.getFontList = function() {
    var c, v, j = {};
    for (c in Le) if (Le.hasOwnProperty(c)) for (v in j[c] = [], Le[c]) Le[c].hasOwnProperty(v) && j[c].push(v);
    return j;
  }, p.addFont = function(c, v, j, R, X) {
    var ct = ["StandardEncoding", "MacRomanEncoding", "Identity-H", "WinAnsiEncoding"];
    return arguments[3] && ct.indexOf(arguments[3]) !== -1 ? X = arguments[3] : arguments[3] && ct.indexOf(arguments[3]) == -1 && (j = wt(j, R)), X = X || "Identity-H", qi.call(this, c, v, j, X);
  };
  var qr, Hi = r.lineWidth || 0.200025, ci = p.__private__.getLineWidth = p.getLineWidth = function() {
    return Hi;
  }, Ia = p.__private__.setLineWidth = p.setLineWidth = function(c) {
    return Hi = c, D(tt(C(c)) + " w"), this;
  };
  p.__private__.setLineDash = Ut.API.setLineDash = Ut.API.setLineDashPattern = function(c, v) {
    if (c = c || [], v = v || 0, isNaN(v) || !Array.isArray(c)) throw new Error("Invalid arguments passed to jsPDF.setLineDash");
    return c = c.map(function(j) {
      return tt(C(j));
    }).join(" "), v = tt(C(v)), D("[" + c + "] " + v + " d"), this;
  };
  var Fa = p.__private__.getLineHeight = p.getLineHeight = function() {
    return Nt * qr;
  };
  p.__private__.getLineHeight = p.getLineHeight = function() {
    return Nt * qr;
  };
  var ja = p.__private__.setLineHeightFactor = p.setLineHeightFactor = function(c) {
    return typeof (c = c || 1.15) == "number" && (qr = c), this;
  }, Oa = p.__private__.getLineHeightFactor = p.getLineHeightFactor = function() {
    return qr;
  };
  ja(r.lineHeight);
  var $n = p.__private__.getHorizontalCoordinate = function(c) {
    return C(c);
  }, or = p.__private__.getVerticalCoordinate = function(c) {
    return G === E.ADVANCED ? c : Jt[F].mediaBox.topRightY - Jt[F].mediaBox.bottomLeftY - C(c);
  }, Vo = p.__private__.getHorizontalCoordinateString = p.getHorizontalCoordinateString = function(c) {
    return tt($n(c));
  }, mr = p.__private__.getVerticalCoordinateString = p.getVerticalCoordinateString = function(c) {
    return tt(or(c));
  }, En = r.strokeColor || "0 G";
  p.__private__.getStrokeColor = p.getDrawColor = function() {
    return Fn(En);
  }, p.__private__.setStrokeColor = p.setDrawColor = function(c, v, j, R) {
    return En = jn({ ch1: c, ch2: v, ch3: j, ch4: R, pdfColorType: "draw", precision: 2 }), D(En), this;
  };
  var Wi = r.fillColor || "0 g";
  p.__private__.getFillColor = p.getFillColor = function() {
    return Fn(Wi);
  }, p.__private__.setFillColor = p.setFillColor = function(c, v, j, R) {
    return Wi = jn({ ch1: c, ch2: v, ch3: j, ch4: R, pdfColorType: "fill", precision: 2 }), D(Wi), this;
  };
  var Rr = r.textColor || "0 g", Go = p.__private__.getTextColor = p.getTextColor = function() {
    return Fn(Rr);
  };
  p.__private__.setTextColor = p.setTextColor = function(c, v, j, R) {
    return Rr = jn({ ch1: c, ch2: v, ch3: j, ch4: R, pdfColorType: "text", precision: 3 }), this;
  };
  var li = r.charSpace, Jo = p.__private__.getCharSpace = p.getCharSpace = function() {
    return parseFloat(li || 0);
  };
  p.__private__.setCharSpace = p.setCharSpace = function(c) {
    if (isNaN(c)) throw new Error("Invalid argument passed to jsPDF.setCharSpace");
    return li = c, this;
  };
  var Vi = 0;
  p.CapJoinStyles = { 0: 0, butt: 0, but: 0, miter: 0, 1: 1, round: 1, rounded: 1, circle: 1, 2: 2, projecting: 2, project: 2, square: 2, bevel: 2 }, p.__private__.setLineCap = p.setLineCap = function(c) {
    var v = p.CapJoinStyles[c];
    if (v === void 0) throw new Error("Line cap style of '" + c + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
    return Vi = v, D(v + " J"), this;
  };
  var Gi = 0;
  p.__private__.setLineJoin = p.setLineJoin = function(c) {
    var v = p.CapJoinStyles[c];
    if (v === void 0) throw new Error("Line join style of '" + c + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
    return Gi = v, D(v + " j"), this;
  }, p.__private__.setLineMiterLimit = p.__private__.setMiterLimit = p.setLineMiterLimit = p.setMiterLimit = function(c) {
    if (c = c || 0, isNaN(c)) throw new Error("Invalid argument passed to jsPDF.setLineMiterLimit");
    return D(tt(C(c)) + " M"), this;
  }, p.GState = bo, p.setGState = function(c) {
    (c = typeof c == "string" ? Ne[kn[c]] : Ea(null, c)).equals(rr) || (D("/" + c.id + " gs"), rr = c);
  };
  var Ea = function(c, v) {
    if (!c || !kn[c]) {
      var j = !1;
      for (var R in Ne) if (Ne.hasOwnProperty(R) && Ne[R].equals(v)) {
        j = !0;
        break;
      }
      if (j) v = Ne[R];
      else {
        var X = "GS" + (Object.keys(Ne).length + 1).toString(10);
        Ne[X] = v, v.id = X;
      }
      return c && (kn[c] = v.id), he.publish("addGState", v), v;
    }
  };
  p.addGState = function(c, v) {
    return Ea(c, v), this;
  }, p.saveGraphicsState = function() {
    return D("q"), Hn.push({ key: ee, size: Nt, color: Rr }), this;
  }, p.restoreGraphicsState = function() {
    D("Q");
    var c = Hn.pop();
    return ee = c.key, Nt = c.size, Rr = c.color, rr = null, this;
  }, p.setCurrentTransformationMatrix = function(c) {
    return D(c.toString() + " cm"), this;
  }, p.comment = function(c) {
    return D("#" + c), this;
  };
  var hi = function(c, v) {
    var j = c || 0;
    Object.defineProperty(this, "x", { enumerable: !0, get: function() {
      return j;
    }, set: function(ct) {
      isNaN(ct) || (j = parseFloat(ct));
    } });
    var R = v || 0;
    Object.defineProperty(this, "y", { enumerable: !0, get: function() {
      return R;
    }, set: function(ct) {
      isNaN(ct) || (R = parseFloat(ct));
    } });
    var X = "pt";
    return Object.defineProperty(this, "type", { enumerable: !0, get: function() {
      return X;
    }, set: function(ct) {
      X = ct.toString();
    } }), this;
  }, Ji = function(c, v, j, R) {
    hi.call(this, c, v), this.type = "rect";
    var X = j || 0;
    Object.defineProperty(this, "w", { enumerable: !0, get: function() {
      return X;
    }, set: function(yt) {
      isNaN(yt) || (X = parseFloat(yt));
    } });
    var ct = R || 0;
    return Object.defineProperty(this, "h", { enumerable: !0, get: function() {
      return ct;
    }, set: function(yt) {
      isNaN(yt) || (ct = parseFloat(yt));
    } }), this;
  }, Yi = function() {
    this.page = Se, this.currentPage = F, this.pages = Lt.slice(0), this.pagesContext = Jt.slice(0), this.x = Ye, this.y = se, this.matrix = Pn, this.width = Tr(F), this.height = vr(F), this.outputDestination = _t, this.id = "", this.objectNumber = -1;
  };
  Yi.prototype.restore = function() {
    Se = this.page, F = this.currentPage, Jt = this.pagesContext, Lt = this.pages, Ye = this.x, se = this.y, Pn = this.matrix, Xi(F, this.width), $i(F, this.height), _t = this.outputDestination;
  };
  var Ba = function(c, v, j, R, X) {
    Vn.push(new Yi()), Se = F = 0, Lt = [], Ye = c, se = v, Pn = X, Ri([j, R]);
  }, Yo = function(c) {
    if (Wn[c]) Vn.pop().restore();
    else {
      var v = new Yi(), j = "Xo" + (Object.keys(Ve).length + 1).toString(10);
      v.id = j, Wn[c] = j, Ve[j] = v, he.publish("addFormObject", v), Vn.pop().restore();
    }
  };
  for (var ui in p.beginFormObject = function(c, v, j, R, X) {
    return Ba(c, v, j, R, X), this;
  }, p.endFormObject = function(c) {
    return Yo(c), this;
  }, p.doFormObject = function(c, v) {
    var j = Ve[Wn[c]];
    return D("q"), D(v.toString() + " cm"), D("/" + j.id + " Do"), D("Q"), this;
  }, p.getFormObject = function(c) {
    var v = Ve[Wn[c]];
    return { x: v.x, y: v.y, width: v.width, height: v.height, matrix: v.matrix };
  }, p.save = function(c, v) {
    return c = c || "generated.pdf", (v = v || {}).returnPromise = v.returnPromise || !1, v.returnPromise === !1 ? (Jr(ai(ar()), c), typeof Jr.unload == "function" && Ht.setTimeout && setTimeout(Jr.unload, 911), this) : new Promise(function(j, R) {
      try {
        var X = Jr(ai(ar()), c);
        typeof Jr.unload == "function" && Ht.setTimeout && setTimeout(Jr.unload, 911), j(X);
      } catch (ct) {
        R(ct.message);
      }
    });
  }, Ut.API) Ut.API.hasOwnProperty(ui) && (ui === "events" && Ut.API.events.length ? function(c, v) {
    var j, R, X;
    for (X = v.length - 1; X !== -1; X--) j = v[X][0], R = v[X][1], c.subscribe.apply(c, [j].concat(typeof R == "function" ? [R] : R));
  }(he, Ut.API.events) : p[ui] = Ut.API[ui]);
  var Tr = p.getPageWidth = function(c) {
    return (Jt[c = c || F].mediaBox.topRightX - Jt[c].mediaBox.bottomLeftX) / jt;
  }, Xi = p.setPageWidth = function(c, v) {
    Jt[c].mediaBox.topRightX = v * jt + Jt[c].mediaBox.bottomLeftX;
  }, vr = p.getPageHeight = function(c) {
    return (Jt[c = c || F].mediaBox.topRightY - Jt[c].mediaBox.bottomLeftY) / jt;
  }, $i = p.setPageHeight = function(c, v) {
    Jt[c].mediaBox.topRightY = v * jt + Jt[c].mediaBox.bottomLeftY;
  };
  return p.internal = { pdfEscape: sn, getStyle: ka, getFont: Wo, getFontSize: kt, getCharSpace: Jo, getTextColor: Go, getLineHeight: Fa, getLineHeightFactor: Oa, getLineWidth: ci, write: $t, getHorizontalCoordinate: $n, getVerticalCoordinate: or, getCoordinateString: Vo, getVerticalCoordinateString: mr, collections: {}, newObject: Re, newAdditionalObject: Kr, newObjectDeferred: Be, newObjectDeferredBegin: dn, getFilters: Jn, putStream: yn, events: he, scaleFactor: jt, pageSize: { getWidth: function() {
    return Tr(F);
  }, setWidth: function(c) {
    Xi(F, c);
  }, getHeight: function() {
    return vr(F);
  }, setHeight: function(c) {
    $i(F, c);
  } }, encryptionOptions: y, encryption: Xe, getEncryptor: qo, output: oi, getNumberOfPages: Oo, pages: Lt, out: D, f2: dt, f3: P, getPageInfo: Pa, getPageInfoByObjId: Vt, getCurrentPageInfo: Ro, getPDFVersion: k, Point: hi, Rectangle: Ji, Matrix: Tt, hasHotfix: _a }, Object.defineProperty(p.internal.pageSize, "width", { get: function() {
    return Tr(F);
  }, set: function(c) {
    Xi(F, c);
  }, enumerable: !0, configurable: !0 }), Object.defineProperty(p.internal.pageSize, "height", { get: function() {
    return vr(F);
  }, set: function(c) {
    $i(F, c);
  }, enumerable: !0, configurable: !0 }), Fo.call(p, xt), ee = "F1", Aa(s, n), he.publish("initialized"), p;
}
ki.prototype.lsbFirstWord = function(r) {
  return String.fromCharCode(r >> 0 & 255, r >> 8 & 255, r >> 16 & 255, r >> 24 & 255);
}, ki.prototype.toHexString = function(r) {
  return r.split("").map(function(e) {
    return ("0" + (255 & e.charCodeAt(0)).toString(16)).slice(-2);
  }).join("");
}, ki.prototype.hexToBytes = function(r) {
  for (var e = [], n = 0; n < r.length; n += 2) e.push(String.fromCharCode(parseInt(r.substr(n, 2), 16)));
  return e.join("");
}, ki.prototype.processOwnerPassword = function(r, e) {
  return Cs(ks(e).substr(0, 5), r);
}, ki.prototype.encryptor = function(r, e) {
  var n = ks(this.encryptionKey + String.fromCharCode(255 & r, r >> 8 & 255, r >> 16 & 255, 255 & e, e >> 8 & 255)).substr(0, 10);
  return function(i) {
    return Cs(n, i);
  };
}, bo.prototype.equals = function(r) {
  var e, n = "id,objectNumber,equals";
  if (!r || de(r) !== de(this)) return !1;
  var i = 0;
  for (e in this) if (!(n.indexOf(e) >= 0)) {
    if (this.hasOwnProperty(e) && !r.hasOwnProperty(e) || this[e] !== r[e]) return !1;
    i++;
  }
  for (e in r) r.hasOwnProperty(e) && n.indexOf(e) < 0 && i--;
  return i === 0;
}, Ut.API = { events: [] }, Ut.version = "2.5.2";
var ke = Ut.API, Bs = 1, $r = function(r) {
  return r.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}, _i = function(r) {
  return r.replace(/\\\\/g, "\\").replace(/\\\(/g, "(").replace(/\\\)/g, ")");
}, Xt = function(r) {
  return r.toFixed(2);
}, Ir = function(r) {
  return r.toFixed(5);
};
ke.__acroform__ = {};
var fn = function(r, e) {
  r.prototype = Object.create(e.prototype), r.prototype.constructor = r;
}, yc = function(r) {
  return r * Bs;
}, Qn = function(r) {
  var e = new Gc(), n = Bt.internal.getHeight(r) || 0, i = Bt.internal.getWidth(r) || 0;
  return e.BBox = [0, 0, Number(Xt(i)), Number(Xt(n))], e;
}, xh = ke.__acroform__.setBit = function(r, e) {
  if (r = r || 0, e = e || 0, isNaN(r) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBit");
  return r |= 1 << e;
}, Lh = ke.__acroform__.clearBit = function(r, e) {
  if (r = r || 0, e = e || 0, isNaN(r) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBit");
  return r &= ~(1 << e);
}, Ah = ke.__acroform__.getBit = function(r, e) {
  if (isNaN(r) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBit");
  return r & 1 << e ? 1 : 0;
}, je = ke.__acroform__.getBitForPdf = function(r, e) {
  if (isNaN(r) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.getBitForPdf");
  return Ah(r, e - 1);
}, Oe = ke.__acroform__.setBitForPdf = function(r, e) {
  if (isNaN(r) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.setBitForPdf");
  return xh(r, e - 1);
}, Ee = ke.__acroform__.clearBitForPdf = function(r, e) {
  if (isNaN(r) || isNaN(e)) throw new Error("Invalid arguments passed to jsPDF.API.__acroform__.clearBitForPdf");
  return Lh(r, e - 1);
}, Nh = ke.__acroform__.calculateCoordinates = function(r, e) {
  var n = e.internal.getHorizontalCoordinate, i = e.internal.getVerticalCoordinate, s = r[0], o = r[1], l = r[2], u = r[3], f = {};
  return f.lowerLeft_X = n(s) || 0, f.lowerLeft_Y = i(o + u) || 0, f.upperRight_X = n(s + l) || 0, f.upperRight_Y = i(o) || 0, [Number(Xt(f.lowerLeft_X)), Number(Xt(f.lowerLeft_Y)), Number(Xt(f.upperRight_X)), Number(Xt(f.upperRight_Y))];
}, Sh = function(r) {
  if (r.appearanceStreamContent) return r.appearanceStreamContent;
  if (r.V || r.DV) {
    var e = [], n = r._V || r.DV, i = Is(r, n), s = r.scope.internal.getFont(r.fontName, r.fontStyle).id;
    e.push("/Tx BMC"), e.push("q"), e.push("BT"), e.push(r.scope.__private__.encodeColorString(r.color)), e.push("/" + s + " " + Xt(i.fontSize) + " Tf"), e.push("1 0 0 1 0 0 Tm"), e.push(i.text), e.push("ET"), e.push("Q"), e.push("EMC");
    var o = Qn(r);
    return o.scope = r.scope, o.stream = e.join(`
`), o;
  }
}, Is = function(r, e) {
  var n = r.fontSize === 0 ? r.maxFontSize : r.fontSize, i = { text: "", fontSize: "" }, s = (e = (e = e.substr(0, 1) == "(" ? e.substr(1) : e).substr(e.length - 1) == ")" ? e.substr(0, e.length - 1) : e).split(" ");
  s = r.multiline ? s.map(function(P) {
    return P.split(`
`);
  }) : s.map(function(P) {
    return [P];
  });
  var o = n, l = Bt.internal.getHeight(r) || 0;
  l = l < 0 ? -l : l;
  var u = Bt.internal.getWidth(r) || 0;
  u = u < 0 ? -u : u;
  var f = function(P, C, W) {
    if (P + 1 < s.length) {
      var q = C + " " + s[P + 1][0];
      return lo(q, r, W).width <= u - 4;
    }
    return !1;
  };
  o++;
  t: for (; o > 0; ) {
    e = "", o--;
    var g, y, b = lo("3", r, o).height, N = r.multiline ? l - o : (l - b) / 2, p = N += 2, O = 0, k = 0, B = 0;
    if (o <= 0) {
      e = `(...) Tj
`, e += "% Width of Text: " + lo(e, r, o = 12).width + ", FieldWidth:" + u + `
`;
      break;
    }
    for (var _ = "", E = 0, G = 0; G < s.length; G++) if (s.hasOwnProperty(G)) {
      var at = !1;
      if (s[G].length !== 1 && B !== s[G].length - 1) {
        if ((b + 2) * (E + 2) + 2 > l) continue t;
        _ += s[G][B], at = !0, k = G, G--;
      } else {
        _ = (_ += s[G][B] + " ").substr(_.length - 1) == " " ? _.substr(0, _.length - 1) : _;
        var lt = parseInt(G), wt = f(lt, _, o), tt = G >= s.length - 1;
        if (wt && !tt) {
          _ += " ", B = 0;
          continue;
        }
        if (wt || tt) {
          if (tt) k = lt;
          else if (r.multiline && (b + 2) * (E + 2) + 2 > l) continue t;
        } else {
          if (!r.multiline || (b + 2) * (E + 2) + 2 > l) continue t;
          k = lt;
        }
      }
      for (var z = "", rt = O; rt <= k; rt++) {
        var dt = s[rt];
        if (r.multiline) {
          if (rt === k) {
            z += dt[B] + " ", B = (B + 1) % dt.length;
            continue;
          }
          if (rt === O) {
            z += dt[dt.length - 1] + " ";
            continue;
          }
        }
        z += dt[0] + " ";
      }
      switch (z = z.substr(z.length - 1) == " " ? z.substr(0, z.length - 1) : z, y = lo(z, r, o).width, r.textAlign) {
        case "right":
          g = u - y - 2;
          break;
        case "center":
          g = (u - y) / 2;
          break;
        case "left":
        default:
          g = 2;
      }
      e += Xt(g) + " " + Xt(p) + ` Td
`, e += "(" + $r(z) + `) Tj
`, e += -Xt(g) + ` 0 Td
`, p = -(o + 2), y = 0, O = at ? k : k + 1, E++, _ = "";
    }
    break;
  }
  return i.text = e, i.fontSize = o, i;
}, lo = function(r, e, n) {
  var i = e.scope.internal.getFont(e.fontName, e.fontStyle), s = e.scope.getStringUnitWidth(r, { font: i, fontSize: parseFloat(n), charSpace: 0 }) * parseFloat(n);
  return { height: e.scope.getStringUnitWidth("3", { font: i, fontSize: parseFloat(n), charSpace: 0 }) * parseFloat(n) * 1.5, width: s };
}, _h = { fields: [], xForms: [], acroFormDictionaryRoot: null, printedOut: !1, internal: null, isInitialized: !1 }, Ph = function(r, e) {
  var n = { type: "reference", object: r };
  e.internal.getPageInfo(r.page).pageContext.annotations.find(function(i) {
    return i.type === n.type && i.object === n.object;
  }) === void 0 && e.internal.getPageInfo(r.page).pageContext.annotations.push(n);
}, kh = function(r, e) {
  for (var n in r) if (r.hasOwnProperty(n)) {
    var i = n, s = r[n];
    e.internal.newObjectDeferredBegin(s.objId, !0), de(s) === "object" && typeof s.putStream == "function" && s.putStream(), delete r[i];
  }
}, Ch = function(r, e) {
  if (e.scope = r, r.internal !== void 0 && (r.internal.acroformPlugin === void 0 || r.internal.acroformPlugin.isInitialized === !1)) {
    if (zn.FieldNum = 0, r.internal.acroformPlugin = JSON.parse(JSON.stringify(_h)), r.internal.acroformPlugin.acroFormDictionaryRoot) throw new Error("Exception while creating AcroformDictionary");
    Bs = r.internal.scaleFactor, r.internal.acroformPlugin.acroFormDictionaryRoot = new Jc(), r.internal.acroformPlugin.acroFormDictionaryRoot.scope = r, r.internal.acroformPlugin.acroFormDictionaryRoot._eventID = r.internal.events.subscribe("postPutResources", function() {
      (function(n) {
        n.internal.events.unsubscribe(n.internal.acroformPlugin.acroFormDictionaryRoot._eventID), delete n.internal.acroformPlugin.acroFormDictionaryRoot._eventID, n.internal.acroformPlugin.printedOut = !0;
      })(r);
    }), r.internal.events.subscribe("buildDocument", function() {
      (function(n) {
        n.internal.acroformPlugin.acroFormDictionaryRoot.objId = void 0;
        var i = n.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
        for (var s in i) if (i.hasOwnProperty(s)) {
          var o = i[s];
          o.objId = void 0, o.hasAnnotation && Ph(o, n);
        }
      })(r);
    }), r.internal.events.subscribe("putCatalog", function() {
      (function(n) {
        if (n.internal.acroformPlugin.acroFormDictionaryRoot === void 0) throw new Error("putCatalogCallback: Root missing.");
        n.internal.write("/AcroForm " + n.internal.acroformPlugin.acroFormDictionaryRoot.objId + " 0 R");
      })(r);
    }), r.internal.events.subscribe("postPutPages", function(n) {
      (function(i, s) {
        var o = !i;
        for (var l in i || (s.internal.newObjectDeferredBegin(s.internal.acroformPlugin.acroFormDictionaryRoot.objId, !0), s.internal.acroformPlugin.acroFormDictionaryRoot.putStream()), i = i || s.internal.acroformPlugin.acroFormDictionaryRoot.Kids) if (i.hasOwnProperty(l)) {
          var u = i[l], f = [], g = u.Rect;
          if (u.Rect && (u.Rect = Nh(u.Rect, s)), s.internal.newObjectDeferredBegin(u.objId, !0), u.DA = Bt.createDefaultAppearanceStream(u), de(u) === "object" && typeof u.getKeyValueListForStream == "function" && (f = u.getKeyValueListForStream()), u.Rect = g, u.hasAppearanceStream && !u.appearanceStreamContent) {
            var y = Sh(u);
            f.push({ key: "AP", value: "<</N " + y + ">>" }), s.internal.acroformPlugin.xForms.push(y);
          }
          if (u.appearanceStreamContent) {
            var b = "";
            for (var N in u.appearanceStreamContent) if (u.appearanceStreamContent.hasOwnProperty(N)) {
              var p = u.appearanceStreamContent[N];
              if (b += "/" + N + " ", b += "<<", Object.keys(p).length >= 1 || Array.isArray(p)) {
                for (var l in p) if (p.hasOwnProperty(l)) {
                  var O = p[l];
                  typeof O == "function" && (O = O.call(s, u)), b += "/" + l + " " + O + " ", s.internal.acroformPlugin.xForms.indexOf(O) >= 0 || s.internal.acroformPlugin.xForms.push(O);
                }
              } else typeof (O = p) == "function" && (O = O.call(s, u)), b += "/" + l + " " + O, s.internal.acroformPlugin.xForms.indexOf(O) >= 0 || s.internal.acroformPlugin.xForms.push(O);
              b += ">>";
            }
            f.push({ key: "AP", value: `<<
` + b + ">>" });
          }
          s.internal.putStream({ additionalKeyValues: f, objectId: u.objId }), s.internal.out("endobj");
        }
        o && kh(s.internal.acroformPlugin.xForms, s);
      })(n, r);
    }), r.internal.acroformPlugin.isInitialized = !0;
  }
}, Vc = ke.__acroform__.arrayToPdfArray = function(r, e, n) {
  var i = function(l) {
    return l;
  };
  if (Array.isArray(r)) {
    for (var s = "[", o = 0; o < r.length; o++) switch (o !== 0 && (s += " "), de(r[o])) {
      case "boolean":
      case "number":
      case "object":
        s += r[o].toString();
        break;
      case "string":
        r[o].substr(0, 1) !== "/" ? (e !== void 0 && n && (i = n.internal.getEncryptor(e)), s += "(" + $r(i(r[o].toString())) + ")") : s += r[o].toString();
    }
    return s += "]";
  }
  throw new Error("Invalid argument passed to jsPDF.__acroform__.arrayToPdfArray");
}, ys = function(r, e, n) {
  var i = function(s) {
    return s;
  };
  return e !== void 0 && n && (i = n.internal.getEncryptor(e)), (r = r || "").toString(), r = "(" + $r(i(r)) + ")";
}, tr = function() {
  this._objId = void 0, this._scope = void 0, Object.defineProperty(this, "objId", { get: function() {
    if (this._objId === void 0) {
      if (this.scope === void 0) return;
      this._objId = this.scope.internal.newObjectDeferred();
    }
    return this._objId;
  }, set: function(r) {
    this._objId = r;
  } }), Object.defineProperty(this, "scope", { value: this._scope, writable: !0 });
};
tr.prototype.toString = function() {
  return this.objId + " 0 R";
}, tr.prototype.putStream = function() {
  var r = this.getKeyValueListForStream();
  this.scope.internal.putStream({ data: this.stream, additionalKeyValues: r, objectId: this.objId }), this.scope.internal.out("endobj");
}, tr.prototype.getKeyValueListForStream = function() {
  var r = [], e = Object.getOwnPropertyNames(this).filter(function(o) {
    return o != "content" && o != "appearanceStreamContent" && o != "scope" && o != "objId" && o.substring(0, 1) != "_";
  });
  for (var n in e) if (Object.getOwnPropertyDescriptor(this, e[n]).configurable === !1) {
    var i = e[n], s = this[i];
    s && (Array.isArray(s) ? r.push({ key: i, value: Vc(s, this.objId, this.scope) }) : s instanceof tr ? (s.scope = this.scope, r.push({ key: i, value: s.objId + " 0 R" })) : typeof s != "function" && r.push({ key: i, value: s }));
  }
  return r;
};
var Gc = function() {
  tr.call(this), Object.defineProperty(this, "Type", { value: "/XObject", configurable: !1, writable: !0 }), Object.defineProperty(this, "Subtype", { value: "/Form", configurable: !1, writable: !0 }), Object.defineProperty(this, "FormType", { value: 1, configurable: !1, writable: !0 });
  var r, e = [];
  Object.defineProperty(this, "BBox", { configurable: !1, get: function() {
    return e;
  }, set: function(n) {
    e = n;
  } }), Object.defineProperty(this, "Resources", { value: "2 0 R", configurable: !1, writable: !0 }), Object.defineProperty(this, "stream", { enumerable: !1, configurable: !0, set: function(n) {
    r = n.trim();
  }, get: function() {
    return r || null;
  } });
};
fn(Gc, tr);
var Jc = function() {
  tr.call(this);
  var r, e = [];
  Object.defineProperty(this, "Kids", { enumerable: !1, configurable: !0, get: function() {
    return e.length > 0 ? e : void 0;
  } }), Object.defineProperty(this, "Fields", { enumerable: !1, configurable: !1, get: function() {
    return e;
  } }), Object.defineProperty(this, "DA", { enumerable: !1, configurable: !1, get: function() {
    if (r) {
      var n = function(i) {
        return i;
      };
      return this.scope && (n = this.scope.internal.getEncryptor(this.objId)), "(" + $r(n(r)) + ")";
    }
  }, set: function(n) {
    r = n;
  } });
};
fn(Jc, tr);
var zn = function r() {
  tr.call(this);
  var e = 4;
  Object.defineProperty(this, "F", { enumerable: !1, configurable: !1, get: function() {
    return e;
  }, set: function(_) {
    if (isNaN(_)) throw new Error('Invalid value "' + _ + '" for attribute F supplied.');
    e = _;
  } }), Object.defineProperty(this, "showWhenPrinted", { enumerable: !0, configurable: !0, get: function() {
    return !!je(e, 3);
  }, set: function(_) {
    _ ? this.F = Oe(e, 3) : this.F = Ee(e, 3);
  } });
  var n = 0;
  Object.defineProperty(this, "Ff", { enumerable: !1, configurable: !1, get: function() {
    return n;
  }, set: function(_) {
    if (isNaN(_)) throw new Error('Invalid value "' + _ + '" for attribute Ff supplied.');
    n = _;
  } });
  var i = [];
  Object.defineProperty(this, "Rect", { enumerable: !1, configurable: !1, get: function() {
    if (i.length !== 0) return i;
  }, set: function(_) {
    i = _ !== void 0 ? _ : [];
  } }), Object.defineProperty(this, "x", { enumerable: !0, configurable: !0, get: function() {
    return !i || isNaN(i[0]) ? 0 : i[0];
  }, set: function(_) {
    i[0] = _;
  } }), Object.defineProperty(this, "y", { enumerable: !0, configurable: !0, get: function() {
    return !i || isNaN(i[1]) ? 0 : i[1];
  }, set: function(_) {
    i[1] = _;
  } }), Object.defineProperty(this, "width", { enumerable: !0, configurable: !0, get: function() {
    return !i || isNaN(i[2]) ? 0 : i[2];
  }, set: function(_) {
    i[2] = _;
  } }), Object.defineProperty(this, "height", { enumerable: !0, configurable: !0, get: function() {
    return !i || isNaN(i[3]) ? 0 : i[3];
  }, set: function(_) {
    i[3] = _;
  } });
  var s = "";
  Object.defineProperty(this, "FT", { enumerable: !0, configurable: !1, get: function() {
    return s;
  }, set: function(_) {
    switch (_) {
      case "/Btn":
      case "/Tx":
      case "/Ch":
      case "/Sig":
        s = _;
        break;
      default:
        throw new Error('Invalid value "' + _ + '" for attribute FT supplied.');
    }
  } });
  var o = null;
  Object.defineProperty(this, "T", { enumerable: !0, configurable: !1, get: function() {
    if (!o || o.length < 1) {
      if (this instanceof yo) return;
      o = "FieldObject" + r.FieldNum++;
    }
    var _ = function(E) {
      return E;
    };
    return this.scope && (_ = this.scope.internal.getEncryptor(this.objId)), "(" + $r(_(o)) + ")";
  }, set: function(_) {
    o = _.toString();
  } }), Object.defineProperty(this, "fieldName", { configurable: !0, enumerable: !0, get: function() {
    return o;
  }, set: function(_) {
    o = _;
  } });
  var l = "helvetica";
  Object.defineProperty(this, "fontName", { enumerable: !0, configurable: !0, get: function() {
    return l;
  }, set: function(_) {
    l = _;
  } });
  var u = "normal";
  Object.defineProperty(this, "fontStyle", { enumerable: !0, configurable: !0, get: function() {
    return u;
  }, set: function(_) {
    u = _;
  } });
  var f = 0;
  Object.defineProperty(this, "fontSize", { enumerable: !0, configurable: !0, get: function() {
    return f;
  }, set: function(_) {
    f = _;
  } });
  var g = void 0;
  Object.defineProperty(this, "maxFontSize", { enumerable: !0, configurable: !0, get: function() {
    return g === void 0 ? 50 / Bs : g;
  }, set: function(_) {
    g = _;
  } });
  var y = "black";
  Object.defineProperty(this, "color", { enumerable: !0, configurable: !0, get: function() {
    return y;
  }, set: function(_) {
    y = _;
  } });
  var b = "/F1 0 Tf 0 g";
  Object.defineProperty(this, "DA", { enumerable: !0, configurable: !1, get: function() {
    if (!(!b || this instanceof yo || this instanceof Xr)) return ys(b, this.objId, this.scope);
  }, set: function(_) {
    _ = _.toString(), b = _;
  } });
  var N = null;
  Object.defineProperty(this, "DV", { enumerable: !1, configurable: !1, get: function() {
    if (N) return this instanceof We ? N : ys(N, this.objId, this.scope);
  }, set: function(_) {
    _ = _.toString(), N = this instanceof We ? _ : _.substr(0, 1) === "(" ? _i(_.substr(1, _.length - 2)) : _i(_);
  } }), Object.defineProperty(this, "defaultValue", { enumerable: !0, configurable: !0, get: function() {
    return this instanceof We ? _i(N.substr(1, N.length - 1)) : N;
  }, set: function(_) {
    _ = _.toString(), N = this instanceof We ? "/" + _ : _;
  } });
  var p = null;
  Object.defineProperty(this, "_V", { enumerable: !1, configurable: !1, get: function() {
    if (p) return p;
  }, set: function(_) {
    this.V = _;
  } }), Object.defineProperty(this, "V", { enumerable: !1, configurable: !1, get: function() {
    if (p) return this instanceof We ? p : ys(p, this.objId, this.scope);
  }, set: function(_) {
    _ = _.toString(), p = this instanceof We ? _ : _.substr(0, 1) === "(" ? _i(_.substr(1, _.length - 2)) : _i(_);
  } }), Object.defineProperty(this, "value", { enumerable: !0, configurable: !0, get: function() {
    return this instanceof We ? _i(p.substr(1, p.length - 1)) : p;
  }, set: function(_) {
    _ = _.toString(), p = this instanceof We ? "/" + _ : _;
  } }), Object.defineProperty(this, "hasAnnotation", { enumerable: !0, configurable: !0, get: function() {
    return this.Rect;
  } }), Object.defineProperty(this, "Type", { enumerable: !0, configurable: !1, get: function() {
    return this.hasAnnotation ? "/Annot" : null;
  } }), Object.defineProperty(this, "Subtype", { enumerable: !0, configurable: !1, get: function() {
    return this.hasAnnotation ? "/Widget" : null;
  } });
  var O, k = !1;
  Object.defineProperty(this, "hasAppearanceStream", { enumerable: !0, configurable: !0, get: function() {
    return k;
  }, set: function(_) {
    _ = !!_, k = _;
  } }), Object.defineProperty(this, "page", { enumerable: !0, configurable: !0, get: function() {
    if (O) return O;
  }, set: function(_) {
    O = _;
  } }), Object.defineProperty(this, "readOnly", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 1);
  }, set: function(_) {
    _ ? this.Ff = Oe(this.Ff, 1) : this.Ff = Ee(this.Ff, 1);
  } }), Object.defineProperty(this, "required", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 2);
  }, set: function(_) {
    _ ? this.Ff = Oe(this.Ff, 2) : this.Ff = Ee(this.Ff, 2);
  } }), Object.defineProperty(this, "noExport", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 3);
  }, set: function(_) {
    _ ? this.Ff = Oe(this.Ff, 3) : this.Ff = Ee(this.Ff, 3);
  } });
  var B = null;
  Object.defineProperty(this, "Q", { enumerable: !0, configurable: !1, get: function() {
    if (B !== null) return B;
  }, set: function(_) {
    if ([0, 1, 2].indexOf(_) === -1) throw new Error('Invalid value "' + _ + '" for attribute Q supplied.');
    B = _;
  } }), Object.defineProperty(this, "textAlign", { get: function() {
    var _;
    switch (B) {
      case 0:
      default:
        _ = "left";
        break;
      case 1:
        _ = "center";
        break;
      case 2:
        _ = "right";
    }
    return _;
  }, configurable: !0, enumerable: !0, set: function(_) {
    switch (_) {
      case "right":
      case 2:
        B = 2;
        break;
      case "center":
      case 1:
        B = 1;
        break;
      case "left":
      case 0:
      default:
        B = 0;
    }
  } });
};
fn(zn, tr);
var ji = function() {
  zn.call(this), this.FT = "/Ch", this.V = "()", this.fontName = "zapfdingbats";
  var r = 0;
  Object.defineProperty(this, "TI", { enumerable: !0, configurable: !1, get: function() {
    return r;
  }, set: function(n) {
    r = n;
  } }), Object.defineProperty(this, "topIndex", { enumerable: !0, configurable: !0, get: function() {
    return r;
  }, set: function(n) {
    r = n;
  } });
  var e = [];
  Object.defineProperty(this, "Opt", { enumerable: !0, configurable: !1, get: function() {
    return Vc(e, this.objId, this.scope);
  }, set: function(n) {
    var i, s;
    s = [], typeof (i = n) == "string" && (s = function(o, l, u) {
      u || (u = 1);
      for (var f, g = []; f = l.exec(o); ) g.push(f[u]);
      return g;
    }(i, /\((.*?)\)/g)), e = s;
  } }), this.getOptions = function() {
    return e;
  }, this.setOptions = function(n) {
    e = n, this.sort && e.sort();
  }, this.addOption = function(n) {
    n = (n = n || "").toString(), e.push(n), this.sort && e.sort();
  }, this.removeOption = function(n, i) {
    for (i = i || !1, n = (n = n || "").toString(); e.indexOf(n) !== -1 && (e.splice(e.indexOf(n), 1), i !== !1); ) ;
  }, Object.defineProperty(this, "combo", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 18);
  }, set: function(n) {
    n ? this.Ff = Oe(this.Ff, 18) : this.Ff = Ee(this.Ff, 18);
  } }), Object.defineProperty(this, "edit", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 19);
  }, set: function(n) {
    this.combo === !0 && (n ? this.Ff = Oe(this.Ff, 19) : this.Ff = Ee(this.Ff, 19));
  } }), Object.defineProperty(this, "sort", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 20);
  }, set: function(n) {
    n ? (this.Ff = Oe(this.Ff, 20), e.sort()) : this.Ff = Ee(this.Ff, 20);
  } }), Object.defineProperty(this, "multiSelect", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 22);
  }, set: function(n) {
    n ? this.Ff = Oe(this.Ff, 22) : this.Ff = Ee(this.Ff, 22);
  } }), Object.defineProperty(this, "doNotSpellCheck", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 23);
  }, set: function(n) {
    n ? this.Ff = Oe(this.Ff, 23) : this.Ff = Ee(this.Ff, 23);
  } }), Object.defineProperty(this, "commitOnSelChange", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 27);
  }, set: function(n) {
    n ? this.Ff = Oe(this.Ff, 27) : this.Ff = Ee(this.Ff, 27);
  } }), this.hasAppearanceStream = !1;
};
fn(ji, zn);
var Oi = function() {
  ji.call(this), this.fontName = "helvetica", this.combo = !1;
};
fn(Oi, ji);
var Ei = function() {
  Oi.call(this), this.combo = !0;
};
fn(Ei, Oi);
var fo = function() {
  Ei.call(this), this.edit = !0;
};
fn(fo, Ei);
var We = function() {
  zn.call(this), this.FT = "/Btn", Object.defineProperty(this, "noToggleToOff", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 15);
  }, set: function(n) {
    n ? this.Ff = Oe(this.Ff, 15) : this.Ff = Ee(this.Ff, 15);
  } }), Object.defineProperty(this, "radio", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 16);
  }, set: function(n) {
    n ? this.Ff = Oe(this.Ff, 16) : this.Ff = Ee(this.Ff, 16);
  } }), Object.defineProperty(this, "pushButton", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 17);
  }, set: function(n) {
    n ? this.Ff = Oe(this.Ff, 17) : this.Ff = Ee(this.Ff, 17);
  } }), Object.defineProperty(this, "radioIsUnison", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 26);
  }, set: function(n) {
    n ? this.Ff = Oe(this.Ff, 26) : this.Ff = Ee(this.Ff, 26);
  } });
  var r, e = {};
  Object.defineProperty(this, "MK", { enumerable: !1, configurable: !1, get: function() {
    var n = function(o) {
      return o;
    };
    if (this.scope && (n = this.scope.internal.getEncryptor(this.objId)), Object.keys(e).length !== 0) {
      var i, s = [];
      for (i in s.push("<<"), e) s.push("/" + i + " (" + $r(n(e[i])) + ")");
      return s.push(">>"), s.join(`
`);
    }
  }, set: function(n) {
    de(n) === "object" && (e = n);
  } }), Object.defineProperty(this, "caption", { enumerable: !0, configurable: !0, get: function() {
    return e.CA || "";
  }, set: function(n) {
    typeof n == "string" && (e.CA = n);
  } }), Object.defineProperty(this, "AS", { enumerable: !1, configurable: !1, get: function() {
    return r;
  }, set: function(n) {
    r = n;
  } }), Object.defineProperty(this, "appearanceState", { enumerable: !0, configurable: !0, get: function() {
    return r.substr(1, r.length - 1);
  }, set: function(n) {
    r = "/" + n;
  } });
};
fn(We, zn);
var po = function() {
  We.call(this), this.pushButton = !0;
};
fn(po, We);
var Bi = function() {
  We.call(this), this.radio = !0, this.pushButton = !1;
  var r = [];
  Object.defineProperty(this, "Kids", { enumerable: !0, configurable: !1, get: function() {
    return r;
  }, set: function(e) {
    r = e !== void 0 ? e : [];
  } });
};
fn(Bi, We);
var yo = function() {
  var r, e;
  zn.call(this), Object.defineProperty(this, "Parent", { enumerable: !1, configurable: !1, get: function() {
    return r;
  }, set: function(s) {
    r = s;
  } }), Object.defineProperty(this, "optionName", { enumerable: !1, configurable: !0, get: function() {
    return e;
  }, set: function(s) {
    e = s;
  } });
  var n, i = {};
  Object.defineProperty(this, "MK", { enumerable: !1, configurable: !1, get: function() {
    var s = function(u) {
      return u;
    };
    this.scope && (s = this.scope.internal.getEncryptor(this.objId));
    var o, l = [];
    for (o in l.push("<<"), i) l.push("/" + o + " (" + $r(s(i[o])) + ")");
    return l.push(">>"), l.join(`
`);
  }, set: function(s) {
    de(s) === "object" && (i = s);
  } }), Object.defineProperty(this, "caption", { enumerable: !0, configurable: !0, get: function() {
    return i.CA || "";
  }, set: function(s) {
    typeof s == "string" && (i.CA = s);
  } }), Object.defineProperty(this, "AS", { enumerable: !1, configurable: !1, get: function() {
    return n;
  }, set: function(s) {
    n = s;
  } }), Object.defineProperty(this, "appearanceState", { enumerable: !0, configurable: !0, get: function() {
    return n.substr(1, n.length - 1);
  }, set: function(s) {
    n = "/" + s;
  } }), this.caption = "l", this.appearanceState = "Off", this._AppearanceType = Bt.RadioButton.Circle, this.appearanceStreamContent = this._AppearanceType.createAppearanceStream(this.optionName);
};
fn(yo, zn), Bi.prototype.setAppearance = function(r) {
  if (!("createAppearanceStream" in r) || !("getCA" in r)) throw new Error("Couldn't assign Appearance to RadioButton. Appearance was Invalid!");
  for (var e in this.Kids) if (this.Kids.hasOwnProperty(e)) {
    var n = this.Kids[e];
    n.appearanceStreamContent = r.createAppearanceStream(n.optionName), n.caption = r.getCA();
  }
}, Bi.prototype.createOption = function(r) {
  var e = new yo();
  return e.Parent = this, e.optionName = r, this.Kids.push(e), Ih.call(this.scope, e), e;
};
var go = function() {
  We.call(this), this.fontName = "zapfdingbats", this.caption = "3", this.appearanceState = "On", this.value = "On", this.textAlign = "center", this.appearanceStreamContent = Bt.CheckBox.createAppearanceStream();
};
fn(go, We);
var Xr = function() {
  zn.call(this), this.FT = "/Tx", Object.defineProperty(this, "multiline", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 13);
  }, set: function(e) {
    e ? this.Ff = Oe(this.Ff, 13) : this.Ff = Ee(this.Ff, 13);
  } }), Object.defineProperty(this, "fileSelect", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 21);
  }, set: function(e) {
    e ? this.Ff = Oe(this.Ff, 21) : this.Ff = Ee(this.Ff, 21);
  } }), Object.defineProperty(this, "doNotSpellCheck", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 23);
  }, set: function(e) {
    e ? this.Ff = Oe(this.Ff, 23) : this.Ff = Ee(this.Ff, 23);
  } }), Object.defineProperty(this, "doNotScroll", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 24);
  }, set: function(e) {
    e ? this.Ff = Oe(this.Ff, 24) : this.Ff = Ee(this.Ff, 24);
  } }), Object.defineProperty(this, "comb", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 25);
  }, set: function(e) {
    e ? this.Ff = Oe(this.Ff, 25) : this.Ff = Ee(this.Ff, 25);
  } }), Object.defineProperty(this, "richText", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 26);
  }, set: function(e) {
    e ? this.Ff = Oe(this.Ff, 26) : this.Ff = Ee(this.Ff, 26);
  } });
  var r = null;
  Object.defineProperty(this, "MaxLen", { enumerable: !0, configurable: !1, get: function() {
    return r;
  }, set: function(e) {
    r = e;
  } }), Object.defineProperty(this, "maxLength", { enumerable: !0, configurable: !0, get: function() {
    return r;
  }, set: function(e) {
    Number.isInteger(e) && (r = e);
  } }), Object.defineProperty(this, "hasAppearanceStream", { enumerable: !0, configurable: !0, get: function() {
    return this.V || this.DV;
  } });
};
fn(Xr, zn);
var mo = function() {
  Xr.call(this), Object.defineProperty(this, "password", { enumerable: !0, configurable: !0, get: function() {
    return !!je(this.Ff, 14);
  }, set: function(r) {
    r ? this.Ff = Oe(this.Ff, 14) : this.Ff = Ee(this.Ff, 14);
  } }), this.password = !0;
};
fn(mo, Xr);
var Bt = { CheckBox: { createAppearanceStream: function() {
  return { N: { On: Bt.CheckBox.YesNormal }, D: { On: Bt.CheckBox.YesPushDown, Off: Bt.CheckBox.OffPushDown } };
}, YesPushDown: function(r) {
  var e = Qn(r);
  e.scope = r.scope;
  var n = [], i = r.scope.internal.getFont(r.fontName, r.fontStyle).id, s = r.scope.__private__.encodeColorString(r.color), o = Is(r, r.caption);
  return n.push("0.749023 g"), n.push("0 0 " + Xt(Bt.internal.getWidth(r)) + " " + Xt(Bt.internal.getHeight(r)) + " re"), n.push("f"), n.push("BMC"), n.push("q"), n.push("0 0 1 rg"), n.push("/" + i + " " + Xt(o.fontSize) + " Tf " + s), n.push("BT"), n.push(o.text), n.push("ET"), n.push("Q"), n.push("EMC"), e.stream = n.join(`
`), e;
}, YesNormal: function(r) {
  var e = Qn(r);
  e.scope = r.scope;
  var n = r.scope.internal.getFont(r.fontName, r.fontStyle).id, i = r.scope.__private__.encodeColorString(r.color), s = [], o = Bt.internal.getHeight(r), l = Bt.internal.getWidth(r), u = Is(r, r.caption);
  return s.push("1 g"), s.push("0 0 " + Xt(l) + " " + Xt(o) + " re"), s.push("f"), s.push("q"), s.push("0 0 1 rg"), s.push("0 0 " + Xt(l - 1) + " " + Xt(o - 1) + " re"), s.push("W"), s.push("n"), s.push("0 g"), s.push("BT"), s.push("/" + n + " " + Xt(u.fontSize) + " Tf " + i), s.push(u.text), s.push("ET"), s.push("Q"), e.stream = s.join(`
`), e;
}, OffPushDown: function(r) {
  var e = Qn(r);
  e.scope = r.scope;
  var n = [];
  return n.push("0.749023 g"), n.push("0 0 " + Xt(Bt.internal.getWidth(r)) + " " + Xt(Bt.internal.getHeight(r)) + " re"), n.push("f"), e.stream = n.join(`
`), e;
} }, RadioButton: { Circle: { createAppearanceStream: function(r) {
  var e = { D: { Off: Bt.RadioButton.Circle.OffPushDown }, N: {} };
  return e.N[r] = Bt.RadioButton.Circle.YesNormal, e.D[r] = Bt.RadioButton.Circle.YesPushDown, e;
}, getCA: function() {
  return "l";
}, YesNormal: function(r) {
  var e = Qn(r);
  e.scope = r.scope;
  var n = [], i = Bt.internal.getWidth(r) <= Bt.internal.getHeight(r) ? Bt.internal.getWidth(r) / 4 : Bt.internal.getHeight(r) / 4;
  i = Number((0.9 * i).toFixed(5));
  var s = Bt.internal.Bezier_C, o = Number((i * s).toFixed(5));
  return n.push("q"), n.push("1 0 0 1 " + Ir(Bt.internal.getWidth(r) / 2) + " " + Ir(Bt.internal.getHeight(r) / 2) + " cm"), n.push(i + " 0 m"), n.push(i + " " + o + " " + o + " " + i + " 0 " + i + " c"), n.push("-" + o + " " + i + " -" + i + " " + o + " -" + i + " 0 c"), n.push("-" + i + " -" + o + " -" + o + " -" + i + " 0 -" + i + " c"), n.push(o + " -" + i + " " + i + " -" + o + " " + i + " 0 c"), n.push("f"), n.push("Q"), e.stream = n.join(`
`), e;
}, YesPushDown: function(r) {
  var e = Qn(r);
  e.scope = r.scope;
  var n = [], i = Bt.internal.getWidth(r) <= Bt.internal.getHeight(r) ? Bt.internal.getWidth(r) / 4 : Bt.internal.getHeight(r) / 4;
  i = Number((0.9 * i).toFixed(5));
  var s = Number((2 * i).toFixed(5)), o = Number((s * Bt.internal.Bezier_C).toFixed(5)), l = Number((i * Bt.internal.Bezier_C).toFixed(5));
  return n.push("0.749023 g"), n.push("q"), n.push("1 0 0 1 " + Ir(Bt.internal.getWidth(r) / 2) + " " + Ir(Bt.internal.getHeight(r) / 2) + " cm"), n.push(s + " 0 m"), n.push(s + " " + o + " " + o + " " + s + " 0 " + s + " c"), n.push("-" + o + " " + s + " -" + s + " " + o + " -" + s + " 0 c"), n.push("-" + s + " -" + o + " -" + o + " -" + s + " 0 -" + s + " c"), n.push(o + " -" + s + " " + s + " -" + o + " " + s + " 0 c"), n.push("f"), n.push("Q"), n.push("0 g"), n.push("q"), n.push("1 0 0 1 " + Ir(Bt.internal.getWidth(r) / 2) + " " + Ir(Bt.internal.getHeight(r) / 2) + " cm"), n.push(i + " 0 m"), n.push(i + " " + l + " " + l + " " + i + " 0 " + i + " c"), n.push("-" + l + " " + i + " -" + i + " " + l + " -" + i + " 0 c"), n.push("-" + i + " -" + l + " -" + l + " -" + i + " 0 -" + i + " c"), n.push(l + " -" + i + " " + i + " -" + l + " " + i + " 0 c"), n.push("f"), n.push("Q"), e.stream = n.join(`
`), e;
}, OffPushDown: function(r) {
  var e = Qn(r);
  e.scope = r.scope;
  var n = [], i = Bt.internal.getWidth(r) <= Bt.internal.getHeight(r) ? Bt.internal.getWidth(r) / 4 : Bt.internal.getHeight(r) / 4;
  i = Number((0.9 * i).toFixed(5));
  var s = Number((2 * i).toFixed(5)), o = Number((s * Bt.internal.Bezier_C).toFixed(5));
  return n.push("0.749023 g"), n.push("q"), n.push("1 0 0 1 " + Ir(Bt.internal.getWidth(r) / 2) + " " + Ir(Bt.internal.getHeight(r) / 2) + " cm"), n.push(s + " 0 m"), n.push(s + " " + o + " " + o + " " + s + " 0 " + s + " c"), n.push("-" + o + " " + s + " -" + s + " " + o + " -" + s + " 0 c"), n.push("-" + s + " -" + o + " -" + o + " -" + s + " 0 -" + s + " c"), n.push(o + " -" + s + " " + s + " -" + o + " " + s + " 0 c"), n.push("f"), n.push("Q"), e.stream = n.join(`
`), e;
} }, Cross: { createAppearanceStream: function(r) {
  var e = { D: { Off: Bt.RadioButton.Cross.OffPushDown }, N: {} };
  return e.N[r] = Bt.RadioButton.Cross.YesNormal, e.D[r] = Bt.RadioButton.Cross.YesPushDown, e;
}, getCA: function() {
  return "8";
}, YesNormal: function(r) {
  var e = Qn(r);
  e.scope = r.scope;
  var n = [], i = Bt.internal.calculateCross(r);
  return n.push("q"), n.push("1 1 " + Xt(Bt.internal.getWidth(r) - 2) + " " + Xt(Bt.internal.getHeight(r) - 2) + " re"), n.push("W"), n.push("n"), n.push(Xt(i.x1.x) + " " + Xt(i.x1.y) + " m"), n.push(Xt(i.x2.x) + " " + Xt(i.x2.y) + " l"), n.push(Xt(i.x4.x) + " " + Xt(i.x4.y) + " m"), n.push(Xt(i.x3.x) + " " + Xt(i.x3.y) + " l"), n.push("s"), n.push("Q"), e.stream = n.join(`
`), e;
}, YesPushDown: function(r) {
  var e = Qn(r);
  e.scope = r.scope;
  var n = Bt.internal.calculateCross(r), i = [];
  return i.push("0.749023 g"), i.push("0 0 " + Xt(Bt.internal.getWidth(r)) + " " + Xt(Bt.internal.getHeight(r)) + " re"), i.push("f"), i.push("q"), i.push("1 1 " + Xt(Bt.internal.getWidth(r) - 2) + " " + Xt(Bt.internal.getHeight(r) - 2) + " re"), i.push("W"), i.push("n"), i.push(Xt(n.x1.x) + " " + Xt(n.x1.y) + " m"), i.push(Xt(n.x2.x) + " " + Xt(n.x2.y) + " l"), i.push(Xt(n.x4.x) + " " + Xt(n.x4.y) + " m"), i.push(Xt(n.x3.x) + " " + Xt(n.x3.y) + " l"), i.push("s"), i.push("Q"), e.stream = i.join(`
`), e;
}, OffPushDown: function(r) {
  var e = Qn(r);
  e.scope = r.scope;
  var n = [];
  return n.push("0.749023 g"), n.push("0 0 " + Xt(Bt.internal.getWidth(r)) + " " + Xt(Bt.internal.getHeight(r)) + " re"), n.push("f"), e.stream = n.join(`
`), e;
} } }, createDefaultAppearanceStream: function(r) {
  var e = r.scope.internal.getFont(r.fontName, r.fontStyle).id, n = r.scope.__private__.encodeColorString(r.color);
  return "/" + e + " " + r.fontSize + " Tf " + n;
} };
Bt.internal = { Bezier_C: 0.551915024494, calculateCross: function(r) {
  var e = Bt.internal.getWidth(r), n = Bt.internal.getHeight(r), i = Math.min(e, n);
  return { x1: { x: (e - i) / 2, y: (n - i) / 2 + i }, x2: { x: (e - i) / 2 + i, y: (n - i) / 2 }, x3: { x: (e - i) / 2, y: (n - i) / 2 }, x4: { x: (e - i) / 2 + i, y: (n - i) / 2 + i } };
} }, Bt.internal.getWidth = function(r) {
  var e = 0;
  return de(r) === "object" && (e = yc(r.Rect[2])), e;
}, Bt.internal.getHeight = function(r) {
  var e = 0;
  return de(r) === "object" && (e = yc(r.Rect[3])), e;
};
var Ih = ke.addField = function(r) {
  if (Ch(this, r), !(r instanceof zn)) throw new Error("Invalid argument passed to jsPDF.addField.");
  var e;
  return (e = r).scope.internal.acroformPlugin.printedOut && (e.scope.internal.acroformPlugin.printedOut = !1, e.scope.internal.acroformPlugin.acroFormDictionaryRoot = null), e.scope.internal.acroformPlugin.acroFormDictionaryRoot.Fields.push(e), r.page = r.scope.internal.getCurrentPageInfo().pageNumber, this;
};
ke.AcroFormChoiceField = ji, ke.AcroFormListBox = Oi, ke.AcroFormComboBox = Ei, ke.AcroFormEditBox = fo, ke.AcroFormButton = We, ke.AcroFormPushButton = po, ke.AcroFormRadioButton = Bi, ke.AcroFormCheckBox = go, ke.AcroFormTextField = Xr, ke.AcroFormPasswordField = mo, ke.AcroFormAppearance = Bt, ke.AcroForm = { ChoiceField: ji, ListBox: Oi, ComboBox: Ei, EditBox: fo, Button: We, PushButton: po, RadioButton: Bi, CheckBox: go, TextField: Xr, PasswordField: mo, Appearance: Bt }, Ut.AcroForm = { ChoiceField: ji, ListBox: Oi, ComboBox: Ei, EditBox: fo, Button: We, PushButton: po, RadioButton: Bi, CheckBox: go, TextField: Xr, PasswordField: mo, Appearance: Bt };
function Yc(r) {
  return r.reduce(function(e, n, i) {
    return e[n] = i, e;
  }, {});
}
(function(r) {
  r.__addimage__ = {};
  var e = "UNKNOWN", n = { PNG: [[137, 80, 78, 71]], TIFF: [[77, 77, 0, 42], [73, 73, 42, 0]], JPEG: [[255, 216, 255, 224, void 0, void 0, 74, 70, 73, 70, 0], [255, 216, 255, 225, void 0, void 0, 69, 120, 105, 102, 0, 0], [255, 216, 255, 219], [255, 216, 255, 238]], JPEG2000: [[0, 0, 0, 12, 106, 80, 32, 32]], GIF87a: [[71, 73, 70, 56, 55, 97]], GIF89a: [[71, 73, 70, 56, 57, 97]], WEBP: [[82, 73, 70, 70, void 0, void 0, void 0, void 0, 87, 69, 66, 80]], BMP: [[66, 77], [66, 65], [67, 73], [67, 80], [73, 67], [80, 84]] }, i = r.__addimage__.getImageFileTypeByImageData = function(P, C) {
    var W, q, st, it, ht, Z = e;
    if ((C = C || e) === "RGBA" || P.data !== void 0 && P.data instanceof Uint8ClampedArray && "height" in P && "width" in P) return "RGBA";
    if (wt(P)) for (ht in n) for (st = n[ht], W = 0; W < st.length; W += 1) {
      for (it = !0, q = 0; q < st[W].length; q += 1) if (st[W][q] !== void 0 && st[W][q] !== P[q]) {
        it = !1;
        break;
      }
      if (it === !0) {
        Z = ht;
        break;
      }
    }
    else for (ht in n) for (st = n[ht], W = 0; W < st.length; W += 1) {
      for (it = !0, q = 0; q < st[W].length; q += 1) if (st[W][q] !== void 0 && st[W][q] !== P.charCodeAt(q)) {
        it = !1;
        break;
      }
      if (it === !0) {
        Z = ht;
        break;
      }
    }
    return Z === e && C !== e && (Z = C), Z;
  }, s = function P(C) {
    for (var W = this.internal.write, q = this.internal.putStream, st = (0, this.internal.getFilters)(); st.indexOf("FlateEncode") !== -1; ) st.splice(st.indexOf("FlateEncode"), 1);
    C.objectId = this.internal.newObject();
    var it = [];
    if (it.push({ key: "Type", value: "/XObject" }), it.push({ key: "Subtype", value: "/Image" }), it.push({ key: "Width", value: C.width }), it.push({ key: "Height", value: C.height }), C.colorSpace === B.INDEXED ? it.push({ key: "ColorSpace", value: "[/Indexed /DeviceRGB " + (C.palette.length / 3 - 1) + " " + ("sMask" in C && C.sMask !== void 0 ? C.objectId + 2 : C.objectId + 1) + " 0 R]" }) : (it.push({ key: "ColorSpace", value: "/" + C.colorSpace }), C.colorSpace === B.DEVICE_CMYK && it.push({ key: "Decode", value: "[1 0 1 0 1 0 1 0]" })), it.push({ key: "BitsPerComponent", value: C.bitsPerComponent }), "decodeParameters" in C && C.decodeParameters !== void 0 && it.push({ key: "DecodeParms", value: "<<" + C.decodeParameters + ">>" }), "transparency" in C && Array.isArray(C.transparency)) {
      for (var ht = "", Z = 0, ut = C.transparency.length; Z < ut; Z++) ht += C.transparency[Z] + " " + C.transparency[Z] + " ";
      it.push({ key: "Mask", value: "[" + ht + "]" });
    }
    C.sMask !== void 0 && it.push({ key: "SMask", value: C.objectId + 1 + " 0 R" });
    var pt = C.filter !== void 0 ? ["/" + C.filter] : void 0;
    if (q({ data: C.data, additionalKeyValues: it, alreadyAppliedFilters: pt, objectId: C.objectId }), W("endobj"), "sMask" in C && C.sMask !== void 0) {
      var It = "/Predictor " + C.predictor + " /Colors 1 /BitsPerComponent " + C.bitsPerComponent + " /Columns " + C.width, L = { width: C.width, height: C.height, colorSpace: "DeviceGray", bitsPerComponent: C.bitsPerComponent, decodeParameters: It, data: C.sMask };
      "filter" in C && (L.filter = C.filter), P.call(this, L);
    }
    if (C.colorSpace === B.INDEXED) {
      var F = this.internal.newObject();
      q({ data: z(new Uint8Array(C.palette)), objectId: F }), W("endobj");
    }
  }, o = function() {
    var P = this.internal.collections.addImage_images;
    for (var C in P) s.call(this, P[C]);
  }, l = function() {
    var P, C = this.internal.collections.addImage_images, W = this.internal.write;
    for (var q in C) W("/I" + (P = C[q]).index, P.objectId, "0", "R");
  }, u = function() {
    this.internal.collections.addImage_images || (this.internal.collections.addImage_images = {}, this.internal.events.subscribe("putResources", o), this.internal.events.subscribe("putXobjectDict", l));
  }, f = function() {
    var P = this.internal.collections.addImage_images;
    return u.call(this), P;
  }, g = function() {
    return Object.keys(this.internal.collections.addImage_images).length;
  }, y = function(P) {
    return typeof r["process" + P.toUpperCase()] == "function";
  }, b = function(P) {
    return de(P) === "object" && P.nodeType === 1;
  }, N = function(P, C) {
    if (P.nodeName === "IMG" && P.hasAttribute("src")) {
      var W = "" + P.getAttribute("src");
      if (W.indexOf("data:image/") === 0) return ga(unescape(W).split("base64,").pop());
      var q = r.loadFile(W, !0);
      if (q !== void 0) return q;
    }
    if (P.nodeName === "CANVAS") {
      if (P.width === 0 || P.height === 0) throw new Error("Given canvas must have data. Canvas width: " + P.width + ", height: " + P.height);
      var st;
      switch (C) {
        case "PNG":
          st = "image/png";
          break;
        case "WEBP":
          st = "image/webp";
          break;
        case "JPEG":
        case "JPG":
        default:
          st = "image/jpeg";
      }
      return ga(P.toDataURL(st, 1).split("base64,").pop());
    }
  }, p = function(P) {
    var C = this.internal.collections.addImage_images;
    if (C) {
      for (var W in C) if (P === C[W].alias) return C[W];
    }
  }, O = function(P, C, W) {
    return P || C || (P = -96, C = -96), P < 0 && (P = -1 * W.width * 72 / P / this.internal.scaleFactor), C < 0 && (C = -1 * W.height * 72 / C / this.internal.scaleFactor), P === 0 && (P = C * W.width / W.height), C === 0 && (C = P * W.height / W.width), [P, C];
  }, k = function(P, C, W, q, st, it) {
    var ht = O.call(this, W, q, st), Z = this.internal.getCoordinateString, ut = this.internal.getVerticalCoordinateString, pt = f.call(this);
    if (W = ht[0], q = ht[1], pt[st.index] = st, it) {
      it *= Math.PI / 180;
      var It = Math.cos(it), L = Math.sin(it), F = function(T) {
        return T.toFixed(4);
      }, M = [F(It), F(L), F(-1 * L), F(It), 0, 0, "cm"];
    }
    this.internal.write("q"), it ? (this.internal.write([1, "0", "0", 1, Z(P), ut(C + q), "cm"].join(" ")), this.internal.write(M.join(" ")), this.internal.write([Z(W), "0", "0", Z(q), "0", "0", "cm"].join(" "))) : this.internal.write([Z(W), "0", "0", Z(q), Z(P), ut(C + q), "cm"].join(" ")), this.isAdvancedAPI() && this.internal.write([1, 0, 0, -1, 0, 0, "cm"].join(" ")), this.internal.write("/I" + st.index + " Do"), this.internal.write("Q");
  }, B = r.color_spaces = { DEVICE_RGB: "DeviceRGB", DEVICE_GRAY: "DeviceGray", DEVICE_CMYK: "DeviceCMYK", CAL_GREY: "CalGray", CAL_RGB: "CalRGB", LAB: "Lab", ICC_BASED: "ICCBased", INDEXED: "Indexed", PATTERN: "Pattern", SEPARATION: "Separation", DEVICE_N: "DeviceN" };
  r.decode = { DCT_DECODE: "DCTDecode", FLATE_DECODE: "FlateDecode", LZW_DECODE: "LZWDecode", JPX_DECODE: "JPXDecode", JBIG2_DECODE: "JBIG2Decode", ASCII85_DECODE: "ASCII85Decode", ASCII_HEX_DECODE: "ASCIIHexDecode", RUN_LENGTH_DECODE: "RunLengthDecode", CCITT_FAX_DECODE: "CCITTFaxDecode" };
  var _ = r.image_compression = { NONE: "NONE", FAST: "FAST", MEDIUM: "MEDIUM", SLOW: "SLOW" }, E = r.__addimage__.sHashCode = function(P) {
    var C, W, q = 0;
    if (typeof P == "string") for (W = P.length, C = 0; C < W; C++) q = (q << 5) - q + P.charCodeAt(C), q |= 0;
    else if (wt(P)) for (W = P.byteLength / 2, C = 0; C < W; C++) q = (q << 5) - q + P[C], q |= 0;
    return q;
  }, G = r.__addimage__.validateStringAsBase64 = function(P) {
    (P = P || "").toString().trim();
    var C = !0;
    return P.length === 0 && (C = !1), P.length % 4 != 0 && (C = !1), /^[A-Za-z0-9+/]+$/.test(P.substr(0, P.length - 2)) === !1 && (C = !1), /^[A-Za-z0-9/][A-Za-z0-9+/]|[A-Za-z0-9+/]=|==$/.test(P.substr(-2)) === !1 && (C = !1), C;
  }, at = r.__addimage__.extractImageFromDataUrl = function(P) {
    var C = (P = P || "").split("base64,"), W = null;
    if (C.length === 2) {
      var q = /^data:(\w*\/\w*);*(charset=(?!charset=)[\w=-]*)*;*$/.exec(C[0]);
      Array.isArray(q) && (W = { mimeType: q[1], charset: q[2], data: C[1] });
    }
    return W;
  }, lt = r.__addimage__.supportsArrayBuffer = function() {
    return typeof ArrayBuffer < "u" && typeof Uint8Array < "u";
  };
  r.__addimage__.isArrayBuffer = function(P) {
    return lt() && P instanceof ArrayBuffer;
  };
  var wt = r.__addimage__.isArrayBufferView = function(P) {
    return lt() && typeof Uint32Array < "u" && (P instanceof Int8Array || P instanceof Uint8Array || typeof Uint8ClampedArray < "u" && P instanceof Uint8ClampedArray || P instanceof Int16Array || P instanceof Uint16Array || P instanceof Int32Array || P instanceof Uint32Array || P instanceof Float32Array || P instanceof Float64Array);
  }, tt = r.__addimage__.binaryStringToUint8Array = function(P) {
    for (var C = P.length, W = new Uint8Array(C), q = 0; q < C; q++) W[q] = P.charCodeAt(q);
    return W;
  }, z = r.__addimage__.arrayBufferToBinaryString = function(P) {
    for (var C = "", W = wt(P) ? P : new Uint8Array(P), q = 0; q < W.length; q += 8192) C += String.fromCharCode.apply(null, W.subarray(q, q + 8192));
    return C;
  };
  r.addImage = function() {
    var P, C, W, q, st, it, ht, Z, ut;
    if (typeof arguments[1] == "number" ? (C = e, W = arguments[1], q = arguments[2], st = arguments[3], it = arguments[4], ht = arguments[5], Z = arguments[6], ut = arguments[7]) : (C = arguments[1], W = arguments[2], q = arguments[3], st = arguments[4], it = arguments[5], ht = arguments[6], Z = arguments[7], ut = arguments[8]), de(P = arguments[0]) === "object" && !b(P) && "imageData" in P) {
      var pt = P;
      P = pt.imageData, C = pt.format || C || e, W = pt.x || W || 0, q = pt.y || q || 0, st = pt.w || pt.width || st, it = pt.h || pt.height || it, ht = pt.alias || ht, Z = pt.compression || Z, ut = pt.rotation || pt.angle || ut;
    }
    var It = this.internal.getFilters();
    if (Z === void 0 && It.indexOf("FlateEncode") !== -1 && (Z = "SLOW"), isNaN(W) || isNaN(q)) throw new Error("Invalid coordinates passed to jsPDF.addImage");
    u.call(this);
    var L = rt.call(this, P, C, ht, Z);
    return k.call(this, W, q, st, it, L, ut), this;
  };
  var rt = function(P, C, W, q) {
    var st, it, ht;
    if (typeof P == "string" && i(P) === e) {
      P = unescape(P);
      var Z = dt(P, !1);
      (Z !== "" || (Z = r.loadFile(P, !0)) !== void 0) && (P = Z);
    }
    if (b(P) && (P = N(P, C)), C = i(P, C), !y(C)) throw new Error("addImage does not support files of type '" + C + "', please ensure that a plugin for '" + C + "' support is added.");
    if (((ht = W) == null || ht.length === 0) && (W = function(ut) {
      return typeof ut == "string" || wt(ut) ? E(ut) : wt(ut.data) ? E(ut.data) : null;
    }(P)), (st = p.call(this, W)) || (lt() && (P instanceof Uint8Array || C === "RGBA" || (it = P, P = tt(P))), st = this["process" + C.toUpperCase()](P, g.call(this), W, function(ut) {
      return ut && typeof ut == "string" && (ut = ut.toUpperCase()), ut in r.image_compression ? ut : _.NONE;
    }(q), it)), !st) throw new Error("An unknown error occurred whilst processing the image.");
    return st;
  }, dt = r.__addimage__.convertBase64ToBinaryString = function(P, C) {
    var W;
    C = typeof C != "boolean" || C;
    var q, st = "";
    if (typeof P == "string") {
      q = (W = at(P)) !== null ? W.data : P;
      try {
        st = ga(q);
      } catch (it) {
        if (C) throw G(q) ? new Error("atob-Error in jsPDF.convertBase64ToBinaryString " + it.message) : new Error("Supplied Data is not a valid base64-String jsPDF.convertBase64ToBinaryString ");
      }
    }
    return st;
  };
  r.getImageProperties = function(P) {
    var C, W, q = "";
    if (b(P) && (P = N(P)), typeof P == "string" && i(P) === e && ((q = dt(P, !1)) === "" && (q = r.loadFile(P) || ""), P = q), W = i(P), !y(W)) throw new Error("addImage does not support files of type '" + W + "', please ensure that a plugin for '" + W + "' support is added.");
    if (!lt() || P instanceof Uint8Array || (P = tt(P)), !(C = this["process" + W.toUpperCase()](P))) throw new Error("An unknown error occurred whilst processing the image");
    return C.fileType = W, C;
  };
})(Ut.API), /**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(r) {
  var e = function(n) {
    if (n !== void 0 && n != "") return !0;
  };
  Ut.API.events.push(["addPage", function(n) {
    this.internal.getPageInfo(n.pageNumber).pageContext.annotations = [];
  }]), r.events.push(["putPage", function(n) {
    for (var i, s, o, l = this.internal.getCoordinateString, u = this.internal.getVerticalCoordinateString, f = this.internal.getPageInfoByObjId(n.objId), g = n.pageContext.annotations, y = !1, b = 0; b < g.length && !y; b++) switch ((i = g[b]).type) {
      case "link":
        (e(i.options.url) || e(i.options.pageNumber)) && (y = !0);
        break;
      case "reference":
      case "text":
      case "freetext":
        y = !0;
    }
    if (y != 0) {
      this.internal.write("/Annots [");
      for (var N = 0; N < g.length; N++) {
        i = g[N];
        var p = this.internal.pdfEscape, O = this.internal.getEncryptor(n.objId);
        switch (i.type) {
          case "reference":
            this.internal.write(" " + i.object.objId + " 0 R ");
            break;
          case "text":
            var k = this.internal.newAdditionalObject(), B = this.internal.newAdditionalObject(), _ = this.internal.getEncryptor(k.objId), E = i.title || "Note";
            o = "<</Type /Annot /Subtype /Text " + (s = "/Rect [" + l(i.bounds.x) + " " + u(i.bounds.y + i.bounds.h) + " " + l(i.bounds.x + i.bounds.w) + " " + u(i.bounds.y) + "] ") + "/Contents (" + p(_(i.contents)) + ")", o += " /Popup " + B.objId + " 0 R", o += " /P " + f.objId + " 0 R", o += " /T (" + p(_(E)) + ") >>", k.content = o;
            var G = k.objId + " 0 R";
            o = "<</Type /Annot /Subtype /Popup " + (s = "/Rect [" + l(i.bounds.x + 30) + " " + u(i.bounds.y + i.bounds.h) + " " + l(i.bounds.x + i.bounds.w + 30) + " " + u(i.bounds.y) + "] ") + " /Parent " + G, i.open && (o += " /Open true"), o += " >>", B.content = o, this.internal.write(k.objId, "0 R", B.objId, "0 R");
            break;
          case "freetext":
            s = "/Rect [" + l(i.bounds.x) + " " + u(i.bounds.y) + " " + l(i.bounds.x + i.bounds.w) + " " + u(i.bounds.y + i.bounds.h) + "] ";
            var at = i.color || "#000000";
            o = "<</Type /Annot /Subtype /FreeText " + s + "/Contents (" + p(O(i.contents)) + ")", o += " /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#" + at + ")", o += " /Border [0 0 0]", o += " >>", this.internal.write(o);
            break;
          case "link":
            if (i.options.name) {
              var lt = this.annotations._nameMap[i.options.name];
              i.options.pageNumber = lt.page, i.options.top = lt.y;
            } else i.options.top || (i.options.top = 0);
            if (s = "/Rect [" + i.finalBounds.x + " " + i.finalBounds.y + " " + i.finalBounds.w + " " + i.finalBounds.h + "] ", o = "", i.options.url) o = "<</Type /Annot /Subtype /Link " + s + "/Border [0 0 0] /A <</S /URI /URI (" + p(O(i.options.url)) + ") >>";
            else if (i.options.pageNumber)
              switch (o = "<</Type /Annot /Subtype /Link " + s + "/Border [0 0 0] /Dest [" + this.internal.getPageInfo(i.options.pageNumber).objId + " 0 R", i.options.magFactor = i.options.magFactor || "XYZ", i.options.magFactor) {
                case "Fit":
                  o += " /Fit]";
                  break;
                case "FitH":
                  o += " /FitH " + i.options.top + "]";
                  break;
                case "FitV":
                  i.options.left = i.options.left || 0, o += " /FitV " + i.options.left + "]";
                  break;
                case "XYZ":
                default:
                  var wt = u(i.options.top);
                  i.options.left = i.options.left || 0, i.options.zoom === void 0 && (i.options.zoom = 0), o += " /XYZ " + i.options.left + " " + wt + " " + i.options.zoom + "]";
              }
            o != "" && (o += " >>", this.internal.write(o));
        }
      }
      this.internal.write("]");
    }
  }]), r.createAnnotation = function(n) {
    var i = this.internal.getCurrentPageInfo();
    switch (n.type) {
      case "link":
        this.link(n.bounds.x, n.bounds.y, n.bounds.w, n.bounds.h, n);
        break;
      case "text":
      case "freetext":
        i.pageContext.annotations.push(n);
    }
  }, r.link = function(n, i, s, o, l) {
    var u = this.internal.getCurrentPageInfo(), f = this.internal.getCoordinateString, g = this.internal.getVerticalCoordinateString;
    u.pageContext.annotations.push({ finalBounds: { x: f(n), y: g(i), w: f(n + s), h: g(i + o) }, options: l, type: "link" });
  }, r.textWithLink = function(n, i, s, o) {
    var l, u, f = this.getTextWidth(n), g = this.internal.getLineHeight() / this.internal.scaleFactor;
    if (o.maxWidth !== void 0) {
      u = o.maxWidth;
      var y = this.splitTextToSize(n, u).length;
      l = Math.ceil(g * y);
    } else u = f, l = g;
    return this.text(n, i, s, o), s += 0.2 * g, o.align === "center" && (i -= f / 2), o.align === "right" && (i -= f), this.link(i, s - g, u, l, o), f;
  }, r.getTextWidth = function(n) {
    var i = this.internal.getFontSize();
    return this.getStringUnitWidth(n) * i / this.internal.scaleFactor;
  };
}(Ut.API), /**
 * @license
 * Copyright (c) 2017 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(r) {
  var e = { 1569: [65152], 1570: [65153, 65154], 1571: [65155, 65156], 1572: [65157, 65158], 1573: [65159, 65160], 1574: [65161, 65162, 65163, 65164], 1575: [65165, 65166], 1576: [65167, 65168, 65169, 65170], 1577: [65171, 65172], 1578: [65173, 65174, 65175, 65176], 1579: [65177, 65178, 65179, 65180], 1580: [65181, 65182, 65183, 65184], 1581: [65185, 65186, 65187, 65188], 1582: [65189, 65190, 65191, 65192], 1583: [65193, 65194], 1584: [65195, 65196], 1585: [65197, 65198], 1586: [65199, 65200], 1587: [65201, 65202, 65203, 65204], 1588: [65205, 65206, 65207, 65208], 1589: [65209, 65210, 65211, 65212], 1590: [65213, 65214, 65215, 65216], 1591: [65217, 65218, 65219, 65220], 1592: [65221, 65222, 65223, 65224], 1593: [65225, 65226, 65227, 65228], 1594: [65229, 65230, 65231, 65232], 1601: [65233, 65234, 65235, 65236], 1602: [65237, 65238, 65239, 65240], 1603: [65241, 65242, 65243, 65244], 1604: [65245, 65246, 65247, 65248], 1605: [65249, 65250, 65251, 65252], 1606: [65253, 65254, 65255, 65256], 1607: [65257, 65258, 65259, 65260], 1608: [65261, 65262], 1609: [65263, 65264, 64488, 64489], 1610: [65265, 65266, 65267, 65268], 1649: [64336, 64337], 1655: [64477], 1657: [64358, 64359, 64360, 64361], 1658: [64350, 64351, 64352, 64353], 1659: [64338, 64339, 64340, 64341], 1662: [64342, 64343, 64344, 64345], 1663: [64354, 64355, 64356, 64357], 1664: [64346, 64347, 64348, 64349], 1667: [64374, 64375, 64376, 64377], 1668: [64370, 64371, 64372, 64373], 1670: [64378, 64379, 64380, 64381], 1671: [64382, 64383, 64384, 64385], 1672: [64392, 64393], 1676: [64388, 64389], 1677: [64386, 64387], 1678: [64390, 64391], 1681: [64396, 64397], 1688: [64394, 64395], 1700: [64362, 64363, 64364, 64365], 1702: [64366, 64367, 64368, 64369], 1705: [64398, 64399, 64400, 64401], 1709: [64467, 64468, 64469, 64470], 1711: [64402, 64403, 64404, 64405], 1713: [64410, 64411, 64412, 64413], 1715: [64406, 64407, 64408, 64409], 1722: [64414, 64415], 1723: [64416, 64417, 64418, 64419], 1726: [64426, 64427, 64428, 64429], 1728: [64420, 64421], 1729: [64422, 64423, 64424, 64425], 1733: [64480, 64481], 1734: [64473, 64474], 1735: [64471, 64472], 1736: [64475, 64476], 1737: [64482, 64483], 1739: [64478, 64479], 1740: [64508, 64509, 64510, 64511], 1744: [64484, 64485, 64486, 64487], 1746: [64430, 64431], 1747: [64432, 64433] }, n = { 65247: { 65154: 65269, 65156: 65271, 65160: 65273, 65166: 65275 }, 65248: { 65154: 65270, 65156: 65272, 65160: 65274, 65166: 65276 }, 65165: { 65247: { 65248: { 65258: 65010 } } }, 1617: { 1612: 64606, 1613: 64607, 1614: 64608, 1615: 64609, 1616: 64610 } }, i = { 1612: 64606, 1613: 64607, 1614: 64608, 1615: 64609, 1616: 64610 }, s = [1570, 1571, 1573, 1575];
  r.__arabicParser__ = {};
  var o = r.__arabicParser__.isInArabicSubstitutionA = function(k) {
    return e[k.charCodeAt(0)] !== void 0;
  }, l = r.__arabicParser__.isArabicLetter = function(k) {
    return typeof k == "string" && /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/.test(k);
  }, u = r.__arabicParser__.isArabicEndLetter = function(k) {
    return l(k) && o(k) && e[k.charCodeAt(0)].length <= 2;
  }, f = r.__arabicParser__.isArabicAlfLetter = function(k) {
    return l(k) && s.indexOf(k.charCodeAt(0)) >= 0;
  };
  r.__arabicParser__.arabicLetterHasIsolatedForm = function(k) {
    return l(k) && o(k) && e[k.charCodeAt(0)].length >= 1;
  };
  var g = r.__arabicParser__.arabicLetterHasFinalForm = function(k) {
    return l(k) && o(k) && e[k.charCodeAt(0)].length >= 2;
  };
  r.__arabicParser__.arabicLetterHasInitialForm = function(k) {
    return l(k) && o(k) && e[k.charCodeAt(0)].length >= 3;
  };
  var y = r.__arabicParser__.arabicLetterHasMedialForm = function(k) {
    return l(k) && o(k) && e[k.charCodeAt(0)].length == 4;
  }, b = r.__arabicParser__.resolveLigatures = function(k) {
    var B = 0, _ = n, E = "", G = 0;
    for (B = 0; B < k.length; B += 1) _[k.charCodeAt(B)] !== void 0 ? (G++, typeof (_ = _[k.charCodeAt(B)]) == "number" && (E += String.fromCharCode(_), _ = n, G = 0), B === k.length - 1 && (_ = n, E += k.charAt(B - (G - 1)), B -= G - 1, G = 0)) : (_ = n, E += k.charAt(B - G), B -= G, G = 0);
    return E;
  };
  r.__arabicParser__.isArabicDiacritic = function(k) {
    return k !== void 0 && i[k.charCodeAt(0)] !== void 0;
  };
  var N = r.__arabicParser__.getCorrectForm = function(k, B, _) {
    return l(k) ? o(k) === !1 ? -1 : !g(k) || !l(B) && !l(_) || !l(_) && u(B) || u(k) && !l(B) || u(k) && f(B) || u(k) && u(B) ? 0 : y(k) && l(B) && !u(B) && l(_) && g(_) ? 3 : u(k) || !l(_) ? 1 : 2 : -1;
  }, p = function(k) {
    var B = 0, _ = 0, E = 0, G = "", at = "", lt = "", wt = (k = k || "").split("\\s+"), tt = [];
    for (B = 0; B < wt.length; B += 1) {
      for (tt.push(""), _ = 0; _ < wt[B].length; _ += 1) G = wt[B][_], at = wt[B][_ - 1], lt = wt[B][_ + 1], l(G) ? (E = N(G, at, lt), tt[B] += E !== -1 ? String.fromCharCode(e[G.charCodeAt(0)][E]) : G) : tt[B] += G;
      tt[B] = b(tt[B]);
    }
    return tt.join(" ");
  }, O = r.__arabicParser__.processArabic = r.processArabic = function() {
    var k, B = typeof arguments[0] == "string" ? arguments[0] : arguments[0].text, _ = [];
    if (Array.isArray(B)) {
      var E = 0;
      for (_ = [], E = 0; E < B.length; E += 1) Array.isArray(B[E]) ? _.push([p(B[E][0]), B[E][1], B[E][2]]) : _.push([p(B[E])]);
      k = _;
    } else k = p(B);
    return typeof arguments[0] == "string" ? k : (arguments[0].text = k, arguments[0]);
  };
  r.events.push(["preProcessText", O]);
}(Ut.API), Ut.API.autoPrint = function(r) {
  var e;
  switch ((r = r || {}).variant = r.variant || "non-conform", r.variant) {
    case "javascript":
      this.addJS("print({});");
      break;
    case "non-conform":
    default:
      this.internal.events.subscribe("postPutResources", function() {
        e = this.internal.newObject(), this.internal.out("<<"), this.internal.out("/S /Named"), this.internal.out("/Type /Action"), this.internal.out("/N /Print"), this.internal.out(">>"), this.internal.out("endobj");
      }), this.internal.events.subscribe("putCatalog", function() {
        this.internal.out("/OpenAction " + e + " 0 R");
      });
  }
  return this;
}, /**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(r) {
  var e = function() {
    var n = void 0;
    Object.defineProperty(this, "pdf", { get: function() {
      return n;
    }, set: function(u) {
      n = u;
    } });
    var i = 150;
    Object.defineProperty(this, "width", { get: function() {
      return i;
    }, set: function(u) {
      i = isNaN(u) || Number.isInteger(u) === !1 || u < 0 ? 150 : u, this.getContext("2d").pageWrapXEnabled && (this.getContext("2d").pageWrapX = i + 1);
    } });
    var s = 300;
    Object.defineProperty(this, "height", { get: function() {
      return s;
    }, set: function(u) {
      s = isNaN(u) || Number.isInteger(u) === !1 || u < 0 ? 300 : u, this.getContext("2d").pageWrapYEnabled && (this.getContext("2d").pageWrapY = s + 1);
    } });
    var o = [];
    Object.defineProperty(this, "childNodes", { get: function() {
      return o;
    }, set: function(u) {
      o = u;
    } });
    var l = {};
    Object.defineProperty(this, "style", { get: function() {
      return l;
    }, set: function(u) {
      l = u;
    } }), Object.defineProperty(this, "parentNode", {});
  };
  e.prototype.getContext = function(n, i) {
    var s;
    if ((n = n || "2d") !== "2d") return null;
    for (s in i) this.pdf.context2d.hasOwnProperty(s) && (this.pdf.context2d[s] = i[s]);
    return this.pdf.context2d._canvas = this, this.pdf.context2d;
  }, e.prototype.toDataURL = function() {
    throw new Error("toDataURL is not implemented.");
  }, r.events.push(["initialized", function() {
    this.canvas = new e(), this.canvas.pdf = this;
  }]);
}(Ut.API), function(r) {
  var e = { left: 0, top: 0, bottom: 0, right: 0 }, n = !1, i = function() {
    this.internal.__cell__ === void 0 && (this.internal.__cell__ = {}, this.internal.__cell__.padding = 3, this.internal.__cell__.headerFunction = void 0, this.internal.__cell__.margins = Object.assign({}, e), this.internal.__cell__.margins.width = this.getPageWidth(), s.call(this));
  }, s = function() {
    this.internal.__cell__.lastCell = new o(), this.internal.__cell__.pages = 1;
  }, o = function() {
    var f = arguments[0];
    Object.defineProperty(this, "x", { enumerable: !0, get: function() {
      return f;
    }, set: function(k) {
      f = k;
    } });
    var g = arguments[1];
    Object.defineProperty(this, "y", { enumerable: !0, get: function() {
      return g;
    }, set: function(k) {
      g = k;
    } });
    var y = arguments[2];
    Object.defineProperty(this, "width", { enumerable: !0, get: function() {
      return y;
    }, set: function(k) {
      y = k;
    } });
    var b = arguments[3];
    Object.defineProperty(this, "height", { enumerable: !0, get: function() {
      return b;
    }, set: function(k) {
      b = k;
    } });
    var N = arguments[4];
    Object.defineProperty(this, "text", { enumerable: !0, get: function() {
      return N;
    }, set: function(k) {
      N = k;
    } });
    var p = arguments[5];
    Object.defineProperty(this, "lineNumber", { enumerable: !0, get: function() {
      return p;
    }, set: function(k) {
      p = k;
    } });
    var O = arguments[6];
    return Object.defineProperty(this, "align", { enumerable: !0, get: function() {
      return O;
    }, set: function(k) {
      O = k;
    } }), this;
  };
  o.prototype.clone = function() {
    return new o(this.x, this.y, this.width, this.height, this.text, this.lineNumber, this.align);
  }, o.prototype.toArray = function() {
    return [this.x, this.y, this.width, this.height, this.text, this.lineNumber, this.align];
  }, r.setHeaderFunction = function(f) {
    return i.call(this), this.internal.__cell__.headerFunction = typeof f == "function" ? f : void 0, this;
  }, r.getTextDimensions = function(f, g) {
    i.call(this);
    var y = (g = g || {}).fontSize || this.getFontSize(), b = g.font || this.getFont(), N = g.scaleFactor || this.internal.scaleFactor, p = 0, O = 0, k = 0, B = this;
    if (!Array.isArray(f) && typeof f != "string") {
      if (typeof f != "number") throw new Error("getTextDimensions expects text-parameter to be of type String or type Number or an Array of Strings.");
      f = String(f);
    }
    var _ = g.maxWidth;
    _ > 0 ? typeof f == "string" ? f = this.splitTextToSize(f, _) : Object.prototype.toString.call(f) === "[object Array]" && (f = f.reduce(function(G, at) {
      return G.concat(B.splitTextToSize(at, _));
    }, [])) : f = Array.isArray(f) ? f : [f];
    for (var E = 0; E < f.length; E++) p < (k = this.getStringUnitWidth(f[E], { font: b }) * y) && (p = k);
    return p !== 0 && (O = f.length), { w: p /= N, h: Math.max((O * y * this.getLineHeightFactor() - y * (this.getLineHeightFactor() - 1)) / N, 0) };
  }, r.cellAddPage = function() {
    i.call(this), this.addPage();
    var f = this.internal.__cell__.margins || e;
    return this.internal.__cell__.lastCell = new o(f.left, f.top, void 0, void 0), this.internal.__cell__.pages += 1, this;
  };
  var l = r.cell = function() {
    var f;
    f = arguments[0] instanceof o ? arguments[0] : new o(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]), i.call(this);
    var g = this.internal.__cell__.lastCell, y = this.internal.__cell__.padding, b = this.internal.__cell__.margins || e, N = this.internal.__cell__.tableHeaderRow, p = this.internal.__cell__.printHeaders;
    return g.lineNumber !== void 0 && (g.lineNumber === f.lineNumber ? (f.x = (g.x || 0) + (g.width || 0), f.y = g.y || 0) : g.y + g.height + f.height + b.bottom > this.getPageHeight() ? (this.cellAddPage(), f.y = b.top, p && N && (this.printHeaderRow(f.lineNumber, !0), f.y += N[0].height)) : f.y = g.y + g.height || f.y), f.text[0] !== void 0 && (this.rect(f.x, f.y, f.width, f.height, n === !0 ? "FD" : void 0), f.align === "right" ? this.text(f.text, f.x + f.width - y, f.y + y, { align: "right", baseline: "top" }) : f.align === "center" ? this.text(f.text, f.x + f.width / 2, f.y + y, { align: "center", baseline: "top", maxWidth: f.width - y - y }) : this.text(f.text, f.x + y, f.y + y, { align: "left", baseline: "top", maxWidth: f.width - y - y })), this.internal.__cell__.lastCell = f, this;
  };
  r.table = function(f, g, y, b, N) {
    if (i.call(this), !y) throw new Error("No data for PDF table.");
    var p, O, k, B, _ = [], E = [], G = [], at = {}, lt = {}, wt = [], tt = [], z = (N = N || {}).autoSize || !1, rt = N.printHeaders !== !1, dt = N.css && N.css["font-size"] !== void 0 ? 16 * N.css["font-size"] : N.fontSize || 12, P = N.margins || Object.assign({ width: this.getPageWidth() }, e), C = typeof N.padding == "number" ? N.padding : 3, W = N.headerBackgroundColor || "#c8c8c8", q = N.headerTextColor || "#000";
    if (s.call(this), this.internal.__cell__.printHeaders = rt, this.internal.__cell__.margins = P, this.internal.__cell__.table_font_size = dt, this.internal.__cell__.padding = C, this.internal.__cell__.headerBackgroundColor = W, this.internal.__cell__.headerTextColor = q, this.setFontSize(dt), b == null) E = _ = Object.keys(y[0]), G = _.map(function() {
      return "left";
    });
    else if (Array.isArray(b) && de(b[0]) === "object") for (_ = b.map(function(pt) {
      return pt.name;
    }), E = b.map(function(pt) {
      return pt.prompt || pt.name || "";
    }), G = b.map(function(pt) {
      return pt.align || "left";
    }), p = 0; p < b.length; p += 1) lt[b[p].name] = b[p].width * (19.049976 / 25.4);
    else Array.isArray(b) && typeof b[0] == "string" && (E = _ = b, G = _.map(function() {
      return "left";
    }));
    if (z || Array.isArray(b) && typeof b[0] == "string") for (p = 0; p < _.length; p += 1) {
      for (at[B = _[p]] = y.map(function(pt) {
        return pt[B];
      }), this.setFont(void 0, "bold"), wt.push(this.getTextDimensions(E[p], { fontSize: this.internal.__cell__.table_font_size, scaleFactor: this.internal.scaleFactor }).w), O = at[B], this.setFont(void 0, "normal"), k = 0; k < O.length; k += 1) wt.push(this.getTextDimensions(O[k], { fontSize: this.internal.__cell__.table_font_size, scaleFactor: this.internal.scaleFactor }).w);
      lt[B] = Math.max.apply(null, wt) + C + C, wt = [];
    }
    if (rt) {
      var st = {};
      for (p = 0; p < _.length; p += 1) st[_[p]] = {}, st[_[p]].text = E[p], st[_[p]].align = G[p];
      var it = u.call(this, st, lt);
      tt = _.map(function(pt) {
        return new o(f, g, lt[pt], it, st[pt].text, void 0, st[pt].align);
      }), this.setTableHeaderRow(tt), this.printHeaderRow(1, !1);
    }
    var ht = b.reduce(function(pt, It) {
      return pt[It.name] = It.align, pt;
    }, {});
    for (p = 0; p < y.length; p += 1) {
      "rowStart" in N && N.rowStart instanceof Function && N.rowStart({ row: p, data: y[p] }, this);
      var Z = u.call(this, y[p], lt);
      for (k = 0; k < _.length; k += 1) {
        var ut = y[p][_[k]];
        "cellStart" in N && N.cellStart instanceof Function && N.cellStart({ row: p, col: k, data: ut }, this), l.call(this, new o(f, g, lt[_[k]], Z, ut, p + 2, ht[_[k]]));
      }
    }
    return this.internal.__cell__.table_x = f, this.internal.__cell__.table_y = g, this;
  };
  var u = function(f, g) {
    var y = this.internal.__cell__.padding, b = this.internal.__cell__.table_font_size, N = this.internal.scaleFactor;
    return Object.keys(f).map(function(p) {
      var O = f[p];
      return this.splitTextToSize(O.hasOwnProperty("text") ? O.text : O, g[p] - y - y);
    }, this).map(function(p) {
      return this.getLineHeightFactor() * p.length * b / N + y + y;
    }, this).reduce(function(p, O) {
      return Math.max(p, O);
    }, 0);
  };
  r.setTableHeaderRow = function(f) {
    i.call(this), this.internal.__cell__.tableHeaderRow = f;
  }, r.printHeaderRow = function(f, g) {
    if (i.call(this), !this.internal.__cell__.tableHeaderRow) throw new Error("Property tableHeaderRow does not exist.");
    var y;
    if (n = !0, typeof this.internal.__cell__.headerFunction == "function") {
      var b = this.internal.__cell__.headerFunction(this, this.internal.__cell__.pages);
      this.internal.__cell__.lastCell = new o(b[0], b[1], b[2], b[3], void 0, -1);
    }
    this.setFont(void 0, "bold");
    for (var N = [], p = 0; p < this.internal.__cell__.tableHeaderRow.length; p += 1) {
      y = this.internal.__cell__.tableHeaderRow[p].clone(), g && (y.y = this.internal.__cell__.margins.top || 0, N.push(y)), y.lineNumber = f;
      var O = this.getTextColor();
      this.setTextColor(this.internal.__cell__.headerTextColor), this.setFillColor(this.internal.__cell__.headerBackgroundColor), l.call(this, y), this.setTextColor(O);
    }
    N.length > 0 && this.setTableHeaderRow(N), this.setFont(void 0, "normal"), n = !1;
  };
}(Ut.API);
var Xc = { italic: ["italic", "oblique", "normal"], oblique: ["oblique", "italic", "normal"], normal: ["normal", "oblique", "italic"] }, $c = ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded"], Fs = Yc($c), Kc = [100, 200, 300, 400, 500, 600, 700, 800, 900], Fh = Yc(Kc);
function js(r) {
  var e = r.family.replace(/"|'/g, "").toLowerCase(), n = function(o) {
    return Xc[o = o || "normal"] ? o : "normal";
  }(r.style), i = function(o) {
    if (!o) return 400;
    if (typeof o == "number") return o >= 100 && o <= 900 && o % 100 == 0 ? o : 400;
    if (/^\d00$/.test(o)) return parseInt(o);
    switch (o) {
      case "bold":
        return 700;
      case "normal":
      default:
        return 400;
    }
  }(r.weight), s = function(o) {
    return typeof Fs[o = o || "normal"] == "number" ? o : "normal";
  }(r.stretch);
  return { family: e, style: n, weight: i, stretch: s, src: r.src || [], ref: r.ref || { name: e, style: [s, n, i].join(" ") } };
}
function wc(r, e, n, i) {
  var s;
  for (s = n; s >= 0 && s < e.length; s += i) if (r[e[s]]) return r[e[s]];
  for (s = n; s >= 0 && s < e.length; s -= i) if (r[e[s]]) return r[e[s]];
}
var jh = { "sans-serif": "helvetica", fixed: "courier", monospace: "courier", terminal: "courier", cursive: "times", fantasy: "times", serif: "times" }, xc = { caption: "times", icon: "times", menu: "times", "message-box": "times", "small-caption": "times", "status-bar": "times" };
function Lc(r) {
  return [r.stretch, r.style, r.weight, r.family].join(" ");
}
function Oh(r, e, n) {
  for (var i = (n = n || {}).defaultFontFamily || "times", s = Object.assign({}, jh, n.genericFontFamilies || {}), o = null, l = null, u = 0; u < e.length; ++u) if (s[(o = js(e[u])).family] && (o.family = s[o.family]), r.hasOwnProperty(o.family)) {
    l = r[o.family];
    break;
  }
  if (!(l = l || r[i])) throw new Error("Could not find a font-family for the rule '" + Lc(o) + "' and default family '" + i + "'.");
  if (l = function(f, g) {
    if (g[f]) return g[f];
    var y = Fs[f], b = y <= Fs.normal ? -1 : 1, N = wc(g, $c, y, b);
    if (!N) throw new Error("Could not find a matching font-stretch value for " + f);
    return N;
  }(o.stretch, l), l = function(f, g) {
    if (g[f]) return g[f];
    for (var y = Xc[f], b = 0; b < y.length; ++b) if (g[y[b]]) return g[y[b]];
    throw new Error("Could not find a matching font-style for " + f);
  }(o.style, l), !(l = function(f, g) {
    if (g[f]) return g[f];
    if (f === 400 && g[500]) return g[500];
    if (f === 500 && g[400]) return g[400];
    var y = Fh[f], b = wc(g, Kc, y, f < 400 ? -1 : 1);
    if (!b) throw new Error("Could not find a matching font-weight for value " + f);
    return b;
  }(o.weight, l))) throw new Error("Failed to resolve a font for the rule '" + Lc(o) + "'.");
  return l;
}
function Ac(r) {
  return r.trimLeft();
}
function Eh(r, e) {
  for (var n = 0; n < r.length; ) {
    if (r.charAt(n) === e) return [r.substring(0, n), r.substring(n + 1)];
    n += 1;
  }
  return null;
}
function Bh(r) {
  var e = r.match(/^(-[a-z_]|[a-z_])[a-z0-9_-]*/i);
  return e === null ? null : [e[0], r.substring(e[0].length)];
}
var ho, Nc, Sc, ws = ["times"];
(function(r) {
  var e, n, i, s, o, l, u, f, g, y = function(L) {
    return L = L || {}, this.isStrokeTransparent = L.isStrokeTransparent || !1, this.strokeOpacity = L.strokeOpacity || 1, this.strokeStyle = L.strokeStyle || "#000000", this.fillStyle = L.fillStyle || "#000000", this.isFillTransparent = L.isFillTransparent || !1, this.fillOpacity = L.fillOpacity || 1, this.font = L.font || "10px sans-serif", this.textBaseline = L.textBaseline || "alphabetic", this.textAlign = L.textAlign || "left", this.lineWidth = L.lineWidth || 1, this.lineJoin = L.lineJoin || "miter", this.lineCap = L.lineCap || "butt", this.path = L.path || [], this.transform = L.transform !== void 0 ? L.transform.clone() : new f(), this.globalCompositeOperation = L.globalCompositeOperation || "normal", this.globalAlpha = L.globalAlpha || 1, this.clip_path = L.clip_path || [], this.currentPoint = L.currentPoint || new l(), this.miterLimit = L.miterLimit || 10, this.lastPoint = L.lastPoint || new l(), this.lineDashOffset = L.lineDashOffset || 0, this.lineDash = L.lineDash || [], this.margin = L.margin || [0, 0, 0, 0], this.prevPageLastElemOffset = L.prevPageLastElemOffset || 0, this.ignoreClearRect = typeof L.ignoreClearRect != "boolean" || L.ignoreClearRect, this;
  };
  r.events.push(["initialized", function() {
    this.context2d = new b(this), e = this.internal.f2, n = this.internal.getCoordinateString, i = this.internal.getVerticalCoordinateString, s = this.internal.getHorizontalCoordinate, o = this.internal.getVerticalCoordinate, l = this.internal.Point, u = this.internal.Rectangle, f = this.internal.Matrix, g = new y();
  }]);
  var b = function(L) {
    Object.defineProperty(this, "canvas", { get: function() {
      return { parentNode: !1, style: !1 };
    } });
    var F = L;
    Object.defineProperty(this, "pdf", { get: function() {
      return F;
    } });
    var M = !1;
    Object.defineProperty(this, "pageWrapXEnabled", { get: function() {
      return M;
    }, set: function(ft) {
      M = !!ft;
    } });
    var T = !1;
    Object.defineProperty(this, "pageWrapYEnabled", { get: function() {
      return T;
    }, set: function(ft) {
      T = !!ft;
    } });
    var Y = 0;
    Object.defineProperty(this, "posX", { get: function() {
      return Y;
    }, set: function(ft) {
      isNaN(ft) || (Y = ft);
    } });
    var Q = 0;
    Object.defineProperty(this, "posY", { get: function() {
      return Q;
    }, set: function(ft) {
      isNaN(ft) || (Q = ft);
    } }), Object.defineProperty(this, "margin", { get: function() {
      return g.margin;
    }, set: function(ft) {
      var D;
      typeof ft == "number" ? D = [ft, ft, ft, ft] : ((D = new Array(4))[0] = ft[0], D[1] = ft.length >= 2 ? ft[1] : D[0], D[2] = ft.length >= 3 ? ft[2] : D[0], D[3] = ft.length >= 4 ? ft[3] : D[1]), g.margin = D;
    } });
    var et = !1;
    Object.defineProperty(this, "autoPaging", { get: function() {
      return et;
    }, set: function(ft) {
      et = ft;
    } });
    var nt = 0;
    Object.defineProperty(this, "lastBreak", { get: function() {
      return nt;
    }, set: function(ft) {
      nt = ft;
    } });
    var At = [];
    Object.defineProperty(this, "pageBreaks", { get: function() {
      return At;
    }, set: function(ft) {
      At = ft;
    } }), Object.defineProperty(this, "ctx", { get: function() {
      return g;
    }, set: function(ft) {
      ft instanceof y && (g = ft);
    } }), Object.defineProperty(this, "path", { get: function() {
      return g.path;
    }, set: function(ft) {
      g.path = ft;
    } });
    var Lt = [];
    Object.defineProperty(this, "ctxStack", { get: function() {
      return Lt;
    }, set: function(ft) {
      Lt = ft;
    } }), Object.defineProperty(this, "fillStyle", { get: function() {
      return this.ctx.fillStyle;
    }, set: function(ft) {
      var D;
      D = N(ft), this.ctx.fillStyle = D.style, this.ctx.isFillTransparent = D.a === 0, this.ctx.fillOpacity = D.a, this.pdf.setFillColor(D.r, D.g, D.b, { a: D.a }), this.pdf.setTextColor(D.r, D.g, D.b, { a: D.a });
    } }), Object.defineProperty(this, "strokeStyle", { get: function() {
      return this.ctx.strokeStyle;
    }, set: function(ft) {
      var D = N(ft);
      this.ctx.strokeStyle = D.style, this.ctx.isStrokeTransparent = D.a === 0, this.ctx.strokeOpacity = D.a, D.a === 0 ? this.pdf.setDrawColor(255, 255, 255) : (D.a, this.pdf.setDrawColor(D.r, D.g, D.b));
    } }), Object.defineProperty(this, "lineCap", { get: function() {
      return this.ctx.lineCap;
    }, set: function(ft) {
      ["butt", "round", "square"].indexOf(ft) !== -1 && (this.ctx.lineCap = ft, this.pdf.setLineCap(ft));
    } }), Object.defineProperty(this, "lineWidth", { get: function() {
      return this.ctx.lineWidth;
    }, set: function(ft) {
      isNaN(ft) || (this.ctx.lineWidth = ft, this.pdf.setLineWidth(ft));
    } }), Object.defineProperty(this, "lineJoin", { get: function() {
      return this.ctx.lineJoin;
    }, set: function(ft) {
      ["bevel", "round", "miter"].indexOf(ft) !== -1 && (this.ctx.lineJoin = ft, this.pdf.setLineJoin(ft));
    } }), Object.defineProperty(this, "miterLimit", { get: function() {
      return this.ctx.miterLimit;
    }, set: function(ft) {
      isNaN(ft) || (this.ctx.miterLimit = ft, this.pdf.setMiterLimit(ft));
    } }), Object.defineProperty(this, "textBaseline", { get: function() {
      return this.ctx.textBaseline;
    }, set: function(ft) {
      this.ctx.textBaseline = ft;
    } }), Object.defineProperty(this, "textAlign", { get: function() {
      return this.ctx.textAlign;
    }, set: function(ft) {
      ["right", "end", "center", "left", "start"].indexOf(ft) !== -1 && (this.ctx.textAlign = ft);
    } });
    var Ct = null;
    function _t(ft, D) {
      if (Ct === null) {
        var $t = function(Mt) {
          var xt = [];
          return Object.keys(Mt).forEach(function(Nt) {
            Mt[Nt].forEach(function(Ft) {
              var kt = null;
              switch (Ft) {
                case "bold":
                  kt = { family: Nt, weight: "bold" };
                  break;
                case "italic":
                  kt = { family: Nt, style: "italic" };
                  break;
                case "bolditalic":
                  kt = { family: Nt, weight: "bold", style: "italic" };
                  break;
                case "":
                case "normal":
                  kt = { family: Nt };
              }
              kt !== null && (kt.ref = { name: Nt, style: Ft }, xt.push(kt));
            });
          }), xt;
        }(ft.getFontList());
        Ct = function(Mt) {
          for (var xt = {}, Nt = 0; Nt < Mt.length; ++Nt) {
            var Ft = js(Mt[Nt]), kt = Ft.family, Dt = Ft.stretch, Gt = Ft.style, Qt = Ft.weight;
            xt[kt] = xt[kt] || {}, xt[kt][Dt] = xt[kt][Dt] || {}, xt[kt][Dt][Gt] = xt[kt][Dt][Gt] || {}, xt[kt][Dt][Gt][Qt] = Ft;
          }
          return xt;
        }($t.concat(D));
      }
      return Ct;
    }
    var zt = null;
    Object.defineProperty(this, "fontFaces", { get: function() {
      return zt;
    }, set: function(ft) {
      Ct = null, zt = ft;
    } }), Object.defineProperty(this, "font", { get: function() {
      return this.ctx.font;
    }, set: function(ft) {
      var D;
      if (this.ctx.font = ft, (D = /^\s*(?=(?:(?:[-a-z]+\s*){0,2}(italic|oblique))?)(?=(?:(?:[-a-z]+\s*){0,2}(small-caps))?)(?=(?:(?:[-a-z]+\s*){0,2}(bold(?:er)?|lighter|[1-9]00))?)(?:(?:normal|\1|\2|\3)\s*){0,3}((?:xx?-)?(?:small|large)|medium|smaller|larger|[.\d]+(?:\%|in|[cem]m|ex|p[ctx]))(?:\s*\/\s*(normal|[.\d]+(?:\%|in|[cem]m|ex|p[ctx])))?\s*([-_,\"\'\sa-z]+?)\s*$/i.exec(ft)) !== null) {
        var $t = D[1], Mt = (D[2], D[3]), xt = D[4], Nt = (D[5], D[6]), Ft = /^([.\d]+)((?:%|in|[cem]m|ex|p[ctx]))$/i.exec(xt)[2];
        xt = Math.floor(Ft === "px" ? parseFloat(xt) * this.pdf.internal.scaleFactor : Ft === "em" ? parseFloat(xt) * this.pdf.getFontSize() : parseFloat(xt) * this.pdf.internal.scaleFactor), this.pdf.setFontSize(xt);
        var kt = function(Wt) {
          var ee, jt, Ye = [], se = Wt.trim();
          if (se === "") return ws;
          if (se in xc) return [xc[se]];
          for (; se !== ""; ) {
            switch (jt = null, ee = (se = Ac(se)).charAt(0)) {
              case '"':
              case "'":
                jt = Eh(se.substring(1), ee);
                break;
              default:
                jt = Bh(se);
            }
            if (jt === null || (Ye.push(jt[0]), (se = Ac(jt[1])) !== "" && se.charAt(0) !== ",")) return ws;
            se = se.replace(/^,/, "");
          }
          return Ye;
        }(Nt);
        if (this.fontFaces) {
          var Dt = Oh(_t(this.pdf, this.fontFaces), kt.map(function(Wt) {
            return { family: Wt, stretch: "normal", weight: Mt, style: $t };
          }));
          this.pdf.setFont(Dt.ref.name, Dt.ref.style);
        } else {
          var Gt = "";
          (Mt === "bold" || parseInt(Mt, 10) >= 700 || $t === "bold") && (Gt = "bold"), $t === "italic" && (Gt += "italic"), Gt.length === 0 && (Gt = "normal");
          for (var Qt = "", te = { arial: "Helvetica", Arial: "Helvetica", verdana: "Helvetica", Verdana: "Helvetica", helvetica: "Helvetica", Helvetica: "Helvetica", "sans-serif": "Helvetica", fixed: "Courier", monospace: "Courier", terminal: "Courier", cursive: "Times", fantasy: "Times", serif: "Times" }, ae = 0; ae < kt.length; ae++) {
            if (this.pdf.internal.getFont(kt[ae], Gt, { noFallback: !0, disableWarning: !0 }) !== void 0) {
              Qt = kt[ae];
              break;
            }
            if (Gt === "bolditalic" && this.pdf.internal.getFont(kt[ae], "bold", { noFallback: !0, disableWarning: !0 }) !== void 0) Qt = kt[ae], Gt = "bold";
            else if (this.pdf.internal.getFont(kt[ae], "normal", { noFallback: !0, disableWarning: !0 }) !== void 0) {
              Qt = kt[ae], Gt = "normal";
              break;
            }
          }
          if (Qt === "") {
            for (var pe = 0; pe < kt.length; pe++) if (te[kt[pe]]) {
              Qt = te[kt[pe]];
              break;
            }
          }
          Qt = Qt === "" ? "Times" : Qt, this.pdf.setFont(Qt, Gt);
        }
      }
    } }), Object.defineProperty(this, "globalCompositeOperation", { get: function() {
      return this.ctx.globalCompositeOperation;
    }, set: function(ft) {
      this.ctx.globalCompositeOperation = ft;
    } }), Object.defineProperty(this, "globalAlpha", { get: function() {
      return this.ctx.globalAlpha;
    }, set: function(ft) {
      this.ctx.globalAlpha = ft;
    } }), Object.defineProperty(this, "lineDashOffset", { get: function() {
      return this.ctx.lineDashOffset;
    }, set: function(ft) {
      this.ctx.lineDashOffset = ft, It.call(this);
    } }), Object.defineProperty(this, "lineDash", { get: function() {
      return this.ctx.lineDash;
    }, set: function(ft) {
      this.ctx.lineDash = ft, It.call(this);
    } }), Object.defineProperty(this, "ignoreClearRect", { get: function() {
      return this.ctx.ignoreClearRect;
    }, set: function(ft) {
      this.ctx.ignoreClearRect = !!ft;
    } });
  };
  b.prototype.setLineDash = function(L) {
    this.lineDash = L;
  }, b.prototype.getLineDash = function() {
    return this.lineDash.length % 2 ? this.lineDash.concat(this.lineDash) : this.lineDash.slice();
  }, b.prototype.fill = function() {
    at.call(this, "fill", !1);
  }, b.prototype.stroke = function() {
    at.call(this, "stroke", !1);
  }, b.prototype.beginPath = function() {
    this.path = [{ type: "begin" }];
  }, b.prototype.moveTo = function(L, F) {
    if (isNaN(L) || isNaN(F)) throw be.error("jsPDF.context2d.moveTo: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.moveTo");
    var M = this.ctx.transform.applyToPoint(new l(L, F));
    this.path.push({ type: "mt", x: M.x, y: M.y }), this.ctx.lastPoint = new l(L, F);
  }, b.prototype.closePath = function() {
    var L = new l(0, 0), F = 0;
    for (F = this.path.length - 1; F !== -1; F--) if (this.path[F].type === "begin" && de(this.path[F + 1]) === "object" && typeof this.path[F + 1].x == "number") {
      L = new l(this.path[F + 1].x, this.path[F + 1].y);
      break;
    }
    this.path.push({ type: "close" }), this.ctx.lastPoint = new l(L.x, L.y);
  }, b.prototype.lineTo = function(L, F) {
    if (isNaN(L) || isNaN(F)) throw be.error("jsPDF.context2d.lineTo: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.lineTo");
    var M = this.ctx.transform.applyToPoint(new l(L, F));
    this.path.push({ type: "lt", x: M.x, y: M.y }), this.ctx.lastPoint = new l(M.x, M.y);
  }, b.prototype.clip = function() {
    this.ctx.clip_path = JSON.parse(JSON.stringify(this.path)), at.call(this, null, !0);
  }, b.prototype.quadraticCurveTo = function(L, F, M, T) {
    if (isNaN(M) || isNaN(T) || isNaN(L) || isNaN(F)) throw be.error("jsPDF.context2d.quadraticCurveTo: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.quadraticCurveTo");
    var Y = this.ctx.transform.applyToPoint(new l(M, T)), Q = this.ctx.transform.applyToPoint(new l(L, F));
    this.path.push({ type: "qct", x1: Q.x, y1: Q.y, x: Y.x, y: Y.y }), this.ctx.lastPoint = new l(Y.x, Y.y);
  }, b.prototype.bezierCurveTo = function(L, F, M, T, Y, Q) {
    if (isNaN(Y) || isNaN(Q) || isNaN(L) || isNaN(F) || isNaN(M) || isNaN(T)) throw be.error("jsPDF.context2d.bezierCurveTo: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.bezierCurveTo");
    var et = this.ctx.transform.applyToPoint(new l(Y, Q)), nt = this.ctx.transform.applyToPoint(new l(L, F)), At = this.ctx.transform.applyToPoint(new l(M, T));
    this.path.push({ type: "bct", x1: nt.x, y1: nt.y, x2: At.x, y2: At.y, x: et.x, y: et.y }), this.ctx.lastPoint = new l(et.x, et.y);
  }, b.prototype.arc = function(L, F, M, T, Y, Q) {
    if (isNaN(L) || isNaN(F) || isNaN(M) || isNaN(T) || isNaN(Y)) throw be.error("jsPDF.context2d.arc: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.arc");
    if (Q = !!Q, !this.ctx.transform.isIdentity) {
      var et = this.ctx.transform.applyToPoint(new l(L, F));
      L = et.x, F = et.y;
      var nt = this.ctx.transform.applyToPoint(new l(0, M)), At = this.ctx.transform.applyToPoint(new l(0, 0));
      M = Math.sqrt(Math.pow(nt.x - At.x, 2) + Math.pow(nt.y - At.y, 2));
    }
    Math.abs(Y - T) >= 2 * Math.PI && (T = 0, Y = 2 * Math.PI), this.path.push({ type: "arc", x: L, y: F, radius: M, startAngle: T, endAngle: Y, counterclockwise: Q });
  }, b.prototype.arcTo = function(L, F, M, T, Y) {
    throw new Error("arcTo not implemented.");
  }, b.prototype.rect = function(L, F, M, T) {
    if (isNaN(L) || isNaN(F) || isNaN(M) || isNaN(T)) throw be.error("jsPDF.context2d.rect: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.rect");
    this.moveTo(L, F), this.lineTo(L + M, F), this.lineTo(L + M, F + T), this.lineTo(L, F + T), this.lineTo(L, F), this.lineTo(L + M, F), this.lineTo(L, F);
  }, b.prototype.fillRect = function(L, F, M, T) {
    if (isNaN(L) || isNaN(F) || isNaN(M) || isNaN(T)) throw be.error("jsPDF.context2d.fillRect: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.fillRect");
    if (!p.call(this)) {
      var Y = {};
      this.lineCap !== "butt" && (Y.lineCap = this.lineCap, this.lineCap = "butt"), this.lineJoin !== "miter" && (Y.lineJoin = this.lineJoin, this.lineJoin = "miter"), this.beginPath(), this.rect(L, F, M, T), this.fill(), Y.hasOwnProperty("lineCap") && (this.lineCap = Y.lineCap), Y.hasOwnProperty("lineJoin") && (this.lineJoin = Y.lineJoin);
    }
  }, b.prototype.strokeRect = function(L, F, M, T) {
    if (isNaN(L) || isNaN(F) || isNaN(M) || isNaN(T)) throw be.error("jsPDF.context2d.strokeRect: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.strokeRect");
    O.call(this) || (this.beginPath(), this.rect(L, F, M, T), this.stroke());
  }, b.prototype.clearRect = function(L, F, M, T) {
    if (isNaN(L) || isNaN(F) || isNaN(M) || isNaN(T)) throw be.error("jsPDF.context2d.clearRect: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.clearRect");
    this.ignoreClearRect || (this.fillStyle = "#ffffff", this.fillRect(L, F, M, T));
  }, b.prototype.save = function(L) {
    L = typeof L != "boolean" || L;
    for (var F = this.pdf.internal.getCurrentPageInfo().pageNumber, M = 0; M < this.pdf.internal.getNumberOfPages(); M++) this.pdf.setPage(M + 1), this.pdf.internal.out("q");
    if (this.pdf.setPage(F), L) {
      this.ctx.fontSize = this.pdf.internal.getFontSize();
      var T = new y(this.ctx);
      this.ctxStack.push(this.ctx), this.ctx = T;
    }
  }, b.prototype.restore = function(L) {
    L = typeof L != "boolean" || L;
    for (var F = this.pdf.internal.getCurrentPageInfo().pageNumber, M = 0; M < this.pdf.internal.getNumberOfPages(); M++) this.pdf.setPage(M + 1), this.pdf.internal.out("Q");
    this.pdf.setPage(F), L && this.ctxStack.length !== 0 && (this.ctx = this.ctxStack.pop(), this.fillStyle = this.ctx.fillStyle, this.strokeStyle = this.ctx.strokeStyle, this.font = this.ctx.font, this.lineCap = this.ctx.lineCap, this.lineWidth = this.ctx.lineWidth, this.lineJoin = this.ctx.lineJoin, this.lineDash = this.ctx.lineDash, this.lineDashOffset = this.ctx.lineDashOffset);
  }, b.prototype.toDataURL = function() {
    throw new Error("toDataUrl not implemented.");
  };
  var N = function(L) {
    var F, M, T, Y;
    if (L.isCanvasGradient === !0 && (L = L.getColor()), !L) return { r: 0, g: 0, b: 0, a: 0, style: L };
    if (/transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/.test(L)) F = 0, M = 0, T = 0, Y = 0;
    else {
      var Q = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(L);
      if (Q !== null) F = parseInt(Q[1]), M = parseInt(Q[2]), T = parseInt(Q[3]), Y = 1;
      else if ((Q = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/.exec(L)) !== null) F = parseInt(Q[1]), M = parseInt(Q[2]), T = parseInt(Q[3]), Y = parseFloat(Q[4]);
      else {
        if (Y = 1, typeof L == "string" && L.charAt(0) !== "#") {
          var et = new Uc(L);
          L = et.ok ? et.toHex() : "#000000";
        }
        L.length === 4 ? (F = L.substring(1, 2), F += F, M = L.substring(2, 3), M += M, T = L.substring(3, 4), T += T) : (F = L.substring(1, 3), M = L.substring(3, 5), T = L.substring(5, 7)), F = parseInt(F, 16), M = parseInt(M, 16), T = parseInt(T, 16);
      }
    }
    return { r: F, g: M, b: T, a: Y, style: L };
  }, p = function() {
    return this.ctx.isFillTransparent || this.globalAlpha == 0;
  }, O = function() {
    return !!(this.ctx.isStrokeTransparent || this.globalAlpha == 0);
  };
  b.prototype.fillText = function(L, F, M, T) {
    if (isNaN(F) || isNaN(M) || typeof L != "string") throw be.error("jsPDF.context2d.fillText: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.fillText");
    if (T = isNaN(T) ? void 0 : T, !p.call(this)) {
      var Y = Z(this.ctx.transform.rotation), Q = this.ctx.transform.scaleX;
      C.call(this, { text: L, x: F, y: M, scale: Q, angle: Y, align: this.textAlign, maxWidth: T });
    }
  }, b.prototype.strokeText = function(L, F, M, T) {
    if (isNaN(F) || isNaN(M) || typeof L != "string") throw be.error("jsPDF.context2d.strokeText: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.strokeText");
    if (!O.call(this)) {
      T = isNaN(T) ? void 0 : T;
      var Y = Z(this.ctx.transform.rotation), Q = this.ctx.transform.scaleX;
      C.call(this, { text: L, x: F, y: M, scale: Q, renderingMode: "stroke", angle: Y, align: this.textAlign, maxWidth: T });
    }
  }, b.prototype.measureText = function(L) {
    if (typeof L != "string") throw be.error("jsPDF.context2d.measureText: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.measureText");
    var F = this.pdf, M = this.pdf.internal.scaleFactor, T = F.internal.getFontSize(), Y = F.getStringUnitWidth(L) * T / F.internal.scaleFactor, Q = function(et) {
      var nt = (et = et || {}).width || 0;
      return Object.defineProperty(this, "width", { get: function() {
        return nt;
      } }), this;
    };
    return new Q({ width: Y *= Math.round(96 * M / 72 * 1e4) / 1e4 });
  }, b.prototype.scale = function(L, F) {
    if (isNaN(L) || isNaN(F)) throw be.error("jsPDF.context2d.scale: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.scale");
    var M = new f(L, 0, 0, F, 0, 0);
    this.ctx.transform = this.ctx.transform.multiply(M);
  }, b.prototype.rotate = function(L) {
    if (isNaN(L)) throw be.error("jsPDF.context2d.rotate: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.rotate");
    var F = new f(Math.cos(L), Math.sin(L), -Math.sin(L), Math.cos(L), 0, 0);
    this.ctx.transform = this.ctx.transform.multiply(F);
  }, b.prototype.translate = function(L, F) {
    if (isNaN(L) || isNaN(F)) throw be.error("jsPDF.context2d.translate: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.translate");
    var M = new f(1, 0, 0, 1, L, F);
    this.ctx.transform = this.ctx.transform.multiply(M);
  }, b.prototype.transform = function(L, F, M, T, Y, Q) {
    if (isNaN(L) || isNaN(F) || isNaN(M) || isNaN(T) || isNaN(Y) || isNaN(Q)) throw be.error("jsPDF.context2d.transform: Invalid arguments", arguments), new Error("Invalid arguments passed to jsPDF.context2d.transform");
    var et = new f(L, F, M, T, Y, Q);
    this.ctx.transform = this.ctx.transform.multiply(et);
  }, b.prototype.setTransform = function(L, F, M, T, Y, Q) {
    L = isNaN(L) ? 1 : L, F = isNaN(F) ? 0 : F, M = isNaN(M) ? 0 : M, T = isNaN(T) ? 1 : T, Y = isNaN(Y) ? 0 : Y, Q = isNaN(Q) ? 0 : Q, this.ctx.transform = new f(L, F, M, T, Y, Q);
  };
  var k = function() {
    return this.margin[0] > 0 || this.margin[1] > 0 || this.margin[2] > 0 || this.margin[3] > 0;
  };
  b.prototype.drawImage = function(L, F, M, T, Y, Q, et, nt, At) {
    var Lt = this.pdf.getImageProperties(L), Ct = 1, _t = 1, zt = 1, ft = 1;
    T !== void 0 && nt !== void 0 && (zt = nt / T, ft = At / Y, Ct = Lt.width / T * nt / T, _t = Lt.height / Y * At / Y), Q === void 0 && (Q = F, et = M, F = 0, M = 0), T !== void 0 && nt === void 0 && (nt = T, At = Y), T === void 0 && nt === void 0 && (nt = Lt.width, At = Lt.height);
    for (var D, $t = this.ctx.transform.decompose(), Mt = Z($t.rotate.shx), xt = new f(), Nt = (xt = (xt = (xt = xt.multiply($t.translate)).multiply($t.skew)).multiply($t.scale)).applyToRectangle(new u(Q - F * zt, et - M * ft, T * Ct, Y * _t)), Ft = B.call(this, Nt), kt = [], Dt = 0; Dt < Ft.length; Dt += 1) kt.indexOf(Ft[Dt]) === -1 && kt.push(Ft[Dt]);
    if (G(kt), this.autoPaging) for (var Gt = kt[0], Qt = kt[kt.length - 1], te = Gt; te < Qt + 1; te++) {
      this.pdf.setPage(te);
      var ae = this.pdf.internal.pageSize.width - this.margin[3] - this.margin[1], pe = te === 1 ? this.posY + this.margin[0] : this.margin[0], Wt = this.pdf.internal.pageSize.height - this.posY - this.margin[0] - this.margin[2], ee = this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2], jt = te === 1 ? 0 : Wt + (te - 2) * ee;
      if (this.ctx.clip_path.length !== 0) {
        var Ye = this.path;
        D = JSON.parse(JSON.stringify(this.ctx.clip_path)), this.path = E(D, this.posX + this.margin[3], -jt + pe + this.ctx.prevPageLastElemOffset), lt.call(this, "fill", !0), this.path = Ye;
      }
      var se = JSON.parse(JSON.stringify(Nt));
      se = E([se], this.posX + this.margin[3], -jt + pe + this.ctx.prevPageLastElemOffset)[0];
      var Pn = (te > Gt || te < Qt) && k.call(this);
      Pn && (this.pdf.saveGraphicsState(), this.pdf.rect(this.margin[3], this.margin[0], ae, ee, null).clip().discardPath()), this.pdf.addImage(L, "JPEG", se.x, se.y, se.w, se.h, null, null, Mt), Pn && this.pdf.restoreGraphicsState();
    }
    else this.pdf.addImage(L, "JPEG", Nt.x, Nt.y, Nt.w, Nt.h, null, null, Mt);
  };
  var B = function(L, F, M) {
    var T = [];
    F = F || this.pdf.internal.pageSize.width, M = M || this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2];
    var Y = this.posY + this.ctx.prevPageLastElemOffset;
    switch (L.type) {
      default:
      case "mt":
      case "lt":
        T.push(Math.floor((L.y + Y) / M) + 1);
        break;
      case "arc":
        T.push(Math.floor((L.y + Y - L.radius) / M) + 1), T.push(Math.floor((L.y + Y + L.radius) / M) + 1);
        break;
      case "qct":
        var Q = ut(this.ctx.lastPoint.x, this.ctx.lastPoint.y, L.x1, L.y1, L.x, L.y);
        T.push(Math.floor((Q.y + Y) / M) + 1), T.push(Math.floor((Q.y + Q.h + Y) / M) + 1);
        break;
      case "bct":
        var et = pt(this.ctx.lastPoint.x, this.ctx.lastPoint.y, L.x1, L.y1, L.x2, L.y2, L.x, L.y);
        T.push(Math.floor((et.y + Y) / M) + 1), T.push(Math.floor((et.y + et.h + Y) / M) + 1);
        break;
      case "rect":
        T.push(Math.floor((L.y + Y) / M) + 1), T.push(Math.floor((L.y + L.h + Y) / M) + 1);
    }
    for (var nt = 0; nt < T.length; nt += 1) for (; this.pdf.internal.getNumberOfPages() < T[nt]; ) _.call(this);
    return T;
  }, _ = function() {
    var L = this.fillStyle, F = this.strokeStyle, M = this.font, T = this.lineCap, Y = this.lineWidth, Q = this.lineJoin;
    this.pdf.addPage(), this.fillStyle = L, this.strokeStyle = F, this.font = M, this.lineCap = T, this.lineWidth = Y, this.lineJoin = Q;
  }, E = function(L, F, M) {
    for (var T = 0; T < L.length; T++) switch (L[T].type) {
      case "bct":
        L[T].x2 += F, L[T].y2 += M;
      case "qct":
        L[T].x1 += F, L[T].y1 += M;
      case "mt":
      case "lt":
      case "arc":
      default:
        L[T].x += F, L[T].y += M;
    }
    return L;
  }, G = function(L) {
    return L.sort(function(F, M) {
      return F - M;
    });
  }, at = function(L, F) {
    for (var M, T, Y = this.fillStyle, Q = this.strokeStyle, et = this.lineCap, nt = this.lineWidth, At = Math.abs(nt * this.ctx.transform.scaleX), Lt = this.lineJoin, Ct = JSON.parse(JSON.stringify(this.path)), _t = JSON.parse(JSON.stringify(this.path)), zt = [], ft = 0; ft < _t.length; ft++) if (_t[ft].x !== void 0) for (var D = B.call(this, _t[ft]), $t = 0; $t < D.length; $t += 1) zt.indexOf(D[$t]) === -1 && zt.push(D[$t]);
    for (var Mt = 0; Mt < zt.length; Mt++) for (; this.pdf.internal.getNumberOfPages() < zt[Mt]; ) _.call(this);
    if (G(zt), this.autoPaging) for (var xt = zt[0], Nt = zt[zt.length - 1], Ft = xt; Ft < Nt + 1; Ft++) {
      this.pdf.setPage(Ft), this.fillStyle = Y, this.strokeStyle = Q, this.lineCap = et, this.lineWidth = At, this.lineJoin = Lt;
      var kt = this.pdf.internal.pageSize.width - this.margin[3] - this.margin[1], Dt = Ft === 1 ? this.posY + this.margin[0] : this.margin[0], Gt = this.pdf.internal.pageSize.height - this.posY - this.margin[0] - this.margin[2], Qt = this.pdf.internal.pageSize.height - this.margin[0] - this.margin[2], te = Ft === 1 ? 0 : Gt + (Ft - 2) * Qt;
      if (this.ctx.clip_path.length !== 0) {
        var ae = this.path;
        M = JSON.parse(JSON.stringify(this.ctx.clip_path)), this.path = E(M, this.posX + this.margin[3], -te + Dt + this.ctx.prevPageLastElemOffset), lt.call(this, L, !0), this.path = ae;
      }
      if (T = JSON.parse(JSON.stringify(Ct)), this.path = E(T, this.posX + this.margin[3], -te + Dt + this.ctx.prevPageLastElemOffset), F === !1 || Ft === 0) {
        var pe = (Ft > xt || Ft < Nt) && k.call(this);
        pe && (this.pdf.saveGraphicsState(), this.pdf.rect(this.margin[3], this.margin[0], kt, Qt, null).clip().discardPath()), lt.call(this, L, F), pe && this.pdf.restoreGraphicsState();
      }
      this.lineWidth = nt;
    }
    else this.lineWidth = At, lt.call(this, L, F), this.lineWidth = nt;
    this.path = Ct;
  }, lt = function(L, F) {
    if ((L !== "stroke" || F || !O.call(this)) && (L === "stroke" || F || !p.call(this))) {
      for (var M, T, Y = [], Q = this.path, et = 0; et < Q.length; et++) {
        var nt = Q[et];
        switch (nt.type) {
          case "begin":
            Y.push({ begin: !0 });
            break;
          case "close":
            Y.push({ close: !0 });
            break;
          case "mt":
            Y.push({ start: nt, deltas: [], abs: [] });
            break;
          case "lt":
            var At = Y.length;
            if (Q[et - 1] && !isNaN(Q[et - 1].x) && (M = [nt.x - Q[et - 1].x, nt.y - Q[et - 1].y], At > 0)) {
              for (; At >= 0; At--) if (Y[At - 1].close !== !0 && Y[At - 1].begin !== !0) {
                Y[At - 1].deltas.push(M), Y[At - 1].abs.push(nt);
                break;
              }
            }
            break;
          case "bct":
            M = [nt.x1 - Q[et - 1].x, nt.y1 - Q[et - 1].y, nt.x2 - Q[et - 1].x, nt.y2 - Q[et - 1].y, nt.x - Q[et - 1].x, nt.y - Q[et - 1].y], Y[Y.length - 1].deltas.push(M);
            break;
          case "qct":
            var Lt = Q[et - 1].x + 2 / 3 * (nt.x1 - Q[et - 1].x), Ct = Q[et - 1].y + 2 / 3 * (nt.y1 - Q[et - 1].y), _t = nt.x + 2 / 3 * (nt.x1 - nt.x), zt = nt.y + 2 / 3 * (nt.y1 - nt.y), ft = nt.x, D = nt.y;
            M = [Lt - Q[et - 1].x, Ct - Q[et - 1].y, _t - Q[et - 1].x, zt - Q[et - 1].y, ft - Q[et - 1].x, D - Q[et - 1].y], Y[Y.length - 1].deltas.push(M);
            break;
          case "arc":
            Y.push({ deltas: [], abs: [], arc: !0 }), Array.isArray(Y[Y.length - 1].abs) && Y[Y.length - 1].abs.push(nt);
        }
      }
      T = F ? null : L === "stroke" ? "stroke" : "fill";
      for (var $t = !1, Mt = 0; Mt < Y.length; Mt++) if (Y[Mt].arc) for (var xt = Y[Mt].abs, Nt = 0; Nt < xt.length; Nt++) {
        var Ft = xt[Nt];
        Ft.type === "arc" ? z.call(this, Ft.x, Ft.y, Ft.radius, Ft.startAngle, Ft.endAngle, Ft.counterclockwise, void 0, F, !$t) : W.call(this, Ft.x, Ft.y), $t = !0;
      }
      else if (Y[Mt].close === !0) this.pdf.internal.out("h"), $t = !1;
      else if (Y[Mt].begin !== !0) {
        var kt = Y[Mt].start.x, Dt = Y[Mt].start.y;
        q.call(this, Y[Mt].deltas, kt, Dt), $t = !0;
      }
      T && rt.call(this, T), F && dt.call(this);
    }
  }, wt = function(L) {
    var F = this.pdf.internal.getFontSize() / this.pdf.internal.scaleFactor, M = F * (this.pdf.internal.getLineHeightFactor() - 1);
    switch (this.ctx.textBaseline) {
      case "bottom":
        return L - M;
      case "top":
        return L + F - M;
      case "hanging":
        return L + F - 2 * M;
      case "middle":
        return L + F / 2 - M;
      case "ideographic":
        return L;
      case "alphabetic":
      default:
        return L;
    }
  }, tt = function(L) {
    return L + this.pdf.internal.getFontSize() / this.pdf.internal.scaleFactor * (this.pdf.internal.getLineHeightFactor() - 1);
  };
  b.prototype.createLinearGradient = function() {
    var L = function() {
    };
    return L.colorStops = [], L.addColorStop = function(F, M) {
      this.colorStops.push([F, M]);
    }, L.getColor = function() {
      return this.colorStops.length === 0 ? "#000000" : this.colorStops[0][1];
    }, L.isCanvasGradient = !0, L;
  }, b.prototype.createPattern = function() {
    return this.createLinearGradient();
  }, b.prototype.createRadialGradient = function() {
    return this.createLinearGradient();
  };
  var z = function(L, F, M, T, Y, Q, et, nt, At) {
    for (var Lt = it.call(this, M, T, Y, Q), Ct = 0; Ct < Lt.length; Ct++) {
      var _t = Lt[Ct];
      Ct === 0 && (At ? P.call(this, _t.x1 + L, _t.y1 + F) : W.call(this, _t.x1 + L, _t.y1 + F)), st.call(this, L, F, _t.x2, _t.y2, _t.x3, _t.y3, _t.x4, _t.y4);
    }
    nt ? dt.call(this) : rt.call(this, et);
  }, rt = function(L) {
    switch (L) {
      case "stroke":
        this.pdf.internal.out("S");
        break;
      case "fill":
        this.pdf.internal.out("f");
    }
  }, dt = function() {
    this.pdf.clip(), this.pdf.discardPath();
  }, P = function(L, F) {
    this.pdf.internal.out(n(L) + " " + i(F) + " m");
  }, C = function(L) {
    var F;
    switch (L.align) {
      case "right":
      case "end":
        F = "right";
        break;
      case "center":
        F = "center";
        break;
      case "left":
      case "start":
      default:
        F = "left";
    }
    var M = this.pdf.getTextDimensions(L.text), T = wt.call(this, L.y), Y = tt.call(this, T) - M.h, Q = this.ctx.transform.applyToPoint(new l(L.x, T)), et = this.ctx.transform.decompose(), nt = new f();
    nt = (nt = (nt = nt.multiply(et.translate)).multiply(et.skew)).multiply(et.scale);
    for (var At, Lt, Ct, _t = this.ctx.transform.applyToRectangle(new u(L.x, T, M.w, M.h)), zt = nt.applyToRectangle(new u(L.x, Y, M.w, M.h)), ft = B.call(this, zt), D = [], $t = 0; $t < ft.length; $t += 1) D.indexOf(ft[$t]) === -1 && D.push(ft[$t]);
    if (G(D), this.autoPaging) for (var Mt = D[0], xt = D[D.length - 1], Nt = Mt; Nt < xt + 1; Nt++) {
      this.pdf.setPage(Nt);
      var Ft = Nt === 1 ? this.posY + this.margin[0] : this.margin[0], kt = this.pdf.internal.pageSize.height - this.posY - this.margin[0] - this.margin[2], Dt = this.pdf.internal.pageSize.height - this.margin[2], Gt = Dt - this.margin[0], Qt = this.pdf.internal.pageSize.width - this.margin[1], te = Qt - this.margin[3], ae = Nt === 1 ? 0 : kt + (Nt - 2) * Gt;
      if (this.ctx.clip_path.length !== 0) {
        var pe = this.path;
        At = JSON.parse(JSON.stringify(this.ctx.clip_path)), this.path = E(At, this.posX + this.margin[3], -1 * ae + Ft), lt.call(this, "fill", !0), this.path = pe;
      }
      var Wt = E([JSON.parse(JSON.stringify(zt))], this.posX + this.margin[3], -ae + Ft + this.ctx.prevPageLastElemOffset)[0];
      L.scale >= 0.01 && (Lt = this.pdf.internal.getFontSize(), this.pdf.setFontSize(Lt * L.scale), Ct = this.lineWidth, this.lineWidth = Ct * L.scale);
      var ee = this.autoPaging !== "text";
      if (ee || Wt.y + Wt.h <= Dt) {
        if (ee || Wt.y >= Ft && Wt.x <= Qt) {
          var jt = ee ? L.text : this.pdf.splitTextToSize(L.text, L.maxWidth || Qt - Wt.x)[0], Ye = E([JSON.parse(JSON.stringify(_t))], this.posX + this.margin[3], -ae + Ft + this.ctx.prevPageLastElemOffset)[0], se = ee && (Nt > Mt || Nt < xt) && k.call(this);
          se && (this.pdf.saveGraphicsState(), this.pdf.rect(this.margin[3], this.margin[0], te, Gt, null).clip().discardPath()), this.pdf.text(jt, Ye.x, Ye.y, { angle: L.angle, align: F, renderingMode: L.renderingMode }), se && this.pdf.restoreGraphicsState();
        }
      } else Wt.y < Dt && (this.ctx.prevPageLastElemOffset += Dt - Wt.y);
      L.scale >= 0.01 && (this.pdf.setFontSize(Lt), this.lineWidth = Ct);
    }
    else L.scale >= 0.01 && (Lt = this.pdf.internal.getFontSize(), this.pdf.setFontSize(Lt * L.scale), Ct = this.lineWidth, this.lineWidth = Ct * L.scale), this.pdf.text(L.text, Q.x + this.posX, Q.y + this.posY, { angle: L.angle, align: F, renderingMode: L.renderingMode, maxWidth: L.maxWidth }), L.scale >= 0.01 && (this.pdf.setFontSize(Lt), this.lineWidth = Ct);
  }, W = function(L, F, M, T) {
    M = M || 0, T = T || 0, this.pdf.internal.out(n(L + M) + " " + i(F + T) + " l");
  }, q = function(L, F, M) {
    return this.pdf.lines(L, F, M, null, null);
  }, st = function(L, F, M, T, Y, Q, et, nt) {
    this.pdf.internal.out([e(s(M + L)), e(o(T + F)), e(s(Y + L)), e(o(Q + F)), e(s(et + L)), e(o(nt + F)), "c"].join(" "));
  }, it = function(L, F, M, T) {
    for (var Y = 2 * Math.PI, Q = Math.PI / 2; F > M; ) F -= Y;
    var et = Math.abs(M - F);
    et < Y && T && (et = Y - et);
    for (var nt = [], At = T ? -1 : 1, Lt = F; et > 1e-5; ) {
      var Ct = Lt + At * Math.min(et, Q);
      nt.push(ht.call(this, L, Lt, Ct)), et -= Math.abs(Ct - Lt), Lt = Ct;
    }
    return nt;
  }, ht = function(L, F, M) {
    var T = (M - F) / 2, Y = L * Math.cos(T), Q = L * Math.sin(T), et = Y, nt = -Q, At = et * et + nt * nt, Lt = At + et * Y + nt * Q, Ct = 4 / 3 * (Math.sqrt(2 * At * Lt) - Lt) / (et * Q - nt * Y), _t = et - Ct * nt, zt = nt + Ct * et, ft = _t, D = -zt, $t = T + F, Mt = Math.cos($t), xt = Math.sin($t);
    return { x1: L * Math.cos(F), y1: L * Math.sin(F), x2: _t * Mt - zt * xt, y2: _t * xt + zt * Mt, x3: ft * Mt - D * xt, y3: ft * xt + D * Mt, x4: L * Math.cos(M), y4: L * Math.sin(M) };
  }, Z = function(L) {
    return 180 * L / Math.PI;
  }, ut = function(L, F, M, T, Y, Q) {
    var et = L + 0.5 * (M - L), nt = F + 0.5 * (T - F), At = Y + 0.5 * (M - Y), Lt = Q + 0.5 * (T - Q), Ct = Math.min(L, Y, et, At), _t = Math.max(L, Y, et, At), zt = Math.min(F, Q, nt, Lt), ft = Math.max(F, Q, nt, Lt);
    return new u(Ct, zt, _t - Ct, ft - zt);
  }, pt = function(L, F, M, T, Y, Q, et, nt) {
    var At, Lt, Ct, _t, zt, ft, D, $t, Mt, xt, Nt, Ft, kt, Dt, Gt = M - L, Qt = T - F, te = Y - M, ae = Q - T, pe = et - Y, Wt = nt - Q;
    for (Lt = 0; Lt < 41; Lt++) Mt = (D = (Ct = L + (At = Lt / 40) * Gt) + At * ((zt = M + At * te) - Ct)) + At * (zt + At * (Y + At * pe - zt) - D), xt = ($t = (_t = F + At * Qt) + At * ((ft = T + At * ae) - _t)) + At * (ft + At * (Q + At * Wt - ft) - $t), Lt == 0 ? (Nt = Mt, Ft = xt, kt = Mt, Dt = xt) : (Nt = Math.min(Nt, Mt), Ft = Math.min(Ft, xt), kt = Math.max(kt, Mt), Dt = Math.max(Dt, xt));
    return new u(Math.round(Nt), Math.round(Ft), Math.round(kt - Nt), Math.round(Dt - Ft));
  }, It = function() {
    if (this.prevLineDash || this.ctx.lineDash.length || this.ctx.lineDashOffset) {
      var L, F, M = (L = this.ctx.lineDash, F = this.ctx.lineDashOffset, JSON.stringify({ lineDash: L, lineDashOffset: F }));
      this.prevLineDash !== M && (this.pdf.setLineDash(this.ctx.lineDash, this.ctx.lineDashOffset), this.prevLineDash = M);
    }
  };
})(Ut.API), /**
 * @license
 * jsPDF filters PlugIn
 * Copyright (c) 2014 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(r) {
  var e = function(o) {
    var l, u, f, g, y, b, N, p, O, k;
    for (u = [], f = 0, g = (o += l = "\0\0\0\0".slice(o.length % 4 || 4)).length; g > f; f += 4) (y = (o.charCodeAt(f) << 24) + (o.charCodeAt(f + 1) << 16) + (o.charCodeAt(f + 2) << 8) + o.charCodeAt(f + 3)) !== 0 ? (b = (y = ((y = ((y = ((y = (y - (k = y % 85)) / 85) - (O = y % 85)) / 85) - (p = y % 85)) / 85) - (N = y % 85)) / 85) % 85, u.push(b + 33, N + 33, p + 33, O + 33, k + 33)) : u.push(122);
    return function(B, _) {
      for (var E = _; E > 0; E--) B.pop();
    }(u, l.length), String.fromCharCode.apply(String, u) + "~>";
  }, n = function(o) {
    var l, u, f, g, y, b = String, N = "length", p = 255, O = "charCodeAt", k = "slice", B = "replace";
    for (o[k](-2), o = o[k](0, -2)[B](/\s/g, "")[B]("z", "!!!!!"), f = [], g = 0, y = (o += l = "uuuuu"[k](o[N] % 5 || 5))[N]; y > g; g += 5) u = 52200625 * (o[O](g) - 33) + 614125 * (o[O](g + 1) - 33) + 7225 * (o[O](g + 2) - 33) + 85 * (o[O](g + 3) - 33) + (o[O](g + 4) - 33), f.push(p & u >> 24, p & u >> 16, p & u >> 8, p & u);
    return function(_, E) {
      for (var G = E; G > 0; G--) _.pop();
    }(f, l[N]), b.fromCharCode.apply(b, f);
  }, i = function(o) {
    var l = new RegExp(/^([0-9A-Fa-f]{2})+$/);
    if ((o = o.replace(/\s/g, "")).indexOf(">") !== -1 && (o = o.substr(0, o.indexOf(">"))), o.length % 2 && (o += "0"), l.test(o) === !1) return "";
    for (var u = "", f = 0; f < o.length; f += 2) u += String.fromCharCode("0x" + (o[f] + o[f + 1]));
    return u;
  }, s = function(o) {
    for (var l = new Uint8Array(o.length), u = o.length; u--; ) l[u] = o.charCodeAt(u);
    return o = (l = _s(l)).reduce(function(f, g) {
      return f + String.fromCharCode(g);
    }, "");
  };
  r.processDataByFilters = function(o, l) {
    var u = 0, f = o || "", g = [];
    for (typeof (l = l || []) == "string" && (l = [l]), u = 0; u < l.length; u += 1) switch (l[u]) {
      case "ASCII85Decode":
      case "/ASCII85Decode":
        f = n(f), g.push("/ASCII85Encode");
        break;
      case "ASCII85Encode":
      case "/ASCII85Encode":
        f = e(f), g.push("/ASCII85Decode");
        break;
      case "ASCIIHexDecode":
      case "/ASCIIHexDecode":
        f = i(f), g.push("/ASCIIHexEncode");
        break;
      case "ASCIIHexEncode":
      case "/ASCIIHexEncode":
        f = f.split("").map(function(y) {
          return ("0" + y.charCodeAt().toString(16)).slice(-2);
        }).join("") + ">", g.push("/ASCIIHexDecode");
        break;
      case "FlateEncode":
      case "/FlateEncode":
        f = s(f), g.push("/FlateDecode");
        break;
      default:
        throw new Error('The filter: "' + l[u] + '" is not implemented');
    }
    return { data: f, reverseChain: g.reverse().join(" ") };
  };
}(Ut.API), /**
 * @license
 * jsPDF fileloading PlugIn
 * Copyright (c) 2018 Aras Abbasi (aras.abbasi@gmail.com)
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(r) {
  r.loadFile = function(e, n, i) {
    return function(s, o, l) {
      o = o !== !1, l = typeof l == "function" ? l : function() {
      };
      var u = void 0;
      try {
        u = function(f, g, y) {
          var b = new XMLHttpRequest(), N = 0, p = function(O) {
            var k = O.length, B = [], _ = String.fromCharCode;
            for (N = 0; N < k; N += 1) B.push(_(255 & O.charCodeAt(N)));
            return B.join("");
          };
          if (b.open("GET", f, !g), b.overrideMimeType("text/plain; charset=x-user-defined"), g === !1 && (b.onload = function() {
            b.status === 200 ? y(p(this.responseText)) : y(void 0);
          }), b.send(null), g && b.status === 200) return p(b.responseText);
        }(s, o, l);
      } catch {
      }
      return u;
    }(e, n, i);
  }, r.loadImageFile = r.loadFile;
}(Ut.API), function(r) {
  function e() {
    return (Ht.html2canvas ? Promise.resolve(Ht.html2canvas) : import("./html2canvas.esm-d2sM-0Wm.js")).catch(function(l) {
      return Promise.reject(new Error("Could not load html2canvas: " + l));
    }).then(function(l) {
      return l.default ? l.default : l;
    });
  }
  function n() {
    return (Ht.DOMPurify ? Promise.resolve(Ht.DOMPurify) : import("./purify.es-CKk_t3XZ.js")).catch(function(l) {
      return Promise.reject(new Error("Could not load dompurify: " + l));
    }).then(function(l) {
      return l.default ? l.default : l;
    });
  }
  var i = function(l) {
    var u = de(l);
    return u === "undefined" ? "undefined" : u === "string" || l instanceof String ? "string" : u === "number" || l instanceof Number ? "number" : u === "function" || l instanceof Function ? "function" : l && l.constructor === Array ? "array" : l && l.nodeType === 1 ? "element" : u === "object" ? "object" : "unknown";
  }, s = function(l, u) {
    var f = document.createElement(l);
    for (var g in u.className && (f.className = u.className), u.innerHTML && u.dompurify && (f.innerHTML = u.dompurify.sanitize(u.innerHTML)), u.style) f.style[g] = u.style[g];
    return f;
  }, o = function l(u) {
    var f = Object.assign(l.convert(Promise.resolve()), JSON.parse(JSON.stringify(l.template))), g = l.convert(Promise.resolve(), f);
    return g = (g = g.setProgress(1, l, 1, [l])).set(u);
  };
  (o.prototype = Object.create(Promise.prototype)).constructor = o, o.convert = function(l, u) {
    return l.__proto__ = u || o.prototype, l;
  }, o.template = { prop: { src: null, container: null, overlay: null, canvas: null, img: null, pdf: null, pageSize: null, callback: function() {
  } }, progress: { val: 0, state: null, n: 0, stack: [] }, opt: { filename: "file.pdf", margin: [0, 0, 0, 0], enableLinks: !0, x: 0, y: 0, html2canvas: {}, jsPDF: {}, backgroundColor: "transparent" } }, o.prototype.from = function(l, u) {
    return this.then(function() {
      switch (u = u || function(f) {
        switch (i(f)) {
          case "string":
            return "string";
          case "element":
            return f.nodeName.toLowerCase() === "canvas" ? "canvas" : "element";
          default:
            return "unknown";
        }
      }(l)) {
        case "string":
          return this.then(n).then(function(f) {
            return this.set({ src: s("div", { innerHTML: l, dompurify: f }) });
          });
        case "element":
          return this.set({ src: l });
        case "canvas":
          return this.set({ canvas: l });
        case "img":
          return this.set({ img: l });
        default:
          return this.error("Unknown source type.");
      }
    });
  }, o.prototype.to = function(l) {
    switch (l) {
      case "container":
        return this.toContainer();
      case "canvas":
        return this.toCanvas();
      case "img":
        return this.toImg();
      case "pdf":
        return this.toPdf();
      default:
        return this.error("Invalid target.");
    }
  }, o.prototype.toContainer = function() {
    return this.thenList([function() {
      return this.prop.src || this.error("Cannot duplicate - no source HTML.");
    }, function() {
      return this.prop.pageSize || this.setPageSize();
    }]).then(function() {
      var l = { position: "relative", display: "inline-block", width: (typeof this.opt.width != "number" || isNaN(this.opt.width) || typeof this.opt.windowWidth != "number" || isNaN(this.opt.windowWidth) ? Math.max(this.prop.src.clientWidth, this.prop.src.scrollWidth, this.prop.src.offsetWidth) : this.opt.windowWidth) + "px", left: 0, right: 0, top: 0, margin: "auto", backgroundColor: this.opt.backgroundColor }, u = function f(g, y) {
        for (var b = g.nodeType === 3 ? document.createTextNode(g.nodeValue) : g.cloneNode(!1), N = g.firstChild; N; N = N.nextSibling) y !== !0 && N.nodeType === 1 && N.nodeName === "SCRIPT" || b.appendChild(f(N, y));
        return g.nodeType === 1 && (g.nodeName === "CANVAS" ? (b.width = g.width, b.height = g.height, b.getContext("2d").drawImage(g, 0, 0)) : g.nodeName !== "TEXTAREA" && g.nodeName !== "SELECT" || (b.value = g.value), b.addEventListener("load", function() {
          b.scrollTop = g.scrollTop, b.scrollLeft = g.scrollLeft;
        }, !0)), b;
      }(this.prop.src, this.opt.html2canvas.javascriptEnabled);
      u.tagName === "BODY" && (l.height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) + "px"), this.prop.overlay = s("div", { className: "html2pdf__overlay", style: { position: "fixed", overflow: "hidden", zIndex: 1e3, left: "-100000px", right: 0, bottom: 0, top: 0 } }), this.prop.container = s("div", { className: "html2pdf__container", style: l }), this.prop.container.appendChild(u), this.prop.container.firstChild.appendChild(s("div", { style: { clear: "both", border: "0 none transparent", margin: 0, padding: 0, height: 0 } })), this.prop.container.style.float = "none", this.prop.overlay.appendChild(this.prop.container), document.body.appendChild(this.prop.overlay), this.prop.container.firstChild.style.position = "relative", this.prop.container.height = Math.max(this.prop.container.firstChild.clientHeight, this.prop.container.firstChild.scrollHeight, this.prop.container.firstChild.offsetHeight) + "px";
    });
  }, o.prototype.toCanvas = function() {
    var l = [function() {
      return document.body.contains(this.prop.container) || this.toContainer();
    }];
    return this.thenList(l).then(e).then(function(u) {
      var f = Object.assign({}, this.opt.html2canvas);
      return delete f.onrendered, u(this.prop.container, f);
    }).then(function(u) {
      (this.opt.html2canvas.onrendered || function() {
      })(u), this.prop.canvas = u, document.body.removeChild(this.prop.overlay);
    });
  }, o.prototype.toContext2d = function() {
    var l = [function() {
      return document.body.contains(this.prop.container) || this.toContainer();
    }];
    return this.thenList(l).then(e).then(function(u) {
      var f = this.opt.jsPDF, g = this.opt.fontFaces, y = typeof this.opt.width != "number" || isNaN(this.opt.width) || typeof this.opt.windowWidth != "number" || isNaN(this.opt.windowWidth) ? 1 : this.opt.width / this.opt.windowWidth, b = Object.assign({ async: !0, allowTaint: !0, scale: y, scrollX: this.opt.scrollX || 0, scrollY: this.opt.scrollY || 0, backgroundColor: "#ffffff", imageTimeout: 15e3, logging: !0, proxy: null, removeContainer: !0, foreignObjectRendering: !1, useCORS: !1 }, this.opt.html2canvas);
      if (delete b.onrendered, f.context2d.autoPaging = this.opt.autoPaging === void 0 || this.opt.autoPaging, f.context2d.posX = this.opt.x, f.context2d.posY = this.opt.y, f.context2d.margin = this.opt.margin, f.context2d.fontFaces = g, g) for (var N = 0; N < g.length; ++N) {
        var p = g[N], O = p.src.find(function(k) {
          return k.format === "truetype";
        });
        O && f.addFont(O.url, p.ref.name, p.ref.style);
      }
      return b.windowHeight = b.windowHeight || 0, b.windowHeight = b.windowHeight == 0 ? Math.max(this.prop.container.clientHeight, this.prop.container.scrollHeight, this.prop.container.offsetHeight) : b.windowHeight, f.context2d.save(!0), u(this.prop.container, b);
    }).then(function(u) {
      this.opt.jsPDF.context2d.restore(!0), (this.opt.html2canvas.onrendered || function() {
      })(u), this.prop.canvas = u, document.body.removeChild(this.prop.overlay);
    });
  }, o.prototype.toImg = function() {
    return this.thenList([function() {
      return this.prop.canvas || this.toCanvas();
    }]).then(function() {
      var l = this.prop.canvas.toDataURL("image/" + this.opt.image.type, this.opt.image.quality);
      this.prop.img = document.createElement("img"), this.prop.img.src = l;
    });
  }, o.prototype.toPdf = function() {
    return this.thenList([function() {
      return this.toContext2d();
    }]).then(function() {
      this.prop.pdf = this.prop.pdf || this.opt.jsPDF;
    });
  }, o.prototype.output = function(l, u, f) {
    return (f = f || "pdf").toLowerCase() === "img" || f.toLowerCase() === "image" ? this.outputImg(l, u) : this.outputPdf(l, u);
  }, o.prototype.outputPdf = function(l, u) {
    return this.thenList([function() {
      return this.prop.pdf || this.toPdf();
    }]).then(function() {
      return this.prop.pdf.output(l, u);
    });
  }, o.prototype.outputImg = function(l) {
    return this.thenList([function() {
      return this.prop.img || this.toImg();
    }]).then(function() {
      switch (l) {
        case void 0:
        case "img":
          return this.prop.img;
        case "datauristring":
        case "dataurlstring":
          return this.prop.img.src;
        case "datauri":
        case "dataurl":
          return document.location.href = this.prop.img.src;
        default:
          throw 'Image output type "' + l + '" is not supported.';
      }
    });
  }, o.prototype.save = function(l) {
    return this.thenList([function() {
      return this.prop.pdf || this.toPdf();
    }]).set(l ? { filename: l } : null).then(function() {
      this.prop.pdf.save(this.opt.filename);
    });
  }, o.prototype.doCallback = function() {
    return this.thenList([function() {
      return this.prop.pdf || this.toPdf();
    }]).then(function() {
      this.prop.callback(this.prop.pdf);
    });
  }, o.prototype.set = function(l) {
    if (i(l) !== "object") return this;
    var u = Object.keys(l || {}).map(function(f) {
      if (f in o.template.prop) return function() {
        this.prop[f] = l[f];
      };
      switch (f) {
        case "margin":
          return this.setMargin.bind(this, l.margin);
        case "jsPDF":
          return function() {
            return this.opt.jsPDF = l.jsPDF, this.setPageSize();
          };
        case "pageSize":
          return this.setPageSize.bind(this, l.pageSize);
        default:
          return function() {
            this.opt[f] = l[f];
          };
      }
    }, this);
    return this.then(function() {
      return this.thenList(u);
    });
  }, o.prototype.get = function(l, u) {
    return this.then(function() {
      var f = l in o.template.prop ? this.prop[l] : this.opt[l];
      return u ? u(f) : f;
    });
  }, o.prototype.setMargin = function(l) {
    return this.then(function() {
      switch (i(l)) {
        case "number":
          l = [l, l, l, l];
        case "array":
          if (l.length === 2 && (l = [l[0], l[1], l[0], l[1]]), l.length === 4) break;
        default:
          return this.error("Invalid margin array.");
      }
      this.opt.margin = l;
    }).then(this.setPageSize);
  }, o.prototype.setPageSize = function(l) {
    function u(f, g) {
      return Math.floor(f * g / 72 * 96);
    }
    return this.then(function() {
      (l = l || Ut.getPageSize(this.opt.jsPDF)).hasOwnProperty("inner") || (l.inner = { width: l.width - this.opt.margin[1] - this.opt.margin[3], height: l.height - this.opt.margin[0] - this.opt.margin[2] }, l.inner.px = { width: u(l.inner.width, l.k), height: u(l.inner.height, l.k) }, l.inner.ratio = l.inner.height / l.inner.width), this.prop.pageSize = l;
    });
  }, o.prototype.setProgress = function(l, u, f, g) {
    return l != null && (this.progress.val = l), u != null && (this.progress.state = u), f != null && (this.progress.n = f), g != null && (this.progress.stack = g), this.progress.ratio = this.progress.val / this.progress.state, this;
  }, o.prototype.updateProgress = function(l, u, f, g) {
    return this.setProgress(l ? this.progress.val + l : null, u || null, f ? this.progress.n + f : null, g ? this.progress.stack.concat(g) : null);
  }, o.prototype.then = function(l, u) {
    var f = this;
    return this.thenCore(l, u, function(g, y) {
      return f.updateProgress(null, null, 1, [g]), Promise.prototype.then.call(this, function(b) {
        return f.updateProgress(null, g), b;
      }).then(g, y).then(function(b) {
        return f.updateProgress(1), b;
      });
    });
  }, o.prototype.thenCore = function(l, u, f) {
    f = f || Promise.prototype.then, l && (l = l.bind(this)), u && (u = u.bind(this));
    var g = Promise.toString().indexOf("[native code]") !== -1 && Promise.name === "Promise" ? this : o.convert(Object.assign({}, this), Promise.prototype), y = f.call(g, l, u);
    return o.convert(y, this.__proto__);
  }, o.prototype.thenExternal = function(l, u) {
    return Promise.prototype.then.call(this, l, u);
  }, o.prototype.thenList = function(l) {
    var u = this;
    return l.forEach(function(f) {
      u = u.thenCore(f);
    }), u;
  }, o.prototype.catch = function(l) {
    l && (l = l.bind(this));
    var u = Promise.prototype.catch.call(this, l);
    return o.convert(u, this);
  }, o.prototype.catchExternal = function(l) {
    return Promise.prototype.catch.call(this, l);
  }, o.prototype.error = function(l) {
    return this.then(function() {
      throw new Error(l);
    });
  }, o.prototype.using = o.prototype.set, o.prototype.saveAs = o.prototype.save, o.prototype.export = o.prototype.output, o.prototype.run = o.prototype.then, Ut.getPageSize = function(l, u, f) {
    if (de(l) === "object") {
      var g = l;
      l = g.orientation, u = g.unit || u, f = g.format || f;
    }
    u = u || "mm", f = f || "a4", l = ("" + (l || "P")).toLowerCase();
    var y, b = ("" + f).toLowerCase(), N = { a0: [2383.94, 3370.39], a1: [1683.78, 2383.94], a2: [1190.55, 1683.78], a3: [841.89, 1190.55], a4: [595.28, 841.89], a5: [419.53, 595.28], a6: [297.64, 419.53], a7: [209.76, 297.64], a8: [147.4, 209.76], a9: [104.88, 147.4], a10: [73.7, 104.88], b0: [2834.65, 4008.19], b1: [2004.09, 2834.65], b2: [1417.32, 2004.09], b3: [1000.63, 1417.32], b4: [708.66, 1000.63], b5: [498.9, 708.66], b6: [354.33, 498.9], b7: [249.45, 354.33], b8: [175.75, 249.45], b9: [124.72, 175.75], b10: [87.87, 124.72], c0: [2599.37, 3676.54], c1: [1836.85, 2599.37], c2: [1298.27, 1836.85], c3: [918.43, 1298.27], c4: [649.13, 918.43], c5: [459.21, 649.13], c6: [323.15, 459.21], c7: [229.61, 323.15], c8: [161.57, 229.61], c9: [113.39, 161.57], c10: [79.37, 113.39], dl: [311.81, 623.62], letter: [612, 792], "government-letter": [576, 756], legal: [612, 1008], "junior-legal": [576, 360], ledger: [1224, 792], tabloid: [792, 1224], "credit-card": [153, 243] };
    switch (u) {
      case "pt":
        y = 1;
        break;
      case "mm":
        y = 72 / 25.4;
        break;
      case "cm":
        y = 72 / 2.54;
        break;
      case "in":
        y = 72;
        break;
      case "px":
        y = 0.75;
        break;
      case "pc":
      case "em":
        y = 12;
        break;
      case "ex":
        y = 6;
        break;
      default:
        throw "Invalid unit: " + u;
    }
    var p, O = 0, k = 0;
    if (N.hasOwnProperty(b)) O = N[b][1] / y, k = N[b][0] / y;
    else try {
      O = f[1], k = f[0];
    } catch {
      throw new Error("Invalid format: " + f);
    }
    if (l === "p" || l === "portrait") l = "p", k > O && (p = k, k = O, O = p);
    else {
      if (l !== "l" && l !== "landscape") throw "Invalid orientation: " + l;
      l = "l", O > k && (p = k, k = O, O = p);
    }
    return { width: k, height: O, unit: u, k: y, orientation: l };
  }, r.html = function(l, u) {
    (u = u || {}).callback = u.callback || function() {
    }, u.html2canvas = u.html2canvas || {}, u.html2canvas.canvas = u.html2canvas.canvas || this.canvas, u.jsPDF = u.jsPDF || this, u.fontFaces = u.fontFaces ? u.fontFaces.map(js) : null;
    var f = new o(u);
    return u.worker ? f : f.from(l).doCallback();
  };
}(Ut.API), Ut.API.addJS = function(r) {
  return Sc = r, this.internal.events.subscribe("postPutResources", function() {
    ho = this.internal.newObject(), this.internal.out("<<"), this.internal.out("/Names [(EmbeddedJS) " + (ho + 1) + " 0 R]"), this.internal.out(">>"), this.internal.out("endobj"), Nc = this.internal.newObject(), this.internal.out("<<"), this.internal.out("/S /JavaScript"), this.internal.out("/JS (" + Sc + ")"), this.internal.out(">>"), this.internal.out("endobj");
  }), this.internal.events.subscribe("putCatalog", function() {
    ho !== void 0 && Nc !== void 0 && this.internal.out("/Names <</JavaScript " + ho + " 0 R>>");
  }), this;
}, /**
 * @license
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(r) {
  var e;
  r.events.push(["postPutResources", function() {
    var n = this, i = /^(\d+) 0 obj$/;
    if (this.outline.root.children.length > 0) for (var s = n.outline.render().split(/\r\n/), o = 0; o < s.length; o++) {
      var l = s[o], u = i.exec(l);
      if (u != null) {
        var f = u[1];
        n.internal.newObjectDeferredBegin(f, !1);
      }
      n.internal.write(l);
    }
    if (this.outline.createNamedDestinations) {
      var g = this.internal.pages.length, y = [];
      for (o = 0; o < g; o++) {
        var b = n.internal.newObject();
        y.push(b);
        var N = n.internal.getPageInfo(o + 1);
        n.internal.write("<< /D[" + N.objId + " 0 R /XYZ null null null]>> endobj");
      }
      var p = n.internal.newObject();
      for (n.internal.write("<< /Names [ "), o = 0; o < y.length; o++) n.internal.write("(page_" + (o + 1) + ")" + y[o] + " 0 R");
      n.internal.write(" ] >>", "endobj"), e = n.internal.newObject(), n.internal.write("<< /Dests " + p + " 0 R"), n.internal.write(">>", "endobj");
    }
  }]), r.events.push(["putCatalog", function() {
    this.outline.root.children.length > 0 && (this.internal.write("/Outlines", this.outline.makeRef(this.outline.root)), this.outline.createNamedDestinations && this.internal.write("/Names " + e + " 0 R"));
  }]), r.events.push(["initialized", function() {
    var n = this;
    n.outline = { createNamedDestinations: !1, root: { children: [] } }, n.outline.add = function(i, s, o) {
      var l = { title: s, options: o, children: [] };
      return i == null && (i = this.root), i.children.push(l), l;
    }, n.outline.render = function() {
      return this.ctx = {}, this.ctx.val = "", this.ctx.pdf = n, this.genIds_r(this.root), this.renderRoot(this.root), this.renderItems(this.root), this.ctx.val;
    }, n.outline.genIds_r = function(i) {
      i.id = n.internal.newObjectDeferred();
      for (var s = 0; s < i.children.length; s++) this.genIds_r(i.children[s]);
    }, n.outline.renderRoot = function(i) {
      this.objStart(i), this.line("/Type /Outlines"), i.children.length > 0 && (this.line("/First " + this.makeRef(i.children[0])), this.line("/Last " + this.makeRef(i.children[i.children.length - 1]))), this.line("/Count " + this.count_r({ count: 0 }, i)), this.objEnd();
    }, n.outline.renderItems = function(i) {
      for (var s = this.ctx.pdf.internal.getVerticalCoordinateString, o = 0; o < i.children.length; o++) {
        var l = i.children[o];
        this.objStart(l), this.line("/Title " + this.makeString(l.title)), this.line("/Parent " + this.makeRef(i)), o > 0 && this.line("/Prev " + this.makeRef(i.children[o - 1])), o < i.children.length - 1 && this.line("/Next " + this.makeRef(i.children[o + 1])), l.children.length > 0 && (this.line("/First " + this.makeRef(l.children[0])), this.line("/Last " + this.makeRef(l.children[l.children.length - 1])));
        var u = this.count = this.count_r({ count: 0 }, l);
        if (u > 0 && this.line("/Count " + u), l.options && l.options.pageNumber) {
          var f = n.internal.getPageInfo(l.options.pageNumber);
          this.line("/Dest [" + f.objId + " 0 R /XYZ 0 " + s(0) + " 0]");
        }
        this.objEnd();
      }
      for (var g = 0; g < i.children.length; g++) this.renderItems(i.children[g]);
    }, n.outline.line = function(i) {
      this.ctx.val += i + `\r
`;
    }, n.outline.makeRef = function(i) {
      return i.id + " 0 R";
    }, n.outline.makeString = function(i) {
      return "(" + n.internal.pdfEscape(i) + ")";
    }, n.outline.objStart = function(i) {
      this.ctx.val += `\r
` + i.id + ` 0 obj\r
<<\r
`;
    }, n.outline.objEnd = function() {
      this.ctx.val += `>> \r
endobj\r
`;
    }, n.outline.count_r = function(i, s) {
      for (var o = 0; o < s.children.length; o++) i.count++, this.count_r(i, s.children[o]);
      return i.count;
    };
  }]);
}(Ut.API), /**
 * @license
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(r) {
  var e = [192, 193, 194, 195, 196, 197, 198, 199];
  r.processJPEG = function(n, i, s, o, l, u) {
    var f, g = this.decode.DCT_DECODE, y = null;
    if (typeof n == "string" || this.__addimage__.isArrayBuffer(n) || this.__addimage__.isArrayBufferView(n)) {
      switch (n = l || n, n = this.__addimage__.isArrayBuffer(n) ? new Uint8Array(n) : n, (f = function(b) {
        for (var N, p = 256 * b.charCodeAt(4) + b.charCodeAt(5), O = b.length, k = { width: 0, height: 0, numcomponents: 1 }, B = 4; B < O; B += 2) {
          if (B += p, e.indexOf(b.charCodeAt(B + 1)) !== -1) {
            N = 256 * b.charCodeAt(B + 5) + b.charCodeAt(B + 6), k = { width: 256 * b.charCodeAt(B + 7) + b.charCodeAt(B + 8), height: N, numcomponents: b.charCodeAt(B + 9) };
            break;
          }
          p = 256 * b.charCodeAt(B + 2) + b.charCodeAt(B + 3);
        }
        return k;
      }(n = this.__addimage__.isArrayBufferView(n) ? this.__addimage__.arrayBufferToBinaryString(n) : n)).numcomponents) {
        case 1:
          u = this.color_spaces.DEVICE_GRAY;
          break;
        case 4:
          u = this.color_spaces.DEVICE_CMYK;
          break;
        case 3:
          u = this.color_spaces.DEVICE_RGB;
      }
      y = { data: n, width: f.width, height: f.height, colorSpace: u, bitsPerComponent: 8, filter: g, index: i, alias: s };
    }
    return y;
  };
}(Ut.API);
var Pi, uo, _c, Pc, kc, Mh = function() {
  var r, e, n;
  function i(o) {
    var l, u, f, g, y, b, N, p, O, k, B, _, E, G;
    for (this.data = o, this.pos = 8, this.palette = [], this.imgData = [], this.transparency = {}, this.animation = null, this.text = {}, b = null; ; ) {
      switch (l = this.readUInt32(), O = (function() {
        var at, lt;
        for (lt = [], at = 0; at < 4; ++at) lt.push(String.fromCharCode(this.data[this.pos++]));
        return lt;
      }).call(this).join("")) {
        case "IHDR":
          this.width = this.readUInt32(), this.height = this.readUInt32(), this.bits = this.data[this.pos++], this.colorType = this.data[this.pos++], this.compressionMethod = this.data[this.pos++], this.filterMethod = this.data[this.pos++], this.interlaceMethod = this.data[this.pos++];
          break;
        case "acTL":
          this.animation = { numFrames: this.readUInt32(), numPlays: this.readUInt32() || 1 / 0, frames: [] };
          break;
        case "PLTE":
          this.palette = this.read(l);
          break;
        case "fcTL":
          b && this.animation.frames.push(b), this.pos += 4, b = { width: this.readUInt32(), height: this.readUInt32(), xOffset: this.readUInt32(), yOffset: this.readUInt32() }, y = this.readUInt16(), g = this.readUInt16() || 100, b.delay = 1e3 * y / g, b.disposeOp = this.data[this.pos++], b.blendOp = this.data[this.pos++], b.data = [];
          break;
        case "IDAT":
        case "fdAT":
          for (O === "fdAT" && (this.pos += 4, l -= 4), o = (b != null ? b.data : void 0) || this.imgData, _ = 0; 0 <= l ? _ < l : _ > l; 0 <= l ? ++_ : --_) o.push(this.data[this.pos++]);
          break;
        case "tRNS":
          switch (this.transparency = {}, this.colorType) {
            case 3:
              if (f = this.palette.length / 3, this.transparency.indexed = this.read(l), this.transparency.indexed.length > f) throw new Error("More transparent colors than palette size");
              if ((k = f - this.transparency.indexed.length) > 0) for (E = 0; 0 <= k ? E < k : E > k; 0 <= k ? ++E : --E) this.transparency.indexed.push(255);
              break;
            case 0:
              this.transparency.grayscale = this.read(l)[0];
              break;
            case 2:
              this.transparency.rgb = this.read(l);
          }
          break;
        case "tEXt":
          N = (B = this.read(l)).indexOf(0), p = String.fromCharCode.apply(String, B.slice(0, N)), this.text[p] = String.fromCharCode.apply(String, B.slice(N + 1));
          break;
        case "IEND":
          return b && this.animation.frames.push(b), this.colors = (function() {
            switch (this.colorType) {
              case 0:
              case 3:
              case 4:
                return 1;
              case 2:
              case 6:
                return 3;
            }
          }).call(this), this.hasAlphaChannel = (G = this.colorType) === 4 || G === 6, u = this.colors + (this.hasAlphaChannel ? 1 : 0), this.pixelBitlength = this.bits * u, this.colorSpace = (function() {
            switch (this.colors) {
              case 1:
                return "DeviceGray";
              case 3:
                return "DeviceRGB";
            }
          }).call(this), void (this.imgData = new Uint8Array(this.imgData));
        default:
          this.pos += l;
      }
      if (this.pos += 4, this.pos > this.data.length) throw new Error("Incomplete or corrupt PNG file");
    }
  }
  i.prototype.read = function(o) {
    var l, u;
    for (u = [], l = 0; 0 <= o ? l < o : l > o; 0 <= o ? ++l : --l) u.push(this.data[this.pos++]);
    return u;
  }, i.prototype.readUInt32 = function() {
    return this.data[this.pos++] << 24 | this.data[this.pos++] << 16 | this.data[this.pos++] << 8 | this.data[this.pos++];
  }, i.prototype.readUInt16 = function() {
    return this.data[this.pos++] << 8 | this.data[this.pos++];
  }, i.prototype.decodePixels = function(o) {
    var l = this.pixelBitlength / 8, u = new Uint8Array(this.width * this.height * l), f = 0, g = this;
    if (o == null && (o = this.imgData), o.length === 0) return new Uint8Array(0);
    function y(b, N, p, O) {
      var k, B, _, E, G, at, lt, wt, tt, z, rt, dt, P, C, W, q, st, it, ht, Z, ut, pt = Math.ceil((g.width - b) / p), It = Math.ceil((g.height - N) / O), L = g.width == pt && g.height == It;
      for (C = l * pt, dt = L ? u : new Uint8Array(C * It), at = o.length, P = 0, B = 0; P < It && f < at; ) {
        switch (o[f++]) {
          case 0:
            for (E = st = 0; st < C; E = st += 1) dt[B++] = o[f++];
            break;
          case 1:
            for (E = it = 0; it < C; E = it += 1) k = o[f++], G = E < l ? 0 : dt[B - l], dt[B++] = (k + G) % 256;
            break;
          case 2:
            for (E = ht = 0; ht < C; E = ht += 1) k = o[f++], _ = (E - E % l) / l, W = P && dt[(P - 1) * C + _ * l + E % l], dt[B++] = (W + k) % 256;
            break;
          case 3:
            for (E = Z = 0; Z < C; E = Z += 1) k = o[f++], _ = (E - E % l) / l, G = E < l ? 0 : dt[B - l], W = P && dt[(P - 1) * C + _ * l + E % l], dt[B++] = (k + Math.floor((G + W) / 2)) % 256;
            break;
          case 4:
            for (E = ut = 0; ut < C; E = ut += 1) k = o[f++], _ = (E - E % l) / l, G = E < l ? 0 : dt[B - l], P === 0 ? W = q = 0 : (W = dt[(P - 1) * C + _ * l + E % l], q = _ && dt[(P - 1) * C + (_ - 1) * l + E % l]), lt = G + W - q, wt = Math.abs(lt - G), z = Math.abs(lt - W), rt = Math.abs(lt - q), tt = wt <= z && wt <= rt ? G : z <= rt ? W : q, dt[B++] = (k + tt) % 256;
            break;
          default:
            throw new Error("Invalid filter algorithm: " + o[f - 1]);
        }
        if (!L) {
          var F = ((N + P * O) * g.width + b) * l, M = P * C;
          for (E = 0; E < pt; E += 1) {
            for (var T = 0; T < l; T += 1) u[F++] = dt[M++];
            F += (p - 1) * l;
          }
        }
        P++;
      }
    }
    return o = ph(o), g.interlaceMethod == 1 ? (y(0, 0, 8, 8), y(4, 0, 8, 8), y(0, 4, 4, 8), y(2, 0, 4, 4), y(0, 2, 2, 4), y(1, 0, 2, 2), y(0, 1, 1, 2)) : y(0, 0, 1, 1), u;
  }, i.prototype.decodePalette = function() {
    var o, l, u, f, g, y, b, N, p;
    for (u = this.palette, y = this.transparency.indexed || [], g = new Uint8Array((y.length || 0) + u.length), f = 0, o = 0, l = b = 0, N = u.length; b < N; l = b += 3) g[f++] = u[l], g[f++] = u[l + 1], g[f++] = u[l + 2], g[f++] = (p = y[o++]) != null ? p : 255;
    return g;
  }, i.prototype.copyToImageData = function(o, l) {
    var u, f, g, y, b, N, p, O, k, B, _;
    if (f = this.colors, k = null, u = this.hasAlphaChannel, this.palette.length && (k = (_ = this._decodedPalette) != null ? _ : this._decodedPalette = this.decodePalette(), f = 4, u = !0), O = (g = o.data || o).length, b = k || l, y = N = 0, f === 1) for (; y < O; ) p = k ? 4 * l[y / 4] : N, B = b[p++], g[y++] = B, g[y++] = B, g[y++] = B, g[y++] = u ? b[p++] : 255, N = p;
    else for (; y < O; ) p = k ? 4 * l[y / 4] : N, g[y++] = b[p++], g[y++] = b[p++], g[y++] = b[p++], g[y++] = u ? b[p++] : 255, N = p;
  }, i.prototype.decode = function() {
    var o;
    return o = new Uint8Array(this.width * this.height * 4), this.copyToImageData(o, this.decodePixels()), o;
  };
  var s = function() {
    if (Object.prototype.toString.call(Ht) === "[object Window]") {
      try {
        e = Ht.document.createElement("canvas"), n = e.getContext("2d");
      } catch {
        return !1;
      }
      return !0;
    }
    return !1;
  };
  return s(), r = function(o) {
    var l;
    if (s() === !0) return n.width = o.width, n.height = o.height, n.clearRect(0, 0, o.width, o.height), n.putImageData(o, 0, 0), (l = new Image()).src = e.toDataURL(), l;
    throw new Error("This method requires a Browser with Canvas-capability.");
  }, i.prototype.decodeFrames = function(o) {
    var l, u, f, g, y, b, N, p;
    if (this.animation) {
      for (p = [], u = y = 0, b = (N = this.animation.frames).length; y < b; u = ++y) l = N[u], f = o.createImageData(l.width, l.height), g = this.decodePixels(new Uint8Array(l.data)), this.copyToImageData(f, g), l.imageData = f, p.push(l.image = r(f));
      return p;
    }
  }, i.prototype.renderFrame = function(o, l) {
    var u, f, g;
    return u = (f = this.animation.frames)[l], g = f[l - 1], l === 0 && o.clearRect(0, 0, this.width, this.height), (g != null ? g.disposeOp : void 0) === 1 ? o.clearRect(g.xOffset, g.yOffset, g.width, g.height) : (g != null ? g.disposeOp : void 0) === 2 && o.putImageData(g.imageData, g.xOffset, g.yOffset), u.blendOp === 0 && o.clearRect(u.xOffset, u.yOffset, u.width, u.height), o.drawImage(u.image, u.xOffset, u.yOffset);
  }, i.prototype.animate = function(o) {
    var l, u, f, g, y, b, N = this;
    return u = 0, b = this.animation, g = b.numFrames, f = b.frames, y = b.numPlays, (l = function() {
      var p, O;
      if (p = u++ % g, O = f[p], N.renderFrame(o, p), g > 1 && u / g < y) return N.animation._timeout = setTimeout(l, O.delay);
    })();
  }, i.prototype.stopAnimation = function() {
    var o;
    return clearTimeout((o = this.animation) != null ? o._timeout : void 0);
  }, i.prototype.render = function(o) {
    var l, u;
    return o._png && o._png.stopAnimation(), o._png = this, o.width = this.width, o.height = this.height, l = o.getContext("2d"), this.animation ? (this.decodeFrames(l), this.animate(l)) : (u = l.createImageData(this.width, this.height), this.copyToImageData(u, this.decodePixels()), l.putImageData(u, 0, 0));
  }, i;
}();
/**
 * @license
 *
 * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */
/**
 * @license
 * (c) Dean McNamee <dean@gmail.com>, 2013.
 *
 * https://github.com/deanm/omggif
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 * omggif is a JavaScript implementation of a GIF 89a encoder and decoder,
 * including animation and compression.  It does not rely on any specific
 * underlying system, so should run in the browser, Node, or Plask.
 */
function Dh(r) {
  var e = 0;
  if (r[e++] !== 71 || r[e++] !== 73 || r[e++] !== 70 || r[e++] !== 56 || (r[e++] + 1 & 253) != 56 || r[e++] !== 97) throw new Error("Invalid GIF 87a/89a header.");
  var n = r[e++] | r[e++] << 8, i = r[e++] | r[e++] << 8, s = r[e++], o = s >> 7, l = 1 << (7 & s) + 1;
  r[e++], r[e++];
  var u = null, f = null;
  o && (u = e, f = l, e += 3 * l);
  var g = !0, y = [], b = 0, N = null, p = 0, O = null;
  for (this.width = n, this.height = i; g && e < r.length; ) switch (r[e++]) {
    case 33:
      switch (r[e++]) {
        case 255:
          if (r[e] !== 11 || r[e + 1] == 78 && r[e + 2] == 69 && r[e + 3] == 84 && r[e + 4] == 83 && r[e + 5] == 67 && r[e + 6] == 65 && r[e + 7] == 80 && r[e + 8] == 69 && r[e + 9] == 50 && r[e + 10] == 46 && r[e + 11] == 48 && r[e + 12] == 3 && r[e + 13] == 1 && r[e + 16] == 0) e += 14, O = r[e++] | r[e++] << 8, e++;
          else for (e += 12; ; ) {
            if (!((P = r[e++]) >= 0)) throw Error("Invalid block size");
            if (P === 0) break;
            e += P;
          }
          break;
        case 249:
          if (r[e++] !== 4 || r[e + 4] !== 0) throw new Error("Invalid graphics extension block.");
          var k = r[e++];
          b = r[e++] | r[e++] << 8, N = r[e++], !(1 & k) && (N = null), p = k >> 2 & 7, e++;
          break;
        case 254:
          for (; ; ) {
            if (!((P = r[e++]) >= 0)) throw Error("Invalid block size");
            if (P === 0) break;
            e += P;
          }
          break;
        default:
          throw new Error("Unknown graphic control label: 0x" + r[e - 1].toString(16));
      }
      break;
    case 44:
      var B = r[e++] | r[e++] << 8, _ = r[e++] | r[e++] << 8, E = r[e++] | r[e++] << 8, G = r[e++] | r[e++] << 8, at = r[e++], lt = at >> 6 & 1, wt = 1 << (7 & at) + 1, tt = u, z = f, rt = !1;
      at >> 7 && (rt = !0, tt = e, z = wt, e += 3 * wt);
      var dt = e;
      for (e++; ; ) {
        var P;
        if (!((P = r[e++]) >= 0)) throw Error("Invalid block size");
        if (P === 0) break;
        e += P;
      }
      y.push({ x: B, y: _, width: E, height: G, has_local_palette: rt, palette_offset: tt, palette_size: z, data_offset: dt, data_length: e - dt, transparent_index: N, interlaced: !!lt, delay: b, disposal: p });
      break;
    case 59:
      g = !1;
      break;
    default:
      throw new Error("Unknown gif block: 0x" + r[e - 1].toString(16));
  }
  this.numFrames = function() {
    return y.length;
  }, this.loopCount = function() {
    return O;
  }, this.frameInfo = function(C) {
    if (C < 0 || C >= y.length) throw new Error("Frame index out of range.");
    return y[C];
  }, this.decodeAndBlitFrameBGRA = function(C, W) {
    var q = this.frameInfo(C), st = q.width * q.height, it = new Uint8Array(st);
    Cc(r, q.data_offset, it, st);
    var ht = q.palette_offset, Z = q.transparent_index;
    Z === null && (Z = 256);
    var ut = q.width, pt = n - ut, It = ut, L = 4 * (q.y * n + q.x), F = 4 * ((q.y + q.height) * n + q.x), M = L, T = 4 * pt;
    q.interlaced === !0 && (T += 4 * n * 7);
    for (var Y = 8, Q = 0, et = it.length; Q < et; ++Q) {
      var nt = it[Q];
      if (It === 0 && (It = ut, (M += T) >= F && (T = 4 * pt + 4 * n * (Y - 1), M = L + (ut + pt) * (Y << 1), Y >>= 1)), nt === Z) M += 4;
      else {
        var At = r[ht + 3 * nt], Lt = r[ht + 3 * nt + 1], Ct = r[ht + 3 * nt + 2];
        W[M++] = Ct, W[M++] = Lt, W[M++] = At, W[M++] = 255;
      }
      --It;
    }
  }, this.decodeAndBlitFrameRGBA = function(C, W) {
    var q = this.frameInfo(C), st = q.width * q.height, it = new Uint8Array(st);
    Cc(r, q.data_offset, it, st);
    var ht = q.palette_offset, Z = q.transparent_index;
    Z === null && (Z = 256);
    var ut = q.width, pt = n - ut, It = ut, L = 4 * (q.y * n + q.x), F = 4 * ((q.y + q.height) * n + q.x), M = L, T = 4 * pt;
    q.interlaced === !0 && (T += 4 * n * 7);
    for (var Y = 8, Q = 0, et = it.length; Q < et; ++Q) {
      var nt = it[Q];
      if (It === 0 && (It = ut, (M += T) >= F && (T = 4 * pt + 4 * n * (Y - 1), M = L + (ut + pt) * (Y << 1), Y >>= 1)), nt === Z) M += 4;
      else {
        var At = r[ht + 3 * nt], Lt = r[ht + 3 * nt + 1], Ct = r[ht + 3 * nt + 2];
        W[M++] = At, W[M++] = Lt, W[M++] = Ct, W[M++] = 255;
      }
      --It;
    }
  };
}
function Cc(r, e, n, i) {
  for (var s = r[e++], o = 1 << s, l = o + 1, u = l + 1, f = s + 1, g = (1 << f) - 1, y = 0, b = 0, N = 0, p = r[e++], O = new Int32Array(4096), k = null; ; ) {
    for (; y < 16 && p !== 0; ) b |= r[e++] << y, y += 8, p === 1 ? p = r[e++] : --p;
    if (y < f) break;
    var B = b & g;
    if (b >>= f, y -= f, B !== o) {
      if (B === l) break;
      for (var _ = B < u ? B : k, E = 0, G = _; G > o; ) G = O[G] >> 8, ++E;
      var at = G;
      if (N + E + (_ !== B ? 1 : 0) > i) return void be.log("Warning, gif stream longer than expected.");
      n[N++] = at;
      var lt = N += E;
      for (_ !== B && (n[N++] = at), G = _; E--; ) G = O[G], n[--lt] = 255 & G, G >>= 8;
      k !== null && u < 4096 && (O[u++] = k << 8 | at, u >= g + 1 && f < 12 && (++f, g = g << 1 | 1)), k = B;
    } else u = l + 1, g = (1 << (f = s + 1)) - 1, k = null;
  }
  return N !== i && be.log("Warning, gif stream shorter than expected."), n;
}
/**
 * @license
  Copyright (c) 2008, Adobe Systems Incorporated
  All rights reserved.

  Redistribution and use in source and binary forms, with or without 
  modification, are permitted provided that the following conditions are
  met:

  * Redistributions of source code must retain the above copyright notice, 
    this list of conditions and the following disclaimer.
  
  * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the 
    documentation and/or other materials provided with the distribution.
  
  * Neither the name of Adobe Systems Incorporated nor the names of its 
    contributors may be used to endorse or promote products derived from 
    this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR 
  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function xs(r) {
  var e, n, i, s, o, l = Math.floor, u = new Array(64), f = new Array(64), g = new Array(64), y = new Array(64), b = new Array(65535), N = new Array(65535), p = new Array(64), O = new Array(64), k = [], B = 0, _ = 7, E = new Array(64), G = new Array(64), at = new Array(64), lt = new Array(256), wt = new Array(2048), tt = [0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63], z = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], rt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], dt = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125], P = [1, 2, 3, 0, 4, 17, 5, 18, 33, 49, 65, 6, 19, 81, 97, 7, 34, 113, 20, 50, 129, 145, 161, 8, 35, 66, 177, 193, 21, 82, 209, 240, 36, 51, 98, 114, 130, 9, 10, 22, 23, 24, 25, 26, 37, 38, 39, 40, 41, 42, 52, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250], C = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], W = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], q = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119], st = [0, 1, 2, 3, 17, 4, 5, 33, 49, 6, 18, 65, 81, 7, 97, 113, 19, 34, 50, 129, 8, 20, 66, 145, 161, 177, 193, 9, 35, 51, 82, 240, 21, 98, 114, 209, 10, 22, 36, 52, 225, 37, 241, 23, 24, 25, 26, 38, 39, 40, 41, 42, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 130, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 226, 227, 228, 229, 230, 231, 232, 233, 234, 242, 243, 244, 245, 246, 247, 248, 249, 250];
  function it(L, F) {
    for (var M = 0, T = 0, Y = new Array(), Q = 1; Q <= 16; Q++) {
      for (var et = 1; et <= L[Q]; et++) Y[F[T]] = [], Y[F[T]][0] = M, Y[F[T]][1] = Q, T++, M++;
      M *= 2;
    }
    return Y;
  }
  function ht(L) {
    for (var F = L[0], M = L[1] - 1; M >= 0; ) F & 1 << M && (B |= 1 << _), M--, --_ < 0 && (B == 255 ? (Z(255), Z(0)) : Z(B), _ = 7, B = 0);
  }
  function Z(L) {
    k.push(L);
  }
  function ut(L) {
    Z(L >> 8 & 255), Z(255 & L);
  }
  function pt(L, F, M, T, Y) {
    for (var Q, et = Y[0], nt = Y[240], At = function(xt, Nt) {
      var Ft, kt, Dt, Gt, Qt, te, ae, pe, Wt, ee, jt = 0;
      for (Wt = 0; Wt < 8; ++Wt) {
        Ft = xt[jt], kt = xt[jt + 1], Dt = xt[jt + 2], Gt = xt[jt + 3], Qt = xt[jt + 4], te = xt[jt + 5], ae = xt[jt + 6];
        var Ye = Ft + (pe = xt[jt + 7]), se = Ft - pe, Pn = kt + ae, me = kt - ae, Le = Dt + te, Hn = Dt - te, le = Gt + Qt, Er = Gt - Qt, Ne = Ye + le, kn = Ye - le, rr = Pn + Le, Se = Pn - Le;
        xt[jt] = Ne + rr, xt[jt + 4] = Ne - rr;
        var Jt = 0.707106781 * (Se + kn);
        xt[jt + 2] = kn + Jt, xt[jt + 6] = kn - Jt;
        var he = 0.382683433 * ((Ne = Er + Hn) - (Se = me + se)), Br = 0.5411961 * Ne + he, Ve = 1.306562965 * Se + he, Wn = 0.707106781 * (rr = Hn + me), Vn = se + Wn, Tt = se - Wn;
        xt[jt + 5] = Tt + Br, xt[jt + 3] = Tt - Br, xt[jt + 1] = Vn + Ve, xt[jt + 7] = Vn - Ve, jt += 8;
      }
      for (jt = 0, Wt = 0; Wt < 8; ++Wt) {
        Ft = xt[jt], kt = xt[jt + 8], Dt = xt[jt + 16], Gt = xt[jt + 24], Qt = xt[jt + 32], te = xt[jt + 40], ae = xt[jt + 48];
        var Cn = Ft + (pe = xt[jt + 56]), Gn = Ft - pe, on = kt + ae, Re = kt - ae, Be = Dt + te, dn = Dt - te, Kr = Gt + Qt, ir = Gt - Qt, In = Cn + Kr, Fn = Cn - Kr, jn = on + Be, Jn = on - Be;
        xt[jt] = In + jn, xt[jt + 32] = In - jn;
        var yn = 0.707106781 * (Jn + Fn);
        xt[jt + 16] = Fn + yn, xt[jt + 48] = Fn - yn;
        var Yn = 0.382683433 * ((In = ir + dn) - (Jn = Re + Gn)), Mr = 0.5411961 * In + Yn, Zr = 1.306562965 * Jn + Yn, Qr = 0.707106781 * (jn = dn + Re), ti = Gn + Qr, ei = Gn - Qr;
        xt[jt + 40] = ei + Mr, xt[jt + 24] = ei - Mr, xt[jt + 8] = ti + Zr, xt[jt + 56] = ti - Zr, jt++;
      }
      for (Wt = 0; Wt < 64; ++Wt) ee = xt[Wt] * Nt[Wt], p[Wt] = ee > 0 ? ee + 0.5 | 0 : ee - 0.5 | 0;
      return p;
    }(L, F), Lt = 0; Lt < 64; ++Lt) O[tt[Lt]] = At[Lt];
    var Ct = O[0] - M;
    M = O[0], Ct == 0 ? ht(T[0]) : (ht(T[N[Q = 32767 + Ct]]), ht(b[Q]));
    for (var _t = 63; _t > 0 && O[_t] == 0; ) _t--;
    if (_t == 0) return ht(et), M;
    for (var zt, ft = 1; ft <= _t; ) {
      for (var D = ft; O[ft] == 0 && ft <= _t; ) ++ft;
      var $t = ft - D;
      if ($t >= 16) {
        zt = $t >> 4;
        for (var Mt = 1; Mt <= zt; ++Mt) ht(nt);
        $t &= 15;
      }
      Q = 32767 + O[ft], ht(Y[($t << 4) + N[Q]]), ht(b[Q]), ft++;
    }
    return _t != 63 && ht(et), M;
  }
  function It(L) {
    L = Math.min(Math.max(L, 1), 100), o != L && (function(F) {
      for (var M = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99], T = 0; T < 64; T++) {
        var Y = l((M[T] * F + 50) / 100);
        Y = Math.min(Math.max(Y, 1), 255), u[tt[T]] = Y;
      }
      for (var Q = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99], et = 0; et < 64; et++) {
        var nt = l((Q[et] * F + 50) / 100);
        nt = Math.min(Math.max(nt, 1), 255), f[tt[et]] = nt;
      }
      for (var At = [1, 1.387039845, 1.306562965, 1.175875602, 1, 0.785694958, 0.5411961, 0.275899379], Lt = 0, Ct = 0; Ct < 8; Ct++) for (var _t = 0; _t < 8; _t++) g[Lt] = 1 / (u[tt[Lt]] * At[Ct] * At[_t] * 8), y[Lt] = 1 / (f[tt[Lt]] * At[Ct] * At[_t] * 8), Lt++;
    }(L < 50 ? Math.floor(5e3 / L) : Math.floor(200 - 2 * L)), o = L);
  }
  this.encode = function(L, F) {
    F && It(F), k = new Array(), B = 0, _ = 7, ut(65496), ut(65504), ut(16), Z(74), Z(70), Z(73), Z(70), Z(0), Z(1), Z(1), Z(0), ut(1), ut(1), Z(0), Z(0), function() {
      ut(65499), ut(132), Z(0);
      for (var kt = 0; kt < 64; kt++) Z(u[kt]);
      Z(1);
      for (var Dt = 0; Dt < 64; Dt++) Z(f[Dt]);
    }(), function(kt, Dt) {
      ut(65472), ut(17), Z(8), ut(Dt), ut(kt), Z(3), Z(1), Z(17), Z(0), Z(2), Z(17), Z(1), Z(3), Z(17), Z(1);
    }(L.width, L.height), function() {
      ut(65476), ut(418), Z(0);
      for (var kt = 0; kt < 16; kt++) Z(z[kt + 1]);
      for (var Dt = 0; Dt <= 11; Dt++) Z(rt[Dt]);
      Z(16);
      for (var Gt = 0; Gt < 16; Gt++) Z(dt[Gt + 1]);
      for (var Qt = 0; Qt <= 161; Qt++) Z(P[Qt]);
      Z(1);
      for (var te = 0; te < 16; te++) Z(C[te + 1]);
      for (var ae = 0; ae <= 11; ae++) Z(W[ae]);
      Z(17);
      for (var pe = 0; pe < 16; pe++) Z(q[pe + 1]);
      for (var Wt = 0; Wt <= 161; Wt++) Z(st[Wt]);
    }(), ut(65498), ut(12), Z(3), Z(1), Z(0), Z(2), Z(17), Z(3), Z(17), Z(0), Z(63), Z(0);
    var M = 0, T = 0, Y = 0;
    B = 0, _ = 7, this.encode.displayName = "_encode_";
    for (var Q, et, nt, At, Lt, Ct, _t, zt, ft, D = L.data, $t = L.width, Mt = L.height, xt = 4 * $t, Nt = 0; Nt < Mt; ) {
      for (Q = 0; Q < xt; ) {
        for (Lt = xt * Nt + Q, _t = -1, zt = 0, ft = 0; ft < 64; ft++) Ct = Lt + (zt = ft >> 3) * xt + (_t = 4 * (7 & ft)), Nt + zt >= Mt && (Ct -= xt * (Nt + 1 + zt - Mt)), Q + _t >= xt && (Ct -= Q + _t - xt + 4), et = D[Ct++], nt = D[Ct++], At = D[Ct++], E[ft] = (wt[et] + wt[nt + 256 >> 0] + wt[At + 512 >> 0] >> 16) - 128, G[ft] = (wt[et + 768 >> 0] + wt[nt + 1024 >> 0] + wt[At + 1280 >> 0] >> 16) - 128, at[ft] = (wt[et + 1280 >> 0] + wt[nt + 1536 >> 0] + wt[At + 1792 >> 0] >> 16) - 128;
        M = pt(E, g, M, e, i), T = pt(G, y, T, n, s), Y = pt(at, y, Y, n, s), Q += 32;
      }
      Nt += 8;
    }
    if (_ >= 0) {
      var Ft = [];
      Ft[1] = _ + 1, Ft[0] = (1 << _ + 1) - 1, ht(Ft);
    }
    return ut(65497), new Uint8Array(k);
  }, r = r || 50, function() {
    for (var L = String.fromCharCode, F = 0; F < 256; F++) lt[F] = L(F);
  }(), e = it(z, rt), n = it(C, W), i = it(dt, P), s = it(q, st), function() {
    for (var L = 1, F = 2, M = 1; M <= 15; M++) {
      for (var T = L; T < F; T++) N[32767 + T] = M, b[32767 + T] = [], b[32767 + T][1] = M, b[32767 + T][0] = T;
      for (var Y = -(F - 1); Y <= -L; Y++) N[32767 + Y] = M, b[32767 + Y] = [], b[32767 + Y][1] = M, b[32767 + Y][0] = F - 1 + Y;
      L <<= 1, F <<= 1;
    }
  }(), function() {
    for (var L = 0; L < 256; L++) wt[L] = 19595 * L, wt[L + 256 >> 0] = 38470 * L, wt[L + 512 >> 0] = 7471 * L + 32768, wt[L + 768 >> 0] = -11059 * L, wt[L + 1024 >> 0] = -21709 * L, wt[L + 1280 >> 0] = 32768 * L + 8421375, wt[L + 1536 >> 0] = -27439 * L, wt[L + 1792 >> 0] = -5329 * L;
  }(), It(r);
}
/**
 * @license
 * Copyright (c) 2017 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function Rn(r, e) {
  if (this.pos = 0, this.buffer = r, this.datav = new DataView(r.buffer), this.is_with_alpha = !!e, this.bottom_up = !0, this.flag = String.fromCharCode(this.buffer[0]) + String.fromCharCode(this.buffer[1]), this.pos += 2, ["BM", "BA", "CI", "CP", "IC", "PT"].indexOf(this.flag) === -1) throw new Error("Invalid BMP File");
  this.parseHeader(), this.parseBGR();
}
function Ic(r) {
  function e(z) {
    if (!z) throw Error("assert :P");
  }
  function n(z, rt, dt) {
    for (var P = 0; 4 > P; P++) if (z[rt + P] != dt.charCodeAt(P)) return !0;
    return !1;
  }
  function i(z, rt, dt, P, C) {
    for (var W = 0; W < C; W++) z[rt + W] = dt[P + W];
  }
  function s(z, rt, dt, P) {
    for (var C = 0; C < P; C++) z[rt + C] = dt;
  }
  function o(z) {
    return new Int32Array(z);
  }
  function l(z, rt) {
    for (var dt = [], P = 0; P < z; P++) dt.push(new rt());
    return dt;
  }
  function u(z, rt) {
    var dt = [];
    return function P(C, W, q) {
      for (var st = q[W], it = 0; it < st && (C.push(q.length > W + 1 ? [] : new rt()), !(q.length < W + 1)); it++) P(C[it], W + 1, q);
    }(dt, 0, z), dt;
  }
  var f = function() {
    var z = this;
    function rt(t, a) {
      for (var h = 1 << a - 1 >>> 0; t & h; ) h >>>= 1;
      return h ? (t & h - 1) + h : t;
    }
    function dt(t, a, h, d, m) {
      e(!(d % h));
      do
        t[a + (d -= h)] = m;
      while (0 < d);
    }
    function P(t, a, h, d, m) {
      if (e(2328 >= m), 512 >= m) var w = o(512);
      else if ((w = o(m)) == null) return 0;
      return function(x, A, S, I, U, $) {
        var K, J, vt = A, ot = 1 << S, H = o(16), V = o(16);
        for (e(U != 0), e(I != null), e(x != null), e(0 < S), J = 0; J < U; ++J) {
          if (15 < I[J]) return 0;
          ++H[I[J]];
        }
        if (H[0] == U) return 0;
        for (V[1] = 0, K = 1; 15 > K; ++K) {
          if (H[K] > 1 << K) return 0;
          V[K + 1] = V[K] + H[K];
        }
        for (J = 0; J < U; ++J) K = I[J], 0 < I[J] && ($[V[K]++] = J);
        if (V[15] == 1) return (I = new C()).g = 0, I.value = $[0], dt(x, vt, 1, ot, I), ot;
        var gt, bt = -1, mt = ot - 1, Et = 0, St = 1, Rt = 1, Pt = 1 << S;
        for (J = 0, K = 1, U = 2; K <= S; ++K, U <<= 1) {
          if (St += Rt <<= 1, 0 > (Rt -= H[K])) return 0;
          for (; 0 < H[K]; --H[K]) (I = new C()).g = K, I.value = $[J++], dt(x, vt + Et, U, Pt, I), Et = rt(Et, K);
        }
        for (K = S + 1, U = 2; 15 >= K; ++K, U <<= 1) {
          if (St += Rt <<= 1, 0 > (Rt -= H[K])) return 0;
          for (; 0 < H[K]; --H[K]) {
            if (I = new C(), (Et & mt) != bt) {
              for (vt += Pt, gt = 1 << (bt = K) - S; 15 > bt && !(0 >= (gt -= H[bt])); ) ++bt, gt <<= 1;
              ot += Pt = 1 << (gt = bt - S), x[A + (bt = Et & mt)].g = gt + S, x[A + bt].value = vt - A - bt;
            }
            I.g = K - S, I.value = $[J++], dt(x, vt + (Et >> S), U, Pt, I), Et = rt(Et, K);
          }
        }
        return St != 2 * V[15] - 1 ? 0 : ot;
      }(t, a, h, d, m, w);
    }
    function C() {
      this.value = this.g = 0;
    }
    function W() {
      this.value = this.g = 0;
    }
    function q() {
      this.G = l(5, C), this.H = o(5), this.jc = this.Qb = this.qb = this.nd = 0, this.pd = l(Ge, W);
    }
    function st(t, a, h, d) {
      e(t != null), e(a != null), e(2147483648 > d), t.Ca = 254, t.I = 0, t.b = -8, t.Ka = 0, t.oa = a, t.pa = h, t.Jd = a, t.Yc = h + d, t.Zc = 4 <= d ? h + d - 4 + 1 : h, Q(t);
    }
    function it(t, a) {
      for (var h = 0; 0 < a--; ) h |= nt(t, 128) << a;
      return h;
    }
    function ht(t, a) {
      var h = it(t, a);
      return et(t) ? -h : h;
    }
    function Z(t, a, h, d) {
      var m, w = 0;
      for (e(t != null), e(a != null), e(4294967288 > d), t.Sb = d, t.Ra = 0, t.u = 0, t.h = 0, 4 < d && (d = 4), m = 0; m < d; ++m) w += a[h + m] << 8 * m;
      t.Ra = w, t.bb = d, t.oa = a, t.pa = h;
    }
    function ut(t) {
      for (; 8 <= t.u && t.bb < t.Sb; ) t.Ra >>>= 8, t.Ra += t.oa[t.pa + t.bb] << mi - 8 >>> 0, ++t.bb, t.u -= 8;
      M(t) && (t.h = 1, t.u = 0);
    }
    function pt(t, a) {
      if (e(0 <= a), !t.h && a <= gi) {
        var h = F(t) & pi[a];
        return t.u += a, ut(t), h;
      }
      return t.h = 1, t.u = 0;
    }
    function It() {
      this.b = this.Ca = this.I = 0, this.oa = [], this.pa = 0, this.Jd = [], this.Yc = 0, this.Zc = [], this.Ka = 0;
    }
    function L() {
      this.Ra = 0, this.oa = [], this.h = this.u = this.bb = this.Sb = this.pa = 0;
    }
    function F(t) {
      return t.Ra >>> (t.u & mi - 1) >>> 0;
    }
    function M(t) {
      return e(t.bb <= t.Sb), t.h || t.bb == t.Sb && t.u > mi;
    }
    function T(t, a) {
      t.u = a, t.h = M(t);
    }
    function Y(t) {
      t.u >= ea && (e(t.u >= ea), ut(t));
    }
    function Q(t) {
      e(t != null && t.oa != null), t.pa < t.Zc ? (t.I = (t.oa[t.pa++] | t.I << 8) >>> 0, t.b += 8) : (e(t != null && t.oa != null), t.pa < t.Yc ? (t.b += 8, t.I = t.oa[t.pa++] | t.I << 8) : t.Ka ? t.b = 0 : (t.I <<= 8, t.b += 8, t.Ka = 1));
    }
    function et(t) {
      return it(t, 1);
    }
    function nt(t, a) {
      var h = t.Ca;
      0 > t.b && Q(t);
      var d = t.b, m = h * a >>> 8, w = (t.I >>> d > m) + 0;
      for (w ? (h -= m, t.I -= m + 1 << d >>> 0) : h = m + 1, d = h, m = 0; 256 <= d; ) m += 8, d >>= 8;
      return d = 7 ^ m + cn[d], t.b -= d, t.Ca = (h << d) - 1, w;
    }
    function At(t, a, h) {
      t[a + 0] = h >> 24 & 255, t[a + 1] = h >> 16 & 255, t[a + 2] = h >> 8 & 255, t[a + 3] = h >> 0 & 255;
    }
    function Lt(t, a) {
      return t[a + 0] << 0 | t[a + 1] << 8;
    }
    function Ct(t, a) {
      return Lt(t, a) | t[a + 2] << 16;
    }
    function _t(t, a) {
      return Lt(t, a) | Lt(t, a + 2) << 16;
    }
    function zt(t, a) {
      var h = 1 << a;
      return e(t != null), e(0 < a), t.X = o(h), t.X == null ? 0 : (t.Mb = 32 - a, t.Xa = a, 1);
    }
    function ft(t, a) {
      e(t != null), e(a != null), e(t.Xa == a.Xa), i(a.X, 0, t.X, 0, 1 << a.Xa);
    }
    function D() {
      this.X = [], this.Xa = this.Mb = 0;
    }
    function $t(t, a, h, d) {
      e(h != null), e(d != null);
      var m = h[0], w = d[0];
      return m == 0 && (m = (t * w + a / 2) / a), w == 0 && (w = (a * m + t / 2) / t), 0 >= m || 0 >= w ? 0 : (h[0] = m, d[0] = w, 1);
    }
    function Mt(t, a) {
      return t + (1 << a) - 1 >>> a;
    }
    function xt(t, a) {
      return ((4278255360 & t) + (4278255360 & a) >>> 0 & 4278255360) + ((16711935 & t) + (16711935 & a) >>> 0 & 16711935) >>> 0;
    }
    function Nt(t, a) {
      z[a] = function(h, d, m, w, x, A, S) {
        var I;
        for (I = 0; I < x; ++I) {
          var U = z[t](A[S + I - 1], m, w + I);
          A[S + I] = xt(h[d + I], U);
        }
      };
    }
    function Ft() {
      this.ud = this.hd = this.jd = 0;
    }
    function kt(t, a) {
      return ((4278124286 & (t ^ a)) >>> 1) + (t & a) >>> 0;
    }
    function Dt(t) {
      return 0 <= t && 256 > t ? t : 0 > t ? 0 : 255 < t ? 255 : void 0;
    }
    function Gt(t, a) {
      return Dt(t + (t - a + 0.5 >> 1));
    }
    function Qt(t, a, h) {
      return Math.abs(a - h) - Math.abs(t - h);
    }
    function te(t, a, h, d, m, w, x) {
      for (d = w[x - 1], h = 0; h < m; ++h) w[x + h] = d = xt(t[a + h], d);
    }
    function ae(t, a, h, d, m) {
      var w;
      for (w = 0; w < h; ++w) {
        var x = t[a + w], A = x >> 8 & 255, S = 16711935 & (S = (S = 16711935 & x) + ((A << 16) + A));
        d[m + w] = (4278255360 & x) + S >>> 0;
      }
    }
    function pe(t, a) {
      a.jd = t >> 0 & 255, a.hd = t >> 8 & 255, a.ud = t >> 16 & 255;
    }
    function Wt(t, a, h, d, m, w) {
      var x;
      for (x = 0; x < d; ++x) {
        var A = a[h + x], S = A >>> 8, I = A, U = 255 & (U = (U = A >>> 16) + ((t.jd << 24 >> 24) * (S << 24 >> 24) >>> 5));
        I = 255 & (I = (I = I + ((t.hd << 24 >> 24) * (S << 24 >> 24) >>> 5)) + ((t.ud << 24 >> 24) * (U << 24 >> 24) >>> 5)), m[w + x] = (4278255360 & A) + (U << 16) + I;
      }
    }
    function ee(t, a, h, d, m) {
      z[a] = function(w, x, A, S, I, U, $, K, J) {
        for (S = $; S < K; ++S) for ($ = 0; $ < J; ++$) I[U++] = m(A[d(w[x++])]);
      }, z[t] = function(w, x, A, S, I, U, $) {
        var K = 8 >> w.b, J = w.Ea, vt = w.K[0], ot = w.w;
        if (8 > K) for (w = (1 << w.b) - 1, ot = (1 << K) - 1; x < A; ++x) {
          var H, V = 0;
          for (H = 0; H < J; ++H) H & w || (V = d(S[I++])), U[$++] = m(vt[V & ot]), V >>= K;
        }
        else z["VP8LMapColor" + h](S, I, vt, ot, U, $, x, A, J);
      };
    }
    function jt(t, a, h, d, m) {
      for (h = a + h; a < h; ) {
        var w = t[a++];
        d[m++] = w >> 16 & 255, d[m++] = w >> 8 & 255, d[m++] = w >> 0 & 255;
      }
    }
    function Ye(t, a, h, d, m) {
      for (h = a + h; a < h; ) {
        var w = t[a++];
        d[m++] = w >> 16 & 255, d[m++] = w >> 8 & 255, d[m++] = w >> 0 & 255, d[m++] = w >> 24 & 255;
      }
    }
    function se(t, a, h, d, m) {
      for (h = a + h; a < h; ) {
        var w = (x = t[a++]) >> 16 & 240 | x >> 12 & 15, x = x >> 0 & 240 | x >> 28 & 15;
        d[m++] = w, d[m++] = x;
      }
    }
    function Pn(t, a, h, d, m) {
      for (h = a + h; a < h; ) {
        var w = (x = t[a++]) >> 16 & 248 | x >> 13 & 7, x = x >> 5 & 224 | x >> 3 & 31;
        d[m++] = w, d[m++] = x;
      }
    }
    function me(t, a, h, d, m) {
      for (h = a + h; a < h; ) {
        var w = t[a++];
        d[m++] = w >> 0 & 255, d[m++] = w >> 8 & 255, d[m++] = w >> 16 & 255;
      }
    }
    function Le(t, a, h, d, m, w) {
      if (w == 0) for (h = a + h; a < h; ) At(d, ((w = t[a++])[0] >> 24 | w[1] >> 8 & 65280 | w[2] << 8 & 16711680 | w[3] << 24) >>> 0), m += 32;
      else i(d, m, t, a, h);
    }
    function Hn(t, a) {
      z[a][0] = z[t + "0"], z[a][1] = z[t + "1"], z[a][2] = z[t + "2"], z[a][3] = z[t + "3"], z[a][4] = z[t + "4"], z[a][5] = z[t + "5"], z[a][6] = z[t + "6"], z[a][7] = z[t + "7"], z[a][8] = z[t + "8"], z[a][9] = z[t + "9"], z[a][10] = z[t + "10"], z[a][11] = z[t + "11"], z[a][12] = z[t + "12"], z[a][13] = z[t + "13"], z[a][14] = z[t + "0"], z[a][15] = z[t + "0"];
    }
    function le(t) {
      return t == Zo || t == Qo || t == Ja || t == ts;
    }
    function Er() {
      this.eb = [], this.size = this.A = this.fb = 0;
    }
    function Ne() {
      this.y = [], this.f = [], this.ea = [], this.F = [], this.Tc = this.Ed = this.Cd = this.Fd = this.lb = this.Db = this.Ab = this.fa = this.J = this.W = this.N = this.O = 0;
    }
    function kn() {
      this.Rd = this.height = this.width = this.S = 0, this.f = {}, this.f.RGBA = new Er(), this.f.kb = new Ne(), this.sd = null;
    }
    function rr() {
      this.width = [0], this.height = [0], this.Pd = [0], this.Qd = [0], this.format = [0];
    }
    function Se() {
      this.Id = this.fd = this.Md = this.hb = this.ib = this.da = this.bd = this.cd = this.j = this.v = this.Da = this.Sd = this.ob = 0;
    }
    function Jt(t) {
      return alert("todo:WebPSamplerProcessPlane"), t.T;
    }
    function he(t, a) {
      var h = t.T, d = a.ba.f.RGBA, m = d.eb, w = d.fb + t.ka * d.A, x = Sn[a.ba.S], A = t.y, S = t.O, I = t.f, U = t.N, $ = t.ea, K = t.W, J = a.cc, vt = a.dc, ot = a.Mc, H = a.Nc, V = t.ka, gt = t.ka + t.T, bt = t.U, mt = bt + 1 >> 1;
      for (V == 0 ? x(A, S, null, null, I, U, $, K, I, U, $, K, m, w, null, null, bt) : (x(a.ec, a.fc, A, S, J, vt, ot, H, I, U, $, K, m, w - d.A, m, w, bt), ++h); V + 2 < gt; V += 2) J = I, vt = U, ot = $, H = K, U += t.Rc, K += t.Rc, w += 2 * d.A, x(A, (S += 2 * t.fa) - t.fa, A, S, J, vt, ot, H, I, U, $, K, m, w - d.A, m, w, bt);
      return S += t.fa, t.j + gt < t.o ? (i(a.ec, a.fc, A, S, bt), i(a.cc, a.dc, I, U, mt), i(a.Mc, a.Nc, $, K, mt), h--) : 1 & gt || x(A, S, null, null, I, U, $, K, I, U, $, K, m, w + d.A, null, null, bt), h;
    }
    function Br(t, a, h) {
      var d = t.F, m = [t.J];
      if (d != null) {
        var w = t.U, x = a.ba.S, A = x == Ga || x == Ja;
        a = a.ba.f.RGBA;
        var S = [0], I = t.ka;
        S[0] = t.T, t.Kb && (I == 0 ? --S[0] : (--I, m[0] -= t.width), t.j + t.ka + t.T == t.o && (S[0] = t.o - t.j - I));
        var U = a.eb;
        I = a.fb + I * a.A, t = we(d, m[0], t.width, w, S, U, I + (A ? 0 : 3), a.A), e(h == S), t && le(x) && An(U, I, A, w, S, a.A);
      }
      return 0;
    }
    function Ve(t) {
      var a = t.ma, h = a.ba.S, d = 11 > h, m = h == Wa || h == Va || h == Ga || h == Ko || h == 12 || le(h);
      if (a.memory = null, a.Ib = null, a.Jb = null, a.Nd = null, !Qi(a.Oa, t, m ? 11 : 12)) return 0;
      if (m && le(h) && yt(), t.da) alert("todo:use_scaling");
      else {
        if (d) {
          if (a.Ib = Jt, t.Kb) {
            if (h = t.U + 1 >> 1, a.memory = o(t.U + 2 * h), a.memory == null) return 0;
            a.ec = a.memory, a.fc = 0, a.cc = a.ec, a.dc = a.fc + t.U, a.Mc = a.cc, a.Nc = a.dc + h, a.Ib = he, yt();
          }
        } else alert("todo:EmitYUV");
        m && (a.Jb = Br, d && X());
      }
      if (d && !Js) {
        for (t = 0; 256 > t; ++t) bl[t] = 89858 * (t - 128) + Xa >> Ya, xl[t] = -22014 * (t - 128) + Xa, wl[t] = -45773 * (t - 128), yl[t] = 113618 * (t - 128) + Xa >> Ya;
        for (t = ca; t < rs; ++t) a = 76283 * (t - 16) + Xa >> Ya, Ll[t - ca] = pn(a, 255), Al[t - ca] = pn(a + 8 >> 4, 15);
        Js = 1;
      }
      return 1;
    }
    function Wn(t) {
      var a = t.ma, h = t.U, d = t.T;
      return e(!(1 & t.ka)), 0 >= h || 0 >= d ? 0 : (h = a.Ib(t, a), a.Jb != null && a.Jb(t, a, h), a.Dc += h, 1);
    }
    function Vn(t) {
      t.ma.memory = null;
    }
    function Tt(t, a, h, d) {
      return pt(t, 8) != 47 ? 0 : (a[0] = pt(t, 14) + 1, h[0] = pt(t, 14) + 1, d[0] = pt(t, 1), pt(t, 3) != 0 ? 0 : !t.h);
    }
    function Cn(t, a) {
      if (4 > t) return t + 1;
      var h = t - 2 >> 1;
      return (2 + (1 & t) << h) + pt(a, h) + 1;
    }
    function Gn(t, a) {
      return 120 < a ? a - 120 : 1 <= (h = ((h = il[a - 1]) >> 4) * t + (8 - (15 & h))) ? h : 1;
      var h;
    }
    function on(t, a, h) {
      var d = F(h), m = t[a += 255 & d].g - 8;
      return 0 < m && (T(h, h.u + 8), d = F(h), a += t[a].value, a += d & (1 << m) - 1), T(h, h.u + t[a].g), t[a].value;
    }
    function Re(t, a, h) {
      return h.g += t.g, h.value += t.value << a >>> 0, e(8 >= h.g), t.g;
    }
    function Be(t, a, h) {
      var d = t.xc;
      return e((a = d == 0 ? 0 : t.vc[t.md * (h >> d) + (a >> d)]) < t.Wb), t.Ya[a];
    }
    function dn(t, a, h, d) {
      var m = t.ab, w = t.c * a, x = t.C;
      a = x + a;
      var A = h, S = d;
      for (d = t.Ta, h = t.Ua; 0 < m--; ) {
        var I = t.gc[m], U = x, $ = a, K = A, J = S, vt = (S = d, A = h, I.Ea);
        switch (e(U < $), e($ <= I.nc), I.hc) {
          case 2:
            Da(K, J, ($ - U) * vt, S, A);
            break;
          case 0:
            var ot = U, H = $, V = S, gt = A, bt = (Pt = I).Ea;
            ot == 0 && (Xo(K, J, null, null, 1, V, gt), te(K, J + 1, 0, 0, bt - 1, V, gt + 1), J += bt, gt += bt, ++ot);
            for (var mt = 1 << Pt.b, Et = mt - 1, St = Mt(bt, Pt.b), Rt = Pt.K, Pt = Pt.w + (ot >> Pt.b) * St; ot < H; ) {
              var ce = Rt, ue = Pt, oe = 1;
              for (na(K, J, V, gt - bt, 1, V, gt); oe < bt; ) {
                var ne = (oe & ~Et) + mt;
                ne > bt && (ne = bt), (0, br[ce[ue++] >> 8 & 15])(K, J + +oe, V, gt + oe - bt, ne - oe, V, gt + oe), oe = ne;
              }
              J += bt, gt += bt, ++ot & Et || (Pt += St);
            }
            $ != I.nc && i(S, A - vt, S, A + ($ - U - 1) * vt, vt);
            break;
          case 1:
            for (vt = K, H = J, bt = (K = I.Ea) - (gt = K & ~(V = (J = 1 << I.b) - 1)), ot = Mt(K, I.b), mt = I.K, I = I.w + (U >> I.b) * ot; U < $; ) {
              for (Et = mt, St = I, Rt = new Ft(), Pt = H + gt, ce = H + K; H < Pt; ) pe(Et[St++], Rt), zr(Rt, vt, H, J, S, A), H += J, A += J;
              H < ce && (pe(Et[St++], Rt), zr(Rt, vt, H, bt, S, A), H += bt, A += bt), ++U & V || (I += ot);
            }
            break;
          case 3:
            if (K == S && J == A && 0 < I.b) {
              for (H = S, K = vt = A + ($ - U) * vt - (gt = ($ - U) * Mt(I.Ea, I.b)), J = S, V = A, ot = [], gt = (bt = gt) - 1; 0 <= gt; --gt) ot[gt] = J[V + gt];
              for (gt = bt - 1; 0 <= gt; --gt) H[K + gt] = ot[gt];
              wn(I, U, $, S, vt, S, A);
            } else wn(I, U, $, K, J, S, A);
        }
        A = d, S = h;
      }
      S != h && i(d, h, A, S, w);
    }
    function Kr(t, a) {
      var h = t.V, d = t.Ba + t.c * t.C, m = a - t.C;
      if (e(a <= t.l.o), e(16 >= m), 0 < m) {
        var w = t.l, x = t.Ta, A = t.Ua, S = w.width;
        if (dn(t, m, h, d), m = A = [A], e((h = t.C) < (d = a)), e(w.v < w.va), d > w.o && (d = w.o), h < w.j) {
          var I = w.j - h;
          h = w.j, m[0] += I * S;
        }
        if (h >= d ? h = 0 : (m[0] += 4 * w.v, w.ka = h - w.j, w.U = w.va - w.v, w.T = d - h, h = 1), h) {
          if (A = A[0], 11 > (h = t.ca).S) {
            var U = h.f.RGBA, $ = (d = h.S, m = w.U, w = w.T, I = U.eb, U.A), K = w;
            for (U = U.fb + t.Ma * U.A; 0 < K--; ) {
              var J = x, vt = A, ot = m, H = I, V = U;
              switch (d) {
                case Ha:
                  ln(J, vt, ot, H, V);
                  break;
                case Wa:
                  nn(J, vt, ot, H, V);
                  break;
                case Zo:
                  nn(J, vt, ot, H, V), An(H, V, 0, ot, 1, 0);
                  break;
                case Ds:
                  cr(J, vt, ot, H, V);
                  break;
                case Va:
                  Le(J, vt, ot, H, V, 1);
                  break;
                case Qo:
                  Le(J, vt, ot, H, V, 1), An(H, V, 0, ot, 1, 0);
                  break;
                case Ga:
                  Le(J, vt, ot, H, V, 0);
                  break;
                case Ja:
                  Le(J, vt, ot, H, V, 0), An(H, V, 1, ot, 1, 0);
                  break;
                case Ko:
                  yr(J, vt, ot, H, V);
                  break;
                case ts:
                  yr(J, vt, ot, H, V), ye(H, V, ot, 1, 0);
                  break;
                case qs:
                  sr(J, vt, ot, H, V);
                  break;
                default:
                  e(0);
              }
              A += S, U += $;
            }
            t.Ma += w;
          } else alert("todo:EmitRescaledRowsYUVA");
          e(t.Ma <= h.height);
        }
      }
      t.C = a, e(t.C <= t.i);
    }
    function ir(t) {
      var a;
      if (0 < t.ua) return 0;
      for (a = 0; a < t.Wb; ++a) {
        var h = t.Ya[a].G, d = t.Ya[a].H;
        if (0 < h[1][d[1] + 0].g || 0 < h[2][d[2] + 0].g || 0 < h[3][d[3] + 0].g) return 0;
      }
      return 1;
    }
    function In(t, a, h, d, m, w) {
      if (t.Z != 0) {
        var x = t.qd, A = t.rd;
        for (e(Ar[t.Z] != null); a < h; ++a) Ar[t.Z](x, A, d, m, d, m, w), x = d, A = m, m += w;
        t.qd = x, t.rd = A;
      }
    }
    function Fn(t, a) {
      var h = t.l.ma, d = h.Z == 0 || h.Z == 1 ? t.l.j : t.C;
      if (d = t.C < d ? d : t.C, e(a <= t.l.o), a > d) {
        var m = t.l.width, w = h.ca, x = h.tb + m * d, A = t.V, S = t.Ba + t.c * d, I = t.gc;
        e(t.ab == 1), e(I[0].hc == 3), qa(I[0], d, a, A, S, w, x), In(h, d, a, w, x, m);
      }
      t.C = t.Ma = a;
    }
    function jn(t, a, h, d, m, w, x) {
      var A = t.$ / d, S = t.$ % d, I = t.m, U = t.s, $ = h + t.$, K = $;
      m = h + d * m;
      var J = h + d * w, vt = 280 + U.ua, ot = t.Pb ? A : 16777216, H = 0 < U.ua ? U.Wa : null, V = U.wc, gt = $ < J ? Be(U, S, A) : null;
      e(t.C < w), e(J <= m);
      var bt = !1;
      t: for (; ; ) {
        for (; bt || $ < J; ) {
          var mt = 0;
          if (A >= ot) {
            var Et = $ - h;
            e((ot = t).Pb), ot.wd = ot.m, ot.xd = Et, 0 < ot.s.ua && ft(ot.s.Wa, ot.s.vb), ot = A + ol;
          }
          if (S & V || (gt = Be(U, S, A)), e(gt != null), gt.Qb && (a[$] = gt.qb, bt = !0), !bt) if (Y(I), gt.jc) {
            mt = I, Et = a;
            var St = $, Rt = gt.pd[F(mt) & Ge - 1];
            e(gt.jc), 256 > Rt.g ? (T(mt, mt.u + Rt.g), Et[St] = Rt.value, mt = 0) : (T(mt, mt.u + Rt.g - 256), e(256 <= Rt.value), mt = Rt.value), mt == 0 && (bt = !0);
          } else mt = on(gt.G[0], gt.H[0], I);
          if (I.h) break;
          if (bt || 256 > mt) {
            if (!bt) if (gt.nd) a[$] = (gt.qb | mt << 8) >>> 0;
            else {
              if (Y(I), bt = on(gt.G[1], gt.H[1], I), Y(I), Et = on(gt.G[2], gt.H[2], I), St = on(gt.G[3], gt.H[3], I), I.h) break;
              a[$] = (St << 24 | bt << 16 | mt << 8 | Et) >>> 0;
            }
            if (bt = !1, ++$, ++S >= d && (S = 0, ++A, x != null && A <= w && !(A % 16) && x(t, A), H != null)) for (; K < $; ) mt = a[K++], H.X[(506832829 * mt & 4294967295) >>> H.Mb] = mt;
          } else if (280 > mt) {
            if (mt = Cn(mt - 256, I), Et = on(gt.G[4], gt.H[4], I), Y(I), Et = Gn(d, Et = Cn(Et, I)), I.h) break;
            if ($ - h < Et || m - $ < mt) break t;
            for (St = 0; St < mt; ++St) a[$ + St] = a[$ + St - Et];
            for ($ += mt, S += mt; S >= d; ) S -= d, ++A, x != null && A <= w && !(A % 16) && x(t, A);
            if (e($ <= m), S & V && (gt = Be(U, S, A)), H != null) for (; K < $; ) mt = a[K++], H.X[(506832829 * mt & 4294967295) >>> H.Mb] = mt;
          } else {
            if (!(mt < vt)) break t;
            for (bt = mt - 280, e(H != null); K < $; ) mt = a[K++], H.X[(506832829 * mt & 4294967295) >>> H.Mb] = mt;
            mt = $, e(!(bt >>> (Et = H).Xa)), a[mt] = Et.X[bt], bt = !0;
          }
          bt || e(I.h == M(I));
        }
        if (t.Pb && I.h && $ < m) e(t.m.h), t.a = 5, t.m = t.wd, t.$ = t.xd, 0 < t.s.ua && ft(t.s.vb, t.s.Wa);
        else {
          if (I.h) break t;
          x != null && x(t, A > w ? w : A), t.a = 0, t.$ = $ - h;
        }
        return 1;
      }
      return t.a = 3, 0;
    }
    function Jn(t) {
      e(t != null), t.vc = null, t.yc = null, t.Ya = null;
      var a = t.Wa;
      a != null && (a.X = null), t.vb = null, e(t != null);
    }
    function yn() {
      var t = new Yo();
      return t == null ? null : (t.a = 0, t.xb = zs, Hn("Predictor", "VP8LPredictors"), Hn("Predictor", "VP8LPredictors_C"), Hn("PredictorAdd", "VP8LPredictorsAdd"), Hn("PredictorAdd", "VP8LPredictorsAdd_C"), Da = ae, zr = Wt, ln = jt, nn = Ye, yr = se, sr = Pn, cr = me, z.VP8LMapColor32b = vi, z.VP8LMapColor8b = Ra, t);
    }
    function Yn(t, a, h, d, m) {
      var w = 1, x = [t], A = [a], S = d.m, I = d.s, U = null, $ = 0;
      t: for (; ; ) {
        if (h) for (; w && pt(S, 1); ) {
          var K = x, J = A, vt = d, ot = 1, H = vt.m, V = vt.gc[vt.ab], gt = pt(H, 2);
          if (vt.Oc & 1 << gt) w = 0;
          else {
            switch (vt.Oc |= 1 << gt, V.hc = gt, V.Ea = K[0], V.nc = J[0], V.K = [null], ++vt.ab, e(4 >= vt.ab), gt) {
              case 0:
              case 1:
                V.b = pt(H, 3) + 2, ot = Yn(Mt(V.Ea, V.b), Mt(V.nc, V.b), 0, vt, V.K), V.K = V.K[0];
                break;
              case 3:
                var bt, mt = pt(H, 8) + 1, Et = 16 < mt ? 0 : 4 < mt ? 1 : 2 < mt ? 2 : 3;
                if (K[0] = Mt(V.Ea, Et), V.b = Et, bt = ot = Yn(mt, 1, 0, vt, V.K)) {
                  var St, Rt = mt, Pt = V, ce = 1 << (8 >> Pt.b), ue = o(ce);
                  if (ue == null) bt = 0;
                  else {
                    var oe = Pt.K[0], ne = Pt.w;
                    for (ue[0] = Pt.K[0][0], St = 1; St < 1 * Rt; ++St) ue[St] = xt(oe[ne + St], ue[St - 1]);
                    for (; St < 4 * ce; ++St) ue[St] = 0;
                    Pt.K[0] = null, Pt.K[0] = ue, bt = 1;
                  }
                }
                ot = bt;
                break;
              case 2:
                break;
              default:
                e(0);
            }
            w = ot;
          }
        }
        if (x = x[0], A = A[0], w && pt(S, 1) && !(w = 1 <= ($ = pt(S, 4)) && 11 >= $)) {
          d.a = 3;
          break t;
        }
        var ve;
        if (ve = w) e: {
          var ge, Zt, De, hn = d, qe = x, un = A, fe = $, mn = h, vn = hn.m, Ue = hn.s, Je = [null], an = 1, _n = 0, Zn = al[fe];
          n: for (; ; ) {
            if (mn && pt(vn, 1)) {
              var He = pt(vn, 3) + 2, fr = Mt(qe, He), Gr = Mt(un, He), Li = fr * Gr;
              if (!Yn(fr, Gr, 0, hn, Je)) break n;
              for (Je = Je[0], Ue.xc = He, ge = 0; ge < Li; ++ge) {
                var Nr = Je[ge] >> 8 & 65535;
                Je[ge] = Nr, Nr >= an && (an = Nr + 1);
              }
            }
            if (vn.h) break n;
            for (Zt = 0; 5 > Zt; ++Zt) {
              var Pe = Rs[Zt];
              !Zt && 0 < fe && (Pe += 1 << fe), _n < Pe && (_n = Pe);
            }
            var is = l(an * Zn, C), $s = an, Ks = l($s, q);
            if (Ks == null) var Ka = null;
            else e(65536 >= $s), Ka = Ks;
            var la = o(_n);
            if (Ka == null || la == null || is == null) {
              hn.a = 1;
              break n;
            }
            var Za = is;
            for (ge = De = 0; ge < an; ++ge) {
              var Dn = Ka[ge], Ai = Dn.G, Ni = Dn.H, Zs = 0, Qa = 1, Qs = 0;
              for (Zt = 0; 5 > Zt; ++Zt) {
                Pe = Rs[Zt], Ai[Zt] = Za, Ni[Zt] = De, !Zt && 0 < fe && (Pe += 1 << fe);
                i: {
                  var to, as = Pe, eo = hn, ha = la, _l = Za, Pl = De, os = 0, Sr = eo.m, kl = pt(Sr, 1);
                  if (s(ha, 0, 0, as), kl) {
                    var Cl = pt(Sr, 1) + 1, Il = pt(Sr, 1), tc = pt(Sr, Il == 0 ? 1 : 8);
                    ha[tc] = 1, Cl == 2 && (ha[tc = pt(Sr, 8)] = 1);
                    var no = 1;
                  } else {
                    var ec = o(19), nc = pt(Sr, 4) + 4;
                    if (19 < nc) {
                      eo.a = 3;
                      var ro = 0;
                      break i;
                    }
                    for (to = 0; to < nc; ++to) ec[rl[to]] = pt(Sr, 3);
                    var ss = void 0, ua = void 0, rc = eo, Fl = ec, io = as, ic = ha, cs = 0, _r = rc.m, ac = 8, oc = l(128, C);
                    r: for (; P(oc, 0, 7, Fl, 19); ) {
                      if (pt(_r, 1)) {
                        var jl = 2 + 2 * pt(_r, 3);
                        if ((ss = 2 + pt(_r, jl)) > io) break r;
                      } else ss = io;
                      for (ua = 0; ua < io && ss--; ) {
                        Y(_r);
                        var sc = oc[0 + (127 & F(_r))];
                        T(_r, _r.u + sc.g);
                        var Si = sc.value;
                        if (16 > Si) ic[ua++] = Si, Si != 0 && (ac = Si);
                        else {
                          var Ol = Si == 16, cc = Si - 16, El = el[cc], lc = pt(_r, tl[cc]) + El;
                          if (ua + lc > io) break r;
                          for (var Bl = Ol ? ac : 0; 0 < lc--; ) ic[ua++] = Bl;
                        }
                      }
                      cs = 1;
                      break r;
                    }
                    cs || (rc.a = 3), no = cs;
                  }
                  (no = no && !Sr.h) && (os = P(_l, Pl, 8, ha, as)), no && os != 0 ? ro = os : (eo.a = 3, ro = 0);
                }
                if (ro == 0) break n;
                if (Qa && nl[Zt] == 1 && (Qa = Za[De].g == 0), Zs += Za[De].g, De += ro, 3 >= Zt) {
                  var fa, ls = la[0];
                  for (fa = 1; fa < Pe; ++fa) la[fa] > ls && (ls = la[fa]);
                  Qs += ls;
                }
              }
              if (Dn.nd = Qa, Dn.Qb = 0, Qa && (Dn.qb = (Ai[3][Ni[3] + 0].value << 24 | Ai[1][Ni[1] + 0].value << 16 | Ai[2][Ni[2] + 0].value) >>> 0, Zs == 0 && 256 > Ai[0][Ni[0] + 0].value && (Dn.Qb = 1, Dn.qb += Ai[0][Ni[0] + 0].value << 8)), Dn.jc = !Dn.Qb && 6 > Qs, Dn.jc) {
                var ao, dr = Dn;
                for (ao = 0; ao < Ge; ++ao) {
                  var Pr = ao, kr = dr.pd[Pr], oo = dr.G[0][dr.H[0] + Pr];
                  256 <= oo.value ? (kr.g = oo.g + 256, kr.value = oo.value) : (kr.g = 0, kr.value = 0, Pr >>= Re(oo, 8, kr), Pr >>= Re(dr.G[1][dr.H[1] + Pr], 16, kr), Pr >>= Re(dr.G[2][dr.H[2] + Pr], 0, kr), Re(dr.G[3][dr.H[3] + Pr], 24, kr));
                }
              }
            }
            Ue.vc = Je, Ue.Wb = an, Ue.Ya = Ka, Ue.yc = is, ve = 1;
            break e;
          }
          ve = 0;
        }
        if (!(w = ve)) {
          d.a = 3;
          break t;
        }
        if (0 < $) {
          if (I.ua = 1 << $, !zt(I.Wa, $)) {
            d.a = 1, w = 0;
            break t;
          }
        } else I.ua = 0;
        var hs = d, hc = x, Ml = A, us = hs.s, fs = us.xc;
        if (hs.c = hc, hs.i = Ml, us.md = Mt(hc, fs), us.wc = fs == 0 ? -1 : (1 << fs) - 1, h) {
          d.xb = dl;
          break t;
        }
        if ((U = o(x * A)) == null) {
          d.a = 1, w = 0;
          break t;
        }
        w = (w = jn(d, U, 0, x, A, A, null)) && !S.h;
        break t;
      }
      return w ? (m != null ? m[0] = U : (e(U == null), e(h)), d.$ = 0, h || Jn(I)) : Jn(I), w;
    }
    function Mr(t, a) {
      var h = t.c * t.i, d = h + a + 16 * a;
      return e(t.c <= a), t.V = o(d), t.V == null ? (t.Ta = null, t.Ua = 0, t.a = 1, 0) : (t.Ta = t.V, t.Ua = t.Ba + h + a, 1);
    }
    function Zr(t, a) {
      var h = t.C, d = a - h, m = t.V, w = t.Ba + t.c * h;
      for (e(a <= t.l.o); 0 < d; ) {
        var x = 16 < d ? 16 : d, A = t.l.ma, S = t.l.width, I = S * x, U = A.ca, $ = A.tb + S * h, K = t.Ta, J = t.Ua;
        dn(t, x, m, w), Fe(K, J, U, $, I), In(A, h, h + x, U, $, S), d -= x, m += x * t.c, h += x;
      }
      e(h == a), t.C = t.Ma = a;
    }
    function Qr() {
      this.ub = this.yd = this.td = this.Rb = 0;
    }
    function ti() {
      this.Kd = this.Ld = this.Ud = this.Td = this.i = this.c = 0;
    }
    function ei() {
      this.Fb = this.Bb = this.Cb = 0, this.Zb = o(4), this.Lb = o(4);
    }
    function va() {
      this.Yb = function() {
        var t = [];
        return function a(h, d, m) {
          for (var w = m[d], x = 0; x < w && (h.push(m.length > d + 1 ? [] : 0), !(m.length < d + 1)); x++) a(h[x], d + 1, m);
        }(t, 0, [3, 11]), t;
      }();
    }
    function So() {
      this.jb = o(3), this.Wc = u([4, 8], va), this.Xc = u([4, 17], va);
    }
    function _o() {
      this.Pc = this.wb = this.Tb = this.zd = 0, this.vd = new o(4), this.od = new o(4);
    }
    function ni() {
      this.ld = this.La = this.dd = this.tc = 0;
    }
    function ba() {
      this.Na = this.la = 0;
    }
    function Po() {
      this.Sc = [0, 0], this.Eb = [0, 0], this.Qc = [0, 0], this.ia = this.lc = 0;
    }
    function Di() {
      this.ad = o(384), this.Za = 0, this.Ob = o(16), this.$b = this.Ad = this.ia = this.Gc = this.Hc = this.Dd = 0;
    }
    function ko() {
      this.uc = this.M = this.Nb = 0, this.wa = Array(new ni()), this.Y = 0, this.ya = Array(new Di()), this.aa = 0, this.l = new ri();
    }
    function ya() {
      this.y = o(16), this.f = o(8), this.ea = o(8);
    }
    function Co() {
      this.cb = this.a = 0, this.sc = "", this.m = new It(), this.Od = new Qr(), this.Kc = new ti(), this.ed = new _o(), this.Qa = new ei(), this.Ic = this.$c = this.Aa = 0, this.D = new ko(), this.Xb = this.Va = this.Hb = this.zb = this.yb = this.Ub = this.za = 0, this.Jc = l(8, It), this.ia = 0, this.pb = l(4, Po), this.Pa = new So(), this.Bd = this.kc = 0, this.Ac = [], this.Bc = 0, this.zc = [0, 0, 0, 0], this.Gd = Array(new ya()), this.Hd = 0, this.rb = Array(new ba()), this.sb = 0, this.wa = Array(new ni()), this.Y = 0, this.oc = [], this.pc = 0, this.sa = [], this.ta = 0, this.qa = [], this.ra = 0, this.Ha = [], this.B = this.R = this.Ia = 0, this.Ec = [], this.M = this.ja = this.Vb = this.Fc = 0, this.ya = Array(new Di()), this.L = this.aa = 0, this.gd = u([4, 2], ni), this.ga = null, this.Fa = [], this.Cc = this.qc = this.P = 0, this.Gb = [], this.Uc = 0, this.mb = [], this.nb = 0, this.rc = [], this.Ga = this.Vc = 0;
    }
    function ri() {
      this.T = this.U = this.ka = this.height = this.width = 0, this.y = [], this.f = [], this.ea = [], this.Rc = this.fa = this.W = this.N = this.O = 0, this.ma = "void", this.put = "VP8IoPutHook", this.ac = "VP8IoSetupHook", this.bc = "VP8IoTeardownHook", this.ha = this.Kb = 0, this.data = [], this.hb = this.ib = this.da = this.o = this.j = this.va = this.v = this.Da = this.ob = this.w = 0, this.F = [], this.J = 0;
    }
    function Io() {
      var t = new Co();
      return t != null && (t.a = 0, t.sc = "OK", t.cb = 0, t.Xb = 0, sa || (sa = La)), t;
    }
    function Ce(t, a, h) {
      return t.a == 0 && (t.a = a, t.sc = h, t.cb = 0), 0;
    }
    function wa(t, a, h) {
      return 3 <= h && t[a + 0] == 157 && t[a + 1] == 1 && t[a + 2] == 42;
    }
    function xa(t, a) {
      if (t == null) return 0;
      if (t.a = 0, t.sc = "OK", a == null) return Ce(t, 2, "null VP8Io passed to VP8GetHeaders()");
      var h = a.data, d = a.w, m = a.ha;
      if (4 > m) return Ce(t, 7, "Truncated header.");
      var w = h[d + 0] | h[d + 1] << 8 | h[d + 2] << 16, x = t.Od;
      if (x.Rb = !(1 & w), x.td = w >> 1 & 7, x.yd = w >> 4 & 1, x.ub = w >> 5, 3 < x.td) return Ce(t, 3, "Incorrect keyframe parameters.");
      if (!x.yd) return Ce(t, 4, "Frame not displayable.");
      d += 3, m -= 3;
      var A = t.Kc;
      if (x.Rb) {
        if (7 > m) return Ce(t, 7, "cannot parse picture header");
        if (!wa(h, d, m)) return Ce(t, 3, "Bad code word");
        A.c = 16383 & (h[d + 4] << 8 | h[d + 3]), A.Td = h[d + 4] >> 6, A.i = 16383 & (h[d + 6] << 8 | h[d + 5]), A.Ud = h[d + 6] >> 6, d += 7, m -= 7, t.za = A.c + 15 >> 4, t.Ub = A.i + 15 >> 4, a.width = A.c, a.height = A.i, a.Da = 0, a.j = 0, a.v = 0, a.va = a.width, a.o = a.height, a.da = 0, a.ib = a.width, a.hb = a.height, a.U = a.width, a.T = a.height, s((w = t.Pa).jb, 0, 255, w.jb.length), e((w = t.Qa) != null), w.Cb = 0, w.Bb = 0, w.Fb = 1, s(w.Zb, 0, 0, w.Zb.length), s(w.Lb, 0, 0, w.Lb);
      }
      if (x.ub > m) return Ce(t, 7, "bad partition length");
      st(w = t.m, h, d, x.ub), d += x.ub, m -= x.ub, x.Rb && (A.Ld = et(w), A.Kd = et(w)), A = t.Qa;
      var S, I = t.Pa;
      if (e(w != null), e(A != null), A.Cb = et(w), A.Cb) {
        if (A.Bb = et(w), et(w)) {
          for (A.Fb = et(w), S = 0; 4 > S; ++S) A.Zb[S] = et(w) ? ht(w, 7) : 0;
          for (S = 0; 4 > S; ++S) A.Lb[S] = et(w) ? ht(w, 6) : 0;
        }
        if (A.Bb) for (S = 0; 3 > S; ++S) I.jb[S] = et(w) ? it(w, 8) : 255;
      } else A.Bb = 0;
      if (w.Ka) return Ce(t, 3, "cannot parse segment header");
      if ((A = t.ed).zd = et(w), A.Tb = it(w, 6), A.wb = it(w, 3), A.Pc = et(w), A.Pc && et(w)) {
        for (I = 0; 4 > I; ++I) et(w) && (A.vd[I] = ht(w, 6));
        for (I = 0; 4 > I; ++I) et(w) && (A.od[I] = ht(w, 6));
      }
      if (t.L = A.Tb == 0 ? 0 : A.zd ? 1 : 2, w.Ka) return Ce(t, 3, "cannot parse filter header");
      var U = m;
      if (m = S = d, d = S + U, A = U, t.Xb = (1 << it(t.m, 2)) - 1, U < 3 * (I = t.Xb)) h = 7;
      else {
        for (S += 3 * I, A -= 3 * I, U = 0; U < I; ++U) {
          var $ = h[m + 0] | h[m + 1] << 8 | h[m + 2] << 16;
          $ > A && ($ = A), st(t.Jc[+U], h, S, $), S += $, A -= $, m += 3;
        }
        st(t.Jc[+I], h, S, A), h = S < d ? 0 : 5;
      }
      if (h != 0) return Ce(t, h, "cannot parse partitions");
      for (h = it(S = t.m, 7), m = et(S) ? ht(S, 4) : 0, d = et(S) ? ht(S, 4) : 0, A = et(S) ? ht(S, 4) : 0, I = et(S) ? ht(S, 4) : 0, S = et(S) ? ht(S, 4) : 0, U = t.Qa, $ = 0; 4 > $; ++$) {
        if (U.Cb) {
          var K = U.Zb[$];
          U.Fb || (K += h);
        } else {
          if (0 < $) {
            t.pb[$] = t.pb[0];
            continue;
          }
          K = h;
        }
        var J = t.pb[$];
        J.Sc[0] = es[pn(K + m, 127)], J.Sc[1] = ns[pn(K + 0, 127)], J.Eb[0] = 2 * es[pn(K + d, 127)], J.Eb[1] = 101581 * ns[pn(K + A, 127)] >> 16, 8 > J.Eb[1] && (J.Eb[1] = 8), J.Qc[0] = es[pn(K + I, 117)], J.Qc[1] = ns[pn(K + S, 127)], J.lc = K + S;
      }
      if (!x.Rb) return Ce(t, 4, "Not a key frame.");
      for (et(w), x = t.Pa, h = 0; 4 > h; ++h) {
        for (m = 0; 8 > m; ++m) for (d = 0; 3 > d; ++d) for (A = 0; 11 > A; ++A) I = nt(w, ul[h][m][d][A]) ? it(w, 8) : ll[h][m][d][A], x.Wc[h][m].Yb[d][A] = I;
        for (m = 0; 17 > m; ++m) x.Xc[h][m] = x.Wc[h][fl[m]];
      }
      return t.kc = et(w), t.kc && (t.Bd = it(w, 8)), t.cb = 1;
    }
    function La(t, a, h, d, m, w, x) {
      var A = a[m].Yb[h];
      for (h = 0; 16 > m; ++m) {
        if (!nt(t, A[h + 0])) return m;
        for (; !nt(t, A[h + 1]); ) if (A = a[++m].Yb[0], h = 0, m == 16) return 16;
        var S = a[m + 1].Yb;
        if (nt(t, A[h + 2])) {
          var I = t, U = 0;
          if (nt(I, (K = A)[($ = h) + 3])) if (nt(I, K[$ + 6])) {
            for (A = 0, $ = 2 * (U = nt(I, K[$ + 8])) + (K = nt(I, K[$ + 9 + U])), U = 0, K = sl[$]; K[A]; ++A) U += U + nt(I, K[A]);
            U += 3 + (8 << $);
          } else nt(I, K[$ + 7]) ? (U = 7 + 2 * nt(I, 165), U += nt(I, 145)) : U = 5 + nt(I, 159);
          else U = nt(I, K[$ + 4]) ? 3 + nt(I, K[$ + 5]) : 2;
          A = S[2];
        } else U = 1, A = S[1];
        S = x + cl[m], 0 > (I = t).b && Q(I);
        var $, K = I.b, J = ($ = I.Ca >> 1) - (I.I >> K) >> 31;
        --I.b, I.Ca += J, I.Ca |= 1, I.I -= ($ + 1 & J) << K, w[S] = ((U ^ J) - J) * d[(0 < m) + 0];
      }
      return 16;
    }
    function qi(t) {
      var a = t.rb[t.sb - 1];
      a.la = 0, a.Na = 0, s(t.zc, 0, 0, t.zc.length), t.ja = 0;
    }
    function Fo(t, a) {
      if (t == null) return 0;
      if (a == null) return Ce(t, 2, "NULL VP8Io parameter in VP8Decode().");
      if (!t.cb && !xa(t, a)) return 0;
      if (e(t.cb), a.ac == null || a.ac(a)) {
        a.ob && (t.L = 0);
        var h = $a[t.L];
        if (t.L == 2 ? (t.yb = 0, t.zb = 0) : (t.yb = a.v - h >> 4, t.zb = a.j - h >> 4, 0 > t.yb && (t.yb = 0), 0 > t.zb && (t.zb = 0)), t.Va = a.o + 15 + h >> 4, t.Hb = a.va + 15 + h >> 4, t.Hb > t.za && (t.Hb = t.za), t.Va > t.Ub && (t.Va = t.Ub), 0 < t.L) {
          var d = t.ed;
          for (h = 0; 4 > h; ++h) {
            var m;
            if (t.Qa.Cb) {
              var w = t.Qa.Lb[h];
              t.Qa.Fb || (w += d.Tb);
            } else w = d.Tb;
            for (m = 0; 1 >= m; ++m) {
              var x = t.gd[h][m], A = w;
              if (d.Pc && (A += d.vd[0], m && (A += d.od[0])), 0 < (A = 0 > A ? 0 : 63 < A ? 63 : A)) {
                var S = A;
                0 < d.wb && (S = 4 < d.wb ? S >> 2 : S >> 1) > 9 - d.wb && (S = 9 - d.wb), 1 > S && (S = 1), x.dd = S, x.tc = 2 * A + S, x.ld = 40 <= A ? 2 : 15 <= A ? 1 : 0;
              } else x.tc = 0;
              x.La = m;
            }
          }
        }
        h = 0;
      } else Ce(t, 6, "Frame setup failed"), h = t.a;
      if (h = h == 0) {
        if (h) {
          t.$c = 0, 0 < t.Aa || (t.Ic = Sl);
          t: {
            h = t.Ic, d = 4 * (S = t.za);
            var I = 32 * S, U = S + 1, $ = 0 < t.L ? S * (0 < t.Aa ? 2 : 1) : 0, K = (t.Aa == 2 ? 2 : 1) * S;
            if ((x = d + 832 + (m = 3 * (16 * h + $a[t.L]) / 2 * I) + (w = t.Fa != null && 0 < t.Fa.length ? t.Kc.c * t.Kc.i : 0)) != x) h = 0;
            else {
              if (x > t.Vb) {
                if (t.Vb = 0, t.Ec = o(x), t.Fc = 0, t.Ec == null) {
                  h = Ce(t, 1, "no memory during frame initialization.");
                  break t;
                }
                t.Vb = x;
              }
              x = t.Ec, A = t.Fc, t.Ac = x, t.Bc = A, A += d, t.Gd = l(I, ya), t.Hd = 0, t.rb = l(U + 1, ba), t.sb = 1, t.wa = $ ? l($, ni) : null, t.Y = 0, t.D.Nb = 0, t.D.wa = t.wa, t.D.Y = t.Y, 0 < t.Aa && (t.D.Y += S), e(!0), t.oc = x, t.pc = A, A += 832, t.ya = l(K, Di), t.aa = 0, t.D.ya = t.ya, t.D.aa = t.aa, t.Aa == 2 && (t.D.aa += S), t.R = 16 * S, t.B = 8 * S, S = (I = $a[t.L]) * t.R, I = I / 2 * t.B, t.sa = x, t.ta = A + S, t.qa = t.sa, t.ra = t.ta + 16 * h * t.R + I, t.Ha = t.qa, t.Ia = t.ra + 8 * h * t.B + I, t.$c = 0, A += m, t.mb = w ? x : null, t.nb = w ? A : null, e(A + w <= t.Fc + t.Vb), qi(t), s(t.Ac, t.Bc, 0, d), h = 1;
            }
          }
          if (h) {
            if (a.ka = 0, a.y = t.sa, a.O = t.ta, a.f = t.qa, a.N = t.ra, a.ea = t.Ha, a.Vd = t.Ia, a.fa = t.R, a.Rc = t.B, a.F = null, a.J = 0, !za) {
              for (h = -255; 255 >= h; ++h) Te[255 + h] = 0 > h ? -h : h;
              for (h = -1020; 1020 >= h; ++h) hr[1020 + h] = -128 > h ? -128 : 127 < h ? 127 : h;
              for (h = -112; 112 >= h; ++h) oa[112 + h] = -16 > h ? -16 : 15 < h ? 15 : h;
              for (h = -255; 510 >= h; ++h) xi[255 + h] = 0 > h ? 0 : 255 < h ? 255 : h;
              za = 1;
            }
            bi = Eo, lr = jo, ra = Na, rn = Oo, xn = Sa, Ie = Aa, yi = Wi, Ta = Rr, ia = Jo, Ur = Vi, Hr = Go, wr = li, Wr = Gi, wi = Ea, Vr = Oa, xr = $n, aa = or, Ln = Vo, Mn[0] = Xn, Mn[1] = Bo, Mn[2] = Ro, Mn[3] = To, Mn[4] = ka, Mn[5] = si, Mn[6] = Ca, Mn[7] = zi, Mn[8] = Uo, Mn[9] = zo, Lr[0] = _a, Lr[1] = Do, Lr[2] = ar, Lr[3] = ai, Lr[4] = Xe, Lr[5] = qo, Lr[6] = Pa, ur[0] = gr, ur[1] = Mo, ur[2] = Ho, ur[3] = Ui, ur[4] = qr, ur[5] = Wo, ur[6] = Hi, h = 1;
          } else h = 0;
        }
        h && (h = function(J, vt) {
          for (J.M = 0; J.M < J.Va; ++J.M) {
            var ot, H = J.Jc[J.M & J.Xb], V = J.m, gt = J;
            for (ot = 0; ot < gt.za; ++ot) {
              var bt = V, mt = gt, Et = mt.Ac, St = mt.Bc + 4 * ot, Rt = mt.zc, Pt = mt.ya[mt.aa + ot];
              if (mt.Qa.Bb ? Pt.$b = nt(bt, mt.Pa.jb[0]) ? 2 + nt(bt, mt.Pa.jb[2]) : nt(bt, mt.Pa.jb[1]) : Pt.$b = 0, mt.kc && (Pt.Ad = nt(bt, mt.Bd)), Pt.Za = !nt(bt, 145) + 0, Pt.Za) {
                var ce = Pt.Ob, ue = 0;
                for (mt = 0; 4 > mt; ++mt) {
                  var oe, ne = Rt[0 + mt];
                  for (oe = 0; 4 > oe; ++oe) {
                    ne = hl[Et[St + oe]][ne];
                    for (var ve = Ts[nt(bt, ne[0])]; 0 < ve; ) ve = Ts[2 * ve + nt(bt, ne[ve])];
                    ne = -ve, Et[St + oe] = ne;
                  }
                  i(ce, ue, Et, St, 4), ue += 4, Rt[0 + mt] = ne;
                }
              } else ne = nt(bt, 156) ? nt(bt, 128) ? 1 : 3 : nt(bt, 163) ? 2 : 0, Pt.Ob[0] = ne, s(Et, St, ne, 4), s(Rt, 0, ne, 4);
              Pt.Dd = nt(bt, 142) ? nt(bt, 114) ? nt(bt, 183) ? 1 : 3 : 2 : 0;
            }
            if (gt.m.Ka) return Ce(J, 7, "Premature end-of-partition0 encountered.");
            for (; J.ja < J.za; ++J.ja) {
              if (gt = H, bt = (V = J).rb[V.sb - 1], Et = V.rb[V.sb + V.ja], ot = V.ya[V.aa + V.ja], St = V.kc ? ot.Ad : 0) bt.la = Et.la = 0, ot.Za || (bt.Na = Et.Na = 0), ot.Hc = 0, ot.Gc = 0, ot.ia = 0;
              else {
                var ge, Zt;
                if (bt = Et, Et = gt, St = V.Pa.Xc, Rt = V.ya[V.aa + V.ja], Pt = V.pb[Rt.$b], mt = Rt.ad, ce = 0, ue = V.rb[V.sb - 1], ne = oe = 0, s(mt, ce, 0, 384), Rt.Za) var De = 0, hn = St[3];
                else {
                  ve = o(16);
                  var qe = bt.Na + ue.Na;
                  if (qe = sa(Et, St[1], qe, Pt.Eb, 0, ve, 0), bt.Na = ue.Na = (0 < qe) + 0, 1 < qe) bi(ve, 0, mt, ce);
                  else {
                    var un = ve[0] + 3 >> 3;
                    for (ve = 0; 256 > ve; ve += 16) mt[ce + ve] = un;
                  }
                  De = 1, hn = St[0];
                }
                var fe = 15 & bt.la, mn = 15 & ue.la;
                for (ve = 0; 4 > ve; ++ve) {
                  var vn = 1 & mn;
                  for (un = Zt = 0; 4 > un; ++un) fe = fe >> 1 | (vn = (qe = sa(Et, hn, qe = vn + (1 & fe), Pt.Sc, De, mt, ce)) > De) << 7, Zt = Zt << 2 | (3 < qe ? 3 : 1 < qe ? 2 : mt[ce + 0] != 0), ce += 16;
                  fe >>= 4, mn = mn >> 1 | vn << 7, oe = (oe << 8 | Zt) >>> 0;
                }
                for (hn = fe, De = mn >> 4, ge = 0; 4 > ge; ge += 2) {
                  for (Zt = 0, fe = bt.la >> 4 + ge, mn = ue.la >> 4 + ge, ve = 0; 2 > ve; ++ve) {
                    for (vn = 1 & mn, un = 0; 2 > un; ++un) qe = vn + (1 & fe), fe = fe >> 1 | (vn = 0 < (qe = sa(Et, St[2], qe, Pt.Qc, 0, mt, ce))) << 3, Zt = Zt << 2 | (3 < qe ? 3 : 1 < qe ? 2 : mt[ce + 0] != 0), ce += 16;
                    fe >>= 2, mn = mn >> 1 | vn << 5;
                  }
                  ne |= Zt << 4 * ge, hn |= fe << 4 << ge, De |= (240 & mn) << ge;
                }
                bt.la = hn, ue.la = De, Rt.Hc = oe, Rt.Gc = ne, Rt.ia = 43690 & ne ? 0 : Pt.ia, St = !(oe | ne);
              }
              if (0 < V.L && (V.wa[V.Y + V.ja] = V.gd[ot.$b][ot.Za], V.wa[V.Y + V.ja].La |= !St), gt.Ka) return Ce(J, 7, "Premature end-of-file encountered.");
            }
            if (qi(J), V = vt, gt = 1, ot = (H = J).D, bt = 0 < H.L && H.M >= H.zb && H.M <= H.Va, H.Aa == 0) t: {
              if (ot.M = H.M, ot.uc = bt, Zi(H, ot), gt = 1, ot = (Zt = H.D).Nb, bt = (ne = $a[H.L]) * H.R, Et = ne / 2 * H.B, ve = 16 * ot * H.R, un = 8 * ot * H.B, St = H.sa, Rt = H.ta - bt + ve, Pt = H.qa, mt = H.ra - Et + un, ce = H.Ha, ue = H.Ia - Et + un, mn = (fe = Zt.M) == 0, oe = fe >= H.Va - 1, H.Aa == 2 && Zi(H, Zt), Zt.uc) for (vn = (qe = H).D.M, e(qe.D.uc), Zt = qe.yb; Zt < qe.Hb; ++Zt) {
                De = Zt, hn = vn;
                var Ue = (Je = (Pe = qe).D).Nb;
                ge = Pe.R;
                var Je = Je.wa[Je.Y + De], an = Pe.sa, _n = Pe.ta + 16 * Ue * ge + 16 * De, Zn = Je.dd, He = Je.tc;
                if (He != 0) if (e(3 <= He), Pe.L == 1) 0 < De && xr(an, _n, ge, He + 4), Je.La && Ln(an, _n, ge, He), 0 < hn && Vr(an, _n, ge, He + 4), Je.La && aa(an, _n, ge, He);
                else {
                  var fr = Pe.B, Gr = Pe.qa, Li = Pe.ra + 8 * Ue * fr + 8 * De, Nr = Pe.Ha, Pe = Pe.Ia + 8 * Ue * fr + 8 * De;
                  Ue = Je.ld, 0 < De && (Ta(an, _n, ge, He + 4, Zn, Ue), Ur(Gr, Li, Nr, Pe, fr, He + 4, Zn, Ue)), Je.La && (wr(an, _n, ge, He, Zn, Ue), wi(Gr, Li, Nr, Pe, fr, He, Zn, Ue)), 0 < hn && (yi(an, _n, ge, He + 4, Zn, Ue), ia(Gr, Li, Nr, Pe, fr, He + 4, Zn, Ue)), Je.La && (Hr(an, _n, ge, He, Zn, Ue), Wr(Gr, Li, Nr, Pe, fr, He, Zn, Ue));
                }
              }
              if (H.ia && alert("todo:DitherRow"), V.put != null) {
                if (Zt = 16 * fe, fe = 16 * (fe + 1), mn ? (V.y = H.sa, V.O = H.ta + ve, V.f = H.qa, V.N = H.ra + un, V.ea = H.Ha, V.W = H.Ia + un) : (Zt -= ne, V.y = St, V.O = Rt, V.f = Pt, V.N = mt, V.ea = ce, V.W = ue), oe || (fe -= ne), fe > V.o && (fe = V.o), V.F = null, V.J = null, H.Fa != null && 0 < H.Fa.length && Zt < fe && (V.J = $i(H, V, Zt, fe - Zt), V.F = H.mb, V.F == null && V.F.length == 0)) {
                  gt = Ce(H, 3, "Could not decode alpha data.");
                  break t;
                }
                Zt < V.j && (ne = V.j - Zt, Zt = V.j, e(!(1 & ne)), V.O += H.R * ne, V.N += H.B * (ne >> 1), V.W += H.B * (ne >> 1), V.F != null && (V.J += V.width * ne)), Zt < fe && (V.O += V.v, V.N += V.v >> 1, V.W += V.v >> 1, V.F != null && (V.J += V.v), V.ka = Zt - V.j, V.U = V.va - V.v, V.T = fe - Zt, gt = V.put(V));
              }
              ot + 1 != H.Ic || oe || (i(H.sa, H.ta - bt, St, Rt + 16 * H.R, bt), i(H.qa, H.ra - Et, Pt, mt + 8 * H.B, Et), i(H.Ha, H.Ia - Et, ce, ue + 8 * H.B, Et));
            }
            if (!gt) return Ce(J, 6, "Output aborted.");
          }
          return 1;
        }(t, a)), a.bc != null && a.bc(a), h &= 1;
      }
      return h ? (t.cb = 0, h) : 0;
    }
    function On(t, a, h, d, m) {
      m = t[a + h + 32 * d] + (m >> 3), t[a + h + 32 * d] = -256 & m ? 0 > m ? 0 : 255 : m;
    }
    function ii(t, a, h, d, m, w) {
      On(t, a, 0, h, d + m), On(t, a, 1, h, d + w), On(t, a, 2, h, d - w), On(t, a, 3, h, d - m);
    }
    function sn(t) {
      return (20091 * t >> 16) + t;
    }
    function Ri(t, a, h, d) {
      var m, w = 0, x = o(16);
      for (m = 0; 4 > m; ++m) {
        var A = t[a + 0] + t[a + 8], S = t[a + 0] - t[a + 8], I = (35468 * t[a + 4] >> 16) - sn(t[a + 12]), U = sn(t[a + 4]) + (35468 * t[a + 12] >> 16);
        x[w + 0] = A + U, x[w + 1] = S + I, x[w + 2] = S - I, x[w + 3] = A - U, w += 4, a++;
      }
      for (m = w = 0; 4 > m; ++m) A = (t = x[w + 0] + 4) + x[w + 8], S = t - x[w + 8], I = (35468 * x[w + 4] >> 16) - sn(x[w + 12]), On(h, d, 0, 0, A + (U = sn(x[w + 4]) + (35468 * x[w + 12] >> 16))), On(h, d, 1, 0, S + I), On(h, d, 2, 0, S - I), On(h, d, 3, 0, A - U), w++, d += 32;
    }
    function Aa(t, a, h, d) {
      var m = t[a + 0] + 4, w = 35468 * t[a + 4] >> 16, x = sn(t[a + 4]), A = 35468 * t[a + 1] >> 16;
      ii(h, d, 0, m + x, t = sn(t[a + 1]), A), ii(h, d, 1, m + w, t, A), ii(h, d, 2, m - w, t, A), ii(h, d, 3, m - x, t, A);
    }
    function jo(t, a, h, d, m) {
      Ri(t, a, h, d), m && Ri(t, a + 16, h, d + 4);
    }
    function Na(t, a, h, d) {
      lr(t, a + 0, h, d, 1), lr(t, a + 32, h, d + 128, 1);
    }
    function Oo(t, a, h, d) {
      var m;
      for (t = t[a + 0] + 4, m = 0; 4 > m; ++m) for (a = 0; 4 > a; ++a) On(h, d, a, m, t);
    }
    function Sa(t, a, h, d) {
      t[a + 0] && rn(t, a + 0, h, d), t[a + 16] && rn(t, a + 16, h, d + 4), t[a + 32] && rn(t, a + 32, h, d + 128), t[a + 48] && rn(t, a + 48, h, d + 128 + 4);
    }
    function Eo(t, a, h, d) {
      var m, w = o(16);
      for (m = 0; 4 > m; ++m) {
        var x = t[a + 0 + m] + t[a + 12 + m], A = t[a + 4 + m] + t[a + 8 + m], S = t[a + 4 + m] - t[a + 8 + m], I = t[a + 0 + m] - t[a + 12 + m];
        w[0 + m] = x + A, w[8 + m] = x - A, w[4 + m] = I + S, w[12 + m] = I - S;
      }
      for (m = 0; 4 > m; ++m) x = (t = w[0 + 4 * m] + 3) + w[3 + 4 * m], A = w[1 + 4 * m] + w[2 + 4 * m], S = w[1 + 4 * m] - w[2 + 4 * m], I = t - w[3 + 4 * m], h[d + 0] = x + A >> 3, h[d + 16] = I + S >> 3, h[d + 32] = x - A >> 3, h[d + 48] = I - S >> 3, d += 64;
    }
    function Ti(t, a, h) {
      var d, m = a - 32, w = gn, x = 255 - t[m - 1];
      for (d = 0; d < h; ++d) {
        var A, S = w, I = x + t[a - 1];
        for (A = 0; A < h; ++A) t[a + A] = S[I + t[m + A]];
        a += 32;
      }
    }
    function Bo(t, a) {
      Ti(t, a, 4);
    }
    function Mo(t, a) {
      Ti(t, a, 8);
    }
    function Do(t, a) {
      Ti(t, a, 16);
    }
    function ar(t, a) {
      var h;
      for (h = 0; 16 > h; ++h) i(t, a + 32 * h, t, a - 32, 16);
    }
    function ai(t, a) {
      var h;
      for (h = 16; 0 < h; --h) s(t, a, t[a - 1], 16), a += 32;
    }
    function oi(t, a, h) {
      var d;
      for (d = 0; 16 > d; ++d) s(a, h + 32 * d, t, 16);
    }
    function _a(t, a) {
      var h, d = 16;
      for (h = 0; 16 > h; ++h) d += t[a - 1 + 32 * h] + t[a + h - 32];
      oi(d >> 5, t, a);
    }
    function Xe(t, a) {
      var h, d = 8;
      for (h = 0; 16 > h; ++h) d += t[a - 1 + 32 * h];
      oi(d >> 4, t, a);
    }
    function qo(t, a) {
      var h, d = 8;
      for (h = 0; 16 > h; ++h) d += t[a + h - 32];
      oi(d >> 4, t, a);
    }
    function Pa(t, a) {
      oi(128, t, a);
    }
    function Vt(t, a, h) {
      return t + 2 * a + h + 2 >> 2;
    }
    function Ro(t, a) {
      var h, d = a - 32;
      for (d = new Uint8Array([Vt(t[d - 1], t[d + 0], t[d + 1]), Vt(t[d + 0], t[d + 1], t[d + 2]), Vt(t[d + 1], t[d + 2], t[d + 3]), Vt(t[d + 2], t[d + 3], t[d + 4])]), h = 0; 4 > h; ++h) i(t, a + 32 * h, d, 0, d.length);
    }
    function To(t, a) {
      var h = t[a - 1], d = t[a - 1 + 32], m = t[a - 1 + 64], w = t[a - 1 + 96];
      At(t, a + 0, 16843009 * Vt(t[a - 1 - 32], h, d)), At(t, a + 32, 16843009 * Vt(h, d, m)), At(t, a + 64, 16843009 * Vt(d, m, w)), At(t, a + 96, 16843009 * Vt(m, w, w));
    }
    function Xn(t, a) {
      var h, d = 4;
      for (h = 0; 4 > h; ++h) d += t[a + h - 32] + t[a - 1 + 32 * h];
      for (d >>= 3, h = 0; 4 > h; ++h) s(t, a + 32 * h, d, 4);
    }
    function ka(t, a) {
      var h = t[a - 1 + 0], d = t[a - 1 + 32], m = t[a - 1 + 64], w = t[a - 1 - 32], x = t[a + 0 - 32], A = t[a + 1 - 32], S = t[a + 2 - 32], I = t[a + 3 - 32];
      t[a + 0 + 96] = Vt(d, m, t[a - 1 + 96]), t[a + 1 + 96] = t[a + 0 + 64] = Vt(h, d, m), t[a + 2 + 96] = t[a + 1 + 64] = t[a + 0 + 32] = Vt(w, h, d), t[a + 3 + 96] = t[a + 2 + 64] = t[a + 1 + 32] = t[a + 0 + 0] = Vt(x, w, h), t[a + 3 + 64] = t[a + 2 + 32] = t[a + 1 + 0] = Vt(A, x, w), t[a + 3 + 32] = t[a + 2 + 0] = Vt(S, A, x), t[a + 3 + 0] = Vt(I, S, A);
    }
    function Ca(t, a) {
      var h = t[a + 1 - 32], d = t[a + 2 - 32], m = t[a + 3 - 32], w = t[a + 4 - 32], x = t[a + 5 - 32], A = t[a + 6 - 32], S = t[a + 7 - 32];
      t[a + 0 + 0] = Vt(t[a + 0 - 32], h, d), t[a + 1 + 0] = t[a + 0 + 32] = Vt(h, d, m), t[a + 2 + 0] = t[a + 1 + 32] = t[a + 0 + 64] = Vt(d, m, w), t[a + 3 + 0] = t[a + 2 + 32] = t[a + 1 + 64] = t[a + 0 + 96] = Vt(m, w, x), t[a + 3 + 32] = t[a + 2 + 64] = t[a + 1 + 96] = Vt(w, x, A), t[a + 3 + 64] = t[a + 2 + 96] = Vt(x, A, S), t[a + 3 + 96] = Vt(A, S, S);
    }
    function si(t, a) {
      var h = t[a - 1 + 0], d = t[a - 1 + 32], m = t[a - 1 + 64], w = t[a - 1 - 32], x = t[a + 0 - 32], A = t[a + 1 - 32], S = t[a + 2 - 32], I = t[a + 3 - 32];
      t[a + 0 + 0] = t[a + 1 + 64] = w + x + 1 >> 1, t[a + 1 + 0] = t[a + 2 + 64] = x + A + 1 >> 1, t[a + 2 + 0] = t[a + 3 + 64] = A + S + 1 >> 1, t[a + 3 + 0] = S + I + 1 >> 1, t[a + 0 + 96] = Vt(m, d, h), t[a + 0 + 64] = Vt(d, h, w), t[a + 0 + 32] = t[a + 1 + 96] = Vt(h, w, x), t[a + 1 + 32] = t[a + 2 + 96] = Vt(w, x, A), t[a + 2 + 32] = t[a + 3 + 96] = Vt(x, A, S), t[a + 3 + 32] = Vt(A, S, I);
    }
    function zi(t, a) {
      var h = t[a + 0 - 32], d = t[a + 1 - 32], m = t[a + 2 - 32], w = t[a + 3 - 32], x = t[a + 4 - 32], A = t[a + 5 - 32], S = t[a + 6 - 32], I = t[a + 7 - 32];
      t[a + 0 + 0] = h + d + 1 >> 1, t[a + 1 + 0] = t[a + 0 + 64] = d + m + 1 >> 1, t[a + 2 + 0] = t[a + 1 + 64] = m + w + 1 >> 1, t[a + 3 + 0] = t[a + 2 + 64] = w + x + 1 >> 1, t[a + 0 + 32] = Vt(h, d, m), t[a + 1 + 32] = t[a + 0 + 96] = Vt(d, m, w), t[a + 2 + 32] = t[a + 1 + 96] = Vt(m, w, x), t[a + 3 + 32] = t[a + 2 + 96] = Vt(w, x, A), t[a + 3 + 64] = Vt(x, A, S), t[a + 3 + 96] = Vt(A, S, I);
    }
    function zo(t, a) {
      var h = t[a - 1 + 0], d = t[a - 1 + 32], m = t[a - 1 + 64], w = t[a - 1 + 96];
      t[a + 0 + 0] = h + d + 1 >> 1, t[a + 2 + 0] = t[a + 0 + 32] = d + m + 1 >> 1, t[a + 2 + 32] = t[a + 0 + 64] = m + w + 1 >> 1, t[a + 1 + 0] = Vt(h, d, m), t[a + 3 + 0] = t[a + 1 + 32] = Vt(d, m, w), t[a + 3 + 32] = t[a + 1 + 64] = Vt(m, w, w), t[a + 3 + 64] = t[a + 2 + 64] = t[a + 0 + 96] = t[a + 1 + 96] = t[a + 2 + 96] = t[a + 3 + 96] = w;
    }
    function Uo(t, a) {
      var h = t[a - 1 + 0], d = t[a - 1 + 32], m = t[a - 1 + 64], w = t[a - 1 + 96], x = t[a - 1 - 32], A = t[a + 0 - 32], S = t[a + 1 - 32], I = t[a + 2 - 32];
      t[a + 0 + 0] = t[a + 2 + 32] = h + x + 1 >> 1, t[a + 0 + 32] = t[a + 2 + 64] = d + h + 1 >> 1, t[a + 0 + 64] = t[a + 2 + 96] = m + d + 1 >> 1, t[a + 0 + 96] = w + m + 1 >> 1, t[a + 3 + 0] = Vt(A, S, I), t[a + 2 + 0] = Vt(x, A, S), t[a + 1 + 0] = t[a + 3 + 32] = Vt(h, x, A), t[a + 1 + 32] = t[a + 3 + 64] = Vt(d, h, x), t[a + 1 + 64] = t[a + 3 + 96] = Vt(m, d, h), t[a + 1 + 96] = Vt(w, m, d);
    }
    function Ho(t, a) {
      var h;
      for (h = 0; 8 > h; ++h) i(t, a + 32 * h, t, a - 32, 8);
    }
    function Ui(t, a) {
      var h;
      for (h = 0; 8 > h; ++h) s(t, a, t[a - 1], 8), a += 32;
    }
    function Dr(t, a, h) {
      var d;
      for (d = 0; 8 > d; ++d) s(a, h + 32 * d, t, 8);
    }
    function gr(t, a) {
      var h, d = 8;
      for (h = 0; 8 > h; ++h) d += t[a + h - 32] + t[a - 1 + 32 * h];
      Dr(d >> 4, t, a);
    }
    function Wo(t, a) {
      var h, d = 4;
      for (h = 0; 8 > h; ++h) d += t[a + h - 32];
      Dr(d >> 3, t, a);
    }
    function qr(t, a) {
      var h, d = 4;
      for (h = 0; 8 > h; ++h) d += t[a - 1 + 32 * h];
      Dr(d >> 3, t, a);
    }
    function Hi(t, a) {
      Dr(128, t, a);
    }
    function ci(t, a, h) {
      var d = t[a - h], m = t[a + 0], w = 3 * (m - d) + $o[1020 + t[a - 2 * h] - t[a + h]], x = Ua[112 + (w + 4 >> 3)];
      t[a - h] = gn[255 + d + Ua[112 + (w + 3 >> 3)]], t[a + 0] = gn[255 + m - x];
    }
    function Ia(t, a, h, d) {
      var m = t[a + 0], w = t[a + h];
      return Nn[255 + t[a - 2 * h] - t[a - h]] > d || Nn[255 + w - m] > d;
    }
    function Fa(t, a, h, d) {
      return 4 * Nn[255 + t[a - h] - t[a + 0]] + Nn[255 + t[a - 2 * h] - t[a + h]] <= d;
    }
    function ja(t, a, h, d, m) {
      var w = t[a - 3 * h], x = t[a - 2 * h], A = t[a - h], S = t[a + 0], I = t[a + h], U = t[a + 2 * h], $ = t[a + 3 * h];
      return 4 * Nn[255 + A - S] + Nn[255 + x - I] > d ? 0 : Nn[255 + t[a - 4 * h] - w] <= m && Nn[255 + w - x] <= m && Nn[255 + x - A] <= m && Nn[255 + $ - U] <= m && Nn[255 + U - I] <= m && Nn[255 + I - S] <= m;
    }
    function Oa(t, a, h, d) {
      var m = 2 * d + 1;
      for (d = 0; 16 > d; ++d) Fa(t, a + d, h, m) && ci(t, a + d, h);
    }
    function $n(t, a, h, d) {
      var m = 2 * d + 1;
      for (d = 0; 16 > d; ++d) Fa(t, a + d * h, 1, m) && ci(t, a + d * h, 1);
    }
    function or(t, a, h, d) {
      var m;
      for (m = 3; 0 < m; --m) Oa(t, a += 4 * h, h, d);
    }
    function Vo(t, a, h, d) {
      var m;
      for (m = 3; 0 < m; --m) $n(t, a += 4, h, d);
    }
    function mr(t, a, h, d, m, w, x, A) {
      for (w = 2 * w + 1; 0 < m--; ) {
        if (ja(t, a, h, w, x)) if (Ia(t, a, h, A)) ci(t, a, h);
        else {
          var S = t, I = a, U = h, $ = S[I - 2 * U], K = S[I - U], J = S[I + 0], vt = S[I + U], ot = S[I + 2 * U], H = 27 * (gt = $o[1020 + 3 * (J - K) + $o[1020 + $ - vt]]) + 63 >> 7, V = 18 * gt + 63 >> 7, gt = 9 * gt + 63 >> 7;
          S[I - 3 * U] = gn[255 + S[I - 3 * U] + gt], S[I - 2 * U] = gn[255 + $ + V], S[I - U] = gn[255 + K + H], S[I + 0] = gn[255 + J - H], S[I + U] = gn[255 + vt - V], S[I + 2 * U] = gn[255 + ot - gt];
        }
        a += d;
      }
    }
    function En(t, a, h, d, m, w, x, A) {
      for (w = 2 * w + 1; 0 < m--; ) {
        if (ja(t, a, h, w, x)) if (Ia(t, a, h, A)) ci(t, a, h);
        else {
          var S = t, I = a, U = h, $ = S[I - U], K = S[I + 0], J = S[I + U], vt = Ua[112 + ((ot = 3 * (K - $)) + 4 >> 3)], ot = Ua[112 + (ot + 3 >> 3)], H = vt + 1 >> 1;
          S[I - 2 * U] = gn[255 + S[I - 2 * U] + H], S[I - U] = gn[255 + $ + ot], S[I + 0] = gn[255 + K - vt], S[I + U] = gn[255 + J - H];
        }
        a += d;
      }
    }
    function Wi(t, a, h, d, m, w) {
      mr(t, a, h, 1, 16, d, m, w);
    }
    function Rr(t, a, h, d, m, w) {
      mr(t, a, 1, h, 16, d, m, w);
    }
    function Go(t, a, h, d, m, w) {
      var x;
      for (x = 3; 0 < x; --x) En(t, a += 4 * h, h, 1, 16, d, m, w);
    }
    function li(t, a, h, d, m, w) {
      var x;
      for (x = 3; 0 < x; --x) En(t, a += 4, 1, h, 16, d, m, w);
    }
    function Jo(t, a, h, d, m, w, x, A) {
      mr(t, a, m, 1, 8, w, x, A), mr(h, d, m, 1, 8, w, x, A);
    }
    function Vi(t, a, h, d, m, w, x, A) {
      mr(t, a, 1, m, 8, w, x, A), mr(h, d, 1, m, 8, w, x, A);
    }
    function Gi(t, a, h, d, m, w, x, A) {
      En(t, a + 4 * m, m, 1, 8, w, x, A), En(h, d + 4 * m, m, 1, 8, w, x, A);
    }
    function Ea(t, a, h, d, m, w, x, A) {
      En(t, a + 4, 1, m, 8, w, x, A), En(h, d + 4, 1, m, 8, w, x, A);
    }
    function hi() {
      this.ba = new kn(), this.ec = [], this.cc = [], this.Mc = [], this.Dc = this.Nc = this.dc = this.fc = 0, this.Oa = new Se(), this.memory = 0, this.Ib = "OutputFunc", this.Jb = "OutputAlphaFunc", this.Nd = "OutputRowFunc";
    }
    function Ji() {
      this.data = [], this.offset = this.kd = this.ha = this.w = 0, this.na = [], this.xa = this.gb = this.Ja = this.Sa = this.P = 0;
    }
    function Yi() {
      this.nc = this.Ea = this.b = this.hc = 0, this.K = [], this.w = 0;
    }
    function Ba() {
      this.ua = 0, this.Wa = new D(), this.vb = new D(), this.md = this.xc = this.wc = 0, this.vc = [], this.Wb = 0, this.Ya = new q(), this.yc = new C();
    }
    function Yo() {
      this.xb = this.a = 0, this.l = new ri(), this.ca = new kn(), this.V = [], this.Ba = 0, this.Ta = [], this.Ua = 0, this.m = new L(), this.Pb = 0, this.wd = new L(), this.Ma = this.$ = this.C = this.i = this.c = this.xd = 0, this.s = new Ba(), this.ab = 0, this.gc = l(4, Yi), this.Oc = 0;
    }
    function ui() {
      this.Lc = this.Z = this.$a = this.i = this.c = 0, this.l = new ri(), this.ic = 0, this.ca = [], this.tb = 0, this.qd = null, this.rd = 0;
    }
    function Tr(t, a, h, d, m, w, x) {
      for (t = t == null ? 0 : t[a + 0], a = 0; a < x; ++a) m[w + a] = t + h[d + a] & 255, t = m[w + a];
    }
    function Xi(t, a, h, d, m, w, x) {
      var A;
      if (t == null) Tr(null, null, h, d, m, w, x);
      else for (A = 0; A < x; ++A) m[w + A] = t[a + A] + h[d + A] & 255;
    }
    function vr(t, a, h, d, m, w, x) {
      if (t == null) Tr(null, null, h, d, m, w, x);
      else {
        var A, S = t[a + 0], I = S, U = S;
        for (A = 0; A < x; ++A) I = U + (S = t[a + A]) - I, U = h[d + A] + (-256 & I ? 0 > I ? 0 : 255 : I) & 255, I = S, m[w + A] = U;
      }
    }
    function $i(t, a, h, d) {
      var m = a.width, w = a.o;
      if (e(t != null && a != null), 0 > h || 0 >= d || h + d > w) return null;
      if (!t.Cc) {
        if (t.ga == null) {
          var x;
          if (t.ga = new ui(), (x = t.ga == null) || (x = a.width * a.o, e(t.Gb.length == 0), t.Gb = o(x), t.Uc = 0, t.Gb == null ? x = 0 : (t.mb = t.Gb, t.nb = t.Uc, t.rc = null, x = 1), x = !x), !x) {
            x = t.ga;
            var A = t.Fa, S = t.P, I = t.qc, U = t.mb, $ = t.nb, K = S + 1, J = I - 1, vt = x.l;
            if (e(A != null && U != null && a != null), Ar[0] = null, Ar[1] = Tr, Ar[2] = Xi, Ar[3] = vr, x.ca = U, x.tb = $, x.c = a.width, x.i = a.height, e(0 < x.c && 0 < x.i), 1 >= I) a = 0;
            else if (x.$a = A[S + 0] >> 0 & 3, x.Z = A[S + 0] >> 2 & 3, x.Lc = A[S + 0] >> 4 & 3, S = A[S + 0] >> 6 & 3, 0 > x.$a || 1 < x.$a || 4 <= x.Z || 1 < x.Lc || S) a = 0;
            else if (vt.put = Wn, vt.ac = Ve, vt.bc = Vn, vt.ma = x, vt.width = a.width, vt.height = a.height, vt.Da = a.Da, vt.v = a.v, vt.va = a.va, vt.j = a.j, vt.o = a.o, x.$a) t: {
              e(x.$a == 1), a = yn();
              e: for (; ; ) {
                if (a == null) {
                  a = 0;
                  break t;
                }
                if (e(x != null), x.mc = a, a.c = x.c, a.i = x.i, a.l = x.l, a.l.ma = x, a.l.width = x.c, a.l.height = x.i, a.a = 0, Z(a.m, A, K, J), !Yn(x.c, x.i, 1, a, null) || (a.ab == 1 && a.gc[0].hc == 3 && ir(a.s) ? (x.ic = 1, A = a.c * a.i, a.Ta = null, a.Ua = 0, a.V = o(A), a.Ba = 0, a.V == null ? (a.a = 1, a = 0) : a = 1) : (x.ic = 0, a = Mr(a, x.c)), !a)) break e;
                a = 1;
                break t;
              }
              x.mc = null, a = 0;
            }
            else a = J >= x.c * x.i;
            x = !a;
          }
          if (x) return null;
          t.ga.Lc != 1 ? t.Ga = 0 : d = w - h;
        }
        e(t.ga != null), e(h + d <= w);
        t: {
          if (a = (A = t.ga).c, w = A.l.o, A.$a == 0) {
            if (K = t.rc, J = t.Vc, vt = t.Fa, S = t.P + 1 + h * a, I = t.mb, U = t.nb + h * a, e(S <= t.P + t.qc), A.Z != 0) for (e(Ar[A.Z] != null), x = 0; x < d; ++x) Ar[A.Z](K, J, vt, S, I, U, a), K = I, J = U, U += a, S += a;
            else for (x = 0; x < d; ++x) i(I, U, vt, S, a), K = I, J = U, U += a, S += a;
            t.rc = K, t.Vc = J;
          } else {
            if (e(A.mc != null), a = h + d, e((x = A.mc) != null), e(a <= x.i), x.C >= a) a = 1;
            else if (A.ic || X(), A.ic) {
              A = x.V, K = x.Ba, J = x.c;
              var ot = x.i, H = (vt = 1, S = x.$ / J, I = x.$ % J, U = x.m, $ = x.s, x.$), V = J * ot, gt = J * a, bt = $.wc, mt = H < gt ? Be($, I, S) : null;
              e(H <= V), e(a <= ot), e(ir($));
              e: for (; ; ) {
                for (; !U.h && H < gt; ) {
                  if (I & bt || (mt = Be($, I, S)), e(mt != null), Y(U), 256 > (ot = on(mt.G[0], mt.H[0], U))) A[K + H] = ot, ++H, ++I >= J && (I = 0, ++S <= a && !(S % 16) && Fn(x, S));
                  else {
                    if (!(280 > ot)) {
                      vt = 0;
                      break e;
                    }
                    ot = Cn(ot - 256, U);
                    var Et, St = on(mt.G[4], mt.H[4], U);
                    if (Y(U), !(H >= (St = Gn(J, St = Cn(St, U))) && V - H >= ot)) {
                      vt = 0;
                      break e;
                    }
                    for (Et = 0; Et < ot; ++Et) A[K + H + Et] = A[K + H + Et - St];
                    for (H += ot, I += ot; I >= J; ) I -= J, ++S <= a && !(S % 16) && Fn(x, S);
                    H < gt && I & bt && (mt = Be($, I, S));
                  }
                  e(U.h == M(U));
                }
                Fn(x, S > a ? a : S);
                break e;
              }
              !vt || U.h && H < V ? (vt = 0, x.a = U.h ? 5 : 3) : x.$ = H, a = vt;
            } else a = jn(x, x.V, x.Ba, x.c, x.i, a, Zr);
            if (!a) {
              d = 0;
              break t;
            }
          }
          h + d >= w && (t.Cc = 1), d = 1;
        }
        if (!d) return null;
        if (t.Cc && ((d = t.ga) != null && (d.mc = null), t.ga = null, 0 < t.Ga)) return alert("todo:WebPDequantizeLevels"), null;
      }
      return t.nb + h * m;
    }
    function c(t, a, h, d, m, w) {
      for (; 0 < m--; ) {
        var x, A = t, S = a + (h ? 1 : 0), I = t, U = a + (h ? 0 : 3);
        for (x = 0; x < d; ++x) {
          var $ = I[U + 4 * x];
          $ != 255 && ($ *= 32897, A[S + 4 * x + 0] = A[S + 4 * x + 0] * $ >> 23, A[S + 4 * x + 1] = A[S + 4 * x + 1] * $ >> 23, A[S + 4 * x + 2] = A[S + 4 * x + 2] * $ >> 23);
        }
        a += w;
      }
    }
    function v(t, a, h, d, m) {
      for (; 0 < d--; ) {
        var w;
        for (w = 0; w < h; ++w) {
          var x = t[a + 2 * w + 0], A = 15 & (I = t[a + 2 * w + 1]), S = 4369 * A, I = (240 & I | I >> 4) * S >> 16;
          t[a + 2 * w + 0] = (240 & x | x >> 4) * S >> 16 & 240 | (15 & x | x << 4) * S >> 16 >> 4 & 15, t[a + 2 * w + 1] = 240 & I | A;
        }
        a += m;
      }
    }
    function j(t, a, h, d, m, w, x, A) {
      var S, I, U = 255;
      for (I = 0; I < m; ++I) {
        for (S = 0; S < d; ++S) {
          var $ = t[a + S];
          w[x + 4 * S] = $, U &= $;
        }
        a += h, x += A;
      }
      return U != 255;
    }
    function R(t, a, h, d, m) {
      var w;
      for (w = 0; w < m; ++w) h[d + w] = t[a + w] >> 8;
    }
    function X() {
      An = c, ye = v, we = j, Fe = R;
    }
    function ct(t, a, h) {
      z[t] = function(d, m, w, x, A, S, I, U, $, K, J, vt, ot, H, V, gt, bt) {
        var mt, Et = bt - 1 >> 1, St = A[S + 0] | I[U + 0] << 16, Rt = $[K + 0] | J[vt + 0] << 16;
        e(d != null);
        var Pt = 3 * St + Rt + 131074 >> 2;
        for (a(d[m + 0], 255 & Pt, Pt >> 16, ot, H), w != null && (Pt = 3 * Rt + St + 131074 >> 2, a(w[x + 0], 255 & Pt, Pt >> 16, V, gt)), mt = 1; mt <= Et; ++mt) {
          var ce = A[S + mt] | I[U + mt] << 16, ue = $[K + mt] | J[vt + mt] << 16, oe = St + ce + Rt + ue + 524296, ne = oe + 2 * (ce + Rt) >> 3;
          Pt = ne + St >> 1, St = (oe = oe + 2 * (St + ue) >> 3) + ce >> 1, a(d[m + 2 * mt - 1], 255 & Pt, Pt >> 16, ot, H + (2 * mt - 1) * h), a(d[m + 2 * mt - 0], 255 & St, St >> 16, ot, H + (2 * mt - 0) * h), w != null && (Pt = oe + Rt >> 1, St = ne + ue >> 1, a(w[x + 2 * mt - 1], 255 & Pt, Pt >> 16, V, gt + (2 * mt - 1) * h), a(w[x + 2 * mt + 0], 255 & St, St >> 16, V, gt + (2 * mt + 0) * h)), St = ce, Rt = ue;
        }
        1 & bt || (Pt = 3 * St + Rt + 131074 >> 2, a(d[m + bt - 1], 255 & Pt, Pt >> 16, ot, H + (bt - 1) * h), w != null && (Pt = 3 * Rt + St + 131074 >> 2, a(w[x + bt - 1], 255 & Pt, Pt >> 16, V, gt + (bt - 1) * h)));
      };
    }
    function yt() {
      Sn[Ha] = pl, Sn[Wa] = Us, Sn[Ds] = gl, Sn[Va] = Hs, Sn[Ga] = Ws, Sn[Ko] = Vs, Sn[qs] = ml, Sn[Zo] = Us, Sn[Qo] = Hs, Sn[Ja] = Ws, Sn[ts] = Vs;
    }
    function Ot(t) {
      return t & ~vl ? 0 > t ? 0 : 255 : t >> Gs;
    }
    function qt(t, a) {
      return Ot((19077 * t >> 8) + (26149 * a >> 8) - 14234);
    }
    function Kt(t, a, h) {
      return Ot((19077 * t >> 8) - (6419 * a >> 8) - (13320 * h >> 8) + 8708);
    }
    function Yt(t, a) {
      return Ot((19077 * t >> 8) + (33050 * a >> 8) - 17685);
    }
    function re(t, a, h, d, m) {
      d[m + 0] = qt(t, h), d[m + 1] = Kt(t, a, h), d[m + 2] = Yt(t, a);
    }
    function Ae(t, a, h, d, m) {
      d[m + 0] = Yt(t, a), d[m + 1] = Kt(t, a, h), d[m + 2] = qt(t, h);
    }
    function _e(t, a, h, d, m) {
      var w = Kt(t, a, h);
      a = w << 3 & 224 | Yt(t, a) >> 3, d[m + 0] = 248 & qt(t, h) | w >> 5, d[m + 1] = a;
    }
    function Me(t, a, h, d, m) {
      var w = 240 & Yt(t, a) | 15;
      d[m + 0] = 240 & qt(t, h) | Kt(t, a, h) >> 4, d[m + 1] = w;
    }
    function $e(t, a, h, d, m) {
      d[m + 0] = 255, re(t, a, h, d, m + 1);
    }
    function ze(t, a, h, d, m) {
      Ae(t, a, h, d, m), d[m + 3] = 255;
    }
    function Bn(t, a, h, d, m) {
      re(t, a, h, d, m), d[m + 3] = 255;
    }
    function pn(t, a) {
      return 0 > t ? 0 : t > a ? a : t;
    }
    function Kn(t, a, h) {
      z[t] = function(d, m, w, x, A, S, I, U, $) {
        for (var K = U + (-2 & $) * h; U != K; ) a(d[m + 0], w[x + 0], A[S + 0], I, U), a(d[m + 1], w[x + 0], A[S + 0], I, U + h), m += 2, ++x, ++S, U += 2 * h;
        1 & $ && a(d[m + 0], w[x + 0], A[S + 0], I, U);
      };
    }
    function Ma(t, a, h) {
      return h == 0 ? t == 0 ? a == 0 ? 6 : 5 : a == 0 ? 4 : 0 : h;
    }
    function Ki(t, a, h, d, m) {
      switch (t >>> 30) {
        case 3:
          lr(a, h, d, m, 0);
          break;
        case 2:
          Ie(a, h, d, m);
          break;
        case 1:
          rn(a, h, d, m);
      }
    }
    function Zi(t, a) {
      var h, d, m = a.M, w = a.Nb, x = t.oc, A = t.pc + 40, S = t.oc, I = t.pc + 584, U = t.oc, $ = t.pc + 600;
      for (h = 0; 16 > h; ++h) x[A + 32 * h - 1] = 129;
      for (h = 0; 8 > h; ++h) S[I + 32 * h - 1] = 129, U[$ + 32 * h - 1] = 129;
      for (0 < m ? x[A - 1 - 32] = S[I - 1 - 32] = U[$ - 1 - 32] = 129 : (s(x, A - 32 - 1, 127, 21), s(S, I - 32 - 1, 127, 9), s(U, $ - 32 - 1, 127, 9)), d = 0; d < t.za; ++d) {
        var K = a.ya[a.aa + d];
        if (0 < d) {
          for (h = -1; 16 > h; ++h) i(x, A + 32 * h - 4, x, A + 32 * h + 12, 4);
          for (h = -1; 8 > h; ++h) i(S, I + 32 * h - 4, S, I + 32 * h + 4, 4), i(U, $ + 32 * h - 4, U, $ + 32 * h + 4, 4);
        }
        var J = t.Gd, vt = t.Hd + d, ot = K.ad, H = K.Hc;
        if (0 < m && (i(x, A - 32, J[vt].y, 0, 16), i(S, I - 32, J[vt].f, 0, 8), i(U, $ - 32, J[vt].ea, 0, 8)), K.Za) {
          var V = x, gt = A - 32 + 16;
          for (0 < m && (d >= t.za - 1 ? s(V, gt, J[vt].y[15], 4) : i(V, gt, J[vt + 1].y, 0, 4)), h = 0; 4 > h; h++) V[gt + 128 + h] = V[gt + 256 + h] = V[gt + 384 + h] = V[gt + 0 + h];
          for (h = 0; 16 > h; ++h, H <<= 2) V = x, gt = A + Ys[h], Mn[K.Ob[h]](V, gt), Ki(H, ot, 16 * +h, V, gt);
        } else if (V = Ma(d, m, K.Ob[0]), Lr[V](x, A), H != 0) for (h = 0; 16 > h; ++h, H <<= 2) Ki(H, ot, 16 * +h, x, A + Ys[h]);
        for (h = K.Gc, V = Ma(d, m, K.Dd), ur[V](S, I), ur[V](U, $), H = ot, V = S, gt = I, 255 & (K = h >> 0) && (170 & K ? ra(H, 256, V, gt) : xn(H, 256, V, gt)), K = U, H = $, 255 & (h >>= 8) && (170 & h ? ra(ot, 320, K, H) : xn(ot, 320, K, H)), m < t.Ub - 1 && (i(J[vt].y, 0, x, A + 480, 16), i(J[vt].f, 0, S, I + 224, 8), i(J[vt].ea, 0, U, $ + 224, 8)), h = 8 * w * t.B, J = t.sa, vt = t.ta + 16 * d + 16 * w * t.R, ot = t.qa, K = t.ra + 8 * d + h, H = t.Ha, V = t.Ia + 8 * d + h, h = 0; 16 > h; ++h) i(J, vt + h * t.R, x, A + 32 * h, 16);
        for (h = 0; 8 > h; ++h) i(ot, K + h * t.B, S, I + 32 * h, 8), i(H, V + h * t.B, U, $ + 32 * h, 8);
      }
    }
    function fi(t, a, h, d, m, w, x, A, S) {
      var I = [0], U = [0], $ = 0, K = S != null ? S.kd : 0, J = S ?? new Ji();
      if (t == null || 12 > h) return 7;
      J.data = t, J.w = a, J.ha = h, a = [a], h = [h], J.gb = [J.gb];
      t: {
        var vt = a, ot = h, H = J.gb;
        if (e(t != null), e(ot != null), e(H != null), H[0] = 0, 12 <= ot[0] && !n(t, vt[0], "RIFF")) {
          if (n(t, vt[0] + 8, "WEBP")) {
            H = 3;
            break t;
          }
          var V = _t(t, vt[0] + 4);
          if (12 > V || 4294967286 < V) {
            H = 3;
            break t;
          }
          if (K && V > ot[0] - 8) {
            H = 7;
            break t;
          }
          H[0] = V, vt[0] += 12, ot[0] -= 12;
        }
        H = 0;
      }
      if (H != 0) return H;
      for (V = 0 < J.gb[0], h = h[0]; ; ) {
        t: {
          var gt = t;
          ot = a, H = h;
          var bt = I, mt = U, Et = vt = [0];
          if ((Pt = $ = [$])[0] = 0, 8 > H[0]) H = 7;
          else {
            if (!n(gt, ot[0], "VP8X")) {
              if (_t(gt, ot[0] + 4) != 10) {
                H = 3;
                break t;
              }
              if (18 > H[0]) {
                H = 7;
                break t;
              }
              var St = _t(gt, ot[0] + 8), Rt = 1 + Ct(gt, ot[0] + 12);
              if (2147483648 <= Rt * (gt = 1 + Ct(gt, ot[0] + 15))) {
                H = 3;
                break t;
              }
              Et != null && (Et[0] = St), bt != null && (bt[0] = Rt), mt != null && (mt[0] = gt), ot[0] += 18, H[0] -= 18, Pt[0] = 1;
            }
            H = 0;
          }
        }
        if ($ = $[0], vt = vt[0], H != 0) return H;
        if (ot = !!(2 & vt), !V && $) return 3;
        if (w != null && (w[0] = !!(16 & vt)), x != null && (x[0] = ot), A != null && (A[0] = 0), x = I[0], vt = U[0], $ && ot && S == null) {
          H = 0;
          break;
        }
        if (4 > h) {
          H = 7;
          break;
        }
        if (V && $ || !V && !$ && !n(t, a[0], "ALPH")) {
          h = [h], J.na = [J.na], J.P = [J.P], J.Sa = [J.Sa];
          t: {
            St = t, H = a, V = h;
            var Pt = J.gb;
            bt = J.na, mt = J.P, Et = J.Sa, Rt = 22, e(St != null), e(V != null), gt = H[0];
            var ce = V[0];
            for (e(bt != null), e(Et != null), bt[0] = null, mt[0] = null, Et[0] = 0; ; ) {
              if (H[0] = gt, V[0] = ce, 8 > ce) {
                H = 7;
                break t;
              }
              var ue = _t(St, gt + 4);
              if (4294967286 < ue) {
                H = 3;
                break t;
              }
              var oe = 8 + ue + 1 & -2;
              if (Rt += oe, 0 < Pt && Rt > Pt) {
                H = 3;
                break t;
              }
              if (!n(St, gt, "VP8 ") || !n(St, gt, "VP8L")) {
                H = 0;
                break t;
              }
              if (ce[0] < oe) {
                H = 7;
                break t;
              }
              n(St, gt, "ALPH") || (bt[0] = St, mt[0] = gt + 8, Et[0] = ue), gt += oe, ce -= oe;
            }
          }
          if (h = h[0], J.na = J.na[0], J.P = J.P[0], J.Sa = J.Sa[0], H != 0) break;
        }
        h = [h], J.Ja = [J.Ja], J.xa = [J.xa];
        t: if (Pt = t, H = a, V = h, bt = J.gb[0], mt = J.Ja, Et = J.xa, St = H[0], gt = !n(Pt, St, "VP8 "), Rt = !n(Pt, St, "VP8L"), e(Pt != null), e(V != null), e(mt != null), e(Et != null), 8 > V[0]) H = 7;
        else {
          if (gt || Rt) {
            if (Pt = _t(Pt, St + 4), 12 <= bt && Pt > bt - 12) {
              H = 3;
              break t;
            }
            if (K && Pt > V[0] - 8) {
              H = 7;
              break t;
            }
            mt[0] = Pt, H[0] += 8, V[0] -= 8, Et[0] = Rt;
          } else Et[0] = 5 <= V[0] && Pt[St + 0] == 47 && !(Pt[St + 4] >> 5), mt[0] = V[0];
          H = 0;
        }
        if (h = h[0], J.Ja = J.Ja[0], J.xa = J.xa[0], a = a[0], H != 0) break;
        if (4294967286 < J.Ja) return 3;
        if (A == null || ot || (A[0] = J.xa ? 2 : 1), x = [x], vt = [vt], J.xa) {
          if (5 > h) {
            H = 7;
            break;
          }
          A = x, K = vt, ot = w, t == null || 5 > h ? t = 0 : 5 <= h && t[a + 0] == 47 && !(t[a + 4] >> 5) ? (V = [0], Pt = [0], bt = [0], Z(mt = new L(), t, a, h), Tt(mt, V, Pt, bt) ? (A != null && (A[0] = V[0]), K != null && (K[0] = Pt[0]), ot != null && (ot[0] = bt[0]), t = 1) : t = 0) : t = 0;
        } else {
          if (10 > h) {
            H = 7;
            break;
          }
          A = vt, t == null || 10 > h || !wa(t, a + 3, h - 3) ? t = 0 : (K = t[a + 0] | t[a + 1] << 8 | t[a + 2] << 16, ot = 16383 & (t[a + 7] << 8 | t[a + 6]), t = 16383 & (t[a + 9] << 8 | t[a + 8]), 1 & K || 3 < (K >> 1 & 7) || !(K >> 4 & 1) || K >> 5 >= J.Ja || !ot || !t ? t = 0 : (x && (x[0] = ot), A && (A[0] = t), t = 1));
        }
        if (!t || (x = x[0], vt = vt[0], $ && (I[0] != x || U[0] != vt))) return 3;
        S != null && (S[0] = J, S.offset = a - S.w, e(4294967286 > a - S.w), e(S.offset == S.ha - h));
        break;
      }
      return H == 0 || H == 7 && $ && S == null ? (w != null && (w[0] |= J.na != null && 0 < J.na.length), d != null && (d[0] = x), m != null && (m[0] = vt), 0) : H;
    }
    function Qi(t, a, h) {
      var d = a.width, m = a.height, w = 0, x = 0, A = d, S = m;
      if (a.Da = t != null && 0 < t.Da, a.Da && (A = t.cd, S = t.bd, w = t.v, x = t.j, 11 > h || (w &= -2, x &= -2), 0 > w || 0 > x || 0 >= A || 0 >= S || w + A > d || x + S > m)) return 0;
      if (a.v = w, a.j = x, a.va = w + A, a.o = x + S, a.U = A, a.T = S, a.da = t != null && 0 < t.da, a.da) {
        if (!$t(A, S, h = [t.ib], w = [t.hb])) return 0;
        a.ib = h[0], a.hb = w[0];
      }
      return a.ob = t != null && t.ob, a.Kb = t == null || !t.Sd, a.da && (a.ob = a.ib < 3 * d / 4 && a.hb < 3 * m / 4, a.Kb = 0), 1;
    }
    function ta(t) {
      if (t == null) return 2;
      if (11 > t.S) {
        var a = t.f.RGBA;
        a.fb += (t.height - 1) * a.A, a.A = -a.A;
      } else a = t.f.kb, t = t.height, a.O += (t - 1) * a.fa, a.fa = -a.fa, a.N += (t - 1 >> 1) * a.Ab, a.Ab = -a.Ab, a.W += (t - 1 >> 1) * a.Db, a.Db = -a.Db, a.F != null && (a.J += (t - 1) * a.lb, a.lb = -a.lb);
      return 0;
    }
    function di(t, a, h, d) {
      if (d == null || 0 >= t || 0 >= a) return 2;
      if (h != null) {
        if (h.Da) {
          var m = h.cd, w = h.bd, x = -2 & h.v, A = -2 & h.j;
          if (0 > x || 0 > A || 0 >= m || 0 >= w || x + m > t || A + w > a) return 2;
          t = m, a = w;
        }
        if (h.da) {
          if (!$t(t, a, m = [h.ib], w = [h.hb])) return 2;
          t = m[0], a = w[0];
        }
      }
      d.width = t, d.height = a;
      t: {
        var S = d.width, I = d.height;
        if (t = d.S, 0 >= S || 0 >= I || !(t >= Ha && 13 > t)) t = 2;
        else {
          if (0 >= d.Rd && d.sd == null) {
            x = w = m = a = 0;
            var U = (A = S * Xs[t]) * I;
            if (11 > t || (w = (I + 1) / 2 * (a = (S + 1) / 2), t == 12 && (x = (m = S) * I)), (I = o(U + 2 * w + x)) == null) {
              t = 1;
              break t;
            }
            d.sd = I, 11 > t ? ((S = d.f.RGBA).eb = I, S.fb = 0, S.A = A, S.size = U) : ((S = d.f.kb).y = I, S.O = 0, S.fa = A, S.Fd = U, S.f = I, S.N = 0 + U, S.Ab = a, S.Cd = w, S.ea = I, S.W = 0 + U + w, S.Db = a, S.Ed = w, t == 12 && (S.F = I, S.J = 0 + U + 2 * w), S.Tc = x, S.lb = m);
          }
          if (a = 1, m = d.S, w = d.width, x = d.height, m >= Ha && 13 > m) if (11 > m) t = d.f.RGBA, a &= (A = Math.abs(t.A)) * (x - 1) + w <= t.size, a &= A >= w * Xs[m], a &= t.eb != null;
          else {
            t = d.f.kb, A = (w + 1) / 2, U = (x + 1) / 2, S = Math.abs(t.fa), I = Math.abs(t.Ab);
            var $ = Math.abs(t.Db), K = Math.abs(t.lb), J = K * (x - 1) + w;
            a &= S * (x - 1) + w <= t.Fd, a &= I * (U - 1) + A <= t.Cd, a = (a &= $ * (U - 1) + A <= t.Ed) & S >= w & I >= A & $ >= A, a &= t.y != null, a &= t.f != null, a &= t.ea != null, m == 12 && (a &= K >= w, a &= J <= t.Tc, a &= t.F != null);
          }
          else a = 0;
          t = a ? 0 : 2;
        }
      }
      return t != 0 || h != null && h.fd && (t = ta(d)), t;
    }
    var Ge = 64, pi = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535, 131071, 262143, 524287, 1048575, 2097151, 4194303, 8388607, 16777215], gi = 24, mi = 32, ea = 8, cn = [0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7];
    Nt("Predictor0", "PredictorAdd0"), z.Predictor0 = function() {
      return 4278190080;
    }, z.Predictor1 = function(t) {
      return t;
    }, z.Predictor2 = function(t, a, h) {
      return a[h + 0];
    }, z.Predictor3 = function(t, a, h) {
      return a[h + 1];
    }, z.Predictor4 = function(t, a, h) {
      return a[h - 1];
    }, z.Predictor5 = function(t, a, h) {
      return kt(kt(t, a[h + 1]), a[h + 0]);
    }, z.Predictor6 = function(t, a, h) {
      return kt(t, a[h - 1]);
    }, z.Predictor7 = function(t, a, h) {
      return kt(t, a[h + 0]);
    }, z.Predictor8 = function(t, a, h) {
      return kt(a[h - 1], a[h + 0]);
    }, z.Predictor9 = function(t, a, h) {
      return kt(a[h + 0], a[h + 1]);
    }, z.Predictor10 = function(t, a, h) {
      return kt(kt(t, a[h - 1]), kt(a[h + 0], a[h + 1]));
    }, z.Predictor11 = function(t, a, h) {
      var d = a[h + 0];
      return 0 >= Qt(d >> 24 & 255, t >> 24 & 255, (a = a[h - 1]) >> 24 & 255) + Qt(d >> 16 & 255, t >> 16 & 255, a >> 16 & 255) + Qt(d >> 8 & 255, t >> 8 & 255, a >> 8 & 255) + Qt(255 & d, 255 & t, 255 & a) ? d : t;
    }, z.Predictor12 = function(t, a, h) {
      var d = a[h + 0];
      return (Dt((t >> 24 & 255) + (d >> 24 & 255) - ((a = a[h - 1]) >> 24 & 255)) << 24 | Dt((t >> 16 & 255) + (d >> 16 & 255) - (a >> 16 & 255)) << 16 | Dt((t >> 8 & 255) + (d >> 8 & 255) - (a >> 8 & 255)) << 8 | Dt((255 & t) + (255 & d) - (255 & a))) >>> 0;
    }, z.Predictor13 = function(t, a, h) {
      var d = a[h - 1];
      return (Gt((t = kt(t, a[h + 0])) >> 24 & 255, d >> 24 & 255) << 24 | Gt(t >> 16 & 255, d >> 16 & 255) << 16 | Gt(t >> 8 & 255, d >> 8 & 255) << 8 | Gt(t >> 0 & 255, d >> 0 & 255)) >>> 0;
    };
    var Xo = z.PredictorAdd0;
    z.PredictorAdd1 = te, Nt("Predictor2", "PredictorAdd2"), Nt("Predictor3", "PredictorAdd3"), Nt("Predictor4", "PredictorAdd4"), Nt("Predictor5", "PredictorAdd5"), Nt("Predictor6", "PredictorAdd6"), Nt("Predictor7", "PredictorAdd7"), Nt("Predictor8", "PredictorAdd8"), Nt("Predictor9", "PredictorAdd9"), Nt("Predictor10", "PredictorAdd10"), Nt("Predictor11", "PredictorAdd11"), Nt("Predictor12", "PredictorAdd12"), Nt("Predictor13", "PredictorAdd13");
    var na = z.PredictorAdd2;
    ee("ColorIndexInverseTransform", "MapARGB", "32b", function(t) {
      return t >> 8 & 255;
    }, function(t) {
      return t;
    }), ee("VP8LColorIndexInverseTransformAlpha", "MapAlpha", "8b", function(t) {
      return t;
    }, function(t) {
      return t >> 8 & 255;
    });
    var Da, wn = z.ColorIndexInverseTransform, vi = z.MapARGB, qa = z.VP8LColorIndexInverseTransformAlpha, Ra = z.MapAlpha, br = z.VP8LPredictorsAdd = [];
    br.length = 16, (z.VP8LPredictors = []).length = 16, (z.VP8LPredictorsAdd_C = []).length = 16, (z.VP8LPredictors_C = []).length = 16;
    var zr, ln, nn, yr, sr, cr, bi, lr, Ie, ra, rn, xn, yi, Ta, ia, Ur, Hr, wr, Wr, wi, Vr, xr, aa, Ln, An, ye, we, Fe, Te = o(511), hr = o(2041), oa = o(225), xi = o(767), za = 0, $o = hr, Ua = oa, gn = xi, Nn = Te, Ha = 0, Wa = 1, Ds = 2, Va = 3, Ga = 4, Ko = 5, qs = 6, Zo = 7, Qo = 8, Ja = 9, ts = 10, tl = [2, 3, 7], el = [3, 3, 11], Rs = [280, 256, 256, 256, 40], nl = [0, 1, 1, 1, 0], rl = [17, 18, 0, 1, 2, 3, 4, 5, 16, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], il = [24, 7, 23, 25, 40, 6, 39, 41, 22, 26, 38, 42, 56, 5, 55, 57, 21, 27, 54, 58, 37, 43, 72, 4, 71, 73, 20, 28, 53, 59, 70, 74, 36, 44, 88, 69, 75, 52, 60, 3, 87, 89, 19, 29, 86, 90, 35, 45, 68, 76, 85, 91, 51, 61, 104, 2, 103, 105, 18, 30, 102, 106, 34, 46, 84, 92, 67, 77, 101, 107, 50, 62, 120, 1, 119, 121, 83, 93, 17, 31, 100, 108, 66, 78, 118, 122, 33, 47, 117, 123, 49, 63, 99, 109, 82, 94, 0, 116, 124, 65, 79, 16, 32, 98, 110, 48, 115, 125, 81, 95, 64, 114, 126, 97, 111, 80, 113, 127, 96, 112], al = [2954, 2956, 2958, 2962, 2970, 2986, 3018, 3082, 3212, 3468, 3980, 5004], ol = 8, es = [4, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 17, 18, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 25, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 93, 95, 96, 98, 100, 101, 102, 104, 106, 108, 110, 112, 114, 116, 118, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140, 143, 145, 148, 151, 154, 157], ns = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 119, 122, 125, 128, 131, 134, 137, 140, 143, 146, 149, 152, 155, 158, 161, 164, 167, 170, 173, 177, 181, 185, 189, 193, 197, 201, 205, 209, 213, 217, 221, 225, 229, 234, 239, 245, 249, 254, 259, 264, 269, 274, 279, 284], sa = null, sl = [[173, 148, 140, 0], [176, 155, 140, 135, 0], [180, 157, 141, 134, 130, 0], [254, 254, 243, 230, 196, 177, 153, 140, 133, 130, 129, 0]], cl = [0, 1, 4, 8, 5, 2, 3, 6, 9, 12, 13, 10, 7, 11, 14, 15], Ts = [-0, 1, -1, 2, -2, 3, 4, 6, -3, 5, -4, -5, -6, 7, -7, 8, -8, -9], ll = [[[[128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128], [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128], [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]], [[253, 136, 254, 255, 228, 219, 128, 128, 128, 128, 128], [189, 129, 242, 255, 227, 213, 255, 219, 128, 128, 128], [106, 126, 227, 252, 214, 209, 255, 255, 128, 128, 128]], [[1, 98, 248, 255, 236, 226, 255, 255, 128, 128, 128], [181, 133, 238, 254, 221, 234, 255, 154, 128, 128, 128], [78, 134, 202, 247, 198, 180, 255, 219, 128, 128, 128]], [[1, 185, 249, 255, 243, 255, 128, 128, 128, 128, 128], [184, 150, 247, 255, 236, 224, 128, 128, 128, 128, 128], [77, 110, 216, 255, 236, 230, 128, 128, 128, 128, 128]], [[1, 101, 251, 255, 241, 255, 128, 128, 128, 128, 128], [170, 139, 241, 252, 236, 209, 255, 255, 128, 128, 128], [37, 116, 196, 243, 228, 255, 255, 255, 128, 128, 128]], [[1, 204, 254, 255, 245, 255, 128, 128, 128, 128, 128], [207, 160, 250, 255, 238, 128, 128, 128, 128, 128, 128], [102, 103, 231, 255, 211, 171, 128, 128, 128, 128, 128]], [[1, 152, 252, 255, 240, 255, 128, 128, 128, 128, 128], [177, 135, 243, 255, 234, 225, 128, 128, 128, 128, 128], [80, 129, 211, 255, 194, 224, 128, 128, 128, 128, 128]], [[1, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128], [246, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128], [255, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]]], [[[198, 35, 237, 223, 193, 187, 162, 160, 145, 155, 62], [131, 45, 198, 221, 172, 176, 220, 157, 252, 221, 1], [68, 47, 146, 208, 149, 167, 221, 162, 255, 223, 128]], [[1, 149, 241, 255, 221, 224, 255, 255, 128, 128, 128], [184, 141, 234, 253, 222, 220, 255, 199, 128, 128, 128], [81, 99, 181, 242, 176, 190, 249, 202, 255, 255, 128]], [[1, 129, 232, 253, 214, 197, 242, 196, 255, 255, 128], [99, 121, 210, 250, 201, 198, 255, 202, 128, 128, 128], [23, 91, 163, 242, 170, 187, 247, 210, 255, 255, 128]], [[1, 200, 246, 255, 234, 255, 128, 128, 128, 128, 128], [109, 178, 241, 255, 231, 245, 255, 255, 128, 128, 128], [44, 130, 201, 253, 205, 192, 255, 255, 128, 128, 128]], [[1, 132, 239, 251, 219, 209, 255, 165, 128, 128, 128], [94, 136, 225, 251, 218, 190, 255, 255, 128, 128, 128], [22, 100, 174, 245, 186, 161, 255, 199, 128, 128, 128]], [[1, 182, 249, 255, 232, 235, 128, 128, 128, 128, 128], [124, 143, 241, 255, 227, 234, 128, 128, 128, 128, 128], [35, 77, 181, 251, 193, 211, 255, 205, 128, 128, 128]], [[1, 157, 247, 255, 236, 231, 255, 255, 128, 128, 128], [121, 141, 235, 255, 225, 227, 255, 255, 128, 128, 128], [45, 99, 188, 251, 195, 217, 255, 224, 128, 128, 128]], [[1, 1, 251, 255, 213, 255, 128, 128, 128, 128, 128], [203, 1, 248, 255, 255, 128, 128, 128, 128, 128, 128], [137, 1, 177, 255, 224, 255, 128, 128, 128, 128, 128]]], [[[253, 9, 248, 251, 207, 208, 255, 192, 128, 128, 128], [175, 13, 224, 243, 193, 185, 249, 198, 255, 255, 128], [73, 17, 171, 221, 161, 179, 236, 167, 255, 234, 128]], [[1, 95, 247, 253, 212, 183, 255, 255, 128, 128, 128], [239, 90, 244, 250, 211, 209, 255, 255, 128, 128, 128], [155, 77, 195, 248, 188, 195, 255, 255, 128, 128, 128]], [[1, 24, 239, 251, 218, 219, 255, 205, 128, 128, 128], [201, 51, 219, 255, 196, 186, 128, 128, 128, 128, 128], [69, 46, 190, 239, 201, 218, 255, 228, 128, 128, 128]], [[1, 191, 251, 255, 255, 128, 128, 128, 128, 128, 128], [223, 165, 249, 255, 213, 255, 128, 128, 128, 128, 128], [141, 124, 248, 255, 255, 128, 128, 128, 128, 128, 128]], [[1, 16, 248, 255, 255, 128, 128, 128, 128, 128, 128], [190, 36, 230, 255, 236, 255, 128, 128, 128, 128, 128], [149, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128]], [[1, 226, 255, 128, 128, 128, 128, 128, 128, 128, 128], [247, 192, 255, 128, 128, 128, 128, 128, 128, 128, 128], [240, 128, 255, 128, 128, 128, 128, 128, 128, 128, 128]], [[1, 134, 252, 255, 255, 128, 128, 128, 128, 128, 128], [213, 62, 250, 255, 255, 128, 128, 128, 128, 128, 128], [55, 93, 255, 128, 128, 128, 128, 128, 128, 128, 128]], [[128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128], [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128], [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]]], [[[202, 24, 213, 235, 186, 191, 220, 160, 240, 175, 255], [126, 38, 182, 232, 169, 184, 228, 174, 255, 187, 128], [61, 46, 138, 219, 151, 178, 240, 170, 255, 216, 128]], [[1, 112, 230, 250, 199, 191, 247, 159, 255, 255, 128], [166, 109, 228, 252, 211, 215, 255, 174, 128, 128, 128], [39, 77, 162, 232, 172, 180, 245, 178, 255, 255, 128]], [[1, 52, 220, 246, 198, 199, 249, 220, 255, 255, 128], [124, 74, 191, 243, 183, 193, 250, 221, 255, 255, 128], [24, 71, 130, 219, 154, 170, 243, 182, 255, 255, 128]], [[1, 182, 225, 249, 219, 240, 255, 224, 128, 128, 128], [149, 150, 226, 252, 216, 205, 255, 171, 128, 128, 128], [28, 108, 170, 242, 183, 194, 254, 223, 255, 255, 128]], [[1, 81, 230, 252, 204, 203, 255, 192, 128, 128, 128], [123, 102, 209, 247, 188, 196, 255, 233, 128, 128, 128], [20, 95, 153, 243, 164, 173, 255, 203, 128, 128, 128]], [[1, 222, 248, 255, 216, 213, 128, 128, 128, 128, 128], [168, 175, 246, 252, 235, 205, 255, 255, 128, 128, 128], [47, 116, 215, 255, 211, 212, 255, 255, 128, 128, 128]], [[1, 121, 236, 253, 212, 214, 255, 255, 128, 128, 128], [141, 84, 213, 252, 201, 202, 255, 219, 128, 128, 128], [42, 80, 160, 240, 162, 185, 255, 205, 128, 128, 128]], [[1, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128], [244, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128], [238, 1, 255, 128, 128, 128, 128, 128, 128, 128, 128]]]], hl = [[[231, 120, 48, 89, 115, 113, 120, 152, 112], [152, 179, 64, 126, 170, 118, 46, 70, 95], [175, 69, 143, 80, 85, 82, 72, 155, 103], [56, 58, 10, 171, 218, 189, 17, 13, 152], [114, 26, 17, 163, 44, 195, 21, 10, 173], [121, 24, 80, 195, 26, 62, 44, 64, 85], [144, 71, 10, 38, 171, 213, 144, 34, 26], [170, 46, 55, 19, 136, 160, 33, 206, 71], [63, 20, 8, 114, 114, 208, 12, 9, 226], [81, 40, 11, 96, 182, 84, 29, 16, 36]], [[134, 183, 89, 137, 98, 101, 106, 165, 148], [72, 187, 100, 130, 157, 111, 32, 75, 80], [66, 102, 167, 99, 74, 62, 40, 234, 128], [41, 53, 9, 178, 241, 141, 26, 8, 107], [74, 43, 26, 146, 73, 166, 49, 23, 157], [65, 38, 105, 160, 51, 52, 31, 115, 128], [104, 79, 12, 27, 217, 255, 87, 17, 7], [87, 68, 71, 44, 114, 51, 15, 186, 23], [47, 41, 14, 110, 182, 183, 21, 17, 194], [66, 45, 25, 102, 197, 189, 23, 18, 22]], [[88, 88, 147, 150, 42, 46, 45, 196, 205], [43, 97, 183, 117, 85, 38, 35, 179, 61], [39, 53, 200, 87, 26, 21, 43, 232, 171], [56, 34, 51, 104, 114, 102, 29, 93, 77], [39, 28, 85, 171, 58, 165, 90, 98, 64], [34, 22, 116, 206, 23, 34, 43, 166, 73], [107, 54, 32, 26, 51, 1, 81, 43, 31], [68, 25, 106, 22, 64, 171, 36, 225, 114], [34, 19, 21, 102, 132, 188, 16, 76, 124], [62, 18, 78, 95, 85, 57, 50, 48, 51]], [[193, 101, 35, 159, 215, 111, 89, 46, 111], [60, 148, 31, 172, 219, 228, 21, 18, 111], [112, 113, 77, 85, 179, 255, 38, 120, 114], [40, 42, 1, 196, 245, 209, 10, 25, 109], [88, 43, 29, 140, 166, 213, 37, 43, 154], [61, 63, 30, 155, 67, 45, 68, 1, 209], [100, 80, 8, 43, 154, 1, 51, 26, 71], [142, 78, 78, 16, 255, 128, 34, 197, 171], [41, 40, 5, 102, 211, 183, 4, 1, 221], [51, 50, 17, 168, 209, 192, 23, 25, 82]], [[138, 31, 36, 171, 27, 166, 38, 44, 229], [67, 87, 58, 169, 82, 115, 26, 59, 179], [63, 59, 90, 180, 59, 166, 93, 73, 154], [40, 40, 21, 116, 143, 209, 34, 39, 175], [47, 15, 16, 183, 34, 223, 49, 45, 183], [46, 17, 33, 183, 6, 98, 15, 32, 183], [57, 46, 22, 24, 128, 1, 54, 17, 37], [65, 32, 73, 115, 28, 128, 23, 128, 205], [40, 3, 9, 115, 51, 192, 18, 6, 223], [87, 37, 9, 115, 59, 77, 64, 21, 47]], [[104, 55, 44, 218, 9, 54, 53, 130, 226], [64, 90, 70, 205, 40, 41, 23, 26, 57], [54, 57, 112, 184, 5, 41, 38, 166, 213], [30, 34, 26, 133, 152, 116, 10, 32, 134], [39, 19, 53, 221, 26, 114, 32, 73, 255], [31, 9, 65, 234, 2, 15, 1, 118, 73], [75, 32, 12, 51, 192, 255, 160, 43, 51], [88, 31, 35, 67, 102, 85, 55, 186, 85], [56, 21, 23, 111, 59, 205, 45, 37, 192], [55, 38, 70, 124, 73, 102, 1, 34, 98]], [[125, 98, 42, 88, 104, 85, 117, 175, 82], [95, 84, 53, 89, 128, 100, 113, 101, 45], [75, 79, 123, 47, 51, 128, 81, 171, 1], [57, 17, 5, 71, 102, 57, 53, 41, 49], [38, 33, 13, 121, 57, 73, 26, 1, 85], [41, 10, 67, 138, 77, 110, 90, 47, 114], [115, 21, 2, 10, 102, 255, 166, 23, 6], [101, 29, 16, 10, 85, 128, 101, 196, 26], [57, 18, 10, 102, 102, 213, 34, 20, 43], [117, 20, 15, 36, 163, 128, 68, 1, 26]], [[102, 61, 71, 37, 34, 53, 31, 243, 192], [69, 60, 71, 38, 73, 119, 28, 222, 37], [68, 45, 128, 34, 1, 47, 11, 245, 171], [62, 17, 19, 70, 146, 85, 55, 62, 70], [37, 43, 37, 154, 100, 163, 85, 160, 1], [63, 9, 92, 136, 28, 64, 32, 201, 85], [75, 15, 9, 9, 64, 255, 184, 119, 16], [86, 6, 28, 5, 64, 255, 25, 248, 1], [56, 8, 17, 132, 137, 255, 55, 116, 128], [58, 15, 20, 82, 135, 57, 26, 121, 40]], [[164, 50, 31, 137, 154, 133, 25, 35, 218], [51, 103, 44, 131, 131, 123, 31, 6, 158], [86, 40, 64, 135, 148, 224, 45, 183, 128], [22, 26, 17, 131, 240, 154, 14, 1, 209], [45, 16, 21, 91, 64, 222, 7, 1, 197], [56, 21, 39, 155, 60, 138, 23, 102, 213], [83, 12, 13, 54, 192, 255, 68, 47, 28], [85, 26, 85, 85, 128, 128, 32, 146, 171], [18, 11, 7, 63, 144, 171, 4, 4, 246], [35, 27, 10, 146, 174, 171, 12, 26, 128]], [[190, 80, 35, 99, 180, 80, 126, 54, 45], [85, 126, 47, 87, 176, 51, 41, 20, 32], [101, 75, 128, 139, 118, 146, 116, 128, 85], [56, 41, 15, 176, 236, 85, 37, 9, 62], [71, 30, 17, 119, 118, 255, 17, 18, 138], [101, 38, 60, 138, 55, 70, 43, 26, 142], [146, 36, 19, 30, 171, 255, 97, 27, 20], [138, 45, 61, 62, 219, 1, 81, 188, 64], [32, 41, 20, 117, 151, 142, 20, 21, 163], [112, 19, 12, 61, 195, 128, 48, 4, 24]]], ul = [[[[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[176, 246, 255, 255, 255, 255, 255, 255, 255, 255, 255], [223, 241, 252, 255, 255, 255, 255, 255, 255, 255, 255], [249, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 244, 252, 255, 255, 255, 255, 255, 255, 255, 255], [234, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [253, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 246, 254, 255, 255, 255, 255, 255, 255, 255, 255], [239, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 248, 254, 255, 255, 255, 255, 255, 255, 255, 255], [251, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [251, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 254, 253, 255, 254, 255, 255, 255, 255, 255, 255], [250, 255, 254, 255, 254, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]]], [[[217, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [225, 252, 241, 253, 255, 255, 254, 255, 255, 255, 255], [234, 250, 241, 250, 253, 255, 253, 254, 255, 255, 255]], [[255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [223, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [238, 253, 254, 254, 255, 255, 255, 255, 255, 255, 255]], [[255, 248, 254, 255, 255, 255, 255, 255, 255, 255, 255], [249, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 253, 255, 255, 255, 255, 255, 255, 255, 255, 255], [247, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [252, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [253, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 254, 253, 255, 255, 255, 255, 255, 255, 255, 255], [250, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]]], [[[186, 251, 250, 255, 255, 255, 255, 255, 255, 255, 255], [234, 251, 244, 254, 255, 255, 255, 255, 255, 255, 255], [251, 251, 243, 253, 254, 255, 254, 255, 255, 255, 255]], [[255, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [236, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [251, 253, 253, 254, 254, 255, 255, 255, 255, 255, 255]], [[255, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [254, 254, 254, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]]], [[[248, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [250, 254, 252, 254, 255, 255, 255, 255, 255, 255, 255], [248, 254, 249, 253, 255, 255, 255, 255, 255, 255, 255]], [[255, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255], [246, 253, 253, 255, 255, 255, 255, 255, 255, 255, 255], [252, 254, 251, 254, 254, 255, 255, 255, 255, 255, 255]], [[255, 254, 252, 255, 255, 255, 255, 255, 255, 255, 255], [248, 254, 253, 255, 255, 255, 255, 255, 255, 255, 255], [253, 255, 254, 254, 255, 255, 255, 255, 255, 255, 255]], [[255, 251, 254, 255, 255, 255, 255, 255, 255, 255, 255], [245, 251, 254, 255, 255, 255, 255, 255, 255, 255, 255], [253, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 251, 253, 255, 255, 255, 255, 255, 255, 255, 255], [252, 253, 254, 255, 255, 255, 255, 255, 255, 255, 255], [255, 254, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 252, 255, 255, 255, 255, 255, 255, 255, 255, 255], [249, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 254, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 253, 255, 255, 255, 255, 255, 255, 255, 255], [250, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]], [[255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [254, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255], [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]]]], fl = [0, 1, 2, 3, 6, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 7, 0], Lr = [], Mn = [], ur = [], dl = 1, zs = 2, Ar = [], Sn = [];
    ct("UpsampleRgbLinePair", re, 3), ct("UpsampleBgrLinePair", Ae, 3), ct("UpsampleRgbaLinePair", Bn, 4), ct("UpsampleBgraLinePair", ze, 4), ct("UpsampleArgbLinePair", $e, 4), ct("UpsampleRgba4444LinePair", Me, 2), ct("UpsampleRgb565LinePair", _e, 2);
    var pl = z.UpsampleRgbLinePair, gl = z.UpsampleBgrLinePair, Us = z.UpsampleRgbaLinePair, Hs = z.UpsampleBgraLinePair, Ws = z.UpsampleArgbLinePair, Vs = z.UpsampleRgba4444LinePair, ml = z.UpsampleRgb565LinePair, Ya = 16, Xa = 1 << Ya - 1, ca = -227, rs = 482, Gs = 6, vl = (256 << Gs) - 1, Js = 0, bl = o(256), yl = o(256), wl = o(256), xl = o(256), Ll = o(rs - ca), Al = o(rs - ca);
    Kn("YuvToRgbRow", re, 3), Kn("YuvToBgrRow", Ae, 3), Kn("YuvToRgbaRow", Bn, 4), Kn("YuvToBgraRow", ze, 4), Kn("YuvToArgbRow", $e, 4), Kn("YuvToRgba4444Row", Me, 2), Kn("YuvToRgb565Row", _e, 2);
    var Ys = [0, 4, 8, 12, 128, 132, 136, 140, 256, 260, 264, 268, 384, 388, 392, 396], $a = [0, 2, 8], Nl = [8, 7, 6, 4, 4, 2, 2, 2, 1, 1, 1, 1], Sl = 1;
    this.WebPDecodeRGBA = function(t, a, h, d, m) {
      var w = Wa, x = new hi(), A = new kn();
      x.ba = A, A.S = w, A.width = [A.width], A.height = [A.height];
      var S = A.width, I = A.height, U = new rr();
      if (U == null || t == null) var $ = 2;
      else e(U != null), $ = fi(t, a, h, U.width, U.height, U.Pd, U.Qd, U.format, null);
      if ($ != 0 ? S = 0 : (S != null && (S[0] = U.width[0]), I != null && (I[0] = U.height[0]), S = 1), S) {
        A.width = A.width[0], A.height = A.height[0], d != null && (d[0] = A.width), m != null && (m[0] = A.height);
        t: {
          if (d = new ri(), (m = new Ji()).data = t, m.w = a, m.ha = h, m.kd = 1, a = [0], e(m != null), ((t = fi(m.data, m.w, m.ha, null, null, null, a, null, m)) == 0 || t == 7) && a[0] && (t = 4), (a = t) == 0) {
            if (e(x != null), d.data = m.data, d.w = m.w + m.offset, d.ha = m.ha - m.offset, d.put = Wn, d.ac = Ve, d.bc = Vn, d.ma = x, m.xa) {
              if ((t = yn()) == null) {
                x = 1;
                break t;
              }
              if (function(K, J) {
                var vt = [0], ot = [0], H = [0];
                e: for (; ; ) {
                  if (K == null) return 0;
                  if (J == null) return K.a = 2, 0;
                  if (K.l = J, K.a = 0, Z(K.m, J.data, J.w, J.ha), !Tt(K.m, vt, ot, H)) {
                    K.a = 3;
                    break e;
                  }
                  if (K.xb = zs, J.width = vt[0], J.height = ot[0], !Yn(vt[0], ot[0], 1, K, null)) break e;
                  return 1;
                }
                return e(K.a != 0), 0;
              }(t, d)) {
                if (d = (a = di(d.width, d.height, x.Oa, x.ba)) == 0) {
                  e: {
                    d = t;
                    n: for (; ; ) {
                      if (d == null) {
                        d = 0;
                        break e;
                      }
                      if (e(d.s.yc != null), e(d.s.Ya != null), e(0 < d.s.Wb), e((h = d.l) != null), e((m = h.ma) != null), d.xb != 0) {
                        if (d.ca = m.ba, d.tb = m.tb, e(d.ca != null), !Qi(m.Oa, h, Va)) {
                          d.a = 2;
                          break n;
                        }
                        if (!Mr(d, h.width) || h.da) break n;
                        if ((h.da || le(d.ca.S)) && X(), 11 > d.ca.S || (alert("todo:WebPInitConvertARGBToYUV"), d.ca.f.kb.F != null && X()), d.Pb && 0 < d.s.ua && d.s.vb.X == null && !zt(d.s.vb, d.s.Wa.Xa)) {
                          d.a = 1;
                          break n;
                        }
                        d.xb = 0;
                      }
                      if (!jn(d, d.V, d.Ba, d.c, d.i, h.o, Kr)) break n;
                      m.Dc = d.Ma, d = 1;
                      break e;
                    }
                    e(d.a != 0), d = 0;
                  }
                  d = !d;
                }
                d && (a = t.a);
              } else a = t.a;
            } else {
              if ((t = new Io()) == null) {
                x = 1;
                break t;
              }
              if (t.Fa = m.na, t.P = m.P, t.qc = m.Sa, xa(t, d)) {
                if ((a = di(d.width, d.height, x.Oa, x.ba)) == 0) {
                  if (t.Aa = 0, h = x.Oa, e((m = t) != null), h != null) {
                    if (0 < (S = 0 > (S = h.Md) ? 0 : 100 < S ? 255 : 255 * S / 100)) {
                      for (I = U = 0; 4 > I; ++I) 12 > ($ = m.pb[I]).lc && ($.ia = S * Nl[0 > $.lc ? 0 : $.lc] >> 3), U |= $.ia;
                      U && (alert("todo:VP8InitRandom"), m.ia = 1);
                    }
                    m.Ga = h.Id, 100 < m.Ga ? m.Ga = 100 : 0 > m.Ga && (m.Ga = 0);
                  }
                  Fo(t, d) || (a = t.a);
                }
              } else a = t.a;
            }
            a == 0 && x.Oa != null && x.Oa.fd && (a = ta(x.ba));
          }
          x = a;
        }
        w = x != 0 ? null : 11 > w ? A.f.RGBA.eb : A.f.kb.y;
      } else w = null;
      return w;
    };
    var Xs = [3, 4, 3, 4, 4, 2, 2, 4, 4, 4, 2, 1, 1];
  };
  function g(z, rt) {
    for (var dt = "", P = 0; P < 4; P++) dt += String.fromCharCode(z[rt++]);
    return dt;
  }
  function y(z, rt) {
    return (z[rt + 0] << 0 | z[rt + 1] << 8 | z[rt + 2] << 16) >>> 0;
  }
  function b(z, rt) {
    return (z[rt + 0] << 0 | z[rt + 1] << 8 | z[rt + 2] << 16 | z[rt + 3] << 24) >>> 0;
  }
  new f();
  var N = [0], p = [0], O = [], k = new f(), B = r, _ = function(z, rt) {
    var dt = {}, P = 0, C = !1, W = 0, q = 0;
    if (dt.frames = [], !/** @license
       * Copyright (c) 2017 Dominik Homberger
      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
      The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      https://webpjs.appspot.com
      WebPRiffParser dominikhlbg@gmail.com
      */
    function(F, M, T, Y) {
      for (var Q = 0; Q < Y; Q++) if (F[M + Q] != T.charCodeAt(Q)) return !0;
      return !1;
    }(z, rt, "RIFF", 4)) {
      var st, it;
      for (b(z, rt += 4), rt += 8; rt < z.length; ) {
        var ht = g(z, rt), Z = b(z, rt += 4);
        rt += 4;
        var ut = Z + (1 & Z);
        switch (ht) {
          case "VP8 ":
          case "VP8L":
            dt.frames[P] === void 0 && (dt.frames[P] = {}), (L = dt.frames[P]).src_off = C ? q : rt - 8, L.src_size = W + Z + 8, P++, C && (C = !1, W = 0, q = 0);
            break;
          case "VP8X":
            (L = dt.header = {}).feature_flags = z[rt];
            var pt = rt + 4;
            L.canvas_width = 1 + y(z, pt), pt += 3, L.canvas_height = 1 + y(z, pt), pt += 3;
            break;
          case "ALPH":
            C = !0, W = ut + 8, q = rt - 8;
            break;
          case "ANIM":
            (L = dt.header).bgcolor = b(z, rt), pt = rt + 4, L.loop_count = (st = z)[(it = pt) + 0] << 0 | st[it + 1] << 8, pt += 2;
            break;
          case "ANMF":
            var It, L;
            (L = dt.frames[P] = {}).offset_x = 2 * y(z, rt), rt += 3, L.offset_y = 2 * y(z, rt), rt += 3, L.width = 1 + y(z, rt), rt += 3, L.height = 1 + y(z, rt), rt += 3, L.duration = y(z, rt), rt += 3, It = z[rt++], L.dispose = 1 & It, L.blend = It >> 1 & 1;
        }
        ht != "ANMF" && (rt += ut);
      }
      return dt;
    }
  }(B, 0);
  _.response = B, _.rgbaoutput = !0, _.dataurl = !1;
  var E = _.header ? _.header : null, G = _.frames ? _.frames : null;
  if (E) {
    E.loop_counter = E.loop_count, N = [E.canvas_height], p = [E.canvas_width];
    for (var at = 0; at < G.length && G[at].blend != 0; at++) ;
  }
  var lt = G[0], wt = k.WebPDecodeRGBA(B, lt.src_off, lt.src_size, p, N);
  lt.rgba = wt, lt.imgwidth = p[0], lt.imgheight = N[0];
  for (var tt = 0; tt < p[0] * N[0] * 4; tt++) O[tt] = wt[tt];
  return this.width = p, this.height = N, this.data = O, this;
}
(function(r) {
  var e = function() {
    return typeof _s == "function";
  }, n = function(N, p, O, k) {
    var B = 4, _ = l;
    switch (k) {
      case r.image_compression.FAST:
        B = 1, _ = o;
        break;
      case r.image_compression.MEDIUM:
        B = 6, _ = u;
        break;
      case r.image_compression.SLOW:
        B = 9, _ = f;
    }
    N = i(N, p, O, _);
    var E = _s(N, { level: B });
    return r.__addimage__.arrayBufferToBinaryString(E);
  }, i = function(N, p, O, k) {
    for (var B, _, E, G = N.length / p, at = new Uint8Array(N.length + G), lt = y(), wt = 0; wt < G; wt += 1) {
      if (E = wt * p, B = N.subarray(E, E + p), k) at.set(k(B, O, _), E + wt);
      else {
        for (var tt, z = lt.length, rt = []; tt < z; tt += 1) rt[tt] = lt[tt](B, O, _);
        var dt = b(rt.concat());
        at.set(rt[dt], E + wt);
      }
      _ = B;
    }
    return at;
  }, s = function(N) {
    var p = Array.apply([], N);
    return p.unshift(0), p;
  }, o = function(N, p) {
    var O, k = [], B = N.length;
    k[0] = 1;
    for (var _ = 0; _ < B; _ += 1) O = N[_ - p] || 0, k[_ + 1] = N[_] - O + 256 & 255;
    return k;
  }, l = function(N, p, O) {
    var k, B = [], _ = N.length;
    B[0] = 2;
    for (var E = 0; E < _; E += 1) k = O && O[E] || 0, B[E + 1] = N[E] - k + 256 & 255;
    return B;
  }, u = function(N, p, O) {
    var k, B, _ = [], E = N.length;
    _[0] = 3;
    for (var G = 0; G < E; G += 1) k = N[G - p] || 0, B = O && O[G] || 0, _[G + 1] = N[G] + 256 - (k + B >>> 1) & 255;
    return _;
  }, f = function(N, p, O) {
    var k, B, _, E, G = [], at = N.length;
    G[0] = 4;
    for (var lt = 0; lt < at; lt += 1) k = N[lt - p] || 0, B = O && O[lt] || 0, _ = O && O[lt - p] || 0, E = g(k, B, _), G[lt + 1] = N[lt] - E + 256 & 255;
    return G;
  }, g = function(N, p, O) {
    if (N === p && p === O) return N;
    var k = Math.abs(p - O), B = Math.abs(N - O), _ = Math.abs(N + p - O - O);
    return k <= B && k <= _ ? N : B <= _ ? p : O;
  }, y = function() {
    return [s, o, l, u, f];
  }, b = function(N) {
    var p = N.map(function(O) {
      return O.reduce(function(k, B) {
        return k + Math.abs(B);
      }, 0);
    });
    return p.indexOf(Math.min.apply(null, p));
  };
  r.processPNG = function(N, p, O, k) {
    var B, _, E, G, at, lt, wt, tt, z, rt, dt, P, C, W, q, st = this.decode.FLATE_DECODE, it = "";
    if (this.__addimage__.isArrayBuffer(N) && (N = new Uint8Array(N)), this.__addimage__.isArrayBufferView(N)) {
      if (N = (E = new Mh(N)).imgData, _ = E.bits, B = E.colorSpace, at = E.colors, [4, 6].indexOf(E.colorType) !== -1) {
        if (E.bits === 8) {
          z = (tt = E.pixelBitlength == 32 ? new Uint32Array(E.decodePixels().buffer) : E.pixelBitlength == 16 ? new Uint16Array(E.decodePixels().buffer) : new Uint8Array(E.decodePixels().buffer)).length, dt = new Uint8Array(z * E.colors), rt = new Uint8Array(z);
          var ht, Z = E.pixelBitlength - E.bits;
          for (W = 0, q = 0; W < z; W++) {
            for (C = tt[W], ht = 0; ht < Z; ) dt[q++] = C >>> ht & 255, ht += E.bits;
            rt[W] = C >>> ht & 255;
          }
        }
        if (E.bits === 16) {
          z = (tt = new Uint32Array(E.decodePixels().buffer)).length, dt = new Uint8Array(z * (32 / E.pixelBitlength) * E.colors), rt = new Uint8Array(z * (32 / E.pixelBitlength)), P = E.colors > 1, W = 0, q = 0;
          for (var ut = 0; W < z; ) C = tt[W++], dt[q++] = C >>> 0 & 255, P && (dt[q++] = C >>> 16 & 255, C = tt[W++], dt[q++] = C >>> 0 & 255), rt[ut++] = C >>> 16 & 255;
          _ = 8;
        }
        k !== r.image_compression.NONE && e() ? (N = n(dt, E.width * E.colors, E.colors, k), wt = n(rt, E.width, 1, k)) : (N = dt, wt = rt, st = void 0);
      }
      if (E.colorType === 3 && (B = this.color_spaces.INDEXED, lt = E.palette, E.transparency.indexed)) {
        var pt = E.transparency.indexed, It = 0;
        for (W = 0, z = pt.length; W < z; ++W) It += pt[W];
        if ((It /= 255) === z - 1 && pt.indexOf(0) !== -1) G = [pt.indexOf(0)];
        else if (It !== z) {
          for (tt = E.decodePixels(), rt = new Uint8Array(tt.length), W = 0, z = tt.length; W < z; W++) rt[W] = pt[tt[W]];
          wt = n(rt, E.width, 1);
        }
      }
      var L = function(F) {
        var M;
        switch (F) {
          case r.image_compression.FAST:
            M = 11;
            break;
          case r.image_compression.MEDIUM:
            M = 13;
            break;
          case r.image_compression.SLOW:
            M = 14;
            break;
          default:
            M = 12;
        }
        return M;
      }(k);
      return st === this.decode.FLATE_DECODE && (it = "/Predictor " + L + " "), it += "/Colors " + at + " /BitsPerComponent " + _ + " /Columns " + E.width, (this.__addimage__.isArrayBuffer(N) || this.__addimage__.isArrayBufferView(N)) && (N = this.__addimage__.arrayBufferToBinaryString(N)), (wt && this.__addimage__.isArrayBuffer(wt) || this.__addimage__.isArrayBufferView(wt)) && (wt = this.__addimage__.arrayBufferToBinaryString(wt)), { alias: O, data: N, index: p, filter: st, decodeParameters: it, transparency: G, palette: lt, sMask: wt, predictor: L, width: E.width, height: E.height, bitsPerComponent: _, colorSpace: B };
    }
  };
})(Ut.API), function(r) {
  r.processGIF89A = function(e, n, i, s) {
    var o = new Dh(e), l = o.width, u = o.height, f = [];
    o.decodeAndBlitFrameRGBA(0, f);
    var g = { data: f, width: l, height: u }, y = new xs(100).encode(g, 100);
    return r.processJPEG.call(this, y, n, i, s);
  }, r.processGIF87A = r.processGIF89A;
}(Ut.API), Rn.prototype.parseHeader = function() {
  if (this.fileSize = this.datav.getUint32(this.pos, !0), this.pos += 4, this.reserved = this.datav.getUint32(this.pos, !0), this.pos += 4, this.offset = this.datav.getUint32(this.pos, !0), this.pos += 4, this.headerSize = this.datav.getUint32(this.pos, !0), this.pos += 4, this.width = this.datav.getUint32(this.pos, !0), this.pos += 4, this.height = this.datav.getInt32(this.pos, !0), this.pos += 4, this.planes = this.datav.getUint16(this.pos, !0), this.pos += 2, this.bitPP = this.datav.getUint16(this.pos, !0), this.pos += 2, this.compress = this.datav.getUint32(this.pos, !0), this.pos += 4, this.rawSize = this.datav.getUint32(this.pos, !0), this.pos += 4, this.hr = this.datav.getUint32(this.pos, !0), this.pos += 4, this.vr = this.datav.getUint32(this.pos, !0), this.pos += 4, this.colors = this.datav.getUint32(this.pos, !0), this.pos += 4, this.importantColors = this.datav.getUint32(this.pos, !0), this.pos += 4, this.bitPP === 16 && this.is_with_alpha && (this.bitPP = 15), this.bitPP < 15) {
    var r = this.colors === 0 ? 1 << this.bitPP : this.colors;
    this.palette = new Array(r);
    for (var e = 0; e < r; e++) {
      var n = this.datav.getUint8(this.pos++, !0), i = this.datav.getUint8(this.pos++, !0), s = this.datav.getUint8(this.pos++, !0), o = this.datav.getUint8(this.pos++, !0);
      this.palette[e] = { red: s, green: i, blue: n, quad: o };
    }
  }
  this.height < 0 && (this.height *= -1, this.bottom_up = !1);
}, Rn.prototype.parseBGR = function() {
  this.pos = this.offset;
  try {
    var r = "bit" + this.bitPP, e = this.width * this.height * 4;
    this.data = new Uint8Array(e), this[r]();
  } catch (n) {
    be.log("bit decode error:" + n);
  }
}, Rn.prototype.bit1 = function() {
  var r, e = Math.ceil(this.width / 8), n = e % 4;
  for (r = this.height - 1; r >= 0; r--) {
    for (var i = this.bottom_up ? r : this.height - 1 - r, s = 0; s < e; s++) for (var o = this.datav.getUint8(this.pos++, !0), l = i * this.width * 4 + 8 * s * 4, u = 0; u < 8 && 8 * s + u < this.width; u++) {
      var f = this.palette[o >> 7 - u & 1];
      this.data[l + 4 * u] = f.blue, this.data[l + 4 * u + 1] = f.green, this.data[l + 4 * u + 2] = f.red, this.data[l + 4 * u + 3] = 255;
    }
    n !== 0 && (this.pos += 4 - n);
  }
}, Rn.prototype.bit4 = function() {
  for (var r = Math.ceil(this.width / 2), e = r % 4, n = this.height - 1; n >= 0; n--) {
    for (var i = this.bottom_up ? n : this.height - 1 - n, s = 0; s < r; s++) {
      var o = this.datav.getUint8(this.pos++, !0), l = i * this.width * 4 + 2 * s * 4, u = o >> 4, f = 15 & o, g = this.palette[u];
      if (this.data[l] = g.blue, this.data[l + 1] = g.green, this.data[l + 2] = g.red, this.data[l + 3] = 255, 2 * s + 1 >= this.width) break;
      g = this.palette[f], this.data[l + 4] = g.blue, this.data[l + 4 + 1] = g.green, this.data[l + 4 + 2] = g.red, this.data[l + 4 + 3] = 255;
    }
    e !== 0 && (this.pos += 4 - e);
  }
}, Rn.prototype.bit8 = function() {
  for (var r = this.width % 4, e = this.height - 1; e >= 0; e--) {
    for (var n = this.bottom_up ? e : this.height - 1 - e, i = 0; i < this.width; i++) {
      var s = this.datav.getUint8(this.pos++, !0), o = n * this.width * 4 + 4 * i;
      if (s < this.palette.length) {
        var l = this.palette[s];
        this.data[o] = l.red, this.data[o + 1] = l.green, this.data[o + 2] = l.blue, this.data[o + 3] = 255;
      } else this.data[o] = 255, this.data[o + 1] = 255, this.data[o + 2] = 255, this.data[o + 3] = 255;
    }
    r !== 0 && (this.pos += 4 - r);
  }
}, Rn.prototype.bit15 = function() {
  for (var r = this.width % 3, e = parseInt("11111", 2), n = this.height - 1; n >= 0; n--) {
    for (var i = this.bottom_up ? n : this.height - 1 - n, s = 0; s < this.width; s++) {
      var o = this.datav.getUint16(this.pos, !0);
      this.pos += 2;
      var l = (o & e) / e * 255 | 0, u = (o >> 5 & e) / e * 255 | 0, f = (o >> 10 & e) / e * 255 | 0, g = o >> 15 ? 255 : 0, y = i * this.width * 4 + 4 * s;
      this.data[y] = f, this.data[y + 1] = u, this.data[y + 2] = l, this.data[y + 3] = g;
    }
    this.pos += r;
  }
}, Rn.prototype.bit16 = function() {
  for (var r = this.width % 3, e = parseInt("11111", 2), n = parseInt("111111", 2), i = this.height - 1; i >= 0; i--) {
    for (var s = this.bottom_up ? i : this.height - 1 - i, o = 0; o < this.width; o++) {
      var l = this.datav.getUint16(this.pos, !0);
      this.pos += 2;
      var u = (l & e) / e * 255 | 0, f = (l >> 5 & n) / n * 255 | 0, g = (l >> 11) / e * 255 | 0, y = s * this.width * 4 + 4 * o;
      this.data[y] = g, this.data[y + 1] = f, this.data[y + 2] = u, this.data[y + 3] = 255;
    }
    this.pos += r;
  }
}, Rn.prototype.bit24 = function() {
  for (var r = this.height - 1; r >= 0; r--) {
    for (var e = this.bottom_up ? r : this.height - 1 - r, n = 0; n < this.width; n++) {
      var i = this.datav.getUint8(this.pos++, !0), s = this.datav.getUint8(this.pos++, !0), o = this.datav.getUint8(this.pos++, !0), l = e * this.width * 4 + 4 * n;
      this.data[l] = o, this.data[l + 1] = s, this.data[l + 2] = i, this.data[l + 3] = 255;
    }
    this.pos += this.width % 4;
  }
}, Rn.prototype.bit32 = function() {
  for (var r = this.height - 1; r >= 0; r--) for (var e = this.bottom_up ? r : this.height - 1 - r, n = 0; n < this.width; n++) {
    var i = this.datav.getUint8(this.pos++, !0), s = this.datav.getUint8(this.pos++, !0), o = this.datav.getUint8(this.pos++, !0), l = this.datav.getUint8(this.pos++, !0), u = e * this.width * 4 + 4 * n;
    this.data[u] = o, this.data[u + 1] = s, this.data[u + 2] = i, this.data[u + 3] = l;
  }
}, Rn.prototype.getData = function() {
  return this.data;
}, /**
 * @license
 * Copyright (c) 2018 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(r) {
  r.processBMP = function(e, n, i, s) {
    var o = new Rn(e, !1), l = o.width, u = o.height, f = { data: o.getData(), width: l, height: u }, g = new xs(100).encode(f, 100);
    return r.processJPEG.call(this, g, n, i, s);
  };
}(Ut.API), Ic.prototype.getData = function() {
  return this.data;
}, /**
 * @license
 * Copyright (c) 2019 Aras Abbasi
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(r) {
  r.processWEBP = function(e, n, i, s) {
    var o = new Ic(e), l = o.width, u = o.height, f = { data: o.getData(), width: l, height: u }, g = new xs(100).encode(f, 100);
    return r.processJPEG.call(this, g, n, i, s);
  };
}(Ut.API), Ut.API.processRGBA = function(r, e, n) {
  for (var i = r.data, s = i.length, o = new Uint8Array(s / 4 * 3), l = new Uint8Array(s / 4), u = 0, f = 0, g = 0; g < s; g += 4) {
    var y = i[g], b = i[g + 1], N = i[g + 2], p = i[g + 3];
    o[u++] = y, o[u++] = b, o[u++] = N, l[f++] = p;
  }
  var O = this.__addimage__.arrayBufferToBinaryString(o);
  return { alpha: this.__addimage__.arrayBufferToBinaryString(l), data: O, index: e, alias: n, colorSpace: "DeviceRGB", bitsPerComponent: 8, width: r.width, height: r.height };
}, Ut.API.setLanguage = function(r) {
  return this.internal.languageSettings === void 0 && (this.internal.languageSettings = {}, this.internal.languageSettings.isSubscribed = !1), { af: "Afrikaans", sq: "Albanian", ar: "Arabic (Standard)", "ar-DZ": "Arabic (Algeria)", "ar-BH": "Arabic (Bahrain)", "ar-EG": "Arabic (Egypt)", "ar-IQ": "Arabic (Iraq)", "ar-JO": "Arabic (Jordan)", "ar-KW": "Arabic (Kuwait)", "ar-LB": "Arabic (Lebanon)", "ar-LY": "Arabic (Libya)", "ar-MA": "Arabic (Morocco)", "ar-OM": "Arabic (Oman)", "ar-QA": "Arabic (Qatar)", "ar-SA": "Arabic (Saudi Arabia)", "ar-SY": "Arabic (Syria)", "ar-TN": "Arabic (Tunisia)", "ar-AE": "Arabic (U.A.E.)", "ar-YE": "Arabic (Yemen)", an: "Aragonese", hy: "Armenian", as: "Assamese", ast: "Asturian", az: "Azerbaijani", eu: "Basque", be: "Belarusian", bn: "Bengali", bs: "Bosnian", br: "Breton", bg: "Bulgarian", my: "Burmese", ca: "Catalan", ch: "Chamorro", ce: "Chechen", zh: "Chinese", "zh-HK": "Chinese (Hong Kong)", "zh-CN": "Chinese (PRC)", "zh-SG": "Chinese (Singapore)", "zh-TW": "Chinese (Taiwan)", cv: "Chuvash", co: "Corsican", cr: "Cree", hr: "Croatian", cs: "Czech", da: "Danish", nl: "Dutch (Standard)", "nl-BE": "Dutch (Belgian)", en: "English", "en-AU": "English (Australia)", "en-BZ": "English (Belize)", "en-CA": "English (Canada)", "en-IE": "English (Ireland)", "en-JM": "English (Jamaica)", "en-NZ": "English (New Zealand)", "en-PH": "English (Philippines)", "en-ZA": "English (South Africa)", "en-TT": "English (Trinidad & Tobago)", "en-GB": "English (United Kingdom)", "en-US": "English (United States)", "en-ZW": "English (Zimbabwe)", eo: "Esperanto", et: "Estonian", fo: "Faeroese", fj: "Fijian", fi: "Finnish", fr: "French (Standard)", "fr-BE": "French (Belgium)", "fr-CA": "French (Canada)", "fr-FR": "French (France)", "fr-LU": "French (Luxembourg)", "fr-MC": "French (Monaco)", "fr-CH": "French (Switzerland)", fy: "Frisian", fur: "Friulian", gd: "Gaelic (Scots)", "gd-IE": "Gaelic (Irish)", gl: "Galacian", ka: "Georgian", de: "German (Standard)", "de-AT": "German (Austria)", "de-DE": "German (Germany)", "de-LI": "German (Liechtenstein)", "de-LU": "German (Luxembourg)", "de-CH": "German (Switzerland)", el: "Greek", gu: "Gujurati", ht: "Haitian", he: "Hebrew", hi: "Hindi", hu: "Hungarian", is: "Icelandic", id: "Indonesian", iu: "Inuktitut", ga: "Irish", it: "Italian (Standard)", "it-CH": "Italian (Switzerland)", ja: "Japanese", kn: "Kannada", ks: "Kashmiri", kk: "Kazakh", km: "Khmer", ky: "Kirghiz", tlh: "Klingon", ko: "Korean", "ko-KP": "Korean (North Korea)", "ko-KR": "Korean (South Korea)", la: "Latin", lv: "Latvian", lt: "Lithuanian", lb: "Luxembourgish", mk: "North Macedonia", ms: "Malay", ml: "Malayalam", mt: "Maltese", mi: "Maori", mr: "Marathi", mo: "Moldavian", nv: "Navajo", ng: "Ndonga", ne: "Nepali", no: "Norwegian", nb: "Norwegian (Bokmal)", nn: "Norwegian (Nynorsk)", oc: "Occitan", or: "Oriya", om: "Oromo", fa: "Persian", "fa-IR": "Persian/Iran", pl: "Polish", pt: "Portuguese", "pt-BR": "Portuguese (Brazil)", pa: "Punjabi", "pa-IN": "Punjabi (India)", "pa-PK": "Punjabi (Pakistan)", qu: "Quechua", rm: "Rhaeto-Romanic", ro: "Romanian", "ro-MO": "Romanian (Moldavia)", ru: "Russian", "ru-MO": "Russian (Moldavia)", sz: "Sami (Lappish)", sg: "Sango", sa: "Sanskrit", sc: "Sardinian", sd: "Sindhi", si: "Singhalese", sr: "Serbian", sk: "Slovak", sl: "Slovenian", so: "Somani", sb: "Sorbian", es: "Spanish", "es-AR": "Spanish (Argentina)", "es-BO": "Spanish (Bolivia)", "es-CL": "Spanish (Chile)", "es-CO": "Spanish (Colombia)", "es-CR": "Spanish (Costa Rica)", "es-DO": "Spanish (Dominican Republic)", "es-EC": "Spanish (Ecuador)", "es-SV": "Spanish (El Salvador)", "es-GT": "Spanish (Guatemala)", "es-HN": "Spanish (Honduras)", "es-MX": "Spanish (Mexico)", "es-NI": "Spanish (Nicaragua)", "es-PA": "Spanish (Panama)", "es-PY": "Spanish (Paraguay)", "es-PE": "Spanish (Peru)", "es-PR": "Spanish (Puerto Rico)", "es-ES": "Spanish (Spain)", "es-UY": "Spanish (Uruguay)", "es-VE": "Spanish (Venezuela)", sx: "Sutu", sw: "Swahili", sv: "Swedish", "sv-FI": "Swedish (Finland)", "sv-SV": "Swedish (Sweden)", ta: "Tamil", tt: "Tatar", te: "Teluga", th: "Thai", tig: "Tigre", ts: "Tsonga", tn: "Tswana", tr: "Turkish", tk: "Turkmen", uk: "Ukrainian", hsb: "Upper Sorbian", ur: "Urdu", ve: "Venda", vi: "Vietnamese", vo: "Volapuk", wa: "Walloon", cy: "Welsh", xh: "Xhosa", ji: "Yiddish", zu: "Zulu" }[r] !== void 0 && (this.internal.languageSettings.languageCode = r, this.internal.languageSettings.isSubscribed === !1 && (this.internal.events.subscribe("putCatalog", function() {
    this.internal.write("/Lang (" + this.internal.languageSettings.languageCode + ")");
  }), this.internal.languageSettings.isSubscribed = !0)), this;
}, Pi = Ut.API, uo = Pi.getCharWidthsArray = function(r, e) {
  var n, i, s = (e = e || {}).font || this.internal.getFont(), o = e.fontSize || this.internal.getFontSize(), l = e.charSpace || this.internal.getCharSpace(), u = e.widths ? e.widths : s.metadata.Unicode.widths, f = u.fof ? u.fof : 1, g = e.kerning ? e.kerning : s.metadata.Unicode.kerning, y = g.fof ? g.fof : 1, b = e.doKerning !== !1, N = 0, p = r.length, O = 0, k = u[0] || f, B = [];
  for (n = 0; n < p; n++) i = r.charCodeAt(n), typeof s.metadata.widthOfString == "function" ? B.push((s.metadata.widthOfGlyph(s.metadata.characterToGlyph(i)) + l * (1e3 / o) || 0) / 1e3) : (N = b && de(g[i]) === "object" && !isNaN(parseInt(g[i][O], 10)) ? g[i][O] / y : 0, B.push((u[i] || k) / f + N)), O = i;
  return B;
}, _c = Pi.getStringUnitWidth = function(r, e) {
  var n = (e = e || {}).fontSize || this.internal.getFontSize(), i = e.font || this.internal.getFont(), s = e.charSpace || this.internal.getCharSpace();
  return Pi.processArabic && (r = Pi.processArabic(r)), typeof i.metadata.widthOfString == "function" ? i.metadata.widthOfString(r, n, s) / n : uo.apply(this, arguments).reduce(function(o, l) {
    return o + l;
  }, 0);
}, Pc = function(r, e, n, i) {
  for (var s = [], o = 0, l = r.length, u = 0; o !== l && u + e[o] < n; ) u += e[o], o++;
  s.push(r.slice(0, o));
  var f = o;
  for (u = 0; o !== l; ) u + e[o] > i && (s.push(r.slice(f, o)), u = 0, f = o), u += e[o], o++;
  return f !== o && s.push(r.slice(f, o)), s;
}, kc = function(r, e, n) {
  n || (n = {});
  var i, s, o, l, u, f, g, y = [], b = [y], N = n.textIndent || 0, p = 0, O = 0, k = r.split(" "), B = uo.apply(this, [" ", n])[0];
  if (f = n.lineIndent === -1 ? k[0].length + 2 : n.lineIndent || 0) {
    var _ = Array(f).join(" "), E = [];
    k.map(function(at) {
      (at = at.split(/\s*\n/)).length > 1 ? E = E.concat(at.map(function(lt, wt) {
        return (wt && lt.length ? `
` : "") + lt;
      })) : E.push(at[0]);
    }), k = E, f = _c.apply(this, [_, n]);
  }
  for (o = 0, l = k.length; o < l; o++) {
    var G = 0;
    if (i = k[o], f && i[0] == `
` && (i = i.substr(1), G = 1), N + p + (O = (s = uo.apply(this, [i, n])).reduce(function(at, lt) {
      return at + lt;
    }, 0)) > e || G) {
      if (O > e) {
        for (u = Pc.apply(this, [i, s, e - (N + p), e]), y.push(u.shift()), y = [u.pop()]; u.length; ) b.push([u.shift()]);
        O = s.slice(i.length - (y[0] ? y[0].length : 0)).reduce(function(at, lt) {
          return at + lt;
        }, 0);
      } else y = [i];
      b.push(y), N = O + f, p = B;
    } else y.push(i), N += p + O, p = B;
  }
  return g = f ? function(at, lt) {
    return (lt ? _ : "") + at.join(" ");
  } : function(at) {
    return at.join(" ");
  }, b.map(g);
}, Pi.splitTextToSize = function(r, e, n) {
  var i, s = (n = n || {}).fontSize || this.internal.getFontSize(), o = (function(y) {
    if (y.widths && y.kerning) return { widths: y.widths, kerning: y.kerning };
    var b = this.internal.getFont(y.fontName, y.fontStyle);
    return b.metadata.Unicode ? { widths: b.metadata.Unicode.widths || { 0: 1 }, kerning: b.metadata.Unicode.kerning || {} } : { font: b.metadata, fontSize: this.internal.getFontSize(), charSpace: this.internal.getCharSpace() };
  }).call(this, n);
  i = Array.isArray(r) ? r : String(r).split(/\r?\n/);
  var l = 1 * this.internal.scaleFactor * e / s;
  o.textIndent = n.textIndent ? 1 * n.textIndent * this.internal.scaleFactor / s : 0, o.lineIndent = n.lineIndent;
  var u, f, g = [];
  for (u = 0, f = i.length; u < f; u++) g = g.concat(kc.apply(this, [i[u], l, o]));
  return g;
}, function(r) {
  r.__fontmetrics__ = r.__fontmetrics__ || {};
  for (var e = "klmnopqrstuvwxyz", n = {}, i = {}, s = 0; s < e.length; s++) n[e[s]] = "0123456789abcdef"[s], i["0123456789abcdef"[s]] = e[s];
  var o = function(b) {
    return "0x" + parseInt(b, 10).toString(16);
  }, l = r.__fontmetrics__.compress = function(b) {
    var N, p, O, k, B = ["{"];
    for (var _ in b) {
      if (N = b[_], isNaN(parseInt(_, 10)) ? p = "'" + _ + "'" : (_ = parseInt(_, 10), p = (p = o(_).slice(2)).slice(0, -1) + i[p.slice(-1)]), typeof N == "number") N < 0 ? (O = o(N).slice(3), k = "-") : (O = o(N).slice(2), k = ""), O = k + O.slice(0, -1) + i[O.slice(-1)];
      else {
        if (de(N) !== "object") throw new Error("Don't know what to do with value type " + de(N) + ".");
        O = l(N);
      }
      B.push(p + O);
    }
    return B.push("}"), B.join("");
  }, u = r.__fontmetrics__.uncompress = function(b) {
    if (typeof b != "string") throw new Error("Invalid argument passed to uncompress.");
    for (var N, p, O, k, B = {}, _ = 1, E = B, G = [], at = "", lt = "", wt = b.length - 1, tt = 1; tt < wt; tt += 1) (k = b[tt]) == "'" ? N ? (O = N.join(""), N = void 0) : N = [] : N ? N.push(k) : k == "{" ? (G.push([E, O]), E = {}, O = void 0) : k == "}" ? ((p = G.pop())[0][p[1]] = E, O = void 0, E = p[0]) : k == "-" ? _ = -1 : O === void 0 ? n.hasOwnProperty(k) ? (at += n[k], O = parseInt(at, 16) * _, _ = 1, at = "") : at += k : n.hasOwnProperty(k) ? (lt += n[k], E[O] = parseInt(lt, 16) * _, _ = 1, O = void 0, lt = "") : lt += k;
    return B;
  }, f = { codePages: ["WinAnsiEncoding"], WinAnsiEncoding: u("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}") }, g = { Unicode: { Courier: f, "Courier-Bold": f, "Courier-BoldOblique": f, "Courier-Oblique": f, Helvetica: f, "Helvetica-Bold": f, "Helvetica-BoldOblique": f, "Helvetica-Oblique": f, "Times-Roman": f, "Times-Bold": f, "Times-BoldItalic": f, "Times-Italic": f } }, y = { Unicode: { "Courier-Oblique": u("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"), "Times-BoldItalic": u("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"), "Helvetica-Bold": u("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"), Courier: u("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"), "Courier-BoldOblique": u("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"), "Times-Bold": u("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}"), Symbol: u("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}"), Helvetica: u("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"), "Helvetica-BoldOblique": u("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"), ZapfDingbats: u("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}"), "Courier-Bold": u("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"), "Times-Italic": u("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"), "Times-Roman": u("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"), "Helvetica-Oblique": u("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}") } };
  r.events.push(["addFont", function(b) {
    var N = b.font, p = y.Unicode[N.postScriptName];
    p && (N.metadata.Unicode = {}, N.metadata.Unicode.widths = p.widths, N.metadata.Unicode.kerning = p.kerning);
    var O = g.Unicode[N.postScriptName];
    O && (N.metadata.Unicode.encoding = O, N.encoding = O.codePages[0]);
  }]);
}(Ut.API), /**
 * @license
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(r) {
  var e = function(n) {
    for (var i = n.length, s = new Uint8Array(i), o = 0; o < i; o++) s[o] = n.charCodeAt(o);
    return s;
  };
  r.API.events.push(["addFont", function(n) {
    var i = void 0, s = n.font, o = n.instance;
    if (!s.isStandardFont) {
      if (o === void 0) throw new Error("Font does not exist in vFS, import fonts or remove declaration doc.addFont('" + s.postScriptName + "').");
      if (typeof (i = o.existsFileInVFS(s.postScriptName) === !1 ? o.loadFile(s.postScriptName) : o.getFileFromVFS(s.postScriptName)) != "string") throw new Error("Font is not stored as string-data in vFS, import fonts or remove declaration doc.addFont('" + s.postScriptName + "').");
      (function(l, u) {
        u = /^\x00\x01\x00\x00/.test(u) ? e(u) : e(ga(u)), l.metadata = r.API.TTFFont.open(u), l.metadata.Unicode = l.metadata.Unicode || { encoding: {}, kerning: {}, widths: [] }, l.metadata.glyIdsUsed = [0];
      })(s, i);
    }
  }]);
}(Ut), /** @license
 * Copyright (c) 2012 Willow Systems Corporation, https://github.com/willowsystems
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */
function(r) {
  function e() {
    return (Ht.canvg ? Promise.resolve(Ht.canvg) : import("./index.es-oS9LRiBp.js")).catch(function(n) {
      return Promise.reject(new Error("Could not load canvg: " + n));
    }).then(function(n) {
      return n.default ? n.default : n;
    });
  }
  Ut.API.addSvgAsImage = function(n, i, s, o, l, u, f, g) {
    if (isNaN(i) || isNaN(s)) throw be.error("jsPDF.addSvgAsImage: Invalid coordinates", arguments), new Error("Invalid coordinates passed to jsPDF.addSvgAsImage");
    if (isNaN(o) || isNaN(l)) throw be.error("jsPDF.addSvgAsImage: Invalid measurements", arguments), new Error("Invalid measurements (width and/or height) passed to jsPDF.addSvgAsImage");
    var y = document.createElement("canvas");
    y.width = o, y.height = l;
    var b = y.getContext("2d");
    b.fillStyle = "#fff", b.fillRect(0, 0, y.width, y.height);
    var N = { ignoreMouse: !0, ignoreAnimation: !0, ignoreDimensions: !0 }, p = this;
    return e().then(function(O) {
      return O.fromString(b, n, N);
    }, function() {
      return Promise.reject(new Error("Could not load canvg."));
    }).then(function(O) {
      return O.render(N);
    }).then(function() {
      p.addImage(y.toDataURL("image/jpeg", 1), i, s, o, l, f, g);
    });
  };
}(), Ut.API.putTotalPages = function(r) {
  var e, n = 0;
  parseInt(this.internal.getFont().id.substr(1), 10) < 15 ? (e = new RegExp(r, "g"), n = this.internal.getNumberOfPages()) : (e = new RegExp(this.pdfEscape16(r, this.internal.getFont()), "g"), n = this.pdfEscape16(this.internal.getNumberOfPages() + "", this.internal.getFont()));
  for (var i = 1; i <= this.internal.getNumberOfPages(); i++) for (var s = 0; s < this.internal.pages[i].length; s++) this.internal.pages[i][s] = this.internal.pages[i][s].replace(e, n);
  return this;
}, Ut.API.viewerPreferences = function(r, e) {
  var n;
  r = r || {}, e = e || !1;
  var i, s, o, l = { HideToolbar: { defaultValue: !1, value: !1, type: "boolean", explicitSet: !1, valueSet: [!0, !1], pdfVersion: 1.3 }, HideMenubar: { defaultValue: !1, value: !1, type: "boolean", explicitSet: !1, valueSet: [!0, !1], pdfVersion: 1.3 }, HideWindowUI: { defaultValue: !1, value: !1, type: "boolean", explicitSet: !1, valueSet: [!0, !1], pdfVersion: 1.3 }, FitWindow: { defaultValue: !1, value: !1, type: "boolean", explicitSet: !1, valueSet: [!0, !1], pdfVersion: 1.3 }, CenterWindow: { defaultValue: !1, value: !1, type: "boolean", explicitSet: !1, valueSet: [!0, !1], pdfVersion: 1.3 }, DisplayDocTitle: { defaultValue: !1, value: !1, type: "boolean", explicitSet: !1, valueSet: [!0, !1], pdfVersion: 1.4 }, NonFullScreenPageMode: { defaultValue: "UseNone", value: "UseNone", type: "name", explicitSet: !1, valueSet: ["UseNone", "UseOutlines", "UseThumbs", "UseOC"], pdfVersion: 1.3 }, Direction: { defaultValue: "L2R", value: "L2R", type: "name", explicitSet: !1, valueSet: ["L2R", "R2L"], pdfVersion: 1.3 }, ViewArea: { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: !1, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 }, ViewClip: { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: !1, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 }, PrintArea: { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: !1, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 }, PrintClip: { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: !1, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 }, PrintScaling: { defaultValue: "AppDefault", value: "AppDefault", type: "name", explicitSet: !1, valueSet: ["AppDefault", "None"], pdfVersion: 1.6 }, Duplex: { defaultValue: "", value: "none", type: "name", explicitSet: !1, valueSet: ["Simplex", "DuplexFlipShortEdge", "DuplexFlipLongEdge", "none"], pdfVersion: 1.7 }, PickTrayByPDFSize: { defaultValue: !1, value: !1, type: "boolean", explicitSet: !1, valueSet: [!0, !1], pdfVersion: 1.7 }, PrintPageRange: { defaultValue: "", value: "", type: "array", explicitSet: !1, valueSet: null, pdfVersion: 1.7 }, NumCopies: { defaultValue: 1, value: 1, type: "integer", explicitSet: !1, valueSet: null, pdfVersion: 1.7 } }, u = Object.keys(l), f = [], g = 0, y = 0, b = 0;
  function N(O, k) {
    var B, _ = !1;
    for (B = 0; B < O.length; B += 1) O[B] === k && (_ = !0);
    return _;
  }
  if (this.internal.viewerpreferences === void 0 && (this.internal.viewerpreferences = {}, this.internal.viewerpreferences.configuration = JSON.parse(JSON.stringify(l)), this.internal.viewerpreferences.isSubscribed = !1), n = this.internal.viewerpreferences.configuration, r === "reset" || e === !0) {
    var p = u.length;
    for (b = 0; b < p; b += 1) n[u[b]].value = n[u[b]].defaultValue, n[u[b]].explicitSet = !1;
  }
  if (de(r) === "object") {
    for (s in r) if (o = r[s], N(u, s) && o !== void 0) {
      if (n[s].type === "boolean" && typeof o == "boolean") n[s].value = o;
      else if (n[s].type === "name" && N(n[s].valueSet, o)) n[s].value = o;
      else if (n[s].type === "integer" && Number.isInteger(o)) n[s].value = o;
      else if (n[s].type === "array") {
        for (g = 0; g < o.length; g += 1) if (i = !0, o[g].length === 1 && typeof o[g][0] == "number") f.push(String(o[g] - 1));
        else if (o[g].length > 1) {
          for (y = 0; y < o[g].length; y += 1) typeof o[g][y] != "number" && (i = !1);
          i === !0 && f.push([o[g][0] - 1, o[g][1] - 1].join(" "));
        }
        n[s].value = "[" + f.join(" ") + "]";
      } else n[s].value = n[s].defaultValue;
      n[s].explicitSet = !0;
    }
  }
  return this.internal.viewerpreferences.isSubscribed === !1 && (this.internal.events.subscribe("putCatalog", function() {
    var O, k = [];
    for (O in n) n[O].explicitSet === !0 && (n[O].type === "name" ? k.push("/" + O + " /" + n[O].value) : k.push("/" + O + " " + n[O].value));
    k.length !== 0 && this.internal.write(`/ViewerPreferences
<<
` + k.join(`
`) + `
>>`);
  }), this.internal.viewerpreferences.isSubscribed = !0), this.internal.viewerpreferences.configuration = n, this;
}, /** ====================================================================
 * @license
 * jsPDF XMP metadata plugin
 * Copyright (c) 2016 Jussi Utunen, u-jussi@suomi24.fi
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */
function(r) {
  var e = function() {
    var i = '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:jspdf="' + this.internal.__metadata__.namespaceuri + '"><jspdf:metadata>', s = unescape(encodeURIComponent('<x:xmpmeta xmlns:x="adobe:ns:meta/">')), o = unescape(encodeURIComponent(i)), l = unescape(encodeURIComponent(this.internal.__metadata__.metadata)), u = unescape(encodeURIComponent("</jspdf:metadata></rdf:Description></rdf:RDF>")), f = unescape(encodeURIComponent("</x:xmpmeta>")), g = o.length + l.length + u.length + s.length + f.length;
    this.internal.__metadata__.metadata_object_number = this.internal.newObject(), this.internal.write("<< /Type /Metadata /Subtype /XML /Length " + g + " >>"), this.internal.write("stream"), this.internal.write(s + o + l + u + f), this.internal.write("endstream"), this.internal.write("endobj");
  }, n = function() {
    this.internal.__metadata__.metadata_object_number && this.internal.write("/Metadata " + this.internal.__metadata__.metadata_object_number + " 0 R");
  };
  r.addMetadata = function(i, s) {
    return this.internal.__metadata__ === void 0 && (this.internal.__metadata__ = { metadata: i, namespaceuri: s || "http://jspdf.default.namespaceuri/" }, this.internal.events.subscribe("putCatalog", n), this.internal.events.subscribe("postPutResources", e)), this;
  };
}(Ut.API), function(r) {
  var e = r.API, n = e.pdfEscape16 = function(o, l) {
    for (var u, f = l.metadata.Unicode.widths, g = ["", "0", "00", "000", "0000"], y = [""], b = 0, N = o.length; b < N; ++b) {
      if (u = l.metadata.characterToGlyph(o.charCodeAt(b)), l.metadata.glyIdsUsed.push(u), l.metadata.toUnicode[u] = o.charCodeAt(b), f.indexOf(u) == -1 && (f.push(u), f.push([parseInt(l.metadata.widthOfGlyph(u), 10)])), u == "0") return y.join("");
      u = u.toString(16), y.push(g[4 - u.length], u);
    }
    return y.join("");
  }, i = function(o) {
    var l, u, f, g, y, b, N;
    for (y = `/CIDInit /ProcSet findresource begin
12 dict begin
begincmap
/CIDSystemInfo <<
  /Registry (Adobe)
  /Ordering (UCS)
  /Supplement 0
>> def
/CMapName /Adobe-Identity-UCS def
/CMapType 2 def
1 begincodespacerange
<0000><ffff>
endcodespacerange`, f = [], b = 0, N = (u = Object.keys(o).sort(function(p, O) {
      return p - O;
    })).length; b < N; b++) l = u[b], f.length >= 100 && (y += `
` + f.length + ` beginbfchar
` + f.join(`
`) + `
endbfchar`, f = []), o[l] !== void 0 && o[l] !== null && typeof o[l].toString == "function" && (g = ("0000" + o[l].toString(16)).slice(-4), l = ("0000" + (+l).toString(16)).slice(-4), f.push("<" + l + "><" + g + ">"));
    return f.length && (y += `
` + f.length + ` beginbfchar
` + f.join(`
`) + `
endbfchar
`), y += `endcmap
CMapName currentdict /CMap defineresource pop
end
end`;
  };
  e.events.push(["putFont", function(o) {
    (function(l) {
      var u = l.font, f = l.out, g = l.newObject, y = l.putStream;
      if (u.metadata instanceof r.API.TTFFont && u.encoding === "Identity-H") {
        for (var b = u.metadata.Unicode.widths, N = u.metadata.subset.encode(u.metadata.glyIdsUsed, 1), p = "", O = 0; O < N.length; O++) p += String.fromCharCode(N[O]);
        var k = g();
        y({ data: p, addLength1: !0, objectId: k }), f("endobj");
        var B = g();
        y({ data: i(u.metadata.toUnicode), addLength1: !0, objectId: B }), f("endobj");
        var _ = g();
        f("<<"), f("/Type /FontDescriptor"), f("/FontName /" + Ci(u.fontName)), f("/FontFile2 " + k + " 0 R"), f("/FontBBox " + r.API.PDFObject.convert(u.metadata.bbox)), f("/Flags " + u.metadata.flags), f("/StemV " + u.metadata.stemV), f("/ItalicAngle " + u.metadata.italicAngle), f("/Ascent " + u.metadata.ascender), f("/Descent " + u.metadata.decender), f("/CapHeight " + u.metadata.capHeight), f(">>"), f("endobj");
        var E = g();
        f("<<"), f("/Type /Font"), f("/BaseFont /" + Ci(u.fontName)), f("/FontDescriptor " + _ + " 0 R"), f("/W " + r.API.PDFObject.convert(b)), f("/CIDToGIDMap /Identity"), f("/DW 1000"), f("/Subtype /CIDFontType2"), f("/CIDSystemInfo"), f("<<"), f("/Supplement 0"), f("/Registry (Adobe)"), f("/Ordering (" + u.encoding + ")"), f(">>"), f(">>"), f("endobj"), u.objectNumber = g(), f("<<"), f("/Type /Font"), f("/Subtype /Type0"), f("/ToUnicode " + B + " 0 R"), f("/BaseFont /" + Ci(u.fontName)), f("/Encoding /" + u.encoding), f("/DescendantFonts [" + E + " 0 R]"), f(">>"), f("endobj"), u.isAlreadyPutted = !0;
      }
    })(o);
  }]), e.events.push(["putFont", function(o) {
    (function(l) {
      var u = l.font, f = l.out, g = l.newObject, y = l.putStream;
      if (u.metadata instanceof r.API.TTFFont && u.encoding === "WinAnsiEncoding") {
        for (var b = u.metadata.rawData, N = "", p = 0; p < b.length; p++) N += String.fromCharCode(b[p]);
        var O = g();
        y({ data: N, addLength1: !0, objectId: O }), f("endobj");
        var k = g();
        y({ data: i(u.metadata.toUnicode), addLength1: !0, objectId: k }), f("endobj");
        var B = g();
        f("<<"), f("/Descent " + u.metadata.decender), f("/CapHeight " + u.metadata.capHeight), f("/StemV " + u.metadata.stemV), f("/Type /FontDescriptor"), f("/FontFile2 " + O + " 0 R"), f("/Flags 96"), f("/FontBBox " + r.API.PDFObject.convert(u.metadata.bbox)), f("/FontName /" + Ci(u.fontName)), f("/ItalicAngle " + u.metadata.italicAngle), f("/Ascent " + u.metadata.ascender), f(">>"), f("endobj"), u.objectNumber = g();
        for (var _ = 0; _ < u.metadata.hmtx.widths.length; _++) u.metadata.hmtx.widths[_] = parseInt(u.metadata.hmtx.widths[_] * (1e3 / u.metadata.head.unitsPerEm));
        f("<</Subtype/TrueType/Type/Font/ToUnicode " + k + " 0 R/BaseFont/" + Ci(u.fontName) + "/FontDescriptor " + B + " 0 R/Encoding/" + u.encoding + " /FirstChar 29 /LastChar 255 /Widths " + r.API.PDFObject.convert(u.metadata.hmtx.widths) + ">>"), f("endobj"), u.isAlreadyPutted = !0;
      }
    })(o);
  }]);
  var s = function(o) {
    var l, u = o.text || "", f = o.x, g = o.y, y = o.options || {}, b = o.mutex || {}, N = b.pdfEscape, p = b.activeFontKey, O = b.fonts, k = p, B = "", _ = 0, E = "", G = O[k].encoding;
    if (O[k].encoding !== "Identity-H") return { text: u, x: f, y: g, options: y, mutex: b };
    for (E = u, k = p, Array.isArray(u) && (E = u[0]), _ = 0; _ < E.length; _ += 1) O[k].metadata.hasOwnProperty("cmap") && (l = O[k].metadata.cmap.unicode.codeMap[E[_].charCodeAt(0)]), l || E[_].charCodeAt(0) < 256 && O[k].metadata.hasOwnProperty("Unicode") ? B += E[_] : B += "";
    var at = "";
    return parseInt(k.slice(1)) < 14 || G === "WinAnsiEncoding" ? at = N(B, k).split("").map(function(lt) {
      return lt.charCodeAt(0).toString(16);
    }).join("") : G === "Identity-H" && (at = n(B, O[k])), b.isHex = !0, { text: at, x: f, y: g, options: y, mutex: b };
  };
  e.events.push(["postProcessText", function(o) {
    var l = o.text || "", u = [], f = { text: l, x: o.x, y: o.y, options: o.options, mutex: o.mutex };
    if (Array.isArray(l)) {
      var g = 0;
      for (g = 0; g < l.length; g += 1) Array.isArray(l[g]) && l[g].length === 3 ? u.push([s(Object.assign({}, f, { text: l[g][0] })).text, l[g][1], l[g][2]]) : u.push(s(Object.assign({}, f, { text: l[g] })).text);
      o.text = u;
    } else o.text = s(Object.assign({}, f, { text: l })).text;
  }]);
}(Ut), /**
 * @license
 * jsPDF virtual FileSystem functionality
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
function(r) {
  var e = function() {
    return this.internal.vFS === void 0 && (this.internal.vFS = {}), !0;
  };
  r.existsFileInVFS = function(n) {
    return e.call(this), this.internal.vFS[n] !== void 0;
  }, r.addFileToVFS = function(n, i) {
    return e.call(this), this.internal.vFS[n] = i, this;
  }, r.getFileFromVFS = function(n) {
    return e.call(this), this.internal.vFS[n] !== void 0 ? this.internal.vFS[n] : null;
  };
}(Ut.API), /**
 * @license
 * Unicode Bidi Engine based on the work of Alex Shensis (@asthensis)
 * MIT License
 */
function(r) {
  r.__bidiEngine__ = r.prototype.__bidiEngine__ = function(i) {
    var s, o, l, u, f, g, y, b = e, N = [[0, 3, 0, 1, 0, 0, 0], [0, 3, 0, 1, 2, 2, 0], [0, 3, 0, 17, 2, 0, 1], [0, 3, 5, 5, 4, 1, 0], [0, 3, 21, 21, 4, 0, 1], [0, 3, 5, 5, 4, 2, 0]], p = [[2, 0, 1, 1, 0, 1, 0], [2, 0, 1, 1, 0, 2, 0], [2, 0, 2, 1, 3, 2, 0], [2, 0, 2, 33, 3, 1, 1]], O = { L: 0, R: 1, EN: 2, AN: 3, N: 4, B: 5, S: 6 }, k = { 0: 0, 5: 1, 6: 2, 7: 3, 32: 4, 251: 5, 254: 6, 255: 7 }, B = ["(", ")", "(", "<", ">", "<", "[", "]", "[", "{", "}", "{", "«", "»", "«", "‹", "›", "‹", "⁅", "⁆", "⁅", "⁽", "⁾", "⁽", "₍", "₎", "₍", "≤", "≥", "≤", "〈", "〉", "〈", "﹙", "﹚", "﹙", "﹛", "﹜", "﹛", "﹝", "﹞", "﹝", "﹤", "﹥", "﹤"], _ = new RegExp(/^([1-4|9]|1[0-9]|2[0-9]|3[0168]|4[04589]|5[012]|7[78]|159|16[0-9]|17[0-2]|21[569]|22[03489]|250)$/), E = !1, G = 0;
    this.__bidiEngine__ = {};
    var at = function(P) {
      var C = P.charCodeAt(), W = C >> 8, q = k[W];
      return q !== void 0 ? b[256 * q + (255 & C)] : W === 252 || W === 253 ? "AL" : _.test(W) ? "L" : W === 8 ? "R" : "N";
    }, lt = function(P) {
      for (var C, W = 0; W < P.length; W++) {
        if ((C = at(P.charAt(W))) === "L") return !1;
        if (C === "R") return !0;
      }
      return !1;
    }, wt = function(P, C, W, q) {
      var st, it, ht, Z, ut = C[q];
      switch (ut) {
        case "L":
        case "R":
          E = !1;
          break;
        case "N":
        case "AN":
          break;
        case "EN":
          E && (ut = "AN");
          break;
        case "AL":
          E = !0, ut = "R";
          break;
        case "WS":
          ut = "N";
          break;
        case "CS":
          q < 1 || q + 1 >= C.length || (st = W[q - 1]) !== "EN" && st !== "AN" || (it = C[q + 1]) !== "EN" && it !== "AN" ? ut = "N" : E && (it = "AN"), ut = it === st ? it : "N";
          break;
        case "ES":
          ut = (st = q > 0 ? W[q - 1] : "B") === "EN" && q + 1 < C.length && C[q + 1] === "EN" ? "EN" : "N";
          break;
        case "ET":
          if (q > 0 && W[q - 1] === "EN") {
            ut = "EN";
            break;
          }
          if (E) {
            ut = "N";
            break;
          }
          for (ht = q + 1, Z = C.length; ht < Z && C[ht] === "ET"; ) ht++;
          ut = ht < Z && C[ht] === "EN" ? "EN" : "N";
          break;
        case "NSM":
          if (l && !u) {
            for (Z = C.length, ht = q + 1; ht < Z && C[ht] === "NSM"; ) ht++;
            if (ht < Z) {
              var pt = P[q], It = pt >= 1425 && pt <= 2303 || pt === 64286;
              if (st = C[ht], It && (st === "R" || st === "AL")) {
                ut = "R";
                break;
              }
            }
          }
          ut = q < 1 || (st = C[q - 1]) === "B" ? "N" : W[q - 1];
          break;
        case "B":
          E = !1, s = !0, ut = G;
          break;
        case "S":
          o = !0, ut = "N";
          break;
        case "LRE":
        case "RLE":
        case "LRO":
        case "RLO":
        case "PDF":
          E = !1;
          break;
        case "BN":
          ut = "N";
      }
      return ut;
    }, tt = function(P, C, W) {
      var q = P.split("");
      return W && z(q, W, { hiLevel: G }), q.reverse(), C && C.reverse(), q.join("");
    }, z = function(P, C, W) {
      var q, st, it, ht, Z, ut = -1, pt = P.length, It = 0, L = [], F = G ? p : N, M = [];
      for (E = !1, s = !1, o = !1, st = 0; st < pt; st++) M[st] = at(P[st]);
      for (it = 0; it < pt; it++) {
        if (Z = It, L[it] = wt(P, M, L, it), q = 240 & (It = F[Z][O[L[it]]]), It &= 15, C[it] = ht = F[It][5], q > 0) if (q === 16) {
          for (st = ut; st < it; st++) C[st] = 1;
          ut = -1;
        } else ut = -1;
        if (F[It][6]) ut === -1 && (ut = it);
        else if (ut > -1) {
          for (st = ut; st < it; st++) C[st] = ht;
          ut = -1;
        }
        M[it] === "B" && (C[it] = 0), W.hiLevel |= ht;
      }
      o && function(T, Y, Q) {
        for (var et = 0; et < Q; et++) if (T[et] === "S") {
          Y[et] = G;
          for (var nt = et - 1; nt >= 0 && T[nt] === "WS"; nt--) Y[nt] = G;
        }
      }(M, C, pt);
    }, rt = function(P, C, W, q, st) {
      if (!(st.hiLevel < P)) {
        if (P === 1 && G === 1 && !s) return C.reverse(), void (W && W.reverse());
        for (var it, ht, Z, ut, pt = C.length, It = 0; It < pt; ) {
          if (q[It] >= P) {
            for (Z = It + 1; Z < pt && q[Z] >= P; ) Z++;
            for (ut = It, ht = Z - 1; ut < ht; ut++, ht--) it = C[ut], C[ut] = C[ht], C[ht] = it, W && (it = W[ut], W[ut] = W[ht], W[ht] = it);
            It = Z;
          }
          It++;
        }
      }
    }, dt = function(P, C, W) {
      var q = P.split(""), st = { hiLevel: G };
      return W || (W = []), z(q, W, st), function(it, ht, Z) {
        if (Z.hiLevel !== 0 && y) for (var ut, pt = 0; pt < it.length; pt++) ht[pt] === 1 && (ut = B.indexOf(it[pt])) >= 0 && (it[pt] = B[ut + 1]);
      }(q, W, st), rt(2, q, C, W, st), rt(1, q, C, W, st), q.join("");
    };
    return this.__bidiEngine__.doBidiReorder = function(P, C, W) {
      if (function(st, it) {
        if (it) for (var ht = 0; ht < st.length; ht++) it[ht] = ht;
        u === void 0 && (u = lt(st)), g === void 0 && (g = lt(st));
      }(P, C), l || !f || g) if (l && f && u ^ g) G = u ? 1 : 0, P = tt(P, C, W);
      else if (!l && f && g) G = u ? 1 : 0, P = dt(P, C, W), P = tt(P, C);
      else if (!l || u || f || g) {
        if (l && !f && u ^ g) P = tt(P, C), u ? (G = 0, P = dt(P, C, W)) : (G = 1, P = dt(P, C, W), P = tt(P, C));
        else if (l && u && !f && g) G = 1, P = dt(P, C, W), P = tt(P, C);
        else if (!l && !f && u ^ g) {
          var q = y;
          u ? (G = 1, P = dt(P, C, W), G = 0, y = !1, P = dt(P, C, W), y = q) : (G = 0, P = dt(P, C, W), P = tt(P, C), G = 1, y = !1, P = dt(P, C, W), y = q, P = tt(P, C));
        }
      } else G = 0, P = dt(P, C, W);
      else G = u ? 1 : 0, P = dt(P, C, W);
      return P;
    }, this.__bidiEngine__.setOptions = function(P) {
      P && (l = P.isInputVisual, f = P.isOutputVisual, u = P.isInputRtl, g = P.isOutputRtl, y = P.isSymmetricSwapping);
    }, this.__bidiEngine__.setOptions(i), this.__bidiEngine__;
  };
  var e = ["BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "S", "B", "S", "WS", "B", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "B", "B", "B", "S", "WS", "N", "N", "ET", "ET", "ET", "N", "N", "N", "N", "N", "ES", "CS", "ES", "CS", "CS", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "CS", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "BN", "BN", "BN", "BN", "BN", "BN", "B", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "BN", "CS", "N", "ET", "ET", "ET", "ET", "N", "N", "N", "N", "L", "N", "N", "BN", "N", "N", "ET", "ET", "EN", "EN", "N", "L", "N", "N", "N", "EN", "L", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "L", "L", "L", "L", "L", "L", "L", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "L", "N", "N", "N", "N", "N", "ET", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "R", "NSM", "R", "NSM", "NSM", "R", "NSM", "NSM", "R", "NSM", "N", "N", "N", "N", "N", "N", "N", "N", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "N", "N", "N", "N", "N", "R", "R", "R", "R", "R", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "AN", "AN", "AN", "AN", "AN", "AN", "N", "N", "AL", "ET", "ET", "AL", "CS", "AL", "N", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AL", "AL", "N", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AN", "AN", "AN", "AN", "AN", "AN", "AN", "AN", "AN", "AN", "ET", "AN", "AN", "AL", "AL", "AL", "NSM", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AN", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AL", "AL", "NSM", "NSM", "N", "NSM", "NSM", "NSM", "NSM", "AL", "AL", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "N", "AL", "AL", "NSM", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "N", "N", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "AL", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "R", "R", "N", "N", "N", "N", "R", "N", "N", "N", "N", "N", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "WS", "BN", "BN", "BN", "L", "R", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "WS", "B", "LRE", "RLE", "PDF", "LRO", "RLO", "CS", "ET", "ET", "ET", "ET", "ET", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "CS", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "WS", "BN", "BN", "BN", "BN", "BN", "N", "LRI", "RLI", "FSI", "PDI", "BN", "BN", "BN", "BN", "BN", "BN", "EN", "L", "N", "N", "EN", "EN", "EN", "EN", "EN", "EN", "ES", "ES", "N", "N", "N", "L", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "ES", "ES", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "ET", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "R", "NSM", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "ES", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "N", "R", "R", "R", "R", "R", "N", "R", "N", "R", "R", "N", "R", "R", "N", "R", "R", "R", "R", "R", "R", "R", "R", "R", "R", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "NSM", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "CS", "N", "CS", "N", "N", "CS", "N", "N", "N", "N", "N", "N", "N", "N", "N", "ET", "N", "N", "ES", "ES", "N", "N", "N", "N", "N", "ET", "ET", "N", "N", "N", "N", "N", "AL", "AL", "AL", "AL", "AL", "N", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "AL", "N", "N", "BN", "N", "N", "N", "ET", "ET", "ET", "N", "N", "N", "N", "N", "ES", "CS", "ES", "CS", "CS", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "EN", "CS", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "L", "N", "N", "N", "L", "L", "L", "L", "L", "L", "N", "N", "L", "L", "L", "L", "L", "L", "N", "N", "L", "L", "L", "L", "L", "L", "N", "N", "L", "L", "L", "N", "N", "N", "ET", "ET", "N", "N", "N", "ET", "ET", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N"], n = new r.__bidiEngine__({ isInputVisual: !0 });
  r.API.events.push(["postProcessText", function(i) {
    var s = i.text, o = (i.x, i.y, i.options || {}), l = (i.mutex, o.lang, []);
    if (o.isInputVisual = typeof o.isInputVisual != "boolean" || o.isInputVisual, n.setOptions(o), Object.prototype.toString.call(s) === "[object Array]") {
      var u = 0;
      for (l = [], u = 0; u < s.length; u += 1) Object.prototype.toString.call(s[u]) === "[object Array]" ? l.push([n.doBidiReorder(s[u][0]), s[u][1], s[u][2]]) : l.push([n.doBidiReorder(s[u])]);
      i.text = l;
    } else i.text = n.doBidiReorder(s);
    n.setOptions({ isInputVisual: !0 });
  }]);
}(Ut), Ut.API.TTFFont = function() {
  function r(e) {
    var n;
    if (this.rawData = e, n = this.contents = new Or(e), this.contents.pos = 4, n.readString(4) === "ttcf") throw new Error("TTCF not supported.");
    n.pos = 0, this.parse(), this.subset = new Zh(this), this.registerTTF();
  }
  return r.open = function(e) {
    return new r(e);
  }, r.prototype.parse = function() {
    return this.directory = new qh(this.contents), this.head = new Th(this), this.name = new Vh(this), this.cmap = new Zc(this), this.toUnicode = {}, this.hhea = new zh(this), this.maxp = new Gh(this), this.hmtx = new Jh(this), this.post = new Hh(this), this.os2 = new Uh(this), this.loca = new Kh(this), this.glyf = new Yh(this), this.ascender = this.os2.exists && this.os2.ascender || this.hhea.ascender, this.decender = this.os2.exists && this.os2.decender || this.hhea.decender, this.lineGap = this.os2.exists && this.os2.lineGap || this.hhea.lineGap, this.bbox = [this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax];
  }, r.prototype.registerTTF = function() {
    var e, n, i, s, o;
    if (this.scaleFactor = 1e3 / this.head.unitsPerEm, this.bbox = (function() {
      var l, u, f, g;
      for (g = [], l = 0, u = (f = this.bbox).length; l < u; l++) e = f[l], g.push(Math.round(e * this.scaleFactor));
      return g;
    }).call(this), this.stemV = 0, this.post.exists ? (i = 255 & (s = this.post.italic_angle), 32768 & (n = s >> 16) && (n = -(1 + (65535 ^ n))), this.italicAngle = +(n + "." + i)) : this.italicAngle = 0, this.ascender = Math.round(this.ascender * this.scaleFactor), this.decender = Math.round(this.decender * this.scaleFactor), this.lineGap = Math.round(this.lineGap * this.scaleFactor), this.capHeight = this.os2.exists && this.os2.capHeight || this.ascender, this.xHeight = this.os2.exists && this.os2.xHeight || 0, this.familyClass = (this.os2.exists && this.os2.familyClass || 0) >> 8, this.isSerif = (o = this.familyClass) === 1 || o === 2 || o === 3 || o === 4 || o === 5 || o === 7, this.isScript = this.familyClass === 10, this.flags = 0, this.post.isFixedPitch && (this.flags |= 1), this.isSerif && (this.flags |= 2), this.isScript && (this.flags |= 8), this.italicAngle !== 0 && (this.flags |= 64), this.flags |= 32, !this.cmap.unicode) throw new Error("No unicode cmap for font");
  }, r.prototype.characterToGlyph = function(e) {
    var n;
    return ((n = this.cmap.unicode) != null ? n.codeMap[e] : void 0) || 0;
  }, r.prototype.widthOfGlyph = function(e) {
    var n;
    return n = 1e3 / this.head.unitsPerEm, this.hmtx.forGlyph(e).advance * n;
  }, r.prototype.widthOfString = function(e, n, i) {
    var s, o, l, u;
    for (l = 0, o = 0, u = (e = "" + e).length; 0 <= u ? o < u : o > u; o = 0 <= u ? ++o : --o) s = e.charCodeAt(o), l += this.widthOfGlyph(this.characterToGlyph(s)) + i * (1e3 / n) || 0;
    return l * (n / 1e3);
  }, r.prototype.lineHeight = function(e, n) {
    var i;
    return n == null && (n = !1), i = n ? this.lineGap : 0, (this.ascender + i - this.decender) / 1e3 * e;
  }, r;
}();
var Un, Or = function() {
  function r(e) {
    this.data = e ?? [], this.pos = 0, this.length = this.data.length;
  }
  return r.prototype.readByte = function() {
    return this.data[this.pos++];
  }, r.prototype.writeByte = function(e) {
    return this.data[this.pos++] = e;
  }, r.prototype.readUInt32 = function() {
    return 16777216 * this.readByte() + (this.readByte() << 16) + (this.readByte() << 8) + this.readByte();
  }, r.prototype.writeUInt32 = function(e) {
    return this.writeByte(e >>> 24 & 255), this.writeByte(e >> 16 & 255), this.writeByte(e >> 8 & 255), this.writeByte(255 & e);
  }, r.prototype.readInt32 = function() {
    var e;
    return (e = this.readUInt32()) >= 2147483648 ? e - 4294967296 : e;
  }, r.prototype.writeInt32 = function(e) {
    return e < 0 && (e += 4294967296), this.writeUInt32(e);
  }, r.prototype.readUInt16 = function() {
    return this.readByte() << 8 | this.readByte();
  }, r.prototype.writeUInt16 = function(e) {
    return this.writeByte(e >> 8 & 255), this.writeByte(255 & e);
  }, r.prototype.readInt16 = function() {
    var e;
    return (e = this.readUInt16()) >= 32768 ? e - 65536 : e;
  }, r.prototype.writeInt16 = function(e) {
    return e < 0 && (e += 65536), this.writeUInt16(e);
  }, r.prototype.readString = function(e) {
    var n, i;
    for (i = [], n = 0; 0 <= e ? n < e : n > e; n = 0 <= e ? ++n : --n) i[n] = String.fromCharCode(this.readByte());
    return i.join("");
  }, r.prototype.writeString = function(e) {
    var n, i, s;
    for (s = [], n = 0, i = e.length; 0 <= i ? n < i : n > i; n = 0 <= i ? ++n : --n) s.push(this.writeByte(e.charCodeAt(n)));
    return s;
  }, r.prototype.readShort = function() {
    return this.readInt16();
  }, r.prototype.writeShort = function(e) {
    return this.writeInt16(e);
  }, r.prototype.readLongLong = function() {
    var e, n, i, s, o, l, u, f;
    return e = this.readByte(), n = this.readByte(), i = this.readByte(), s = this.readByte(), o = this.readByte(), l = this.readByte(), u = this.readByte(), f = this.readByte(), 128 & e ? -1 * (72057594037927940 * (255 ^ e) + 281474976710656 * (255 ^ n) + 1099511627776 * (255 ^ i) + 4294967296 * (255 ^ s) + 16777216 * (255 ^ o) + 65536 * (255 ^ l) + 256 * (255 ^ u) + (255 ^ f) + 1) : 72057594037927940 * e + 281474976710656 * n + 1099511627776 * i + 4294967296 * s + 16777216 * o + 65536 * l + 256 * u + f;
  }, r.prototype.writeLongLong = function(e) {
    var n, i;
    return n = Math.floor(e / 4294967296), i = 4294967295 & e, this.writeByte(n >> 24 & 255), this.writeByte(n >> 16 & 255), this.writeByte(n >> 8 & 255), this.writeByte(255 & n), this.writeByte(i >> 24 & 255), this.writeByte(i >> 16 & 255), this.writeByte(i >> 8 & 255), this.writeByte(255 & i);
  }, r.prototype.readInt = function() {
    return this.readInt32();
  }, r.prototype.writeInt = function(e) {
    return this.writeInt32(e);
  }, r.prototype.read = function(e) {
    var n, i;
    for (n = [], i = 0; 0 <= e ? i < e : i > e; i = 0 <= e ? ++i : --i) n.push(this.readByte());
    return n;
  }, r.prototype.write = function(e) {
    var n, i, s, o;
    for (o = [], i = 0, s = e.length; i < s; i++) n = e[i], o.push(this.writeByte(n));
    return o;
  }, r;
}(), qh = function() {
  var r;
  function e(n) {
    var i, s, o;
    for (this.scalarType = n.readInt(), this.tableCount = n.readShort(), this.searchRange = n.readShort(), this.entrySelector = n.readShort(), this.rangeShift = n.readShort(), this.tables = {}, s = 0, o = this.tableCount; 0 <= o ? s < o : s > o; s = 0 <= o ? ++s : --s) i = { tag: n.readString(4), checksum: n.readInt(), offset: n.readInt(), length: n.readInt() }, this.tables[i.tag] = i;
  }
  return e.prototype.encode = function(n) {
    var i, s, o, l, u, f, g, y, b, N, p, O, k;
    for (k in p = Object.keys(n).length, f = Math.log(2), b = 16 * Math.floor(Math.log(p) / f), l = Math.floor(b / f), y = 16 * p - b, (s = new Or()).writeInt(this.scalarType), s.writeShort(p), s.writeShort(b), s.writeShort(l), s.writeShort(y), o = 16 * p, g = s.pos + o, u = null, O = [], n) for (N = n[k], s.writeString(k), s.writeInt(r(N)), s.writeInt(g), s.writeInt(N.length), O = O.concat(N), k === "head" && (u = g), g += N.length; g % 4; ) O.push(0), g++;
    return s.write(O), i = 2981146554 - r(s.data), s.pos = u + 8, s.writeUInt32(i), s.data;
  }, r = function(n) {
    var i, s, o, l;
    for (n = Qc.call(n); n.length % 4; ) n.push(0);
    for (o = new Or(n), s = 0, i = 0, l = n.length; i < l; i = i += 4) s += o.readUInt32();
    return 4294967295 & s;
  }, e;
}(), Rh = {}.hasOwnProperty, nr = function(r, e) {
  for (var n in e) Rh.call(e, n) && (r[n] = e[n]);
  function i() {
    this.constructor = r;
  }
  return i.prototype = e.prototype, r.prototype = new i(), r.__super__ = e.prototype, r;
};
Un = function() {
  function r(e) {
    var n;
    this.file = e, n = this.file.directory.tables[this.tag], this.exists = !!n, n && (this.offset = n.offset, this.length = n.length, this.parse(this.file.contents));
  }
  return r.prototype.parse = function() {
  }, r.prototype.encode = function() {
  }, r.prototype.raw = function() {
    return this.exists ? (this.file.contents.pos = this.offset, this.file.contents.read(this.length)) : null;
  }, r;
}();
var Th = function(r) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return nr(e, Un), e.prototype.tag = "head", e.prototype.parse = function(n) {
    return n.pos = this.offset, this.version = n.readInt(), this.revision = n.readInt(), this.checkSumAdjustment = n.readInt(), this.magicNumber = n.readInt(), this.flags = n.readShort(), this.unitsPerEm = n.readShort(), this.created = n.readLongLong(), this.modified = n.readLongLong(), this.xMin = n.readShort(), this.yMin = n.readShort(), this.xMax = n.readShort(), this.yMax = n.readShort(), this.macStyle = n.readShort(), this.lowestRecPPEM = n.readShort(), this.fontDirectionHint = n.readShort(), this.indexToLocFormat = n.readShort(), this.glyphDataFormat = n.readShort();
  }, e.prototype.encode = function(n) {
    var i;
    return (i = new Or()).writeInt(this.version), i.writeInt(this.revision), i.writeInt(this.checkSumAdjustment), i.writeInt(this.magicNumber), i.writeShort(this.flags), i.writeShort(this.unitsPerEm), i.writeLongLong(this.created), i.writeLongLong(this.modified), i.writeShort(this.xMin), i.writeShort(this.yMin), i.writeShort(this.xMax), i.writeShort(this.yMax), i.writeShort(this.macStyle), i.writeShort(this.lowestRecPPEM), i.writeShort(this.fontDirectionHint), i.writeShort(n), i.writeShort(this.glyphDataFormat), i.data;
  }, e;
}(), Fc = function() {
  function r(e, n) {
    var i, s, o, l, u, f, g, y, b, N, p, O, k, B, _, E, G;
    switch (this.platformID = e.readUInt16(), this.encodingID = e.readShort(), this.offset = n + e.readInt(), b = e.pos, e.pos = this.offset, this.format = e.readUInt16(), this.length = e.readUInt16(), this.language = e.readUInt16(), this.isUnicode = this.platformID === 3 && this.encodingID === 1 && this.format === 4 || this.platformID === 0 && this.format === 4, this.codeMap = {}, this.format) {
      case 0:
        for (f = 0; f < 256; ++f) this.codeMap[f] = e.readByte();
        break;
      case 4:
        for (p = e.readUInt16(), N = p / 2, e.pos += 6, o = function() {
          var at, lt;
          for (lt = [], f = at = 0; 0 <= N ? at < N : at > N; f = 0 <= N ? ++at : --at) lt.push(e.readUInt16());
          return lt;
        }(), e.pos += 2, k = function() {
          var at, lt;
          for (lt = [], f = at = 0; 0 <= N ? at < N : at > N; f = 0 <= N ? ++at : --at) lt.push(e.readUInt16());
          return lt;
        }(), g = function() {
          var at, lt;
          for (lt = [], f = at = 0; 0 <= N ? at < N : at > N; f = 0 <= N ? ++at : --at) lt.push(e.readUInt16());
          return lt;
        }(), y = function() {
          var at, lt;
          for (lt = [], f = at = 0; 0 <= N ? at < N : at > N; f = 0 <= N ? ++at : --at) lt.push(e.readUInt16());
          return lt;
        }(), s = (this.length - e.pos + this.offset) / 2, u = function() {
          var at, lt;
          for (lt = [], f = at = 0; 0 <= s ? at < s : at > s; f = 0 <= s ? ++at : --at) lt.push(e.readUInt16());
          return lt;
        }(), f = _ = 0, G = o.length; _ < G; f = ++_) for (B = o[f], i = E = O = k[f]; O <= B ? E <= B : E >= B; i = O <= B ? ++E : --E) y[f] === 0 ? l = i + g[f] : (l = u[y[f] / 2 + (i - O) - (N - f)] || 0) !== 0 && (l += g[f]), this.codeMap[i] = 65535 & l;
    }
    e.pos = b;
  }
  return r.encode = function(e, n) {
    var i, s, o, l, u, f, g, y, b, N, p, O, k, B, _, E, G, at, lt, wt, tt, z, rt, dt, P, C, W, q, st, it, ht, Z, ut, pt, It, L, F, M, T, Y, Q, et, nt, At, Lt, Ct;
    switch (q = new Or(), l = Object.keys(e).sort(function(_t, zt) {
      return _t - zt;
    }), n) {
      case "macroman":
        for (k = 0, B = function() {
          var _t = [];
          for (O = 0; O < 256; ++O) _t.push(0);
          return _t;
        }(), E = { 0: 0 }, o = {}, st = 0, ut = l.length; st < ut; st++) E[nt = e[s = l[st]]] == null && (E[nt] = ++k), o[s] = { old: e[s], new: E[e[s]] }, B[s] = E[e[s]];
        return q.writeUInt16(1), q.writeUInt16(0), q.writeUInt32(12), q.writeUInt16(0), q.writeUInt16(262), q.writeUInt16(0), q.write(B), { charMap: o, subtable: q.data, maxGlyphID: k + 1 };
      case "unicode":
        for (C = [], b = [], G = 0, E = {}, i = {}, _ = g = null, it = 0, pt = l.length; it < pt; it++) E[lt = e[s = l[it]]] == null && (E[lt] = ++G), i[s] = { old: lt, new: E[lt] }, u = E[lt] - s, _ != null && u === g || (_ && b.push(_), C.push(s), g = u), _ = s;
        for (_ && b.push(_), b.push(65535), C.push(65535), dt = 2 * (rt = C.length), z = 2 * Math.pow(Math.log(rt) / Math.LN2, 2), N = Math.log(z / 2) / Math.LN2, tt = 2 * rt - z, f = [], wt = [], p = [], O = ht = 0, It = C.length; ht < It; O = ++ht) {
          if (P = C[O], y = b[O], P === 65535) {
            f.push(0), wt.push(0);
            break;
          }
          if (P - (W = i[P].new) >= 32768) for (f.push(0), wt.push(2 * (p.length + rt - O)), s = Z = P; P <= y ? Z <= y : Z >= y; s = P <= y ? ++Z : --Z) p.push(i[s].new);
          else f.push(W - P), wt.push(0);
        }
        for (q.writeUInt16(3), q.writeUInt16(1), q.writeUInt32(12), q.writeUInt16(4), q.writeUInt16(16 + 8 * rt + 2 * p.length), q.writeUInt16(0), q.writeUInt16(dt), q.writeUInt16(z), q.writeUInt16(N), q.writeUInt16(tt), Q = 0, L = b.length; Q < L; Q++) s = b[Q], q.writeUInt16(s);
        for (q.writeUInt16(0), et = 0, F = C.length; et < F; et++) s = C[et], q.writeUInt16(s);
        for (At = 0, M = f.length; At < M; At++) u = f[At], q.writeUInt16(u);
        for (Lt = 0, T = wt.length; Lt < T; Lt++) at = wt[Lt], q.writeUInt16(at);
        for (Ct = 0, Y = p.length; Ct < Y; Ct++) k = p[Ct], q.writeUInt16(k);
        return { charMap: i, subtable: q.data, maxGlyphID: G + 1 };
    }
  }, r;
}(), Zc = function(r) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return nr(e, Un), e.prototype.tag = "cmap", e.prototype.parse = function(n) {
    var i, s, o;
    for (n.pos = this.offset, this.version = n.readUInt16(), o = n.readUInt16(), this.tables = [], this.unicode = null, s = 0; 0 <= o ? s < o : s > o; s = 0 <= o ? ++s : --s) i = new Fc(n, this.offset), this.tables.push(i), i.isUnicode && this.unicode == null && (this.unicode = i);
    return !0;
  }, e.encode = function(n, i) {
    var s, o;
    return i == null && (i = "macroman"), s = Fc.encode(n, i), (o = new Or()).writeUInt16(0), o.writeUInt16(1), s.table = o.data.concat(s.subtable), s;
  }, e;
}(), zh = function(r) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return nr(e, Un), e.prototype.tag = "hhea", e.prototype.parse = function(n) {
    return n.pos = this.offset, this.version = n.readInt(), this.ascender = n.readShort(), this.decender = n.readShort(), this.lineGap = n.readShort(), this.advanceWidthMax = n.readShort(), this.minLeftSideBearing = n.readShort(), this.minRightSideBearing = n.readShort(), this.xMaxExtent = n.readShort(), this.caretSlopeRise = n.readShort(), this.caretSlopeRun = n.readShort(), this.caretOffset = n.readShort(), n.pos += 8, this.metricDataFormat = n.readShort(), this.numberOfMetrics = n.readUInt16();
  }, e;
}(), Uh = function(r) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return nr(e, Un), e.prototype.tag = "OS/2", e.prototype.parse = function(n) {
    if (n.pos = this.offset, this.version = n.readUInt16(), this.averageCharWidth = n.readShort(), this.weightClass = n.readUInt16(), this.widthClass = n.readUInt16(), this.type = n.readShort(), this.ySubscriptXSize = n.readShort(), this.ySubscriptYSize = n.readShort(), this.ySubscriptXOffset = n.readShort(), this.ySubscriptYOffset = n.readShort(), this.ySuperscriptXSize = n.readShort(), this.ySuperscriptYSize = n.readShort(), this.ySuperscriptXOffset = n.readShort(), this.ySuperscriptYOffset = n.readShort(), this.yStrikeoutSize = n.readShort(), this.yStrikeoutPosition = n.readShort(), this.familyClass = n.readShort(), this.panose = function() {
      var i, s;
      for (s = [], i = 0; i < 10; ++i) s.push(n.readByte());
      return s;
    }(), this.charRange = function() {
      var i, s;
      for (s = [], i = 0; i < 4; ++i) s.push(n.readInt());
      return s;
    }(), this.vendorID = n.readString(4), this.selection = n.readShort(), this.firstCharIndex = n.readShort(), this.lastCharIndex = n.readShort(), this.version > 0 && (this.ascent = n.readShort(), this.descent = n.readShort(), this.lineGap = n.readShort(), this.winAscent = n.readShort(), this.winDescent = n.readShort(), this.codePageRange = function() {
      var i, s;
      for (s = [], i = 0; i < 2; i = ++i) s.push(n.readInt());
      return s;
    }(), this.version > 1)) return this.xHeight = n.readShort(), this.capHeight = n.readShort(), this.defaultChar = n.readShort(), this.breakChar = n.readShort(), this.maxContext = n.readShort();
  }, e;
}(), Hh = function(r) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return nr(e, Un), e.prototype.tag = "post", e.prototype.parse = function(n) {
    var i, s, o;
    switch (n.pos = this.offset, this.format = n.readInt(), this.italicAngle = n.readInt(), this.underlinePosition = n.readShort(), this.underlineThickness = n.readShort(), this.isFixedPitch = n.readInt(), this.minMemType42 = n.readInt(), this.maxMemType42 = n.readInt(), this.minMemType1 = n.readInt(), this.maxMemType1 = n.readInt(), this.format) {
      case 65536:
        break;
      case 131072:
        var l;
        for (s = n.readUInt16(), this.glyphNameIndex = [], l = 0; 0 <= s ? l < s : l > s; l = 0 <= s ? ++l : --l) this.glyphNameIndex.push(n.readUInt16());
        for (this.names = [], o = []; n.pos < this.offset + this.length; ) i = n.readByte(), o.push(this.names.push(n.readString(i)));
        return o;
      case 151552:
        return s = n.readUInt16(), this.offsets = n.read(s);
      case 196608:
        break;
      case 262144:
        return this.map = (function() {
          var u, f, g;
          for (g = [], l = u = 0, f = this.file.maxp.numGlyphs; 0 <= f ? u < f : u > f; l = 0 <= f ? ++u : --u) g.push(n.readUInt32());
          return g;
        }).call(this);
    }
  }, e;
}(), Wh = function(r, e) {
  this.raw = r, this.length = r.length, this.platformID = e.platformID, this.encodingID = e.encodingID, this.languageID = e.languageID;
}, Vh = function(r) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return nr(e, Un), e.prototype.tag = "name", e.prototype.parse = function(n) {
    var i, s, o, l, u, f, g, y, b, N, p;
    for (n.pos = this.offset, n.readShort(), i = n.readShort(), f = n.readShort(), s = [], l = 0; 0 <= i ? l < i : l > i; l = 0 <= i ? ++l : --l) s.push({ platformID: n.readShort(), encodingID: n.readShort(), languageID: n.readShort(), nameID: n.readShort(), length: n.readShort(), offset: this.offset + f + n.readShort() });
    for (g = {}, l = b = 0, N = s.length; b < N; l = ++b) o = s[l], n.pos = o.offset, y = n.readString(o.length), u = new Wh(y, o), g[p = o.nameID] == null && (g[p] = []), g[o.nameID].push(u);
    this.strings = g, this.copyright = g[0], this.fontFamily = g[1], this.fontSubfamily = g[2], this.uniqueSubfamily = g[3], this.fontName = g[4], this.version = g[5];
    try {
      this.postscriptName = g[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g, "");
    } catch {
      this.postscriptName = g[4][0].raw.replace(/[\x00-\x19\x80-\xff]/g, "");
    }
    return this.trademark = g[7], this.manufacturer = g[8], this.designer = g[9], this.description = g[10], this.vendorUrl = g[11], this.designerUrl = g[12], this.license = g[13], this.licenseUrl = g[14], this.preferredFamily = g[15], this.preferredSubfamily = g[17], this.compatibleFull = g[18], this.sampleText = g[19];
  }, e;
}(), Gh = function(r) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return nr(e, Un), e.prototype.tag = "maxp", e.prototype.parse = function(n) {
    return n.pos = this.offset, this.version = n.readInt(), this.numGlyphs = n.readUInt16(), this.maxPoints = n.readUInt16(), this.maxContours = n.readUInt16(), this.maxCompositePoints = n.readUInt16(), this.maxComponentContours = n.readUInt16(), this.maxZones = n.readUInt16(), this.maxTwilightPoints = n.readUInt16(), this.maxStorage = n.readUInt16(), this.maxFunctionDefs = n.readUInt16(), this.maxInstructionDefs = n.readUInt16(), this.maxStackElements = n.readUInt16(), this.maxSizeOfInstructions = n.readUInt16(), this.maxComponentElements = n.readUInt16(), this.maxComponentDepth = n.readUInt16();
  }, e;
}(), Jh = function(r) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return nr(e, Un), e.prototype.tag = "hmtx", e.prototype.parse = function(n) {
    var i, s, o, l, u, f, g;
    for (n.pos = this.offset, this.metrics = [], i = 0, f = this.file.hhea.numberOfMetrics; 0 <= f ? i < f : i > f; i = 0 <= f ? ++i : --i) this.metrics.push({ advance: n.readUInt16(), lsb: n.readInt16() });
    for (o = this.file.maxp.numGlyphs - this.file.hhea.numberOfMetrics, this.leftSideBearings = function() {
      var y, b;
      for (b = [], i = y = 0; 0 <= o ? y < o : y > o; i = 0 <= o ? ++y : --y) b.push(n.readInt16());
      return b;
    }(), this.widths = (function() {
      var y, b, N, p;
      for (p = [], y = 0, b = (N = this.metrics).length; y < b; y++) l = N[y], p.push(l.advance);
      return p;
    }).call(this), s = this.widths[this.widths.length - 1], g = [], i = u = 0; 0 <= o ? u < o : u > o; i = 0 <= o ? ++u : --u) g.push(this.widths.push(s));
    return g;
  }, e.prototype.forGlyph = function(n) {
    return n in this.metrics ? this.metrics[n] : { advance: this.metrics[this.metrics.length - 1].advance, lsb: this.leftSideBearings[n - this.metrics.length] };
  }, e;
}(), Qc = [].slice, Yh = function(r) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return nr(e, Un), e.prototype.tag = "glyf", e.prototype.parse = function() {
    return this.cache = {};
  }, e.prototype.glyphFor = function(n) {
    var i, s, o, l, u, f, g, y, b, N;
    return n in this.cache ? this.cache[n] : (l = this.file.loca, i = this.file.contents, s = l.indexOf(n), (o = l.lengthOf(n)) === 0 ? this.cache[n] = null : (i.pos = this.offset + s, u = (f = new Or(i.read(o))).readShort(), y = f.readShort(), N = f.readShort(), g = f.readShort(), b = f.readShort(), this.cache[n] = u === -1 ? new $h(f, y, N, g, b) : new Xh(f, u, y, N, g, b), this.cache[n]));
  }, e.prototype.encode = function(n, i, s) {
    var o, l, u, f, g;
    for (u = [], l = [], f = 0, g = i.length; f < g; f++) o = n[i[f]], l.push(u.length), o && (u = u.concat(o.encode(s)));
    return l.push(u.length), { table: u, offsets: l };
  }, e;
}(), Xh = function() {
  function r(e, n, i, s, o, l) {
    this.raw = e, this.numberOfContours = n, this.xMin = i, this.yMin = s, this.xMax = o, this.yMax = l, this.compound = !1;
  }
  return r.prototype.encode = function() {
    return this.raw.data;
  }, r;
}(), $h = function() {
  function r(e, n, i, s, o) {
    var l, u;
    for (this.raw = e, this.xMin = n, this.yMin = i, this.xMax = s, this.yMax = o, this.compound = !0, this.glyphIDs = [], this.glyphOffsets = [], l = this.raw; u = l.readShort(), this.glyphOffsets.push(l.pos), this.glyphIDs.push(l.readUInt16()), 32 & u; ) l.pos += 1 & u ? 4 : 2, 128 & u ? l.pos += 8 : 64 & u ? l.pos += 4 : 8 & u && (l.pos += 2);
  }
  return r.prototype.encode = function() {
    var e, n, i;
    for (n = new Or(Qc.call(this.raw.data)), e = 0, i = this.glyphIDs.length; e < i; ++e) n.pos = this.glyphOffsets[e];
    return n.data;
  }, r;
}(), Kh = function(r) {
  function e() {
    return e.__super__.constructor.apply(this, arguments);
  }
  return nr(e, Un), e.prototype.tag = "loca", e.prototype.parse = function(n) {
    var i, s;
    return n.pos = this.offset, i = this.file.head.indexToLocFormat, this.offsets = i === 0 ? (function() {
      var o, l;
      for (l = [], s = 0, o = this.length; s < o; s += 2) l.push(2 * n.readUInt16());
      return l;
    }).call(this) : (function() {
      var o, l;
      for (l = [], s = 0, o = this.length; s < o; s += 4) l.push(n.readUInt32());
      return l;
    }).call(this);
  }, e.prototype.indexOf = function(n) {
    return this.offsets[n];
  }, e.prototype.lengthOf = function(n) {
    return this.offsets[n + 1] - this.offsets[n];
  }, e.prototype.encode = function(n, i) {
    for (var s = new Uint32Array(this.offsets.length), o = 0, l = 0, u = 0; u < s.length; ++u) if (s[u] = o, l < i.length && i[l] == u) {
      ++l, s[u] = o;
      var f = this.offsets[u], g = this.offsets[u + 1] - f;
      g > 0 && (o += g);
    }
    for (var y = new Array(4 * s.length), b = 0; b < s.length; ++b) y[4 * b + 3] = 255 & s[b], y[4 * b + 2] = (65280 & s[b]) >> 8, y[4 * b + 1] = (16711680 & s[b]) >> 16, y[4 * b] = (4278190080 & s[b]) >> 24;
    return y;
  }, e;
}(), Zh = function() {
  function r(e) {
    this.font = e, this.subset = {}, this.unicodes = {}, this.next = 33;
  }
  return r.prototype.generateCmap = function() {
    var e, n, i, s, o;
    for (n in s = this.font.cmap.tables[0].codeMap, e = {}, o = this.subset) i = o[n], e[n] = s[i];
    return e;
  }, r.prototype.glyphsFor = function(e) {
    var n, i, s, o, l, u, f;
    for (s = {}, l = 0, u = e.length; l < u; l++) s[o = e[l]] = this.font.glyf.glyphFor(o);
    for (o in n = [], s) (i = s[o]) != null && i.compound && n.push.apply(n, i.glyphIDs);
    if (n.length > 0) for (o in f = this.glyphsFor(n)) i = f[o], s[o] = i;
    return s;
  }, r.prototype.encode = function(e, n) {
    var i, s, o, l, u, f, g, y, b, N, p, O, k, B, _;
    for (s in i = Zc.encode(this.generateCmap(), "unicode"), l = this.glyphsFor(e), p = { 0: 0 }, _ = i.charMap) p[(f = _[s]).old] = f.new;
    for (O in N = i.maxGlyphID, l) O in p || (p[O] = N++);
    return y = function(E) {
      var G, at;
      for (G in at = {}, E) at[E[G]] = G;
      return at;
    }(p), b = Object.keys(y).sort(function(E, G) {
      return E - G;
    }), k = function() {
      var E, G, at;
      for (at = [], E = 0, G = b.length; E < G; E++) u = b[E], at.push(y[u]);
      return at;
    }(), o = this.font.glyf.encode(l, k, p), g = this.font.loca.encode(o.offsets, k), B = { cmap: this.font.cmap.raw(), glyf: o.table, loca: g, hmtx: this.font.hmtx.raw(), hhea: this.font.hhea.raw(), maxp: this.font.maxp.raw(), post: this.font.post.raw(), name: this.font.name.raw(), head: this.font.head.encode(n) }, this.font.os2.exists && (B["OS/2"] = this.font.os2.raw()), this.font.directory.encode(B);
  }, r;
}();
Ut.API.PDFObject = function() {
  var r;
  function e() {
  }
  return r = function(n, i) {
    return (Array(i + 1).join("0") + n).slice(-i);
  }, e.convert = function(n) {
    var i, s, o, l;
    if (Array.isArray(n)) return "[" + function() {
      var u, f, g;
      for (g = [], u = 0, f = n.length; u < f; u++) i = n[u], g.push(e.convert(i));
      return g;
    }().join(" ") + "]";
    if (typeof n == "string") return "/" + n;
    if (n != null && n.isString) return "(" + n + ")";
    if (n instanceof Date) return "(D:" + r(n.getUTCFullYear(), 4) + r(n.getUTCMonth(), 2) + r(n.getUTCDate(), 2) + r(n.getUTCHours(), 2) + r(n.getUTCMinutes(), 2) + r(n.getUTCSeconds(), 2) + "Z)";
    if ({}.toString.call(n) === "[object Object]") {
      for (s in o = ["<<"], n) l = n[s], o.push("/" + s + " " + e.convert(l));
      return o.push(">>"), o.join(`
`);
    }
    return "" + n;
  }, e;
}();
const Ms = {
  "circle-radius": 8,
  "circle-color": "red",
  "circle-stroke-width": 1,
  "circle-stroke-color": "black"
}, wo = {
  style: {
    textSize: 16,
    textHaloColor: "#FFFFFF",
    textHaloWidth: 0.8,
    textColor: "#000000",
    fallbackTextFont: ["Open Sans Regular"]
  },
  visibility: "visible",
  position: "bottom-right"
}, xo = {
  image: '<svg width="800px" height="800px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--gis" preserveAspectRatio="xMidYMid meet"><path d="M47.655 1.634l-35 95c-.828 2.24 1.659 4.255 3.68 2.98l33.667-21.228l33.666 21.228c2.02 1.271 4.503-.74 3.678-2.98l-35-95C51.907.514 51.163.006 50 .008c-1.163.001-1.99.65-2.345 1.626zm-.155 14.88v57.54L19.89 91.461z" fill="none" stroke="white" stroke-width="1.5"/><path d="M47.655 1.634l-35 95c-.828 2.24 1.659 4.255 3.68 2.98l33.667-21.228l33.666 21.228c2.02 1.271 4.503-.74 3.678-2.98l-35-95C51.907.514 51.163.006 50 .008c-1.163.001-1.99.65-2.345 1.626zm-.155 14.88v57.54L19.89 91.461z" fill="#000000" fill-rule="evenodd"></path></svg>',
  imageName: "gl-export-north-icon",
  imageSizeFraction: 0.05,
  visibility: "visible",
  position: "top-right"
};
class Qh {
  /**
   * Constructor
   * @param map MaplibreMap object
   * @param size layout size. default is A4
   * @param dpi dpi value. default is 300
   * @param format image format. default is PNG
   * @param unit length unit. default is mm
   * @param fileName file name. default is 'map'
   */
  constructor(e, n = Ii.A4, i = 300, s = vo.PNG, o = Mi.mm, l = "map", u = "maplibregl-marker", f = Ms, g = "maplibregl-ctrl-attrib-inner", y = wo, b = xo) {
    ie(this, "map");
    ie(this, "width");
    ie(this, "height");
    ie(this, "dpi");
    ie(this, "format");
    ie(this, "unit");
    ie(this, "fileName");
    ie(this, "markerClassName");
    ie(this, "markerCirclePaint");
    ie(this, "attributionClassName");
    ie(this, "attributionOptions");
    ie(this, "northIconOptions");
    this.map = e, this.width = n[0], this.height = n[1], this.dpi = i, this.format = s, this.unit = o, this.fileName = l, this.markerClassName = u, this.markerCirclePaint = f, this.attributionClassName = g, this.attributionOptions = y, this.northIconOptions = b;
  }
  renderMapPost(e) {
    return e;
  }
  getMarkers() {
    return this.map.getCanvasContainer().getElementsByClassName(this.markerClassName);
  }
  renderMarkers(e) {
    const n = this.getMarkers();
    for (let i = 0; i < n.length; i++) {
      const s = n.item(i);
      if (!s) continue;
      const o = s.getAttribute("style");
      if (!o) continue;
      const l = /translate\(([^,]+)px,\s*([^,]+)px\)/, u = o.match(l);
      if (!u) continue;
      const f = parseInt(u[1]), g = parseInt(u[2]), y = this.map.unproject([f, g]), b = `point${i}`;
      e.addSource(b, {
        type: "geojson",
        data: {
          type: "Point",
          coordinates: [y.lng, y.lat]
        }
      }), e.addLayer({
        id: b,
        source: b,
        type: "circle",
        paint: this.markerCirclePaint
      });
    }
    return e;
  }
  /**
   * Generate and download Map image
   */
  generate() {
    const e = this;
    this.addLoader(), this.showLoader();
    const n = window.devicePixelRatio;
    Object.defineProperty(window, "devicePixelRatio", {
      get() {
        return e.dpi / 96;
      }
    });
    const i = document.createElement("div");
    i.className = "hidden-map", document.body.appendChild(i);
    const s = document.createElement("div");
    s.style.width = this.toPixels(this.width), s.style.height = this.toPixels(this.height), i.appendChild(s);
    const o = this.map.getStyle();
    if (o && o.sources) {
      const u = o.sources;
      Object.keys(u).forEach((f) => {
        const g = u[f];
        Object.keys(g).forEach((y) => {
          g[y] || delete g[y];
        });
      });
    }
    let l = this.getRenderedMap(s, o);
    l.on("load", () => {
      this.addNorthIconToMap(l).then(() => {
        l.once("idle", () => {
          this.addAttributions(l) ? l.once("idle", () => {
            l = this.renderMapPost(l), this.getMarkers().length === 0 ? this.exportImage(l, i, n) : (l = this.renderMarkers(l), l.once("idle", () => {
              this.exportImage(l, i, n);
            }));
          }) : (l = this.renderMapPost(l), this.getMarkers().length === 0 ? this.exportImage(l, i, n) : (l = this.renderMarkers(l), l.once("idle", () => {
            this.exportImage(l, i, n);
          })));
        });
      });
    });
  }
  stripHtml(e) {
    const n = document.createElement("div");
    return n.innerHTML = e, n.textContent || n.innerText || "";
  }
  /**
   * Get icon width against exported map size by using fraction rate
   * @param renderMap Map object
   * @param fraction adjust icon size by using this fraction rate. Default is 8%
   * @returns Icon width calculated
   */
  getIconWidth(e, n) {
    const i = e.getContainer(), s = parseInt(i.style.width.replace("px", ""));
    return parseInt(`${s * n}`);
  }
  /**
   * Get element position's pixel values based on selected position setting
   * @param renderMap Map object
   * @param position Position of element inserted
   * @param offset Offset value to adjust position
   * @returns Pixels [width, height]
   */
  getElementPosition(e, n, i = 0) {
    const s = e.getContainer();
    let o = 0, l = 0;
    switch (n) {
      case "top-left":
        o = 0 + i, l = 0 + i;
        break;
      case "top-right":
        o = parseInt(s.style.width.replace("px", "")) - i, l = 0 + i;
        break;
      case "bottom-left":
        o = 0 + i, l = parseInt(s.style.height.replace("px", "")) - i;
        break;
      case "bottom-right":
        o = parseInt(s.style.width.replace("px", "")) - i, l = parseInt(s.style.height.replace("px", "")) - i;
        break;
    }
    return [o, l];
  }
  /**
   * Add North Icon SVG to map object
   * @param renderMap Map object
   * @returns void
   */
  addNorthIconImage(e) {
    const n = this.getIconWidth(e, this.northIconOptions.imageSizeFraction ?? 0.08);
    return new Promise((i) => {
      const s = new Image(n, n);
      s.onload = () => {
        this.northIconOptions.imageName && e.addImage(this.northIconOptions.imageName, s), i();
      };
      function o(l) {
        return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(l);
      }
      this.northIconOptions.image && (s.src = o(this.northIconOptions.image));
    });
  }
  /**
   * Add North Icon Symbol layer to renderMap object
   * @param renderMap Map object
   * @returns
   */
  addNorthIconToMap(e) {
    let n = this.northIconOptions.visibility ?? "visible";
    return e.getZoom() < 2 && this.width > this.height && (n = "none"), new Promise((i) => {
      this.addNorthIconImage(e).then(() => {
        const o = this.getIconWidth(
          e,
          this.northIconOptions.imageSizeFraction ?? 0.08
        ) * 0.8, l = this.getElementPosition(
          e,
          this.northIconOptions.position ?? "top-right",
          o
        ), u = e.unproject(l), f = this.northIconOptions.imageName ?? "gl-export-north-icon";
        e.addSource(f, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [u.lng, u.lat]
            },
            properties: {}
          }
        }), e.addLayer({
          id: f,
          source: f,
          type: "symbol",
          layout: {
            "icon-image": f,
            "icon-size": 1,
            "icon-rotate": e.getBearing() * -1,
            "icon-allow-overlap": !0,
            "icon-ignore-placement": !0,
            visibility: n
          },
          paint: {}
        }), i();
      });
    });
  }
  addAttributions(e) {
    var B;
    if (!this.map.getStyle().glyphs) return !1;
    const i = e.getContainer(), s = this.attributionOptions.position ?? "bottom-right", o = this.getElementPosition(e, s, 5), l = o[0], u = e.unproject(o), f = i.getElementsByClassName(this.attributionClassName), g = [];
    if ((f == null ? void 0 : f.length) > 0) {
      const _ = f.item(0);
      if (_)
        for (let E = 0; E < _.children.length; E++) {
          const G = _.children.item(E);
          G && g.push(this.stripHtml(G.outerHTML));
        }
    } else {
      const _ = this.map.getStyle().sources;
      Object.keys(_).forEach((E) => {
        const G = _[E];
        if ("attribution" in G) {
          const at = G.attribution;
          g.push(this.stripHtml(at));
        }
      });
    }
    if (g.length === 0) return !1;
    const y = g.join(" | "), b = "attribution";
    e.addSource(b, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [u.lng, u.lat]
        },
        properties: {
          attribution: y
        }
      }
    });
    const N = this.map.getStyle().layers.filter(
      (_) => _.type === "symbol" && _.layout && "text-font" in _.layout
    ), p = N.length > 0 && N[0].layout ? N[0].layout["text-font"] : (B = this.attributionOptions.style) == null ? void 0 : B.fallbackTextFont;
    let O = this.attributionOptions.visibility ?? "visible";
    e.getZoom() < 2 && this.width > this.height && (O = "none");
    const k = this.attributionOptions.style;
    return e.addLayer({
      id: b,
      source: b,
      type: "symbol",
      layout: {
        "text-field": ["get", "attribution"],
        "text-font": p,
        "text-max-width": parseInt(`${l / k.textSize}`),
        "text-anchor": s,
        "text-justify": ["top-right", "bottom-right"].includes(s) ? "right" : "left",
        "text-size": k.textSize,
        "text-allow-overlap": !0,
        visibility: O
      },
      paint: {
        "text-halo-color": k.textHaloColor,
        "text-halo-width": k.textHaloWidth,
        "text-color": k.textColor
      }
    }), !0;
  }
  exportImage(e, n, i) {
    var l;
    const s = e.getCanvas(), o = `${this.fileName}.pdf`;
    window.sessionStorage.getItem("generateLegend") == "true" ? this.toPNG(s, o) : this.toPDF(e, o), e.remove(), (l = n.parentNode) == null || l.removeChild(n), Object.defineProperty(window, "devicePixelRatio", {
      get() {
        return i;
      }
    }), n.remove(), this.hideLoader();
  }
  /**
   * Convert canvas to PNG
   * @param canvas Canvas element
   * @param fileName file name
   */
  toPNG(e, n) {
    const i = document.getElementById("MapImage");
    i && (i.src = e.toDataURL());
    const s = document.getElementById("ExportButton");
    s && s.click(), console.log("Map exported");
  }
  /**
   * Convert canvas to JPEG
   * @param canvas Canvas element
   * @param fileName file name
   */
  /*
  private toJPEG(canvas: HTMLCanvasElement, fileName: string) {
  	const uri = canvas.toDataURL('image/jpeg', 0.85);
  	const a = document.createElement('a');
  	a.href = uri;
  	a.download = fileName;
  	a.click();
  	a.remove();
  }
  */
  /**
   * Convert Map object to PDF
   * @param map Map object
   * @param fileName file name
   */
  toPDF(e, n) {
    const i = e.getCanvas(), s = new Ut({
      orientation: this.width > this.height ? "l" : "p",
      unit: this.unit,
      compress: !0,
      format: [this.width, this.height]
    });
    s.addImage(
      i.toDataURL("image/png"),
      "png",
      0,
      0,
      this.width,
      this.height,
      void 0,
      "FAST"
    );
    const { lng: o, lat: l } = e.getCenter();
    s.setProperties({
      title: e.getStyle().name,
      subject: `center: [${o}, ${l}], zoom: ${e.getZoom()}`,
      creator: "Mapbox GL Export Plugin",
      author: "(c)Mapbox, (c)OpenStreetMap"
    }), s.save(n);
  }
  /**
   * Convert canvas to SVG
   * @param canvas Canvas element
   * @param fileName file name
   */
  /*
  	private toSVG(canvas: HTMLCanvasElement, fileName: string) {
  		const uri = canvas.toDataURL('image/png');
  
  		const pxWidth = Number(this.toPixels(this.width, this.dpi).replace('px', ''));
  		const pxHeight = Number(this.toPixels(this.height, this.dpi).replace('px', ''));
  
  		const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        version="1.1" 
        width="${pxWidth}" 
        height="${pxHeight}" 
        viewBox="0 0 ${pxWidth} ${pxHeight}" 
        xml:space="preserve">
          <image style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  
        xlink:href="${uri}" width="${pxWidth}" height="${pxHeight}"></image>
      </svg>`;
  
  		const a = document.createElement('a');
  		a.href = `data:application/xml,${encodeURIComponent(svg)}`;
  		a.download = fileName;
  		a.click();
  		a.remove();
  	}
  	*/
  /**
   * Convert mm/inch to pixel
   * @param length mm/inch length
   * @param conversionFactor DPI value. default is 96.
   */
  toPixels(e, n = 96) {
    return this.unit === Mi.mm && (n /= 25.4), `${n * e}px`;
  }
  /**
   * Add loader in the parent element of maplibre map.
   */
  addLoader() {
    var o;
    const n = (o = this.map.getCanvas().parentElement) == null ? void 0 : o.parentElement;
    if (!n || n.getElementsByClassName("map-export-loader").length > 0) return;
    const s = document.createElement("span");
    s.classList.add("map-export-loader"), s.classList.add("loader-default"), n.appendChild(s);
  }
  /**
   * Show loader
   */
  showLoader() {
    var s, o;
    const n = (s = this.map.getCanvas().parentElement) == null ? void 0 : s.parentElement;
    if (!n) return;
    const i = n.getElementsByClassName("map-export-loader");
    i && i.length > 0 && ((o = i.item(0)) == null || o.classList.add("is-active"));
  }
  /**
   * Hide loader
   */
  hideLoader() {
    var s, o;
    const n = (s = this.map.getCanvas().parentElement) == null ? void 0 : s.parentElement;
    if (!n) return;
    const i = n.getElementsByClassName("map-export-loader");
    i && i.length > 0 && ((o = i.item(0)) == null || o.classList.remove("is-active"));
  }
}
class tu extends Qh {
  /**
   * Constructor
   * @param map MaplibreMap object
   * @param size layout size. default is A4
   * @param dpi dpi value. default is 300
   * @param format image format. default is PNG
   * @param unit length unit. default is mm
   * @param fileName file name. default is 'map'
   */
  constructor(e, n = Ii.A4, i = 300, s = vo.PNG, o = Mi.mm, l = "map", u = Ms, f = wo, g = xo) {
    super(
      e,
      n,
      i,
      s,
      o,
      l,
      "maplibregl-marker",
      u,
      "maplibregl-ctrl-attrib-inner",
      f,
      g
    );
  }
  getRenderedMap(e, n) {
    const i = new Rl({
      container: e,
      style: n,
      center: this.map.getCenter(),
      zoom: this.map.getZoom(),
      bearing: this.map.getBearing(),
      pitch: this.map.getPitch(),
      interactive: !1,
      preserveDrawingBuffer: !0,
      fadeDuration: 0,
      // attributionControl: false,
      // hack to read transform request callback function
      // eslint-disable-next-line
      // @ts-ignore
      transformRequest: this.map._requestManager._transformRequestFn
    });
    this.map.getTerrain() && (i.setMaxPitch(85), i.setPitch(this.map.getPitch()));
    const o = (this.map.style.imageManager || {}).images || [];
    return Object.keys(o).forEach((l) => {
      o[l].data && i.addImage(l, o[l].data);
    }), i;
  }
  renderMapPost(e) {
    const n = this.map.getTerrain();
    return n && e.setTerrain({
      source: n.source,
      exaggeration: n.exaggeration
    }), e;
  }
}
class iu {
  constructor(e) {
    ie(this, "controlContainer");
    ie(this, "exportContainer");
    ie(this, "crosshair");
    ie(this, "printableArea");
    ie(this, "map");
    ie(this, "exportButton");
    ie(this, "options", {
      PageSize: Ii.A4,
      PageOrientation: so.Landscape,
      Format: vo.PDF,
      DPI: uc[300],
      Crosshair: !1,
      PrintableArea: !1,
      Local: "en",
      AllowedSizes: Object.keys(Ii),
      Filename: "map",
      markerCirclePaint: Ms,
      attributionOptions: wo,
      northIconOptions: xo
    });
    ie(this, "MAPLIB_CSS_PREFIX", "maplibregl");
    e && (e.attributionOptions = Object.assign(
      wo,
      e.attributionOptions
    ), e.northIconOptions = Object.assign(xo, e.northIconOptions), this.options = Object.assign(this.options, e)), this.onDocumentClick = this.onDocumentClick.bind(this);
  }
  getDefaultPosition() {
    return "top-right";
  }
  getTranslation() {
    const e = this.options.Local ?? "en";
    return eh(e);
  }
  onAdd(e) {
    var y;
    this.map = e, this.controlContainer = document.createElement("div"), this.controlContainer.classList.add(`${this.MAPLIB_CSS_PREFIX}-ctrl`), this.controlContainer.classList.add(`${this.MAPLIB_CSS_PREFIX}-ctrl-group`), this.exportContainer = document.createElement("div"), this.exportContainer.classList.add(`${this.MAPLIB_CSS_PREFIX}-export-list`), this.exportButton = document.createElement("button"), this.exportButton.classList.add(`${this.MAPLIB_CSS_PREFIX}-ctrl-icon`), this.exportButton.classList.add(`${this.MAPLIB_CSS_PREFIX}-export-control`), this.exportButton.type = "button", this.exportButton.addEventListener("click", () => {
      this.exportButton.style.display = "none", this.exportContainer.style.display = "block", this.toggleCrosshair(!0), this.togglePrintableArea(!0);
    }), document.addEventListener("click", this.onDocumentClick), this.controlContainer.appendChild(this.exportButton), this.controlContainer.appendChild(this.exportContainer);
    const n = document.createElement("TABLE");
    n.className = "print-table";
    const i = {};
    (y = this.options.AllowedSizes) == null || y.forEach((b) => {
      Ii[b] && (i[b] = Ii[b]);
    });
    const s = this.createSelection(
      i,
      this.getTranslation().PageSize,
      "page-size",
      this.options.PageSize,
      (b, N) => JSON.stringify(b[N])
    );
    n.appendChild(s);
    const o = this.createSelection(
      so,
      this.getTranslation().PageOrientation,
      "page-orientation",
      this.options.PageOrientation,
      (b, N) => b[N]
    );
    n.appendChild(o);
    const l = this.createSelection(
      uc,
      this.getTranslation().DPI,
      "dpi-type",
      this.options.DPI,
      (b, N) => b[N]
    );
    n.appendChild(l);
    const u = { Yes: "true", No: "false" }, f = this.createSelection(
      u,
      "Generate Legend",
      "generate-legend",
      "false",
      (b, N) => b[N]
    );
    n.appendChild(f), this.exportContainer.appendChild(n);
    const g = document.createElement("button");
    return g.type = "button", g.textContent = this.getTranslation().Generate, g.classList.add("generate-button"), g.addEventListener("click", () => {
      const b = document.getElementById("mapbox-gl-export-page-size"), N = document.getElementById("mapbox-gl-export-page-orientation"), p = document.getElementById("mapbox-gl-export-dpi-type"), O = document.getElementById("mapbox-gl-export-generate-legend"), k = N.value;
      let B = JSON.parse(b.value);
      k === so.Portrait && (B = B.reverse()), window.sessionStorage.setItem("ExportPageSize", JSON.stringify(B)), window.sessionStorage.setItem("generateLegend", O.value), this.generateMap(
        e,
        B,
        Number(p.value),
        //formatType.value as FormatType,
        vo.PNG,
        Mi.mm,
        this.options.Filename
      );
    }), this.exportContainer.appendChild(g), this.controlContainer;
  }
  generateMap(e, n, i, s, o, l) {
    new tu(
      e,
      n,
      i,
      s,
      o,
      l,
      this.options.markerCirclePaint,
      this.options.attributionOptions,
      this.options.northIconOptions
    ).generate();
  }
  createSelection(e, n, i, s, o) {
    const l = document.createElement("label");
    l.textContent = n;
    const u = document.createElement("select");
    u.setAttribute("id", `mapbox-gl-export-${i}`), u.style.width = "100%", Object.keys(e).forEach((b) => {
      const N = document.createElement("option");
      N.setAttribute("value", o(e, b)), N.appendChild(document.createTextNode(b)), N.setAttribute("name", i), s === e[b] && (N.selected = !0), u.appendChild(N);
    }), u.addEventListener("change", () => {
      this.updatePrintableArea();
    });
    const f = document.createElement("TR"), g = document.createElement("TD"), y = document.createElement("TD");
    return g.appendChild(l), y.appendChild(u), f.appendChild(g), f.appendChild(y), f;
  }
  onRemove() {
    !this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.exportButton || (this.exportButton.removeEventListener("click", this.onDocumentClick), this.controlContainer.parentNode.removeChild(this.controlContainer), document.removeEventListener("click", this.onDocumentClick), this.crosshair !== void 0 && (this.crosshair.destroy(), this.crosshair = void 0), this.printableArea !== void 0 && (this.printableArea.destroy(), this.printableArea = void 0), this.map = void 0);
  }
  onDocumentClick(e) {
    this.controlContainer && !this.controlContainer.contains(e.target) && this.exportContainer && this.exportButton && (this.exportContainer.style.display = "none", this.exportButton.style.display = "block", this.toggleCrosshair(!1), this.togglePrintableArea(!1));
  }
  toggleCrosshair(e) {
    this.options.Crosshair === !0 && (e === !1 ? this.crosshair !== void 0 && (this.crosshair.destroy(), this.crosshair = void 0) : (this.crosshair = new Tl(this.map), this.crosshair.create()));
  }
  togglePrintableArea(e) {
    this.options.PrintableArea === !0 && (e === !1 ? this.printableArea !== void 0 && (this.printableArea.destroy(), this.printableArea = void 0) : (this.printableArea = new zl(this.map), this.updatePrintableArea()));
  }
  updatePrintableArea() {
    if (this.printableArea === void 0)
      return;
    const e = document.getElementById("mapbox-gl-export-page-size"), i = document.getElementById("mapbox-gl-export-page-orientation").value;
    let s = JSON.parse(e.value);
    i === so.Portrait && (s = s.reverse()), this.printableArea.updateArea(s[0], s[1]);
  }
}
export {
  ru as A,
  Tl as C,
  uc as D,
  vo as F,
  th as L,
  iu as M,
  zl as P,
  Ii as S,
  Mi as U,
  de as _,
  so as a,
  wo as b,
  xo as c,
  Ms as d,
  Qh as e,
  eh as g
};
//# sourceMappingURL=index-C6PCVBTA.js.map
