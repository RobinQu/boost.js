define(function() {
  
  var List = function(elems, selector) {
    var i, len;
    for(i=0, len=(elems || []).length; i<len; i++) {
      this[i] = elems[i];
    }
    this.selector = selector;
    this.length = 0;
  };
  
  List.prototype.toArray = function () {
    return Array.prototype.slice.call(this);
  };
  
  return List;
});