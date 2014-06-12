define(["boost"], function(boost) {
  
  describe("boost.Binding", function() {
    
    it("should work in bi-direction", function(done) {
      
      var a = {b:{c:1}};
      var b = {b:{c:2}};
      var binding = boost.Binding.from(a, "b.c").to(b, "b.c");
      a.b.c = 100;
      setTimeout(function() {
        expect(b.b.c).to.equal(100);
        done();
      }, 100);
      
    });
    
  });
  
});