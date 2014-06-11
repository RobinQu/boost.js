define(["core", "./object_observer", "./path_observer"], function(boost, ObjectObserver, PathObserver) {
  
  boost.ObjectObserver = ObjectObserver;
  
  boost.PathObserver = PathObserver;
  
  return boost;
});