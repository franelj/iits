var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var check_params = ('../middlewares/check_parameters');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/authenticate', check_params(['username', 'password']), function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  db.query('SELECT COUNT (*) FROM twinder WHERE username=')
  res.send('Dev in progress');
});

module.exports = router;
