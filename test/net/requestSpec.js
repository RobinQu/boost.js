define(["boost"], function(boost) {
  
  // beforeEach(function() {
  //   boost.instrument("net:xhr");
  // });
  // afterEach(function() {
  //   boost.instrument("net:xhr", false);
  // });
  
  xdescribe("Request", function() {
    
    it("should do simple get", function(done) {
      
      var server = sinon.fakeServer.create();
      
      boost.ajax({url: "/api"}).then(function(resp) {
        expect(resp.status).to.equal(200);
        expect(resp.text).to.equal('{"hello":"world"}');
        done();
      });
      server.requests[0].respond([200, {"Content-type": "application/json"}, '{"hello":"world"}']);
    });
    
  });
  
});