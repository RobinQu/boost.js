define(["../core", "./core", "./reject", "./resolve", "./race"], function(boost, PromiseA) {
  boost.Promise = PromiseA;
  return boost.Promise;
});