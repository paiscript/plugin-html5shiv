/* Makes HTML5shim work on innerHTML
 * Based on innerShiv (http://jdbartlett.github.com/innershiv)
 */


(function () {
	var div;
	var doc = document;
	var needsShiv;
	
	// Array of elements that are new in HTML5
	var html5 = 'abbr article aside audio canvas datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video'.split(' ');
	
	// Used to idiot-proof self-closing tags
	function fcloseTag(all, front, tag) {
		return (/^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i).test(tag) ? all : front + '></' + tag + '>';
	}
	
	PAI('addFilter', 'content', function(html) {
		if (!div) {
			div = doc.createElement('div');
			
			// needsShiv if can't use HTML5 elements with innerHTML outside the DOM
			div.innerHTML = '<nav></nav>';
			needsShiv = div.childNodes.length !== 1;
			
			if (needsShiv) {
				// MSIE allows you to create elements in the context of a document
				// fragment. Jon Neal first discovered this trick and used it in his
				// own shimprove: http://www.iecss.com/shimprove/
				var shimmedFrag = doc.createDocumentFragment();
				var i = html5.length;
				while (i--) {
					shimmedFrag.createElement(html5[i]);
				}
				
				shimmedFrag.appendChild(div);
			}
		}
		if (!needsShiv) {
			return html;
		}
		
		html = html
			// Trim whitespace to avoid unexpected text nodes in return data:
			.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
			// Strip any scripts:
//			.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
			// Fix misuses of self-closing tags:
			.replace(/(<([\w:]+)[^>]*?)\/>/g, fcloseTag)
			;
		
		// Fix for using innerHTML in a table
		var tabled;
		if (tabled = html.match(/^<(tbody|tr|td|th|col|colgroup|thead|tfoot)[\s\/>]/i)) {
			div.innerHTML = '<table>' + html + '</table>';
		} else {
			div.innerHTML = html;
		}
		
		// Avoid returning the tbody or tr when fixing for table use
		var scope;
		if (tabled) {
			scope = div.getElementsByTagName(tabled[1])[0].parentNode;
		} else {
			scope = div;
		}
		
		
		// ...otherwise, build a fragment to return
		var returnedFrag = doc.createDocumentFragment();
		var j = scope.childNodes.length;
		while (j--) {
			returnedFrag.appendChild(scope.firstChild);
		}
		
		return returnedFrag;
	});
}());