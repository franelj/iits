/**
 * Created by Aurelien PRIEUR on 06/07/16 for iits.
 */

var express = require('express');
var router = express.Router();
var check_parameters = require('../middlewares/check_parameters');
var multer = require("multer");
var upload = multer({ dest: './uploads/' });
var db = require('../lib/db');
var errors = require('../lib/errors');
var user = require("../lib/users");
var eventsLib = require('../lib/events');

router.get('/all', [user.authMiddleware], function(req, res, next) {
    var perPage = req.query.perPage || 10;
    var page = req.query.page || 0;

    if (page > 0 && perPage > 0) {
        eventsLib.listEvents(perPage, page, function(err, results) {
            if (!err) {
                return res.json(results);
            }
            else {
                return next(err);
            }
        });
    }
    else {
        return next(new errors.MissingParameterError);
    }
});

router.put('/validate/:id((\\d+))', [user.authMiddleware], function(req, res, next) {
    var eventId = parseInt(req.params.id);
    var code = req.body.code;

    if (eventId >= 0) {
        eventsLib.validateEvent(eventId, code, req.currentUser.id, function(err, results) {
            if (!err) {
                res.json({points: results});
            }
            else {
                return next(err);
            }
        });
    }
    else {
        return next(new errors.InvalidParameterError);
    }
});

router.post('/create', [user.authMiddleware, upload.single("picture"), check_parameters(["name", "description", "points"])], function(req, res, next) {
    if (!user.isAdmin(req.currentUser)) {
        return next(new errors.PermissionDeniedError("You do not have the rights to create an event"), req, res);
    }
    db.query(`INSERT INTO events (name, description, points, picture) VALUES ("${req.body.name}", "${req.body.description}", "${req.body.points}", 
    "${req.file.path}")`, function(err, rows, fields) {
        if (err) {
            return next(new errors.DatabaseError("An error occurred while updating the database"), req, res);
        }
        res.json({ success: true });
    });
});

router.put('/:id((\\d+))', [user.authMiddleware, upload.single("picture")], function(req, res, next) {
    if (!user.isAdmin(req.currentUser)) {
        return next(new errors.PermissionDeniedError("You do not have the rights to edit an event"), req, res);
    }
    db.query(`SELECT * FROM events WHERE id = ${req.params.id}`, function(err, rows, fields) {
        if (err) {
            return next(new errors.DatabaseError("An error occurred while updating the database (1)"), req, res);
        } else if (rows.length > 0) {
            var query = "UPDATE events SET ";
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
                    return next(new errors.DatabaseError("An error occurred while updating the database (2)"), req, res);
                }
                res.json({success: true});
            });
        } else {
            return next(new errors.NotFoundError("This event does not exist"), req, res);
        }
    });
});

router.delete('/:id((\\d+))', [user.authMiddleware], function(req, res, next) {
    if (!user.isAdmin(req.currentUser)) {
        return next(new errors.PermissionDeniedError("You do not have the rights to delete an event"), req, res);
    }
    db.query(`SELECT * FROM events WHERE id = ${req.params.id}`, function(err, rows, fields) {
        if (err) {
            return next(new errors.DatabaseError("An error occurred while updating the database (1)"), req, res);
        } else if (rows.length > 0) {
            db.query(`DELETE FROM events WHERE id = ${req.params.id}`, function (err, rows, fields) {
                if (err) {
                    return next(new errors.DatabaseError("An error occurred while updating the database (2)"), req, res);
                }
                res.json({success: true});
            });
        } else {
            return next(new errors.NotFoundError("This event does not exist"), req, res);
        }
    });
});

module.exports = router;
