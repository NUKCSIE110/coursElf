var express = require("express");
var router = express.Router();

router.get("/test", function(req, res, next) {
  res.status(200);
  res.json({ msg: "Succeed" });
});
router.route("/courses/:type/:target").get(function(req, res, next){
  res.status(200);
  res.json(Array(10).fill(
    {
      "dept": req.params.type.toUpperCase(),
      "id": "B051",
      "target": req.params.target.toUpperCase(),
      "name": "電腦網路",
      "point": "3",
      "compulsory": true,
      "teacher": "吳俊興",
      "location": "B01-204",
      "time":[
        [1,2],
        [1,3],
        [1,4]
      ]

    }
  ));
})


module.exports = router;
