"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var r=e(require("http")),t=e(require("express")),n=e(require("cors")),i=e(require("chokidar")),s=e(require("fs")),o=e(require("path")),u=e(require("smarkt")),c=e(require("yaml")),l=e(require("json5"));const a=require("front-matter");function f(e){if(e.match(/\.([0-9a-z]+)(?:[?#]|$)/i))return e.match(/\.([0-9a-z]+)(?:[?#]|$)/i)[1]}function p(e,r){return function(e,r){if("json"===f(r)){let t=s.readFileSync(o.join(e,r),"utf8");return JSON.parse(t)}}(e,r)||function(e,r){if("md"===f(r)){var t=s.readFileSync(o.join(e,r),"utf8");const{attributes:n,body:i}=a(t);return{...n,content:i}}}(e,r)||function(e,r){if("txt"===f(r)){return u.parse(s.readFileSync(o.join(e,r),"utf8"))}}(e,r)||function(e,r){if("yml"===f(r)||"yaml"===f(r)){return c.parse(s.readFileSync(o.join(e,r),"utf8"))}}(e,r)||function(e,r){if("json5"===f(r)){let t=s.readFileSync(o.join(e,r),"utf8");return l.parse(t)}}(e,r)}const d=require("fs"),h=require("path"),y=require("pluralize"),m={is:{file:function(e){return!!/\..+$/.test(e)&&e.split(".")[0]},folder:function(e){return!/\..+$/.test(e)&&e},singular:function(e){return y.isSingular(e)},plural:function(e){return y.isPlural(e)},index:function(e){return/^index..+$/.test(e)},collection:function(e,r){let t=!1;return m.is.folder(r)&&(t=!0),t},item:function(e,r){let t=!1;return(m.is.file(r)||m.has.index(e,r))&&(t=!0),t},hidden:function(e){return/^_/.test(e)}},has:{index:function(e,r){let t=!1;return m.is.folder(r)&&d.readdirSync(h.join(e+r)).map(e=>{m.is.index(e)&&(t=!0)}),t},children:function(e,r){let t=!1;return m.is.folder(r)&&d.readdirSync(h.join(e+r)).map(()=>{t=!0}),t}}};function j(e){let r=e;return d.readdirSync(e).map((t,n)=>function e(r,t,n,i,s){if(m.is.hidden(t))return;let o={_index:n,_name:t.split(".")[0]},u=t.split(".")[0];"home"===t&&(u="");let c=r.replace(s.replace(h.sep,""),"");if(o.url=h.join(c+u),o._source=h.join(r+u),m.is.singular(t),m.is.folder(t)&&m.has.index(r,t),m.is.item(r,t)&&(o._collection=i,o._type=i||t.split(".")[0]),m.is.folder(t)){let n=h.join(r+t+"/"),i=t;d.readdirSync(n).map((r,t)=>{e(n,r,t,i,s)})}if(m.is.file(t)&&Object.assign(o,p(r,t)),m.is.folder(t)&&!m.is.item(r,t)){let e="";d.readdirSync(r).map(t=>{/index..+$/.test(t)&&(e=p(r,t))}),Object.assign(o,e)}if(m.is.folder(t)){let n=h.join(r+t+"/"),i=t;o[i]=[],d.readdirSync(h.join(r+t)).map((r,t)=>{m.is.index(r)||o[i].push(e(n,r,t,i,s))})}return o}(e,t,n,null,r))}const g=require("jsonata");async function q(e,{resource1:r,resource2:t,query:n}){var i,s=g(`**[_type="${r}"]`);if(r&&!t){if(n){let e=[];for(let[r,t]of Object.entries(n)){let n=`[${r}=${t}]`;e.push(n)}s=g(`**[_type="${r}"]${e.toString()}`)}return s.evaluate(e)}if(r&&t){if(n){let e=[];for(let[r,t]of Object.entries(n)){let n=`[${r}=${t}]`;e.push(n)}s=g(`**[_type="${r}"][_name="${t}"]${e.toString()}`)}return s.evaluate(e)}if((!r||!t)&&n){if(i=n,0===Object.keys(i).length&&i.constructor===Object)return e;let r=[];for(let[e,t]of Object.entries(n)){let n=`[${e}=${t}]`;r.push(n)}return(s=g("**"+r.toString())).evaluate(e)}}class v{constructor(e,r){this._options=e,r&&Object.assign(this._options,{preview:r})}_process(e,r){if(e=JSON.parse(e),r.preprocess){var t=e;if(Array.isArray(t))t.map(e=>{e&&r.preprocess({item:e})}),r.preprocess({item:{},collection:t}),e=t;else{var n=e;n&&(r.preprocess({item:n}),e=n)}return e}return e}get(e){var r=this._options;const t=process.browser?window.fetch:require("node-fetch").default;var n=r.preview||"http://localhost:3000/api/";return"development"===process.env.NODE_ENV?(r.preview&&(n=r.preview),n=r.production):n=r.production,t(`${n}${e}`).then(e=>e.text()).then(e=>{try{return this._process(e,r)}catch(r){return e}})}preprocess(e){Object.assign(this._options,{preprocess:e})}}module.exports=function(e){return new class{constructor(e){this._source=e}server(e,s){e=e||3e3,s=s||"/",this._local=`http://localhost:${e}${s}`;var o,u,c=this._source;function l(){(o=r.createServer(function(e){var r=t();return u=j(c),r.use(n({origin:"*",methods:"GET,HEAD,PUT,PATCH,POST,DELETE",preflightContinue:!1,optionsSuccessStatus:204})),r.set("json spaces",4),r.get(e,(e,r)=>{q(u,{resource1:null,resource2:null,query:e.query}).then(t=>{t?(r.json(t),console.log("0")):r.send("No value that matches query \n "+e.url)})}),r.get(e+":resource1",(e,r)=>{q(u,{resource1:e.params.resource1,resource2:null,query:e.query}).then(t=>{t?(r.json(t),console.log("1")):r.send("No value that matches query \n "+e.url)})}),r.get(e+":resource1/:resource2",(e,r)=>{q(u,{resource1:e.params.resource1,resource2:e.params.resource2,query:e.query}).then(t=>{t?r.json(t):r.send("No value that matches query \n "+e.url)})}),r}(s))).listen(e,()=>{console.log(`Server listening at http://localhost:${e}${s}`)})}l(),i.watch(c,{ignored:/(^|[/\\])\../,persistent:!0}).on("change",()=>{o.close(),console.log("API server restarting"),l()})}client(e){return this._local?new v(e,this._local):new v(e)}database(){return j(this._source)}}(e)};
