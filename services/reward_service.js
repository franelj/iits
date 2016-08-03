/**
 * Created by gregoirelafitte on 8/1/16.
 */

var user = require('../lib/users');
var errors = require('../lib/errors');
var db = require('../lib/db');
var fs = require('fs');
var path = require('path');

module.exports = {
    create: function(currentUser, name, description, points, filePath) {
      return new Promise((resolve, reject) => {
         if (user.isAdmin(currentUser)) {
             if (name && description && points && filePath) {
                 db.query(`INSERT INTO rewards (name, description, points, picture) VALUES ("${name}", "${description}", "${points}", "${filePath}")`, function(err, rows, fields) {
                     if (err) {
                         fs.access(path.resolve(filePath), function(err) {
                             if (!err) {
                                 fs.unlink(path.resolve(filePath), function(err) { });
                             }
                             reject(new errors.DatabaseError("An error occurred while creating the reward"));
                         });
                     }
                     resolve(true);
                 });
             }
         } else {
             fs.access(path.resolve(filePath), function(err) {
                 if (!err) {
                     fs.unlink(path.resolve(filePath), function(err) { });
                 }
                 reject(new errors.PermissionDeniedError("You do not have the rights to create a reward"));
             });
         }
      });
    },
    edit: function(currentUser, id, reqBody, filePath) {
        return new Promise((resolve, reject) => {
           if (user.isAdmin(currentUser)) {
               db.query(`SELECT * FROM rewards WHERE id = ${id}`, function(err, rows, fields) {
                   if (err) {
                       fs.access(path.resolve(filePath), function(err) {
                           if (!err) {
                               fs.unlink(path.resolve(filePath), function(err) { });
                           }
                           reject(new errors.DatabaseError("An error occurred while editing the reward"));
                       });
                   } else if (rows.length > 0) {
                       var query = "UPDATE rewards SET ";
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
                               reject(new errors.DatabaseError("An error occurred while editing the reward"));
                           }
                           resolve(true);
                       });
                   } else {
                       reject(new errors.NotFoundError("This reward does not exist"));
                   }
               });
           } else {
               fs.access(path.resolve(filePath), function(err) {
                   if (!err) {
                       fs.unlink(path.resolve(filePath), function(err) { });
                   }
                   reject(new errors.PermissionDeniedError("You do not have the rights to edit a reward"));
               });
           }
        });
    },
    delete: function(currentUser, id) {
        return new Promise((resolve, reject) => {
            if (user.isAdmin(currentUser)) {
                db.query(`SELECT * FROM rewards WHERE id = ${id}`, function(err, rows, fields) {
                    if (err) {
                        reject(new errors.DatabaseError("An error occurred while deleting the reward"));
                    } else if (rows.length > 0) {
                        let filePath = rows[0].picture;
                        db.query(`DELETE FROM rewards WHERE id = ${id}`, function(err, rows, fields) {
                            if (err) {
                                reject(new errors.DatabaseError("An error occurred while deleting the reward"));
                            }
                            fs.access(path.resolve(filePath), function(err) {
                                if (!err) {
                                    fs.unlink(path.resolve(filePath), function(err) { });
                                }
                                resolve(true);
                            });
                        });
                    } else {
                        reject(new errors.NotFoundError("This reward does not exist"));
                    }
                });
            } else {
                reject(new errors.PermissionDeniedError("You do not have the rights to delete a reward"));
            }
        });
    },
    list: function(page, perPage) {
        if (page <= 0)
            page = 1;
        if (perPage <= 0)
            perPage = 10;
        db.query(`SELECT * FROM rewards LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`, function(err, rows, fields) {
            if (err) {
                reject(new errors.DatabaseError("An error occurred while retrieving the rewards"));
            }
            resolve(rows);
        });
    },
    order:function(currentUser, orders) {
        orders = JSON.parse(orders);
        let query = undefined;
        for (var i = 0; i < orders.orders.length; i++) {
            var order = orders.orders[i];
            if (query == undefined) {
                query = `SELECT * FROM rewards WHERE id IN (${order.id}`;
            } else {
                query += `, ${order.id}`;
            }
        }
        query += ")";
        db.query(query, function(err, rows, fields) {
            if (err) {
                reject(new errors.DatabaseError("An error occurred while retrieving the reward"));
            } else if (rows.length == orders.orders.length) {
                let totalPointCost = 0,
                    insertQuery = undefined;
                for (var i = 0; i < orders.orders.length; i++) {
                    var order = orders.orders[i];
                    for (var j = 0; j < rows.length; j++) {
                        var row = rows[j];
                        if (order.id == row.id) {
                            totalPointCost += order.quantity * row.points;
                            if (insertQuery == undefined) {
                                insertQuery = `INSERT INTO orders (userid, rewardid, quantity) VALUES ("${currentUser.id}", "${order.id}", "${order.quantity}")`
                            } else {
                                insertQuery += `, ("${currentUser.id}", "${order.id}", "${order.quantity}")`;
                            }
                        }
                    }
                }
                if (!currentUser.points || currentUser.points < totalPointCost) {
                    return resolve(false);
                }
                db.query(insertQuery, function(err, rows, fields) {
                    if (err) {
                        reject(new errors.DatabaseError("An error occurred while creating the order"));
                    }
                    currentUser.points = currentUser.points - totalPointCost;
                    resolve(true);
                });
            } else {
                reject(new errors.NotFoundError("A reward does not exist"), req, res);
            }
        });
    }
};