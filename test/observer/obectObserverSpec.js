define(["boost"], function(boost) {
  
  if(!boost.ObjectObserver) {//skip test if we don't support it
    return;
  }
  
  describe("ObjectObserver", function() {
    
    var o = {},
        ob = boost.ObjectObserver.create(o);
    
    it("should respond to addition of new property", function(done) {
      ob.connect(function(changes) {
        expect(changes).to.be.ok;
        expect(changes[0].type).to.equal("add");
        expect(changes[0].name).to.equal("foo");
        done();
        ob.disconnect();
      });
      
      o.foo = "bar";
      
    });
    
    it("should respond to update of a property", function(done) {
      
      ob.connect(function(changes) {
        expect(changes).to.be.ok;
        expect(changes[0].type).to.equal("update");
        expect(changes[0].name).to.equal("foo");
        done();
        ob.disconnect();
      });
      
      o.foo = "qux";
    
    });
    
    it("should respond to removeal of a property", function(done) {
      
      ob.connect(function(changes) {
        expect(changes).to.be.ok;
        expect(changes[0].type).to.equal("delete");
        expect(changes[0].name).to.equal("foo");
        done();
        ob.disconnect();
      });
      
      delete o.foo;
      
    });
    
    
    it("should support filter", function(done) {
      
      ob.connect(function(changes) {
        expect(changes.length).to.be.above(1);
        changes.forEach(function(c) {
          // console.log(c.type);
          expect(c.type).not.to.equal("delete");
          expect(c.name).to.equal("bar");
        });
        
        ob.disconnect();
        done();
      }, ["add", "update"]);
      
      o.bar = "bar";
      o.bar = "qux";
      delete o.bar;
    });
    
    it("should work on array", function() {
      
      var arr = [];
      
      var ob = boost.ObjectObserver.create(arr);
      
      ob.connect(function(changes) {
        expect(changes).to.equal(3);
        ob.disconnect();
      });
      
      arr.push(1);
      arr.push(2);
      arr.splice(1, 3);
      
    });
    
  });
  

  
});