/**
 * Created by gregoirelafitte on 6/27/16.
 */

var express = require('express');
var router = express.Router();
var db = require('../lib/db.js');
var errors = require('../lib/errors.js');
var check_params = require('../middlewares/check_parameters');
var multer = require('multer');
var upload = multer({ dest: './uploads/' });

router.post('/', upload.single('picture'), check_params(["name", "description", "points"]), function(req, res, next) {
    db.query(`INSERT INTO rewards (name, description, points, picture) VALUES ("${req.body.name}", "${req.body.description}", "${req.body.points}", "${req.file.path}")`, function(err, rows, fields) {
        if (err)
            return next(new errors.DatabaseError('An error occurred when creating new reward'), req, res);
    });
    res.json({success: true});
});

/* GET reward listing. */
router.get('/list', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
