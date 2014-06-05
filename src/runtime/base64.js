// For experimental purpose, we use the native base64 converters (IE10+)
// A pure JavaScript implementation has [alwarys been around](http://www.webtoolkit.info/javascript-base64.html#.U5AuJZSSxzU)
define(["../core"], function(boost) {
  boost.base64 = {
    encode: window.btoa,
    decode: window.atob
  };
  return boost.base64;
});