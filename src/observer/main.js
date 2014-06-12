define(["core", "./object_observer", "./path_observer", "./binding"], function(boost, ObjectObserver, PathObserver, Binding) {
  
  boost.ObjectObserver = ObjectObserver;
  
  boost.PathObserver = PathObserver;
  
  boost.Binding = Binding;
  
  return boost;
});