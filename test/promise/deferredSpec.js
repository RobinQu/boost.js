define(["boost"], function(boost) {
  
  describe("boost.deferred", function(done) {
    
    it("should create a deferred object", function(done) {
      
      var d1 = boost.deferred();
      
      d1.promise.then(function(v) {
        expect(v).to.equal(1);
        done();
      });
      d1.resolve(1);
      
    });
    
    it("should also be rejectable", function(done) {
      
      var d1 = boost.deferred();
      d1.promise.then(boost.noop, function(reason) {
        expect(reason.message).to.equal("boom");
        done();
      });
      d1.reject(new Error("boom"));
    });

  });
  
});