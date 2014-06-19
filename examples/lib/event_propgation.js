(function() {
  
  var addEvent = function(el, eventType, handler, capture) {
    eventType = eventType.toLowerCase();
    if(window.addEventListener) {//W3C Browsers
      el.addEventListener(eventType, handler, !!capture);
    } else if(window.attachEvent) {//IE8-
      el.attachEvent("on" + eventType, handler, !!capture);
    }
  };
  
  var $ = function(id) {
    return document.getElementById(id);
  };

  var handler = function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    console.log([target.tagName, target.getAttribute("id")]);
    if(e.currentTarget) {
      console.log(e.currentTarget);
    }
    console.log([e.clientX, e.clientY]);
  };
  
  var handler2 = function(e) {
    console.log(e.type);
  };
  
  addEvent(window, "load", function() {
    addEvent(document, "click", handler);
    addEvent($("box1"), "click", handler);
    addEvent($("box2"), "click", handler);
    addEvent($("box3"), "click", handler);
    addEvent($("box4"), "click", handler);
    
    
    addEvent($("box1"), "mouseenter", handler2);
    addEvent($("box1"), "mouseover", handler2);
  });
  
  
}());