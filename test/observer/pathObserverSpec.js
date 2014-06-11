define(["boost"], function(boost) {
  
  describe("PathObserver", function() {
    
    it("should observe nested path", function(done) {
      
      var foo = {bar: {qux: 2}};
      
      var ob = boost.PathObserver.create(foo, "bar.qux");
      ob.connect(function(changes) {
        expect(changes).to.be.ok;
        expect(changes[0].type).to.equal("update");
        expect(changes[0].oldValue).to.equal(2);
        done();
      });
      foo.bar.qux = 1;
      
    });
    
  });
  
});