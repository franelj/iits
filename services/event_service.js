/**
 * Created by julie on 7/28/16.
 */

"use strict";

var user = require('../lib/users');
var errors = require('../lib/errors');
var eventsLib = require('../lib/events');
var barcode = require("../lib/barcode");
var db = require('../lib/db');
var path = require('path');
var fs = require('fs');

module.exports = {
    list: function(perPage, page, past, upcoming) {
        return new Promise((resolve, reject) => {
            var perPage = perPage || 10;
            var page = page || 1;
            if (past === undefined && upcoming === undefined) {
                past = true;
                upcoming = true;
            }
            if (page > 0 && perPage > 0) {
                eventsLib.listEvents(perPage, page, past, upcoming, function(err, results) {
                    if (!err) {
                        resolve(results);
                    }
                    else {
                        reject(err);
                    }
                });
            }
            else {
                reject(new errors.InvalidParameterError());
            }
        });
    },
    validate: function(currentUser, eventId, code) {
        return new Promise((resolve, reject) => {
            if (eventId >= 0) {
                eventsLib.validateEvent(eventId, code, req.currentUser.id, function(err, results) {
                    if (!err) {
                        resolve(results);
                    }
                    else {
                        reject(err);
                    }
                });
            }
            else {
                reject(new errors.InvalidParameterError);
            }
        });
    },
    create: function(currentUser, name, description, points, filePath) {
        return new Promise((resolve, reject) => {
            if (!user.isAdmin(currentUser)) {
                reject(new errors.PermissionDeniedError("You do not have the rights to create an event"));
            }
            barcode.generateBarcodePng(function(err, png, code) {
                if (err) {
                    console.log(err);
                    reject(new errors.InvalidEntityError("Invalid barcode"));
                } else {
                    db.query(`INSERT INTO events (name, description, points, picture, barcode) VALUES ("${name}", "${description}",
                    "${points}", "${filePath}", "${code}")`, function(err, rows, fields) {
                        if (err) {
                            reject(new errors.DatabaseError("An error occurred while updating the database"));
                        }
                        var barcode = {
                            picture: "data:image/png;base64," + new Buffer(png.buffer, 'hex').toString('base64'),
                            length: png.length,
                            width: png.readUInt32BE(16),
                            height: png.readUInt32BE(20)
                        };
                        resolve(barcode);
                    });
                }
            });
        });
    },
    edit: function(currentUser, id, reqBody, filePath) {
        return new Promise((resolve, reject) => {
            if (user.isAdmin(currentUser)) {
                db.query(`SELECT * FROM events WHERE id = ${id}`, function(err, rows, fields) {
                    if (err) {
                        fs.access(path.resolve(filePath), function(err) {
                            if (!err) {
                                fs.unlink(path.resolve(filePath), function(err) { });
                            }
                            reject(new errors.DatabaseError("An error occurred while editing the event"));
                        });
                    } else if (rows.length > 0) {
                        var query = "UPDATE events SET ";
                        var toEdit = ["name", "description", "points", "picture"];
                        for (var i = 0; i < toEdit.length; i++) {
                            if (reqBody[toEdit[i]] !== undefined) {
                                if (i > 0)
                                    query += ", ";
                                if (toEdit[i] == "picture") {
                                    query += `${toEdit[i]} = "${filePath}"`;
                                } else {
                                    query += `${toEdit[i]} = "${reqBody[toEdit[i]]}"`;
                                }
                            }
                        }
                        query += `WHERE id = ${id}`;
                        db.query(query, function(err, rows, fields) {
                            if (err) {
                                reject(new errors.DatabaseError("An error occurred while editing the event"));
                            }
                            resolve(true);
                        });
                    } else {
                        reject(new errors.NotFoundError("This event does not exist"));
                    }
                });
            } else {
                fs.access(path.resolve(filePath), function(err) {
                    if (!err) {
                        fs.unlink(path.resolve(filePath), function(err) { });
                    }
                    reject(new errors.PermissionDeniedError("You do not have the rights to edit a event"));
                });
            }
        });
    },
    delete: function(currentUser, id) {
        return new Promise((resolve, reject) => {
            if (user.isAdmin(currentUser)) {
                db.query(`SELECT * FROM events WHERE id = ${id}`, function(err, rows, fields) {
                    if (err) {
                        reject(new errors.DatabaseError("An error occurred while deleting the event"));
                    } else if (rows.length > 0) {
                        let filePath = rows[0].picture;
                        db.query(`DELETE FROM rewards WHERE id = ${id}`, function(err, rows, fields) {
                            if (err) {
                                reject(new errors.DatabaseError("An error occurred while deleting the event"));
                            }
                            fs.access(path.resolve(filePath), function(err) {
                                if (!err) {
                                    fs.unlink(path.resolve(filePath), function(err) { });
                                }
                                resolve(true);
                            });
                        });
                    } else {
                        reject(new errors.NotFoundError("This event does not exist"));
                    }
                });
            } else {
                reject(new errors.PermissionDeniedError("You do not have the rights to delete a event"));
            }
        });
    }
};