define(function() {
  
  /**
    * Simulated classList
   */
  var ClassList = function(elem) {
    var classes = (elem.getAttribute("class") || "").trim().split(/\s+/) || [],
        i = 0,
        len = classes.length;
    this.list = classes;
    //cache the elem using a closure
    this._update = function() {
      elem.setAttribute("class", this.toString());
    };
  };
  
  ClassList.prototype.toString = function () {
    return this.list.join(" ");
  };
  
  ClassList.prototype._checkAndGetIndex = function (item) {
    if(item.trim() === "") {
      //TODO: throw a DOMException like native ClassList
      throw new Error();
    }
    return this.list.indexOf(item);
  };
  
  ClassList.prototype.contains = function (item) {
    return this._checkAndGetIndex(item+"");
  };
  
  ClassList.prototype.add = function () {
    var items = Array.prototype.slice(arguments, 0),
        i, len,
        item, needUpdate = false;
        
    for(i=0,len=tokens.length; i<len; i++) {
      // force a conversion
      item = items[i] + "";
      if(this._checkAndGetIndex(item) === -1) {
        this.list.push(item);
        needUpdate = true;
      }
    }
    if(needUpdate) {
      this._update();
    }
  };
  
  ClassList.prototype.remove = function () {
    var items = arguments,
        i, len, idx,
        item, needUpdate = false;
    for(i=0,len=items.length; i<len; i++) {
      item = items[i] + "";
      idx = this._checkAndGetIndex(item);
      if(idx !== -1) {
        this.list.splice(idx, 1);
        needUpdate = true;
      }
    }
    if(needUpdate) {
      this._update();
    }
  };
  
  ClassList.prototype.toggle = function (item, switcher) {
    item += "";
    var result = this.contains(item);
    method = result ? !switcher && "remove" : switcher && "add";
    if(method) {
      this[method](item);
    }
  };
  
  var getClassList = function(el) {
    if(el.classList) {//native classList or mocked one
      return el.classList;
    }
    el.classList = new ClassList(el);
    return el.classList;
  };
  
  classes.addClass = function(name) {
    return this.forEach(function(el) {
      var list = getClassList(el);
      list.remove(name);
    });
  };
  
  classes.toggleClass = function(name, switcher) {
    var fn = "toggle";
    if(switcher !== undefined) {
      fn = swithcer ? "add" : "remove";
    }
    
    return this.forEach(function(el) {
      var list = getClassList(el);
      list[fn](name);
    });
  };
  
  classes.hasClass = function(name) {
    return this.some(function(el) {
      var list = getClassList(el);
      return list.contains(name);
    });
  };
  
  return classes;
  
});