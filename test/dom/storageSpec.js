define(["boost"], function(boost) {
  
  describe("Storage", function() {
    
    it("should persist a value", function() {
      boost.storage.setItem("foo", "bar");
      expect(boost.storage.getItem("foo")).to.equal("bar");
    });
    
    it("should report correct length", function() {
      expect(boost.storage.length).to.be.above(0);
    });
    
    it("should delete a key-value pair", function() {
      expect(boost.storage.removeItem("foo"));
      expect(boost.storage.getItem("foo")).not.to.be.ok;
      expect(boost.storage.length).to.equal(0);
    });
    
  });
  
});