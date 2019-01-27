var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/login", function(req, res, next) {
  res.render("login");
});
router.post("/login", function(req, res, next) {
  setTimeout(()=>{
  res.json({ status: "ok", msg:"e平臺跟我說你打錯密碼了" });
  },10000);
});

module.exports = router;
