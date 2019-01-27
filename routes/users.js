var express = require("express");
var elearning = require("./elearning");
var router = express.Router();

router.get("/login", function(req, res, next) {
  res.render("login");
});
router.post("/login", function(req, res, next) {
  if (false /*found user from db*/) {
    req.session.sid = req.body.sid;
    res.json({ status: "err", msg: "e平臺跟我說你打錯密碼了" });
  } else {
    //launch crawer
    elearning
      .check(req.body.sid, req.body.pw)
      .then(() => {
        res.json({ status: "ok", msg: "oh ya" });
      })
      .catch(() => {
        res.json({ status: "err", msg: "e平臺跟我說你打錯密碼了" });
      });
  }
});

module.exports = router;
