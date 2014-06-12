define(["boost"], function(boost) {
  
  if(!boost.PathObserver) {//skip test if we don't support it
    return;
  }
  
  
  describe("PathObserver", function() {
    
    it("should observe nested path", function(done) {
      
      var foo = {bar: {qux: 2}};
      
      var ob = boost.PathObserver.create(foo, "bar.qux");
      ob.connect(function(changes) {
        expect(changes).to.be.ok;
        expect(changes[0].type).to.equal("update");
        expect(changes[0].from).to.equal(2);
        done();
      });
      foo.bar.qux = 1;
      
    });
    
    it("should establish more observers for newly assigned nested objects", function(done) {
      
      var a = {};
      
      var ob = boost.PathObserver.create(a, "b.c");
      var callback = sinon.spy();
      ob.connect(callback);
      // ob.connect(function(changes) {
      //   console.log(changes);
      //   expect(changes.length).to.be.above(2);
      //   
      //   expect(changes[0].type).to.equal("add");
      //   expect(chagnes[1].type).to.equal("update");
      //   done();
      // });
      a.b = {c: 1};
      // Object.deliverChangeRecords(boost.noop);
      setTimeout(function() {
        a.b.c = 2;
      }, 100);
      // a.b.c = 2;
      
      setTimeout(function() {
        expect(callback.callCount).to.equal(2);
        var change1 = callback.firstCall.args[0][0];
        // console.log(change1.to);
        expect(change1.type).to.equal("add");
        expect(change1.to).to.equal(1);
        var change2 = callback.secondCall.args[0][0];
        expect(change2.type).to.equal("update");
        expect(change2.to).to.equal(2);
        done();
      }, 200);
      
    });
    
  });
  
});