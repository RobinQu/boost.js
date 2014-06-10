/* Test if an element matches a selector */

define(["./query"], function(query) {
  
  
  var matchMethodName = (function() {
    var names = ["matches", "webkitMacthesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"];
    var i = names.length;
    while(i--) {
      if(Element.prototype[names[i]]) {
        break;
      }
    }
    return names[i];
  })();
  
  return function match(el, selector) {
    if(matchMethodName) {
      return el[matchMethodName](selector);
    }
    //find nodes under `el`'s parent
    var nodes = query.all(selector, el.parentNode),
        i, len;
    for(i=0,len=nodes.length; i<len; i++) {
      if(nodes[i] == el) {
        return true;
      }
    }
    return false;
  };
  
});