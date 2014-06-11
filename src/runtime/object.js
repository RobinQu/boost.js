define(["core"], function(boost) {
  
  var fnTest = /xyz/.test(function(){var xyz;}) ? /\b_super\b/ : /.*/,
      init;
  
  init = function() {
    if(this.init) {
      this.init.apply(this, arguments);
    }
  };
  
  var XObject = function() {
    init.apply(this, arguments);
  };
  
  XObject.extend = function extend(prop) {
    var key, proto, makeSuper, _super, Child;
    
    _super = this.prototype;
    proto = boost.beget(_super);
    
    makeSuper = function(name, fn) {
      return function() {
        var ret, tmp;
        tmp = this._super;
        this._super = _super[name];
        ret = fn.apply(this, arguments);
        this._super = tmp;
        
        return ret;
      };
    };
    for(key in prop) {
      if(typeof prop[name] === "function" && typeof  _super[name] === "function" && fnTest.test(prop[name]) ) {
        proto[key] = makeSuper(name, prop[name]);
      } else {
        proto[key] = prop[name];
      }
    }
    Child = function() {
      init.apply(this, arguments);
    };
    
    Child.prototype = proto;
    Child.prototype.consturcotr = Child;
    Child.extend = extend;
    
    return Class;
  };
  
});