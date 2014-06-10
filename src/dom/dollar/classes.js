define(["../class_list"], function(ClassList) {
  
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