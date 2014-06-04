/*global describe, it, expect */
define(["boost"], function(boost) {
  "use strict";
  console.log(boost);
  
  describe("boost.js", function() {
    it("should exist in global", function() {
      expect(boost).to.be.ok;
      expect(boost.Event).to.be.ok;
    });
    
    it("should be more fun");
  });
  
});
