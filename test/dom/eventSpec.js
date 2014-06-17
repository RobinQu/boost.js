define(["boost"], function(boost) {
  
  var dispatchClickEvent = function() {
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 1, 10, 10, 20, 20, false, false, false, false, 1, null);
    document.body.dispatchEvent(e);
  };
  
  describe("Event", function() {
    
    it("should bind an native event", function() {
      var callback = sinon.spy();
      boost.$(document).on("click", callback);
      // document.body.click();
      
      dispatchClickEvent();
      expect(callback.called).to.be.ok;
    });
    
    it("should remove handler and won't trigger", function() {
      var callback = sinon.spy();
      boost.$(document).on("click", callback);
      
      dispatchClickEvent();
      expect(callback.called).to.be.ok;
      
      boost.$(document).off("click");
      dispatchClickEvent();
      expect(callback.callCount).to.equal(1);
      
    });
    
    it("should ignore duplicate handler", function() {
      var callback = sinon.spy();

      boost.$(document).on("click", callback);
      boost.$(document).on("click", callback);
      dispatchClickEvent();
      // console.log(callback.callCount);
      expect(callback.callCount).to.equal(1);
      boost.$(document).off("click");
    });
    
    it("should mimick an event and do propgation", function() {
      var callback = sinon.spy();
      
      boost.$(document).on("click", callback);
      boost.$(document).trigger("click");
      expect(callback.callCount).to.equal(1);
    });
    
    it("should support extra arguments", function() {
      var callback = sinon.spy();
      boost.$(document).on("click", callback);
      boost.$(document).trigger("click", 1);
      expect(callback.callCount).to.equal(1);
      expect(callback.firstCall.args[1]).to.equal(1);
    });
    
    it("should support custom event", function() {
      var callback = sinon.spy();
      boost.$(document).on("boom", callback);
      boost.$(document).trigger("boom");
      expect(callback.callCount).to.equal(1);
    });
    
  });
  
});