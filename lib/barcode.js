/**
 * Created by julie on 7/18/16.
 */

var random = require("randomstring");
var bwipjs = require("bwip-js");
var db = require("./db");
var errors = require('./errors');

module.exports = {
    generateChecksum: function(code) {
        var odd = 0, even = 0;
        for (var i = 1; i <= code.length; i++) {
            if (i % 2 == 0) {
                even += parseInt(code[i - 1]);
            }
            else {
                odd += parseInt(code[i - 1]);
            }
        }
        var tmp = (3 * even) + odd;
        var count = 0;
        while ((tmp + count) % 10 != 0) {
            count += 1;
        }
        console.log("qwertyuiop", code + count);
        return code + count;
    },
    generateEan13: function(nb, cb) {
        if (nb > 5) {
            return cb(new errors.DatabaseError("An error occurred while generating barcode number, please try again"));
        }
        var code = random.generate({
            length: 12,
            charset: 'numeric'
        });
        var self = this;
        db.query(`SELECT barcode FROM events WHERE barcode = ${code}`, function(err, rows, fields) {
            if (err) {
                return cb(new errors.DatabaseError("An error occurred, please try again"));
            } else if (rows.length > 0) {
                self.generateEan13(nb + 1);
            } else {
                return cb(null, self.generateChecksum(code));
            }
        });
    },
    generateBarcodePng: function(cb) {
        this.generateEan13(1, function(err, code) {
            bwipjs.toBuffer({
                bcid: 'ean13',
                text: code,
                scale: 3,
                height: 10,
                includetext: true,
                textxalign: 'center',
                textsize: 13
            }, function (err, png) {
                cb(err, png, code);
            });
        });
    }
};