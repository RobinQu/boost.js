define(function() {
  var Logger, consoleAdapter;
  
  Logger = function(topic) {
    this.topic = topic;
    this.enabled = true;
    this.level = "INFO";
  };
  
  Logger.levels = ["INFO", "DEBUG", "WARN", "ERROR"];
  
  /* level, content */
  Logger.prototype.write = function () {
    //do nothing
  };
  
  Logger.levels.forEach(function(level) {
    Logger.prototype[level.toLowerCase()] = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift(level);
      return this.write.apply(this, args);
    };
  });
  
  Logger.prototype.log = Logger.prototype.info;
  
  Logger.create = function(topic, adapter) {
    topic = topic || "";
    adapter = adapter || consoleAdapter;
    return adapter(topic);
  };
  
  consoleAdapter = function(topic, logger) {
    if(!logger) {
      logger = new Logger();
    }
    logger.write = function(level) {
      var args = Array.prototype.slice(arguments, 1);
      console[level].apply(console, args);
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