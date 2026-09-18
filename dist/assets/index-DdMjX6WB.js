(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();const _o=()=>{};var zs={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oi={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const p=function(t,e){if(!t)throw qe(e)},qe=function(t){return new Error("Firebase Database ("+Oi.SDK_VERSION+") INTERNAL ASSERT FAILED: "+t)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Li=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let i=t.charCodeAt(s);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},yo=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const i=t[n++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){const r=t[n++];e[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){const r=t[n++],o=t[n++],a=t[n++],l=((i&7)<<18|(r&63)<<12|(o&63)<<6|a&63)-65536;e[s++]=String.fromCharCode(55296+(l>>10)),e[s++]=String.fromCharCode(56320+(l&1023))}else{const r=t[n++],o=t[n++];e[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|o&63)}}return e.join("")},ns={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<t.length;i+=3){const r=t[i],o=i+1<t.length,a=o?t[i+1]:0,l=i+2<t.length,c=l?t[i+2]:0,h=r>>2,u=(r&3)<<4|a>>4;let d=(a&15)<<2|c>>6,f=c&63;l||(f=64,o||(d=64)),s.push(n[h],n[u],n[d],n[f])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Li(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):yo(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<t.length;){const r=n[t.charAt(i++)],a=i<t.length?n[t.charAt(i)]:0;++i;const c=i<t.length?n[t.charAt(i)]:64;++i;const u=i<t.length?n[t.charAt(i)]:64;if(++i,r==null||a==null||c==null||u==null)throw new vo;const d=r<<2|a>>4;if(s.push(d),c!==64){const f=a<<4&240|c>>2;if(s.push(f),u!==64){const g=c<<6&192|u;s.push(g)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class vo extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const $i=function(t){const e=Li(t);return ns.encodeByteArray(e,!0)},Bt=function(t){return $i(t).replace(/\./g,"")},On=function(t){try{return ns.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bo(t){return Mi(void 0,t)}function Mi(t,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const n=e;return new Date(n.getTime());case Object:t===void 0&&(t={});break;case Array:t=[];break;default:return e}for(const n in e)!e.hasOwnProperty(n)||!Eo(n)||(t[n]=Mi(t[n],e[n]));return t}function Eo(t){return t!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wo(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Co=()=>wo().__FIREBASE_DEFAULTS__,So=()=>{if(typeof process>"u"||typeof zs>"u")return;const t=zs.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Io=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&On(t[1]);return e&&JSON.parse(e)},Fi=()=>{try{return _o()||Co()||So()||Io()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},To=t=>{var e,n;return(n=(e=Fi())===null||e===void 0?void 0:e.emulatorHosts)===null||n===void 0?void 0:n[t]},ko=t=>{const e=To(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),s]:[e.substring(0,n),s]},Bi=()=>{var t;return(t=Fi())===null||t===void 0?void 0:t.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class It{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ss(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Ao(t){return(await fetch(t,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Po(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},s=e||"demo-project",i=t.iat||0,r=t.sub||t.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:i,exp:i+3600,auth_time:i,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},t);return[Bt(JSON.stringify(n)),Bt(JSON.stringify(o)),""].join(".")}const at={};function xo(){const t={prod:[],emulator:[]};for(const e of Object.keys(at))at[e]?t.emulator.push(e):t.prod.push(e);return t}function No(t){let e=document.getElementById(t),n=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),n=!0),{created:n,element:e}}let Ws=!1;function Ro(t,e){if(typeof window>"u"||typeof document>"u"||!ss(window.location.host)||at[t]===e||at[t]||Ws)return;at[t]=e;function n(d){return`__firebase__banner__${d}`}const s="__firebase__banner",r=xo().prod.length>0;function o(){const d=document.getElementById(s);d&&d.remove()}function a(d){d.style.display="flex",d.style.background="#7faaf0",d.style.position="fixed",d.style.bottom="5px",d.style.left="5px",d.style.padding=".5em",d.style.borderRadius="5px",d.style.alignItems="center"}function l(d,f){d.setAttribute("width","24"),d.setAttribute("id",f),d.setAttribute("height","24"),d.setAttribute("viewBox","0 0 24 24"),d.setAttribute("fill","none"),d.style.marginLeft="-6px"}function c(){const d=document.createElement("span");return d.style.cursor="pointer",d.style.marginLeft="16px",d.style.fontSize="24px",d.innerHTML=" &times;",d.onclick=()=>{Ws=!0,o()},d}function h(d,f){d.setAttribute("id",f),d.innerText="Learn more",d.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",d.setAttribute("target","__blank"),d.style.paddingLeft="5px",d.style.textDecoration="underline"}function u(){const d=No(s),f=n("text"),g=document.getElementById(f)||document.createElement("span"),w=n("learnmore"),R=document.getElementById(w)||document.createElement("a"),ne=n("preprendIcon"),se=document.getElementById(ne)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(d.created){const we=d.element;a(we),h(R,w);const En=c();l(se,ne),we.append(se,g,R,En),document.body.appendChild(we)}r?(g.innerText="Preview backend disconnected.",se.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(se.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,g.innerText="Preview backend running in this workspace."),g.setAttribute("id",f)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",u):u()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Do(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Hi(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Do())}function Oo(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Lo(){return Oi.NODE_ADMIN===!0}function $o(){try{return typeof indexedDB=="object"}catch{return!1}}function Mo(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var r;e(((r=i.error)===null||r===void 0?void 0:r.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fo="FirebaseError";class Tt extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=Fo,Object.setPrototypeOf(this,Tt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,zi.prototype.create)}}class zi{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},i=`${this.service}/${e}`,r=this.errors[e],o=r?Bo(r,s):"Error",a=`${this.serviceName}: ${o} (${i}).`;return new Tt(i,a,s)}}function Bo(t,e){return t.replace(Ho,(n,s)=>{const i=e[s];return i!=null?String(i):`<${s}?>`})}const Ho=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ft(t){return JSON.parse(t)}function O(t){return JSON.stringify(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wi=function(t){let e={},n={},s={},i="";try{const r=t.split(".");e=ft(On(r[0])||""),n=ft(On(r[1])||""),i=r[2],s=n.d||{},delete n.d}catch{}return{header:e,claims:n,data:s,signature:i}},zo=function(t){const e=Wi(t),n=e.claims;return!!n&&typeof n=="object"&&n.hasOwnProperty("iat")},Wo=function(t){const e=Wi(t).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function te(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function Ue(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]}function Us(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Ht(t,e,n){const s={};for(const i in t)Object.prototype.hasOwnProperty.call(t,i)&&(s[i]=e.call(n,t[i],i,t));return s}function zt(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const i of n){if(!s.includes(i))return!1;const r=t[i],o=e[i];if(Vs(r)&&Vs(o)){if(!zt(r,o))return!1}else if(r!==o)return!1}for(const i of s)if(!n.includes(i))return!1;return!0}function Vs(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uo(t){const e=[];for(const[n,s]of Object.entries(t))Array.isArray(s)?s.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vo{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,n){n||(n=0);const s=this.W_;if(typeof e=="string")for(let u=0;u<16;u++)s[u]=e.charCodeAt(n)<<24|e.charCodeAt(n+1)<<16|e.charCodeAt(n+2)<<8|e.charCodeAt(n+3),n+=4;else for(let u=0;u<16;u++)s[u]=e[n]<<24|e[n+1]<<16|e[n+2]<<8|e[n+3],n+=4;for(let u=16;u<80;u++){const d=s[u-3]^s[u-8]^s[u-14]^s[u-16];s[u]=(d<<1|d>>>31)&4294967295}let i=this.chain_[0],r=this.chain_[1],o=this.chain_[2],a=this.chain_[3],l=this.chain_[4],c,h;for(let u=0;u<80;u++){u<40?u<20?(c=a^r&(o^a),h=1518500249):(c=r^o^a,h=1859775393):u<60?(c=r&o|a&(r|o),h=2400959708):(c=r^o^a,h=3395469782);const d=(i<<5|i>>>27)+c+l+h+s[u]&4294967295;l=a,a=o,o=(r<<30|r>>>2)&4294967295,r=i,i=d}this.chain_[0]=this.chain_[0]+i&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+a&4294967295,this.chain_[4]=this.chain_[4]+l&4294967295}update(e,n){if(e==null)return;n===void 0&&(n=e.length);const s=n-this.blockSize;let i=0;const r=this.buf_;let o=this.inbuf_;for(;i<n;){if(o===0)for(;i<=s;)this.compress_(e,i),i+=this.blockSize;if(typeof e=="string"){for(;i<n;)if(r[o]=e.charCodeAt(i),++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}else for(;i<n;)if(r[o]=e[i],++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=n}digest(){const e=[];let n=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let i=this.blockSize-1;i>=56;i--)this.buf_[i]=n&255,n/=256;this.compress_(this.buf_);let s=0;for(let i=0;i<5;i++)for(let r=24;r>=0;r-=8)e[s]=this.chain_[i]>>r&255,++s;return e}}function ln(t,e){return`${t} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jo=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let i=t.charCodeAt(s);if(i>=55296&&i<=56319){const r=i-55296;s++,p(s<t.length,"Surrogate pair missing trail surrogate.");const o=t.charCodeAt(s)-56320;i=65536+(r<<10)+o}i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):i<65536?(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},cn=function(t){let e=0;for(let n=0;n<t.length;n++){const s=t.charCodeAt(n);s<128?e++:s<2048?e+=2:s>=55296&&s<=56319?(e+=4,n++):e+=3}return e};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qe(t){return t&&t._delegate?t._delegate:t}class pt{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ce="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Go{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new It;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(r){if(i)return null;throw r}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Ko(e))try{this.getOrInitializeService({instanceIdentifier:Ce})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch{}}}}clearInstance(e=Ce){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ce){return this.instances.has(e)}getOptions(e=Ce){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[r,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(r);s===a&&o.resolve(i)}return i}onInit(e,n){var s;const i=this.normalizeInstanceIdentifier(n),r=(s=this.onInitCallbacks.get(i))!==null&&s!==void 0?s:new Set;r.add(e),this.onInitCallbacks.set(i,r);const o=this.instances.get(i);return o&&e(o,i),()=>{r.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const i of s)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Yo(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Ce){return this.component?this.component.multipleInstances?e:Ce:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Yo(t){return t===Ce?void 0:t}function Ko(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qo{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new Go(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var T;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(T||(T={}));const Qo={debug:T.DEBUG,verbose:T.VERBOSE,info:T.INFO,warn:T.WARN,error:T.ERROR,silent:T.SILENT},Jo=T.INFO,Zo={[T.DEBUG]:"log",[T.VERBOSE]:"log",[T.INFO]:"info",[T.WARN]:"warn",[T.ERROR]:"error"},Xo=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),i=Zo[e];if(i)console[i](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ui{constructor(e){this.name=e,this._logLevel=Jo,this._logHandler=Xo,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in T))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Qo[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,T.DEBUG,...e),this._logHandler(this,T.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,T.VERBOSE,...e),this._logHandler(this,T.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,T.INFO,...e),this._logHandler(this,T.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,T.WARN,...e),this._logHandler(this,T.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,T.ERROR,...e),this._logHandler(this,T.ERROR,...e)}}const ea=(t,e)=>e.some(n=>t instanceof n);let js,Gs;function ta(){return js||(js=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function na(){return Gs||(Gs=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Vi=new WeakMap,Ln=new WeakMap,ji=new WeakMap,wn=new WeakMap,is=new WeakMap;function sa(t){const e=new Promise((n,s)=>{const i=()=>{t.removeEventListener("success",r),t.removeEventListener("error",o)},r=()=>{n(ge(t.result)),i()},o=()=>{s(t.error),i()};t.addEventListener("success",r),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&Vi.set(n,t)}).catch(()=>{}),is.set(e,t),e}function ia(t){if(Ln.has(t))return;const e=new Promise((n,s)=>{const i=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",o),t.removeEventListener("abort",o)},r=()=>{n(),i()},o=()=>{s(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",r),t.addEventListener("error",o),t.addEventListener("abort",o)});Ln.set(t,e)}let $n={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Ln.get(t);if(e==="objectStoreNames")return t.objectStoreNames||ji.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ge(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function ra(t){$n=t($n)}function oa(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(Cn(this),e,...n);return ji.set(s,e.sort?e.sort():[e]),ge(s)}:na().includes(t)?function(...e){return t.apply(Cn(this),e),ge(Vi.get(this))}:function(...e){return ge(t.apply(Cn(this),e))}}function aa(t){return typeof t=="function"?oa(t):(t instanceof IDBTransaction&&ia(t),ea(t,ta())?new Proxy(t,$n):t)}function ge(t){if(t instanceof IDBRequest)return sa(t);if(wn.has(t))return wn.get(t);const e=aa(t);return e!==t&&(wn.set(t,e),is.set(e,t)),e}const Cn=t=>is.get(t);function la(t,e,{blocked:n,upgrade:s,blocking:i,terminated:r}={}){const o=indexedDB.open(t,e),a=ge(o);return s&&o.addEventListener("upgradeneeded",l=>{s(ge(o.result),l.oldVersion,l.newVersion,ge(o.transaction),l)}),n&&o.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),a.then(l=>{r&&l.addEventListener("close",()=>r()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const ca=["get","getKey","getAll","getAllKeys","count"],da=["put","add","delete","clear"],Sn=new Map;function Ys(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(Sn.get(e))return Sn.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,i=da.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(i||ca.includes(n)))return;const r=async function(o,...a){const l=this.transaction(o,i?"readwrite":"readonly");let c=l.store;return s&&(c=c.index(a.shift())),(await Promise.all([c[n](...a),i&&l.done]))[0]};return Sn.set(e,r),r}ra(t=>({...t,get:(e,n,s)=>Ys(e,n)||t.get(e,n,s),has:(e,n)=>!!Ys(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ua{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(ha(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function ha(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Mn="@firebase/app",Ks="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const le=new Ui("@firebase/app"),fa="@firebase/app-compat",pa="@firebase/analytics-compat",ga="@firebase/analytics",ma="@firebase/app-check-compat",_a="@firebase/app-check",ya="@firebase/auth",va="@firebase/auth-compat",ba="@firebase/database",Ea="@firebase/data-connect",wa="@firebase/database-compat",Ca="@firebase/functions",Sa="@firebase/functions-compat",Ia="@firebase/installations",Ta="@firebase/installations-compat",ka="@firebase/messaging",Aa="@firebase/messaging-compat",Pa="@firebase/performance",xa="@firebase/performance-compat",Na="@firebase/remote-config",Ra="@firebase/remote-config-compat",Da="@firebase/storage",Oa="@firebase/storage-compat",La="@firebase/firestore",$a="@firebase/ai",Ma="@firebase/firestore-compat",Fa="firebase",Ba="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fn="[DEFAULT]",Ha={[Mn]:"fire-core",[fa]:"fire-core-compat",[ga]:"fire-analytics",[pa]:"fire-analytics-compat",[_a]:"fire-app-check",[ma]:"fire-app-check-compat",[ya]:"fire-auth",[va]:"fire-auth-compat",[ba]:"fire-rtdb",[Ea]:"fire-data-connect",[wa]:"fire-rtdb-compat",[Ca]:"fire-fn",[Sa]:"fire-fn-compat",[Ia]:"fire-iid",[Ta]:"fire-iid-compat",[ka]:"fire-fcm",[Aa]:"fire-fcm-compat",[Pa]:"fire-perf",[xa]:"fire-perf-compat",[Na]:"fire-rc",[Ra]:"fire-rc-compat",[Da]:"fire-gcs",[Oa]:"fire-gcs-compat",[La]:"fire-fst",[Ma]:"fire-fst-compat",[$a]:"fire-vertex","fire-js":"fire-js",[Fa]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wt=new Map,za=new Map,Bn=new Map;function qs(t,e){try{t.container.addComponent(e)}catch(n){le.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Ut(t){const e=t.name;if(Bn.has(e))return le.debug(`There were multiple attempts to register component ${e}.`),!1;Bn.set(e,t);for(const n of Wt.values())qs(n,t);for(const n of za.values())qs(n,t);return!0}function Wa(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function Ua(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Va={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},me=new zi("app","Firebase",Va);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ja{constructor(e,n,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new pt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw me.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ga=Ba;function Gi(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Fn,automaticDataCollectionEnabled:!0},e),i=s.name;if(typeof i!="string"||!i)throw me.create("bad-app-name",{appName:String(i)});if(n||(n=Bi()),!n)throw me.create("no-options");const r=Wt.get(i);if(r){if(zt(n,r.options)&&zt(s,r.config))return r;throw me.create("duplicate-app",{appName:i})}const o=new qo(i);for(const l of Bn.values())o.addComponent(l);const a=new ja(n,s,o);return Wt.set(i,a),a}function Ya(t=Fn){const e=Wt.get(t);if(!e&&t===Fn&&Bi())return Gi();if(!e)throw me.create("no-app",{appName:t});return e}function Be(t,e,n){var s;let i=(s=Ha[t])!==null&&s!==void 0?s:t;n&&(i+=`-${n}`);const r=i.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const a=[`Unable to register library "${i}" with version "${e}":`];r&&a.push(`library name "${i}" contains illegal characters (whitespace or "/")`),r&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),le.warn(a.join(" "));return}Ut(new pt(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ka="firebase-heartbeat-database",qa=1,gt="firebase-heartbeat-store";let In=null;function Yi(){return In||(In=la(Ka,qa,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(gt)}catch(n){console.warn(n)}}}}).catch(t=>{throw me.create("idb-open",{originalErrorMessage:t.message})})),In}async function Qa(t){try{const n=(await Yi()).transaction(gt),s=await n.objectStore(gt).get(Ki(t));return await n.done,s}catch(e){if(e instanceof Tt)le.warn(e.message);else{const n=me.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});le.warn(n.message)}}}async function Qs(t,e){try{const s=(await Yi()).transaction(gt,"readwrite");await s.objectStore(gt).put(e,Ki(t)),await s.done}catch(n){if(n instanceof Tt)le.warn(n.message);else{const s=me.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});le.warn(s.message)}}}function Ki(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ja=1024,Za=30;class Xa{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new tl(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Js();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:i}),this._heartbeatsCache.heartbeats.length>Za){const o=nl(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){le.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Js(),{heartbeatsToSend:s,unsentEntries:i}=el(this._heartbeatsCache.heartbeats),r=Bt(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(n){return le.warn(n),""}}}function Js(){return new Date().toISOString().substring(0,10)}function el(t,e=Ja){const n=[];let s=t.slice();for(const i of t){const r=n.find(o=>o.agent===i.agent);if(r){if(r.dates.push(i.date),Zs(n)>e){r.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Zs(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class tl{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return $o()?Mo().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Qa(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return Qs(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return Qs(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Zs(t){return Bt(JSON.stringify({version:2,heartbeats:t})).length}function nl(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let s=1;s<t.length;s++)t[s].date<n&&(n=t[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sl(t){Ut(new pt("platform-logger",e=>new ua(e),"PRIVATE")),Ut(new pt("heartbeat",e=>new Xa(e),"PRIVATE")),Be(Mn,Ks,t),Be(Mn,Ks,"esm2017"),Be("fire-js","")}sl("");var il="firebase",rl="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Be(il,rl,"app");var Xs={};const ei="@firebase/database",ti="1.0.20";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let qi="";function ol(t){qi=t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class al{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,n){n==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),O(n))}get(e){const n=this.domStorage_.getItem(this.prefixedName_(e));return n==null?null:ft(n)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ll{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,n){n==null?delete this.cache_[e]:this.cache_[e]=n}get(e){return te(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qi=function(t){try{if(typeof window<"u"&&typeof window[t]<"u"){const e=window[t];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new al(e)}}catch{}return new ll},Te=Qi("localStorage"),cl=Qi("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const He=new Ui("@firebase/database"),dl=(function(){let t=1;return function(){return t++}})(),Ji=function(t){const e=jo(t),n=new Vo;n.update(e);const s=n.digest();return ns.encodeByteArray(s)},kt=function(...t){let e="";for(let n=0;n<t.length;n++){const s=t[n];Array.isArray(s)||s&&typeof s=="object"&&typeof s.length=="number"?e+=kt.apply(null,s):typeof s=="object"?e+=O(s):e+=s,e+=" "}return e};let lt=null,ni=!0;const ul=function(t,e){p(!0,"Can't turn on custom loggers persistently."),He.logLevel=T.VERBOSE,lt=He.log.bind(He)},M=function(...t){if(ni===!0&&(ni=!1,lt===null&&cl.get("logging_enabled")===!0&&ul()),lt){const e=kt.apply(null,t);lt(e)}},At=function(t){return function(...e){M(t,...e)}},Hn=function(...t){const e="FIREBASE INTERNAL ERROR: "+kt(...t);He.error(e)},ce=function(...t){const e=`FIREBASE FATAL ERROR: ${kt(...t)}`;throw He.error(e),new Error(e)},z=function(...t){const e="FIREBASE WARNING: "+kt(...t);He.warn(e)},hl=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&z("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},rs=function(t){return typeof t=="number"&&(t!==t||t===Number.POSITIVE_INFINITY||t===Number.NEGATIVE_INFINITY)},fl=function(t){if(document.readyState==="complete")t();else{let e=!1;const n=function(){if(!document.body){setTimeout(n,Math.floor(10));return}e||(e=!0,t())};document.addEventListener?(document.addEventListener("DOMContentLoaded",n,!1),window.addEventListener("load",n,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&n()}),window.attachEvent("onload",n))}},Ve="[MIN_NAME]",Ae="[MAX_NAME]",Ne=function(t,e){if(t===e)return 0;if(t===Ve||e===Ae)return-1;if(e===Ve||t===Ae)return 1;{const n=si(t),s=si(e);return n!==null?s!==null?n-s===0?t.length-e.length:n-s:-1:s!==null?1:t<e?-1:1}},pl=function(t,e){return t===e?0:t<e?-1:1},et=function(t,e){if(e&&t in e)return e[t];throw new Error("Missing required key ("+t+") in object: "+O(e))},os=function(t){if(typeof t!="object"||t===null)return O(t);const e=[];for(const s in t)e.push(s);e.sort();let n="{";for(let s=0;s<e.length;s++)s!==0&&(n+=","),n+=O(e[s]),n+=":",n+=os(t[e[s]]);return n+="}",n},Zi=function(t,e){const n=t.length;if(n<=e)return[t];const s=[];for(let i=0;i<n;i+=e)i+e>n?s.push(t.substring(i,n)):s.push(t.substring(i,i+e));return s};function F(t,e){for(const n in t)t.hasOwnProperty(n)&&e(n,t[n])}const Xi=function(t){p(!rs(t),"Invalid JSON number");const e=11,n=52,s=(1<<e-1)-1;let i,r,o,a,l;t===0?(r=0,o=0,i=1/t===-1/0?1:0):(i=t<0,t=Math.abs(t),t>=Math.pow(2,1-s)?(a=Math.min(Math.floor(Math.log(t)/Math.LN2),s),r=a+s,o=Math.round(t*Math.pow(2,n-a)-Math.pow(2,n))):(r=0,o=Math.round(t/Math.pow(2,1-s-n))));const c=[];for(l=n;l;l-=1)c.push(o%2?1:0),o=Math.floor(o/2);for(l=e;l;l-=1)c.push(r%2?1:0),r=Math.floor(r/2);c.push(i?1:0),c.reverse();const h=c.join("");let u="";for(l=0;l<64;l+=8){let d=parseInt(h.substr(l,8),2).toString(16);d.length===1&&(d="0"+d),u=u+d}return u.toLowerCase()},gl=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},ml=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function _l(t,e){let n="Unknown Error";t==="too_big"?n="The data requested exceeds the maximum size that can be accessed with a single request.":t==="permission_denied"?n="Client doesn't have permission to access the desired data.":t==="unavailable"&&(n="The service is unavailable");const s=new Error(t+" at "+e._path.toString()+": "+n);return s.code=t.toUpperCase(),s}const yl=new RegExp("^-?(0*)\\d{1,10}$"),vl=-2147483648,bl=2147483647,si=function(t){if(yl.test(t)){const e=Number(t);if(e>=vl&&e<=bl)return e}return null},Je=function(t){try{t()}catch(e){setTimeout(()=>{const n=e.stack||"";throw z("Exception was thrown by user callback.",n),e},Math.floor(0))}},El=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},ct=function(t,e){const n=setTimeout(t,e);return typeof n=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(n):typeof n=="object"&&n.unref&&n.unref(),n};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wl{constructor(e,n){this.appCheckProvider=n,this.appName=e.name,Ua(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=n==null?void 0:n.getImmediate({optional:!0}),this.appCheck||n==null||n.get().then(s=>this.appCheck=s)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((n,s)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(n,s):n(null)},0)})}addTokenChangeListener(e){var n;(n=this.appCheckProvider)===null||n===void 0||n.get().then(s=>s.addTokenListener(e))}notifyForInvalidToken(){z(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cl{constructor(e,n,s){this.appName_=e,this.firebaseOptions_=n,this.authProvider_=s,this.auth_=null,this.auth_=s.getImmediate({optional:!0}),this.auth_||s.onInit(i=>this.auth_=i)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(n=>n&&n.code==="auth/token-not-initialized"?(M("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(n)):new Promise((n,s)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(n,s):n(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(n=>n.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(n=>n.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',z(e)}}class Mt{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Mt.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const as="5",er="v",tr="s",nr="r",sr="f",ir=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,rr="ls",or="p",zn="ac",ar="websocket",lr="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cr{constructor(e,n,s,i,r=!1,o="",a=!1,l=!1,c=null){this.secure=n,this.namespace=s,this.webSocketOnly=i,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=a,this.isUsingEmulator=l,this.emulatorOptions=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Te.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Te.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",n=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${n}`}}function Sl(t){return t.host!==t.internalHost||t.isCustomHost()||t.includeNamespaceInQueryParams}function dr(t,e,n){p(typeof e=="string","typeof type must == string"),p(typeof n=="object","typeof params must == object");let s;if(e===ar)s=(t.secure?"wss://":"ws://")+t.internalHost+"/.ws?";else if(e===lr)s=(t.secure?"https://":"http://")+t.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);Sl(t)&&(n.ns=t.namespace);const i=[];return F(n,(r,o)=>{i.push(r+"="+o)}),s+i.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Il{constructor(){this.counters_={}}incrementCounter(e,n=1){te(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=n}get(){return bo(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tn={},kn={};function ls(t){const e=t.toString();return Tn[e]||(Tn[e]=new Il),Tn[e]}function Tl(t,e){const n=t.toString();return kn[n]||(kn[n]=e()),kn[n]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kl{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,n){this.closeAfterResponse=e,this.onClose=n,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,n){for(this.pendingResponses[e]=n;this.pendingResponses[this.currentResponseNum];){const s=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let i=0;i<s.length;++i)s[i]&&Je(()=>{this.onMessage_(s[i])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ii="start",Al="close",Pl="pLPCommand",xl="pRTLPCB",ur="id",hr="pw",fr="ser",Nl="cb",Rl="seg",Dl="ts",Ol="d",Ll="dframe",pr=1870,gr=30,$l=pr-gr,Ml=25e3,Fl=3e4;class Fe{constructor(e,n,s,i,r,o,a){this.connId=e,this.repoInfo=n,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.transportSessionId=o,this.lastSessionId=a,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=At(e),this.stats_=ls(n),this.urlFn=l=>(this.appCheckToken&&(l[zn]=this.appCheckToken),dr(n,lr,l))}open(e,n){this.curSegmentNum=0,this.onDisconnect_=n,this.myPacketOrderer=new kl(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(Fl)),fl(()=>{if(this.isClosed_)return;this.scriptTagHolder=new cs((...r)=>{const[o,a,l,c,h]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===ii)this.id=a,this.password=l;else if(o===Al)a?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(a,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...r)=>{const[o,a]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(o,a)},()=>{this.onClosed_()},this.urlFn);const s={};s[ii]="t",s[fr]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(s[Nl]=this.scriptTagHolder.uniqueCallbackIdentifier),s[er]=as,this.transportSessionId&&(s[tr]=this.transportSessionId),this.lastSessionId&&(s[rr]=this.lastSessionId),this.applicationId&&(s[or]=this.applicationId),this.appCheckToken&&(s[zn]=this.appCheckToken),typeof location<"u"&&location.hostname&&ir.test(location.hostname)&&(s[nr]=sr);const i=this.urlFn(s);this.log_("Connecting via long-poll to "+i),this.scriptTagHolder.addTag(i,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){Fe.forceAllow_=!0}static forceDisallow(){Fe.forceDisallow_=!0}static isAvailable(){return Fe.forceAllow_?!0:!Fe.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!gl()&&!ml()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const n=O(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const s=$i(n),i=Zi(s,$l);for(let r=0;r<i.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[r]),this.curSegmentNum++}addDisconnectPingFrame(e,n){this.myDisconnFrame=document.createElement("iframe");const s={};s[Ll]="t",s[ur]=e,s[hr]=n,this.myDisconnFrame.src=this.urlFn(s),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const n=O(e).length;this.bytesReceived+=n,this.stats_.incrementCounter("bytes_received",n)}}class cs{constructor(e,n,s,i){this.onDisconnect=s,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=dl(),window[Pl+this.uniqueCallbackIdentifier]=e,window[xl+this.uniqueCallbackIdentifier]=n,this.myIFrame=cs.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(a){M("frame writing exception"),a.stack&&M(a.stack),M(a)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||M("No IE domain setting required")}catch{const s=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+s+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,n){for(this.myID=e,this.myPW=n,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[ur]=this.myID,e[hr]=this.myPW,e[fr]=this.currentSerial;let n=this.urlFn(e),s="",i=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+gr+s.length<=pr;){const o=this.pendingSegs.shift();s=s+"&"+Rl+i+"="+o.seg+"&"+Dl+i+"="+o.ts+"&"+Ol+i+"="+o.d,i++}return n=n+s,this.addLongPollTag_(n,this.currentSerial),!0}else return!1}enqueueSegment(e,n,s){this.pendingSegs.push({seg:e,ts:n,d:s}),this.alive&&this.newRequest_()}addLongPollTag_(e,n){this.outstandingRequests.add(n);const s=()=>{this.outstandingRequests.delete(n),this.newRequest_()},i=setTimeout(s,Math.floor(Ml)),r=()=>{clearTimeout(i),s()};this.addTag(e,r)}addTag(e,n){setTimeout(()=>{try{if(!this.sendNewPolls)return;const s=this.myIFrame.doc.createElement("script");s.type="text/javascript",s.async=!0,s.src=e,s.onload=s.onreadystatechange=function(){const i=s.readyState;(!i||i==="loaded"||i==="complete")&&(s.onload=s.onreadystatechange=null,s.parentNode&&s.parentNode.removeChild(s),n())},s.onerror=()=>{M("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(s)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bl=16384,Hl=45e3;let Vt=null;typeof MozWebSocket<"u"?Vt=MozWebSocket:typeof WebSocket<"u"&&(Vt=WebSocket);class q{constructor(e,n,s,i,r,o,a){this.connId=e,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=At(this.connId),this.stats_=ls(n),this.connURL=q.connectionURL_(n,o,a,i,s),this.nodeAdmin=n.nodeAdmin}static connectionURL_(e,n,s,i,r){const o={};return o[er]=as,typeof location<"u"&&location.hostname&&ir.test(location.hostname)&&(o[nr]=sr),n&&(o[tr]=n),s&&(o[rr]=s),i&&(o[zn]=i),r&&(o[or]=r),dr(e,ar,o)}open(e,n){this.onDisconnect=n,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Te.set("previous_websocket_failure",!0);try{let s;Lo(),this.mySock=new Vt(this.connURL,[],s)}catch(s){this.log_("Error instantiating WebSocket.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=s=>{this.handleIncomingFrame(s)},this.mySock.onerror=s=>{this.log_("WebSocket error.  Closing connection.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_()}}start(){}static forceDisallow(){q.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const n=/Android ([0-9]{0,}\.[0-9]{0,})/,s=navigator.userAgent.match(n);s&&s.length>1&&parseFloat(s[1])<4.4&&(e=!0)}return!e&&Vt!==null&&!q.forceDisallow_}static previouslyFailed(){return Te.isInMemoryStorage||Te.get("previous_websocket_failure")===!0}markConnectionHealthy(){Te.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const n=this.frames.join("");this.frames=null;const s=ft(n);this.onMessage(s)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(p(this.frames===null,"We already have a frame buffer"),e.length<=6){const n=Number(e);if(!isNaN(n))return this.handleNewFrameCount_(n),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const n=e.data;if(this.bytesReceived+=n.length,this.stats_.incrementCounter("bytes_received",n.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(n);else{const s=this.extractFrameCount_(n);s!==null&&this.appendFrame_(s)}}send(e){this.resetKeepAlive();const n=O(e);this.bytesSent+=n.length,this.stats_.incrementCounter("bytes_sent",n.length);const s=Zi(n,Bl);s.length>1&&this.sendString_(String(s.length));for(let i=0;i<s.length;i++)this.sendString_(s[i])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(Hl))}sendString_(e){try{this.mySock.send(e)}catch(n){this.log_("Exception thrown from WebSocket.send():",n.message||n.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}q.responsesRequiredToBeHealthy=2;q.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt{static get ALL_TRANSPORTS(){return[Fe,q]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const n=q&&q.isAvailable();let s=n&&!q.previouslyFailed();if(e.webSocketOnly&&(n||z("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),s=!0),s)this.transports_=[q];else{const i=this.transports_=[];for(const r of mt.ALL_TRANSPORTS)r&&r.isAvailable()&&i.push(r);mt.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}mt.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zl=6e4,Wl=5e3,Ul=10*1024,Vl=100*1024,An="t",ri="d",jl="s",oi="r",Gl="e",ai="o",li="a",ci="n",di="p",Yl="h";class Kl{constructor(e,n,s,i,r,o,a,l,c,h){this.id=e,this.repoInfo_=n,this.applicationId_=s,this.appCheckToken_=i,this.authToken_=r,this.onMessage_=o,this.onReady_=a,this.onDisconnect_=l,this.onKill_=c,this.lastSessionId=h,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=At("c:"+this.id+":"),this.transportManager_=new mt(n),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.conn_),s=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(n,s)},Math.floor(0));const i=e.healthyTimeout||0;i>0&&(this.healthyTimeout_=ct(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>Vl?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>Ul?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return n=>{e===this.conn_?this.onConnectionLost_(n):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return n=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(n):e===this.secondaryConn_?this.onSecondaryMessageReceived_(n):this.log_("message on old connection"))}}sendRequest(e){const n={t:"d",d:e};this.sendData_(n)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(An in e){const n=e[An];n===li?this.upgradeIfSecondaryHealthy_():n===oi?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):n===ai&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const n=et("t",e),s=et("d",e);if(n==="c")this.onSecondaryControl_(s);else if(n==="d")this.pendingDataMessages.push(s);else throw new Error("Unknown protocol layer: "+n)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:di,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:li,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:ci,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const n=et("t",e),s=et("d",e);n==="c"?this.onControl_(s):n==="d"&&this.onDataMessage_(s)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const n=et(An,e);if(ri in e){const s=e[ri];if(n===Yl){const i=Object.assign({},s);this.repoInfo_.isUsingEmulator&&(i.h=this.repoInfo_.host),this.onHandshake_(i)}else if(n===ci){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let i=0;i<this.pendingDataMessages.length;++i)this.onDataMessage_(this.pendingDataMessages[i]);this.pendingDataMessages=[],this.tryCleanupConnection()}else n===jl?this.onConnectionShutdown_(s):n===oi?this.onReset_(s):n===Gl?Hn("Server Error: "+s):n===ai?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):Hn("Unknown control packet command: "+n)}}onHandshake_(e){const n=e.ts,s=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,n),as!==s&&z("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const n=this.connReceiver_(this.secondaryConn_),s=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(n,s),ct(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(zl))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,n){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(n,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):ct(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(Wl))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:di,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Te.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr{put(e,n,s,i){}merge(e,n,s,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,n,s){}onDisconnectMerge(e,n,s){}onDisconnectCancel(e,n){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _r{constructor(e){this.allowedEvents_=e,this.listeners_={},p(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...n){if(Array.isArray(this.listeners_[e])){const s=[...this.listeners_[e]];for(let i=0;i<s.length;i++)s[i].callback.apply(s[i].context,n)}}on(e,n,s){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:n,context:s});const i=this.getInitialEvent(e);i&&n.apply(s,i)}off(e,n,s){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let r=0;r<i.length;r++)if(i[r].callback===n&&(!s||s===i[r].context)){i.splice(r,1);return}}validateEventType_(e){p(this.allowedEvents_.find(n=>n===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt extends _r{static getInstance(){return new jt}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!Hi()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return p(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ui=32,hi=768;class C{constructor(e,n){if(n===void 0){this.pieces_=e.split("/");let s=0;for(let i=0;i<this.pieces_.length;i++)this.pieces_[i].length>0&&(this.pieces_[s]=this.pieces_[i],s++);this.pieces_.length=s,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=n}toString(){let e="";for(let n=this.pieceNum_;n<this.pieces_.length;n++)this.pieces_[n]!==""&&(e+="/"+this.pieces_[n]);return e||"/"}}function E(){return new C("")}function y(t){return t.pieceNum_>=t.pieces_.length?null:t.pieces_[t.pieceNum_]}function ve(t){return t.pieces_.length-t.pieceNum_}function k(t){let e=t.pieceNum_;return e<t.pieces_.length&&e++,new C(t.pieces_,e)}function ds(t){return t.pieceNum_<t.pieces_.length?t.pieces_[t.pieces_.length-1]:null}function ql(t){let e="";for(let n=t.pieceNum_;n<t.pieces_.length;n++)t.pieces_[n]!==""&&(e+="/"+encodeURIComponent(String(t.pieces_[n])));return e||"/"}function _t(t,e=0){return t.pieces_.slice(t.pieceNum_+e)}function yr(t){if(t.pieceNum_>=t.pieces_.length)return null;const e=[];for(let n=t.pieceNum_;n<t.pieces_.length-1;n++)e.push(t.pieces_[n]);return new C(e,0)}function x(t,e){const n=[];for(let s=t.pieceNum_;s<t.pieces_.length;s++)n.push(t.pieces_[s]);if(e instanceof C)for(let s=e.pieceNum_;s<e.pieces_.length;s++)n.push(e.pieces_[s]);else{const s=e.split("/");for(let i=0;i<s.length;i++)s[i].length>0&&n.push(s[i])}return new C(n,0)}function b(t){return t.pieceNum_>=t.pieces_.length}function H(t,e){const n=y(t),s=y(e);if(n===null)return e;if(n===s)return H(k(t),k(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+t+")")}function Ql(t,e){const n=_t(t,0),s=_t(e,0);for(let i=0;i<n.length&&i<s.length;i++){const r=Ne(n[i],s[i]);if(r!==0)return r}return n.length===s.length?0:n.length<s.length?-1:1}function us(t,e){if(ve(t)!==ve(e))return!1;for(let n=t.pieceNum_,s=e.pieceNum_;n<=t.pieces_.length;n++,s++)if(t.pieces_[n]!==e.pieces_[s])return!1;return!0}function j(t,e){let n=t.pieceNum_,s=e.pieceNum_;if(ve(t)>ve(e))return!1;for(;n<t.pieces_.length;){if(t.pieces_[n]!==e.pieces_[s])return!1;++n,++s}return!0}class Jl{constructor(e,n){this.errorPrefix_=n,this.parts_=_t(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let s=0;s<this.parts_.length;s++)this.byteLength_+=cn(this.parts_[s]);vr(this)}}function Zl(t,e){t.parts_.length>0&&(t.byteLength_+=1),t.parts_.push(e),t.byteLength_+=cn(e),vr(t)}function Xl(t){const e=t.parts_.pop();t.byteLength_-=cn(e),t.parts_.length>0&&(t.byteLength_-=1)}function vr(t){if(t.byteLength_>hi)throw new Error(t.errorPrefix_+"has a key path longer than "+hi+" bytes ("+t.byteLength_+").");if(t.parts_.length>ui)throw new Error(t.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+ui+") or object contains a cycle "+Se(t))}function Se(t){return t.parts_.length===0?"":"in property '"+t.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hs extends _r{static getInstance(){return new hs}constructor(){super(["visible"]);let e,n;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(n="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(n="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(n="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(n="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,n&&document.addEventListener(n,()=>{const s=!document[e];s!==this.visible_&&(this.visible_=s,this.trigger("visible",s))},!1)}getInitialEvent(e){return p(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tt=1e3,ec=300*1e3,fi=30*1e3,tc=1.3,nc=3e4,sc="server_kill",pi=3;class oe extends mr{constructor(e,n,s,i,r,o,a,l){if(super(),this.repoInfo_=e,this.applicationId_=n,this.onDataUpdate_=s,this.onConnectStatus_=i,this.onServerInfoUpdate_=r,this.authTokenProvider_=o,this.appCheckTokenProvider_=a,this.authOverride_=l,this.id=oe.nextPersistentConnectionId_++,this.log_=At("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=tt,this.maxReconnectDelay_=ec,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,l)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");hs.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&jt.getInstance().on("online",this.onOnline_,this)}sendRequest(e,n,s){const i=++this.requestNumber_,r={r:i,a:e,b:n};this.log_(O(r)),p(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),s&&(this.requestCBHash_[i]=s)}get(e){this.initConnection_();const n=new It,i={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const a=o.d;o.s==="ok"?n.resolve(a):n.reject(a)}};this.outstandingGets_.push(i),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),n.promise}listen(e,n,s,i){this.initConnection_();const r=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+r),this.listens.has(o)||this.listens.set(o,new Map),p(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),p(!this.listens.get(o).has(r),"listen() called twice for same path/queryId.");const a={onComplete:i,hashFn:n,query:e,tag:s};this.listens.get(o).set(r,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const n=this.outstandingGets_[e];this.sendRequest("g",n.request,s=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),n.onComplete&&n.onComplete(s)})}sendListen_(e){const n=e.query,s=n._path.toString(),i=n._queryIdentifier;this.log_("Listen on "+s+" for "+i);const r={p:s},o="q";e.tag&&(r.q=n._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(o,r,a=>{const l=a.d,c=a.s;oe.warnOnListenWarnings_(l,n),(this.listens.get(s)&&this.listens.get(s).get(i))===e&&(this.log_("listen response",a),c!=="ok"&&this.removeListen_(s,i),e.onComplete&&e.onComplete(c,l))})}static warnOnListenWarnings_(e,n){if(e&&typeof e=="object"&&te(e,"w")){const s=Ue(e,"w");if(Array.isArray(s)&&~s.indexOf("no_index")){const i='".indexOn": "'+n._queryParams.getIndex().toString()+'"',r=n._path.toString();z(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${i} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||Wo(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=fi)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,n=zo(e)?"auth":"gauth",s={cred:e};this.authOverride_===null?s.noauth=!0:typeof this.authOverride_=="object"&&(s.authvar=this.authOverride_),this.sendRequest(n,s,i=>{const r=i.s,o=i.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const n=e.s,s=e.d||"error";n==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(n,s)})}unlisten(e,n){const s=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+s+" "+i),p(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(s,i)&&this.connected_&&this.sendUnlisten_(s,i,e._queryObject,n)}sendUnlisten_(e,n,s,i){this.log_("Unlisten on "+e+" for "+n);const r={p:e},o="n";i&&(r.q=s,r.t=i),this.sendRequest(o,r)}onDisconnectPut(e,n,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,n,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:n,onComplete:s})}onDisconnectMerge(e,n,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,n,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:n,onComplete:s})}onDisconnectCancel(e,n){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,n):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:n})}sendOnDisconnect_(e,n,s,i){const r={p:n,d:s};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,o=>{i&&setTimeout(()=>{i(o.s,o.d)},Math.floor(0))})}put(e,n,s,i){this.putInternal("p",e,n,s,i)}merge(e,n,s,i){this.putInternal("m",e,n,s,i)}putInternal(e,n,s,i,r){this.initConnection_();const o={p:n,d:s};r!==void 0&&(o.h=r),this.outstandingPuts_.push({action:e,request:o,onComplete:i}),this.outstandingPutCount_++;const a=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(a):this.log_("Buffering put: "+n)}sendPut_(e){const n=this.outstandingPuts_[e].action,s=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(n,s,r=>{this.log_(n+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),i&&i(r.s,r.d)})}reportStats(e){if(this.connected_){const n={c:e};this.log_("reportStats",n),this.sendRequest("s",n,s=>{if(s.s!=="ok"){const r=s.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+O(e));const n=e.r,s=this.requestCBHash_[n];s&&(delete this.requestCBHash_[n],s(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,n){this.log_("handleServerMessage",e,n),e==="d"?this.onDataUpdate_(n.p,n.d,!1,n.t):e==="m"?this.onDataUpdate_(n.p,n.d,!0,n.t):e==="c"?this.onListenRevoked_(n.p,n.q):e==="ac"?this.onAuthRevoked_(n.s,n.d):e==="apc"?this.onAppCheckRevoked_(n.s,n.d):e==="sd"?this.onSecurityDebugPacket_(n):Hn("Unrecognized action received from server: "+O(e)+`
Are you using the latest client?`)}onReady_(e,n){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=n,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){p(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=tt,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=tt,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>nc&&(this.reconnectDelay_=tt),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let n=Math.max(0,this.reconnectDelay_-e);n=Math.random()*n,this.log_("Trying to reconnect in "+n+"ms"),this.scheduleConnect_(n),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*tc)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),n=this.onReady_.bind(this),s=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+oe.nextConnectionId_++,r=this.lastSessionId;let o=!1,a=null;const l=function(){a?a.close():(o=!0,s())},c=function(u){p(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(u)};this.realtime_={close:l,sendRequest:c};const h=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[u,d]=await Promise.all([this.authTokenProvider_.getToken(h),this.appCheckTokenProvider_.getToken(h)]);o?M("getToken() completed but was canceled"):(M("getToken() completed. Creating connection."),this.authToken_=u&&u.accessToken,this.appCheckToken_=d&&d.token,a=new Kl(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,n,s,f=>{z(f+" ("+this.repoInfo_.toString()+")"),this.interrupt(sc)},r))}catch(u){this.log_("Failed to get token: "+u),o||(this.repoInfo_.nodeAdmin&&z(u),l())}}}interrupt(e){M("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){M("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Us(this.interruptReasons_)&&(this.reconnectDelay_=tt,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const n=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:n})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const n=this.outstandingPuts_[e];n&&"h"in n.request&&n.queued&&(n.onComplete&&n.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,n){let s;n?s=n.map(r=>os(r)).join("$"):s="default";const i=this.removeListen_(e,s);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,n){const s=new C(e).toString();let i;if(this.listens.has(s)){const r=this.listens.get(s);i=r.get(n),r.delete(n),r.size===0&&this.listens.delete(s)}else i=void 0;return i}onAuthRevoked_(e,n){M("Auth token revoked: "+e+"/"+n),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=pi&&(this.reconnectDelay_=fi,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,n){M("App check token revoked: "+e+"/"+n),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=pi&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const n of e.values())this.sendListen_(n);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let n="js";e["sdk."+n+"."+qi.replace(/\./g,"-")]=1,Hi()?e["framework.cordova"]=1:Oo()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=jt.getInstance().currentlyOnline();return Us(this.interruptReasons_)&&e}}oe.nextPersistentConnectionId_=0;oe.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v{constructor(e,n){this.name=e,this.node=n}static Wrap(e,n){return new v(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dn{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,n){const s=new v(Ve,e),i=new v(Ve,n);return this.compare(s,i)!==0}minPost(){return v.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Dt;class br extends dn{static get __EMPTY_NODE(){return Dt}static set __EMPTY_NODE(e){Dt=e}compare(e,n){return Ne(e.name,n.name)}isDefinedOn(e){throw qe("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,n){return!1}minPost(){return v.MIN}maxPost(){return new v(Ae,Dt)}makePost(e,n){return p(typeof e=="string","KeyIndex indexValue must always be a string."),new v(e,Dt)}toString(){return".key"}}const ze=new br;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot{constructor(e,n,s,i,r=null){this.isReverse_=i,this.resultGenerator_=r,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=n?s(e.key,n):1,i&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),n;if(this.resultGenerator_?n=this.resultGenerator_(e.key,e.value):n={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return n}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class ${constructor(e,n,s,i,r){this.key=e,this.value=n,this.color=s??$.RED,this.left=i??W.EMPTY_NODE,this.right=r??W.EMPTY_NODE}copy(e,n,s,i,r){return new $(e??this.key,n??this.value,s??this.color,i??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,s){let i=this;const r=s(e,i.key);return r<0?i=i.copy(null,null,null,i.left.insert(e,n,s),null):r===0?i=i.copy(null,n,null,null,null):i=i.copy(null,null,null,null,i.right.insert(e,n,s)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return W.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,n){let s,i;if(s=this,n(e,s.key)<0)!s.left.isEmpty()&&!s.left.isRed_()&&!s.left.left.isRed_()&&(s=s.moveRedLeft_()),s=s.copy(null,null,null,s.left.remove(e,n),null);else{if(s.left.isRed_()&&(s=s.rotateRight_()),!s.right.isEmpty()&&!s.right.isRed_()&&!s.right.left.isRed_()&&(s=s.moveRedRight_()),n(e,s.key)===0){if(s.right.isEmpty())return W.EMPTY_NODE;i=s.right.min_(),s=s.copy(i.key,i.value,null,null,s.right.removeMin_())}s=s.copy(null,null,null,null,s.right.remove(e,n))}return s.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,$.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,$.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}$.RED=!0;$.BLACK=!1;class ic{copy(e,n,s,i,r){return this}insert(e,n,s){return new $(e,n,null)}remove(e,n){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class W{constructor(e,n=W.EMPTY_NODE){this.comparator_=e,this.root_=n}insert(e,n){return new W(this.comparator_,this.root_.insert(e,n,this.comparator_).copy(null,null,$.BLACK,null,null))}remove(e){return new W(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,$.BLACK,null,null))}get(e){let n,s=this.root_;for(;!s.isEmpty();){if(n=this.comparator_(e,s.key),n===0)return s.value;n<0?s=s.left:n>0&&(s=s.right)}return null}getPredecessorKey(e){let n,s=this.root_,i=null;for(;!s.isEmpty();)if(n=this.comparator_(e,s.key),n===0){if(s.left.isEmpty())return i?i.key:null;for(s=s.left;!s.right.isEmpty();)s=s.right;return s.key}else n<0?s=s.left:n>0&&(i=s,s=s.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new Ot(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,n){return new Ot(this.root_,e,this.comparator_,!1,n)}getReverseIteratorFrom(e,n){return new Ot(this.root_,e,this.comparator_,!0,n)}getReverseIterator(e){return new Ot(this.root_,null,this.comparator_,!0,e)}}W.EMPTY_NODE=new ic;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rc(t,e){return Ne(t.name,e.name)}function fs(t,e){return Ne(t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Wn;function oc(t){Wn=t}const Er=function(t){return typeof t=="number"?"number:"+Xi(t):"string:"+t},wr=function(t){if(t.isLeafNode()){const e=t.val();p(typeof e=="string"||typeof e=="number"||typeof e=="object"&&te(e,".sv"),"Priority must be a string or number.")}else p(t===Wn||t.isEmpty(),"priority of unexpected type.");p(t===Wn||t.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let gi;class L{static set __childrenNodeConstructor(e){gi=e}static get __childrenNodeConstructor(){return gi}constructor(e,n=L.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=n,this.lazyHash_=null,p(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),wr(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new L(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:L.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return b(e)?this:y(e)===".priority"?this.priorityNode_:L.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,n){return null}updateImmediateChild(e,n){return e===".priority"?this.updatePriority(n):n.isEmpty()&&e!==".priority"?this:L.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,n).updatePriority(this.priorityNode_)}updateChild(e,n){const s=y(e);return s===null?n:n.isEmpty()&&s!==".priority"?this:(p(s!==".priority"||ve(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(s,L.__childrenNodeConstructor.EMPTY_NODE.updateChild(k(e),n)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,n){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+Er(this.priorityNode_.val())+":");const n=typeof this.value_;e+=n+":",n==="number"?e+=Xi(this.value_):e+=this.value_,this.lazyHash_=Ji(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===L.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof L.__childrenNodeConstructor?-1:(p(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const n=typeof e.value_,s=typeof this.value_,i=L.VALUE_TYPE_ORDER.indexOf(n),r=L.VALUE_TYPE_ORDER.indexOf(s);return p(i>=0,"Unknown leaf type: "+n),p(r>=0,"Unknown leaf type: "+s),i===r?s==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const n=e;return this.value_===n.value_&&this.priorityNode_.equals(n.priorityNode_)}else return!1}}L.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Cr,Sr;function ac(t){Cr=t}function lc(t){Sr=t}class cc extends dn{compare(e,n){const s=e.node.getPriority(),i=n.node.getPriority(),r=s.compareTo(i);return r===0?Ne(e.name,n.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,n){return!e.getPriority().equals(n.getPriority())}minPost(){return v.MIN}maxPost(){return new v(Ae,new L("[PRIORITY-POST]",Sr))}makePost(e,n){const s=Cr(e);return new v(n,new L("[PRIORITY-POST]",s))}toString(){return".priority"}}const N=new cc;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dc=Math.log(2);class uc{constructor(e){const n=r=>parseInt(Math.log(r)/dc,10),s=r=>parseInt(Array(r+1).join("1"),2);this.count=n(e+1),this.current_=this.count-1;const i=s(this.count);this.bits_=e+1&i}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const Gt=function(t,e,n,s){t.sort(e);const i=function(l,c){const h=c-l;let u,d;if(h===0)return null;if(h===1)return u=t[l],d=n?n(u):u,new $(d,u.node,$.BLACK,null,null);{const f=parseInt(h/2,10)+l,g=i(l,f),w=i(f+1,c);return u=t[f],d=n?n(u):u,new $(d,u.node,$.BLACK,g,w)}},r=function(l){let c=null,h=null,u=t.length;const d=function(g,w){const R=u-g,ne=u;u-=g;const se=i(R+1,ne),we=t[R],En=n?n(we):we;f(new $(En,we.node,w,null,se))},f=function(g){c?(c.left=g,c=g):(h=g,c=g)};for(let g=0;g<l.count;++g){const w=l.nextBitIsOne(),R=Math.pow(2,l.count-(g+1));w?d(R,$.BLACK):(d(R,$.BLACK),d(R,$.RED))}return h},o=new uc(t.length),a=r(o);return new W(s||e,a)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Pn;const Le={};class re{static get Default(){return p(Le&&N,"ChildrenNode.ts has not been loaded"),Pn=Pn||new re({".priority":Le},{".priority":N}),Pn}constructor(e,n){this.indexes_=e,this.indexSet_=n}get(e){const n=Ue(this.indexes_,e);if(!n)throw new Error("No index defined for "+e);return n instanceof W?n:null}hasIndex(e){return te(this.indexSet_,e.toString())}addIndex(e,n){p(e!==ze,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const s=[];let i=!1;const r=n.getIterator(v.Wrap);let o=r.getNext();for(;o;)i=i||e.isDefinedOn(o.node),s.push(o),o=r.getNext();let a;i?a=Gt(s,e.getCompare()):a=Le;const l=e.toString(),c=Object.assign({},this.indexSet_);c[l]=e;const h=Object.assign({},this.indexes_);return h[l]=a,new re(h,c)}addToIndexes(e,n){const s=Ht(this.indexes_,(i,r)=>{const o=Ue(this.indexSet_,r);if(p(o,"Missing index implementation for "+r),i===Le)if(o.isDefinedOn(e.node)){const a=[],l=n.getIterator(v.Wrap);let c=l.getNext();for(;c;)c.name!==e.name&&a.push(c),c=l.getNext();return a.push(e),Gt(a,o.getCompare())}else return Le;else{const a=n.get(e.name);let l=i;return a&&(l=l.remove(new v(e.name,a))),l.insert(e,e.node)}});return new re(s,this.indexSet_)}removeFromIndexes(e,n){const s=Ht(this.indexes_,i=>{if(i===Le)return i;{const r=n.get(e.name);return r?i.remove(new v(e.name,r)):i}});return new re(s,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let nt;class _{static get EMPTY_NODE(){return nt||(nt=new _(new W(fs),null,re.Default))}constructor(e,n,s){this.children_=e,this.priorityNode_=n,this.indexMap_=s,this.lazyHash_=null,this.priorityNode_&&wr(this.priorityNode_),this.children_.isEmpty()&&p(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||nt}updatePriority(e){return this.children_.isEmpty()?this:new _(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const n=this.children_.get(e);return n===null?nt:n}}getChild(e){const n=y(e);return n===null?this:this.getImmediateChild(n).getChild(k(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,n){if(p(n,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(n);{const s=new v(e,n);let i,r;n.isEmpty()?(i=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(s,this.children_)):(i=this.children_.insert(e,n),r=this.indexMap_.addToIndexes(s,this.children_));const o=i.isEmpty()?nt:this.priorityNode_;return new _(i,o,r)}}updateChild(e,n){const s=y(e);if(s===null)return n;{p(y(e)!==".priority"||ve(e)===1,".priority must be the last token in a path");const i=this.getImmediateChild(s).updateChild(k(e),n);return this.updateImmediateChild(s,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const n={};let s=0,i=0,r=!0;if(this.forEachChild(N,(o,a)=>{n[o]=a.val(e),s++,r&&_.INTEGER_REGEXP_.test(o)?i=Math.max(i,Number(o)):r=!1}),!e&&r&&i<2*s){const o=[];for(const a in n)o[a]=n[a];return o}else return e&&!this.getPriority().isEmpty()&&(n[".priority"]=this.getPriority().val()),n}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+Er(this.getPriority().val())+":"),this.forEachChild(N,(n,s)=>{const i=s.hash();i!==""&&(e+=":"+n+":"+i)}),this.lazyHash_=e===""?"":Ji(e)}return this.lazyHash_}getPredecessorChildName(e,n,s){const i=this.resolveIndex_(s);if(i){const r=i.getPredecessorKey(new v(e,n));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const n=this.resolveIndex_(e);if(n){const s=n.minKey();return s&&s.name}else return this.children_.minKey()}getFirstChild(e){const n=this.getFirstChildName(e);return n?new v(n,this.children_.get(n)):null}getLastChildName(e){const n=this.resolveIndex_(e);if(n){const s=n.maxKey();return s&&s.name}else return this.children_.maxKey()}getLastChild(e){const n=this.getLastChildName(e);return n?new v(n,this.children_.get(n)):null}forEachChild(e,n){const s=this.resolveIndex_(e);return s?s.inorderTraversal(i=>n(i.name,i.node)):this.children_.inorderTraversal(n)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,n){const s=this.resolveIndex_(n);if(s)return s.getIteratorFrom(e,i=>i);{const i=this.children_.getIteratorFrom(e.name,v.Wrap);let r=i.peek();for(;r!=null&&n.compare(r,e)<0;)i.getNext(),r=i.peek();return i}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,n){const s=this.resolveIndex_(n);if(s)return s.getReverseIteratorFrom(e,i=>i);{const i=this.children_.getReverseIteratorFrom(e.name,v.Wrap);let r=i.peek();for(;r!=null&&n.compare(r,e)>0;)i.getNext(),r=i.peek();return i}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===Pt?-1:0}withIndex(e){if(e===ze||this.indexMap_.hasIndex(e))return this;{const n=this.indexMap_.addIndex(e,this.children_);return new _(this.children_,this.priorityNode_,n)}}isIndexed(e){return e===ze||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const n=e;if(this.getPriority().equals(n.getPriority()))if(this.children_.count()===n.children_.count()){const s=this.getIterator(N),i=n.getIterator(N);let r=s.getNext(),o=i.getNext();for(;r&&o;){if(r.name!==o.name||!r.node.equals(o.node))return!1;r=s.getNext(),o=i.getNext()}return r===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===ze?null:this.indexMap_.get(e.toString())}}_.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class hc extends _{constructor(){super(new W(fs),_.EMPTY_NODE,re.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return _.EMPTY_NODE}isEmpty(){return!1}}const Pt=new hc;Object.defineProperties(v,{MIN:{value:new v(Ve,_.EMPTY_NODE)},MAX:{value:new v(Ae,Pt)}});br.__EMPTY_NODE=_.EMPTY_NODE;L.__childrenNodeConstructor=_;oc(Pt);lc(Pt);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fc=!0;function D(t,e=null){if(t===null)return _.EMPTY_NODE;if(typeof t=="object"&&".priority"in t&&(e=t[".priority"]),p(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof t=="object"&&".value"in t&&t[".value"]!==null&&(t=t[".value"]),typeof t!="object"||".sv"in t){const n=t;return new L(n,D(e))}if(!(t instanceof Array)&&fc){const n=[];let s=!1;if(F(t,(o,a)=>{if(o.substring(0,1)!=="."){const l=D(a);l.isEmpty()||(s=s||!l.getPriority().isEmpty(),n.push(new v(o,l)))}}),n.length===0)return _.EMPTY_NODE;const r=Gt(n,rc,o=>o.name,fs);if(s){const o=Gt(n,N.getCompare());return new _(r,D(e),new re({".priority":o},{".priority":N}))}else return new _(r,D(e),re.Default)}else{let n=_.EMPTY_NODE;return F(t,(s,i)=>{if(te(t,s)&&s.substring(0,1)!=="."){const r=D(i);(r.isLeafNode()||!r.isEmpty())&&(n=n.updateImmediateChild(s,r))}}),n.updatePriority(D(e))}}ac(D);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pc extends dn{constructor(e){super(),this.indexPath_=e,p(!b(e)&&y(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,n){const s=this.extractChild(e.node),i=this.extractChild(n.node),r=s.compareTo(i);return r===0?Ne(e.name,n.name):r}makePost(e,n){const s=D(e),i=_.EMPTY_NODE.updateChild(this.indexPath_,s);return new v(n,i)}maxPost(){const e=_.EMPTY_NODE.updateChild(this.indexPath_,Pt);return new v(Ae,e)}toString(){return _t(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gc extends dn{compare(e,n){const s=e.node.compareTo(n.node);return s===0?Ne(e.name,n.name):s}isDefinedOn(e){return!0}indexedValueChanged(e,n){return!e.equals(n)}minPost(){return v.MIN}maxPost(){return v.MAX}makePost(e,n){const s=D(e);return new v(n,s)}toString(){return".value"}}const mc=new gc;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ir(t){return{type:"value",snapshotNode:t}}function je(t,e){return{type:"child_added",snapshotNode:e,childName:t}}function yt(t,e){return{type:"child_removed",snapshotNode:e,childName:t}}function vt(t,e,n){return{type:"child_changed",snapshotNode:e,childName:t,oldSnap:n}}function _c(t,e){return{type:"child_moved",snapshotNode:e,childName:t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ps{constructor(e){this.index_=e}updateChild(e,n,s,i,r,o){p(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(n);return a.getChild(i).equals(s.getChild(i))&&a.isEmpty()===s.isEmpty()||(o!=null&&(s.isEmpty()?e.hasChild(n)?o.trackChildChange(yt(n,a)):p(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?o.trackChildChange(je(n,s)):o.trackChildChange(vt(n,s,a))),e.isLeafNode()&&s.isEmpty())?e:e.updateImmediateChild(n,s).withIndex(this.index_)}updateFullNode(e,n,s){return s!=null&&(e.isLeafNode()||e.forEachChild(N,(i,r)=>{n.hasChild(i)||s.trackChildChange(yt(i,r))}),n.isLeafNode()||n.forEachChild(N,(i,r)=>{if(e.hasChild(i)){const o=e.getImmediateChild(i);o.equals(r)||s.trackChildChange(vt(i,r,o))}else s.trackChildChange(je(i,r))})),n.withIndex(this.index_)}updatePriority(e,n){return e.isEmpty()?_.EMPTY_NODE:e.updatePriority(n)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt{constructor(e){this.indexedFilter_=new ps(e.getIndex()),this.index_=e.getIndex(),this.startPost_=bt.getStartPost_(e),this.endPost_=bt.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const n=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,s=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return n&&s}updateChild(e,n,s,i,r,o){return this.matches(new v(n,s))||(s=_.EMPTY_NODE),this.indexedFilter_.updateChild(e,n,s,i,r,o)}updateFullNode(e,n,s){n.isLeafNode()&&(n=_.EMPTY_NODE);let i=n.withIndex(this.index_);i=i.updatePriority(_.EMPTY_NODE);const r=this;return n.forEachChild(N,(o,a)=>{r.matches(new v(o,a))||(i=i.updateImmediateChild(o,_.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,i,s)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const n=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),n)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const n=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),n)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yc{constructor(e){this.withinDirectionalStart=n=>this.reverse_?this.withinEndPost(n):this.withinStartPost(n),this.withinDirectionalEnd=n=>this.reverse_?this.withinStartPost(n):this.withinEndPost(n),this.withinStartPost=n=>{const s=this.index_.compare(this.rangedFilter_.getStartPost(),n);return this.startIsInclusive_?s<=0:s<0},this.withinEndPost=n=>{const s=this.index_.compare(n,this.rangedFilter_.getEndPost());return this.endIsInclusive_?s<=0:s<0},this.rangedFilter_=new bt(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,n,s,i,r,o){return this.rangedFilter_.matches(new v(n,s))||(s=_.EMPTY_NODE),e.getImmediateChild(n).equals(s)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,n,s,i,r,o):this.fullLimitUpdateChild_(e,n,s,r,o)}updateFullNode(e,n,s){let i;if(n.isLeafNode()||n.isEmpty())i=_.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<n.numChildren()&&n.isIndexed(this.index_)){i=_.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=n.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=n.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;r.hasNext()&&o<this.limit_;){const a=r.getNext();if(this.withinDirectionalStart(a))if(this.withinDirectionalEnd(a))i=i.updateImmediateChild(a.name,a.node),o++;else break;else continue}}else{i=n.withIndex(this.index_),i=i.updatePriority(_.EMPTY_NODE);let r;this.reverse_?r=i.getReverseIterator(this.index_):r=i.getIterator(this.index_);let o=0;for(;r.hasNext();){const a=r.getNext();o<this.limit_&&this.withinDirectionalStart(a)&&this.withinDirectionalEnd(a)?o++:i=i.updateImmediateChild(a.name,_.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,s)}updatePriority(e,n){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,n,s,i,r){let o;if(this.reverse_){const u=this.index_.getCompare();o=(d,f)=>u(f,d)}else o=this.index_.getCompare();const a=e;p(a.numChildren()===this.limit_,"");const l=new v(n,s),c=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),h=this.rangedFilter_.matches(l);if(a.hasChild(n)){const u=a.getImmediateChild(n);let d=i.getChildAfterChild(this.index_,c,this.reverse_);for(;d!=null&&(d.name===n||a.hasChild(d.name));)d=i.getChildAfterChild(this.index_,d,this.reverse_);const f=d==null?1:o(d,l);if(h&&!s.isEmpty()&&f>=0)return r!=null&&r.trackChildChange(vt(n,s,u)),a.updateImmediateChild(n,s);{r!=null&&r.trackChildChange(yt(n,u));const w=a.updateImmediateChild(n,_.EMPTY_NODE);return d!=null&&this.rangedFilter_.matches(d)?(r!=null&&r.trackChildChange(je(d.name,d.node)),w.updateImmediateChild(d.name,d.node)):w}}else return s.isEmpty()?e:h&&o(c,l)>=0?(r!=null&&(r.trackChildChange(yt(c.name,c.node)),r.trackChildChange(je(n,s))),a.updateImmediateChild(n,s).updateImmediateChild(c.name,_.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gs{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=N}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return p(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return p(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:Ve}hasEnd(){return this.endSet_}getIndexEndValue(){return p(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return p(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:Ae}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return p(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===N}copy(){const e=new gs;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function vc(t){return t.loadsAllData()?new ps(t.getIndex()):t.hasLimit()?new yc(t):new bt(t)}function mi(t){const e={};if(t.isDefault())return e;let n;if(t.index_===N?n="$priority":t.index_===mc?n="$value":t.index_===ze?n="$key":(p(t.index_ instanceof pc,"Unrecognized index type!"),n=t.index_.toString()),e.orderBy=O(n),t.startSet_){const s=t.startAfterSet_?"startAfter":"startAt";e[s]=O(t.indexStartValue_),t.startNameSet_&&(e[s]+=","+O(t.indexStartName_))}if(t.endSet_){const s=t.endBeforeSet_?"endBefore":"endAt";e[s]=O(t.indexEndValue_),t.endNameSet_&&(e[s]+=","+O(t.indexEndName_))}return t.limitSet_&&(t.isViewFromLeft()?e.limitToFirst=t.limit_:e.limitToLast=t.limit_),e}function _i(t){const e={};if(t.startSet_&&(e.sp=t.indexStartValue_,t.startNameSet_&&(e.sn=t.indexStartName_),e.sin=!t.startAfterSet_),t.endSet_&&(e.ep=t.indexEndValue_,t.endNameSet_&&(e.en=t.indexEndName_),e.ein=!t.endBeforeSet_),t.limitSet_){e.l=t.limit_;let n=t.viewFrom_;n===""&&(t.isViewFromLeft()?n="l":n="r"),e.vf=n}return t.index_!==N&&(e.i=t.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt extends mr{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,n){return n!==void 0?"tag$"+n:(p(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,n,s,i){super(),this.repoInfo_=e,this.onDataUpdate_=n,this.authTokenProvider_=s,this.appCheckTokenProvider_=i,this.log_=At("p:rest:"),this.listens_={}}listen(e,n,s,i){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const o=Yt.getListenId_(e,s),a={};this.listens_[o]=a;const l=mi(e._queryParams);this.restRequest_(r+".json",l,(c,h)=>{let u=h;if(c===404&&(u=null,c=null),c===null&&this.onDataUpdate_(r,u,!1,s),Ue(this.listens_,o)===a){let d;c?c===401?d="permission_denied":d="rest_error:"+c:d="ok",i(d,null)}})}unlisten(e,n){const s=Yt.getListenId_(e,n);delete this.listens_[s]}get(e){const n=mi(e._queryParams),s=e._path.toString(),i=new It;return this.restRequest_(s+".json",n,(r,o)=>{let a=o;r===404&&(a=null,r=null),r===null?(this.onDataUpdate_(s,a,!1,null),i.resolve(a)):i.reject(new Error(a))}),i.promise}refreshAuthToken(e){}restRequest_(e,n={},s){return n.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([i,r])=>{i&&i.accessToken&&(n.auth=i.accessToken),r&&r.token&&(n.ac=r.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+Uo(n);this.log_("Sending REST request for "+o);const a=new XMLHttpRequest;a.onreadystatechange=()=>{if(s&&a.readyState===4){this.log_("REST Response for "+o+" received. status:",a.status,"response:",a.responseText);let l=null;if(a.status>=200&&a.status<300){try{l=ft(a.responseText)}catch{z("Failed to parse JSON response for "+o+": "+a.responseText)}s(null,l)}else a.status!==401&&a.status!==404&&z("Got unsuccessful REST response for "+o+" Status: "+a.status),s(a.status);s=null}},a.open("GET",o,!0),a.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bc{constructor(){this.rootNode_=_.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,n){this.rootNode_=this.rootNode_.updateChild(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kt(){return{value:null,children:new Map}}function Tr(t,e,n){if(b(e))t.value=n,t.children.clear();else if(t.value!==null)t.value=t.value.updateChild(e,n);else{const s=y(e);t.children.has(s)||t.children.set(s,Kt());const i=t.children.get(s);e=k(e),Tr(i,e,n)}}function Un(t,e,n){t.value!==null?n(e,t.value):Ec(t,(s,i)=>{const r=new C(e.toString()+"/"+s);Un(i,r,n)})}function Ec(t,e){t.children.forEach((n,s)=>{e(s,n)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wc{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),n=Object.assign({},e);return this.last_&&F(this.last_,(s,i)=>{n[s]=n[s]-i}),this.last_=e,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yi=10*1e3,Cc=30*1e3,Sc=300*1e3;class Ic{constructor(e,n){this.server_=n,this.statsToReport_={},this.statsListener_=new wc(e);const s=yi+(Cc-yi)*Math.random();ct(this.reportStats_.bind(this),Math.floor(s))}reportStats_(){const e=this.statsListener_.get(),n={};let s=!1;F(e,(i,r)=>{r>0&&te(this.statsToReport_,i)&&(n[i]=r,s=!0)}),s&&this.server_.reportStats(n),ct(this.reportStats_.bind(this),Math.floor(Math.random()*2*Sc))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Q;(function(t){t[t.OVERWRITE=0]="OVERWRITE",t[t.MERGE=1]="MERGE",t[t.ACK_USER_WRITE=2]="ACK_USER_WRITE",t[t.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(Q||(Q={}));function ms(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function _s(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function ys(t){return{fromUser:!1,fromServer:!0,queryId:t,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(e,n,s){this.path=e,this.affectedTree=n,this.revert=s,this.type=Q.ACK_USER_WRITE,this.source=ms()}operationForChild(e){if(b(this.path)){if(this.affectedTree.value!=null)return p(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const n=this.affectedTree.subtree(new C(e));return new qt(E(),n,this.revert)}}else return p(y(this.path)===e,"operationForChild called for unrelated child."),new qt(k(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Et{constructor(e,n){this.source=e,this.path=n,this.type=Q.LISTEN_COMPLETE}operationForChild(e){return b(this.path)?new Et(this.source,E()):new Et(this.source,k(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(e,n,s){this.source=e,this.path=n,this.snap=s,this.type=Q.OVERWRITE}operationForChild(e){return b(this.path)?new Pe(this.source,E(),this.snap.getImmediateChild(e)):new Pe(this.source,k(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ge{constructor(e,n,s){this.source=e,this.path=n,this.children=s,this.type=Q.MERGE}operationForChild(e){if(b(this.path)){const n=this.children.subtree(new C(e));return n.isEmpty()?null:n.value?new Pe(this.source,E(),n.value):new Ge(this.source,E(),n)}else return p(y(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Ge(this.source,k(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(e,n,s){this.node_=e,this.fullyInitialized_=n,this.filtered_=s}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(b(e))return this.isFullyInitialized()&&!this.filtered_;const n=y(e);return this.isCompleteForChild(n)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tc{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function kc(t,e,n,s){const i=[],r=[];return e.forEach(o=>{o.type==="child_changed"&&t.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&r.push(_c(o.childName,o.snapshotNode))}),st(t,i,"child_removed",e,s,n),st(t,i,"child_added",e,s,n),st(t,i,"child_moved",r,s,n),st(t,i,"child_changed",e,s,n),st(t,i,"value",e,s,n),i}function st(t,e,n,s,i,r){const o=s.filter(a=>a.type===n);o.sort((a,l)=>Pc(t,a,l)),o.forEach(a=>{const l=Ac(t,a,r);i.forEach(c=>{c.respondsTo(a.type)&&e.push(c.createEvent(l,t.query_))})})}function Ac(t,e,n){return e.type==="value"||e.type==="child_removed"||(e.prevName=n.getPredecessorChildName(e.childName,e.snapshotNode,t.index_)),e}function Pc(t,e,n){if(e.childName==null||n.childName==null)throw qe("Should only compare child_ events.");const s=new v(e.childName,e.snapshotNode),i=new v(n.childName,n.snapshotNode);return t.index_.compare(s,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function un(t,e){return{eventCache:t,serverCache:e}}function dt(t,e,n,s){return un(new be(e,n,s),t.serverCache)}function kr(t,e,n,s){return un(t.eventCache,new be(e,n,s))}function Qt(t){return t.eventCache.isFullyInitialized()?t.eventCache.getNode():null}function xe(t){return t.serverCache.isFullyInitialized()?t.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let xn;const xc=()=>(xn||(xn=new W(pl)),xn);class I{static fromObject(e){let n=new I(null);return F(e,(s,i)=>{n=n.set(new C(s),i)}),n}constructor(e,n=xc()){this.value=e,this.children=n}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,n){if(this.value!=null&&n(this.value))return{path:E(),value:this.value};if(b(e))return null;{const s=y(e),i=this.children.get(s);if(i!==null){const r=i.findRootMostMatchingPathAndValue(k(e),n);return r!=null?{path:x(new C(s),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(b(e))return this;{const n=y(e),s=this.children.get(n);return s!==null?s.subtree(k(e)):new I(null)}}set(e,n){if(b(e))return new I(n,this.children);{const s=y(e),r=(this.children.get(s)||new I(null)).set(k(e),n),o=this.children.insert(s,r);return new I(this.value,o)}}remove(e){if(b(e))return this.children.isEmpty()?new I(null):new I(null,this.children);{const n=y(e),s=this.children.get(n);if(s){const i=s.remove(k(e));let r;return i.isEmpty()?r=this.children.remove(n):r=this.children.insert(n,i),this.value===null&&r.isEmpty()?new I(null):new I(this.value,r)}else return this}}get(e){if(b(e))return this.value;{const n=y(e),s=this.children.get(n);return s?s.get(k(e)):null}}setTree(e,n){if(b(e))return n;{const s=y(e),r=(this.children.get(s)||new I(null)).setTree(k(e),n);let o;return r.isEmpty()?o=this.children.remove(s):o=this.children.insert(s,r),new I(this.value,o)}}fold(e){return this.fold_(E(),e)}fold_(e,n){const s={};return this.children.inorderTraversal((i,r)=>{s[i]=r.fold_(x(e,i),n)}),n(e,this.value,s)}findOnPath(e,n){return this.findOnPath_(e,E(),n)}findOnPath_(e,n,s){const i=this.value?s(n,this.value):!1;if(i)return i;if(b(e))return null;{const r=y(e),o=this.children.get(r);return o?o.findOnPath_(k(e),x(n,r),s):null}}foreachOnPath(e,n){return this.foreachOnPath_(e,E(),n)}foreachOnPath_(e,n,s){if(b(e))return this;{this.value&&s(n,this.value);const i=y(e),r=this.children.get(i);return r?r.foreachOnPath_(k(e),x(n,i),s):new I(null)}}foreach(e){this.foreach_(E(),e)}foreach_(e,n){this.children.inorderTraversal((s,i)=>{i.foreach_(x(e,s),n)}),this.value&&n(e,this.value)}foreachChild(e){this.children.inorderTraversal((n,s)=>{s.value&&e(n,s.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z{constructor(e){this.writeTree_=e}static empty(){return new Z(new I(null))}}function ut(t,e,n){if(b(e))return new Z(new I(n));{const s=t.writeTree_.findRootMostValueAndPath(e);if(s!=null){const i=s.path;let r=s.value;const o=H(i,e);return r=r.updateChild(o,n),new Z(t.writeTree_.set(i,r))}else{const i=new I(n),r=t.writeTree_.setTree(e,i);return new Z(r)}}}function Vn(t,e,n){let s=t;return F(n,(i,r)=>{s=ut(s,x(e,i),r)}),s}function vi(t,e){if(b(e))return Z.empty();{const n=t.writeTree_.setTree(e,new I(null));return new Z(n)}}function jn(t,e){return Re(t,e)!=null}function Re(t,e){const n=t.writeTree_.findRootMostValueAndPath(e);return n!=null?t.writeTree_.get(n.path).getChild(H(n.path,e)):null}function bi(t){const e=[],n=t.writeTree_.value;return n!=null?n.isLeafNode()||n.forEachChild(N,(s,i)=>{e.push(new v(s,i))}):t.writeTree_.children.inorderTraversal((s,i)=>{i.value!=null&&e.push(new v(s,i.value))}),e}function _e(t,e){if(b(e))return t;{const n=Re(t,e);return n!=null?new Z(new I(n)):new Z(t.writeTree_.subtree(e))}}function Gn(t){return t.writeTree_.isEmpty()}function Ye(t,e){return Ar(E(),t.writeTree_,e)}function Ar(t,e,n){if(e.value!=null)return n.updateChild(t,e.value);{let s=null;return e.children.inorderTraversal((i,r)=>{i===".priority"?(p(r.value!==null,"Priority writes must always be leaf nodes"),s=r.value):n=Ar(x(t,i),r,n)}),!n.getChild(t).isEmpty()&&s!==null&&(n=n.updateChild(x(t,".priority"),s)),n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hn(t,e){return Rr(e,t)}function Nc(t,e,n,s,i){p(s>t.lastWriteId,"Stacking an older write on top of newer ones"),i===void 0&&(i=!0),t.allWrites.push({path:e,snap:n,writeId:s,visible:i}),i&&(t.visibleWrites=ut(t.visibleWrites,e,n)),t.lastWriteId=s}function Rc(t,e,n,s){p(s>t.lastWriteId,"Stacking an older merge on top of newer ones"),t.allWrites.push({path:e,children:n,writeId:s,visible:!0}),t.visibleWrites=Vn(t.visibleWrites,e,n),t.lastWriteId=s}function Dc(t,e){for(let n=0;n<t.allWrites.length;n++){const s=t.allWrites[n];if(s.writeId===e)return s}return null}function Oc(t,e){const n=t.allWrites.findIndex(a=>a.writeId===e);p(n>=0,"removeWrite called with nonexistent writeId.");const s=t.allWrites[n];t.allWrites.splice(n,1);let i=s.visible,r=!1,o=t.allWrites.length-1;for(;i&&o>=0;){const a=t.allWrites[o];a.visible&&(o>=n&&Lc(a,s.path)?i=!1:j(s.path,a.path)&&(r=!0)),o--}if(i){if(r)return $c(t),!0;if(s.snap)t.visibleWrites=vi(t.visibleWrites,s.path);else{const a=s.children;F(a,l=>{t.visibleWrites=vi(t.visibleWrites,x(s.path,l))})}return!0}else return!1}function Lc(t,e){if(t.snap)return j(t.path,e);for(const n in t.children)if(t.children.hasOwnProperty(n)&&j(x(t.path,n),e))return!0;return!1}function $c(t){t.visibleWrites=Pr(t.allWrites,Mc,E()),t.allWrites.length>0?t.lastWriteId=t.allWrites[t.allWrites.length-1].writeId:t.lastWriteId=-1}function Mc(t){return t.visible}function Pr(t,e,n){let s=Z.empty();for(let i=0;i<t.length;++i){const r=t[i];if(e(r)){const o=r.path;let a;if(r.snap)j(n,o)?(a=H(n,o),s=ut(s,a,r.snap)):j(o,n)&&(a=H(o,n),s=ut(s,E(),r.snap.getChild(a)));else if(r.children){if(j(n,o))a=H(n,o),s=Vn(s,a,r.children);else if(j(o,n))if(a=H(o,n),b(a))s=Vn(s,E(),r.children);else{const l=Ue(r.children,y(a));if(l){const c=l.getChild(k(a));s=ut(s,E(),c)}}}else throw qe("WriteRecord should have .snap or .children")}}return s}function xr(t,e,n,s,i){if(!s&&!i){const r=Re(t.visibleWrites,e);if(r!=null)return r;{const o=_e(t.visibleWrites,e);if(Gn(o))return n;if(n==null&&!jn(o,E()))return null;{const a=n||_.EMPTY_NODE;return Ye(o,a)}}}else{const r=_e(t.visibleWrites,e);if(!i&&Gn(r))return n;if(!i&&n==null&&!jn(r,E()))return null;{const o=function(c){return(c.visible||i)&&(!s||!~s.indexOf(c.writeId))&&(j(c.path,e)||j(e,c.path))},a=Pr(t.allWrites,o,e),l=n||_.EMPTY_NODE;return Ye(a,l)}}}function Fc(t,e,n){let s=_.EMPTY_NODE;const i=Re(t.visibleWrites,e);if(i)return i.isLeafNode()||i.forEachChild(N,(r,o)=>{s=s.updateImmediateChild(r,o)}),s;if(n){const r=_e(t.visibleWrites,e);return n.forEachChild(N,(o,a)=>{const l=Ye(_e(r,new C(o)),a);s=s.updateImmediateChild(o,l)}),bi(r).forEach(o=>{s=s.updateImmediateChild(o.name,o.node)}),s}else{const r=_e(t.visibleWrites,e);return bi(r).forEach(o=>{s=s.updateImmediateChild(o.name,o.node)}),s}}function Bc(t,e,n,s,i){p(s||i,"Either existingEventSnap or existingServerSnap must exist");const r=x(e,n);if(jn(t.visibleWrites,r))return null;{const o=_e(t.visibleWrites,r);return Gn(o)?i.getChild(n):Ye(o,i.getChild(n))}}function Hc(t,e,n,s){const i=x(e,n),r=Re(t.visibleWrites,i);if(r!=null)return r;if(s.isCompleteForChild(n)){const o=_e(t.visibleWrites,i);return Ye(o,s.getNode().getImmediateChild(n))}else return null}function zc(t,e){return Re(t.visibleWrites,e)}function Wc(t,e,n,s,i,r,o){let a;const l=_e(t.visibleWrites,e),c=Re(l,E());if(c!=null)a=c;else if(n!=null)a=Ye(l,n);else return[];if(a=a.withIndex(o),!a.isEmpty()&&!a.isLeafNode()){const h=[],u=o.getCompare(),d=r?a.getReverseIteratorFrom(s,o):a.getIteratorFrom(s,o);let f=d.getNext();for(;f&&h.length<i;)u(f,s)!==0&&h.push(f),f=d.getNext();return h}else return[]}function Uc(){return{visibleWrites:Z.empty(),allWrites:[],lastWriteId:-1}}function Jt(t,e,n,s){return xr(t.writeTree,t.treePath,e,n,s)}function vs(t,e){return Fc(t.writeTree,t.treePath,e)}function Ei(t,e,n,s){return Bc(t.writeTree,t.treePath,e,n,s)}function Zt(t,e){return zc(t.writeTree,x(t.treePath,e))}function Vc(t,e,n,s,i,r){return Wc(t.writeTree,t.treePath,e,n,s,i,r)}function bs(t,e,n){return Hc(t.writeTree,t.treePath,e,n)}function Nr(t,e){return Rr(x(t.treePath,e),t.writeTree)}function Rr(t,e){return{treePath:t,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jc{constructor(){this.changeMap=new Map}trackChildChange(e){const n=e.type,s=e.childName;p(n==="child_added"||n==="child_changed"||n==="child_removed","Only child changes supported for tracking"),p(s!==".priority","Only non-priority child changes can be tracked.");const i=this.changeMap.get(s);if(i){const r=i.type;if(n==="child_added"&&r==="child_removed")this.changeMap.set(s,vt(s,e.snapshotNode,i.snapshotNode));else if(n==="child_removed"&&r==="child_added")this.changeMap.delete(s);else if(n==="child_removed"&&r==="child_changed")this.changeMap.set(s,yt(s,i.oldSnap));else if(n==="child_changed"&&r==="child_added")this.changeMap.set(s,je(s,e.snapshotNode));else if(n==="child_changed"&&r==="child_changed")this.changeMap.set(s,vt(s,e.snapshotNode,i.oldSnap));else throw qe("Illegal combination of changes: "+e+" occurred after "+i)}else this.changeMap.set(s,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gc{getCompleteChild(e){return null}getChildAfterChild(e,n,s){return null}}const Dr=new Gc;class Es{constructor(e,n,s=null){this.writes_=e,this.viewCache_=n,this.optCompleteServerCache_=s}getCompleteChild(e){const n=this.viewCache_.eventCache;if(n.isCompleteForChild(e))return n.getNode().getImmediateChild(e);{const s=this.optCompleteServerCache_!=null?new be(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return bs(this.writes_,e,s)}}getChildAfterChild(e,n,s){const i=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:xe(this.viewCache_),r=Vc(this.writes_,i,n,1,s,e);return r.length===0?null:r[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yc(t){return{filter:t}}function Kc(t,e){p(e.eventCache.getNode().isIndexed(t.filter.getIndex()),"Event snap not indexed"),p(e.serverCache.getNode().isIndexed(t.filter.getIndex()),"Server snap not indexed")}function qc(t,e,n,s,i){const r=new jc;let o,a;if(n.type===Q.OVERWRITE){const c=n;c.source.fromUser?o=Yn(t,e,c.path,c.snap,s,i,r):(p(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered()&&!b(c.path),o=Xt(t,e,c.path,c.snap,s,i,a,r))}else if(n.type===Q.MERGE){const c=n;c.source.fromUser?o=Jc(t,e,c.path,c.children,s,i,r):(p(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered(),o=Kn(t,e,c.path,c.children,s,i,a,r))}else if(n.type===Q.ACK_USER_WRITE){const c=n;c.revert?o=ed(t,e,c.path,s,i,r):o=Zc(t,e,c.path,c.affectedTree,s,i,r)}else if(n.type===Q.LISTEN_COMPLETE)o=Xc(t,e,n.path,s,r);else throw qe("Unknown operation type: "+n.type);const l=r.getChanges();return Qc(e,o,l),{viewCache:o,changes:l}}function Qc(t,e,n){const s=e.eventCache;if(s.isFullyInitialized()){const i=s.getNode().isLeafNode()||s.getNode().isEmpty(),r=Qt(t);(n.length>0||!t.eventCache.isFullyInitialized()||i&&!s.getNode().equals(r)||!s.getNode().getPriority().equals(r.getPriority()))&&n.push(Ir(Qt(e)))}}function Or(t,e,n,s,i,r){const o=e.eventCache;if(Zt(s,n)!=null)return e;{let a,l;if(b(n))if(p(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const c=xe(e),h=c instanceof _?c:_.EMPTY_NODE,u=vs(s,h);a=t.filter.updateFullNode(e.eventCache.getNode(),u,r)}else{const c=Jt(s,xe(e));a=t.filter.updateFullNode(e.eventCache.getNode(),c,r)}else{const c=y(n);if(c===".priority"){p(ve(n)===1,"Can't have a priority with additional path components");const h=o.getNode();l=e.serverCache.getNode();const u=Ei(s,n,h,l);u!=null?a=t.filter.updatePriority(h,u):a=o.getNode()}else{const h=k(n);let u;if(o.isCompleteForChild(c)){l=e.serverCache.getNode();const d=Ei(s,n,o.getNode(),l);d!=null?u=o.getNode().getImmediateChild(c).updateChild(h,d):u=o.getNode().getImmediateChild(c)}else u=bs(s,c,e.serverCache);u!=null?a=t.filter.updateChild(o.getNode(),c,u,h,i,r):a=o.getNode()}}return dt(e,a,o.isFullyInitialized()||b(n),t.filter.filtersNodes())}}function Xt(t,e,n,s,i,r,o,a){const l=e.serverCache;let c;const h=o?t.filter:t.filter.getIndexedFilter();if(b(n))c=h.updateFullNode(l.getNode(),s,null);else if(h.filtersNodes()&&!l.isFiltered()){const f=l.getNode().updateChild(n,s);c=h.updateFullNode(l.getNode(),f,null)}else{const f=y(n);if(!l.isCompleteForPath(n)&&ve(n)>1)return e;const g=k(n),R=l.getNode().getImmediateChild(f).updateChild(g,s);f===".priority"?c=h.updatePriority(l.getNode(),R):c=h.updateChild(l.getNode(),f,R,g,Dr,null)}const u=kr(e,c,l.isFullyInitialized()||b(n),h.filtersNodes()),d=new Es(i,u,r);return Or(t,u,n,i,d,a)}function Yn(t,e,n,s,i,r,o){const a=e.eventCache;let l,c;const h=new Es(i,e,r);if(b(n))c=t.filter.updateFullNode(e.eventCache.getNode(),s,o),l=dt(e,c,!0,t.filter.filtersNodes());else{const u=y(n);if(u===".priority")c=t.filter.updatePriority(e.eventCache.getNode(),s),l=dt(e,c,a.isFullyInitialized(),a.isFiltered());else{const d=k(n),f=a.getNode().getImmediateChild(u);let g;if(b(d))g=s;else{const w=h.getCompleteChild(u);w!=null?ds(d)===".priority"&&w.getChild(yr(d)).isEmpty()?g=w:g=w.updateChild(d,s):g=_.EMPTY_NODE}if(f.equals(g))l=e;else{const w=t.filter.updateChild(a.getNode(),u,g,d,h,o);l=dt(e,w,a.isFullyInitialized(),t.filter.filtersNodes())}}}return l}function wi(t,e){return t.eventCache.isCompleteForChild(e)}function Jc(t,e,n,s,i,r,o){let a=e;return s.foreach((l,c)=>{const h=x(n,l);wi(e,y(h))&&(a=Yn(t,a,h,c,i,r,o))}),s.foreach((l,c)=>{const h=x(n,l);wi(e,y(h))||(a=Yn(t,a,h,c,i,r,o))}),a}function Ci(t,e,n){return n.foreach((s,i)=>{e=e.updateChild(s,i)}),e}function Kn(t,e,n,s,i,r,o,a){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let l=e,c;b(n)?c=s:c=new I(null).setTree(n,s);const h=e.serverCache.getNode();return c.children.inorderTraversal((u,d)=>{if(h.hasChild(u)){const f=e.serverCache.getNode().getImmediateChild(u),g=Ci(t,f,d);l=Xt(t,l,new C(u),g,i,r,o,a)}}),c.children.inorderTraversal((u,d)=>{const f=!e.serverCache.isCompleteForChild(u)&&d.value===null;if(!h.hasChild(u)&&!f){const g=e.serverCache.getNode().getImmediateChild(u),w=Ci(t,g,d);l=Xt(t,l,new C(u),w,i,r,o,a)}}),l}function Zc(t,e,n,s,i,r,o){if(Zt(i,n)!=null)return e;const a=e.serverCache.isFiltered(),l=e.serverCache;if(s.value!=null){if(b(n)&&l.isFullyInitialized()||l.isCompleteForPath(n))return Xt(t,e,n,l.getNode().getChild(n),i,r,a,o);if(b(n)){let c=new I(null);return l.getNode().forEachChild(ze,(h,u)=>{c=c.set(new C(h),u)}),Kn(t,e,n,c,i,r,a,o)}else return e}else{let c=new I(null);return s.foreach((h,u)=>{const d=x(n,h);l.isCompleteForPath(d)&&(c=c.set(h,l.getNode().getChild(d)))}),Kn(t,e,n,c,i,r,a,o)}}function Xc(t,e,n,s,i){const r=e.serverCache,o=kr(e,r.getNode(),r.isFullyInitialized()||b(n),r.isFiltered());return Or(t,o,n,s,Dr,i)}function ed(t,e,n,s,i,r){let o;if(Zt(s,n)!=null)return e;{const a=new Es(s,e,i),l=e.eventCache.getNode();let c;if(b(n)||y(n)===".priority"){let h;if(e.serverCache.isFullyInitialized())h=Jt(s,xe(e));else{const u=e.serverCache.getNode();p(u instanceof _,"serverChildren would be complete if leaf node"),h=vs(s,u)}h=h,c=t.filter.updateFullNode(l,h,r)}else{const h=y(n);let u=bs(s,h,e.serverCache);u==null&&e.serverCache.isCompleteForChild(h)&&(u=l.getImmediateChild(h)),u!=null?c=t.filter.updateChild(l,h,u,k(n),a,r):e.eventCache.getNode().hasChild(h)?c=t.filter.updateChild(l,h,_.EMPTY_NODE,k(n),a,r):c=l,c.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=Jt(s,xe(e)),o.isLeafNode()&&(c=t.filter.updateFullNode(c,o,r)))}return o=e.serverCache.isFullyInitialized()||Zt(s,E())!=null,dt(e,c,o,t.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class td{constructor(e,n){this.query_=e,this.eventRegistrations_=[];const s=this.query_._queryParams,i=new ps(s.getIndex()),r=vc(s);this.processor_=Yc(r);const o=n.serverCache,a=n.eventCache,l=i.updateFullNode(_.EMPTY_NODE,o.getNode(),null),c=r.updateFullNode(_.EMPTY_NODE,a.getNode(),null),h=new be(l,o.isFullyInitialized(),i.filtersNodes()),u=new be(c,a.isFullyInitialized(),r.filtersNodes());this.viewCache_=un(u,h),this.eventGenerator_=new Tc(this.query_)}get query(){return this.query_}}function nd(t){return t.viewCache_.serverCache.getNode()}function sd(t){return Qt(t.viewCache_)}function id(t,e){const n=xe(t.viewCache_);return n&&(t.query._queryParams.loadsAllData()||!b(e)&&!n.getImmediateChild(y(e)).isEmpty())?n.getChild(e):null}function Si(t){return t.eventRegistrations_.length===0}function rd(t,e){t.eventRegistrations_.push(e)}function Ii(t,e,n){const s=[];if(n){p(e==null,"A cancel should cancel all event registrations.");const i=t.query._path;t.eventRegistrations_.forEach(r=>{const o=r.createCancelEvent(n,i);o&&s.push(o)})}if(e){let i=[];for(let r=0;r<t.eventRegistrations_.length;++r){const o=t.eventRegistrations_[r];if(!o.matches(e))i.push(o);else if(e.hasAnyCallback()){i=i.concat(t.eventRegistrations_.slice(r+1));break}}t.eventRegistrations_=i}else t.eventRegistrations_=[];return s}function Ti(t,e,n,s){e.type===Q.MERGE&&e.source.queryId!==null&&(p(xe(t.viewCache_),"We should always have a full cache before handling merges"),p(Qt(t.viewCache_),"Missing event cache, even though we have a server cache"));const i=t.viewCache_,r=qc(t.processor_,i,e,n,s);return Kc(t.processor_,r.viewCache),p(r.viewCache.serverCache.isFullyInitialized()||!i.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),t.viewCache_=r.viewCache,Lr(t,r.changes,r.viewCache.eventCache.getNode(),null)}function od(t,e){const n=t.viewCache_.eventCache,s=[];return n.getNode().isLeafNode()||n.getNode().forEachChild(N,(r,o)=>{s.push(je(r,o))}),n.isFullyInitialized()&&s.push(Ir(n.getNode())),Lr(t,s,n.getNode(),e)}function Lr(t,e,n,s){const i=s?[s]:t.eventRegistrations_;return kc(t.eventGenerator_,e,n,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let en;class $r{constructor(){this.views=new Map}}function ad(t){p(!en,"__referenceConstructor has already been defined"),en=t}function ld(){return p(en,"Reference.ts has not been loaded"),en}function cd(t){return t.views.size===0}function ws(t,e,n,s){const i=e.source.queryId;if(i!==null){const r=t.views.get(i);return p(r!=null,"SyncTree gave us an op for an invalid query."),Ti(r,e,n,s)}else{let r=[];for(const o of t.views.values())r=r.concat(Ti(o,e,n,s));return r}}function Mr(t,e,n,s,i){const r=e._queryIdentifier,o=t.views.get(r);if(!o){let a=Jt(n,i?s:null),l=!1;a?l=!0:s instanceof _?(a=vs(n,s),l=!1):(a=_.EMPTY_NODE,l=!1);const c=un(new be(a,l,!1),new be(s,i,!1));return new td(e,c)}return o}function dd(t,e,n,s,i,r){const o=Mr(t,e,s,i,r);return t.views.has(e._queryIdentifier)||t.views.set(e._queryIdentifier,o),rd(o,n),od(o,n)}function ud(t,e,n,s){const i=e._queryIdentifier,r=[];let o=[];const a=Ee(t);if(i==="default")for(const[l,c]of t.views.entries())o=o.concat(Ii(c,n,s)),Si(c)&&(t.views.delete(l),c.query._queryParams.loadsAllData()||r.push(c.query));else{const l=t.views.get(i);l&&(o=o.concat(Ii(l,n,s)),Si(l)&&(t.views.delete(i),l.query._queryParams.loadsAllData()||r.push(l.query)))}return a&&!Ee(t)&&r.push(new(ld())(e._repo,e._path)),{removed:r,events:o}}function Fr(t){const e=[];for(const n of t.views.values())n.query._queryParams.loadsAllData()||e.push(n);return e}function ye(t,e){let n=null;for(const s of t.views.values())n=n||id(s,e);return n}function Br(t,e){if(e._queryParams.loadsAllData())return fn(t);{const s=e._queryIdentifier;return t.views.get(s)}}function Hr(t,e){return Br(t,e)!=null}function Ee(t){return fn(t)!=null}function fn(t){for(const e of t.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tn;function hd(t){p(!tn,"__referenceConstructor has already been defined"),tn=t}function fd(){return p(tn,"Reference.ts has not been loaded"),tn}let pd=1;class ki{constructor(e){this.listenProvider_=e,this.syncPointTree_=new I(null),this.pendingWriteTree_=Uc(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function zr(t,e,n,s,i){return Nc(t.pendingWriteTree_,e,n,s,i),i?Ze(t,new Pe(ms(),e,n)):[]}function gd(t,e,n,s){Rc(t.pendingWriteTree_,e,n,s);const i=I.fromObject(n);return Ze(t,new Ge(ms(),e,i))}function pe(t,e,n=!1){const s=Dc(t.pendingWriteTree_,e);if(Oc(t.pendingWriteTree_,e)){let r=new I(null);return s.snap!=null?r=r.set(E(),!0):F(s.children,o=>{r=r.set(new C(o),!0)}),Ze(t,new qt(s.path,r,n))}else return[]}function xt(t,e,n){return Ze(t,new Pe(_s(),e,n))}function md(t,e,n){const s=I.fromObject(n);return Ze(t,new Ge(_s(),e,s))}function _d(t,e){return Ze(t,new Et(_s(),e))}function yd(t,e,n){const s=Ss(t,n);if(s){const i=Is(s),r=i.path,o=i.queryId,a=H(r,e),l=new Et(ys(o),a);return Ts(t,r,l)}else return[]}function nn(t,e,n,s,i=!1){const r=e._path,o=t.syncPointTree_.get(r);let a=[];if(o&&(e._queryIdentifier==="default"||Hr(o,e))){const l=ud(o,e,n,s);cd(o)&&(t.syncPointTree_=t.syncPointTree_.remove(r));const c=l.removed;if(a=l.events,!i){const h=c.findIndex(d=>d._queryParams.loadsAllData())!==-1,u=t.syncPointTree_.findOnPath(r,(d,f)=>Ee(f));if(h&&!u){const d=t.syncPointTree_.subtree(r);if(!d.isEmpty()){const f=Ed(d);for(let g=0;g<f.length;++g){const w=f[g],R=w.query,ne=jr(t,w);t.listenProvider_.startListening(ht(R),wt(t,R),ne.hashFn,ne.onComplete)}}}!u&&c.length>0&&!s&&(h?t.listenProvider_.stopListening(ht(e),null):c.forEach(d=>{const f=t.queryToTagMap.get(pn(d));t.listenProvider_.stopListening(ht(d),f)}))}wd(t,c)}return a}function Wr(t,e,n,s){const i=Ss(t,s);if(i!=null){const r=Is(i),o=r.path,a=r.queryId,l=H(o,e),c=new Pe(ys(a),l,n);return Ts(t,o,c)}else return[]}function vd(t,e,n,s){const i=Ss(t,s);if(i){const r=Is(i),o=r.path,a=r.queryId,l=H(o,e),c=I.fromObject(n),h=new Ge(ys(a),l,c);return Ts(t,o,h)}else return[]}function qn(t,e,n,s=!1){const i=e._path;let r=null,o=!1;t.syncPointTree_.foreachOnPath(i,(d,f)=>{const g=H(d,i);r=r||ye(f,g),o=o||Ee(f)});let a=t.syncPointTree_.get(i);a?(o=o||Ee(a),r=r||ye(a,E())):(a=new $r,t.syncPointTree_=t.syncPointTree_.set(i,a));let l;r!=null?l=!0:(l=!1,r=_.EMPTY_NODE,t.syncPointTree_.subtree(i).foreachChild((f,g)=>{const w=ye(g,E());w&&(r=r.updateImmediateChild(f,w))}));const c=Hr(a,e);if(!c&&!e._queryParams.loadsAllData()){const d=pn(e);p(!t.queryToTagMap.has(d),"View does not exist, but we have a tag");const f=Cd();t.queryToTagMap.set(d,f),t.tagToQueryMap.set(f,d)}const h=hn(t.pendingWriteTree_,i);let u=dd(a,e,n,h,r,l);if(!c&&!o&&!s){const d=Br(a,e);u=u.concat(Sd(t,e,d))}return u}function Cs(t,e,n){const i=t.pendingWriteTree_,r=t.syncPointTree_.findOnPath(e,(o,a)=>{const l=H(o,e),c=ye(a,l);if(c)return c});return xr(i,e,r,n,!0)}function bd(t,e){const n=e._path;let s=null;t.syncPointTree_.foreachOnPath(n,(c,h)=>{const u=H(c,n);s=s||ye(h,u)});let i=t.syncPointTree_.get(n);i?s=s||ye(i,E()):(i=new $r,t.syncPointTree_=t.syncPointTree_.set(n,i));const r=s!=null,o=r?new be(s,!0,!1):null,a=hn(t.pendingWriteTree_,e._path),l=Mr(i,e,a,r?o.getNode():_.EMPTY_NODE,r);return sd(l)}function Ze(t,e){return Ur(e,t.syncPointTree_,null,hn(t.pendingWriteTree_,E()))}function Ur(t,e,n,s){if(b(t.path))return Vr(t,e,n,s);{const i=e.get(E());n==null&&i!=null&&(n=ye(i,E()));let r=[];const o=y(t.path),a=t.operationForChild(o),l=e.children.get(o);if(l&&a){const c=n?n.getImmediateChild(o):null,h=Nr(s,o);r=r.concat(Ur(a,l,c,h))}return i&&(r=r.concat(ws(i,t,s,n))),r}}function Vr(t,e,n,s){const i=e.get(E());n==null&&i!=null&&(n=ye(i,E()));let r=[];return e.children.inorderTraversal((o,a)=>{const l=n?n.getImmediateChild(o):null,c=Nr(s,o),h=t.operationForChild(o);h&&(r=r.concat(Vr(h,a,l,c)))}),i&&(r=r.concat(ws(i,t,s,n))),r}function jr(t,e){const n=e.query,s=wt(t,n);return{hashFn:()=>(nd(e)||_.EMPTY_NODE).hash(),onComplete:i=>{if(i==="ok")return s?yd(t,n._path,s):_d(t,n._path);{const r=_l(i,n);return nn(t,n,null,r)}}}}function wt(t,e){const n=pn(e);return t.queryToTagMap.get(n)}function pn(t){return t._path.toString()+"$"+t._queryIdentifier}function Ss(t,e){return t.tagToQueryMap.get(e)}function Is(t){const e=t.indexOf("$");return p(e!==-1&&e<t.length-1,"Bad queryKey."),{queryId:t.substr(e+1),path:new C(t.substr(0,e))}}function Ts(t,e,n){const s=t.syncPointTree_.get(e);p(s,"Missing sync point for query tag that we're tracking");const i=hn(t.pendingWriteTree_,e);return ws(s,n,i,null)}function Ed(t){return t.fold((e,n,s)=>{if(n&&Ee(n))return[fn(n)];{let i=[];return n&&(i=Fr(n)),F(s,(r,o)=>{i=i.concat(o)}),i}})}function ht(t){return t._queryParams.loadsAllData()&&!t._queryParams.isDefault()?new(fd())(t._repo,t._path):t}function wd(t,e){for(let n=0;n<e.length;++n){const s=e[n];if(!s._queryParams.loadsAllData()){const i=pn(s),r=t.queryToTagMap.get(i);t.queryToTagMap.delete(i),t.tagToQueryMap.delete(r)}}}function Cd(){return pd++}function Sd(t,e,n){const s=e._path,i=wt(t,e),r=jr(t,n),o=t.listenProvider_.startListening(ht(e),i,r.hashFn,r.onComplete),a=t.syncPointTree_.subtree(s);if(i)p(!Ee(a.value),"If we're adding a query, it shouldn't be shadowed");else{const l=a.fold((c,h,u)=>{if(!b(c)&&h&&Ee(h))return[fn(h).query];{let d=[];return h&&(d=d.concat(Fr(h).map(f=>f.query))),F(u,(f,g)=>{d=d.concat(g)}),d}});for(let c=0;c<l.length;++c){const h=l[c];t.listenProvider_.stopListening(ht(h),wt(t,h))}}return o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ks{constructor(e){this.node_=e}getImmediateChild(e){const n=this.node_.getImmediateChild(e);return new ks(n)}node(){return this.node_}}class As{constructor(e,n){this.syncTree_=e,this.path_=n}getImmediateChild(e){const n=x(this.path_,e);return new As(this.syncTree_,n)}node(){return Cs(this.syncTree_,this.path_)}}const Id=function(t){return t=t||{},t.timestamp=t.timestamp||new Date().getTime(),t},Ai=function(t,e,n){if(!t||typeof t!="object")return t;if(p(".sv"in t,"Unexpected leaf node or priority contents"),typeof t[".sv"]=="string")return Td(t[".sv"],e,n);if(typeof t[".sv"]=="object")return kd(t[".sv"],e);p(!1,"Unexpected server value: "+JSON.stringify(t,null,2))},Td=function(t,e,n){switch(t){case"timestamp":return n.timestamp;default:p(!1,"Unexpected server value: "+t)}},kd=function(t,e,n){t.hasOwnProperty("increment")||p(!1,"Unexpected server value: "+JSON.stringify(t,null,2));const s=t.increment;typeof s!="number"&&p(!1,"Unexpected increment value: "+s);const i=e.node();if(p(i!==null&&typeof i<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!i.isLeafNode())return s;const o=i.getValue();return typeof o!="number"?s:o+s},Gr=function(t,e,n,s){return Ps(e,new As(n,t),s)},Yr=function(t,e,n){return Ps(t,new ks(e),n)};function Ps(t,e,n){const s=t.getPriority().val(),i=Ai(s,e.getImmediateChild(".priority"),n);let r;if(t.isLeafNode()){const o=t,a=Ai(o.getValue(),e,n);return a!==o.getValue()||i!==o.getPriority().val()?new L(a,D(i)):t}else{const o=t;return r=o,i!==o.getPriority().val()&&(r=r.updatePriority(new L(i))),o.forEachChild(N,(a,l)=>{const c=Ps(l,e.getImmediateChild(a),n);c!==l&&(r=r.updateImmediateChild(a,c))}),r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xs{constructor(e="",n=null,s={children:{},childCount:0}){this.name=e,this.parent=n,this.node=s}}function Ns(t,e){let n=e instanceof C?e:new C(e),s=t,i=y(n);for(;i!==null;){const r=Ue(s.node.children,i)||{children:{},childCount:0};s=new xs(i,s,r),n=k(n),i=y(n)}return s}function Xe(t){return t.node.value}function Kr(t,e){t.node.value=e,Qn(t)}function qr(t){return t.node.childCount>0}function Ad(t){return Xe(t)===void 0&&!qr(t)}function gn(t,e){F(t.node.children,(n,s)=>{e(new xs(n,t,s))})}function Qr(t,e,n,s){n&&e(t),gn(t,i=>{Qr(i,e,!0)})}function Pd(t,e,n){let s=t.parent;for(;s!==null;){if(e(s))return!0;s=s.parent}return!1}function Nt(t){return new C(t.parent===null?t.name:Nt(t.parent)+"/"+t.name)}function Qn(t){t.parent!==null&&xd(t.parent,t.name,t)}function xd(t,e,n){const s=Ad(n),i=te(t.node.children,e);s&&i?(delete t.node.children[e],t.node.childCount--,Qn(t)):!s&&!i&&(t.node.children[e]=n.node,t.node.childCount++,Qn(t))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nd=/[\[\].#$\/\u0000-\u001F\u007F]/,Rd=/[\[\].#$\u0000-\u001F\u007F]/,Nn=10*1024*1024,Rs=function(t){return typeof t=="string"&&t.length!==0&&!Nd.test(t)},Jr=function(t){return typeof t=="string"&&t.length!==0&&!Rd.test(t)},Dd=function(t){return t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),Jr(t)},Od=function(t){return t===null||typeof t=="string"||typeof t=="number"&&!rs(t)||t&&typeof t=="object"&&te(t,".sv")},Ld=function(t,e,n,s){mn(ln(t,"value"),e,n)},mn=function(t,e,n){const s=n instanceof C?new Jl(n,t):n;if(e===void 0)throw new Error(t+"contains undefined "+Se(s));if(typeof e=="function")throw new Error(t+"contains a function "+Se(s)+" with contents = "+e.toString());if(rs(e))throw new Error(t+"contains "+e.toString()+" "+Se(s));if(typeof e=="string"&&e.length>Nn/3&&cn(e)>Nn)throw new Error(t+"contains a string greater than "+Nn+" utf8 bytes "+Se(s)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let i=!1,r=!1;if(F(e,(o,a)=>{if(o===".value")i=!0;else if(o!==".priority"&&o!==".sv"&&(r=!0,!Rs(o)))throw new Error(t+" contains an invalid key ("+o+") "+Se(s)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);Zl(s,o),mn(t,a,s),Xl(s)}),i&&r)throw new Error(t+' contains ".value" child '+Se(s)+" in addition to actual children.")}},$d=function(t,e){let n,s;for(n=0;n<e.length;n++){s=e[n];const r=_t(s);for(let o=0;o<r.length;o++)if(!(r[o]===".priority"&&o===r.length-1)){if(!Rs(r[o]))throw new Error(t+"contains an invalid key ("+r[o]+") in path "+s.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(Ql);let i=null;for(n=0;n<e.length;n++){if(s=e[n],i!==null&&j(i,s))throw new Error(t+"contains a path "+i.toString()+" that is ancestor of another path "+s.toString());i=s}},Md=function(t,e,n,s){const i=ln(t,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(i+" must be an object containing the children to replace.");const r=[];F(e,(o,a)=>{const l=new C(o);if(mn(i,a,x(n,l)),ds(l)===".priority"&&!Od(a))throw new Error(i+"contains an invalid value for '"+l.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");r.push(l)}),$d(i,r)},Zr=function(t,e,n,s){if(!Jr(n))throw new Error(ln(t,e)+'was an invalid path = "'+n+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},Fd=function(t,e,n,s){n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),Zr(t,e,n)},Xr=function(t,e){if(y(e)===".info")throw new Error(t+" failed = Can't modify data under /.info/")},Bd=function(t,e){const n=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!Rs(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||n.length!==0&&!Dd(n))throw new Error(ln(t,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hd{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function _n(t,e){let n=null;for(let s=0;s<e.length;s++){const i=e[s],r=i.getPath();n!==null&&!us(r,n.path)&&(t.eventLists_.push(n),n=null),n===null&&(n={events:[],path:r}),n.events.push(i)}n&&t.eventLists_.push(n)}function eo(t,e,n){_n(t,n),to(t,s=>us(s,e))}function G(t,e,n){_n(t,n),to(t,s=>j(s,e)||j(e,s))}function to(t,e){t.recursionDepth_++;let n=!0;for(let s=0;s<t.eventLists_.length;s++){const i=t.eventLists_[s];if(i){const r=i.path;e(r)?(zd(t.eventLists_[s]),t.eventLists_[s]=null):n=!1}}n&&(t.eventLists_=[]),t.recursionDepth_--}function zd(t){for(let e=0;e<t.events.length;e++){const n=t.events[e];if(n!==null){t.events[e]=null;const s=n.getEventRunner();lt&&M("event: "+n.toString()),Je(s)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wd="repo_interrupt",Ud=25;class Vd{constructor(e,n,s,i){this.repoInfo_=e,this.forceRestClient_=n,this.authTokenProvider_=s,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new Hd,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Kt(),this.transactionQueueTree_=new xs,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function jd(t,e,n){if(t.stats_=ls(t.repoInfo_),t.forceRestClient_||El())t.server_=new Yt(t.repoInfo_,(s,i,r,o)=>{Pi(t,s,i,r,o)},t.authTokenProvider_,t.appCheckProvider_),setTimeout(()=>xi(t,!0),0);else{if(typeof n<"u"&&n!==null){if(typeof n!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{O(n)}catch(s){throw new Error("Invalid authOverride provided: "+s)}}t.persistentConnection_=new oe(t.repoInfo_,e,(s,i,r,o)=>{Pi(t,s,i,r,o)},s=>{xi(t,s)},s=>{Yd(t,s)},t.authTokenProvider_,t.appCheckProvider_,n),t.server_=t.persistentConnection_}t.authTokenProvider_.addTokenChangeListener(s=>{t.server_.refreshAuthToken(s)}),t.appCheckProvider_.addTokenChangeListener(s=>{t.server_.refreshAppCheckToken(s.token)}),t.statsReporter_=Tl(t.repoInfo_,()=>new Ic(t.stats_,t.server_)),t.infoData_=new bc,t.infoSyncTree_=new ki({startListening:(s,i,r,o)=>{let a=[];const l=t.infoData_.getNode(s._path);return l.isEmpty()||(a=xt(t.infoSyncTree_,s._path,l),setTimeout(()=>{o("ok")},0)),a},stopListening:()=>{}}),Ds(t,"connected",!1),t.serverSyncTree_=new ki({startListening:(s,i,r,o)=>(t.server_.listen(s,r,i,(a,l)=>{const c=o(a,l);G(t.eventQueue_,s._path,c)}),[]),stopListening:(s,i)=>{t.server_.unlisten(s,i)}})}function Gd(t){const n=t.infoData_.getNode(new C(".info/serverTimeOffset")).val()||0;return new Date().getTime()+n}function yn(t){return Id({timestamp:Gd(t)})}function Pi(t,e,n,s,i){t.dataUpdateCount++;const r=new C(e);n=t.interceptServerDataCallback_?t.interceptServerDataCallback_(e,n):n;let o=[];if(i)if(s){const l=Ht(n,c=>D(c));o=vd(t.serverSyncTree_,r,l,i)}else{const l=D(n);o=Wr(t.serverSyncTree_,r,l,i)}else if(s){const l=Ht(n,c=>D(c));o=md(t.serverSyncTree_,r,l)}else{const l=D(n);o=xt(t.serverSyncTree_,r,l)}let a=r;o.length>0&&(a=Ke(t,r)),G(t.eventQueue_,a,o)}function xi(t,e){Ds(t,"connected",e),e===!1&&Jd(t)}function Yd(t,e){F(e,(n,s)=>{Ds(t,n,s)})}function Ds(t,e,n){const s=new C("/.info/"+e),i=D(n);t.infoData_.updateSnapshot(s,i);const r=xt(t.infoSyncTree_,s,i);G(t.eventQueue_,s,r)}function Os(t){return t.nextWriteId_++}function Kd(t,e,n){const s=bd(t.serverSyncTree_,e);return s!=null?Promise.resolve(s):t.server_.get(e).then(i=>{const r=D(i).withIndex(e._queryParams.getIndex());qn(t.serverSyncTree_,e,n,!0);let o;if(e._queryParams.loadsAllData())o=xt(t.serverSyncTree_,e._path,r);else{const a=wt(t.serverSyncTree_,e);o=Wr(t.serverSyncTree_,e._path,r,a)}return G(t.eventQueue_,e._path,o),nn(t.serverSyncTree_,e,n,null,!0),r},i=>(Rt(t,"get for query "+O(e)+" failed: "+i),Promise.reject(new Error(i))))}function qd(t,e,n,s,i){Rt(t,"set",{path:e.toString(),value:n,priority:s});const r=yn(t),o=D(n,s),a=Cs(t.serverSyncTree_,e),l=Yr(o,a,r),c=Os(t),h=zr(t.serverSyncTree_,e,l,c,!0);_n(t.eventQueue_,h),t.server_.put(e.toString(),o.val(!0),(d,f)=>{const g=d==="ok";g||z("set at "+e+" failed: "+d);const w=pe(t.serverSyncTree_,c,!g);G(t.eventQueue_,e,w),Jn(t,i,d,f)});const u=$s(t,e);Ke(t,u),G(t.eventQueue_,u,[])}function Qd(t,e,n,s){Rt(t,"update",{path:e.toString(),value:n});let i=!0;const r=yn(t),o={};if(F(n,(a,l)=>{i=!1,o[a]=Gr(x(e,a),D(l),t.serverSyncTree_,r)}),i)M("update() called with empty data.  Don't do anything."),Jn(t,s,"ok",void 0);else{const a=Os(t),l=gd(t.serverSyncTree_,e,o,a);_n(t.eventQueue_,l),t.server_.merge(e.toString(),n,(c,h)=>{const u=c==="ok";u||z("update at "+e+" failed: "+c);const d=pe(t.serverSyncTree_,a,!u),f=d.length>0?Ke(t,e):e;G(t.eventQueue_,f,d),Jn(t,s,c,h)}),F(n,c=>{const h=$s(t,x(e,c));Ke(t,h)}),G(t.eventQueue_,e,[])}}function Jd(t){Rt(t,"onDisconnectEvents");const e=yn(t),n=Kt();Un(t.onDisconnect_,E(),(i,r)=>{const o=Gr(i,r,t.serverSyncTree_,e);Tr(n,i,o)});let s=[];Un(n,E(),(i,r)=>{s=s.concat(xt(t.serverSyncTree_,i,r));const o=$s(t,i);Ke(t,o)}),t.onDisconnect_=Kt(),G(t.eventQueue_,E(),s)}function Zd(t,e,n){let s;y(e._path)===".info"?s=qn(t.infoSyncTree_,e,n):s=qn(t.serverSyncTree_,e,n),eo(t.eventQueue_,e._path,s)}function Xd(t,e,n){let s;y(e._path)===".info"?s=nn(t.infoSyncTree_,e,n):s=nn(t.serverSyncTree_,e,n),eo(t.eventQueue_,e._path,s)}function eu(t){t.persistentConnection_&&t.persistentConnection_.interrupt(Wd)}function Rt(t,...e){let n="";t.persistentConnection_&&(n=t.persistentConnection_.id+":"),M(n,...e)}function Jn(t,e,n,s){e&&Je(()=>{if(n==="ok")e(null);else{const i=(n||"error").toUpperCase();let r=i;s&&(r+=": "+s);const o=new Error(r);o.code=i,e(o)}})}function no(t,e,n){return Cs(t.serverSyncTree_,e,n)||_.EMPTY_NODE}function Ls(t,e=t.transactionQueueTree_){if(e||vn(t,e),Xe(e)){const n=io(t,e);p(n.length>0,"Sending zero length transaction queue"),n.every(i=>i.status===0)&&tu(t,Nt(e),n)}else qr(e)&&gn(e,n=>{Ls(t,n)})}function tu(t,e,n){const s=n.map(c=>c.currentWriteId),i=no(t,e,s);let r=i;const o=i.hash();for(let c=0;c<n.length;c++){const h=n[c];p(h.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),h.status=1,h.retryCount++;const u=H(e,h.path);r=r.updateChild(u,h.currentOutputSnapshotRaw)}const a=r.val(!0),l=e;t.server_.put(l.toString(),a,c=>{Rt(t,"transaction put response",{path:l.toString(),status:c});let h=[];if(c==="ok"){const u=[];for(let d=0;d<n.length;d++)n[d].status=2,h=h.concat(pe(t.serverSyncTree_,n[d].currentWriteId)),n[d].onComplete&&u.push(()=>n[d].onComplete(null,!0,n[d].currentOutputSnapshotResolved)),n[d].unwatcher();vn(t,Ns(t.transactionQueueTree_,e)),Ls(t,t.transactionQueueTree_),G(t.eventQueue_,e,h);for(let d=0;d<u.length;d++)Je(u[d])}else{if(c==="datastale")for(let u=0;u<n.length;u++)n[u].status===3?n[u].status=4:n[u].status=0;else{z("transaction at "+l.toString()+" failed: "+c);for(let u=0;u<n.length;u++)n[u].status=4,n[u].abortReason=c}Ke(t,e)}},o)}function Ke(t,e){const n=so(t,e),s=Nt(n),i=io(t,n);return nu(t,i,s),s}function nu(t,e,n){if(e.length===0)return;const s=[];let i=[];const o=e.filter(a=>a.status===0).map(a=>a.currentWriteId);for(let a=0;a<e.length;a++){const l=e[a],c=H(n,l.path);let h=!1,u;if(p(c!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),l.status===4)h=!0,u=l.abortReason,i=i.concat(pe(t.serverSyncTree_,l.currentWriteId,!0));else if(l.status===0)if(l.retryCount>=Ud)h=!0,u="maxretry",i=i.concat(pe(t.serverSyncTree_,l.currentWriteId,!0));else{const d=no(t,l.path,o);l.currentInputSnapshot=d;const f=e[a].update(d.val());if(f!==void 0){mn("transaction failed: Data returned ",f,l.path);let g=D(f);typeof f=="object"&&f!=null&&te(f,".priority")||(g=g.updatePriority(d.getPriority()));const R=l.currentWriteId,ne=yn(t),se=Yr(g,d,ne);l.currentOutputSnapshotRaw=g,l.currentOutputSnapshotResolved=se,l.currentWriteId=Os(t),o.splice(o.indexOf(R),1),i=i.concat(zr(t.serverSyncTree_,l.path,se,l.currentWriteId,l.applyLocally)),i=i.concat(pe(t.serverSyncTree_,R,!0))}else h=!0,u="nodata",i=i.concat(pe(t.serverSyncTree_,l.currentWriteId,!0))}G(t.eventQueue_,n,i),i=[],h&&(e[a].status=2,(function(d){setTimeout(d,Math.floor(0))})(e[a].unwatcher),e[a].onComplete&&(u==="nodata"?s.push(()=>e[a].onComplete(null,!1,e[a].currentInputSnapshot)):s.push(()=>e[a].onComplete(new Error(u),!1,null))))}vn(t,t.transactionQueueTree_);for(let a=0;a<s.length;a++)Je(s[a]);Ls(t,t.transactionQueueTree_)}function so(t,e){let n,s=t.transactionQueueTree_;for(n=y(e);n!==null&&Xe(s)===void 0;)s=Ns(s,n),e=k(e),n=y(e);return s}function io(t,e){const n=[];return ro(t,e,n),n.sort((s,i)=>s.order-i.order),n}function ro(t,e,n){const s=Xe(e);if(s)for(let i=0;i<s.length;i++)n.push(s[i]);gn(e,i=>{ro(t,i,n)})}function vn(t,e){const n=Xe(e);if(n){let s=0;for(let i=0;i<n.length;i++)n[i].status!==2&&(n[s]=n[i],s++);n.length=s,Kr(e,n.length>0?n:void 0)}gn(e,s=>{vn(t,s)})}function $s(t,e){const n=Nt(so(t,e)),s=Ns(t.transactionQueueTree_,e);return Pd(s,i=>{Rn(t,i)}),Rn(t,s),Qr(s,i=>{Rn(t,i)}),n}function Rn(t,e){const n=Xe(e);if(n){const s=[];let i=[],r=-1;for(let o=0;o<n.length;o++)n[o].status===3||(n[o].status===1?(p(r===o-1,"All SENT items should be at beginning of queue."),r=o,n[o].status=3,n[o].abortReason="set"):(p(n[o].status===0,"Unexpected transaction status in abort"),n[o].unwatcher(),i=i.concat(pe(t.serverSyncTree_,n[o].currentWriteId,!0)),n[o].onComplete&&s.push(n[o].onComplete.bind(null,new Error("set"),!1,null))));r===-1?Kr(e,void 0):n.length=r+1,G(t.eventQueue_,Nt(e),i);for(let o=0;o<s.length;o++)Je(s[o])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function su(t){let e="";const n=t.split("/");for(let s=0;s<n.length;s++)if(n[s].length>0){let i=n[s];try{i=decodeURIComponent(i.replace(/\+/g," "))}catch{}e+="/"+i}return e}function iu(t){const e={};t.charAt(0)==="?"&&(t=t.substring(1));for(const n of t.split("&")){if(n.length===0)continue;const s=n.split("=");s.length===2?e[decodeURIComponent(s[0])]=decodeURIComponent(s[1]):z(`Invalid query segment '${n}' in query '${t}'`)}return e}const Ni=function(t,e){const n=ru(t),s=n.namespace;n.domain==="firebase.com"&&ce(n.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!s||s==="undefined")&&n.domain!=="localhost"&&ce("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),n.secure||hl();const i=n.scheme==="ws"||n.scheme==="wss";return{repoInfo:new cr(n.host,n.secure,s,i,e,"",s!==n.subdomain),path:new C(n.pathString)}},ru=function(t){let e="",n="",s="",i="",r="",o=!0,a="https",l=443;if(typeof t=="string"){let c=t.indexOf("//");c>=0&&(a=t.substring(0,c-1),t=t.substring(c+2));let h=t.indexOf("/");h===-1&&(h=t.length);let u=t.indexOf("?");u===-1&&(u=t.length),e=t.substring(0,Math.min(h,u)),h<u&&(i=su(t.substring(h,u)));const d=iu(t.substring(Math.min(t.length,u)));c=e.indexOf(":"),c>=0?(o=a==="https"||a==="wss",l=parseInt(e.substring(c+1),10)):c=e.length;const f=e.slice(0,c);if(f.toLowerCase()==="localhost")n="localhost";else if(f.split(".").length<=2)n=f;else{const g=e.indexOf(".");s=e.substring(0,g).toLowerCase(),n=e.substring(g+1),r=s}"ns"in d&&(r=d.ns)}return{host:e,port:l,domain:n,subdomain:s,secure:o,scheme:a,pathString:i,namespace:r}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ou{constructor(e,n,s,i){this.eventType=e,this.eventRegistration=n,this.snapshot=s,this.prevName=i}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+O(this.snapshot.exportVal())}}class au{constructor(e,n,s){this.eventRegistration=e,this.error=n,this.path=s}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oo{constructor(e,n){this.snapshotCallback=e,this.cancelCallback=n}onValue(e,n){this.snapshotCallback.call(null,e,n)}onCancel(e){return p(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ms{constructor(e,n,s,i){this._repo=e,this._path=n,this._queryParams=s,this._orderByCalled=i}get key(){return b(this._path)?null:ds(this._path)}get ref(){return new ue(this._repo,this._path)}get _queryIdentifier(){const e=_i(this._queryParams),n=os(e);return n==="{}"?"default":n}get _queryObject(){return _i(this._queryParams)}isEqual(e){if(e=Qe(e),!(e instanceof Ms))return!1;const n=this._repo===e._repo,s=us(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return n&&s&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+ql(this._path)}}class ue extends Ms{constructor(e,n){super(e,n,new gs,!1)}get parent(){const e=yr(this._path);return e===null?null:new ue(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class Ct{constructor(e,n,s){this._node=e,this.ref=n,this._index=s}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const n=new C(e),s=Zn(this.ref,e);return new Ct(this._node.getChild(n),s,N)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(s,i)=>e(new Ct(i,Zn(this.ref,s),N)))}hasChild(e){const n=new C(e);return!this._node.getChild(n).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function it(t,e){return t=Qe(t),t._checkNotDeleted("ref"),e!==void 0?Zn(t._root,e):t._root}function Zn(t,e){return t=Qe(t),y(t._path)===null?Fd("child","path",e):Zr("child","path",e),new ue(t._repo,x(t._path,e))}function lu(t){return Xr("remove",t._path),ao(t,null)}function ao(t,e){t=Qe(t),Xr("set",t._path),Ld("set",e,t._path);const n=new It;return qd(t._repo,t._path,e,null,n.wrapCallback(()=>{})),n.promise}function cu(t,e){Md("update",e,t._path);const n=new It;return Qd(t._repo,t._path,e,n.wrapCallback(()=>{})),n.promise}function du(t){t=Qe(t);const e=new oo(()=>{}),n=new bn(e);return Kd(t._repo,t,n).then(s=>new Ct(s,new ue(t._repo,t._path),t._queryParams.getIndex()))}class bn{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,n){const s=n._queryParams.getIndex();return new ou("value",this,new Ct(e.snapshotNode,new ue(n._repo,n._path),s))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,n){return this.callbackContext.hasCancelCallback?new au(this,e,n):null}matches(e){return e instanceof bn?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function uu(t,e,n,s,i){const r=new oo(n,void 0),o=new bn(r);return Zd(t._repo,t,o),()=>Xd(t._repo,t,o)}function hu(t,e,n,s){return uu(t,"value",e)}ad(ue);hd(ue);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fu="FIREBASE_DATABASE_EMULATOR_HOST",Xn={};let pu=!1;function gu(t,e,n,s){const i=e.lastIndexOf(":"),r=e.substring(0,i),o=ss(r);t.repoInfo_=new cr(e,o,t.repoInfo_.namespace,t.repoInfo_.webSocketOnly,t.repoInfo_.nodeAdmin,t.repoInfo_.persistenceKey,t.repoInfo_.includeNamespaceInQueryParams,!0,n),s&&(t.authTokenProvider_=s)}function mu(t,e,n,s,i){let r=s||t.options.databaseURL;r===void 0&&(t.options.projectId||ce("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),M("Using default host for project ",t.options.projectId),r=`${t.options.projectId}-default-rtdb.firebaseio.com`);let o=Ni(r,i),a=o.repoInfo,l;typeof process<"u"&&Xs&&(l=Xs[fu]),l?(r=`http://${l}?ns=${a.namespace}`,o=Ni(r,i),a=o.repoInfo):o.repoInfo.secure;const c=new Cl(t.name,t.options,e);Bd("Invalid Firebase Database URL",o),b(o.path)||ce("Database URL must point to the root of a Firebase Database (not including a child path).");const h=yu(a,t,c,new wl(t,n));return new vu(h,t)}function _u(t,e){const n=Xn[e];(!n||n[t.key]!==t)&&ce(`Database ${e}(${t.repoInfo_}) has already been deleted.`),eu(t),delete n[t.key]}function yu(t,e,n,s){let i=Xn[e.name];i||(i={},Xn[e.name]=i);let r=i[t.toURLString()];return r&&ce("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new Vd(t,pu,n,s),i[t.toURLString()]=r,r}class vu{constructor(e,n){this._repoInternal=e,this.app=n,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(jd(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new ue(this._repo,E())),this._rootInternal}_delete(){return this._rootInternal!==null&&(_u(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&ce("Cannot call "+e+" on a deleted database.")}}function bu(t=Ya(),e){const n=Wa(t,"database").getImmediate({identifier:e});if(!n._instanceStarted){const s=ko("database");s&&Eu(n,...s)}return n}function Eu(t,e,n,s={}){t=Qe(t),t._checkNotDeleted("useEmulator");const i=`${e}:${n}`,r=t._repoInternal;if(t._instanceStarted){if(i===t._repoInternal.repoInfo_.host&&zt(s,r.repoInfo_.emulatorOptions))return;ce("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let o;if(r.repoInfo_.nodeAdmin)s.mockUserToken&&ce('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),o=new Mt(Mt.OWNER);else if(s.mockUserToken){const a=typeof s.mockUserToken=="string"?s.mockUserToken:Po(s.mockUserToken,t.app.options.projectId);o=new Mt(a)}ss(e)&&(Ao(e),Ro("Database",!0)),gu(r,i,s,o)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wu(t){ol(Ga),Ut(new pt("database",(e,{instanceIdentifier:n})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return mu(s,i,r,n)},"PUBLIC").setMultipleInstances(!0)),Be(ei,ti,t),Be(ei,ti,"esm2017")}oe.prototype.simpleListen=function(t,e){this.sendRequest("q",{p:t},e)};oe.prototype.echo=function(t,e){this.sendRequest("echo",{d:t},e)};wu();const lo={apiKey:"AIzaSyBWeOAdamBxbOBpDEy_p2p7ifKrdZZjeFQ",authDomain:"teatime-7dc11.firebaseapp.com",databaseURL:"https://teatime-7dc11-default-rtdb.firebaseio.com",projectId:"teatime-7dc11",storageBucket:"teatime-7dc11.firebasestorage.app",messagingSenderId:"755888765022",appId:"1:755888765022:web:c35385254cc4438b2f9ccf",measurementId:"G-XN6HJ1F689"};let K=null,$e=!1;const Ri=localStorage.getItem("cup_of_tea_firebase_config");let Ft=lo;if(Ri)try{Ft={...lo,...JSON.parse(Ri)}}catch{console.error("Failed to parse saved config")}if(Ft.apiKey&&Ft.databaseURL)try{const t=Gi(Ft);K=bu(t),$e=!0,console.log("Connected to Firebase Realtime Database!")}catch(t){console.warn("Firebase init failed, falling back to local multi-tab sync:",t)}const Lt=new BroadcastChannel("cup_of_tea_local_sync"),fe={},P={set:async(t,e)=>{$e&&K?await ao(it(K,t),e):(fe[t]=JSON.parse(JSON.stringify(e)),localStorage.setItem("cot_store_"+t,JSON.stringify(e)),Lt.postMessage({type:"UPDATE",path:t,data:e}))},remove:async t=>{$e&&K?await lu(it(K,t)):(delete fe[t],localStorage.removeItem("cot_store_"+t),Lt.postMessage({type:"UPDATE",path:t,data:null}))},update:async(t,e)=>{if($e&&K)await cu(it(K,t),e);else{const s={...fe[t]||JSON.parse(localStorage.getItem("cot_store_"+t)||"{}"),...e};fe[t]=s,localStorage.setItem("cot_store_"+t,JSON.stringify(s)),Lt.postMessage({type:"UPDATE",path:t,data:s})}},get:async t=>$e&&K?(await du(it(K,t))).val():fe[t]||JSON.parse(localStorage.getItem("cot_store_"+t)||"null"),listen:(t,e)=>{if($e&&K){const n=it(K,t);hu(n,s=>{e(s.val())})}else{const n=fe[t]||JSON.parse(localStorage.getItem("cot_store_"+t)||"null");e(n),Lt.addEventListener("message",s=>{s.data&&s.data.type==="UPDATE"&&s.data.path===t&&(fe[t]=s.data.data,e(s.data.data))}),window.addEventListener("storage",s=>{if(s.key==="cot_store_"+t){const i=JSON.parse(s.newValue||"null");fe[t]=i,e(i)}})}}};function Cu(){const t="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let e="";for(let n=0;n<4;n++)e+=t.charAt(Math.floor(Math.random()*t.length));return e}async function Su(t){const e=Cu(),n="p_"+Math.random().toString(36).substr(2,9),s={code:e,hostId:n,status:"LOBBY",round:1,players:{[n]:{id:n,name:t,isHost:!0,alive:!0,cupPoisoned:!1,skips:0,poison:1,pill:1,ready:!1,lastDrink:null,decision:null}},swaps:{},roundLogs:[]};return await P.set(`rooms/${e}`,s),{roomCode:e,playerId:n}}async function Iu(t,e){const n=t.trim().toUpperCase(),s=await P.get(`rooms/${n}`);if(!s)throw new Error("Oda bulunamadı! Kodu kontrol edin.");if(s.status!=="LOBBY")throw new Error("Oyun çoktan başlamış!");const i=e.trim();if(Object.values(s.players||{}).map(l=>(l.name||"").trim().toLowerCase()).includes(i.toLowerCase()))throw new Error("DUPLICATE_NAME");const o="p_"+Math.random().toString(36).substr(2,9),a={id:o,name:i,isHost:!1,alive:!0,cupPoisoned:!1,skips:0,poison:1,pill:1,ready:!1,lastDrink:null,decision:null};return await P.set(`rooms/${n}/players/${o}`,a),{roomCode:n,playerId:o}}async function Tu(t,e){await P.remove(`rooms/${t}/players/${e}`)}async function ku(t){const e=await P.get(`rooms/${t}`);if(!e)return;const n=Object.keys(e.players||{});if(n.length<2)throw new Error("En az 2 oyuncu gereklidir!");const s=JSON.parse(JSON.stringify(e.players));for(const i of n)s[i].alive=!0,s[i].cupPoisoned=!1,s[i].skips=0,s[i].poison=1,s[i].pill=1,s[i].ready=!1,s[i].decision=null,s[i].lastDrink=null,s[i].autoPillUsed=!1;await P.update(`rooms/${t}`,{status:"PHASE_1",round:1,swaps:{},roundLogs:[],detailedLogs:[],isDuel:!1,players:s})}async function co(t,e){if(!e||e.status!=="PHASE_1")return;const n=Object.values(e.players||{}).filter(i=>i.alive);n.length>0&&n.every(i=>i.ready&&i.decision)&&await Au(t,e)}async function uo(t,e,n,s){await P.update(`rooms/${t}/players/${e}`,{decision:{drink:n,action:s},ready:!0});const i=await P.get(`rooms/${t}`);i&&await co(t,i)}async function Au(t,e){var o,a,l;if(e.status!=="PHASE_1")return;const n=JSON.parse(JSON.stringify(e.players||{})),s={},i=Object.values(n).filter(c=>c.alive).length===2,r=[...e.detailedLogs||[]];for(const c of Object.values(n)){if(!c.alive||!c.decision)continue;const h=c.decision.action;if(h&&h.type==="POISON"&&c.poison>0&&h.target)n[h.target]&&(n[h.target].cupPoisoned=!0,c.poison-=1,r.push({type:"POISON",round:e.round,actor:c.name,actorId:c.id,target:((o=n[h.target])==null?void 0:o.name)||"?",targetId:h.target}));else if(h&&h.type==="SWAP"&&h.target&&!i){const u=`sw_${c.id}_${h.target}`;s[u]={id:u,from:c.id,fromName:c.name,to:h.target,toName:((a=n[h.target])==null?void 0:a.name)||"",status:"PENDING"},r.push({type:"SWAP_OFFER",round:e.round,actor:c.name,actorId:c.id,target:((l=n[h.target])==null?void 0:l.name)||"?",targetId:h.target})}}for(const c of Object.keys(n))n[c].ready=!1;await P.update(`rooms/${t}`,{status:"PHASE_2",players:n,swaps:s,detailedLogs:r})}async function sn(t,e,n){await P.update(`rooms/${t}/swaps/${e}`,{status:n?"ACCEPTED":"REJECTED"})}async function ho(t,e){if(!e||e.status!=="PHASE_2")return;const n=Object.values(e.players||{}).filter(i=>i.alive);n.length>0&&n.every(i=>i.ready)&&await Fs(t,e)}async function fo(t,e){await P.update(`rooms/${t}/players/${e}`,{ready:!0});const n=await P.get(`rooms/${t}`);n&&await ho(t,n)}async function Fs(t,e){if(e.status!=="PHASE_2")return;const n=JSON.parse(JSON.stringify(e.players||{})),s=e.swaps||{},i=[],r=[...e.detailedLogs||[]],o=new Set;for(const d of Object.values(s))if(d.status==="ACCEPTED")if(!o.has(d.from)&&!o.has(d.to)&&n[d.from]&&n[d.to]){const f=n[d.from].cupPoisoned;n[d.from].cupPoisoned=n[d.to].cupPoisoned,n[d.to].cupPoisoned=f,o.add(d.from),o.add(d.to),r.push({type:"SWAP_ACCEPTED",round:e.round,from:d.fromName,fromId:d.from,to:d.toName,toId:d.to})}else r.push({type:"SWAP_CANCELLED",round:e.round,from:d.fromName,fromId:d.from,to:d.toName,toId:d.to});else d.status==="REJECTED"?r.push({type:"SWAP_REJECTED",round:e.round,from:d.fromName,fromId:d.from,to:d.toName,toId:d.to}):d.status==="PENDING"&&r.push({type:"SWAP_EXPIRED",round:e.round,from:d.fromName,fromId:d.from,to:d.toName,toId:d.to});const a=[],l=[];for(const d of Object.values(n)){if(!d.alive)continue;d.autoPillUsed=!1;const f=d.decision?d.decision.drink:!1;d.lastDrink=f,f?d.cupPoisoned?(l.push(d.id),r.push({type:"DRINK_POISONED",round:e.round,actor:d.name,actorId:d.id})):(d.cupPoisoned=!1,d.poison<1&&(d.poison+=1),r.push({type:"DRINK_CLEAN",round:e.round,actor:d.name,actorId:d.id})):(d.skips+=1,r.push({type:"SKIP",round:e.round,actor:d.name,actorId:d.id}))}for(const d of l){const f=n[d];f.pill>0?(f.pill=0,f.cupPoisoned=!1,(f.poison||0)<1&&(f.poison=1),f.autoPillUsed=!0,i.push({type:"POISONED_PILL",name:f.name}),r.push({type:"POISONED_PILL",round:e.round,actor:f.name,actorId:f.id})):(f.alive=!1,f.autoPillUsed=!1,a.push(f.name),i.push({type:"DEATH",name:f.name}),r.push({type:"DEATH",round:e.round,actor:f.name,actorId:f.id}))}const c=Object.values(n).filter(d=>d.alive);let h="PHASE_3",u=null;c.length===1?(h="GAME_OVER",u=c[0].name,i.push({type:"WINNER",winner:u}),r.push({type:"WINNER",round:e.round,winner:u})):c.length===0&&(h="GAME_OVER",u="BERABERE (HERKES ÖLDÜ!)",i.push({type:"MUTUAL_DEATH"}),r.push({type:"MUTUAL_DEATH",round:e.round}));for(const d of Object.keys(n))n[d].ready=!1;await P.update(`rooms/${t}`,{status:h,players:n,roundLogs:i,detailedLogs:r,poisonedVictims:l,isDuel:c.length===2,winner:u})}async function po(t){const e=await P.get(`rooms/${t}`);if(!e)return;const n=JSON.parse(JSON.stringify(e.players||{})),s=[...e.detailedLogs||[]],i=Object.values(n).filter(r=>r.alive);for(const r of Object.keys(n))n[r].ready=!1,n[r].decision=null,n[r].lastDrink=null,n[r].autoPillUsed=!1;await P.update(`rooms/${t}`,{status:"PHASE_1",round:(e.round||1)+1,swaps:{},players:n,poisonedVictims:[],detailedLogs:s,isDuel:i.length===2})}let rt=null;function Bs(){if(!rt){const t=window.AudioContext||window.webkitAudioContext;rt=new t}return rt.state==="suspended"&&rt.resume(),rt}function Pu(){try{const t=Bs(),e=t.currentTime;[150,220,310,440,580].forEach((s,i)=>{const r=t.createOscillator(),o=t.createGain();r.type=i%2===0?"sine":"triangle",r.frequency.setValueAtTime(s,e);const a=.25/(i+1);o.gain.setValueAtTime(a,e),o.gain.exponentialRampToValueAtTime(1e-4,e+3.5),r.connect(o),o.connect(t.destination),r.start(e),r.stop(e+3.6)}),navigator.vibrate&&navigator.vibrate([400,150,600])}catch(t){console.warn("Audio error:",t)}}function xu(){try{const t=Bs(),e=t.currentTime,n=t.createOscillator(),s=t.createGain();n.type="sawtooth",n.frequency.setValueAtTime(80,e),n.frequency.exponentialRampToValueAtTime(320,e+.5),s.gain.setValueAtTime(.3,e),s.gain.exponentialRampToValueAtTime(.001,e+.6),n.connect(s),s.connect(t.destination),n.start(e),n.stop(e+.65),navigator.vibrate&&navigator.vibrate([100,50,200])}catch(t){console.warn("Audio error:",t)}}function Nu(){try{const t=Bs(),e=t.currentTime,n=t.createOscillator(),s=t.createGain();n.type="sine",n.frequency.setValueAtTime(1200,e),n.frequency.exponentialRampToValueAtTime(2400,e+.05),s.gain.setValueAtTime(.2,e),s.gain.exponentialRampToValueAtTime(.001,e+.4),n.connect(s),s.connect(t.destination),n.start(e),n.stop(e+.45),navigator.vibrate&&navigator.vibrate(50)}catch(t){console.warn("Audio error:",t)}}const rn={teacup:`
    <svg class="teacup-svg" viewBox="0 0 64 64" fill="none" stroke="#241e19" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 24h32v12a16 16 0 0 1-32 0V24z" fill="#f9f7f2" />
      <path d="M44 28h6a6 6 0 0 1 0 12h-6" />
      <path d="M8 48h40" />
      <path d="M22 14c-1 3 1 5 0 8" stroke="#a62b2b" stroke-dasharray="2 2" />
      <path d="M30 12c-1 4 1 6 0 10" stroke="#a62b2b" stroke-dasharray="2 2" />
    </svg>
  `,skull:`
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#691717" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="9" cy="12" r="1.5" fill="#691717" />
      <circle cx="15" cy="12" r="1.5" fill="#691717" />
      <path d="M8 20v2M12 20v2M16 20v2M4 12a8 8 0 0 1 16 0c0 4-3 6-3 8H7c0-2-3-4-3-8z" />
    </svg>
  `,crown:`
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#241e19" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" fill="#d4af37" />
    </svg>
  `};let V={},U=null,Ie="ALL",ke="ALL",We="",ot="timeline";function Ru(t,e){U=null,Ie="ALL",ke="ALL",We="",ot="timeline",t.classList.add("admin-mode"),Du(t,e),P.listen("rooms",n=>{if(V=n||{},!U||!V[U]){const s=Object.keys(V);s.length>0&&(s.sort((i,r)=>{const o=(V[i].detailedLogs||[]).length;return(V[r].detailedLogs||[]).length-o}),U=s[0])}St()})}function go(t){t.classList.remove("admin-mode"),V={},U=null}function Du(t,e){t.innerHTML=`
    <div class="admin-wrapper">
      <!-- Admin Top Navbar -->
      <header class="admin-header">
        <div class="admin-brand">
          <div class="admin-logo">🕵️</div>
          <div>
            <h1 class="admin-title">CUP OF TEA - ADMIN PANEL</h1>
            <p class="admin-subtitle">Oyun Geçmişi, Raund Logları ve Canlı Masa İzleyici</p>
          </div>
        </div>
        <div class="admin-actions">
          <span class="badge-live" title="Firebase RTDB Bağlantısı Aktif">🟢 Canlı Veri</span>
          <button class="btn btn-sm btn-admin-exit" id="btnAdminExit">← Oyuna Dön</button>
        </div>
      </header>

      <!-- Main Admin Grid: Sidebar + Inspector -->
      <div class="admin-grid">
        <!-- Left: Rooms List -->
        <aside class="admin-sidebar" id="adminSidebar">
          <div class="admin-sidebar-header">
            <div class="admin-search-box">
              <span style="font-size:0.9rem;">🔍</span>
              <input type="text" id="adminSearchInput" placeholder="Oda kodu veya oyuncu ara..." value="${We}" />
            </div>
            <div class="admin-filter-chips">
              <button class="chip ${ke==="ALL"?"active":""}" data-filter="ALL">Tümü</button>
              <button class="chip ${ke==="COMPLETED"?"active":""}" data-filter="COMPLETED">Bitmiş</button>
              <button class="chip ${ke==="ACTIVE"?"active":""}" data-filter="ACTIVE">Canlı</button>
            </div>
          </div>
          <div class="admin-rooms-list" id="adminRoomsList">
            <div style="padding:20px; text-align:center; color:var(--text-muted);">Yükleniyor...</div>
          </div>
        </aside>

        <!-- Right: Room Details & Logs -->
        <main class="admin-main" id="adminMainContent">
          <div style="padding:40px; text-align:center; color:var(--text-muted);">
            Lütfen incelemek istediğiniz bir odayı seçin.
          </div>
        </main>
      </div>
    </div>
  `;const n=document.getElementById("btnAdminExit");n&&(n.onclick=()=>{go(t),e&&e()});const s=document.getElementById("adminSearchInput");s&&(s.oninput=r=>{We=r.target.value.trim().toLowerCase(),St()});const i=t.querySelectorAll(".admin-filter-chips .chip");i.forEach(r=>{r.onclick=()=>{ke=r.dataset.filter,i.forEach(o=>o.classList.remove("active")),r.classList.add("active"),St()}})}function St(t,e){Ou(),es()}function Ou(t,e){const n=document.getElementById("adminRoomsList");if(!n)return;const s=Object.keys(V);if(s.length===0){n.innerHTML=`
      <div style="padding:30px; text-align:center; color:var(--text-muted); font-size:0.9rem;">
        Veritabanında kayıtlı oda bulunamadı.
      </div>
    `;return}const i=s.filter(r=>{const o=V[r];if(!o||ke==="COMPLETED"&&o.status!=="GAME_OVER"||ke==="ACTIVE"&&o.status==="GAME_OVER")return!1;if(We){const a=r.toLowerCase().includes(We),c=Object.values(o.players||{}).map(h=>(h.name||"").toLowerCase()).join(" ").includes(We);if(!a&&!c)return!1}return!0});if(i.sort((r,o)=>{const a=(V[r].detailedLogs||[]).length;return(V[o].detailedLogs||[]).length-a}),i.length===0){n.innerHTML=`
      <div style="padding:30px; text-align:center; color:var(--text-muted); font-size:0.85rem;">
        Aramaya uygun oda bulunamadı.
      </div>
    `;return}n.innerHTML=i.map(r=>{const o=V[r],a=r===U,l=Object.values(o.players||{}),c=o.status==="GAME_OVER",h=o.round||1,u=(o.detailedLogs||[]).length;let d="";return c?d=`<span class="room-pill pill-over">🏆 ${o.winner||"Bitti"}</span>`:o.status==="LOBBY"?d='<span class="room-pill pill-lobby">Lobi</span>':d=`<span class="room-pill pill-active">${o.status}</span>`,`
      <div class="admin-room-item ${a?"selected":""}" data-code="${r}">
        <div class="room-item-top">
          <span class="room-code-badge">${r}</span>
          ${d}
        </div>
        <div class="room-item-players">
          👥 ${l.map(f=>`${f.isBot?"🤖":""}${A(f.name)}`).join(", ")||"Oyuncu yok"}
        </div>
        <div class="room-item-meta">
          <span>Raund: <strong>${h}</strong></span>
          <span>Log: <strong>${u}</strong> olay</span>
        </div>
      </div>
    `}).join(""),n.querySelectorAll(".admin-room-item").forEach(r=>{r.onclick=()=>{U=r.dataset.code,Ie="ALL",St()}})}function es(t){const e=document.getElementById("adminMainContent");if(!e)return;if(!U||!V[U]){e.innerHTML=`
      <div class="admin-empty-state">
        <div style="font-size:3rem; margin-bottom:12px;">☕</div>
        <p style="font-size:1.1rem; font-weight:700;">Bir oda seçin</p>
        <p style="font-size:0.85rem; color:var(--text-muted);">Sol listeden geçmiş veya canlı bir oyun seçerek tüm logları inceleyebilirsiniz.</p>
      </div>
    `;return}const n=V[U],s=Object.values(n.players||{}),i=n.detailedLogs||[],r=n.round||1,o=new Set;i.forEach(u=>{u.round&&o.add(u.round)});for(let u=1;u<=r;u++)o.add(u);const a=Array.from(o).sort((u,d)=>u-d),l=Ie==="ALL"?i:i.filter(u=>u.round===Number(Ie));e.innerHTML=`
    <div class="admin-detail-view">
      <!-- Room Hero Card -->
      <div class="admin-room-hero">
        <div class="hero-left">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:6px;">
            <span class="hero-code">${n.code}</span>
            <span class="hero-status ${n.status}">${Hu(n.status)}</span>
            ${n.isDuel?'<span class="hero-duel">⚡ DÜELLO</span>':""}
          </div>
          <div class="hero-meta">
            <span>Kurucu: <strong>${A(Bu(n))}</strong></span>
            <span>•</span>
            <span>Mevcut Raund: <strong>${n.round||1}</strong></span>
            <span>•</span>
            <span>Toplam Oyuncu: <strong>${s.length}</strong></span>
            <span>•</span>
            <span>Toplam Log: <strong>${i.length}</strong></span>
          </div>
        </div>
        <div class="hero-right">
          ${n.status==="GAME_OVER"?`
            <div class="hero-winner-box">
              <span style="font-size:1.4rem;">👑</span>
              <div>
                <div style="font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted);">ŞAMPİYON</div>
                <div style="font-size:1.15rem; font-weight:900; color:var(--btn-espresso);">${A(n.winner||"Belirsiz")}</div>
              </div>
            </div>
          `:`
            <div class="hero-active-box">
              <span style="font-size:1.2rem;">⏱️</span>
              <div>
                <div style="font-size:0.7rem; font-weight:700; color:var(--text-muted);">CANLI DURUM</div>
                <div style="font-size:0.95rem; font-weight:800;">${n.status}</div>
              </div>
            </div>
          `}
          <button class="btn btn-sm btn-delete-room" id="btnDeleteRoom" title="Bu odayı veritabanından kalıcı sil">
            🗑️ Odayı Sil
          </button>
        </div>
      </div>

      <!-- Players Status Overview Cards -->
      <div class="admin-section-card">
        <div class="section-title">
          <span>👥 Masadaki Oyuncular ve Canlı Durumları</span>
          <span style="font-size:0.75rem; font-weight:600; color:var(--text-muted);">${s.length} Oyuncu</span>
        </div>
        <div class="admin-players-grid">
          ${s.map(u=>Lu(u)).join("")}
        </div>
      </div>

      <!-- Log Navigation & View Mode Tabs -->
      <div class="admin-log-controls">
        <div class="admin-round-tabs">
          <button class="round-tab ${Ie==="ALL"?"active":""}" data-round="ALL">
            Tüm Raundlar (${i.length})
          </button>
          ${a.map(u=>`
            <button class="round-tab ${Ie===String(u)?"active":""}" data-round="${u}">
              Raund ${u} (${i.filter(d=>d.round===u).length})
            </button>
          `).join("")}
        </div>

        <div class="admin-view-toggle">
          <button class="toggle-tab ${ot==="timeline"?"active":""}" data-tab="timeline">
            📖 Hikaye Akışı
          </button>
          <button class="toggle-tab ${ot==="raw"?"active":""}" data-tab="raw">
            💻 Ham JSON (${l.length})
          </button>
          <button class="btn btn-sm btn-copy-log" id="btnCopyJson" title="JSON'u Panoya Kopyala">
            📋 Kopyala
          </button>
        </div>
      </div>

      <!-- Main Display: Timeline vs Raw JSON -->
      <div class="admin-log-container">
        ${ot==="timeline"?$u(l):Fu(l)}
      </div>
    </div>
  `,e.querySelectorAll(".admin-round-tabs .round-tab").forEach(u=>{u.onclick=()=>{Ie=u.dataset.round,es()}}),e.querySelectorAll(".admin-view-toggle .toggle-tab").forEach(u=>{u.onclick=()=>{ot=u.dataset.tab,es()}});const c=document.getElementById("btnCopyJson");c&&(c.onclick=()=>{const u=JSON.stringify(l,null,2);navigator.clipboard.writeText(u).then(()=>{c.textContent="✅ Kopyalandı!",setTimeout(()=>{c.textContent="📋 Kopyala"},2e3)}).catch(()=>{alert("Kopyalanamadı!")})});const h=document.getElementById("btnDeleteRoom");h&&(h.onclick=async()=>{confirm(`'${U}' kodlu odayı veritabanından kalıcı olarak silmek istediğinizden emin misiniz?`)&&(await P.remove(`rooms/${U}`),U=null,St())})}function Lu(t){const e=t.alive,n=t.cupPoisoned,s=t.skips||0,i=Math.max(0,2-s);return`
    <div class="admin-player-card ${e?"alive":"dead"}">
      <div class="p-card-header">
        <span class="p-card-name">
          ${t.isBot?"🤖":e?"❤️":"💀"} ${A(t.name)}
          ${t.isHost?'<span class="host-pill">Kurucu</span>':""}
          ${t.isBot?'<span class="host-pill" style="background:#1a73e8;">BOT</span>':""}
        </span>
        <span class="p-card-status-pill ${e?"pill-alive":"pill-dead"}">
          ${e?"Hayatta":"Elendi"}
        </span>
      </div>

      <div class="p-card-body">
        <div class="p-stat-row">
          <span class="p-stat-label">🍵 Fincan Durumu:</span>
          <span class="p-stat-val ${n?"poisoned":"clean"}">
            ${n?"☠️ ZEHİRLİ":"💧 Temiz"}
          </span>
        </div>
        <div class="p-stat-row">
          <span class="p-stat-label">🛑 Pas Hakkı:</span>
          <span class="p-stat-val ${i===0?"exhausted":""}">
            ${s}/2 Kullanıldı (${i} Hak Kaldı)
          </span>
        </div>
        <div class="p-stat-row">
          <span class="p-stat-label">🧪 Zehir Deposu:</span>
          <span class="p-stat-val">${t.poison>0?"1 Doz Hazır":"0 (Boş)"}</span>
        </div>
        <div class="p-stat-row">
          <span class="p-stat-label">💊 Panzehir (Pill):</span>
          <span class="p-stat-val ${t.pill>0?"has-pill":"no-pill"}">
            ${t.pill>0?"1 Doz Mevcut":"0 (Tükendi)"}
          </span>
        </div>
        ${t.decision?`
          <div class="p-decision-box">
            <span style="font-size:0.7rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Son Karar:</span>
            <span style="font-size:0.78rem; font-weight:700; color:var(--btn-espresso);">
              ${t.decision.drink?"🍵 İçti":"🛑 Pas Geçti"} | Hamle: ${t.decision.action?t.decision.action.type:"Yok"}
            </span>
          </div>
        `:""}
      </div>
    </div>
  `}function $u(t,e,n){if(t.length===0)return`
      <div style="padding:40px; text-align:center; color:var(--text-muted); font-size:0.95rem;">
        Bu filtreye ait herhangi bir olay kaydı bulunamadı.
      </div>
    `;const s={};return t.forEach(r=>{const o=r.round||1;s[o]||(s[o]=[]),s[o].push(r)}),`
    <div class="timeline-container">
      ${Object.keys(s).map(Number).sort((r,o)=>r-o).map(r=>{const o=s[r];return Mu(r,o)}).join("")}
    </div>
  `}function Mu(t,e,n){const s=e.filter(a=>a.type==="POISON"||a.type==="SWAP_OFFER"),i=e.filter(a=>a.type.startsWith("SWAP_")&&a.type!=="SWAP_OFFER"),r=e.filter(a=>a.type==="DRINK_CLEAN"||a.type==="DRINK_POISONED"||a.type==="SKIP"||a.type==="POISONED_PILL"),o=e.filter(a=>a.type==="DEATH"||a.type==="WINNER"||a.type==="MUTUAL_DEATH");return`
    <div class="round-timeline-card">
      <div class="round-card-header">
        <span class="round-badge">RAUND ${t}</span>
        <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">${e.length} Olay Kaydedildi</span>
      </div>

      <div class="round-card-body">
        <!-- Faz 1: Gizli Kararlar & Zehirleme -->
        <div class="phase-block">
          <div class="phase-heading">
            <span class="phase-icon">🧪</span>
            <span class="phase-title">1. Faz: Gizli Kararlar & Zehirleme / Hamle</span>
          </div>
          <div class="phase-events">
            ${s.length>0?s.map(a=>$t(a)).join(""):`
              <div class="empty-event-text">Bu fazda doğrudan zehir veya takas teklifi kaydı yok (oyuncular pas geçmiş olabilir).</div>
            `}
          </div>
        </div>

        <!-- Faz 2: Tartışma & Fincan Takasları -->
        <div class="phase-block">
          <div class="phase-heading">
            <span class="phase-icon">🤝</span>
            <span class="phase-title">2. Faz: Tartışma & Fincan Takası Sonuçları</span>
          </div>
          <div class="phase-events">
            ${i.length>0?i.map(a=>$t(a)).join(""):`
              <div class="empty-event-text">Bu raund fincan takası gerçekleşmedi.</div>
            `}
          </div>
        </div>

        <!-- Faz 3: İçme & Hayatta Kalma -->
        <div class="phase-block">
          <div class="phase-heading">
            <span class="phase-icon">🍵</span>
            <span class="phase-title">3. Faz: İçme, Pas & Çözümleme</span>
          </div>
          <div class="phase-events">
            ${r.length>0?r.map(a=>$t(a)).join(""):`
              <div class="empty-event-text">İçme olayı kaydedilmedi.</div>
            `}
          </div>
        </div>

        <!-- Raund Sonu & Elenmeler / Şampiyonluk -->
        ${o.length>0?`
          <div class="phase-block end-phase-block">
            <div class="phase-heading">
              <span class="phase-icon">⚖️</span>
              <span class="phase-title">Raund Sonu & Elenme / Şampiyonluk</span>
            </div>
            <div class="phase-events">
              ${o.map(a=>$t(a)).join("")}
            </div>
          </div>
        `:""}
      </div>
    </div>
  `}function $t(t){let e="🔹",n="",s="badge-default";switch(t.type){case"POISON":e="🧪",s="badge-poison",n=`<strong>${A(t.actor)}</strong>, <strong>${A(t.target)}</strong>'ın fincanına gizlice ZEHİR kattı!`;break;case"SWAP_OFFER":e="🔄",s="badge-swap",n=`<strong>${A(t.actor)}</strong>, <strong>${A(t.target)}</strong>'a fincan takası teklif etti.`;break;case"SWAP_ACCEPTED":e="🤝",s="badge-swap-accepted",n=`<strong>${A(t.to)}</strong>, <strong>${A(t.from)}</strong>'in takas teklifini <strong>KABUL ETTİ</strong> (fincanlar yer değiştirdi).`;break;case"SWAP_REJECTED":e="❌",s="badge-swap-rejected",n=`<strong>${A(t.to)}</strong>, <strong>${A(t.from)}</strong>'in takas teklifini <strong>REDDETTİ</strong>.`;break;case"SWAP_CANCELLED":e="⚠️",s="badge-swap-cancelled",n=`<strong>${A(t.from)}</strong> ile <strong>${A(t.to)}</strong> arasındaki takas <strong>İPTAL EDİLDİ</strong> (çifte takas çakışması).`;break;case"SWAP_EXPIRED":e="⌛",s="badge-swap-expired",n=`<strong>${A(t.from)}</strong>'in <strong>${A(t.to)}</strong>'a teklifi yanıtsız kalarak zaman aşımına uğradı.`;break;case"DRINK_CLEAN":e="☕",s="badge-clean",n=`<strong>${A(t.actor)}</strong> çayını İÇTİ (Temiz çaydı, hayatta kaldı ve +1 zehir kazandı).`;break;case"DRINK_POISONED":e="☠️",s="badge-poisoned-drink",n=`<strong>${A(t.actor)}</strong> çayını İÇTİ (<strong>ÇAY ZEHİRLİYDİ!</strong>)`;break;case"SKIP":e="🛑",s="badge-skip",n=`<strong>${A(t.actor)}</strong> çayını PAS GEÇTİ (İçmedi, fincandaki durum korundu).`;break;case"POISONED_PILL":e="💊",s="badge-pill",n=`<strong>${A(t.actor)}</strong> zehirlendi ama panzehiri (Pill) otomatik devreye girerek HAYATINI KURTARDI (+1 Zehir kazandı)!`;break;case"DEATH":e="💀",s="badge-death",n=`<strong>${A(t.actor)}</strong> zehirli çay sebebiyle <strong>ELENDİ VE ÖLDÜ!</strong>`;break;case"WINNER":e="👑",s="badge-winner",n=`ŞAMPİYON: <strong>${A(t.winner)}</strong> (Tüm rakiplerini alt etti)!`;break;case"MUTUAL_DEATH":e="🍻",s="badge-death",n="ÇİFTE CİNAYET! Masadaki herkes aynı anda zehirlendi!";break;default:n=JSON.stringify(t)}return`
    <div class="event-item ${s}">
      <span class="event-icon">${e}</span>
      <div class="event-desc">${n}</div>
      <span class="event-type-badge">${t.type}</span>
    </div>
  `}function Fu(t){const e=JSON.stringify(t,null,2);return`
    <div class="raw-json-card">
      <pre class="raw-json-code"><code>${A(e)}</code></pre>
    </div>
  `}function Bu(t){return t.players&&t.hostId&&t.players[t.hostId]?t.players[t.hostId].name:"Bilinmiyor"}function Hu(t){switch(t){case"GAME_OVER":return"BİTTİ (GAME OVER)";case"LOBBY":return"LOBİDE";case"PHASE_1":return"1. FAZ (Gizli Kararlar)";case"PHASE_2":return"2. FAZ (Tartışma & Takas)";case"PHASE_3":return"3. FAZ (Sonuçlar)";default:return t||"Bilinmiyor"}}function A(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}const zu=["Bot Watson","Bot Moriarty","Bot Irene","Bot Lestrade","Bot Hudson","Bot Mycroft","Bot Mary","Bot Wiggins","Bot Hopkins","Bot Gregson"],ae=new Set;async function Wu(t){const e=t.trim().toUpperCase(),n=await P.get(`rooms/${e}`);if(!n)throw new Error("Oda bulunamadı!");if(n.status!=="LOBBY")throw new Error("Oyun başladıktan sonra bot eklenemez!");const s=Object.values(n.players||{});if(s.length>=8)throw new Error("Maksimum oyuncu limitine (8) ulaşıldı!");const i=new Set(s.map(l=>(l.name||"").trim().toLowerCase()));let r=zu.find(l=>!i.has(l.toLowerCase()));r||(r=`Bot ${Math.floor(100+Math.random()*900)}`);const o="bot_"+Math.random().toString(36).substr(2,9),a={id:o,name:r,isHost:!1,isBot:!0,alive:!0,cupPoisoned:!1,skips:0,poison:1,pill:1,ready:!1,lastDrink:null,decision:null};return await P.set(`rooms/${e}/players/${o}`,a),{botId:o,botName:r}}function Uu(t,e){if(!e||!e.players)return;const n=Object.values(e.players).filter(s=>s.alive&&s.isBot);if(n.length!==0){if(e.status==="PHASE_1")for(const s of n)(!s.ready||!s.decision)&&Vu(t,s,e.round);else if(e.status==="PHASE_2")for(const s of n){const i=e.swaps||{};for(const r of Object.values(i))r.to===s.id&&r.status==="PENDING"&&ju(t,s,r.id);s.ready||Gu(t,s,e.round)}}}function Vu(t,e,n){const s=`p1_${t}_${e.id}_r${n}`;if(ae.has(s))return;ae.add(s);const i=1e3+Math.floor(Math.random()*1500);setTimeout(async()=>{try{const r=await P.get(`rooms/${t}`);if(!r||r.status!=="PHASE_1"||r.round!==n)return;const o=r.players?r.players[e.id]:null;if(!o||!o.alive||o.ready)return;let a=!0;const l=o.skips||0;l>=2?a=!0:l===1?a=Math.random()<.75:a=Math.random()<.65;const c=Object.values(r.players).filter(u=>u.alive&&u.id!==e.id);let h={type:"PASS"};if(o.poison>0&&c.length>0){const u=Math.random();u<.75?h={type:"POISON",target:c[Math.floor(Math.random()*c.length)].id}:u<.85?h={type:"POISON",target:e.id}:h={type:"PASS"}}else!r.isDuel&&c.length>0&&(Math.random()<.5?h={type:"SWAP",target:c[Math.floor(Math.random()*c.length)].id}:h={type:"PASS"});await uo(t,e.id,a,h)}catch(r){console.warn(`[Bot AI] Phase 1 error for ${e.name}:`,r)}finally{ae.delete(s)}},i)}function ju(t,e,n){const s=`swap_${t}_${e.id}_${n}`;if(ae.has(s))return;ae.add(s);const i=800+Math.floor(Math.random()*1200);setTimeout(async()=>{try{const r=await P.get(`rooms/${t}`);if(!r||r.status!=="PHASE_2")return;const o=r.swaps?r.swaps[n]:null;if(!o||o.status!=="PENDING")return;const a=Math.random()<.6;await sn(t,n,a)}catch(r){console.warn(`[Bot AI] Swap response error for ${e.name}:`,r)}finally{ae.delete(s)}},i)}function Gu(t,e,n){const s=`p2_ready_${t}_${e.id}_r${n}`;if(ae.has(s))return;ae.add(s);const i=1500+Math.floor(Math.random()*1500);setTimeout(async()=>{try{const r=await P.get(`rooms/${t}`);if(!r||r.status!=="PHASE_2"||r.round!==n)return;const o=r.players?r.players[e.id]:null;if(!o||!o.alive||o.ready)return;const a=r.swaps||{};for(const l of Object.values(a))l.to===e.id&&l.status==="PENDING"&&await sn(t,l.id,Math.random()<.6);await fo(t,e.id)}catch(r){console.warn(`[Bot AI] Phase 2 ready error for ${e.name}:`,r)}finally{ae.delete(s)}},i)}const he=document.getElementById("app");let J=localStorage.getItem("cot_lang")||"tr";const Di={tr:{title:"CUP OF TEA",subtitle:"Zehirli Çay Partisi",yourName:"Adın / Lakabın",namePlaceholderHost:"Örn: Arthur",namePlaceholderJoin:"Örn: Victoria",createRoom:"Oda Oluştur",roomCodeLabel:"4 Haneli Oda Kodu",joinRoom:"Odaya Katıl",roomCodeTitle:"Oda Kodu",playersAtTable:t=>`Masada ${t} kişi var`,playersList:"Masadakiler",you:"(Sen)",host:"Kurucu",ready:"Hazır",startGame:t=>`Oyunu Başlat (${t}/2+ Oyuncu)`,waitingHost:"Kurucunun başlatması bekleniyor...",leave:"Ayrıl",round:"RAUND",readyCounter:(t,e)=>`${t}/${e} Hazır`,poison:"Zehir",poisonVal:t=>t>0?"1 Doz":"0",antidote:"Panzehir",antidoteVal:t=>t>0?"Hazır":"Bitti",skipCounter:"Kalan Pas Hakkı",skipCounterVal:t=>`${Math.max(0,2-t)}/2 Hak`,forcedDrinkAlert:"⚠️ 2 Kez Pas Geçtin. Bu El İçmek Zorundasın!",drinkChoiceTitle:"1. Çayından Yudum Alacak mısın?",drinkBtn:t=>`İç ${t===0?"(+1 Zehir)":""}`,skipBtn:"Pas Geç",drinkTipReload:"Temiz çayı içersen cebine yeni bir zehir mermisi gelir.",drinkTipSkip:"Pas geçersen fincanın içindeki çay aynen kalır.",actionTitle:"2. Gizli Hamlen",actPoison:t=>`Zehir Kat ${t<=0?"(Zehirin Yok)":""}`,actSwap:t=>`Takas Teklif Et ${t?"(Finalde Kapalı)":""}`,actPass:"Pas (Hamle Yapma)",targetLabel:"Kimi Hedefliyorsun?",targetPlaceholder:"-- Hedef Oyuncu Seç --",targetSelf:"Kendi Fincanım (Ters Köşe / Truva Atı)",confirmDecision:"Kararımı Onayla",waitingOthers:(t,e)=>`Diğerleri Bekleniyor (${t}/${e})`,discussionTitle:"MASADA TARTIŞMA",discussionHeader:"Blöfler ve Suçlamalar",discussionDesc:"Şimdi konuşma ve masum rolü yapma zamanı. Fincanınızı içtiğinizi iddia edebilir veya birini suçlayabilirsiniz!",swapOfferTitle:"Fincan Takası Teklifi",swapOfferText:t=>`${t} seninle fincanları değişmek istiyor!`,swapOfferSub:"Kabul edersen fincanlarınız sessizce yer değiştirecek.",accept:"Kabul Et",reject:"Reddet",readyBtn:"Kararlarımı Verdim / Hazırım",revealResultsHost:"➡️ Sonuçları Açıkla (Fazı Bitir)",resultsTitle:"RAUND SONUCU",poisonedAlertTitle:"ÇAYIN ZEHİRLİYDİ!",poisonedAlertDesc:"Zehir boğazını yakıyor ama cebinde hayat kurtaran Panzehir var!",usePillBtn:"Panzehir Kullan (Diril!)",eliminatedTitle:"ELENDİN!",fondipDrink:"İçkini FONDİP yap! 🍺",deadDesc:"Artık ölüsün, konuşamazsın. Kenara geçip hayatta kalanları izle.",survivedTitle:"HAYATTASIN!",survivedDescDrink:"Temiz çayını içtin ve hayatta kaldın.",survivedDescSkip:"Bu el çay içmeyerek tehlikeden kaçtın.",roundEvents:"Bu Raund Neler Yaşandı?",noDeathsRound:"🕊️ Bu raund kimse zehirlenmedi. Masa sessizliğini koruyor...",logDeath:t=>`${t} zehirli çayı içti ve elendi!`,logPill:t=>`${t} zehirlendi ve otomatik pill kullandı!`,autoPillTitle:"ZEHİRLENDİN AMA PANZEHİR KURTARDI!",autoPillDesc:"Fincanında zehir vardı! Panzehirin (Pill) otomatik olarak kullanıldı ve hayatta kaldın.",autoPillReloadTip:"☕ Çayını içtiğin için zehir depon da tazelendi (+1 Zehir)!",logWinner:t=>`ŞAMPİYON: ${t}!`,waitingVictimPill:"⚠️ Oyuncunun panzehir kararı bekleniyor...",nextRoundBtn:"Sonraki Raundu Başlat",waitingNextRound:"Kurucunun sonraki raundu başlatması bekleniyor...",gameOverTitle:"ŞAMPİYON BELLİ OLDU!",gameOverMutual:"ÇİFTE CİNAYET!",gameOverMutualDesc:"İki finalist de aynı anda öldü! TÜM MASA FONDİP YAPIYOR!",gameOverWinnerDesc:"Tüm zehirleri ve entrikaları atlatıp hayatta kalan son kişi zafer kadehini kaldırır!",restartBtn:"Yeni Oyun Başlat",duplicateNameError:"Bu isimde bir oyuncu zaten odada var! Lütfen başka bir isim seçin.",kickedFromRoom:"Oda kurucusu tarafından oyundan çıkarıldınız!",kickBtn:"At",spectatorBadge:"İZLEYİCİ",spectatorTitle:"ÖLÜLER MASASI",spectatorSubtitle:"Artık masada konuşamazsın. Kenara geçip hayattakilerin tüm sırlarını canlı izle!",liveTableTitle:"Canlı Masa Durumu (Gizli İstihbarat)",fullLogTitle:"Tüm Detaylarıyla Oyun Günlüğü",cupCleanLabel:"Temiz Çay",cupPoisonLabel:"ZEHİRLİ!",detailPoison:(t,e)=>`🧪 <strong>${t}</strong>, <strong>${e}</strong>'ın fincanına gizlice zehir kattı!`,detailSwapOffer:(t,e)=>`🔄 <strong>${t}</strong>, <strong>${e}</strong>'a fincan takası teklif etti.`,detailSwapAccepted:(t,e)=>`🤝 <strong>${e}</strong>, <strong>${t}</strong>'in takasını KABUL ETTİ (fincanlar değişti).`,detailSwapRejected:(t,e)=>`❌ <strong>${e}</strong>, <strong>${t}</strong>'in takasını REDDETTİ.`,detailDrinkClean:t=>`☕ <strong>${t}</strong> çayını İÇTİ (Temizdi, hayatta kaldı).`,detailDrinkPoison:t=>`☠️ <strong>${t}</strong> çayını İÇTİ (ÇAY ZEHİRLİYDİ!).`,detailSkip:t=>`🛑 <strong>${t}</strong> çayını PAS GEÇTİ (İçmedi).`,detailDeath:t=>`💀 <strong>${t}</strong> zehirlendi ve elendi!`,detailPill:t=>`💊 <strong>${t}</strong> zehirlendi ve otomatik pill kullandı!`,detailWinner:t=>`👑 ŞAMPİYON: <strong>${t}</strong>!`,detailMutual:"🍻 Herkes aynı anda öldü! TÜM MASA FONDİP YAPIYOR!",waitingForAlive:"Masadakiler gizli kararlarını veriyor...",personalLogTitle:"SENİN HAMLE GEÇMİŞİN",onlyVisibleToYou:"Sadece Sen Görürsün",personalLogEmpty:"Henüz bir hamle yapmadın.",myLogPoison:(t,e)=>`🧪 <strong>${t}</strong>${e}'ın fincanına gizlice zehir kattın.`,myLogSwapOffer:(t,e)=>`🔄 <strong>${t}</strong>${e}'a fincan takası teklif ettin.`,myLogSwapAcceptedForMe:(t,e)=>`🤝 <strong>${t}</strong>${e} takas teklifini KABUL ETTİ (fincanlarınız değişti)!`,myLogSwapAcceptedByMe:(t,e)=>`🤝 <strong>${t}</strong>${e}'in takas teklifini KABUL ETTİN (fincanlarınız değişti)!`,myLogSwapRejectedForMe:(t,e)=>`❌ <strong>${t}</strong>${e} takas teklifini REDDETTİ.`,myLogSwapRejectedByMe:(t,e)=>`❌ <strong>${t}</strong>${e}'in takas teklifini REDDETTİN.`,myLogDrinkClean:t=>`☕ <strong>${t}</strong>Çayını içtin (Temizdi, hayatta kaldın).`,myLogDrinkPoison:t=>`☠️ <strong>${t}</strong>Çayını içtin (ÇAY ZEHİRLİYDİ!).`,myLogSkip:t=>`🛑 <strong>${t}</strong>Çayını pas geçtin.`,myLogPill:t=>`💊 <strong>${t}</strong>Zehirlendin ama panzehirin (Pill) otomatik seni kurtardı (+1 Zehir kazandın)!`,myLogDeath:t=>`💀 <strong>${t}</strong>Zehirlendin ve elendin!`,swapOfferPending:t=>`${t}'a takas teklif ettin. Yanıtı bekleniyor...`,swapAcceptedForYou:t=>`${t} fincan takası teklifini KABUL ETTİ (Fincanlar değişti)!`,swapRejectedForYou:t=>`${t} fincan takası teklifini REDDETTİ.`,swapAcceptedByYou:t=>`${t} ile fincan takasını KABUL ETTİN (Fincanlar değişti).`,swapRejectedByYou:t=>`${t}'in fincan takası teklifini REDDETTİN.`,swapCancelled:"Takas iptal edildi (bu el zaten başka bir takas yapıldı).",swapExpired:t=>`${t} süre bitene kadar takas teklifine yanıt vermedi (iptal oldu).`,adminPanel:"🛠️ Yönetici Paneli (Oyun Logları)",addBot:"+ Bot Ekle (Yapay Zeka)"},en:{title:"CUP OF TEA",subtitle:"Poisonous Tea Party",yourName:"Your Name / Nickname",namePlaceholderHost:"e.g. Arthur",namePlaceholderJoin:"e.g. Victoria",createRoom:"Create Room",roomCodeLabel:"4-Letter Room Code",joinRoom:"Join Room",roomCodeTitle:"Room Code",playersAtTable:t=>`${t} players at table`,playersList:"At The Table",you:"(You)",host:"Host",ready:"Ready",startGame:t=>`Start Game (${t}/2+ Players)`,waitingHost:"Waiting for host to start...",leave:"Leave",round:"ROUND",readyCounter:(t,e)=>`${t}/${e} Ready`,poison:"Poison",poisonVal:t=>t>0?"1 Dose":"0",antidote:"Antidote",antidoteVal:t=>t>0?"Ready":"Spent",skipCounter:"Skips Left",skipCounterVal:t=>`${Math.max(0,2-t)}/2 Left`,forcedDrinkAlert:"⚠️ 2 Consecutive Skips. You MUST drink this turn!",drinkChoiceTitle:"1. Will you take a sip?",drinkBtn:t=>`Drink ${t===0?"(+1 Poison)":""}`,skipBtn:"Skip (Pass)",drinkTipReload:"Drinking clean tea reloads a fresh poison dose.",drinkTipSkip:"Skipping keeps your current suspicious cup.",actionTitle:"2. Your Secret Action",actPoison:t=>`Poison Cup ${t<=0?"(No Poison)":""}`,actSwap:t=>`Offer Swap ${t?"(Locked in Duel)":""}`,actPass:"Pass (Do Nothing)",targetLabel:"Who is your target?",targetPlaceholder:"-- Select Target --",targetSelf:"My Own Cup (Trojan Horse Gambit)",confirmDecision:"Confirm Decision",waitingOthers:(t,e)=>`Waiting for Others (${t}/${e})`,discussionTitle:"PARLOR DISCUSSION",discussionHeader:"Bluffs & Accusations",discussionDesc:"Time to talk, accuse, and pretend to be innocent. Claim you drank your tea or blame someone else!",swapOfferTitle:"Cup Swap Offer",swapOfferText:t=>`${t} wants to swap tea cups with you!`,swapOfferSub:"If accepted, your cups will silently exchange.",accept:"Accept",reject:"Decline",readyBtn:"I Am Ready",revealResultsHost:"➡️ Reveal Results (End Phase)",resultsTitle:"ROUND RESULTS",poisonedAlertTitle:"YOUR TEA WAS POISONED!",poisonedAlertDesc:"Your throat burns! But you carry a lifesaving Antidote!",usePillBtn:"Use Antidote (Revive!)",eliminatedTitle:"ELIMINATED!",fondipDrink:"CHUG your drink! 🍺",deadDesc:"You are dead and silenced. Sit back and watch the survivors.",survivedTitle:"YOU SURVIVED!",survivedDescDrink:"You drank clean tea and survived safely.",survivedDescSkip:"You skipped drinking and dodged danger this round.",roundEvents:"What Happened This Round?",noDeathsRound:"🕊️ Nobody was poisoned this round. The parlor remains silent...",logDeath:t=>`${t} drank poisoned tea and was eliminated!`,logPill:t=>`${t} was poisoned and automatically used a pill!`,autoPillTitle:"POISONED BUT SAVED BY ANTIDOTE!",autoPillDesc:"There was poison in your cup! Your antidote (pill) was automatically used and you survived.",autoPillReloadTip:"☕ Because you drank your tea, your poison token was reloaded (+1 Poison)!",logWinner:t=>`CHAMPION: ${t}!`,waitingVictimPill:"⚠️ Waiting for player's antidote decision...",nextRoundBtn:"Start Next Round",waitingNextRound:"Waiting for host to start next round...",gameOverTitle:"A CHAMPION EMERGES!",gameOverMutual:"MUTUAL MURDER!",gameOverMutualDesc:"Both finalists died simultaneously! THE ENTIRE TABLE CHUGS!",gameOverWinnerDesc:"Surviving all poisons and conspiracies, the victor raises the final glass!",restartBtn:"Start New Game",duplicateNameError:"A player with this name already exists in the room! Please choose another name.",kickedFromRoom:"You were kicked from the room by the host!",kickBtn:"Kick",spectatorBadge:"SPECTATOR",spectatorTitle:"PARLOR OF THE DEAD",spectatorSubtitle:"You are silenced and eliminated. Sit back and watch all secret moves unfold live!",liveTableTitle:"Live Table Intel (Classified)",fullLogTitle:"Detailed Game Log",cupCleanLabel:"Clean Tea",cupPoisonLabel:"POISONED!",detailPoison:(t,e)=>`🧪 <strong>${t}</strong> secretly poisoned <strong>${e}</strong>'s cup!`,detailSwapOffer:(t,e)=>`🔄 <strong>${t}</strong> offered a cup swap to <strong>${e}</strong>.`,detailSwapAccepted:(t,e)=>`🤝 <strong>${e}</strong> ACCEPTED <strong>${t}</strong>'s swap (cups exchanged).`,detailSwapRejected:(t,e)=>`❌ <strong>${e}</strong> DECLINED <strong>${t}</strong>'s swap.`,detailDrinkClean:t=>`☕ <strong>${t}</strong> DRANK their tea (Clean, survived).`,detailDrinkPoison:t=>`☠️ <strong>${t}</strong> DRANK their tea (WAS POISONED!).`,detailSkip:t=>`🛑 <strong>${t}</strong> SKIPPED drinking (Passed).`,detailDeath:t=>`💀 <strong>${t}</strong> was poisoned and eliminated!`,detailPill:t=>`💊 <strong>${t}</strong> was poisoned and automatically used a pill!`,detailWinner:t=>`👑 CHAMPION: <strong>${t}</strong>!`,detailMutual:"🍻 Mutual murder! THE ENTIRE TABLE CHUGS!",waitingForAlive:"Players at the table are making secret decisions...",personalLogTitle:"YOUR MOVE HISTORY",onlyVisibleToYou:"Only Visible To You",personalLogEmpty:"You haven't made any moves yet.",myLogPoison:(t,e)=>`🧪 <strong>${t}</strong>You secretly poisoned ${e}'s cup.`,myLogSwapOffer:(t,e)=>`🔄 <strong>${t}</strong>You offered a cup swap to ${e}.`,myLogSwapAcceptedForMe:(t,e)=>`🤝 <strong>${t}</strong>${e} ACCEPTED your swap offer (cups exchanged)!`,myLogSwapAcceptedByMe:(t,e)=>`🤝 <strong>${t}</strong>You ACCEPTED ${e}'s swap offer (cups exchanged)!`,myLogSwapRejectedForMe:(t,e)=>`❌ <strong>${t}</strong>${e} DECLINED your swap offer.`,myLogSwapRejectedByMe:(t,e)=>`❌ <strong>${t}</strong>You DECLINED ${e}'s swap offer.`,myLogDrinkClean:t=>`☕ <strong>${t}</strong>You drank your tea (Clean, survived).`,myLogDrinkPoison:t=>`☠️ <strong>${t}</strong>You drank your tea (WAS POISONED!).`,myLogSkip:t=>`🛑 <strong>${t}</strong>You skipped drinking (Passed).`,myLogPill:t=>`💊 <strong>${t}</strong>You were poisoned but your antidote saved you (+1 Poison reloaded)!`,myLogDeath:t=>`💀 <strong>${t}</strong>You were poisoned and eliminated!`,swapOfferPending:t=>`You offered a swap to ${t}. Waiting for response...`,swapAcceptedForYou:t=>`${t} ACCEPTED your swap offer (Cups exchanged)!`,swapRejectedForYou:t=>`${t} DECLINED your swap offer.`,swapAcceptedByYou:t=>`You ACCEPTED ${t}'s swap offer (Cups exchanged).`,swapRejectedByYou:t=>`You DECLINED ${t}'s swap offer.`,swapCancelled:"Swap cancelled (another swap already took place this round).",swapExpired:t=>`${t} did not respond in time (offer expired).`,adminPanel:"🛠️ Admin Panel (Game Logs)",addBot:"+ Add Bot (AI Player)"}};function de(){return Di[J]||Di.tr}function De(){return`
    <div style="display:inline-flex; border:2px solid var(--border-strong); border-radius:12px; overflow:hidden; box-shadow:0 2px 0 var(--border-strong); margin-left:auto;">
      <button id="setLangTr" style="background:${J==="tr"?"var(--btn-espresso)":"var(--bg-card)"}; color:${J==="tr"?"#fff":"var(--text-main)"}; border:none; padding:4px 10px; font-weight:800; font-size:0.75rem; cursor:pointer;">TR</button>
      <button id="setLangEn" style="background:${J==="en"?"var(--btn-espresso)":"var(--bg-card)"}; color:${J==="en"?"#fff":"var(--text-main)"}; border:none; padding:4px 10px; font-weight:800; font-size:0.75rem; cursor:pointer;">EN</button>
    </div>
  `}function Oe(){const t=document.getElementById("setLangTr"),e=document.getElementById("setLangEn");t&&(t.onclick=()=>{J="tr",localStorage.setItem("cot_lang","tr"),an()}),e&&(e.onclick=()=>{J="en",localStorage.setItem("cot_lang","en"),an()})}let Y=localStorage.getItem("cot_room_code")||"",S=localStorage.getItem("cot_player_id")||"",m=null,ee=null,B="PASS",ie=null,ts=!1,Dn=0;function Yu(){return window.location.hash==="#admin"||window.location.pathname==="/admin"||new URLSearchParams(window.location.search).has("admin")}function mo(){return Yu()?(Ru(he,()=>{window.location.hash="",Y&&S?on(Y):X()}),!0):!1}window.addEventListener("hashchange",()=>{mo()||(go(he),Y&&S&&m?an():X())});mo()||(Y&&S?on(Y):X());function on(t){P.listen(`rooms/${t}`,e=>{if(!e){localStorage.removeItem("cot_room_code"),localStorage.removeItem("cot_player_id"),Y="",S="",X();return}m=e;const n=e.players?e.players[S]:null;if(!n){S&&e&&e.players&&alert(de().kickedFromRoom),localStorage.removeItem("cot_room_code"),localStorage.removeItem("cot_player_id"),Y="",S="",m=null,X();return}n.isHost&&(Uu(t,e),e.status==="PHASE_1"?co(t,e):e.status==="PHASE_2"&&ho(t,e)),an()})}function an(){if(!m){X();return}const t=m.players[S];if(!t){X();return}if(m.status==="LOBBY"){Dn=0,Ku();return}if(m.status==="GAME_OVER"){Ju();return}if(!t.alive){Xu();return}switch(m.status){case"PHASE_1":m.round!==Dn&&(Dn=m.round,ee=null,B="PASS",ie=null),ts=!1,Me();break;case"PHASE_2":qu();break;case"PHASE_3":Qu();break;default:X()}}function X(){const t=de();he.innerHTML=`
    <div style="display:flex; justify-content:flex-end; width:100%; margin-bottom:4px;">
      ${De()}
    </div>

    <div class="hero-art">
      ${rn.teacup}
      <h1 class="brand-title" style="font-size:1.8rem; margin-top:14px;">${t.title}</h1>
      <p style="color:var(--text-muted); font-size:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-top:4px;">
        ${t.subtitle}
      </p>
    </div>

    <div class="card" style="margin-top:10px;">
      <div class="input-group">
        <label class="input-label">${t.yourName}</label>
        <input type="text" id="hostName" class="input-field" placeholder="${t.namePlaceholderHost}" maxlength="14">
      </div>
      <button class="btn btn-primary" id="btnCreate">
        ${t.createRoom}
      </button>
    </div>

    <div class="card">
      <div class="input-group">
        <label class="input-label">${t.roomCodeLabel}</label>
        <input type="text" id="joinCode" class="input-field" placeholder="KOD" maxlength="4" style="text-transform:uppercase; letter-spacing:4px; font-weight:900;">
      </div>
      <div class="input-group">
        <label class="input-label">${t.yourName}</label>
        <input type="text" id="joinName" class="input-field" placeholder="${t.namePlaceholderJoin}" maxlength="14">
      </div>
      <button class="btn btn-neutral" id="btnJoin">
        ${t.joinRoom}
      </button>
    </div>

    <!-- Admin Panel Quick Access Link -->
    <div style="margin-top:16px; text-align:center;">
      <a href="#admin" id="btnAdminLink" style="font-size:0.78rem; font-weight:800; color:var(--text-muted); text-decoration:none; display:inline-flex; align-items:center; gap:6px; padding:6px 14px; background:var(--bg-card); border:1.5px solid var(--border-subtle); border-radius:20px; box-shadow:0 1.5px 0 var(--border-subtle); cursor:pointer;">
        ${t.adminPanel}
      </a>
    </div>
  `,Oe(),document.getElementById("btnCreate").onclick=async()=>{const e=document.getElementById("hostName").value.trim();if(!e)return alert(J==="tr"?"Lütfen bir isim yaz!":"Please enter a name!");try{const{roomCode:n,playerId:s}=await Su(e);Y=n,S=s,localStorage.setItem("cot_room_code",n),localStorage.setItem("cot_player_id",s),on(n)}catch(n){alert(n.message)}},document.getElementById("btnJoin").onclick=async()=>{const e=document.getElementById("joinCode").value.trim(),n=document.getElementById("joinName").value.trim(),s=de();if(!e||!n)return alert(J==="tr"?"Lütfen kod ve isim girin!":"Please enter code and name!");try{const{roomCode:i,playerId:r}=await Iu(e,n);Y=i,S=r,localStorage.setItem("cot_room_code",i),localStorage.setItem("cot_player_id",r),on(i)}catch(i){i.message==="DUPLICATE_NAME"?alert(s.duplicateNameError):alert(i.message)}}}function Ku(){const t=de(),e=m.players[S],n=Object.values(m.players||{}),s=n.length>=2,i=n.map(r=>`
    <div class="player-row" style="display:flex; justify-content:space-between; align-items:center;">
      <span style="display:flex; align-items:center; gap:6px;">
        ${r.name}
        ${r.isBot?'<span class="tag-badge" style="background:#e8f0fe; color:#1a73e8; border-color:#1a73e8; font-size:0.65rem;">🤖 BOT</span>':""}
        ${r.id===S?`<span style="color:var(--text-muted); font-size:0.8rem;">${t.you}</span>`:""}
      </span>
      <div style="display:flex; align-items:center; gap:8px;">
        ${r.isHost?`<span class="tag-badge">${t.host}</span>`:`<span class="tag-badge" style="background:#e8f4ed; color:#1e5e39;">${t.ready}</span>`}
        ${e.isHost&&r.id!==S?`
          <button class="btn-kick" data-kick="${r.id}" style="background:#fdf2f2; border:1.5px solid #d9534f; color:#d9534f; border-radius:6px; font-weight:800; font-size:0.75rem; padding:4px 8px; cursor:pointer;">
            ${t.kickBtn}
          </button>
        `:""}
      </div>
    </div>
  `).join("");if(he.innerHTML=`
    <div class="app-header">
      <div class="brand-title">${t.title}</div>
      ${De()}
    </div>

    <div class="card" style="text-align:center; padding:22px 14px;">
      <span class="input-label" style="margin-bottom:2px;">${t.roomCodeTitle}</span>
      <h2 style="font-size:3rem; font-weight:900; letter-spacing:6px; color:var(--text-main); font-family:monospace; margin:4px 0;">
        ${m.code}
      </h2>
      <p style="font-size:0.85rem; font-weight:700; color:var(--text-muted);">
        ${t.playersAtTable(n.length)}
      </p>
    </div>

    <div class="card">
      <span class="input-label">${t.playersList}</span>
      <div style="margin-top:8px;">
        ${i}
      </div>
      ${e.isHost?`
        <button class="btn btn-neutral" id="btnAddBot" style="margin-top:10px; width:100%; border:2px dashed var(--btn-brass); color:var(--btn-espresso); font-weight:800; display:flex; align-items:center; justify-content:center; gap:8px;">
          ${t.addBot}
        </button>
      `:""}
    </div>

    <div style="margin-top:auto; padding-top:12px;">
      ${e.isHost?`
        <button class="btn btn-primary ${s?"":"btn-disabled"}" id="btnStartGame" ${s?"":"disabled"}>
          ${t.startGame(n.length)}
        </button>
      `:`
        <div style="text-align:center; color:var(--text-muted); font-weight:700; padding:16px;">
          ${t.waitingHost}
        </div>
      `}
      <button class="btn btn-neutral" id="btnLeave" style="margin-top:10px; border-color:transparent; color:#888;">
        ${t.leave}
      </button>
    </div>
  `,Oe(),e.isHost){const r=document.getElementById("btnAddBot");r&&(r.onclick=async()=>{try{await Wu(m.code)}catch(o){alert(o.message)}}),document.getElementById("btnStartGame").onclick=async()=>{try{await ku(m.code)}catch(o){alert(o.message)}},document.querySelectorAll(".btn-kick").forEach(o=>{o.onclick=async a=>{const l=a.currentTarget.getAttribute("data-kick");if(l)try{await Tu(m.code,l)}catch(c){alert(c.message)}}})}document.getElementById("btnLeave").onclick=()=>{localStorage.removeItem("cot_room_code"),localStorage.removeItem("cot_player_id"),Y="",S="",m=null,X()}}function Hs(t,e,n){const i=(e.detailedLogs||[]).filter(o=>o.actorId===t.id||o.actor===t.name||(o.type==="SWAP_ACCEPTED"||o.type==="SWAP_REJECTED"||o.type==="SWAP_CANCELLED"||o.type==="SWAP_EXPIRED")&&(o.fromId===t.id||o.from===t.name||o.toId===t.id||o.to===t.name));if(i.length===0)return`
      <div class="card" style="margin-top:14px; background:var(--bg-parchment); border:1.5px solid var(--border-subtle); padding:10px 12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span class="input-label" style="font-size:0.75rem; margin:0; color:var(--btn-espresso);">📜 ${n.personalLogTitle}</span>
          <span style="font-size:0.7rem; font-weight:700; color:var(--text-muted);">${n.onlyVisibleToYou}</span>
        </div>
        <p style="font-size:0.78rem; color:var(--text-muted); text-align:center; margin:6px 0 2px;">
          ${n.personalLogEmpty}
        </p>
      </div>
    `;const r=[...i].reverse().map(o=>{let a="";const l=o.round?`[${n.round} ${o.round}] `:"";switch(o.type){case"POISON":a=n.myLogPoison(l,o.target);break;case"SWAP_OFFER":a=n.myLogSwapOffer(l,o.target);break;case"SWAP_ACCEPTED":o.fromId===t.id||o.from===t.name?a=n.myLogSwapAcceptedForMe(l,o.to):a=n.myLogSwapAcceptedByMe(l,o.from);break;case"SWAP_REJECTED":o.fromId===t.id||o.from===t.name?a=n.myLogSwapRejectedForMe(l,o.to):a=n.myLogSwapRejectedByMe(l,o.from);break;case"SWAP_CANCELLED":a=`⚠️ <strong>${l}</strong>${n.swapCancelled}`;break;case"SWAP_EXPIRED":(o.fromId===t.id||o.from===t.name)&&(a=`⌛ <strong>${l}</strong>${n.swapExpired(o.to)}`);break;case"DRINK_CLEAN":a=n.myLogDrinkClean(l);break;case"DRINK_POISONED":a=n.myLogDrinkPoison(l);break;case"SKIP":a=n.myLogSkip(l);break;case"POISONED_PILL":a=n.myLogPill(l);break;case"DEATH":a=n.myLogDeath(l);break;default:return""}return`
      <div style="padding:4px 0; border-bottom:1px dashed var(--border-subtle); font-size:0.8rem; line-height:1.35;">
        ${a}
      </div>
    `}).filter(Boolean).join("");return`
    <div class="card" style="margin-top:14px; background:var(--bg-parchment); border:1.5px solid var(--border-subtle); padding:10px 12px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span class="input-label" style="font-size:0.75rem; margin:0; color:var(--btn-espresso);">📜 ${n.personalLogTitle}</span>
        <span style="font-size:0.7rem; font-weight:700; color:var(--text-muted);">${n.onlyVisibleToYou}</span>
      </div>
      <div style="max-height:130px; overflow-y:auto;">
        ${r}
      </div>
    </div>
  `}function Me(){const t=de(),e=m.players[S],n=Object.values(m.players).filter(c=>c.alive),s=n.filter(c=>c.id!==S),i=n.filter(c=>c.ready).length,r=n.length===2,o=e.skips>=2;o&&(ee=!0);let a="";if(B==="POISON"||B==="SWAP"){const c=s.map(u=>`
      <option value="${u.id}" ${ie===u.id?"selected":""}>${u.isBot?"🤖 ":""}${u.name}</option>
    `).join(""),h=B==="POISON"?`<option value="${S}" ${ie===S?"selected":""}>${t.targetSelf}</option>`:"";a=`
      <div style="margin-top:12px;">
        <label class="input-label">${t.targetLabel}</label>
        <select id="actionTarget" class="input-field" style="font-size:1rem; padding:12px;">
          <option value="">${t.targetPlaceholder}</option>
          ${c}
          ${h}
        </select>
      </div>
    `}he.innerHTML=`
    <div class="app-header">
      <div class="brand-title">${t.round} ${m.round}</div>
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="room-badge">${t.readyCounter(i,n.length)}</div>
        ${De()}
      </div>
    </div>

    <!-- Tactile Inventory Grid -->
    <div class="inventory-grid">
      <div class="inv-box">
        <div class="inv-box-label">${t.poison}</div>
        <div class="inv-box-val" style="color:${e.poison>0?"var(--btn-poison)":"#aaa"};">
          ${t.poisonVal(e.poison)}
        </div>
      </div>
      <div class="inv-box">
        <div class="inv-box-label">${t.antidote}</div>
        <div class="inv-box-val" style="color:${e.pill>0?"var(--btn-brass)":"#aaa"};">
          ${t.antidoteVal(e.pill)}
        </div>
      </div>
      <div class="inv-box">
        <div class="inv-box-label">${t.skipCounter}</div>
        <div class="inv-box-val" style="color:${e.skips>=2?"var(--btn-crimson)":"inherit"};">
          ${t.skipCounterVal(e.skips)}
        </div>
      </div>
    </div>

    ${o?`
      <div class="card-subtle" style="background:#fff2f2; border-color:#d9534f; text-align:center;">
        <strong style="color:#d9534f; font-size:0.85rem; text-transform:uppercase; letter-spacing:1px;">
          ${t.forcedDrinkAlert}
        </strong>
      </div>
    `:""}

    <!-- 1. Drink Choice -->
    <div class="card">
      <span class="input-label">${t.drinkChoiceTitle}</span>
      <div class="grid-2" style="margin-top:8px;">
        <button class="btn btn-neutral ${ee===!0?"selected":""}" id="btnDrink">
          ${t.drinkBtn(e.poison)}
        </button>
        <button class="btn btn-neutral ${ee===!1?"selected":""} ${o?"btn-disabled":""}" id="btnSkip" ${o?"disabled":""}>
          ${t.skipBtn}
        </button>
      </div>
      <p style="font-size:0.75rem; color:var(--text-muted); text-align:center; font-weight:600;">
        ${e.poison===0?t.drinkTipReload:t.drinkTipSkip}
      </p>
    </div>

    <!-- 2. Manipulation Choice -->
    <div class="card">
      <span class="input-label">${t.actionTitle}</span>
      <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
        <button class="btn btn-neutral ${B==="POISON"?"selected":""} ${e.poison<=0?"btn-disabled":""}" id="actPoison" ${e.poison<=0?"disabled":""}>
          ${t.actPoison(e.poison)}
        </button>
        <button class="btn btn-neutral ${B==="SWAP"?"selected":""} ${r?"btn-disabled":""}" id="actSwap" ${r?"disabled":""}>
          ${t.actSwap(r)}
        </button>
        <button class="btn btn-neutral ${B==="PASS"?"selected":""}" id="actPass">
          ${t.actPass}
        </button>
      </div>
      ${a}
    </div>

    ${Hs(e,m,t)}

    <div style="margin-top:auto; padding-top:8px;">
      <button class="btn btn-primary ${e.ready?"btn-disabled":""}" id="btnSubmitPhase1" ${e.ready?"disabled":""}>
        ${e.ready?`⏳ ${t.waitingOthers(i,n.length)}`:t.confirmDecision}
      </button>
    </div>
  `,Oe(),document.getElementById("btnDrink").onclick=()=>{ee=!0,Me()},o||(document.getElementById("btnSkip").onclick=()=>{ee=!1,Me()}),document.getElementById("actPoison").onclick=()=>{e.poison>0&&(B="POISON",Me())},r||(document.getElementById("actSwap").onclick=()=>{B="SWAP",Me()}),document.getElementById("actPass").onclick=()=>{B="PASS",ie=null,Me()};const l=document.getElementById("actionTarget");l&&(l.onchange=c=>{ie=c.target.value}),document.getElementById("btnSubmitPhase1").onclick=async()=>{if(ee===null)return alert(J==="tr"?"Lütfen içip içmeyeceğine karar ver!":"Please decide whether to drink or skip!");if((B==="POISON"||B==="SWAP")&&!ie)return alert(J==="tr"?"Lütfen hedef bir oyuncu seç!":"Please select a target player!");try{await uo(m.code,S,ee,{type:B,target:ie})}catch(c){alert(c.message)}}}function qu(){const t=de(),e=m.players[S],n=Object.values(m.players).filter(l=>l.alive),s=n.filter(l=>l.ready).length,i=m.swaps||{},r=Object.values(i).filter(l=>l.to===S),o=Object.values(i).filter(l=>l.from===S);let a="";for(const l of r)l.status==="PENDING"?a+=`
        <div class="swap-modal-card">
          <span class="input-label" style="color:var(--btn-brass-edge);">${t.swapOfferTitle}</span>
          <h3 style="margin:6px 0 10px; font-weight:800; font-size:1.15rem;">
            ${t.swapOfferText(l.fromName)}
          </h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:14px; font-weight:600;">
            ${t.swapOfferSub}
          </p>
          <div class="grid-2">
            <button class="btn btn-poison" id="btnAcceptSwap_${l.id}" style="padding:14px;">${t.accept}</button>
            <button class="btn btn-crimson" id="btnRejectSwap_${l.id}" style="padding:14px;">${t.reject}</button>
          </div>
        </div>
      `:l.status==="ACCEPTED"?a+=`
        <div class="card-subtle" style="background:#e8f4ed; border:1.5px solid #2e7d32; text-align:center; padding:12px; margin-bottom:8px;">
          <strong style="color:#2e7d32; font-size:0.9rem;">
            🤝 ${t.swapAcceptedByYou(l.fromName)}
          </strong>
        </div>
      `:l.status==="REJECTED"&&(a+=`
        <div class="card-subtle" style="background:#fdf2f2; border:1.5px solid #d9534f; text-align:center; padding:12px; margin-bottom:8px;">
          <strong style="color:#d9534f; font-size:0.9rem;">
            ❌ ${t.swapRejectedByYou(l.fromName)}
          </strong>
        </div>
      `);for(const l of o)l.status==="PENDING"?a+=`
        <div class="card-subtle" style="background:rgba(212,175,55,0.1); border:1.5px solid var(--btn-brass); text-align:center; padding:12px; margin-bottom:8px;">
          <strong style="color:var(--btn-brass); font-size:0.9rem;">
            ⏳ ${t.swapOfferPending(l.toName)}
          </strong>
        </div>
      `:l.status==="ACCEPTED"?a+=`
        <div class="card-subtle" style="background:#e8f4ed; border:1.5px solid #2e7d32; text-align:center; padding:12px; margin-bottom:8px;">
          <strong style="color:#2e7d32; font-size:0.9rem;">
            🤝 ${t.swapAcceptedForYou(l.toName)}
          </strong>
        </div>
      `:l.status==="REJECTED"&&(a+=`
        <div class="card-subtle" style="background:#fdf2f2; border:1.5px solid #d9534f; text-align:center; padding:12px; margin-bottom:8px;">
          <strong style="color:#d9534f; font-size:0.9rem;">
            ❌ ${t.swapRejectedForYou(l.toName)}
          </strong>
        </div>
      `);he.innerHTML=`
    <div class="app-header">
      <div class="brand-title">${t.discussionTitle}</div>
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="room-badge">${t.readyCounter(s,n.length)}</div>
        ${De()}
      </div>
    </div>

    <div class="card" style="text-align:center; padding:28px 16px;">
      <div style="font-size:2.5rem; margin-bottom:8px;">☕</div>
      <h3 style="font-weight:900; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px;">
        ${t.discussionHeader}
      </h3>
      <p style="color:var(--text-muted); font-size:0.9rem; font-weight:600; line-height:1.4;">
        ${t.discussionDesc}
      </p>
    </div>

    ${a}

    ${Hs(e,m,t)}

    <div style="margin-top:auto; padding-top:12px; display:flex; flex-direction:column; gap:8px;">
      <button class="btn btn-primary ${e.ready?"btn-disabled":""}" id="btnPhase2Ready" ${e.ready?"disabled":""}>
        ${e.ready?`⏳ ${t.waitingOthers(s,n.length)}`:t.readyBtn}
      </button>

      ${e.isHost?`
        <button class="btn btn-neutral" id="btnHostForcePhase3" style="border-color:var(--border-strong);">
          ${t.revealResultsHost}
        </button>
      `:""}
    </div>
  `,Oe();for(const l of r)if(l.status==="PENDING"){const c=document.getElementById(`btnAcceptSwap_${l.id}`);c&&(c.onclick=async()=>{await sn(m.code,l.id,!0)});const h=document.getElementById(`btnRejectSwap_${l.id}`);h&&(h.onclick=async()=>{await sn(m.code,l.id,!1)})}document.getElementById("btnPhase2Ready").onclick=async()=>{await fo(m.code,S)},e.isHost&&(document.getElementById("btnHostForcePhase3").onclick=async()=>{await Fs(m.code,m)})}function Qu(){const t=de(),e=m.players[S],n=m.roundLogs||[];ts||(ts=!0,e.alive?e.autoPillUsed?xu():e.lastDrink&&Nu():Pu());let s="";e.autoPillUsed?s=`
      <div class="card" style="text-align:center; border-color:var(--btn-brass); background:rgba(212,175,55,0.08); padding:16px;">
        <div style="font-size:2.2rem; margin-bottom:4px;">💊</div>
        <h2 style="font-size:1.35rem; font-weight:900; color:var(--btn-brass); margin-bottom:6px;">
          ${t.autoPillTitle}
        </h2>
        <p style="font-size:0.85rem; font-weight:700; color:var(--text-main); margin-bottom:6px; line-height:1.4;">
          ${t.autoPillDesc}
        </p>
        <p style="font-size:0.8rem; font-weight:700; color:var(--btn-poison);">
          ${t.autoPillReloadTip}
        </p>
      </div>
    `:e.alive?s=`
      <div class="card" style="text-align:center; border-color:var(--btn-poison);">
        <h2 style="font-size:1.6rem; font-weight:900; color:var(--btn-poison); margin-bottom:4px;">
          ${t.survivedTitle}
        </h2>
        <p style="color:var(--text-muted); font-size:0.85rem; font-weight:600;">
          ${e.lastDrink?t.survivedDescDrink:t.survivedDescSkip}
        </p>
      </div>
    `:s=`
      <div class="death-card">
        <div style="margin-bottom:8px;">${rn.skull}</div>
        <h2 style="font-size:1.8rem; font-weight:900; color:var(--btn-crimson); margin-bottom:6px;">
          ${t.eliminatedTitle}
        </h2>
        <p style="font-size:1.05rem; font-weight:800; color:var(--text-main); margin-bottom:8px;">
          ${t.fondipDrink}
        </p>
        <p style="font-size:0.8rem; font-weight:600; color:var(--text-muted);">
          ${t.deadDesc}
        </p>
      </div>
    `;let i=[];if(!n||n.length===0)i.push(t.noDeathsRound);else for(const c of n)typeof c=="string"?i.push(c):c&&c.type&&(c.type==="DEATH"?i.push(`☠️ ${t.logDeath(c.name)}`):c.type==="PILL"||c.type==="POISONED_PILL"?i.push(`💊 ${t.logPill(c.name)}`):c.type==="WINNER"?i.push(`👑 ${t.logWinner(c.winner)}`):c.type==="MUTUAL_DEATH"&&i.push(`🍻 ${t.gameOverMutualDesc}`));const r=i.map(c=>`
    <li style="margin-bottom:6px; font-weight:600; padding-bottom:4px; border-bottom:1px dashed var(--border-subtle);">
      ${c}
    </li>
  `).join(""),a=(m.detailedLogs||[]).filter(c=>c.round===m.round&&(c.type==="SWAP_ACCEPTED"||c.type==="SWAP_REJECTED")&&(c.fromId===e.id||c.from===e.name||c.toId===e.id||c.to===e.name));let l="";a.length>0&&(l=a.map(c=>{const h=c.fromId===e.id||c.from===e.name;return c.type==="SWAP_ACCEPTED"?`
          <div class="card-subtle" style="background:#e8f4ed; border:1.5px solid #2e7d32; text-align:center; padding:10px 12px; margin-bottom:8px;">
            <strong style="color:#2e7d32; font-size:0.88rem;">
              🤝 ${h?t.swapAcceptedForYou(c.to):t.swapAcceptedByYou(c.from)}
            </strong>
          </div>
        `:`
          <div class="card-subtle" style="background:#fdf2f2; border:1.5px solid #d9534f; text-align:center; padding:10px 12px; margin-bottom:8px;">
            <strong style="color:#d9534f; font-size:0.88rem;">
              ❌ ${h?t.swapRejectedForYou(c.to):t.swapRejectedByYou(c.from)}
            </strong>
          </div>
        `}).join("")),he.innerHTML=`
    <div class="app-header">
      <div class="brand-title">${t.round} ${m.round} ${t.resultsTitle}</div>
      ${De()}
    </div>

    ${s}

    ${l}

    <div class="card">
      <span class="input-label">${t.roundEvents}</span>
      <ul style="list-style-type:none; font-size:0.85rem; color:var(--text-main); margin-top:8px;">
        ${r}
      </ul>
    </div>

    ${Hs(e,m,t)}

    <div style="margin-top:auto; padding-top:12px;">
      ${e.isHost?`
        <button class="btn btn-primary" id="btnNextRound">
          ${t.nextRoundBtn}
        </button>
      `:`
        <div style="text-align:center; color:var(--text-muted); font-weight:700; padding:14px;">
          ${t.waitingNextRound}
        </div>
      `}
    </div>
  `,Oe(),e.isHost&&(document.getElementById("btnNextRound").onclick=async()=>{ee=null,B="PASS",ie=null,await po(m.code)})}function Ju(){const t=de(),e=m.winner.includes("BERABERE");he.innerHTML=`
    <div style="display:flex; justify-content:flex-end; width:100%;">
      ${De()}
    </div>

    <div class="hero-art" style="padding-top:20px;">
      ${e?rn.skull:rn.crown}
      <h1 class="brand-title" style="font-size:1.6rem; margin-top:16px; text-align:center;">
        ${e?t.gameOverMutual:t.gameOverTitle}
      </h1>
      <h2 style="font-size:2rem; font-weight:900; color:${e?"var(--btn-crimson)":"var(--btn-poison)"}; margin:10px 0; text-align:center;">
        ${m.winner}
      </h2>
      <p style="color:var(--text-muted); font-weight:600; font-size:0.9rem; text-align:center; max-width:320px; line-height:1.4;">
        ${e?t.gameOverMutualDesc:t.gameOverWinnerDesc}
      </p>
    </div>

    <div style="margin-top:auto; padding-top:24px;">
      <button class="btn btn-primary" id="btnRestart">
        ${t.restartBtn}
      </button>
    </div>
  `,Oe(),document.getElementById("btnRestart").onclick=()=>{localStorage.removeItem("cot_room_code"),localStorage.removeItem("cot_player_id"),Y="",S="",m=null,X()}}function Zu(t,e){switch(t.type){case"POISON":return e.detailPoison(t.actor,t.target);case"SWAP_OFFER":return e.detailSwapOffer(t.actor,t.target);case"SWAP_ACCEPTED":return e.detailSwapAccepted(t.from,t.to);case"SWAP_REJECTED":return e.detailSwapRejected(t.from,t.to);case"SWAP_CANCELLED":return`⚠️ <strong>${t.from}</strong> ile <strong>${t.to}</strong> arasındaki takas iptal edildi (çifte takas).`;case"SWAP_EXPIRED":return`⌛ <strong>${t.from}</strong>'in <strong>${t.to}</strong>'a teklifi yanıtsız kalarak zaman aşımına uğradı.`;case"DRINK_CLEAN":return e.detailDrinkClean(t.actor);case"DRINK_POISONED":return e.detailDrinkPoison(t.actor);case"SKIP":return e.detailSkip(t.actor);case"DEATH":return e.detailDeath(t.actor);case"PILL":case"POISONED_PILL":return e.detailPill(t.actor);case"WINNER":return e.detailWinner(t.winner);case"MUTUAL_DEATH":return e.detailMutual;default:return""}}function Xu(){const t=de(),e=m.players[S],n=Object.values(m.players||{}).filter(l=>l.alive),s=m.detailedLogs||[],i={};for(const l of s){const c=l.round||1;i[c]||(i[c]=[]),i[c].push(l)}const r=Object.keys(i).map(Number).sort((l,c)=>c-l);let o="";r.length===0?o=`<div style="text-align:center; color:var(--text-muted); font-size:0.85rem; padding:16px;">${t.waitingForAlive}</div>`:o=r.map(l=>{const c=i[l].map(h=>{const u=Zu(h,t);return u?`
          <div style="padding:6px 0; border-bottom:1px dashed var(--border-subtle); font-size:0.85rem; line-height:1.4;">
            ${u}
          </div>
        `:""}).filter(Boolean).join("");return`
        <div style="margin-bottom:12px; background:var(--bg-parchment); border:1.5px solid var(--border-subtle); border-radius:8px; padding:10px;">
          <div style="font-weight:900; font-size:0.75rem; text-transform:uppercase; color:var(--btn-espresso); letter-spacing:1px; margin-bottom:6px;">
            ${t.round} ${l}
          </div>
          ${c||`<div style="color:var(--text-muted); font-size:0.8rem;">${t.waitingForAlive}</div>`}
        </div>
      `}).join("");const a=n.map(l=>`
    <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:var(--bg-parchment); border:1px solid var(--border-subtle); border-radius:8px;">
      <span style="font-weight:800; font-size:0.9rem;">${l.isBot?"🤖 ":""}${l.name}</span>
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="font-size:0.75rem; font-weight:800; padding:2px 8px; border-radius:6px; background:${l.cupPoisoned?"#fdf2f2":"#e8f4ed"}; color:${l.cupPoisoned?"#d9534f":"#1e5e39"}; border:1px solid ${l.cupPoisoned?"#d9534f":"#1e5e39"};">
          ${l.cupPoisoned?`🧪 ${t.cupPoisonLabel}`:`☕ ${t.cupCleanLabel}`}
        </span>
        <span style="font-size:0.7rem; font-weight:700; color:var(--text-muted);">
          (${t.skipCounterVal(l.skips)})
        </span>
      </div>
    </div>
  `).join("");if(he.innerHTML=`
    <div class="app-header">
      <div class="brand-title">${t.title}</div>
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="room-badge" style="background:#fdf2f2; color:#d9534f; border-color:#d9534f;">
          ☠️ ${t.spectatorBadge}
        </div>
        ${De()}
      </div>
    </div>

    <!-- Notice Card -->
    <div class="card" style="text-align:center; padding:16px 12px; border-color:var(--border-strong);">
      <div style="font-size:2rem; margin-bottom:4px;">👻</div>
      <h2 style="font-size:1.15rem; font-weight:900; color:var(--text-main); margin-bottom:4px;">
        ${t.spectatorTitle}
      </h2>
      <p style="font-size:0.8rem; font-weight:600; color:var(--text-muted); line-height:1.4;">
        ${t.spectatorSubtitle}
      </p>
      <div style="margin-top:8px; font-size:0.85rem; font-weight:800; color:var(--btn-crimson);">
        ${t.fondipDrink}
      </div>
    </div>

    <!-- Secret Live Table Status -->
    <div class="card">
      <span class="input-label">${t.liveTableTitle}</span>
      <div style="margin-top:8px; display:flex; flex-direction:column; gap:6px;">
        ${a||`<div style="text-align:center; color:var(--text-muted);">${t.waitingForAlive}</div>`}
      </div>
    </div>

    <!-- Full Detailed Game Log -->
    <div class="card">
      <span class="input-label">${t.fullLogTitle}</span>
      <div style="margin-top:8px; max-height:280px; overflow-y:auto;">
        ${o}
      </div>
    </div>

    <div style="margin-top:auto; padding-top:12px; display:flex; flex-direction:column; gap:8px;">
      ${e.isHost&&m.status==="PHASE_3"?`
        <button class="btn btn-primary" id="btnSpectatorNextRound">
          ${t.nextRoundBtn}
        </button>
      `:""}
      ${e.isHost&&m.status==="PHASE_2"?`
        <button class="btn btn-neutral" id="btnSpectatorForcePhase3" style="border-color:var(--border-strong);">
          ${t.revealResultsHost}
        </button>
      `:""}
      <button class="btn btn-neutral" id="btnLeaveSpectator" style="border-color:transparent; color:#888;">
        ${t.leave}
      </button>
    </div>
  `,Oe(),e.isHost){const l=document.getElementById("btnSpectatorNextRound");l&&(l.onclick=async()=>{ee=null,B="PASS",ie=null,await po(m.code)});const c=document.getElementById("btnSpectatorForcePhase3");c&&(c.onclick=async()=>{await Fs(m.code,m)})}document.getElementById("btnLeaveSpectator").onclick=()=>{localStorage.removeItem("cot_room_code"),localStorage.removeItem("cot_player_id"),Y="",S="",m=null,X()}}
