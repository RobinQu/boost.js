// For experimental purpose, we rely on the simple `window.JSON`
// [Production-ready JSON implmentation](https://github.com/douglascrockford/JSON-js) is also created by Douglas Crockford

define(["../core"], function(boost) {
  boost.JSON = window.JSON;
  return boost.JSON;
});