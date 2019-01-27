var express = require("express");
var classList = require("../test_data/class.json");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { loggedin: req.session.loggedin, classList: classList });
});
router.get("/query", function(req, res, next) {
  res.render("query", { loggedin: req.session.loggedin, classList: classList });
});

module.exports = router;
