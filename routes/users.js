var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var check_params = ('../middlewares/check_parameters');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json('respond with a resource');
});

router.post('/authenticate', check_params(['username', 'password']), function(req, res, next) {
  db.query('SELECT COUNT (*) FROM twinder WHERE username=? AND password=?', [req.body.username, req.body.password], function(err, result) {
    console.log(result);
    console.log("err: " + err);
  });
  res.send('Dev in progress');
});

module.exports = router;
