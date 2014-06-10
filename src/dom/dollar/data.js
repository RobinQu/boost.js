define(["../data"], function(data) {
  
  return {
    
    data: function(k, v) {
      if(v === undefined) {//getter
        return data(this[0], k);
      }
      return this.forEach(function(el) {
        data(el, k, v);
      });
    }
    
  };
  
});