/* morphdom 2.7.4, MIT licence (bundled) */
(function(global,factory){typeof exports==="object"&&typeof module!=="undefined"?module.exports=factory():typeof define==="function"&&define.amd?define(factory):(global=global||self,global.morphdom=factory())})(this,function(){"use strict";var DOCUMENT_FRAGMENT_NODE=11;function morphAttrs(fromNode,toNode){var toNodeAttrs=toNode.attributes;var attr;var attrName;var attrNamespaceURI;var attrValue;var fromValue;if(toNode.nodeType===DOCUMENT_FRAGMENT_NODE||fromNode.nodeType===DOCUMENT_FRAGMENT_NODE){return}for(var i=toNodeAttrs.length-1;i>=0;i--){attr=toNodeAttrs[i];attrName=attr.name;attrNamespaceURI=attr.namespaceURI;attrValue=attr.value;if(attrNamespaceURI){attrName=attr.localName||attrName;fromValue=fromNode.getAttributeNS(attrNamespaceURI,attrName);if(fromValue!==attrValue){if(attr.prefix==="xmlns"){attrName=attr.name}fromNode.setAttributeNS(attrNamespaceURI,attrName,attrValue)}}else{fromValue=fromNode.getAttribute(attrName);if(fromValue!==attrValue){fromNode.setAttribute(attrName,attrValue)}}}var fromNodeAttrs=fromNode.attributes;for(var d=fromNodeAttrs.length-1;d>=0;d--){attr=fromNodeAttrs[d];attrName=attr.name;attrNamespaceURI=attr.namespaceURI;if(attrNamespaceURI){attrName=attr.localName||attrName;if(!toNode.hasAttributeNS(attrNamespaceURI,attrName)){fromNode.removeAttributeNS(attrNamespaceURI,attrName)}}else{if(!toNode.hasAttribute(attrName)){fromNode.removeAttribute(attrName)}}}}var range;var NS_XHTML="http://www.w3.org/1999/xhtml";var doc=typeof document==="undefined"?undefined:document;var HAS_TEMPLATE_SUPPORT=!!doc&&"content"in doc.createElement("template");var HAS_RANGE_SUPPORT=!!doc&&doc.createRange&&"createContextualFragment"in doc.createRange();function createFragmentFromTemplate(str){var template=doc.createElement("template");template.innerHTML=str;return template.content.childNodes[0]}function createFragmentFromRange(str){if(!range){range=doc.createRange();range.selectNode(doc.body)}var fragment=range.createContextualFragment(str);return fragment.childNodes[0]}function createFragmentFromWrap(str){var fragment=doc.createElement("body");fragment.innerHTML=str;return fragment.childNodes[0]}function toElement(str){str=str.trim();if(HAS_TEMPLATE_SUPPORT){return createFragmentFromTemplate(str)}else if(HAS_RANGE_SUPPORT){return createFragmentFromRange(str)}return createFragmentFromWrap(str)}function compareNodeNames(fromEl,toEl){var fromNodeName=fromEl.nodeName;var toNodeName=toEl.nodeName;var fromCodeStart,toCodeStart;if(fromNodeName===toNodeName){return true}fromCodeStart=fromNodeName.charCodeAt(0);toCodeStart=toNodeName.charCodeAt(0);if(fromCodeStart<=90&&toCodeStart>=97){return fromNodeName===toNodeName.toUpperCase()}else if(toCodeStart<=90&&fromCodeStart>=97){return toNodeName===fromNodeName.toUpperCase()}else{return false}}function createElementNS(name,namespaceURI){return!namespaceURI||namespaceURI===NS_XHTML?doc.createElement(name):doc.createElementNS(namespaceURI,name)}function moveChildren(fromEl,toEl){var curChild=fromEl.firstChild;while(curChild){var nextChild=curChild.nextSibling;toEl.appendChild(curChild);curChild=nextChild}return toEl}function syncBooleanAttrProp(fromEl,toEl,name){if(fromEl[name]!==toEl[name]){fromEl[name]=toEl[name];if(fromEl[name]){fromEl.setAttribute(name,"")}else{fromEl.removeAttribute(name)}}}var specialElHandlers={OPTION:function(fromEl,toEl){var parentNode=fromEl.parentNode;if(parentNode){var parentName=parentNode.nodeName.toUpperCase();if(parentName==="OPTGROUP"){parentNode=parentNode.parentNode;parentName=parentNode&&parentNode.nodeName.toUpperCase()}if(parentName==="SELECT"&&!parentNode.hasAttribute("multiple")){if(fromEl.hasAttribute("selected")&&!toEl.selected){fromEl.setAttribute("selected","selected");fromEl.removeAttribute("selected")}parentNode.selectedIndex=-1}}syncBooleanAttrProp(fromEl,toEl,"selected")},INPUT:function(fromEl,toEl){syncBooleanAttrProp(fromEl,toEl,"checked");syncBooleanAttrProp(fromEl,toEl,"disabled");if(fromEl.value!==toEl.value){fromEl.value=toEl.value}if(!toEl.hasAttribute("value")){fromEl.removeAttribute("value")}},TEXTAREA:function(fromEl,toEl){var newValue=toEl.value;if(fromEl.value!==newValue){fromEl.value=newValue}var firstChild=fromEl.firstChild;if(firstChild){var oldValue=firstChild.nodeValue;if(oldValue==newValue||!newValue&&oldValue==fromEl.placeholder){return}firstChild.nodeValue=newValue}},SELECT:function(fromEl,toEl){if(!toEl.hasAttribute("multiple")){var selectedIndex=-1;var i=0;var curChild=fromEl.firstChild;var optgroup;var nodeName;while(curChild){nodeName=curChild.nodeName&&curChild.nodeName.toUpperCase();if(nodeName==="OPTGROUP"){optgroup=curChild;curChild=optgroup.firstChild}else{if(nodeName==="OPTION"){if(curChild.hasAttribute("selected")){selectedIndex=i;break}i++}curChild=curChild.nextSibling;if(!curChild&&optgroup){curChild=optgroup.nextSibling;optgroup=null}}}fromEl.selectedIndex=selectedIndex}}};var ELEMENT_NODE=1;var DOCUMENT_FRAGMENT_NODE$1=11;var TEXT_NODE=3;var COMMENT_NODE=8;function noop(){}function defaultGetNodeKey(node){if(node){return node.getAttribute&&node.getAttribute("id")||node.id}}function morphdomFactory(morphAttrs){return function morphdom(fromNode,toNode,options){if(!options){options={}}if(typeof toNode==="string"){if(fromNode.nodeName==="#document"||fromNode.nodeName==="HTML"||fromNode.nodeName==="BODY"){var toNodeHtml=toNode;toNode=doc.createElement("html");toNode.innerHTML=toNodeHtml}else{toNode=toElement(toNode)}}else if(toNode.nodeType===DOCUMENT_FRAGMENT_NODE$1){toNode=toNode.firstElementChild}var getNodeKey=options.getNodeKey||defaultGetNodeKey;var onBeforeNodeAdded=options.onBeforeNodeAdded||noop;var onNodeAdded=options.onNodeAdded||noop;var onBeforeElUpdated=options.onBeforeElUpdated||noop;var onElUpdated=options.onElUpdated||noop;var onBeforeNodeDiscarded=options.onBeforeNodeDiscarded||noop;var onNodeDiscarded=options.onNodeDiscarded||noop;var onBeforeElChildrenUpdated=options.onBeforeElChildrenUpdated||noop;var skipFromChildren=options.skipFromChildren||noop;var addChild=options.addChild||function(parent,child){return parent.appendChild(child)};var childrenOnly=options.childrenOnly===true;var fromNodesLookup=Object.create(null);var keyedRemovalList=[];function addKeyedRemoval(key){keyedRemovalList.push(key)}function walkDiscardedChildNodes(node,skipKeyedNodes){if(node.nodeType===ELEMENT_NODE){var curChild=node.firstChild;while(curChild){var key=undefined;if(skipKeyedNodes&&(key=getNodeKey(curChild))){addKeyedRemoval(key)}else{onNodeDiscarded(curChild);if(curChild.firstChild){walkDiscardedChildNodes(curChild,skipKeyedNodes)}}curChild=curChild.nextSibling}}}function removeNode(node,parentNode,skipKeyedNodes){if(onBeforeNodeDiscarded(node)===false){return}if(parentNode){parentNode.removeChild(node)}onNodeDiscarded(node);walkDiscardedChildNodes(node,skipKeyedNodes)}function indexTree(node){if(node.nodeType===ELEMENT_NODE||node.nodeType===DOCUMENT_FRAGMENT_NODE$1){var curChild=node.firstChild;while(curChild){var key=getNodeKey(curChild);if(key){fromNodesLookup[key]=curChild}indexTree(curChild);curChild=curChild.nextSibling}}}indexTree(fromNode);function handleNodeAdded(el){onNodeAdded(el);var curChild=el.firstChild;while(curChild){var nextSibling=curChild.nextSibling;var key=getNodeKey(curChild);if(key){var unmatchedFromEl=fromNodesLookup[key];if(unmatchedFromEl&&compareNodeNames(curChild,unmatchedFromEl)){curChild.parentNode.replaceChild(unmatchedFromEl,curChild);morphEl(unmatchedFromEl,curChild)}else{handleNodeAdded(curChild)}}else{handleNodeAdded(curChild)}curChild=nextSibling}}function cleanupFromEl(fromEl,curFromNodeChild,curFromNodeKey){while(curFromNodeChild){var fromNextSibling=curFromNodeChild.nextSibling;if(curFromNodeKey=getNodeKey(curFromNodeChild)){addKeyedRemoval(curFromNodeKey)}else{removeNode(curFromNodeChild,fromEl,true)}curFromNodeChild=fromNextSibling}}function morphEl(fromEl,toEl,childrenOnly){var toElKey=getNodeKey(toEl);if(toElKey){delete fromNodesLookup[toElKey]}if(!childrenOnly){var beforeUpdateResult=onBeforeElUpdated(fromEl,toEl);if(beforeUpdateResult===false){return}else if(beforeUpdateResult instanceof HTMLElement){fromEl=beforeUpdateResult;indexTree(fromEl)}morphAttrs(fromEl,toEl);onElUpdated(fromEl);if(onBeforeElChildrenUpdated(fromEl,toEl)===false){return}}if(fromEl.nodeName!=="TEXTAREA"){morphChildren(fromEl,toEl)}else{specialElHandlers.TEXTAREA(fromEl,toEl)}}function morphChildren(fromEl,toEl){var skipFrom=skipFromChildren(fromEl,toEl);var curToNodeChild=toEl.firstChild;var curFromNodeChild=fromEl.firstChild;var curToNodeKey;var curFromNodeKey;var fromNextSibling;var toNextSibling;var matchingFromEl;outer:while(curToNodeChild){toNextSibling=curToNodeChild.nextSibling;curToNodeKey=getNodeKey(curToNodeChild);while(!skipFrom&&curFromNodeChild){fromNextSibling=curFromNodeChild.nextSibling;if(curToNodeChild.isSameNode&&curToNodeChild.isSameNode(curFromNodeChild)){curToNodeChild=toNextSibling;curFromNodeChild=fromNextSibling;continue outer}curFromNodeKey=getNodeKey(curFromNodeChild);var curFromNodeType=curFromNodeChild.nodeType;var isCompatible=undefined;if(curFromNodeType===curToNodeChild.nodeType){if(curFromNodeType===ELEMENT_NODE){if(curToNodeKey){if(curToNodeKey!==curFromNodeKey){if(matchingFromEl=fromNodesLookup[curToNodeKey]){if(fromNextSibling===matchingFromEl){isCompatible=false}else{fromEl.insertBefore(matchingFromEl,curFromNodeChild);if(curFromNodeKey){addKeyedRemoval(curFromNodeKey)}else{removeNode(curFromNodeChild,fromEl,true)}curFromNodeChild=matchingFromEl;curFromNodeKey=getNodeKey(curFromNodeChild)}}else{isCompatible=false}}}else if(curFromNodeKey){isCompatible=false}isCompatible=isCompatible!==false&&compareNodeNames(curFromNodeChild,curToNodeChild);if(isCompatible){morphEl(curFromNodeChild,curToNodeChild)}}else if(curFromNodeType===TEXT_NODE||curFromNodeType==COMMENT_NODE){isCompatible=true;if(curFromNodeChild.nodeValue!==curToNodeChild.nodeValue){curFromNodeChild.nodeValue=curToNodeChild.nodeValue}}}if(isCompatible){curToNodeChild=toNextSibling;curFromNodeChild=fromNextSibling;continue outer}if(curFromNodeKey){addKeyedRemoval(curFromNodeKey)}else{removeNode(curFromNodeChild,fromEl,true)}curFromNodeChild=fromNextSibling}if(curToNodeKey&&(matchingFromEl=fromNodesLookup[curToNodeKey])&&compareNodeNames(matchingFromEl,curToNodeChild)){if(!skipFrom){addChild(fromEl,matchingFromEl)}morphEl(matchingFromEl,curToNodeChild)}else{var onBeforeNodeAddedResult=onBeforeNodeAdded(curToNodeChild);if(onBeforeNodeAddedResult!==false){if(onBeforeNodeAddedResult){curToNodeChild=onBeforeNodeAddedResult}if(curToNodeChild.actualize){curToNodeChild=curToNodeChild.actualize(fromEl.ownerDocument||doc)}addChild(fromEl,curToNodeChild);handleNodeAdded(curToNodeChild)}}curToNodeChild=toNextSibling;curFromNodeChild=fromNextSibling}cleanupFromEl(fromEl,curFromNodeChild,curFromNodeKey);var specialElHandler=specialElHandlers[fromEl.nodeName];if(specialElHandler){specialElHandler(fromEl,toEl)}}var morphedNode=fromNode;var morphedNodeType=morphedNode.nodeType;var toNodeType=toNode.nodeType;if(!childrenOnly){if(morphedNodeType===ELEMENT_NODE){if(toNodeType===ELEMENT_NODE){if(!compareNodeNames(fromNode,toNode)){onNodeDiscarded(fromNode);morphedNode=moveChildren(fromNode,createElementNS(toNode.nodeName,toNode.namespaceURI))}}else{morphedNode=toNode}}else if(morphedNodeType===TEXT_NODE||morphedNodeType===COMMENT_NODE){if(toNodeType===morphedNodeType){if(morphedNode.nodeValue!==toNode.nodeValue){morphedNode.nodeValue=toNode.nodeValue}return morphedNode}else{morphedNode=toNode}}}if(morphedNode===toNode){onNodeDiscarded(fromNode)}else{if(toNode.isSameNode&&toNode.isSameNode(morphedNode)){return}morphEl(morphedNode,toNode,childrenOnly);if(keyedRemovalList){for(var i=0,len=keyedRemovalList.length;i<len;i++){var elToRemove=fromNodesLookup[keyedRemovalList[i]];if(elToRemove){removeNode(elToRemove,elToRemove.parentNode,false)}}}}if(!childrenOnly&&morphedNode!==fromNode&&fromNode.parentNode){if(morphedNode.actualize){morphedNode=morphedNode.actualize(fromNode.ownerDocument||doc)}fromNode.parentNode.replaceChild(morphedNode,fromNode)}return morphedNode}}var morphdom=morphdomFactory(morphAttrs);return morphdom});
/* AuthStack site, generated from the design canvas. */
(function () {
'use strict';
const TEMPLATES = {
  video: (v) => `
          <button type="button" data-act="toggleMute" aria-label="${esc(v.muteLabel)}" class="as-vctl" style="width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(242,242,242,.18); background: rgba(14,14,14,.55); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); color: #F2F2F2; cursor: pointer; display: flex; align-items: center; justify-content: center">${(v.vidMuted) ? `<svg data-key="k1" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"></path><path d="M17 9l4 6M21 9l-4 6"></path></svg>` : ''}${(v.vidSound) ? `<svg data-key="k2" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"></path><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"></path></svg>` : ''}</button>
          <button type="button" data-act="toggleVid" aria-label="${esc(v.playLabel)}" class="as-vctl" style="width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(242,242,242,.18); background: rgba(14,14,14,.55); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); color: #F2F2F2; cursor: pointer; display: flex; align-items: center; justify-content: center">${(v.vidPaused) ? `<svg data-key="k3" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"></path></svg>` : ''}${(v.vidPlaying) ? `<svg data-key="k4" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="3.5" height="14" rx="1"></rect><rect x="14" y="5" width="3.5" height="14" rx="1"></rect></svg>` : ''}</button>
        `,
  svc: (v) => `
      <div class="as-svc-list" data-auto="${esc(v.svcAuto)}" data-leave="leaveSvc" style="flex: 1 1 420px; min-width: 0; display: flex; flex-direction: column; margin-left: -28px">
        <div class="as-svc" data-active="${esc(v.sv0)}" data-hover="hoverSvc0" style="position: relative; padding: 24px 28px 26px; border-radius: 18px; display: flex; gap: 20px; align-items: flex-start">
          <span class="as-svc-line" aria-hidden="true" style="position: absolute; left: 28px; right: 28px; top: 0; height: 1px; background: var(--line)"></span>
          ${(v.svProg0) ? `<span data-key="k5" class="as-svc-prog" aria-hidden="true" style="position: absolute; left: 28px; right: 28px; top: 0; height: 2px; background: var(--accent); z-index: 2"></span>` : ''}
          <span class="as-svc-tile" style="position: relative; z-index: 1; width: 48px; height: 48px; flex: none; border-radius: 14px; border: 1px solid var(--line); background: var(--well); color: var(--fg); display: flex; align-items: center; justify-content: center"><svg class="as-svc-ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.8 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.8.7-1.5 1.5-1.5H16a5 5 0 0 0 5-5c0-4.4-4-7.8-9-7.8z"></path><circle cx="7.5" cy="11" r="1"></circle><circle cx="10.5" cy="7.5" r="1"></circle><circle cx="15" cy="7.5" r="1"></circle></svg></span>
          <span style="position: relative; z-index: 1; flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px">
            <span style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><h3 style="margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -.02em">Brand-first design</h3><span class="as-svc-num" style="font-size: 12px; font-weight: 600; letter-spacing: .08em; color: var(--muted); font-variant-numeric: tabular-nums">01</span></span>
            <p style="margin: 0; max-width: 400px; font-size: 14px; line-height: 1.6; color: var(--muted)">A visual identity that matches the quality of your product, not a theme with your logo dropped in.</p>
          </span>
          <button type="button" class="as-svc-hit" data-act="pickSvc0" aria-pressed="${esc(v.sv0)}" aria-label="Show Brand-first design" style="position: absolute; inset: 0; z-index: 2; width: 100%; border: none; border-radius: 18px; background: transparent; cursor: pointer"></button>
        </div>
        <div class="as-svc" data-active="${esc(v.sv1)}" data-hover="hoverSvc1" style="position: relative; padding: 24px 28px 26px; border-radius: 18px; display: flex; gap: 20px; align-items: flex-start">
          <span class="as-svc-line" aria-hidden="true" style="position: absolute; left: 28px; right: 28px; top: 0; height: 1px; background: var(--line)"></span>
          ${(v.svProg1) ? `<span data-key="k6" class="as-svc-prog" aria-hidden="true" style="position: absolute; left: 28px; right: 28px; top: 0; height: 2px; background: var(--accent); z-index: 2"></span>` : ''}
          <span class="as-svc-tile" style="position: relative; z-index: 1; width: 48px; height: 48px; flex: none; border-radius: 14px; border: 1px solid var(--line); background: var(--well); color: var(--fg); display: flex; align-items: center; justify-content: center"><svg class="as-svc-ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z"></path></svg></span>
          <span style="position: relative; z-index: 1; flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px">
            <span style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><h3 style="margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -.02em">Built for speed</h3><span class="as-svc-num" style="font-size: 12px; font-weight: 600; letter-spacing: .08em; color: var(--muted); font-variant-numeric: tabular-nums">02</span></span>
            <p style="margin: 0; max-width: 400px; font-size: 14px; line-height: 1.6; color: var(--muted)">Lightweight, hand-written code that loads fast on mobile data, so fewer visitors leave before they buy.</p>
          </span>
          <button type="button" class="as-svc-hit" data-act="pickSvc1" aria-pressed="${esc(v.sv1)}" aria-label="Show Built for speed" style="position: absolute; inset: 0; z-index: 2; width: 100%; border: none; border-radius: 18px; background: transparent; cursor: pointer"></button>
        </div>
        <div class="as-svc" data-active="${esc(v.sv2)}" data-hover="hoverSvc2" style="position: relative; padding: 24px 28px 26px; border-radius: 18px; display: flex; gap: 20px; align-items: flex-start">
          <span class="as-svc-line" aria-hidden="true" style="position: absolute; left: 28px; right: 28px; top: 0; height: 1px; background: var(--line)"></span>
          ${(v.svProg2) ? `<span data-key="k7" class="as-svc-prog" aria-hidden="true" style="position: absolute; left: 28px; right: 28px; top: 0; height: 2px; background: var(--accent); z-index: 2"></span>` : ''}
          <span class="as-svc-tile" style="position: relative; z-index: 1; width: 48px; height: 48px; flex: none; border-radius: 14px; border: 1px solid var(--line); background: var(--well); color: var(--fg); display: flex; align-items: center; justify-content: center"><svg class="as-svc-ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2.5"></rect><path d="M11 18h2"></path></svg></span>
          <span style="position: relative; z-index: 1; flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px">
            <span style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><h3 style="margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -.02em">Mobile-first, always</h3><span class="as-svc-num" style="font-size: 12px; font-weight: 600; letter-spacing: .08em; color: var(--muted); font-variant-numeric: tabular-nums">03</span></span>
            <p style="margin: 0; max-width: 400px; font-size: 14px; line-height: 1.6; color: var(--muted)">Designed for the phone first, where your customers shop, then refined for tablet and desktop.</p>
          </span>
          <button type="button" class="as-svc-hit" data-act="pickSvc2" aria-pressed="${esc(v.sv2)}" aria-label="Show Mobile-first, always" style="position: absolute; inset: 0; z-index: 2; width: 100%; border: none; border-radius: 18px; background: transparent; cursor: pointer"></button>
        </div>
        <div class="as-svc" data-active="${esc(v.sv3)}" data-hover="hoverSvc3" style="position: relative; padding: 24px 28px 26px; border-radius: 18px; display: flex; gap: 20px; align-items: flex-start">
          <span class="as-svc-line" aria-hidden="true" style="position: absolute; left: 28px; right: 28px; top: 0; height: 1px; background: var(--line)"></span>
          ${(v.svProg3) ? `<span data-key="k8" class="as-svc-prog" aria-hidden="true" style="position: absolute; left: 28px; right: 28px; top: 0; height: 2px; background: var(--accent); z-index: 2"></span>` : ''}
          <span class="as-svc-tile" style="position: relative; z-index: 1; width: 48px; height: 48px; flex: none; border-radius: 14px; border: 1px solid var(--line); background: var(--well); color: var(--fg); display: flex; align-items: center; justify-content: center"><svg class="as-svc-ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg></span>
          <span style="position: relative; z-index: 1; flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px">
            <span style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><h3 style="margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -.02em">Search-ready build</h3><span class="as-svc-num" style="font-size: 12px; font-weight: 600; letter-spacing: .08em; color: var(--muted); font-variant-numeric: tabular-nums">04</span></span>
            <p style="margin: 0; max-width: 400px; font-size: 14px; line-height: 1.6; color: var(--muted)">Clean structure, fast pages, and proper titles and descriptions, so Google can find and understand your store.</p>
          </span>
          <button type="button" class="as-svc-hit" data-act="pickSvc3" aria-pressed="${esc(v.sv3)}" aria-label="Show Search-ready build" style="position: absolute; inset: 0; z-index: 2; width: 100%; border: none; border-radius: 18px; background: transparent; cursor: pointer"></button>
        </div>
        <div class="as-svc" data-active="${esc(v.sv4)}" data-hover="hoverSvc4" style="position: relative; padding: 24px 28px 26px; border-radius: 18px; display: flex; gap: 20px; align-items: flex-start">
          <span class="as-svc-line" aria-hidden="true" style="position: absolute; left: 28px; right: 28px; top: 0; height: 1px; background: var(--line)"></span>
          ${(v.svProg4) ? `<span data-key="k9" class="as-svc-prog" aria-hidden="true" style="position: absolute; left: 28px; right: 28px; top: 0; height: 2px; background: var(--accent); z-index: 2"></span>` : ''}
          <span class="as-svc-tile" style="position: relative; z-index: 1; width: 48px; height: 48px; flex: none; border-radius: 14px; border: 1px solid var(--line); background: var(--well); color: var(--fg); display: flex; align-items: center; justify-content: center"><svg class="as-svc-ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2.5"></rect><path d="M3 9h18M9 9v12"></path></svg></span>
          <span style="position: relative; z-index: 1; flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px">
            <span style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><h3 style="margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -.02em">Every page has a job</h3><span class="as-svc-num" style="font-size: 12px; font-weight: 600; letter-spacing: .08em; color: var(--muted); font-variant-numeric: tabular-nums">05</span></span>
            <p style="margin: 0; max-width: 400px; font-size: 14px; line-height: 1.6; color: var(--muted)">Each page is designed around a single goal: to inform, to persuade or to convert.</p>
          </span>
          <button type="button" class="as-svc-hit" data-act="pickSvc4" aria-pressed="${esc(v.sv4)}" aria-label="Show Every page has a job" style="position: absolute; inset: 0; z-index: 2; width: 100%; border: none; border-radius: 18px; background: transparent; cursor: pointer"></button>
        </div>
        <div class="as-svc" data-active="${esc(v.sv5)}" data-hover="hoverSvc5" style="position: relative; padding: 24px 28px 26px; border-radius: 18px; display: flex; gap: 20px; align-items: flex-start">
          <span class="as-svc-line" aria-hidden="true" style="position: absolute; left: 28px; right: 28px; top: 0; height: 1px; background: var(--line)"></span>
          ${(v.svProg5) ? `<span data-key="k10" class="as-svc-prog" aria-hidden="true" style="position: absolute; left: 28px; right: 28px; top: 0; height: 2px; background: var(--accent); z-index: 2"></span>` : ''}
          <span class="as-svc-tile" style="position: relative; z-index: 1; width: 48px; height: 48px; flex: none; border-radius: 14px; border: 1px solid var(--line); background: var(--well); color: var(--fg); display: flex; align-items: center; justify-content: center"><svg class="as-svc-ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8l-9-5-9 5 9 5 9-5z"></path><path d="M3 8v8l9 5 9-5V8"></path><path d="M12 13v8"></path></svg></span>
          <span style="position: relative; z-index: 1; flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px">
            <span style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><h3 style="margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -.02em">Smooth hand-over</h3><span class="as-svc-num" style="font-size: 12px; font-weight: 600; letter-spacing: .08em; color: var(--muted); font-variant-numeric: tabular-nums">06</span></span>
            <p style="margin: 0; max-width: 400px; font-size: 14px; line-height: 1.6; color: var(--muted)">A brand guide, a recorded walkthrough and a launch checklist, so your team can run the site with confidence.</p>
          </span>
          <button type="button" class="as-svc-hit" data-act="pickSvc5" aria-pressed="${esc(v.sv5)}" aria-label="Show Smooth hand-over" style="position: absolute; inset: 0; z-index: 2; width: 100%; border: none; border-radius: 18px; background: transparent; cursor: pointer"></button>
        </div>
      </div>
      <div class="as-svc-panel" style="flex: 1.1 1 440px; min-width: 0; position: sticky; top: 104px; border-radius: 24px; background: var(--well); min-height: 560px; padding: 36px 24px 64px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; overflow: hidden">
          ${(v.sv0) ? `<div data-key="k11" class="as-swap" style="width: 100%; display: flex; justify-content: center"><div style="width: 86%; max-width: 420px; display: flex; flex-direction: column; gap: 22px">
  <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 16px"><span style="font-size: clamp(72px, 9vw, 112px); font-weight: 600; letter-spacing: -.06em; line-height: .85">Aa</span><span style="font-size: 12px; line-height: 1.6; color: var(--muted); text-align: right">Your typeface<br>Your colours<br>Your voice</span></div>
  <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px">
    <span style="display: flex; flex-direction: column; gap: 8px"><span class="as-sw-c" style="aspect-ratio: 1; border-radius: 14px; background: #2A0E14"></span><span style="font-size: 11px; color: var(--muted)">#2A0E14</span></span>
    <span style="display: flex; flex-direction: column; gap: 8px"><span class="as-sw-c" style="aspect-ratio: 1; border-radius: 14px; background: #7A2434"></span><span style="font-size: 11px; color: var(--muted)">#7A2434</span></span>
    <span style="display: flex; flex-direction: column; gap: 8px"><span class="as-sw-c" style="aspect-ratio: 1; border-radius: 14px; background: #D8B56A"></span><span style="font-size: 11px; color: var(--muted)">#D8B56A</span></span>
    <span style="display: flex; flex-direction: column; gap: 8px"><span class="as-sw-c" style="aspect-ratio: 1; border-radius: 14px; background: #F7F3EC; border: 1px solid var(--line); box-sizing: border-box"></span><span style="font-size: 11px; color: var(--muted)">#F7F3EC</span></span>
  </div>
  <div style="display: flex; flex-wrap: wrap; gap: 10px; padding-top: 18px; border-top: 1px solid var(--line)"><span style="font-size: 13px; font-weight: 700; padding: 11px 20px; border-radius: 999px; background: #D8B56A; color: #2A0E14">Shop the drop</span><span style="font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 999px; border: 1px solid var(--line-strong)">View lookbook</span><span style="font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: 6px 10px; border-radius: 999px; background: #7A2434; color: #F7F3EC; align-self: center">New</span></div>
</div></div>` : ''}
          ${(v.sv1) ? `<div data-key="k12" class="as-swap" style="width: 100%; display: flex; justify-content: center"><div style="width: 86%; max-width: 420px; display: flex; flex-direction: column; gap: 16px">
  <div style="border-radius: 14px; border: 1px solid var(--line); background: var(--node-bg); overflow: hidden">
    <div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--line); font-size: 12px; color: var(--muted)"><span style="display: flex; gap: 5px"><span style="width: 8px; height: 8px; border-radius: 50%; background: var(--line-strong)"></span><span style="width: 8px; height: 8px; border-radius: 50%; background: var(--line-strong)"></span><span style="width: 8px; height: 8px; border-radius: 50%; background: var(--line-strong)"></span></span><span style="flex: 1; text-align: center">noorvi.pk</span></div>
    <div style="height: 3px; background: var(--line)"><div class="as-load" style="height: 100%; background: var(--accent)"></div></div>
    <div style="padding: 16px; display: flex; flex-direction: column; gap: 10px">
      <div class="as-load-in" style="height: 92px; border-radius: 10px; background: #2A0E14"></div>
      <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px"><span class="as-load-in as-load-in-2" style="height: 60px; border-radius: 8px; background: #7A2434"></span><span class="as-load-in as-load-in-2" style="height: 60px; border-radius: 8px; background: #A9B59A"></span><span class="as-load-in as-load-in-2" style="height: 60px; border-radius: 8px; background: #D8B56A"></span></div>
    </div>
  </div>
  <div style="display: flex; flex-wrap: wrap; gap: 8px"><span style="font-size: 12px; font-weight: 600; padding: 7px 12px; border-radius: 999px; border: 1px solid var(--line)">Compressed images</span><span style="font-size: 12px; font-weight: 600; padding: 7px 12px; border-radius: 999px; border: 1px solid var(--line)">Lean, hand-written code</span><span style="font-size: 12px; font-weight: 600; padding: 7px 12px; border-radius: 999px; border: 1px solid var(--line)">Fast global hosting</span></div>
</div></div>` : ''}
          ${(v.sv2) ? `<div data-key="k13" class="as-swap" style="width: 100%; display: flex; justify-content: center"><div style="position: relative; width: 86%; max-width: 420px; height: 400px; display: flex; align-items: center; justify-content: center">
  <div style="position: absolute; left: 4%; top: 12%; width: 58%; height: 70%; border-radius: 18px; border: 1px solid var(--line-strong); background: var(--node-bg); padding: 12px; box-sizing: border-box; display: flex; flex-direction: column; gap: 8px; opacity: .7">
    <span style="height: 34%; border-radius: 8px; background: #2A0E14"></span><span style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; flex: 1"><span style="border-radius: 6px; background: var(--line)"></span><span style="border-radius: 6px; background: var(--line)"></span><span style="border-radius: 6px; background: var(--line)"></span></span>
  </div>
  <div class="as-arch" style="position: relative; margin-left: 34%; width: 172px; height: 350px; border-radius: 30px; border: 1.5px solid var(--fg); background: #F7F3EC; color: #1D1A17; padding: 12px 10px; box-sizing: border-box; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 30px 60px -30px rgba(0,0,0,.5)">
    <span style="align-self: center; width: 50px; height: 5px; border-radius: 5px; background: #D5CFC4"></span>
    <span style="display: flex; justify-content: space-between; align-items: center; font-size: 9px; font-weight: 700; letter-spacing: .22em"><span>NOORVI</span><span style="width: 12px; height: 2px; background: #1D1A17; box-shadow: 0 4px 0 #1D1A17"></span></span>
    <span style="height: 120px; border-radius: 10px; background: linear-gradient(160deg, #7A2434, #3A1019); color: #F7F3EC; padding: 10px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: flex-end; gap: 4px"><span style="font-size: 15px; font-weight: 700; letter-spacing: -.03em">The Eid Edit</span><span style="align-self: flex-start; font-size: 8px; font-weight: 700; padding: 3px 8px; border-radius: 999px; background: #D8B56A; color: #2A0E14">Shop</span></span>
    <span style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px"><span style="height: 70px; border-radius: 8px; background: #A9B59A"></span><span style="height: 70px; border-radius: 8px; background: #D8B56A"></span></span>
    <span style="margin-top: auto; height: 26px; border-radius: 999px; background: #2A0E14; color: #F7F3EC; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center">Add to bag · Rs 6,450</span>
  </div>
</div></div>` : ''}
          ${(v.sv3) ? `<div data-key="k14" class="as-swap" style="width: 100%; display: flex; justify-content: center"><div style="width: 86%; max-width: 420px; display: flex; flex-direction: column; gap: 14px">
  <div style="display: flex; align-items: center; gap: 10px; padding: 12px 18px; border-radius: 999px; border: 1px solid var(--line-strong); background: var(--node-bg); font-size: 14px"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>embroidered kurta online<span class="as-caret" style="width: 1.5px; height: 15px; background: var(--fg)"></span></div>
  <div class="as-hit-in" style="padding: 16px 18px; border-radius: 14px; border: 1px solid ${esc(v.accentLine)}; background: var(--node-bg); display: flex; flex-direction: column; gap: 4px; box-shadow: 0 16px 30px -22px rgba(255,59,48,.6)"><span style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted)"><span style="width: 18px; height: 18px; border-radius: 9px 9px 3px 3px; background: #6B1E2E"></span>noorvi.pk › shop › festive</span><span style="font-size: 17px; font-weight: 600; color: var(--accent-text)">Embroidered Kurtas | Noorvi</span><span style="font-size: 13px; line-height: 1.55; color: var(--muted)">Hand-finished festive kurtas in sizes XS–XL. Free delivery on orders over Rs 5,000.</span></div>
  <div style="padding: 14px 18px; display: flex; flex-direction: column; gap: 8px; opacity: .45"><span style="width: 40%; height: 8px; border-radius: 4px; background: var(--line-strong)"></span><span style="width: 75%; height: 10px; border-radius: 4px; background: var(--line-strong)"></span><span style="width: 90%; height: 8px; border-radius: 4px; background: var(--line)"></span></div>
  <div style="padding: 0 18px; display: flex; flex-direction: column; gap: 8px; opacity: .3"><span style="width: 35%; height: 8px; border-radius: 4px; background: var(--line-strong)"></span><span style="width: 65%; height: 10px; border-radius: 4px; background: var(--line-strong)"></span></div>
</div></div>` : ''}
          ${(v.sv4) ? `<div data-key="k15" class="as-swap" style="width: 100%; display: flex; justify-content: center"><div style="width: 80%; max-width: 360px; display: flex; flex-direction: column"><div class="as-flow-step as-fs1" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; border-radius: 14px; border: 1px solid var(--line-strong); background: var(--node-bg)"><span style="font-size: 15px; font-weight: 600">Home</span><span style="font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted)">Inform</span></div><span aria-hidden="true" style="align-self: center; width: 1px; height: 18px; background: var(--line-strong)"></span><div class="as-flow-step as-fs2" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; border-radius: 14px; border: 1px solid var(--line-strong); background: var(--node-bg)"><span style="font-size: 15px; font-weight: 600">Collection</span><span style="font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted)">Persuade</span></div><span aria-hidden="true" style="align-self: center; width: 1px; height: 18px; background: var(--line-strong)"></span><div class="as-flow-step as-fs3" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; border-radius: 14px; border: 1px solid var(--line-strong); background: var(--node-bg)"><span style="font-size: 15px; font-weight: 600">Product</span><span style="font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted)">Persuade</span></div><span aria-hidden="true" style="align-self: center; width: 1px; height: 18px; background: var(--line-strong)"></span><div class="as-flow-step as-fs4" style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; border-radius: 14px; border: 1px solid var(--accent); box-shadow: 0 0 0 5px rgba(255,59,48,.10); background: var(--node-bg)"><span style="font-size: 15px; font-weight: 600">Checkout</span><span style="font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--accent-text)">Convert</span></div></div></div>` : ''}
          ${(v.sv5) ? `<div data-key="k16" class="as-swap" style="width: 100%; display: flex; justify-content: center"><div style="width: 86%; max-width: 400px; display: flex; flex-direction: column; gap: 10px"><div class="as-file-in as-fi1" style="display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 14px; border: 1px solid var(--line); background: var(--node-bg)"><span style="width: 36px; height: 36px; flex: none; border-radius: 10px; background: var(--well); display: flex; align-items: center; justify-content: center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><path d="M14 3v6h6"></path></svg></span><span style="flex: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 14px; font-weight: 600">Brand guide</span><span style="font-size: 12px; color: var(--muted)">Colours, type and usage</span></span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></div><div class="as-file-in as-fi2" style="display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 14px; border: 1px solid var(--line); background: var(--node-bg)"><span style="width: 36px; height: 36px; flex: none; border-radius: 10px; background: var(--well); display: flex; align-items: center; justify-content: center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><path d="M14 3v6h6"></path></svg></span><span style="flex: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 14px; font-weight: 600">Site walkthrough</span><span style="font-size: 12px; color: var(--muted)">Recorded video, 20 min</span></span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></div><div class="as-file-in as-fi3" style="display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 14px; border: 1px solid var(--line); background: var(--node-bg)"><span style="width: 36px; height: 36px; flex: none; border-radius: 10px; background: var(--well); display: flex; align-items: center; justify-content: center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><path d="M14 3v6h6"></path></svg></span><span style="flex: 1; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 14px; font-weight: 600">Launch checklist</span><span style="font-size: 12px; color: var(--muted)">Domain, payments, tracking</span></span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></div><span class="as-file-in as-fi4" style="align-self: flex-start; margin-top: 8px; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; padding: 9px 14px; border-radius: 999px; background: var(--accent); color: #0E0E0E"><span style="width: 7px; height: 7px; border-radius: 50%; background: #0E0E0E"></span>Handed over · ready to run</span></div></div>` : ''}
          <span style="position: absolute; left: 28px; bottom: 22px; font-size: 13px; font-weight: 600">${(v.sv0) ? `<span data-key="k17" class="as-swap" style="display: inline-flex; gap: 10px"><span style="color: var(--accent-text)">01</span>Brand-first design</span>` : ''}${(v.sv1) ? `<span data-key="k18" class="as-swap" style="display: inline-flex; gap: 10px"><span style="color: var(--accent-text)">02</span>Built for speed</span>` : ''}${(v.sv2) ? `<span data-key="k19" class="as-swap" style="display: inline-flex; gap: 10px"><span style="color: var(--accent-text)">03</span>Mobile-first, always</span>` : ''}${(v.sv3) ? `<span data-key="k20" class="as-swap" style="display: inline-flex; gap: 10px"><span style="color: var(--accent-text)">04</span>Search-ready build</span>` : ''}${(v.sv4) ? `<span data-key="k21" class="as-swap" style="display: inline-flex; gap: 10px"><span style="color: var(--accent-text)">05</span>Every page has a job</span>` : ''}${(v.sv5) ? `<span data-key="k22" class="as-swap" style="display: inline-flex; gap: 10px"><span style="color: var(--accent-text)">06</span>Smooth hand-over</span>` : ''}</span>
          <span style="position: absolute; right: 28px; bottom: 22px; display: flex; gap: 6px"><span style="width: ${esc(v.svd0)}; height: 4px; border-radius: 4px; background: ${esc(v.svc0)}; transition: width .35s ease, background .35s ease"></span><span style="width: ${esc(v.svd1)}; height: 4px; border-radius: 4px; background: ${esc(v.svc1)}; transition: width .35s ease, background .35s ease"></span><span style="width: ${esc(v.svd2)}; height: 4px; border-radius: 4px; background: ${esc(v.svc2)}; transition: width .35s ease, background .35s ease"></span><span style="width: ${esc(v.svd3)}; height: 4px; border-radius: 4px; background: ${esc(v.svc3)}; transition: width .35s ease, background .35s ease"></span><span style="width: ${esc(v.svd4)}; height: 4px; border-radius: 4px; background: ${esc(v.svc4)}; transition: width .35s ease, background .35s ease"></span><span style="width: ${esc(v.svd5)}; height: 4px; border-radius: 4px; background: ${esc(v.svc5)}; transition: width .35s ease, background .35s ease"></span></span>
      </div>
    `,
  stats: (v) => `
      <div class="as-stat" style="flex: 1 1 260px; min-width: 0; padding: 36px 32px 8px 0; border-left: none; display: flex; flex-direction: column; gap: 18px">
        <span style="font-size: clamp(56px, 6vw, 80px); font-weight: 600; letter-spacing: -.055em; line-height: 1; font-variant-numeric: tabular-nums">${esc(v.st1)}</span>
        <div aria-hidden="true" style="display: flex; flex-direction: column; gap: 8px; max-width: 300px"><div style="position: relative; height: 4px; border-radius: 4px; background: var(--line)"><span style="position: absolute; left: 0; top: 0; bottom: 0; width: ${esc(v.st1Bar)}; border-radius: 4px; background: var(--accent)"></span><span style="position: absolute; left: ${esc(v.st1Bar)}; top: 50%; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); transform: translate(-50%, -50%); box-shadow: 0 0 0 4px rgba(255,59,48,.18)"></span></div><div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--muted)"><span>0s</span><span>1 second</span></div></div>
        <span style="font-size: 16px; line-height: 1.55; max-width: 300px">is all it takes for a visitor to form an opinion of your website.</span>
        <span style="font-size: 12px; line-height: 1.5; color: var(--muted)">Source: Lindgaard et al., Behaviour &amp; Information Technology, 2006</span>
      </div>
      <div class="as-stat" style="flex: 1 1 260px; min-width: 0; padding: 36px 32px 8px 32px; border-left: 1px solid var(--line); display: flex; flex-direction: column; gap: 18px">
        <span style="font-size: clamp(56px, 6vw, 80px); font-weight: 600; letter-spacing: -.055em; line-height: 1; font-variant-numeric: tabular-nums">${esc(v.st2)}</span>
        <div aria-hidden="true" style="display: grid; grid-template-columns: repeat(10, 10px); gap: 6px">${(v.st2Dots).map((dt, i_dt) => `<span style="width: 10px; height: 10px; border-radius: 50%; background: ${esc(dt.c)}; transition: background .3s ease"></span>`).join('')}</div>
        <span style="font-size: 16px; line-height: 1.55; max-width: 300px">of people judge a company’s credibility by the design of its website.</span>
        <span style="font-size: 12px; line-height: 1.5; color: var(--muted)">Source: Stanford Web Credibility Research</span>
      </div>
      <div class="as-stat" style="flex: 1 1 260px; min-width: 0; padding: 36px 32px 8px 32px; border-left: 1px solid var(--line); display: flex; flex-direction: column; gap: 18px">
        <span style="font-size: clamp(56px, 6vw, 80px); font-weight: 600; letter-spacing: -.055em; line-height: 1; font-variant-numeric: tabular-nums">${esc(v.st3)}</span>
        <div aria-hidden="true" style="display: flex; flex-direction: column; gap: 8px; max-width: 300px"><div style="height: 4px; border-radius: 4px; background: var(--line); overflow: hidden"><span style="display: block; height: 100%; width: ${esc(v.st3Bar)}; border-radius: 4px; background: var(--accent)"></span></div><div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--muted)"><span>Visitors who leave</span><span>after 3s</span></div></div>
        <span style="font-size: 16px; line-height: 1.55; max-width: 300px">of mobile visits are abandoned when a page takes longer than 3 seconds to load.</span>
        <span style="font-size: 12px; line-height: 1.5; color: var(--muted)">Source: Google, The Need for Mobile Speed, 2016</span>
      </div>
    `,
  conn: (v) => `
    <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 56px">
      <div style="flex: 1 1 380px; min-width: 0; display: flex; flex-direction: column; gap: 16px">
        <span style="font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--muted)">Integrations</span>
        <h2 style="margin: 0; font-size: clamp(32px, 4vw, 46px); line-height: 1.06; font-weight: 600; letter-spacing: -.035em">Connected to how<br><span style="color: var(--dim)">you already sell</span></h2>
        <p style="margin: 0; max-width: 440px; font-size: 16px; line-height: 1.65; color: var(--muted)">Follow one order from your Instagram bio to the customer’s door. Your site connects every step, so nothing lives in scattered DMs and spreadsheets.</p>
        <div style="margin-top: 18px; display: flex; flex-direction: column; border-top: 1px solid var(--line)">
          ${(v.conns).map((c, i_c) => `
            <div style="border-bottom: 1px solid var(--line)">
              <button type="button" data-act="conns.pick" data-idx="${i_c}" aria-expanded="${esc(c.open)}" style="font: inherit; width: 100%; min-height: 60px; padding: 14px 0; border: none; background: transparent; color: ${esc(c.fg)}; cursor: pointer; display: flex; align-items: center; gap: 14px; text-align: left; font-size: 16px; font-weight: 600; transition: color .25s ease">
                <span style="width: 34px; height: 34px; flex: none; border-radius: 10px; border: 1px solid ${esc(c.chipBorder)}; color: ${esc(c.chipColor)}; display: flex; align-items: center; justify-content: center; transition: border-color .3s ease, color .3s ease"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${esc(c.iconPath)}"></path></svg></span>
                <span style="flex: 1">${esc(c.title)}</span><span style="font-size: 12px; font-weight: 500; color: var(--muted); margin-right: 6px">${esc(c.stage)}</span>
                <span aria-hidden="true" style="font-size: 18px; font-weight: 400; color: var(--muted)">${esc(c.icon)}</span>
              </button>
              ${(c.open) ? `
                <div data-key="k23-${i_c}" class="as-swap" style="padding: 0 32px 18px 48px; display: flex; flex-direction: column; gap: 14px">
                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: var(--muted)">${esc(c.desc)}</p>
                  ${(c.auto) ? `<span data-key="k24-${i_c}" style="display: block; height: 2px; border-radius: 2px; background: var(--line); overflow: hidden"><span class="as-prog" style="display: block; height: 100%; background: var(--accent)"></span></span>` : ''}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <div style="flex: 1.1 1 420px; min-width: 0; border-radius: 24px; background: var(--well); padding: 40px 20px 64px; position: relative; overflow: hidden; display: flex; justify-content: center">
        <div class="as-glass as-toast-box" aria-live="polite" style="position: absolute; left: 50%; top: 22px; transform: translateX(-50%); z-index: 3; width: min(300px, 86%); padding: 12px 14px; border-radius: 16px; border: 1px solid var(--line); background: var(--surface); box-shadow: 0 18px 40px -22px rgba(14,14,14,.45); box-sizing: border-box">${(v.isC0) ? `<div data-key="k25" class="as-toast" style="display: flex; gap: 12px; align-items: center"><span style="width: 34px; height: 34px; flex: none; border-radius: 10px; background: var(--accent); color: #0E0E0E; display: flex; align-items: center; justify-content: center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${esc(v.connPath)}"></path></svg></span><span style="display: flex; flex-direction: column; gap: 2px; min-width: 0"><span style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent-text)">${esc(v.connEvtKicker)}</span><span style="font-size: 13px; font-weight: 600">${esc(v.connEvtTitle)}</span><span style="font-size: 11px; color: var(--muted)">${esc(v.connEvtMeta)}</span></span></div>` : ''}${(v.isC1) ? `<div data-key="k26" class="as-toast" style="display: flex; gap: 12px; align-items: center"><span style="width: 34px; height: 34px; flex: none; border-radius: 10px; background: var(--accent); color: #0E0E0E; display: flex; align-items: center; justify-content: center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${esc(v.connPath)}"></path></svg></span><span style="display: flex; flex-direction: column; gap: 2px; min-width: 0"><span style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent-text)">${esc(v.connEvtKicker)}</span><span style="font-size: 13px; font-weight: 600">${esc(v.connEvtTitle)}</span><span style="font-size: 11px; color: var(--muted)">${esc(v.connEvtMeta)}</span></span></div>` : ''}${(v.isC2) ? `<div data-key="k27" class="as-toast" style="display: flex; gap: 12px; align-items: center"><span style="width: 34px; height: 34px; flex: none; border-radius: 10px; background: var(--accent); color: #0E0E0E; display: flex; align-items: center; justify-content: center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${esc(v.connPath)}"></path></svg></span><span style="display: flex; flex-direction: column; gap: 2px; min-width: 0"><span style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent-text)">${esc(v.connEvtKicker)}</span><span style="font-size: 13px; font-weight: 600">${esc(v.connEvtTitle)}</span><span style="font-size: 11px; color: var(--muted)">${esc(v.connEvtMeta)}</span></span></div>` : ''}${(v.isC3) ? `<div data-key="k28" class="as-toast" style="display: flex; gap: 12px; align-items: center"><span style="width: 34px; height: 34px; flex: none; border-radius: 10px; background: var(--accent); color: #0E0E0E; display: flex; align-items: center; justify-content: center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${esc(v.connPath)}"></path></svg></span><span style="display: flex; flex-direction: column; gap: 2px; min-width: 0"><span style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent-text)">${esc(v.connEvtKicker)}</span><span style="font-size: 13px; font-weight: 600">${esc(v.connEvtTitle)}</span><span style="font-size: 11px; color: var(--muted)">${esc(v.connEvtMeta)}</span></span></div>` : ''}</div>
        <div class="as-arch" aria-hidden="true" style="margin-top: 64px; width: 252px; height: 500px; border-radius: 40px; background: #0E0E0E; padding: 7px; box-sizing: border-box; box-shadow: 0 40px 80px -40px rgba(0,0,0,.6), inset 0 0 0 1.5px #2E2E2E">
          <div style="position: relative; width: 100%; height: 100%; border-radius: 33px; overflow: hidden; background: #F7F3EC">
            ${(v.isC0) ? `<div data-key="k29" class="as-scr" style="position: absolute; inset: 0"><div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 18px 6px; font-size: 10px; font-weight: 700; color: #1D1A17"><span>9:41</span><span style="display: flex; gap: 4px; align-items: center"><span style="width: 14px; height: 7px; border-radius: 2px; border: 1px solid #1D1A17; box-sizing: border-box; padding: 1px"><span style="display: block; width: 70%; height: 100%; background: #1D1A17; border-radius: 1px"></span></span></span></div><div style="padding: 4px 14px 8px; display: flex; justify-content: space-between; align-items: center"><span style="font-size: 10px; font-weight: 800; letter-spacing: .24em; color: #1D1A17">NOORVI</span><span style="font-size: 9px; font-weight: 600; padding: 3px 8px; border-radius: 999px; background: rgba(122,36,52,.1); color: #7A2434">From your bio link</span></div>
<div style="margin: 0 12px; height: 190px; border-radius: 14px; background: radial-gradient(circle, rgba(216,181,106,.45) 0 1.1px, transparent 1.7px) 0 0 / 11px 11px, linear-gradient(160deg, #7A2434, #3A1019); display: flex; align-items: flex-end; justify-content: center; padding-bottom: 14px; box-sizing: border-box"><svg viewBox="0 0 100 120" width="92" aria-hidden="true"><path d="M38 8 L30 11 L14 21 L9 48 L19 50 L24 33 L26 112 L74 112 L76 33 L81 50 L91 48 L86 21 L70 11 L62 8 Q50 19 38 8 Z" fill="rgba(247,243,236,.1)" stroke="rgba(247,243,236,.55)" stroke-width="1.2" stroke-linejoin="round"></path><path d="M38 8 Q50 19 62 8" fill="none" stroke="#D8B56A" stroke-width="2.4" stroke-linecap="round"></path><path d="M50 17 L50 46" fill="none" stroke="#D8B56A" stroke-width="1.6" stroke-dasharray="1.5 3"></path></svg></div>
<div style="padding: 12px 14px 0; display: flex; flex-direction: column; gap: 6px; color: #1D1A17"><span style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700"><span>Embroidered Kurta</span><span>Rs 6,450</span></span><span style="font-size: 10px; color: #6B645A">Hand-finished · Festive ’26</span>
<span style="display: flex; gap: 6px; margin-top: 4px"><span style="font-size: 10px; font-weight: 700; width: 28px; height: 26px; border-radius: 8px; border: 1px solid rgba(29,26,23,.1); display: flex; align-items: center; justify-content: center">S</span><span class="as-ph-sel" style="font-size: 10px; font-weight: 700; width: 28px; height: 26px; border-radius: 8px; border: 1px solid rgba(29,26,23,.1); display: flex; align-items: center; justify-content: center">M</span><span style="font-size: 10px; font-weight: 700; width: 28px; height: 26px; border-radius: 8px; border: 1px solid rgba(29,26,23,.1); display: flex; align-items: center; justify-content: center">L</span></span>
<span class="as-ph-press" style="margin-top: 8px; height: 38px; border-radius: 999px; background: #2A0E14; color: #F7F3EC; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center">Add to bag</span></div></div>` : ''}
            ${(v.isC1) ? `<div data-key="k30" class="as-scr" style="position: absolute; inset: 0"><div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 18px 6px; font-size: 10px; font-weight: 700; color: #1D1A17"><span>9:41</span><span style="display: flex; gap: 4px; align-items: center"><span style="width: 14px; height: 7px; border-radius: 2px; border: 1px solid #1D1A17; box-sizing: border-box; padding: 1px"><span style="display: block; width: 70%; height: 100%; background: #1D1A17; border-radius: 1px"></span></span></span></div><div style="display: flex; align-items: center; gap: 10px; padding: 6px 14px 10px; border-bottom: 1px solid rgba(29,26,23,.1)"><span style="width: 28px; height: 28px; flex: none; border-radius: 14px 14px 5px 5px; background: #6B1E2E; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 5px; box-sizing: border-box"><span style="width: 7px; height: 7px; border-radius: 50%; background: #D8B56A"></span></span><span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 12px; font-weight: 700; color: #1D1A17">Noorvi</span><span style="font-size: 9px; color: #6B645A">Usually replies in minutes</span></span></div>
<div style="padding: 12px; display: flex; flex-direction: column; gap: 8px; color: #1D1A17">
<span class="as-ph-msg" style="align-self: flex-end; max-width: 78%; padding: 8px 11px; border-radius: 14px 14px 4px 14px; background: #E8DFD0; font-size: 11px; line-height: 1.4">Hi! Is the embroidered kurta available in M?</span>
<span class="as-ph-msg as-ph-m2" style="align-self: flex-start; max-width: 80%; padding: 8px 11px; border-radius: 14px 14px 14px 4px; background: #FFFFFF; font-size: 11px; line-height: 1.4">Yes, it is! Here’s your order:</span>
<div class="as-ph-msg as-ph-m3" style="align-self: flex-start; width: 82%; border-radius: 14px; background: #FFFFFF; overflow: hidden; box-shadow: 0 6px 16px -10px rgba(29,26,23,.4)"><div style="display: flex; gap: 10px; padding: 10px"><span style="width: 42px; height: 48px; flex: none; border-radius: 8px; background: linear-gradient(160deg, #7A2434, #3A1019)"></span><span style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 11px; font-weight: 700">Embroidered Kurta</span><span style="font-size: 10px; color: #6B645A">Size M · Qty 1</span><span style="font-size: 11px; font-weight: 700">Rs 6,450</span></span></div><span style="display: block; padding: 8px; text-align: center; border-top: 1px solid rgba(29,26,23,.1); font-size: 10px; font-weight: 700; color: #7A2434">Confirm order</span></div>
<span class="as-ph-msg as-ph-m4" style="align-self: flex-end; padding: 8px 11px; border-radius: 14px 14px 4px 14px; background: #E8DFD0; display: flex; gap: 4px"><span class="as-ph-dot" style="width: 5px; height: 5px; border-radius: 50%; background: #6B645A"></span><span class="as-ph-dot as-ph-d2" style="width: 5px; height: 5px; border-radius: 50%; background: #6B645A"></span><span class="as-ph-dot as-ph-d3" style="width: 5px; height: 5px; border-radius: 50%; background: #6B645A"></span></span>
</div></div>` : ''}
            ${(v.isC2) ? `<div data-key="k31" class="as-scr" style="position: absolute; inset: 0"><div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 18px 6px; font-size: 10px; font-weight: 700; color: #1D1A17"><span>9:41</span><span style="display: flex; gap: 4px; align-items: center"><span style="width: 14px; height: 7px; border-radius: 2px; border: 1px solid #1D1A17; box-sizing: border-box; padding: 1px"><span style="display: block; width: 70%; height: 100%; background: #1D1A17; border-radius: 1px"></span></span></span></div><div style="padding: 4px 14px 10px; font-size: 13px; font-weight: 700; color: #1D1A17">Checkout</div>
<div style="padding: 0 12px; display: flex; flex-direction: column; gap: 8px; color: #1D1A17">
<span style="display: flex; justify-content: space-between; padding: 10px 12px; border-radius: 12px; background: #FFFFFF; font-size: 11px"><span>Embroidered Kurta · M</span><span style="font-weight: 700">Rs 6,450</span></span>
<span style="font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #6B645A; margin-top: 4px">Pay with</span>
<span style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; border: 1px solid #7A2434; background: rgba(122,36,52,.05);"><span style="width: 14px; height: 14px; flex: none; border-radius: 50%; box-sizing: border-box; border: 4px solid #7A2434;"></span><span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 11px; font-weight: 700">Card</span><span style="font-size: 9px; color: #6B645A">Visa, Mastercard</span></span></span><span style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(29,26,23,.1);"><span style="width: 14px; height: 14px; flex: none; border-radius: 50%; box-sizing: border-box; border: 1px solid rgba(29,26,23,.3);"></span><span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 11px; font-weight: 700">Bank transfer</span><span style="font-size: 9px; color: #6B645A">Direct to your account</span></span></span><span style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(29,26,23,.1);"><span style="width: 14px; height: 14px; flex: none; border-radius: 50%; box-sizing: border-box; border: 1px solid rgba(29,26,23,.3);"></span><span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 11px; font-weight: 700">Cash on delivery</span><span style="font-size: 9px; color: #6B645A">Pay when it arrives</span></span></span>
<span class="as-ph-pay" style="margin-top: 6px; height: 38px; border-radius: 999px; background: #2A0E14; color: #F7F3EC; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center">Pay Rs 6,450</span>
</div>
<div class="as-ph-ok" style="position: absolute; inset: 0; background: #F7F3EC; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #1D1A17"><span style="width: 54px; height: 54px; border-radius: 50%; background: #7A2434; color: #F7F3EC; display: flex; align-items: center; justify-content: center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></span><span style="font-size: 14px; font-weight: 700">Payment received</span><span style="font-size: 11px; color: #6B645A">Order #1042 · Rs 6,450</span></div></div>` : ''}
            ${(v.isC3) ? `<div data-key="k32" class="as-scr" style="position: absolute; inset: 0"><div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 18px 6px; font-size: 10px; font-weight: 700; color: #1D1A17"><span>9:41</span><span style="display: flex; gap: 4px; align-items: center"><span style="width: 14px; height: 7px; border-radius: 2px; border: 1px solid #1D1A17; box-sizing: border-box; padding: 1px"><span style="display: block; width: 70%; height: 100%; background: #1D1A17; border-radius: 1px"></span></span></span></div><div style="padding: 4px 14px 0; display: flex; flex-direction: column; gap: 2px; color: #1D1A17"><span style="font-size: 13px; font-weight: 700">Track order #1042</span><span style="font-size: 10px; color: #6B645A">Arrives tomorrow · Lahore</span></div>
<div style="margin: 12px; height: 110px; border-radius: 14px; background: repeating-linear-gradient(0deg, rgba(29,26,23,.05) 0 1px, transparent 1px 18px), repeating-linear-gradient(90deg, rgba(29,26,23,.05) 0 1px, transparent 1px 18px), #EFE8DC; position: relative; overflow: hidden"><svg viewBox="0 0 220 110" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style="position: absolute; inset: 0"><path d="M20 90 C70 90 60 30 110 40 C150 48 160 20 200 22" fill="none" stroke="#7A2434" stroke-width="2.5" stroke-dasharray="5 5" stroke-linecap="round"></path></svg><span class="as-ph-van" style="position: absolute; left: 46%; top: 30%; width: 26px; height: 26px; border-radius: 50%; background: #2A0E14; color: #F7F3EC; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 5px rgba(122,36,52,.18)"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h11v9H3z"></path><path d="M14 10h4l3 3v3h-7z"></path></svg></span></div>
<div style="padding: 0 16px; display: flex; flex-direction: column; gap: 12px; color: #1D1A17"><span class="as-ph-step" style="display: flex; gap: 12px; align-items: flex-start; opacity: 1"><span style="width: 18px; height: 18px; flex: none; border-radius: 50%; background: #7A2434; color: #F7F3EC; display: flex; align-items: center; justify-content: center"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></span><span style="display: flex; flex-direction: column; gap: 1px; padding-top: 1px"><span style="font-size: 11px; font-weight: 700">Order placed</span><span style="font-size: 9px; color: #6B645A">Today, 11:02 AM</span></span></span><span class="as-ph-step" style="display: flex; gap: 12px; align-items: flex-start; opacity: 1"><span style="width: 18px; height: 18px; flex: none; border-radius: 50%; background: #7A2434; color: #F7F3EC; display: flex; align-items: center; justify-content: center"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></span><span style="display: flex; flex-direction: column; gap: 1px; padding-top: 1px"><span style="font-size: 11px; font-weight: 700">Packed &amp; handed to courier</span><span style="font-size: 9px; color: #6B645A">Today, 4:30 PM</span></span></span><span class="as-ph-step" style="display: flex; gap: 12px; align-items: flex-start; opacity: 1"><span class="as-ph-now" style="width: 18px; height: 18px; flex: none; border-radius: 50%; border: 5px solid #7A2434; box-sizing: border-box; background: #F7F3EC"></span><span style="display: flex; flex-direction: column; gap: 1px; padding-top: 1px"><span style="font-size: 11px; font-weight: 700">Out for delivery</span><span style="font-size: 9px; color: #6B645A">Rider on the way</span></span></span><span class="as-ph-step" style="display: flex; gap: 12px; align-items: flex-start; opacity: .5"><span style="width: 18px; height: 18px; flex: none; border-radius: 50%; border: 1.5px solid rgba(29,26,23,.25); box-sizing: border-box"></span><span style="display: flex; flex-direction: column; gap: 1px; padding-top: 1px"><span style="font-size: 11px; font-weight: 700">Delivered</span><span style="font-size: 9px; color: #6B645A">Expected tomorrow</span></span></span></div></div>` : ''}
            <span style="position: absolute; left: 50%; top: 8px; transform: translateX(-50%); width: 74px; height: 20px; border-radius: 12px; background: #0E0E0E; z-index: 2"></span>
          </div>
        </div>
        <span style="position: absolute; left: 24px; bottom: 22px; font-size: 13px; font-weight: 600; display: flex; gap: 8px"><span style="color: var(--accent-text)">${esc(v.connNum)}</span>${esc(v.connStage)}</span>
        <span style="position: absolute; right: 24px; bottom: 24px; display: flex; gap: 6px"><span style="width: ${esc(v.cd0)}; height: 4px; border-radius: 4px; background: ${esc(v.cc0)}; transition: width .35s ease, background .35s ease"></span><span style="width: ${esc(v.cd1)}; height: 4px; border-radius: 4px; background: ${esc(v.cc1)}; transition: width .35s ease, background .35s ease"></span><span style="width: ${esc(v.cd2)}; height: 4px; border-radius: 4px; background: ${esc(v.cc2)}; transition: width .35s ease, background .35s ease"></span><span style="width: ${esc(v.cd3)}; height: 4px; border-radius: 4px; background: ${esc(v.cc3)}; transition: width .35s ease, background .35s ease"></span></span>
      </div>
    </div>
  `,
  who: (v) => `
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 24px 48px">
      <div style="flex: 1 1 460px; display: flex; flex-direction: column; gap: 16px">
        <span style="font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--muted)">Who it’s for</span>
        <h2 style="margin: 0; font-size: clamp(34px, 4.4vw, 52px); line-height: 1.06; font-weight: 600; letter-spacing: -.035em">Built for brands<br><span style="color: var(--dim)">like yours</span></h2>
      </div>
      <p style="margin: 0; flex: 1 1 320px; max-width: 400px; font-size: 16px; line-height: 1.65; color: var(--muted)">Every business sells differently. We shape your site around how your customers actually discover you, decide and buy.</p>
    </div>

    <div role="group" aria-label="Choose your type of business" class="as-uc-tabs" style="margin-top: 56px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))">
      ${(v.useCases).map((uc, i_uc) => `
        <button type="button" data-act="useCases.pick" data-idx="${i_uc}" aria-pressed="${esc(uc.active)}" class="as-tab" style="position: relative; font: inherit; text-align: left; cursor: pointer; border: none; border-top: 2px solid ${esc(uc.bar)}; background: transparent; color: ${esc(uc.tabFg)}; padding: 18px 20px 20px 0; display: flex; flex-direction: column; gap: 6px; min-height: 44px">
          ${(uc.prog) ? `<span data-key="k33-${i_uc}" class="as-tabprog" aria-hidden="true" style="position: absolute; left: 0; top: -2px; height: 2px; background: var(--accent)"></span>` : ''}<span style="font-size: 12px; font-weight: 600; color: ${esc(uc.numColor)}">${esc(uc.num)}</span>
          <span style="font-size: 16px; font-weight: 600; letter-spacing: -.01em">${esc(uc.title)}</span>
        </button>
      `).join('')}
    </div>

    <div class="as-glass" style="margin-top: 20px; border-radius: 20px; border: 1px solid var(--line); background: var(--surface); padding: 12px">
        ${(v.isUc0) ? `
        <div data-key="k34" class="as-swap" style="display: flex; flex-wrap: wrap; gap: 12px">
          <div style="flex: 1 1 320px; min-width: 0; padding: 28px 24px; display: flex; flex-direction: column; gap: 18px">
            <span style="font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--muted)">${esc(v.cur.num)} / 04</span>
            <h3 style="margin: 0; font-size: 28px; line-height: 1.15; font-weight: 600; letter-spacing: -.03em">${esc(v.cur.title)}</h3>
            <p style="margin: 0; max-width: 380px; font-size: 15px; line-height: 1.65; color: var(--muted)">${esc(v.cur.desc)}</p>
            <div style="margin-top: 6px; padding-top: 18px; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 12px">
              <span style="font-size: 13px; font-weight: 600">What we build</span>
              ${(v.cur.bullets).map((bl, i_bl) => `
                <span style="display: flex; align-items: center; gap: 10px; font-size: 14px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="stroke: var(--accent-text)"><path d="M5 12l5 5L19 7"></path></svg>${esc(bl.label)}</span>
              `).join('')}
            </div>
            <a href="#book" style="margin-top: auto; padding-top: 12px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; min-height: 44px">Talk to us about your brand<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path></svg></a>
          </div>
          <div class="as-swap-2" style="flex: 1.25 1 380px; min-width: 0; min-height: 440px; border-radius: 14px; background: var(--well); padding: 36px 28px 48px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden"><div style="position: relative; width: 100%; max-width: 420px">
  <div style="border-radius: 16px; background: #FFFFFF; box-shadow: 0 24px 50px -28px rgba(0,0,0,.45); background: #F7F3EC; color: #1D1A17; overflow: hidden">
    <div style="display: flex; align-items: center; gap: 8px; padding: 9px 12px; background: #ECE7DE; font-size: 10px; color: #5C564D"><span style="display: flex; gap: 4px"><span style="width: 7px; height: 7px; border-radius: 50%; background: #D5CFC4"></span><span style="width: 7px; height: 7px; border-radius: 50%; background: #D5CFC4"></span><span style="width: 7px; height: 7px; border-radius: 50%; background: #D5CFC4"></span></span><span style="flex: 1; text-align: center">noorvi.pk/eid-edit</span></div>
    <div style="padding: 12px 14px 0; display: flex; justify-content: space-between; align-items: center; font-size: 9px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: #5C564D"><span style="font-size: 11px; font-weight: 800; letter-spacing: .26em; color: #1D1A17">NOORVI</span><span>Eid Edit · Lookbook · Bag</span></div>
    <div class="as-wp" style="margin: 12px 14px; border-radius: 12px; padding: 16px; background: radial-gradient(circle, rgba(216,181,106,.14) 0 1px, transparent 1.6px) 0 0 / 12px 12px, linear-gradient(135deg, #3A1019, #220A10); color: #F7F3EC; display: flex; justify-content: space-between; align-items: center; gap: 10px"><span style="display: flex; flex-direction: column; gap: 6px"><span style="font-size: 9px; font-weight: 600; letter-spacing: .2em; color: #D8B56A">FESTIVE ’26 · LIMITED DROP</span><span style="font-size: 22px; font-weight: 700; letter-spacing: -.04em; line-height: 1">The Eid Edit</span><span style="align-self: flex-start; margin-top: 2px; font-size: 9px; font-weight: 700; padding: 5px 11px; border-radius: 999px; background: #D8B56A; color: #2A0E14">Shop the drop</span></span><span style="width: 64px; height: 84px; flex: none; border-radius: 32px 32px 8px 8px; background: linear-gradient(170deg, #8A2A3C, #5A1726); display: flex; align-items: flex-end; justify-content: center; padding-bottom: 6px; box-sizing: border-box"><svg viewBox="0 0 100 120" width="46" aria-hidden="true" style="height: auto"><path d="M38 8 L30 11 L14 21 L9 48 L19 50 L24 33 L26 112 L74 112 L76 33 L81 50 L91 48 L86 21 L70 11 L62 8 Q50 19 38 8 Z" fill="rgba(247,243,236,.1)" stroke="rgba(247,243,236,.55)" stroke-width="1.3" stroke-linejoin="round"></path><path d="M38 8 Q50 19 62 8" fill="none" stroke="#D8B56A" stroke-width="2.6" stroke-linecap="round"></path><path d="M50 17 L50 46" fill="none" stroke="#D8B56A" stroke-width="1.8" stroke-dasharray="1.5 3"></path></svg></span></div>
    <div class="as-noorvi-grid" style="padding: 0 14px 16px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px"><div class="as-wp as-wd1" style="display: flex; flex-direction: column; gap: 6px; min-width: 0"><div class="as-wz" style="aspect-ratio: 3 / 4; border-radius: 10px; background: radial-gradient(circle, rgba(216,181,106,.5) 0 1.1px, transparent 1.7px) 0 0 / 10px 10px, linear-gradient(160deg, #7A2434, #4A1320); display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px; box-sizing: border-box; overflow: hidden"><svg viewBox="0 0 100 120" width="54" aria-hidden="true" style="height: auto"><path d="M38 8 L30 11 L14 21 L9 48 L19 50 L24 33 L26 112 L74 112 L76 33 L81 50 L91 48 L86 21 L70 11 L62 8 Q50 19 38 8 Z" fill="rgba(247,243,236,.1)" stroke="rgba(247,243,236,.55)" stroke-width="1.3" stroke-linejoin="round"></path><path d="M38 8 Q50 19 62 8" fill="none" stroke="#D8B56A" stroke-width="2.6" stroke-linecap="round"></path><path d="M50 17 L50 46" fill="none" stroke="#D8B56A" stroke-width="1.8" stroke-dasharray="1.5 3"></path></svg></div><span style="font-size: 10px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">Embroidered Kurta</span><span style="font-size: 10px; color: #6B645A">Rs 6,450</span></div><div class="as-wp as-wd2" style="display: flex; flex-direction: column; gap: 6px; min-width: 0"><div class="as-wz" style="aspect-ratio: 3 / 4; border-radius: 10px; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.4) 0 1.8px, transparent 2.4px) 0 0 / 13px 13px, linear-gradient(160deg, #A9B59A, #7F8E70); display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px; box-sizing: border-box; overflow: hidden"><svg viewBox="0 0 100 120" width="54" aria-hidden="true" style="height: auto"><path d="M38 8 L30 11 L14 21 L9 48 L19 50 L24 33 L26 112 L74 112 L76 33 L81 50 L91 48 L86 21 L70 11 L62 8 Q50 19 38 8 Z" fill="rgba(247,243,236,.1)" stroke="rgba(247,243,236,.55)" stroke-width="1.3" stroke-linejoin="round"></path><path d="M38 8 Q50 19 62 8" fill="none" stroke="#D8B56A" stroke-width="2.6" stroke-linecap="round"></path><path d="M50 17 L50 46" fill="none" stroke="#D8B56A" stroke-width="1.8" stroke-dasharray="1.5 3"></path></svg></div><span style="font-size: 10px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">Printed Lawn 3-Pc</span><span style="font-size: 10px; color: #6B645A">Rs 8,900</span></div><div class="as-wp as-wd3" style="display: flex; flex-direction: column; gap: 6px; min-width: 0"><div class="as-wz" style="aspect-ratio: 3 / 4; border-radius: 10px; background: repeating-linear-gradient(135deg, rgba(255,255,255,.2) 0 5px, transparent 5px 12px), linear-gradient(160deg, #E2C98E, #B8913F); display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px; box-sizing: border-box; overflow: hidden"></div><span style="font-size: 10px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">Silk Dupatta</span><span style="font-size: 10px; color: #6B645A">Rs 3,200</span></div></div>
  </div>
  <div class="as-wt" style="position: absolute; right: -10px; bottom: -18px; display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 14px; background: #2A0E14; color: #F7F3EC; box-shadow: 0 18px 36px -18px rgba(0,0,0,.6)"><span style="width: 22px; height: 22px; border-radius: 50%; background: #D8B56A; color: #2A0E14; display: flex; align-items: center; justify-content: center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></span><span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 11px; font-weight: 700">Added to bag</span><span style="font-size: 10px; opacity: .7">Embroidered Kurta · M</span></span></div>
</div></div>
        </div>
        ` : ''}
        ${(v.isUc1) ? `
        <div data-key="k35" class="as-swap" style="display: flex; flex-wrap: wrap; gap: 12px">
          <div style="flex: 1 1 320px; min-width: 0; padding: 28px 24px; display: flex; flex-direction: column; gap: 18px">
            <span style="font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--muted)">${esc(v.cur.num)} / 04</span>
            <h3 style="margin: 0; font-size: 28px; line-height: 1.15; font-weight: 600; letter-spacing: -.03em">${esc(v.cur.title)}</h3>
            <p style="margin: 0; max-width: 380px; font-size: 15px; line-height: 1.65; color: var(--muted)">${esc(v.cur.desc)}</p>
            <div style="margin-top: 6px; padding-top: 18px; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 12px">
              <span style="font-size: 13px; font-weight: 600">What we build</span>
              ${(v.cur.bullets).map((bl, i_bl) => `
                <span style="display: flex; align-items: center; gap: 10px; font-size: 14px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="stroke: var(--accent-text)"><path d="M5 12l5 5L19 7"></path></svg>${esc(bl.label)}</span>
              `).join('')}
            </div>
            <a href="#book" style="margin-top: auto; padding-top: 12px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; min-height: 44px">Talk to us about your brand<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path></svg></a>
          </div>
          <div class="as-swap-2" style="flex: 1.25 1 380px; min-width: 0; min-height: 440px; border-radius: 14px; background: var(--well); padding: 36px 28px 48px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden"><div style="position: relative; width: 100%; max-width: 420px; height: 380px">
  <div class="as-wp" style="position: absolute; left: 0; top: 0; width: 60%; border-radius: 16px; background: #FFFFFF; box-shadow: 0 24px 50px -28px rgba(0,0,0,.45); padding: 14px; box-sizing: border-box; color: #2B2118">
    <div style="display: flex; align-items: center; gap: 10px"><span style="width: 42px; height: 42px; border-radius: 50%; background: conic-gradient(#C8752F, #E7B77A, #C8752F); padding: 2px; box-sizing: border-box"><span style="display: block; width: 100%; height: 100%; border-radius: 50%; background: #3B2A1E; border: 2px solid #FFFFFF; box-sizing: border-box"></span></span><span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 12px; font-weight: 700">ambar.studio</span><span style="font-size: 10px; color: #7A6A5A">Hand-poured candles · Lahore</span></span></div>
    <span class="as-wtap" style="position: relative; display: inline-flex; margin-top: 10px; font-size: 11px; font-weight: 700; color: #C8752F">ambar.pk/shop<span class="as-wripple" style="position: absolute; left: 30%; top: 50%; width: 30px; height: 30px; margin: -15px 0 0 -15px; border-radius: 50%; background: rgba(200,117,47,.35)"></span></span>
    <div style="margin-top: 12px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px"><span class="as-wp as-wd1" style="aspect-ratio: 1; border-radius: 6px; background: linear-gradient(160deg,#E7B77A,#C8752F)"></span><span class="as-wp as-wd2" style="aspect-ratio: 1; border-radius: 6px; background: linear-gradient(160deg,#3B2A1E,#6A4A33)"></span><span class="as-wp as-wd3" style="aspect-ratio: 1; border-radius: 6px; background: linear-gradient(160deg,#F2E3CC,#DDBF94)"></span><span class="as-wp as-wd1" style="aspect-ratio: 1; border-radius: 6px; background: linear-gradient(160deg,#C8752F,#8E4A1C)"></span><span class="as-wp as-wd2" style="aspect-ratio: 1; border-radius: 6px; background: linear-gradient(160deg,#F2E3CC,#E7B77A)"></span><span class="as-wp as-wd3" style="aspect-ratio: 1; border-radius: 6px; background: linear-gradient(160deg,#6A4A33,#3B2A1E)"></span></div>
  </div>
  <div class="as-wup" style="position: absolute; right: 0; bottom: 0; width: 58%; border-radius: 16px; background: #FFFFFF; box-shadow: 0 24px 50px -28px rgba(0,0,0,.45); overflow: hidden; color: #2B2118; background: #FBF6EE">
    <div style="padding: 9px 12px; font-size: 10px; color: #7A6A5A; text-align: center; border-bottom: 1px solid rgba(43,33,24,.08)">ambar.pk/shop</div>
    <div style="padding: 12px; display: flex; flex-direction: column; gap: 10px">
      <span style="font-size: 9px; font-weight: 700; letter-spacing: .18em; color: #C8752F">BEST SELLERS</span>
      <span style="display: flex; align-items: center; gap: 10px"><span style="width: 40px; height: 40px; border-radius: 8px; background: linear-gradient(160deg,#E7B77A,#C8752F)"></span><span style="flex: 1; display: flex; flex-direction: column; gap: 1px"><span style="font-size: 11px; font-weight: 700">Oud &amp; Amber</span><span style="font-size: 10px; color: #7A6A5A">Rs 2,400</span></span></span>
      <span style="display: flex; align-items: center; gap: 10px"><span style="width: 40px; height: 40px; border-radius: 8px; background: linear-gradient(160deg,#F2E3CC,#DDBF94)"></span><span style="flex: 1; display: flex; flex-direction: column; gap: 1px"><span style="font-size: 11px; font-weight: 700">Gift Box Set</span><span style="font-size: 10px; color: #7A6A5A">Rs 5,800</span></span></span>
      <span class="as-wpress" style="height: 32px; border-radius: 999px; background: #2B2118; color: #FBF6EE; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center">Order on WhatsApp</span>
    </div>
  </div>
  <svg class="as-warrow" width="70" height="60" viewBox="0 0 70 60" aria-hidden="true" style="position: absolute; left: 38%; top: 46%"><path d="M4 6 C30 6 46 22 52 48" fill="none" stroke="#FF3B30" stroke-width="1.8" stroke-dasharray="4 4" stroke-linecap="round"></path><path d="M45 42 L52 50 L58 41" fill="none" stroke="#FF3B30" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
</div></div>
        </div>
        ` : ''}
        ${(v.isUc2) ? `
        <div data-key="k36" class="as-swap" style="display: flex; flex-wrap: wrap; gap: 12px">
          <div style="flex: 1 1 320px; min-width: 0; padding: 28px 24px; display: flex; flex-direction: column; gap: 18px">
            <span style="font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--muted)">${esc(v.cur.num)} / 04</span>
            <h3 style="margin: 0; font-size: 28px; line-height: 1.15; font-weight: 600; letter-spacing: -.03em">${esc(v.cur.title)}</h3>
            <p style="margin: 0; max-width: 380px; font-size: 15px; line-height: 1.65; color: var(--muted)">${esc(v.cur.desc)}</p>
            <div style="margin-top: 6px; padding-top: 18px; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 12px">
              <span style="font-size: 13px; font-weight: 600">What we build</span>
              ${(v.cur.bullets).map((bl, i_bl) => `
                <span style="display: flex; align-items: center; gap: 10px; font-size: 14px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="stroke: var(--accent-text)"><path d="M5 12l5 5L19 7"></path></svg>${esc(bl.label)}</span>
              `).join('')}
            </div>
            <a href="#book" style="margin-top: auto; padding-top: 12px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; min-height: 44px">Talk to us about your brand<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path></svg></a>
          </div>
          <div class="as-swap-2" style="flex: 1.25 1 380px; min-width: 0; min-height: 440px; border-radius: 14px; background: var(--well); padding: 36px 28px 48px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden"><div style="position: relative; width: 100%; max-width: 420px; height: 390px">
  <div class="as-wp" style="position: absolute; left: 0; top: 0; width: 76%; border-radius: 16px; background: #FFFFFF; box-shadow: 0 24px 50px -28px rgba(0,0,0,.45); padding: 16px; box-sizing: border-box; color: #1F2A22; background: #F6F4EE">
    <div style="display: flex; align-items: center; gap: 10px"><span style="width: 34px; height: 34px; border-radius: 10px; background: #4F6B57; color: #F6F4EE; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center">S</span><span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 12px; font-weight: 700">Saffron Salon</span><span style="font-size: 10px; color: #5F6B62">Book a visit · Open today</span></span></div>
    <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 8px">
      <span class="as-wp as-wd1" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-radius: 12px; border: 1.5px solid #4F6B57; background: rgba(79,107,87,.06)"><span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 11px; font-weight: 700">Signature cut &amp; style</span><span style="font-size: 10px; color: #5F6B62">60 min</span></span><span style="font-size: 11px; font-weight: 700">Rs 3,500</span></span>
      <span class="as-wp as-wd2" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(31,42,34,.12)"><span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 11px; font-weight: 700">Colour consultation</span><span style="font-size: 10px; color: #5F6B62">20 min · Free</span></span><span style="font-size: 11px; font-weight: 700">Free</span></span>
    </div>
    <span style="display: block; margin-top: 14px; font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #5F6B62">Tomorrow</span>
    <div style="margin-top: 8px; display: flex; gap: 6px"><span class="" style="font-size: 10px; font-weight: 700; padding: 7px 0; flex: 1; text-align: center; border-radius: 8px; border: 1px solid rgba(31,42,34,.15)">11:00</span><span class="" style="font-size: 10px; font-weight: 700; padding: 7px 0; flex: 1; text-align: center; border-radius: 8px; border: 1px solid rgba(31,42,34,.15)">12:30</span><span class="as-wpick" style="font-size: 10px; font-weight: 700; padding: 7px 0; flex: 1; text-align: center; border-radius: 8px; border: 1px solid rgba(31,42,34,.15)">2:00</span><span class="" style="font-size: 10px; font-weight: 700; padding: 7px 0; flex: 1; text-align: center; border-radius: 8px; border: 1px solid rgba(31,42,34,.15)">4:30</span></div>
    <span class="as-wbook" style="margin-top: 14px; height: 34px; border-radius: 999px; background: #1F2A22; color: #F6F4EE; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center">Book 2:00 PM</span>
  </div>
  <div class="as-wup" style="position: absolute; right: 0; bottom: 0; width: 44%; border-radius: 16px; background: #FFFFFF; box-shadow: 0 24px 50px -28px rgba(0,0,0,.45); overflow: hidden; color: #1F2A22">
    <div style="position: relative; height: 96px; background: repeating-linear-gradient(0deg, rgba(31,42,34,.06) 0 1px, transparent 1px 16px), repeating-linear-gradient(90deg, rgba(31,42,34,.06) 0 1px, transparent 1px 16px), #E9EEE6"><span class="as-wpin" style="position: absolute; left: 50%; top: 22px; width: 22px; height: 22px; margin-left: -11px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: #4F6B57; box-shadow: 0 6px 12px -4px rgba(0,0,0,.35)"></span></div>
    <div style="padding: 10px 12px; display: flex; flex-direction: column; gap: 2px"><span style="font-size: 11px; font-weight: 700">Get directions</span><span style="font-size: 10px; color: #5F6B62">F-7 Markaz, Islamabad</span></div>
  </div>
  <div class="as-wt" style="position: absolute; left: 8%; bottom: 26px; display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 14px; background: #4F6B57; color: #F6F4EE; box-shadow: 0 18px 36px -18px rgba(0,0,0,.6)"><span style="width: 22px; height: 22px; border-radius: 50%; background: #F6F4EE; color: #4F6B57; display: flex; align-items: center; justify-content: center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></span><span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 11px; font-weight: 700">Booked for 2:00 PM</span><span style="font-size: 10px; opacity: .8">Confirmation sent on WhatsApp</span></span></div>
</div></div>
        </div>
        ` : ''}
        ${(v.isUc3) ? `
        <div data-key="k37" class="as-swap" style="display: flex; flex-wrap: wrap; gap: 12px">
          <div style="flex: 1 1 320px; min-width: 0; padding: 28px 24px; display: flex; flex-direction: column; gap: 18px">
            <span style="font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--muted)">${esc(v.cur.num)} / 04</span>
            <h3 style="margin: 0; font-size: 28px; line-height: 1.15; font-weight: 600; letter-spacing: -.03em">${esc(v.cur.title)}</h3>
            <p style="margin: 0; max-width: 380px; font-size: 15px; line-height: 1.65; color: var(--muted)">${esc(v.cur.desc)}</p>
            <div style="margin-top: 6px; padding-top: 18px; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 12px">
              <span style="font-size: 13px; font-weight: 600">What we build</span>
              ${(v.cur.bullets).map((bl, i_bl) => `
                <span style="display: flex; align-items: center; gap: 10px; font-size: 14px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="stroke: var(--accent-text)"><path d="M5 12l5 5L19 7"></path></svg>${esc(bl.label)}</span>
              `).join('')}
            </div>
            <a href="#book" style="margin-top: auto; padding-top: 12px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; min-height: 44px">Talk to us about your brand<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path></svg></a>
          </div>
          <div class="as-swap-2" style="flex: 1.25 1 380px; min-width: 0; min-height: 440px; border-radius: 14px; background: var(--well); padding: 36px 28px 48px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden"><div style="position: relative; width: 100%; max-width: 400px">
  <div class="as-wp" style="border-radius: 16px; background: #FFFFFF; box-shadow: 0 24px 50px -28px rgba(0,0,0,.45); overflow: hidden; background: #1E1B1C; color: #F3E7E3; padding: 26px 22px 22px; display: flex; flex-direction: column; gap: 14px; position: relative">
    <span class="as-wglow" aria-hidden="true" style="position: absolute; right: -60px; top: -60px; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, rgba(232,164,164,.45), transparent 70%)"></span>
    <span style="position: relative; font-size: 10px; font-weight: 700; letter-spacing: .24em; color: #E8A4A4">LAUNCHING SOON</span>
    <span style="position: relative; font-size: 40px; font-weight: 700; letter-spacing: -.05em; line-height: .9">rawa<span style="color: #E8A4A4">.</span></span>
    <span style="position: relative; font-size: 12px; line-height: 1.5; color: rgba(243,231,227,.7)">Clean skincare, made in small batches in Karachi.</span>
    <div style="position: relative; display: flex; gap: 6px">
      <span style="display: flex; flex-direction: column; align-items: center; padding: 8px 10px; border-radius: 10px; background: rgba(243,231,227,.08); min-width: 44px"><span style="font-size: 16px; font-weight: 700">06</span><span style="font-size: 8px; letter-spacing: .1em; opacity: .6">DAYS</span></span>
      <span style="display: flex; flex-direction: column; align-items: center; padding: 8px 10px; border-radius: 10px; background: rgba(243,231,227,.08); min-width: 44px"><span style="font-size: 16px; font-weight: 700">14</span><span style="font-size: 8px; letter-spacing: .1em; opacity: .6">HRS</span></span>
      <span style="display: flex; flex-direction: column; align-items: center; padding: 8px 10px; border-radius: 10px; background: rgba(243,231,227,.08); min-width: 44px"><span style="font-size: 16px; font-weight: 700">32</span><span style="font-size: 8px; letter-spacing: .1em; opacity: .6">MIN</span></span>
      <span style="display: flex; flex-direction: column; align-items: center; padding: 8px 10px; border-radius: 10px; background: rgba(232,164,164,.16); min-width: 44px; overflow: hidden"><span style="height: 19px; overflow: hidden; display: block"><span class="as-wsec" style="display: flex; flex-direction: column; font-size: 16px; font-weight: 700; line-height: 19px"><span>09</span><span>08</span><span>07</span><span>06</span><span>05</span></span></span><span style="font-size: 8px; letter-spacing: .1em; opacity: .6">SEC</span></span>
    </div>
    <div style="position: relative; display: flex; gap: 6px; padding: 5px; border-radius: 999px; background: rgba(243,231,227,.08); align-items: center">
      <span style="flex: 1; padding-left: 10px; font-size: 11px; display: flex; align-items: center; min-width: 0"><span class="as-wtype" style="display: inline-block; overflow: hidden; white-space: nowrap">ayesha@gmail.com</span><span class="as-caret" style="width: 1.5px; height: 13px; margin-left: 1px; background: #F3E7E3"></span></span>
      <span class="as-wjoin" style="font-size: 10px; font-weight: 700; padding: 9px 14px; border-radius: 999px; background: #E8A4A4; color: #1E1B1C; white-space: nowrap">Join waitlist</span>
    </div>
  </div>
  <div class="as-wt" style="position: absolute; left: 50%; bottom: -20px; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 14px; background: #F3E7E3; color: #1E1B1C; box-shadow: 0 18px 36px -18px rgba(0,0,0,.6); white-space: nowrap"><span style="width: 22px; height: 22px; border-radius: 50%; background: #1E1B1C; color: #E8A4A4; display: flex; align-items: center; justify-content: center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></span><span style="font-size: 11px; font-weight: 700">You’re on the list. We’ll email you at launch.</span></div>
</div></div>
        </div>
        ` : ''}
    </div>
  `,
  process: (v) => `
    <div style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px">
      <span style="font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--muted)">How it works</span>
      <h2 style="margin: 0; font-size: clamp(32px, 4.2vw, 48px); line-height: 1.08; font-weight: 600; letter-spacing: -.035em">From first call to launch</h2>
      <p style="margin: 0; max-width: 520px; font-size: 16px; line-height: 1.6; color: var(--muted)">A clear four-step process. At every stage you know what’s happening, what comes next and what we need from you.</p>
    </div>
    <div class="as-pr-rail" aria-hidden="true" style="position: relative; margin-top: 52px; height: 30px">
      <span style="position: absolute; left: 12.5%; right: 12.5%; top: 50%; height: 2px; margin-top: -1px; background: var(--line)"></span>
      <span style="position: absolute; left: 12.5%; top: 50%; height: 2px; margin-top: -1px; width: ${esc(v.prFill)}; background: #FF3B30; transition: width .7s cubic-bezier(.2,.7,.2,1)"></span>
      <span class="as-pr-node" style="position: absolute; left: 12.5%; top: 50%; transform: translate(-50%, -50%); width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid ${esc(v.prNB0)}; background: ${esc(v.prNBg0)}; color: ${esc(v.prNC0)}; box-shadow: ${esc(v.prNS0)}; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; transition: all .4s ease">1</span><span class="as-pr-node" style="position: absolute; left: 37.5%; top: 50%; transform: translate(-50%, -50%); width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid ${esc(v.prNB1)}; background: ${esc(v.prNBg1)}; color: ${esc(v.prNC1)}; box-shadow: ${esc(v.prNS1)}; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; transition: all .4s ease">2</span><span class="as-pr-node" style="position: absolute; left: 62.5%; top: 50%; transform: translate(-50%, -50%); width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid ${esc(v.prNB2)}; background: ${esc(v.prNBg2)}; color: ${esc(v.prNC2)}; box-shadow: ${esc(v.prNS2)}; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; transition: all .4s ease">3</span><span class="as-pr-node" style="position: absolute; left: 87.5%; top: 50%; transform: translate(-50%, -50%); width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid ${esc(v.prNB3)}; background: ${esc(v.prNBg3)}; color: ${esc(v.prNC3)}; box-shadow: ${esc(v.prNS3)}; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; transition: all .4s ease">4</span>
    </div>
    <div class="as-pr-grid" data-leave="leavePr" style="margin-top: 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px">
      <div class="as-pr" data-active="${esc(v.pr0)}" data-hover="hoverPr0" style="position: relative; border-radius: 20px; border: 1px solid var(--line); background: var(--surface); padding: 8px; display: flex; flex-direction: column">
        <div class="as-pr-vis" style="height: 190px; border-radius: 14px; background: var(--tint); padding: 18px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; overflow: hidden"><div style="position: relative; width: 100%; display: flex; flex-direction: column; gap: 7px"><span class="as-pr-row as-pr-d1" style="display: flex; justify-content: space-between; align-items: center; padding: 9px 12px; border-radius: 10px; background: var(--surface); border: 1px solid var(--line); font-size: 12px"><span style="font-weight: 600">Page speed</span><span class="as-pr-tag" style="font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px; background: #FF3B30; color: #0E0E0E">Fix</span></span><span class="as-pr-row as-pr-d2" style="display: flex; justify-content: space-between; align-items: center; padding: 9px 12px; border-radius: 10px; background: var(--surface); border: 1px solid var(--line); font-size: 12px"><span style="font-weight: 600">Mobile layout</span><span class="as-pr-tag" style="font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px; background: #FF3B30; color: #0E0E0E">Fix</span></span><span class="as-pr-row as-pr-d3" style="display: flex; justify-content: space-between; align-items: center; padding: 9px 12px; border-radius: 10px; background: var(--surface); border: 1px solid var(--line); font-size: 12px"><span style="font-weight: 600">Checkout flow</span><span class="as-pr-tag" style="font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px; border: 1px solid var(--line-strong)">Improve</span></span><span class="as-pr-scan" aria-hidden="true" style="position: absolute; left: -6px; right: -6px; top: 0; height: 2px; background: linear-gradient(90deg, transparent, #FF3B30, transparent); opacity: 0"></span></div></div>
        <div style="padding: 18px 12px 14px; display: flex; flex-direction: column; gap: 8px; flex: 1">
          <span class="as-pr-num" style="font-size: 12px; font-weight: 700; color: var(--muted)">01</span>
          <span style="font-size: 19px; font-weight: 600; letter-spacing: -.02em">Audit &amp; strategy</span>
          <span style="font-size: 14px; line-height: 1.6; color: var(--muted)">We review your site and socials, define your goals, and agree on scope, timeline and how we’ll measure success.</span>
          <span style="margin-top: auto; padding-top: 14px; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted)">You get</span><span style="display: flex; flex-wrap: wrap; gap: 6px"><span style="font-size: 11px; font-weight: 600; padding: 5px 9px; border-radius: 999px; border: 1px solid var(--line)">Free audit report</span><span style="font-size: 11px; font-weight: 600; padding: 5px 9px; border-radius: 999px; border: 1px solid var(--line)">Written quote</span></span></span>
        </div>
        <button type="button" class="as-svc-hit" data-act="pickPr0" aria-pressed="${esc(v.pr0)}" aria-label="Step 1: Audit and strategy" style="position: absolute; inset: 0; z-index: 2; width: 100%; border: none; border-radius: 20px; background: transparent; cursor: pointer"></button>
      </div>
      <div class="as-pr" data-active="${esc(v.pr1)}" data-hover="hoverPr1" style="position: relative; border-radius: 20px; border: 1px solid var(--line); background: var(--surface); padding: 8px; display: flex; flex-direction: column">
        <div class="as-pr-vis" style="height: 190px; border-radius: 14px; background: var(--tint); padding: 18px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; overflow: hidden"><div style="position: relative; width: 82%; border-radius: 12px; background: var(--surface); border: 1px solid var(--line); padding: 10px; display: flex; flex-direction: column; gap: 7px">
  <span class="as-pr-blk as-pr-d1" style="display: flex; justify-content: space-between; align-items: center"><span style="width: 34%; height: 6px; border-radius: 3px; background: var(--fg)"></span><span style="width: 22%; height: 6px; border-radius: 3px; background: var(--line-strong)"></span></span>
  <span class="as-pr-blk as-pr-d2" style="height: 54px; border-radius: 8px; background: var(--fg); opacity: .88"></span>
  <span class="as-pr-blk as-pr-d3" style="display: flex; gap: 6px"><span class="as-pr-btn" style="width: 46%; height: 16px; border-radius: 999px; background: #FF3B30"></span><span style="width: 34%; height: 16px; border-radius: 999px; border: 1px solid var(--line-strong); box-sizing: border-box"></span></span>
  <svg class="as-pr-cursor" width="18" height="18" viewBox="0 0 100 100" aria-hidden="true" style="position: absolute; left: 30%; top: 74%"><path d="M30 18 L30 78 L44 65 L53 86 L63 82 L54 61 L73 61 Z" fill="#0E0E0E" stroke="#F2F2F2" stroke-width="6" stroke-linejoin="round"></path></svg>
</div></div>
        <div style="padding: 18px 12px 14px; display: flex; flex-direction: column; gap: 8px; flex: 1">
          <span class="as-pr-num" style="font-size: 12px; font-weight: 700; color: var(--muted)">02</span>
          <span style="font-size: 19px; font-weight: 600; letter-spacing: -.02em">Design &amp; prototype</span>
          <span style="font-size: 14px; line-height: 1.6; color: var(--muted)">You approve a brand direction and a clickable prototype before a single line of code is written.</span>
          <span style="margin-top: auto; padding-top: 14px; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted)">You get</span><span style="display: flex; flex-wrap: wrap; gap: 6px"><span style="font-size: 11px; font-weight: 600; padding: 5px 9px; border-radius: 999px; border: 1px solid var(--line)">Brand direction</span><span style="font-size: 11px; font-weight: 600; padding: 5px 9px; border-radius: 999px; border: 1px solid var(--line)">Clickable prototype</span></span></span>
        </div>
        <button type="button" class="as-svc-hit" data-act="pickPr1" aria-pressed="${esc(v.pr1)}" aria-label="Step 2: Design and prototype" style="position: absolute; inset: 0; z-index: 2; width: 100%; border: none; border-radius: 20px; background: transparent; cursor: pointer"></button>
      </div>
      <div class="as-pr" data-active="${esc(v.pr2)}" data-hover="hoverPr2" style="position: relative; border-radius: 20px; border: 1px solid var(--line); background: var(--surface); padding: 8px; display: flex; flex-direction: column">
        <div class="as-pr-vis" style="height: 190px; border-radius: 14px; background: var(--tint); padding: 18px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; overflow: hidden"><div style="width: 100%; border-radius: 12px; background: var(--surface); border: 1px solid var(--line); padding: 12px; display: flex; flex-direction: column; gap: 9px; font-size: 12px">
  <span style="display: flex; justify-content: space-between"><span style="font-weight: 600">Preview link</span><span style="color: var(--muted)">Updated today</span></span>
  <span style="height: 4px; border-radius: 4px; background: var(--line-strong); overflow: hidden"><span class="as-pr-bar" style="display: block; width: 72%; height: 100%; background: #FF3B30"></span></span>
  <span class="as-pr-row as-pr-d1" style="display: flex; align-items: center; gap: 8px"><span style="width: 16px; height: 16px; border-radius: 50%; background: #FF3B30; color: #0E0E0E; display: flex; align-items: center; justify-content: center"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></span>Homepage</span>
  <span class="as-pr-row as-pr-d2" style="display: flex; align-items: center; gap: 8px"><span style="width: 16px; height: 16px; border-radius: 50%; background: #FF3B30; color: #0E0E0E; display: flex; align-items: center; justify-content: center"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></span>Shop &amp; product pages</span>
  <span class="as-pr-row as-pr-d3" style="display: flex; align-items: center; gap: 8px; color: var(--muted)"><span style="width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid var(--line-strong); box-sizing: border-box"></span>Checkout</span>
</div></div>
        <div style="padding: 18px 12px 14px; display: flex; flex-direction: column; gap: 8px; flex: 1">
          <span class="as-pr-num" style="font-size: 12px; font-weight: 700; color: var(--muted)">03</span>
          <span style="font-size: 19px; font-weight: 600; letter-spacing: -.02em">Development</span>
          <span style="font-size: 14px; line-height: 1.6; color: var(--muted)">We hand-code your site and share live progress links, so feedback is fast and nothing comes as a surprise.</span>
          <span style="margin-top: auto; padding-top: 14px; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted)">You get</span><span style="display: flex; flex-wrap: wrap; gap: 6px"><span style="font-size: 11px; font-weight: 600; padding: 5px 9px; border-radius: 999px; border: 1px solid var(--line)">Live preview link</span><span style="font-size: 11px; font-weight: 600; padding: 5px 9px; border-radius: 999px; border: 1px solid var(--line)">Progress updates</span></span></span>
        </div>
        <button type="button" class="as-svc-hit" data-act="pickPr2" aria-pressed="${esc(v.pr2)}" aria-label="Step 3: Development" style="position: absolute; inset: 0; z-index: 2; width: 100%; border: none; border-radius: 20px; background: transparent; cursor: pointer"></button>
      </div>
      <div class="as-pr" data-active="${esc(v.pr3)}" data-hover="hoverPr3" style="position: relative; border-radius: 20px; border: 1px solid var(--line); background: var(--surface); padding: 8px; display: flex; flex-direction: column">
        <div class="as-pr-vis" style="height: 190px; border-radius: 14px; background: var(--tint); padding: 18px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; overflow: hidden"><div style="display: flex; flex-direction: column; align-items: center; gap: 14px">
  <span class="as-pr-live" style="position: relative; border-radius: 999px; background: var(--surface); border: 1px solid var(--line); padding: 11px 18px; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 10px; box-shadow: 0 12px 30px -16px rgba(0,0,0,.4)"><span style="position: relative; width: 10px; height: 10px"><span class="as-pr-ping" style="position: absolute; inset: 0; border-radius: 50%; background: #FF3B30"></span><span style="position: absolute; inset: 0; border-radius: 50%; background: #FF3B30"></span></span>yourbrand.pk is live</span>
  <span style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center"><span class="as-pr-row as-pr-d1" style="display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 5px 9px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface)"><span style="color: #FF3B30; display: flex"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></span>Domain</span><span class="as-pr-row as-pr-d2" style="display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 5px 9px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface)"><span style="color: #FF3B30; display: flex"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></span>Payments</span><span class="as-pr-row as-pr-d3" style="display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 5px 9px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface)"><span style="color: #FF3B30; display: flex"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></span>Analytics</span></span>
</div></div>
        <div style="padding: 18px 12px 14px; display: flex; flex-direction: column; gap: 8px; flex: 1">
          <span class="as-pr-num" style="font-size: 12px; font-weight: 700; color: var(--muted)">04</span>
          <span style="font-size: 19px; font-weight: 600; letter-spacing: -.02em">Launch &amp; support</span>
          <span style="font-size: 14px; line-height: 1.6; color: var(--muted)">We set up your domain, hosting, payments and analytics, take the site live and stay on call after launch.</span>
          <span style="margin-top: auto; padding-top: 14px; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--muted)">You get</span><span style="display: flex; flex-wrap: wrap; gap: 6px"><span style="font-size: 11px; font-weight: 600; padding: 5px 9px; border-radius: 999px; border: 1px solid var(--line)">Live website</span><span style="font-size: 11px; font-weight: 600; padding: 5px 9px; border-radius: 999px; border: 1px solid var(--line)">Ongoing support</span></span></span>
        </div>
        <button type="button" class="as-svc-hit" data-act="pickPr3" aria-pressed="${esc(v.pr3)}" aria-label="Step 4: Launch and support" style="position: absolute; inset: 0; z-index: 2; width: 100%; border: none; border-radius: 20px; background: transparent; cursor: pointer"></button>
      </div>
    </div>
    <div class="as-glass" style="margin-top: 28px; border-radius: 20px; border: 1px solid var(--line); background: var(--surface); padding: 22px 24px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px">
      <span style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 18px; font-weight: 600; letter-spacing: -.02em">Step 1 is free.</span><span style="font-size: 14px; color: var(--muted)">Book a strategy call and get your website audit. No obligation, and a clear written quote before any work starts.</span></span>
      <a href="#book" class="as-btn" style="text-decoration: none; background: #FF3B30; color: #0E0E0E; font-weight: 600; font-size: 15px; padding: 12px 22px; border-radius: 12px; min-height: 46px; box-sizing: border-box; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap">Start with step 1<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path></svg></a>
    </div>
  `,
  book: (v) => `
    <div style="display: flex; flex-wrap: wrap; gap: 56px; align-items: flex-start">

      <div style="flex: 1 1 340px; min-width: 0; display: flex; flex-direction: column; gap: 18px; padding-top: 8px">
        <span style="font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--muted)">Book a call</span>
        <h2 style="margin: 0; font-size: clamp(34px, 4.2vw, 48px); line-height: 1.06; font-weight: 600; letter-spacing: -.035em">Book your free<br><span style="color: var(--dim)">strategy call</span></h2>
        <p style="margin: 0; max-width: 420px; font-size: 16px; line-height: 1.65; color: var(--muted)">Thirty minutes with the people who will design and build your site. No sales script, no obligation.</p>
        <div style="display: flex; flex-wrap: wrap; gap: 8px">
          <span class="as-glass" style="font-size: 13px; font-weight: 500; padding: 7px 12px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface)">30 minutes</span>
          <span class="as-glass" style="font-size: 13px; font-weight: 500; padding: 7px 12px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface)">Google Meet or WhatsApp</span>
          <span class="as-glass" style="font-size: 13px; font-weight: 500; padding: 7px 12px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface)">Free</span>
        </div>
        <div style="margin-top: 14px; padding-top: 24px; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 18px">
          <span style="font-size: 14px; font-weight: 600">What happens on the call</span>
          <ol style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 18px">
          <li style="display: flex; gap: 16px">
            <span style="width: 28px; height: 28px; flex: none; border-radius: 50%; border: 1px solid var(--line-strong); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600">1</span>
            <span style="display: flex; flex-direction: column; gap: 3px; padding-top: 3px"><span style="font-size: 15px; font-weight: 600">We walk through your free audit</span><span style="font-size: 14px; line-height: 1.55; color: var(--muted)">What’s working on your current site, and what’s costing you customers.</span></span>
          </li>
          <li style="display: flex; gap: 16px">
            <span style="width: 28px; height: 28px; flex: none; border-radius: 50%; border: 1px solid var(--line-strong); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600">2</span>
            <span style="display: flex; flex-direction: column; gap: 3px; padding-top: 3px"><span style="font-size: 15px; font-weight: 600">We map out your goals</span><span style="font-size: 14px; line-height: 1.55; color: var(--muted)">What you sell, who you sell to, and what the site needs to do.</span></span>
          </li>
          <li style="display: flex; gap: 16px">
            <span style="width: 28px; height: 28px; flex: none; border-radius: 50%; border: 1px solid var(--line-strong); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600">3</span>
            <span style="display: flex; flex-direction: column; gap: 3px; padding-top: 3px"><span style="font-size: 15px; font-weight: 600">You get an honest recommendation</span><span style="font-size: 14px; line-height: 1.55; color: var(--muted)">A clear plan, a timeline and next steps, even if we’re not the right fit.</span></span>
          </li>
          </ol>
        </div>
      </div>

      <div class="as-glass" style="flex: 1.25 1 460px; min-width: 0; border-radius: 22px; border: 1px solid var(--line); background: var(--surface); overflow: hidden">
        ${(v.notBooked) ? `
          <div data-key="k38" style="display: flex; align-items: center; gap: 12px; padding: 18px 24px; border-bottom: 1px solid var(--line); font-size: 13px; font-weight: 600">
            <span style="display: flex; align-items: center; gap: 8px; color: ${esc(v.s1Color)}"><span style="width: 22px; height: 22px; border-radius: 50%; background: ${esc(v.s1Bg)}; color: ${esc(v.s1Fg)}; display: flex; align-items: center; justify-content: center; font-size: 11px">1</span>Date &amp; time</span>
            <span style="flex: 1; max-width: 64px; height: 1px; background: var(--line-strong)"></span>
            <span style="display: flex; align-items: center; gap: 8px; color: ${esc(v.s2Color)}"><span style="width: 22px; height: 22px; border-radius: 50%; background: ${esc(v.s2Bg)}; color: ${esc(v.s2Fg)}; border: 1px solid var(--line-strong); box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-size: 11px">2</span>Your details</span>
          </div>
        ` : ''}

        ${(v.isStep1) ? `
          <div data-key="k39" class="as-swap" style="padding: 24px; display: flex; flex-direction: column; gap: 26px">
            <div style="display: flex; flex-direction: column; gap: 12px">
              <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><span id="as-day-label" style="font-size: 14px; font-weight: 600">Choose a day</span><span style="font-size: 13px; color: var(--muted)">${esc(v.monthLabel)}</span></div>
              <div role="group" aria-labelledby="as-day-label" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(62px, 1fr)); gap: 8px">
                ${(v.days).map((d, i_d) => `
                  <button type="button" data-act="days.pick" data-idx="${i_d}" aria-pressed="${esc(d.active)}" style="font: inherit; cursor: pointer; min-height: 68px; border-radius: 14px; border: 1px solid ${esc(d.border)}; background: ${esc(d.bg)}; color: ${esc(d.fg)}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; transition: background .2s ease, color .2s ease">
                    <span style="font-size: 11px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; color: ${esc(d.sub)}">${esc(d.dow)}</span>
                    <span style="font-size: 20px; font-weight: 600; letter-spacing: -.02em">${esc(d.date)}</span>
                  </button>
                `).join('')}
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px">
              <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px"><span id="as-time-label" style="font-size: 14px; font-weight: 600">Choose a time</span><span style="font-size: 13px; color: var(--muted)">Pakistan time (PKT)</span></div>
              <div role="group" aria-labelledby="as-time-label" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(84px, 1fr)); gap: 8px">
                ${(v.slots).map((t, i_t) => `
                  <button type="button" data-act="slots.pick" data-idx="${i_t}" aria-pressed="${esc(t.active)}" style="font: inherit; cursor: pointer; min-height: 46px; border-radius: 12px; border: 1px solid ${esc(t.border)}; background: ${esc(t.bg)}; color: ${esc(t.fg)}; font-size: 14px; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 7px; transition: background .2s ease, border-color .2s ease"><span style="width: 6px; height: 6px; border-radius: 50%; background: ${esc(t.dot)}"></span>${esc(t.label)}</button>
                `).join('')}
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px">
              <span id="as-type-label" style="font-size: 14px; font-weight: 600">Call on</span>
              <div role="group" aria-labelledby="as-type-label" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; padding: 4px; border-radius: 14px; border: 1px solid var(--line); background: var(--well)">
                ${(v.callTypes).map((c, i_c) => `
                  <button type="button" data-act="callTypes.pick" data-idx="${i_c}" aria-pressed="${esc(c.active)}" style="font: inherit; cursor: pointer; min-height: 42px; border-radius: 10px; border: none; background: ${esc(c.bg)}; color: ${esc(c.fg)}; font-size: 14px; font-weight: 500; transition: background .2s ease">${esc(c.label)}</button>
                `).join('')}
              </div>
            </div>
            <div style="margin: 0 -24px -24px; padding: 18px 24px; border-top: 1px solid var(--line); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px">
              <span style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 12px; color: var(--muted)">Selected</span><span style="font-size: 14px; font-weight: 600">${esc(v.summary)}</span></span>
              <button type="button" class="as-btn" data-act="goStep2" style="font: inherit; font-size: 15px; font-weight: 600; min-height: 48px; padding: 0 22px; border-radius: 12px; border: none; background: var(--fg); color: var(--bg); cursor: pointer; display: inline-flex; align-items: center; gap: 8px">Continue<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="M13 6l6 6-6 6"></path></svg></button>
            </div>
          </div>
        ` : ''}

        ${(v.isStep2) ? `
          <div data-key="k40" class="as-swap" style="padding: 24px; display: flex; flex-direction: column; gap: 22px">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-radius: 14px; border: 1px solid var(--line); background: var(--well)">
              <span style="display: flex; align-items: center; gap: 12px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 10h18M8 3v4M16 3v4"></path></svg><span style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 14px; font-weight: 600">${esc(v.summary)}</span><span style="font-size: 12px; color: var(--muted)">30 minutes · Pakistan time</span></span></span>
              <button type="button" data-act="goStep1" style="font: inherit; font-size: 13px; font-weight: 600; min-height: 44px; padding: 0 12px; border-radius: 10px; border: none; background: transparent; color: var(--fg); cursor: pointer; text-decoration: underline; text-underline-offset: 3px">Change</button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px">
              <span style="display: flex; flex-direction: column; gap: 8px"><label for="as-name" style="font-size: 13px; font-weight: 600">Your name</label><input id="as-name" type="text" autocomplete="name" value="${esc(v.name)}" data-input="name" placeholder="e.g. Ayesha Khan" style="font: inherit; font-size: 15px; min-height: 48px; padding: 0 14px; border-radius: 12px; border: 1px solid var(--line-strong); background: var(--surface2); color: var(--fg); box-sizing: border-box"></span>
              <span style="display: flex; flex-direction: column; gap: 8px"><label for="as-phone" style="font-size: 13px; font-weight: 600">WhatsApp number</label><input id="as-phone" type="tel" autocomplete="tel" value="${esc(v.phone)}" data-input="phone" placeholder="03XX XXXXXXX" style="font: inherit; font-size: 15px; min-height: 48px; padding: 0 14px; border-radius: 12px; border: 1px solid var(--line-strong); background: var(--surface2); color: var(--fg); box-sizing: border-box"></span>
              <span style="display: flex; flex-direction: column; gap: 8px; grid-column: 1 / -1"><label for="as-brand" style="font-size: 13px; font-weight: 600">Your site or Instagram</label><input id="as-brand" type="text" value="${esc(v.brand)}" data-input="brand" placeholder="yourbrand.pk or @yourbrand" style="font: inherit; font-size: 15px; min-height: 48px; padding: 0 14px; border-radius: 12px; border: 1px solid var(--line-strong); background: var(--surface2); color: var(--fg); box-sizing: border-box"></span>
            </div>
            ${(v.hasErr) ? `<span data-key="k41" role="alert" class="as-swap" style="display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; border-radius: 12px; border: 1px solid rgba(255,59,48,.35); background: rgba(255,59,48,.08); font-size: 13px; line-height: 1.5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; margin-top: 1px"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v5M12 16v.01"></path></svg>${esc(v.bookErr)}</span>` : ''}
            <div style="margin: 0 -24px -24px; padding: 18px 24px; border-top: 1px solid var(--line); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px">
              <span style="font-size: 12px; color: var(--muted); max-width: 240px; line-height: 1.5">We’ll confirm on WhatsApp and send your free audit before the call.</span>
              <button type="button" class="as-btn" data-act="confirm" style="font: inherit; font-size: 15px; font-weight: 600; min-height: 48px; padding: 0 24px; border-radius: 12px; border: none; background: var(--accent); color: #0E0E0E; cursor: pointer">${esc(v.confirmLabel)}</button>
            </div>
          </div>
        ` : ''}

        ${(v.isBooked) ? `
          <div data-key="k42" class="as-swap" style="min-height: 460px; padding: 40px 24px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 14px">
            <span style="width: 60px; height: 60px; border-radius: 50%; background: var(--accent); color: #0E0E0E; display: flex; align-items: center; justify-content: center"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L19 7"></path></svg></span>
            <span style="font-size: 26px; font-weight: 600; letter-spacing: -.03em">You’re booked, ${esc(v.firstName)}.</span>
            <span style="font-size: 15px; font-weight: 600">${esc(v.summary)}</span>
            <span style="max-width: 360px; font-size: 14px; line-height: 1.6; color: var(--muted)">We’ll confirm on WhatsApp and send your free audit before the call.</span>
            <button type="button" data-act="reset" style="margin-top: 6px; font: inherit; font-size: 14px; font-weight: 500; min-height: 44px; padding: 0 18px; border-radius: 12px; border: 1px solid var(--line-strong); background: transparent; color: var(--fg); cursor: pointer">Change booking</button>
          </div>
        ` : ''}
      </div>

    </div>
  `,
  faq: (v) => `
    <div style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px">
      <span style="font-size: 12px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--muted)">FAQ</span>
      <h2 style="margin: 0; font-size: clamp(32px, 4.2vw, 48px); line-height: 1.08; font-weight: 600; letter-spacing: -.035em">Frequently asked <span style="color: var(--dim)">questions</span></h2>
      <p style="margin: 0; font-size: 15px; line-height: 1.6; color: var(--muted)">Still unsure about something? <a href="#book" style="color: var(--fg)">Book a free call</a> and ask us directly.</p>
    </div>
    <div style="margin-top: 40px; display: flex; flex-direction: column; gap: 10px">
      <div class="as-glass" style="border-radius: 14px; background: var(--surface); border: 1px solid ${esc(v.faqBorder0)}">
        <button type="button" data-act="toggle0" aria-expanded="${esc(v.open0)}" style="font: inherit; width: 100%; min-height: 60px; padding: 18px 22px; background: transparent; border: none; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; text-align: left; font-size: 16px; font-weight: 600">Do you use templates or page builders?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; transform: ${esc(v.rot0)}"><path d="M6 9l6 6 6-6"></path></svg></button>
        ${(v.open0) ? `<p data-key="k43" style="margin: 0; padding: 0 22px 20px; font-size: 15px; line-height: 1.6; color: var(--muted)">No. Every AuthStack site is designed and coded from scratch for a single brand. That’s what lets it load faster, look distinctly yours and do things a theme simply can’t.</p>` : ''}
      </div>
      <div class="as-glass" style="border-radius: 14px; background: var(--surface); border: 1px solid ${esc(v.faqBorder1)}">
        <button type="button" data-act="toggle1" aria-expanded="${esc(v.open1)}" style="font: inherit; width: 100%; min-height: 60px; padding: 18px 22px; background: transparent; border: none; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; text-align: left; font-size: 16px; font-weight: 600">Can you redesign my existing site?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; transform: ${esc(v.rot1)}"><path d="M6 9l6 6 6-6"></path></svg></button>
        ${(v.open1) ? `<p data-key="k44" style="margin: 0; padding: 0 22px 20px; font-size: 15px; line-height: 1.6; color: var(--muted)">Yes, it’s the core of what we do. We audit what you have, keep what works and rebuild the rest properly, without losing your products, content or customers along the way.</p>` : ''}
      </div>
      <div class="as-glass" style="border-radius: 14px; background: var(--surface); border: 1px solid ${esc(v.faqBorder2)}">
        <button type="button" data-act="toggle2" aria-expanded="${esc(v.open2)}" style="font: inherit; width: 100%; min-height: 60px; padding: 18px 22px; background: transparent; border: none; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; text-align: left; font-size: 16px; font-weight: 600">How long does a site take?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; transform: ${esc(v.rot2)}"><path d="M6 9l6 6 6-6"></path></svg></button>
        ${(v.open2) ? `<p data-key="k45" style="margin: 0; padding: 0 22px 20px; font-size: 15px; line-height: 1.6; color: var(--muted)">It depends on the number of pages and features you need. After our call you receive a clear timeline with dates for design, development and launch, and we hold ourselves to it.</p>` : ''}
      </div>
      <div class="as-glass" style="border-radius: 14px; background: var(--surface); border: 1px solid ${esc(v.faqBorder3)}">
        <button type="button" data-act="toggle3" aria-expanded="${esc(v.open3)}" style="font: inherit; width: 100%; min-height: 60px; padding: 18px 22px; background: transparent; border: none; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; text-align: left; font-size: 16px; font-weight: 600">What’s in the free audit?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; transform: ${esc(v.rot3)}"><path d="M6 9l6 6 6-6"></path></svg></button>
        ${(v.open3) ? `<p data-key="k46" style="margin: 0; padding: 0 22px 20px; font-size: 15px; line-height: 1.6; color: var(--muted)">We review your site and social presence across five areas: speed, design, mobile experience, checkout and tracking. You receive a short, prioritised list of what to fix first and why it matters.</p>` : ''}
      </div>
      <div class="as-glass" style="border-radius: 14px; background: var(--surface); border: 1px solid ${esc(v.faqBorder4)}">
        <button type="button" data-act="toggle4" aria-expanded="${esc(v.open4)}" style="font: inherit; width: 100%; min-height: 60px; padding: 18px 22px; background: transparent; border: none; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; text-align: left; font-size: 16px; font-weight: 600">Do you handle domain, hosting and payments?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; transform: ${esc(v.rot4)}"><path d="M6 9l6 6 6-6"></path></svg></button>
        ${(v.open4) ? `<p data-key="k47" style="margin: 0; padding: 0 22px 20px; font-size: 15px; line-height: 1.6; color: var(--muted)">Yes. Launch is part of every project. We set up your domain, hosting, payment gateway and analytics, and take the site live for you.</p>` : ''}
      </div>
      <div class="as-glass" style="border-radius: 14px; background: var(--surface); border: 1px solid ${esc(v.faqBorder5)}">
        <button type="button" data-act="toggle5" aria-expanded="${esc(v.open5)}" style="font: inherit; width: 100%; min-height: 60px; padding: 18px 22px; background: transparent; border: none; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; text-align: left; font-size: 16px; font-weight: 600">What happens after launch?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; transform: ${esc(v.rot5)}"><path d="M6 9l6 6 6-6"></path></svg></button>
        ${(v.open5) ? `<p data-key="k48" style="margin: 0; padding: 0 22px 20px; font-size: 15px; line-height: 1.6; color: var(--muted)">We stay on call to fix issues, train your team to update products and content, and support you as your brand grows.</p>` : ''}
      </div>
      <div class="as-glass" style="border-radius: 14px; background: var(--surface); border: 1px solid ${esc(v.faqBorder6)}">
        <button type="button" data-act="toggle6" aria-expanded="${esc(v.open6)}" style="font: inherit; width: 100%; min-height: 60px; padding: 18px 22px; background: transparent; border: none; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; text-align: left; font-size: 16px; font-weight: 600">How much does a website cost?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: none; transform: ${esc(v.rot6)}"><path d="M6 9l6 6 6-6"></path></svg></button>
        ${(v.open6) ? `<p data-key="k49" style="margin: 0; padding: 0 22px 20px; font-size: 15px; line-height: 1.6; color: var(--muted)">It depends on the pages and features you need. After the free call you get a clear quote in writing, before any work starts.</p>` : ''}
      </div>
    </div>
  `
};

const ACC = '#FF3B30';
const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

const state = {
  uc: 0, open: 0, day: 0, slot: 1, call: 0, name: '', phone: '', brand: '', booked: false, step: 1, sending: false, error: '',
  conn: 0, connLock: false, statP: 1, vidPaused: false, vidMuted: true, svc: 0, svcLock: false, svcHover: false, ucLock: false, pr: 0, prLock: false, prHover: false
};
// which re-renderable region depends on which piece of state
const DEPS = {
  video: ['vidPaused', 'vidMuted'],
  svc: ['svc', 'svcLock', 'svcHover'],
  stats: ['statP'],
  conn: ['conn', 'connLock'],
  who: ['uc', 'ucLock'],
  process: ['pr', 'prLock', 'prHover'],
  book: ['day', 'slot', 'call', 'step', 'booked', 'sending', 'error'],
  faq: ['open']
};

// ---------- content ----------
const USE_CASES = [
  { title: 'Clothing & apparel', desc: 'Collection drops, lookbooks and size guides that move shoppers from browsing to checkout.', bullets: ['Collection and drop pages', 'Lookbooks and size guides', 'Fast mobile checkout'], url: 'noorvi.pk', brand: 'NOORVI', nav: 'New In · Lookbook · Bag', kicker: 'FESTIVE ’26', headline: 'The Eid Edit', cta: 'Shop the Drop', items: [{ name: 'Embroidered Kurta', meta: 'Sizes XS–XL', right: 'Rs 6,450' }, { name: 'Printed Lawn 3-Pc', meta: 'Unstitched', right: 'Rs 8,900' }, { name: 'Silk Dupatta', meta: '4 colours', right: 'Rs 3,200' }] },
  { title: 'Instagram-first brands', desc: 'A proper storefront behind your bio link, so followers can buy instantly instead of waiting on DM replies.', bullets: ['Storefront for your bio link', 'Best sellers from your feed', 'One-tap WhatsApp ordering'], url: 'yourbrand.pk', brand: 'YOUR BRAND', nav: 'Shop · Reviews · Bag', kicker: 'AS SEEN ON INSTAGRAM', headline: 'Shop the Feed', cta: 'Order Now', items: [{ name: 'Hand-Poured Candle', meta: 'From your latest reel', right: 'Rs 2,400' }, { name: 'Gift Box Set', meta: 'Ships in 2 days', right: 'Rs 5,800' }, { name: 'Order on WhatsApp', meta: 'One tap from checkout', right: '→' }] },
  { title: 'Local businesses', desc: 'Fast, credible sites for salons, cafés and studios, built to drive calls, bookings and visits.', bullets: ['Services and pricing', 'Online booking', 'Maps, reviews and contact'], url: 'yourstudio.pk', brand: 'YOUR STUDIO', nav: 'Services · Book · Visit', kicker: 'OPEN TODAY', headline: 'Book Your Visit', cta: 'Book Now', items: [{ name: 'Signature Service', meta: '60 min', right: 'Book' }, { name: 'Consultation', meta: '20 min · Free', right: 'Book' }, { name: 'Get Directions', meta: 'Opens in Maps', right: '→' }] },
  { title: 'New brand launches', desc: 'A brand system, a website and a waitlist, ready before your first post goes live.', bullets: ['Brand system and story page', 'Waitlist with sign-up', 'Launch-day campaign page'], url: 'newbrand.pk', brand: 'NEW BRAND', nav: 'Story · Waitlist', kicker: 'LAUNCHING SOON', headline: 'Be First In Line', cta: 'Join the Waitlist', items: [{ name: 'Founding Collection', meta: 'Sneak preview', right: 'View' }, { name: 'Early Access', meta: 'For waitlist members', right: 'Join' }, { name: 'Follow the Launch', meta: 'On Instagram', right: '→' }] }
];
const CONNECTIONS = [
  { title: 'Instagram', stage: 'Discover', evt: ['New visitor', 'Shopper from your bio link', 'Viewing Embroidered Kurta'], path: 'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zM12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8z', desc: 'Your bio link opens a real storefront with your best sellers ready to buy, instead of another DM thread.' },
  { title: 'WhatsApp', stage: 'Order', evt: ['New order', 'Embroidered Kurta · Size M', 'Confirmed in WhatsApp chat'], path: 'M21 12a9 9 0 0 1-13.5 7.8L3 21l1.2-4.5A9 9 0 1 1 21 12z', desc: 'Turn chats into checkouts. A one-tap order button takes shoppers from your site to WhatsApp with the product details already filled in.' },
  { title: 'Payments', stage: 'Pay', evt: ['Paid', 'Rs 6,450 received', 'Order #1042 · Card'], path: 'M4.5 5h15A2.5 2.5 0 0 1 22 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 16.5v-9A2.5 2.5 0 0 1 4.5 5zM2 10h20M6 15h4', desc: 'Card, bank transfer and cash on delivery at checkout, so every customer can pay the way they prefer.' },
  { title: 'Couriers', stage: 'Deliver', evt: ['Shipped', 'Out for delivery', 'Tracking link sent to customer'], path: 'M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 16.3a1.7 1.7 0 1 0 0 3.4a1.7 1.7 0 0 0 0-3.4zM17 16.3a1.7 1.7 0 1 0 0 3.4a1.7 1.7 0 0 0 0-3.4z', desc: 'Orders flow straight to your courier, and customers get tracking updates instead of asking where their order is.' }
];
const DOWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SLOTS = ['11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'];
const CALLS = ['Google Meet', 'WhatsApp Call'];
const DAY_LIST = (() => {
  const out = []; const d0 = new Date();
  for (let k = 1; out.length < 6 && k < 14; k++) {
    const d = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + k);
    if (d.getDay() !== 0) out.push(d); // no Sundays
  }
  return out;
})();

// ---------- view values (same names the templates use) ----------
function computeV(s) {
  const fg = 'var(--fg)', bg = 'var(--bg)', muted = 'var(--muted)', line = 'var(--line)', lineStrong = 'var(--line-strong)';
  const v = {};
  // who it's for
  v.useCases = USE_CASES.map((u, i) => ({ title: u.title, num: '0' + (i + 1), active: s.uc === i, bar: s.uc === i && s.ucLock ? ACC : line, prog: s.uc === i && !s.ucLock, tabFg: s.uc === i ? fg : muted, numColor: s.uc === i ? 'var(--accent-text)' : muted }));
  const c = USE_CASES[s.uc];
  v.cur = Object.assign({}, c, { num: '0' + (s.uc + 1), bullets: c.bullets.map((x) => ({ label: x })) });
  for (let i = 0; i < 4; i++) v['isUc' + i] = s.uc === i;
  // integrations
  const nodeXs = [70, 170, 270, 370];
  v.conns = CONNECTIONS.map((x, i) => ({ title: x.title, stage: x.stage, desc: x.desc, iconPath: x.path, open: s.conn === i, auto: !s.connLock, icon: s.conn === i ? '−' : '+', fg: s.conn === i ? fg : muted, chipBorder: s.conn === i ? ACC : lineStrong, chipColor: s.conn === i ? ACC : muted }));
  const cc = CONNECTIONS[s.conn];
  v.connPath = cc.path; v.connStage = cc.stage; v.connNum = '0' + (s.conn + 1);
  v.connStatus = cc.status || ''; v.connEvtKicker = cc.evt[0]; v.connEvtTitle = cc.evt[1]; v.connEvtMeta = cc.evt[2];
  v.haloLeft = (nodeXs[s.conn] / 440 * 100).toFixed(2) + '%';
  v.pulsePath = 'M220 58 L220 178 C220 222 ' + nodeXs[s.conn] + ' 214 ' + nodeXs[s.conn] + ' 246';
  for (let i = 0; i < 4; i++) {
    const on = s.conn === i;
    v['isC' + i] = on;
    v['cd' + i] = on ? '22px' : '6px';
    v['cc' + i] = on ? ACC : lineStrong;
    v['n' + i + 'Label'] = on ? fg : muted;
    v['w' + i] = on ? 0 : 1;
    v['n' + i + 'Border'] = on ? ACC : lineStrong;
    v['n' + i + 'Color'] = on ? ACC : muted;
    v['n' + i + 'Shadow'] = on ? '0 0 0 6px rgba(255,59,48,0.10), 0 8px 20px -10px rgba(255,59,48,0.45)' : 'none';
    v['n' + i + 'Tf'] = on ? 'translate(-50%, -50%) scale(1.08)' : 'translate(-50%, -50%) scale(1)';
  }
  // film controls
  v.vidPaused = s.vidPaused; v.vidPlaying = !s.vidPaused; v.vidMuted = s.vidMuted; v.vidSound = !s.vidMuted;
  v.playLabel = s.vidPaused ? 'Play video' : 'Pause video';
  v.muteLabel = s.vidMuted ? 'Turn sound on' : 'Turn sound off';
  // stats
  const p = s.statP;
  v.st1 = (0.05 * p).toFixed(2) + 's'; v.st1Bar = (5 * p).toFixed(2) + '%';
  v.st2 = Math.round(75 * p) + '%'; v.st2Dots = Array.from({ length: 20 }, (_, i) => ({ c: i < Math.round(15 * p) ? ACC : lineStrong }));
  v.st3 = Math.round(53 * p) + '%'; v.st3Bar = (53 * p).toFixed(1) + '%';
  // booking
  v.days = DAY_LIST.map((d, i) => { const on = s.day === i; return { dow: DOWS[d.getDay()], date: String(d.getDate()), active: on, border: on ? fg : line, bg: on ? fg : 'transparent', fg: on ? bg : fg, sub: on ? bg : muted }; });
  v.slots = SLOTS.map((l, i) => { const on = s.slot === i; return { label: l, active: on, border: on ? ACC : line, bg: on ? 'var(--slot-tint)' : 'transparent', fg: fg, dot: on ? ACC : 'transparent' }; });
  v.callTypes = CALLS.map((l, i) => { const on = s.call === i; return { label: l, active: on, bg: on ? fg : 'transparent', fg: on ? bg : muted }; });
  const pd = DAY_LIST[s.day];
  v.summary = DOWS[pd.getDay()] + ', ' + pd.getDate() + ' ' + MONTHS[pd.getMonth()] + ' at ' + SLOTS[s.slot] + ' via ' + CALLS[s.call];
  v.monthLabel = MONTHS[DAY_LIST[0].getMonth()] + ' ' + DAY_LIST[0].getFullYear();
  v.name = s.name; v.phone = s.phone; v.brand = s.brand;
  v.firstName = s.name.trim().split(' ')[0] || 'there';
  v.isBooked = s.booked; v.notBooked = !s.booked;
  v.hasErr = !!s.error; v.bookErr = s.error;
  v.confirmLabel = s.sending ? 'Sending…' : 'Confirm booking';
  v.isStep1 = !s.booked && s.step === 1; v.isStep2 = !s.booked && s.step === 2;
  v.s1Bg = s.step === 1 ? fg : ACC; v.s1Fg = s.step === 1 ? bg : '#0E0E0E'; v.s1Color = fg;
  v.s2Bg = s.step === 2 ? fg : 'transparent'; v.s2Fg = s.step === 2 ? bg : muted; v.s2Color = s.step === 2 ? fg : muted;
  // what we do
  v.svcAuto = !s.svcLock && !s.svcHover;
  for (let i = 0; i < 6; i++) {
    v['svProg' + i] = s.svc === i && !s.svcLock && !s.svcHover;
    v['sv' + i] = s.svc === i;
    v['svd' + i] = s.svc === i ? '22px' : '6px';
    v['svc' + i] = s.svc === i ? ACC : lineStrong;
  }
  // process timeline
  v.prFill = (s.pr / 3 * 75).toFixed(2) + '%';
  for (let i = 0; i < 4; i++) {
    const on = s.pr === i, done = i < s.pr;
    v['pr' + i] = on;
    v['prNB' + i] = on || done ? ACC : lineStrong;
    v['prNBg' + i] = done ? ACC : 'var(--node-bg)';
    v['prNC' + i] = done ? '#0E0E0E' : (on ? ACC : muted);
    v['prNS' + i] = on ? '0 0 0 6px rgba(255,59,48,0.14)' : 'none';
  }
  // faq
  for (let i = 0; i < 7; i++) {
    v['open' + i] = s.open === i;
    v['rot' + i] = s.open === i ? 'rotate(180deg)' : 'none';
    v['faqBorder' + i] = s.open === i ? lineStrong : 'transparent';
  }
  return v;
}

// ---------- rendering ----------
const morph = window.morphdom;
function render(name) {
  const host = document.querySelector('[data-region="' + name + '"]');
  if (!host) return;
  const next = host.cloneNode(false);
  next.innerHTML = TEMPLATES[name](computeV(state));
  morph(host, next, {
    childrenOnly: true,
    getNodeKey: (n) => (n.nodeType === 1 && (n.getAttribute('data-key') || n.id)) || undefined,
    onBeforeElUpdated: (from, to) => {
      if (from.tagName === 'INPUT' && from === document.activeElement) to.value = from.value;
      return true;
    }
  });
}
function set(patch) {
  const changed = Object.keys(patch).filter((k) => state[k] !== patch[k]);
  if (!changed.length) return;
  Object.assign(state, patch);
  Object.keys(DEPS).forEach((r) => { if (DEPS[r].some((k) => changed.includes(k))) render(r); });
}
const film = () => document.getElementById('film');

// ---------- booking (Netlify Forms) ----------
// Netlify reads the hidden <form name="booking"> in index.html at deploy time,
// then accepts these POSTs and lists them under Forms → booking.
function cleanPhone(raw) { return String(raw || '').replace(/[\s\-().]/g, ''); }
function validPhone(raw) { return /^\+?\d{10,13}$/.test(cleanPhone(raw)); }
function fail(fieldId, message) {
  set({ error: message });
  const el = document.getElementById(fieldId);
  if (el) { el.setAttribute('aria-invalid', 'true'); el.focus(); }
}
function submitBooking() {
  if (state.sending) return;
  if (!state.name.trim()) return fail('as-name', 'Please add your name so we know who we’re speaking to.');
  if (!validPhone(state.phone)) return fail('as-phone', 'Please enter a valid WhatsApp number, for example 0300 1234567.');
  set({ sending: true, error: '' });
  const d = DAY_LIST[state.day];
  const data = {
    'form-name': 'booking',
    'bot-field': '',
    name: state.name.trim(),
    phone: cleanPhone(state.phone),
    brand: state.brand.trim(),
    date: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'),
    time: SLOTS[state.slot] + ' PKT',
    call: CALLS[state.call],
    slot: computeV(state).summary
  };
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(data).toString()
  })
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); set({ sending: false, booked: true }); })
    .catch(() => set({ sending: false, error: 'We couldn’t send your booking. Please check your connection and try again, or message us on WhatsApp.' }));
}

