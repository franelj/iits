var express = require('express');
var router = express.Router();
var user = require('../lib/users');
var check_params = require('../middlewares/check_parameters');
var user_service = require('../services/user_service');

router.post('/authenticate', check_params(['username', 'password']), function(req, res, next) {
    user_service.authenticate(req.body.username, req.body.password).then((token) => {
        res.json({jwt: token});
    }).catch((err) => {
        next(err);
    });
});

router.get('/me', user.authMiddleware, function(req, res, next) {
    res.json(req.currentUser);
});

router.get('/:id((\\d+))', user.authMiddleware, function(req, res, next) {
    var id = req.params.id;
    user_service.get(id).then((user) => {
        res.json(user);
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;
