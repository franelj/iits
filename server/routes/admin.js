/**
 * Created by julie on 7/25/16.
 */

var express = require('express');
var router = express.Router();
var db = require("../lib/db");
var user_service = require("../services/user_service");
var user = require("../lib/users");

router.get('/', [user.session], function(req, res, next) {
    if (req.session && req.session.user) {
        res.render('index', {pageTitle: "Dashboard"});
    } else {
        res.redirect('/admin/login');
    }
});

router.get('/login', [user.session], function(req, res, next) {
    if (req.session && req.session.user) {
        res.redirect('/admin');
    } else {
        res.render('login', {pageTitle: "Login"});
    }
});

router.post('/login', [user.session], function(req, res, next) {
    if (req.session && req.session.user) {
        res.redirect('/admin');
    }
    user_service.authenticate(req.body.username, req.body.password).then((token) => {
        req.session.token = token;
        res.redirect('/admin');
    }).catch((err) => {
        res.render('login', {pageTitle: "Login", errorMsg: "Authentication failed"});
    });
});

module.exports = router;