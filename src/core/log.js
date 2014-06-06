define(function() {
  var Logger, consoleAdapter;
  
  Logger = function(topic) {
    if(!(this instanceof Logger)) {
      return Logger.create(topic);
    }
    this.topic = topic || "";
    this.enabled = true;
    this.level = "INFO";
  };
  
  Logger.prototype.enable = function () {
    this.enabeld = true;
    return this;
  };
  
  Logger.prototype.disable = function () {
    this.enabled = false;
    return this;
  };
  
  
  Logger.levels = ["INFO", "DEBUG", "WARN", "ERROR"];
  
  /* level, content */
  Logger.prototype.write = function (level, data) {
    //do nothing
  };
  
  Logger.levels.forEach(function(level) {
    level = level.toLowerCase();
    Logger.prototype[level] = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      return this.write.call(this, level, args);
    };
  });
  
  Logger.prototype.log = Logger.prototype.info;
  
  Logger.create = function(topic, adapter) {
    adapter = adapter || consoleAdapter;
    return adapter(topic);
  };
  
  consoleAdapter = function(topic, logger) {
    if(!logger) {
      logger = new Logger();
    }
    logger.write = function(level, data) {
      if(typeof data[0] === "string") {//do interpolation
        data[0] = "[%s] %s " + data[0];
        data.splice(1, 0, level, this.topic);
      } else {
        data.unshift("[" + level + "]");
        data.unshift(this.topic);
      }
      if(console[level]) {
        console[level].apply(console, data);
      }
    };
    return logger;
  };
  
  return {
    Logger: Logger,
    getLogger: Logger.create
  };
});