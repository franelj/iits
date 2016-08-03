/**
 * Created by julie on 7/25/16.
 */

var express = require('express');
var router = express.Router();
var db = require("../lib/db");
var user_service = require("../services/user_service");
var user = require("../lib/users");

router.get('/', [user.session], function(req, res, next) {
    console.log("test", req.session);
    if (req.session && req.session.user) {
        res.render('index', {pageTitle: "Dashboard"});
    } else {
        res.redirect('/admin/login');
    }
});

router.get('/login', [user.session], function(req, res, next) {
    res.render('login', {pageTitle: "Login"});
});

router.post('/login', [user.session], function(req, res, next) {
    if (req.session && req.session.user) {
        console.log("qwertyuiop", req.session.user);
    }
    user_service.authenticate(req.body.username, req.body.password).then((token) => {
        // token session
        console.log("LOGIN AUTH SUCCESS", req.session.token);
        req.session.token = token;
        res.redirect('/admin');
    }).catch((err) => {
        console.log("LOGIN AUTH ERR", err);
        res.render('login', {pageTitle: "Login", error: "Authentication failed"});
    });
});

module.exports = router;