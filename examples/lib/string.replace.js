var str = "{{hello}}abc{{world}}";

var context = {
  hello: "foo",
  world: "bar"
};


var c = str.replace(/\{\{([^}]+)\}\}/g, function(match, p1, offset, string) {
  console.log(offset);
  return context[p1] || "";
});

console.log(c);


