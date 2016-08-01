/**
 * Created by julie on 7/28/16.
 */

var user = require('../lib/users');
var errors = require('../lib/errors');

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
    get: function(id) {
        return new Promise((resolve, reject) => {
            if (user.isAdmin) {
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
    }
};