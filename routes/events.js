/**
 * Created by Aurelien PRIEUR on 06/07/16 for iits.
 */

var router = require('express').Router();
var errors = require('../lib/errors');
var usersLib = require('../lib/users');
var checkParams = require('../middleware/check_parameters');
var eventsLib = require('../lib/events');

router.get('/all', [usersLib.authMiddleware], function(req, res, next) {
    var nbResults = req.query.nbPerPage || 10;
    var offset = req.query.offset || 0;


});

router.get('/:id', function(req, res, next) {

});

module.exports = router;
