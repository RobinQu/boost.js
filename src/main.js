require.config({
  packages: ["core", "dom", "runtime", "promise", "net", "observer"]
});

define([
  "core",
  "dom",
  "runtime",
  "promise",
  "net",
  "observer"
], function(boost) {
  if(!window.boost) {
    window.boost = boost;
  }
  return boost;
});