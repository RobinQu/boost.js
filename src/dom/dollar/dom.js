define(["../../core/misc", "./list", "./query"], function(utils, List, query) {
  
  var dom = function(selector, context) {
    
    //array
    if(utils.isArray(selector)) {
      return new List(selector);
    }
    
    //List
    if(selector instanceof List) {
      return selector;
    }
    
    //node
    if(selector.nodeName) {
      return new List([selector]);
    }
    
    if(typeof selector !== "string") {
      throw new Error("invalid");
    }
    
    //TODO support html string
    
    // selector
    var ctx = context ? (context instanceof List ? context[0] : context): document;
    
    return new List(query.all(selector, ctx), selector);
  };
  
  return dom;
  
});