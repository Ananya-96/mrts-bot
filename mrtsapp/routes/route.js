
var express = require('express');
var router = express.Router();
var routearray;
var mongoose = require('mongoose');
var Route = require("../models/route.js");

//Display all the routes in routes collection
router.get("/", function (req, res, next) {
  Route.find(function (err, routes) {
    if (err) console.log(err);
    else {
      res.json(routes);
    }
  }).select(' -_id');
});

//Display the specified route with the given routeid
//To display stations in a route after the specified station
var seq;
var route = new Array();
router.get("/:stationid", function (req, res, next) {
  var stationid = parseInt(req.params.stationid);
  Route.find({ route: { $elemMatch: { stationid: stationid } } }).exec(function (err, routes) {
    if (err) {
      console.log("error in getting data %s", err);
    }
    else {

      
      res.json(routes);
      
    }
  });
});

router.get("/types/:type", function (req, res, next) {
  var type = req.params.type;
  Route.find({ type: type }).exec(function (err, routes) {
    if (err) {
      console.log("error in getting data %s", err);
    }
    else {

      
      res.json(routes);
      
    }
  });
});


module.exports = router;
