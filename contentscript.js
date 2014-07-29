walk(document.body);

function walk(node) 
{
	// Function copied from here:
	// http://is.gd/mwZp7E

	var child, next;

	switch ( node.nodeType )  
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3: // Text node
			handleText(node);
			break;
	}
}

function handleText(textNode) 
{
	var v = textNode.nodeValue;
	var str = ""

	for(var i = 0; i < v.length; i++) {
		str += pinyinify(v.charAt(i));
	}
	textNode.nodeValue = str;
}

function pinyinify(c) {
	if(c == 'a') {
		return "POOP";
	}
	return c;
}