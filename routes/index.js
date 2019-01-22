var express = require('express');
var classList = require('../test_data/class.json');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 'title': 'NUK選課小幫手', 'loggedin': false, 'classList':classList});
});

module.exports = router;
