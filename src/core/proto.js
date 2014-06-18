define(function() {
  
  //https://code.google.com/p/phantomjs/issues/detail?id=522
  if(!Function.prototype.bind) {
    Function.prototype.bind = function(context) {
      var slice = Array.prototype.slice,
          fn = this,
          args = slice.call(arguments, 1);

      if (args.length) {
        return function() {
            return arguments.length ? fn.apply(context, args.concat(slice.call(arguments))) : fn.apply(context, args);
        };
      }
      return function() {
        return arguments.length ? fn.apply(context, arguments) : fn.call(context);
      };
    };
  }
  
  //Space triming
  if(!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    };
  }
  
  if(!Array.prototype.forEach) {
    Array.prototype.forEach = function(fn, context) {
      var i,len;
      for(i=0,len=this.length; i<len; i++) {
        fn.call(context || null, this[i], i, this);
      }
    };
  }
  
  if(!Array.prototype.reduce) {
    Array.prototype.reduce = function(fn, initial) {
      if(!initial && !this.length) {
        throw new TypeError("nothing to reduce");
      }
      if(initial !== undefined || this.length > 1) {
        var i,len, prev, next;
        if(initial) {
          i = 0;
          prev = initial;
        } else {
          prev = this[0];
          i = 1;
        }
        for(len=this.length;i<len;i++) {
          prev = fn.call(prev, this[i], i, this);
        }
        return prev;
      } else {
        return initial || this[0];
      }
    };
  }
  
  if(!Object.keys) {
    Object.keys = function (obj) {
        var k=[], o;
        for (o in obj) {
          if(obj.hasOwnProperty(obj[o])) {
            k[k.length]=o;
          }
        }
        return k;
    };
  }
  
  return {};
  
});