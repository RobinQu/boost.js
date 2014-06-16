define({
  
  guidCache: {},
  
  getGlobalID: (function() {
    var i = 0;
    return function() {
      return i++;
    };
  }()),
  
  
  generateGuid: function(obj, prefix) {
    obj.guid = (prefix || "") + this.getGlobalID();
    return obj.guid;
  },
  
  hashFor: function() {
    var i, len, obj, h = [];
    for(i=0,len=arguments.length; i<len; i++) {
      obj = arguments[i];
      if(obj && obj.hash && typeof obj.hash === "function") {
        h.push(obj.hash());
      } else {
        h.push(this.guidFor(obj));
      }
    }
    return h.join("");
  },
  
  guidFor: function(obj) {
    var type = typeof obj, c, ret;
    if(obj === undefined) {
      return "undefined";
    }
    if(obj === null) {
      return "null";
    }
    if(type === "number" || type === "string") {
      c = this.guidCache[type];
      ret = c[obj];
      if(!ret) {
        ret = type + this.generateGuid();
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
    return this.generateGuid(obj, type);
  }
  
});
