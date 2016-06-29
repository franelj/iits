/**
 * Created by gregoirelafitte on 6/27/16.
 */

var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');
var check_params = require('../middlewares/check_parameters');
var multer = reauire('multer');

router.post('/', check_params(["name", "description", "points", "picture", "barcode"]), function(req, res, next) {

});

/* GET reward listing. */
router.get('/list', function(req, res, next) {

    res.send('respond with a resource');
});

module.exports = router;
