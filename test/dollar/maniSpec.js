define(["boost"], function(boost) {
  
  describe("dom.html()", function() {
    
    it("should get html content", function() {
      expect(boost.$("<span>abc</span>").html()).to.equal("abc");
    });
    
    it("should only get the html of first element", function() {
      expect(boost.$("<span>abc</span><span>def</span>").html()).to.equal("abc");
    });
    
  });
  
  describe("dom.prepend()", function() {
    
    it("should prepend to matched ones", function() {
      var a = boost.$("<div>a</div>").prepend("<span>1</span>");
      var span = boost.$("span", a)[0];
      expect(span).to.be.ok;
      expect(span.innerHTML).to.equal("1");
    });
    
  });
  
  describe("dom.append()", function() {
    it("should append to matched ones", function() {
      var a = boost.$("<div><span>0</span></div>").append("<span>1</span>");
      
      var span = boost.$("span:first-child", a)[0];
      expect(span).to.be.ok;
      expect(span.innerHTML).to.equal("0");
    });
    
  });
  
  describe("dom.insertAfter()", function() {
   it("should insert after matched elements", function() {
     var p = boost.$("<div><span>1</span></div>");
     boost.$("<span>0</span>").insertAfter(p.find("span"));
     expect(p.find("span").size()).to.equal(2);
     expect(p.find("span")[1].innerHTML).to.equal("0");
   });
   
   it("should work with existing elements", function() {
     var p = boost.$("<div><span>0</span><p>1</p></div>");
     boost.$("span", p).insertAfter(boost.$("p", p));
     expect(boost.$("div :first-child", p)[0].innerHTML).to.equal("1");
     expect(boost.$("div :last-child", p)[0].innerHTML).to.equal("0");
   });
   
  });
  
  //TODO dom.insertBefore, replace, empty, remove, clone
  
});