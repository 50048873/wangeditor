(function(e){function t(t){for(var l,r,s=t[0],i=t[1],c=t[2],u=0,h=[];u<s.length;u++)r=s[u],Object.prototype.hasOwnProperty.call(o,r)&&o[r]&&h.push(o[r][0]),o[r]=0;for(l in i)Object.prototype.hasOwnProperty.call(i,l)&&(e[l]=i[l]);d&&d(t);while(h.length)h.shift()();return a.push.apply(a,c||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],l=!0,s=1;s<n.length;s++){var i=n[s];0!==o[i]&&(l=!1)}l&&(a.splice(t--,1),e=r(r.s=n[0]))}return e}var l={},o={app:0},a=[];function r(t){if(l[t])return l[t].exports;var n=l[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=e,r.c=l,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)r.d(n,l,function(t){return e[t]}.bind(null,l));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],i=s.push.bind(s);s.push=t,s=s.slice();for(var c=0;c<s.length;c++)t(s[c]);var d=i;a.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"1e51":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var l=n("2b0e"),o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("div",{attrs:{id:"nav"}},[n("router-link",{attrs:{to:"/"}},[e._v("tableMergeCell")])],1),n("router-view")],1)},a=[],r=(n("5c0b"),n("2877")),s={},i=Object(r["a"])(s,o,a,!1,null,null,null),c=i.exports,d=n("8c4f"),u=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{ref:"editor"}),n("button",{attrs:{type:"button",id:"btn1"},on:{click:e.getHtml}},[e._v("获取html")]),n("button",{attrs:{type:"button",id:"btn2"},on:{click:e.setHtml}},[e._v("设置html")]),n("div",{ref:"newHtml",staticClass:"newHtml"})])},h=[],v=n("6fad"),f=n.n(v),m=(n("a4d3"),n("e01a"),n("d28b"),n("4160"),n("caad"),n("d3b7"),n("2532"),n("3ca3"),n("159b"),n("ddb0"),n("e587")),b=(n("a630"),n("a15b"),n("45fc"),n("b0c0"),n("ac1f"),n("466d"),n("1276"),n("284c")),g=n("9f12"),y=n("53fe"),p=n("2fa7"),C={btnDisabledColor:"#ddd",onAddCol:null},w=function(){function e(t){var n=this,l=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};Object(g["a"])(this,e),Object(p["a"])(this,"colorChange",(function(e){var t=e.target,l=t.value,o=n.colorPicker.selectedCells;o.length&&o.forEach((function(e){e.style.backgroundColor=l})),n.colorPicker&&(n.colorPicker.removeEventListener("input",n.colorChange),n.colorPicker.remove(),n.colorPicker=null),n.removeClass()})),Object(p["a"])(this,"mergeCell",(function(){var e=n.getSelectedCells(),t=n.indexStart,l=n.indexEnd,o=l.row-t.row+1,a=l.col-t.col+1;Array.from(e).forEach((function(e,t){0===t?(e.setAttribute("rowspan",o),e.setAttribute("colspan",a)):e.style.display="none",n.removeClass(e)}))})),Object(p["a"])(this,"unMergeCell",(function(e){var t=null;e?(n.indexStart=n.getCellIndex(e),t=n.getCellSpanProperty(e)):(n.indexStart=n.getCellIndex(n.contextmenuCell),t=n.getCellSpanProperty(n.contextmenuCell)),n.indexEnd={row:t.rowspan-1+n.indexStart.row,col:t.colspan-1+n.indexStart.col};var l=n.getSelectedCells();Array.from(l).forEach((function(e,t){0===t?(e.removeAttribute("rowspan"),e.removeAttribute("colspan")):e.style.display="table-cell",n.removeClass(e)}))})),Object(p["a"])(this,"menuClick",(function(t){var l=t.target,o=window.getComputedStyle(l).color,a=e.colorToRgb(n.opts.btnDisabledColor);if(o!==a){var r=l.dataset.key,s=n.getCellIndex(n.contextmenuCell),i=s.row,c=s.col;switch(r){case"textAlignLeft":console.log("靠左"),n.textAlignLeft();break;case"textAlignCenter":console.log("居中"),n.textAlignCenter();break;case"textAlignRight":console.log("靠右"),n.textAlignRight();break;case"addBackgroundColor":console.log("设置背景色"),n.addBackgroundColor();break;case"delBackgroundColor":console.log("删除背景色"),n.delBackgroundColor();break;case"delTable":console.log("删除表格"),n.delTable();break;case"addRow":console.log("添加行"),n.addRow(i);break;case"delRow":console.log("删除行"),n.delRow(i);break;case"addCol":console.log("添加列"),n.addCol(c);break;case"delCol":console.log("删除列"),n.delCol(c);break;case"addTh":console.log("设置表头"),n.addTh();break;case"delTh":console.log("取消表头"),n.delTh();break;case"merge":console.log("合并单元格"),n.mergeCell();break;case"unMerge":console.log("取消合并单元格"),n.unMergeCell();break}n.menuEle&&(n.menuEle.style.display="none")}})),Object(p["a"])(this,"mousedown",(function(e){var t=e.target,l=e.button;if(!n.tableIsInTable(t)&&0===l){var o=t.tagName;"TD"!==o&&"TH"!==o||(n.ready=!0,n.cellStart=t,n.indexStart=n.getCellIndex(t),n.removeClass(),n.addClass(t))}})),Object(p["a"])(this,"removeSomeNoSelfIsClicked",(function(e){var t=e.target;n.menuEle&&!n.menuEle.contains(t)&&(n.menuEle.style.display="none");var l=t.dataset.key;n.tableEle.contains(t)||"addBackgroundColor"===l||n.removeClass(),n.colorPicker&&n.colorPicker.remove()})),Object(p["a"])(this,"mousemove",(function(e){if(n.ready){var t=e.target;n.cellEnd=t,n.indexEnd=n.getCellIndex(t),n.removeClass(),n.highlightSelectedCells();var l=window.getSelection();n.cellStart!==n.cellEnd&&l.collapseToEnd()}})),Object(p["a"])(this,"mouseup",(function(e){var t=e.target,l=e.button;0===l&&n.ready&&(n.cellEnd=t,n.indexEnd=n.getCellIndex(t),n.ready=!1,n.cellStart!==n.cellEnd&&n.focusEle&&n.focusEle.focus())})),Object(p["a"])(this,"tableClick",(function(e){var t=e.target,l=e.button;0===l&&"INPUT"!==t.tagName&&n.tableEle.contains(t)&&e.stopPropagation()})),Object(p["a"])(this,"contextmenu",(function(e){e.preventDefault();var t=e.target;if(!n.tableIsInTable(t)){n.menuEle||(n.menuEle=document.createElement("ul"),n.menuEle.classList.add("tableMergeCell-contextmenu"),n.menuEle.addEventListener("click",n.menuClick,!1),n.menus.forEach((function(e){var t=document.createElement("li"),l=e.name,o=e.key;t.textContent=l,t.dataset.key=o,n["btn_".concat(o)]=t,n.menuEle.appendChild(t)})),document.body.appendChild(n.menuEle));var l=e.clientX,o=e.clientY;n.menuEle.style.display="block",n.menuEle.style.top="".concat(o,"px"),n.menuEle.style.left="".concat(l,"px"),n.contextmenuCell=t,n.handleMenuBtnMergeStatus(t),n.handleMenuBtnRowStatus(t),n.handleSomeMenuBtns(t)}})),Object(p["a"])(this,"copy",(function(e){e.preventDefault();var t=n.getSelectedCells(),l=[];t.forEach((function(e){l.push(e.outerHTML)}));var o=l.join(",,");console.log("copy",o),event.clipboardData?event.clipboardData.setData("text/plain",o):window.clipboardData&&window.clipboardData.setData("text",o)})),Object(p["a"])(this,"paste",(function(e){e.preventDefault();var t=event.clipboardData||window.clipboardData,l=t.getData("text");console.log("paste",l);var o=l.split(",,"),a=n.getSelectedCells();n.pasteWithRule(a,o)})),this.opts=Object.assign({},C,l),this.tableEle=t,this.tBody=t.tBodies[0],this.rows=this.tBody.rows,this.tableClassName="tableMergeCell",this.menuEle=null,this.menus=[{name:"靠左",key:"textAlignLeft"},{name:"居中",key:"textAlignCenter"},{name:"靠右",key:"textAlignRight"},{name:"设置背景色",key:"addBackgroundColor"},{name:"删除背景色",key:"delBackgroundColor"},{name:"添加行",key:"addRow"},{name:"删除行",key:"delRow"},{name:"添加列",key:"addCol"},{name:"删除列",key:"delCol"},{name:"设置表头",key:"addTh"},{name:"取消表头",key:"delTh"},{name:"合并单元格",key:"merge"},{name:"取消合并单元格",key:"unMerge"},{name:"删除表格",key:"delTable"}],this.selectedCellClassName="tableMergeCell-selected",this.ready=!1,this.cellStart=null,this.cellEnd=null,this.indexStart={row:-1,col:-1},this.indexEnd={row:-1,col:-1},this.maxRowCount=0,this.maxColCount=0,this.contextmenuCell=null,this.init()}return Object(y["a"])(e,[{key:"init",value:function(){if(!this.tableEle&&1!==this.tableEle.ELEMENT_NODE&&"TABLE"!==this.tableEle.tagName)throw new Error("请传入table元素！");this.tableEle.classList.add(this.tableClassName),this.addFocusEle(),this.addCellLocation(),this.syncMaxRowAndColCount(),this.addEvent()}},{key:"destroy",value:function(){this.removeEvent(),this.focusEle&&this.focusEle.remove()}},{key:"addFocusEle",value:function(){this.focusEle||(this.focusEle=document.createElement("button"),this.focusEle.className="tableMergeCell-focusEle",document.body.appendChild(this.focusEle))}},{key:"addCellLocation",value:function(){var e=this.rows;e.forEach((function(e,t){var n=e.children;n.forEach((function(e,n){e.textContent=t+"-"+n}))}))}},{key:"syncMaxRowAndColCount",value:function(){var e=this.rows;e.length?(this.maxRowCount=e.length,this.maxColCount=e[0].childElementCount):(this.maxRowCount=0,this.maxColCount=0)}},{key:"addBackgroundColor",value:function(){var e=this.getSelectedCells();if(e.length){this.colorPicker=document.createElement("input"),this.colorPicker.setAttribute("type","color"),this.colorPicker.className="tableMergeCell-colorPicker",this.colorPicker.addEventListener("input",this.colorChange,!1),this.colorPicker.selectedCells=e;var t=e[e.length-1];t.appendChild(this.colorPicker),this.colorPicker.click()}}},{key:"delBackgroundColor",value:function(){var e=this.getSelectedCells();e.forEach((function(e){e.style.removeProperty("background-color")}))}},{key:"tableIsInTable",value:function(e){while(e&&"TABLE"!==e.tagName)e=e.parentNode;return this.tableEle!==e&&this.tableEle.contains(e)}},{key:"addClass",value:function(e){e.className.includes(this.selectedCellClassName)||e.classList.add(this.selectedCellClassName)}},{key:"removeClass",value:function(e){var t=this;if(e)e.classList.remove(this.selectedCellClassName),""===e.className&&e.removeAttribute("class");else{var n=this.tableEle.querySelectorAll(".tableMergeCell-selected");n.length&&n.forEach((function(e){e.classList.remove(t.selectedCellClassName),""===e.className&&e.removeAttribute("class")}))}}},{key:"highlightSelectedCells",value:function(){var e=this,t=this.rows,n=this.selectedCellsIsValid(t);if(n){var l=this.getSelectedCells();l.forEach((function(t){e.addClass(t)}))}}},{key:"getSelectedCells",value:function(){for(var e=this.indexStart,t=this.indexEnd,n=[],l=this.rows,o=0;o<this.maxRowCount;o++)for(var a=l[o],r=a.children,s=r.length,i=0;i<s;i++){var c=r[i];o>=e.row&&o<=t.row&&i>=e.col&&i<=t.col&&n.push(c)}return n}},{key:"selectedCellsIsValid",value:function(){var e=this,t=this.cellStart.getAttribute("rowspan"),n=this.cellEnd&&this.cellEnd.getAttribute("rowspan");if(t||n)return!1;var l=this.getSelectedCells(),o=Array.from(l).some((function(t){return"none"===t.style.display||e.getIsMergedCellBool(t)}));return!o}},{key:"getCellIndex",value:function(e){var t={row:-1,col:-1};if(!this.cellStart)return t;var n=this.cellStart.tagName,l=this.rows;if("TH"===n){var o=l[0],a=o.children,r=a.length;t.row=0;for(var s=0;s<r;s++){var i=a[s];if(i===e){t.col=s;break}}}else if("TD"===n)for(var c=0;c<this.maxRowCount;c++){for(var d=l[c],u=d.children,h=u.length,v=0;v<h;v++){var f=u[v];if(f===e){t.row=c,t.col=v;break}}if(t.row>0)break}return t}},{key:"getCellSpanProperty",value:function(e){return{rowspan:1*e.getAttribute("rowspan"),colspan:1*e.getAttribute("colspan")}}},{key:"getIsMergedCellBool",value:function(e){var t=this.getCellSpanProperty(e),n=t.rowspan,l=t.colspan,o=Math.max(n,l);return o>1}},{key:"getSelectedCellsByClassName",value:function(){return Array.from(this.tableEle.querySelectorAll(".".concat(this.selectedCellClassName)))}},{key:"getMergedRowIndexArray",value:function(e,t){var n=e+t-1,l=[];do{l.push(e),e++}while(e<=n);return l}},{key:"getMergedColIndexArray",value:function(e,t){var n=e+t-1,l=[];do{l.push(e),e++}while(e<=n);return l}},{key:"handleMenuBtnMergeStatus",value:function(e){var t=this.opts.btnDisabledColor;this.isMergedCell=this.getIsMergedCellBool(e),this.cellStart!==this.cellEnd&&e.className.includes(this.selectedCellClassName)||e.getAttribute("rowspan")?this.getIsMergedCellBool(e)?(this.btn_merge.style.color=t,this.btn_unMerge.style.removeProperty("color")):(this.btn_merge.style.removeProperty("color"),this.btn_unMerge.style.color=t):(this.btn_merge.style.color=t,this.btn_unMerge.style.color=t)}},{key:"handleMenuBtnRowStatus",value:function(e){var t=this.opts.btnDisabledColor;"TH"===e.tagName?this.btn_addRow.style.color=t:this.btn_addRow.style.removeProperty("color");var n=this.getCellSpanProperty(e),l=n.rowspan,o=n.colspan;l>1||o>1?(this.btn_delRow.style.color=t,this.btn_delCol.style.color=t):(this.btn_delRow.style.removeProperty("color"),this.btn_delCol.style.removeProperty("color"))}},{key:"handleSomeMenuBtns",value:function(e){var t=this.opts.btnDisabledColor,n=this.getSelectedCellsByClassName();n.length?(this.btn_textAlignLeft.style.removeProperty("color"),this.btn_textAlignCenter.style.removeProperty("color"),this.btn_textAlignRight.style.removeProperty("color"),this.btn_addBackgroundColor.style.removeProperty("color"),this.btn_delBackgroundColor.style.removeProperty("color")):(this.btn_addBackgroundColor.style.color=t,this.btn_delBackgroundColor.style.color=t,this.btn_textAlignLeft.style.color=t,this.btn_textAlignCenter.style.color=t,this.btn_textAlignRight.style.color=t)}},{key:"handleMergedCellByDelCol",value:function(e){for(var t=this.rows,n=t.length,l=0;l<n;l++)for(var o=t[l],a=o.children,r=a.length,s=0;s<r;s++){var i=a[s],c=this.getCellSpanProperty(i),d=c.colspan;d>1&&e>s&&e<s+d&&i.setAttribute("colspan",d-1)}}},{key:"delTable",value:function(){this.tableEle.remove()}},{key:"delEmptyTable",value:function(){var e=this.rows;e.length&&e[0].children.length||this.delTable()}},{key:"addRow",value:function(e){var t=this,n=this.maxColCount,l=this.tBody,o=this.getRelatedMergedRowCells(e,"addRow"),a=[];o.forEach((function(e){var n=t.getCellSpanProperty(e),l=n.rowspan,o=n.colspan,r=t.getCellIndex(e),s=r.col;a.push.apply(a,Object(b["a"])(t.getMergedColIndexArray(s,o))),e.setAttribute("rowspan",l+1)}));for(var r=l.insertRow(e),s=0;s<n;s++)r.insertCell(s);a.forEach((function(e){r.children[e].style.display="none"})),this.syncMaxRowAndColCount()}},{key:"getRelatedMergedRowCells",value:function(e,t){var n=this,l=this.rows,o=[];return l.forEach((function(l,a){var r=l.children;r.forEach((function(l){var r=n.getCellSpanProperty(l),s=r.rowspan;s>1&&n.rowIsInMergedRow(a,s,e,t)&&o.push(l)}))})),o}},{key:"rowIsInMergedRow",value:function(e,t,n,l){return"addRow"===l?n>e&&n<=e+t-1:"delRow"===l?n>=e&&n<=e+t-1:void 0}},{key:"addCol",value:function(e){var t=this,n=this.opts.onAddCol;this.syncMaxRowAndColCount();for(var l=this.maxRowCount,o=this.rows,a=0;a<l;a++){var r=o[a],s=r.children[e],i="TH"===s.tagName?"<th></th>":"<td></td>";s.insertAdjacentHTML("beforebegin",i)}o.forEach((function(n,l){var a=n.children;a.forEach((function(n,r){var s=t.getCellSpanProperty(n),i=s.rowspan,c=s.colspan;if(c>1&&e>r&&e<=r+c-1){n.setAttribute("colspan",c+1),a[e].style.display="none";var d=i,u=l;while(d>1)o[++u].children[e].style.display="none",d--}}))})),this.syncMaxRowAndColCount(),n&&n()}},{key:"delRow",value:function(e){var t=this,n=this.tBody,l=this.rows,o=this.getRelatedMergedRowCells(e,"delRow");o.forEach((function(n){var o=t.getCellIndex(n),a=o.row,r=o.col;a===e?t.delFirstRow(l,r,n,e):t.delOtherRow(n)})),n.deleteRow(e),this.delEmptyTable(),this.syncMaxRowAndColCount()}},{key:"delOtherRow",value:function(e){var t=this.getCellSpanProperty(e),n=t.rowspan;e.setAttribute("rowspan",n-1)}},{key:"delFirstRow",value:function(e,t,n,l){var o=this.getCellSpanProperty(n),a=o.rowspan,r=o.colspan,s=e[l+1],i=s.children[t];i.setAttribute("rowspan",a-1),i.setAttribute("colspan",r),i.style.display="table-cell"}},{key:"getRelatedMergedColCells",value:function(e){var t=this,n=this.rows,l=[];return n.forEach((function(n){var o=n.children;o.forEach((function(n,o){var a=t.getCellSpanProperty(n),r=a.colspan;r>1&&e>=o&&e<=o+r-1&&l.push(n)}))})),l}},{key:"delOtherCol",value:function(e){var t=this.getCellSpanProperty(e),n=t.colspan;e.setAttribute("colspan",n-1)}},{key:"delFirstCol",value:function(e){var t=this.getCellSpanProperty(e),n=t.rowspan,l=t.colspan,o=e.nextElementSibling;o.setAttribute("colspan",l-1),o.setAttribute("rowspan",n),o.style.display="table-cell"}},{key:"delCol",value:function(e){var t=this,n=(this.tBody,this.rows),l=this.getRelatedMergedColCells(e);l.forEach((function(n){var l=t.getCellIndex(n),o=l.col;o===e?t.delFirstCol(n):t.delOtherCol(n)})),n.forEach((function(t){t.deleteCell(e)})),this.delEmptyTable(),this.syncMaxRowAndColCount()}},{key:"addTh",value:function(){var e=this.rows[0],t=e.children,n=document.createElement("tr");if("TD"===t[0].tagName){for(var l=t.length,o=0;o<l;o++){var a=t[o];if(this.getIsMergedCellBool(a)){alert("请先取消第一行合并的单元格！");break}var r=document.createElement("th");r.innerHTML=a.innerHTML,n.appendChild(r)}n.childElementCount===l&&(e.innerHTML=n.innerHTML)}}},{key:"delTh",value:function(){var e=this.rows[0],t=e.children,n=document.createElement("tr");"TH"===t[0].tagName&&(t.forEach((function(e){var t=document.createElement("td");t.innerHTML=e.innerHTML,n.appendChild(t)})),e.innerHTML=n.innerHTML)}},{key:"textAlignLeft",value:function(){var e=this.getSelectedCells();e.forEach((function(e){e.style.textAlign="left"}))}},{key:"textAlignCenter",value:function(){var e=this.getSelectedCells();e.forEach((function(e){e.style.textAlign="center"}))}},{key:"textAlignRight",value:function(){var e=this.getSelectedCells();e.forEach((function(e){e.style.textAlign="right"}))}},{key:"pasteWithRule",value:function(e,t){var n=e.length,l=t.length;if(n===l)for(var o=0;o<n;o++){var a=e[o],r=t[o],s=this.getCellSpanProperty(a),i=s.rowspan,c=s.colspan,d=r.match(/rowspan="(\d+)"/),u=r.match(/colspan="(\d+)"/),h=0,v=0;d&&d[1]&&(h=1*d[1]),u&&u[1]&&(v=1*u[1]),console.log(i,h,c,v),i===h&&c===v&&(a.outerHTML=r)}}},{key:"addEvent",value:function(){window.addEventListener("mousedown",this.mousedown,!1),window.addEventListener("mousedown",this.removeSomeNoSelfIsClicked,!1),window.addEventListener("mousemove",this.mousemove,!1),window.addEventListener("mouseup",this.mouseup,!1),this.tableEle.addEventListener("click",this.tableClick,!1),this.tableEle.addEventListener("contextmenu",this.contextmenu,!1),document.addEventListener("copy",this.copy,!1),document.addEventListener("paste",this.paste,!1)}},{key:"removeEvent",value:function(){window.removeEventListener("mousedown",this.mousedown,!1),window.removeEventListener("mousedown",this.removeSomeNoSelfIsClicked,!1),window.removeEventListener("mousemove",this.mousemove,!1),window.removeEventListener("mouseup",this.mouseup,!1),this.tableEle.removeEventListener("click",this.tableClick,!1),this.tableEle.removeEventListener("contextmenu",this.contextmenu,!1),this.tableEle.removeEventListener("copy",this.copy,!1),this.tableEle.removeEventListener("paste",this.paste,!1)}}],[{key:"colorToRgb",value:function(e){var t=document.createElement("span");t.style.color=e,document.body.appendChild(t);var n=window.getComputedStyle(t).color;return document.body.removeChild(t),n}}]),e}(),k=(n("720a"),n("99af"),n("d81d"),n("13d5"),n("a9e3"),n("c35a"),{colMinWidth:50}),E=function(){function e(t){var n=this,l=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};Object(g["a"])(this,e),Object(p["a"])(this,"reset",(function(){n.addResizeHandShank(),n.setDefaultWidth()})),Object(p["a"])(this,"mousedown",(function(e){var t=e.target,l=e.button,o=e.clientX;0===l&&t.className.includes(n.handshankCls)?(n.handshank=t,n.handshank.classList.add(n.handshankHover),n.clientX=o,n.addSubline()):n.handshank=null})),Object(p["a"])(this,"mousemove",(function(e){if(n.handshank){e.preventDefault();var t=e.clientX;n.diff=t-n.clientX,n.handshank.style.transform="translateX(".concat(n.diff,"px)")}})),Object(p["a"])(this,"mouseleave",(function(){n.mouseup()})),Object(p["a"])(this,"mouseup",(function(e){if(n.handshank){var t=e.clientX,l=n.tableEle.tBodies[0].rows[0],o=n.handshank.dataset.col,a=l.children[o],r=a.getBoundingClientRect(),s=r.width,i=s+n.diff,c=n.opts.colMinWidth,d=Math.max(c,i);if(t-n.clientX===0)return;n.tableEle.contains(n.handshank)&&(a.style.width="".concat(d,"px")),n.handshank.style.transform="none",n.handshank.classList.remove(n.handshankHover),n.removeSubline();var u=n.getColsWidth();n.setTableWidth(u),n.handshank=null}})),this.opts=Object.assign({},k,l),this.tableEle=t,this.tableEle.columnResizer=Object.assign({},{reset:this.reset}),this.handshank=null,this.handshankCls="tableMergeCell-handshank",this.subline="tableMergeCell-subline",this.handshankHover="tableMergeCell-handshank-hover",this.init()}return Object(y["a"])(e,[{key:"init",value:function(){if(!this.tableEle||1!==this.tableEle.ELEMENT_NODE||"TABLE"!==this.tableEle.tagName)throw new Error("请传入table元素！");this.getDefaultWidth(),this.setDefaultWidth(),this.addResizeHandShank(),this.addEvent()}},{key:"destroy",value:function(){this.removeEvent()}},{key:"getDefaultWidth",value:function(){var e=this.tableEle.getBoundingClientRect(),t=e.width,n=this.tableEle.tBodies[0].rows,l=n[0].childElementCount;this.average=t/l,this.tableWidth=t}},{key:"setDefaultWidth",value:function(){var e=this;this.setTableWidth(this.tableWidth);var t=this.tableEle.tBodies[0].rows,n=t[0].children;n.forEach((function(t){var n=t.style.width;n||(t.style.width="".concat(e.average,"px"))}))}},{key:"addResizeHandShank",value:function(){var e=this,t=this.tableEle.tBodies[0].rows,n=t[0].children;n.forEach((function(t,n){var l=t.querySelector(".".concat(e.handshankCls));l&&l.remove();var o='&emsp;<i data-col="'.concat(n,'" contenteditable="false" class="').concat(e.handshankCls,'"></i>');t.insertAdjacentHTML("beforeend",o)}))}},{key:"addSubline",value:function(){this.handshank.classList.add(this.subline)}},{key:"removeSubline",value:function(){this.handshank.classList.remove(this.subline)}},{key:"setTableWidth",value:function(e){this.tableEle.setAttribute("width","".concat(e,"px"))}},{key:"getColsWidth",value:function(){var e=this.tableEle.tBodies[0].rows,t=e[0].children,n=Array.from(t).map((function(e){return Number.parseFloat(e.style.width)})),l=n.reduce((function(e,t){return e+t}));return l}},{key:"addEvent",value:function(){window.addEventListener("mousedown",this.mousedown,!1),window.addEventListener("mousemove",this.mousemove,!1),window.addEventListener("mouseup",this.mouseup,!1)}},{key:"removeEvent",value:function(){window.removeEventListener("mousedown",this.mousedown,!1),window.removeEventListener("mousemove",this.mousemove,!1),window.removeEventListener("mouseup",this.mouseup,!1)}}]),e}(),x=(n("1e51"),{mounted:function(){var e=this;this.$nextTick((function(){e.tableObserve()}))},methods:{initTableInteraction:function(){this.$refs.editor&&(this.tables=this.$refs.editor.querySelectorAll(".w-e-text > table"),this.tables.forEach((function(e){e.tableMergeCellInstance=new w(e,{onAddCol:function(){e.columnResizer.reset()}}),e.tableColumnResizerInstance=new E(e,{})})))},tableObserve:function(){var e=this,t=function(t){var n=!0,l=!1,o=void 0;try{for(var a,r=t[Symbol.iterator]();!(n=(a=r.next()).done);n=!0){var s=a.value,i=s.target,c=s.addedNodes,d=Object(m["a"])(c,1),u=d[0];i.className.includes("w-e-text")&&u&&"TABLE"===u.tagName&&e.initTableInteraction()}}catch(h){l=!0,o=h}finally{try{n||null==r.return||r.return()}finally{if(l)throw o}}},n=new MutationObserver(t),l=this.$refs.editor.querySelector('.w-e-text[contenteditable="true"]');n.observe(l,{childList:!0,subtree:!0})}},beforeDestroy:function(){this.tables&&this.tables.forEach((function(e){e.tableMergeCellInstance.destroy(),e.tableColumnResizerInstance.destroy()})),this.tables=null}}),S={name:"about",mixins:[x],mounted:function(){this.initEditor()},methods:{getHtml:function(){this.newHtml=this.editor.txt.html(),this.$refs.newHtml.innerHTML=this.newHtml},setHtml:function(){this.editor.txt.html(this.newHtml)},initEditor:function(){this.editor=new f.a(this.$refs.editor),this.editor.config.onchangeTimeout=200,this.editor.create()}}},M=S,A=(n("e76e"),Object(r["a"])(M,u,h,!1,null,null,null)),R=A.exports;l["a"].use(d["a"]);var L=[{path:"/",name:"home",component:R}],T=new d["a"]({routes:L}),P=T,O=n("2f62");l["a"].use(O["a"]);var B=new O["a"].Store({state:{},mutations:{},actions:{},modules:{}});l["a"].config.productionTip=!1,new l["a"]({router:P,store:B,render:function(e){return e(c)}}).$mount("#app")},"5c0b":function(e,t,n){"use strict";var l=n("9c0c"),o=n.n(l);o.a},"720a":function(e,t,n){},"91aa":function(e,t,n){},"9c0c":function(e,t,n){},e76e:function(e,t,n){"use strict";var l=n("91aa"),o=n.n(l);o.a}});
//# sourceMappingURL=app.ea3d7f26.js.map