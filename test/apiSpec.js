const app = require("../app");
const request = require("supertest")(app);
require("should");

// describe("GET /api/test", () => {
//   let result = {};
//   it("respond with json", done => {
//     request
//       .get("/api/test")
//       .set("Accept", "application/json")
//       .end(function(err, res) {
//         if (err) return err; //server error
//         if (res.statusCode !== 200) return res.body; //api error;
//         result = res.body;
//         done();
//       });
//   });
//   it("Response should contain msg field", () => {
//     result.should.be.Object();
//     result.should.have.keys("msg");
//     result.msg.should.be.equal("Succeed");
//   });
// });

describe("GET /api/courses/:type/:target", () => {
  let result = {};
  it("respond with json", done => {
    request
      .get("/api/courses/all/all")
      .set("Accept", "application/json")
      .end(function(err, res) {
        if (err) return err; //server error
        if (res.statusCode !== 200) return res.body; //api error;
        result = res.body;
        done();
      });
  });
  it("Response should be an array", () => {
    result.should.be.Array();
  });
  it("Each element should be an object with sepcific keys", () => {
    result.forEach(e => {
      e.should.be.Object();
      e.should.have.keys(
        "dept",
        "id",
        "target",
        "name",
        "point",
        "compulsory",
        "teacher",
        "location",
        "time"
      );
      e.compulsory.should.be.Boolean();
      e.time.should.be.Array();
    });
  });
});

describe("GET /api/target/:type", () => {
  let result = {};
  it("respond with json", done => {
    request
      .get("/api/target/cs/")
      .set("Accept", "application/json")
      .end(function(err, res) {
        if (err) return err; //server error
        if (res.statusCode !== 200) return res.body; //api error;
        result = res.body;
        done();
      });
  });
  it("Response should be an array", () => {
    result.should.be.Array();
  });
});
