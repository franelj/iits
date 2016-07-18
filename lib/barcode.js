/**
 * Created by julie on 7/18/16.
 */

var random = require("randomstring");
var bwipjs = require("bwip-js");

module.exports = {
    generateEan13: function() {
        var code = random.generate({
            length: 12,
            charset: 'numeric'
        });
        // verifier si code pas deja present dans db
        return this.generateChecksum(code);
    },
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
        return code + count;
    },
    generateBarcodePng: function(cb) {
        var code = this.generateEan13();
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
    }
};