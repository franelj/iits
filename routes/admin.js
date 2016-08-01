/**
 * Created by julie on 7/25/16.
 */

var express = require('express');
var router = express.Router();
var errors = require("../lib/errors");
var db = require("../lib/db");

router.get('/', function(req, res, next) {
    // If not logged in, redirect to login
    res.redirect('/admin/login');
    // Else, render index
    //res.render('index', {pageTitle: "Login"});
});

router.get('/login', function(req, res, next) {
    res.render('login', {pageTitle: "Login"});
});

router.post('/login', function(req, res, next) {
   console.log("POST", req.body.username, req.body.password);
    res.render('login', {pageTitle: "Login"});
});

module.exports = router;