/**
 * Created by Aurelien PRIEUR on 11/07/16 for iits.
 */

var db = require('./db');
var errors = require('./errors');

module.exports = {
    listEvents: function(perPage, page, past, upcoming, callback) {
        var offset = (page - 1) * perPage;
        var perPage = parseInt(perPage);
        var whereStmt = '';
        if (past) {
            whereStmt += ' date < DATE(NOW())';
        }
        if (past && upcoming) {
            whereStmt += ' OR';
        }
        if (upcoming) {
            whereStmt += ' date >= DATE(NOW())';
        }
        var queryStmt = 'SELECT * FROM events  WHERE ' + whereStmt + '  ORDER BY id LIMIT ?, ?';
        db.query(queryStmt, [offset, perPage], function(err, rows, fields) {
            if (!err) {
                callback(false, rows);
            }
            else {
                console.log(err);
                callback(new errors.DatabaseError(err));
            }
        });
    },
    validateEvent: function(id, code, userId, callback) {
        db.query('SELECT * FROM events WHERE events.id=?', [id], function(err, rows, fields) {
            if (!err) {
                if (rows.length === 1) {
                    var event = rows[0];
                    if (event.code === code) {
                        db.query('SELECT COUNT(*) AS nb FROM validatedEvents WHERE userId=? AND eventId=?', [userId, id], function(err, rows, fields) {
                            if (rows[0].nb === 0) {
                                db.query('INSERT INTO validatedEvents (userId, eventId) VALUES(?, ?)', [userId, event.id], function(err, rows, fields) {
                                    if (!err) {
                                        db.query('UPDATE users SET points = points + ? WHERE id=?', [event.points, userId], function(err, rows, field) {
                                            if (!err) {
                                                callback(false, event);
                                            }
                                            else {
                                                console.log('Error while setting points');
                                                callback(new errors.DatabaseError(err));
                                            }
                                        });
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
                console.log('Error while retrieving events');
                callback(new errors.DatabaseError(err));
            }
        });
    }
};