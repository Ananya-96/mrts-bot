
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Metro = require("../models/metro.js");

router.get("/", function (req, res, next) {
    Metro.find({},function (err, metro) {
        if (err) console.log(err);
        else {

            res.json(metro);
        }
    }).select(' -_id');
});

module.exports = router;