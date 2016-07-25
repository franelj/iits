/**
 * Created by julie on 7/25/16.
 */

var express = require('express');
var router = express.Router();
var errors = require("../lib/errors");
var db = require("../lib/db");

router.get('/', function(req, res, next) {
    res.render('index', {pageTitle: "Login"});
});

module.exports = router;