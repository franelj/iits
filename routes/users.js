var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../lib/db.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json('respond with a resource');
});

module.exports = router;
