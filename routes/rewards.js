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
var fs = require('fs');
var path = require('path');

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
router.post('/', [user.authMiddleware, upload.single("picture"), check_parameters(["name", "description", "points", "picture"])], function(req, res, next) {
    var fullPath = "";
    if (req.file) {fullPath = path.resolve(req.file.path);}
    if (!user.isAdmin(req.currentUser)) {
        fs.access(fullPath, function(err) {
            if (!err) {
                fs.unlink(fullPath, function(err) { });
            }
            return next(new errors.PermissionDeniedError("You do not have the rights to create a reward"), req, res);
        });
    }
    db.query(`INSERT INTO rewards (name, description, points, picture) VALUES ("${req.body.name}", "${req.body.description}", "${req.body.points}", "${req.file.path}")`, function(err, rows, fields) {
        if (err) {
            fs.access(fullPath, function(err) {
                if (!err) {
                    fs.unlink(fullPath, function(err) { });
                }
                return next(new errors.DatabaseError("An error occurred while creating the reward"), req, res);
            });
        } else {
            res.json({ success: true });
        }
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
router.post('/order', [user.authMiddleware], function(req, res, next) {
    let orders = JSON.parse(req.body.orders),
        user = req.currentUser,
        query;
//    console.log(req.body.order);
    for (var order in orders) {
        if (query == undefined) {
            query = `SELECT * FROM rewards WHERE id IN (${order.id}`;
        } else {
            query += `, ${order.id}`;
        }
        query += ")";
    }
    db.query(query, function(err, rows, fields) {
        if (err) {
            return next(new errors.DatabaseError("An error occurred while retrieving the reward"), req, res);
        } else if (rows.length == orders.length) {
            let totalPointCost = 0,
                insertQuery;
            for (var order in orders) {
                for (var row in rows) {
                    if (order.id == row.id) {
                        totalPointCost += order.quantity * row.points;
                        if (insertQuery == undefined) {
                            insertQuery = `INSERT INTO orders (userid, rewardid, quantity) VALUES ("${user.id}", "${order.id}", "${order.quantity}")`
                        } else {
                            insertQuery += `, ("${user.id}", "${order.id}", "${order.quantity}")`;
                        }
                    }
                }
            }
            if (req.currentUser.points < totalPointCost) {
                res.json({success: false});
            }
            db.query(insertQuery, function(err, rows, fields) {
                if (err) {
                    return next(new errors.DatabaseError("An error occurred while retrieving the reward"), req, res);
                }
                user.points = user.points - totalPointCost;
                res.json({success: true});
            });
        } else {
            return next(new errors.NotFoundError("A reward does not exist"), req, res);
        }
    });
});

module.exports = router;
