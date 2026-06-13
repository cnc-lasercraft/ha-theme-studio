/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const me = globalThis, Pe = me.ShadowRoot && (me.ShadyCSS === void 0 || me.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, De = Symbol(), Fe = /* @__PURE__ */ new WeakMap();
let Je = class {
  constructor(t, r, a) {
    if (this._$cssResult$ = !0, a !== De) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = r;
  }
  get styleSheet() {
    let t = this.o;
    const r = this.t;
    if (Pe && t === void 0) {
      const a = r !== void 0 && r.length === 1;
      a && (t = Fe.get(r)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), a && Fe.set(r, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ht = (e) => new Je(typeof e == "string" ? e : e + "", void 0, De), B = (e, ...t) => {
  const r = e.length === 1 ? e[0] : t.reduce((a, o, i) => a + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + e[i + 1], e[0]);
  return new Je(r, e, De);
}, Ft = (e, t) => {
  if (Pe) e.adoptedStyleSheets = t.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of t) {
    const a = document.createElement("style"), o = me.litNonce;
    o !== void 0 && a.setAttribute("nonce", o), a.textContent = r.cssText, e.appendChild(a);
  }
}, Re = Pe ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let r = "";
  for (const a of t.cssRules) r += a.cssText;
  return Ht(r);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Rt, defineProperty: Ot, getOwnPropertyDescriptor: Lt, getOwnPropertyNames: Gt, getOwnPropertySymbols: It, getPrototypeOf: Ut } = Object, L = globalThis, Oe = L.trustedTypes, Nt = Oe ? Oe.emptyScript : "", jt = L.reactiveElementPolyfillSupport, re = (e, t) => e, fe = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Nt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let r = e;
  switch (t) {
    case Boolean:
      r = e !== null;
      break;
    case Number:
      r = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        r = JSON.parse(e);
      } catch {
        r = null;
      }
  }
  return r;
} }, Ee = (e, t) => !Rt(e, t), Le = { attribute: !0, type: String, converter: fe, reflect: !1, useDefault: !1, hasChanged: Ee };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), L.litPropertyMetadata ?? (L.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Z = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, r = Le) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(t, r), !r.noAccessor) {
      const a = Symbol(), o = this.getPropertyDescriptor(t, a, r);
      o !== void 0 && Ot(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, r, a) {
    const { get: o, set: i } = Lt(this.prototype, t) ?? { get() {
      return this[r];
    }, set(n) {
      this[r] = n;
    } };
    return { get: o, set(n) {
      const c = o?.call(this);
      i?.call(this, n), this.requestUpdate(t, c, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Le;
  }
  static _$Ei() {
    if (this.hasOwnProperty(re("elementProperties"))) return;
    const t = Ut(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(re("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(re("properties"))) {
      const r = this.properties, a = [...Gt(r), ...It(r)];
      for (const o of a) this.createProperty(o, r[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const r = litPropertyMetadata.get(t);
      if (r !== void 0) for (const [a, o] of r) this.elementProperties.set(a, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [r, a] of this.elementProperties) {
      const o = this._$Eu(r, a);
      o !== void 0 && this._$Eh.set(o, r);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const r = [];
    if (Array.isArray(t)) {
      const a = new Set(t.flat(1 / 0).reverse());
      for (const o of a) r.unshift(Re(o));
    } else t !== void 0 && r.push(Re(t));
    return r;
  }
  static _$Eu(t, r) {
    const a = r.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), r = this.constructor.elementProperties;
    for (const a of r.keys()) this.hasOwnProperty(a) && (t.set(a, this[a]), delete this[a]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ft(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, r, a) {
    this._$AK(t, a);
  }
  _$ET(t, r) {
    const a = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, a);
    if (o !== void 0 && a.reflect === !0) {
      const i = (a.converter?.toAttribute !== void 0 ? a.converter : fe).toAttribute(r, a.type);
      this._$Em = t, i == null ? this.removeAttribute(o) : this.setAttribute(o, i), this._$Em = null;
    }
  }
  _$AK(t, r) {
    const a = this.constructor, o = a._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const i = a.getPropertyOptions(o), n = typeof i.converter == "function" ? { fromAttribute: i.converter } : i.converter?.fromAttribute !== void 0 ? i.converter : fe;
      this._$Em = o;
      const c = n.fromAttribute(r, i.type);
      this[o] = c ?? this._$Ej?.get(o) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, r, a, o = !1, i) {
    if (t !== void 0) {
      const n = this.constructor;
      if (o === !1 && (i = this[t]), a ?? (a = n.getPropertyOptions(t)), !((a.hasChanged ?? Ee)(i, r) || a.useDefault && a.reflect && i === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, a)))) return;
      this.C(t, r, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, r, { useDefault: a, reflect: o, wrapped: i }, n) {
    a && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? r ?? this[t]), i !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || a || (r = void 0), this._$AL.set(t, r)), o === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (r) {
      Promise.reject(r);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
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
    let t = !1;
    const r = this._$AL;
    try {
      t = this.shouldUpdate(r), t ? (this.willUpdate(r), this._$EO?.forEach((a) => a.hostUpdate?.()), this.update(r)) : this._$EM();
    } catch (a) {
      throw t = !1, this._$EM(), a;
    }
    t && this._$AE(r);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((r) => r.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((r) => this._$ET(r, this[r]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
Z.elementStyles = [], Z.shadowRootOptions = { mode: "open" }, Z[re("elementProperties")] = /* @__PURE__ */ new Map(), Z[re("finalized")] = /* @__PURE__ */ new Map(), jt?.({ ReactiveElement: Z }), (L.reactiveElementVersions ?? (L.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe = globalThis, Ge = (e) => e, _e = oe.trustedTypes, Ie = _e ? _e.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, qe = "$lit$", O = `lit$${Math.random().toFixed(9).slice(2)}$`, Xe = "?" + O, Vt = `<${Xe}>`, V = document, se = () => V.createComment(""), le = (e) => e === null || typeof e != "object" && typeof e != "function", He = Array.isArray, Wt = (e) => He(e) || typeof e?.[Symbol.iterator] == "function", $e = `[ 	
\f\r]`, ee = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ue = /-->/g, Ne = />/g, N = RegExp(`>|${$e}(?:([^\\s"'>=/]+)(${$e}*=${$e}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), je = /'/g, Ve = /"/g, Qe = /^(?:script|style|textarea|title)$/i, Kt = (e) => (t, ...r) => ({ _$litType$: e, strings: t, values: r }), l = Kt(1), J = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), We = /* @__PURE__ */ new WeakMap(), j = V.createTreeWalker(V, 129);
function et(e, t) {
  if (!He(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ie !== void 0 ? Ie.createHTML(t) : t;
}
const Zt = (e, t) => {
  const r = e.length - 1, a = [];
  let o, i = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = ee;
  for (let c = 0; c < r; c++) {
    const d = e[c];
    let u, m, h = -1, b = 0;
    for (; b < d.length && (n.lastIndex = b, m = n.exec(d), m !== null); ) b = n.lastIndex, n === ee ? m[1] === "!--" ? n = Ue : m[1] !== void 0 ? n = Ne : m[2] !== void 0 ? (Qe.test(m[2]) && (o = RegExp("</" + m[2], "g")), n = N) : m[3] !== void 0 && (n = N) : n === N ? m[0] === ">" ? (n = o ?? ee, h = -1) : m[1] === void 0 ? h = -2 : (h = n.lastIndex - m[2].length, u = m[1], n = m[3] === void 0 ? N : m[3] === '"' ? Ve : je) : n === Ve || n === je ? n = N : n === Ue || n === Ne ? n = ee : (n = N, o = void 0);
    const f = n === N && e[c + 1].startsWith("/>") ? " " : "";
    i += n === ee ? d + Vt : h >= 0 ? (a.push(u), d.slice(0, h) + qe + d.slice(h) + O + f) : d + O + (h === -2 ? c : f);
  }
  return [et(e, i + (e[r] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), a];
};
class de {
  constructor({ strings: t, _$litType$: r }, a) {
    let o;
    this.parts = [];
    let i = 0, n = 0;
    const c = t.length - 1, d = this.parts, [u, m] = Zt(t, r);
    if (this.el = de.createElement(u, a), j.currentNode = this.el.content, r === 2 || r === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (o = j.nextNode()) !== null && d.length < c; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const h of o.getAttributeNames()) if (h.endsWith(qe)) {
          const b = m[n++], f = o.getAttribute(h).split(O), k = /([.?@])?(.*)/.exec(b);
          d.push({ type: 1, index: i, name: k[2], strings: f, ctor: k[1] === "." ? Jt : k[1] === "?" ? qt : k[1] === "@" ? Xt : Ce }), o.removeAttribute(h);
        } else h.startsWith(O) && (d.push({ type: 6, index: i }), o.removeAttribute(h));
        if (Qe.test(o.tagName)) {
          const h = o.textContent.split(O), b = h.length - 1;
          if (b > 0) {
            o.textContent = _e ? _e.emptyScript : "";
            for (let f = 0; f < b; f++) o.append(h[f], se()), j.nextNode(), d.push({ type: 2, index: ++i });
            o.append(h[b], se());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Xe) d.push({ type: 2, index: i });
      else {
        let h = -1;
        for (; (h = o.data.indexOf(O, h + 1)) !== -1; ) d.push({ type: 7, index: i }), h += O.length - 1;
      }
      i++;
    }
  }
  static createElement(t, r) {
    const a = V.createElement("template");
    return a.innerHTML = t, a;
  }
}
function q(e, t, r = e, a) {
  if (t === J) return t;
  let o = a !== void 0 ? r._$Co?.[a] : r._$Cl;
  const i = le(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== i && (o?._$AO?.(!1), i === void 0 ? o = void 0 : (o = new i(e), o._$AT(e, r, a)), a !== void 0 ? (r._$Co ?? (r._$Co = []))[a] = o : r._$Cl = o), o !== void 0 && (t = q(e, o._$AS(e, t.values), o, a)), t;
}
class Yt {
  constructor(t, r) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = r;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: r }, parts: a } = this._$AD, o = (t?.creationScope ?? V).importNode(r, !0);
    j.currentNode = o;
    let i = j.nextNode(), n = 0, c = 0, d = a[0];
    for (; d !== void 0; ) {
      if (n === d.index) {
        let u;
        d.type === 2 ? u = new ce(i, i.nextSibling, this, t) : d.type === 1 ? u = new d.ctor(i, d.name, d.strings, this, t) : d.type === 6 && (u = new Qt(i, this, t)), this._$AV.push(u), d = a[++c];
      }
      n !== d?.index && (i = j.nextNode(), n++);
    }
    return j.currentNode = V, o;
  }
  p(t) {
    let r = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(t, a, r), r += a.strings.length - 2) : a._$AI(t[r])), r++;
  }
}
class ce {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, r, a, o) {
    this.type = 2, this._$AH = v, this._$AN = void 0, this._$AA = t, this._$AB = r, this._$AM = a, this.options = o, this._$Cv = o?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const r = this._$AM;
    return r !== void 0 && t?.nodeType === 11 && (t = r.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, r = this) {
    t = q(this, t, r), le(t) ? t === v || t == null || t === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : t !== this._$AH && t !== J && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Wt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== v && le(this._$AH) ? this._$AA.nextSibling.data = t : this.T(V.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: r, _$litType$: a } = t, o = typeof a == "number" ? this._$AC(t) : (a.el === void 0 && (a.el = de.createElement(et(a.h, a.h[0]), this.options)), a);
    if (this._$AH?._$AD === o) this._$AH.p(r);
    else {
      const i = new Yt(o, this), n = i.u(this.options);
      i.p(r), this.T(n), this._$AH = i;
    }
  }
  _$AC(t) {
    let r = We.get(t.strings);
    return r === void 0 && We.set(t.strings, r = new de(t)), r;
  }
  k(t) {
    He(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let a, o = 0;
    for (const i of t) o === r.length ? r.push(a = new ce(this.O(se()), this.O(se()), this, this.options)) : a = r[o], a._$AI(i), o++;
    o < r.length && (this._$AR(a && a._$AB.nextSibling, o), r.length = o);
  }
  _$AR(t = this._$AA.nextSibling, r) {
    for (this._$AP?.(!1, !0, r); t !== this._$AB; ) {
      const a = Ge(t).nextSibling;
      Ge(t).remove(), t = a;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Ce {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, r, a, o, i) {
    this.type = 1, this._$AH = v, this._$AN = void 0, this.element = t, this.name = r, this._$AM = o, this.options = i, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = v;
  }
  _$AI(t, r = this, a, o) {
    const i = this.strings;
    let n = !1;
    if (i === void 0) t = q(this, t, r, 0), n = !le(t) || t !== this._$AH && t !== J, n && (this._$AH = t);
    else {
      const c = t;
      let d, u;
      for (t = i[0], d = 0; d < i.length - 1; d++) u = q(this, c[a + d], r, d), u === J && (u = this._$AH[d]), n || (n = !le(u) || u !== this._$AH[d]), u === v ? t = v : t !== v && (t += (u ?? "") + i[d + 1]), this._$AH[d] = u;
    }
    n && !o && this.j(t);
  }
  j(t) {
    t === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Jt extends Ce {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === v ? void 0 : t;
  }
}
class qt extends Ce {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== v);
  }
}
class Xt extends Ce {
  constructor(t, r, a, o, i) {
    super(t, r, a, o, i), this.type = 5;
  }
  _$AI(t, r = this) {
    if ((t = q(this, t, r, 0) ?? v) === J) return;
    const a = this._$AH, o = t === v && a !== v || t.capture !== a.capture || t.once !== a.once || t.passive !== a.passive, i = t !== v && (a === v || o);
    o && this.element.removeEventListener(this.name, this, a), i && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Qt {
  constructor(t, r, a) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    q(this, t);
  }
}
const er = oe.litHtmlPolyfillSupport;
er?.(de, ce), (oe.litHtmlVersions ?? (oe.litHtmlVersions = [])).push("3.3.3");
const tr = (e, t, r) => {
  const a = r?.renderBefore ?? t;
  let o = a._$litPart$;
  if (o === void 0) {
    const i = r?.renderBefore ?? null;
    a._$litPart$ = o = new ce(t.insertBefore(se(), i), i, void 0, r ?? {});
  }
  return o._$AI(e), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ae = globalThis;
class x extends Z {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var r;
    const t = super.createRenderRoot();
    return (r = this.renderOptions).renderBefore ?? (r.renderBefore = t.firstChild), t;
  }
  update(t) {
    const r = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = tr(r, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return J;
  }
}
x._$litElement$ = !0, x.finalized = !0, ae.litElementHydrateSupport?.({ LitElement: x });
const rr = ae.litElementPolyfillSupport;
rr?.({ LitElement: x });
(ae.litElementVersions ?? (ae.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = (e) => (t, r) => {
  r !== void 0 ? r.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const or = { attribute: !0, type: String, converter: fe, reflect: !1, hasChanged: Ee }, ar = (e = or, t, r) => {
  const { kind: a, metadata: o } = r;
  let i = globalThis.litPropertyMetadata.get(o);
  if (i === void 0 && globalThis.litPropertyMetadata.set(o, i = /* @__PURE__ */ new Map()), a === "setter" && ((e = Object.create(e)).wrapped = !0), i.set(r.name, e), a === "accessor") {
    const { name: n } = r;
    return { set(c) {
      const d = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(n, d, e, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(n, void 0, e, c), c;
    } };
  }
  if (a === "setter") {
    const { name: n } = r;
    return function(c) {
      const d = this[n];
      t.call(this, c), this.requestUpdate(n, d, e, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function g(e) {
  return (t, r) => typeof r == "object" ? ar(e, t, r) : ((a, o, i) => {
    const n = o.hasOwnProperty(i);
    return o.constructor.createProperty(i, a), n ? Object.getOwnPropertyDescriptor(o, i) : void 0;
  })(e, t, r);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function p(e) {
  return g({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ir = (e, t, r) => (r.configurable = !0, r.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, r), r);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function nr(e, t) {
  return (r, a, o) => {
    const i = (n) => n.renderRoot?.querySelector(e) ?? null;
    return ir(r, a, { get() {
      return i(this);
    } });
  };
}
const tt = "bubble-card", rt = "Bubble Card", ot = "0.1.0", at = ">=2.0.0", it = {
  method: "hacs-repo",
  value: "Clooos/Bubble-Card"
}, nt = "CSS-Variablen für Bubble Card (Clooos/Bubble-Card). 100+ Variablen über Global, Pop-Up, Button, Climate, Media-Player, Select, Slider und weitere Card-Types. Plugin wird nur geladen wenn HACS Clooos/Bubble-Card als installiert meldet.", sr = {
  id: tt,
  name: rt,
  version: ot,
  version_supported: at,
  detect: it,
  description: nt
}, lr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: sr,
  description: nt,
  detect: it,
  id: tt,
  name: rt,
  version: ot,
  version_supported: at
}, Symbol.toStringTag, { value: "Module" })), st = "ha-core", lt = "Home Assistant Core", dt = "0.1.0", ct = ">=2024.1.0", ut = {
  method: "always"
}, pt = "Grundlegende CSS-Variablen des HA-Frontends. Immer aktiv, keine Erkennung nötig.", dr = {
  id: st,
  name: lt,
  version: dt,
  version_supported: ct,
  detect: ut,
  description: pt
}, cr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dr,
  description: pt,
  detect: ut,
  id: st,
  name: lt,
  version: dt,
  version_supported: ct
}, Symbol.toStringTag, { value: "Module" })), mt = "mushroom", ht = "Mushroom", bt = "0.1.0", gt = ">=3.0.0", ft = {
  method: "hacs-repo",
  value: "piitaya/lovelace-mushroom"
}, _t = "CSS-Variablen für Mushroom Cards (piitaya/lovelace-mushroom). Typografie (Title/Subtitle/Card-Primary/Card-Secondary), Icons, Chips, Controls, Material-RGB-Palette und State-spezifische RGB-Farben für Climate/Cover/Lock/Person/etc. Plugin wird nur geladen wenn HACS piitaya/lovelace-mushroom als installiert meldet.", ur = {
  id: mt,
  name: ht,
  version: bt,
  version_supported: gt,
  detect: ft,
  description: _t
}, pr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ur,
  description: _t,
  detect: ft,
  id: mt,
  name: ht,
  version: bt,
  version_supported: gt
}, Symbol.toStringTag, { value: "Module" })), yt = "bubble-card", vt = [
  {
    id: "global",
    label: "Global",
    label_en: "Global",
    icon: "mdi:palette-outline"
  },
  {
    id: "card-type-defaults",
    label: "Card-Type-Defaults",
    label_en: "Card type defaults",
    icon: "mdi:card-multiple-outline"
  },
  {
    id: "button",
    label: "Button-Card",
    label_en: "Button card",
    icon: "mdi:gesture-tap-button"
  },
  {
    id: "sub-button",
    label: "Sub-Buttons",
    label_en: "Sub-buttons",
    icon: "mdi:cursor-default-click"
  },
  {
    id: "pop-up",
    label: "Pop-Up-Card",
    label_en: "Pop-up card",
    icon: "mdi:dock-window"
  },
  {
    id: "horizontal-buttons-stack",
    label: "Horizontal Buttons Stack",
    label_en: "Horizontal buttons stack",
    icon: "mdi:view-carousel"
  },
  {
    id: "cover",
    label: "Cover-Card",
    label_en: "Cover card",
    icon: "mdi:blinds"
  },
  {
    id: "climate",
    label: "Climate-Card",
    label_en: "Climate card",
    icon: "mdi:thermostat"
  },
  {
    id: "calendar",
    label: "Calendar-Card",
    label_en: "Calendar card",
    icon: "mdi:calendar"
  },
  {
    id: "event",
    label: "Event-Card",
    label_en: "Event card",
    icon: "mdi:calendar-clock"
  },
  {
    id: "footer",
    label: "Footer",
    label_en: "Footer",
    icon: "mdi:page-layout-footer"
  },
  {
    id: "media-player",
    label: "Media-Player-Card",
    label_en: "Media player card",
    icon: "mdi:music"
  },
  {
    id: "select",
    label: "Select-Card",
    label_en: "Select card",
    icon: "mdi:form-dropdown"
  },
  {
    id: "slider",
    label: "Slider / Sub-Slider",
    label_en: "Slider / sub-slider",
    icon: "mdi:tune-variant"
  },
  {
    id: "color-cursor",
    label: "Color-Cursor",
    label_en: "Color cursor",
    icon: "mdi:eyedropper-variant"
  }
], wt = [
  {
    name: "--bubble-accent-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Akzent-Farbe für Highlights und aktive Indikatoren.",
    description_en: "Bubble Card · Global · Accent color for highlights and active indicators."
  },
  {
    name: "--bubble-backdrop-background-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Hintergrund-Farbe für Backdrops (z.B. hinter Pop-Ups).",
    description_en: "Bubble Card · Global · Background color for backdrops (e.g. behind pop-ups)."
  },
  {
    name: "--bubble-backdrop-filter",
    type: "raw",
    category: "global",
    default: "blur(10px)",
    description: "Bubble Card · Global · CSS-`backdrop-filter` für Bubble-Card-Elemente. Mit `blur(...)` für Glas-Optik.",
    description_en: "Bubble Card · Global · CSS `backdrop-filter` for Bubble Card elements. Use `blur(...)` for a glass look."
  },
  {
    name: "--bubble-border",
    type: "raw",
    category: "global",
    description: "Bubble Card · Global · Generischer CSS-`border`-Wert (z.B. `1px solid rgba(0,0,0,0.1)`). Setze `none` zum Deaktivieren.",
    description_en: "Bubble Card · Global · Generic CSS `border` value (e.g. `1px solid rgba(0,0,0,0.1)`). Set `none` to disable."
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
    description: "Bubble Card · Global · Ecken-Rundung der Bubble-Card-Container.",
    description_en: "Bubble Card · Global · Corner radius of Bubble Card containers."
  },
  {
    name: "--bubble-box-shadow",
    type: "shadow",
    category: "global",
    description: "Bubble Card · Global · Schatten unter Bubble Cards. Setze `none` für flaches Design.",
    description_en: "Bubble Card · Global · Shadow beneath Bubble Cards. Set `none` for a flat design."
  },
  {
    name: "--bubble-default-backdrop-background-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Default-Backdrop-Farbe (Fallback wenn spezifischere Variable fehlt).",
    description_en: "Bubble Card · Global · Default backdrop color (fallback when a more specific variable is missing)."
  },
  {
    name: "--bubble-default-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Default-Vorder-Farbe (Fallback).",
    description_en: "Bubble Card · Global · Default foreground color (fallback)."
  },
  {
    name: "--bubble-icon-background-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Hintergrund-Farbe von Icons in Bubble Cards (das runde Hintergrund-Element).",
    description_en: "Bubble Card · Global · Background color of icons in Bubble Cards (the round background element)."
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
    description: "Bubble Card · Global · Ecken-Rundung von Icon-Hintergründen. 50% = Kreis.",
    description_en: "Bubble Card · Global · Corner radius of icon backgrounds. 50% = circle."
  },
  {
    name: "--bubble-icon-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Standard-Icon-Farbe.",
    description_en: "Bubble Card · Global · Default icon color."
  },
  {
    name: "--bubble-light-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Akzent-Farbe für Light-Entities (oft warmes Gelb).",
    description_en: "Bubble Card · Global · Accent color for light entities (often warm yellow)."
  },
  {
    name: "--bubble-light-white-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Sekundäre Light-Farbe (Weisslicht).",
    description_en: "Bubble Card · Global · Secondary light color (white light)."
  },
  {
    name: "--bubble-line-background-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Farbe von Trennlinien innerhalb von Cards.",
    description_en: "Bubble Card · Global · Color of separator lines within cards."
  },
  {
    name: "--bubble-list-item-accent-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Akzent-Farbe für ausgewählte Listen-Items.",
    description_en: "Bubble Card · Global · Accent color for selected list items."
  },
  {
    name: "--bubble-main-background-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Haupt-Hintergrund aller Bubble Cards. Wichtigste Farbe wenn du Bubble Cards thematisch anpassen willst.",
    description_en: "Bubble Card · Global · Main background of all Bubble Cards. The most important color when re-theming Bubble Cards."
  },
  {
    name: "--bubble-main-buttons-background-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Hintergrund der Haupt-Buttons (übergeordnet zu Button-Card-spezifischen Vars).",
    description_en: "Bubble Card · Global · Background of the main buttons (takes precedence over button-card-specific vars)."
  },
  {
    name: "--bubble-secondary-background-color",
    type: "color",
    category: "global",
    description: "Bubble Card · Global · Sekundärer Hintergrund (für innere Container).",
    description_en: "Bubble Card · Global · Secondary background (for inner containers)."
  },
  {
    name: "--bubble-separator-border",
    type: "raw",
    category: "global",
    description: "Bubble Card · Global · CSS-`border`-Wert für Separator-Linien zwischen Card-Sections.",
    description_en: "Bubble Card · Global · CSS `border` value for separator lines between card sections."
  },
  {
    name: "--bubble-card-type-border",
    type: "raw",
    category: "card-type-defaults",
    description: "Bubble Card · Card-Defaults · Default-Border-Wert für alle Bubble-Card-Types.",
    description_en: "Bubble Card · Card defaults · Default border value for all Bubble Card types."
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
    description: "Bubble Card · Card-Defaults · Default-Ecken-Rundung für alle Card-Types.",
    description_en: "Bubble Card · Card defaults · Default corner radius for all card types."
  },
  {
    name: "--bubble-card-type-box-shadow",
    type: "shadow",
    category: "card-type-defaults",
    description: "Bubble Card · Card-Defaults · Default-Schatten für alle Card-Types.",
    description_en: "Bubble Card · Card defaults · Default shadow for all card types."
  },
  {
    name: "--bubble-card-type-icon-background-color",
    type: "color",
    category: "card-type-defaults",
    description: "Bubble Card · Card-Defaults · Default-Hintergrund für Icons (über alle Card-Types).",
    description_en: "Bubble Card · Card defaults · Default background for icons (across all card types)."
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
    description: "Bubble Card · Card-Defaults · Default-Ecken-Rundung für Icons.",
    description_en: "Bubble Card · Card defaults · Default corner radius for icons."
  },
  {
    name: "--bubble-card-type-main-background-color",
    type: "color",
    category: "card-type-defaults",
    description: "Bubble Card · Card-Defaults · Default-Haupt-Hintergrund für alle Card-Types.",
    description_en: "Bubble Card · Card defaults · Default main background for all card types."
  },
  {
    name: "--bubble-button-accent-color",
    type: "color",
    category: "button",
    description: "Bubble Card · Button · Akzent-Farbe der Button-Card (z.B. Slider-Track wenn Light-Brightness-Mode).",
    description_en: "Bubble Card · Button · Accent color of the button card (e.g. slider track in light brightness mode)."
  },
  {
    name: "--bubble-button-active-icon-color",
    type: "color",
    category: "button",
    description: "Bubble Card · Button · Icon-Farbe wenn Button im Active-State (Entity an).",
    description_en: "Bubble Card · Button · Icon color when the button is in the active state (entity on)."
  },
  {
    name: "--bubble-button-background-color",
    type: "color",
    category: "button",
    description: "Bubble Card · Button · Hintergrund-Farbe der Button-Card im Default-State.",
    description_en: "Bubble Card · Button · Background color of the button card in its default state."
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
    description: "Bubble Card · Button · Ecken-Rundung der Button-Card.",
    description_en: "Bubble Card · Button · Corner radius of the button card."
  },
  {
    name: "--bubble-button-icon-background-color",
    type: "color",
    category: "button",
    description: "Bubble Card · Button · Hintergrund des Icon-Containers im Button.",
    description_en: "Bubble Card · Button · Background of the icon container inside the button."
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
    description: "Bubble Card · Button · Ecken-Rundung des Icon-Containers.",
    description_en: "Bubble Card · Button · Corner radius of the icon container."
  },
  {
    name: "--bubble-button-main-background-color",
    type: "color",
    category: "button",
    description: "Bubble Card · Button · Haupt-Hintergrund (oft synonym zu background-color, aber separat überschreibbar).",
    description_en: "Bubble Card · Button · Main background (often synonymous with background-color, but separately overridable)."
  },
  {
    name: "--bubble-sub-button-background-color",
    type: "color",
    category: "sub-button",
    description: "Bubble Card · Sub-Button · Hintergrund-Farbe der kleinen Sub-Buttons unter dem Haupt-Button.",
    description_en: "Bubble Card · Sub-button · Background color of the small sub-buttons beneath the main button."
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
    description: "Bubble Card · Sub-Button · Ecken-Rundung der Sub-Buttons.",
    description_en: "Bubble Card · Sub-button · Corner radius of the sub-buttons."
  },
  {
    name: "--bubble-sub-button-dark-text-color",
    type: "color",
    category: "sub-button",
    description: "Bubble Card · Sub-Button · Textfarbe wenn Sub-Button im Light-State (heller Background braucht dunklen Text).",
    description_en: "Bubble Card · Sub-button · Text color when the sub-button is in the light state (a bright background needs dark text)."
  },
  {
    name: "--bubble-sub-button-group-justify-content",
    type: "raw",
    category: "sub-button",
    description: "Bubble Card · Sub-Button · CSS-`justify-content` für die Sub-Button-Gruppe (flex-start, center, space-between, …).",
    description_en: "Bubble Card · Sub-button · CSS `justify-content` for the sub-button group (flex-start, center, space-between, …)."
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
    description: "Bubble Card · Sub-Button · Höhe der Sub-Buttons.",
    description_en: "Bubble Card · Sub-button · Height of the sub-buttons."
  },
  {
    name: "--bubble-sub-button-justify-content",
    type: "raw",
    category: "sub-button",
    description: "Bubble Card · Sub-Button · CSS-`justify-content` für den einzelnen Sub-Button (Innen-Layout).",
    description_en: "Bubble Card · Sub-button · CSS `justify-content` for the individual sub-button (inner layout)."
  },
  {
    name: "--bubble-sub-button-light-background-color",
    type: "color",
    category: "sub-button",
    description: "Bubble Card · Sub-Button · Hintergrund-Farbe wenn Sub-Button im Light-State (z.B. wenn Light an).",
    description_en: "Bubble Card · Sub-button · Background color when the sub-button is in the light state (e.g. when the light is on)."
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
    description: "Bubble Card · Pop-Up · Verfügbare Höhe des Pop-Ups (typisch in vh).",
    description_en: "Bubble Card · Pop-up · Available height of the pop-up (typically in vh)."
  },
  {
    name: "--bubble-pop-up-background-color",
    type: "color",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Hintergrund-Farbe des Pop-Up-Containers.",
    description_en: "Bubble Card · Pop-up · Background color of the pop-up container."
  },
  {
    name: "--bubble-pop-up-border",
    type: "raw",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · CSS-`border`-Wert des Pop-Ups.",
    description_en: "Bubble Card · Pop-up · CSS `border` value of the pop-up."
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
    description: "Bubble Card · Pop-Up · Ecken-Rundung des Pop-Up-Containers.",
    description_en: "Bubble Card · Pop-up · Corner radius of the pop-up container."
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
    description: "Bubble Card · Pop-Up · Padding am unteren Rand des Pop-Ups.",
    description_en: "Bubble Card · Pop-up · Padding at the bottom edge of the pop-up."
  },
  {
    name: "--bubble-pop-up-close-button-border",
    type: "raw",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Border des Close-Buttons (X-Icon).",
    description_en: "Bubble Card · Pop-up · Border of the close button (X icon)."
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
    description: "Bubble Card · Pop-Up · Ecken-Rundung des Inhalt-Containers innerhalb des Pop-Ups.",
    description_en: "Bubble Card · Pop-up · Corner radius of the content container inside the pop-up."
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
    description: "Bubble Card · Pop-Up · Zusätzlicher Platz am unteren Rand (für Mobile-Safe-Area etc.).",
    description_en: "Bubble Card · Pop-up · Extra space at the bottom edge (for mobile safe area, etc.)."
  },
  {
    name: "--bubble-pop-up-fade-color",
    type: "color",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Farbe des Fade-/Overlay-Effekts am oberen/unteren Rand.",
    description_en: "Bubble Card · Pop-up · Color of the fade/overlay effect at the top/bottom edge."
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
    description: "Bubble Card · Pop-Up · Abstand zwischen Pop-Up-Inhalts-Elementen.",
    description_en: "Bubble Card · Pop-up · Gap between pop-up content elements."
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
    description: "Bubble Card · Pop-Up · Abstand vom Header zum Inhalt.",
    description_en: "Bubble Card · Pop-up · Gap from the header to the content."
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
    description: "Bubble Card · Pop-Up · Reserve-Abstand für den Header (Layout-Buffer).",
    description_en: "Bubble Card · Pop-up · Reserved gap for the header (layout buffer)."
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
    description: "Bubble Card · Pop-Up · Überlappung des Headers (negativer Wert zieht ihn nach oben).",
    description_en: "Bubble Card · Pop-up · Overlap of the header (a negative value pulls it upward)."
  },
  {
    name: "--bubble-pop-up-main-background-color",
    type: "color",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Haupt-Hintergrund-Farbe (Override des Default-Pop-Up-Backgrounds).",
    description_en: "Bubble Card · Pop-up · Main background color (override of the default pop-up background)."
  },
  {
    name: "--bubble-pop-up-mask-bottom-alpha",
    type: "raw",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Alpha-Wert (0..1) des Mask-Fades am unteren Rand.",
    description_en: "Bubble Card · Pop-up · Alpha value (0..1) of the mask fade at the bottom edge."
  },
  {
    name: "--bubble-pop-up-mask-bottom-stop",
    type: "raw",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Stop-Position (%) für den Mask-Fade unten.",
    description_en: "Bubble Card · Pop-up · Stop position (%) for the bottom mask fade."
  },
  {
    name: "--bubble-pop-up-mask-top-alpha",
    type: "raw",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Alpha-Wert (0..1) des Mask-Fades am oberen Rand.",
    description_en: "Bubble Card · Pop-up · Alpha value (0..1) of the mask fade at the top edge."
  },
  {
    name: "--bubble-pop-up-mask-top-stop",
    type: "raw",
    category: "pop-up",
    description: "Bubble Card · Pop-Up · Stop-Position (%) für den Mask-Fade oben.",
    description_en: "Bubble Card · Pop-up · Stop position (%) for the top mask fade."
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
    description: "Bubble Card · Pop-Up · Sichtbares Padding am unteren Rand (im Gegensatz zu extra-bottom-space).",
    description_en: "Bubble Card · Pop-up · Visible padding at the bottom edge (as opposed to extra-bottom-space)."
  },
  {
    name: "--bubble-horizontal-buttons-stack-background-color",
    type: "color",
    category: "horizontal-buttons-stack",
    description: "Bubble Card · Horizontal Buttons Stack · Hintergrund-Farbe des Stack-Containers.",
    description_en: "Bubble Card · Horizontal buttons stack · Background color of the stack container."
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
    description: "Bubble Card · Horizontal Buttons Stack · Ecken-Rundung des Containers.",
    description_en: "Bubble Card · Horizontal buttons stack · Corner radius of the container."
  },
  {
    name: "--bubble-cover-button-background-color",
    type: "color",
    category: "cover",
    description: "Bubble Card · Cover · Hintergrund-Farbe der Cover-Steuer-Buttons (Auf/Stop/Ab).",
    description_en: "Bubble Card · Cover · Background color of the cover control buttons (up/stop/down)."
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
    description: "Bubble Card · Cover · Ecken-Rundung der Cover-Buttons.",
    description_en: "Bubble Card · Cover · Corner radius of the cover buttons."
  },
  {
    name: "--bubble-climate-accent-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · Generelle Akzent-Farbe der Climate-Card.",
    description_en: "Bubble Card · Climate · General accent color of the climate card."
  },
  {
    name: "--bubble-climate-background-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · Hintergrund-Farbe der Climate-Card.",
    description_en: "Bubble Card · Climate · Background color of the climate card."
  },
  {
    name: "--bubble-climate-button-background-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · Hintergrund-Farbe der Mode-Buttons innerhalb der Climate-Card.",
    description_en: "Bubble Card · Climate · Background color of the mode buttons inside the climate card."
  },
  {
    name: "--bubble-state-climate-auto-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · State-Farbe für 'Auto'-Modus.",
    description_en: "Bubble Card · Climate · State color for 'auto' mode."
  },
  {
    name: "--bubble-state-climate-cool-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · State-Farbe für 'Cool'-Modus (typisch Blau).",
    description_en: "Bubble Card · Climate · State color for 'cool' mode (typically blue)."
  },
  {
    name: "--bubble-state-climate-dry-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · State-Farbe für 'Dry'-Modus.",
    description_en: "Bubble Card · Climate · State color for 'dry' mode."
  },
  {
    name: "--bubble-state-climate-fan-only-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · State-Farbe für 'Fan-Only'-Modus.",
    description_en: "Bubble Card · Climate · State color for 'fan-only' mode."
  },
  {
    name: "--bubble-state-climate-heat-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · State-Farbe für 'Heat'-Modus (typisch Orange/Rot).",
    description_en: "Bubble Card · Climate · State color for 'heat' mode (typically orange/red)."
  },
  {
    name: "--bubble-state-climate-heat-cool-color",
    type: "color",
    category: "climate",
    description: "Bubble Card · Climate · State-Farbe für 'Heat-Cool'-Modus (Hybrid).",
    description_en: "Bubble Card · Climate · State color for 'heat-cool' mode (hybrid)."
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
    description: "Bubble Card · Calendar · Ecken-Rundung der Calendar-Card.",
    description_en: "Bubble Card · Calendar · Corner radius of the calendar card."
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
    description: "Bubble Card · Calendar · Höhe der Calendar-Card.",
    description_en: "Bubble Card · Calendar · Height of the calendar card."
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
    description: "Bubble Card · Calendar · Größe des Fade-Mask-Effekts am Rand der Calendar-Card.",
    description_en: "Bubble Card · Calendar · Size of the fade mask effect at the edge of the calendar card."
  },
  {
    name: "--bubble-event-accent-color",
    type: "color",
    category: "event",
    description: "Bubble Card · Event · Akzent-Farbe für Event-Card-Highlights.",
    description_en: "Bubble Card · Event · Accent color for event card highlights."
  },
  {
    name: "--bubble-event-background-color",
    type: "color",
    category: "event",
    description: "Bubble Card · Event · Hintergrund-Farbe der Event-Card.",
    description_en: "Bubble Card · Event · Background color of the event card."
  },
  {
    name: "--bubble-event-background-image",
    type: "background",
    category: "event",
    description: "Bubble Card · Event · Hintergrund-Bild der Event-Card (CSS-`url(...)`).",
    description_en: "Bubble Card · Event · Background image of the event card (CSS `url(...)`)."
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
    description: "Bubble Card · Footer · Abstand des Footers vom unteren Rand.",
    description_en: "Bubble Card · Footer · Distance of the footer from the bottom edge."
  },
  {
    name: "--bubble-footer-box-shadow",
    type: "shadow",
    category: "footer",
    description: "Bubble Card · Footer · Schatten unter dem Footer-Container.",
    description_en: "Bubble Card · Footer · Shadow beneath the footer container."
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
    description: "Bubble Card · Footer · Breite des Footers.",
    description_en: "Bubble Card · Footer · Width of the footer."
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
    description: "Bubble Card · Media-Player · Ecken-Rundung der Media-Player-Card.",
    description_en: "Bubble Card · Media player · Corner radius of the media player card."
  },
  {
    name: "--bubble-media-player-button-background-color",
    type: "color",
    category: "media-player",
    description: "Bubble Card · Media-Player · Hintergrund-Farbe der Steuer-Buttons (Play/Pause/Skip).",
    description_en: "Bubble Card · Media player · Background color of the control buttons (play/pause/skip)."
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
    description: "Bubble Card · Media-Player · Ecken-Rundung der Steuer-Buttons.",
    description_en: "Bubble Card · Media player · Corner radius of the control buttons."
  },
  {
    name: "--bubble-media-player-play-pause-icon-color",
    type: "color",
    category: "media-player",
    description: "Bubble Card · Media-Player · Icon-Farbe des Play-/Pause-Buttons.",
    description_en: "Bubble Card · Media player · Icon color of the play/pause button."
  },
  {
    name: "--bubble-media-player-slider-background-color",
    type: "color",
    category: "media-player",
    description: "Bubble Card · Media-Player · Hintergrund-Farbe der Position-/Volume-Slider.",
    description_en: "Bubble Card · Media player · Background color of the position/volume sliders."
  },
  {
    name: "--bubble-select-arrow-background-color",
    type: "color",
    category: "select",
    description: "Bubble Card · Select · Hintergrund-Farbe des Dropdown-Pfeils.",
    description_en: "Bubble Card · Select · Background color of the dropdown arrow."
  },
  {
    name: "--bubble-select-border",
    type: "raw",
    category: "select",
    description: "Bubble Card · Select · CSS-`border`-Wert des Select-Buttons.",
    description_en: "Bubble Card · Select · CSS `border` value of the select button."
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
    description: "Bubble Card · Select · Ecken-Rundung des Select-Buttons.",
    description_en: "Bubble Card · Select · Corner radius of the select button."
  },
  {
    name: "--bubble-select-list-background-color",
    type: "color",
    category: "select",
    description: "Bubble Card · Select · Hintergrund-Farbe der Dropdown-Liste.",
    description_en: "Bubble Card · Select · Background color of the dropdown list."
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
    description: "Bubble Card · Select · Ecken-Rundung der Dropdown-Liste.",
    description_en: "Bubble Card · Select · Corner radius of the dropdown list."
  },
  {
    name: "--bubble-select-list-item-accent-color",
    type: "color",
    category: "select",
    description: "Bubble Card · Select · Akzent-Farbe für den ausgewählten Listen-Eintrag.",
    description_en: "Bubble Card · Select · Accent color for the selected list entry."
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
    description: "Bubble Card · Select · Breite der Dropdown-Liste.",
    description_en: "Bubble Card · Select · Width of the dropdown list."
  },
  {
    name: "--bubble-select-main-background-color",
    type: "color",
    category: "select",
    description: "Bubble Card · Select · Haupt-Hintergrund der Select-Card.",
    description_en: "Bubble Card · Select · Main background of the select card."
  },
  {
    name: "--bubble-slider-fill-color",
    type: "color",
    category: "slider",
    description: "Bubble Card · Slider · Füll-Farbe des Slider-Tracks (linker Teil).",
    description_en: "Bubble Card · Slider · Fill color of the slider track (left part)."
  },
  {
    name: "--bubble-sub-slider-background-color",
    type: "color",
    category: "slider",
    description: "Bubble Card · Sub-Slider · Hintergrund-Farbe des Sub-Sliders.",
    description_en: "Bubble Card · Sub-slider · Background color of the sub-slider."
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
    description: "Bubble Card · Sub-Slider · Ecken-Rundung des Sub-Sliders.",
    description_en: "Bubble Card · Sub-slider · Corner radius of the sub-slider."
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
    description: "Bubble Card · Sub-Slider · Höhe des Sub-Sliders.",
    description_en: "Bubble Card · Sub-slider · Height of the sub-slider."
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
    description: "Bubble Card · Sub-Slider · Linker Offset des Sub-Sliders.",
    description_en: "Bubble Card · Sub-slider · Left offset of the sub-slider."
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
    description: "Bubble Card · Sub-Slider · Breite des Sub-Sliders.",
    description_en: "Bubble Card · Sub-slider · Width of the sub-slider."
  },
  {
    name: "--bubble-color-cursor-background",
    type: "color",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Hintergrund des Color-Cursor-Bereichs.",
    description_en: "Bubble Card · Color cursor · Background of the color cursor area."
  },
  {
    name: "--bubble-color-cursor-indicator-color",
    type: "color",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Farbe des Indikator-Rings/-Dots.",
    description_en: "Bubble Card · Color cursor · Color of the indicator ring/dot."
  },
  {
    name: "--bubble-color-cursor-indicator-active-bottom",
    type: "raw",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Position des aktiven Indikators (unten, % oder px).",
    description_en: "Bubble Card · Color cursor · Position of the active indicator (bottom, % or px)."
  },
  {
    name: "--bubble-color-cursor-indicator-active-opacity",
    type: "raw",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Opacity (0..1) des aktiven Indikators.",
    description_en: "Bubble Card · Color cursor · Opacity (0..1) of the active indicator."
  },
  {
    name: "--bubble-color-cursor-indicator-active-top",
    type: "raw",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Position des aktiven Indikators (oben, % oder px).",
    description_en: "Bubble Card · Color cursor · Position of the active indicator (top, % or px)."
  },
  {
    name: "--bubble-color-cursor-indicator-bottom",
    type: "raw",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Default-Position des Indikators (unten).",
    description_en: "Bubble Card · Color cursor · Default position of the indicator (bottom)."
  },
  {
    name: "--bubble-color-cursor-indicator-opacity",
    type: "raw",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Default-Opacity (0..1) des Indikators.",
    description_en: "Bubble Card · Color cursor · Default opacity (0..1) of the indicator."
  },
  {
    name: "--bubble-color-cursor-indicator-top",
    type: "raw",
    category: "color-cursor",
    description: "Bubble Card · Color-Cursor · Default-Position des Indikators (oben).",
    description_en: "Bubble Card · Color cursor · Default position of the indicator (top)."
  }
], mr = {
  id: yt,
  categories: vt,
  variables: wt
}, hr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  categories: vt,
  default: mr,
  id: yt,
  variables: wt
}, Symbol.toStringTag, { value: "Module" })), xt = "ha-core", kt = [
  {
    id: "branding",
    label: "Marke",
    label_en: "Branding",
    icon: "mdi:palette-outline"
  },
  {
    id: "background",
    label: "Hintergrund",
    label_en: "Background",
    icon: "mdi:format-color-fill"
  },
  {
    id: "text",
    label: "Text",
    label_en: "Text",
    icon: "mdi:format-color-text"
  },
  {
    id: "state",
    label: "Zustände (semantisch)",
    label_en: "States (semantic)",
    icon: "mdi:lightbulb-on-outline"
  },
  {
    id: "state-colors",
    label: "State-Farben (Material)",
    label_en: "State colors (Material)",
    icon: "mdi:palette-swatch"
  },
  {
    id: "card",
    label: "Cards",
    label_en: "Cards",
    icon: "mdi:card-outline"
  },
  {
    id: "sidebar",
    label: "Sidebar",
    label_en: "Sidebar",
    icon: "mdi:dock-left"
  },
  {
    id: "header",
    label: "App-Header",
    label_en: "App header",
    icon: "mdi:page-layout-header"
  },
  {
    id: "controls",
    label: "Bedienelemente",
    label_en: "Controls",
    icon: "mdi:tune"
  },
  {
    id: "switches",
    label: "Switches",
    label_en: "Switches",
    icon: "mdi:toggle-switch"
  },
  {
    id: "tables",
    label: "Tabellen",
    label_en: "Tables",
    icon: "mdi:table"
  },
  {
    id: "form-inputs",
    label: "Form-Inputs",
    label_en: "Form inputs",
    icon: "mdi:form-textbox"
  },
  {
    id: "dialogs",
    label: "Dialoge / Modals",
    label_en: "Dialogs / Modals",
    icon: "mdi:application-outline"
  },
  {
    id: "label-badge",
    label: "Label-Badges",
    label_en: "Label badges",
    icon: "mdi:tag-outline"
  },
  {
    id: "polymer-legacy",
    label: "Polymer/Paper (legacy)",
    label_en: "Polymer/Paper (legacy)",
    icon: "mdi:history"
  },
  {
    id: "mdc",
    label: "Material Design Components",
    label_en: "Material Design Components",
    icon: "mdi:material-design"
  },
  {
    id: "rgb",
    label: "RGB-Trippel",
    label_en: "RGB triplets",
    icon: "mdi:format-list-numbered"
  }
], St = [
  {
    name: "--primary-color",
    type: "color",
    category: "branding",
    default: "#03a9f4",
    description: "Hauptfarbe der HA-UI. Wirkt auf: App-Header-Hintergrund (Default), aktive Icons in Cards, Links, ausgewählte Sidebar-Einträge, Switches und Slider im 'On'-Zustand. Wird von vielen anderen Variablen via var() referenziert — Änderung hier kaskadiert auf eine Menge UI-Elemente.",
    description_en: "Main color of the HA UI. Affects: app header background (default), active icons in cards, links, selected sidebar entries, switches and sliders in the 'on' state. Referenced by many other variables via var() — changing this cascades to many UI elements."
  },
  {
    name: "--accent-color",
    type: "color",
    category: "branding",
    default: "#ff9800",
    description: "Sekundäre Akzentfarbe für Highlights und FAB-Buttons (der runde '+'-Button rechts unten in der View-Edit-Ansicht). Weniger sichtbar als --primary-color, oft als Komplementärfarbe gewählt.",
    description_en: "Secondary accent color for highlights and FAB buttons (the round '+' button at the bottom right in the view edit mode). Less visible than --primary-color, often chosen as a complementary color."
  },
  {
    name: "--dark-primary-color",
    type: "color",
    category: "branding",
    default: "#0288d1",
    description: "Dunklere Variation der Hauptfarbe. Wirkt auf: Status-Bar in mobilen Apps, manche dunklere Header-Akzente. Setzt sich nur durch wenn explizit referenziert — viele Themes lassen die Variable ungenutzt.",
    description_en: "Darker variation of the main color. Affects: status bar in mobile apps, some darker header accents. Only takes effect when explicitly referenced — many themes leave this variable unused."
  },
  {
    name: "--light-primary-color",
    type: "color",
    category: "branding",
    default: "#b3e5fc",
    description: "Hellere Variation der Hauptfarbe. Wirkt auf: Hover-States in einigen Listen-Komponenten, leichte Background-Akzente. Wie --dark-primary-color seltener direkt sichtbar.",
    description_en: "Lighter variation of the main color. Affects: hover states in some list components, subtle background accents. Like --dark-primary-color, rarely directly visible."
  },
  {
    name: "--primary-background-color",
    type: "color",
    category: "background",
    default: "#fafafa",
    description: "Haupt-Seitenhintergrund — alles ausserhalb von Cards. Wirkt auf: Body, leere Lovelace-Bereiche, Sidebar-Default (ausser --sidebar-background-color ist explizit gesetzt).",
    description_en: "Main page background — everything outside of cards. Affects: body, empty Lovelace areas, sidebar default (unless --sidebar-background-color is explicitly set)."
  },
  {
    name: "--secondary-background-color",
    type: "color",
    category: "background",
    default: "#e5e5e5",
    description: "Sekundärer Hintergrund — sichtbar zwischen Cards in Grid-Layouts oder als Dialog-Background. Etwas dunkler/heller als der Primary für visuelle Trennung.",
    description_en: "Secondary background — visible between cards in grid layouts or as dialog background. Slightly darker/lighter than the primary for visual separation."
  },
  {
    name: "--card-background-color",
    type: "color",
    category: "background",
    default: "#ffffff",
    description: "Default-Hintergrund für ha-card-Elemente. Wird von --ha-card-background überschrieben, wenn das spezifisch gesetzt ist. Tipp: in Light-Themes meist weiss, in Dark-Themes ein dunkles Grau.",
    description_en: "Default background for ha-card elements. Overridden by --ha-card-background when that is specifically set. Tip: usually white in light themes, a dark grey in dark themes."
  },
  {
    name: "--background-image",
    type: "background",
    category: "background",
    default: "none",
    description: "Hintergrund-Bild des HA-Frontends. CSS-`background`-Shorthand: typisch `center / cover no-repeat fixed url('https://...')` für eine fixierte Vollbild-Tapete. Häufig in Glas-/Vision-Themes, um ein Bild hinter die semi-transparenten Cards zu legen. Setze `none` für keinen Bild-Hintergrund.",
    description_en: "Background image of the HA frontend. CSS `background` shorthand: typically `center / cover no-repeat fixed url('https://...')` for a fixed full-screen wallpaper. Common in glass/vision themes to place an image behind the semi-transparent cards. Set `none` for no image background."
  },
  {
    name: "--lovelace-background",
    type: "background",
    category: "background",
    default: "var(--primary-background-color)",
    description: "Hintergrund des Lovelace-View-Containers (alles unter App-Header). Oft auf `var(--background-image)` gesetzt, um ein Bild als Tapete zu nutzen. Wert kann eine Farbe ODER ein `url(...)`/Gradient sein.",
    description_en: "Background of the Lovelace view container (everything below the app header). Often set to `var(--background-image)` to use an image as wallpaper. The value can be a color OR a `url(...)`/gradient."
  },
  {
    name: "--primary-text-color",
    type: "color",
    category: "text",
    default: "#212121",
    description: "Standard-Textfarbe für alle Card-Inhalte, Titel, Buttons, Werte. Wirkt praktisch überall im HA-Frontend, ausser eine speziellere Variable überschreibt für einen bestimmten Bereich.",
    description_en: "Default text color for all card contents, titles, buttons, values. Affects practically everywhere in the HA frontend, unless a more specific variable overrides for a particular area."
  },
  {
    name: "--secondary-text-color",
    type: "color",
    category: "text",
    default: "#727272",
    description: "Textfarbe für weniger wichtige Information: Labels neben Werten, Timestamps, Sub-Titel, Hinweis-Texte. Sollte schwächer aber lesbar gegenüber --primary-text-color sein.",
    description_en: "Text color for less important information: labels next to values, timestamps, sub-titles, hint texts. Should be weaker but still readable compared to --primary-text-color."
  },
  {
    name: "--disabled-text-color",
    type: "color",
    category: "text",
    default: "#bdbdbd",
    description: "Text-Farbe für deaktivierte UI-Elemente — ausgegraute Buttons, Switches im Disabled-State, nicht-klickbare Menü-Einträge. Sollte sich deutlich von --primary-text-color absetzen.",
    description_en: "Text color for disabled UI elements — greyed-out buttons, switches in disabled state, non-clickable menu items. Should clearly stand apart from --primary-text-color."
  },
  {
    name: "--ha-color-text-secondary",
    type: "color",
    category: "text",
    default: "var(--secondary-text-color)",
    description: "Modernes HA-Design-Token für sekundäre Textfarbe. Identisch zu --secondary-text-color, neuerer Name aus HAs internem Color-Token-System.",
    description_en: "Modern HA design token for secondary text color. Identical to --secondary-text-color, a newer name from HA's internal color token system."
  },
  {
    name: "--state-icon-color",
    type: "color",
    category: "state",
    default: "#44739e",
    description: "Standard-Icon-Farbe für *inaktive* Entities: Lichter aus, Schalter off, Sensoren bei Default-Wert. Wirkt auf alle Entity-Icons in Cards und Listen, sofern kein State-spezifischer Override greift.",
    description_en: "Default icon color for *inactive* entities: lights off, switches off, sensors at default value. Affects all entity icons in cards and lists, unless a state-specific override applies."
  },
  {
    name: "--state-icon-active-color",
    type: "color",
    category: "state",
    default: "#fdd835",
    description: "Icon-Farbe wenn Entity *aktiv* ist: Licht an, Schalter on, Heizung läuft, Pumpe aktiv. Standardmässig Amber/Gelb für 'leuchtet'-Optik. Eine der meistgesehenen Variablen im HA-Frontend.",
    description_en: "Icon color when the entity is *active*: light on, switch on, heater running, pump active. Defaults to amber/yellow for a 'glowing' look. One of the most visible variables in the HA frontend."
  },
  {
    name: "--state-icon-unavailable-color",
    type: "color",
    category: "state",
    default: "var(--disabled-text-color)",
    description: "Icon-Farbe für Entities im 'Unavailable'-State (Offline, Kommunikationsfehler, kein Wert verfügbar). Default referenziert --disabled-text-color für gedämpfte Optik.",
    description_en: "Icon color for entities in the 'unavailable' state (offline, communication error, no value available). Default references --disabled-text-color for a muted look."
  },
  {
    name: "--state-inactive-color",
    type: "color",
    category: "state",
    default: "var(--disabled-text-color)",
    description: "Allgemeine Farbe für inaktive States — oft synonym zu --state-icon-color, aber breiter angewendet (z.B. von Custom Cards für 'Aus'-Texte). Default referenziert --disabled-text-color.",
    description_en: "General color for inactive states — often synonymous with --state-icon-color, but applied more broadly (e.g. by custom cards for 'off' labels). Default references --disabled-text-color."
  },
  {
    name: "--error-color",
    type: "color",
    category: "state",
    default: "#db4437",
    description: "Farbe für Fehler, kritische Alarme. Wirkt auf: Error-Notifications oben, kritische Sensoren-Badges, ungültige Eingaben in Forms, Repair-Issues mit hoher Severity.",
    description_en: "Color for errors and critical alerts. Affects: error notifications at the top, critical sensor badges, invalid form inputs, repair issues with high severity."
  },
  {
    name: "--warning-color",
    type: "color",
    category: "state",
    default: "#ffa600",
    description: "Farbe für Warnungen, nicht-kritische Hinweise. Wirkt auf: Warning-Notifications, Repair-Hinweise mit niedrigerer Severity, Update-Available-Badges.",
    description_en: "Color for warnings and non-critical notices. Affects: warning notifications, repair hints with lower severity, update-available badges."
  },
  {
    name: "--info-color",
    type: "color",
    category: "state",
    default: "#039be5",
    description: "Farbe für informative Hinweise und neutrale Benachrichtigungen. Wirkt auf: Info-Notifications, Hinweis-Banner, manche neutrale State-Badges.",
    description_en: "Color for informational notices and neutral notifications. Affects: info notifications, hint banners, some neutral state badges."
  },
  {
    name: "--success-color",
    type: "color",
    category: "state",
    default: "#43a047",
    description: "Farbe für Erfolgs-Bestätigungen, OK-States. Wirkt auf: 'Saved'-Notifications, OK-Buttons, manche positive State-Badges.",
    description_en: "Color for success confirmations and OK states. Affects: 'saved' notifications, OK buttons, some positive state badges."
  },
  {
    name: "--red-color",
    type: "color",
    category: "state-colors",
    default: "#f44336",
    description: "Material-Palette Rot. Häufig genutzt für state-spezifische Farben (z.B. Climate-Cool-Heat, Sensor-Werte oberhalb Schwellwert) und in Templates via `color: var(--red-color)`.",
    description_en: "Material palette red. Often used for state-specific colors (e.g. climate cool/heat, sensor values above threshold) and in templates via `color: var(--red-color)`."
  },
  {
    name: "--orange-color",
    type: "color",
    category: "state-colors",
    default: "#ff9800",
    description: "Material-Palette Orange. Nützlich für Status-Badges, Aufmerksamkeit-Highlights, oder als Akzent in Custom-Lovelace-Templates.",
    description_en: "Material palette orange. Useful for status badges, attention highlights, or as an accent in custom Lovelace templates."
  },
  {
    name: "--yellow-color",
    type: "color",
    category: "state-colors",
    default: "#ffeb3b",
    description: "Material-Palette Gelb. Oft für Warning-Light-States, Sonne-Icons, oder leuchtende Akzente in custom-Stylings.",
    description_en: "Material palette yellow. Often used for warning light states, sun icons, or glowing accents in custom styling."
  },
  {
    name: "--green-color",
    type: "color",
    category: "state-colors",
    default: "#4caf50",
    description: "Material-Palette Grün. Standard für 'OK'/'Aktiv'/'Verbunden'-States, Solar-Production-Indikatoren, positive Sensor-Werte.",
    description_en: "Material palette green. Standard for 'OK'/'active'/'connected' states, solar production indicators, positive sensor values."
  },
  {
    name: "--cyan-color",
    type: "color",
    category: "state-colors",
    default: "#00bcd4",
    description: "Material-Palette Cyan. Häufig für Wasser-/Kühlung-/Climate-Cool-Indikatoren.",
    description_en: "Material palette cyan. Often used for water / cooling / climate-cool indicators."
  },
  {
    name: "--blue-color",
    type: "color",
    category: "state-colors",
    default: "#2196f3",
    description: "Material-Palette Blau. Standard-Color in vielen HA-Defaults, oft als neutraler 'Active'-Indikator.",
    description_en: "Material palette blue. Default color in many HA defaults, often used as a neutral 'active' indicator."
  },
  {
    name: "--light-blue-color",
    type: "color",
    category: "state-colors",
    default: "#03a9f4",
    description: "Material-Palette Hellblau. Identisch mit dem Default-Wert von --primary-color (#03a9f4) — oft als sekundärer Akzent oder für 'Cool'-States verwendet.",
    description_en: "Material palette light blue. Identical to the default value of --primary-color (#03a9f4) — often used as a secondary accent or for 'cool' states."
  },
  {
    name: "--purple-color",
    type: "color",
    category: "state-colors",
    default: "#9c27b0",
    description: "Material-Palette Violett. Eher selten verwendet — gelegentlich für 'Premium'-Akzente oder besondere Sensor-Kategorien.",
    description_en: "Material palette purple. Rather rarely used — occasionally for 'premium' accents or special sensor categories."
  },
  {
    name: "--pink-color",
    type: "color",
    category: "state-colors",
    default: "#e91e63",
    description: "Material-Palette Pink. Eher selten — gelegentlich für Akzente in Kinder-/Spass-Dashboards.",
    description_en: "Material palette pink. Rather rare — occasionally for accents in kids/fun dashboards."
  },
  {
    name: "--indigo-color",
    type: "color",
    category: "state-colors",
    default: "#3f51b5",
    description: "Material-Palette Indigo. Mittel-tiefes Blau, oft für 'Processing'-States oder als zweite Brand-Variante.",
    description_en: "Material palette indigo. Medium-deep blue, often used for 'processing' states or as a secondary brand variant."
  },
  {
    name: "--teal-color",
    type: "color",
    category: "state-colors",
    default: "#009688",
    description: "Material-Palette Teal. Beliebt für Frische-/Garten-/Wasser-Indikatoren und als bevorzugte Akzent-Alternative zu Cyan.",
    description_en: "Material palette teal. Popular for fresh / garden / water indicators and as a preferred accent alternative to cyan."
  },
  {
    name: "--brown-color",
    type: "color",
    category: "state-colors",
    default: "#795548",
    description: "Material-Palette Braun. Selten verwendet — gelegentlich für Erdung/Holz-Themen oder Sensor-States.",
    description_en: "Material palette brown. Rarely used — occasionally for earth/wood themes or sensor states."
  },
  {
    name: "--grey-color",
    type: "color",
    category: "state-colors",
    default: "#9e9e9e",
    description: "Material-Palette Grau. Standard für neutrale/inaktive Akzente, ungültige States, Placeholder.",
    description_en: "Material palette grey. Standard for neutral/inactive accents, invalid states, placeholders."
  },
  {
    name: "--amber-color",
    type: "color",
    category: "state-colors",
    default: "#ffc107",
    description: "Material-Palette Amber. Klassische 'Aktiv-Licht'-Farbe (siehe --state-icon-active-color), oft für warme Lichter und Aufmerksamkeits-States.",
    description_en: "Material palette amber. Classic 'active light' color (see --state-icon-active-color), often for warm lights and attention states."
  },
  {
    name: "--ha-card-background",
    type: "color",
    category: "card",
    default: "var(--card-background-color)",
    description: "Hintergrund speziell für ha-card-Elemente (also fast alle Karten im HA-Frontend). Überschreibt --card-background-color spezifisch für Cards. Default referenziert --card-background-color — wird also vererbt, wenn nicht explizit gesetzt.",
    description_en: "Background specifically for ha-card elements (so almost all cards in the HA frontend). Overrides --card-background-color specifically for cards. Default references --card-background-color — so it's inherited if not explicitly set."
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
    description: "Ecken-Rundung aller ha-card-Elemente (Lovelace, Bubble Card, Mushroom etc., sofern sie ha-card als Basis nutzen). 0 = scharfe Ecken, 12px = HA-Default (Material), 24px+ = sehr rund / Pill-Style.",
    description_en: "Corner rounding of all ha-card elements (Lovelace, Bubble Card, Mushroom, etc., as long as they use ha-card as their base). 0 = sharp corners, 12px = HA default (Material), 24px+ = very round / pill style."
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
    description: "Ecken-Rundung der Card-Features (z.B. die Action-Buttons unter Light-/Cover-/Climate-Cards). Default referenziert --ha-card-border-radius — also folgt automatisch wenn nicht separat gesetzt.",
    description_en: "Corner rounding of card features (e.g. the action buttons under light / cover / climate cards). Default references --ha-card-border-radius — so it follows automatically when not set separately."
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
    description: "Border-Breite der Cards. Default 0px = unsichtbarer Border, Schatten übernimmt die optische Trennung. Bei > 0 wird --ha-card-border-color verwendet.",
    description_en: "Border width of cards. Default 0px = invisible border, the shadow handles the visual separation. When > 0, --ha-card-border-color is used."
  },
  {
    name: "--ha-card-border-color",
    type: "color",
    category: "card",
    default: "var(--divider-color)",
    description: "Border-Farbe der Cards. Nur sichtbar wenn --ha-card-border-width > 0 ist. Default referenziert --divider-color für stimmige Trennlinien.",
    description_en: "Border color of cards. Only visible when --ha-card-border-width > 0. Default references --divider-color for matching divider lines."
  },
  {
    name: "--ha-card-box-shadow",
    type: "shadow",
    category: "card",
    default: "0 2px 4px rgba(0, 0, 0, 0.12)",
    description: "Schatten unter Cards. Default ist ein dezenter Drop-Shadow für Material-Design-Optik. Setze 'none' für ein komplett flaches Design (z.B. iOS-Stil).",
    description_en: "Shadow beneath cards. Default is a subtle drop shadow for a Material Design look. Set 'none' for a completely flat design (e.g. iOS style)."
  },
  {
    name: "--ha-card-backdrop-filter",
    type: "raw",
    category: "card",
    default: "none",
    description: "CSS-`backdrop-filter` für Cards — wirkt auf den Bereich *hinter* der Card (nicht auf die Card selbst). Mit `blur(10px)` und einem semi-transparenten --ha-card-background bekommen Cards einen Glas-/Frosted-Effekt (typisch für visionOS-/iOS-Themes). Setze `none` zum Deaktivieren.",
    description_en: "CSS `backdrop-filter` for cards — affects the area *behind* the card (not the card itself). With `blur(10px)` and a semi-transparent --ha-card-background, cards get a glass/frosted effect (typical of visionOS/iOS themes). Set `none` to disable."
  },
  {
    name: "--clear-background-color",
    type: "color",
    category: "card",
    default: "transparent",
    description: "Vollständig transparenter Hintergrund für Card-Bereiche, die durch die Card-Hintergrund-Farbe durchscheinen sollen. Wert ist meist `transparent` oder ein rgba mit Alpha=0.",
    description_en: "Fully transparent background for card areas that should let the card background color shine through. Value is usually `transparent` or an rgba with alpha=0."
  },
  {
    name: "--sidebar-background-color",
    type: "color",
    category: "sidebar",
    default: "var(--primary-background-color)",
    description: "Hintergrund der linken Sidebar (Navigation). Default referenziert --primary-background-color — explizit setzen, wenn Sidebar sich vom Haupt-Background absetzen soll.",
    description_en: "Background of the left sidebar (navigation). Default references --primary-background-color — set explicitly if the sidebar should stand out from the main background."
  },
  {
    name: "--sidebar-text-color",
    type: "color",
    category: "sidebar",
    default: "var(--primary-text-color)",
    description: "Default-Textfarbe der Sidebar-Einträge (für die **nicht** ausgewählten Views). Default referenziert --primary-text-color.",
    description_en: "Default text color for sidebar entries (for the **non**-selected views). Default references --primary-text-color."
  },
  {
    name: "--sidebar-icon-color",
    type: "color",
    category: "sidebar",
    default: "var(--state-icon-color)",
    description: "Icon-Farbe der Sidebar-Einträge (nicht-ausgewählte Views). Default referenziert --state-icon-color, deshalb folgen Sidebar-Icons standardmässig der State-Icon-Farbe.",
    description_en: "Icon color of sidebar entries (non-selected views). Default references --state-icon-color, so sidebar icons follow the state icon color by default."
  },
  {
    name: "--sidebar-selected-background-color",
    type: "color",
    category: "sidebar",
    default: "#ffffff",
    description: "Hintergrund des aktuell ausgewählten Sidebar-Eintrags (die View die du gerade ansiehst). Default Weiss — für dunkle Themes oft auf einen Akzent setzen, sonst verschwindet die Selektion.",
    description_en: "Background of the currently selected sidebar entry (the view you are looking at). Default white — for dark themes often set to an accent, otherwise the selection disappears."
  },
  {
    name: "--sidebar-selected-text-color",
    type: "color",
    category: "sidebar",
    default: "var(--primary-color)",
    description: "Textfarbe des aktiven Sidebar-Eintrags. Default referenziert --primary-color für visuelle Konsistenz mit dem Branding.",
    description_en: "Text color of the active sidebar entry. Default references --primary-color for visual consistency with the branding."
  },
  {
    name: "--sidebar-selected-icon-color",
    type: "color",
    category: "sidebar",
    default: "var(--primary-color)",
    description: "Icon-Farbe des aktiven Sidebar-Eintrags. Default referenziert --primary-color — der ausgewählte View-Eintrag bekommt damit eine ganzheitlich gefärbte Optik (Icon + Text in Brandfarbe).",
    description_en: "Icon color of the active sidebar entry. Default references --primary-color — this gives the selected view entry a fully tinted appearance (icon + text in brand color)."
  },
  {
    name: "--app-header-background-color",
    type: "color",
    category: "header",
    default: "var(--primary-color)",
    description: "Hintergrund der App-Header-Leiste oben (mit View-Tabs und Titel). Default referenziert --primary-color — deshalb ändert sich der Header automatisch beim Anpassen der Hauptfarbe, ausser du setzt diese Variable explizit auf etwas anderes.",
    description_en: "Background of the app header bar at the top (with view tabs and title). Default references --primary-color — so the header changes automatically when adjusting the main color, unless you explicitly set this variable to something else."
  },
  {
    name: "--app-header-text-color",
    type: "color",
    category: "header",
    default: "#ffffff",
    description: "Textfarbe in der App-Header-Leiste (View-Tabs, Titel, Menü-Icons). Default Weiss für maximalen Kontrast auf farbigem Header.",
    description_en: "Text color in the app header bar (view tabs, title, menu icons). Default white for maximum contrast on a colored header."
  },
  {
    name: "--app-header-backdrop-filter",
    type: "raw",
    category: "header",
    default: "none",
    description: "CSS-`backdrop-filter` für den App-Header. Mit `blur(10px)` bekommt der Header eine Glas-Optik, sodass das --background-image dezent durchschimmert (typisch für visionOS-/iOS-Themes).",
    description_en: "CSS `backdrop-filter` for the app header. With `blur(10px)`, the header gets a glass look so that the --background-image shines through subtly (typical of visionOS/iOS themes)."
  },
  {
    name: "--app-header-edit-background-color",
    type: "color",
    category: "header",
    default: "rgba(0, 0, 0, 0.2)",
    description: "Header-Hintergrund während die View im Edit-Mode ist (Lovelace-UI-Editor offen). Default leicht dunkler/transparenter für visuelle Differenzierung zum normalen Modus.",
    description_en: "Header background while the view is in edit mode (Lovelace UI editor open). Default slightly darker/more transparent for visual differentiation from the normal mode."
  },
  {
    name: "--app-theme-color",
    type: "color",
    category: "header",
    default: "var(--primary-color)",
    description: "Wird als `meta theme-color` an Browser/Mobile-Apps weitergegeben — bestimmt die Farbe der System-Status-Bar (z.B. iOS-Notch-Bereich, Android-Top-Bar in PWA). Sollte zur Brand-/Header-Farbe passen.",
    description_en: "Passed as `meta theme-color` to browsers / mobile apps — determines the color of the system status bar (e.g. iOS notch area, Android top bar in PWA). Should match the brand / header color."
  },
  {
    name: "--divider-color",
    type: "color",
    category: "controls",
    default: "rgba(0, 0, 0, 0.12)",
    description: "Trennlinien zwischen Listen-Items, Card-Sections, Tabs, Form-Feldern. Wirkt auf viele subtile Linien im HA-Frontend. Default leichtes Schwarz mit 12% Alpha — passt sich automatisch an Light/Dark an.",
    description_en: "Divider lines between list items, card sections, tabs, form fields. Affects many subtle lines in the HA frontend. Default light black with 12% alpha — automatically adapts to light/dark."
  },
  {
    name: "--paper-slider-active-color",
    type: "color",
    category: "controls",
    default: "var(--primary-color)",
    description: "Slider-Track-Farbe für den *gefüllten* Teil (links vom Knopf). Wirkt auf: Light-Brightness-Slider, Volume-Slider, alle Range-Slider in HA. Default referenziert --primary-color.",
    description_en: "Slider track color for the *filled* portion (left of the knob). Affects: light brightness slider, volume slider, all range sliders in HA. Default references --primary-color."
  },
  {
    name: "--paper-slider-knob-color",
    type: "color",
    category: "controls",
    default: "var(--primary-color)",
    description: "Farbe des Slider-Knopfs (Thumb). Default referenziert --primary-color für visuelle Konsistenz mit der aktiven Track-Farbe.",
    description_en: "Color of the slider knob (thumb). Default references --primary-color for visual consistency with the active track color."
  },
  {
    name: "--ha-slider-background",
    type: "raw",
    category: "controls",
    default: "var(--secondary-background-color)",
    description: "Hintergrund der neuen ha-slider-Komponente (modern, replaces paper-slider). Mit `none !important` lässt sich der Slider-Hintergrund komplett ausblenden — für Custom-Looks. Wert kann Farbe ODER `none` sein.",
    description_en: "Background of the new ha-slider component (modern, replaces paper-slider). With `none !important`, the slider background can be hidden completely — for custom looks. Value can be a color OR `none`."
  },
  {
    name: "--switch-checked-color",
    type: "color",
    category: "switches",
    default: "var(--primary-color)",
    description: "Generische Farbe eingeschalteter Switches (modern HA). Wird oft von den spezifischeren --switch-checked-button-color und --switch-checked-track-color überschrieben.",
    description_en: "Generic color of switches in the 'on' state (modern HA). Often overridden by the more specific --switch-checked-button-color and --switch-checked-track-color."
  },
  {
    name: "--switch-unchecked-color",
    type: "color",
    category: "switches",
    default: "#bdbdbd",
    description: "Generische Farbe ausgeschalteter Switches (modern HA). Wird oft von den spezifischeren --switch-unchecked-button-color und --switch-unchecked-track-color überschrieben.",
    description_en: "Generic color of switches in the 'off' state (modern HA). Often overridden by the more specific --switch-unchecked-button-color and --switch-unchecked-track-color."
  },
  {
    name: "--switch-checked-button-color",
    type: "color",
    category: "switches",
    default: "var(--switch-checked-color, var(--primary-color))",
    description: "Farbe des Switch-Knopfs (Thumb) im 'On'-Zustand. Spezifischer als --switch-checked-color — überschreibt den Knopf separat vom Track.",
    description_en: "Color of the switch knob (thumb) in the 'on' state. More specific than --switch-checked-color — overrides the knob separately from the track."
  },
  {
    name: "--switch-checked-track-color",
    type: "color",
    category: "switches",
    default: "var(--switch-checked-color, var(--primary-color))",
    description: "Farbe der Switch-Schiene (Track) im 'On'-Zustand. Oft transluzent gegenüber dem Button gemacht, für Material-Look.",
    description_en: "Color of the switch track in the 'on' state. Often made translucent compared to the button for a Material look."
  },
  {
    name: "--switch-unchecked-button-color",
    type: "color",
    category: "switches",
    default: "var(--switch-unchecked-color, #bdbdbd)",
    description: "Farbe des Switch-Knopfs (Thumb) im 'Off'-Zustand. Spezifischer als --switch-unchecked-color.",
    description_en: "Color of the switch knob (thumb) in the 'off' state. More specific than --switch-unchecked-color."
  },
  {
    name: "--switch-unchecked-track-color",
    type: "color",
    category: "switches",
    default: "var(--switch-unchecked-color, #bdbdbd)",
    description: "Farbe der Switch-Schiene (Track) im 'Off'-Zustand. Oft heller als der Button für Material-Look.",
    description_en: "Color of the switch track in the 'off' state. Often lighter than the button for a Material look."
  },
  {
    name: "--table-row-background-color",
    type: "color",
    category: "tables",
    default: "var(--card-background-color)",
    description: "Hintergrund von Tabellen-Zeilen (z.B. Logbook, Verlauf, History-Panel). Default referenziert --card-background-color.",
    description_en: "Background of table rows (e.g. logbook, history, history panel). Default references --card-background-color."
  },
  {
    name: "--table-row-alternative-background-color",
    type: "color",
    category: "tables",
    default: "var(--secondary-background-color)",
    description: "Hintergrund jeder zweiten Tabellen-Zeile (Zebra-Pattern). Bietet visuelle Trennung in langen Listen. Default referenziert --secondary-background-color.",
    description_en: "Background of every other table row (zebra pattern). Provides visual separation in long lists. Default references --secondary-background-color."
  },
  {
    name: "--input-fill-color",
    type: "color",
    category: "form-inputs",
    default: "transparent",
    description: "Hintergrund-Füllfarbe von Input-Feldern (Text, Number, Select etc.) im Default-State. Oft transparent für moderne flache Themes.",
    description_en: "Background fill color of input fields (text, number, select, etc.) in the default state. Often transparent for modern flat themes."
  },
  {
    name: "--input-disabled-fill-color",
    type: "color",
    category: "form-inputs",
    default: "transparent",
    description: "Hintergrund-Füllfarbe von deaktivierten Input-Feldern. Sollte sich subtil vom aktiven Zustand absetzen.",
    description_en: "Background fill color of disabled input fields. Should stand apart subtly from the active state."
  },
  {
    name: "--input-ink-color",
    type: "color",
    category: "form-inputs",
    default: "var(--primary-text-color)",
    description: "Textfarbe ('Tinte') in Input-Feldern. Default referenziert --primary-text-color für Konsistenz.",
    description_en: "Text color ('ink') in input fields. Default references --primary-text-color for consistency."
  },
  {
    name: "--input-disabled-ink-color",
    type: "color",
    category: "form-inputs",
    default: "var(--disabled-text-color)",
    description: "Textfarbe in deaktivierten Input-Feldern. Default referenziert --disabled-text-color.",
    description_en: "Text color in disabled input fields. Default references --disabled-text-color."
  },
  {
    name: "--input-label-ink-color",
    type: "color",
    category: "form-inputs",
    default: "var(--secondary-text-color)",
    description: "Farbe des Labels über dem Input-Feld (das floatende 'Placeholder'). Default referenziert --secondary-text-color.",
    description_en: "Color of the label above the input field (the floating 'placeholder'). Default references --secondary-text-color."
  },
  {
    name: "--input-idle-line-color",
    type: "color",
    category: "form-inputs",
    default: "var(--secondary-text-color)",
    description: "Unterstrich-Farbe von Input-Feldern im Default-State (nicht-fokussiert, nicht-hover).",
    description_en: "Underline color of input fields in the default state (not focused, not hovered)."
  },
  {
    name: "--input-hover-line-color",
    type: "color",
    category: "form-inputs",
    default: "var(--primary-text-color)",
    description: "Unterstrich-Farbe von Input-Feldern beim Hover. Kräftiger als --input-idle-line-color für visuelles Feedback.",
    description_en: "Underline color of input fields on hover. Stronger than --input-idle-line-color for visual feedback."
  },
  {
    name: "--input-dropdown-icon-color",
    type: "color",
    category: "form-inputs",
    default: "var(--secondary-text-color)",
    description: "Farbe des Dropdown-Pfeil-Icons in Select-Inputs.",
    description_en: "Color of the dropdown arrow icon in select inputs."
  },
  {
    name: "--dialog-box-shadow",
    type: "shadow",
    category: "dialogs",
    default: "var(--ha-card-box-shadow)",
    description: "Schatten unter modalen Dialogen. Default referenziert --ha-card-box-shadow — Dialoge folgen damit dem Card-Look.",
    description_en: "Shadow beneath modal dialogs. Default references --ha-card-box-shadow — so dialogs follow the card look."
  },
  {
    name: "--ha-dialog-surface-background",
    type: "color",
    category: "dialogs",
    default: "var(--ha-card-background)",
    description: "Hintergrund der Dialog-Oberfläche (die Karte des Dialogs). Default referenziert --ha-card-background — Dialoge folgen dem Card-Background.",
    description_en: "Background of the dialog surface (the dialog's card). Default references --ha-card-background — dialogs follow the card background."
  },
  {
    name: "--ha-dialog-surface-backdrop-filter",
    type: "raw",
    category: "dialogs",
    default: "none",
    description: "CSS-`backdrop-filter` für die Dialog-Oberfläche selbst. Mit `blur(...)` bekommt der Dialog einen Glas-Look. Default `none`.",
    description_en: "CSS `backdrop-filter` for the dialog surface itself. With `blur(...)`, the dialog gets a glass look. Default `none`."
  },
  {
    name: "--ha-dialog-scrim-backdrop-filter",
    type: "raw",
    category: "dialogs",
    default: "none",
    description: "CSS-`backdrop-filter` für den Scrim hinter Dialogen (der Overlay-Bereich rund um den Dialog). Mit `blur(10px)` wird das Frontend hinter dem Dialog verschwommen — während ein Dialog offen ist.",
    description_en: "CSS `backdrop-filter` for the scrim behind dialogs (the overlay area around the dialog). With `blur(10px)`, the frontend behind the dialog is blurred while a dialog is open."
  },
  {
    name: "--more-info-header-background",
    type: "color",
    category: "dialogs",
    default: "var(--ha-card-background)",
    description: "Hintergrund des Headers im More-Info-Dialog (öffnet sich bei Entity-Klick auf einer Card). Default referenziert --ha-card-background.",
    description_en: "Background of the header in the more-info dialog (opens when clicking an entity on a card). Default references --ha-card-background."
  },
  {
    name: "--label-badge-background-color",
    type: "color",
    category: "label-badge",
    default: "var(--card-background-color)",
    description: "Hintergrund von Label-Badges — kleine Status-Markierungen die in manchen Custom-Cards neben Entity-Icons erscheinen. Default referenziert --card-background-color.",
    description_en: "Background of label badges — small status markers that appear next to entity icons in some custom cards. Default references --card-background-color."
  },
  {
    name: "--label-badge-text-color",
    type: "color",
    category: "label-badge",
    default: "var(--primary-text-color)",
    description: "Textfarbe in Label-Badges. Default referenziert --primary-text-color.",
    description_en: "Text color in label badges. Default references --primary-text-color."
  },
  {
    name: "--label-badge-red",
    type: "color",
    category: "label-badge",
    default: "var(--error-color)",
    description: "Rot-Farbe für Label-Badges (Alarm/Error-State). Trotz des Namens ohne -color-Suffix ist es ein voller CSS-Color-Wert.",
    description_en: "Red color for label badges (alarm/error state). Despite the name without a -color suffix, this is a full CSS color value."
  },
  {
    name: "--label-badge-green",
    type: "color",
    category: "label-badge",
    default: "var(--success-color)",
    description: "Grün-Farbe für Label-Badges (OK/Aktiv-State).",
    description_en: "Green color for label badges (OK / active state)."
  },
  {
    name: "--label-badge-blue",
    type: "color",
    category: "label-badge",
    default: "var(--info-color)",
    description: "Blau-Farbe für Label-Badges (Info-State).",
    description_en: "Blue color for label badges (info state)."
  },
  {
    name: "--label-badge-yellow",
    type: "color",
    category: "label-badge",
    default: "var(--warning-color)",
    description: "Gelb-Farbe für Label-Badges (Warning-State).",
    description_en: "Yellow color for label badges (warning state)."
  },
  {
    name: "--label-badge-gray",
    type: "color",
    category: "label-badge",
    default: "var(--disabled-text-color)",
    description: "Grau-Farbe für Label-Badges (Neutral/Inaktiv-State).",
    description_en: "Grey color for label badges (neutral / inactive state)."
  },
  {
    name: "--paper-item-icon-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--state-icon-color)",
    description: "Icon-Farbe in Polymer-basierten Listen-Items (Legacy HA-Komponenten, z.B. alte Sidebar-Renditionen, einige Dialog-Listen). Default referenziert --state-icon-color.",
    description_en: "Icon color in Polymer-based list items (legacy HA components, e.g. older sidebar renditions, some dialog lists). Default references --state-icon-color."
  },
  {
    name: "--paper-item-icon-active-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--state-icon-active-color)",
    description: "Aktive Variante von --paper-item-icon-color. Wirkt auf 'On'-States in Legacy-Listen-Komponenten.",
    description_en: "Active variant of --paper-item-icon-color. Affects 'on' states in legacy list components."
  },
  {
    name: "--paper-card-background-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--ha-card-background)",
    description: "Legacy-Alias für Card-Hintergrund. Wird von HA-Components verwendet, die noch nicht auf ha-card umgestellt sind.",
    description_en: "Legacy alias for card background. Used by HA components that have not yet been migrated to ha-card."
  },
  {
    name: "--paper-dialog-background-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--ha-dialog-surface-background, var(--ha-card-background))",
    description: "Hintergrund alter Polymer-Dialoge. Wird zunehmend durch --ha-dialog-surface-background ersetzt, aber manche Legacy-Dialoge greifen noch hier zu.",
    description_en: "Background of old Polymer dialogs. Increasingly being replaced by --ha-dialog-surface-background, but some legacy dialogs still read from this."
  },
  {
    name: "--paper-listbox-background-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--primary-background-color)",
    description: "Hintergrund von Polymer-Listbox-Komponenten (alte Listen-Dialoge, Dropdown-Menüs).",
    description_en: "Background of Polymer listbox components (older list dialogs, dropdown menus)."
  },
  {
    name: "--paper-slider-container-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--disabled-text-color)",
    description: "Hintergrund-Track des Sliders (der ungefüllte Bereich rechts vom Knopf). Komplement zu --paper-slider-active-color.",
    description_en: "Background track of the slider (the unfilled area to the right of the knob). Complement to --paper-slider-active-color."
  },
  {
    name: "--paper-slider-secondary-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--light-primary-color)",
    description: "Sekundäre Slider-Farbe — z.B. für Slider mit zwei Wertebereichen (Min/Max) oder Buffered-State.",
    description_en: "Secondary slider color — e.g. for sliders with two value ranges (min/max) or a buffered state."
  },
  {
    name: "--paper-slider-knob-start-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--paper-slider-knob-color)",
    description: "Knopf-Farbe in der Start-Position (bei Wert 0). Variiert sich oft von --paper-slider-knob-color für visuelle Klarheit am Anfang.",
    description_en: "Knob color in the start position (at value 0). Often differs from --paper-slider-knob-color for visual clarity at the beginning."
  },
  {
    name: "--paper-slider-pin-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--paper-slider-knob-color)",
    description: "Pin-Farbe — der kleine Tooltip der über dem Knopf erscheint wenn man zieht und den aktuellen Wert anzeigt.",
    description_en: "Pin color — the small tooltip that appears above the knob while dragging, showing the current value."
  },
  {
    name: "--paper-slider-font-color",
    type: "color",
    category: "polymer-legacy",
    default: "#000",
    description: "Textfarbe für Werte/Labels die *innerhalb* des Slider-Pins angezeigt werden (z.B. Brightness-%).",
    description_en: "Text color for values/labels displayed *inside* the slider pin (e.g. brightness %)."
  },
  {
    name: "--paper-toggle-button-checked-button-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--primary-color)",
    description: "Knopf-Farbe alter Polymer-Toggle-Buttons im 'On'-Zustand. Trotz neuer --switch-*-Vars werden viele Custom-Cards und Legacy-Dialoge weiterhin von dieser bestimmt.",
    description_en: "Knob color of old Polymer toggle buttons in the 'on' state. Despite the newer --switch-* variables, many custom cards and legacy dialogs are still controlled by this."
  },
  {
    name: "--paper-toggle-button-checked-bar-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--primary-color)",
    description: "Bar/Track-Farbe alter Polymer-Toggle-Buttons im 'On'-Zustand.",
    description_en: "Bar/track color of old Polymer toggle buttons in the 'on' state."
  },
  {
    name: "--paper-toggle-button-unchecked-button-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--disabled-text-color)",
    description: "Knopf-Farbe alter Polymer-Toggle-Buttons im 'Off'-Zustand.",
    description_en: "Knob color of old Polymer toggle buttons in the 'off' state."
  },
  {
    name: "--paper-toggle-button-unchecked-bar-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--disabled-text-color)",
    description: "Bar/Track-Farbe alter Polymer-Toggle-Buttons im 'Off'-Zustand.",
    description_en: "Bar/track color of old Polymer toggle buttons in the 'off' state."
  },
  {
    name: "--text-primary-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--primary-text-color)",
    description: "Legacy: primäre Textfarbe — bei modernen Themes oft auf --primary-text-color verwiesen. Manche alte Komponenten greifen noch direkt hier zu.",
    description_en: "Legacy: primary text color — in modern themes often pointed to --primary-text-color. Some old components still read directly from this."
  },
  {
    name: "--text-dark-color",
    type: "color",
    category: "polymer-legacy",
    default: "var(--primary-text-color)",
    description: "Legacy: dunkle Textfarbe für hellem Hintergrund. In Dark-Themes oft auf eine helle Farbe gesetzt — der Name ist irreführend.",
    description_en: "Legacy: dark text color for a light background. In dark themes often set to a light color — the name is misleading."
  },
  {
    name: "--mdc-select-fill-color",
    type: "color",
    category: "mdc",
    default: "rgba(245, 245, 245, 1)",
    description: "Hintergrund-Füllfarbe von Material-Design-Select-Dropdowns (in HA-Settings, Config-Flows, Forms). Beeinflusst die Felder unter dem Label.",
    description_en: "Background fill color of Material Design select dropdowns (in HA settings, config flows, forms). Affects the fields below the label."
  },
  {
    name: "--mdc-select-ink-color",
    type: "color",
    category: "mdc",
    default: "var(--primary-text-color)",
    description: "Textfarbe ('Tinte') des ausgewählten Wertes in Material-Design-Selects. Default referenziert --primary-text-color.",
    description_en: "Text color ('ink') of the selected value in Material Design selects. Default references --primary-text-color."
  },
  {
    name: "--mdc-select-label-ink-color",
    type: "color",
    category: "mdc",
    default: "var(--secondary-text-color)",
    description: "Farbe des Labels über dem Select-Feld. Default referenziert --secondary-text-color (dezenter als der Wert selbst).",
    description_en: "Color of the label above the select field. Default references --secondary-text-color (more subtle than the value itself)."
  },
  {
    name: "--mdc-select-dropdown-icon-color",
    type: "color",
    category: "mdc",
    default: "var(--secondary-text-color)",
    description: "Farbe des Dropdown-Pfeil-Icons im Select. Default referenziert --secondary-text-color.",
    description_en: "Color of the dropdown arrow icon in the select. Default references --secondary-text-color."
  },
  {
    name: "--mdc-checkbox-unchecked-color",
    type: "color",
    category: "mdc",
    default: "var(--secondary-text-color)",
    description: "Border-Farbe von Material-Design-Checkboxen im 'Unchecked'-State.",
    description_en: "Border color of Material Design checkboxes in the 'unchecked' state."
  },
  {
    name: "--mdc-radio-unchecked-color",
    type: "color",
    category: "mdc",
    default: "var(--secondary-text-color)",
    description: "Border-Farbe von Material-Design-Radio-Buttons im 'Unchecked'-State.",
    description_en: "Border color of Material Design radio buttons in the 'unchecked' state."
  },
  {
    name: "--mdc-theme-surface",
    type: "color",
    category: "mdc",
    default: "var(--card-background-color)",
    description: "Allgemeine Surface-Hintergrund-Farbe für Material-Design-Components. Oft synonym zu --card-background-color.",
    description_en: "General surface background color for Material Design components. Often synonymous with --card-background-color."
  },
  {
    name: "--md-list-container-color",
    type: "color",
    category: "mdc",
    default: "var(--card-background-color)",
    description: "Hintergrund von Material-Design-3 List-Containern. Setze 'none' (als Wort, nicht als CSS) ist nicht gültig — für transparenten Hintergrund eine transparente Farbe wählen.",
    description_en: "Background of Material Design 3 list containers. Setting 'none' (as a word, not as CSS) is not valid — choose a transparent color for a transparent background."
  },
  {
    name: "--rgb-primary-color",
    type: "raw",
    category: "rgb",
    default: "3, 169, 244",
    description: "RGB-Trippel-Form von --primary-color als 'R, G, B' (Komma-getrennt, ohne `rgb()`-Wrapper). HA nutzt das für `rgba(var(--rgb-primary-color), 0.5)` Konstruktionen, um die Farbe mit variabler Transparenz zu kombinieren. Beim Anpassen von --primary-color sollte auch das hier mitgepflegt werden (es leitet sich nicht automatisch ab).",
    description_en: "RGB triplet form of --primary-color as 'R, G, B' (comma-separated, without an `rgb()` wrapper). HA uses this for `rgba(var(--rgb-primary-color), 0.5)` constructions to combine the color with variable transparency. When adjusting --primary-color, this should also be kept in sync (it is not derived automatically)."
  },
  {
    name: "--rgb-accent-color",
    type: "raw",
    category: "rgb",
    default: "255, 152, 0",
    description: "RGB-Trippel-Form von --accent-color als 'R, G, B'. Siehe --rgb-primary-color für Verwendungsmuster (Transparenz-Konstruktionen via rgba(var(--rgb-accent-color), alpha)).",
    description_en: "RGB triplet form of --accent-color as 'R, G, B'. See --rgb-primary-color for usage patterns (transparency constructions via rgba(var(--rgb-accent-color), alpha))."
  },
  {
    name: "--rgb-state-icon-color",
    type: "raw",
    category: "rgb",
    default: "68, 115, 158",
    description: "RGB-Trippel-Form von --state-icon-color. Für Transparenz-Berechnungen via rgba().",
    description_en: "RGB triplet form of --state-icon-color. For transparency calculations via rgba()."
  },
  {
    name: "--rgb-primary-text-color",
    type: "raw",
    category: "rgb",
    default: "33, 33, 33",
    description: "RGB-Trippel-Form von --primary-text-color. Für Transparenz-Berechnungen via rgba().",
    description_en: "RGB triplet form of --primary-text-color. For transparency calculations via rgba()."
  },
  {
    name: "--rgb-secondary-text-color",
    type: "raw",
    category: "rgb",
    default: "114, 114, 114",
    description: "RGB-Trippel-Form von --secondary-text-color. Für Transparenz-Berechnungen via rgba().",
    description_en: "RGB triplet form of --secondary-text-color. For transparency calculations via rgba()."
  },
  {
    name: "--rgb-card-background-color",
    type: "raw",
    category: "rgb",
    default: "255, 255, 255",
    description: "RGB-Trippel-Form von --card-background-color. Wird oft für semi-transparente Card-Backgrounds genutzt: `background: rgba(var(--rgb-card-background-color), 0.7)`.",
    description_en: "RGB triplet form of --card-background-color. Often used for semi-transparent card backgrounds: `background: rgba(var(--rgb-card-background-color), 0.7)`."
  }
], br = {
  id: xt,
  categories: kt,
  variables: St
}, gr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  categories: kt,
  default: br,
  id: xt,
  variables: St
}, Symbol.toStringTag, { value: "Module" })), Ct = "mushroom", $t = [
  {
    id: "card-primary",
    label: "Card-Primary (Hauptzeile)",
    label_en: "Card-Primary (main line)",
    icon: "mdi:format-text"
  },
  {
    id: "card-secondary",
    label: "Card-Secondary (Subzeile)",
    label_en: "Card-Secondary (sub line)",
    icon: "mdi:format-text-variant"
  },
  {
    id: "title",
    label: "Title",
    label_en: "Title",
    icon: "mdi:format-header-1"
  },
  {
    id: "subtitle",
    label: "Subtitle",
    label_en: "Subtitle",
    icon: "mdi:format-header-2"
  },
  {
    id: "icon",
    label: "Icon",
    label_en: "Icon",
    icon: "mdi:emoticon-outline"
  },
  {
    id: "badge",
    label: "Badge",
    label_en: "Badge",
    icon: "mdi:label-outline"
  },
  {
    id: "chip",
    label: "Chip",
    label_en: "Chip",
    icon: "mdi:pill"
  },
  {
    id: "control",
    label: "Control",
    label_en: "Control",
    icon: "mdi:tune-variant"
  },
  {
    id: "layout",
    label: "Layout / Misc",
    label_en: "Layout / Misc",
    icon: "mdi:dots-horizontal"
  },
  {
    id: "rgb-material",
    label: "Material-Palette (RGB)",
    label_en: "Material palette (RGB)",
    icon: "mdi:palette-swatch"
  },
  {
    id: "rgb-semantic",
    label: "Semantic States (RGB)",
    label_en: "Semantic states (RGB)",
    icon: "mdi:tag-outline"
  },
  {
    id: "rgb-states",
    label: "Entity-States (RGB)",
    label_en: "Entity states (RGB)",
    icon: "mdi:state-machine"
  }
], Bt = [
  {
    name: "--mush-card-primary-color",
    type: "color",
    category: "card-primary",
    description: "Mushroom · Card-Primary · Farbe der primären Card-Textzeile (z.B. Entity-Name).",
    description_en: "Mushroom · Card-Primary · Color of the primary card text line (e.g. entity name)."
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
    description: "Mushroom · Card-Primary · Schriftgröße der primären Zeile.",
    description_en: "Mushroom · Card-Primary · Font size of the primary line."
  },
  {
    name: "--mush-card-primary-font-weight",
    type: "raw",
    category: "card-primary",
    description: "Mushroom · Card-Primary · CSS-`font-weight` (normal, bold, 100..900).",
    description_en: "Mushroom · Card-Primary · CSS `font-weight` (normal, bold, 100..900)."
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
    description: "Mushroom · Card-Primary · Buchstabenabstand.",
    description_en: "Mushroom · Card-Primary · Letter spacing."
  },
  {
    name: "--mush-card-primary-line-height",
    type: "raw",
    category: "card-primary",
    description: "Mushroom · Card-Primary · CSS-`line-height` (unitless Zahl oder mit Einheit).",
    description_en: "Mushroom · Card-Primary · CSS `line-height` (unitless number or with unit)."
  },
  {
    name: "--mush-card-secondary-color",
    type: "color",
    category: "card-secondary",
    description: "Mushroom · Card-Secondary · Farbe der sekundären Card-Zeile (z.B. State-Text).",
    description_en: "Mushroom · Card-Secondary · Color of the secondary card line (e.g. state text)."
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
    description: "Mushroom · Card-Secondary · Schriftgröße der sekundären Zeile.",
    description_en: "Mushroom · Card-Secondary · Font size of the secondary line."
  },
  {
    name: "--mush-card-secondary-font-weight",
    type: "raw",
    category: "card-secondary",
    description: "Mushroom · Card-Secondary · CSS-`font-weight`.",
    description_en: "Mushroom · Card-Secondary · CSS `font-weight`."
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
    description: "Mushroom · Card-Secondary · Buchstabenabstand.",
    description_en: "Mushroom · Card-Secondary · Letter spacing."
  },
  {
    name: "--mush-card-secondary-line-height",
    type: "raw",
    category: "card-secondary",
    description: "Mushroom · Card-Secondary · CSS-`line-height`.",
    description_en: "Mushroom · Card-Secondary · CSS `line-height`."
  },
  {
    name: "--mush-title-color",
    type: "color",
    category: "title",
    description: "Mushroom · Title · Farbe von Title-Cards.",
    description_en: "Mushroom · Title · Color of title cards."
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
    description: "Mushroom · Title · Schriftgröße.",
    description_en: "Mushroom · Title · Font size."
  },
  {
    name: "--mush-title-font-weight",
    type: "raw",
    category: "title",
    description: "Mushroom · Title · CSS-`font-weight`.",
    description_en: "Mushroom · Title · CSS `font-weight`."
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
    description: "Mushroom · Title · Buchstabenabstand.",
    description_en: "Mushroom · Title · Letter spacing."
  },
  {
    name: "--mush-title-line-height",
    type: "raw",
    category: "title",
    description: "Mushroom · Title · CSS-`line-height`.",
    description_en: "Mushroom · Title · CSS `line-height`."
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
    description: "Mushroom · Title · Innenabstand der Title-Card.",
    description_en: "Mushroom · Title · Inner padding of the title card."
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
    description: "Mushroom · Title · Abstand zwischen Title und folgendem Element.",
    description_en: "Mushroom · Title · Spacing between title and following element."
  },
  {
    name: "--mush-subtitle-color",
    type: "color",
    category: "subtitle",
    description: "Mushroom · Subtitle · Farbe von Subtitle-Texten.",
    description_en: "Mushroom · Subtitle · Color of subtitle text."
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
    description: "Mushroom · Subtitle · Schriftgröße.",
    description_en: "Mushroom · Subtitle · Font size."
  },
  {
    name: "--mush-subtitle-font-weight",
    type: "raw",
    category: "subtitle",
    description: "Mushroom · Subtitle · CSS-`font-weight`.",
    description_en: "Mushroom · Subtitle · CSS `font-weight`."
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
    description: "Mushroom · Subtitle · Buchstabenabstand.",
    description_en: "Mushroom · Subtitle · Letter spacing."
  },
  {
    name: "--mush-subtitle-line-height",
    type: "raw",
    category: "subtitle",
    description: "Mushroom · Subtitle · CSS-`line-height`.",
    description_en: "Mushroom · Subtitle · CSS `line-height`."
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
    description: "Mushroom · Icon · Ecken-Rundung des Icon-Hintergrund-Containers. 50% = Kreis.",
    description_en: "Mushroom · Icon · Corner radius of the icon background container. 50% = circle."
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
    description: "Mushroom · Icon · Größe des Icon-Containers.",
    description_en: "Mushroom · Icon · Size of the icon container."
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
    description: "Mushroom · Icon · Größe des eigentlichen Icon-Symbols innerhalb des Containers.",
    description_en: "Mushroom · Icon · Size of the actual icon symbol inside the container."
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
    description: "Mushroom · Badge · Ecken-Rundung der State-Badge.",
    description_en: "Mushroom · Badge · Corner radius of the state badge."
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
    description: "Mushroom · Badge · Größe des Badge-Icons.",
    description_en: "Mushroom · Badge · Size of the badge icon."
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
    description: "Mushroom · Badge · Größe der gesamten Badge.",
    description_en: "Mushroom · Badge · Size of the entire badge."
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
    description: "Mushroom · Chip · Ecken-Rundung des Avatar-Bildes im Chip.",
    description_en: "Mushroom · Chip · Corner radius of the avatar image inside the chip."
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
    description: "Mushroom · Chip · Innenabstand um den Avatar.",
    description_en: "Mushroom · Chip · Inner padding around the avatar."
  },
  {
    name: "--mush-chip-background",
    type: "color",
    category: "chip",
    description: "Mushroom · Chip · Hintergrund-Farbe der Chip-Container.",
    description_en: "Mushroom · Chip · Background color of the chip containers."
  },
  {
    name: "--mush-chip-border-color",
    type: "color",
    category: "chip",
    description: "Mushroom · Chip · Border-Farbe der Chips.",
    description_en: "Mushroom · Chip · Border color of the chips."
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
    description: "Mushroom · Chip · Ecken-Rundung der Chips.",
    description_en: "Mushroom · Chip · Corner radius of the chips."
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
    description: "Mushroom · Chip · Border-Breite.",
    description_en: "Mushroom · Chip · Border width."
  },
  {
    name: "--mush-chip-box-shadow",
    type: "shadow",
    category: "chip",
    description: "Mushroom · Chip · Schatten unter Chips. `none` für flach.",
    description_en: "Mushroom · Chip · Shadow under chips. `none` for flat."
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
    description: "Mushroom · Chip · Schriftgröße in Chips.",
    description_en: "Mushroom · Chip · Font size in chips."
  },
  {
    name: "--mush-chip-font-weight",
    type: "raw",
    category: "chip",
    description: "Mushroom · Chip · `font-weight` in Chips.",
    description_en: "Mushroom · Chip · `font-weight` in chips."
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
    description: "Mushroom · Chip · Höhe der Chips.",
    description_en: "Mushroom · Chip · Height of the chips."
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
    description: "Mushroom · Chip · Icon-Größe in Chips.",
    description_en: "Mushroom · Chip · Icon size in chips."
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
    description: "Mushroom · Chip · Innen-Padding der Chips.",
    description_en: "Mushroom · Chip · Inner padding of the chips."
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
    description: "Mushroom · Chip · Abstand zwischen Chips.",
    description_en: "Mushroom · Chip · Spacing between chips."
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
    description: "Mushroom · Control · Ecken-Rundung der Control-Elemente (Sliders, Buttons).",
    description_en: "Mushroom · Control · Corner radius of control elements (sliders, buttons)."
  },
  {
    name: "--mush-control-button-ratio",
    type: "raw",
    category: "control",
    description: "Mushroom · Control · Verhältnis Button-Breite zur Höhe (unitless Zahl, z.B. `1` = quadratisch).",
    description_en: "Mushroom · Control · Ratio of button width to height (unitless number, e.g. `1` = square)."
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
    description: "Mushroom · Control · Höhe der Control-Buttons/Slider.",
    description_en: "Mushroom · Control · Height of the control buttons/sliders."
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
    description: "Mushroom · Control · Icon-Größe in Controls.",
    description_en: "Mushroom · Control · Icon size in controls."
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
    description: "Mushroom · Control · Abstand zwischen Control-Elementen.",
    description_en: "Mushroom · Control · Spacing between control elements."
  },
  {
    name: "--mush-input-number-debounce",
    type: "raw",
    category: "layout",
    description: "Mushroom · Misc · Debounce-Zeit für Number-Inputs in ms (z.B. `1000`).",
    description_en: "Mushroom · Misc · Debounce time for number inputs in ms (e.g. `1000`)."
  },
  {
    name: "--mush-layout-align",
    type: "raw",
    category: "layout",
    description: "Mushroom · Misc · Layout-Ausrichtung (flex-start, center, flex-end).",
    description_en: "Mushroom · Misc · Layout alignment (flex-start, center, flex-end)."
  },
  {
    name: "--mush-slider-threshold",
    type: "raw",
    category: "layout",
    description: "Mushroom · Misc · Schwellwert für Slider-Aktivierung (unitless Zahl).",
    description_en: "Mushroom · Misc · Threshold for slider activation (unitless number)."
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
    description: "Mushroom · Misc · Generischer Standard-Abstand zwischen Elementen.",
    description_en: "Mushroom · Misc · Generic default spacing between elements."
  },
  {
    name: "--mush-rgb-amber",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Amber als 'R, G, B'. Für rgba(var(--mush-rgb-amber), alpha).",
    description_en: "Mushroom · Material-RGB · Amber as 'R, G, B'. For rgba(var(--mush-rgb-amber), alpha)."
  },
  {
    name: "--mush-rgb-black",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Schwarz.",
    description_en: "Mushroom · Material-RGB · Black."
  },
  {
    name: "--mush-rgb-blue",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Blau.",
    description_en: "Mushroom · Material-RGB · Blue."
  },
  {
    name: "--mush-rgb-blue-grey",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Blau-Grau.",
    description_en: "Mushroom · Material-RGB · Blue-grey."
  },
  {
    name: "--mush-rgb-brown",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Braun.",
    description_en: "Mushroom · Material-RGB · Brown."
  },
  {
    name: "--mush-rgb-cyan",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Cyan.",
    description_en: "Mushroom · Material-RGB · Cyan."
  },
  {
    name: "--mush-rgb-dark-grey",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Dunkelgrau.",
    description_en: "Mushroom · Material-RGB · Dark grey."
  },
  {
    name: "--mush-rgb-deep-orange",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Dunkel-Orange.",
    description_en: "Mushroom · Material-RGB · Deep orange."
  },
  {
    name: "--mush-rgb-deep-purple",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Dunkel-Violett.",
    description_en: "Mushroom · Material-RGB · Deep purple."
  },
  {
    name: "--mush-rgb-green",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Grün.",
    description_en: "Mushroom · Material-RGB · Green."
  },
  {
    name: "--mush-rgb-grey",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Grau.",
    description_en: "Mushroom · Material-RGB · Grey."
  },
  {
    name: "--mush-rgb-indigo",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Indigo.",
    description_en: "Mushroom · Material-RGB · Indigo."
  },
  {
    name: "--mush-rgb-light-blue",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Hellblau.",
    description_en: "Mushroom · Material-RGB · Light blue."
  },
  {
    name: "--mush-rgb-light-green",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Hellgrün.",
    description_en: "Mushroom · Material-RGB · Light green."
  },
  {
    name: "--mush-rgb-light-grey",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Hellgrau.",
    description_en: "Mushroom · Material-RGB · Light grey."
  },
  {
    name: "--mush-rgb-lime",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Lime.",
    description_en: "Mushroom · Material-RGB · Lime."
  },
  {
    name: "--mush-rgb-orange",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Orange.",
    description_en: "Mushroom · Material-RGB · Orange."
  },
  {
    name: "--mush-rgb-pink",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Pink.",
    description_en: "Mushroom · Material-RGB · Pink."
  },
  {
    name: "--mush-rgb-purple",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Violett.",
    description_en: "Mushroom · Material-RGB · Purple."
  },
  {
    name: "--mush-rgb-red",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Rot.",
    description_en: "Mushroom · Material-RGB · Red."
  },
  {
    name: "--mush-rgb-teal",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Teal.",
    description_en: "Mushroom · Material-RGB · Teal."
  },
  {
    name: "--mush-rgb-white",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Weiss.",
    description_en: "Mushroom · Material-RGB · White."
  },
  {
    name: "--mush-rgb-yellow",
    type: "raw",
    category: "rgb-material",
    description: "Mushroom · Material-RGB · Gelb.",
    description_en: "Mushroom · Material-RGB · Yellow."
  },
  {
    name: "--mush-rgb-danger",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Danger/Error (typisch rot).",
    description_en: "Mushroom · Semantic · Danger/error (typically red)."
  },
  {
    name: "--mush-rgb-disabled",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Disabled-Zustand (typisch grau).",
    description_en: "Mushroom · Semantic · Disabled state (typically grey)."
  },
  {
    name: "--mush-rgb-info",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Info (typisch blau).",
    description_en: "Mushroom · Semantic · Info (typically blue)."
  },
  {
    name: "--mush-rgb-success",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Success (typisch grün).",
    description_en: "Mushroom · Semantic · Success (typically green)."
  },
  {
    name: "--mush-rgb-warning",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Warning (typisch gelb/orange).",
    description_en: "Mushroom · Semantic · Warning (typically yellow/orange)."
  },
  {
    name: "--mush-rgb-update-installing",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Update wird gerade installiert.",
    description_en: "Mushroom · Semantic · Update currently installing."
  },
  {
    name: "--mush-rgb-update-off",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Kein Update verfügbar.",
    description_en: "Mushroom · Semantic · No update available."
  },
  {
    name: "--mush-rgb-state-update-on",
    type: "raw",
    category: "rgb-semantic",
    description: "Mushroom · Semantic · Update verfügbar (typisch orange).",
    description_en: "Mushroom · Semantic · Update available (typically orange)."
  },
  {
    name: "--mush-rgb-state-entity",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Default-Farbe für inaktive Entities.",
    description_en: "Mushroom · State · Default color for inactive entities."
  },
  {
    name: "--mush-rgb-state-alarm-armed",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Alarm armiert.",
    description_en: "Mushroom · State · Alarm armed."
  },
  {
    name: "--mush-rgb-state-alarm-disarmed",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Alarm deaktiviert.",
    description_en: "Mushroom · State · Alarm disarmed."
  },
  {
    name: "--mush-rgb-state-alarm-triggered",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Alarm ausgelöst.",
    description_en: "Mushroom · State · Alarm triggered."
  },
  {
    name: "--mush-rgb-state-climate-auto",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Auto-Modus.",
    description_en: "Mushroom · State · Climate auto mode."
  },
  {
    name: "--mush-rgb-state-climate-cool",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Cool-Modus (Kühlen).",
    description_en: "Mushroom · State · Climate cool mode (cooling)."
  },
  {
    name: "--mush-rgb-state-climate-dry",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Dry-Modus (Entfeuchten).",
    description_en: "Mushroom · State · Climate dry mode (dehumidifying)."
  },
  {
    name: "--mush-rgb-state-climate-fan-only",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Fan-Only-Modus.",
    description_en: "Mushroom · State · Climate fan-only mode."
  },
  {
    name: "--mush-rgb-state-climate-heat",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Heat-Modus (Heizen).",
    description_en: "Mushroom · State · Climate heat mode (heating)."
  },
  {
    name: "--mush-rgb-state-climate-heat-cool",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Heat-Cool-Modus (Hybrid).",
    description_en: "Mushroom · State · Climate heat-cool mode (hybrid)."
  },
  {
    name: "--mush-rgb-state-climate-idle",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Idle-Zustand.",
    description_en: "Mushroom · State · Climate idle state."
  },
  {
    name: "--mush-rgb-state-climate-off",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Climate-Off.",
    description_en: "Mushroom · State · Climate off."
  },
  {
    name: "--mush-rgb-state-cover-closed",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Cover geschlossen.",
    description_en: "Mushroom · State · Cover closed."
  },
  {
    name: "--mush-rgb-state-cover-open",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Cover offen.",
    description_en: "Mushroom · State · Cover open."
  },
  {
    name: "--mush-rgb-state-fan",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Fan-Entity.",
    description_en: "Mushroom · State · Fan entity."
  },
  {
    name: "--mush-rgb-state-humidifier",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Humidifier-Entity.",
    description_en: "Mushroom · State · Humidifier entity."
  },
  {
    name: "--mush-rgb-state-light",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Light-Entity (typisch amber/gelb).",
    description_en: "Mushroom · State · Light entity (typically amber/yellow)."
  },
  {
    name: "--mush-rgb-state-lock",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Lock-Entity (generisch).",
    description_en: "Mushroom · State · Lock entity (generic)."
  },
  {
    name: "--mush-rgb-state-lock-locked",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Lock im 'Locked'-State.",
    description_en: "Mushroom · State · Lock in 'locked' state."
  },
  {
    name: "--mush-rgb-state-lock-pending",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Lock im 'Pending'-State.",
    description_en: "Mushroom · State · Lock in 'pending' state."
  },
  {
    name: "--mush-rgb-state-lock-unlocked",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Lock im 'Unlocked'-State.",
    description_en: "Mushroom · State · Lock in 'unlocked' state."
  },
  {
    name: "--mush-rgb-state-media-player",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Media-Player-Entity.",
    description_en: "Mushroom · State · Media player entity."
  },
  {
    name: "--mush-rgb-state-number",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Number-Entity.",
    description_en: "Mushroom · State · Number entity."
  },
  {
    name: "--mush-rgb-state-person-home",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Person zuhause.",
    description_en: "Mushroom · State · Person home."
  },
  {
    name: "--mush-rgb-state-person-not-home",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Person nicht zuhause.",
    description_en: "Mushroom · State · Person not home."
  },
  {
    name: "--mush-rgb-state-person-unknown",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Person Status unbekannt.",
    description_en: "Mushroom · State · Person status unknown."
  },
  {
    name: "--mush-rgb-state-person-zone",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Person in einer Zone.",
    description_en: "Mushroom · State · Person in a zone."
  },
  {
    name: "--mush-rgb-state-vacuum",
    type: "raw",
    category: "rgb-states",
    description: "Mushroom · State · Vacuum-Entity.",
    description_en: "Mushroom · State · Vacuum entity."
  }
], fr = {
  id: Ct,
  categories: $t,
  variables: Bt
}, _r = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  categories: $t,
  default: fr,
  id: Ct,
  variables: Bt
}, Symbol.toStringTag, { value: "Module" })), yr = {
  // panel-main
  "panel.tab_themes": "Themes",
  "panel.tab_modules": "Bubble Card Module",
  "panel.tab_compare": "Vergleichen",
  "panel.hacs_warn": "HACS-Detection fehlgeschlagen — Plugin-Filter ist inaktiv, alle Plugins werden gezeigt (auch wenn das zugehörige Custom-Repo gar nicht installiert ist).",
  "panel.hacs_warn_dismiss": "Hinweis ausblenden",
  // common
  "common.error_prefix": "Fehler",
  // theme-picker
  "picker.loading": "Lade Themes…",
  "picker.heading": "Welches Theme möchtest du tunen?",
  "picker.empty": "Keine Themes gefunden. Lege eine YAML-Datei in themes/ an.",
  "picker.var_count": "{n} Variablen",
  "picker.yaml_errors_heading": "YAML-Fehler in folgenden Dateien:",
  "picker.badge_hacs": "HACS",
  "picker.badge_hacs_title": "HACS-verwaltet — Updates überschreiben deine Änderungen. Studio bietet beim Speichern an, ein eigenes Theme abzuleiten.",
  "picker.badge_own": "Eigen",
  "picker.badge_default": "Default",
  "picker.badge_default_title": "Globales Standard-Theme von Home Assistant",
  "picker.compare_upstream_tooltip": "Mit Upstream vergleichen (Fork ↔ HACS-Quelle) — Updates per ←-Pfeil in den Fork ziehen",
  "picker.delete_tooltip": "Dieses abgeleitete Theme löschen (Backup bleibt)",
  "picker.delete_confirm": `Abgeleitetes Theme '{theme}' löschen?

Eine Sicherung wird unter themes/.backups/ angelegt — der Schritt ist reversibel.`,
  // module-picker
  "module_picker.loading": "Lade Module…",
  "module_picker.heading": "Welches Bubble-Card-Modul möchtest du anpassen?",
  "module_picker.no_root": "Kein bubble_card/modules/-Verzeichnis gefunden. Bubble Card legt das automatisch an, sobald du dein erstes Modul speicherst — oder leg es manuell unter <config>/bubble_card/modules/ an.",
  "module_picker.empty": "Keine Module in bubble_card/modules/ gefunden.",
  "module_picker.tag_global": "global",
  "module_picker.tag_no_code": "kein code",
  // common
  "common.backup": "Backup",
  // compare-view
  "compare.mode_default": "Default",
  "compare.need_two_themes": "Theme-Switcher braucht mindestens 2 Themes im themes/-Verzeichnis (aktuell {count}).",
  "compare.theme_a": "Theme A",
  "compare.theme_b": "Theme B",
  "compare.diff_only": "Nur Unterschiede",
  "compare.no_theme": "(kein Theme)",
  "compare.loading_theme": "Lade Theme-Inhalt…",
  "compare.pick_both": "Wähle beide Themes oben aus.",
  "compare.mode_only_in": "Nur in {side} vorhanden",
  "compare.mode_label": "{mode}-Mode",
  "compare.mode_missing_hint": "{theme} hat keine {mode}-Mode (Copy würde sie anlegen).",
  "compare.summary": "{themeA} hat {countA} Vars, {themeB} hat {countB}. Insgesamt",
  "compare.summary_diffs": "{n} Unterschiede oder einseitige Einträge.",
  "compare.no_diffs": "Keine Unterschiede zwischen den Themes in der {mode}-Mode.",
  "compare.mode_selector_label": "Modus:",
  "compare.mode_diff_badge_title": "{n} Unterschiede in diesem Modus",
  "compare.no_diffs_here": "Keine Unterschiede im {mode}-Modus.",
  "compare.diffs_elsewhere": "Aber Unterschiede in:",
  "compare.col_variable": "Variable",
  "compare.col_action": "Aktion",
  "compare.not_in_theme": "(nicht im Theme)",
  "compare.copy_no_value": "{side} hat keinen Wert",
  "compare.copy_tooltip": "Wert von {from} nach {to} kopieren",
  "compare.copy_confirm": `Kopieren: '{key}' = '{value}' von {from} nach {to} ({file})
Mode: {mode}

Ein Backup von {file} wird automatisch angelegt.`,
  "compare.copy_confirm_new_mode": "— wird neu angelegt",
  "compare.copy_success": "{key} kopiert nach {theme} ({mode})",
  "compare.copy_failed": "Kopieren fehlgeschlagen",
  // common toolbar / buttons
  "common.back": "← Zurück",
  "common.save": "Speichern",
  "common.saving": "Speichere…",
  "common.discard": "Verwerfen",
  "common.dirty_badge": "geändert",
  "common.notice": "Hinweis",
  "common.fallback": "Fallback",
  "common.tag_heuristic": "heuristik",
  "common.save_failed": "Speichern fehlgeschlagen",
  // module-editor
  "module_editor.loading": "Lade Modul…",
  "module_editor.back_confirm": "Ungespeicherte Änderungen am Modul gehen verloren. Trotzdem zurück?",
  "module_editor.save_confirm": `Modul '{moduleId}' in '{file}' speichern?

Ein Backup wird automatisch unter bubble_card/.backups/ angelegt.`,
  "module_editor.reset_confirm": "Alle Änderungen am Modul werden auf den Original-Zustand zurückgesetzt. Fortfahren?",
  "module_editor.reload_notice": "Bubble Card lädt Module beim Card-Render. Nach Save musst du deine Dashboards neu laden (Cmd+R), damit die Änderungen wirksam werden.",
  "module_editor.metadata_heading": "Metadaten",
  "module_editor.field_name": "Name",
  "module_editor.field_description": "Description",
  "module_editor.field_version": "Version",
  "module_editor.field_supported": "Supported",
  "module_editor.supported_help": "Komma-getrennte Card-Types (button, climate, cover, horizontal-buttons-stack, media-player, pop-up, select, separator, sub-buttons).",
  "module_editor.extra_keys": "Weitere Felder im YAML (werden beim Save 1:1 erhalten)",
  "module_editor.css_heading": "CSS-Code",
  "module_editor.vars_heading": "Verwendete Variablen",
  "module_editor.vars_empty": "Keine var(--…) im Code gefunden.",
  "module_editor.save_success": "Modul gespeichert",
  "module_editor.save_success_reload": "Lade jetzt das Dashboard neu (Cmd+R), damit die Änderung wirksam wird.",
  // editor-view
  "editor.mode_default": "Default",
  "editor.cat_unknown": "Unbekannt (Heuristik)",
  "editor.cat_other": "Sonstige",
  "editor.preview": "Preview",
  "editor.preview_tooltip": "Live-Preview eines Dashboards in einem iframe daneben",
  "editor.discard_all": "Alles verwerfen",
  "editor.mode_bar_label": "Mode",
  "editor.tab_in_theme": "Im Theme",
  "editor.tag_default": "default",
  "editor.tag_adding": "+ wird ergänzt",
  "editor.tag_removing": "× wird entfernt",
  "editor.loading": "Lade Theme…",
  "editor.empty_default": "Keine editierbaren Variablen in diesem Theme.",
  "editor.empty_mode": "Keine Override-Variablen für Mode '{mode}' im Theme. Wechsle auf einen Plugin-Tab um welche hinzuzufügen.",
  "editor.empty_plugin": "Keine Variablen in diesem Plugin-Tab.",
  "editor.notice_skipped_prefix": "Diese Theme-Datei enthält komplexe Werte unter",
  "editor.notice_skipped_suffix": ", die der Variablen-Editor nicht abbildet (verschachtelte Strukturen).",
  "editor.notice_mode_prefix": "Edits hier landen unter",
  "editor.notice_mode_suffix": "im YAML und wirken in HA nur wenn dieser Mode aktiv ist. Live-Preview greift dennoch unabhängig vom HA-Mode — schalte HA ggf. selbst um, um den richtigen Render-Kontext zu sehen.",
  "editor.notice_plugin_strong": "Plugin-Tab",
  "editor.notice_plugin_prefix": "alle {n} Schema-Variablen werden gezeigt. Variablen mit",
  "editor.notice_plugin_middle": "-Tag stehen (noch) nicht im Theme. Sobald du einen Wert änderst, wird die Variable beim Speichern als",
  "editor.notice_plugin_top_level": "Top-Level-Eintrag",
  "editor.notice_plugin_override": "Override unter",
  "editor.notice_plugin_suffix": "ins Theme aufgenommen.",
  "editor.save_confirm": `{what} in '{file}' > '{theme}' speichern?

Ein Backup wird automatisch unter themes/.backups/ angelegt.`,
  "editor.save_part_modify_one": "{n} bestehende Änderung",
  "editor.save_part_modify_many": "{n} bestehende Änderungen",
  "editor.save_part_add_one": "{n} neue Variable",
  "editor.save_part_add_many": "{n} neue Variablen",
  "editor.save_part_remove_one": "{n} Entfernung",
  "editor.save_part_remove_many": "{n} Entfernungen",
  "editor.reset_confirm": "{n} ungespeicherte Änderung(en) werden verworfen (über alle Modes und Tabs). Fortfahren?",
  "editor.back_confirm": "{n} ungespeicherte Änderung(en) gehen verloren. Trotzdem zurück?",
  "editor.save_success": "Gespeichert",
  "editor.dirty_count_one": "{n} Änderung",
  "editor.dirty_count_many": "{n} Änderungen",
  "editor.dirty_adding": "{n} neu",
  "editor.dirty_removing": "{n} ×",
  "editor.reset_row_tooltip": "Auf Original zurücksetzen (verwirft auch eine Entfernen-Markierung)",
  "editor.remove_row_tooltip": "Variable beim nächsten Speichern aus dem Theme entfernen",
  "editor.remove_row_disabled_tooltip": "Nicht im Theme — nichts zu entfernen",
  // editor — Fork-Guard (v1.1)
  "editor.hacs_notice_strong": "HACS-verwaltetes Theme",
  "editor.hacs_notice_body": "Dieses Theme gehört einem HACS-Repo — ein Update überschreibt direkte Änderungen. Studio schreibt deshalb nicht zurück, sondern leitet beim Speichern ein eigenes Theme ab (eigene Datei, update-sicher).",
  "editor.save_as_own": "Als eigenes Theme speichern",
  "editor.fork_btn": "Ableiten",
  "editor.fork_btn_tooltip": "Dieses Theme als eigenes, HACS-update-sicheres Theme in themes/<name>.yaml ableiten",
  "editor.forking": "Leite ab…",
  "editor.fork_default": "{theme} Theme Studio",
  "editor.fork_prompt": `'{theme}' als eigenes Theme ableiten (eigene Datei, HACS-update-sicher).

Name des neuen Themes:`,
  "editor.fork_prompt_save": `'{theme}' ist HACS-verwaltet — direktes Speichern würde beim nächsten HACS-Update überschrieben.

Deine Änderungen werden stattdessen in ein eigenes Theme abgeleitet. Name des neuen Themes:`,
  "editor.fork_success": "Als eigenes Theme abgeleitet: '{theme}'",
  // editor — Default-Theme setzen (v1.1)
  "editor.set_default": "Als Default setzen",
  "editor.set_default_tooltip": "Dieses Theme als globales Standard-Theme von Home Assistant setzen (frontend.set_theme)",
  "editor.setting_default": "Setze…",
  "editor.is_default": "Standard-Theme",
  "editor.is_default_tooltip": "Dieses Theme ist bereits das globale Standard-Theme",
  "editor.set_default_failed": "Default setzen fehlgeschlagen",
  // preview-pane
  "preview.label": "Preview",
  "preview.reload_tooltip": "iframe neu laden",
  "preview.overrides_one": "{n} override",
  "preview.overrides_many": "{n} overrides",
  "preview.override_failed": "iframe-CSS-Override fehlgeschlagen (möglicherweise Cross-Origin)",
  // background-picker
  "bg.no_image": "(kein Bild — '{value}')",
  "bg.url_placeholder": "https://… oder /local/wallpaper.jpg (= /homeassistant/www/wallpaper.jpg)",
  "bg.modifier": "Modifier",
  "bg.modifier_placeholder": "z.B. center / cover no-repeat fixed",
  "bg.preset_cover_tooltip": "Vollbild, zentriert, fixiert (Apple-/visionOS-Style)",
  "bg.preset_contain_tooltip": "Komplett sichtbar, zentriert",
  "bg.preset_tile_tooltip": "Bild wiederholen (Pattern)",
  "bg.clear": "Clear",
  "bg.clear_tooltip": "Auf 'none' setzen — kein Hintergrund-Bild",
  "bg.browse": "Durchsuchen…",
  "bg.browse_tooltip": "Bild aus www/ wählen (wird unter /local/ serviert)",
  "bg.browse_loading": "Lade Bilder aus www/…",
  "bg.browse_empty": "Keine Bilder in www/ gefunden. Lege Bilder unter <config>/www/ ab.",
  "bg.browse_count": "{n} Bilder in www/",
  "bg.browse_truncated": "gekürzt (Limit erreicht)",
  "bg.var_ref_notice": "Diese Variable verweist auf eine andere (var(...)) — sie hält kein Bild. Setze das Hintergrund-Bild an der Ziel-Variable (z.B. background-image im Light-/Dark-Mode). Hier nur manuell editieren."
}, vr = {
  // panel-main
  "panel.tab_themes": "Themes",
  "panel.tab_modules": "Bubble Card Modules",
  "panel.tab_compare": "Compare",
  "panel.hacs_warn": "HACS detection failed — plugin filter is inactive, all plugins are shown (even if the corresponding custom repository is not installed).",
  "panel.hacs_warn_dismiss": "Dismiss notice",
  // common
  "common.error_prefix": "Error",
  // theme-picker
  "picker.loading": "Loading themes…",
  "picker.heading": "Which theme do you want to tune?",
  "picker.empty": "No themes found. Drop a YAML file into themes/ to get started.",
  "picker.var_count": "{n} variables",
  "picker.yaml_errors_heading": "YAML errors in these files:",
  "picker.badge_hacs": "HACS",
  "picker.badge_hacs_title": "HACS-managed — updates overwrite your changes. On save, Studio offers to derive your own theme.",
  "picker.badge_own": "Own",
  "picker.badge_default": "Default",
  "picker.badge_default_title": "Home Assistant's global default theme",
  "picker.compare_upstream_tooltip": "Compare with upstream (fork ↔ HACS source) — pull updates into the fork with the ← arrow",
  "picker.delete_tooltip": "Delete this derived theme (backup kept)",
  "picker.delete_confirm": `Delete derived theme '{theme}'?

A backup is written to themes/.backups/ — this is reversible.`,
  // module-picker
  "module_picker.loading": "Loading modules…",
  "module_picker.heading": "Which Bubble Card module do you want to tweak?",
  "module_picker.no_root": "No bubble_card/modules/ directory found. Bubble Card creates it automatically when you save your first module — or create it manually at <config>/bubble_card/modules/.",
  "module_picker.empty": "No modules found in bubble_card/modules/.",
  "module_picker.tag_global": "global",
  "module_picker.tag_no_code": "no code",
  // common
  "common.backup": "Backup",
  // compare-view
  "compare.mode_default": "Default",
  "compare.need_two_themes": "Theme switcher needs at least 2 themes in themes/ (currently {count}).",
  "compare.theme_a": "Theme A",
  "compare.theme_b": "Theme B",
  "compare.diff_only": "Only differences",
  "compare.no_theme": "(no theme)",
  "compare.loading_theme": "Loading theme contents…",
  "compare.pick_both": "Pick both themes above.",
  "compare.mode_only_in": "Only in {side}",
  "compare.mode_label": "{mode} mode",
  "compare.mode_missing_hint": "{theme} has no {mode} mode (copy would create it).",
  "compare.summary": "{themeA} has {countA} vars, {themeB} has {countB}. In total",
  "compare.summary_diffs": "{n} differences or one-sided entries.",
  "compare.no_diffs": "No differences between themes in {mode} mode.",
  "compare.mode_selector_label": "Mode:",
  "compare.mode_diff_badge_title": "{n} differences in this mode",
  "compare.no_diffs_here": "No differences in {mode} mode.",
  "compare.diffs_elsewhere": "But differences in:",
  "compare.col_variable": "Variable",
  "compare.col_action": "Action",
  "compare.not_in_theme": "(not in theme)",
  "compare.copy_no_value": "{side} has no value",
  "compare.copy_tooltip": "Copy value from {from} to {to}",
  "compare.copy_confirm": `Copy: '{key}' = '{value}' from {from} to {to} ({file})
Mode: {mode}

A backup of {file} will be created automatically.`,
  "compare.copy_confirm_new_mode": "— will be created",
  "compare.copy_success": "{key} copied to {theme} ({mode})",
  "compare.copy_failed": "Copy failed",
  // common toolbar / buttons
  "common.back": "← Back",
  "common.save": "Save",
  "common.saving": "Saving…",
  "common.discard": "Discard",
  "common.dirty_badge": "modified",
  "common.notice": "Note",
  "common.fallback": "Fallback",
  "common.tag_heuristic": "heuristic",
  "common.save_failed": "Save failed",
  // module-editor
  "module_editor.loading": "Loading module…",
  "module_editor.back_confirm": "Unsaved changes to the module will be lost. Go back anyway?",
  "module_editor.save_confirm": `Save module '{moduleId}' in '{file}'?

A backup will be created automatically at bubble_card/.backups/.`,
  "module_editor.reset_confirm": "All module changes will be reverted to the original state. Continue?",
  "module_editor.reload_notice": "Bubble Card loads modules at card-render time. After saving, reload your dashboards (Cmd+R) for the changes to take effect.",
  "module_editor.metadata_heading": "Metadata",
  "module_editor.field_name": "Name",
  "module_editor.field_description": "Description",
  "module_editor.field_version": "Version",
  "module_editor.field_supported": "Supported",
  "module_editor.supported_help": "Comma-separated card types (button, climate, cover, horizontal-buttons-stack, media-player, pop-up, select, separator, sub-buttons).",
  "module_editor.extra_keys": "Additional YAML fields (preserved verbatim on save)",
  "module_editor.css_heading": "CSS code",
  "module_editor.vars_heading": "Used variables",
  "module_editor.vars_empty": "No var(--…) found in code.",
  "module_editor.save_success": "Module saved",
  "module_editor.save_success_reload": "Reload your dashboard (Cmd+R) for the change to take effect.",
  // editor-view
  "editor.mode_default": "Default",
  "editor.cat_unknown": "Unknown (heuristic)",
  "editor.cat_other": "Other",
  "editor.preview": "Preview",
  "editor.preview_tooltip": "Live preview of a dashboard in an iframe next to the editor",
  "editor.discard_all": "Discard all",
  "editor.mode_bar_label": "Mode",
  "editor.tab_in_theme": "In theme",
  "editor.tag_default": "default",
  "editor.tag_adding": "+ will be added",
  "editor.tag_removing": "× will be removed",
  "editor.loading": "Loading theme…",
  "editor.empty_default": "No editable variables in this theme.",
  "editor.empty_mode": "No override variables for mode '{mode}' in the theme. Switch to a plugin tab to add some.",
  "editor.empty_plugin": "No variables in this plugin tab.",
  "editor.notice_skipped_prefix": "This theme file contains complex values under",
  "editor.notice_skipped_suffix": " that the variable editor cannot map (nested structures).",
  "editor.notice_mode_prefix": "Edits here land under",
  "editor.notice_mode_suffix": "in the YAML and only apply in HA when this mode is active. Live preview still works regardless of HA mode — switch HA itself if you need the matching render context.",
  "editor.notice_plugin_strong": "Plugin tab",
  "editor.notice_plugin_prefix": "all {n} schema variables are shown. Variables with the",
  "editor.notice_plugin_middle": "tag are not yet in the theme. As soon as you change a value, the variable is added on save as",
  "editor.notice_plugin_top_level": "a top-level entry",
  "editor.notice_plugin_override": "an override under",
  "editor.notice_plugin_suffix": "in the theme.",
  "editor.save_confirm": `Save {what} in '{file}' > '{theme}'?

A backup will be created automatically at themes/.backups/.`,
  "editor.save_part_modify_one": "{n} existing change",
  "editor.save_part_modify_many": "{n} existing changes",
  "editor.save_part_add_one": "{n} new variable",
  "editor.save_part_add_many": "{n} new variables",
  "editor.save_part_remove_one": "{n} removal",
  "editor.save_part_remove_many": "{n} removals",
  "editor.reset_confirm": "{n} unsaved change(s) will be discarded (across all modes and tabs). Continue?",
  "editor.back_confirm": "{n} unsaved change(s) will be lost. Go back anyway?",
  "editor.save_success": "Saved",
  "editor.dirty_count_one": "{n} change",
  "editor.dirty_count_many": "{n} changes",
  "editor.dirty_adding": "{n} new",
  "editor.dirty_removing": "{n} ×",
  "editor.reset_row_tooltip": "Reset to original (also discards a removal mark)",
  "editor.remove_row_tooltip": "Remove the variable from the theme on next save",
  "editor.remove_row_disabled_tooltip": "Not in theme — nothing to remove",
  // editor — fork guard (v1.1)
  "editor.hacs_notice_strong": "HACS-managed theme",
  "editor.hacs_notice_body": "This theme belongs to a HACS repo — an update overwrites direct changes. Studio therefore won't write back; on save it derives your own theme (own file, update-safe).",
  "editor.save_as_own": "Save as own theme",
  "editor.fork_btn": "Derive",
  "editor.fork_btn_tooltip": "Derive this theme into your own, HACS-update-safe theme at themes/<name>.yaml",
  "editor.forking": "Deriving…",
  "editor.fork_default": "{theme} Theme Studio",
  "editor.fork_prompt": `Derive '{theme}' into your own theme (own file, HACS-update-safe).

Name of the new theme:`,
  "editor.fork_prompt_save": `'{theme}' is HACS-managed — a direct save would be overwritten by the next HACS update.

Your changes are derived into your own theme instead. Name of the new theme:`,
  "editor.fork_success": "Derived into your own theme: '{theme}'",
  // editor — set default theme (v1.1)
  "editor.set_default": "Set as default",
  "editor.set_default_tooltip": "Set this theme as Home Assistant's global default theme (frontend.set_theme)",
  "editor.setting_default": "Setting…",
  "editor.is_default": "Default theme",
  "editor.is_default_tooltip": "This theme is already the global default theme",
  "editor.set_default_failed": "Setting default failed",
  // preview-pane
  "preview.label": "Preview",
  "preview.reload_tooltip": "Reload iframe",
  "preview.overrides_one": "{n} override",
  "preview.overrides_many": "{n} overrides",
  "preview.override_failed": "iframe CSS override failed (possibly cross-origin)",
  // background-picker
  "bg.no_image": "(no image — '{value}')",
  "bg.url_placeholder": "https://… or /local/wallpaper.jpg (= /homeassistant/www/wallpaper.jpg)",
  "bg.modifier": "Modifier",
  "bg.modifier_placeholder": "e.g. center / cover no-repeat fixed",
  "bg.preset_cover_tooltip": "Fullscreen, centered, fixed (Apple/visionOS style)",
  "bg.preset_contain_tooltip": "Fully visible, centered",
  "bg.preset_tile_tooltip": "Repeat image (pattern)",
  "bg.clear": "Clear",
  "bg.clear_tooltip": "Set to 'none' — no background image",
  "bg.browse": "Browse…",
  "bg.browse_tooltip": "Pick an image from www/ (served under /local/)",
  "bg.browse_loading": "Loading images from www/…",
  "bg.browse_empty": "No images found in www/. Drop images into <config>/www/.",
  "bg.browse_count": "{n} images in www/",
  "bg.browse_truncated": "truncated (limit reached)",
  "bg.var_ref_notice": "This variable references another one (var(...)) — it holds no image. Set the background image on the target variable (e.g. background-image in light/dark mode). Edit here manually only."
}, he = { de: yr, en: vr }, ze = "en";
let Y = ze;
function wr(e) {
  if (!e)
    return Y = ze, Y;
  const t = e.toLowerCase().split(/[-_]/, 1)[0];
  return Y = t in he ? t : ze, Y;
}
function Mt() {
  return Y;
}
function s(e, t, r) {
  const a = he[Y][e] ?? he.en[e] ?? he.de[e] ?? t ?? e;
  return r ? a.replace(
    /\{(\w+)\}/g,
    (o, i) => i in r ? String(r[i]) : `{${i}}`
  ) : a;
}
const xr = /-(radius|size|width|height|padding|margin|gap)$/, kr = /-(color|bg|background)$/, Sr = /-(image|background-image)$/, Cr = [
  /^#[0-9a-f]{3,8}$/i,
  // #rgb, #rrggbb, #rrggbbaa
  /^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\s*\(/i,
  /^(transparent|currentColor|inherit)$/i
], $r = /^var\(\s*--[A-Za-z0-9_-]*-(color|bg|background)\b/i, Br = /^-?\d*\.?\d+(px|rem|em|vh|vw|vmin|vmax|%)$/i, Mr = /^var\(\s*--[A-Za-z0-9_-]*-(radius|size|width|height|padding|margin|gap)\b/i;
function Ar(e) {
  const t = e.trim();
  if (t) {
    if (/url\s*\(/i.test(t) || /gradient\s*\(/i.test(t)) return "background";
    if (Cr.some((r) => r.test(t)) || $r.test(t)) return "color";
    if (Br.test(t) || Mr.test(t)) return "length";
  }
}
function zr(e, t) {
  if (/-family$/.test(e)) return "font-family";
  if (/-shadow$/.test(e)) return "shadow";
  if (Sr.test(e)) return "background";
  if (xr.test(e)) return "length";
  if (kr.test(e)) return "color";
  if (t !== void 0) {
    const r = Ar(t);
    if (r) return r;
  }
  return "raw";
}
const Tr = [
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
], Pr = {
  color: "Farbe",
  length: "Länge / Größe",
  shadow: "Schatten",
  background: "Hintergrund-Bild",
  "font-family": "Schriftart-Stack",
  enum: "Auswahl",
  "var-ref": "var()-Referenz",
  raw: "freier Text-Wert"
};
function Dr(e, t) {
  const a = Tr.find(({ re: i }) => i.test(e))?.label ?? "Quelle unbekannt", o = Pr[t];
  return `${a} · vermutlich ${o} (Heuristik).`;
}
const Er = /* @__PURE__ */ Object.assign({
  "../plugins/bubble-card/plugin.json": lr,
  "../plugins/ha-core/plugin.json": cr,
  "../plugins/mushroom/plugin.json": pr
}), Hr = /* @__PURE__ */ Object.assign({
  "../plugins/bubble-card/schema.json": hr,
  "../plugins/ha-core/schema.json": gr,
  "../plugins/mushroom/schema.json": _r
});
function Fr() {
  const e = [];
  for (const [t, r] of Object.entries(Er)) {
    const a = t.replace(/\/plugin\.json$/, "/schema.json"), o = Hr[a];
    if (!o) {
      console.warn(
        `[theme-studio] Plugin at ${t} has no schema.json — skipping.`
      );
      continue;
    }
    e.push({ manifest: r.default, schema: o.default });
  }
  return e;
}
const ie = Object.freeze(Fr());
let ye = null;
const Te = /* @__PURE__ */ new Set();
function Rr(e) {
  ye = e === null ? null : new Set(e);
  for (const t of Te)
    try {
      t();
    } catch {
    }
}
function At(e) {
  return Te.add(e), () => Te.delete(e);
}
const Ke = ["ha-core"];
function Or(e) {
  return [...e].sort((t, r) => {
    const a = Ke.indexOf(t.manifest.id), o = Ke.indexOf(r.manifest.id);
    return a !== -1 && o !== -1 ? a - o : a !== -1 ? -1 : o !== -1 ? 1 : t.manifest.id.localeCompare(r.manifest.id);
  });
}
function ne() {
  const e = ie.filter((t) => {
    const r = t.manifest.detect;
    return r.method === "always" ? !0 : r.method === "hacs-repo" && r.value ? ye === null ? !0 : ye.has(r.value) : !0;
  });
  return Or(e);
}
const ve = /* @__PURE__ */ new Map();
for (const e of ie)
  for (const t of e.schema.variables)
    ve.has(t.name) || ve.set(t.name, { pluginId: e.manifest.id, def: t });
function we(e, t) {
  const r = ve.get(e);
  if (r)
    return {
      ...r.def,
      description: Lr(r.def),
      source: "schema",
      plugin: r.pluginId
    };
  const a = zr(e, t);
  return {
    name: e,
    type: a,
    description: Dr(e, a),
    source: "heuristic"
  };
}
function Lr(e) {
  return Mt() === "en" && e.description_en ? e.description_en : e.description;
}
function Gr(e) {
  return Mt() === "en" && e.label_en ? e.label_en : e.label;
}
function Ze() {
  const e = ne();
  return {
    plugins: ie.length,
    pluginIds: ie.map((t) => t.manifest.id),
    activePluginIds: e.map((t) => t.manifest.id),
    indexedVariables: ve.size,
    categories: ie.reduce(
      (t, r) => t + r.schema.categories.length,
      0
    ),
    hacsFilterApplied: ye !== null
  };
}
var Ir = Object.defineProperty, Ur = Object.getOwnPropertyDescriptor, U = (e, t, r, a) => {
  for (var o = a > 1 ? void 0 : a ? Ur(t, r) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (o = (a ? n(t, r, o) : n(o)) || o);
  return a && o && Ir(t, r, o), o;
};
let E = class extends x {
  constructor() {
    super(...arguments), this._loading = !0, this._themes = [], this._errors = [], this._loadError = null, this._actionError = null, this._deleting = null;
  }
  connectedCallback() {
    super.connectedCallback(), this._load();
  }
  async _load() {
    this._loading = !0, this._loadError = null;
    try {
      const e = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/list_themes"
      });
      this._themes = e.themes, this._errors = e.errors;
    } catch (e) {
      this._loadError = e instanceof Error ? e.message : String(e);
    } finally {
      this._loading = !1;
    }
  }
  render() {
    return this._loading ? l`<div class="empty">${s("picker.loading")}</div>` : this._loadError ? l`<div class="error">
        ${s("common.error_prefix")}: ${this._loadError}
      </div>` : l`
      <h2>${s("picker.heading")}</h2>
      ${this._actionError ? l`<div class="action-error">
            ${s("common.error_prefix")}: ${this._actionError}
          </div>` : ""}
      ${this._themes.length === 0 ? l`<div class="empty">${s("picker.empty")}</div>` : l`
            <div class="list">
              ${this._themes.map(
      (e) => l`
                  <div class="row">
                    <button
                      class="item"
                      @click=${() => this._select(e)}
                      title=${e.file}
                    >
                      <div class="info">
                        <div class="name">
                          ${e.theme_name}
                          ${e.hacs_managed ? l`<span
                                class="badge hacs"
                                title=${s("picker.badge_hacs_title")}
                                >${s("picker.badge_hacs")}</span
                              >` : l`<span class="badge own"
                                >${s("picker.badge_own")}</span
                              >`}
                          ${this.hass.themes?.default_theme === e.theme_name ? l`<span
                                class="badge default"
                                title=${s("picker.badge_default_title")}
                                >★ ${s("picker.badge_default")}</span
                              >` : ""}
                        </div>
                        <div class="meta">
                          ${e.file} ·
                          ${s("picker.var_count", void 0, {
        n: e.variable_count
      })}
                        </div>
                      </div>
                      <div class="arrow">→</div>
                    </button>
                    ${e.is_fork && this._upstreamFor(e) ? l`<button
                          class="compare-btn"
                          title=${s("picker.compare_upstream_tooltip")}
                          @click=${() => this._compareUpstream(e)}
                        >
                          ⇄
                        </button>` : ""}
                    ${e.is_fork ? l`<button
                          class="delete-btn"
                          ?disabled=${this._deleting !== null}
                          title=${s("picker.delete_tooltip")}
                          @click=${() => this._deleteFork(e)}
                        >
                          ${this._deleting === e.file ? "…" : "🗑"}
                        </button>` : ""}
                  </div>
                `
    )}
            </div>
          `}
      ${this._errors.length > 0 ? l`
            <div class="errors-list">
              <h3>${s("picker.yaml_errors_heading")}</h3>
              <ul>
                ${this._errors.map(
      (e) => l`<li>${e.file}: ${e.error}</li>`
    )}
              </ul>
            </div>
          ` : ""}
    `;
  }
  _select(e) {
    this.dispatchEvent(
      new CustomEvent("theme-selected", {
        detail: {
          file: e.file,
          theme_name: e.theme_name,
          hacs_managed: e.hacs_managed
        },
        bubbles: !0,
        composed: !0
      })
    );
  }
  /**
   * Löscht einen abgeleiteten Fork. Backend akzeptiert nur Registry-Forks und
   * verschiebt die Datei reversibel nach .backups/. Nach Erfolg Liste neu laden.
   */
  async _deleteFork(e) {
    if (!(this._deleting !== null || !window.confirm(
      s("picker.delete_confirm", void 0, { theme: e.theme_name })
    ))) {
      this._actionError = null, this._deleting = e.file;
      try {
        await this.hass.connection.sendMessagePromise({
          type: "theme_studio/delete_theme",
          file: e.file
        }), await this._load();
      } catch (r) {
        this._actionError = r instanceof Error ? r.message : String(r);
      } finally {
        this._deleting = null;
      }
    }
  }
  /**
   * Sucht das Upstream-Theme eines Forks (aus source_file/source_theme) in der
   * aktuellen Liste. null, wenn die Quelle nicht (mehr) existiert — dann kein
   * ⇄-Button (z.B. HACS-Theme deinstalliert).
   */
  _upstreamFor(e) {
    return !e.source_file || !e.source_theme ? null : this._themes.find(
      (t) => t.file === e.source_file && t.theme_name === e.source_theme
    ) ?? null;
  }
  /**
   * Öffnet Fork ↔ Upstream im Vergleichen-Tab (A=Fork, B=Upstream). panel-main
   * hört darauf, wechselt den Tab und reicht die Vorauswahl an die Compare-View.
   */
  _compareUpstream(e) {
    const t = this._upstreamFor(e);
    t && this.dispatchEvent(
      new CustomEvent("compare-upstream", {
        detail: {
          fork: { file: e.file, theme_name: e.theme_name },
          upstream: {
            file: t.file,
            theme_name: t.theme_name
          }
        },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
E.styles = B`
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
    .row {
      display: flex;
      align-items: stretch;
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
      flex: 1;
      min-width: 0;
      border: none;
      color: inherit;
      font: inherit;
      transition: transform 0.1s ease, box-shadow 0.1s ease;
    }
    .delete-btn {
      flex-shrink: 0;
      width: 48px;
      border: none;
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      color: var(--secondary-text-color);
      font-size: 1.2rem;
      cursor: pointer;
      transition: color 0.1s ease, background 0.1s ease;
    }
    .delete-btn:hover {
      color: var(--error-color, #db4437);
      background: rgba(219, 68, 55, 0.08);
    }
    .delete-btn:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .delete-btn:focus-visible {
      outline: 2px solid var(--error-color, #db4437);
      outline-offset: 2px;
    }
    .compare-btn {
      flex-shrink: 0;
      width: 48px;
      border: none;
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.08));
      color: var(--secondary-text-color);
      font-size: 1.2rem;
      cursor: pointer;
      transition: color 0.1s ease, background 0.1s ease;
    }
    .compare-btn:hover {
      color: var(--primary-color);
      background: rgba(3, 169, 244, 0.08);
    }
    .compare-btn:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .action-error {
      margin-bottom: 12px;
      padding: 10px 16px;
      border-radius: 4px;
      background: rgba(219, 68, 55, 0.1);
      border-left: 4px solid var(--error-color, #db4437);
      color: var(--error-color, #db4437);
      font-size: 0.9rem;
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
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
      white-space: nowrap;
    }
    .badge.hacs {
      background: rgba(255, 152, 0, 0.16);
      color: var(--warning-color, #ff9800);
    }
    .badge.own {
      background: rgba(67, 160, 71, 0.14);
      color: var(--success-color, #43a047);
    }
    .badge.default {
      background: var(--primary-color);
      color: #fff;
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
U([
  g({ attribute: !1 })
], E.prototype, "hass", 2);
U([
  p()
], E.prototype, "_loading", 2);
U([
  p()
], E.prototype, "_themes", 2);
U([
  p()
], E.prototype, "_errors", 2);
U([
  p()
], E.prototype, "_loadError", 2);
U([
  p()
], E.prototype, "_actionError", 2);
U([
  p()
], E.prototype, "_deleting", 2);
E = U([
  M("theme-picker")
], E);
var Nr = Object.defineProperty, jr = Object.getOwnPropertyDescriptor, zt = (e, t, r, a) => {
  for (var o = a > 1 ? void 0 : a ? jr(t, r) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (o = (a ? n(t, r, o) : n(o)) || o);
  return a && o && Nr(t, r, o), o;
};
let xe = class extends x {
  constructor() {
    super(...arguments), this.value = "";
  }
  render() {
    return l`
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
  _asHex(e) {
    const t = /^#([0-9a-f]{6})$/i.exec(e.trim());
    return t ? `#${t[1]}` : "#000000";
  }
  _onColorInput(e) {
    this._emit(e.target.value);
  }
  _onTextChange(e) {
    this._emit(e.target.value);
  }
  _emit(e) {
    this.value = e, this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
xe.styles = B`
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
zt([
  g({ type: String })
], xe.prototype, "value", 2);
xe = zt([
  M("ts-color-picker")
], xe);
var Vr = Object.defineProperty, Wr = Object.getOwnPropertyDescriptor, X = (e, t, r, a) => {
  for (var o = a > 1 ? void 0 : a ? Wr(t, r) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (o = (a ? n(t, r, o) : n(o)) || o);
  return a && o && Vr(t, r, o), o;
};
let G = class extends x {
  constructor() {
    super(...arguments), this.value = "0px", this.units = ["px"], this.min = 0, this.max = 100, this.step = 1;
  }
  render() {
    const e = this._parse(this.value);
    return l`
      <input
        type="range"
        min=${this.min}
        max=${this.max}
        step=${this.step}
        .value=${String(e.num)}
        @input=${this._onSlider}
      />
      <input
        type="number"
        min=${this.min}
        max=${this.max}
        step=${this.step}
        .value=${String(e.num)}
        @change=${this._onNumber}
      />
      ${this.units.length > 1 ? l`
            <select @change=${this._onUnit}>
              ${this.units.map(
      (t) => l`
                  <option value=${t} ?selected=${t === e.unit}>
                    ${t}
                  </option>
                `
    )}
            </select>
          ` : l`<span class="unit">${e.unit}</span>`}
    `;
  }
  _parse(e) {
    const t = this.units[0] ?? "px", r = /^(-?\d*\.?\d+)\s*([a-z%]*)$/i.exec(e.trim());
    return r ? {
      num: parseFloat(r[1]),
      unit: r[2] || t
    } : { num: 0, unit: t };
  }
  _onSlider(e) {
    const t = Number(e.target.value), { unit: r } = this._parse(this.value);
    this._emit(`${t}${r}`);
  }
  _onNumber(e) {
    const t = Number(e.target.value), { unit: r } = this._parse(this.value);
    this._emit(`${t}${r}`);
  }
  _onUnit(e) {
    const t = e.target.value, { num: r } = this._parse(this.value);
    this._emit(`${r}${t}`);
  }
  _emit(e) {
    this.value = e, this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
G.styles = B`
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
X([
  g({ type: String })
], G.prototype, "value", 2);
X([
  g({ type: Array })
], G.prototype, "units", 2);
X([
  g({ type: Number })
], G.prototype, "min", 2);
X([
  g({ type: Number })
], G.prototype, "max", 2);
X([
  g({ type: Number })
], G.prototype, "step", 2);
G = X([
  M("ts-length-slider")
], G);
var Kr = Object.defineProperty, Zr = Object.getOwnPropertyDescriptor, Tt = (e, t, r, a) => {
  for (var o = a > 1 ? void 0 : a ? Zr(t, r) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (o = (a ? n(t, r, o) : n(o)) || o);
  return a && o && Kr(t, r, o), o;
};
let ke = class extends x {
  constructor() {
    super(...arguments), this.value = "";
  }
  render() {
    return this.value.length > 40 || this.value.includes(`
`) ? l`<textarea rows="3" @change=${this._onChange} spellcheck="false">
${this.value}</textarea
        >` : l`<input
          type="text"
          .value=${this.value}
          @change=${this._onChange}
          spellcheck="false"
          autocomplete="off"
        />`;
  }
  _onChange(e) {
    const t = e.target.value;
    this.value = t, this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
ke.styles = B`
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
Tt([
  g({ type: String })
], ke.prototype, "value", 2);
ke = Tt([
  M("ts-raw-input")
], ke);
var Yr = Object.defineProperty, Jr = Object.getOwnPropertyDescriptor, F = (e, t, r, a) => {
  for (var o = a > 1 ? void 0 : a ? Jr(t, r) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (o = (a ? n(t, r, o) : n(o)) || o);
  return a && o && Yr(t, r, o), o;
};
const Ye = [
  {
    label: "Cover",
    modifiers: "center / cover no-repeat fixed",
    titleKey: "bg.preset_cover_tooltip"
  },
  {
    label: "Contain",
    modifiers: "center / contain no-repeat fixed",
    titleKey: "bg.preset_contain_tooltip"
  },
  {
    label: "Tile",
    modifiers: "top left repeat fixed",
    titleKey: "bg.preset_tile_tooltip"
  }
];
function te(e) {
  const t = e.trim();
  if (!t || t === "none") return { url: "", modifiers: "" };
  const r = /url\(\s*['"]?([^'")]+)['"]?\s*\)/.exec(t);
  if (!r) return { url: "", modifiers: t };
  const a = r[1].trim(), o = (t.slice(0, r.index) + t.slice(r.index + r[0].length)).trim().replace(/\s+/g, " ");
  return { url: a, modifiers: o };
}
function ue(e, t) {
  const r = e.trim(), a = t.trim();
  if (!r && !a) return "none";
  if (!a) return r;
  const o = `url('${a}')`;
  return r ? `${r} ${o}` : o;
}
function qr(e) {
  const t = e.trim();
  if (!t) return "";
  const r = /^\/(homeassistant|config)\/www\/(.+)$/.exec(t);
  return r ? `/local/${r[2]}` : t;
}
function Xr(e) {
  return /\bvar\(/.test(e);
}
let z = class extends x {
  constructor() {
    super(...arguments), this.value = "", this._browsing = !1, this._imagesLoaded = !1, this._loadingImages = !1, this._images = [], this._imagesTruncated = !1, this._imagesError = null;
  }
  render() {
    if (Xr(this.value))
      return this._renderVarRef();
    const e = te(this.value), t = !!e.url, r = t ? `background-image: url('${e.url.replace(/'/g, "\\'")}');` : "";
    return l`
      <div class="preview" style=${r}>
        ${t ? "" : l`<div class="preview-empty">
              ${s("bg.no_image", void 0, {
      value: this.value || "none"
    })}
            </div>`}
      </div>
      <div class="field">
        <label for="url">URL</label>
        <div class="url-row">
          <input
            id="url"
            type="url"
            .value=${e.url}
            @change=${this._onUrlChange}
            placeholder=${s("bg.url_placeholder")}
            spellcheck="false"
            autocomplete="off"
          />
          ${this.hass ? l`<button
                class="browse-btn"
                title=${s("bg.browse_tooltip")}
                @click=${this._toggleBrowse}
              >
                🖼 ${s("bg.browse")}
              </button>` : ""}
        </div>
      </div>
      ${this._browsing ? this._renderBrowser(e.url) : ""}
      <div class="field">
        <label for="mods">${s("bg.modifier")}</label>
        <input
          id="mods"
          type="text"
          .value=${e.modifiers}
          @change=${this._onModsChange}
          placeholder=${s("bg.modifier_placeholder")}
          spellcheck="false"
          autocomplete="off"
        />
      </div>
      <div class="presets">
        ${Ye.map(
      (a) => l`
            <button
              class="preset-btn"
              title=${s(a.titleKey)}
              @click=${() => this._applyPreset(a.modifiers)}
            >
              ${a.label}
            </button>
          `
    )}
        <button
          class="preset-btn danger"
          title=${s("bg.clear_tooltip")}
          @click=${this._clear}
        >
          ${s("bg.clear")}
        </button>
      </div>
    `;
  }
  _onUrlChange(e) {
    const t = e.target.value, r = qr(t), { modifiers: a } = te(this.value);
    this._emit(ue(a, r));
  }
  _onModsChange(e) {
    const t = e.target.value, { url: r } = te(this.value);
    this._emit(ue(t, r));
  }
  _applyPreset(e) {
    const { url: t } = te(this.value);
    this._emit(ue(e, t));
  }
  _clear() {
    this._emit("none");
  }
  _renderBrowser(e) {
    return l`
      <div class="browser">
        ${this._loadingImages ? l`<div class="browser-info">${s("bg.browse_loading")}</div>` : this._imagesError ? l`<div class="browser-error">
                ${s("common.error_prefix")}: ${this._imagesError}
              </div>` : this._images.length === 0 ? l`<div class="browser-info">${s("bg.browse_empty")}</div>` : l`
                  <div class="browser-info">
                    ${s("bg.browse_count", void 0, {
      n: this._images.length
    })}${this._imagesTruncated ? ` · ${s("bg.browse_truncated")}` : ""}
                  </div>
                  <div class="grid">
                    ${this._images.map(
      (t) => l`
                        <button
                          class="thumb ${t.url === e ? "selected" : ""}"
                          title=${t.url}
                          @click=${() => this._pickImage(t.url)}
                        >
                          <img src=${t.url} alt=${t.name} loading="lazy" />
                          <span class="caption"
                            >${t.dir ? `${t.dir}/` : ""}${t.name}</span
                          >
                        </button>
                      `
    )}
                  </div>
                `}
      </div>
    `;
  }
  _toggleBrowse() {
    this._browsing = !this._browsing, this._browsing && !this._imagesLoaded && this._loadImages();
  }
  async _loadImages() {
    if (this.hass) {
      this._loadingImages = !0, this._imagesError = null;
      try {
        const e = await this.hass.connection.sendMessagePromise({
          type: "theme_studio/list_www_images"
        });
        this._images = e.images, this._imagesTruncated = e.truncated, this._imagesLoaded = !0;
      } catch (e) {
        this._imagesError = e instanceof Error ? e.message : String(e);
      } finally {
        this._loadingImages = !1;
      }
    }
  }
  _pickImage(e) {
    const { modifiers: t } = te(this.value), r = t || Ye[0].modifiers;
    this._emit(ue(r, e)), this._browsing = !1;
  }
  _renderVarRef() {
    return l`
      <div class="var-notice">⚠ ${s("bg.var_ref_notice")}</div>
      <input
        class="raw-ref"
        type="text"
        .value=${this.value}
        @change=${this._onRawChange}
        spellcheck="false"
        autocomplete="off"
      />
    `;
  }
  _onRawChange(e) {
    this._emit(e.target.value);
  }
  _emit(e) {
    this.value = e, this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
z.styles = B`
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
    .url-row {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .url-row input {
      flex: 1;
      min-width: 0;
    }
    .browse-btn {
      flex-shrink: 0;
      white-space: nowrap;
      padding: 6px 10px;
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      cursor: pointer;
      color: inherit;
      font: inherit;
      font-size: 0.8rem;
    }
    .browse-btn:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .browser {
      margin: 8px 0;
      padding: 8px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 6px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
    }
    .browser-info {
      color: var(--secondary-text-color);
      font-size: 0.8rem;
      margin-bottom: 8px;
    }
    .browser-error {
      color: var(--error-color, #db4437);
      font-size: 0.85rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
      gap: 8px;
      max-height: 280px;
      overflow-y: auto;
    }
    .thumb {
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 4px;
      padding: 0;
      background: var(--card-background-color);
      cursor: pointer;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .thumb.selected {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -1px;
    }
    .thumb img {
      width: 100%;
      height: 64px;
      object-fit: cover;
      display: block;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .thumb .caption {
      font-size: 0.7rem;
      padding: 3px 4px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .var-notice {
      padding: 8px 12px;
      margin-bottom: 8px;
      border-radius: 4px;
      background: rgba(255, 152, 0, 0.1);
      border-left: 4px solid var(--warning-color, #ff9800);
      color: var(--primary-text-color);
      font-size: 0.85rem;
    }
    .raw-ref {
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
  `;
F([
  g({ type: String })
], z.prototype, "value", 2);
F([
  g({ attribute: !1 })
], z.prototype, "hass", 2);
F([
  p()
], z.prototype, "_browsing", 2);
F([
  p()
], z.prototype, "_imagesLoaded", 2);
F([
  p()
], z.prototype, "_loadingImages", 2);
F([
  p()
], z.prototype, "_images", 2);
F([
  p()
], z.prototype, "_imagesTruncated", 2);
F([
  p()
], z.prototype, "_imagesError", 2);
z = F([
  M("ts-background-picker")
], z);
var Qr = Object.defineProperty, eo = Object.getOwnPropertyDescriptor, Q = (e, t, r, a) => {
  for (var o = a > 1 ? void 0 : a ? eo(t, r) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (o = (a ? n(t, r, o) : n(o)) || o);
  return a && o && Qr(t, r, o), o;
};
let I = class extends x {
  constructor() {
    super(...arguments), this.src = "/lovelace/0", this.overrides = /* @__PURE__ */ new Map(), this._loaded = !1, this._loadError = null, this._appliedToFrame = /* @__PURE__ */ new Set();
  }
  render() {
    return l`
      <div class="toolbar">
        <span class="label">${s("preview.label")}:</span>
        <input
          type="text"
          .value=${this.src}
          @change=${this._onSrcChange}
          spellcheck="false"
          autocomplete="off"
        />
        <button @click=${this._reload} title=${s("preview.reload_tooltip")}>
          ↻
        </button>
        ${this._appliedToFrame.size > 0 ? l`<span class="badge"
              >${s(
      this._appliedToFrame.size === 1 ? "preview.overrides_one" : "preview.overrides_many",
      void 0,
      { n: this._appliedToFrame.size }
    )}</span
            >` : ""}
      </div>
      ${this._loadError ? l`<div class="error">${this._loadError}</div>` : ""}
      <iframe src=${this.src} @load=${this._onLoad}></iframe>
    `;
  }
  _onLoad() {
    this._loaded = !0, this._loadError = null, this._appliedToFrame.clear(), this._applyOverrides();
  }
  _onSrcChange(e) {
    const t = e.target.value.trim();
    t && t !== this.src && (this.src = t, this._loaded = !1);
  }
  _reload() {
    this._iframe && (this._loaded = !1, this._iframe.src = this._iframe.src);
  }
  updated(e) {
    e.has("overrides") && this._loaded && this._applyOverrides();
  }
  _applyOverrides() {
    if (!this._iframe?.contentDocument) return;
    const e = this._iframe.contentDocument.documentElement;
    for (const t of this._appliedToFrame)
      if (!this.overrides.has(t)) {
        try {
          e.style.removeProperty(t);
        } catch {
        }
        this._appliedToFrame.delete(t);
      }
    try {
      for (const [t, r] of this.overrides)
        e.style.setProperty(t, r), this._appliedToFrame.add(t);
    } catch (t) {
      this._loadError = s("preview.override_failed") + ": " + (t instanceof Error ? t.message : String(t));
    }
    this.requestUpdate();
  }
};
I.styles = B`
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
Q([
  g({ type: String })
], I.prototype, "src", 2);
Q([
  g({ attribute: !1 })
], I.prototype, "overrides", 2);
Q([
  nr("iframe")
], I.prototype, "_iframe", 2);
Q([
  p()
], I.prototype, "_loaded", 2);
Q([
  p()
], I.prototype, "_loadError", 2);
I = Q([
  M("ts-preview-pane")
], I);
var to = Object.defineProperty, ro = Object.getOwnPropertyDescriptor, w = (e, t, r, a) => {
  for (var o = a > 1 ? void 0 : a ? ro(t, r) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (o = (a ? n(t, r, o) : n(o)) || o);
  return a && o && to(t, r, o), o;
};
const be = {
  id: "_unknown",
  label: "_unknown_placeholder",
  icon: "mdi:help-circle-outline"
}, ge = {
  id: "_other",
  label: "_other_placeholder",
  icon: "mdi:dots-horizontal"
}, D = "in-theme", S = "default";
function Be(e) {
  return e === S ? s("editor.mode_default") : e.charAt(0).toUpperCase() + e.slice(1);
}
function oo(e) {
  return e === be ? s("editor.cat_unknown") : e === ge ? s("editor.cat_other") : Gr(e);
}
let _ = class extends x {
  constructor() {
    super(...arguments), this.file = "", this.themeName = "", this.hacsManaged = !1, this._loading = !0, this._error = null, this._rows = [], this._skippedKeys = [], this._saveStatus = { state: "idle" }, this._activeTab = D, this._activeMode = S, this._modes = [S], this._showPreview = !1, this._previewSrc = "/lovelace/0", this._settingDefault = !1, this._defaultJustSet = !1, this._defaultError = null, this._appliedVars = /* @__PURE__ */ new Set(), this._originalFullTheme = {}, this._onBeforeUnload = (e) => {
      this._dirtyCount() !== 0 && (e.preventDefault(), e.returnValue = "");
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._unsubRegistry = At(() => this.requestUpdate()), window.addEventListener("beforeunload", this._onBeforeUnload), this._load();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unsubRegistry?.(), this._unsubRegistry = void 0, window.removeEventListener("beforeunload", this._onBeforeUnload), this._revertAll();
  }
  updated(e) {
    const t = e.has("file") && e.get("file") !== void 0, r = e.has("themeName") && e.get("themeName") !== void 0;
    (t || r) && (this._revertAll(), this._rows = [], this._activeTab = D, this._activeMode = S, this._modes = [S], this._defaultJustSet = !1, this._defaultError = null, this._load());
  }
  async _load() {
    this._loading = !0, this._error = null, this._saveStatus = { state: "idle" };
    try {
      const e = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/get_theme",
        file: this.file,
        theme_name: this.themeName
      });
      this._originalFullTheme = e.variables, this._buildRows(e.variables);
    } catch (e) {
      this._error = e instanceof Error ? e.message : String(e);
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
  _buildRows(e) {
    const t = [], r = [], a = [S];
    for (const [o, i] of Object.entries(e)) {
      if (i == null) continue;
      if (o === "modes" && typeof i == "object") {
        for (const [m, h] of Object.entries(
          i
        ))
          if (!(typeof h != "object" || h === null)) {
            a.includes(m) || a.push(m);
            for (const [b, f] of Object.entries(
              h
            )) {
              if (f == null || typeof f == "object") continue;
              const k = String(f), K = b.startsWith("--") ? b : `--${b}`, Dt = K.slice(2), Et = we(K, k);
              t.push({
                varName: K,
                yamlKey: Dt,
                meta: Et,
                original: k,
                current: k,
                inTheme: !0,
                mode: m
              });
            }
          }
        continue;
      }
      if (typeof i == "object") {
        r.push(o);
        continue;
      }
      const n = String(i), c = o.startsWith("--") ? o : `--${o}`, d = c.slice(2), u = we(c, n);
      t.push({
        varName: c,
        yamlKey: d,
        meta: u,
        original: n,
        current: n,
        inTheme: !0,
        mode: S
      });
    }
    this._skippedKeys = r, this._rows = t, this._modes = a;
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
  _ensurePluginRows(e, t) {
    const r = ne().find((i) => i.manifest.id === e);
    if (!r) return;
    const a = new Set(
      this._rows.filter((i) => i.mode === t).map((i) => i.varName)
    ), o = [];
    for (const i of r.schema.variables) {
      if (a.has(i.name)) continue;
      const n = t === S ? i.default ?? "" : "";
      o.push({
        varName: i.name,
        yamlKey: i.name.startsWith("--") ? i.name.slice(2) : i.name,
        meta: { ...i, source: "schema", plugin: r.manifest.id },
        original: n,
        current: n,
        inTheme: !1,
        mode: t
      });
    }
    o.length > 0 && (this._rows = [...this._rows, ...o]);
  }
  // ─── Save-Flow ──────────────────────────────────────────────────────
  async _save() {
    if (this._dirtyCount() === 0 || this._saveStatus.state === "saving") return;
    if (this.hacsManaged) {
      await this._forkFlow("save");
      return;
    }
    const t = this._rows.filter(
      (d) => !d.inTheme && !d.markedForRemoval && d.current !== d.original && d.current !== ""
    ).length, r = this._rows.filter(
      (d) => d.inTheme && !d.markedForRemoval && d.current !== d.original
    ).length, a = this._removingCount(), o = [];
    r > 0 && o.push(
      s(
        r === 1 ? "editor.save_part_modify_one" : "editor.save_part_modify_many",
        void 0,
        { n: r }
      )
    ), t > 0 && o.push(
      s(
        t === 1 ? "editor.save_part_add_one" : "editor.save_part_add_many",
        void 0,
        { n: t }
      )
    ), a > 0 && o.push(
      s(
        a === 1 ? "editor.save_part_remove_one" : "editor.save_part_remove_many",
        void 0,
        { n: a }
      )
    );
    const i = o.join(" + "), n = s("editor.save_confirm", void 0, {
      what: i,
      file: this.file,
      theme: this.themeName
    });
    if (!confirm(n)) return;
    this._saveStatus = { state: "saving" };
    const c = this._buildSaveMerge();
    try {
      const d = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/save_theme",
        file: this.file,
        theme_name: this.themeName,
        variables: c
      });
      this._originalFullTheme = c, this._rows = this._rows.filter((u) => !u.markedForRemoval).map((u) => u.inTheme ? { ...u, original: u.current } : u.current !== u.original && u.current !== "" ? { ...u, original: u.current, inTheme: !0 } : u), this._activeTab !== D && this._ensurePluginRows(this._activeTab, this._activeMode), this._saveStatus = { state: "success", backup: d.backup };
    } catch (d) {
      const u = d instanceof Error ? d.message : String(d);
      this._saveStatus = { state: "error", msg: u };
    }
  }
  /**
   * Fork-Flow (v1.1): leitet das aktuelle (ggf. editierte) Theme in eine
   * eigene Top-Level-Datei `themes/<slug>.yaml` ab. `trigger` steuert nur
   * den Erklärungstext im Prompt:
   *   - "save"      — vom Save-Button eines HACS-Themes (Fork-Guard)
   *   - "proactive" — vom expliziten "Ableiten"-Button
   * Der mitgelieferte Merge-State enthält evtl. ungespeicherte Änderungen,
   * sodass beim Fork-on-Save nichts verloren geht.
   */
  async _forkFlow(e) {
    if (this._saveStatus.state === "saving" || this._saveStatus.state === "forking")
      return;
    const t = s("editor.fork_default", void 0, {
      theme: this.themeName
    }), r = s(
      e === "save" ? "editor.fork_prompt_save" : "editor.fork_prompt",
      void 0,
      { theme: this.themeName }
    ), a = window.prompt(r, t);
    if (a === null) return;
    const o = a.trim();
    if (o === "") return;
    this._saveStatus = { state: "forking" };
    const i = this._buildSaveMerge();
    try {
      const n = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/fork_theme",
        new_name: o,
        variables: i,
        // Herkunft für die Fork-Registry (Marker + späterer Upstream-Merge).
        source_file: this.file,
        source_theme: this.themeName
      });
      this._saveStatus = {
        state: "forked",
        file: n.file,
        theme: n.theme_name
      }, this.dispatchEvent(
        new CustomEvent("theme-forked", {
          detail: { file: n.file, theme_name: n.theme_name },
          bubbles: !0,
          composed: !0
        })
      );
    } catch (n) {
      const c = n instanceof Error ? n.message : String(n);
      this._saveStatus = { state: "error", msg: c };
    }
  }
  /**
   * Konstruiert das vollständige Theme-Object aus dem Original-YAML +
   * Editor-Zustand. Bewahrt Key-Form (mit/ohne `--`) und Dict-Strukturen.
   */
  _buildSaveMerge() {
    const e = {}, t = this._originalFullTheme.modes && typeof this._originalFullTheme.modes == "object" ? this._originalFullTheme.modes : {}, r = /* @__PURE__ */ new Set();
    for (const [o, i] of Object.entries(this._originalFullTheme)) {
      if (o === "modes") continue;
      if (typeof i == "object" && i !== null) {
        e[o] = i;
        continue;
      }
      const n = o.startsWith("--") ? o.slice(2) : o, c = this._rows.find(
        (d) => d.mode === S && d.inTheme && d.yamlKey === n
      );
      if (c) {
        if (c.markedForRemoval) {
          r.add(c.varName);
          continue;
        }
        e[o] = c.current, r.add(c.varName);
      } else
        e[o] = i;
    }
    for (const o of this._rows)
      o.mode === S && (o.inTheme || o.markedForRemoval || o.current !== o.original && o.current !== "" && (r.has(o.varName) || (e[o.yamlKey] = o.current)));
    const a = this._modes.filter((o) => o !== S);
    if (a.length > 0 || Object.keys(t).length > 0) {
      const o = {}, i = /* @__PURE__ */ new Set([
        ...Object.keys(t),
        ...a
      ]);
      for (const n of i) {
        const c = t[n] || {}, d = {}, u = /* @__PURE__ */ new Set();
        for (const [m, h] of Object.entries(c)) {
          if (typeof h == "object" && h !== null) {
            d[m] = h;
            continue;
          }
          const b = m.startsWith("--") ? m.slice(2) : m, f = this._rows.find(
            (k) => k.mode === n && k.inTheme && k.yamlKey === b
          );
          if (f) {
            if (f.markedForRemoval) {
              u.add(f.varName);
              continue;
            }
            d[m] = f.current, u.add(f.varName);
          } else
            d[m] = h;
        }
        for (const m of this._rows)
          m.mode === n && (m.inTheme || m.markedForRemoval || m.current !== m.original && m.current !== "" && (u.has(m.varName) || (d[m.yamlKey] = m.current)));
        Object.keys(d).length > 0 && (o[n] = d);
      }
      Object.keys(o).length > 0 && (e.modes = o);
    }
    return e;
  }
  // ─── Kategorien-Gruppierung ─────────────────────────────────────────
  _groupByCategory(e) {
    const t = /* @__PURE__ */ new Map();
    for (const n of ne())
      for (const c of n.schema.categories)
        t.has(c.id) || t.set(c.id, c);
    const r = /* @__PURE__ */ new Map();
    for (const n of e) {
      let c;
      n.meta.source === "heuristic" ? c = be.id : n.meta.category && t.has(n.meta.category) ? c = n.meta.category : c = ge.id;
      const d = r.get(c) ?? [];
      d.push(n), r.set(c, d);
    }
    const a = [];
    for (const [n, c] of t) {
      const d = r.get(n);
      d && d.length > 0 && a.push({ ...c, rows: d });
    }
    const o = r.get(be.id);
    o && o.length > 0 && a.push({ ...be, rows: o });
    const i = r.get(ge.id);
    return i && i.length > 0 && a.push({ ...ge, rows: i }), a;
  }
  // ─── CSS-Variable-Anwendung ─────────────────────────────────────────
  _setCssVar(e, t) {
    document.documentElement.style.setProperty(e, t), this._appliedVars.add(e);
  }
  _revertCssVar(e) {
    document.documentElement.style.removeProperty(e), this._appliedVars.delete(e);
  }
  _revertAll() {
    for (const e of this._appliedVars)
      document.documentElement.style.removeProperty(e);
    this._appliedVars.clear();
  }
  // ─── Row-Mutationen ─────────────────────────────────────────────────
  _changeRow(e, t) {
    this._setCssVar(e.varName, t), this._rows = this._rows.map(
      (r) => r.varName === e.varName && r.mode === e.mode ? { ...r, current: t } : r
    );
  }
  _resetRow(e) {
    this._revertCssVar(e.varName), this._rows = this._rows.map(
      (t) => t.varName === e.varName && t.mode === e.mode ? { ...t, current: t.original, markedForRemoval: !1 } : t
    );
  }
  _removeRow(e) {
    e.inTheme && (this._revertCssVar(e.varName), this._rows = this._rows.map(
      (t) => t.varName === e.varName && t.mode === e.mode ? { ...t, markedForRemoval: !0 } : t
    ));
  }
  _resetAll() {
    const e = this._dirtyCount();
    e !== 0 && confirm(s("editor.reset_confirm", void 0, { n: e })) && (this._revertAll(), this._rows = this._rows.map((t) => ({
      ...t,
      current: t.original,
      markedForRemoval: !1
    })));
  }
  _isRowDirty(e) {
    return e.current !== e.original || e.markedForRemoval === !0;
  }
  _dirtyCount() {
    return this._rows.reduce(
      (e, t) => e + (this._isRowDirty(t) ? 1 : 0),
      0
    );
  }
  _busy() {
    return this._saveStatus.state === "saving" || this._saveStatus.state === "forking";
  }
  _modeDirtyCount(e) {
    return this._rows.reduce(
      (t, r) => t + (r.mode === e && this._isRowDirty(r) ? 1 : 0),
      0
    );
  }
  _removingCount() {
    return this._rows.reduce(
      (e, t) => e + (t.markedForRemoval ? 1 : 0),
      0
    );
  }
  _onBack() {
    const e = this._dirtyCount();
    e > 0 && !confirm(s("editor.back_confirm", void 0, { n: e })) || (this._revertAll(), this.dispatchEvent(
      new CustomEvent("back-to-picker", { bubbles: !0, composed: !0 })
    ));
  }
  // ─── Tab/Mode-Handling ──────────────────────────────────────────────
  _onTabSelect(e) {
    e !== this._activeTab && (e !== D && this._ensurePluginRows(e, this._activeMode), this._activeTab = e);
  }
  _onModeSelect(e) {
    e !== this._activeMode && (this._activeTab !== D && this._ensurePluginRows(this._activeTab, e), this._activeMode = e);
  }
  _visibleRows() {
    const e = this._rows.filter((t) => t.mode === this._activeMode);
    return this._activeTab === D ? e.filter((t) => t.inTheme) : e.filter((t) => t.meta.plugin === this._activeTab);
  }
  /** Ist das aktuell editierte Theme das globale Default-Theme? */
  _isDefault() {
    return this._defaultJustSet ? !0 : !!this.themeName && this.hass?.themes?.default_theme === this.themeName;
  }
  /**
   * Setzt das aktuelle Theme als globales Default (frontend.set_theme).
   * HA bietet dafür keine eigene UI. Setzt nur das allgemeine Default
   * (`frontend_default_theme`) — Themes mit eigenen modes.light/dark werden
   * von HA passend angewandt.
   */
  async _setDefault() {
    if (!(this._isDefault() || this._settingDefault || !this.themeName)) {
      this._settingDefault = !0, this._defaultError = null;
      try {
        await this.hass.connection.sendMessagePromise({
          type: "call_service",
          domain: "frontend",
          service: "set_theme",
          service_data: { name: this.themeName }
        }), this._defaultJustSet = !0;
      } catch (e) {
        this._defaultError = e instanceof Error ? e.message : String(e);
      } finally {
        this._settingDefault = !1;
      }
    }
  }
  _renderDefaultBtn() {
    if (this._loading || this._error) return "";
    const e = this._isDefault();
    return l`
      <button
        class="default-btn ${e ? "is-default" : ""}"
        ?disabled=${e || this._settingDefault}
        @click=${this._setDefault}
        title=${s(e ? "editor.is_default_tooltip" : "editor.set_default_tooltip")}
      >
        ${e ? "★" : "☆"}
        ${this._settingDefault ? s("editor.setting_default") : s(e ? "editor.is_default" : "editor.set_default")}
      </button>
    `;
  }
  _renderDefaultError() {
    return this._defaultError ? l`
      <div class="default-error">
        ✗ ${s("editor.set_default_failed")}: ${this._defaultError}
      </div>
    ` : "";
  }
  // ─── Rendering ──────────────────────────────────────────────────────
  render() {
    return l`
      <div class="toolbar">
        <button class="back-btn" @click=${this._onBack}>
          ${s("common.back")}
        </button>
        <div class="breadcrumb">
          <div class="theme-name">${this.themeName}</div>
          <code>${this.file}</code>
        </div>
        ${this._renderDirtyBadge()} ${this._renderDefaultBtn()}
        <button
          class="preview-toggle ${this._showPreview ? "active" : ""}"
          @click=${this._togglePreview}
          title=${s("editor.preview_tooltip")}
        >
          👁 ${s("editor.preview")}
        </button>
        <button
          class="danger-btn"
          ?disabled=${this._dirtyCount() === 0 || this._busy()}
          @click=${this._resetAll}
        >
          ${s("editor.discard_all")}
        </button>
        ${this.hacsManaged ? l`<button
              class="primary-btn"
              ?disabled=${this._busy()}
              @click=${() => this._forkFlow("proactive")}
              title=${s("editor.fork_btn_tooltip")}
            >
              ⑂ ${s("editor.fork_btn")}
            </button>` : ""}
        <button
          class="primary-btn"
          ?disabled=${this._dirtyCount() === 0 || this._busy()}
          @click=${this._save}
        >
          ${this._saveStatus.state === "saving" ? s("common.saving") : this._saveStatus.state === "forking" ? s("editor.forking") : this.hacsManaged ? s("editor.save_as_own") : s("common.save")}
        </button>
      </div>
      ${this._renderDefaultError()} ${this._renderHacsNotice()}
      ${this._renderModeBar()} ${this._renderTabs()} ${this._renderSaveStatus()}
      <div class="body-grid ${this._showPreview ? "with-preview" : ""}">
        <div class="editor-col">${this._renderBody()}</div>
        ${this._showPreview ? l`<div class="preview-col">
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
  _onPreviewSrcChange(e) {
    this._previewSrc = e.detail.src;
  }
  /**
   * Aktuelle CSS-Overrides als Map — alle Rows wo `current !== original`,
   * unabhängig vom Mode (Live-Preview ist mode-agnostisch).
   */
  _currentOverrides() {
    const e = /* @__PURE__ */ new Map();
    for (const t of this._rows)
      t.current !== t.original && e.set(t.varName, t.current);
    return e;
  }
  _renderModeBar() {
    return this._loading || this._error || this._modes.length === 1 ? "" : l`
      <div class="mode-bar">
        <span class="label">${s("editor.mode_bar_label")}:</span>
        ${this._modes.map((e) => {
      const t = this._modeDirtyCount(e);
      return l`
            <button
              class="mode-btn ${this._activeMode === e ? "active" : ""}"
              @click=${() => this._onModeSelect(e)}
            >
              ${Be(e)}
              ${t > 0 ? l`<span class="mode-count">${t} ●</span>` : ""}
            </button>
          `;
    })}
      </div>
    `;
  }
  _renderTabs() {
    if (this._loading || this._error) return "";
    const e = this._rows.filter(
      (r) => r.inTheme && r.mode === this._activeMode
    ).length, t = [
      { id: D, label: s("editor.tab_in_theme"), count: e }
    ];
    for (const r of ne())
      t.push({
        id: r.manifest.id,
        label: r.manifest.name,
        count: r.schema.variables.length
      });
    return l`
      <div class="tabs" role="tablist">
        ${t.map(
      (r) => l`
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
  _renderHacsNotice() {
    return this._loading || this._error || !this.hacsManaged ? "" : l`
      <div class="notice hacs-notice">
        <strong>${s("editor.hacs_notice_strong")}:</strong>
        ${s("editor.hacs_notice_body")}
      </div>
    `;
  }
  _renderSaveStatus() {
    const e = this._saveStatus;
    return e.state === "idle" || e.state === "saving" || e.state === "forking" ? "" : e.state === "success" ? l`
        <div class="status-banner success">
          ✓ ${s("editor.save_success")}${e.backup ? l` &middot; ${s("common.backup")}: <code>${e.backup}</code>` : ""}
        </div>
      ` : e.state === "forked" ? l`
        <div class="status-banner success">
          ✓ ${s("editor.fork_success", void 0, { theme: e.theme })}
          &middot; <code>themes/${e.file}</code>
        </div>
      ` : l`
      <div class="status-banner error">
        ✗ ${s("common.save_failed")}: ${e.msg}
      </div>
    `;
  }
  _renderDirtyBadge() {
    const e = this._dirtyCount();
    if (e === 0) return "";
    const t = this._rows.filter(
      (n) => !n.inTheme && !n.markedForRemoval && n.current !== n.original && n.current !== ""
    ).length, r = this._removingCount(), a = [];
    t > 0 && a.push(s("editor.dirty_adding", void 0, { n: t })), r > 0 && a.push(s("editor.dirty_removing", void 0, { n: r }));
    const o = a.length > 0 ? ` (${a.join(", ")})` : "", i = s(
      e === 1 ? "editor.dirty_count_one" : "editor.dirty_count_many",
      void 0,
      { n: e }
    );
    return l`<span class="dirty-badge">${i}${o}</span>`;
  }
  _renderBody() {
    if (this._loading)
      return l`<div class="loading">${s("editor.loading")}</div>`;
    if (this._error)
      return l`<div class="error">
        ${s("common.error_prefix")}: ${this._error}
      </div>`;
    const e = this._visibleRows();
    if (e.length === 0) {
      const r = this._activeTab === D ? this._activeMode === S ? s("editor.empty_default") : s("editor.empty_mode", void 0, {
        mode: Be(this._activeMode)
      }) : s("editor.empty_plugin");
      return l`<div class="empty">${r}</div>`;
    }
    const t = this._groupByCategory(e);
    return l`
      ${this._activeTab === D && this._activeMode === S && this._skippedKeys.length > 0 ? l`<div class="notice">
            ${s("editor.notice_skipped_prefix")}
            ${this._skippedKeys.map(
      (r, a) => l`${a > 0 ? ", " : ""}<code>${r}</code>`
    )}${s("editor.notice_skipped_suffix")}
          </div>` : ""}
      ${this._activeMode !== S ? l`<div class="notice">
            <strong>${Be(this._activeMode)}-Mode:</strong>
            ${s("editor.notice_mode_prefix")}
            <code>modes.${this._activeMode}</code>
            ${s("editor.notice_mode_suffix")}
          </div>` : ""}
      ${this._activeTab !== D ? l`<div class="notice">
            <strong>${s("editor.notice_plugin_strong")}:</strong>
            ${s("editor.notice_plugin_prefix", void 0, { n: e.length })}
            <span class="row-tag default">${s("editor.tag_default")}</span>${s(
      "editor.notice_plugin_middle"
    )}
            ${this._activeMode === S ? s("editor.notice_plugin_top_level") : l`${s("editor.notice_plugin_override")}
                  <code>modes.${this._activeMode}</code>`}${s(
      "editor.notice_plugin_suffix"
    )}
          </div>` : ""}
      ${t.map((r) => this._renderCategory(r))}
    `;
  }
  _renderCategory(e) {
    return l`
      <div class="category-card">
        <h3>
          <span>${oo(e)}</span>
          <span class="count">${e.rows.length}</span>
        </h3>
        ${e.rows.map((t) => this._renderRow(t))}
      </div>
    `;
  }
  _renderRow(e) {
    const t = e.current !== e.original, r = e.markedForRemoval === !0, a = t || r, o = !e.inTheme && !t && !r, i = !e.inTheme && t && e.current !== "" && !r, n = ["row"];
    return t && !r && n.push("dirty"), r && n.push("removed"), l`
      <div class=${n.join(" ")}>
        <div class="meta-cell">
          <code class="var-name">
            ${a ? l`<span class="dirty-dot">●</span>` : ""}
            ${e.varName}
            ${e.meta.source === "heuristic" ? l`<span class="row-tag heuristic">${e.meta.type}</span>` : ""}
            ${o ? l`<span class="row-tag default"
                  >${s("editor.tag_default")}</span
                >` : ""}
            ${i ? l`<span class="row-tag adding"
                  >${s("editor.tag_adding")}</span
                >` : ""}
            ${r ? l`<span class="row-tag removing"
                  >${s("editor.tag_removing")}</span
                >` : ""}
          </code>
          ${e.meta.description ? l`<span class="description">${e.meta.description}</span>` : ""}
        </div>
        <div class="control-cell">${this._renderControl(e)}</div>
        <button
          class="reset-btn"
          ?disabled=${!a}
          @click=${() => this._resetRow(e)}
          title=${s("editor.reset_row_tooltip")}
        >
          ↺
        </button>
        <button
          class="remove-btn"
          ?disabled=${!e.inTheme || r}
          @click=${() => this._removeRow(e)}
          title=${e.inTheme ? s("editor.remove_row_tooltip") : s("editor.remove_row_disabled_tooltip")}
        >
          🗑
        </button>
      </div>
    `;
  }
  _renderControl(e) {
    const t = (r) => this._changeRow(e, r.detail.value);
    switch (e.meta.type) {
      case "color":
        return l`
          <ts-color-picker
            .value=${e.current}
            @value-changed=${t}
          ></ts-color-picker>
        `;
      case "length":
        return l`
          <ts-length-slider
            .value=${e.current}
            .units=${e.meta.unit ?? ["px"]}
            .min=${e.meta.min ?? 0}
            .max=${e.meta.max ?? 100}
            @value-changed=${t}
          ></ts-length-slider>
        `;
      case "background":
        return l`
          <ts-background-picker
            .value=${e.current}
            .hass=${this.hass}
            @value-changed=${t}
          ></ts-background-picker>
        `;
      default:
        return l`
          <ts-raw-input
            .value=${e.current}
            @value-changed=${t}
          ></ts-raw-input>
        `;
    }
  }
};
_.styles = B`
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
    .default-btn {
      background: none;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 6px;
      padding: 8px 14px;
      cursor: pointer;
      color: inherit;
      font: inherit;
      font-size: 0.9rem;
    }
    .default-btn:hover:not([disabled]) {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .default-btn.is-default {
      color: var(--primary-color);
      border-color: var(--primary-color);
      opacity: 1;
      cursor: default;
    }
    .default-error {
      padding: 10px 16px;
      border-radius: 4px;
      margin-bottom: 12px;
      background: rgba(219, 68, 55, 0.1);
      border-left: 4px solid var(--error-color, #db4437);
      color: var(--error-color, #db4437);
      font-size: 0.9rem;
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
    .notice.hacs-notice {
      background: rgba(255, 152, 0, 0.1);
      border-left-color: var(--warning-color, #ff9800);
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
w([
  g({ attribute: !1 })
], _.prototype, "hass", 2);
w([
  g({ type: String })
], _.prototype, "file", 2);
w([
  g({ type: String })
], _.prototype, "themeName", 2);
w([
  g({ type: Boolean })
], _.prototype, "hacsManaged", 2);
w([
  p()
], _.prototype, "_loading", 2);
w([
  p()
], _.prototype, "_error", 2);
w([
  p()
], _.prototype, "_rows", 2);
w([
  p()
], _.prototype, "_skippedKeys", 2);
w([
  p()
], _.prototype, "_saveStatus", 2);
w([
  p()
], _.prototype, "_activeTab", 2);
w([
  p()
], _.prototype, "_activeMode", 2);
w([
  p()
], _.prototype, "_modes", 2);
w([
  p()
], _.prototype, "_showPreview", 2);
w([
  p()
], _.prototype, "_previewSrc", 2);
w([
  p()
], _.prototype, "_settingDefault", 2);
w([
  p()
], _.prototype, "_defaultJustSet", 2);
w([
  p()
], _.prototype, "_defaultError", 2);
_ = w([
  M("ts-editor-view")
], _);
var ao = Object.defineProperty, io = Object.getOwnPropertyDescriptor, W = (e, t, r, a) => {
  for (var o = a > 1 ? void 0 : a ? io(t, r) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (o = (a ? n(t, r, o) : n(o)) || o);
  return a && o && ao(t, r, o), o;
};
let H = class extends x {
  constructor() {
    super(...arguments), this._loading = !0, this._modules = [], this._errors = [], this._rootExists = !0, this._loadError = null;
  }
  connectedCallback() {
    super.connectedCallback(), this._load();
  }
  async _load() {
    this._loading = !0, this._loadError = null;
    try {
      const e = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/list_modules"
      });
      this._modules = e.modules, this._errors = e.errors, this._rootExists = e.root_exists;
    } catch (e) {
      this._loadError = e instanceof Error ? e.message : String(e);
    } finally {
      this._loading = !1;
    }
  }
  render() {
    return this._loading ? l`<div class="empty">${s("module_picker.loading")}</div>` : this._loadError ? l`<div class="error">
        ${s("common.error_prefix")}: ${this._loadError}
      </div>` : l`
      <h2>${s("module_picker.heading")}</h2>
      ${this._rootExists ? this._modules.length === 0 ? l`<div class="empty">${s("module_picker.empty")}</div>` : l`
              <div class="list">
                ${this._modules.map(
      (e) => l`
                    <button
                      class="item"
                      @click=${() => this._select(e)}
                      title=${e.file}
                    >
                      <div class="info">
                        <div class="name-row">
                          <span class="name">${e.name}</span>
                          <span class="module-id">${e.module_id}</span>
                        </div>
                        ${e.description ? l`<div class="desc">${e.description}</div>` : ""}
                        <div class="meta">
                          <span class="tag">${e.file}</span>
                          ${e.is_global ? l`<span class="tag global"
                                >${s("module_picker.tag_global")}</span
                              >` : ""}
                          ${e.has_code ? "" : l`<span class="tag no-code"
                                >${s("module_picker.tag_no_code")}</span
                              >`}
                          ${e.supported.map(
        (t) => l`<span class="tag">${t}</span>`
      )}
                          ${e.version ? l`<span class="tag">v${e.version}</span>` : ""}
                        </div>
                      </div>
                      <div class="arrow">→</div>
                    </button>
                  `
    )}
              </div>
            ` : l`<div class="empty">${s("module_picker.no_root")}</div>`}
      ${this._errors.length > 0 ? l`
            <div class="errors-list">
              <h3>${s("picker.yaml_errors_heading")}</h3>
              <ul>
                ${this._errors.map(
      (e) => l`<li>${e.file}: ${e.error}</li>`
    )}
              </ul>
            </div>
          ` : ""}
    `;
  }
  _select(e) {
    this.dispatchEvent(
      new CustomEvent("module-selected", {
        detail: { file: e.file, module_id: e.module_id },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
H.styles = B`
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
W([
  g({ attribute: !1 })
], H.prototype, "hass", 2);
W([
  p()
], H.prototype, "_loading", 2);
W([
  p()
], H.prototype, "_modules", 2);
W([
  p()
], H.prototype, "_errors", 2);
W([
  p()
], H.prototype, "_rootExists", 2);
W([
  p()
], H.prototype, "_loadError", 2);
H = W([
  M("ts-module-picker")
], H);
var no = Object.defineProperty, so = Object.getOwnPropertyDescriptor, R = (e, t, r, a) => {
  for (var o = a > 1 ? void 0 : a ? so(t, r) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (o = (a ? n(t, r, o) : n(o)) || o);
  return a && o && no(t, r, o), o;
};
function lo(e) {
  const t = /* @__PURE__ */ new Map(), r = /var\(\s*(--[\w-]+)/g;
  let a;
  for (; (a = r.exec(e)) !== null; ) {
    const o = a[1];
    let i = a.index + a[0].length;
    for (; i < e.length && /\s/.test(e[i]); ) i++;
    let n;
    if (e[i] === ",") {
      for (i++; i < e.length && /\s/.test(e[i]); ) i++;
      const d = i;
      let u = 1;
      for (; i < e.length && u > 0; ) {
        const h = e[i];
        if (h === "(") u++;
        else if (h === ")" && (u--, u === 0))
          break;
        i++;
      }
      const m = e.slice(d, i).trim();
      m.length > 0 && (n = m);
    }
    const c = t.get(o);
    c ? (c.count++, !c.fallback && n && (c.fallback = n)) : t.set(o, { name: o, fallback: n, count: 1 });
  }
  return [...t.values()].sort((o, i) => o.name.localeCompare(i.name));
}
let T = class extends x {
  constructor() {
    super(...arguments), this.file = "", this.moduleId = "", this._loading = !0, this._error = null, this._content = {}, this._original = {}, this._saveStatus = { state: "idle" }, this._onBeforeUnload = (e) => {
      this._isDirty() && (e.preventDefault(), e.returnValue = "");
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("beforeunload", this._onBeforeUnload), this._load();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("beforeunload", this._onBeforeUnload);
  }
  updated(e) {
    const t = e.has("file") && e.get("file") !== void 0, r = e.has("moduleId") && e.get("moduleId") !== void 0;
    (t || r) && this._load();
  }
  async _load() {
    this._loading = !0, this._error = null, this._saveStatus = { state: "idle" };
    try {
      const e = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/get_module",
        file: this.file,
        module_id: this.moduleId
      });
      this._content = { ...e.content }, this._original = JSON.parse(JSON.stringify(e.content));
    } catch (e) {
      this._error = e instanceof Error ? e.message : String(e);
    } finally {
      this._loading = !1;
    }
  }
  _isDirty() {
    return JSON.stringify(this._content) !== JSON.stringify(this._original);
  }
  _onBack() {
    this._isDirty() && !confirm(s("module_editor.back_confirm")) || this.dispatchEvent(
      new CustomEvent("back-to-picker", { bubbles: !0, composed: !0 })
    );
  }
  _setField(e, t) {
    this._content = { ...this._content, [e]: t };
  }
  async _save() {
    if (!(!this._isDirty() || this._saveStatus.state === "saving") && confirm(
      s("module_editor.save_confirm", void 0, {
        moduleId: this.moduleId,
        file: this.file
      })
    )) {
      this._saveStatus = { state: "saving" };
      try {
        const e = await this.hass.connection.sendMessagePromise({
          type: "theme_studio/save_module",
          file: this.file,
          module_id: this.moduleId,
          content: this._content
        });
        this._original = JSON.parse(JSON.stringify(this._content)), this._saveStatus = { state: "success", backup: e.backup };
      } catch (e) {
        const t = e instanceof Error ? e.message : String(e);
        this._saveStatus = { state: "error", msg: t };
      }
    }
  }
  _resetAll() {
    this._isDirty() && confirm(s("module_editor.reset_confirm")) && (this._content = JSON.parse(JSON.stringify(this._original)));
  }
  render() {
    if (this._loading)
      return l`<div class="loading">${s("module_editor.loading")}</div>`;
    if (this._error)
      return l`<div class="error">
        ${s("common.error_prefix")}: ${this._error}
      </div>`;
    const e = this._content.name || this.moduleId, t = this._content.description || "", r = this._content.version || "", a = Array.isArray(this._content.supported) ? this._content.supported : [], o = this._content.is_global === !0, i = this._content.code || "", n = /* @__PURE__ */ new Set([
      "name",
      "description",
      "version",
      "supported",
      "is_global",
      "code"
    ]), c = Object.keys(this._content).filter(
      (u) => !n.has(u)
    ), d = this._isDirty();
    return l`
      <div class="toolbar">
        <button class="back-btn" @click=${this._onBack}>
          ${s("common.back")}
        </button>
        <div class="breadcrumb">
          <div class="module-name">${e}</div>
          <code>${this.file} · ${this.moduleId}</code>
        </div>
        ${d ? l`<span class="dirty-badge">${s("common.dirty_badge")}</span>` : ""}
        <button
          class="danger-btn"
          ?disabled=${!d || this._saveStatus.state === "saving"}
          @click=${this._resetAll}
        >
          ${s("common.discard")}
        </button>
        <button
          class="primary-btn"
          ?disabled=${!d || this._saveStatus.state === "saving"}
          @click=${this._save}
        >
          ${this._saveStatus.state === "saving" ? s("common.saving") : s("common.save")}
        </button>
      </div>

      ${this._renderSaveStatus()}

      <div class="notice">
        <strong>${s("common.notice")}:</strong>
        ${s("module_editor.reload_notice")}
      </div>

      <div class="card">
        <h3>${s("module_editor.metadata_heading")}</h3>
        <div class="field">
          <label for="m-name">${s("module_editor.field_name")}</label>
          <input
            id="m-name"
            type="text"
            .value=${e}
            @input=${(u) => this._setField("name", u.target.value)}
          />
        </div>
        <div class="field">
          <label for="m-desc">${s("module_editor.field_description")}</label>
          <input
            id="m-desc"
            type="text"
            .value=${t}
            @input=${(u) => this._setField(
      "description",
      u.target.value
    )}
          />
        </div>
        <div class="field">
          <label for="m-version">${s("module_editor.field_version")}</label>
          <input
            id="m-version"
            type="text"
            .value=${r}
            @input=${(u) => this._setField("version", u.target.value)}
          />
        </div>
        <div class="field">
          <label for="m-supported">${s("module_editor.field_supported")}</label>
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
          ${s("module_editor.supported_help")}
        </div>
        <div class="field checkbox-field">
          <label for="m-global">is_global</label>
          <input
            id="m-global"
            type="checkbox"
            .checked=${o}
            @change=${(u) => this._setField(
      "is_global",
      u.target.checked
    )}
          />
        </div>
        ${c.length > 0 ? l`<div class="extra-keys">
              ${s("module_editor.extra_keys")}:
              ${c.map(
      (u, m) => l`${m > 0 ? ", " : ""}<code>${u}</code>`
    )}
            </div>` : ""}
      </div>

      <div class="card">
        <h3>${s("module_editor.css_heading")}</h3>
        <div class="code-layout">
          <textarea
            class="code-editor"
            spellcheck="false"
            .value=${i}
            @input=${(u) => this._setField("code", u.target.value)}
          ></textarea>
          ${this._renderVarsSidebar(i)}
        </div>
      </div>
    `;
  }
  _renderVarsSidebar(e) {
    const t = lo(e);
    return l`
      <aside class="vars-sidebar">
        <h4>
          ${s("module_editor.vars_heading")}
          <span class="count">${t.length}</span>
        </h4>
        ${t.length === 0 ? l`<div class="vars-empty">
              ${s("module_editor.vars_empty")}
            </div>` : t.map((r) => this._renderVarItem(r))}
      </aside>
    `;
  }
  _renderVarItem(e) {
    const t = we(e.name, e.fallback), r = t.source === "schema", a = t.type === "color" && e.fallback ? l`<span class="var-swatch" style=${`background:${e.fallback}`}></span>` : "";
    return l`
      <div class="var-item">
        <div class="var-header">
          <span class="var-name">${a}${e.name}</span>
          ${e.count > 1 ? l`<span class="var-count">×${e.count}</span>` : ""}
        </div>
        <div class="var-tags">
          ${r ? l`<span class="var-tag plugin">${t.plugin}</span>` : l`<span class="var-tag heuristic"
                >${s("common.tag_heuristic")}</span
              >`}
          <span
            class=${`var-tag ${t.type === "color" ? "type-color" : ""}`}
          >${t.type}</span>
          ${r && t.category ? l`<span class="var-tag">${t.category}</span>` : ""}
        </div>
        ${t.description ? l`<div class="var-desc">${t.description}</div>` : ""}
        ${e.fallback ? l`<div class="var-fallback">
              ${s("common.fallback")}: <code>${e.fallback}</code>
            </div>` : ""}
      </div>
    `;
  }
  _renderSaveStatus() {
    const e = this._saveStatus;
    return e.state === "idle" || e.state === "saving" ? "" : e.state === "success" ? l`
        <div class="status-banner success">
          ✓ ${s("module_editor.save_success")}${e.backup ? l` &middot; ${s("common.backup")}:
                <code>${e.backup}</code>` : ""}.
          ${s("module_editor.save_success_reload")}
        </div>
      ` : l`
      <div class="status-banner error">
        ✗ ${s("common.save_failed")}: ${e.msg}
      </div>
    `;
  }
  _onSupportedInput(e) {
    const r = e.target.value.split(",").map((a) => a.trim()).filter((a) => a.length > 0);
    this._setField("supported", r);
  }
};
T.styles = B`
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
R([
  g({ attribute: !1 })
], T.prototype, "hass", 2);
R([
  g({ type: String })
], T.prototype, "file", 2);
R([
  g({ type: String })
], T.prototype, "moduleId", 2);
R([
  p()
], T.prototype, "_loading", 2);
R([
  p()
], T.prototype, "_error", 2);
R([
  p()
], T.prototype, "_content", 2);
R([
  p()
], T.prototype, "_original", 2);
R([
  p()
], T.prototype, "_saveStatus", 2);
T = R([
  M("ts-module-editor")
], T);
var co = Object.defineProperty, uo = Object.getOwnPropertyDescriptor, A = (e, t, r, a) => {
  for (var o = a > 1 ? void 0 : a ? uo(t, r) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (o = (a ? n(t, r, o) : n(o)) || o);
  return a && o && co(t, r, o), o;
};
const y = "default", po = {
  selection: null,
  full: {},
  scalarsByMode: { [y]: {} },
  modes: [y],
  loading: !1,
  error: null
};
let C = class extends x {
  constructor() {
    super(...arguments), this.presetA = null, this.presetB = null, this._themes = [], this._themesError = null, this._themesLoading = !0, this._sideA = this._freshSide(), this._sideB = this._freshSide(), this._diffOnly = !0, this._copyStatus = { state: "idle" }, this._activeMode = y;
  }
  get _busyCopy() {
    return this._copyStatus.state === "copying";
  }
  _freshSide() {
    return {
      ...po,
      scalarsByMode: { [y]: {} },
      modes: [y]
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._loadThemes();
  }
  async _loadThemes() {
    this._themesLoading = !0, this._themesError = null;
    try {
      const e = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/list_themes"
      });
      if (this._themes = e.themes, this.presetA || this.presetB) {
        const t = this._findEntry(this.presetA), r = this._findEntry(this.presetB);
        t && await this._setSide("A", t), r && await this._setSide("B", r);
      } else
        this._themes.length >= 1 && !this._sideA.selection && await this._setSide("A", this._themes[0]), this._themes.length >= 2 && !this._sideB.selection && await this._setSide("B", this._themes[1]);
    } catch (e) {
      this._themesError = e instanceof Error ? e.message : String(e);
    } finally {
      this._themesLoading = !1;
    }
  }
  /** Findet ein Theme in der geladenen Liste anhand file + theme_name. */
  _findEntry(e) {
    return e ? this._themes.find(
      (t) => t.file === e.file && t.theme_name === e.theme_name
    ) ?? null : null;
  }
  async _setSide(e, t) {
    const a = { ...e === "A" ? this._sideA : this._sideB, selection: t };
    if (this._writeSide(e, a), !t) {
      this._writeSide(e, this._freshSide());
      return;
    }
    this._writeSide(e, { ...a, loading: !0, error: null });
    try {
      const o = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/get_theme",
        file: t.file,
        theme_name: t.theme_name
      }), i = this._extractScalarsByMode(o.variables);
      this._writeSide(e, {
        ...a,
        loading: !1,
        full: o.variables,
        scalarsByMode: i,
        modes: Object.keys(i)
      });
    } catch (o) {
      this._writeSide(e, {
        ...a,
        loading: !1,
        error: o instanceof Error ? o.message : String(o)
      });
    }
  }
  _writeSide(e, t) {
    e === "A" ? this._sideA = t : this._sideB = t;
  }
  /**
   * Liefert pro Mode (inkl. "default") die Scalars als yamlKey → string Map.
   * - "default" = Top-Level-Scalars (alles außer dem `modes`-Key)
   * - "light", "dark", … = Einträge aus theme.modes.<mode>
   *
   * Dicts/Arrays werden in beiden Fällen übersprungen — Compare-View
   * vergleicht nur skalare Werte.
   */
  _extractScalarsByMode(e) {
    const t = {
      [y]: {}
    };
    for (const [r, a] of Object.entries(e)) {
      if (r === "modes" && a && typeof a == "object" && !Array.isArray(a)) {
        for (const [o, i] of Object.entries(
          a
        )) {
          if (!i || typeof i != "object") continue;
          const n = {};
          for (const [c, d] of Object.entries(
            i
          ))
            d != null && typeof d != "object" && (n[c] = String(d));
          t[o] = n;
        }
        continue;
      }
      a != null && typeof a != "object" && (t[y][r] = String(a));
    }
    return t;
  }
  /** Anzahl unterschiedlicher Scalars in einem Mode (für Mode-Badges/Hinweis). */
  _diffCountForMode(e) {
    const t = this._sideA.scalarsByMode[e] ?? {}, r = this._sideB.scalarsByMode[e] ?? {}, a = /* @__PURE__ */ new Set([...Object.keys(t), ...Object.keys(r)]);
    let o = 0;
    for (const i of a) {
      const n = t[i] ?? null, c = r[i] ?? null;
      (n === null || c === null || n !== c) && o++;
    }
    return o;
  }
  /** Union der Modes aus A und B, "default" zuerst, Rest alphabetisch. */
  _availableModes() {
    const e = /* @__PURE__ */ new Set([y]);
    for (const r of this._sideA.modes) e.add(r);
    for (const r of this._sideB.modes) e.add(r);
    const t = [...e].filter((r) => r !== y).sort();
    return [y, ...t];
  }
  _modeLabel(e) {
    return e === y ? s("compare.mode_default") : e.charAt(0).toUpperCase() + e.slice(1);
  }
  _onSelect(e, t) {
    const r = t.target.value;
    if (!r) {
      this._setSide(e, null);
      return;
    }
    const [a, o] = r.split("§§"), i = this._themes.find(
      (n) => n.file === a && n.theme_name === o
    );
    i && this._setSide(e, i);
  }
  render() {
    return this._themesLoading ? l`<div class="loading">${s("picker.loading")}</div>` : this._themesError ? l`<div class="error">
        ${s("common.error_prefix")}: ${this._themesError}
      </div>` : this._themes.length < 2 ? l`
        <div class="empty">
          ${s("compare.need_two_themes", void 0, {
      count: this._themes.length
    })}
        </div>
      ` : l`
      <div class="header">
        <div class="selector">
          <label>${s("compare.theme_a")}</label>
          ${this._renderSelector("A", this._sideA.selection)}
        </div>
        <div class="selector">
          <label>${s("compare.theme_b")}</label>
          ${this._renderSelector("B", this._sideB.selection)}
        </div>
        <div class="filter">
          <input
            id="diff-only"
            type="checkbox"
            .checked=${this._diffOnly}
            @change=${(e) => this._diffOnly = e.target.checked}
          />
          <label for="diff-only">${s("compare.diff_only")}</label>
        </div>
      </div>
      ${this._renderModeSelector()} ${this._renderCopyStatus()}
      ${this._renderBody()}
    `;
  }
  _renderCopyStatus() {
    const e = this._copyStatus;
    return e.state === "idle" || e.state === "copying" ? "" : e.state === "success" ? l`
        <div class="status-banner success">
          ✓
          ${s("compare.copy_success", void 0, {
      key: e.yamlKey,
      theme: e.themeName,
      mode: e.modeLabel
    })}${e.backup ? l` &middot; ${s("common.backup")}:
                <code>${e.backup}</code>` : ""}
        </div>
      ` : l`
      <div class="status-banner error">
        ✗ ${s("compare.copy_failed")}: ${e.msg}
      </div>
    `;
  }
  _renderModeSelector() {
    const e = this._availableModes();
    if (e.length <= 1) return "";
    e.includes(this._activeMode) || (this._activeMode = y);
    const t = !!this._sideA.selection && !!this._sideB.selection;
    return l`
      <div class="mode-selector">
        <span class="label">${s("compare.mode_selector_label")}</span>
        ${e.map((r) => {
      const a = this._sideA.modes.includes(r), o = this._sideB.modes.includes(r), i = r !== y && (!a || !o), n = this._modeLabel(r), c = t ? this._diffCountForMode(r) : 0;
      return l`
            <button
              class=${r === this._activeMode ? "active" : ""}
              @click=${() => this._activeMode = r}
              title=${i ? s("compare.mode_only_in", void 0, {
        side: a ? "A" : "B"
      }) : ""}
            >
              ${n}${i ? l`<span class="badge-only">${a ? "A" : "B"}</span>` : ""}${c > 0 ? l`<span class="diff-badge" title=${s("compare.mode_diff_badge_title", void 0, { n: c })}>${c}</span>` : ""}
            </button>
          `;
    })}
      </div>
    `;
  }
  _renderSelector(e, t) {
    const r = t ? `${t.file}§§${t.theme_name}` : "";
    return l`
      <select @change=${(a) => this._onSelect(e, a)}>
        <option value="">${s("compare.no_theme")}</option>
        ${this._themes.map(
      (a) => l`
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
    const e = this._sideA, t = this._sideB;
    if (e.loading || t.loading)
      return l`<div class="loading">${s("compare.loading_theme")}</div>`;
    if (e.error || t.error)
      return l`<div class="error">
        ${e.error ? `A: ${e.error}` : ""} ${t.error ? `B: ${t.error}` : ""}
      </div>`;
    if (!e.selection || !t.selection)
      return l`<div class="empty">${s("compare.pick_both")}</div>`;
    const r = this._activeMode, a = e.scalarsByMode[r] ?? {}, o = t.scalarsByMode[r] ?? {}, i = r === y || e.modes.includes(r), n = r === y || t.modes.includes(r), c = this._modeLabel(r), d = Array.from(
      /* @__PURE__ */ new Set([...Object.keys(a), ...Object.keys(o)])
    ).sort(), u = d.map((b) => ({
      key: b,
      valA: a[b] ?? null,
      valB: o[b] ?? null
    })).filter((b) => !this._diffOnly || b.valA === null || b.valB === null ? !0 : b.valA !== b.valB), m = d.reduce((b, f) => {
      const k = a[f] ?? null, K = o[f] ?? null;
      return k === null || K === null ? b + 1 : b + (k !== K ? 1 : 0);
    }, 0), h = r === y ? "" : !i || !n ? l` <em>
              ·
              ${s("compare.mode_missing_hint", void 0, {
      theme: i ? t.selection.theme_name : e.selection.theme_name,
      mode: c
    })}
            </em>` : "";
    return l`
      <div class="summary">
        <strong>${s("compare.mode_label", void 0, { mode: c })}:</strong>
        ${s("compare.summary", void 0, {
      themeA: e.selection.theme_name,
      countA: Object.keys(a).length,
      themeB: t.selection.theme_name,
      countB: Object.keys(o).length
    })}
        <strong
          >${s("compare.summary_diffs", void 0, { n: m })}</strong
        >${h}
      </div>
      ${u.length === 0 ? this._renderNoDiffs(c) : l`
            <table>
              <thead>
                <tr>
                  <th class="var-cell">${s("compare.col_variable")}</th>
                  <th class="val-cell">${e.selection.theme_name}</th>
                  <th class="actions">${s("compare.col_action")}</th>
                  <th class="val-cell">${t.selection.theme_name}</th>
                </tr>
              </thead>
              <tbody>
                ${u.map((b) => this._renderRow(b.key, b.valA, b.valB))}
              </tbody>
            </table>
          `}
    `;
  }
  /**
   * Wenn der aktive Mode keine Unterschiede hat: prüfen, ob ANDERE Modes
   * welche haben, und sie als klickbare Sprung-Buttons anbieten — sonst denkt
   * der User, die Themes seien identisch (häufige Falle bei mode-spezifischen
   * Vars wie background-image).
   */
  _renderNoDiffs(e) {
    const t = this._availableModes().filter((r) => r !== this._activeMode).map((r) => ({ mode: r, n: this._diffCountForMode(r) })).filter((r) => r.n > 0);
    return t.length === 0 ? l`<div class="empty">
        ${s("compare.no_diffs", void 0, { mode: e })}
      </div>` : l`
      <div class="cross-mode-hint">
        ${s("compare.no_diffs_here", void 0, { mode: e })}
        ${s("compare.diffs_elsewhere")}
        ${t.map(
      (r) => l`<button
            class="jump"
            @click=${() => this._activeMode = r.mode}
          >
            ${this._modeLabel(r.mode)}
            <span class="diff-badge">${r.n}</span>
          </button>`
    )}
      </div>
    `;
  }
  _renderRow(e, t, r) {
    const a = e.startsWith("--") ? e : `--${e}`, o = we(a, t ?? r ?? void 0), i = t !== null && r === null, n = r !== null && t === null, d = [
      "row",
      i ? "only-a" : "",
      n ? "only-b" : "",
      !i && !n && t !== r ? "diff" : ""
    ].filter(Boolean).join(" "), u = t !== null && t !== r, m = r !== null && r !== t;
    return l`
      <tr class=${d}>
        <td class="var-cell">
          ${a}
          ${o.description ? l`<div class="description">${o.description}</div>` : ""}
        </td>
        <td class=${`val-cell ${t === null ? "missing" : ""}`}>
          ${this._renderValue(t)}
        </td>
        <td class="actions">
          <button
            class="copy-btn"
            ?disabled=${!m || this._busyCopy}
            title=${r === null ? s("compare.copy_no_value", void 0, { side: "B" }) : s("compare.copy_tooltip", void 0, {
      from: this._sideB.selection?.theme_name ?? "",
      to: this._sideA.selection?.theme_name ?? ""
    })}
            @click=${() => this._copy("B", "A", e, r)}
          >
            ←
          </button>
          <button
            class="copy-btn"
            ?disabled=${!u || this._busyCopy}
            title=${t === null ? s("compare.copy_no_value", void 0, { side: "A" }) : s("compare.copy_tooltip", void 0, {
      from: this._sideA.selection?.theme_name ?? "",
      to: this._sideB.selection?.theme_name ?? ""
    })}
            @click=${() => this._copy("A", "B", e, t)}
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
  _renderValue(e) {
    return e === null ? l`${s("compare.not_in_theme")}` : /^#[0-9a-f]{3,8}$/i.test(e) || /^(rgba?|hsla?)\(/i.test(e) ? l`<span class="swatch" style="background: ${e}"></span>${e}` : l`${e}`;
  }
  async _copy(e, t, r, a) {
    const o = e === "A" ? this._sideA : this._sideB, i = t === "A" ? this._sideA : this._sideB;
    if (!o.selection || !i.selection) return;
    const n = this._activeMode, c = this._modeLabel(n), u = !(n === y) && !i.modes.includes(n), m = s("compare.copy_confirm", void 0, {
      key: r,
      value: a,
      from: o.selection.theme_name,
      to: i.selection.theme_name,
      file: i.selection.file,
      mode: c + (u ? ` ${s("compare.copy_confirm_new_mode")}` : "")
    });
    if (!confirm(m)) return;
    this._copyStatus = { state: "copying" };
    const h = this._mergeValue(i.full, n, r, a);
    try {
      const b = await this.hass.connection.sendMessagePromise({
        type: "theme_studio/save_theme",
        file: i.selection.file,
        theme_name: i.selection.theme_name,
        variables: h
      });
      this._setSide(t, i.selection), this._copyStatus = {
        state: "success",
        yamlKey: r,
        themeName: i.selection.theme_name,
        modeLabel: c,
        backup: b.backup
      };
    } catch (b) {
      this._copyStatus = {
        state: "error",
        msg: b instanceof Error ? b.message : String(b)
      };
    }
  }
  /**
   * Liefert ein neues Theme-Dict mit `yamlKey = value` in der gewählten Mode.
   * - mode = "default" → Top-Level
   * - sonst → modes.<mode>.<yamlKey>, modes/Submode werden bei Bedarf angelegt
   * Original-Key-Form (mit/ohne `--`-Prefix) bleibt erhalten falls schon da.
   */
  _mergeValue(e, t, r, a) {
    const o = { ...e }, i = (m) => Object.keys(m).find((b) => (b.startsWith("--") ? b.slice(2) : b) === r) ?? r;
    if (t === y)
      return o[i(o)] = a, o;
    const n = o.modes, c = n && typeof n == "object" && !Array.isArray(n) ? { ...n } : {}, d = c[t], u = d && typeof d == "object" && !Array.isArray(d) ? { ...d } : {};
    return u[i(u)] = a, c[t] = u, o.modes = c, o;
  }
};
C.styles = B`
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
    .mode-selector .label {
      padding: 0 8px 0 6px;
      color: var(--secondary-text-color);
      font-size: 0.8rem;
    }
    /* Diff-Zähler pro Mode — macht sofort sichtbar, wo Unterschiede sind. */
    .diff-badge {
      display: inline-block;
      margin-left: 6px;
      padding: 1px 6px;
      font-size: 0.72rem;
      font-weight: 700;
      background: var(--warning-color, #ff9800);
      color: #fff;
      border-radius: 9px;
      letter-spacing: 0;
      text-transform: none;
    }
    .cross-mode-hint {
      margin: 12px 0;
      padding: 14px 18px;
      border-radius: 6px;
      background: rgba(255, 152, 0, 0.12);
      border-left: 4px solid var(--warning-color, #ff9800);
      font-size: 0.95rem;
    }
    .cross-mode-hint .jump {
      margin-left: 8px;
      padding: 4px 12px;
      border: 1px solid var(--warning-color, #ff9800);
      border-radius: 14px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .cross-mode-hint .jump:hover {
      background: rgba(255, 152, 0, 0.12);
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
], C.prototype, "hass", 2);
A([
  g({ attribute: !1 })
], C.prototype, "presetA", 2);
A([
  g({ attribute: !1 })
], C.prototype, "presetB", 2);
A([
  p()
], C.prototype, "_themes", 2);
A([
  p()
], C.prototype, "_themesError", 2);
A([
  p()
], C.prototype, "_themesLoading", 2);
A([
  p()
], C.prototype, "_sideA", 2);
A([
  p()
], C.prototype, "_sideB", 2);
A([
  p()
], C.prototype, "_diffOnly", 2);
A([
  p()
], C.prototype, "_copyStatus", 2);
A([
  p()
], C.prototype, "_activeMode", 2);
C = A([
  M("ts-compare-view")
], C);
var mo = Object.defineProperty, ho = Object.getOwnPropertyDescriptor, Pt = (e, t, r, a) => {
  for (var o = a > 1 ? void 0 : a ? ho(t, r) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (o = (a ? n(t, r, o) : n(o)) || o);
  return a && o && mo(t, r, o), o;
};
let Se = class extends x {
  constructor() {
    super(...arguments), this._log = [];
  }
  render() {
    return l`
      <h2>Controls Demo (Step 5 — Smoke-Test)</h2>

      <section>
        <h3>&lt;ts-color-picker&gt;</h3>
        <div class="row">
          <label>Hex:</label>
          <ts-color-picker
            value="#03a9f4"
            @value-changed=${(e) => this._onChange(e, "Hex")}
          ></ts-color-picker>
        </div>
        <div class="row">
          <label>RGBA mit Alpha:</label>
          <ts-color-picker
            value="rgba(255, 152, 0, 0.5)"
            @value-changed=${(e) => this._onChange(e, "RGBA")}
          ></ts-color-picker>
        </div>
        <div class="row">
          <label>var-Reference:</label>
          <ts-color-picker
            value="var(--primary-color)"
            @value-changed=${(e) => this._onChange(e, "Var-Ref")}
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
            @value-changed=${(e) => this._onChange(e, "Radius (px)")}
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
            @value-changed=${(e) => this._onChange(e, "Spacing (px/rem)")}
          ></ts-length-slider>
        </div>
      </section>

      <section>
        <h3>&lt;ts-raw-input&gt;</h3>
        <div class="row">
          <label>Box-Shadow:</label>
          <ts-raw-input
            value="0 2px 4px rgba(0, 0, 0, 0.12)"
            @value-changed=${(e) => this._onChange(e, "Shadow")}
          ></ts-raw-input>
        </div>
        <div class="row">
          <label>Kurzer Wert:</label>
          <ts-raw-input
            value="bold"
            @value-changed=${(e) => this._onChange(e, "Raw kurz")}
          ></ts-raw-input>
        </div>
      </section>

      <section>
        <h3>Event-Log (value-changed)</h3>
        <div class="log">
          ${this._log.length === 0 ? l`<div class="empty">
                Noch keine Events — interagiere mit den Controls oben.
              </div>` : this._log.map(
      (e) => l`
                  <div class="log-entry">
                    <span class="at">${e.at}</span>
                    <span class="tag">${e.label}</span>
                    <span class="value">${e.value}</span>
                  </div>
                `
    )}
        </div>
        <button class="clear-btn" @click=${this._clear}>Log leeren</button>
      </section>
    `;
  }
  _onChange(e, t) {
    const r = e.target.tagName.toLowerCase(), a = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    this._log = [{ tag: r, label: t, value: e.detail.value, at: a }, ...this._log].slice(
      0,
      30
    );
  }
  _clear() {
    this._log = [];
  }
};
Se.styles = B`
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
Pt([
  p()
], Se.prototype, "_log", 2);
Se = Pt([
  M("ts-controls-demo")
], Se);
var bo = Object.defineProperty, go = Object.getOwnPropertyDescriptor, P = (e, t, r, a) => {
  for (var o = a > 1 ? void 0 : a ? go(t, r) : t, i = e.length - 1, n; i >= 0; i--)
    (n = e[i]) && (o = (a ? n(t, r, o) : n(o)) || o);
  return a && o && bo(t, r, o), o;
};
const Me = "themes", Ae = "modules", pe = "compare";
let $ = class extends x {
  constructor() {
    super(...arguments), this.narrow = !1, this._selectedTheme = null, this._selectedModule = null, this._topTab = Me, this._comparePreset = null, this._demoMode = !1, this._hacsError = null, this._hacsErrorDismissed = !1, this._onHashChange = () => {
      this._demoMode = window.location.hash === "#demo";
    };
  }
  connectedCallback() {
    super.connectedCallback(), wr(this.hass?.language), console.info("[theme-studio] registry (initial):", Ze()), this._demoMode = window.location.hash === "#demo", window.addEventListener("hashchange", this._onHashChange), this._unsubRegistry = At(() => this.requestUpdate()), this._loadHacsRepos();
  }
  async _loadHacsRepos() {
    try {
      const e = await this.hass.connection.sendMessagePromise({ type: "theme_studio/list_hacs_repos" });
      e.found ? (Rr(e.repos), console.info(
        "[theme-studio] HACS-Filter aktiv:",
        e.repos.length,
        "installierte Repos →",
        Ze()
      )) : console.info(
        "[theme-studio] keine HACS-Storage gefunden — alle Plugins geladen"
      );
    } catch (e) {
      const t = e instanceof Error ? e.message : String(e);
      console.warn(
        "[theme-studio] HACS-Detection fehlgeschlagen, alle Plugins geladen:",
        e
      ), this._hacsError = t;
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("hashchange", this._onHashChange), this._unsubRegistry?.(), this._unsubRegistry = void 0;
  }
  render() {
    return l`
      <header>
        <ha-icon icon="mdi:palette"></ha-icon>
        <h1>Theme Studio</h1>
      </header>
      <main>${this._renderHacsWarn()} ${this._renderBody()}</main>
    `;
  }
  _renderHacsWarn() {
    return !this._hacsError || this._hacsErrorDismissed ? "" : l`
      <div class="hacs-warn">
        <span class="hacs-warn-msg">
          ${s("panel.hacs_warn")}
          <span class="hacs-warn-detail">${this._hacsError}</span>
        </span>
        <button
          @click=${() => this._hacsErrorDismissed = !0}
          title=${s("panel.hacs_warn_dismiss")}
        >
          ×
        </button>
      </div>
    `;
  }
  _renderBody() {
    return this._demoMode ? l`<ts-controls-demo></ts-controls-demo>` : this._selectedTheme ? l`
        <ts-editor-view
          .hass=${this.hass}
          .file=${this._selectedTheme.file}
          .themeName=${this._selectedTheme.theme_name}
          .hacsManaged=${this._selectedTheme.hacs_managed}
          @theme-forked=${this._onThemeForked}
          @back-to-picker=${this._backToPicker}
        ></ts-editor-view>
      ` : this._selectedModule ? l`
        <ts-module-editor
          .hass=${this.hass}
          .file=${this._selectedModule.file}
          .moduleId=${this._selectedModule.module_id}
          @back-to-picker=${this._backToPicker}
        ></ts-module-editor>
      ` : l`
      ${this._renderTopTabs()} ${this._renderPickerForTab()}
    `;
  }
  _renderTopTabs() {
    const e = ne().some(
      (t) => t.manifest.id === "bubble-card"
    );
    return l`
      <div class="top-tabs">
        <button
          class="top-tab ${this._topTab === Me ? "active" : ""}"
          @click=${() => this._setTopTab(Me)}
        >
          ${s("panel.tab_themes")}
        </button>
        ${e ? l`
              <button
                class="top-tab ${this._topTab === Ae ? "active" : ""}"
                @click=${() => this._setTopTab(Ae)}
              >
                ${s("panel.tab_modules")}
              </button>
            ` : ""}
        <button
          class="top-tab ${this._topTab === pe ? "active" : ""}"
          @click=${() => this._setTopTab(pe)}
        >
          ${s("panel.tab_compare")}
        </button>
      </div>
    `;
  }
  _renderPickerForTab() {
    return this._topTab === Ae ? l`
        <ts-module-picker
          .hass=${this.hass}
          @module-selected=${this._onModuleSelect}
        ></ts-module-picker>
      ` : this._topTab === pe ? l`<ts-compare-view
        .hass=${this.hass}
        .presetA=${this._comparePreset?.fork ?? null}
        .presetB=${this._comparePreset?.upstream ?? null}
      ></ts-compare-view>` : l`
      <theme-picker
        .hass=${this.hass}
        @theme-selected=${this._onThemeSelect}
        @compare-upstream=${this._onCompareUpstream}
      ></theme-picker>
    `;
  }
  _setTopTab(e) {
    this._comparePreset = null, this._topTab = e;
  }
  // Picker hat „⇄ Upstream vergleichen" auf einem Fork ausgelöst — auf den
  // Vergleichen-Tab wechseln und Fork/Upstream vorwählen.
  _onCompareUpstream(e) {
    this._comparePreset = e.detail, this._topTab = pe;
  }
  _onThemeSelect(e) {
    this._selectedTheme = e.detail;
  }
  // Editor hat ein HACS-Theme in ein eigenes Top-Level-Theme abgeleitet —
  // Editier-Ziel auf den Fork umschalten (eigene Datei, hacs_managed=false).
  _onThemeForked(e) {
    this._selectedTheme = {
      file: e.detail.file,
      theme_name: e.detail.theme_name,
      hacs_managed: !1
    };
  }
  _onModuleSelect(e) {
    this._selectedModule = e.detail;
  }
  _backToPicker() {
    this._selectedTheme = null, this._selectedModule = null;
  }
};
$.styles = B`
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
P([
  g({ attribute: !1 })
], $.prototype, "hass", 2);
P([
  g({ type: Boolean })
], $.prototype, "narrow", 2);
P([
  g({ attribute: !1 })
], $.prototype, "route", 2);
P([
  p()
], $.prototype, "_selectedTheme", 2);
P([
  p()
], $.prototype, "_selectedModule", 2);
P([
  p()
], $.prototype, "_topTab", 2);
P([
  p()
], $.prototype, "_comparePreset", 2);
P([
  p()
], $.prototype, "_demoMode", 2);
P([
  p()
], $.prototype, "_hacsError", 2);
P([
  p()
], $.prototype, "_hacsErrorDismissed", 2);
$ = P([
  M("theme-studio-panel")
], $);
//# sourceMappingURL=theme-studio-panel.js.map
