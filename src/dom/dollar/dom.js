define(["../../core/misc", "./list", "./query", "./parse"], function(utils, List, query, parse) {
  
  var quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;
  
  var isHTML = function(str) {
    if (str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3) return true;

    // Run the regex
    var match = quickExpr.exec(str);
    return !!(match && match[1]);
  };
  
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
    
    var html = selector.trim();
    if(isHTML(html)) {
      return new List([parse(html)]);
    }
    
    // selector
    var ctx = context ? (context instanceof List ? context[0] : context): document;
    
    return new List(query.all(selector, ctx), selector);
  };
  
  return dom;
  
});