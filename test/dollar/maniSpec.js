define(["boost"], function(boost) {
  
  describe("dom manip", function() {
    
    it("should get html content", function() {
      expect(boost.$("<span>abc</span>").html()).to.equal("abc");
    });
    
    it("should only get the html of first element", function() {
      expect(boost.$("<span>abc</span><span>def</span>").html()).to.equal("abc")
    });
    
  });
  
});