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
            }
        });
    },
    list: function(page, perPage) {
        if (page <= 0)
            page = 1;
        if (perPage <= 0)
            perPage = 10;
        db.query(`SELECT * FROM users LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`, function(err, rows, fields) {
            if (err) {
                reject(new errors.DatabaseError("An error occurred while retrieving the rewards"));
            }
            resolve(rows);
        });
    }
};