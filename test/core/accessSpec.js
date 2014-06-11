define(["boost"], function(boost) {
  
  describe("boost.access()", function() {
    
    var obj = {
      a: {
        b: {
          c: {
            d: 1
          }
        }
      }
    };
    
    it("should access nested value", function() {
      expect(boost.access(obj, "a.b.c.d")).to.equal(1);
    });
    
    it("should traverse with callback", function() {
      
      var callback = sinon.spy();
      
      boost.access(obj, "a.b.c.d", callback);
      
      expect(callback.callCount).to.equal(4);
      expect(callback.lastCall.calledWith(1)).to.be.ok;
      
    });
    
  });
  
});