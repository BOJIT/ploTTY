if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return o[e]||(r=new Promise((async r=>{if("document"in self){const o=document.createElement("script");o.src=e,document.head.appendChild(o),o.onload=r}else importScripts(e),r()}))),r.then((()=>{if(!o[e])throw new Error(`Module ${e} didn’t register its module`);return o[e]}))},r=(r,o)=>{Promise.all(r.map(e)).then((e=>o(1===e.length?e[0]:e)))},o={require:Promise.resolve(r)};self.define=(r,f,n)=>{o[r]||(o[r]=Promise.resolve().then((()=>{let o={};const l={uri:location.origin+r.slice(1)};return Promise.all(f.map((r=>{switch(r){case"exports":return o;case"module":return l;default:return e(r)}}))).then((e=>{const r=n(...e);return o.default||(o.default=r),o}))})))}}define("./service-worker.js",["./workbox-3b5792f5"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/bojit_logo_square.4e0c514ef459f02e0eab.png",revision:null},{url:"assets/icon_x48.f0ef2b2c8fe2a1011500.png",revision:null},{url:"bundle.176686c8af4a11b31f6f.css",revision:null},{url:"bundle.ad09e6cdf26d8aa1d2e9.js",revision:null},{url:"fonts/comfortaa-all-400-normal.2e320d8ffe7bf8178e90.woff",revision:null},{url:"fonts/comfortaa-cyrillic-400-normal.dd7cad3aff3ff0e6469b.woff2",revision:null},{url:"fonts/comfortaa-cyrillic-ext-400-normal.c4ebc934c2d9438257e5.woff2",revision:null},{url:"fonts/comfortaa-greek-400-normal.2daad6cb6185002cf88c.woff2",revision:null},{url:"fonts/comfortaa-latin-400-normal.10d0757ad3de00eea8eb.woff2",revision:null},{url:"fonts/comfortaa-latin-ext-400-normal.6d31af9484d641232bd5.woff2",revision:null},{url:"fonts/comfortaa-vietnamese-400-normal.f86ae0565e2455b39d44.woff2",revision:null},{url:"fonts/fa-brands-400.2285773e6b4b172f07d9.woff",revision:null},{url:"fonts/fa-brands-400.d878b0a6a1144760244f.woff2",revision:null},{url:"fonts/fa-regular-400.7a3337626410ca2f4071.woff2",revision:null},{url:"fonts/fa-regular-400.bb58e57c48a3e911f15f.woff",revision:null},{url:"fonts/fa-solid-900.1551f4f60c37af51121f.woff2",revision:null},{url:"fonts/fa-solid-900.eeccf4f66002c6f2ba24.woff",revision:null},{url:"index.html",revision:"48a12f4d6c933532e470619eba819476"}],{})}));
