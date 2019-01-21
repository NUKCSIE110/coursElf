const request = require("supertest");
const app = require("../app");
require("should");

describe("GET /api/test", function() {
  it("respond with json", function(done) {
    request(app)
      .get("/api/test")
      .set("Accept", "application/json")
      .end(function(err, res) {
        if (err) return done(err); //server error
        if (res.statusCode !== 200) return done(res.body); //api error;

        const result = res.body;
        result.should.be.Object();
        result.should.have.keys("msg");
        result.msg.should.be.equal("Succeed");

        done();
      });
  });
});
