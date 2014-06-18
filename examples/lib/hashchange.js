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
    window._fireOnHashChange = function(historyHash) {
      //at this time, location bar is not updated
      
      // console.log("-----" + window.location.toString());
      // console.log(document.URL);
      console.log(historyHash, self.getHash(), self.lastHash);
      // var hash = self.getHash();
      // console.log(historyHash);
      // console.log(self.lastHash, historyHash, hash);
      // console.log((hash !== self.lastHash).toString());
      // console.log((historyHash !== self.lastHash).toString());
      if(historyHash !== self.lastHash) {//hash change
        window.location.href = location.href.replace(/#.*/, "") + historyHash;
        self.fireHashChange(self.lastHash, historyHash);
        //update hash
        self.lastHash = historyHash;
        
      }
      // if(this.getHash() !== historyHash) {
        // self.lastHash = historyHash;
        // window.location.href = location.href.replace(/#.*/, "") + historyHash;
      // }
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
      }
    };
    document.body.appendChild(this.frame);
    
    this.lastHash = this.getHash();
  };
  
  HCManager.prototype.fireHashChange = function (oldHash, newHash) {
    console.log("fire!!!!");
    console.log(oldHash, newHash);
  };
  
  HCManager.prototype.saveHistory = function (hash) {
    var doc = this.frame.contentWindow.document;
    // console.log(hash, this.lastHash);
    if(this.lastHash !== hash) {//if saved hash doesn't match given hash
      doc.open();
      doc.write(this._prepIFrameContent(hash));
      doc.close();
    }
  };
  
  HCManager.prototype.saveURL = function (url) {
    this.saveHistory(this.getHash(url));
  };
  
  HCManager.prototype.getHash = function (url) {
    url = url || window.location.toString();
    // console.log(window.location.toString());
    return "#" + url.replace(/^[^#]*#?(.*)$/, "$1");
  };
  
  HCManager.prototype._prepIFrameContent = function (hash, domain) {
    if(domain) {
      
    } else {
      return [
        "<html>",
          "<head>",
            "<script type='text/javascript'>",
              "function pageLoaded() {",
                "try {top.window._fireOnHashChange(\""+hash+"\");} catch(ex) {}",
              "}",
            "</script>",
          "</head>",
          "<body onload='pageLoaded();'>",
            "<input type='value' style='width:400px' value='"+hash+"' id='history'/>",
          "</body>",
        "</html>"
      ].join("");
    }
  };
  
  
  window.onload = function() {
    var hc = window.hc = new HCManager();
    
    document.attachEvent("onclick", function(e) {
      if(e.srcElement.tagName.toLowerCase() === "a") {
        hc.saveURL(e.srcElement.href);
      }
    });
    
  };
  
}());




// 
// var observe = function(url) {
//   var iframe = document.getElementById("frame");
//   
//   var frameDoc = iframe.contentWindow.document;
//   
//   // var url = window.location.toString();
//   
//   frameDoc.open();
//   
//   frameDoc.write([
//     "<html>",
//       "<head>",
//         "<script type='text/javascript'>",
//           "function pageLoaded() {",
//             "try {top.window.fireOnHashChange(\""+url+"\");} catch(ex) {}",
//           "}",
//         "</script>",
//       "</head>",
//       "<body onload='pageLoaded();'>",
//         "<input type='value' style='width:400px' value='"+url+"' id='history'/>",
//       "</body>",
//     "</html>"
//   ].join(""));
//   frameDoc.close();
//   
// };
// 
// window.onload = function() {
//   observe(window.location.toString());
//   console.log("bind");
//   document.attachEvent("onclick", function(e) {
//     if(e.srcElement.tagName.toLowerCase() === "a") {
//       observe(e.srcElement.href);
//       // window.title = e.srcElement.innerHTML;
//        document.getElementById("log").innerHTML += (e.srcElement.innerHTML);
//     }
//   });
// };
// 
// 
// var fireOnHashChange = function(url) {
//   console.log(url);
// };