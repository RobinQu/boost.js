var str = "{{hello}}abc{{world}}";

var context = {
  hello: "foo",
  world: "bar"
};

var regex = /\{\{([^}]+)\}\}/g;


// var c = str.replace(/\{\{([^}]+)\}\}/g, function(match, p1, offset, string) {
//   return context[p1] || "";
// });
//
// console.log(c);
//
//



var ret;
console.log(str);
console.log("------");
while((ret = regex.exec(str))) {
  console.log("match", ret[0]);
  console.log("group", ret[1]);
  console.log("index", ret.index);
  console.log("next match", regex.lastIndex);
}