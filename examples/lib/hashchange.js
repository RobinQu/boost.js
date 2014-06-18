var observe = function(url) {
  var iframe = document.getElementById("frame");
  
  var frameDoc = iframe.contentWindow.document;
  
  // var url = window.location.toString();
  
  frameDoc.open();
  
  frameDoc.write([
    "<html>",
      "<head>",
        "<script type='text/javascript'>",
          "function pageLoaded() {",
            "try {top.window.fireOnHashChange(\""+url+"\");} catch(ex) {}",
          "}",
        "</script>",
      "</head>",
      "<body onload='pageLoaded();'>",
        "<input type='value' style='width:400px' value='"+url+"' id='history'/>",
      "</body>",
    "</html>"
  ].join(""));
  frameDoc.close();
  
};

window.onload = function() {
  observe(window.location.toString());
  console.log("bind");
  document.attachEvent("onclick", function(e) {
    if(e.srcElement.tagName.toLowerCase() === "a") {
      observe(e.srcElement.href);
      // window.title = e.srcElement.innerHTML;
       document.getElementById("log").innerHTML += (e.srcElement.innerHTML);
    }
  });
};


var fireOnHashChange = function(url) {
  console.log(url);
};