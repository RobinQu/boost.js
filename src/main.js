require.config({
  packages: ["core", "dom", "runtime", "promise", "net"]
});

define([
  "core",
  "dom",
  "runtime",
  "promise",
  "net"
], function(boost) {
  if(!window.boost) {
    window.boost = boost;
  }
  return boost;
});