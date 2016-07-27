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
var db = require('../lib/db');
var errors = require('../lib/errors');
var user = require("../lib/users.js");

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
    if (!user.isAdmin(req.currentUser)) {
        return next(new errors.PermissionDeniedError("You do not have the rights to create a reward"), req, res);
    }
    db.query(`INSERT INTO rewards (name, description, points, picture) VALUES ("${req.body.name}", "${req.body.description}", "${req.body.points}", "${req.file.path}")`, function(err, rows, fields) {
        if (err) {
            return next(new errors.DatabaseError("An error occurred while creating the reward"), req, res);
        }
        res.json({ success: true });
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
    if (!user.isAdmin(req.currentUser)) {
        return next(new errors.PermissionDeniedError("You do not have the rights to edit a reward"), req, res);
    }
    db.query(`SELECT * FROM rewards WHERE id = ${req.params.id}`, function(err, rows, fields) {
        if (err) {
            return next(new errors.DatabaseError("An error occurred while editing the reward"), req, res);
        } else if (rows.length > 0) {
            var query = "UPDATE rewards SET ";
            var toEdit = ["name", "description", "points", "picture"];
            for (var i = 0; i < toEdit.length; i++) {
                if (req.body[toEdit[i]] !== undefined) {
                    if (i > 0)
                        query += ", ";
                    if (toEdit[i] == "picture") {
                        query += `${toEdit[i]} = "${req.file.path}"`;
                    } else {
                        query += `${toEdit[i]} = "${req.body[toEdit[i]]}"`;
                    }
                }
            }
            query += `WHERE id = ${req.params.id}`;
            db.query(query, function(err, rows, fields) {
                if (err) {
                    return next(new errors.DatabaseError("An error occurred while editing the reward"), req, res);
                }
                res.json({success: true});
            });
        } else {
            return next(new errors.NotFoundError("This reward does not exist"), req, res);
        }
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
    if (!user.isAdmin(req.currentUser)) {
        return next(new errors.PermissionDeniedError("You do not have the rights to delete a reward"), req, res);
    }
    db.query(`SELECT * FROM rewards WHERE id = ${req.params.id}`, function(err, rows, fields) {
        if (err) {
            return next(new errors.DatabaseError("An error occurred while deleting the reward"), req, res);
        } else if (rows.length > 0) {
            db.query(`DELETE FROM rewards WHERE id = ${req.params.id}`, function(err, rows, fields) {
                if (err) {
                    return next(new errors.DatabaseError("An error occurred while deleting the reward"), req, res);
                }
                res.json({success: true});
            });
        } else {
            return next(new errors.NotFoundError("This reward does not exist"), req, res);
        }
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
    let page = req.query.page > 0 ? req.query.page : 1,
        perpage = req.query.perpage > 0 ? req.query.perpage : 10;
    db.query(`SELECT * FROM rewards LIMIT ${perpage} OFFSET ${(page - 1) * perpage}`, function(err, rows, fields) {
        if (err) {
            return next(new errors.DatabaseError("An error occurred while retrieving the rewards"), req, res);
        }

        res.json({rewards: rows});
    })
});

/**
 * @apiVersion 1.0.0
 * @api {post} /order Create
 * @apiDescription Order rewards
 *
 * @apiParam {Array} orders The array of order with id and quantity
 *
 */
router.post('/order', [user.authMiddleware, check_parameters(["orders"])], function(req, res, next) {
    let query = 'SELECT * FROM rewards WHERE id=';


    //db.query(`SELECT * FROM rewards WHERE id=${req.body.id}`, function(err, rows, fields) {
    //    if (err) {
    //        return next(new errors.DatabaseError("An error occurred while ordering rewards"))
    //    } else if (rows.length > 0) {
    //
    //    } else {
    //        return next(new errors.NotFoundError("This reward does not exist"), req, res);
    //    }
    //
    //})
});

module.exports = router;
