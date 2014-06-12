define({
  
  
  access: function(obj, path, callback, value) {
    if(obj === null || obj === undefined) {
      return null;
    }
    
    var ps = path.split("."),
        cur = obj,
        i, len, k, prefix = [],
        setter = arguments.length > 3;
    
    // console.log(cur, ps);
    if(!setter && callback) {
      callback(obj, "@" , "", 0);
    }
    for(i=0,len=ps.length; i<len; i++) {
      k = ps[i];
      
      
      try {
        cur = cur[k];
        if(setter && i === len-2) {//setter
          k = ps[i+1];
          cur[k] = value;
          return;
        }
        prefix.push(k);
        // console.log(prefix);
        if(!setter && callback) {
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