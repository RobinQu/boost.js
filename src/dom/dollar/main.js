define(["../../core", "./dom", "./list", "./query"], function(boost, dom, List, query) {
  
  dom.List = List;
  dom.query = query;
  //export to boost
  boost.$ = dom;
  return dom;
  
});