/**
 * Created by julie on 6/27/16.
 */
var mysql = require('mysql');
var config = require('../config/config.json');

module.exports = (function() {
    return mysql.createPool({
        connectionLimit : 10,
        host            : 'localhost',
        user            : config["db"]["username"],
        password        : config["db"]["password"],
        database        : config["db"]["dbname"]
    });
})();