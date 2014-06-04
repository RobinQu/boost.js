define(function() {
  var context = {
    win: window,
    undefined: undefined,
    doc: window.document,
    noop: function() {}
  };
  //https://code.google.com/p/phantomjs/issues/detail?id=522
  context.bind = function(fn, context) {
    var slice = Array.prototype.slice,
        args = slice.call(arguments, 2);
    if(Function.prototype.bind) {
      args.unshift(context);
      return fn.bind.apply(fn, args);
    }
    
    if (args.length) {
      return function() {
          return arguments.length ? fn.apply(context, args.concat(slice.call(arguments))) : fn.apply(context, args);
      };
    }
    return function() {
      return arguments.length ? fn.apply(context, arguments) : fn.call(context);
    };
  };
  context.slice = context.bind(Array.prototype.slice.call, Array.prototype.slice);
  
  context.mixin = function mixin() {
    var args = context.slice(arguments),
        target = args.shift(),
        ret;
    if(!target) {return;}
    if(!args.length) { return mixin(context, target);}
    ret = args.reduce(function(prev, props) {
      Object.keys(props).forEach(function(k) {
        prev[k] = props[k];
      });
      return prev;
    }, target);
    return ret;
  };
  
  context.getGlobalID = (function() {
    var i = 0;
    return function() {
      return i++;
    };
  }()); 
  
  context.generateGuid = function(obj, prefix) {
    obj.guid = (prefix || "") + context.getGlobalID();
    return obj.guid;
  };
  
  context.hashFor = function() {
    var i, len, obj, h = [];
    for(i=0,len=arguments.length; i<len; i++) {
      obj = arguments[i];
      if(obj.hash && typeof obj.hash === "function") {
        h.push(obj.hash());
      } else {
        h.push(context.guidFor(obj));
      }
    }
    return h.join("");
  };
  
  var guidCache = {};
  
  context.guidFor = function(obj) {
    var type = typeof obj, c, ret;
    if(obj === undefined) {
      return "undefined";
    }
    if(obj === null) {
      return "null";
    }
    if(type === "number" || type === "string") {
      c = guidCache[type];
      ret = c[obj];
      if(!ret) {
        ret = type + context.generateGuid();
        c[obj] = ret;
      }
      return ret;
    }
    if(type === "boolean") {
      return obj ? type + "_true" : type + "_false";
    }
    if(obj.guid) {
      return obj.guid;
    }
    // get internal type
    type = Object.prototype.toString.call(obj).slice(8, -1);
    return context.generateGuid(obj, type);
  };
  
  return context;
});