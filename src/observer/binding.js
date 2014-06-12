define(["runtime", "./path_observer"], function(boost, PathObserver) {
  
  if(!Object.observe) {
    return;
  }
  
  // Binding
  // Binding.from(obj1, "foo.bar").to(obj2, "foo.bar");
  
  var logger = boost.Logger.instrument("binding");
  
  var Binding = boost.Object.extend({
    
    
    init: function() {
      logger.log("construct");
      this.targetHandler = this.makeHandler(false);
      this.sourceHandler = this.makeHandler(true);
    },
    
    to: function(obj, path) {
      logger.log("to", obj, path);
      this.targetObserver = PathObserver.create(obj, path);
      this._setup();
      return this;
    },
    
    _setup: function() {
      logger.log("setup");
      var self = this;
      if(this.targetObserver && this.sourceObserver) {
        this.targetObserver.connect(this.targetHandler);
        this.sourceObserver.connect(this.sourceHandler);
      }
    },
    
    from: function(obj, path) {
      logger.log("from", obj, path);
      this.sourceObserver = PathObserver.create(obj, path);
      this._setup();
      return this;
    },
    
    destroy: function() {
      logger.log("destroy");
      this.sourceObserver.disconnect(this.sourceHandler);
      this.targetObserver.disconnect(this.targetHandler);
      this.isDestroyed = true;
    },
    
    
    // `true` means changes emited from `sourceObserver` to `targetObserver`
    // vice versa
    makeHandler: function(direction) {
      
      return function(changes) {
        logger.log("handler", direction);
        var i = changes.length,
            recieverObserver = direction ? this.targetObserver : this.sourceObserver,
            change = changes[i-1];
        // console.log(change, direction);
        recieverObserver.setValue(change.to);
        // recieverObserver.performChange(function() {
        //   
        // });
      }.bind(this);
    }
    
  });
  
  Binding.from = function(obj, path) {
    var ob = PathObserver.create(obj, path),
        binding = new Binding();
    binding.sourceObserver = ob;
    return binding;
  };
  
  Binding.to = function(obj, path) {
    var ob = PathObserver.create(obj, path),
        binding = new Binding();
    binding.targetObserver = ob;
    return binding;
  };
  
  
  return Binding;
  
});