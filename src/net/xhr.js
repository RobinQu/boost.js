define(["../core", "../runtime/base64", "../runtime/json"], function(boost, $base64, $json) {
  
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
      return;
    }
    this.xhr.setRequestHeader(key, value);
    return this;
  };
  
  Request.prototype.basic = function (user, password) {
    this.set("Authorization", "Basic " + $base64.encode(user + ":" + password));
    return this;
  };
  
  Request.prototype._handleData = function (data) {
    //stringify plain objects to JSON string
    if(typeof data === "object" && boost.classType(data) === "Object") {//plain object
      data = $json.stringify(data);
    }
    return data;
  };
  
  Request.prototype.send = function (method, data, callback) {
    if(method && ["POST", "GET", "DELETE", "OPTION", "PUT"].indexOf(method.toUpperCase()) > -1) {
      this.method = method;
    }
    
    //default to be async, with no username and password
    this.open(this.method, this.url);
    if(data && ["GET", "OPTION"].indexOf(method.toUpperCase()) === 0) {//we can send data
      this.send(this._handleData());
    }
  };
  
  Request.prototype.abort = function () {
    this.xhr.abort();
  };
  
  boost.Request = Request;
  return Request;
});