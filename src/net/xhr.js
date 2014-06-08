define(["../core", "../runtime"], function(boost) {
  
  var logger = boost.Logger.instrument("net:xhr");
  
  // XHR Factory
  // replace this function to support customized XHR
  boost.xhr = function() {
    logger.log("create xhr");
    if (window.ActiveXObject) {
      return new window.ActiveXObject("Microsoft.XMLHTTP");
    } else if(window.XMLHttpRequest) {
      return new XMLHttpRequest();
    }
    return false;
  };
  
  var Request = function(options) {
    if(!(this instanceof Request)) {
      return new Request(options);
    }
    
    logger.log("construct");
    this.xhr = boost.xhr();
    this.method = options.method || "GET";
    if(options.headers) {
      this.set(options.headers);
    }
    this.url = options.uri || options.url;
    this.withCredential = options.withCredential || false;
    this.timeout = options.timeout || 1000 * 8;
    this.deferred = boost.deferred();
    this.response = {};
    this.timer = null;

    this.xhr.onreadystatechange = this._handlestatechange.bind(this);
  };
  
  Request.prototype.set = function (key, value) {
    if(typeof key === "object") {
      var k,v;
      for(k in key) {
        if(key.hasOwnProperty(k)) {
          v = key[k];
          this.set(k, v);
        }
      }
      return this;
    }
    this.xhr.setRequestHeader(key, value);
    return this;
  };
  
  Request.prototype.basic = function (user, password) {
    this.set("Authorization", "Basic " + boost.base64.encode(user + ":" + password));
    return this;
  };
  
  Request.prototype._handleData = function (data) {
    logger.log("handle data");
    //stringify plain objects to JSON string
    if(typeof data === "object" && boost.classType(data) === "Object") {//plain object
      data = boost.JSON.stringify(data);
    }
    return data;
  };
  
  Request.prototype._handlestatechange = function () {
    var status, response = {},
        //Copied from jQuery.ajax
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg;
        
    logger.log("onreadystatechange", this.url, this.xhr.readyState);
    switch(this.xhr.readyState) {
    case 1:
      //connection is opened
      break;
    case 2:
      //headers received
      break;
    case 3:
      //loading in progress; `this.xhr.responseText` has partial data
      break;
    case 4:
      if(this.timer) {//clear if necessary
        clearTimeout(this.timer);
      }
      this.xhr.onreadystatechange = boost.noop;
      try {//try to build necessary data
        response.status = status = this.xhr.status;
        response.text = this.xhr.responseText;
        response.headers = (function(xhr) {
          var str = xhr.getAllResponseHeaders() || "",
              match,
              ret = {};
          
          while(!!(match = rheaders.exec(str))) {
            ret[match[1].toLowerCase()] = match[2];
          }
          return ret;
        })(this.xhr);
      } catch(e) {
        logger.warn(e.stack ? e.stack : e);
      }
      try {//try to parse data
        response.body = boost.JSON.parse(response.text);
      } catch(e) {
        logger.warn(e.stack ? e.stack : e);
      }
      
      if(status >= 400 && status < 500) {
        this.deferred.reject(new Error("client error"), response);
      } else if(status >= 500) {
        this.deferred.reject(new Error("server error"), response);
      } else {
        this.deferred.resolve(response);
      }
      break;
    }
  };
  
  Request.prototype.write = function (data) {
    if(data && ["GET", "OPTION"].indexOf(method.toUpperCase()) === 0) {//we can send data
      logger.log("before send");
      this.xhr.send(this._handleData());
      logger.log("after send");
    }
    return this;
  };
  
  Request.prototype.end = function (callback) {
    logger.log("before open", this.method, this.url);
    //default to be async, with no username and password
    this.xhr.open(this.method, this.url);
    logger.log("after open");
    
    
    if("timeout" in this.xhr) {//support timeout
      this.xhr.timeout = this.timeout;
    } else {
      this.timer = setTimeout(function() {
        logger.log("timeout");
        this.abort("time out");
      }.bind(this), this.timeout);
    }
    
    if(callback) {
      return this.deferred.promise.then(function(resp) {
        callback(null, resp);
      }, callback);
    }
    
    return this.deferred.promise;
  };
  
  ["post", "put", "get", "delete", "option"].forEach(function(name) {
    Request[name] = function(options) {
      options.method = name;
      return new Request(options);
    };
  });
  
  Request.prototype.abort = function (reason) {
    logger.log("abort");
    this.xhr.abort();
    this.deferred.reject(new Error(reason));
  };
  
  boost.Request = Request;
  boost.ajax = function(options) {
    var r = new Request(options);
    return r.end();
  };
  return Request;
});