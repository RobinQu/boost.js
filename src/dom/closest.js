define(["./match"], function(match) {
  
  return function(el, selector, checkSelf, within) {
    
    el = checkSelf ? el : el.parentNode;
    within = within || document;
    
    while(el && el !== document) {
      if(match(el, selector)) {
        return el;
      }
      
      if(el === root) {
        return;
      }
      
      el = el.parentNode;
    }
    
  };
  
});