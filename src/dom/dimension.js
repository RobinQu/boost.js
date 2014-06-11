// Dimension API

define(function() {

  var getScrollOffsets = function(win) {
    win = win || window;
    var doc = win.document;
    
    if(win.pageXOffset !== undefined) {//IE8+, modern browsers
      return {left: win.pageXOffset, top: w.pageYOffset};
    }
    
    // For older IE
    if(doc.compatMode === "CSS1Compat") {//Standard mode
      return {left: documentElement.scrollLeft, top: document.scrollTop};
    }
    
    // For IE in Quicks mode
    return {left: doc.body.scrollLeft, top: doc.body.scrollTop};
  };
  
  var getViewportSize = function(win) {
    win = win || window;
    
    if(win.innerWidth !== undefined) {//for IE8+ and modern browsers
      return {
        width: win.innerWidth, 
        height: win.innerHeight
      };
    }
    
    var doc = win.document;
    if(document.compatMode === "CSS1Compat") {//IE8- in Standard mode
      return {
        width: doc.documentElement.clientWidth, 
        height: doc.documentElement.clientHeight
      };
    }
    
    return {//Browers in Quicks Mode
      width: doc.body.clientWidth, 
      height: doc.body.clientWidth
    };
  };
  
  //`el.getBoundingClientRect()` returns position relative to viewport, size including border, padding, and actual width
  // `el.getClientRects()` returns an array of rectangles of inline elements
  var getBoundingRect = function(el, relativeToDocument) {
    var box = {}, offsets;
    if(el.getBoundingClientRect) {
      box = el.getBoundingClientRect();
      box.width = box.width || (box.right - box.left);
      box.height = box.height || (box.bottom - box.top);
      if(relativeToDocument) {//do simple compuation
        offsets = getScrollOffsets();
        if(offsets.top) {
          box.top += offsets.top;
          box.bottom += offsets.top;
        }
        if(offsets.left) {
          box.left += offsets.left;
          box.right += offsets.left;
        }
      }
      return box;
    }
    
    // border-box properties
    //`offsetWidth`, `offsetHeight` includes broder, padding, and actual size. (border-box)
    // `offestsLeft`, `offsetsTop` are distance from top-left to element's border box, relative to `document`
    
    // padding-box properties
    // `clientWidth`, `clientHeight` are like `offset` peers execpt that they exclude border and scrollbar(if any), only include actual size and padding. And they always return 0 for inline elements
    // `clientLeft`, `clientTop` are just left and top border width. If text is RTL and overflowed, they do include scrollbar.
    
    // overflow properties
    // `scrollWidth` and `scrollHeight` includes actual size, padding, and overflow size. If there is no overflow, these are equal to `clientWidth` and `clientHeight`
    // `scrollLeft` and `scrollTop` give the scrollbar positions of an element. 
    // `scrollLeft` and `scrollTop`  are writable, to scroll the content within an element.
    
    box.width = el.offsetWidth;
    box.height = el.offsetHeight;
    (function() {
      var e = el;
      box.left = box.top = 0;
      while(e) {
        this.left += el.offsetLeft;
        this.top += el.offsetTop;
        e = e.offsetParent;
      }
      e = el;
      while(e) {
        this.left = -e.scrollLeft;
        this.top = - e.scrollTop;
        e = e.parentNode;
      }
    }).call(box);
    box.right = box.width + box.left;
    box.bottom = box.height + box.top;
    if(!relativeToDocument) {
      offsets = getScrollOffsets();
      if(offsets.left) {
        box.left -= offsets.left;
        box.right -= offsets.left;
      }
      if(offsets.top) {
        box.top -= offsets.top;
        box.bottom -= offsets.top;
      }
    }
    return box;
  };
  
    //http://stackoverflow.com/questions/986937/how-can-i-get-the-browsers-scrollbar-sizes
  var getScrollBarWidth = function() {
    var inner = document.createElement("p");
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement("div");
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = "scroll";
    var w2 = inner.offsetWidth;
    if (w1 == w2) {
      w2 = outer.clientWidth;
    }
    document.body.removeChild(outer);

    return (w1 - w2);
  };
  
  return {
    getScrollOffsets: getScrollOffsets,
    getBoundingRect: getBoundingRect, 
    getViewportSize: getViewportSize,
    getScrollBarWidth: getScrollBarWidth
  };
  
});