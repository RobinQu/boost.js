require.config({
  paths: {
    boost: "../../../build/boost"
  }
});


define(["boost"], function(boost) {
  
  var evts = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'keydown', 'keyup', 'beforedeactivate', 'mousedown', 'mouseup', 'dragenter', 'dragover', 'dragleave', 'drop', 'click', 'dblclick', 'mousemove', 'contextmenu', 'focus', 'blur'];
  
  var root = boost.$(".lab-area");
  
  var handler = function(e) {
    console.log(e);
  };
  
  evts.forEach(function(evt) {
    // boost.Event.add(document, )
    root.on(evt, handler);
  });

});