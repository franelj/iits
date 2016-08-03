/**
 * Created by gregoirelafitte on 6/29/16.
 */

"use strict";

var errors = require("../lib/errors");
var fs = require('fs');
var path = require('path');

function checkParams(parameters) {
    var key = (Array.isArray(parameters) ? parameters.toString() : parameters);
    return checkParams[key] || (checkParams[key] = function(req, res, next) {
            let toCheck = (req.method == "GET" ? req.query : req.body);
            var fullPath = "";
            if (Array.isArray(parameters)) {
                for (var count = 0; count < parameters.length; count++) {

                    if (!toCheck[parameters[count]] && (!(req.file) || req.file.fieldname != parameters[count])) {
                        if (req.file) { fullPath = path.resolve(req.file.path); }
                        try {
                            fs.accessSync(fullPath);
                            fs.unlinkSync(fullPath);
                        } catch (err) {}
                        return next(new errors.MissingParameterError(
                            `Missing parameter : ${parameters[count]} is mandatory.`), req, res
                        );
                    }
                }
            }
            else if (!toCheck[parameters] && req.file.fieldname != parameters) {
                if (req.file) { fullPath = path.resolve(req.file.path); }
                try {
                    fs.accessSync(fullPath);
                    fs.unlinkSync(fullPath);
                } catch (err) {}
                return next(new errors.MissingParameterError(
                    `Missing parameter : ${parameters} is mandatory.`), req, res
                );
            }
            next();
        })
}
module.exports = checkParams;