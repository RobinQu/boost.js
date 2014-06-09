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
  
  List.prototype.ext = function (name, fn) {
    if(name && fn && typeof fn === "function") {
      List.prototype[name] = fn;
      return;
    }
    var k;
    for(k in name) {//treat `name` as an object hash
      if(name.hasOwnProperty(k)) {
        List.prototype[k] = name[k];
      }
    }
  };
  
  return List;
});