// ---------- actions ----------
const ACTIONS = {
  toggleTheme() {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('as-theme', t); } catch (e) { /* private mode */ }
  },
  toggleVid() {
    const f = film(); if (!f) return;
    if (f.paused) { f.play(); set({ vidPaused: false }); } else { f.pause(); set({ vidPaused: true }); }
  },
  toggleMute() {
    const f = film(); const m = !state.vidMuted;
    if (f) { f.muted = m; if (!m && f.paused) { f.play(); set({ vidPaused: false }); } }
    set({ vidMuted: m });
  },
  'conns.pick': (i) => set({ conn: i, connLock: true }),
  'useCases.pick': (i) => set({ uc: i, ucLock: true }),
  'days.pick': (i) => set({ day: i }),
  'slots.pick': (i) => set({ slot: i }),
  'callTypes.pick': (i) => set({ call: i }),
  goStep1: () => set({ step: 1, error: '' }),
  goStep2: () => set({ step: 2 }),
  confirm: submitBooking,
  reset: () => set({ booked: false, step: 1, error: '' })
};
let svcT0 = Date.now(), svcSeen = false, svcVis = false;
for (let i = 0; i < 6; i++) {
  ACTIONS['pickSvc' + i] = () => set({ svc: i, svcLock: true });
  ACTIONS['hoverSvc' + i] = () => set({ svc: i, svcHover: true });
}
ACTIONS.leaveSvc = () => { svcT0 = Date.now(); set({ svcHover: false }); };
let prT0 = Date.now(), prSeen = false, prVis = false;
for (let i = 0; i < 4; i++) {
  ACTIONS['pickPr' + i] = () => set({ pr: i, prLock: true });
  ACTIONS['hoverPr' + i] = () => set({ pr: i, prHover: true });
}
ACTIONS.leavePr = () => { prT0 = Date.now(); set({ prHover: false }); };
for (let i = 0; i < 7; i++) ACTIONS['toggle' + i] = () => set({ open: state.open === i ? -1 : i });

