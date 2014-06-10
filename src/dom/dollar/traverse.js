define(["../match", "../access"], function(match, access) {
  
  var traverse = {};
  
  // Find all matching descendant
  traverse.find = function(selector) {
    return this.dom(selector, this);
  };
  
  //Check if any elements matches the `selector`
  
  traverse.is = function(selector) {
    var i, el;
    
    for(i=0; el=this[i]; i++) {
      if(match(el, selector)) {
        return true;
      }
    }
    return false;
  };
  
  // Get parants of any level
  traverse.parent = function(selector, limit) {
    return this.dom(access("parentNode", this[0], selector, limit));
  };
  
  // next siblings
  traverse.next = function(selector, limit) {
    return this.dom(traverse("nextSibling", this[0], selector, limit));
  };
  
  // previous siblings
  traverse.prev = traverse.previous = function(selector, limit) {
    return this.dom(traverse("previousSibling"), this[0], selector, limit);
  };
  
  // iterate over each elements and invoke `fn(i, list)`
  traverse.each = function(fn) {
    var list, i, len;
    for(i=0,len = this.length; i<len; i++) {
      list = this.dom(this[i]);
      fn.call(list, i, list);
    }
    return this;
  };
  
  // traverse like `each`, but no wrapping using `List`, just invoke `fn(i, el)`
  traverse.forEach = function(fn) {
    var i, len, el;
    for(i=0,len=this.length; i<len; i++) {
      el = this[i];
      fn.call(el, el, i);
    }
    return this;
  };
  
  traverse.some = traverse.any = function(fn) {
    var i, len, el;
    for(i=0,len=this.length; i<len; i++) {
      el = this[i];
      if(fn.call(el, el, i)) {
        return true;
      }
    }
    return false;
  };
  
  //TODO reject, filter(select)
  traverse.map = function(fn) {
    var result = [], i, len, el;
    for(i=0,len=this.length; i<len; i++) {
      el = this[i];
      result.push(fn.call(el, el, i));
    }
    return result;
  };
  
  traverse.at = traverse.eq = function(i) {
    return this.dom(this[i]);
  };
  
  traverse.first = function() {
    return this.at(0);
  };
  
  traverse.last = function() {
    return this.at(this.length - 1);
  };
  
  //delegate array-methods to `List`
  ["push", "pop", "shift", "splice", "unshift", "reverse", "sort", "toString", "concat", "join", "slice"].forEach(function(key) {
    traverse[key] = function() {
      return Array.prototype[method].apply(this.toArray(), arguments);
    };
  });
  
  return traverse;
});