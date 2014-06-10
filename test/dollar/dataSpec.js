define(["boost"], function(boost) {
  
  describe("dom.data()", function() {
    
    var elem = document.body,
        $ = boost.$;
    
    it("should get and set key-value", function() {
      $(elem).data("foo", "bar");
      expect($(elem).data("foo")).to.equal("bar");
    });
    
    it("should handle more complete value type", function() {
      var f = function() {return "foo";};
      $(elem).data("foo", f);
      expect($(elem).data("foo")).to.equal(f);
      expect($(elem).data("foo")()).to.equal("foo");
    });
    
  });
  
});