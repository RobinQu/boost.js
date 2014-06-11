define({
  
  access: function(obj, path, callback) {
    if(obj === null || obj === undefined) {
      return null;
    }
    
    var ps = path.split("."),
        cur = obj,
        i, len, k, prefix = [];
    // console.log(obj, ps);
    for(i=0,len=ps.length; i<len; i++) {
      k = ps[i];
      // console.log(k);
      try {
        cur = cur[k];
        prefix.push(k);
        if(callback) {
          callback(cur, k, prefix.join("."), i===ps.length);
        }
      } catch(e) {
        // console.log(e.stack);
        break;
      }
    }
    
    return cur;
    
  }
  
});