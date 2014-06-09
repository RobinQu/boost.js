define(function() {
  
  var List = function(elems, selector) {
    var i, len;
    if(elems && elems.nodeType) {//a single node
      if(elems.nodeType === 11) {//expand document fragment
        elems = (function() {
          var el = elems.firstChild,
              ret = [];
          do {
            if(el.nodeType!==1) {
              continue;
            }
            ret.push(el);
            el = el.nextSibling;
          } while(el);
          return ret;
        })();
      } else {//wrap a single node
        elems = [elems];
      }
    }
    len = this.length =(elems || []).length;
    for(i=0; i<len; i++) {
      this[i] = elems[i];
    }
    this.selector = selector;
  };
  
  List.prototype.toArray = function () {
    return Array.prototype.slice.call(this);
  };
  
  List.prototype.size = function () {
    return this.length;
  };
  
  return List;
});