document.addEventListener('click', (e) => {
  const el = e.target.closest && e.target.closest('[data-act]');
  if (!el) return;
  const fn = ACTIONS[el.getAttribute('data-act')];
  if (!fn) return;
  e.preventDefault();
  const idx = el.getAttribute('data-idx');
  fn(idx === null ? undefined : Number(idx));
});
// soft red spotlight that follows the pointer inside each service card
document.addEventListener('pointermove', (e) => {
  const el = e.target && e.target.closest && e.target.closest('.as-svc');
  if (!el) return;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  el.style.setProperty('--my', (e.clientY - r.top) + 'px');
});
// hover-to-preview (mouse only; touch uses the tap/click above)
document.addEventListener('pointerover', (e) => {
  if (e.pointerType && e.pointerType !== 'mouse') return;
  const el = e.target.closest && e.target.closest('[data-hover]');
  if (!el) return;
  const fn = ACTIONS[el.getAttribute('data-hover')];
  if (fn) fn();
});
document.addEventListener('pointerout', (e) => {
  const el = e.target.closest && e.target.closest('[data-leave]');
  if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
  const fn = ACTIONS[el.getAttribute('data-leave')];
  if (fn) fn();
});
document.addEventListener('input', (e) => {
  const key = e.target.getAttribute && e.target.getAttribute('data-input');
  if (!key) return;
  state[key] = e.target.value; // stored without re-rendering, so typing never loses focus
  e.target.removeAttribute('aria-invalid');
  if (state.error) set({ error: '' });
});

