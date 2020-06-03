"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var express=_interopDefault(require("express")),_regeneratorRuntime=_interopDefault(require("@babel/runtime/regenerator")),_slicedToArray=_interopDefault(require("@babel/runtime/helpers/slicedToArray")),_asyncToGenerator=_interopDefault(require("@babel/runtime/helpers/asyncToGenerator")),jsonata=_interopDefault(require("jsonata")),fs=require("fs"),path=require("path"),marked=require("marked"),matter=require("gray-matter"),smarkt=require("smarkt"),YAML=require("yaml"),JSON5=require("json5");function getFileExt(e){if(e.match(/\.([0-9a-z]+)(?:[\?#]|$)/i))return e.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)[1]}function parseJson(e,t){if("json"===getFileExt(t)){var r=fs.readFileSync(path.join(e,t),"utf8");return JSON.parse(r)}}function parseJson5(e,t){if("json5"===getFileExt(t)){var r=fs.readFileSync(path.join(e,t),"utf8");return JSON5.parse(r)}}function parseMarkdown(e,t){if("md"===getFileExt(t))return{content:marked(fs.readFileSync(path.join(e,t),"utf8"))}}function parseText(e,t){if("txt"===getFileExt(t))return smarkt.parse(fs.readFileSync(path.join(e,t),"utf8"))}function parseYaml(e,t){if("yml"===getFileExt(t)||"yaml"===getFileExt(t))return YAML.parse(fs.readFileSync(path.join(e,t),"utf8"))}function parseCsson(e,t){if("csson"===getFileExt(t))return csson(fs.readFileSync(path.join(e,t),"utf8"))}function parseContent(e,t){return parseJson(e,t)||parseMarkdown(e,t)||parseText(e,t)||parseYaml(e,t)||parseJson5(e,t)||parseCsson(e,t)}var fs$1=require("fs"),path$1=require("path"),pluralize=require("pluralize"),type={is:{file:function(e){return!!/\..+$/.test(e)&&e.split(".")[0]},folder:function(e){return!/\..+$/.test(e)&&e},singular:function(e){return pluralize.isSingular(e)},plural:function(e){return pluralize.isPlural(e)},index:function(e){return/^index..+$/.test(e)},collection:function(e,t){var r=!1;return type.is.folder(t)&&(r=!0),r},item:function(e,t){var r=!1;return(type.is.file(t)||type.has.index(e,t))&&(r=!0),r},hidden:function(e){return/^_/.test(e)}},has:{index:function(e,t){var r=!1;return type.is.folder(t)&&fs$1.readdirSync(path$1.join(e+t)).map(function(e,t){type.is.index(e)&&(r=!0)}),r},children:function(e,t){var r=!1;return type.is.folder(t)&&fs$1.readdirSync(path$1.join(e+t)).map(function(e,t){r=!0}),r}}};function createResrouce(r,e,t,n,a){if(!type.is.hidden(e)){var o={_index:t,_name:e.split(".")[0]},i=e.split(".")[0];"home"===e&&(i="");var s=r.replace(a.replace(path$1.sep,""),"");if(o.url=path$1.join(s+i),o._source=path$1.join(r+i),type.is.singular(e),type.is.folder(e)&&type.has.index(r,e),type.is.item(r,e)&&(o._collection=n,o._type=n||e.split(".")[0]),type.is.folder(e)){var c=path$1.join(r+e+"/"),u=e;fs$1.readdirSync(c).map(function(e,t){createResrouce(c,e,t,u,a)})}if(type.is.file(e)&&Object.assign(o,parseContent(r,e)),type.is.folder(e)&&!type.is.item(r,e)){path$1.join(r+e+"/");var p="";fs$1.readdirSync(r).map(function(e,t){/\index..+$/.test(e)&&(p=parseContent(r,e))}),Object.assign(o,p)}if(type.is.folder(e)){var f=path$1.join(r+e+"/"),l=e;o[l]=[],fs$1.readdirSync(path$1.join(r+e)).map(function(e,t){type.is.index(e)||o[l].push(createResrouce(f,e,t,l,a))})}return o}}function createDatabase(r){var n=r;return fs$1.readdirSync(r).map(function(e,t){return createResrouce(r,e,t,null,n)})}function database(e){return createDatabase(e)}function isObjectEmpty(e){return 0===Object.keys(e).length&&e.constructor===Object}function getContent(e,t){return _getContent.apply(this,arguments)}function _getContent(){return(_getContent=_asyncToGenerator(_regeneratorRuntime.mark(function e(t,r){var n,a,o,i,s,c,u,p,f,l,d,h,y,m,g,j,b,v,_,x,q,$,S,k,F;return _regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n=r.resource1,a=r.resource2,o=r.query,i=jsonata('**[_type="'.concat(n,'"]')),!n||a){e.next=5;break}if(o){for(s=[],c=0,u=Object.entries(o);c<u.length;c++)p=_slicedToArray(u[c],2),f=p[0],l=p[1],d="[".concat(f,"=").concat(l,"]"),s.push(d);i=jsonata('**[_type="'.concat(n,'"]').concat(s.toString()))}return e.abrupt("return",i.evaluate(t));case 5:if(!n||!a){e.next=8;break}if(o){for(h=[],y=0,m=Object.entries(o);y<m.length;y++)g=_slicedToArray(m[y],2),j=g[0],b=g[1],v="[".concat(j,"=").concat(b,"]"),h.push(v);i=jsonata('**[_type="'.concat(n,'"][_name="').concat(a,'"]').concat(h.toString()))}return e.abrupt("return",i.evaluate(t));case 8:if(n&&a){e.next=16;break}if(!o){e.next=16;break}if(isObjectEmpty(o))return e.abrupt("return",t);e.next=12;break;case 12:for(_=[],x=0,q=Object.entries(o);x<q.length;x++)$=_slicedToArray(q[x],2),S=$[0],k=$[1],F="[".concat(S,"=").concat(k,"]"),_.push(F);return i=jsonata("**".concat(_.toString())),e.abrupt("return",i.evaluate(t));case 16:case"end":return e.stop()}},e)}))).apply(this,arguments)}var chokidar=require("chokidar"),http=require("http"),watcher=chokidar.watch("content/",{ignored:/(^|[\/\\])\../,persistent:!0});function _serve(t,r,n){r=r||3e3,n=n||"/";var a,o="";function i(){var e;(o=http.createServer((e=express(),a=database(t),e.set("json spaces",4),e.get(n,function(t,r){getContent(a,{resource1:null,resource2:null,query:t.query}).then(function(e){e?r.json(e):r.send("No value that matches query \n ".concat(t.url))})}),e.get(n+":resource1",function(t,r){getContent(a,{resource1:t.params.resource1,resource2:null,query:t.query}).then(function(e){e?r.json(e):r.send("No value that matches query \n ".concat(t.url))})}),e.get(n+":resource1/:resource2",function(t,r){getContent(a,{resource1:t.params.resource1,resource2:t.params.resource2,query:t.query}).then(function(e){e?r.json(e):r.send("No value that matches query \n ".concat(t.url))})}),e))).listen(r,function(){console.log("Server listening at http://localhost:".concat(r).concat(n))})}i(),watcher.on("change",function(e){console.log("restart"),o.close(),console.log("start"),i()})}function send(e){var r=e.base,t=e.method,n=e.path,a=e.data,o=e.token,i=process.browser?window.fetch:require("node-fetch").default,s={method:t,headers:{}};return a&&(s.headers["Content-Type"]="application/json",s.body=JSON.stringify(a)),o&&(s.headers.Authorization="Token ".concat(o)),i("".concat(r,"/").concat(n),s).then(function(e){return e.text()}).then(function(t){try{return JSON.parse(t)}catch(e){return console.log("".concat(r,"/").concat(n)),t}})}function _get(e,t,r){return send({method:"GET",path:t,token:r,base:e})}function require$$0(r){return{serve:function(e,t){return _serve(r,e,t)},get:function(e,t){return _get(e,t)},database:function(){return database(r)}}}var src=require$$0;module.exports=src;
