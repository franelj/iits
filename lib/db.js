/**
 * Created by julie on 6/27/16.
 */
var mysql = require('mysql');
var config;
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
    config = require('../config/config_example.json');
}
else {
    config = require('../config/config.json');
}

console.log(config);

module.exports = (function() {
    return mysql.createPool({
        connectionLimit : 10,
        host            : 'localhost',
        user            : config["db"]["username"],
        password        : config["db"]["password"],
        database        : config["db"]["dbname"]
    });
})();