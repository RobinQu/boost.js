define({
  
  access: function(obj, path, callback) {
    if(obj === null || obj === undefined) {
      return null;
    }
    
    var ps = path.split("."),
        cur = obj,
        i, len, k, prefix = [];
    
    for(i=0,len=ps.length; i<len; i++) {
      k = ps[i];
      try {
        cur = cur[k];
        prefix.push(k);
        if(callback) {
          callback(cur, k, prefix.join("."), i===ps.length);
        }
      } catch(e) {
        break;
      }
    }
    
    return cur;
    
  }
  
});