define(["../core"], function(boost) {
  var $ = function (selector) {
    return document.querySelectorAll(selector);
  };
  boost.$ = $;
  return $;
});