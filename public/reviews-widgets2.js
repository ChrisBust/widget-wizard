/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = globalThis, e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s = Symbol(), o = new WeakMap; class i { constructor(t, e, i) { if (this._$cssResult$ = !0, i !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead."); this.cssText = t, this.o = e } get styleSheet() { let t = this.t; const s = this.o; if (e && void 0 === t) { const e = void 0 !== s && 1 === s.length; e && (t = o.get(s)), void 0 === t && ((this.t = t = new CSSStyleSheet).replaceSync(this.cssText), e && o.set(s, t)) } return t } toString() { return this.cssText } } const r = (t, ...e) => { const o = 1 === t.length ? t[0] : e.reduce(((e, s, o) => e + (t => { if (!0 === t._$cssResult$) return t.cssText; if ("number" == typeof t) return t; throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.") })(s) + t[o + 1]), t[0]); return new i(o, t, s) }, l = e ? t => t : t => t instanceof CSSStyleSheet ? (t => { let e = ""; for (const s of t.cssRules) e += s.cssText; return (t => new i("string" == typeof t ? t : t + "", void 0, s))(e) })(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var n; const c = (n = globalThis.litHtmlPolyfillSupport) ?? ((t, e) => { t.prototype.createRenderRoot = function () { const t = e.call(this); return (t => { const e = window.ShadyCSS; void 0 !== e && !e.nativeShadow && e.prepareTemplate(t, this.localName) })(this.renderRoot), t } }), a = globalThis.litHtmlPolyfillSupport; a?.(Object.getPrototypeOf(customElements.get("lit-nt-0")).prototype, "lit-nt-0"); const d = globalThis.litHtmlPolyfillSupport; d?.(Object.getPrototypeOf(customElements.get("lit-nt-1")).prototype, "lit-nt-1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: h, defineProperty: u, getOwnPropertyDescriptor: p, getOwnPropertyNames: m, getOwnPropertySymbols: f, getPrototypeOf: g } = Object, y = globalThis, v = y.trustedTypes, _ = v ? v.emptyScript : "", b = y.reactiveElementPolyfillSupport, w = (t, e) => t, S = { toAttribute(t, e) { switch (e) { case Boolean: t = t ? _ : null; break; case Object: case Array: t = null == t ? t : JSON.stringify(t) }return t }, fromAttribute(t, e) { let s = t; switch (e) { case Boolean: s = null !== t; break; case Number: s = null === t ? null : Number(t); break; case Object: case Array: try { s = JSON.parse(t) } catch (t) { s = null } }return s } }, E = (t, e) => !h(t, e); Symbol.metadata ??= Symbol("metadata"), y.litPropertyMetadata ??= new WeakMap; class A extends HTMLElement { static addInitializer(t) { this._$Ei(), (this.l ??= []).push(t) } static get observedAttributes() { return this.finalize(), this._$Eh && [...this._$Eh.keys()] } static createProperty(t, e = S) { if (e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor) { const s = Symbol(), o = this.getPropertyDescriptor(t, s, e); void 0 !== o && u(this.prototype, t, o) } } static getPropertyDescriptor(t, e, s) { const { get: o, set: i } = p(this.prototype, t) ?? { get() { return this[e] }, set(t) { this[e] = t } }; return { get() { return o?.call(this) }, set(e) { const r = o?.call(this); i.call(this, e), this.requestUpdate(t, r, s) }, configurable: !0, enumerable: !0 } } static getPropertyOptions(t) { return this.elementProperties.get(t) ?? S } static _$Ei() { if (this.hasOwnProperty(w("elementProperties"))) return; const t = g(this); t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties) } static finalize() { if (this.hasOwnProperty(w("finalized"))) return; if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(w("properties"))) { const t = this.properties, e = [...m(t), ...f(t)]; for (const s of e) this.createProperty(s, t[s]) } const t = this[Symbol.metadata]; if (null !== t) { const e = litPropertyMetadata.get(t); if (void 0 !== e) for (const [t, s] of e) this.elementProperties.set(t, s) } this._$Eh = new Map; for (const [t, e] of this.elementProperties) { const s = this._$Eu(t, e); void 0 !== s && this._$Eh.set(s, t) } this.elementStyles = this.finalizeStyles(this.styles) } static finalizeStyles(t) { const e = []; if (Array.isArray(t)) { const s = new Set(t.flat(1 / 0).reverse()); for (const t of s) e.unshift(l(t)) } else void 0 !== t && e.push(l(t)); return e } static _$Eu(t, e) { const s = e.attribute; return !1 === s ? void 0 : "string" == typeof s ? s : "string" == typeof t ? t.toLowerCase() : void 0 } constructor() { super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev() } _$Ev() { this._$ES = new Promise((t => this.enableUpdating = t)), this._$AL = new Map, this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t => t(this))) } addController(t) { (this._$EO ??= new Set).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.() } removeController(t) { this._$EO?.delete(t) } _$E_() { const t = new Map, e = this.constructor.elementProperties; for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]); t.size > 0 && (this._$Ep = t) } createRenderRoot() { const s = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions); return ((s, o) => { if (e) s.adoptedStyleSheets = o.map((t => t instanceof CSSStyleSheet ? t : t.styleSheet)); else for (const e of o) { const o = document.createElement("style"), i = t.litNonce; void 0 !== i && o.setAttribute("nonce", i), o.textContent = e.cssText, s.appendChild(o) } })(s, this.constructor.elementStyles), s } connectedCallback() { this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t => t.hostConnected?.())) } enableUpdating(t) { } disconnectedCallback() { this._$EO?.forEach((t => t.hostDisconnected?.())) } attributeChangedCallback(t, e, s) { this._$AK(t, s) } _$EC(t, e) { const s = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, s); if (void 0 !== o && !0 === s.reflect) { const i = (void 0 !== s.converter?.toAttribute ? s.converter : S).toAttribute(e, s.type); this._$Em = t, null == i ? this.removeAttribute(o) : this.setAttribute(o, i), this._$Em = null } } _$AK(t, e) { const s = this.constructor, o = s._$Eh.get(t); if (void 0 !== o && this._$Em !== o) { const t = s.getPropertyOptions(o), i = "function" == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : S; this._$Em = o, this[o] = i.fromAttribute(e, t.type), this._$Em = null } } requestUpdate(t, e, s) { if (void 0 !== t) { if (s ??= this.constructor.getPropertyOptions(t), !(s.hasChanged ?? E)(this[t], e)) return; this.P(t, e, s) } !1 === this.isUpdatePending && (this._$ES = this._$ET()) } P(t, e, s) { this._$AL.has(t) || this._$AL.set(t, e), !0 === s.reflect && this._$Em !== t && (this._$Ej ??= new Set).add(t) } async _$ET() { this.isUpdatePending = !0; try { await this._$ES } catch (t) { Promise.reject(t) } const t = this.scheduleUpdate(); return null != t && await t, !this.isUpdatePending } scheduleUpdate() { return this.performUpdate() } performUpdate() { if (!this.isUpdatePending) return; if (!this.hasUpdated) { if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) { for (const [t, e] of this._$Ep) this[t] = e; this._$Ep = void 0 } const t = this.constructor.elementProperties; if (t.size > 0) for (const [e, s] of t) !0 !== s.wrapped || this._$AL.has(e) || void 0 === this[e] || this.P(e, this[e], s) } let t = !1; const e = this._$AL; try { t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((t => t.hostUpdate?.())), this.update(e)) : this._$EU() } catch (e) { throw t = !1, this._$EU(), e } t && this._$AE(e) } willUpdate(t) { } _$AE(t) { this._$EO?.forEach((t => t.hostUpdated?.())), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t) } _$EU() { this._$AL = new Map, this.isUpdatePending = !1 } get updateComplete() { return this.getUpdateComplete() } getUpdateComplete() { return this._$ES } shouldUpdate(t) { return !0 } update(t) { this._$Ej &&= this._$Ej.forEach((t => this._$EC(t, this[t]))), this._$EU() } updated(t) { } firstUpdated(t) { } } A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[w("elementProperties")] = new Map, A[w("finalized")] = new Map, b?.({ ReactiveElement: A }), (y.reactiveElementVersions ??= []).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis, T = x.trustedTypes, k = T ? T.createPolicy("lit-html", { createHTML: t => t }) : void 0, P = "$lit$", I = `lit$${Math.random().toFixed(9).slice(2)}$`, C = "?" + I, R = `<${C}>`, M = document, U = () => M.createComment(""), L = t => null === t || "object" != typeof t && "function" != typeof t, O = Array.isArray, N = "[ \t\n\f\r]", z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, V = /-->/g, j = />/g, H = RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), $ = /'/g, F = /"/g, Z = /^(?:script|style|textarea|title)$/i, B = (t => (e, ...s) => ({ _$litType$: t, strings: e, values: s }))(1), q = Symbol.for("lit-noChange"), D = Symbol.for("lit-nothing"), W = new WeakMap, J = M.createTreeWalker(M, 129); function K(t, e) { if (!O(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array"); return void 0 !== k ? k.createHTML(e) : e } const G = (t, e) => { const s = t.length - 1, o = []; let i, r = 2 === e ? "<svg>" : 3 === e ? "<math>" : "", l = z; for (let e = 0; e < s; e++) { const s = t[e]; let n, c, a = -1, d = 0; for (; d < s.length && (l.lastIndex = d, c = l.exec(s), null !== c);)d = l.lastIndex, l === z ? "!--" === c[1] ? l = V : void 0 !== c[1] ? l = j : void 0 !== c[2] ? (Z.test(c[2]) && (i = RegExp("</" + c[2], "g")), l = H) : void 0 !== c[3] && (l = H) : l === H ? ">" === c[0] ? (l = i ?? z, a = -1) : void 0 === c[1] ? a = -2 : (a = l.lastIndex - c[2].length, n = c[1], l = void 0 === c[3] ? H : '"' === c[3] ? F : $) : l === F || l === $ ? l = H : l === V || l === j ? l = z : (l = H, i = void 0); const h = l === H && t[e + 1].startsWith("/>") ? " " : ""; r += l === z ? s + R : a >= 0 ? (o.push(n), s.slice(0, a) + P + s.slice(a) + I + h) : s + I + (-2 === a ? e : h) } return [K(t, r + (t[s] || "<?>") + (2 === e ? "</svg>" : 3 === e ? "</math>" : "")), o] }; class Y { constructor({ strings: t, _$litType$: e }, s) { let i; this.parts = []; let r = 0, l = 0; const n = t.length - 1, c = this.parts, [a, d] = G(t, e); if (this.el = Y.createElement(a, s), J.currentNode = this.el.content, 2 === e || 3 === e) { const t = this.el.content.firstChild; t.replaceWith(...t.childNodes) } for (; null !== (i = J.nextNode()) && c.length < n;) { if (1 === i.nodeType) { if (i.hasAttributes()) for (const t of i.getAttributeNames()) if (t.endsWith(P)) { const e = d[l++], s = i.getAttribute(t).split(I), o = /([.?@])?(.*)/.exec(e); c.push({ type: 1, index: r, name: o[2], strings: s, ctor: "." === o[1] ? ot : "?" === o[1] ? it : "@" === o[1] ? rt : st }), i.removeAttribute(t) } else t.startsWith(I) && (c.push({ type: 6, index: r }), i.removeAttribute(t)); if (Z.test(i.tagName)) { const t = i.textContent.split(I), e = t.length - 1; if (e > 0) { i.textContent = T ? T.emptyScript : ""; for (let s = 0; s < e; s++)i.append(t[s], U()), J.nextNode(), c.push({ type: 2, index: ++r }); i.append(t[e], U()) } } } else if (8 === i.nodeType) if (i.data === C) c.push({ type: 2, index: r }); else { let t = -1; for (; -1 !== (t = i.data.indexOf(I, t + 1));)c.push({ type: 7, index: r }), t += I.length - 1 } r++ } } static createElement(t, e) { const s = M.createElement("template"); return s.innerHTML = t, s } } function Q(t, e, s = t, o) { if (e === q) return e; let i = void 0 !== o ? s._$Co?.[o] : s._$Cl; const r = L(e) ? void 0 : e._$litDirective$; return i?.constructor !== r && (i?._$AO?.(!1), void 0 === r ? i = void 0 : (i = new r(t), i._$AT(t, s, o)), void 0 !== o ? (s._$Co ??= [])[o] = i : s._$Cl = i), void 0 !== i && (e = Q(t, i._$AS(t, e.values), i, o)), e } class X { constructor(t, e) { this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e } get parentNode() { return this._$AM.parentNode } get _$AU() { return this._$AM._$AU } u(t) { const { el: { content: e }, parts: s } = this._$AD, o = (t?.creationScope ?? M).importNode(e, !0); J.currentNode = o; let i = J.nextNode(), r = 0, l = 0, n = s[0]; for (; void 0 !== n;) { if (r === n.index) { let e; 2 === n.type ? e = new tt(i, i.nextSibling, this, t) : 1 === n.type ? e = new n.ctor(i, n.name, n.strings, this, t) : 6 === n.type && (e = new lt(i, this, t)), this._$AV.push(e), n = s[++l] } r !== n?.index && (i = J.nextNode(), r++) } return J.currentNode = M, o } p(t) { let e = 0; for (const s of this._$AV) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++ } } class tt { get _$AU() { return this._$AM?._$AU ?? this._$Cv } constructor(t, e, s, o) { this.type = 2, this._$AH = D, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = o, this._$Cv = o?.isConnected ?? !0 } get parentNode() { let t = this._$AA.parentNode; const e = this._$AM; return void 0 !== e && 11 === t?.nodeType && (t = e.parentNode), t } get startNode() { return this._$AA } get endNode() { return this._$AB } _$AI(t, e = this) { t = Q(this, t, e), L(t) ? t === D || null == t || "" === t ? (this._$AH !== D && this._$AR(), this._$AH = D) : t !== this._$AH && t !== q && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : (t => O(t) || "function" == typeof t?.[Symbol.iterator])(t) ? this.k(t) : this._(t) } S(t) { return this._$AA.parentNode.insertBefore(t, this._$AB) } T(t) { this._$AH !== t && (this._$AR(), this._$AH = this.S(t)) } _(t) { this._$AH !== D && L(this._$AH) ? this._$AA.nextSibling.data = t : this.T(M.createTextNode(t)), this._$AH = t } $(t) { const { values: e, _$litType$: s } = t, o = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = Y.createElement(K(s.h, s.h[0]), this.options)), s); if (this._$AH?._$AD === o) this._$AH.p(e); else { const t = new X(o, this), s = t.u(this.options); t.p(e), this.T(s), this._$AH = t } } _$AC(t) { let e = W.get(t.strings); return void 0 === e && W.set(t.strings, e = new Y(t)), e } k(t) { O(this._$AH) || (this._$AH = [], this._$AR()); const e = this._$AH; let s, o = 0; for (const i of t) o === e.length ? e.push(s = new tt(this.S(U()), this.S(U()), this, this.options)) : s = e[o], s._$AI(i), o++; o < e.length && (this._$AR(s && s._$AB.nextSibling, o), e.length = o) } _$AR(t = this._$AA.nextSibling, e) { for (this._$AP?.(!1, !0, e); t && t !== this._$AB;) { const e = t.nextSibling; t.remove(), t = e } } setConnected(t) { void 0 === this._$AM && (this._$Cv = t, this._$AP?.(t)) } } class st { get tagName() { return this.element.tagName } get _$AU() { return this._$AM._$AU } constructor(t, e, s, o, i) { this.type = 1, this._$AH = D, this._$AN = void 0, this.element = t, this.name = e, this._$AM = o, this.options = i, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(new String), this.strings = s) : this._$AH = D } _$AI(t, e = this, s, o) { const i = this.strings; let r = !1; if (void 0 === i) t = Q(this, t, e, 0), r = !L(t) || t !== this._$AH && t !== q, r && (this._$AH = t); else { const o = t; let l, n; for (t = i[0], l = 0; l < i.length - 1; l++)n = Q(this, o[s + l], e, l), n === q && (n = this._$AH[l]), r ||= !L(n) || n !== this._$AH[l], n === D ? t = D : t !== D && (t += (n ?? "") + i[l + 1]), this._$AH[l] = n } r && !o && this.j(t) } j(t) { t === D ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "") } } class ot extends st { constructor() { super(...arguments), this.type = 3 } j(t) { this.element[this.name] = t === D ? void 0 : t } } class it extends st { constructor() { super(...arguments), this.type = 4 } j(t) { this.element.toggleAttribute(this.name, !!t && t !== D) } } class rt extends st { constructor(t, e, s, o, i) { super(t, e, s, o, i), this.type = 5 } _$AI(t, e = this) { if ((t = Q(this, t, e, 0) ?? D) === q) return; const s = this._$AH, o = t === D && s !== D || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, i = t !== D && (s === D || o); o && this.element.removeEventListener(this.name, this, s), i && this.element.addEventListener(this.name, this, t), this._$AH = t } handleEvent(t) { "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t) } } class lt { constructor(t, e, s) { this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s } get _$AU() { return this._$AM._$AU } _$AI(t) { Q(this, t) } } const nt = x.litHtmlPolyfillSupport; nt?.(Y, tt), (x.litHtmlVersions ??= []).push("3.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class ct extends A { constructor() { super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0 } createRenderRoot() { const t = super.createRenderRoot(); return this.renderOptions.renderBefore ??= t.firstChild, t } update(t) { const e = this.render(); this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ((t, e, s) => { const o = s?.renderBefore ?? e; let i = o._$litPart$; if (void 0 === i) { const t = s?.renderBefore ?? null; o._$litPart$ = i = new tt(e.insertBefore(U(), t), t, void 0, s ?? {}) } return i._$AI(t), i })(e, this.renderRoot, this.renderOptions) } connectedCallback() { super.connectedCallback(), this._$Do?.setConnected(!0) } disconnectedCallback() { super.disconnectedCallback(), this._$Do?.setConnected(!1) } render() { return q } } ct.finalized = !0, ct._$litElement$ = !0, globalThis.litElementHydrateSupport?.({ LitElement: ct }); const at = globalThis.litElementPolyfillSupport; at?.({ LitElement: ct }), (globalThis.litElementVersions ??= []).push("4.0.4"); const dt = t => t.strings[0]; class ht extends st { constructor() { super(...arguments), this.protocol = "unsafe:" } j(t) { this._$AH = t; const e = this.element; let s = e[this.name]; if (s === D && (s = {}), s.h === this) return; const o = t.toLowerCase(); if (o.startsWith(this.protocol)) { s.h = this, e[this.name] = t; return } s.h = this; const i = new URL(t, e.ownerDocument.baseURI); i.protocol === this.protocol && e.setAttribute(this.name, e[this.name] = i.href) } } class ut extends st { j(t) { const e = this.element; if (this.element[this.name] !== t) { const s = new Event("change", { bubbles: !0 }); this.element[this.name] = t, e.dispatchEvent(s) } } }/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt = t => e => (typeof e == "function" ? ((t, e) => customElements.define(t, e), e) : ((t, e) => { const s = e => class extends A { render() { return B`<!---->` } static get styles() { return e.styles } }; customElements.define(t, s(e)) }))(t, e); class mt extends ot { j(t) { if (this._$AH = t, t === D) { if (void 0 === this.style) return; t = "" } this.element.style[this.name] = t } } const ft = new WeakMap, gt = B((function* (t, e) { if (void 0 === t) yield e; else for (const s of t) yield* gt(s, e) })); class yt { constructor(t) { this.G = t } disconnect() { ft.get(this)?.disconnect() } _$AT(t, e, s) { const o = t.options.host, i = o.addController(this); const r = t.element, l = r.parentNode, n = l.querySelector(this.G); if (i.then((() => { n?.[s] !== e && (n[s] = e) })), n) return; const c = new MutationObserver((() => { const t = l.querySelector(this.G); if (t) { c.disconnect(), ft.delete(this), t[s] = e } })); c.observe(l, { childList: !0, subtree: !0 }), ft.set(this, c) } } const vt = B(((t, e) => { const s = t.options?.host, o = s?.createRenderRoot?.(); return t => { e(o ?? s, t) } })), _ = e => B((s => t => e(s, t)));/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bt = B((t => { if (t == t?._$litDirective$) return t; if (L(t)) return t; throw Error("The `unsafeHTML` directive must be used with a `lit-html` template.") })), wt = B((t => { if (L(t)) return t; throw Error("The `unsafeSVG` directive must be used with a `lit-html` template.") })), St = B((t => { if (L(t)) return t; throw Error("The `unsafeMathML` directive must be used with a `lit-html` template.") }));/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Et = B(((t, e) => { let s = 1; return Array.isArray(t) ? s = 0 : void 0 !== t.strings && (s = 1), { _$litType$: s, strings: e ? [e] : [], values: [t] } })); class At extends ct {
    static get properties() {
        return {
            widgetId: { type: String, reflect: true },
            widget: { type: Object, state: true },
            loading: { type: Boolean, state: true },
            error: { type: String, state: true },
        };
    }

    constructor() {
        super();
        this.widgetId = '';
        this.widget = null;
        this.loading = true;
        this.error = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.fetchWidgetData();
    }

    async fetchWidgetData() {
        if (!this.widgetId) {
            this.error = 'Widget ID is missing.';
            this.loading = false;
            return;
        }
        this.loading = true;
        this.error = null;
        try {
            // Use a relative path to the API
            const response = await fetch(`/api/widgets/${this.widgetId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.success) {
                this.widget = result.data;
            } else {
                throw new Error(result.error || 'Failed to load widget data.');
            }
        } catch (error) {
            this.error = error.message;
            console.error('Error fetching widget data:', error);
        } finally {
            this.loading = false;
        }
    }

    static get styles() {
        return r`
    :host {
        font-family: 'Inter', sans-serif;
    }
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    body {
        font-family: Arial, Helvetica, sans-serif;
    }

    :host {
        --background: 240 10% 3.9%;
        --foreground: 0 0% 98%;
        --card: 240 4.8% 9.8%;
        --card-foreground: 0 0% 98%;
        --popover: 240 10% 3.9%;
        --popover-foreground: 0 0% 98%;
        --primary: 262.1 83.3% 57.8%; /* Vibrant Purple */
        --primary-foreground: 0 0% 98%;
        --secondary: 240 3.7% 15.9%;
        --secondary-foreground: 0 0% 98%;
        --muted: 240 3.7% 15.9%;
        --muted-foreground: 240 5% 64.9%;
        --accent: 333.3 83.3% 57.8%; /* Vibrant Pink */
        --accent-foreground: 0 0% 98%;
        --destructive: 0 62.8% 30.6%;
        --destructive-foreground: 0 0% 98%;
        --border: 240 3.7% 15.9%;
        --input: 240 3.7% 15.9%;
        --ring: 262.1 83.3% 57.8%;
        --chart-1: 262 80% 56%;
        --chart-2: 333 80% 56%;
        --chart-3: 198 80% 56%;
        --chart-4: 48 80% 56%;
        --chart-5: 120 80% 56%;
        --radius: 0.8rem;
    }

    * {
        border-color: hsl(var(--border));
    }

    .widget-container {
        background-color: hsl(var(--background));
        color: hsl(var(--foreground));
        min-height: 100vh;
        padding: 1rem;
    }
    .card {
        background-color: hsl(var(--card));
        color: hsl(var(--card-foreground));
        border-radius: var(--radius);
        border: 1px solid hsl(var(--border));
    }
    .text-primary {
      color: hsl(var(--primary));
    }
    .text-muted-foreground {
        color: hsl(var(--muted-foreground));
    }
    .font-bold { font-weight: 700; }
    .text-3xl { font-size: 1.875rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .hover\\:underline:hover { text-decoration: underline; }
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .md\\:grid-cols-3 { @media (min-width: 768px) { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    .gap-6 { gap: 1.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    .md\\:col-span-1 { @media (min-width: 768px) { grid-column: span 1 / span 1; } }
    .md\\:col-span-2 { @media (min-width: 768px) { grid-column: span 2 / span 2; } }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .text-center { text-align: center; }
    .p-6 { padding: 1.5rem; }
    .text-5xl { font-size: 3rem; }
    .mt-2 { margin-top: 0.5rem; }
    .font-semibold { font-weight: 600; }
    .mb-3 { margin-bottom: 0.75rem; }
    .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem; }
    .gap-2 { gap: 0.5rem; }
    .text-sm { font-size: 0.875rem; }
    .w-6 { width: 1.5rem; }
    .text-right { text-align: right; }
    .w-4 { width: 1rem; }
    .h-4 { height: 1rem; }
    .text-accent { color: hsl(var(--accent)); }
    .w-full { width: 100%; }
    .h-2 { height: 0.5rem; }
    .w-8 { width: 2rem; }
    .mb-4 { margin-bottom: 1rem; }
    .text-xl { font-size: 1.25rem; }
    .justify-between { justify-content: space-between; }
    .max-w-4xl { max-width: 56rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .h-full { height: 100%; }
    .p-1 { padding: 0.25rem; }
    .md\\:basis-1\\/2 { @media (min-width: 768px) { flex-basis: 50%; } }
    .lg\\:basis-1\\/3 { @media (min-width: 1024px) { flex-basis: 33.333333%; } }
    .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
    .gap-3 { gap: 0.75rem; }
    .font-semibold { font-weight: 600; }
    .text-xs { font-size: 0.75rem; }
    .pt-2 { padding-top: 0.5rem; }
    .text-foreground\\/80 { color: hsla(var(--foreground), 0.8); }
    .border-2 { border-width: 2px; }
    .border-dashed { border-style: dashed; }
    .rounded-lg { border-radius: 0.5rem; }
    .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
    .h-12 { height: 3rem; }
    .w-12 { width: 3rem; }
    .mt-12 { margin-top: 3rem; }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
    .star {
        fill: currentColor;
    }
    .text-muted-foreground\\/30 {
        color: hsla(var(--muted-foreground), 0.3);
    }
    .gap-0\\.5 { gap: 0.125rem; }
    .progress {
        display: flex;
        height: 1rem;
        overflow: hidden;
        font-size: .75rem;
        background-color: hsl(var(--secondary));
        border-radius: 0.25rem;
    }
    .progress-bar {
        background-color: hsl(var(--primary));
        transition: width .6s ease;
    }
    .carousel { position: relative; }
    .carousel-inner { position: relative; width: 100%; overflow: hidden; }
    .carousel-item { position: relative; display: none; float: left; width: 100%; margin-right: -100%; backface-visibility: hidden; transition: transform .6s ease-in-out; }
    .carousel-item.active { display: block; }
    .avatar {
        position: relative;
        display: inline-block;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 9999px;
    }
    .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 9999px;
    }
    .avatar-fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 9999px;
        background-color: hsl(var(--muted));
        color: hsl(var(--muted-foreground));
    }
    .carousel-container {
        overflow: hidden;
        width: 100%;
        position: relative;
    }
    .carousel-content {
        display: flex;
        transition: transform 0.3s ease-in-out;
    }
    .carousel-item-wrapper {
        flex: 0 0 100%;
    }
    @media (min-width: 768px) {
        .carousel-item-wrapper {
            flex: 0 0 50%;
        }
    }
    @media (min-width: 1024px) {
        .carousel-item-wrapper {
            flex: 0 0 33.333333%;
        }
    }
    .carousel-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: hsl(var(--card));
        border: 1px solid hsl(var(--border));
        border-radius: 9999px;
        width: 2.5rem;
        height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
    }
    .carousel-btn:hover {
        background-color: hsl(var(--accent));
        color: hsl(var(--accent-foreground));
    }
    .carousel-prev {
        left: -1rem;
    }
    .carousel-next {
        right: -1rem;
    }
  `;
    }

    get a() {
        if (!this.widget || !this.widget.reviews || 0 === this.widget.reviews.length) return {
            overallRating: 0,
            totalReviews: 0,
            ratingDistribution: [0, 0, 0, 0, 0]
        };
        const t = this.widget.reviews.reduce(((t, e) => t + e.stars), 0),
            e = t / this.widget.reviews.length,
            s = Array(5).fill(0);
        for (const t of this.widget.reviews) s[5 - t.stars]++;
        return {
            overallRating: e,
            totalReviews: this.widget.reviews.length,
            ratingDistribution: s
        }
    }

    constructor() {
        super(), this.slideIndex = 0
    }
    nextSlide() {
        const t = this.shadowRoot.querySelectorAll(".carousel-item-wrapper").length,
            e = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
        this.slideIndex < t - e && (this.slideIndex++, this.updateSlide())
    }
    prevSlide() {
        this.slideIndex > 0 && (this.slideIndex--, this.updateSlide())
    }
    updateSlide() {
        const t = this.shadowRoot.querySelector(".carousel-content"),
            e = this.shadowRoot.querySelector(".carousel-item-wrapper").offsetWidth;
        t.style.transform = `translateX(-${this.slideIndex * e}px)`
    }

    render() {
        if (this.loading) return B`<div class="widget-container">Loading...</div>`;
        if (this.error) return B`<div class="widget-container">Error: ${this.error}</div>`;
        if (!this.widget) return B`<div class="widget-container">No widget data.</div>`;
        const {
            overallRating: t,
            totalReviews: e,
            ratingDistribution: s
        } = this.a;
        return B`
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        
        <div class="widget-container">
            <div class="max-w-4xl mx-auto">
                <header class="mb-6">
                    <h1 class="text-3xl font-bold">${this.widget.businessName}</h1>
                    <a href=${this.widget.website} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
                        ${this.widget.website}
                    </a>
                </header>

                ${e > 0 ? B`
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="card md:col-span-1 flex flex-col items-center justify-center text-center p-6">
                            <p class="text-5xl font-bold">${t.toFixed(1)}</p>
                            <div>${[1, 2, 3, 4, 5].map((s => B`<span class="star ${s <= Math.round(t) ? "text-accent" : "text-muted-foreground/30"}">★</span>`))}</div>
                            <p class="text-muted-foreground mt-2">Based on ${e} reviews</p>
                        </div>
                        <div class="card md:col-span-2 p-6">
                            <h2 class="font-semibold mb-3">Rating distribution</h2>
                            <div class="space-y-2">
                                ${s.map(((t, s) => B`
                                    <div class="flex items-center gap-2 text-sm">
                                        <span class="text-muted-foreground w-6 text-right">${5 - s}</span>
                                        <span class="star text-accent w-4 h-4">★</span>
                                        <div class="progress w-full h-2">
                                            <div class="progress-bar" style="width: ${e > 0 ? t / e * 100 : 0}%"></div>
                                        </div>
                                        <span class="text-muted-foreground w-8 text-right">${t}</span>
                                    </div>
                                `))}
                            </div>
                        </div>
                    </div>
                `: ""}

                <div>
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">${e > 0 ? "What people are saying" : "Be the first to leave a review"}</h2>
                        
                    </div>
                    ${e > 0 ? B`
                        <div class="carousel">
                            <div class="carousel-container">
                                <div class="carousel-content">
                                ${this.widget.reviews.map((t => B`
                                    <div class="carousel-item-wrapper p-1 h-full">
                                        <div class="card flex flex-col h-full">
                                            <div class="flex-1 p-6 space-y-4">
                                                <div class="flex items-center gap-3">
                                                    <div class="avatar">
                                                        <span class="avatar-fallback">${t.name.charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <p class="font-semibold">${t.name}</p>
                                                        <p class="text-xs text-muted-foreground">${t.source} review</p>
                                                    </div>
                                                </div>
                                                <div>${[1, 2, 3, 4, 5].map((e => B`<span class="star ${e <= t.stars ? "text-accent" : "text-muted-foreground/30"}">★</span>`))}</div>
                                                <p class="text-sm text-foreground/80 pt-2">${t.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                `))}
                                </div>
                            </div>
                            <button class="carousel-btn carousel-prev" @click=${this.prevSlide}>&#10094;</button>
                            <button class="carousel-btn carousel-next" @click=${this.nextSlide}>&#10095;</button>
                        </div>
                    `: B`
                        <div class="text-center py-20 border-2 border-dashed rounded-lg card text-muted-foreground">
                            <h3 class="mt-2 text-lg font-semibold">No reviews yet</h3>
                            <p>Your widget is ready to collect feedback.</p>
                        </div>
                    `}
                </div>

                <footer class="text-center mt-12">
                    <p class="text-sm text-muted-foreground">Powered by Widget Wizard</p>
                </footer>
            </div>
        </div>
      `
    }
}
customElements.define("review-widget2", At);
