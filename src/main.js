require.config({
  packages: ["core", "dom"]
});

define([
  "core",
  "dom"
], function(boost) {
  if(!window.boost) {
    window.boost = boost;
  }
  return boost;
});