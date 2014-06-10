define(["core"], function(boost) {
  boost.query = {
    one: function(selector, el) {
      el = el || document;
      return el.querySelector(selector);
    },
    all: function(selector, el) {
      el = el || document;
      return el.querySelectorAll(selector);
    }
  };
  return boost.query;
});