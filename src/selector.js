(function(factory) {
  "use strict";
  if("function" === typeof window.define && window.define.amd) {
    window.define("boost", factory);
  } else {
    window.boost = factory();
  }
}(function() {
  var doc = window.document,
      boost;
      
  boost = function(fn) {//DOMContentLoad
    if(!fn) { return; }
    if(boost.DOMReady) {
      fn();
    } else {
      doc.addEventListener("DOMContentLoaded", fn);
    }
  };
  
  window.addEventListener("DOMContentLoaded", boost.DOMContentLoadCallback);
  
  boost.DOMContentLoadCallback = function() {
    this.DOMReady = true;
  };
  boost.$ = function(selector) {
    return doc.querySelectorAll(selector);
  };
  
  return boost;
}));