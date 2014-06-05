define(["../core", "./ready"], function(boost, $ready) {
  
  if(window.localStorage) {
    boost.storage = window.localStorage;
  } else if(document.cookie) {//cookies enabled
    //form MDC
    boost.storage = {
      
      getItem: function (sKey) {
        if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
        return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
      },
      key: function (nKeyId) {
        return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
      },
      setItem: function (sKey, sValue) {
        if(!sKey) { return; }
        document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
        this.length = document.cookie.match(/\=/g).length;
      },
      length: 0,
      removeItem: function (sKey) {
        if (!sKey || !this.hasOwnProperty(sKey)) { return; }
        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        this.length--;
      },
      /*jshint -W001 */
      hasOwnProperty: function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
      }
    };
    
    boost.storage.length = document.cookie.match(/\=/g).length;
    
  } else {//fallback to userdata
    var id = "__boost_storage__", el;
    $ready(function() {
     el = document.createElement("div");
     el.id = id;
     el.style.display = "none";
     el.addBehavior("#default#userdata");
     document.body.appendChild(el);
    });
    boost.storage = {
      getItem: function(k) {
        k = escape(k);
        return el && el.getAttribute(k);
      },
      setItem: function(k, v) {
        k = escape(k);
        if(el) {
          el.setAttribute(k, v);
          this.length++;
        }
      },
      length: 0,
      removeItem: function(k) {
        if(el) {
          el.removeAttribute(k);
          this.length--;
        }
      },
      key: function(k) {
        return (k in el.attributes);
      }
    };
  }
  return boost;
});