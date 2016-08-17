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
  user.getMe(req.currentUser.id, function(err, user) {
    if (!err) {
      res.json(user);
    }
    else {
      next(err);
    }
  });
});

router.get('/:id((\\d+))', user.authMiddleware, function(req, res, next) {
    var id = req.params.id;
    user_service.get(req.currentUser, id).then((user) => {
        res.json(user);
    }).catch((err) => {
        next(err);
    });
});

router.get('/list', user.authMiddleware, function(req, res, next) {
    user_service.list(req.query.page, req.query.perPage).then((list) => {
        res.json({"users": list});
    }).catch((err) => {
        next(err);
    });
});

router.post('/grant', [user.authMiddleware, check_params(['id'])], function(req, res, next) {
    var id = req.body.id;
    user_service.grant(id).then((success) => {
        res.json({"success": success});
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;
