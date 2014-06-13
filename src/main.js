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
  return boost;
});