// ---------- start ----------
function init() {
  Object.keys(DEPS).forEach(render);

  const f = film();
  if (f) {
    f.muted = true;
    try {
      if (reduceMotion) { f.removeAttribute('autoplay'); f.pause(); set({ vidPaused: true }); }
      else { const pr = f.play(); if (pr && pr.catch) pr.catch(() => set({ vidPaused: true })); }
    } catch (e) { set({ vidPaused: true }); }
    f.addEventListener('pause', () => set({ vidPaused: true }));
    f.addEventListener('play', () => set({ vidPaused: false }));
  }

  const stats = document.getElementById('stats');
  if (!reduceMotion && stats && 'IntersectionObserver' in window) {
    set({ statP: 0 });
    const obs = new IntersectionObserver((entries) => {
      if (!entries.some((en) => en.isIntersecting)) return;
      obs.disconnect();
      const t0 = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - t0) / 1500);
        set({ statP: 1 - Math.pow(1 - t, 3) });
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.35 });
    obs.observe(stats);
  }

  // "What we do" cycles through its six visuals while the section is on screen;
  // hovering pauses it, clicking/tapping a service keeps that one
  if (!reduceMotion) {
    const sec = document.getElementById('services');
    if (sec && 'IntersectionObserver' in window) {
      new IntersectionObserver((en) => {
        svcVis = en.some((x) => x.isIntersecting);
        if (svcVis && !svcSeen) { svcSeen = true; svcT0 = Date.now(); set({ svc: 0 }); }
      }, { threshold: 0.25 }).observe(sec);
    } else { svcVis = true; }
    setInterval(() => {
      if (state.svcLock || document.hidden) return;
      if (state.svcHover || !svcVis) { svcT0 = Date.now(); return; }
      if (Date.now() - svcT0 >= 4500) { svcT0 = Date.now(); set({ svc: (state.svc + 1) % 6 }); }
    }, 200);
  } else { set({ svcLock: true }); }

  // sticky mobile CTA: shows once the hero has scrolled away, hides near the booking form and footer
  const bar = document.querySelector('.as-mbar');
  if (bar && 'IntersectionObserver' in window) {
    const vis = { hero: true, book: false, foot: false };
    const bobs = new IntersectionObserver((en) => {
      en.forEach((x) => { vis[x.target.getAttribute('data-bar-key')] = x.isIntersecting; });
      const show = !vis.hero && !vis.book && !vis.foot;
      bar.setAttribute('data-show', String(show));
      bar.setAttribute('aria-hidden', String(!show));
      const a = bar.querySelector('a'); if (a) a.setAttribute('tabindex', show ? '0' : '-1');
    });
    [['hero', document.querySelector('main > section')], ['book', document.getElementById('book')], ['foot', document.querySelector('footer')]]
      .forEach(([k, el]) => { if (el) { el.setAttribute('data-bar-key', k); bobs.observe(el); } });
  }

  // phones: process cards are a swipe carousel; the card in view becomes the active step
  let prMobile = false;
  const pgrid = document.querySelector('.as-pr-grid');
  if (pgrid && window.matchMedia && window.matchMedia('(max-width: 760px)').matches && 'IntersectionObserver' in window) {
    prMobile = true;
    const cards = () => [...pgrid.querySelectorAll('.as-pr')];
    const sw = new IntersectionObserver((en) => {
      en.forEach((x) => { if (x.isIntersecting && x.intersectionRatio > 0.6) { const i = cards().indexOf(x.target); if (i >= 0) set({ pr: i, prLock: true }); } });
    }, { root: pgrid, threshold: [0.6] });
    cards().forEach((c) => sw.observe(c));
  }

  // process timeline: same pattern, a little faster
  if (!reduceMotion && !prMobile) {
    const psec = document.getElementById('process');
    if (psec && 'IntersectionObserver' in window) {
      new IntersectionObserver((en) => {
        prVis = en.some((x) => x.isIntersecting);
        if (prVis && !prSeen) { prSeen = true; prT0 = Date.now(); set({ pr: 0 }); }
      }, { threshold: 0.3 }).observe(psec);
    } else { prVis = true; }
    setInterval(() => {
      if (state.prLock || document.hidden) return;
      if (state.prHover || !prVis) { prT0 = Date.now(); return; }
      if (Date.now() - prT0 >= 4200) { prT0 = Date.now(); set({ pr: (state.pr + 1) % 4 }); }
    }, 200);
  }
  if (!reduceMotion) setInterval(() => { if (!state.ucLock && !document.hidden) set({ uc: (state.uc + 1) % 4 }); }, 6000);
  if (reduceMotion) set({ connLock: true, ucLock: true });
  else setInterval(() => { if (!state.connLock && !document.hidden) set({ conn: (state.conn + 1) % 4 }); }, 5500);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

})();
