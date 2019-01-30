var express = require("express");
var elearning = require("./elearning");
var userModel = require("../models/userModel");
var sha512 = require("js-sha512").sha512;
var deptTable = require("../scraper/dept.json");
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

    await elearning.check(sid, pw);
    // ^ if login failure occured, it will throw an error

    let storedData = await userModel.find({ sid: sid });
    if (storedData.length === 0) {
      //New user

      //Create new model
      var newUser = new userModel({
        sid: sid,
        //pw: sha512(pw),
        //courses: JSON.parse(doneCourse),
        wishList: []
      });
      await newUser.save();
      storedData = newUser;
    } else {
      storedData = storedData[0];
      //if (storedData.pw != sha512(pw)) throw new Error("e平臺跟我說你打錯密碼了");
    }

    //launch a scraper
    req.session.doneCourse = await elearning.getDoneCourse(sid, pw);

    req.session.sid = sid;
    req.session.dept = deptTable[sid.slice(4, 6)];
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

router.get("/mycourse", function(req, res, next) {
  if (req.session.loggedin !== true) {
    res.redirect("/");
  } else {
    let calcPoint = (acc, e) => (acc += Number(e[2]));
    let calcPointOfObj = obj => {
      obj["p"] = Object.keys(obj).reduce((acc, x) => (acc += obj[x]), 0);
    };
    let passed = req.session.doneCourse.filter(x => x[3] >= 60);

    //共同必修
    let common = passed.filter(x => x[0].match(/^GR.+/));
    let chinese = common.filter(x => x[1].match(/^中文.+/));
    let english = common.filter(x => x[1].match(/^英語會話與閱讀.+/));
    let other = common.filter(x => x[1].match(/^(?!中文|英語會話與閱讀)/));
    common = { chinese, english, other };
    let common_p = {
      chinese: chinese.reduce(calcPoint, 0),
      english: english.reduce(calcPoint, 0),
      other: other.reduce(calcPoint, 0)
    };
    calcPointOfObj(common_p);

    //核心通識
    let cc = passed.filter(x => x[0].match(/^CC.+/));
    let cc_p = cc.reduce(calcPoint, 0);

    //博雅通識
    let li = passed.filter(x => x[0].match(/^LI.+/));
    let sc = passed.filter(x => x[0].match(/^SC.+/));
    let so = passed.filter(x => x[0].match(/^SO.+/));
    let by = { li, sc, so };
    let by_p = {
      li: li.reduce(calcPoint, 0),
      sc: sc.reduce(calcPoint, 0),
      so: so.reduce(calcPoint, 0)
    };
    calcPointOfObj(by_p);

    // 系必修/系選修
    let dept = passed.filter(x =>
      x[0].match(new RegExp(`^${req.session.dept[0]}.+`))
    );
    let dept_compulsory = dept.filter(x => x[4]);
    let dept_choose = dept.filter(x => !x[4]);
    dept = { compulsory: dept_compulsory, choose: dept_choose };
    let dept_p = {
      compulsory: dept_compulsory.reduce(calcPoint, 0),
      choose: dept_choose.reduce(calcPoint, 0)
    };

    //剩餘學分
    let rest = passed.filter(x =>
      x[0].match(new RegExp(`^(?!GR|CC|LI|SC|SO|${req.session.dept[0]})`))
    );
    let rest_p = rest.reduce(calcPoint, 0);

    //===指揮挺組合===
    let doneCourse = { common, cc, by, dept, rest };
    let donePoint = {
      common: common_p,
      cc: cc_p,
      by: by_p,
      dept: dept_p,
      rest: rest_p
    };
    donePoint["p"] = passed.reduce(calcPoint, 0);

    //未送成績和棄選的
    let uncommitCourse = req.session.doneCourse.filter(x => x[3] === "未送");
    let failedCourse = req.session.doneCourse.filter(x => x[3] < 60);

    res.render("mycourse", {
      loggedin: req.session.loggedin,
      doneCourse,
      donePoint,
      uncommitCourse,
      failedCourse
    });
  }
});

module.exports = router;
