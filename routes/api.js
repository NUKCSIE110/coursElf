const courseModel = require("../models/courseModel");
var express = require("express");
var router = express.Router();

router.route("/courses/:type/:target").get(async function(req, res, next) {
  let { type, target } = req.params;
  type = type.toUpperCase();
  target = target.toUpperCase();
  console.log(target);
  let result = [];
  if (target === "ALL") {
    result = await courseModel.find({ dept: type });
  } else {
    result = await courseModel.find({ dept: type, target: target });
  }
  let classDetail = {
    dept: type.toUpperCase(),
    id: "B051",
    target: target.toUpperCase(),
    name: "電腦網路長長長長長長長長長長長長",
    point: "3",
    compulsory: true,
    teacher: "吳俊興",
    location: "B01-204",
    time: [[1, 2], [1, 3], [1, 4]]
  };

  //Proccess class detail
  let formatTime = x => {
    const weekdays = ["", "一", "二", "三", "四", "五"];
    if (x[1] == 0) x[1] = "午";
    if (x[1] > 4 && x[1] < 5) x[1] = "早";
    return [weekdays[x[0]], x[1]];
  };
  result = result.map(_e => {
    let e = {
      dept: _e.dept,
      id: _e.id,
      target: _e.target,
      name: _e.name,
      point: _e.point,
      compulsory: _e.compulsory,
      teacher: _e.teacher,
      location: _e.location,
      time: _e.time.map(x => formatTime(x)),
      detailUrl: ""
    };
    e.detailUrl = `https://course.nuk.edu.tw/QueryCourse/tcontent.asp?
              OpenYear=107&Helf=2&Sclass=${e.dept}&Cono=${e.id}`.replace(
      /[\s\t\n]/g,
      ""
    );
    return e;
  });
  res.status(200);
  res.json(result);
});
router.route("/target/:type").get(function(req, res, next) {
  res.status(200);
  res.json({ 1: "大一", 2: "大二", 3: "大三", 4: "大四" });
});

module.exports = router;
