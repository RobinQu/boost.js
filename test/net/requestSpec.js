define(["boost"], function(boost) {
  
  // beforeEach(function() {
  //   boost.instrument("net:xhr");
  // });
  // afterEach(function() {
  //   boost.instrument("net:xhr", false);
  // });
  
  describe("Request", function() {
    
    it("should do simple get", function(done) {
      
      var server = sinon.fakeServer.create(),
          callback = sinon.spy();
      
      boost.ajax({url: "/api"}).then(callback);
      server.requests[0].respond(200, {"Content-type": "application/json"}, '{"hello":"world"}');
      
      setTimeout(function() {
        expect(callback).to.have.been.called;
        var resp = callback.args[0][0];
        // console.log(resp.text);
        expect(resp.status).to.equal(200);
        expect(resp.text).to.be.ok;
        // expect(resp.text).to.equal('{"hello":"world"}');
        done();
      }, 100);
    });
    
  });
  
});