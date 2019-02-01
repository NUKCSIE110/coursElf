var express = require("express");
var classList = require("../data/courceType.json");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {title: "NUK選課小精靈", loggedin: req.session.loggedin, classList: classList });
});
router.get("/query", function(req, res, next) {
  res.render("query", {title: "所有課程 - NUK選課小精靈", loggedin: req.session.loggedin, classList: classList });
});

module.exports = router;
