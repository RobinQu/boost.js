require.config({
  packages: ["core", "dom", "runtime", "promise"]
});

define([
  "core",
  "dom",
  "runtime",
  "promise"
], function(boost) {
  if(!window.boost) {
    window.boost = boost;
  }
  return boost;
});