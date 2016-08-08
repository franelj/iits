/**
 * Created by gregoirelafitte on 6/27/16.
 */

"use strict";

var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');
var check_parameters = require('../middlewares/check_parameters');
var multer = require('multer');
var path = require('path');
var upload = multer({ dest: path.resolve('./uploads') });
var errors = require('../lib/errors');
var user = require("../lib/users.js");
var fs = require('fs');
var reward_service = require('../services/reward_service');

/**
 * @apiVersion 1.0.0
 * @api {post} / Create
 * @apiDescription Create reward
 *
 * @apiParam {File} picture The picture to upload
 * @apiParam {String} name The reward name
 * @apiParam {String} description The reward description
 * @apiParam {Number} points The reward points value
 *
 */

router.post('/', [user.authMiddleware, upload.single("picture"), check_parameters(["name", "description", "points"])], function(req, res, next) {
    reward_service.create(req.currentUser, req.body.name, req.body.description, req.body.points, req.file.path).then((success) => {
        res.json({success: success});
    }).catch((err) => {
        next(err);
    });
});

/**
 * @apiVersion 1.0.0
 * @api {put} /:id((\\d+)) Edit
 * @apiDescription Edit reward
 *
 * @apiParam {File} picture The picture to upload
 * @apiParam {String} name The reward name
 * @apiParam {String} description The reward description
 * @apiParam {Number} points The reward points value
 *
 */
router.put('/:id((\\d+))', [user.authMiddleware, upload.single("picture")], function(req, res, next) {
    reward_service.edit(req.currentUser, req.params.id, req.body, req.file.path).then((success) => {
        res.json({success: success});
    }).catch((err) => {
        next(err);
    });
});

/**
 * @apiVersion 1.0.0
 * @api {delete} /:id((\\d+)) Delete
 * @apiDescription Delete reward
 *
 * @apiParam {Number} id The reward id
 *
 */
router.delete('/:id((\\d+))', [user.authMiddleware], function(req, res, next) {
    reward_service.delete(req.currentUser, req.params.id).then((success) => {
        res.json({success: success});
    }).catch((err) => {
        next(err);
    });
});

/**
 * @apiVersion 1.0.0
 * @api {get} /list List
 * @apiDescription List rewards
 *
 * @apiParam {Number} page The page number requested
 * @apiParam {Number} perpage The number of reward per page requested
 *
 */
router.get('/list', [user.authMiddleware], function(req, res, next) {
    reward_service.list(req.query.page, req.query.perpage).then((rewards) => {
        res.json({rewards: rewards});
    }).catch((err) => {
        next(err);
    });
});

/**
 * @apiVersion 1.0.0
 * @api {post} /order Create
 * @apiDescription Order rewards
 *
 * @apiParam {Array} orders The array of order with id and quantity
 *
 */
router.post('/order', [user.authMiddleware], check_parameters(["orders"]), function(req, res, next) {
    reward_service.order(req.currentUser, req.body.orders).then((success) => {
        res.json({success: success});
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;
