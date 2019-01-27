const app = require("../app");
const request = require("supertest")(app);
require("should");

describe("POST /user/login", () => {
  context("Correct StuID and password", () => {
    it("Set session");
    it("Start crawler to elearning");
    it("Redirect to homepage");
  });
  context("Incorrect StuID or password", () => {
    let result = {};
    it("respond with json", done => {
      request
        .post("/users/login")
        .send({ sid: "123", pw: "123" })
        .set("Accept", "application/json")
        .end(function(err, res) {
          if (err) return err; //server error
          if (res.statusCode !== 200) return res.body; //api error;
          result = res.body;
          done();
        });
    });
    it("Return error message", () => {
      result.should.be.Object();
      result.should.has.key("status", "msg");
      result.status.should.not.equal("ok");
    });
  });
  context("Blank StuID or password", () => {
    let result = {};
    it("respond with json", done => {
      request
        .post("/users/login")
        .send({ sid: "", pw: "" })
        .set("Accept", "application/json")
        .end(function(err, res) {
          if (err) return err; //server error
          if (res.statusCode !== 200) return res.body; //api error;
          result = res.body;
          done();
        });
    });
    it("Return error message", () => {
      result.should.be.Object();
      result.should.has.key("status", "msg");
      result.status.should.not.equal("ok");
    });
  });
});
