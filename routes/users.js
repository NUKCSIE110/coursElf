var express = require("express");
var elearning = require("./elearning");
var router = express.Router();

router.get("/login", function(req, res, next) {
  if (!(req.session.loggedin || false)) {
    res.render("login");
  } else {
    res.redirect("/");
  }
});
router.post("/login", function(req, res, next) {
  if (req.body.sid == "" || req.body.pw == "") {
    res.status(200);
    res.json({ status: "err", msg: "e平臺我說你打錯密碼了" });
    return;
  }
  if (req.session.loggedin || false) {
    res.json({ status: "ok", msg: "get out my way :)" });
    return;
  }
  if (false /*found user from db*/) {
    req.session.sid = req.body.sid;
    res.json({ status: "err", msg: "e平臺跟我說你打錯密碼了" });
  } else {
    //launch crawer
    let elearningAuth = elearning.check(req.body.sid, req.body.pw);
    elearningAuth
      .then(() => {
        req.session.sid = req.body.sid;
        req.session.loggedin = true;
        req.session.save(() => {});
        res.status(200);
        res.json({ status: "ok", msg: "oh ya" });
      })
      .catch(() => {
        res.status(200);
        res.json({ status: "err", msg: "e平臺我說你打錯密碼了" });
      });
  }
});

router.get("/logout", function(req, res, next) {
  if (req.session.loggedin != true) {
    res.json({ status: "err", msg: "Are you kidding me?" });
  } else {
    req.session.destroy();
    res.redirect("/");
  }
});

module.exports = router;
