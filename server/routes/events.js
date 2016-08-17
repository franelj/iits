/**
 * Created by Aurelien PRIEUR on 06/07/16 for iits.
 */

var express = require('express');
var router = express.Router();
var check_parameters = require('../middlewares/check_parameters');
var multer = require("multer");
var upload = multer({ dest: './uploads/' });
var errors = require('../lib/errors');
var user = require("../lib/users");
var event_service = require('../services/event_service');


router.get('/all', [user.authMiddleware], function(req, res, next) {
    event_service.list(req.query.perPage, req.query.page, req.query.past, req.query.upcoming).then((events) => {
        res.json({results: events});
    }).catch((err) => {
        next(err);
    });
});

router.put('/validate/:id((\\d+))', [user.authMiddleware], function(req, res, next) {
    event_service.validate(req.currentUser, parseInt(req.params.id), req.body.code).then((points) => {
        res.json({results: points});
    }).catch((err) => {
        next(err);
    });
});

/**
 * @apiVersion 1.0.0
 * @api {post} / Create
 * @apiDescription Create event
 *
 * @apiParam {File} picture The picture to upload
 * @apiParam {String} name The event name
 * @apiParam {String} description The event description
 * @apiParam {Number} points The event points value
 *
 * @apiSuccess {Object} barcode The barcode informations
 *
 * @apiSuccessExample {json} Success-Response
 * HTTP/1.1 200 OK
 *  barcode {
 *   "picture": {
 *      "type": "Buffer",
 *      "data": "Picture data in hexadecimal"
 *   },
 *   "length": "length of the buffer",
 *   "width": "width of the picture",
 *   "height": "height of the picture",
 * }
 *
 * @apiUse NotFoundError
 * @apiUse DatabaseError
 *
 */
router.post('/', [user.authMiddleware, upload.single("picture"), check_parameters(["name", "description", "points"])], function(req, res, next) {
    event_service.create(req.currentUser, req.body.name, req.body.description, req.body.points, req.file.path).then((success) => {
        res.json({success: success});
    }).catch((err) => {
        next(err);
    });
});

/**
 * @apiVersion 1.0.0
 * @api {put} /:id((\\d+)) Edit
 * @apiDescription Edit event
 *
 * @apiParam {Number} id The event id
 * @apiParam {File} [picture] The picture to upload
 * @apiParam {String} [name] The reward name
 * @apiParam {String} [description] The reward description
 * @apiParam {Number} [points] The reward points value
 *
 */
router.put('/:id((\\d+))', [user.authMiddleware, upload.single("picture")], function(req, res, next) {
    event_service.edit(req.currentUser, req.params.id, req.body, req.file.path).then((success) => {
        res.json({success: success});
    }).catch((err) => {
        next(err);
    });
});

/**
 * @apiVersion 1.0.0
 * @api {delete} /:id((\\d+)) Delete
 * @apiDescription Delete event
 *
 * @apiParam {Number} id The event id
 *
 */
router.delete('/:id((\\d+))', [user.authMiddleware], function(req, res, next) {
    event_service.delete(req.currentUser, req.params.id).then((success) => {
        res.json({success: success});
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;
