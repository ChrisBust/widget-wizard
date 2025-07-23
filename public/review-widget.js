/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;class i{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.h=e}get styleSheet(){let t=this.o;const s=this.h;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o.set(s,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,s,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1]),t[0]);return new i(o,t,s)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new i("string"==typeof t?t:t+"",void 0,s))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:r,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:c,getPrototypeOf:p}=Object,g=globalThis,u=g.trustedTypes,m=u?u.emptyScript:"",f=g.reactiveElementPolyfillSupport,y=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>!r(t,e);Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;class w extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),o=this.getPropertyDescriptor(t,s,e);void 0!==o&&l(this.prototype,t,o)}}static getPropertyDescriptor(t,e,s){const{get:o,set:i}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return o?.call(this)},set(e){const a=o?.call(this);i.call(this,e),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...c(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,o)=>{if(e)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),i=t.litNonce;void 0!==i&&o.setAttribute("nonce",i),o.textContent=e.cssText,s.appendChild(o)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(void 0!==o&&!0===s.reflect){const i=(void 0!==s.converter?.toAttribute?s.converter:b).toAttribute(e,s.type);this._$Em=t,null==i?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){const s=this.constructor,o=s._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=s.getPropertyOptions(o),i="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=o,this[o]=i.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){if(s??=this.constructor.getPropertyOptions(t),!(s.hasChanged??v)(this[t],e))return;this.P(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),!0===s.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t)!0!==s.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],s)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[y("elementProperties")]=new Map,w[y("finalized")]=new Map,f?.({ReactiveElement:w}),(g.reactiveElementVersions??=[]).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E=globalThis,S=E.trustedTypes,M=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,_="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+k,C=`<${A}>`,P=document,T=()=>P.createComment(""),x=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,L="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j=/-->/g,R=/>/g,U=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),$=/'/g,F=/"/g,I=/^(?:script|style|textarea|title)$/i,D=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),z=Symbol.for("lit-noChange"),H=Symbol.for("lit-nothing"),V=new WeakMap,B=P.createTreeWalker(P,129);function W(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==M?M.createHTML(e):e}const G=(t,e)=>{const s=t.length-1,o=[];let i,a=2===e?"<svg>":3===e?"<math>":"",n=N;for(let e=0;e<s;e++){const s=t[e];let r,l,h=-1,d=0;for(;d<s.length&&(n.lastIndex=d,l=n.exec(s),null!==l);)d=n.lastIndex,n===N?"!--"===l[1]?n=j:void 0!==l[1]?n=R:void 0!==l[2]?(I.test(l[2])&&(i=RegExp("</"+l[2],"g")),n=U):void 0!==l[3]&&(n=U):n===U?">"===l[0]?(n=i??N,h=-1):void 0===l[1]?h=-2:(h=n.lastIndex-l[2].length,r=l[1],n=void 0===l[3]?U:'"'===l[3]?F:$):n===$||n===F?n=U:n===j||n===R?n=N:(n=U,i=void 0);const c=n===U&&t[e+1].startsWith("/>")?" ":"";a+=n===N?s+C:h>=0?(o.push(r),s.slice(0,h)+_+s.slice(h)+k+c):s+k+(-2===h?e:c)}return[W(t,a+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class q{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let a=0,n=0;const r=t.length-1,l=this.parts,[h,d]=G(t,e);if(this.el=q.createElement(h,s),B.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=B.nextNode())&&l.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(_)){const e=d[n++],s=i.getAttribute(t).split(k),o=/([.?@])?(.*)/.exec(e);l.push({type:1,index:a,name:o[2],strings:s,ctor:"."===o[1]?Z:"?"===o[1]?Y:J:X}),i.removeAttribute(t)}else t.startsWith(k)&&(l.push({type:6,index:a}),i.removeAttribute(t));if(I.test(i.tagName)){const t=i.textContent.split(k),e=t.length-1;if(e>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],T()),B.nextNode(),l.push({type:2,index:++a});i.append(t[e],T())}}}else if(8===i.nodeType)if(i.data===A)l.push({type:2,index:a});else{let t=-1;for(;-1!==(t=i.data.indexOf(k,t+1));)l.push({type:7,index:a}),t+=k.length-1}a++}}static createElement(t,e){const s=P.createElement("template");return s.innerHTML=t,s}}function K(t,e,s=t,o){if(e===z)return e;let i=void 0!==o?s._$Co?.[o]:s._$Cl;const a=x(e)?void 0:e._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),void 0===a?i=void 0:(i=new a(t),i._$AT(t,s,o)),void 0!==o?(s._$Co??=[])[o]=i:s._$Cl=i),void 0!==i&&(e=K(t,i._$AS(t,e.values),i,o)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,o=(t?.creationScope??P).importNode(e,!0);B.currentNode=o;let i=B.nextNode(),a=0,n=0,r=s[0];for(;void 0!==r;){if(a===r.index){let e;2===r.type?e=new tt(i,i.nextSibling,this,t):1===r.type?e=new r.ctor(i,r.name,r.strings,this,t):6===r.type&&(e=new et(i,this,t)),this._$AV.push(e),r=s[++n]}a!==r?.index&&(i=B.nextNode(),a++)}return B.currentNode=P,o}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,o){this.type=2,this._$AH=H,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),x(t)?t===H||null==t||""===t?(this._$AH!==H&&this._$AR(),this._$AH=H):t!==this._$AH&&t!==z&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==H&&x(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,o="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=q.createElement(W(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new Q(o,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new q(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,o=0;for(const i of t)o===e.length?e.push(s=new tt(this.O(T()),this.O(T()),this,this.options)):s=e[o],s._$AI(i),o++;o<e.length&&(this._$AR(s&&s._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,o,i){this.type=1,this._$AH=H,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=H}_$AI(t,e=this,s,o){const i=this.strings;let a=!1;if(void 0===i)t=K(this,t,e,0),a=!x(t)||t!==this._$AH&&t!==z,a&&(this._$AH=t);else{const o=t;let n,r;for(t=i[0],n=0;n<i.length-1;n++)r=K(this,o[s+n],e,n),r===z&&(r=this._$AH[n]),a||=!x(r)||r!==this._$AH[n],r===H?t=H:t!==H&&(t+=(r??"")+i[n+1]),this._$AH[n]=r}a&&!o&&this.j(t)}j(t){t===H?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Z extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===H?void 0:t}}class Y extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==H)}}class J extends X{constructor(t,e,s,o,i){super(t,e,s,o,i),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??H)===z)return;const s=this._$AH,o=t===H&&s!==H||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==H&&(s===H||o);o&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class et{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const st=E.litHtmlPolyfillSupport;st?.(q,tt),(E.litHtmlVersions??=[]).push("3.1.2");const ot=E.litElementPolyfillSupport;ot?.({LitElement:class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const o=s?.renderBefore??e;let i=o._$litPart$;if(void 0===i){const t=s?.renderBefore??null;o._$litPart$=i=new tt(e.insertBefore(T(),t),t,void 0,s??{})}return i._$AI(t),i})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}}});(E.litElementVersions??=[]).push("4.0.4");const it=a`
:host {
  --primary-color: #3F51B5;
  --accent-color: #FFB300;
  --background-color: #F5F5F5;
  --text-color: #212121;
  --card-background: #FFFFFF;
  --card-text: #424242;
  --muted-text: #757575;
  --border-color: #EEEEEE;

  display: block;
  font-family: 'Inter', sans-serif;
  color: var(--text-color);
  background-color: transparent;
}
.dark-theme {
    --primary-color: #3F51B5;
    --accent-color: #FFB300;
    --background-color: #121212;
    --text-color: #E0E0E0;
    --card-background: #1E1E1E;
    --card-text: #BDBDBD;
    --muted-text: #9E9E9E;
    --border-color: #333333;
}
.widget-container {
  background-color: var(--background-color);
  padding: 1.5rem;
  min-height: 100vh;
}
.widget-inner {
  max-width: 1200px;
  margin: 0 auto;
}
.header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 2rem;
}
.business-info h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-color);
}
.business-info a {
  color: var(--primary-color);
  text-decoration: none;
}
.business-info a:hover {
  text-decoration: underline;
}
.summary {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.overall-rating, .rating-distribution {
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.overall-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.overall-rating-value {
  font-size: 4rem;
  font-weight: 800;
}
.star-rating {
  display: flex;
  color: var(--accent-color);
  font-size: 1.5rem;
}
.total-reviews {
  color: var(--muted-text);
  margin-top: 0.5rem;
}
.rating-distribution h2, .reviews-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
}
.distribution-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}
.distribution-row .star-icon {
  color: var(--accent-color);
}
.progress-bar {
  flex-grow: 1;
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 4px;
}
.distribution-count {
  color: var(--muted-text);
  width: 2rem;
  text-align: right;
}
.reviews-section-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}
.write-review-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.write-review-btn:hover {
  background-color: #303F9F;
}
.reviews-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
.review-card {
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.review-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
}
.author-info .name {
  font-weight: 600;
  color: var(--text-color);
}
.author-info .source {
  font-size: 0.875rem;
  color: var(--muted-text);
}
.review-card .star-rating {
  font-size: 1.25rem;
}
.review-text {
  color: var(--card-text);
  line-height: 1.6;
}
.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: var(--card-background);
  border: 2px dashed var(--border-color);
  border-radius: 12px;
}
.empty-state h3 {
  margin-top: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
}
.empty-state p {
  color: var(--muted-text);
}
.footer {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.875rem;
  color: var(--muted-text);
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background-color: var(--card-background);
  color: var(--text-color);
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--muted-text);
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.form-group input, .form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  color: var(--text-color);
  border-radius: 8px;
  box-sizing: border-box;
}
.rating-input {
  display: flex;
  gap: 0.25rem;
}
.rating-input button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--border-color);
  padding: 0;
}
.rating-input button.active {
  color: var(--accent-color);
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@media (min-width: 640px) {
  .header, .reviews-section-header {
    flex-direction: row;
    align-items: center;
  }
  .summary {
    grid-template-columns: 1fr 2fr;
  }
  .reviews-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .reviews-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
`,nt=new Map([["Direct","Direct review"],["Dashboard","Dashboard review"]]),rt="https://reviews-widgetchris.netlify.app/api/widgets",lt=class extends w{constructor(){super(),this.widgetId="",this.widget=null,this.loading=!0,this.showModal=!1,this.theme="light",this.addReviewState={},this.rating=0,this.hoverRating=0}connectedCallback(){super.connectedCallback();const t=this.getAttribute("widgetId");t?(this.widgetId=t,this.fetchWidgetData()):(this.loading=!1,console.error("Widget ID is missing"))}async fetchWidgetData(){this.loading=!0,this.requestUpdate();try{const t=await fetch(`${rt}/${this.widgetId}`);if(!t.ok)throw new Error("Network response was not ok");const e=await t.json();e.success?this.widget=e.data:console.error("API Error:",e.error)}catch(t){console.error("Fetch Error:",t)}finally{this.loading=!1,this.requestUpdate()}}get overallStats(){if(!this.widget?.reviews||0===this.widget.reviews.length)return{overallRating:0,totalReviews:0,ratingDistribution:[0,0,0,0,0]};const t=this.widget.reviews,e=t.reduce(((t,e)=>t+e.stars),0)/t.length,s=Array(5).fill(0);return t.forEach((t=>{s[5-t.stars]++})),{overallRating:e,totalReviews:t.length,ratingDistribution:s}}renderStarRating(t){let e="";for(let s=0;s<5;s++)e+=s<Math.round(t)?"★":"☆";return D`${e}`}renderReviewCard(t){return D`
      <div class="review-card">
        <div class="review-header">
          <div class="avatar">${t.name.charAt(0)}</div>
          <div class="author-info">
            <div class="name">${t.name}</div>
            <div class="source">${nt.get(t.source)||"Website review"}</div>
          </div>
        </div>
        <div class="star-rating">${this.renderStarRating(t.stars)}</div>
        <p class="review-text">${t.text}</p>
      </div>
    `}renderModal(){if(!this.showModal)return H;const t=t=>{this.rating=t,this.requestUpdate()};return D`
      <div class="modal-overlay" @click=${()=>this.showModal=!1}>
        <div class="modal-content" @click=${t=>t.stopPropagation()}>
          <div class="modal-header">
            <h2>Write a review</h2>
            <button class="close-btn" @click=${()=>this.showModal=!1}>&times;</button>
          </div>
          <form @submit=${async e=>{e.preventDefault();const s=new FormData(e.target),o=Object.fromEntries(s.entries());o.stars=this.rating;try{const t=await fetch(`${rt}/${this.widgetId}/reviews`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});await t.json();this.showModal=!1,this.fetchWidgetData()}catch(t){console.error(t)}}}>
            <input type="hidden" name="source" value="Direct" />
            <div class="form-group">
              <label for="name">Your Name</label>
              <input id="name" name="name" required />
            </div>
            <div class="form-group">
              <label>Rating</label>
              <div class="rating-input">
                ${[1,2,3,4,5].map((e=>D`
                    <button type="button" class="${this.rating>=e?"active":""}" @click=${()=>t(e)}>★</button>
                  `))}
              </div>
            </div>
            <div class="form-group">
              <label for="text">Review</label>
              <textarea id="text" name="text" required></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="write-review-btn">Submit Review</button>
            </div>
          </form>
        </div>
      </div>
    `}render(){if(this.loading)return D`<div class="widget-container"><p>Loading...</p></div>`;if(!this.widget)return D`<div class="widget-container"><p>Could not load widget data.</p></div>`;const{overallRating:t,totalReviews:e,ratingDistribution:s}=this.overallStats,o=[...(this.widget.reviews||[])].sort(((t,e)=>new Date(e.createdAt).getTime()-new Date(t.createdAt).getTime()));return D`
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <div class="widget-container ${this.theme}-theme">
        <div class="widget-inner">
          <header class="header">
            <div class="business-info">
              <h1>${this.widget.businessName}</h1>
              <a href=${this.widget.website} target="_blank" rel="noopener noreferrer">${this.widget.website}</a>
            </div>
          </header>

          ${e>0?D`
            <section class="summary">
              <div class="overall-rating">
                <div class="overall-rating-value">${t.toFixed(1)}</div>
                <div class="star-rating">${this.renderStarRating(t)}</div>
                <div class="total-reviews">Based on ${e} reviews</div>
              </div>
              <div class="rating-distribution">
                <h2>Rating distribution</h2>
                ${s.map(((t,s)=>D`
                    <div class="distribution-row">
                      <span>${5-s}</span>
                      <span class="star-icon">★</span>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${e>0?t/e*100:0}%"></div>
                      </div>
                      <span class="distribution-count">${t}</span>
                    </div>
                  `))}
              </div>
            </section>
          `:H}

          <section class="reviews-section">
            <div class="reviews-section-header">
              <h2>${e>0?"What people are saying":"Be the first to leave a review"}</h2>
              <button class="write-review-btn" @click=${()=>this.showModal=!0}>Write a Review</button>
            </div>
            
            ${e>0?D`
              <div class="reviews-grid">
                ${o.map(t=>this.renderReviewCard(t))}
              </div>
            `:D`
              <div class="empty-state">
                <h3>No reviews yet</h3>
                <p>Your widget is ready to collect feedback.</p>
              </div>
            `}
          </section>

          <footer class="footer">
            <p>Powered by Widget Wizard</p>
          </footer>
        </div>
      </div>
      ${this.renderModal()}
    `}};lt.styles=it,customElements.define("review-widget",lt);
//# sourceMappingURL=review-widget.js.map
