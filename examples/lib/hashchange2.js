(function() {
  
  var HCManager = function() {
    this.init();
  };
  
  HCManager.prototype.init = function () {
    var div = document.createElement("div"),
        iframe, 
        poll,
        self = this;

    div.innerHTML = '<iframe tabindex="-1" style="display:none" widht=0 height=0 title="empty" />';
    iframe = this.frame = div.firstChild;
    poll = function() {
      var hash = self.getHash(),
          historyHash = self.getHistoryHash();

      if(hash !== self.lastHash) {//link clicked
        self.fireHashChange(self.lastHash, hash);
        //update hash
        self.lastHash = hash;
        self.saveHistory(hash);
      } else if(historyHash !== self.lastHash) {//if navigation buttons are clicked, hash and lasthash do match but historyHash became different, we update that thing and trigger a hash change
        window.location.href = location.href.replace(/#.*/, "") + historyHash;
      }
    };
    
    iframe.onreadystatechange = function() {//IE only
      if(iframe.readyState === "complete") {
        //clear handler
        iframe.onreadystatechange = null;
        var doc = iframe.contentWindow.document;
        doc.open();
        //save a empty hash to give a chance to reflect changes to actual hash when page loaded
        doc.write(self._prepIFrameContent("#"));
        doc.close();
        setInterval(poll, 400);
      }
    };
    document.body.appendChild(this.frame);
    
    this.lastHash = this.getHash();
  };
  
  HCManager.prototype.getHistoryHash = function () {
    return this.frame.contentWindow.document.body.innerText;
  };
  
  HCManager.prototype.fireHashChange = function (oldHash, newHash) {
    console.log("fire!!!!");
    console.log(oldHash, newHash);
  };
  
  HCManager.prototype.saveHistory = function (hash) {
    var historyHash = this.getHistoryHash(),
        doc = this.frame.contentWindow.document;
    
    if(historyHash !== hash) {//if saved hash doesn't match given hash
      doc.open();
      doc.write(this._prepIFrameContent(hash));
      doc.close();
    }
  };
  
  HCManager.prototype.getHash = function (url) {
    url = url || window.document.URL;
    return "#" + url.replace(/^[^#]*#?(.*)$/, "$1");
  };
  
  HCManager.prototype._prepIFrameContent = function (hash, domain) {
    if(domain) {
      return "<!doctype html><html><script>document.domain ="+ domain +"</script><body>" +   hash + "</body></html>";
    } else {
      return "<!doctype html><html><body>" + hash + "</body></html>";
    }
  };
  
  
  window.onload = function() {
    window.hc = new HCManager();
    
  };
  
}());