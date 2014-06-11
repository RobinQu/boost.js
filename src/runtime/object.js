define(["core"], function(boost) {
  
  var fnTest = /xyz/.test(function(){var xyz;}) ? /\b_super\b/ : /.*/,
      init, XObject;
  
  init = function() {
    if(this.init) {
      this.init.apply(this, arguments);
    }
    if(this.__mixins__ && this.__mixins__.length) {
      this.__mixins__.forEach(function(mixin) {
        if(mixin.initMixin) {
          mixin.initMixin.apply(this);
        }
        boost.merge(this, mixin);
        // TODO: should avoid merge `initMixin` in the first place
        delete this.initMixin;
      }, this);
    }
  };
  
  XObject = function() {
    init.apply(this, arguments);
  };
  
  XObject.mixin = function mixin() {
    var proto = this.prototype,
        mixins = boost.slice(arguments),
        mx;
    
    mx = proto.__mixins__ = (proto.__mixins__ || []);
    mixins.forEach(function(mixin) {
      if(mx.indexOf(mixin) === -1) {
        mx.push(mixin);
      }
    });
    return this;
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
    
    //make `_super`
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
    Class.mixin = mixin;
    return Class;
  };
  
  boost.Object = XObject;
  
  return XObject;
  
});