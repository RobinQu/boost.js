(function(window, undefined) {
  "use strict";
  (function(factory) {
    if("function" === typeof window.define && window.define.amd) {
      window.define("boost", factory);
    } else {
      window.boost = factory();
    }
  }(function() {
    var doc = window.document,
        boost;
        
    window.addEventListener("DOMContentLoaded", boost.DOMContentLoadCallback);
    boost = function(fn) {//DOMContentLoad
      if(!fn) { return; }
      if(boost.DOMReady) {
        fn();
      } else {
        doc.addEventListener("DOMContentLoaded", fn);
      }
    };
    boost.DOMContentLoadCallback = function() {
      this.DOMReady = true;
    };
    boost.$ = function(selector) {
      return doc.querySelectorAll(selector);
    };
    
    return boost;
  }));
}(this));