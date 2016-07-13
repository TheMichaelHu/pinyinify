var data = getUnihanMap();
var prevDomLength = 0;
var enabled = undefined;

chrome.storage.sync.get("pinyinifyEnabled", function(items){
	enabled = items["pinyinifyEnabled"];
	if(enabled == undefined) {
		enabled = true;
		chrome.storage.sync.set({ "pinyinifyEnabled": "true" });
	}

	if(enabled) {
		walk(document);
	}

	setInterval(
		function() {
			if(getDomLength(document) !== prevDomLength && enabled) {
				walk(document);
				prevDomLength = getDomLength(document);
			}
		}, 3000);
});

function getDomLength(node) 
{
	var child, next;
	var domLength = 0;

	switch ( node.nodeType )  
	{
		case 3: // Text node
			return 1;
		default:
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				domLength += getDomLength(child);
				child = next;
			}
			return domLength;
	}
}

function walk(node) 
{
	var child, next;
	var domLength = 0;

	switch ( node.nodeType )  
	{
		case 3: // Text node
			domLength += handleText(node);
			break;
		default:
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;
	}
}

function handleText(textNode) 
{
	var v = textNode.nodeValue;
	var str = ""

	for(var i = 0; i < v.length; i++) {
		newText = pinyinify(v.charAt(i), v.charAt(i+1));
		str += newText;
	}
	textNode.nodeValue = str;
	return str.length;
}

function pinyinify(c, next) {
	var hex = c.charCodeAt(0).toString(16);
	var result = data[hex];
	var isHanZiNext = data[next.charCodeAt(0).toString(16)] !== undefined;
	if(next !== undefined 
		&& ((result !== undefined && (/\w/.test(next) || isHanZiNext)) || (/\w/.test(c) && isHanZiNext))) {
		if(result === undefined) {
			return c + " ";
		}
		result += " ";
	}
	return result === undefined?c:result;
}

chrome.runtime.onMessage.addListener(function onMessage(request, sender, sendResponse) {
  if (request.action == 'enable') {
  	console.log("enabled");
    enabled = true;
    chrome.storage.sync.set({ "pinyinifyEnabled": true });
  } else if (request.action == 'disable') {
  	console.log("disabled");
    enabled = false;
    chrome.storage.sync.set({ "pinyinifyEnabled": false });
	}

   sendResponse({});
});

