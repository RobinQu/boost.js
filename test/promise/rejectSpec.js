define(["boost"], function(boost) {

  // beforeEach(function() {
  //   boost.instrument("promise");
  // });
  // afterEach(function() {
  //   boost.instrument("promise", false);
  // });
  
  
  describe("Promise.reject", function(done) {
    
    it("should create a promise that rejects with a given reason", function() {
      
      var p1 = boost.Promise.reject(new Error("boom"));
      p1.then(boost.noop, function(reason) {
        expect(reason.message).to.equal("boom");
        done();
      });
      
    });

  });
  
});