/**
 * Created by Aurelien PRIEUR on 11/07/16 for iits.
 */

var db = require('./db');
var errors = require('./errors');

module.exports = {
    listEvents: function(perPage, page, callback) {
        var offset = (page - 1) * perPage;
        var perPage = parseInt(perPage);
        db.query('SELECT * FROM events ORDER BY id LIMIT ?, ?', [offset, perPage], function(err, rows, fields) {
            if (!err) {
                callback(false, rows);
            }
            else {
                callback(new errors.DatabaseError(err));
            }
        });
    },
    validateEvent: function(id, code, userId, callback) {
        db.query('SELECT * FROM events WHERE events.id=?', [id], function(err, rows, fields) {
            if (!err) {
                if (rows.length === 1) {
                    if (rows.code === code) {
                        db.query('SELECT COUNT(*) AS nb FROM validatedEvents WHERE userId=? AND eventId=?', [userId, id], function(err, rows, fields) {
                            if (rows[0].nb === 0) {
                                db.query('UPDATE users SET points = points + ?', [rows.points], function(err, rows, field) {
                                    if (!err) {
                                        callback(false, rows.point);
                                    }
                                    else {
                                        callback(new errors.DatabaseError(err));
                                    }
                                });
                            }
                            else {
                                callback(new errors.EventValidationError('You have already validated this event.'));
                            }
                        });
                    }
                    else {
                        callback(new errors.EventValidationError('Event code is invalid'));
                    }
                }
                else {
                    callback(new errors.NotFoundError('Event not found.'));
                }
            }
            else {
                callback(new errors.DatabaseError(err));
            }
        });
    }
};