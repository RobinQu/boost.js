define(function() {
  var Logger, consoleAdapter;
  
  Logger = function(topic) {
    this.topic = topic;
    this.enabled = true;
    this.level = "INFO";
  };
  
  Logger.levels = ["INFO", "DEBUG", "WARN", "ERROR"];
  
  /* level, content */
  Logger.prototype.log = function () {
    //do nothing
  };
  
  Logger.levels.forEach(function(level) {
    Logger.prototype[level.toLowerCase()] = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift(level);
      return this.write.apply(this, args);
    };
  });
  
  Logger.create = function(topic, adapter) {
    topic = topic || "";
    adapter = consoleAdapter;
    return adapter(topic);
  };
  
  consoleAdapter = function(topic, logger) {
    if(!logger) {
      logger = new Logger();
    }
    logger.log = function() {
      
    };
    return logger;
  };
  
  return {
    Logger: Logger,
    getLogger: Logger.create,
    adapters: {
      consoleAdapter: consoleAdapter
    }
  };
});