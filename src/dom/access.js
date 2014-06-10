define(["./match"], function(match) {
  
  return function access(name, el, selector, limit) {
    var ret = [];
    
    el = el[type];
    limit = limit || 1;
    if(!el) {
      return ret;
    }
    do {
      if(limit === ret.length) {//reach the limit
        break;
      }
      if(el.nodeType !== 1) {//only accept element nodes
        continue;
      }
      if(match(el, selector)) {
        ret.push(el);
      }
      if(!selector) {
        ret.push(el);
      }
    } while(el = el[type]);
    
    return ret;
  };
  
});