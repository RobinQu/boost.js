define(["./context"], function(boost) {
  var DOMReady = false;
  window.addEventListener("DOMContentLoaded", function() {
    DOMReady = true;
  });
  boost.load = function DOMReady(fn) {//DOMContentLoad
    if(!fn) { return; }
    if(DOMReady) {
      fn();
    } else {
      boost.doc.addEventListener("DOMContentLoaded", fn);
    }
  };
  return DOMReady;
});