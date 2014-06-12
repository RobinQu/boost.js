/*global describe, it, expect */
define(["boost"], function(boost) {
  "use strict";
  
  boost.instrument("binding");
  
  describe("boost.js", function() {
    it("should exist in global", function() {
      expect(boost).to.be.ok;
      expect(boost.Event).to.be.ok;
      expect(boost.ready).to.be.ok;
      expect(boost.$).to.be.ok;
    });
    
  });
  
});
