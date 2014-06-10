define(function() {
  var setValue, getValue, 
      cache = {}, cacheKey = "__boost_cache_key__",
      uuid = 0;
  
  return function(elem, key, value) {
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
  
});