/**
 * Created by gregoirelafitte on 8/1/16.
 */

var user = require('../lib/users');
var errors = require('../lib/errors');
var db = require('../lib/db');

module.exports = {
    create: function(name, description, points, filePath) {
      return new Promise((resolve, reject) => {
         if (user.isAdmin) {
             if (name && description && points && filePath) {
                 db.query(`INSERT INTO rewards (name, description, points, picture) VALUES ("${name}", "${description}", "${points}", "${filePath}")`, function(err, rows, fields) {
                     if (err) {
                         reject(new errors.DatabaseError("An error occurred while creating the reward"), req, res);
                     }
                     resolve(true);
                 });
             }
         } else {
             fs.access(fullPath, function(err) {
                 if (!err) {
                     fs.unlink(fullPath, function(err) { });
                 }
                 reject(new errors.PermissionDeniedError("You do not have the rights to create a reward"));
             });
         }
      });
    }
};