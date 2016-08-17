/**
 * Created by julie on 7/28/16.
 */

var user = require('../lib/users');
var errors = require('../lib/errors');
var db = require('../lib/db');

module.exports = {
    authenticate: function(username, password) {
        return new Promise((resolve, reject) => {
            user.checkUsernamePassword(username, password, function(err, id) {
                if (!err) {
                    user.generateToken(id, (err, token) => {
                        if (!err) {
                            resolve(token);
                        }
                        else {
                            reject(new errors.AuthenticationError());
                        }
                    });
                }
                else {
                    reject(err);
                }
            });
        });
    },
    get: function(currentUser, id) {
        return new Promise((resolve, reject) => {
            if (user.isAdmin(currentUser)) {
                if (id) {
                    user.getUser(id, function(err, user) {
                        if (!err) {
                            resolve(user);
                        }
                        else {
                            reject(err);
                        }
                    });
                }
                else {
                    reject(new errors.MissingParameterError());
                }
            } else {
                reject(new errors.PermissionDeniedError())
            }
        });
    },
    list: function(page, perPage) {
        return new Promise((resolve, reject) => {
            if (page <= 0 || page === undefined)
                page = 1;
            if (perPage <= 0 || perPage === undefined)
                perPage = 10;
            db.query(`SELECT * FROM users LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`, function(err, rows, fields) {
                if (err) {
                    reject(new errors.DatabaseError("An error occurred while retrieving the users"));
                } else {
                    resolve(rows);
                }
            });
        });
    },
    grant: function(id) {
        return new Promise((resolve, reject) => {
            if (user.isAdmin(currentUser)) {
                db.query(`SELECT * FROM users WHERE id = ${id}`, function(err, rows, fields) {
                    if (rows.length > 0) {
                        db.query(`UPDATE users SET status = 1 WHERE id = ${id}`, function(err, rows, fields) {
                            if (err) {
                                reject(new errors.DatabaseError("An error occurred while editing the user status"))
                            } else {
                                resolve(true);
                            }
                        });
                    } else {
                        reject(new errors.DatabaseError());
                    }
                });
            } else {
                reject(new errors.PermissionDeniedError())
            }
        });
    }
};