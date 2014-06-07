/*global describe, it, expect */

define(["boost"], function(boost) {
  
  boost.instrument("promise");
  
  it("should resolve", function(done) {
    var a = new boost.Promise(function(resolve, reject) {
      resolve(3);
    }).then(function(value) {
      expect(value).to.equal(3);
      done();
    });
  });
  
  it("should reject", function(done) {
    var ex = new Error("foo");
    new boost.Promise(function(resolve, reject) {
      reject(ex);
    }).then(function() {}, function(e) {
      expect(e.message).to.equal("foo");
      done();
    });
  });
  
  
});