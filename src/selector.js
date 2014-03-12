define(["./context"], function(boost) {
  var $ = function (selector) {
    return boost.doc.querySelectorAll(selector);
  };
  boost.$ = $;
  return $;
});