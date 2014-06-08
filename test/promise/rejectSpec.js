define(["boost"], function(boost) {
  boost.instrument("promise");
  
  beforeEach(function() {
    boost.instrument("promise");
  });
  afterEach(function() {
    boost.instrument("promise", false);
  });
  
  
  describe("Promise.reject", function(done) {
    
    it("should create a promise that rejects with a given reason", function() {
      
      var p1 = Promise.reject(new Error("boom"));
      p1.then(boost.noop, function(reason) {
        expect(reason.message).to.equal("boom");
        done();
      });
      
    });

  });
  
});