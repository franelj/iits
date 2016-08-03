var express = require('express');
var router = express.Router();
var user = require('../lib/users');
var check_params = require('../middlewares/check_parameters');
var errors = require('../lib/errors');

router.post('/authenticate', check_params(['username', 'password']), function(req, res, next) {
  user.checkUsernamePassword(req.body.username, req.body.password, function(err, id) {
    if (!err) {
      user.generateToken(id, (err, token) => {
        if (!err) {
          res.json({jwt: token});
        }
        else {
          return next(new errors.AuthenticationError());
        }
      });
    }
    else {
      return next(err);
    }
  });
});

router.get('/me', user.authMiddleware, function(req, res, next) {

  res.json(req.currentUser);
});

router.get('/:id((\\d+))', user.authMiddleware, function(req, res, next) {
  var id = req.params.id;
  if (user.isAdmin) {
    if (id) {
      user.getUser(id, function(err, user) {
        if (!err) {
          res.json(user);
        }
        else {
          return next(err);
        }
      });
    }
    else {
      return next(new errors.MissingParameterError());
    }
  }
});



module.exports = router;
