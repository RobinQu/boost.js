define(["./value"], function(value) {
  var attrs = {};
  
  // set or get attr
  attrs.attr = function(name, val) {
    if(val === null) {//remover
      return this.removeAttr(name);
    }
  
    if(val !== undefined) {//setter
      return this.forEach(function(el) {
        el.setAttribute(name, val);
      });
    }
    
    return this[0] && this[0].getAttribute(name);
  };
  
  // remove attr
  attrs.removeAttr = function(name) {
    return this.forEach(function(el) {
      el.removeAttribute(name);
    });
  };
  
  // set or get a property
  attrs.porp = function(name, val) {
    if(val === undefined) {//setter
      return this[0] && this[0][name];
    }
    
    return this.forEach(function(el) {
      el[name] = val;
    });
  };
  
  attrs.val = attrs.value = function(val) {
    if(arguments.length === 0) {//getter
      return this[0] ? value(this[0]) : undefined;
    }
    return this.forEach(function(el) {
      value(el, val);
    });
  };
  
  return attrs;
});