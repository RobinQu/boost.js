/*global describe, it, expect */

define(["boost"], function(boost) {
  
  it("should resolve", function(done) {
    var a = new boost.Promise(function(resolve, reject) {
      resolve(3);
    }).then(function(value) {
      expect(value).to.equal(3);
    });
  });
  
  
});