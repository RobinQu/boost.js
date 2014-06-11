define(["boost"], function(boost) {
  
  describe("ObjectObserver", function() {
    
    var o = {},
        ob = boost.ObjectObserver.create(o);
    
    it("should respond to addition of new property", function(done) {

      ob.connect(function(changes) {
        expect(changes).to.be.ok;
        expect(changes[0].type).to.equal("add");
        expect(changes[0].name).to.equal("foo");
        done();
      });
      
      o.foo = "bar";
      
    });
    
  });
  
});