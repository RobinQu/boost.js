define(["boost"], function(boost) {

  // beforeEach(function() {
  //   boost.instrument("promise");
  // });
  // afterEach(function() {
  //   boost.instrument("promise", false);
  // });
  
  describe("Promise.resolve", function(done) {
    
    it("should create a promise that resolves to a given value", function() {
      
      var p1 = Promise.resolve(1);
      p1.then(function(v) {
        expect(v).to.equal(1);
        done();
      });
      
    });

  });
  
});