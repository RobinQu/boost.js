define(function() {
  var Logger, consoleAdapter, instance, ret = {}, instruments = {};
  
  Logger = function(topic, enabled) {
    if(!(this instanceof Logger)) {
      return Logger.create(topic);
    }
    this.topic = topic || "";
    this.enabled = enabled !== false;
    this.level = "INFO";
    //default to transport over console
    this.transport = console;
    this.filter = [];
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
  
  Logger.prototype.write = function (level, data) {
    if(typeof data[0] === "string") {//do interpolation
      data[0] = "[%s] %s " + data[0];
      data.splice(1, 0, level, this.topic);
      // console.log(data);
    } else {
      data.unshift("[" + level + "]");
      data.unshift(this.topic);
    }
    
    if(this.transport[level]) {
      this.transport[level].apply(this.transport, data);
    }
  };
  
  Logger.prototype.addFilter = function () {
    this.filter.push(Array.prototype.slice.call(arguments));
  };
  
  Logger.prototype.resetFilter = function () {
    this.filter.length = 0;
  };
  
  Logger.prototype._filter = function () {
    //topic is blocked
    return this.topic && this.filter.indexOf(this.topic) > -1;
  };
  
  Logger.levels.forEach(function(level) {
    level = level.toLowerCase();
    Logger.prototype[level] = function() {
      if(this.enabled && !this._filter()) {
        var args = Array.prototype.slice.call(arguments, 0);
        return this.write.call(this, level, args);
      }
    };
  });
  
  Logger.prototype.log = function() {
    var level = this.level.toLowerCase();
    this[level].apply(this, arguments);
  };
  
  Logger.create = function(topic) {
    return new Logger(topic);
  };
  Logger.instrument = function(topic) {
    //disabled by default
    var logger = Logger.create(topic);
    logger.disable();
    instruments[topic] = logger;
    return instruments[topic];
  };
  
  instance = Logger.create();
  ret.Logger = Logger;
  ["warn", "log", "info", "error", "debug"].forEach(function(k) {
    ret[k] = instance[k].bind(instance);
  });
  ret.getLogger = Logger.create;
  
  //enable instrument log
  ret.instrument = function(topics, disable) {
    var i, len, instrument;
    if(topics === true) {//disable all instruments
      for(i in instruments) {
        if(instruments.hasOwnProperty(i)) {
          instruments[i].disable();
        }
      }
      return;
    }
    topics = topics.split(",");
    for(i=0,len=topics.length; i<len; i++) {
      instrument = instruments[topics[i].trim()];
      if(disable) {
        instrument.disable();
      } else {
        instrument.enable();
      }
    }
  };
  
  return ret;
});