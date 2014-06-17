define(["../core"], function(boost) {
  var DOMReady = false,
      listeners = [],
      notfiyDOMReady,
      notifiyReadStateChange,
      doScrollCheck,
      bindDOMReady;
  
  notfiyDOMReady = function() {
    //mark ready
    DOMReady = true;
    
    // console.log(document.removeChild);
    //remove listeners for ready events
    if(document.removeEventListener) {
      document.removeEventListener("DOMContentLoaded", notfiyDOMReady);
    } else {
      document.detachEvent("onreadystatechange", notifiyReadStateChange);
    }
    // invoke callbacks
    var invoke = function(func) {
      // setTimeout(function() {
      //   
      // }, 0);
      try {
        func();
      } catch(e) {}
    };
    //FIFO
    while(listeners.length) {
      invoke(listeners.shift());
    }
  };
  
  notifiyReadStateChange = function() {
    if(!DOMReady) {
      if(!document.body) {
        return setTimeout(notifiyReadStateChange, 5);
      }
      notfiyDOMReady();
    }
  };
  
  doScrollCheck = function() {
    if(DOMReady) {
      return;
    }
    try {
      document.documentElement.doScroll("left");
    } catch(e) {
      setTimeout(doScrollCheck, 5);
      return;
    }
    notfiyDOMReady();
  };
  
  if(window.addEventListener) {
    //for thoese that support `DOMContentLoaded`
    window.addEventListener("DOMContentLoaded", notfiyDOMReady);
    // fallback to `load` event, which always works
    window.addEventListener("load", notfiyDOMReady);
  } else if(window.attacheEvent) {
    window.attachEvent("onreadystatechange", notifiyReadStateChange);
    // fallback to `load` event for IE
    window.attachEvent("onload", notfiyDOMReady);
    //Scroll check for IE
    if(!window.frameElement && document.documentElement.doScroll) {//inside a iframe
      doScrollCheck();
    }
  }
  
  bindDOMReady = function(fn) {
    if(!fn) { return; }
    // if the document is already loaded
    if(document.readyState !== "loading") {
      return fn();
    }
    // if DOMReady already happens
    if(DOMReady) {
      return fn();
    }
    listeners.push(fn);
  };
  
  boost.ready = bindDOMReady;
  
  return bindDOMReady;
});