var express = require("express");
var router = express.Router();

router.get("/test", function(req, res, next) {
  res.status(200);
  res.json({ msg: "Succeed" });
});
router.route("/courses/:type/:target").get(function(req, res, next) {
  res.status(200);
  
  let classDetail = {dept: req.params.type.toUpperCase(),
      id: "B051",
      target: req.params.target.toUpperCase(),
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
    if (x[1] == 0) x[1]="午";
    if (x[1] > 4 && x[1] < 5) x[1]="早";
    return [weekdays[x[0]],x[1]];
  };
  classDetail.time = classDetail.time.map(x=>formatTime(x));
  let detailUrl = `https://course.nuk.edu.tw/QueryCourse/tcontent.asp?
              OpenYear=107&Helf=2&Sclass=${classDetail.dept}&Cono=${classDetail.id}`.replace(
    /[\s\t\n]/g,
    ""
  );
  classDetail['detailUrl'] = detailUrl;


  res.json(
    Array(10).fill(classDetail)
  );
});
router.route("/target/:type").get(function(req, res, next) {
  res.status(200);
  res.json(["大一", "大二", "大三", "大四"]);
});

module.exports = router;
