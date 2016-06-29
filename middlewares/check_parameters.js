/**
 * Created by gregoirelafitte on 6/29/16.
 */

"use strict";

var errors = require("../lib/errors");

function checkParams(parameters) {
    var key = (Array.isArray(parameters) ? parameters.toString() : parameters);
    return checkParams[key] || (checkParams[key] = function(req, res, next) {
            let toCheck = (req.method == "GET" ? req.query : req.body);
            if (Array.isArray(parameters)) {
                for (var count = 0; count < parameters.length; count++) {
                    if (!toCheck[parameters[count]])
                        return next(new errors.MissingParameterError(
                            `Missing parameter : ${parameters[count]} is mandatory.`), req, res
                        );
                }
            }
            else if (!toCheck[parameters])
                return next(new errors.MissingParameterError(
                    `Missing parameter : ${parameters} is mandatory.`), req, res
                );
            next();
        })
}
module.exports = checkParams;