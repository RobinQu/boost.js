define(function() {
  
  var List = function(elems, selector) {
    var i, len;
    len = this.length =(elems || []).length;
    for(i=0; i<len; i++) {
      this[i] = elems[i];
    }
    this.selector = selector;
  };
  
  List.prototype.toArray = function () {
    return Array.prototype.slice.call(this);
  };
  
  return List;
});