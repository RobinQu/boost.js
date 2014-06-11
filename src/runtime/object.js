define(["core"], function(boost) {
  
  var logger = boost.Logger.instrument("object");
  
  var fnTest = /xyz/.test(function(){var xyz;}) ? /\b_super\b/ : /.*/,
      XObject, init, mixin, extend;
  
  
  // object initializer
  init = function() {
    logger.log("init");
    if(this.init) {//`init` on the prototype
      this.init.apply(this, arguments);
    }
    if(this.__mixins__ && this.__mixins__.length) {//mixin support
      this.__mixins__.forEach(function(mixin) {
        if(mixin.initMixin) {
          mixin.initMixin.apply(this);
        }
        boost.mixin(this, mixin);
        // TODO: should avoid merge `initMixin` in the first place
        delete this.initMixin;
      }, this);
    }
  };
  
  XObject = function() {
    init.apply(this, arguments);
  };
  
  mixin = function() {
    logger.log("mixin");
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
  
  extend = function extend(prop) {
    var key, proto, makeSuper, _super, Child, mixins;
    
    _super = this.prototype;
    proto = boost.beget(_super);
    mixins = boost.slice(arguments, 1);
    
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
      if(typeof prop[key] === "function" && typeof _super[key] === "function" && fnTest.test(prop[key]) ) {
        proto[key] = makeSuper(key, prop[key]);
      } else {
        // console.log(key, prop[key]);
        proto[key] = prop[key];
      }
    }
    
    Child = function() {
      logger.log("construct");
      init.apply(this, arguments);
    };
    Child.prototype = proto;
    Child.prototype.consturcotr = Child;
    Child.extend = extend;
    Child.mixin = mixin;
    
    //do mixin
    if(mixins && mixins.length) {
      mixin.apply(Child, mixins);
    }
    return Child;
  };
  
  XObject.mixin = mixin;
  
  XObject.extend = extend;
  
  boost.Object = XObject;
  
  return XObject;
  
});