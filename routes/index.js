var express = require('express');
var router = express.Router();

var signin = require('./signin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/signin',signin);
module.exports = router;
