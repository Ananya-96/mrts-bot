
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var routearray, routearray1;
var Fare = require("../models/fare.js");

//Defining the route

router.get("/", function (req, res, next) {
    Fare.find(function (err, fares) {
        if (err) console.log(err);
        else {
            //Parse json data
            res.json(fares);
        }
    });
});

router.get("/stations1/:station1/stations2/:station2", function (req, res, next) {
    var station1 =  req.params.station1
    var station2 = req.params.station2
    // Matching criteria with mongodb data
    Fare.find({$or:[{$and:[{station1:station1},{station2:station2}]},{$and:[{station1:station2},{station2:station1}]}]},function (err, fares) {
        if (err) console.log(err);
        else {

            res.json(fares);
        }
    });
});


module.exports = router;