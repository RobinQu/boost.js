define(["../core", "../runtime"], function(boost) {
  
  // XHR Factory
  // replace this function to support customized XHR
  boost.xhr = function() {
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
    this.xhr = boost.xhr();
    this.method = options.method;
    if(options.headers) {
      this.set(options.headers);
    }
    this.url = options.uri || options.url;
    this.withCredential = options.withCredential || false;
    this.timeout = options.timeout || 1000 * 8;
    this.deferred = boost.deferred();
    this.response = {};
    this.timer = null;
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
    switch(this.xhr.readyState) {
    case 2:
      break;
    case 4:
      clearTimeout(this.timer);
      this.xhr.onreadystatechange = boost.noop;
      try {//try to build necessary data
        response.status = status = this.xhr.status;
        response.text = this.xhr.responseText;
        response.headers = (function() {
          var str = this.xhr.getAllResponseHeaders() || "",
              match,
              ret = {};
          
          while(!!(match = rheaders.exec(str))) {
            ret[match[1].toLowerCase()] = match[2];
          }
        })();
      } catch(e) {
      }
      try {//try to parse data
        response.body = boost.JSON.parse(response.text);
      } catch(e) {}
      
      if(status >= 400 && status < 500) {
        this.deferred.reject(new Error("client error"), response);
      } else if(status >= 500) {
        this.deferred.reject(new Error("server error"), response);
      }
      this.deferred.resolve(response);
      break;
    }
  };
  
  Request.prototype.send = function (method, data) {
    if(method && ["POST", "GET", "DELETE", "OPTION", "PUT"].indexOf(method.toUpperCase()) > -1) {
      this.method = method;
    }
    
    //default to be async, with no username and password
    this.open(this.method, this.url);
    if(data && ["GET", "OPTION"].indexOf(method.toUpperCase()) === 0) {//we can send data
      this.send(this._handleData());
    }
    this.xhr.onreadstatechange = this._handlestatechange.bind(this);
    
    this.timer = setTimeout(function() {
      this.abort("time out");
    }.bind(this), this.timeout);
    
    return this.deferred.promise;
  };
  
  ["post", "put", "get", "delete", "option"].forEach(function(name) {
    Request.prototype[name] = function(data) {
      return this.send(name, data);
    };
  });
  
  Request.prototype.abort = function (reason) {
    this.xhr.abort();
    this.deferred.reject(new Error(reason));
  };
  
  boost.Request = Request;
  return Request;
});