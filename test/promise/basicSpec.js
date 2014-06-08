/*global describe, it, expect */

define(["boost"], function(boost) {
  
  boost.instrument("promise");
  
  xit("should resolve", function(done) {
    var a = new boost.Promise(function(resolve, reject) {
      resolve(3);
    }).then(function(value) {
      expect(value).to.equal(3);
      done();
    });
  });
  
  xit("should reject", function(done) {
    var ex = new Error("foo");
    new boost.Promise(function(resolve, reject) {
      reject(ex);
    }).then(boost.noop, function(e) {
      expect(e.message).to.equal("foo");
      done();
    });
  });
  
  xit("should catch error during resolving", function(done) {
    new boost.Promise(function(resolve, reject) {
      throw new Error("boom");
    }).then(boost.noop, function(e) {
      expect(e.message).to.equal("boom");
      done();
    });
  });
  
  it("should chain", function(done) {
    var p1 = new boost.Promise(function(resolve, reject) {
      resolve("foo");
    }).then(function(ret) {
      expect(ret).to.equal("foo");
      return new boost.Promise(function(resolve, reject) {
        resolve("bar");
      })
    }).then(function(ret) {
      expect(ret).to.equal("bar");
      done();
    });
  });
  
  
});