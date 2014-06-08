(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //Allow using this built library as an AMD module
        //in another project. That other project will only
        //see this AMD call, not the internal modules in
        //the closure below.
        define("boost", [], factory);
    } else {
        //Expose boost globally if AMD is not present
        root.boost = factory();
    }
}(this, function () {
/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

define('core/proto',[],function() {
  
  //https://code.google.com/p/phantomjs/issues/detail?id=522
  if(!Function.prototype.bind) {
    Function.prototype.bind = function(context) {
      var slice = Array.prototype.slice,
          fn = this,
          args = slice.call(arguments, 1);

      if (args.length) {
        return function() {
            return arguments.length ? fn.apply(context, args.concat(slice.call(arguments))) : fn.apply(context, args);
        };
      }
      return function() {
        return arguments.length ? fn.apply(context, arguments) : fn.call(context);
      };
    };
  }
  
});
define('core/misc',["./proto"], function() {
  return {
    slice: Array.prototype.slice.call.bind(Array.prototype.slice),
    noop: function() {},
    classType: function(obj) {
      return Object.prototype.toString.call(obj).slice(8, -1);
    }
  };
});
define('core/mixin',["./misc"], function(misc) {

  return function mixin() {
    var args = misc.slice(arguments),
        target = args.shift(),
        ret;
    if(!target) {return;}
    if(!args.length) { return mixin(context, target);}
    ret = args.reduce(function(prev, props) {
      Object.keys(props).forEach(function(k) {
        prev[k] = props[k];
      });
      return prev;
    }, target);
    return ret;
  };
});
define('core/guid',{
  
  guidCache: {},
  
  getGlobalID: (function() {
    var i = 0;
    return function() {
      return i++;
    };
  }()),
  
  
  generateGuid: function(obj, prefix) {
    obj.guid = (prefix || "") + context.getGlobalID();
    return obj.guid;
  },
  
  hashFor: function() {
    var i, len, obj, h = [];
    for(i=0,len=arguments.length; i<len; i++) {
      obj = arguments[i];
      if(obj.hash && typeof obj.hash === "function") {
        h.push(obj.hash());
      } else {
        h.push(context.guidFor(obj));
      }
    }
    return h.join("");
  },
  
  guidFor: function(obj) {
    var type = typeof obj, c, ret;
    if(obj === undefined) {
      return "undefined";
    }
    if(obj === null) {
      return "null";
    }
    if(type === "number" || type === "string") {
      c = this.guidCache[type];
      ret = c[obj];
      if(!ret) {
        ret = type + context.generateGuid();
        c[obj] = ret;
      }
      return ret;
    }
    if(type === "boolean") {
      return obj ? type + "_true" : type + "_false";
    }
    if(obj.guid) {
      return obj.guid;
    }
    // get internal type
    type = Object.prototype.toString.call(obj).slice(8, -1);
    return context.generateGuid(obj, type);
  }
  
});

define('core/log',[],function() {
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
    this.enabled = true;
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
      data.splice(1, 0, level.toUpperCase(), this.topic);
      // console.log(data);
    } else {
      data.unshift(this.topic);
      data.unshift("[" + level.toUpperCase() + "]");
    }
    
    if(this.transport && this.transport[level]) {
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
    // ret[k] = instance[k].bind(instance);
    ret[k] = function() {
      instance[k].apply(instance, arguments);
    };
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
define('core/main',[
  "./mixin",
  "./misc",
  "./guid",
  "./log",
  "./proto"
], function(mixin, misc, guid, log) {
  return mixin({mixin:mixin}, misc, guid, log);
});
define('core', ['core/main'], function (main) { return main; });

define('dom/data',["../core"], function(boost) {
  var setValue, getValue, 
      cache = {}, cacheKey = "__boost_cache_key__",
      uuid = 0;
  
  boost.data = function(elem, key, value) {
    var entryKey, data;
    if(elem.dataset) {//support data api
      entryKey = elem.dataset[cacheKey];
    } else {
      entryKey = elem[cacheKey];
    }
    if(entryKey) {
      data = cache[entryKey];
    } else {
      uuid++
      elem.dataset[cacheKey] = uuid;
      data = cache[uuid] = {};
    }
    if(value || value === null) {//setter
      data[key] = value;
      return value;
    }
    //getter
    return data[key];
  };
  
  return boost.data;
});
define('dom/event',["../core", "./data"], function(boost, $data) {
  var addEvent, removeEvent, normalizeEvent, NO_BUBBLES;
  
  NO_BUBBLES = ["focus", "change", "submit"];
  
  boost.Event = function(originalEvent) {
    var i, len, k;
    if(originalEvent) {//copy attributes
      for(i=0,len=Event._props; i<len; i++) {
        k = Event._props[i];
        this[k] = originalEvent[k];
      }
    }
    
    var doc, body;
    this.timeStamp = this.timeStamp || Date.now();
    if(!this.target) {
      this.target = this.srcElement || document;
    }
    if(this.target.nodeType === 3) {
      this.target = this.target.parentNode;
    }
    if(!this.relatedTarget && this.fromElement) {
      this.relatedTarget = this.fromElement === this.target ? this.toElement : this.fromElement;
    }
    if(this.pageX === undefined && this.clientX !== undefined) {//IE
      doc = document.documentElement;
      body = document.body;
      this.pageX = this.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
      this.pageY = this.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
    }
    
    if(!this.which && (originalEvent.charCode === 0 ? this.charCode : this.keyCode)) {
      this.which = this.charCode || this.keyCode;
    }
    
    //TOOD: metakey, mousewheel, wheelDelta
    
  };
  
  boost.Event._props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view which touches targetTouches changedTouches animationName elapsedTime dataTransfer".split(" ");
  
  addEvent = function(elem, type, capture) {
    var listener = $data(elem, "_listener");
    
    if(!listener) {
      listener = $data(elem, "_listener", function() {//a shared handler that handles all event stored on the element
        return Events.handle(elem, arguments);
      });
    }
    if(elem.addEventListener) {
      elem.addEventListner(type, listener, !!capture);
    } else {
      elem.attachEvent("on" + type.toLowerCase(), listener);
    }
  };
  
  removeEvent = function(elem, type) {
    var listener = $data(elem, "_listener");
    
    if(listener) {
      if(elem.removeEventListener) {
        elem.removeEventListener(type, method, false);
      } else {
        elem.detachEvent("on" + type.toLoserCase(), method);
      }
    }
  };
  
  normalizeEvent = function(event) {
    if(window.event === event) {
      return new boost.Event(event);
    }
    return event.normalized ? event : new boost.Event(event);
  };
  
  
  boost.mixin(boost.Event, {
    
    create: function(e) {
      return new boost.Event(e);
    },
    
    add: function(eventType, elem, hanlder, capture) {
      if(elem.length > 0) {
        elem.forEach(function(el) {
          Events.on(el, elem[i], handler);
        });
        return this;
      }
    
      var events, handlers, method;
    
      if(elem.nodeType === 3 || elem.nodeType === 8) { return this; }
    
      if(typeof handler === "function") {// a simple function
        method = handler;
        handler = {
          context: null,
          method: method
        };
      } else {
        method = handler.method;
      }
      events = $data(elem, "_events") || $data(elem, "_events", {});
      handlers = events[eventType];
      if(!handlers) {
        handlers = events[eventType] = {};
      }
      handlers[context.hashFor(handler.context, handler.method)] = handler;
      //disable capture by default
      addEvent(elem, type, method, false);
      return this;
    },
    
    simulate: function(elem, eventType, attrs) {
      // mock an event object
      var event = new E({
        type: eventType,
        target: elem,
        preventDefault: function() {
          this.cancelled = true;
        },
        stopPropagation: function() {
          this.bubles = false;
        },
        timeStamp: Date.now(),
        cancelled: false,
        bubbles: NO_BUBBLES.indexOf(eventType) > -1,
        normalized: true
      });
    
      if(attrs) {
        context.mixin(event, attrs);
      }
      return event;
    },
    
    remove: function(elem, eventType, handler) {
      if(elem.length > 0) {
        elem.forEach(function(el) {
          Events.remove(el, eventType, handler);
        });
        return this;
      }
      var handlers, events, k, clean;
      clean = false;
      events = $data(elem, "_events");
      if(eventType) {
        handlers = events[eventType];
      
        if(handler) {//remove specific event registeration
          // removeEvent(elem, eventType, handler.method || handler);
          delete handlers[context.hashFor(handler.context, handler.method)];
          k = null;
          for(k in handlers) {//check for other handlers
            break;
          }
          if(!key) {
            clean = true;
          }
        } else {//clean all handlers for this event
          clean = true;
        }
      } else {//remove events for this handler
        for(k in events) {
          Events.remove(elem, events[k]);
        }
      }
      if(clean) {
        delete events[eventType];
        removeEvent(elem, eventType);
      }
    
      // check if we need to clean `events`
      k = null;
      for(k in events) {
        break;
      }
      if(!key) {//no other events found, then cleanup stored data
        $data(elem, "_events", null);
        $data(elem, "_listener", null);
      }
    
      return this;
    }, 
    
    trigger: function(elem, eventType, args) {
      var fn, event, current, ret;
      if(elem.length && elem.length > 0) {
        elem.forEach(function(el) {
          Events.trigger(el, eventType);
        });
        return this;
      }
      if(elem.nodeType === 3 || elem.nodeType === 8) {
        return this;
      }
      if(typeof elem[eventType] === "function") {//native event type
        fn = elem[eventType];
      }
      event = args[0];
      if(!event) {//when trigger a custom event, no acutal event is given
        event = Events.simulate(elem, eventType);
        args.unshift(event);
      }
      event.type = eventType;
    
      //trigger custom events; do bubbling until `document`
      current = elem;
      do {
        ret = Events.handle(current, event, args);
        current = (current === document) ? null : (current.parentNode || document);
      } while(!ret && event.bubbles && current);
      current = null;
    
      //it's not a native event, but has onxxx handlers
      if(!fn && elem["on" + eventType] && elem["on" + eventType].apply(elem, args) === false) {
        ret = false;
      }
    
      //trigger native events
      if(fn && ret !== false) {
        try {
          fn();
        } catch(e) {}
      }
    
      return ret;
    },
    
    handle: function(elem, event, args) {
      var handlers, k, ret, val;
      // args = Array.prototype.slice.call(arguments, 0);
      // elem = args.shift();
      event = normalizeEvent(event || window.event);
    
      handlers = ($data(elem, "_events") || {})[event.type];
      if(!handlers) {
        return false;
      }
    
      args.unshift(event);
      for(k in handlers) {
        handler = handlers[k];
        ret = handler.method.apply(handler.context, args);
        if(ret === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        if(val !== false) {
          val = ret;
        }
      }
      //return the result of this event dispatch
      return val;
    }
    
  });
  
  boost.Event.prototype = {
    
    preventDefault: function() {
      var event = this.originalEvent;
      if(event) {
        if(event.preventDefault) {
          event.preventDefault();
        } else {//IE
          event.returnValue = false;
        }
      }
      return this;
    },
    
    stopPropgation: function() {
      var event = this.originalEvent;
      if(event) {
        if(event.stopPropgation) {
          event.stopPropgation();
        } else {
          event.cancleBubble = true;
        }
      }
      return this;
    },
    
    normalized: true
    
  };
  
  return boost.Event;
});
define('dom/ready',["../core"], function(boost) {
  var DOMReady = false,
      listeners = [],
      notfiyDOMReady,
      notifiyReadStateChange,
      doScrollCheck,
      bindDOMReady;
  
  notfiyDOMReady = function() {
    //mark ready
    DOMReady = true;
    
    //remove listeners for ready events
    if(document.removeEvnetListener) {
      document.removeEventListener("DOMContentLoaded", notfiyDOMReady);
    } else {
      document.detachEvent("onreadystatechange", notifiyReadStateChange);
    }
    // invoke callbacks
    var invoke = function(func) {
      // setTimeout(function() {
      //   
      // }, 0);
      try {
        func();
      } catch(e) {}
    };
    //FIFO
    while(listeners.length) {
      invoke(listners.shift());
    }
  };
  
  notifiyReadStateChange = function() {
    if(!DOMReady) {
      if(!document.body) {
        return setTimeout(notifiyReadStateChange, 5);
      }
      notfiyDOMReady();
    }
  };
  
  doScrollCheck = function() {
    if(DOMReady) {
      return;
    }
    try {
      documnet.documentElement.doScroll("left");
    } catch(e) {
      setTimeout(doScrollCheck, 5);
      return;
    }
    notfiyDOMReady();
  };
  
  if(window.addEventListener) {
    //for thoese that support `DOMContentLoaded`
    window.addEventListener("DOMContentLoaded", notfiyDOMReady);
    // fallback to `load` event, which always works
    window.addEventListener("load", notfiyDOMReady);
  } else if(window.attacheEvent) {
    window.attachEvent("onreadystatechange", notifiyReadStateChange);
    // fallback to `load` event for IE
    window.attachEvent("onload", notfiyDOMReady);
    //Scroll check for IE
    if(!window.frameElement && document.documentElement.doScroll) {//inside a iframe
      doScrollCheck();
    }
  }
  
  bindDOMReady = function(fn) {
    if(!fn) { return; }
    // if the document is already loaded
    if(document.readyState !== "loading") {
      return fn();
    }
    // if DOMReady already happens
    if(DOMReady) {
      return fn();
    }
    listeners.push(fn);
  };
  
  boost.ready = bindDOMReady;
  
  return bindDOMReady;
});
define('dom/selector',["../core"], function(boost) {
  var $ = function (selector) {
    return document.querySelectorAll(selector);
  };
  boost.$ = $;
  return $;
});
define('dom/storage',["../core", "./ready"], function(boost, $ready) {
  
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
define('dom/main',["../core", "./event", "./data", "./ready", "./selector", "./storage"], function(boost) {
  return boost;
});
define('dom', ['dom/main'], function (main) { return main; });

// For experimental purpose, we use the native base64 converters (IE10+)
// A pure JavaScript implementation has [alwarys been around](http://www.webtoolkit.info/javascript-base64.html#.U5AuJZSSxzU)
define('runtime/base64',["../core"], function(boost) {
  boost.base64 = {
    encode: window.btoa,
    decode: window.atob
  };
  return boost.base64;
});
// For experimental purpose, we rely on the simple `window.JSON`
// [Production-ready JSON implmentation](https://github.com/douglascrockford/JSON-js) is also created by Douglas Crockford

define('runtime/json',["../core"], function(boost) {
  return window.JSON;
});
define('runtime/main',["../core", "./base64", "./json"], function(boost) {
  return boost;
});
define('runtime', ['runtime/main'], function (main) { return main; });

// A possible implemenation of ES6 promise
define('promise/core',["../core"], function(boost) {
  
  var logger = boost.Logger.instrument("promise");
  
  var id = 0;
  
  var Deferred = function(onFulfilled, onRejected, resolve, reject) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
    this.resolve = resolve;
    this.reject = reject;
  };
  
  var PromiseA = function(fn) {
    if(!(this instanceof PromiseA)) {
      return PromiseA(fn);
    }
    logger.log("construct");
    this.state = null;
    this.value = null;
    this.deferred = [];
    this.guid = id++;
    this._doResolve(fn);
  };
  
  PromiseA.prototype._doResolve = function (fn) {
    logger.log("do resolve, guid", this.guid);
    var done = false,
        self = this;
    try {
      fn.call(this, function(value) {
        if(done) {
          return;
        }
        done = true;
        self._resolve(value);
      }, function(reason) {
        if(done) {
          return;
        }
        done = true;
        self._reject(reason);
      });
    } catch(e) {
      logger.error(e.stack ? e.stack : e);
      if(done) {
        return;
      }
      done = true;
      self._reject(e);
    }
  };
  
  PromiseA.prototype._resolve = function (newValue) {
    logger.log("_resolve", newValue, "guid", this.guid);
    try {
      if(newValue === this) {
        throw new Error("Cannot be resolved by self");
      }
      if(newValue && newValue.then && typeof newValue.then === "function") {
        this._doResolve(newValue.then.bind(newValue));
        return;
      }
      this.state = true;
      this.value = newValue;
      this._finale();
    } catch(e) {
      this._reject(e);
    }
  };
  
  PromiseA.prototype._reject = function (newValue) {
    logger.log("reject", newValue, "guid", this.guid);
    this.state = false;
    this.value = newValue;
    this._finale();
  };
  
  PromiseA.prototype._finale = function () {
    logger.log("_finale", this.deferred.length, "guid", this.guid);
    var i,len;
    for(i=0,len=this.deferred.length; i<len; i++) {
      this._handle(this.deferred[i]);
    }
    this.deferred = null;
  };
  
  PromiseA.prototype._handle = function (deferred) {
    if(this.state === null) {
      logger.log("queue", deferred);
      this.deferred.push(deferred);
      return;
    }
    setTimeout(function() {
      logger.log("handle, state:", this.state);
      var cb = this.state ? deferred.onFulfilled : deferred.onRejected,
      ret;
      if(!cb) {
        if(this.state) {
          deferred.resolve(this.value);
        } else {
          deferred.reject(this.value);
        }
      }
      try {
        ret = cb(this.value);
      } catch(e) {
        deferred.reject(e);
        logger.error(e.stack ? e.stack : e);
        return;
      }
      deferred.resolve(ret);
    }.bind(this), 0);
  };
  
  PromiseA.prototype.then = function (onFulfilled, onRejected) {
    var self = this;
    return new PromiseA(function(resolve, reject) {
      self._handle(new Deferred(onFulfilled, onRejected, resolve, reject));
    });
  };
  
  PromiseA.prototype.fail = function (onRejected) {
    return this.then(boost.noop, onRejected);
  };
  
  try {//older browser won't allow `catch` as an identifier
    PromiseA.prototype.catch = PromiseA.prototype.fail;
  } catch(e) {}
  
  
  return PromiseA;
  
});
define('promise/reject',["./core"], function(PromiseA) {
  PromiseA.reject = function(reason) {
    return new PromiseA(function(resolve, reject) {
      reject(reason);
    });
  };
  
  return PromiseA.reject;
});
define('promise/resolve',["./core"], function(PromiseA) {
  PromiseA.resolve = function(value) {
    if(value && value.constructor === PromiseA) {//it's already a promise
      return value;
    }
    return new PromiseA(function(resolve) {
      resolve(value);
    });
  };
  
  return PromiseA.resolve;
});
define('promise/race',["./core"], function(PromiseA) {
  PromiseA.race = function(promises) {
    if(!promises || !promises.length) {
      throw new TypeError("should provide an array of promises");
    }
    return new Promise(function(resolve, reject) {
      promises.forEach(function(p) {
        if(p && typeof p.then === "function") {
          p.then(resolve, reject);
        } else {//or directly resolve as a simple value
          resolve(p);
        }
      });
    });
  };
});
define('promise/main',["../core", "./core", "./reject", "./resolve", "./race"], function(boost, PromiseA) {
  boost.Promise = PromiseA;
  
  
  // This is not a ES6 API, but very and useful and popular among other promise libraries.
  boost.deferred = function() {
    var deferred = {};
    
    deferred.promise = new PromiseA(function(resolve, reject) {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
    
    return deferred;
  };
  
  return boost.Promise;
});
define('promise', ['promise/main'], function (main) { return main; });

require.config({
  packages: ["core", "dom", "runtime", "promise"]
});

define('main',[
  "core",
  "dom",
  "runtime",
  "promise"
], function(boost) {
  if(!window.boost) {
    window.boost = boost;
  }
  return boost;
});

require(["main"]);
    //The modules for your project will be inlined above
    //this snippet. Ask almond to synchronously require the
    //module value for 'main' here and return it as the
    //value to use for the public API for the built file.
    return require('main');
}));