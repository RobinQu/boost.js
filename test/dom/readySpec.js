/*global describe, it, expect */

define(["boost"], function(boost) {
  // console.log($ready);
  var result = "";
  var makeHandler = function(char) {
    return function() {
      result += char;
    };
  };
  boost.ready(makeHandler("a"));
  boost.ready(makeHandler("c"));
  boost.ready(makeHandler("d"));
  
  describe("domready", function() {
    it("should invoke all handlers", function() {
      expect(result).to.equal("acd");
    });
  });
  
});