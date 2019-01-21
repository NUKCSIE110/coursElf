var express = require("express");
var router = express.Router();

router.get("/test", function(req, res, next) {
  res.status(200);
  res.json({ msg: "Succeed" });
});

module.exports = router;
