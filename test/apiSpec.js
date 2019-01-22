const request = require("supertest");
const app = require("../app");
require("should");

describe("GET /api/test", () => {
  let result = {};
  it("respond with json", () => {
    request(app)
      .get("/api/test")
      .set("Accept", "application/json")
      .end(function(err, res) {
        if (err) return err; //server error
        if (res.statusCode !== 200) return res.body; //api error;
        result = res.body;
      });
  });
  it("Response should contain msg field", () => {
    result.should.be.Object();
    result.should.have.keys("msg");
    result.msg.should.be.equal("Succeed");
  });
});

describe("GET /api/courses/:type", ()=>{
  let result = {};
  it("respond with json", () => {
    request(app)
      .get("/api/courses/all")
      .set("Accept", "application/json")
      .end(function(err, res) {
        if (err) return err; //server error
        if (res.statusCode !== 200) return res.body; //api error;
        result = res.body;
      });
  });
  it("Response should be an array", () => {
    result.should.be.Array();
  });
  it("Each element should be an object with sepcific keys", ()=>{
    result.forEach(e => {
      e.should.be.Object();
      e.should.have.keys('dept','id','target','name','point','compulsory','teacher','location','time');
      e.compulsory.should.be.Boolean();
      e.time.should.be.Array();
    });
  })
})