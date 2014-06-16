define(["../runtime"], function(boost) {
  
  var Change = function(change, prefix, path) {
    this.name = change.name;
    //normlalize type name
    this.type = change.type === "new" ? "add" : change.type;
    this.from = change.oldValue;
    this.prefix = prefix;
    this.to = path ? boost.access(change.object[this.name], path) : change.object[this.name];
    this.path = path;
  };
  
  return Change;
  
});