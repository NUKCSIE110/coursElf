require("should");

describe("POST /user/login", () => {
  describe("Correct StuID and password", () => {
    it("Set session");
    it("Start crawler to elearning");
    it("Redirect to homepage");
  });
  describe("Incorrect StuID or password", () => {
    it("Return to login page");
    it("Show error message");
  });
});
