define(["./proto"], function() {
  return {
    slice: Array.prototype.slice.call.bind(Array.prototype.slice),
    noop: function() {},
    classType: function(obj) {
      return Object.prototype.toString.call(obj).slice(8, -1);
    },
    isArray: function(obj) {
      return typeof obj === "object" && obj.constructor === Array;
    }
  };
});