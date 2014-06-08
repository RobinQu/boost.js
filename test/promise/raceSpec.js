define(["boost"], function(boost) {

  // beforeEach(function() {
  //   boost.instrument("promise");
  // });
  // afterEach(function() {
  //   boost.instrument("promise", false);
  // });
  
  
  describe("Promise.race", function(done) {
    
    it("should resolve to the one that is resolved first", function() {
      
      var p1 = new boost.Promise(function(resolve) {
        setTimeout(function() {
          resolve(200);
        }, 200);
      });
      
      var p2 = new boost.Promise(function(resolve) {
        setTimeout(function() {
          resolve(100);
        }, 100);
      });
      
      
      boost.Promise.race([p1, p2]).then(function(v) {
        expect(v).to.equal(100);
        done();
      });
      
    });
    
    it("should reject to the first promise that is rejected", function(done) {
      
      
      var p1 = new boost.Promise(function(resolve, reject) {
        setTimeout(function() {
          reject(new Error(100));
        }, 100);
      });
      
      var p2 = new boost.Promise(function(resolve) {
        setTimeout(function() {
          resolve(200);
        }, 200);
      });
      
      var p3 = new boost.Promise(function(resolve, reject) {
        setTimeout(function() {
          reject(300);
        }, 300);
      });
      
      var sCallback = sinon.spy();
      
      boost.Promise.race([p1, p2]).then(sCallback, function(reason) {
        expect(sCallback).not.to.have.been.called;
        // console.log(sCallback.called);
        expect(reason.message).to.equal("100");
        done();
      });
      
    });

  });
  
});