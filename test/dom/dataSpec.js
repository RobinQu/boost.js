define(["boost"], function(boost) {
  
  describe("element data", function() {
    
    var elem = document.body;
    
    it("should setup a key-value pair", function() {
      
      var ret = boost.data(elem, "foo", "bar");
      expect(ret).to.equal("bar");
      expect(boost.data(elem, "foo", ret));
      
    });
    
    it("should handle more complete value type", function() {
      var f = function() {return "foo";};
      boost.data(elem, "foo", f);
      expect(boost.data(elem, "foo")).to.equal(f);
      expect(boost.data(elem, "foo")()).to.equal("foo");
    });
    
  });
  
});