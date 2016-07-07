var express = require('express');
var router = express.Router();
var check_parameters = require('../middlewares/check_parameters');
var multer = require("multer");
var upload = multer({ dest: './uploads/' });
var db = require('../lib/db');
var errors = require('../lib/errors');

router.post('/create', upload.single("picture"), check_parameters(["name", "description", "points"]), function(req, res, next) {
    db.query(`INSERT INTO events (name, description, points, picture) VALUES ("${req.body.name}", "${req.body.description}", "${req.body.points}", 
    "${req.file.path}")`, function(err, rows, fields) {
        if (err) {
            return next(new errors.DatabaseError(
                `An error occurred while updating the database`), req, res
            );
        }
        res.json({ success: true });
    });
});

module.exports = router;
