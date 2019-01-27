var express = require("express");
var elearning = require("./elearning");
var userModel = require("../models/userModel");
var sha512 = require("js-sha512").sha512;
var router = express.Router();

router.get("/login", function(req, res, next) {
  if (!(req.session.loggedin || false)) {
    res.render("login");
  } else {
    res.redirect("/");
  }
});
router.post("/login", async function(req, res, next) {
  try {
    let { sid, pw } = req.body;
    sid = sid.toUpperCase();
    if (sid == "" || pw == "") throw new Error("你的帳號密碼啦");
    if (req.session.loggedin || false) {
      throw new Error("Y0U 4R3 41R3@DY 10GG3D1N, H4CK3R :)");
    }

    let storedData = await userModel.find({ sid: sid });
    if (storedData.length === 0) {
      //New user
      await elearning.check(sid, pw);
      // ^ if login failure occured, it will throw an error

      //[TODO] launch a scraper
      let doneCourse = await elearning.getDoneCourse(sid, pw);

      //Create new model
      var newUser = new userModel({
        sid: sid,
        pw: sha512(pw),
        courses: JSON.parse(doneCourse),
        wishList: []
      });
      await newUser.save();
      storedData = newUser;
    } else {
      storedData = storedData[0];
      if (storedData.pw != sha512(pw)) throw new Error("e平臺我說你打錯密碼了");
    }
    req.session.sid = sid;
    req.session.loggedin = true;
    req.session.model = storedData;
    req.session.save(() => {});
    res.status(200);
    res.json({ status: "ok", msg: "oh ya" });
  } catch (err) {
    res.status(200);
    res.json({ status: "err", msg: err.message });
  }
});

router.get("/logout", function(req, res, next) {
  if (req.session.loggedin === true) {
    req.session.destroy();
  }
  res.redirect("/");
});

module.exports = router;
