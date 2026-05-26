/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const se = globalThis, Me = se.ShadowRoot && (se.ShadyCSS === void 0 || se.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Be = Symbol(), Te = /* @__PURE__ */ new WeakMap();
let Ve = class {
  constructor(e, r, a) {
    if (this._$cssResult$ = !0, a !== Be) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = r;
  }
  get styleSheet() {
    let e = this.o;
    const r = this.t;
    if (Me && e === void 0) {
      const a = r !== void 0 && r.length === 1;
      a && (e = Te.get(r)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && Te.set(r, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const zt = (t) => new Ve(typeof t == "string" ? t : t + "", void 0, Be), C = (t, ...e) => {
  const r = t.length === 1 ? t[0] : e.reduce((a, o, i) => a + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + t[i + 1], t[0]);
  return new Ve(r, t, Be);
}, At = (t, e) => {
  if (Me) t.adoptedStyleSheets = e.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of e) {
    const a = document.createElement("style"), o = se.litNonce;
    o !== void 0 && a.setAttribute("nonce", o), a.textContent = r.cssText, t.appendChild(a);
  }
}, Ee = Me ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let r = "";
  for (const a of e.cssRules) r += a.cssText;
  return zt(r);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Tt, defineProperty: Et, getOwnPropertyDescriptor: Pt, getOwnPropertyNames: Ft, getOwnPropertySymbols: Ht, getPrototypeOf: Dt } = Object, H = globalThis, Pe = H.trustedTypes, Rt = Pe ? Pe.emptyScript : "", Ot = H.reactiveElementPolyfillSupport, Y = (t, e) => t, le = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Rt : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let r = t;
  switch (e) {
    case Boolean:
      r = t !== null;
      break;
    case Number:
      r = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        r = JSON.parse(t);
      } catch {
        r = null;
      }
  }
  return r;
} }, ze = (t, e) => !Tt(t, e), Fe = { attribute: !0, type: String, converter: le, reflect: !1, useDefault: !1, hasChanged: ze };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), H.litPropertyMetadata ?? (H.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let V = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, r = Fe) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(e, r), !r.noAccessor) {
      const a = Symbol(), o = this.getPropertyDescriptor(e, a, r);
      o !== void 0 && Et(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, r, a) {
    const { get: o, set: i } = Pt(this.prototype, e) ?? { get() {
      return this[r];
    }, set(n) {
      this[r] = n;
    } };
    return { get: o, set(n) {
      const c = o?.call(this);
      i?.call(this, n), this.requestUpdate(e, c, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Fe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Y("elementProperties"))) return;
    const e = Dt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Y("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Y("properties"))) {
      const r = this.properties, a = [...Ft(r), ...Ht(r)];
      for (const o of a) this.createProperty(o, r[o]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const r = litPropertyMetadata.get(e);
      if (r !== void 0) for (const [a, o] of r) this.elementProperties.set(a, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [r, a] of this.elementProperties) {
      const o = this._$Eu(r, a);
      o !== void 0 && this._$Eh.set(o, r);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const r = [];
    if (Array.isArray(e)) {
      const a = new Set(e.flat(1 / 0).reverse());
      for (const o of a) r.unshift(Ee(o));
    } else e !== void 0 && r.push(Ee(e));
    return r;
  }
  static _$Eu(e, r) {
    const a = r.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), r = this.constructor.elementProperties;
    for (const a of r.keys()) this.hasOwnProperty(a) && (e.set(a, this[a]), delete this[a]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return At(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, r, a) {
    this._$AK(e, a);
  }
  _$ET(e, r) {
    const a = this.constructor.elementProperties.get(e), o = this.constructor._$Eu(e, a);
    if (o !== void 0 && a.reflect === !0) {
      const i = (a.converter?.toAttribute !== void 0 ? a.converter : le).toAttribute(r, a.type);
      this._$Em = e, i == null ? this.removeAttribute(o) : this.setAttribute(o, i), this._$Em = null;
    }
  }
  _$AK(e, r) {
    const a = this.constructor, o = a._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const i = a.getPropertyOptions(o), n = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : le;
      this._$Em = o;
      const c = n.fromAttribute(r, i.type);
      this[o] = c ?? this._$Ej?.get(o) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, r, a, o = !1, i) {
    if (e !== void 0) {
      const n = this.constructor;
      if (o === !1 && (i = this[e]), a ?? (a = n.getPropertyOptions(e)), !((a.hasChanged ?? ze)(i, r) || a.useDefault && a.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, a)))) return;
      this.C(e, r, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, r, { useDefault: a, reflect: o, wrapped: i }, n) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? r ?? this[e]), i !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (r = void 0), this._$AL.set(e, r)), o === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (r) {
      Promise.reject(r);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, i] of this._$Ep) this[o] = i;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [o, i] of a) {
        const { wrapped: n } = i, c = this[o];
        n !== !0 || this._$AL.has(o) || c === void 0 || this.C(o, void 0, i, c);
      }
    }
    let e = !1;
    const r = this._$AL;
    try {
      e = this.shouldUpdate(r), e ? (this.willUpdate(r), this._$EO?.forEach((a) => a.hostUpdate?.()), this.update(r)) : this._$EM();
    } catch (a) {
      throw e = !1, this._$EM(), a;
    }
    e && this._$AE(r);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((r) => r.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((r) => this._$ET(r, this[r]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
V.elementStyles = [], V.shadowRootOptions = { mode: "open" }, V[Y("elementProperties")] = /* @__PURE__ */ new Map(), V[Y("finalized")] = /* @__PURE__ */ new Map(), Ot?.({ ReactiveElement: V }), (H.reactiveElementVersions ?? (H.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis, He = (t) => t, ce = X.trustedTypes, De = ce ? ce.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ge = "$lit$", F = `lit$${Math.random().toFixed(9).slice(2)}$`, We = "?" + F, Lt = `<${We}>`, U = document, re = () => U.createComment(""), oe = (t) => t === null || typeof t != "object" && typeof t != "function", Ae = Array.isArray, It = (t) => Ae(t) || typeof t?.[Symbol.iterator] == "function", ye = `[ 	
\f\r]`, J = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Re = /-->/g, Oe = />/g, L = RegExp(`>|${ye}(?:([^\\s"'>=/]+)(${ye}*=${ye}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Le = /'/g, Ie = /"/g, Ke = /^(?:script|style|textarea|title)$/i, Ut = (t) => (e, ...r) => ({ _$litType$: t, strings: e, values: r }), s = Ut(1), G = Symbol.for("lit-noChange"), y = Symbol.for("lit-nothing"), Ue = /* @__PURE__ */ new WeakMap(), I = U.createTreeWalker(U, 129);
function Ze(t, e) {
  if (!Ae(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return De !== void 0 ? De.createHTML(e) : e;
}
const Nt = (t, e) => {
  const r = t.length - 1, a = [];
  let o, i = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = J;
  for (let c = 0; c < r; c++) {
    const l = t[c];
    let d, u, p = -1, m = 0;
    for (; m < l.length && (n.lastIndex = m, u = n.exec(l), u !== null); ) m = n.lastIndex, n === J ? u[1] === "!--" ? n = Re : u[1] !== void 0 ? n = Oe : u[2] !== void 0 ? (Ke.test(u[2]) && (o = RegExp("</" + u[2], "g")), n = L) : u[3] !== void 0 && (n = L) : n === L ? u[0] === ">" ? (n = o ?? J, p = -1) : u[1] === void 0 ? p = -2 : (p = n.lastIndex - u[2].length, d = u[1], n = u[3] === void 0 ? L : u[3] === '"' ? Ie : Le) : n === Ie || n === Le ? n = L : n === Re || n === Oe ? n = J : (n = L, o = void 0);
    const b = n === L && t[c + 1].startsWith("/>") ? " " : "";
    i += n === J ? l + Lt : p >= 0 ? (a.push(d), l.slice(0, p) + Ge + l.slice(p) + F + b) : l + F + (p === -2 ? c : b);
  }
  return [Ze(t, i + (t[r] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class ae {
  constructor({ strings: e, _$litType$: r }, a) {
    let o;
    this.parts = [];
    let i = 0, n = 0;
    const c = e.length - 1, l = this.parts, [d, u] = Nt(e, r);
    if (this.el = ae.createElement(d, a), I.currentNode = this.el.content, r === 2 || r === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (o = I.nextNode()) !== null && l.length < c; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const p of o.getAttributeNames()) if (p.endsWith(Ge)) {
          const m = u[n++], b = o.getAttribute(p).split(F), x = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: i, name: x[2], strings: b, ctor: x[1] === "." ? Vt : x[1] === "?" ? Gt : x[1] === "@" ? Wt : fe }), o.removeAttribute(p);
        } else p.startsWith(F) && (l.push({ type: 6, index: i }), o.removeAttribute(p));
        if (Ke.test(o.tagName)) {
          const p = o.textContent.split(F), m = p.length - 1;
          if (m > 0) {
            o.textContent = ce ? ce.emptyScript : "";
            for (let b = 0; b < m; b++) o.append(p[b], re()), I.nextNode(), l.push({ type: 2, index: ++i });
            o.append(p[m], re());
          }
        }
      } else if (o.nodeType === 8) if (o.data === We) l.push({ type: 2, index: i });
      else {
        let p = -1;
        for (; (p = o.data.indexOf(F, p + 1)) !== -1; ) l.push({ type: 7, index: i }), p += F.length - 1;
      }
      i++;
    }
  }
  static createElement(e, r) {
    const a = U.createElement("template");
    return a.innerHTML = e, a;
  }
}
function W(t, e, r = t, a) {
  if (e === G) return e;
  let o = a !== void 0 ? r._$Co?.[a] : r._$Cl;
  const i = oe(e) ? void 0 : e._$litDirective$;
  return o?.constructor !== i && (o?._$AO?.(!1), i === void 0 ? o = void 0 : (o = new i(t), o._$AT(t, r, a)), a !== void 0 ? (r._$Co ?? (r._$Co = []))[a] = o : r._$Cl = o), o !== void 0 && (e = W(t, o._$AS(t, e.values), o, a)), e;
}
class jt {
  constructor(e, r) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = r;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: r }, parts: a } = this._$AD, o = (e?.creationScope ?? U).importNode(r, !0);
    I.currentNode = o;
    let i = I.nextNode(), n = 0, c = 0, l = a[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let d;
        l.type === 2 ? d = new ie(i, i.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(i, l.name, l.strings, this, e) : l.type === 6 && (d = new Kt(i, this, e)), this._$AV.push(d), l = a[++c];
      }
      n !== l?.index && (i = I.nextNode(), n++);
    }
    return I.currentNode = U, o;
  }
  p(e) {
    let r = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, r), r += a.strings.length - 2) : a._$AI(e[r])), r++;
  }
}
class ie {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, r, a, o) {
    this.type = 2, this._$AH = y, this._$AN = void 0, this._$AA = e, this._$AB = r, this._$AM = a, this.options = o, this._$Cv = o?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const r = this._$AM;
    return r !== void 0 && e?.nodeType === 11 && (e = r.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, r = this) {
    e = W(this, e, r), oe(e) ? e === y || e == null || e === "" ? (this._$AH !== y && this._$AR(), this._$AH = y) : e !== this._$AH && e !== G && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : It(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== y && oe(this._$AH) ? this._$AA.nextSibling.data = e : this.T(U.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: r, _$litType$: a } = e, o = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = ae.createElement(Ze(a.h, a.h[0]), this.options)), a);
    if (this._$AH?._$AD === o) this._$AH.p(r);
    else {
      const i = new jt(o, this), n = i.u(this.options);
      i.p(r), this.T(n), this._$AH = i;
    }
  }
  _$AC(e) {
    let r = Ue.get(e.strings);
    return r === void 0 && Ue.set(e.strings, r = new ae(e)), r;
  }
  k(e) {
    Ae(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let a, o = 0;
    for (const i of e) o === r.length ? r.push(a = new ie(this.O(re()), this.O(re()), this, this.options)) : a = r[o], a._$AI(i), o++;
    o < r.length && (this._$AR(a && a._$AB.nextSibling, o), r.length = o);
  }
  _$AR(e = this._$AA.nextSibling, r) {
    for (this._$AP?.(!1, !0, r); e !== this._$AB; ) {
      const a = He(e).nextSibling;
      He(e).remove(), e = a;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class fe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, r, a, o, i) {
    this.type = 1, this._$AH = y, this._$AN = void 0, this.element = e, this.name = r, this._$AM = o, this.options = i, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = y;
  }
  _$AI(e, r = this, a, o) {
    const i = this.strings;
    let n = !1;
    if (i === void 0) e = W(this, e, r, 0), n = !oe(e) || e !== this._$AH && e !== G, n && (this._$AH = e);
    else {
      const c = e;
      let l, d;
      for (e = i[0], l = 0; l < i.length - 1; l++) d = W(this, c[a + l], r, l), d === G && (d = this._$AH[l]), n || (n = !oe(d) || d !== this._$AH[l]), d === y ? e = y : e !== y && (e += (d ?? "") + i[l + 1]), this._$AH[l] = d;
    }
    n && !o && this.j(e);
  }
  j(e) {
    e === y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Vt extends fe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === y ? void 0 : e;
  }
}
class Gt extends fe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== y);
  }
}
class Wt extends fe {
  constructor(e, r, a, o, i) {
    super(e, r, a, o, i), this.type = 5;
  }
  _$AI(e, r = this) {
    if ((e = W(this, e, r, 0) ?? y) === G) return;
    const a = this._$AH, o = e === y && a !== y || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, i = e !== y && (a === y || o);
    o && this.element.removeEventListener(this.name, this, a), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Kt {
  constructor(e, r, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    W(this, e);
  }
}
const Zt = X.litHtmlPolyfillSupport;
Zt?.(ae, ie), (X.litHtmlVersions ?? (X.litHtmlVersions = [])).push("3.3.3");
const qt = (t, e, r) => {
  const a = r?.renderBefore ?? e;
  let o = a._$litPart$;
  if (o === void 0) {
    const i = r?.renderBefore ?? null;
    a._$litPart$ = o = new ie(e.insertBefore(re(), i), i, void 0, r ?? {});
  }
  return o._$AI(t), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis;
class v extends V {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var r;
    const e = super.createRenderRoot();
    return (r = this.renderOptions).renderBefore ?? (r.renderBefore = e.firstChild), e;
  }
  update(e) {
    const r = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = qt(r, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return G;
  }
}
v._$litElement$ = !0, v.finalized = !0, Q.litElementHydrateSupport?.({ LitElement: v });
const Jt = Q.litElementPolyfillSupport;
Jt?.({ LitElement: v });
(Q.litElementVersions ?? (Q.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = (t) => (e, r) => {
  r !== void 0 ? r.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Yt = { attribute: !0, type: String, converter: le, reflect: !1, hasChanged: ze }, Xt = (t = Yt, e, r) => {
  const { kind: a, metadata: o } = r;
  let i = globalThis.litPropertyMetadata.get(o);
  if (i === void 0 && globalThis.litPropertyMetadata.set(o, i = /* @__PURE__ */ new Map()), a === "setter" && ((t = Object.create(t)).wrapped = !0), i.set(r.name, t), a === "accessor") {
    const { name: n } = r;
    return { set(c) {
      const l = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(n, l, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, t, c), c;
    } };
  }
  if (a === "setter") {
    const { name: n } = r;
    return function(c) {
      const l = this[n];
      e.call(this, c), this.requestUpdate(n, l, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function g(t) {
  return (e, r) => typeof r == "object" ? Xt(t, e, r) : ((a, o, i) => {
    const n = o.hasOwnProperty(i);
    return o.constructor.createProperty(i, a), n ? Object.getOwnPropertyDescriptor(o, i) : void 0;
  })(t, e, r);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function h(t) {
  return g({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = (t, e, r) => (r.configurable = !0, r.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, r), r);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function er(t, e) {
  return (r, a, o) => {
    const i = (n) => n.renderRoot?.querySelector(t) ?? null;
    return Qt(r, a, { get() {
      return i(this);
    } });
  };
}
const qe = "bubble-card", Je = "Bubble Card", Ye = "0.1.0", Xe = ">=2.0.0", Qe = {
  method: "hacs-repo",
  value: "Clooos/Bubble-Card"
}, et = "CSS-Variablen für Bubble Card (Clooos/Bubble-Card). 100+ Variablen über Global, Pop-Up, Button, Climate, Media-Player, Select, Slider und weitere Card-Types. Plugin wird nur geladen wenn HACS Clooos/Bubble-Card als installiert meldet.", tr = {
  id: qe,
  name: Je,
  version: Ye,
  version_supported: Xe,
  detect: Qe,
  description: et
}, rr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: tr,
  description: et,
  detect: Qe,
  id: qe,
  name: Je,
  version: Ye,
  version_supported: Xe
}, Symbol.toStringTag, { value: "Module" })), tt = "ha-core", rt = "Home Assistant Core", ot = "0.1.0", at = ">=2024.1.0", it = {
  method: "always"
}, nt = "Grundlegende CSS-Variablen des HA-Frontends. Immer aktiv, keine Erkennung nötig.", or = {
  id: tt,
  name: rt,
  version: ot,
  version_supported: at,
  detect: it,
  description: nt
}, ar = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: or,
  description: nt,
  detect: it,
  id: tt,
  name: rt,
  version: ot,
  version_supported: at
}, Symbol.toStringTag, { value: "Module" })), st = "mushroom", lt = "Mushroom", ct = "0.1.0", dt = ">=3.0.0", ut = {
  method: "hacs-repo",
  value: "piitaya/lovelace-mushroom"
}, pt = "CSS-Variablen für Mushroom Cards (piitaya/lovelace-mushroom). Typografie (Title/Subtitle/Card-Primary/Card-Secondary), Icons, Chips, Controls, Material-RGB-Palette und State-spezifische RGB-Farben für Climate/Cover/Lock/Person/etc. Plugin wird nur geladen wenn HACS piitaya/lovelace-mushroom als installiert meldet.", ir = {
  id: st,
  name: lt,
  version: ct,
  version_supported: dt,
  detect: ut,
  description: pt
}, nr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ir,
  description: pt,
  detect: ut,
  id: st,
  name: lt,
  version: ct,
  version_supported: dt
}, Symbol.toStringTag, { value: "Module" })), mt = "bubble-card", ht = [
  {
    id: "global",
    label: "Global",
    icon: "mdi:palette-outline"
  },
  {
    id: "card-type-defaults",
    label: "Card-Type-Defaults",
    icon: "mdi:card-multiple-outline"
  },
  {
    id: "button",
    label: "Button-Card",
    icon: "mdi:gesture-tap-button"
  },
  {
    id: "sub-button",
    label: "Sub-Buttons",
    icon: "mdi:cursor-default-click"
  },
  {
    id: "pop-up",
    label: "Pop-Up-Card",
    icon: "mdi:dock-window"
  },
  {
    id: "horizontal-buttons-stack",
    label: "Horizontal Buttons Stack",
    icon: "mdi:view-carousel"
  },
  {
    id: "cover",
    label: "Cover-Card",
    icon: "mdi:blinds"
  },
  {
    id: "climate",
    label: "Climate-Card",
    icon: "mdi:thermostat"
  },
  {
    id: "calendar",
    label: "Calendar-Card",
    icon: "mdi:calendar"
  },
  {
    id: "event",
    label: "Event-Card",
    icon: "mdi:calendar-clock"
  },
  {
    id: "footer",
    label: "Footer",
    icon: "mdi:page-layout-footer"
  },
  {
    id: "media-player",
    label: "Media-Player-Card",
    icon: "mdi:music"
  },
  {
    id: "select",
    label: "Select-Card",
    icon: "mdi:form-dropdown"
  },
  {
    id: "slider",
    label: "Slider / Sub-Slider",
    icon: "mdi:tune-variant"
  },
  {
    id: "color-cursor",
    label: "Color-Cursor",
    icon: "mdi:eyedropper-variant"
  }
], bt = [
  {
    name: "--bubble-accent-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Akzent-Farbe für Highlights und aktive Indikatoren."
  },
  {
    name: "--bubble-backdrop-background-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Hintergrund-Farbe für Backdrops (z.B. hinter Pop-Ups)."
  },
  {
    name: "--bubble-backdrop-filter",
    type: "raw",
    category: "global",
    default: "blur(10px)",
    description: "Bubble Card · Global · CSS-`backdrop-filter` für Bubble-Card-Elemente. Mit `blur(...)` für Glas-Optik."
  },
  {
    name: "--bubble-border",
    type: "raw",
    category: "global",
    description: "Bubble Card · Global · Generischer CSS-`border`-Wert (z.B. `1px solid rgba(0,0,0,0.1)`). Setze `none` zum Deaktivieren."
  },
  {
    name: "--bubble-border-radius",
    type: "length",
    category: "global",
    default: "16px",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Global · Ecken-Rundung der Bubble-Card-Container."
  },
  {
    name: "--bubble-box-shadow",
    type: "shadow",
    category: "global",
    description: "Bubble Card · Global · Schatten unter Bubble Cards. Setze `none` für flaches Design."
  },
  {
    name: "--bubble-default-backdrop-background-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Default-Backdrop-Farbe (Fallback wenn spezifischere Variable fehlt)."
  },
  {
    name: "--bubble-default-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Default-Vorder-Farbe (Fallback)."
  },
  {
    name: "--bubble-icon-background-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Hintergrund-Farbe von Icons in Bubble Cards (das runde Hintergrund-Element)."
  },
  {
    name: "--bubble-icon-border-radius",
    type: "length",
    category: "global",
    default: "50%",
    unit: [
      "px",
      "%"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Global · Ecken-Rundung von Icon-Hintergründen. 50% = Kreis."
  },
  {
    name: "--bubble-icon-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Standard-Icon-Farbe."
  },
  {
    name: "--bubble-light-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Akzent-Farbe für Light-Entities (oft warmes Gelb)."
  },
  {
    name: "--bubble-light-white-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Sekundäre Light-Farbe (Weisslicht)."
  },
  {
    name: "--bubble-line-background-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Farbe von Trennlinien innerhalb von Cards."
  },
  {
    name: "--bubble-list-item-accent-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Akzent-Farbe für ausgewählte Listen-Items."
  },
  {
    name: "--bubble-main-background-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Haupt-Hintergrund aller Bubble Cards. Wichtigste Farbe wenn du Bubble Cards thematisch anpassen willst."
  },
  {
    name: "--bubble-main-buttons-background-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Hintergrund der Haupt-Buttons (übergeordnet zu Button-Card-spezifischen Vars)."
  },
  {
    name: "--bubble-secondary-background-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Sekundärer Hintergrund (für innere Container)."
  },
  {
    name: "--bubble-separator-border",
    type: "raw",
    category: "global",
    description: "Bubble Card · Global · CSS-`border`-Wert für Separator-Linien zwischen Card-Sections."
  },
  {
    name: "--bubble-card-type-border",
    type: "raw",
    category: "card-type-defaults",
    description: "Bubble Card · Card-Defaults · Default-Border-Wert für alle Bubble-Card-Types."
  },
  {
    name: "--bubble-card-type-border-radius",
    type: "length",
    category: "card-type-defaults",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Card-Defaults · Default-Ecken-Rundung für alle Card-Types."
  },
  {
    name: "--bubble-card-type-box-shadow",
    type: "shadow",
    category: "card-type-defaults",
    description: "Bubble Card · Card-Defaults · Default-Schatten für alle Card-Types."
  },
  {
    name: "--bubble-card-type-icon-background-color",
    type: "color",
    category: "card-type-defaults",
    description: "Bubble Card · Card-Defaults · Default-Hintergrund für Icons (über alle Card-Types)."
  },
  {
    name: "--bubble-card-type-icon-border-radius",
    type: "length",
    category: "card-type-defaults",
    unit: [
      "px",
      "%"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Card-Defaults · Default-Ecken-Rundung für Icons."
  },
  {
    name: "--bubble-card-type-main-background-color",
    type: "color",
    category: "card-type-defaults",
    description: "Bubble Card · Card-Defaults · Default-Haupt-Hintergrund für alle Card-Types."
  },
  {
    name: "--bubble-button-accent-color",
    type: "color",
    category: "button",
    description: "Bubble Card · Button · Akzent-Farbe der Button-Card (z.B. Slider-Track wenn Light-Brightness-Mode)."
  },
  {
    name: "--bubble-button-active-icon-color",
    type: "color",
    category: "button",
    description: "Bubble Card · Button · Icon-Farbe wenn Button im Active-State (Entity an)."
  },
  {
    name: "--bubble-button-background-color",
    type: "color",
    category: "button",
    description: "Bubble Card · Button · Hintergrund-Farbe der Button-Card im Default-State."
  },
  {
    name: "--bubble-button-border-radius",
    type: "length",
    category: "button",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Button · Ecken-Rundung der Button-Card."
  },
  {
    name: "--bubble-button-icon-background-color",
    type: "color",
    category: "button",
    description: "Bubble Card · Button · Hintergrund des Icon-Containers im Button."
  },
  {
    name: "--bubble-button-icon-border-radius",
    type: "length",
    category: "button",
    unit: [
      "px",
      "%"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Button · Ecken-Rundung des Icon-Containers."
  },
  {
    name: "--bubble-button-main-background-color",
    type: "color",
    category: "button",
    description: "Bubble Card · Button · Haupt-Hintergrund (oft synonym zu background-color, aber separat überschreibbar)."
  },
  {
    name: "--bubble-sub-button-background-color",
    type: "color",
    category: "sub-button",
    description: "Bubble Card · Sub-Button · Hintergrund-Farbe der kleinen Sub-Buttons unter dem Haupt-Button."
  },
  {
    name: "--bubble-sub-button-border-radius",
    type: "length",
    category: "sub-button",
    unit: [
      "px",
      "%"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Sub-Button · Ecken-Rundung der Sub-Buttons."
  },
  {
    name: "--bubble-sub-button-dark-text-color",
    type: "color",
    category: "sub-button",
    description: "Bubble Card · Sub-Button · Textfarbe wenn Sub-Button im Light-State (heller Background braucht dunklen Text)."
  },
  {
    name: "--bubble-sub-button-group-justify-content",
    type: "raw",
    category: "sub-button",
    description: "Bubble Card · Sub-Button · CSS-`justify-content` für die Sub-Button-Gruppe (flex-start, center, space-between, …)."
  },
  {
    name: "--bubble-sub-button-height",
    type: "length",
    category: "sub-button",
    unit: [
      "px",
      "rem"
    ],
    min: 16,
    max: 80,
    description: "Bubble Card · Sub-Button · Höhe der Sub-Buttons."
  },
  {
    name: "--bubble-sub-button-justify-content",
    type: "raw",
    category: "sub-button",
    description: "Bubble Card · Sub-Button · CSS-`justify-content` für den einzelnen Sub-Button (Innen-Layout)."
  },
  {
    name: "--bubble-sub-button-light-background-color",
    type: "color",
    category: "sub-button",
    description: "Bubble Card · Sub-Button · Hintergrund-Farbe wenn Sub-Button im Light-State (z.B. wenn Light an)."
  },
  {
    name: "--bubble-pop-up-available-height",
    type: "length",
    category: "pop-up",
    unit: [
      "vh",
      "px"
    ],
    min: 50,
    max: 100,
    description: "Bubble Card · Pop-Up · Verfügbare Höhe des Pop-Ups (typisch in vh)."
  },
  {
    name: "--bubble-pop-up-background-color",
    type: "color",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Hintergrund-Farbe des Pop-Up-Containers."
  },
  {
    name: "--bubble-pop-up-border",
    type: "raw",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · CSS-`border`-Wert des Pop-Ups."
  },
  {
    name: "--bubble-pop-up-border-radius",
    type: "length",
    category: "pop-up",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Pop-Up · Ecken-Rundung des Pop-Up-Containers."
  },
  {
    name: "--bubble-pop-up-bottom-padding",
    type: "length",
    category: "pop-up",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 100,
    description: "Bubble Card · Pop-Up · Padding am unteren Rand des Pop-Ups."
  },
  {
    name: "--bubble-pop-up-close-button-border",
    type: "raw",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Border des Close-Buttons (X-Icon)."
  },
  {
    name: "--bubble-pop-up-content-border-radius",
    type: "length",
    category: "pop-up",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Pop-Up · Ecken-Rundung des Inhalt-Containers innerhalb des Pop-Ups."
  },
  {
    name: "--bubble-pop-up-extra-bottom-space",
    type: "length",
    category: "pop-up",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 200,
    description: "Bubble Card · Pop-Up · Zusätzlicher Platz am unteren Rand (für Mobile-Safe-Area etc.)."
  },
  {
    name: "--bubble-pop-up-fade-color",
    type: "color",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Farbe des Fade-/Overlay-Effekts am oberen/unteren Rand."
  },
  {
    name: "--bubble-pop-up-gap",
    type: "length",
    category: "pop-up",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Pop-Up · Abstand zwischen Pop-Up-Inhalts-Elementen."
  },
  {
    name: "--bubble-pop-up-header-gap",
    type: "length",
    category: "pop-up",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Pop-Up · Abstand vom Header zum Inhalt."
  },
  {
    name: "--bubble-pop-up-header-gap-reserve",
    type: "length",
    category: "pop-up",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Pop-Up · Reserve-Abstand für den Header (Layout-Buffer)."
  },
  {
    name: "--bubble-pop-up-header-overlap",
    type: "length",
    category: "pop-up",
    unit: [
      "px",
      "rem"
    ],
    min: -50,
    max: 50,
    description: "Bubble Card · Pop-Up · Überlappung des Headers (negativer Wert zieht ihn nach oben)."
  },
  {
    name: "--bubble-pop-up-main-background-color",
    type: "color",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Haupt-Hintergrund-Farbe (Override des Default-Pop-Up-Backgrounds)."
  },
  {
    name: "--bubble-pop-up-mask-bottom-alpha",
    type: "raw",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Alpha-Wert (0..1) des Mask-Fades am unteren Rand."
  },
  {
    name: "--bubble-pop-up-mask-bottom-stop",
    type: "raw",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Stop-Position (%) für den Mask-Fade unten."
  },
  {
    name: "--bubble-pop-up-mask-top-alpha",
    type: "raw",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Alpha-Wert (0..1) des Mask-Fades am oberen Rand."
  },
  {
    name: "--bubble-pop-up-mask-top-stop",
    type: "raw",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Stop-Position (%) für den Mask-Fade oben."
  },
  {
    name: "--bubble-pop-up-visible-bottom-padding",
    type: "length",
    category: "pop-up",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 200,
    description: "Bubble Card · Pop-Up · Sichtbares Padding am unteren Rand (im Gegensatz zu extra-bottom-space)."
  },
  {
    name: "--bubble-horizontal-buttons-stack-background-color",
    type: "color",
    category: "horizontal-buttons-stack",
    description: "Bubble Card · Horizontal Buttons Stack · Hintergrund-Farbe des Stack-Containers."
  },
  {
    name: "--bubble-horizontal-buttons-stack-border-radius",
    type: "length",
    category: "horizontal-buttons-stack",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Horizontal Buttons Stack · Ecken-Rundung des Containers."
  },
  {
    name: "--bubble-cover-button-background-color",
    type: "color",
    category: "cover",
    description: "Bubble Card · Cover · Hintergrund-Farbe der Cover-Steuer-Buttons (Auf/Stop/Ab)."
  },
  {
    name: "--bubble-cover-buttons-border-radius",
    type: "length",
    category: "cover",
    unit: [
      "px",
      "%"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Cover · Ecken-Rundung der Cover-Buttons."
  },
  {
    name: "--bubble-climate-accent-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · Generelle Akzent-Farbe der Climate-Card."
  },
  {
    name: "--bubble-climate-background-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · Hintergrund-Farbe der Climate-Card."
  },
  {
    name: "--bubble-climate-button-background-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · Hintergrund-Farbe der Mode-Buttons innerhalb der Climate-Card."
  },
  {
    name: "--bubble-state-climate-auto-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · State-Farbe für 'Auto'-Modus."
  },
  {
    name: "--bubble-state-climate-cool-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · State-Farbe für 'Cool'-Modus (typisch Blau)."
  },
  {
    name: "--bubble-state-climate-dry-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · State-Farbe für 'Dry'-Modus."
  },
  {
    name: "--bubble-state-climate-fan-only-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · State-Farbe für 'Fan-Only'-Modus."
  },
  {
    name: "--bubble-state-climate-heat-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · State-Farbe für 'Heat'-Modus (typisch Orange/Rot)."
  },
  {
    name: "--bubble-state-climate-heat-cool-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · State-Farbe für 'Heat-Cool'-Modus (Hybrid)."
  },
  {
    name: "--bubble-calendar-border-radius",
    type: "length",
    category: "calendar",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Calendar · Ecken-Rundung der Calendar-Card."
  },
  {
    name: "--bubble-calendar-height",
    type: "length",
    category: "calendar",
    unit: [
      "px",
      "vh",
      "rem"
    ],
    min: 100,
    max: 1e3,
    description: "Bubble Card · Calendar · Höhe der Calendar-Card."
  },
  {
    name: "--bubble-calendar-mask-size",
    type: "length",
    category: "calendar",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 100,
    description: "Bubble Card · Calendar · Größe des Fade-Mask-Effekts am Rand der Calendar-Card."
  },
  {
    name: "--bubble-event-accent-color",
    type: "color",
    category: "event",
    description: "Bubble Card · Event · Akzent-Farbe für Event-Card-Highlights."
  },
  {
    name: "--bubble-event-background-color",
    type: "color",
    category: "event",
    description: "Bubble Card · Event · Hintergrund-Farbe der Event-Card."
  },
  {
    name: "--bubble-event-background-image",
    type: "background",
    category: "event",
    description: "Bubble Card · Event · Hintergrund-Bild der Event-Card (CSS-`url(...)`)."
  },
  {
    name: "--bubble-footer-bottom",
    type: "length",
    category: "footer",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 200,
    description: "Bubble Card · Footer · Abstand des Footers vom unteren Rand."
  },
  {
    name: "--bubble-footer-box-shadow",
    type: "shadow",
    category: "footer",
    description: "Bubble Card · Footer · Schatten unter dem Footer-Container."
  },
  {
    name: "--bubble-footer-width",
    type: "length",
    category: "footer",
    unit: [
      "px",
      "rem",
      "%"
    ],
    min: 0,
    max: 1e3,
    description: "Bubble Card · Footer · Breite des Footers."
  },
  {
    name: "--bubble-media-player-border-radius",
    type: "length",
    category: "media-player",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Media-Player · Ecken-Rundung der Media-Player-Card."
  },
  {
    name: "--bubble-media-player-button-background-color",
    type: "color",
    category: "media-player",
    description: "Bubble Card · Media-Player · Hintergrund-Farbe der Steuer-Buttons (Play/Pause/Skip)."
  },
  {
    name: "--bubble-media-player-buttons-border-radius",
    type: "length",
    category: "media-player",
    unit: [
      "px",
      "%"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Media-Player · Ecken-Rundung der Steuer-Buttons."
  },
  {
    name: "--bubble-media-player-play-pause-icon-color",
    type: "color",
    category: "media-player",
    description: "Bubble Card · Media-Player · Icon-Farbe des Play-/Pause-Buttons."
  },
  {
    name: "--bubble-media-player-slider-background-color",
    type: "color",
    category: "media-player",
    description: "Bubble Card · Media-Player · Hintergrund-Farbe der Position-/Volume-Slider."
  },
  {
    name: "--bubble-select-arrow-background-color",
    type: "color",
    category: "select",
    description: "Bubble Card · Select · Hintergrund-Farbe des Dropdown-Pfeils."
  },
  {
    name: "--bubble-select-border",
    type: "raw",
    category: "select",
    description: "Bubble Card · Select · CSS-`border`-Wert des Select-Buttons."
  },
  {
    name: "--bubble-select-button-border-radius",
    type: "length",
    category: "select",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Select · Ecken-Rundung des Select-Buttons."
  },
  {
    name: "--bubble-select-list-background-color",
    type: "color",
    category: "select",
    description: "Bubble Card · Select · Hintergrund-Farbe der Dropdown-Liste."
  },
  {
    name: "--bubble-select-list-border-radius",
    type: "length",
    category: "select",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Select · Ecken-Rundung der Dropdown-Liste."
  },
  {
    name: "--bubble-select-list-item-accent-color",
    type: "color",
    category: "select",
    description: "Bubble Card · Select · Akzent-Farbe für den ausgewählten Listen-Eintrag."
  },
  {
    name: "--bubble-select-list-width",
    type: "length",
    category: "select",
    unit: [
      "px",
      "rem",
      "%"
    ],
    min: 100,
    max: 800,
    description: "Bubble Card · Select · Breite der Dropdown-Liste."
  },
  {
    name: "--bubble-select-main-background-color",
    type: "color",
    category: "select",
    description: "Bubble Card · Select · Haupt-Hintergrund der Select-Card."
  },
  {
    name: "--bubble-slider-fill-color",
    type: "color",
    category: "slider",
    description: "Bubble Card · Slider · Füll-Farbe des Slider-Tracks (linker Teil)."
  },
  {
    name: "--bubble-sub-slider-background-color",
    type: "color",
    category: "slider",
    description: "Bubble Card · Sub-Slider · Hintergrund-Farbe des Sub-Sliders."
  },
  {
    name: "--bubble-sub-slider-border-radius",
    type: "length",
    category: "slider",
    unit: [
      "px",
      "%"
    ],
    min: 0,
    max: 50,
    description: "Bubble Card · Sub-Slider · Ecken-Rundung des Sub-Sliders."
  },
  {
    name: "--bubble-sub-slider-height",
    type: "length",
    category: "slider",
    unit: [
      "px",
      "rem"
    ],
    min: 8,
    max: 80,
    description: "Bubble Card · Sub-Slider · Höhe des Sub-Sliders."
  },
  {
    name: "--bubble-sub-slider-left-offset",
    type: "length",
    category: "slider",
    unit: [
      "px",
      "rem"
    ],
    min: -50,
    max: 100,
    description: "Bubble Card · Sub-Slider · Linker Offset des Sub-Sliders."
  },
  {
    name: "--bubble-sub-slider-width",
    type: "length",
    category: "slider",
    unit: [
      "px",
      "rem",
      "%"
    ],
    min: 0,
    max: 500,
    description: "Bubble Card · Sub-Slider · Breite des Sub-Sliders."
  },
  {
    name: "--bubble-color-cursor-background",
    type: "color",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Hintergrund des Color-Cursor-Bereichs."
  },
  {
    name: "--bubble-color-cursor-indicator-color",
    type: "color",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Farbe des Indikator-Rings/-Dots."
  },
  {
    name: "--bubble-color-cursor-indicator-active-bottom",
    type: "raw",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Position des aktiven Indikators (unten, % oder px)."
  },
  {
    name: "--bubble-color-cursor-indicator-active-opacity",
    type: "raw",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Opacity (0..1) des aktiven Indikators."
  },
  {
    name: "--bubble-color-cursor-indicator-active-top",
    type: "raw",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Position des aktiven Indikators (oben, % oder px)."
  },
  {
    name: "--bubble-color-cursor-indicator-bottom",
    type: "raw",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Default-Position des Indikators (unten)."
  },
  {
    name: "--bubble-color-cursor-indicator-opacity",
    type: "raw",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Default-Opacity (0..1) des Indikators."
  },
  {
    name: "--bubble-color-cursor-indicator-top",
    type: "raw",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Default-Position des Indikators (oben)."
  }
], sr = {
  id: mt,
  categories: ht,
  variables: bt
}, lr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  categories: ht,
  default: sr,
  id: mt,
  variables: bt
}, Symbol.toStringTag, { value: "Module" })), gt = "ha-core", ft = [
  {
    id: "branding",
    label: "Marke",
    icon: "mdi:palette-outline"
  },
  {
    id: "background",
    label: "Hintergrund",
    icon: "mdi:format-color-fill"
  },
  {
    id: "text",
    label: "Text",
    icon: "mdi:format-color-text"
  },
  {
    id: "state",
    label: "Zustände (semantisch)",
    icon: "mdi:lightbulb-on-outline"
  },
  {
    id: "state-colors",
    label: "State-Farben (Material)",
    icon: "mdi:palette-swatch"
  },
  {
    id: "card",
    label: "Cards",
    icon: "mdi:card-outline"
  },
  {
    id: "sidebar",
    label: "Sidebar",
    icon: "mdi:dock-left"
  },
  {
    id: "header",
    label: "App-Header",
    icon: "mdi:page-layout-header"
  },
  {
    id: "controls",
    label: "Bedienelemente",
    icon: "mdi:tune"
  },
  {
    id: "switches",
    label: "Switches",
    icon: "mdi:toggle-switch"
  },
  {
    id: "tables",
    label: "Tabellen",
    icon: "mdi:table"
  },
  {
    id: "form-inputs",
    label: "Form-Inputs",
    icon: "mdi:form-textbox"
  },
  {
    id: "dialogs",
    label: "Dialoge / Modals",
    icon: "mdi:application-outline"
  },
  {
    id: "label-badge",
    label: "Label-Badges",
    icon: "mdi:tag-outline"
  },
  {
    id: "polymer-legacy",
    label: "Polymer/Paper (legacy)",
    icon: "mdi:history"
  },
  {
    id: "mdc",
    label: "Material Design Components",
    icon: "mdi:material-design"
  },
  {
    id: "rgb",
    label: "RGB-Trippel",
    icon: "mdi:format-list-numbered"
  }
], yt = [
  {
    name: "--primary-color",
    type: "color",
    category: "branding",
    default: "#03a9f4",
    description: "Hauptfarbe der HA-UI. Wirkt auf: App-Header-Hintergrund (Default), aktive Icons in Cards, Links, ausgewählte Sidebar-Einträge, Switches und Slider im 'On'-Zustand. Wird von vielen anderen Variablen via var() referenziert — Änderung hier kaskadiert auf eine Menge UI-Elemente."
  },
  {
    name: "--accent-color",
    type: "color",
    category: "branding",
    default: "#ff9800",
    description: "Sekundäre Akzentfarbe für Highlights und FAB-Buttons (der runde '+'-Button rechts unten in der View-Edit-Ansicht). Weniger sichtbar als --primary-color, oft als Komplementärfarbe gewählt."
  },
  {
    name: "--dark-primary-color",
    type: "color",
    category: "branding",
    default: "#0288d1",
    description: "Dunklere Variation der Hauptfarbe. Wirkt auf: Status-Bar in mobilen Apps, manche dunklere Header-Akzente. Setzt sich nur durch wenn explizit referenziert — viele Themes lassen die Variable ungenutzt."
  },
  {
    name: "--light-primary-color",
    type: "color",
    category: "branding",
    default: "#b3e5fc",
    description: "Hellere Variation der Hauptfarbe. Wirkt auf: Hover-States in einigen Listen-Komponenten, leichte Background-Akzente. Wie --dark-primary-color seltener direkt sichtbar."
  },
  {
    name: "--primary-background-color",
    type: "color",
    category: "background",
    default: "#fafafa",
    description: "Haupt-Seitenhintergrund — alles ausserhalb von Cards. Wirkt auf: Body, leere Lovelace-Bereiche, Sidebar-Default (ausser --sidebar-background-color ist explizit gesetzt)."
  },
  {
    name: "--secondary-background-color",
    type: "color",
    category: "background",
    default: "#e5e5e5",
    description: "Sekundärer Hintergrund — sichtbar zwischen Cards in Grid-Layouts oder als Dialog-Background. Etwas dunkler/heller als der Primary für visuelle Trennung."
  },
  {
    name: "--card-background-color",
    type: "color",
    category: "background",
    default: "#ffffff",
    description: "Default-Hintergrund für ha-card-Elemente. Wird von --ha-card-background überschrieben, wenn das spezifisch gesetzt ist. Tipp: in Light-Themes meist weiss, in Dark-Themes ein dunkles Grau."
  },
  {
    name: "--background-image",
    type: "background",
    category: "background",
    default: "none",
    description: "Hintergrund-Bild des HA-Frontends. CSS-`background`-Shorthand: typisch `center / cover no-repeat fixed url('https://...')` für eine fixierte Vollbild-Tapete. Häufig in Glas-/Vision-Themes, um ein Bild hinter die semi-transparenten Cards zu legen. Setze `none` für keinen Bild-Hintergrund."
  },
  {
    name: "--lovelace-background",
    type: "background",
    category: "background",
    default: "var(--primary-background-color)",
    description: "Hintergrund des Lovelace-View-Containers (alles unter App-Header). Oft auf `var(--background-image)` gesetzt, um ein Bild als Tapete zu nutzen. Wert kann eine Farbe ODER ein `url(...)`/Gradient sein."
  },
  {
    name: "--primary-text-color",
    type: "color",
    category: "text",
    default: "#212121",
    description: "Standard-Textfarbe für alle Card-Inhalte, Titel, Buttons, Werte. Wirkt praktisch überall im HA-Frontend, ausser eine speziellere Variable überschreibt für einen bestimmten Bereich."
  },
  {
    name: "--secondary-text-color",
    type: "color",
    category: "text",
    default: "#727272",
    description: "Textfarbe für weniger wichtige Information: Labels neben Werten, Timestamps, Sub-Titel, Hinweis-Texte. Sollte schwächer aber lesbar gegenüber --primary-text-color sein."
  },
  {
    name: "--disabled-text-color",
    type: "color",
    category: "text",
    default: "#bdbdbd",
    description: "Text-Farbe für deaktivierte UI-Elemente — ausgegraute Buttons, Switches im Disabled-State, nicht-klickbare Menü-Einträge. Sollte sich deutlich von --primary-text-color absetzen."
  },
  {
    name: "--ha-color-text-secondary",
    type: "color",
    category: "text",
    default: "var(--secondary-text-color)",
    description: "Modernes HA-Design-Token für sekundäre Textfarbe. Identisch zu --secondary-text-color, neuerer Name aus HAs internem Color-Token-System."
  },
  {
    name: "--state-icon-color",
    type: "color",
    category: "state",
    default: "#44739e",
    description: "Standard-Icon-Farbe für *inaktive* Entities: Lichter aus, Schalter off, Sensoren bei Default-Wert. Wirkt auf alle Entity-Icons in Cards und Listen, sofern kein State-spezifischer Override greift."
  },
  {
    name: "--state-icon-active-color",
    type: "color",
    category: "state",
    default: "#fdd835",
    description: "Icon-Farbe wenn Entity *aktiv* ist: Licht an, Schalter on, Heizung läuft, Pumpe aktiv. Standardmässig Amber/Gelb für 'leuchtet'-Optik. Eine der meistgesehenen Variablen im HA-Frontend."
  },
  {
    name: "--state-icon-unavailable-color",
    type: "color",
    category: "state",
    default: "var(--disabled-text-color)",
    description: "Icon-Farbe für Entities im 'Unavailable'-State (Offline, Kommunikationsfehler, kein Wert verfügbar). Default referenziert --disabled-text-color für gedämpfte Optik."
  },
  {
    name: "--state-inactive-color",
    type: "color",
    category: "state",
    default: "var(--disabled-text-color)",
    description: "Allgemeine Farbe für inaktive States — oft synonym zu --state-icon-color, aber breiter angewendet (z.B. von Custom Cards für 'Aus'-Texte). Default referenziert --disabled-text-color."
  },
  {
    name: "--error-color",
    type: "color",
    category: "state",
    default: "#db4437",
    description: "Farbe für Fehler, kritische Alarme. Wirkt auf: Error-Notifications oben, kritische Sensoren-Badges, ungültige Eingaben in Forms, Repair-Issues mit hoher Severity."
  },
  {
    name: "--warning-color",
    type: "color",
    category: "state",
    default: "#ffa600",
    description: "Farbe für Warnungen, nicht-kritische Hinweise. Wirkt auf: Warning-Notifications, Repair-Hinweise mit niedrigerer Severity, Update-Available-Badges."
  },
  {
    name: "--info-color",
    type: "color",
    category: "state",
    default: "#039be5",
    description: "Farbe für informative Hinweise und neutrale Benachrichtigungen. Wirkt auf: Info-Notifications, Hinweis-Banner, manche neutrale State-Badges."
  },
  {
    name: "--success-color",
    type: "color",
    category: "state",
    default: "#43a047",
    description: "Farbe für Erfolgs-Bestätigungen, OK-States. Wirkt auf: 'Saved'-Notifications, OK-Buttons, manche positive State-Badges."
  },
  {
    name: "--red-color",
    type: "color",
    category: "state-colors",
    default: "#f44336",
    description: "Material-Palette Rot. Häufig genutzt für state-spezifische Farben (z.B. Climate-Cool-Heat, Sensor-Werte oberhalb Schwellwert) und in Templates via `color: var(--red-color)`."
  },
  {
    name: "--orange-color",
    type: "color",
    category: "state-colors",
    default: "#ff9800",
    description: "Material-Palette Orange. Nützlich für Status-Badges, Aufmerksamkeit-Highlights, oder als Akzent in Custom-Lovelace-Templates."
  },
  {
    name: "--yellow-color",
    type: "color",
    category: "state-colors",
    default: "#ffeb3b",
    description: "Material-Palette Gelb. Oft für Warning-Light-States, Sonne-Icons, oder leuchtende Akzente in custom-Stylings."
  },
  {
    name: "--green-color",
    type: "color",
    category: "state-colors",
    default: "#4caf50",
    description: "Material-Palette Grün. Standard für 'OK'/'Aktiv'/'Verbunden'-States, Solar-Production-Indikatoren, positive Sensor-Werte."
  },
  {
    name: "--cyan-color",
    type: "color",
    category: "state-colors",
    default: "#00bcd4",
    description: "Material-Palette Cyan. Häufig für Wasser-/Kühlung-/Climate-Cool-Indikatoren."
  },
  {
    name: "--blue-color",
    type: "color",
    category: "state-colors",
    default: "#2196f3",
    description: "Material-Palette Blau. Standard-Color in vielen HA-Defaults, oft als neutraler 'Active'-Indikator."
  },
  {
    name: "--light-blue-color",
    type: "color",
    category: "state-colors",
    default: "#03a9f4",
    description: "Material-Palette Hellblau. Identisch mit dem Default-Wert von --primary-color (#03a9f4) — oft als sekundärer Akzent oder für 'Cool'-States verwendet."
  },
  {
    name: "--purple-color",
    type: "color",
    category: "state-colors",
    default: "#9c27b0",
    description: "Material-Palette Violett. Eher selten verwendet — gelegentlich für 'Premium'-Akzente oder besondere Sensor-Kategorien."
  },
  {
    name: "--pink-color",
    type: "color",
    category: "state-colors",
    default: "#e91e63",
    description: "Material-Palette Pink. Eher selten — gelegentlich für Akzente in Kinder-/Spass-Dashboards."
  },
  {
    name: "--indigo-color",
    type: "color",
    category: "state-colors",
    default: "#3f51b5",
    description: "Material-Palette Indigo. Mittel-tiefes Blau, oft für 'Processing'-States oder als zweite Brand-Variante."
  },
  {
    name: "--teal-color",
    type: "color",
    category: "state-colors",
    default: "#009688",
    description: "Material-Palette Teal. Beliebt für Frische-/Garten-/Wasser-Indikatoren und als bevorzugte Akzent-Alternative zu Cyan."
  },
  {
    name: "--brown-color",
    type: "color",
    category: "state-colors",
    default: "#795548",
    description: "Material-Palette Braun. Selten verwendet — gelegentlich für Erdung/Holz-Themen oder Sensor-States."
  },
  {
    name: "--grey-color",
    type: "color",
    category: "state-colors",
    default: "#9e9e9e",
    description: "Material-Palette Grau. Standard für neutrale/inaktive Akzente, ungültige States, Placeholder."
  },
  {
    name: "--amber-color",
    type: "color",
    category: "state-colors",
    default: "#ffc107",
    description: "Material-Palette Amber. Klassische 'Aktiv-Licht'-Farbe (siehe --state-icon-active-color), oft für warme Lichter und Aufmerksamkeits-States."
  },
  {
    name: "--ha-card-background",
    type: "color",
    category: "card",
    default: "var(--card-background-color)",
    description: "Hintergrund speziell für ha-card-Elemente (also fast alle Karten im HA-Frontend). Überschreibt --card-background-color spezifisch für Cards. Default referenziert --card-background-color — wird also vererbt, wenn nicht explizit gesetzt."
  },
  {
    name: "--ha-card-border-radius",
    type: "length",
    category: "card",
    default: "12px",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 40,
    description: "Ecken-Rundung aller ha-card-Elemente (Lovelace, Bubble Card, Mushroom etc., sofern sie ha-card als Basis nutzen). 0 = scharfe Ecken, 12px = HA-Default (Material), 24px+ = sehr rund / Pill-Style."
  },
  {
    name: "--ha-card-features-border-radius",
    type: "length",
    category: "card",
    default: "var(--ha-card-border-radius)",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 40,
    description: "Ecken-Rundung der Card-Features (z.B. die Action-Buttons unter Light-/Cover-/Climate-Cards). Default referenziert --ha-card-border-radius — also folgt automatisch wenn nicht separat gesetzt."
  },
  {
    name: "--ha-card-border-width",
    type: "length",
    category: "card",
    default: "0px",
    unit: [
      "px"
    ],
    min: 0,
    max: 10,
    description: "Border-Breite der Cards. Default 0px = unsichtbarer Border, Schatten übernimmt die optische Trennung. Bei > 0 wird --ha-card-border-color verwendet."
  },
  {
    name: "--ha-card-border-color",
    type: "color",
    category: "card",
    default: "var(--divider-color)",
    description: "Border-Farbe der Cards. Nur sichtbar wenn --ha-card-border-width > 0 ist. Default referenziert --divider-color für stimmige Trennlinien."
  },
  {
    name: "--ha-card-box-shadow",
    type: "shadow",
    category: "card",
    default: "0 2px 4px rgba(0, 0, 0, 0.12)",
    description: "Schatten unter Cards. Default ist ein dezenter Drop-Shadow für Material-Design-Optik. Setze 'none' für ein komplett flaches Design (z.B. iOS-Stil)."
  },
  {
    name: "--ha-card-backdrop-filter",
    type: "raw",
    category: "card",
    default: "none",
    description: "CSS-`backdrop-filter` für Cards — wirkt auf den Bereich *hinter* der Card (nicht auf die Card selbst). Mit `blur(10px)` und einem semi-transparenten --ha-card-background bekommen Cards einen Glas-/Frosted-Effekt (typisch für visionOS-/iOS-Themes). Setze `none` zum Deaktivieren."
  },
  {
    name: "--clear-background-color",
    type: "color",
    category: "card",
    default: "transparent",
    description: "Vollständig transparenter Hintergrund für Card-Bereiche, die durch die Card-Hintergrund-Farbe durchscheinen sollen. Wert ist meist `transparent` oder ein rgba mit Alpha=0."
  },
  {
    name: "--sidebar-background-color",
    type: "color",
    category: "sidebar",
    default: "var(--primary-background-color)",
    description: "Hintergrund der linken Sidebar (Navigation). Default referenziert --primary-background-color — explizit setzen, wenn Sidebar sich vom Haupt-Background absetzen soll."
  },
  {
    name: "--sidebar-text-color",
    type: "color",
    category: "sidebar",
    default: "var(--primary-text-color)",
    description: "Default-Textfarbe der Sidebar-Einträge (für die **nicht** ausgewählten Views). Default referenziert --primary-text-color."
  },
  {
    name: "--sidebar-icon-color",
    type: "color",
    category: "sidebar",
    default: "var(--state-icon-color)",
    description: "Icon-Farbe der Sidebar-Einträge (nicht-ausgewählte Views). Default referenziert --state-icon-color, deshalb folgen Sidebar-Icons standardmässig der State-Icon-Farbe."
  },
  {
    name: "--sidebar-selected-background-color",
    type: "color",
    category: "sidebar",
    default: "#ffffff",
    description: "Hintergrund des aktuell ausgewählten Sidebar-Eintrags (die View die du gerade ansiehst). Default Weiss — für dunkle Themes oft auf einen Akzent setzen, sonst verschwindet die Selektion."
  },
  {
    name: "--sidebar-selected-text-color",
    type: "color",
    category: "sidebar",
    default: "var(--primary-color)",
    description: "Textfarbe des aktiven Sidebar-Eintrags. Default referenziert --primary-color für visuelle Konsistenz mit dem Branding."
  },
  {
    name: "--sidebar-selected-icon-color",
    type: "color",
    category: "sidebar",
    default: "var(--primary-color)",
    description: "Icon-Farbe des aktiven Sidebar-Eintrags. Default referenziert --primary-color — der ausgewählte View-Eintrag bekommt damit eine ganzheitlich gefärbte Optik (Icon + Text in Brandfarbe)."
  },
  {
    name: "--app-header-background-color",
    type: "color",
    category: "header",
    default: "var(--primary-color)",
    description: "Hintergrund der App-Header-Leiste oben (mit View-Tabs und Titel). Default referenziert --primary-color — deshalb ändert sich der Header automatisch beim Anpassen der Hauptfarbe, ausser du setzt diese Variable explizit auf etwas anderes."
  },
  {
    name: "--app-header-text-color",
    type: "color",
    category: "header",
    default: "#ffffff",
    description: "Textfarbe in der App-Header-Leiste (View-Tabs, Titel, Menü-Icons). Default Weiss für maximalen Kontrast auf farbigem Header."
  },
  {
    name: "--app-header-backdrop-filter",
    type: "raw",
    category: "header",
    default: "none",
    description: "CSS-`backdrop-filter` für den App-Header. Mit `blur(10px)` bekommt der Header eine Glas-Optik, sodass das --background-image dezent durchschimmert (typisch für visionOS-/iOS-Themes)."
  },
  {
    name: "--app-header-edit-background-color",
    type: "color",
    category: "header",
    default: "rgba(0, 0, 0, 0.2)",
    description: "Header-Hintergrund während die View im Edit-Mode ist (Lovelace-UI-Editor offen). Default leicht dunkler/transparenter für visuelle Differenzierung zum normalen Modus."
  },
  {
    name: "--app-theme-color",
    type: "color",
    category: "header",
    default: "var(--primary-color)",
    description: "Wird als `meta theme-color` an Browser/Mobile-Apps weitergegeben — bestimmt die Farbe der System-Status-Bar (z.B. iOS-Notch-Bereich, Android-Top-Bar in PWA). Sollte zur Brand-/Header-Farbe passen."
  },
  {
    name: "--divider-color",
    type: "color",
    category: "controls",
    default: "rgba(0, 0, 0, 0.12)",
    description: "Trennlinien zwischen Listen-Items, Card-Sections, Tabs, Form-Feldern. Wirkt auf viele subtile Linien im HA-Frontend. Default leichtes Schwarz mit 12% Alpha — passt sich automatisch an Light/Dark an."
  },
  {
    name: "--paper-slider-active-color",
    type: "color",
    category: "controls",
    default: "var(--primary-color)",
    description: "Slider-Track-Farbe für den *gefüllten* Teil (links vom Knopf). Wirkt auf: Light-Brightness-Slider, Volume-Slider, alle Range-Slider in HA. Default referenziert --primary-color."
  },
  {
    name: "--paper-slider-knob-color",
    type: "color",
    category: "controls",
    default: "var(--primary-color)",
    description: "Farbe des Slider-Knopfs (Thumb). Default referenziert --primary-color für visuelle Konsistenz mit der aktiven Track-Farbe."
  },
  {
    name: "--ha-slider-background",
    type: "raw",
    category: "controls",
    default: "var(--secondary-background-color)",
    description: "Hintergrund der neuen ha-slider-Komponente (modern, replaces paper-slider). Mit `none !important` lässt sich der Slider-Hintergrund komplett ausblenden — für Custom-Looks. Wert kann Farbe ODER `none` sein."
  },
  {
    name: "--switch-checked-color",
    type: "color",
    category: "switches",
    default: "var(--primary-color)",
    description: "Generische Farbe eingeschalteter Switches (modern HA). Wird oft von den spezifischeren --switch-checked-button-color und --switch-checked-track-color überschrieben."
  },
  {
    name: "--switch-unchecked-color",
    type: "color",
    category: "switches",
    default: "#bdbdbd",
    description: "Generische Farbe ausgeschalteter Switches (modern HA). Wird oft von den spezifischeren --switch-unchecked-button-color und --switch-unchecked-track-color überschrieben."
  },
  {
    name: "--switch-checked-button-color",
    type: "color",
    category: "switches",
    default: "var(--switch-checked-color, var(--primary-color))",
    description: "Farbe des Switch-Knopfs (Thumb) im 'On'-Zustand. Spezifischer als --switch-checked-color — überschreibt den Knopf separat vom Track."
  },
  {
    name: "--switch-checked-track-color",
    type: "color",
    category: "switches",
    default: "var(--switch-checked-color, var(--primary-color))",
    description: "Farbe der Switch-Schiene (Track) im 'On'-Zustand. Oft transluzent gegenüber dem Button gemacht, für Material-Look."
  },
  {
    name: "--switch-unchecked-button-color",
    type: "color",
    category: "switches",
    default: "var(--switch-unchecked-color, #bdbdbd)",
    description: "Farbe des Switch-Knopfs (Thumb) im 'Off'-Zustand. Spezifischer als --switch-unchecked-color."
  },
  {
    name: "--switch-unchecked-track-color",
    type: "color",
    category: "switches",
    default: "var(--switch-unchecked-color, #bdbdbd)",
    description: "Farbe der Switch-Schiene (Track) im 'Off'-Zustand. Oft heller als der Button für Material-Look."
  },
  {
    name: "--table-row-background-color",
    type: "color",
    category: "tables",
    default: "var(--card-background-color)",
    description: "Hintergrund von Tabellen-Zeilen (z.B. Logbook, Verlauf, History-Panel). Default referenziert --card-background-color."
  },
  {
    name: "--table-row-alternative-background-color",
    type: "color",
    category: "tables",
    default: "var(--secondary-background-color)",
    description: "Hintergrund jeder zweiten Tabellen-Zeile (Zebra-Pattern). Bietet visuelle Trennung in langen Listen. Default referenziert --secondary-background-color."
  },
  {
    name: "--input-fill-color",
    type: "color",
    category: "form-inputs",
    default: "transparent",
    description: "Hintergrund-Füllfarbe von Input-Feldern (Text, Number, Select etc.) im Default-State. Oft transparent für moderne flache Themes."
  },
  {
    name: "--input-disabled-fill-color",
    type: "color",
    category: "form-inputs",
    default: "transparent",
    description: "Hintergrund-Füllfarbe von deaktivierten Input-Feldern. Sollte sich subtil vom aktiven Zustand absetzen."
  },
  {
    name: "--input-ink-color",
    type: "color",
    category: "form-inputs",
    default: "var(--primary-text-color)",
    description: "Textfarbe ('Tinte') in Input-Feldern. Default referenziert --primary-text-color für Konsistenz."
  },
  {
    name: "--input-disabled-ink-color",
    type: "color",
    category: "form-inputs",
    default: "var(--disabled-text-color)",
    description: "Textfarbe in deaktivierten Input-Feldern. Default referenziert --disabled-text-color."
  },
  {
    name: "--input-label-ink-color",
    type: "color",
    category: "form-inputs",
    default: "var(--secondary-text-color)",
    description: "Farbe des Labels über dem Input-Feld (das floatende 'Placeholder'). Default referenziert --secondary-text-color."
  },
  {
    name: "--input-idle-line-color",
    type: "color",
    category: "form-inputs",
    default: "var(--secondary-text-color)",
    description: "Unterstrich-Farbe von Input-Feldern im Default-State (nicht-fokussiert, nicht-hover)."
  },
  {
    name: "--input-hover-line-color",
    type: "color",
    category: "form-inputs",
    default: "var(--primary-text-color)",
    description: "Unterstrich-Farbe von Input-Feldern beim Hover. Kräftiger als --input-idle-line-color für visuelles Feedback."
  },
  {
    name: "--input-dropdown-icon-color",
    type: "color",
    category: "form-inputs",
    default: "var(--secondary-text-color)",
    description: "Farbe des Dropdown-Pfeil-Icons in Select-Inputs."
  },
  {
    name: "--dialog-box-shadow",
    type: "shadow",
    category: "dialogs",
    default: "var(--ha-card-box-shadow)",
    description: "Schatten unter modalen Dialogen. Default referenziert --ha-card-box-shadow — Dialoge folgen damit dem Card-Look."
  },
  {
    name: "--ha-dialog-surface-background",
    type: "color",
    category: "dialogs",
    default: "var(--ha-card-background)",
    description: "Hintergrund der Dialog-Oberfläche (die Karte des Dialogs). Default referenziert --ha-card-background — Dialoge folgen dem Card-Background."
  },
  {
    name: "--ha-dialog-surface-backdrop-filter",
    type: "raw",
    category: "dialogs",
    default: "none",
    description: "CSS-`backdrop-filter` für die Dialog-Oberfläche selbst. Mit `blur(...)` bekommt der Dialog einen Glas-Look. Default `none`."
  },
  {
    name: "--ha-dialog-scrim-backdrop-filter",
    type: "raw",
    category: "dialogs",
    default: "none",
    description: "CSS-`backdrop-filter` für den Scrim hinter Dialogen (der Overlay-Bereich rund um den Dialog). Mit `blur(10px)` wird das Frontend hinter dem Dialog verschwommen — während ein Dialog offen ist."
  },
  {
    name: "--more-info-header-background",
    type: "color",
    category: "dialogs",
    default: "var(--ha-card-background)",
    description: "Hintergrund des Headers im More-Info-Dialog (öffnet sich bei Entity-Klick auf einer Card). Default referenziert --ha-card-background."
  },
  {
    name: "--label-badge-background-color",
    type: "color",
    category: "label-badge",
    default: "var(--card-background-color)",
    description: "Hintergrund von Label-Badges — kleine Status-Markierungen die in manchen Custom-Cards neben Entity-Icons erscheinen. Default referenziert --card-background-color."
  },
  {
    name: "--label-badge-text-color",
    type: "color",
    category: "label-badge",
    default: "var(--primary-text-color)",
    description: "Textfarbe in Label-Badges. Default referenziert --primary-text-color."
  },
  {
    name: "--label-badge-red",
    type: "color",
    category: "label-badge",
    default: "var(--error-color)",
    description: "Rot-Farbe für Label-Badges (Alarm/Error-State). Trotz des Namens ohne -color-Suffix ist es ein voller CSS-Color-Wert."
  },
  {
    name: "--label-badge-green",
    type: "color",
    category: "label-badge",
    default: "var(--success-color)",
    description: "Grün-Farbe für Label-Badges (OK/Aktiv-State)."
  },
  {
    name: "--label-badge-blue",
    type: "color",
    category: "label-badge",
    default: "var(--info-color)",
    description: "Blau-Farbe für Label-Badges (Info-State)."
  },
  {
    name: "--label-badge-yellow",
    type: "color",
    category: "label-badge",
    default: "var(--warning-color)",
    description: "Gelb-Farbe für Label-Badges (Warning-State)."
  },
  {
    name: "--label-badge-gray",
    type: "color",
    category: "label-badge",
    default: "var(--disabled-text-color)",
    description: "Grau-Farbe für Label-Badges (Neutral/Inaktiv-State)."
  },
  {
    name: "--paper-item-icon-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--state-icon-color)",
    description: "Icon-Farbe in Polymer-basierten Listen-Items (Legacy HA-Komponenten, z.B. alte Sidebar-Renditionen, einige Dialog-Listen). Default referenziert --state-icon-color."
  },
  {
    name: "--paper-item-icon-active-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--state-icon-active-color)",
    description: "Aktive Variante von --paper-item-icon-color. Wirkt auf 'On'-States in Legacy-Listen-Komponenten."
  },
  {
    name: "--paper-card-background-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--ha-card-background)",
    description: "Legacy-Alias für Card-Hintergrund. Wird von HA-Components verwendet, die noch nicht auf ha-card umgestellt sind."
  },
  {
    name: "--paper-dialog-background-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--ha-dialog-surface-background, var(--ha-card-background))",
    description: "Hintergrund alter Polymer-Dialoge. Wird zunehmend durch --ha-dialog-surface-background ersetzt, aber manche Legacy-Dialoge greifen noch hier zu."
  },
  {
    name: "--paper-listbox-background-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--primary-background-color)",
    description: "Hintergrund von Polymer-Listbox-Komponenten (alte Listen-Dialoge, Dropdown-Menüs)."
  },
  {
    name: "--paper-slider-container-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--disabled-text-color)",
    description: "Hintergrund-Track des Sliders (der ungefüllte Bereich rechts vom Knopf). Komplement zu --paper-slider-active-color."
  },
  {
    name: "--paper-slider-secondary-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--light-primary-color)",
    description: "Sekundäre Slider-Farbe — z.B. für Slider mit zwei Wertebereichen (Min/Max) oder Buffered-State."
  },
  {
    name: "--paper-slider-knob-start-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--paper-slider-knob-color)",
    description: "Knopf-Farbe in der Start-Position (bei Wert 0). Variiert sich oft von --paper-slider-knob-color für visuelle Klarheit am Anfang."
  },
  {
    name: "--paper-slider-pin-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--paper-slider-knob-color)",
    description: "Pin-Farbe — der kleine Tooltip der über dem Knopf erscheint wenn man zieht und den aktuellen Wert anzeigt."
  },
  {
    name: "--paper-slider-font-color",
    type: "color",
    category: "polymer-legacy",
    default: "#000",
    description: "Textfarbe für Werte/Labels die *innerhalb* des Slider-Pins angezeigt werden (z.B. Brightness-%)."
  },
  {
    name: "--paper-toggle-button-checked-button-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--primary-color)",
    description: "Knopf-Farbe alter Polymer-Toggle-Buttons im 'On'-Zustand. Trotz neuer --switch-*-Vars werden viele Custom-Cards und Legacy-Dialoge weiterhin von dieser bestimmt."
  },
  {
    name: "--paper-toggle-button-checked-bar-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--primary-color)",
    description: "Bar/Track-Farbe alter Polymer-Toggle-Buttons im 'On'-Zustand."
  },
  {
    name: "--paper-toggle-button-unchecked-button-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--disabled-text-color)",
    description: "Knopf-Farbe alter Polymer-Toggle-Buttons im 'Off'-Zustand."
  },
  {
    name: "--paper-toggle-button-unchecked-bar-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--disabled-text-color)",
    description: "Bar/Track-Farbe alter Polymer-Toggle-Buttons im 'Off'-Zustand."
  },
  {
    name: "--text-primary-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--primary-text-color)",
    description: "Legacy: primäre Textfarbe — bei modernen Themes oft auf --primary-text-color verwiesen. Manche alte Komponenten greifen noch direkt hier zu."
  },
  {
    name: "--text-dark-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--primary-text-color)",
    description: "Legacy: dunkle Textfarbe für hellem Hintergrund. In Dark-Themes oft auf eine helle Farbe gesetzt — der Name ist irreführend."
  },
  {
    name: "--mdc-select-fill-color",
    type: "color",
    category: "mdc",
    default: "rgba(245, 245, 245, 1)",
    description: "Hintergrund-Füllfarbe von Material-Design-Select-Dropdowns (in HA-Settings, Config-Flows, Forms). Beeinflusst die Felder unter dem Label."
  },
  {
    name: "--mdc-select-ink-color",
    type: "color",
    category: "mdc",
    default: "var(--primary-text-color)",
    description: "Textfarbe ('Tinte') des ausgewählten Wertes in Material-Design-Selects. Default referenziert --primary-text-color."
  },
  {
    name: "--mdc-select-label-ink-color",
    type: "color",
    category: "mdc",
    default: "var(--secondary-text-color)",
    description: "Farbe des Labels über dem Select-Feld. Default referenziert --secondary-text-color (dezenter als der Wert selbst)."
  },
  {
    name: "--mdc-select-dropdown-icon-color",
    type: "color",
    category: "mdc",
    default: "var(--secondary-text-color)",
    description: "Farbe des Dropdown-Pfeil-Icons im Select. Default referenziert --secondary-text-color."
  },
  {
    name: "--mdc-checkbox-unchecked-color",
    type: "color",
    category: "mdc",
    default: "var(--secondary-text-color)",
    description: "Border-Farbe von Material-Design-Checkboxen im 'Unchecked'-State."
  },
  {
    name: "--mdc-radio-unchecked-color",
    type: "color",
    category: "mdc",
    default: "var(--secondary-text-color)",
    description: "Border-Farbe von Material-Design-Radio-Buttons im 'Unchecked'-State."
  },
  {
    name: "--mdc-theme-surface",
    type: "color",
    category: "mdc",
    default: "var(--card-background-color)",
    description: "Allgemeine Surface-Hintergrund-Farbe für Material-Design-Components. Oft synonym zu --card-background-color."
  },
  {
    name: "--md-list-container-color",
    type: "color",
    category: "mdc",
    default: "var(--card-background-color)",
    description: "Hintergrund von Material-Design-3 List-Containern. Setze 'none' (als Wort, nicht als CSS) ist nicht gültig — für transparenten Hintergrund eine transparente Farbe wählen."
  },
  {
    name: "--rgb-primary-color",
    type: "raw",
    category: "rgb",
    default: "3, 169, 244",
    description: "RGB-Trippel-Form von --primary-color als 'R, G, B' (Komma-getrennt, ohne `rgb()`-Wrapper). HA nutzt das für `rgba(var(--rgb-primary-color), 0.5)` Konstruktionen, um die Farbe mit variabler Transparenz zu kombinieren. Beim Anpassen von --primary-color sollte auch das hier mitgepflegt werden (es leitet sich nicht automatisch ab)."
  },
  {
    name: "--rgb-accent-color",
    type: "raw",
    category: "rgb",
    default: "255, 152, 0",
    description: "RGB-Trippel-Form von --accent-color als 'R, G, B'. Siehe --rgb-primary-color für Verwendungsmuster (Transparenz-Konstruktionen via rgba(var(--rgb-accent-color), alpha))."
  },
  {
    name: "--rgb-state-icon-color",
    type: "raw",
    category: "rgb",
    default: "68, 115, 158",
    description: "RGB-Trippel-Form von --state-icon-color. Für Transparenz-Berechnungen via rgba()."
  },
  {
    name: "--rgb-primary-text-color",
    type: "raw",
    category: "rgb",
    default: "33, 33, 33",
    description: "RGB-Trippel-Form von --primary-text-color. Für Transparenz-Berechnungen via rgba()."
  },
  {
    name: "--rgb-secondary-text-color",
    type: "raw",
    category: "rgb",
    default: "114, 114, 114",
    description: "RGB-Trippel-Form von --secondary-text-color. Für Transparenz-Berechnungen via rgba()."
  },
  {
    name: "--rgb-card-background-color",
    type: "raw",
    category: "rgb",
    default: "255, 255, 255",
    description: "RGB-Trippel-Form von --card-background-color. Wird oft für semi-transparente Card-Backgrounds genutzt: `background: rgba(var(--rgb-card-background-color), 0.7)`."
  }
], cr = {
  id: gt,
  categories: ft,
  variables: yt
}, dr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  categories: ft,
  default: cr,
  id: gt,
  variables: yt
}, Symbol.toStringTag, { value: "Module" })), vt = "mushroom", _t = [
  {
    id: "card-primary",
    label: "Card-Primary (Hauptzeile)",
    icon: "mdi:format-text"
  },
  {
    id: "card-secondary",
    label: "Card-Secondary (Subzeile)",
    icon: "mdi:format-text-variant"
  },
  {
    id: "title",
    label: "Title",
    icon: "mdi:format-header-1"
  },
  {
    id: "subtitle",
    label: "Subtitle",
    icon: "mdi:format-header-2"
  },
  {
    id: "icon",
    label: "Icon",
    icon: "mdi:emoticon-outline"
  },
  {
    id: "badge",
    label: "Badge",
    icon: "mdi:label-outline"
  },
  {
    id: "chip",
    label: "Chip",
    icon: "mdi:pill"
  },
  {
    id: "control",
    label: "Control",
    icon: "mdi:tune-variant"
  },
  {
    id: "layout",
    label: "Layout / Misc",
    icon: "mdi:dots-horizontal"
  },
  {
    id: "rgb-material",
    label: "Material-Palette (RGB)",
    icon: "mdi:palette-swatch"
  },
  {
    id: "rgb-semantic",
    label: "Semantic States (RGB)",
    icon: "mdi:tag-outline"
  },
  {
    id: "rgb-states",
    label: "Entity-States (RGB)",
    icon: "mdi:state-machine"
  }
], xt = [
  {
    name: "--mush-card-primary-color",
    type: "color",
    category: "card-primary",
    description: "Mushroom · Card-Primary · Farbe der primären Card-Textzeile (z.B. Entity-Name)."
  },
  {
    name: "--mush-card-primary-font-size",
    type: "length",
    category: "card-primary",
    unit: [
      "px",
      "rem",
      "em"
    ],
    min: 8,
    max: 32,
    description: "Mushroom · Card-Primary · Schriftgröße der primären Zeile."
  },
  {
    name: "--mush-card-primary-font-weight",
    type: "raw",
    category: "card-primary",
    description: "Mushroom · Card-Primary · CSS-`font-weight` (normal, bold, 100..900)."
  },
  {
    name: "--mush-card-primary-letter-spacing",
    type: "length",
    category: "card-primary",
    unit: [
      "em",
      "px"
    ],
    min: -0.1,
    max: 0.5,
    step: 0.01,
    description: "Mushroom · Card-Primary · Buchstabenabstand."
  },
  {
    name: "--mush-card-primary-line-height",
    type: "raw",
    category: "card-primary",
    description: "Mushroom · Card-Primary · CSS-`line-height` (unitless Zahl oder mit Einheit)."
  },
  {
    name: "--mush-card-secondary-color",
    type: "color",
    category: "card-secondary",
    description: "Mushroom · Card-Secondary · Farbe der sekundären Card-Zeile (z.B. State-Text)."
  },
  {
    name: "--mush-card-secondary-font-size",
    type: "length",
    category: "card-secondary",
    unit: [
      "px",
      "rem",
      "em"
    ],
    min: 8,
    max: 32,
    description: "Mushroom · Card-Secondary · Schriftgröße der sekundären Zeile."
  },
  {
    name: "--mush-card-secondary-font-weight",
    type: "raw",
    category: "card-secondary",
    description: "Mushroom · Card-Secondary · CSS-`font-weight`."
  },
  {
    name: "--mush-card-secondary-letter-spacing",
    type: "length",
    category: "card-secondary",
    unit: [
      "em",
      "px"
    ],
    min: -0.1,
    max: 0.5,
    step: 0.01,
    description: "Mushroom · Card-Secondary · Buchstabenabstand."
  },
  {
    name: "--mush-card-secondary-line-height",
    type: "raw",
    category: "card-secondary",
    description: "Mushroom · Card-Secondary · CSS-`line-height`."
  },
  {
    name: "--mush-title-color",
    type: "color",
    category: "title",
    description: "Mushroom · Title · Farbe von Title-Cards."
  },
  {
    name: "--mush-title-font-size",
    type: "length",
    category: "title",
    unit: [
      "px",
      "rem",
      "em"
    ],
    min: 10,
    max: 48,
    description: "Mushroom · Title · Schriftgröße."
  },
  {
    name: "--mush-title-font-weight",
    type: "raw",
    category: "title",
    description: "Mushroom · Title · CSS-`font-weight`."
  },
  {
    name: "--mush-title-letter-spacing",
    type: "length",
    category: "title",
    unit: [
      "em",
      "px"
    ],
    min: -0.1,
    max: 0.5,
    step: 0.01,
    description: "Mushroom · Title · Buchstabenabstand."
  },
  {
    name: "--mush-title-line-height",
    type: "raw",
    category: "title",
    description: "Mushroom · Title · CSS-`line-height`."
  },
  {
    name: "--mush-title-padding",
    type: "length",
    category: "title",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Mushroom · Title · Innenabstand der Title-Card."
  },
  {
    name: "--mush-title-spacing",
    type: "length",
    category: "title",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Mushroom · Title · Abstand zwischen Title und folgendem Element."
  },
  {
    name: "--mush-subtitle-color",
    type: "color",
    category: "subtitle",
    description: "Mushroom · Subtitle · Farbe von Subtitle-Texten."
  },
  {
    name: "--mush-subtitle-font-size",
    type: "length",
    category: "subtitle",
    unit: [
      "px",
      "rem",
      "em"
    ],
    min: 8,
    max: 32,
    description: "Mushroom · Subtitle · Schriftgröße."
  },
  {
    name: "--mush-subtitle-font-weight",
    type: "raw",
    category: "subtitle",
    description: "Mushroom · Subtitle · CSS-`font-weight`."
  },
  {
    name: "--mush-subtitle-letter-spacing",
    type: "length",
    category: "subtitle",
    unit: [
      "em",
      "px"
    ],
    min: -0.1,
    max: 0.5,
    step: 0.01,
    description: "Mushroom · Subtitle · Buchstabenabstand."
  },
  {
    name: "--mush-subtitle-line-height",
    type: "raw",
    category: "subtitle",
    description: "Mushroom · Subtitle · CSS-`line-height`."
  },
  {
    name: "--mush-icon-border-radius",
    type: "length",
    category: "icon",
    unit: [
      "px",
      "%"
    ],
    min: 0,
    max: 50,
    description: "Mushroom · Icon · Ecken-Rundung des Icon-Hintergrund-Containers. 50% = Kreis."
  },
  {
    name: "--mush-icon-size",
    type: "length",
    category: "icon",
    unit: [
      "px",
      "rem"
    ],
    min: 16,
    max: 100,
    description: "Mushroom · Icon · Größe des Icon-Containers."
  },
  {
    name: "--mush-icon-symbol-size",
    type: "length",
    category: "icon",
    unit: [
      "px",
      "rem"
    ],
    min: 8,
    max: 80,
    description: "Mushroom · Icon · Größe des eigentlichen Icon-Symbols innerhalb des Containers."
  },
  {
    name: "--mush-badge-border-radius",
    type: "length",
    category: "badge",
    unit: [
      "px",
      "%"
    ],
    min: 0,
    max: 50,
    description: "Mushroom · Badge · Ecken-Rundung der State-Badge."
  },
  {
    name: "--mush-badge-icon-size",
    type: "length",
    category: "badge",
    unit: [
      "px",
      "rem"
    ],
    min: 4,
    max: 40,
    description: "Mushroom · Badge · Größe des Badge-Icons."
  },
  {
    name: "--mush-badge-size",
    type: "length",
    category: "badge",
    unit: [
      "px",
      "rem"
    ],
    min: 8,
    max: 60,
    description: "Mushroom · Badge · Größe der gesamten Badge."
  },
  {
    name: "--mush-chip-avatar-border-radius",
    type: "length",
    category: "chip",
    unit: [
      "px",
      "%"
    ],
    min: 0,
    max: 50,
    description: "Mushroom · Chip · Ecken-Rundung des Avatar-Bildes im Chip."
  },
  {
    name: "--mush-chip-avatar-padding",
    type: "length",
    category: "chip",
    unit: [
      "px"
    ],
    min: 0,
    max: 20,
    description: "Mushroom · Chip · Innenabstand um den Avatar."
  },
  {
    name: "--mush-chip-background",
    type: "color",
    category: "chip",
    description: "Mushroom · Chip · Hintergrund-Farbe der Chip-Container."
  },
  {
    name: "--mush-chip-border-color",
    type: "color",
    category: "chip",
    description: "Mushroom · Chip · Border-Farbe der Chips."
  },
  {
    name: "--mush-chip-border-radius",
    type: "length",
    category: "chip",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Mushroom · Chip · Ecken-Rundung der Chips."
  },
  {
    name: "--mush-chip-border-width",
    type: "length",
    category: "chip",
    unit: [
      "px"
    ],
    min: 0,
    max: 8,
    description: "Mushroom · Chip · Border-Breite."
  },
  {
    name: "--mush-chip-box-shadow",
    type: "shadow",
    category: "chip",
    description: "Mushroom · Chip · Schatten unter Chips. `none` für flach."
  },
  {
    name: "--mush-chip-font-size",
    type: "length",
    category: "chip",
    unit: [
      "px",
      "rem"
    ],
    min: 8,
    max: 24,
    description: "Mushroom · Chip · Schriftgröße in Chips."
  },
  {
    name: "--mush-chip-font-weight",
    type: "raw",
    category: "chip",
    description: "Mushroom · Chip · `font-weight` in Chips."
  },
  {
    name: "--mush-chip-height",
    type: "length",
    category: "chip",
    unit: [
      "px",
      "rem"
    ],
    min: 16,
    max: 80,
    description: "Mushroom · Chip · Höhe der Chips."
  },
  {
    name: "--mush-chip-icon-size",
    type: "length",
    category: "chip",
    unit: [
      "px",
      "rem"
    ],
    min: 8,
    max: 40,
    description: "Mushroom · Chip · Icon-Größe in Chips."
  },
  {
    name: "--mush-chip-padding",
    type: "length",
    category: "chip",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 30,
    description: "Mushroom · Chip · Innen-Padding der Chips."
  },
  {
    name: "--mush-chip-spacing",
    type: "length",
    category: "chip",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 30,
    description: "Mushroom · Chip · Abstand zwischen Chips."
  },
  {
    name: "--mush-control-border-radius",
    type: "length",
    category: "control",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 50,
    description: "Mushroom · Control · Ecken-Rundung der Control-Elemente (Sliders, Buttons)."
  },
  {
    name: "--mush-control-button-ratio",
    type: "raw",
    category: "control",
    description: "Mushroom · Control · Verhältnis Button-Breite zur Höhe (unitless Zahl, z.B. `1` = quadratisch)."
  },
  {
    name: "--mush-control-height",
    type: "length",
    category: "control",
    unit: [
      "px",
      "rem"
    ],
    min: 24,
    max: 80,
    description: "Mushroom · Control · Höhe der Control-Buttons/Slider."
  },
  {
    name: "--mush-control-icon-size",
    type: "length",
    category: "control",
    unit: [
      "px",
      "rem"
    ],
    min: 12,
    max: 48,
    description: "Mushroom · Control · Icon-Größe in Controls."
  },
  {
    name: "--mush-control-spacing",
    type: "length",
    category: "control",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 30,
    description: "Mushroom · Control · Abstand zwischen Control-Elementen."
  },
  {
    name: "--mush-input-number-debounce",
    type: "raw",
    category: "layout",
    description: "Mushroom · Misc · Debounce-Zeit für Number-Inputs in ms (z.B. `1000`)."
  },
  {
    name: "--mush-layout-align",
    type: "raw",
    category: "layout",
    description: "Mushroom · Misc · Layout-Ausrichtung (flex-start, center, flex-end)."
  },
  {
    name: "--mush-slider-threshold",
    type: "raw",
    category: "layout",
    description: "Mushroom · Misc · Schwellwert für Slider-Aktivierung (unitless Zahl)."
  },
  {
    name: "--mush-spacing",
    type: "length",
    category: "layout",
    unit: [
      "px",
      "rem"
    ],
    min: 0,
    max: 40,
    description: "Mushroom · Misc · Generischer Standard-Abstand zwischen Elementen."
  },
  {
    name: "--mush-rgb-amber",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Amber als 'R, G, B'. Für rgba(var(--mush-rgb-amber), alpha)."
  },
  {
    name: "--mush-rgb-black",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Schwarz."
  },
  {
    name: "--mush-rgb-blue",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Blau."
  },
  {
    name: "--mush-rgb-blue-grey",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Blau-Grau."
  },
  {
    name: "--mush-rgb-brown",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Braun."
  },
  {
    name: "--mush-rgb-cyan",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Cyan."
  },
  {
    name: "--mush-rgb-dark-grey",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Dunkelgrau."
  },
  {
    name: "--mush-rgb-deep-orange",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Dunkel-Orange."
  },
  {
    name: "--mush-rgb-deep-purple",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Dunkel-Violett."
  },
  {
    name: "--mush-rgb-green",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Grün."
  },
  {
    name: "--mush-rgb-grey",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Grau."
  },
  {
    name: "--mush-rgb-indigo",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Indigo."
  },
  {
    name: "--mush-rgb-light-blue",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Hellblau."
  },
  {
    name: "--mush-rgb-light-green",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Hellgrün."
  },
  {
    name: "--mush-rgb-light-grey",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Hellgrau."
  },
  {
    name: "--mush-rgb-lime",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Lime."
  },
  {
    name: "--mush-rgb-orange",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Orange."
  },
  {
    name: "--mush-rgb-pink",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Pink."
  },
  {
    name: "--mush-rgb-purple",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Violett."
  },
  {
    name: "--mush-rgb-red",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Rot."
  },
  {
    name: "--mush-rgb-teal",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Teal."
  },
  {
    name: "--mush-rgb-white",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Weiss."
  },
  {
    name: "--mush-rgb-yellow",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Gelb."
  },
  {
    name: "--mush-rgb-danger",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Danger/Error (typisch rot)."
  },
  {
    name: "--mush-rgb-disabled",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Disabled-Zustand (typisch grau)."
  },
  {
    name: "--mush-rgb-info",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Info (typisch blau)."
  },
  {
    name: "--mush-rgb-success",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Success (typisch grün)."
  },
  {
    name: "--mush-rgb-warning",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Warning (typisch gelb/orange)."
  },
  {
    name: "--mush-rgb-update-installing",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Update wird gerade installiert."
  },
  {
    name: "--mush-rgb-update-off",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Kein Update verfügbar."
  },
  {
    name: "--mush-rgb-state-update-on",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Update verfügbar (typisch orange)."
  },
  {
    name: "--mush-rgb-state-entity",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Default-Farbe für inaktive Entities."
  },
  {
    name: "--mush-rgb-state-alarm-armed",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Alarm armiert."
  },
  {
    name: "--mush-rgb-state-alarm-disarmed",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Alarm deaktiviert."
  },
  {
    name: "--mush-rgb-state-alarm-triggered",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Alarm ausgelöst."
  },
  {
    name: "--mush-rgb-state-climate-auto",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Auto-Modus."
  },
  {
    name: "--mush-rgb-state-climate-cool",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Cool-Modus (Kühlen)."
  },
  {
    name: "--mush-rgb-state-climate-dry",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Dry-Modus (Entfeuchten)."
  },
  {
    name: "--mush-rgb-state-climate-fan-only",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Fan-Only-Modus."
  },
  {
    name: "--mush-rgb-state-climate-heat",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Heat-Modus (Heizen)."
  },
  {
    name: "--mush-rgb-state-climate-heat-cool",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Heat-Cool-Modus (Hybrid)."
  },
  {
    name: "--mush-rgb-state-climate-idle",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Idle-Zustand."
  },
  {
    name: "--mush-rgb-state-climate-off",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Off."
  },
  {
    name: "--mush-rgb-state-cover-closed",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Cover geschlossen."
  },
  {
    name: "--mush-rgb-state-cover-open",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Cover offen."
  },
  {
    name: "--mush-rgb-state-fan",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Fan-Entity."
  },
  {
    name: "--mush-rgb-state-humidifier",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Humidifier-Entity."
  },
  {
    name: "--mush-rgb-state-light",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Light-Entity (typisch amber/gelb)."
  },
  {
    name: "--mush-rgb-state-lock",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Lock-Entity (generisch)."
  },
  {
    name: "--mush-rgb-state-lock-locked",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Lock im 'Locked'-State."
  },
  {
    name: "--mush-rgb-state-lock-pending",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Lock im 'Pending'-State."
  },
  {
    name: "--mush-rgb-state-lock-unlocked",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Lock im 'Unlocked'-State."
  },
  {
    name: "--mush-rgb-state-media-player",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Media-Player-Entity."
  },
  {
    name: "--mush-rgb-state-number",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Number-Entity."
  },
  {
    name: "--mush-rgb-state-person-home",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Person zuhause."
  },
  {
    name: "--mush-rgb-state-person-not-home",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Person nicht zuhause."
  },
  {
    name: "--mush-rgb-state-person-unknown",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Person Status unbekannt."
  },
  {
    name: "--mush-rgb-state-person-zone",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Person in einer Zone."
  },
  {
    name: "--mush-rgb-state-vacuum",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Vacuum-Entity."
  }
], ur = {
  id: vt,
  categories: _t,
  variables: xt
}, pr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  categories: _t,
  default: ur,
  id: vt,
  variables: xt
}, Symbol.toStringTag, { value: "Module" })), mr = /-(radius|size|width|height|padding|margin|gap)$/, hr = /-(color|bg|background)$/, br = /-(image|background-image)$/, gr = [
  /^#[0-9a-f]{3,8}$/i,
  // #rgb, #rrggbb, #rrggbbaa
  /^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\s*\(/i,
  /^(transparent|currentColor|inherit)$/i
], fr = /^var\(\s*--[A-Za-z0-9_-]*-(color|bg|background)\b/i, yr = /^-?\d*\.?\d+(px|rem|em|vh|vw|vmin|vmax|%)$/i, vr = /^var\(\s*--[A-Za-z0-9_-]*-(radius|size|width|height|padding|margin|gap)\b/i;
function _r(t) {
  const e = t.trim();
  if (e) {
    if (/url\s*\(/i.test(e) || /gradient\s*\(/i.test(e)) return "background";
    if (gr.some((r) => r.test(e)) || fr.test(e)) return "color";
    if (yr.test(e) || vr.test(e)) return "length";
  }
}
function xr(t, e) {
  if (/-family$/.test(t)) return "font-family";
  if (/-shadow$/.test(t)) return "shadow";
  if (br.test(t)) return "background";
  if (mr.test(t)) return "length";
  if (hr.test(t)) return "color";
  if (e !== void 0) {
    const r = _r(e);
    if (r) return r;
  }
  return "raw";
}
const wr = [
  // Third-party Custom Cards
  { re: /^--bubble-/, label: "Bubble Card" },
  { re: /^--mush-/, label: "Mushroom" },
  { re: /^--card-mod-/, label: "card-mod" },
  { re: /^--mini-graph-/, label: "Mini-Graph-Card" },
  { re: /^--mini-media-player-/, label: "Mini-Media-Player-Card" },
  { re: /^--mcg-/, label: "Material-Color-Generator" },
  { re: /^--lumo-/, label: "Vaadin/Lumo (Custom Card)" },
  { re: /^--wa-/, label: "Web Awesome (Design-Tokens)" },
  // HA Design-Tokens (spezifischer vor generischem --ha-)
  { re: /^--ha-color-/, label: "HA Color-Tokens (Design-System)" },
  { re: /^--ha-dialog-/, label: "HA Dialogs/Modals" },
  { re: /^--ha-slider-/, label: "HA Slider (modern)" },
  { re: /^--ha-/, label: "HA Core (erweitert, nicht im Studio-Schema)" },
  // Material Design (mdc spezifischer als md)
  { re: /^--mdc-/, label: "Material Design Components" },
  { re: /^--md-/, label: "Material Design 3" },
  { re: /^--material-/, label: "Material-Theme" },
  // Legacy
  { re: /^--paper-/, label: "Polymer/Paper (legacy HA)" },
  { re: /^--text-/, label: "HA Text-Farben (legacy)" },
  { re: /^--label-badge-/, label: "HA Label-Badges (legacy)" },
  // HA-Spezifika
  { re: /^--state-/, label: "HA State-Farben (erweitert)" },
  { re: /^--rgb-/, label: "HA RGB-Trippel" },
  { re: /^--energy-/, label: "HA Energy-Panel" },
  { re: /^--input-/, label: "HA Form-Inputs" },
  { re: /^--data-table-/, label: "HA Data-Tables" },
  { re: /^--app-/, label: "HA App-Header/Theme" },
  { re: /^--more-info-/, label: "HA More-Info-Dialog" },
  // Code-Editor / Markdown
  { re: /^--code-editor-/, label: "HA Code-Editor" },
  { re: /^--codemirror-/, label: "CodeMirror-Syntax-Highlight" },
  { re: /^--markdown-/, label: "Markdown-Rendering" }
], kr = {
  color: "Farbe",
  length: "Länge / Größe",
  shadow: "Schatten",
  background: "Hintergrund-Bild",
  "font-family": "Schriftart-Stack",
  enum: "Auswahl",
  "var-ref": "var()-Referenz",
  raw: "freier Text-Wert"
};
function $r(t, e) {
  const a = wr.find(({ re: i }) => i.test(t))?.label ?? "Quelle unbekannt", o = kr[e];
  return `${a} · vermutlich ${o} (Heuristik).`;
}
const Sr = /* @__PURE__ */ Object.assign({
  "../plugins/bubble-card/manifest.json": rr,
  "../plugins/ha-core/manifest.json": ar,
  "../plugins/mushroom/manifest.json": nr
}), Cr = /* @__PURE__ */ Object.assign({
  "../plugins/bubble-card/schema.json": lr,
  "../plugins/ha-core/schema.json": dr,
  "../plugins/mushroom/schema.json": pr
});
function Mr() {
  const t = [];
  for (const [e, r] of Object.entries(Sr)) {
    const a = e.replace(/\/manifest\.json$/, "/schema.json"), o = Cr[a];
    if (!o) {
      console.warn(
        `[theme-studio] Plugin at ${e} has no schema.json — skipping.`
      );
      continue;
    }
    t.push({ manifest: r.default, schema: o.default });
  }
  return t;
}
const ee = Object.freeze(Mr());
let de = null;
const Ce = /* @__PURE__ */ new Set();
function Br(t) {
  de = t === null ? null : new Set(t);
  for (const e of Ce)
    try {
      e();
    } catch {
    }
}
function wt(t) {
  return Ce.add(t), () => Ce.delete(t);
}
const Ne = ["ha-core"];
function zr(t) {
  return [...t].sort((e, r) => {
    const a = Ne.indexOf(e.manifest.id), o = Ne.indexOf(r.manifest.id);
    return a !== -1 && o !== -1 ? a - o : a !== -1 ? -1 : o !== -1 ? 1 : e.manifest.id.localeCompare(r.manifest.id);
  });
}
function te() {
  const t = ee.filter((e) => {
    const r = e.manifest.detect;
    return r.method === "always" ? !0 : r.method === "hacs-repo" && r.value ? de === null ? !0 : de.has(r.value) : !0;
  });
  return zr(t);
}
const ue = /* @__PURE__ */ new Map();
for (const t of ee)
  for (const e of t.schema.variables)
    ue.has(e.name) || ue.set(e.name, { pluginId: t.manifest.id, def: e });
function pe(t, e) {
  const r = ue.get(t);
  if (r)
    return { ...r.def, source: "schema", plugin: r.pluginId };
  const a = xr(t, e);
  return {
    name: t,
    type: a,
    description: $r(t, a),
    source: "heuristic"
  };
}
function je() {
  const t = te();
  return {
    plugins: ee.length,
    pluginIds: ee.map((e) => e.manifest.id),
    activePluginIds: t.map((e) => e.manifest.id),
    indexedVariables: ue.size,
    categories: ee.reduce(
      (e, r) => e + r.schema.categories.length,
      0
    ),
    hacsFilterApplied: de !== null
  };
}
var Ar = Object.defineProperty, Tr = Object.getOwnPropertyDescriptor, K = (t, e, r, a) => {
  for (var o = a > 1 ? void 0 : a ? Tr(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (o = (a ? n(e, r, o) : n(o)) || o);
  return a && o && Ar(e, r, o), o;
};
let D = class extends v {
  constructor() {
    super(...arguments), this._loading = !0, this._themes = [], this._errors = [], this._loadError = null;
  }
  connectedCallback() {
    super.connectedCallback(), this._load();
  }
  async _load() {
    this._loading = !0, this._loadError = null;
    try {
      const t = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/list_themes"
      });
      this._themes = t.themes, this._errors = t.errors;
    } catch (t) {
      this._loadError = t instanceof Error ? t.message : String(t);
    } finally {
      this._loading = !1;
    }
  }
  render() {
    return this._loading ? s`<div class="empty">Lade Themes…</div>` : this._loadError ? s`<div class="error">Fehler: ${this._loadError}</div>` : s`
      <h2>Welches Theme möchtest du tunen?</h2>
      ${this._themes.length === 0 ? s`<div class="empty">
            Keine Themes gefunden. Lege eine YAML-Datei in
            <code>themes/</code> an oder erstelle ein neues Theme (folgt in
            Schritt 8).
          </div>` : s`
            <div class="list">
              ${this._themes.map(
      (t) => s`
                  <button
                    class="item"
                    @click=${() => this._select(t)}
                    title=${t.file}
                  >
                    <div class="info">
                      <div class="name">${t.theme_name}</div>
                      <div class="meta">
                        ${t.file} · ${t.variable_count} Variablen
                      </div>
                    </div>
                    <div class="arrow">→</div>
                  </button>
                `
    )}
            </div>
          `}
      ${this._errors.length > 0 ? s`
            <div class="errors-list">
              <h3>YAML-Fehler in folgenden Dateien:</h3>
              <ul>
                ${this._errors.map(
      (t) => s`<li>${t.file}: ${t.error}</li>`
    )}
              </ul>
            </div>
          ` : ""}
    `;
  }
  _select(t) {
    this.dispatchEvent(
      new CustomEvent("theme-selected", {
        detail: { file: t.file, theme_name: t.theme_name },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
D.styles = C`
    :host {
      display: block;
      max-width: 720px;
      margin: 0 auto;
    }
    h2 {
      font-weight: 400;
      margin: 0 0 24px;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      cursor: pointer;
      text-align: left;
      width: 100%;
      border: none;
      color: inherit;
      font: inherit;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
    }
    .item:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    }
    .item:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .info {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-weight: 500;
      font-size: 1.05rem;
    }
    .meta {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .arrow {
      color: var(--secondary-text-color);
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    .empty,
    .error {
      padding: 24px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    .errors-list {
      margin-top: 24px;
      padding: 12px 16px;
      background: rgba(255, 152, 0, 0.1);
      border-left: 4px solid var(--warning-color);
      border-radius: 4px;
    }
    .errors-list h3 {
      margin: 0 0 8px;
      font-size: 0.9rem;
      color: var(--warning-color);
    }
    .errors-list ul {
      margin: 0;
      padding-left: 20px;
    }
    .errors-list li {
      font-size: 0.85rem;
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
    }
  `;
K([
  g({ attribute: !1 })
], D.prototype, "hass", 2);
K([
  h()
], D.prototype, "_loading", 2);
K([
  h()
], D.prototype, "_themes", 2);
K([
  h()
], D.prototype, "_errors", 2);
K([
  h()
], D.prototype, "_loadError", 2);
D = K([
  M("theme-picker")
], D);
var Er = Object.defineProperty, Pr = Object.getOwnPropertyDescriptor, kt = (t, e, r, a) => {
  for (var o = a > 1 ? void 0 : a ? Pr(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (o = (a ? n(e, r, o) : n(o)) || o);
  return a && o && Er(e, r, o), o;
};
let me = class extends v {
  constructor() {
    super(...arguments), this.value = "";
  }
  render() {
    return s`
      <div class="swatch">
        <div class="fill" style="background: ${this.value || "transparent"}"></div>
        <input
          type="color"
          .value=${this._asHex(this.value)}
          @input=${this._onColorInput}
          aria-label="Color picker"
        />
      </div>
      <input
        type="text"
        .value=${this.value}
        @change=${this._onTextChange}
        spellcheck="false"
        autocomplete="off"
      />
    `;
  }
  _asHex(t) {
    const e = /^#([0-9a-f]{6})$/i.exec(t.trim());
    return e ? `#${e[1]}` : "#000000";
  }
  _onColorInput(t) {
    this._emit(t.target.value);
  }
  _onTextChange(t) {
    this._emit(t.target.value);
  }
  _emit(t) {
    this.value = t, this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
me.styles = C`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    .swatch {
      position: relative;
      width: 36px;
      height: 36px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      overflow: hidden;
      flex-shrink: 0;
      background: conic-gradient(
          rgba(0, 0, 0, 0.1) 25%,
          transparent 25% 50%,
          rgba(0, 0, 0, 0.1) 50% 75%,
          transparent 75%
        )
        0 0 / 10px 10px;
    }
    .fill {
      position: absolute;
      inset: 0;
    }
    .swatch input[type="color"] {
      position: absolute;
      inset: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      border: none;
      padding: 0;
    }
    input[type="text"] {
      flex: 1;
      min-width: 0;
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.9rem;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, inherit);
    }
    input[type="text"]:focus {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -1px;
      border-color: transparent;
    }
  `;
kt([
  g({ type: String })
], me.prototype, "value", 2);
me = kt([
  M("ts-color-picker")
], me);
var Fr = Object.defineProperty, Hr = Object.getOwnPropertyDescriptor, Z = (t, e, r, a) => {
  for (var o = a > 1 ? void 0 : a ? Hr(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (o = (a ? n(e, r, o) : n(o)) || o);
  return a && o && Fr(e, r, o), o;
};
let R = class extends v {
  constructor() {
    super(...arguments), this.value = "0px", this.units = ["px"], this.min = 0, this.max = 100, this.step = 1;
  }
  render() {
    const t = this._parse(this.value);
    return s`
      <input
        type="range"
        min=${this.min}
        max=${this.max}
        step=${this.step}
        .value=${String(t.num)}
        @input=${this._onSlider}
      />
      <input
        type="number"
        min=${this.min}
        max=${this.max}
        step=${this.step}
        .value=${String(t.num)}
        @change=${this._onNumber}
      />
      ${this.units.length > 1 ? s`
            <select @change=${this._onUnit}>
              ${this.units.map(
      (e) => s`
                  <option value=${e} ?selected=${e === t.unit}>
                    ${e}
                  </option>
                `
    )}
            </select>
          ` : s`<span class="unit">${t.unit}</span>`}
    `;
  }
  _parse(t) {
    const e = this.units[0] ?? "px", r = /^(-?\d*\.?\d+)\s*([a-z%]*)$/i.exec(t.trim());
    return r ? {
      num: parseFloat(r[1]),
      unit: r[2] || e
    } : { num: 0, unit: e };
  }
  _onSlider(t) {
    const e = Number(t.target.value), { unit: r } = this._parse(this.value);
    this._emit(`${e}${r}`);
  }
  _onNumber(t) {
    const e = Number(t.target.value), { unit: r } = this._parse(this.value);
    this._emit(`${e}${r}`);
  }
  _onUnit(t) {
    const e = t.target.value, { num: r } = this._parse(this.value);
    this._emit(`${r}${e}`);
  }
  _emit(t) {
    this.value = t, this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
R.styles = C`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }
    input[type="range"] {
      flex: 1;
      min-width: 0;
      accent-color: var(--primary-color, #03a9f4);
    }
    input[type="number"] {
      width: 70px;
      padding: 6px 8px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, inherit);
      font: inherit;
      text-align: right;
    }
    select {
      padding: 6px 8px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, inherit);
      font: inherit;
    }
    .unit {
      color: var(--secondary-text-color, #727272);
      font-size: 0.9rem;
      min-width: 28px;
    }
  `;
Z([
  g({ type: String })
], R.prototype, "value", 2);
Z([
  g({ type: Array })
], R.prototype, "units", 2);
Z([
  g({ type: Number })
], R.prototype, "min", 2);
Z([
  g({ type: Number })
], R.prototype, "max", 2);
Z([
  g({ type: Number })
], R.prototype, "step", 2);
R = Z([
  M("ts-length-slider")
], R);
var Dr = Object.defineProperty, Rr = Object.getOwnPropertyDescriptor, $t = (t, e, r, a) => {
  for (var o = a > 1 ? void 0 : a ? Rr(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (o = (a ? n(e, r, o) : n(o)) || o);
  return a && o && Dr(e, r, o), o;
};
let he = class extends v {
  constructor() {
    super(...arguments), this.value = "";
  }
  render() {
    return this.value.length > 40 || this.value.includes(`
`) ? s`<textarea rows="3" @change=${this._onChange} spellcheck="false">
${this.value}</textarea
        >` : s`<input
          type="text"
          .value=${this.value}
          @change=${this._onChange}
          spellcheck="false"
          autocomplete="off"
        />`;
  }
  _onChange(t) {
    const e = t.target.value;
    this.value = e, this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
he.styles = C`
    :host {
      display: block;
      width: 100%;
    }
    input,
    textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color, white);
      color: var(--primary-text-color, inherit);
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.9rem;
    }
    textarea {
      resize: vertical;
      min-height: 60px;
    }
    input:focus,
    textarea:focus {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -1px;
      border-color: transparent;
    }
  `;
$t([
  g({ type: String })
], he.prototype, "value", 2);
he = $t([
  M("ts-raw-input")
], he);
var Or = Object.defineProperty, Lr = Object.getOwnPropertyDescriptor, St = (t, e, r, a) => {
  for (var o = a > 1 ? void 0 : a ? Lr(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (o = (a ? n(e, r, o) : n(o)) || o);
  return a && o && Or(e, r, o), o;
};
const Ir = [
  {
    label: "Cover",
    modifiers: "center / cover no-repeat fixed",
    title: "Vollbild, zentriert, fixiert (Apple-/visionOS-Style)"
  },
  {
    label: "Contain",
    modifiers: "center / contain no-repeat fixed",
    title: "Komplett sichtbar, zentriert"
  },
  {
    label: "Tile",
    modifiers: "top left repeat fixed",
    title: "Bild wiederholen (Pattern)"
  }
];
function ne(t) {
  const e = t.trim();
  if (!e || e === "none") return { url: "", modifiers: "" };
  const r = /url\(\s*['"]?([^'")]+)['"]?\s*\)/.exec(e);
  if (!r) return { url: "", modifiers: e };
  const a = r[1].trim(), o = (e.slice(0, r.index) + e.slice(r.index + r[0].length)).trim().replace(/\s+/g, " ");
  return { url: a, modifiers: o };
}
function ve(t, e) {
  const r = t.trim(), a = e.trim();
  if (!r && !a) return "none";
  if (!a) return r;
  const o = `url('${a}')`;
  return r ? `${r} ${o}` : o;
}
function Ur(t) {
  const e = t.trim();
  if (!e) return "";
  const r = /^\/(homeassistant|config)\/www\/(.+)$/.exec(e);
  return r ? `/local/${r[2]}` : e;
}
let be = class extends v {
  constructor() {
    super(...arguments), this.value = "";
  }
  render() {
    const t = ne(this.value), e = !!t.url, r = e ? `background-image: url('${t.url.replace(/'/g, "\\'")}');` : "";
    return s`
      <div class="preview" style=${r}>
        ${e ? "" : s`<div class="preview-empty">
              (kein Bild — '${this.value || "none"}')
            </div>`}
      </div>
      <div class="field">
        <label for="url">URL</label>
        <input
          id="url"
          type="url"
          .value=${t.url}
          @change=${this._onUrlChange}
          placeholder="https://… oder /local/wallpaper.jpg (= /homeassistant/www/wallpaper.jpg)"
          spellcheck="false"
          autocomplete="off"
        />
      </div>
      <div class="field">
        <label for="mods">Modifier</label>
        <input
          id="mods"
          type="text"
          .value=${t.modifiers}
          @change=${this._onModsChange}
          placeholder="z.B. center / cover no-repeat fixed"
          spellcheck="false"
          autocomplete="off"
        />
      </div>
      <div class="presets">
        ${Ir.map(
      (a) => s`
            <button
              class="preset-btn"
              title=${a.title}
              @click=${() => this._applyPreset(a.modifiers)}
            >
              ${a.label}
            </button>
          `
    )}
        <button
          class="preset-btn danger"
          title="Auf 'none' setzen — kein Hintergrund-Bild"
          @click=${this._clear}
        >
          Clear
        </button>
      </div>
    `;
  }
  _onUrlChange(t) {
    const e = t.target.value, r = Ur(e), { modifiers: a } = ne(this.value);
    this._emit(ve(a, r));
  }
  _onModsChange(t) {
    const e = t.target.value, { url: r } = ne(this.value);
    this._emit(ve(e, r));
  }
  _applyPreset(t) {
    const { url: e } = ne(this.value);
    this._emit(ve(t, e));
  }
  _clear() {
    this._emit("none");
  }
  _emit(t) {
    this.value = t, this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
be.styles = C`
    :host {
      display: block;
      width: 100%;
    }
    .preview {
      width: 100%;
      height: 120px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      background-color: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      margin-bottom: 8px;
      position: relative;
      overflow: hidden;
    }
    .preview-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      height: 100%;
    }
    .field {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 8px;
      align-items: center;
      margin-bottom: 6px;
    }
    .field label {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }
    input[type="text"],
    input[type="url"] {
      width: 100%;
      box-sizing: border-box;
      padding: 6px 10px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.85rem;
    }
    input:focus {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -1px;
      border-color: transparent;
    }
    .presets {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .preset-btn {
      padding: 4px 10px;
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      cursor: pointer;
      color: inherit;
      font: inherit;
      font-size: 0.8rem;
    }
    .preset-btn:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .preset-btn.danger {
      color: var(--error-color, #db4437);
      border-color: var(--error-color, #db4437);
    }
  `;
St([
  g({ type: String })
], be.prototype, "value", 2);
be = St([
  M("ts-background-picker")
], be);
var Nr = Object.defineProperty, jr = Object.getOwnPropertyDescriptor, q = (t, e, r, a) => {
  for (var o = a > 1 ? void 0 : a ? jr(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (o = (a ? n(e, r, o) : n(o)) || o);
  return a && o && Nr(e, r, o), o;
};
let O = class extends v {
  constructor() {
    super(...arguments), this.src = "/lovelace/0", this.overrides = /* @__PURE__ */ new Map(), this._loaded = !1, this._loadError = null, this._appliedToFrame = /* @__PURE__ */ new Set();
  }
  render() {
    return s`
      <div class="toolbar">
        <span class="label">Preview:</span>
        <input
          type="text"
          .value=${this.src}
          @change=${this._onSrcChange}
          spellcheck="false"
          autocomplete="off"
        />
        <button @click=${this._reload} title="iframe neu laden">↻</button>
        ${this._appliedToFrame.size > 0 ? s`<span class="badge"
              >${this._appliedToFrame.size} override${this._appliedToFrame.size === 1 ? "" : "s"}</span
            >` : ""}
      </div>
      ${this._loadError ? s`<div class="error">${this._loadError}</div>` : ""}
      <iframe src=${this.src} @load=${this._onLoad}></iframe>
    `;
  }
  _onLoad() {
    this._loaded = !0, this._loadError = null, this._appliedToFrame.clear(), this._applyOverrides();
  }
  _onSrcChange(t) {
    const e = t.target.value.trim();
    e && e !== this.src && (this.src = e, this._loaded = !1);
  }
  _reload() {
    this._iframe && (this._loaded = !1, this._iframe.src = this._iframe.src);
  }
  updated(t) {
    t.has("overrides") && this._loaded && this._applyOverrides();
  }
  _applyOverrides() {
    if (!this._iframe?.contentDocument) return;
    const t = this._iframe.contentDocument.documentElement;
    for (const e of this._appliedToFrame)
      if (!this.overrides.has(e)) {
        try {
          t.style.removeProperty(e);
        } catch {
        }
        this._appliedToFrame.delete(e);
      }
    try {
      for (const [e, r] of this.overrides)
        t.style.setProperty(e, r), this._appliedToFrame.add(e);
    } catch (e) {
      this._loadError = "iframe-CSS-Override fehlgeschlagen (möglicherweise Cross-Origin): " + (e instanceof Error ? e.message : String(e));
    }
    this.requestUpdate();
  }
};
O.styles = C`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 600px;
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      overflow: hidden;
      position: sticky;
      top: 12px;
      max-height: calc(100vh - 24px);
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
    }
    .toolbar .label {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }
    .toolbar input[type="text"] {
      flex: 1;
      min-width: 0;
      padding: 4px 8px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.85rem;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .toolbar button {
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      padding: 4px 10px;
      cursor: pointer;
      color: inherit;
      font: inherit;
      font-size: 0.85rem;
    }
    .toolbar button:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .badge {
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.75rem;
      background: var(--primary-color);
      color: #fff;
    }
    iframe {
      flex: 1;
      width: 100%;
      border: none;
      background: var(--primary-background-color);
    }
    .error {
      padding: 16px;
      color: var(--error-color);
      font-size: 0.9rem;
    }
  `;
q([
  g({ type: String })
], O.prototype, "src", 2);
q([
  g({ attribute: !1 })
], O.prototype, "overrides", 2);
q([
  er("iframe")
], O.prototype, "_iframe", 2);
q([
  h()
], O.prototype, "_loaded", 2);
q([
  h()
], O.prototype, "_loadError", 2);
O = q([
  M("ts-preview-pane")
], O);
var Vr = Object.defineProperty, Gr = Object.getOwnPropertyDescriptor, k = (t, e, r, a) => {
  for (var o = a > 1 ? void 0 : a ? Gr(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (o = (a ? n(e, r, o) : n(o)) || o);
  return a && o && Vr(e, r, o), o;
};
const _e = {
  id: "_unknown",
  label: "Unbekannt (Heuristik)",
  icon: "mdi:help-circle-outline"
}, xe = {
  id: "_other",
  label: "Sonstige",
  icon: "mdi:dots-horizontal"
}, z = "in-theme", w = "default", Wr = {
  default: "Default",
  light: "Light",
  dark: "Dark"
};
function we(t) {
  return Wr[t] ?? t;
}
let _ = class extends v {
  constructor() {
    super(...arguments), this.file = "", this.themeName = "", this._loading = !0, this._error = null, this._rows = [], this._skippedKeys = [], this._saveStatus = { state: "idle" }, this._activeTab = z, this._activeMode = w, this._modes = [w], this._showPreview = !1, this._previewSrc = "/lovelace/0", this._appliedVars = /* @__PURE__ */ new Set(), this._originalFullTheme = {}, this._onBeforeUnload = (t) => {
      this._dirtyCount() !== 0 && (t.preventDefault(), t.returnValue = "");
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._unsubRegistry = wt(() => this.requestUpdate()), window.addEventListener("beforeunload", this._onBeforeUnload), this._load();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unsubRegistry?.(), this._unsubRegistry = void 0, window.removeEventListener("beforeunload", this._onBeforeUnload), this._revertAll();
  }
  updated(t) {
    const e = t.has("file") && t.get("file") !== void 0, r = t.has("themeName") && t.get("themeName") !== void 0;
    (e || r) && (this._revertAll(), this._rows = [], this._activeTab = z, this._activeMode = w, this._modes = [w], this._load());
  }
  async _load() {
    this._loading = !0, this._error = null, this._saveStatus = { state: "idle" };
    try {
      const t = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/get_theme",
        file: this.file,
        theme_name: this.themeName
      });
      this._originalFullTheme = t.variables, this._buildRows(t.variables);
    } catch (t) {
      this._error = t instanceof Error ? t.message : String(t);
    } finally {
      this._loading = !1;
    }
  }
  /**
   * Baut Rows aus dem geladenen Theme. Top-Level-Vars werden Rows mit
   * `mode: "default"`. Wenn das Theme einen `modes:`-Block hat, werden
   * dessen verschachtelte Vars ebenfalls als Rows angelegt, mit der
   * jeweiligen Mode-Bezeichnung. Andere Dict-Keys (selten) werden
   * weiterhin in `_skippedKeys` registriert und beim Save 1:1 erhalten.
   */
  _buildRows(t) {
    const e = [], r = [], a = [w];
    for (const [o, i] of Object.entries(t)) {
      if (i == null) continue;
      if (o === "modes" && typeof i == "object") {
        for (const [u, p] of Object.entries(
          i
        ))
          if (!(typeof p != "object" || p === null)) {
            a.includes(u) || a.push(u);
            for (const [m, b] of Object.entries(
              p
            )) {
              if (b == null || typeof b == "object") continue;
              const x = String(b), j = m.startsWith("--") ? m : `--${m}`, Mt = j.slice(2), Bt = pe(j, x);
              e.push({
                varName: j,
                yamlKey: Mt,
                meta: Bt,
                original: x,
                current: x,
                inTheme: !0,
                mode: u
              });
            }
          }
        continue;
      }
      if (typeof i == "object") {
        r.push(o);
        continue;
      }
      const n = String(i), c = o.startsWith("--") ? o : `--${o}`, l = c.slice(2), d = pe(c, n);
      e.push({
        varName: c,
        yamlKey: l,
        meta: d,
        original: n,
        current: n,
        inTheme: !0,
        mode: w
      });
    }
    this._skippedKeys = r, this._rows = e, this._modes = a;
  }
  /**
   * Beim Wechsel auf einen Plugin-Tab: alle Vars dieses Plugins, die für
   * den aktuellen Mode noch nicht in `_rows` sind, anhängen.
   *
   * In `default`-Mode bekommen sie den Schema-Default als Initial-Wert.
   * In nicht-default-Modes bekommen sie leeren String — das signalisiert
   * "kein Override im jeweiligen Mode" und wird beim Save nicht
   * geschrieben.
   */
  _ensurePluginRows(t, e) {
    const r = te().find((i) => i.manifest.id === t);
    if (!r) return;
    const a = new Set(
      this._rows.filter((i) => i.mode === e).map((i) => i.varName)
    ), o = [];
    for (const i of r.schema.variables) {
      if (a.has(i.name)) continue;
      const n = e === w ? i.default ?? "" : "";
      o.push({
        varName: i.name,
        yamlKey: i.name.startsWith("--") ? i.name.slice(2) : i.name,
        meta: { ...i, source: "schema", plugin: r.manifest.id },
        original: n,
        current: n,
        inTheme: !1,
        mode: e
      });
    }
    o.length > 0 && (this._rows = [...this._rows, ...o]);
  }
  // ─── Save-Flow ──────────────────────────────────────────────────────
  async _save() {
    if (this._dirtyCount() === 0 || this._saveStatus.state === "saving") return;
    const e = this._rows.filter(
      (l) => !l.inTheme && !l.markedForRemoval && l.current !== l.original && l.current !== ""
    ).length, r = this._rows.filter(
      (l) => l.inTheme && !l.markedForRemoval && l.current !== l.original
    ).length, a = this._removingCount(), o = [];
    r > 0 && o.push(`${r} bestehende Änderung${r === 1 ? "" : "en"}`), e > 0 && o.push(`${e} neue Variable${e === 1 ? "" : "n"}`), a > 0 && o.push(`${a} Entfernung${a === 1 ? "" : "en"}`);
    const n = `${o.join(" + ")} in '${this.file}' > '${this.themeName}' speichern?

Ein Backup wird automatisch unter themes/.backups/ angelegt.`;
    if (!confirm(n)) return;
    this._saveStatus = { state: "saving" };
    const c = this._buildSaveMerge();
    try {
      const l = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/save_theme",
        file: this.file,
        theme_name: this.themeName,
        variables: c
      });
      this._originalFullTheme = c, this._rows = this._rows.filter((d) => !d.markedForRemoval).map((d) => d.inTheme ? { ...d, original: d.current } : d.current !== d.original && d.current !== "" ? { ...d, original: d.current, inTheme: !0 } : d), this._activeTab !== z && this._ensurePluginRows(this._activeTab, this._activeMode), this._saveStatus = { state: "success", backup: l.backup };
    } catch (l) {
      const d = l instanceof Error ? l.message : String(l);
      this._saveStatus = { state: "error", msg: d };
    }
  }
  /**
   * Konstruiert das vollständige Theme-Object aus dem Original-YAML +
   * Editor-Zustand. Bewahrt Key-Form (mit/ohne `--`) und Dict-Strukturen.
   */
  _buildSaveMerge() {
    const t = {}, e = this._originalFullTheme.modes && typeof this._originalFullTheme.modes == "object" ? this._originalFullTheme.modes : {}, r = /* @__PURE__ */ new Set();
    for (const [o, i] of Object.entries(this._originalFullTheme)) {
      if (o === "modes") continue;
      if (typeof i == "object" && i !== null) {
        t[o] = i;
        continue;
      }
      const n = o.startsWith("--") ? o.slice(2) : o, c = this._rows.find(
        (l) => l.mode === w && l.inTheme && l.yamlKey === n
      );
      if (c) {
        if (c.markedForRemoval) {
          r.add(c.varName);
          continue;
        }
        t[o] = c.current, r.add(c.varName);
      } else
        t[o] = i;
    }
    for (const o of this._rows)
      o.mode === w && (o.inTheme || o.markedForRemoval || o.current !== o.original && o.current !== "" && (r.has(o.varName) || (t[o.yamlKey] = o.current)));
    const a = this._modes.filter((o) => o !== w);
    if (a.length > 0 || Object.keys(e).length > 0) {
      const o = {}, i = /* @__PURE__ */ new Set([
        ...Object.keys(e),
        ...a
      ]);
      for (const n of i) {
        const c = e[n] || {}, l = {}, d = /* @__PURE__ */ new Set();
        for (const [u, p] of Object.entries(c)) {
          if (typeof p == "object" && p !== null) {
            l[u] = p;
            continue;
          }
          const m = u.startsWith("--") ? u.slice(2) : u, b = this._rows.find(
            (x) => x.mode === n && x.inTheme && x.yamlKey === m
          );
          if (b) {
            if (b.markedForRemoval) {
              d.add(b.varName);
              continue;
            }
            l[u] = b.current, d.add(b.varName);
          } else
            l[u] = p;
        }
        for (const u of this._rows)
          u.mode === n && (u.inTheme || u.markedForRemoval || u.current !== u.original && u.current !== "" && (d.has(u.varName) || (l[u.yamlKey] = u.current)));
        Object.keys(l).length > 0 && (o[n] = l);
      }
      Object.keys(o).length > 0 && (t.modes = o);
    }
    return t;
  }
  // ─── Kategorien-Gruppierung ─────────────────────────────────────────
  _groupByCategory(t) {
    const e = /* @__PURE__ */ new Map();
    for (const n of te())
      for (const c of n.schema.categories)
        e.has(c.id) || e.set(c.id, c);
    const r = /* @__PURE__ */ new Map();
    for (const n of t) {
      let c;
      n.meta.source === "heuristic" ? c = _e.id : n.meta.category && e.has(n.meta.category) ? c = n.meta.category : c = xe.id;
      const l = r.get(c) ?? [];
      l.push(n), r.set(c, l);
    }
    const a = [];
    for (const [n, c] of e) {
      const l = r.get(n);
      l && l.length > 0 && a.push({ ...c, rows: l });
    }
    const o = r.get(_e.id);
    o && o.length > 0 && a.push({ ..._e, rows: o });
    const i = r.get(xe.id);
    return i && i.length > 0 && a.push({ ...xe, rows: i }), a;
  }
  // ─── CSS-Variable-Anwendung ─────────────────────────────────────────
  _setCssVar(t, e) {
    document.documentElement.style.setProperty(t, e), this._appliedVars.add(t);
  }
  _revertCssVar(t) {
    document.documentElement.style.removeProperty(t), this._appliedVars.delete(t);
  }
  _revertAll() {
    for (const t of this._appliedVars)
      document.documentElement.style.removeProperty(t);
    this._appliedVars.clear();
  }
  // ─── Row-Mutationen ─────────────────────────────────────────────────
  _changeRow(t, e) {
    this._setCssVar(t.varName, e), this._rows = this._rows.map(
      (r) => r.varName === t.varName && r.mode === t.mode ? { ...r, current: e } : r
    );
  }
  _resetRow(t) {
    this._revertCssVar(t.varName), this._rows = this._rows.map(
      (e) => e.varName === t.varName && e.mode === t.mode ? { ...e, current: e.original, markedForRemoval: !1 } : e
    );
  }
  _removeRow(t) {
    t.inTheme && (this._revertCssVar(t.varName), this._rows = this._rows.map(
      (e) => e.varName === t.varName && e.mode === t.mode ? { ...e, markedForRemoval: !0 } : e
    ));
  }
  _resetAll() {
    const t = this._dirtyCount();
    t !== 0 && confirm(
      `${t} ungespeicherte Änderung(en) werden verworfen (über alle Modes und Tabs). Fortfahren?`
    ) && (this._revertAll(), this._rows = this._rows.map((e) => ({
      ...e,
      current: e.original,
      markedForRemoval: !1
    })));
  }
  _isRowDirty(t) {
    return t.current !== t.original || t.markedForRemoval === !0;
  }
  _dirtyCount() {
    return this._rows.reduce(
      (t, e) => t + (this._isRowDirty(e) ? 1 : 0),
      0
    );
  }
  _modeDirtyCount(t) {
    return this._rows.reduce(
      (e, r) => e + (r.mode === t && this._isRowDirty(r) ? 1 : 0),
      0
    );
  }
  _removingCount() {
    return this._rows.reduce(
      (t, e) => t + (e.markedForRemoval ? 1 : 0),
      0
    );
  }
  _onBack() {
    const t = this._dirtyCount();
    t > 0 && !confirm(
      `${t} ungespeicherte Änderung(en) gehen verloren. Trotzdem zurück?`
    ) || (this._revertAll(), this.dispatchEvent(
      new CustomEvent("back-to-picker", { bubbles: !0, composed: !0 })
    ));
  }
  // ─── Tab/Mode-Handling ──────────────────────────────────────────────
  _onTabSelect(t) {
    t !== this._activeTab && (t !== z && this._ensurePluginRows(t, this._activeMode), this._activeTab = t);
  }
  _onModeSelect(t) {
    t !== this._activeMode && (this._activeTab !== z && this._ensurePluginRows(this._activeTab, t), this._activeMode = t);
  }
  _visibleRows() {
    const t = this._rows.filter((e) => e.mode === this._activeMode);
    return this._activeTab === z ? t.filter((e) => e.inTheme) : t.filter((e) => e.meta.plugin === this._activeTab);
  }
  // ─── Rendering ──────────────────────────────────────────────────────
  render() {
    return s`
      <div class="toolbar">
        <button class="back-btn" @click=${this._onBack}>← Zurück</button>
        <div class="breadcrumb">
          <div class="theme-name">${this.themeName}</div>
          <code>${this.file}</code>
        </div>
        ${this._renderDirtyBadge()}
        <button
          class="preview-toggle ${this._showPreview ? "active" : ""}"
          @click=${this._togglePreview}
          title="Live-Preview eines Dashboards in einem iframe daneben"
        >
          👁 Preview
        </button>
        <button
          class="danger-btn"
          ?disabled=${this._dirtyCount() === 0 || this._saveStatus.state === "saving"}
          @click=${this._resetAll}
        >
          Alles verwerfen
        </button>
        <button
          class="primary-btn"
          ?disabled=${this._dirtyCount() === 0 || this._saveStatus.state === "saving"}
          @click=${this._save}
        >
          ${this._saveStatus.state === "saving" ? "Speichere…" : "Speichern"}
        </button>
      </div>
      ${this._renderModeBar()} ${this._renderTabs()}
      ${this._renderSaveStatus()}
      <div class="body-grid ${this._showPreview ? "with-preview" : ""}">
        <div class="editor-col">${this._renderBody()}</div>
        ${this._showPreview ? s`<div class="preview-col">
              <ts-preview-pane
                .src=${this._previewSrc}
                .overrides=${this._currentOverrides()}
                @src-changed=${this._onPreviewSrcChange}
              ></ts-preview-pane>
            </div>` : ""}
      </div>
    `;
  }
  _togglePreview() {
    this._showPreview = !this._showPreview, this.classList.toggle("with-preview", this._showPreview);
  }
  _onPreviewSrcChange(t) {
    this._previewSrc = t.detail.src;
  }
  /**
   * Aktuelle CSS-Overrides als Map — alle Rows wo `current !== original`,
   * unabhängig vom Mode (Live-Preview ist mode-agnostisch).
   */
  _currentOverrides() {
    const t = /* @__PURE__ */ new Map();
    for (const e of this._rows)
      e.current !== e.original && t.set(e.varName, e.current);
    return t;
  }
  _renderModeBar() {
    return this._loading || this._error || this._modes.length === 1 ? "" : s`
      <div class="mode-bar">
        <span class="label">Mode:</span>
        ${this._modes.map((t) => {
      const e = this._modeDirtyCount(t);
      return s`
            <button
              class="mode-btn ${this._activeMode === t ? "active" : ""}"
              @click=${() => this._onModeSelect(t)}
            >
              ${we(t)}
              ${e > 0 ? s`<span class="mode-count">${e} ●</span>` : ""}
            </button>
          `;
    })}
      </div>
    `;
  }
  _renderTabs() {
    if (this._loading || this._error) return "";
    const t = this._rows.filter(
      (r) => r.inTheme && r.mode === this._activeMode
    ).length, e = [
      { id: z, label: "Im Theme", count: t }
    ];
    for (const r of te())
      e.push({
        id: r.manifest.id,
        label: r.manifest.name,
        count: r.schema.variables.length
      });
    return s`
      <div class="tabs" role="tablist">
        ${e.map(
      (r) => s`
            <button
              class="tab ${this._activeTab === r.id ? "active" : ""}"
              role="tab"
              aria-selected=${this._activeTab === r.id}
              @click=${() => this._onTabSelect(r.id)}
            >
              ${r.label}
              <span class="tab-count">${r.count}</span>
            </button>
          `
    )}
      </div>
    `;
  }
  _renderSaveStatus() {
    const t = this._saveStatus;
    return t.state === "idle" || t.state === "saving" ? "" : t.state === "success" ? s`
        <div class="status-banner success">
          ✓ Gespeichert${t.backup ? s` &middot; Backup: <code>${t.backup}</code>` : ""}
        </div>
      ` : s`
      <div class="status-banner error">
        ✗ Speichern fehlgeschlagen: ${t.msg}
      </div>
    `;
  }
  _renderDirtyBadge() {
    const t = this._dirtyCount();
    if (t === 0) return "";
    const e = this._rows.filter(
      (i) => !i.inTheme && !i.markedForRemoval && i.current !== i.original && i.current !== ""
    ).length, r = this._removingCount(), a = [];
    e > 0 && a.push(`${e} neu`), r > 0 && a.push(`${r} ×`);
    const o = a.length > 0 ? ` (${a.join(", ")})` : "";
    return s`<span class="dirty-badge"
      >${t} Änderung${t === 1 ? "" : "en"}${o}</span
    >`;
  }
  _renderBody() {
    if (this._loading)
      return s`<div class="loading">Lade Theme…</div>`;
    if (this._error)
      return s`<div class="error">Fehler: ${this._error}</div>`;
    const t = this._visibleRows();
    if (t.length === 0) {
      const r = this._activeTab === z ? this._activeMode === w ? "Keine editierbaren Variablen in diesem Theme." : `Keine Override-Variablen für Mode '${we(this._activeMode)}' im Theme. Wechsle auf einen Plugin-Tab um welche hinzuzufügen.` : "Keine Variablen in diesem Plugin-Tab.";
      return s`<div class="empty">${r}</div>`;
    }
    const e = this._groupByCategory(t);
    return s`
      ${this._activeTab === z && this._activeMode === w && this._skippedKeys.length > 0 ? s`<div class="notice">
            Diese Theme-Datei enthält komplexe Werte unter
            ${this._skippedKeys.map(
      (r, a) => s`${a > 0 ? ", " : ""}<code>${r}</code>`
    )},
            die der Variablen-Editor nicht abbildet (verschachtelte
            Strukturen).
          </div>` : ""}
      ${this._activeMode !== w ? s`<div class="notice">
            <strong>${we(this._activeMode)}-Mode:</strong> Edits hier
            landen unter <code>modes.${this._activeMode}</code> im YAML und
            wirken in HA nur wenn dieser Mode aktiv ist.
            Live-Preview greift dennoch unabhängig vom HA-Mode — schalte HA
            ggf. selbst um, um den richtigen Render-Kontext zu sehen.
          </div>` : ""}
      ${this._activeTab !== z ? s`<div class="notice">
            <strong>Plugin-Tab:</strong> alle ${t.length} Schema-Variablen
            werden gezeigt. Variablen mit
            <span class="row-tag default">default</span>-Tag stehen
            (noch) nicht im Theme. Sobald du einen Wert änderst, wird die
            Variable beim Speichern als
            ${this._activeMode === w ? "Top-Level-Eintrag" : s`Override unter <code>modes.${this._activeMode}</code>`}
            ins Theme aufgenommen.
          </div>` : ""}
      ${e.map((r) => this._renderCategory(r))}
    `;
  }
  _renderCategory(t) {
    return s`
      <div class="category-card">
        <h3>
          <span>${t.label}</span>
          <span class="count">${t.rows.length}</span>
        </h3>
        ${t.rows.map((e) => this._renderRow(e))}
      </div>
    `;
  }
  _renderRow(t) {
    const e = t.current !== t.original, r = t.markedForRemoval === !0, a = e || r, o = !t.inTheme && !e && !r, i = !t.inTheme && e && t.current !== "" && !r, n = ["row"];
    return e && !r && n.push("dirty"), r && n.push("removed"), s`
      <div class=${n.join(" ")}>
        <div class="meta-cell">
          <code class="var-name">
            ${a ? s`<span class="dirty-dot">●</span>` : ""}
            ${t.varName}
            ${t.meta.source === "heuristic" ? s`<span class="row-tag heuristic">${t.meta.type}</span>` : ""}
            ${o ? s`<span class="row-tag default">default</span>` : ""}
            ${i ? s`<span class="row-tag adding">+ wird ergänzt</span>` : ""}
            ${r ? s`<span class="row-tag removing">× wird entfernt</span>` : ""}
          </code>
          ${t.meta.description ? s`<span class="description">${t.meta.description}</span>` : ""}
        </div>
        <div class="control-cell">${this._renderControl(t)}</div>
        <button
          class="reset-btn"
          ?disabled=${!a}
          @click=${() => this._resetRow(t)}
          title="Auf Original zurücksetzen (verwirft auch eine Entfernen-Markierung)"
        >
          ↺
        </button>
        <button
          class="remove-btn"
          ?disabled=${!t.inTheme || r}
          @click=${() => this._removeRow(t)}
          title=${t.inTheme ? "Variable beim nächsten Speichern aus dem Theme entfernen" : "Nicht im Theme — nichts zu entfernen"}
        >
          🗑
        </button>
      </div>
    `;
  }
  _renderControl(t) {
    const e = (r) => this._changeRow(t, r.detail.value);
    switch (t.meta.type) {
      case "color":
        return s`
          <ts-color-picker
            .value=${t.current}
            @value-changed=${e}
          ></ts-color-picker>
        `;
      case "length":
        return s`
          <ts-length-slider
            .value=${t.current}
            .units=${t.meta.unit ?? ["px"]}
            .min=${t.meta.min ?? 0}
            .max=${t.meta.max ?? 100}
            @value-changed=${e}
          ></ts-length-slider>
        `;
      case "background":
        return s`
          <ts-background-picker
            .value=${t.current}
            @value-changed=${e}
          ></ts-background-picker>
        `;
      default:
        return s`
          <ts-raw-input
            .value=${t.current}
            @value-changed=${e}
          ></ts-raw-input>
        `;
    }
  }
};
_.styles = C`
    :host {
      display: block;
      max-width: 1100px;
      margin: 0 auto;
      font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
      transition: max-width 0.15s ease;
    }
    :host(.with-preview) {
      max-width: none;
    }
    .body-grid {
      display: block;
    }
    .body-grid.with-preview {
      display: grid;
      grid-template-columns: minmax(520px, 1fr) minmax(480px, 1fr);
      gap: 16px;
      align-items: start;
    }
    .editor-col,
    .preview-col {
      min-width: 0;
    }
    .preview-toggle {
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 6px;
      padding: 8px 14px;
      cursor: pointer;
      color: inherit;
      font: inherit;
      font-size: 0.9rem;
    }
    .preview-toggle:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .preview-toggle.active {
      background: var(--primary-color);
      color: #fff;
      border-color: var(--primary-color);
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    .back-btn,
    .danger-btn,
    .primary-btn {
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 6px;
      padding: 8px 14px;
      cursor: pointer;
      color: inherit;
      font: inherit;
      font-size: 0.9rem;
    }
    .back-btn:hover,
    .danger-btn:hover,
    .primary-btn:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .danger-btn {
      color: var(--error-color, #db4437);
      border-color: var(--error-color, #db4437);
    }
    .primary-btn[disabled],
    .danger-btn[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .breadcrumb {
      flex: 1;
      min-width: 200px;
      color: var(--secondary-text-color);
      font-size: 0.95rem;
    }
    .breadcrumb .theme-name {
      color: var(--primary-text-color);
      font-weight: 500;
      font-size: 1.1rem;
    }
    .breadcrumb code {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    .dirty-badge {
      padding: 4px 10px;
      border-radius: 12px;
      background: var(--warning-color, #ffa600);
      color: #000;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .mode-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px;
      flex-wrap: wrap;
    }
    .mode-bar .label {
      color: var(--secondary-text-color);
      font-size: 0.9rem;
      margin-right: 4px;
    }
    .mode-btn {
      padding: 5px 12px;
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 999px;
      cursor: pointer;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 0.85rem;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .mode-btn:hover {
      color: var(--primary-text-color);
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
    }
    .mode-btn.active {
      color: #fff;
      background: var(--primary-color);
      border-color: var(--primary-color);
    }
    .mode-btn .mode-count {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    .tabs {
      display: flex;
      gap: 4px;
      margin: 0 0 16px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      flex-wrap: wrap;
    }
    .tab {
      padding: 8px 14px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 0.9rem;
      margin-bottom: -1px;
      display: flex;
      align-items: center;
      gap: 6px;
      border-radius: 6px 6px 0 0;
    }
    .tab:hover {
      color: var(--primary-text-color);
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
    }
    .tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
      font-weight: 500;
    }
    .tab-count {
      padding: 1px 8px;
      border-radius: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }
    .tab.active .tab-count {
      background: var(--primary-color);
      color: #fff;
    }

    .loading,
    .error,
    .empty {
      padding: 40px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    .category-card {
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      padding: 20px;
      margin-bottom: 16px;
    }
    .category-card h3 {
      margin: 0 0 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1rem;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .category-card h3 .count {
      color: var(--secondary-text-color);
      font-weight: 400;
      font-size: 0.85rem;
    }
    .row {
      display: grid;
      grid-template-columns: minmax(220px, 320px) 1fr auto auto;
      gap: 12px;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }
    .row:last-child {
      border-bottom: none;
    }
    .row.dirty {
      background: linear-gradient(
        to right,
        rgba(255, 166, 0, 0.08) 0%,
        transparent 30%
      );
      margin: 0 -20px;
      padding-left: 20px;
      padding-right: 20px;
    }
    .meta-cell {
      min-width: 0;
    }
    .var-name {
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.9rem;
      color: var(--primary-text-color);
      display: block;
      word-break: break-all;
    }
    .var-name .dirty-dot {
      color: var(--warning-color);
      margin-right: 4px;
    }
    .description {
      font-size: 0.9rem;
      color: var(--primary-text-color);
      opacity: 0.78;
      margin-top: 6px;
      display: block;
      line-height: 1.45;
    }
    .row-tag {
      display: inline-block;
      margin-left: 8px;
      padding: 1px 6px;
      border-radius: 8px;
      font-size: 0.7rem;
      font-family: var(--paper-font-body1_-_font-family);
      vertical-align: middle;
    }
    .row-tag.heuristic {
      background: rgba(0, 0, 0, 0.08);
      color: var(--secondary-text-color);
    }
    .row-tag.default {
      background: rgba(3, 169, 244, 0.12);
      color: var(--info-color, var(--primary-color));
    }
    .row-tag.adding {
      background: rgba(67, 160, 71, 0.15);
      color: var(--success-color, #43a047);
      font-weight: 500;
    }
    .row-tag.removing {
      background: rgba(219, 68, 55, 0.15);
      color: var(--error-color, #db4437);
      font-weight: 500;
    }
    .row.removed {
      background: linear-gradient(
        to right,
        rgba(219, 68, 55, 0.06) 0%,
        transparent 30%
      );
      margin: 0 -20px;
      padding-left: 20px;
      padding-right: 20px;
    }
    .row.removed .var-name,
    .row.removed .description {
      text-decoration: line-through;
      opacity: 0.55;
    }
    .row.removed .control-cell {
      opacity: 0.45;
      pointer-events: none;
    }
    .remove-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      font-size: 1rem;
      padding: 6px 8px;
      border-radius: 4px;
      line-height: 1;
    }
    .remove-btn:hover:not([disabled]) {
      background: rgba(219, 68, 55, 0.1);
      color: var(--error-color);
    }
    .remove-btn[disabled] {
      opacity: 0.2;
      cursor: not-allowed;
    }
    .reset-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      font-size: 1.2rem;
      padding: 6px 8px;
      border-radius: 4px;
      line-height: 1;
    }
    .reset-btn:hover:not([disabled]) {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      color: var(--primary-text-color);
    }
    .reset-btn[disabled] {
      opacity: 0.25;
      cursor: not-allowed;
    }
    .notice {
      padding: 12px 16px;
      background: rgba(3, 169, 244, 0.08);
      border-left: 4px solid var(--info-color, var(--primary-color));
      border-radius: 4px;
      margin-bottom: 16px;
      font-size: 0.9rem;
    }
    .notice code {
      font-family: ui-monospace, monospace;
      background: rgba(0, 0, 0, 0.06);
      padding: 1px 4px;
      border-radius: 3px;
    }
    .status-banner {
      padding: 10px 16px;
      border-radius: 4px;
      margin-bottom: 16px;
      font-size: 0.9rem;
    }
    .status-banner.success {
      background: rgba(67, 160, 71, 0.12);
      border-left: 4px solid var(--success-color, #43a047);
      color: var(--primary-text-color);
    }
    .status-banner.error {
      background: rgba(219, 68, 55, 0.12);
      border-left: 4px solid var(--error-color, #db4437);
      color: var(--primary-text-color);
    }
    .status-banner code {
      font-family: ui-monospace, monospace;
      background: rgba(0, 0, 0, 0.08);
      padding: 1px 4px;
      border-radius: 3px;
    }
  `;
k([
  g({ attribute: !1 })
], _.prototype, "hass", 2);
k([
  g({ type: String })
], _.prototype, "file", 2);
k([
  g({ type: String })
], _.prototype, "themeName", 2);
k([
  h()
], _.prototype, "_loading", 2);
k([
  h()
], _.prototype, "_error", 2);
k([
  h()
], _.prototype, "_rows", 2);
k([
  h()
], _.prototype, "_skippedKeys", 2);
k([
  h()
], _.prototype, "_saveStatus", 2);
k([
  h()
], _.prototype, "_activeTab", 2);
k([
  h()
], _.prototype, "_activeMode", 2);
k([
  h()
], _.prototype, "_modes", 2);
k([
  h()
], _.prototype, "_showPreview", 2);
k([
  h()
], _.prototype, "_previewSrc", 2);
_ = k([
  M("ts-editor-view")
], _);
var Kr = Object.defineProperty, Zr = Object.getOwnPropertyDescriptor, N = (t, e, r, a) => {
  for (var o = a > 1 ? void 0 : a ? Zr(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (o = (a ? n(e, r, o) : n(o)) || o);
  return a && o && Kr(e, r, o), o;
};
let E = class extends v {
  constructor() {
    super(...arguments), this._loading = !0, this._modules = [], this._errors = [], this._rootExists = !0, this._loadError = null;
  }
  connectedCallback() {
    super.connectedCallback(), this._load();
  }
  async _load() {
    this._loading = !0, this._loadError = null;
    try {
      const t = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/list_modules"
      });
      this._modules = t.modules, this._errors = t.errors, this._rootExists = t.root_exists;
    } catch (t) {
      this._loadError = t instanceof Error ? t.message : String(t);
    } finally {
      this._loading = !1;
    }
  }
  render() {
    return this._loading ? s`<div class="empty">Lade Module…</div>` : this._loadError ? s`<div class="error">Fehler: ${this._loadError}</div>` : s`
      <h2>Welches Bubble-Card-Modul möchtest du anpassen?</h2>
      ${this._rootExists ? this._modules.length === 0 ? s`<div class="empty">
              Keine Module in <code>bubble_card/modules/</code> gefunden.
            </div>` : s`
              <div class="list">
                ${this._modules.map(
      (t) => s`
                    <button
                      class="item"
                      @click=${() => this._select(t)}
                      title=${t.file}
                    >
                      <div class="info">
                        <div class="name-row">
                          <span class="name">${t.name}</span>
                          <span class="module-id">${t.module_id}</span>
                        </div>
                        ${t.description ? s`<div class="desc">${t.description}</div>` : ""}
                        <div class="meta">
                          <span class="tag">${t.file}</span>
                          ${t.is_global ? s`<span class="tag global">global</span>` : ""}
                          ${t.has_code ? "" : s`<span class="tag no-code">kein code</span>`}
                          ${t.supported.map(
        (e) => s`<span class="tag">${e}</span>`
      )}
                          ${t.version ? s`<span class="tag">v${t.version}</span>` : ""}
                        </div>
                      </div>
                      <div class="arrow">→</div>
                    </button>
                  `
    )}
              </div>
            ` : s`<div class="empty">
            Kein <code>bubble_card/modules/</code>-Verzeichnis gefunden.
            Bubble Card legt das automatisch an, sobald du dein erstes
            Modul speicherst — oder leg es manuell unter
            <code>&lt;config&gt;/bubble_card/modules/</code> an.
          </div>`}
      ${this._errors.length > 0 ? s`
            <div class="errors-list">
              <h3>YAML-Fehler in folgenden Dateien:</h3>
              <ul>
                ${this._errors.map(
      (t) => s`<li>${t.file}: ${t.error}</li>`
    )}
              </ul>
            </div>
          ` : ""}
    `;
  }
  _select(t) {
    this.dispatchEvent(
      new CustomEvent("module-selected", {
        detail: { file: t.file, module_id: t.module_id },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
E.styles = C`
    :host {
      display: block;
      max-width: 800px;
      margin: 0 auto;
    }
    h2 {
      font-weight: 400;
      margin: 0 0 24px;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      cursor: pointer;
      text-align: left;
      width: 100%;
      border: none;
      color: inherit;
      font: inherit;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
    }
    .item:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    }
    .item:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .info {
      flex: 1;
      min-width: 0;
    }
    .name-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .name {
      font-weight: 500;
      font-size: 1.05rem;
    }
    .module-id {
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    .desc {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
      margin-top: 4px;
    }
    .meta {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 6px;
    }
    .tag {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.06);
      font-size: 0.7rem;
      color: var(--secondary-text-color);
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
    }
    .tag.global {
      background: rgba(67, 160, 71, 0.15);
      color: var(--success-color, #43a047);
    }
    .tag.no-code {
      background: rgba(219, 68, 55, 0.12);
      color: var(--error-color, #db4437);
    }
    .arrow {
      color: var(--secondary-text-color);
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    .empty,
    .error {
      padding: 24px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    .errors-list {
      margin-top: 24px;
      padding: 12px 16px;
      background: rgba(255, 152, 0, 0.1);
      border-left: 4px solid var(--warning-color);
      border-radius: 4px;
    }
    .errors-list h3 {
      margin: 0 0 8px;
      font-size: 0.9rem;
      color: var(--warning-color);
    }
    .errors-list li {
      font-size: 0.85rem;
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
    }
    code {
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      background: rgba(0, 0, 0, 0.06);
      padding: 1px 4px;
      border-radius: 3px;
    }
  `;
N([
  g({ attribute: !1 })
], E.prototype, "hass", 2);
N([
  h()
], E.prototype, "_loading", 2);
N([
  h()
], E.prototype, "_modules", 2);
N([
  h()
], E.prototype, "_errors", 2);
N([
  h()
], E.prototype, "_rootExists", 2);
N([
  h()
], E.prototype, "_loadError", 2);
E = N([
  M("ts-module-picker")
], E);
var qr = Object.defineProperty, Jr = Object.getOwnPropertyDescriptor, P = (t, e, r, a) => {
  for (var o = a > 1 ? void 0 : a ? Jr(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (o = (a ? n(e, r, o) : n(o)) || o);
  return a && o && qr(e, r, o), o;
};
function Yr(t) {
  const e = /* @__PURE__ */ new Map(), r = /var\(\s*(--[\w-]+)/g;
  let a;
  for (; (a = r.exec(t)) !== null; ) {
    const o = a[1];
    let i = a.index + a[0].length;
    for (; i < t.length && /\s/.test(t[i]); ) i++;
    let n;
    if (t[i] === ",") {
      for (i++; i < t.length && /\s/.test(t[i]); ) i++;
      const l = i;
      let d = 1;
      for (; i < t.length && d > 0; ) {
        const p = t[i];
        if (p === "(") d++;
        else if (p === ")" && (d--, d === 0))
          break;
        i++;
      }
      const u = t.slice(l, i).trim();
      u.length > 0 && (n = u);
    }
    const c = e.get(o);
    c ? (c.count++, !c.fallback && n && (c.fallback = n)) : e.set(o, { name: o, fallback: n, count: 1 });
  }
  return [...e.values()].sort((o, i) => o.name.localeCompare(i.name));
}
let B = class extends v {
  constructor() {
    super(...arguments), this.file = "", this.moduleId = "", this._loading = !0, this._error = null, this._content = {}, this._original = {}, this._saveStatus = { state: "idle" }, this._onBeforeUnload = (t) => {
      this._isDirty() && (t.preventDefault(), t.returnValue = "");
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("beforeunload", this._onBeforeUnload), this._load();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("beforeunload", this._onBeforeUnload);
  }
  updated(t) {
    const e = t.has("file") && t.get("file") !== void 0, r = t.has("moduleId") && t.get("moduleId") !== void 0;
    (e || r) && this._load();
  }
  async _load() {
    this._loading = !0, this._error = null, this._saveStatus = { state: "idle" };
    try {
      const t = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/get_module",
        file: this.file,
        module_id: this.moduleId
      });
      this._content = { ...t.content }, this._original = JSON.parse(JSON.stringify(t.content));
    } catch (t) {
      this._error = t instanceof Error ? t.message : String(t);
    } finally {
      this._loading = !1;
    }
  }
  _isDirty() {
    return JSON.stringify(this._content) !== JSON.stringify(this._original);
  }
  _onBack() {
    this._isDirty() && !confirm(
      "Ungespeicherte Änderungen am Modul gehen verloren. Trotzdem zurück?"
    ) || this.dispatchEvent(
      new CustomEvent("back-to-picker", { bubbles: !0, composed: !0 })
    );
  }
  _setField(t, e) {
    this._content = { ...this._content, [t]: e };
  }
  async _save() {
    if (!(!this._isDirty() || this._saveStatus.state === "saving") && confirm(
      `Modul '${this.moduleId}' in '${this.file}' speichern?

Ein Backup wird automatisch unter bubble_card/.backups/ angelegt.`
    )) {
      this._saveStatus = { state: "saving" };
      try {
        const t = await this.hass.connection.sendMessagePromise({
          type: "theme_studio/save_module",
          file: this.file,
          module_id: this.moduleId,
          content: this._content
        });
        this._original = JSON.parse(JSON.stringify(this._content)), this._saveStatus = { state: "success", backup: t.backup };
      } catch (t) {
        const e = t instanceof Error ? t.message : String(t);
        this._saveStatus = { state: "error", msg: e };
      }
    }
  }
  _resetAll() {
    this._isDirty() && confirm(
      "Alle Änderungen am Modul werden auf den Original-Zustand zurückgesetzt. Fortfahren?"
    ) && (this._content = JSON.parse(JSON.stringify(this._original)));
  }
  render() {
    if (this._loading)
      return s`<div class="loading">Lade Modul…</div>`;
    if (this._error)
      return s`<div class="error">Fehler: ${this._error}</div>`;
    const t = this._content.name || this.moduleId, e = this._content.description || "", r = this._content.version || "", a = Array.isArray(this._content.supported) ? this._content.supported : [], o = this._content.is_global === !0, i = this._content.code || "", n = /* @__PURE__ */ new Set([
      "name",
      "description",
      "version",
      "supported",
      "is_global",
      "code"
    ]), c = Object.keys(this._content).filter(
      (d) => !n.has(d)
    ), l = this._isDirty();
    return s`
      <div class="toolbar">
        <button class="back-btn" @click=${this._onBack}>← Zurück</button>
        <div class="breadcrumb">
          <div class="module-name">${t}</div>
          <code>${this.file} · ${this.moduleId}</code>
        </div>
        ${l ? s`<span class="dirty-badge">geändert</span>` : ""}
        <button
          class="danger-btn"
          ?disabled=${!l || this._saveStatus.state === "saving"}
          @click=${this._resetAll}
        >
          Verwerfen
        </button>
        <button
          class="primary-btn"
          ?disabled=${!l || this._saveStatus.state === "saving"}
          @click=${this._save}
        >
          ${this._saveStatus.state === "saving" ? "Speichere…" : "Speichern"}
        </button>
      </div>

      ${this._renderSaveStatus()}

      <div class="notice">
        <strong>Hinweis:</strong> Bubble Card lädt Module beim
        Card-Render. Nach Save musst du deine Dashboards neu laden
        (Cmd+R), damit die Änderungen wirksam werden.
      </div>

      <div class="card">
        <h3>Metadaten</h3>
        <div class="field">
          <label for="m-name">Name</label>
          <input
            id="m-name"
            type="text"
            .value=${t}
            @input=${(d) => this._setField("name", d.target.value)}
          />
        </div>
        <div class="field">
          <label for="m-desc">Description</label>
          <input
            id="m-desc"
            type="text"
            .value=${e}
            @input=${(d) => this._setField(
      "description",
      d.target.value
    )}
          />
        </div>
        <div class="field">
          <label for="m-version">Version</label>
          <input
            id="m-version"
            type="text"
            .value=${r}
            @input=${(d) => this._setField("version", d.target.value)}
          />
        </div>
        <div class="field">
          <label for="m-supported">Supported</label>
          <input
            id="m-supported"
            type="text"
            .value=${a.join(", ")}
            @input=${this._onSupportedInput}
            placeholder="button, climate, pop-up, separator, …"
            spellcheck="false"
          />
        </div>
        <div class="field-help">
          Komma-getrennte Card-Types (button, climate, cover,
          horizontal-buttons-stack, media-player, pop-up, select,
          separator, sub-buttons).
        </div>
        <div class="field checkbox-field">
          <label for="m-global">is_global</label>
          <input
            id="m-global"
            type="checkbox"
            .checked=${o}
            @change=${(d) => this._setField(
      "is_global",
      d.target.checked
    )}
          />
        </div>
        ${c.length > 0 ? s`<div class="extra-keys">
              Weitere Felder im YAML (werden beim Save 1:1 erhalten):
              ${c.map(
      (d, u) => s`${u > 0 ? ", " : ""}<code>${d}</code>`
    )}
            </div>` : ""}
      </div>

      <div class="card">
        <h3>CSS-Code</h3>
        <div class="code-layout">
          <textarea
            class="code-editor"
            spellcheck="false"
            .value=${i}
            @input=${(d) => this._setField("code", d.target.value)}
          ></textarea>
          ${this._renderVarsSidebar(i)}
        </div>
      </div>
    `;
  }
  _renderVarsSidebar(t) {
    const e = Yr(t);
    return s`
      <aside class="vars-sidebar">
        <h4>
          Verwendete Variablen
          <span class="count">${e.length}</span>
        </h4>
        ${e.length === 0 ? s`<div class="vars-empty">
              Keine <code>var(--…)</code> im Code gefunden.
            </div>` : e.map((r) => this._renderVarItem(r))}
      </aside>
    `;
  }
  _renderVarItem(t) {
    const e = pe(t.name, t.fallback), r = e.source === "schema", a = e.type === "color" && t.fallback ? s`<span class="var-swatch" style=${`background:${t.fallback}`}></span>` : "";
    return s`
      <div class="var-item">
        <div class="var-header">
          <span class="var-name">${a}${t.name}</span>
          ${t.count > 1 ? s`<span class="var-count">×${t.count}</span>` : ""}
        </div>
        <div class="var-tags">
          ${r ? s`<span class="var-tag plugin">${e.plugin}</span>` : s`<span class="var-tag heuristic">heuristik</span>`}
          <span
            class=${`var-tag ${e.type === "color" ? "type-color" : ""}`}
          >${e.type}</span>
          ${r && e.category ? s`<span class="var-tag">${e.category}</span>` : ""}
        </div>
        ${e.description ? s`<div class="var-desc">${e.description}</div>` : ""}
        ${t.fallback ? s`<div class="var-fallback">
              Fallback: <code>${t.fallback}</code>
            </div>` : ""}
      </div>
    `;
  }
  _renderSaveStatus() {
    const t = this._saveStatus;
    return t.state === "idle" || t.state === "saving" ? "" : t.state === "success" ? s`
        <div class="status-banner success">
          ✓ Modul gespeichert${t.backup ? s` &middot; Backup: <code>${t.backup}</code>` : ""}.
          Lade jetzt das Dashboard neu (Cmd+R), damit die Änderung
          wirksam wird.
        </div>
      ` : s`
      <div class="status-banner error">
        ✗ Speichern fehlgeschlagen: ${t.msg}
      </div>
    `;
  }
  _onSupportedInput(t) {
    const r = t.target.value.split(",").map((a) => a.trim()).filter((a) => a.length > 0);
    this._setField("supported", r);
  }
};
B.styles = C`
    :host {
      display: block;
      max-width: 1100px;
      margin: 0 auto;
      font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .back-btn,
    .danger-btn,
    .primary-btn {
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 6px;
      padding: 8px 14px;
      cursor: pointer;
      color: inherit;
      font: inherit;
      font-size: 0.9rem;
    }
    .back-btn:hover,
    .danger-btn:hover,
    .primary-btn:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .danger-btn {
      color: var(--error-color, #db4437);
      border-color: var(--error-color, #db4437);
    }
    .primary-btn[disabled],
    .danger-btn[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .breadcrumb {
      flex: 1;
      min-width: 200px;
      color: var(--secondary-text-color);
      font-size: 0.95rem;
    }
    .breadcrumb .module-name {
      color: var(--primary-text-color);
      font-weight: 500;
      font-size: 1.1rem;
    }
    .breadcrumb code {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    .dirty-badge {
      padding: 4px 10px;
      border-radius: 12px;
      background: var(--warning-color, #ffa600);
      color: #000;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .loading,
    .error {
      padding: 40px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    .card {
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      padding: 20px;
      margin-bottom: 16px;
    }
    .card h3 {
      margin: 0 0 16px;
      font-size: 1rem;
      font-weight: 500;
    }
    .field {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;
    }
    .field.checkbox-field {
      grid-template-columns: 120px auto;
      align-items: center;
    }
    .field label {
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }
    .field input[type="text"],
    .field textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 0.9rem;
    }
    .field input[type="checkbox"] {
      transform: scale(1.2);
      margin: 0;
    }
    .field input:focus,
    .field textarea:focus {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -1px;
      border-color: transparent;
    }
    .field-help {
      grid-column: 2;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      margin-top: -6px;
    }
    .code-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 300px;
      gap: 16px;
      align-items: start;
    }
    @media (max-width: 900px) {
      .code-layout {
        grid-template-columns: 1fr;
      }
    }
    .code-editor {
      width: 100%;
      box-sizing: border-box;
      min-height: 500px;
      padding: 12px 14px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 6px;
      background: var(--code-editor-background-color, var(--secondary-background-color));
      color: var(--primary-text-color);
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.85rem;
      line-height: 1.5;
      resize: vertical;
      white-space: pre;
      tab-size: 2;
    }
    .code-editor:focus {
      outline: 2px solid var(--primary-color);
      outline-offset: -1px;
      border-color: transparent;
    }
    .vars-sidebar {
      position: sticky;
      top: 16px;
      max-height: calc(100vh - 32px);
      overflow-y: auto;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.02));
      padding: 12px;
      font-size: 0.82rem;
    }
    .vars-sidebar h4 {
      margin: 0 0 10px;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .vars-sidebar h4 .count {
      background: rgba(0, 0, 0, 0.08);
      padding: 1px 7px;
      border-radius: 10px;
      font-size: 0.72rem;
      font-weight: 600;
    }
    .vars-empty {
      color: var(--secondary-text-color);
      font-style: italic;
      padding: 8px 4px;
    }
    .var-item {
      padding: 8px 6px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }
    .var-item:last-child {
      border-bottom: none;
    }
    .var-header {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .var-name {
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.82rem;
      color: var(--primary-text-color);
      word-break: break-all;
      flex: 1 1 auto;
      min-width: 0;
    }
    .var-count {
      background: rgba(0, 0, 0, 0.08);
      color: var(--secondary-text-color);
      padding: 0 6px;
      border-radius: 8px;
      font-size: 0.7rem;
      font-weight: 600;
      flex-shrink: 0;
    }
    .var-tags {
      display: flex;
      gap: 4px;
      margin-top: 4px;
      flex-wrap: wrap;
    }
    .var-tag {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.06);
      font-size: 0.68rem;
      color: var(--secondary-text-color);
      font-family: ui-monospace, monospace;
    }
    .var-tag.plugin {
      background: rgba(3, 169, 244, 0.14);
      color: var(--primary-color);
    }
    .var-tag.heuristic {
      background: rgba(255, 166, 0, 0.14);
      color: var(--warning-color, #ffa600);
    }
    .var-tag.type-color {
      background: rgba(67, 160, 71, 0.14);
      color: var(--success-color, #43a047);
    }
    .var-desc {
      color: var(--secondary-text-color);
      font-size: 0.75rem;
      margin-top: 4px;
      line-height: 1.35;
    }
    .var-fallback {
      margin-top: 4px;
      font-size: 0.72rem;
      color: var(--secondary-text-color);
    }
    .var-fallback code {
      font-family: ui-monospace, monospace;
      background: rgba(0, 0, 0, 0.06);
      padding: 1px 4px;
      border-radius: 3px;
      color: var(--primary-text-color);
    }
    .var-swatch {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      margin-right: 4px;
      vertical-align: middle;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .extra-keys {
      margin-top: 12px;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .extra-keys code {
      background: rgba(0, 0, 0, 0.06);
      padding: 1px 4px;
      border-radius: 3px;
      font-family: ui-monospace, monospace;
    }
    .status-banner {
      padding: 10px 16px;
      border-radius: 4px;
      margin-bottom: 16px;
      font-size: 0.9rem;
    }
    .status-banner.success {
      background: rgba(67, 160, 71, 0.12);
      border-left: 4px solid var(--success-color, #43a047);
    }
    .status-banner.error {
      background: rgba(219, 68, 55, 0.12);
      border-left: 4px solid var(--error-color, #db4437);
    }
    .status-banner code {
      font-family: ui-monospace, monospace;
      background: rgba(0, 0, 0, 0.08);
      padding: 1px 4px;
      border-radius: 3px;
    }
    .notice {
      padding: 10px 14px;
      background: rgba(3, 169, 244, 0.08);
      border-left: 4px solid var(--info-color, var(--primary-color));
      border-radius: 4px;
      margin-bottom: 12px;
      font-size: 0.85rem;
    }
  `;
P([
  g({ attribute: !1 })
], B.prototype, "hass", 2);
P([
  g({ type: String })
], B.prototype, "file", 2);
P([
  g({ type: String })
], B.prototype, "moduleId", 2);
P([
  h()
], B.prototype, "_loading", 2);
P([
  h()
], B.prototype, "_error", 2);
P([
  h()
], B.prototype, "_content", 2);
P([
  h()
], B.prototype, "_original", 2);
P([
  h()
], B.prototype, "_saveStatus", 2);
B = P([
  M("ts-module-editor")
], B);
var Xr = Object.defineProperty, Qr = Object.getOwnPropertyDescriptor, A = (t, e, r, a) => {
  for (var o = a > 1 ? void 0 : a ? Qr(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (o = (a ? n(e, r, o) : n(o)) || o);
  return a && o && Xr(e, r, o), o;
};
const f = "default", eo = {
  selection: null,
  full: {},
  scalarsByMode: { [f]: {} },
  modes: [f],
  loading: !1,
  error: null
};
let $ = class extends v {
  constructor() {
    super(...arguments), this._themes = [], this._themesError = null, this._themesLoading = !0, this._sideA = this._freshSide(), this._sideB = this._freshSide(), this._diffOnly = !0, this._copyStatus = { state: "idle" }, this._activeMode = f;
  }
  get _busyCopy() {
    return this._copyStatus.state === "copying";
  }
  _freshSide() {
    return {
      ...eo,
      scalarsByMode: { [f]: {} },
      modes: [f]
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._loadThemes();
  }
  async _loadThemes() {
    this._themesLoading = !0, this._themesError = null;
    try {
      const t = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/list_themes"
      });
      this._themes = t.themes, this._themes.length >= 1 && !this._sideA.selection && await this._setSide("A", this._themes[0]), this._themes.length >= 2 && !this._sideB.selection && await this._setSide("B", this._themes[1]);
    } catch (t) {
      this._themesError = t instanceof Error ? t.message : String(t);
    } finally {
      this._themesLoading = !1;
    }
  }
  async _setSide(t, e) {
    const a = { ...t === "A" ? this._sideA : this._sideB, selection: e };
    if (this._writeSide(t, a), !e) {
      this._writeSide(t, this._freshSide());
      return;
    }
    this._writeSide(t, { ...a, loading: !0, error: null });
    try {
      const o = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/get_theme",
        file: e.file,
        theme_name: e.theme_name
      }), i = this._extractScalarsByMode(o.variables);
      this._writeSide(t, {
        ...a,
        loading: !1,
        full: o.variables,
        scalarsByMode: i,
        modes: Object.keys(i)
      });
    } catch (o) {
      this._writeSide(t, {
        ...a,
        loading: !1,
        error: o instanceof Error ? o.message : String(o)
      });
    }
  }
  _writeSide(t, e) {
    t === "A" ? this._sideA = e : this._sideB = e;
  }
  /**
   * Liefert pro Mode (inkl. "default") die Scalars als yamlKey → string Map.
   * - "default" = Top-Level-Scalars (alles außer dem `modes`-Key)
   * - "light", "dark", … = Einträge aus theme.modes.<mode>
   *
   * Dicts/Arrays werden in beiden Fällen übersprungen — Compare-View
   * vergleicht nur skalare Werte.
   */
  _extractScalarsByMode(t) {
    const e = {
      [f]: {}
    };
    for (const [r, a] of Object.entries(t)) {
      if (r === "modes" && a && typeof a == "object" && !Array.isArray(a)) {
        for (const [o, i] of Object.entries(
          a
        )) {
          if (!i || typeof i != "object") continue;
          const n = {};
          for (const [c, l] of Object.entries(
            i
          ))
            l != null && typeof l != "object" && (n[c] = String(l));
          e[o] = n;
        }
        continue;
      }
      a != null && typeof a != "object" && (e[f][r] = String(a));
    }
    return e;
  }
  /** Union der Modes aus A und B, "default" zuerst, Rest alphabetisch. */
  _availableModes() {
    const t = /* @__PURE__ */ new Set([f]);
    for (const r of this._sideA.modes) t.add(r);
    for (const r of this._sideB.modes) t.add(r);
    const e = [...t].filter((r) => r !== f).sort();
    return [f, ...e];
  }
  _modeLabel(t) {
    return t === f ? "Default" : t.charAt(0).toUpperCase() + t.slice(1);
  }
  _onSelect(t, e) {
    const r = e.target.value;
    if (!r) {
      this._setSide(t, null);
      return;
    }
    const [a, o] = r.split("§§"), i = this._themes.find(
      (n) => n.file === a && n.theme_name === o
    );
    i && this._setSide(t, i);
  }
  render() {
    return this._themesLoading ? s`<div class="loading">Lade Themes…</div>` : this._themesError ? s`<div class="error">Fehler: ${this._themesError}</div>` : this._themes.length < 2 ? s`
        <div class="empty">
          Theme-Switcher braucht mindestens 2 Themes im
          <code>themes/</code>-Verzeichnis (aktuell ${this._themes.length}).
        </div>
      ` : s`
      <div class="header">
        <div class="selector">
          <label>Theme A</label>
          ${this._renderSelector("A", this._sideA.selection)}
        </div>
        <div class="selector">
          <label>Theme B</label>
          ${this._renderSelector("B", this._sideB.selection)}
        </div>
        <div class="filter">
          <input
            id="diff-only"
            type="checkbox"
            .checked=${this._diffOnly}
            @change=${(t) => this._diffOnly = t.target.checked}
          />
          <label for="diff-only">Nur Unterschiede</label>
        </div>
      </div>
      ${this._renderModeSelector()} ${this._renderCopyStatus()}
      ${this._renderBody()}
    `;
  }
  _renderCopyStatus() {
    const t = this._copyStatus;
    return t.state === "idle" || t.state === "copying" ? "" : t.state === "success" ? s`
        <div class="status-banner success">
          ✓ <code>${t.yamlKey}</code> kopiert nach ${t.themeName}
          (${t.modeLabel})${t.backup ? s` &middot; Backup: <code>${t.backup}</code>` : ""}
        </div>
      ` : s`
      <div class="status-banner error">
        ✗ Kopieren fehlgeschlagen: ${t.msg}
      </div>
    `;
  }
  _renderModeSelector() {
    const t = this._availableModes();
    return t.length <= 1 ? "" : (t.includes(this._activeMode) || (this._activeMode = f), s`
      <div class="mode-selector">
        ${t.map((e) => {
      const r = this._sideA.modes.includes(e), a = this._sideB.modes.includes(e), o = e !== f && (!r || !a), i = this._modeLabel(e);
      return s`
            <button
              class=${e === this._activeMode ? "active" : ""}
              @click=${() => this._activeMode = e}
              title=${o ? `Nur in ${r ? "A" : "B"} vorhanden` : ""}
            >
              ${i}${o ? s`<span class="badge-only">${r ? "A" : "B"}</span>` : ""}
            </button>
          `;
    })}
      </div>
    `);
  }
  _renderSelector(t, e) {
    const r = e ? `${e.file}§§${e.theme_name}` : "";
    return s`
      <select @change=${(a) => this._onSelect(t, a)}>
        <option value="">(kein Theme)</option>
        ${this._themes.map(
      (a) => s`
            <option
              value="${a.file}§§${a.theme_name}"
              ?selected=${r === `${a.file}§§${a.theme_name}`}
            >
              ${a.theme_name} (${a.file})
            </option>
          `
    )}
      </select>
    `;
  }
  _renderBody() {
    const t = this._sideA, e = this._sideB;
    if (t.loading || e.loading)
      return s`<div class="loading">Lade Theme-Inhalt…</div>`;
    if (t.error || e.error)
      return s`<div class="error">
        ${t.error ? `A: ${t.error}` : ""} ${e.error ? `B: ${e.error}` : ""}
      </div>`;
    if (!t.selection || !e.selection)
      return s`<div class="empty">Wähle beide Themes oben aus.</div>`;
    const r = this._activeMode, a = t.scalarsByMode[r] ?? {}, o = e.scalarsByMode[r] ?? {}, i = r === f || t.modes.includes(r), n = r === f || e.modes.includes(r), c = this._modeLabel(r), l = Array.from(
      /* @__PURE__ */ new Set([...Object.keys(a), ...Object.keys(o)])
    ).sort(), d = l.map((m) => ({
      key: m,
      valA: a[m] ?? null,
      valB: o[m] ?? null
    })).filter((m) => !this._diffOnly || m.valA === null || m.valB === null ? !0 : m.valA !== m.valB), u = l.reduce((m, b) => {
      const x = a[b] ?? null, j = o[b] ?? null;
      return x === null || j === null ? m + 1 : m + (x !== j ? 1 : 0);
    }, 0), p = r === f ? "" : !i || !n ? s` <em>
              · ${i ? e.selection.theme_name : t.selection.theme_name}
              hat keine ${c}-Mode (Copy würde sie anlegen).
            </em>` : "";
    return s`
      <div class="summary">
        <strong>${c}-Mode:</strong>
        ${t.selection.theme_name} hat ${Object.keys(a).length} Vars,
        ${e.selection.theme_name} hat ${Object.keys(o).length}.
        Insgesamt <strong>${u} Unterschiede</strong> oder einseitige
        Einträge.${p}
      </div>
      ${d.length === 0 ? s`<div class="empty">
            Keine Unterschiede zwischen den Themes in der ${c}-Mode.
          </div>` : s`
            <table>
              <thead>
                <tr>
                  <th class="var-cell">Variable</th>
                  <th class="val-cell">${t.selection.theme_name}</th>
                  <th class="actions">Aktion</th>
                  <th class="val-cell">${e.selection.theme_name}</th>
                </tr>
              </thead>
              <tbody>
                ${d.map((m) => this._renderRow(m.key, m.valA, m.valB))}
              </tbody>
            </table>
          `}
    `;
  }
  _renderRow(t, e, r) {
    const a = t.startsWith("--") ? t : `--${t}`, o = pe(a, e ?? r ?? void 0), i = e !== null && r === null, n = r !== null && e === null, l = [
      "row",
      i ? "only-a" : "",
      n ? "only-b" : "",
      !i && !n && e !== r ? "diff" : ""
    ].filter(Boolean).join(" "), d = e !== null && e !== r, u = r !== null && r !== e;
    return s`
      <tr class=${l}>
        <td class="var-cell">
          ${a}
          ${o.description ? s`<div class="description">${o.description}</div>` : ""}
        </td>
        <td class=${`val-cell ${e === null ? "missing" : ""}`}>
          ${this._renderValue(e)}
        </td>
        <td class="actions">
          <button
            class="copy-btn"
            ?disabled=${!u || this._busyCopy}
            title=${r === null ? "B hat keinen Wert" : `Wert von B nach A kopieren (${this._sideB.selection?.theme_name} → ${this._sideA.selection?.theme_name})`}
            @click=${() => this._copy("B", "A", t, r)}
          >
            ←
          </button>
          <button
            class="copy-btn"
            ?disabled=${!d || this._busyCopy}
            title=${e === null ? "A hat keinen Wert" : `Wert von A nach B kopieren (${this._sideA.selection?.theme_name} → ${this._sideB.selection?.theme_name})`}
            @click=${() => this._copy("A", "B", t, e)}
          >
            →
          </button>
        </td>
        <td class=${`val-cell ${r === null ? "missing" : ""}`}>
          ${this._renderValue(r)}
        </td>
      </tr>
    `;
  }
  _renderValue(t) {
    return t === null ? s`(nicht im Theme)` : /^#[0-9a-f]{3,8}$/i.test(t) || /^(rgba?|hsla?)\(/i.test(t) ? s`<span class="swatch" style="background: ${t}"></span>${t}` : s`${t}`;
  }
  async _copy(t, e, r, a) {
    const o = t === "A" ? this._sideA : this._sideB, i = e === "A" ? this._sideA : this._sideB;
    if (!o.selection || !i.selection) return;
    const n = this._activeMode, c = this._modeLabel(n), d = !(n === f) && !i.modes.includes(n), u = `Kopieren: '${r}' = '${a}' von ${o.selection.theme_name} nach ${i.selection.theme_name} (${i.selection.file})
Mode: ${c}${d ? " — wird neu angelegt" : ""}

Ein Backup von ${i.selection.file} wird automatisch angelegt.`;
    if (!confirm(u)) return;
    this._copyStatus = { state: "copying" };
    const p = this._mergeValue(i.full, n, r, a);
    try {
      const m = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/save_theme",
        file: i.selection.file,
        theme_name: i.selection.theme_name,
        variables: p
      });
      this._setSide(e, i.selection), this._copyStatus = {
        state: "success",
        yamlKey: r,
        themeName: i.selection.theme_name,
        modeLabel: c,
        backup: m.backup
      };
    } catch (m) {
      this._copyStatus = {
        state: "error",
        msg: m instanceof Error ? m.message : String(m)
      };
    }
  }
  /**
   * Liefert ein neues Theme-Dict mit `yamlKey = value` in der gewählten Mode.
   * - mode = "default" → Top-Level
   * - sonst → modes.<mode>.<yamlKey>, modes/Submode werden bei Bedarf angelegt
   * Original-Key-Form (mit/ohne `--`-Prefix) bleibt erhalten falls schon da.
   */
  _mergeValue(t, e, r, a) {
    const o = { ...t }, i = (u) => Object.keys(u).find((m) => (m.startsWith("--") ? m.slice(2) : m) === r) ?? r;
    if (e === f)
      return o[i(o)] = a, o;
    const n = o.modes, c = n && typeof n == "object" && !Array.isArray(n) ? { ...n } : {}, l = c[e], d = l && typeof l == "object" && !Array.isArray(l) ? { ...l } : {};
    return d[i(d)] = a, c[e] = d, o.modes = c, o;
  }
};
$.styles = C`
    :host {
      display: block;
      max-width: 1200px;
      margin: 0 auto;
      font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
    }
    .header {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
      align-items: flex-end;
    }
    .selector {
      flex: 1;
      min-width: 240px;
    }
    .selector label {
      display: block;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
    }
    .selector select {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 0.9rem;
    }
    .filter {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }
    .filter input[type="checkbox"] {
      transform: scale(1.2);
    }
    .mode-selector {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 2px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      border-radius: 6px;
    }
    .mode-selector button {
      background: none;
      border: none;
      padding: 6px 12px;
      cursor: pointer;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 0.85rem;
      border-radius: 4px;
      transition: background 0.15s;
    }
    .mode-selector button:hover {
      background: rgba(0, 0, 0, 0.04);
      color: var(--primary-text-color);
    }
    .mode-selector button.active {
      background: var(--card-background-color);
      color: var(--primary-color);
      font-weight: 500;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    }
    .mode-selector .badge-only {
      display: inline-block;
      margin-left: 6px;
      padding: 1px 5px;
      font-size: 0.7rem;
      background: rgba(3, 169, 244, 0.18);
      color: var(--primary-color);
      border-radius: 3px;
      letter-spacing: 0;
      text-transform: none;
    }
    .empty,
    .error,
    .loading {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      overflow: hidden;
    }
    th,
    td {
      padding: 10px 14px;
      text-align: left;
      vertical-align: top;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
      font-size: 0.88rem;
    }
    th {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
      color: var(--secondary-text-color);
      font-weight: 500;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .var-cell {
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.85rem;
      width: 30%;
    }
    .val-cell {
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      color: var(--primary-text-color);
      word-break: break-all;
      width: 28%;
    }
    .val-cell.missing {
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .val-cell .swatch {
      display: inline-block;
      width: 14px;
      height: 14px;
      vertical-align: middle;
      margin-right: 6px;
      border-radius: 3px;
      border: 1px solid var(--divider-color);
    }
    .row.diff td {
      background: rgba(255, 166, 0, 0.05);
    }
    .row.only-a,
    .row.only-b {
      background: rgba(3, 169, 244, 0.04);
    }
    .actions {
      display: flex;
      gap: 4px;
      justify-content: center;
      width: 80px;
    }
    .copy-btn {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 3px 9px;
      cursor: pointer;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 1rem;
      line-height: 1;
    }
    .copy-btn:hover:not([disabled]) {
      background: rgba(3, 169, 244, 0.12);
      color: var(--primary-color);
      border-color: var(--primary-color);
    }
    .copy-btn[disabled] {
      opacity: 0.25;
      cursor: not-allowed;
    }
    .description {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      margin-top: 4px;
      opacity: 0.85;
    }
    .summary {
      margin-bottom: 12px;
      font-size: 0.9rem;
      color: var(--secondary-text-color);
    }
    .status-banner {
      padding: 10px 14px;
      border-radius: 4px;
      margin-bottom: 12px;
      font-size: 0.9rem;
    }
    .status-banner.success {
      background: rgba(67, 160, 71, 0.12);
      border-left: 4px solid var(--success-color, #43a047);
    }
    .status-banner.error {
      background: rgba(229, 57, 53, 0.12);
      border-left: 4px solid var(--error-color, #e53935);
    }
    .status-banner code {
      background: rgba(0, 0, 0, 0.06);
      padding: 1px 4px;
      border-radius: 3px;
      font-size: 0.85rem;
    }
  `;
A([
  g({ attribute: !1 })
], $.prototype, "hass", 2);
A([
  h()
], $.prototype, "_themes", 2);
A([
  h()
], $.prototype, "_themesError", 2);
A([
  h()
], $.prototype, "_themesLoading", 2);
A([
  h()
], $.prototype, "_sideA", 2);
A([
  h()
], $.prototype, "_sideB", 2);
A([
  h()
], $.prototype, "_diffOnly", 2);
A([
  h()
], $.prototype, "_copyStatus", 2);
A([
  h()
], $.prototype, "_activeMode", 2);
$ = A([
  M("ts-compare-view")
], $);
var to = Object.defineProperty, ro = Object.getOwnPropertyDescriptor, Ct = (t, e, r, a) => {
  for (var o = a > 1 ? void 0 : a ? ro(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (o = (a ? n(e, r, o) : n(o)) || o);
  return a && o && to(e, r, o), o;
};
let ge = class extends v {
  constructor() {
    super(...arguments), this._log = [];
  }
  render() {
    return s`
      <h2>Controls Demo (Step 5 — Smoke-Test)</h2>

      <section>
        <h3>&lt;ts-color-picker&gt;</h3>
        <div class="row">
          <label>Hex:</label>
          <ts-color-picker
            value="#03a9f4"
            @value-changed=${(t) => this._onChange(t, "Hex")}
          ></ts-color-picker>
        </div>
        <div class="row">
          <label>RGBA mit Alpha:</label>
          <ts-color-picker
            value="rgba(255, 152, 0, 0.5)"
            @value-changed=${(t) => this._onChange(t, "RGBA")}
          ></ts-color-picker>
        </div>
        <div class="row">
          <label>var-Reference:</label>
          <ts-color-picker
            value="var(--primary-color)"
            @value-changed=${(t) => this._onChange(t, "Var-Ref")}
          ></ts-color-picker>
        </div>
      </section>

      <section>
        <h3>&lt;ts-length-slider&gt;</h3>
        <div class="row">
          <label>Border-Radius (px nur):</label>
          <ts-length-slider
            value="12px"
            min="0"
            max="40"
            step="1"
            .units=${["px"]}
            @value-changed=${(t) => this._onChange(t, "Radius (px)")}
          ></ts-length-slider>
        </div>
        <div class="row">
          <label>Spacing (px / rem):</label>
          <ts-length-slider
            value="0.75rem"
            min="0"
            max="5"
            step="0.05"
            .units=${["px", "rem"]}
            @value-changed=${(t) => this._onChange(t, "Spacing (px/rem)")}
          ></ts-length-slider>
        </div>
      </section>

      <section>
        <h3>&lt;ts-raw-input&gt;</h3>
        <div class="row">
          <label>Box-Shadow:</label>
          <ts-raw-input
            value="0 2px 4px rgba(0, 0, 0, 0.12)"
            @value-changed=${(t) => this._onChange(t, "Shadow")}
          ></ts-raw-input>
        </div>
        <div class="row">
          <label>Kurzer Wert:</label>
          <ts-raw-input
            value="bold"
            @value-changed=${(t) => this._onChange(t, "Raw kurz")}
          ></ts-raw-input>
        </div>
      </section>

      <section>
        <h3>Event-Log (value-changed)</h3>
        <div class="log">
          ${this._log.length === 0 ? s`<div class="empty">
                Noch keine Events — interagiere mit den Controls oben.
              </div>` : this._log.map(
      (t) => s`
                  <div class="log-entry">
                    <span class="at">${t.at}</span>
                    <span class="tag">${t.label}</span>
                    <span class="value">${t.value}</span>
                  </div>
                `
    )}
        </div>
        <button class="clear-btn" @click=${this._clear}>Log leeren</button>
      </section>
    `;
  }
  _onChange(t, e) {
    const r = t.target.tagName.toLowerCase(), a = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    this._log = [{ tag: r, label: e, value: t.detail.value, at: a }, ...this._log].slice(
      0,
      30
    );
  }
  _clear() {
    this._log = [];
  }
};
ge.styles = C`
    :host {
      display: block;
      max-width: 720px;
      margin: 0 auto;
      font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
    }
    h2 {
      font-weight: 400;
      margin: 0 0 16px;
    }
    section {
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      padding: 20px;
      margin-bottom: 16px;
    }
    section h3 {
      margin: 0 0 16px;
      font-size: 1rem;
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      color: var(--primary-color);
    }
    .row {
      display: grid;
      grid-template-columns: 220px 1fr;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    .row:last-child {
      margin-bottom: 0;
    }
    .row label {
      font-size: 0.9rem;
      color: var(--secondary-text-color);
    }
    .log {
      max-height: 240px;
      overflow-y: auto;
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.8rem;
    }
    .log .empty {
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .log-entry {
      display: grid;
      grid-template-columns: 80px 180px 1fr;
      gap: 8px;
      padding: 4px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }
    .log-entry .at {
      color: var(--secondary-text-color);
    }
    .log-entry .tag {
      color: var(--primary-color);
    }
    .clear-btn {
      margin-top: 8px;
      padding: 4px 10px;
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      cursor: pointer;
      color: inherit;
      font: inherit;
      font-size: 0.85rem;
    }
  `;
Ct([
  h()
], ge.prototype, "_log", 2);
ge = Ct([
  M("ts-controls-demo")
], ge);
var oo = Object.defineProperty, ao = Object.getOwnPropertyDescriptor, T = (t, e, r, a) => {
  for (var o = a > 1 ? void 0 : a ? ao(e, r) : e, i = t.length - 1, n; i >= 0; i--)
    (n = t[i]) && (o = (a ? n(e, r, o) : n(o)) || o);
  return a && o && oo(e, r, o), o;
};
const ke = "themes", $e = "modules", Se = "compare";
let S = class extends v {
  constructor() {
    super(...arguments), this.narrow = !1, this._selectedTheme = null, this._selectedModule = null, this._topTab = ke, this._demoMode = !1, this._hacsError = null, this._hacsErrorDismissed = !1, this._onHashChange = () => {
      this._demoMode = window.location.hash === "#demo";
    };
  }
  connectedCallback() {
    super.connectedCallback(), console.info("[theme-studio] registry (initial):", je()), this._demoMode = window.location.hash === "#demo", window.addEventListener("hashchange", this._onHashChange), this._unsubRegistry = wt(() => this.requestUpdate()), this._loadHacsRepos();
  }
  async _loadHacsRepos() {
    try {
      const t = await this.hass.connection.sendMessagePromise({ type: "theme_studio/list_hacs_repos" });
      t.found ? (Br(t.repos), console.info(
        "[theme-studio] HACS-Filter aktiv:",
        t.repos.length,
        "installierte Repos →",
        je()
      )) : console.info(
        "[theme-studio] keine HACS-Storage gefunden — alle Plugins geladen"
      );
    } catch (t) {
      const e = t instanceof Error ? t.message : String(t);
      console.warn(
        "[theme-studio] HACS-Detection fehlgeschlagen, alle Plugins geladen:",
        t
      ), this._hacsError = e;
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("hashchange", this._onHashChange), this._unsubRegistry?.(), this._unsubRegistry = void 0;
  }
  render() {
    return s`
      <header>
        <ha-icon icon="mdi:palette"></ha-icon>
        <h1>Theme Studio</h1>
      </header>
      <main>${this._renderHacsWarn()} ${this._renderBody()}</main>
    `;
  }
  _renderHacsWarn() {
    return !this._hacsError || this._hacsErrorDismissed ? "" : s`
      <div class="hacs-warn">
        <span class="hacs-warn-msg">
          HACS-Detection fehlgeschlagen — Plugin-Filter ist inaktiv, alle
          Plugins werden gezeigt (auch wenn das zugehörige Custom-Repo gar
          nicht installiert ist).
          <span class="hacs-warn-detail">${this._hacsError}</span>
        </span>
        <button
          @click=${() => this._hacsErrorDismissed = !0}
          title="Hinweis ausblenden"
        >
          ×
        </button>
      </div>
    `;
  }
  _renderBody() {
    return this._demoMode ? s`<ts-controls-demo></ts-controls-demo>` : this._selectedTheme ? s`
        <ts-editor-view
          .hass=${this.hass}
          .file=${this._selectedTheme.file}
          .themeName=${this._selectedTheme.theme_name}
          @back-to-picker=${this._backToPicker}
        ></ts-editor-view>
      ` : this._selectedModule ? s`
        <ts-module-editor
          .hass=${this.hass}
          .file=${this._selectedModule.file}
          .moduleId=${this._selectedModule.module_id}
          @back-to-picker=${this._backToPicker}
        ></ts-module-editor>
      ` : s`
      ${this._renderTopTabs()} ${this._renderPickerForTab()}
    `;
  }
  _renderTopTabs() {
    const t = te().some(
      (e) => e.manifest.id === "bubble-card"
    );
    return s`
      <div class="top-tabs">
        <button
          class="top-tab ${this._topTab === ke ? "active" : ""}"
          @click=${() => this._setTopTab(ke)}
        >
          Themes
        </button>
        ${t ? s`
              <button
                class="top-tab ${this._topTab === $e ? "active" : ""}"
                @click=${() => this._setTopTab($e)}
              >
                Bubble Card Module
              </button>
            ` : ""}
        <button
          class="top-tab ${this._topTab === Se ? "active" : ""}"
          @click=${() => this._setTopTab(Se)}
        >
          Vergleichen
        </button>
      </div>
    `;
  }
  _renderPickerForTab() {
    return this._topTab === $e ? s`
        <ts-module-picker
          .hass=${this.hass}
          @module-selected=${this._onModuleSelect}
        ></ts-module-picker>
      ` : this._topTab === Se ? s`<ts-compare-view .hass=${this.hass}></ts-compare-view>` : s`
      <theme-picker
        .hass=${this.hass}
        @theme-selected=${this._onThemeSelect}
      ></theme-picker>
    `;
  }
  _setTopTab(t) {
    this._topTab = t;
  }
  _onThemeSelect(t) {
    this._selectedTheme = t.detail;
  }
  _onModuleSelect(t) {
    this._selectedModule = t.detail;
  }
  _backToPicker() {
    this._selectedTheme = null, this._selectedModule = null;
  }
};
S.styles = C`
    :host {
      display: block;
      height: 100%;
      min-height: 100vh;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, "Roboto", sans-serif);
    }
    header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 24px;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, #ffffff);
    }
    header h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
    }
    main {
      padding: 24px;
    }
    .top-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
    .top-tab {
      padding: 10px 18px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 0.95rem;
      margin-bottom: -1px;
      border-radius: 6px 6px 0 0;
    }
    .top-tab:hover {
      color: var(--primary-text-color);
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
    }
    .top-tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
      font-weight: 500;
    }
    .back-btn {
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      padding: 6px 12px;
      cursor: pointer;
      color: inherit;
      font: inherit;
    }
    .back-btn:hover {
      background: var(--secondary-background-color);
    }
    .hacs-warn {
      max-width: 800px;
      margin: 0 auto 16px;
      padding: 10px 14px;
      background: rgba(255, 152, 0, 0.12);
      border-left: 4px solid var(--warning-color, #ff9800);
      border-radius: 4px;
      font-size: 0.88rem;
      color: var(--primary-text-color);
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    .hacs-warn .hacs-warn-msg {
      flex: 1;
    }
    .hacs-warn .hacs-warn-detail {
      display: block;
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      margin-top: 2px;
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
    }
    .hacs-warn button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      line-height: 1;
      color: var(--secondary-text-color);
      padding: 0 4px;
    }
    .hacs-warn button:hover {
      color: var(--primary-text-color);
    }
  `;
T([
  g({ attribute: !1 })
], S.prototype, "hass", 2);
T([
  g({ type: Boolean })
], S.prototype, "narrow", 2);
T([
  g({ attribute: !1 })
], S.prototype, "route", 2);
T([
  h()
], S.prototype, "_selectedTheme", 2);
T([
  h()
], S.prototype, "_selectedModule", 2);
T([
  h()
], S.prototype, "_topTab", 2);
T([
  h()
], S.prototype, "_demoMode", 2);
T([
  h()
], S.prototype, "_hacsError", 2);
T([
  h()
], S.prototype, "_hacsErrorDismissed", 2);
S = T([
  M("theme-studio-panel")
], S);
//# sourceMappingURL=theme-studio-panel.js.map
