define(["./proto"], function() {
  return {
    slice: Array.prototype.slice.call.bind(Array.prototype.slice),
    noop: function() {}
  };
});