define(["boost"], function(boost) {
  boost.instrument("promise");
  
  beforeEach(function() {
    boost.instrument("promise");
  });
  afterEach(function() {
    boost.instrument("promise", false);
  });
  
  
  describe("Promise.all", function(done) {
    
    it("should resolve only after all passed promises are resolved", function() {
      var p1 = new boost.Promise(function(resolve, reject) {
        resolve(4);
      });
      
      var p2 = new boost.Promise(function(resolve) {
        resolve(3);
      });
      
      boost.Promise.all([1,2,p1,p2]).then(function(ret) {
        expect(ret).to.eqaul([1,2,3,4]);
        done();
      });
    });
    
  });
  
  it("should reject if any promise is rejected", function(done) {
    var p1 = new boost.Promise(function(resolve, reject) {
      reject(new Error("boom"));
    });
    boost.Promise.all([1,2,p1]).then(boost.noop, function(e) {
      expect(e.message).to.equal("boom");
      done();
    });
    
  });
  
});