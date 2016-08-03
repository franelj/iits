/**
 * Created by Aurelien PRIEUR on 06/07/16 for iits.
 */

var db = require('../lib/db');
var jwt = require('jsonwebtoken');
var errors = require('./errors');

var jwtSecret = 'Ng*ZcCbPtHc@DtY!u&*2eaSZE4LV,bz2*YCTDQa>bGr{wV@';

var getUser = function(id, callback) {
    db.query('SELECT * FROM users WHERE id=?', [id], function(err, rows, fields) {
        if (!err && rows.length === 1) {
            callback(false, rows[0]);
        }
        else {
            callback(new errors.NotFoundError('No user found'));
        }
    });
};

module.exports = {
    getUser: getUser,
    checkUsernamePassword: function(username, password, callback) {
        db.query('SELECT * FROM users WHERE username=? AND password=?', [username, password], function(err, rows, fields) {
            if (!err && rows.length === 1) {
                callback(false, rows[0].id);
            }
            else if (!err) {
                callback(new errors.AuthenticationError(), false);
            }
            else {
                callback(new errors.DatabaseError(err), false);
            }
        });
    },
    generateToken: function(userId, callback) {
        jwt.sign({userId: userId}, jwtSecret, {expiresIn: "24h"}, callback);
    },
    checkToken: function(token, callback) {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (!err) {
                console.log("token: " + decoded);
                callback(null, userId);
            }
            else {
                console.log('err: ' + err);
                callback(err, null);
            }
        });
    },
    isAdmin: function(user) {
        console.log(user);
        return user.status > 0
    },
    authMiddleware: function(req, res, next) {
        var token = req.headers.authorization;
        if (token) {
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (!err) {
                    getUser(decoded.userId, function(err, user) {
                        if (!err) {
                            req.currentUser = user;
                            return next();
                        }
                        else {
                            return next(new errors.NotFoundError('No user found'));
                        }
                    });
                }
                else {
                    return next(err);
                }
            });
        }
        else {
            return next(new errors.NotAuthenticatedError());
        }
    },
    session: function(req, res, next) {
        if (req.session && req.session.token) {
            checkToken(req.session.token, function(err, userId) {
                db.query(`SELECT * FROM users WHERE id = ${userId}`, function(err, rows, fields) {
                    if (rows.length > 0) {
                        req.session.user = rows[0];
                    } else {
                        delete req.session.user;
                    }
                    return next();
                });
            })
        } else {
            return next();
        }
    }
};