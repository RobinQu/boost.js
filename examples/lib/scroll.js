window.onload = function() {
  
  var box = document.getElementById("box");
  
  alert([document.documentElement.scrollTop, document.documentElement.scrollLeft]);
  alert([box.offsetHeight, box.clientHeight, box.scrollHeight]);
  
  
  // 1052 - 1031 = 21, 21- 4 = 17 
  
  alert([box.offsetWidth, box.clientWidth, box.scrollWidth]);
  
};

// 
// boost.ready(function() {
//   boost.log("ready", Date.now());
//   
//   var box = boost.$(".box")[0];
//   // var box = document;
//   boost.log(box.offsetHeight, box.clientHeight, box.scrollHeight);
//   
//   boost.log(box.offsetWidth, box.clientWidth, box.scrollWidth);
// });
// 
// boost.$(window).on("load", function() {
//   boost.log("load", Date.now());
// });