define({
  
  access: function(obj, path, callback) {
    if(obj === null || obj === undefined) {
      return null;
    }
    
    var ps = path.split("."),
        cur = obj,
        i, len, k, prefix = [];
    
    // console.log(cur, ps);
    if(callback) {
      callback(obj, "@" , "", 0);
    }
    for(i=0,len=ps.length; i<len; i++) {
      k = ps[i];
      
      try {
        cur = cur[k];
        prefix.push(k);
        // console.log(prefix);
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