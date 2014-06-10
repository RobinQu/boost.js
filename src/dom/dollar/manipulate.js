define(["../css", "../text"], function(css, text) {
  
  var manip = {};
  
  //get or set text
  manip.text = function(str) {
    //set
    if(str) {
      return this.forEach(function(el) {
        var node;
        if(el.nodeType === 11) {//DocumentFragment
          do {
            node = el.firstChild;
            el.removeChild(node);
          } while(el.firstChild);
        } else {
          text(el, str);
        }
      });
    }
    
    var out = [];
    this.forEach(function(el) {
      out.push(text(el));
    });
    return out.join("");
  };
  
  //get or set html string
  manip.html = function(html) {
    if(html) {
      return this.forEach(function(el) {
        el.innerHTML = html;
      });
    }
    
    return this[0] && this[0].innerHTML;
  };
  
  //get or set css style
  manip.css = function(prop, value) {
    if(!value && typeof prop === "string") {
      return css(this[0], prop);
    }
    this.forEach(function(el) {
      css(el, prop, value);
    });
    return this;
  };
  
  manip.prepend = function(value) {
    var dom = this.dom;
    this.forEach(function(el, i) {
      dom(value).forEach(function(target) {
        // deep clone the target if we intend to prepend `target` to multiple destination
        target = i ? target.cloneNode(true) : target;
        if(el.children.length) {//insert before the first child
          el.insertBefore(target, el.firstChild);
        } else {//insert at the end; will enter this block once for every target
          el.appendChild(target);
        }
      });
    });
    return this;
  };
  
  //append elements to the matched elements in the list
  manip.append = function(value) {
    var dom = this.dom;
    this.forEach(function(el, i) {
      dom(value).forEach(function(target) {
        // deep clone if we intend to append to multiple destinations
        target = i ? target.cloneNode(true) : target;
        el.appendChild(target);
      });
    });
    return this;
  };
  
  //insert elements before the matched elements in the list
  manip.insertAfter = function(value) {
    var dom = this.dom;
    
    this.forEach(function(el) {
      dom(value).forEach(function(target, i) {
        if(!target.parentNode) {//if it's not in a subtree, we cannot insert after it
        return;
        }
        el = i ? el.cloneNode(true) : el;
        //insert before the target's next sibling
        target.parentNode.insertBefore(el, target.nextSibling);
      });
    });
    
    return this;
  };
  
  //append matched elements to the target
  manip.appendTo = function(value) {
    this.dom(value).append(this);
    return this;
  };
  
  //replace elements
  manip.replace = function(value) {
    var self = this;
    this.dom(value).forEach(function(el, i) {
      var old = self[i], 
          parent = old.parentNode;
      if(!parent) {
        return;
      }
      el = i ? el.cloneNode(true) : el;
      parent.replaceChild(el, old);
    });
    return this;
  };
  
  //empty dom elements in the list
  manip.empty = function() {
    return this.forEach(function(el) {
      setText(el, "");
    });
  };
  
  //remove matched elements from their parents
  manip.remove = function() {
    return this.forEach(function(el) {
      var parent = el.parentNode;
      if(parent) {
        parent.removeChild(el);
      }
    });
  };
  
  manip.clone = function() {
    return this.dom(this.map(function(el) {
      return el.cloneNode(true);
    }));
  };
  
  return manip;
});