define(["boost"], function(boost) {
  
  describe("basic query", function() {
    
    it("should consturct list of elements", function() {
      var $doc = boost.$("<em>foo</em><i>bar</i>");
      expect($doc).to.be.ok;
      expect($doc.length).to.be.equal(2);
    });
    
  });
  
});