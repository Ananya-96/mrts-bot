
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Route = require("../models/route.js");


//To display all the available stations
router.get("/", function (req, res, next) {
  Route.find(function (err, routes) {
    if (err) console.log(err);
    else {
      res.json(routes);
    }
  }).select('-_id name start final route.stationName');
});


//To display the stations after the given station in all the routes
var seq;
var route = new Array();
router.get("/:stationid/routes/:routeid", function (req, res, next) {
  var station1id = parseInt(req.params.stationid);
  var routename = req.params.routeid;
  Route.find({ $and: [{ name: routename }, { route: { $elemMatch: { stationid: station1id } } }] }).exec(function (err, routes) {
    if (err) {
      console.log("error in getting data %s", err);
    }
    else {

      routearray = routes;

      routearray.forEach(function (route1, index) {

        seq = 99999999;
        var resultRoute = new Object;
        resultRoute.name = route1.name;
        resultRoute.start = route1.start;
        resultRoute.final = route1.final;
        var stations = new Array();
        route1.route.forEach(function (route2, index) {
          if (route2.stationid == station1id) {
            seq = route2.seqno;

          }
          if (route2.seqno > seq) {

            stations.push(route2);
          }
        });
        resultRoute.stations = stations;
        route.push(resultRoute);
      });
      res.json(route);
      route.splice(0, route.length);
    }
  });
});
// To display the stations between the source and destination in all the routes
var seq1, seq2;
var route = new Array();
router.get("/:station1id/:station2id", function (req, res, next) {
  var station1id = parseInt(req.params.station1id);
  var station2id = parseInt(req.params.station2id);
  Route.find({ $and: [{ route: { $elemMatch: { stationid: station1id } } }, { route: { $elemMatch: { stationid: station2id } } }] }).exec(function (err, routes) {
    if (err) {
      console.log("error in getting data %s", err);
    }
    else {
      routearray = routes;
      routearray.forEach(function (route1, index) {
        console.log(route1.name)
        seq1 = 99999999
        seq2 = -1
        route1.route.forEach(function (route2, index) {
          if (route2.stationid == station1id) {
            seq1 = route2.seqno
          }
          if (route2.stationid == station2id) {
            seq2 = route2.seqno
          }
         
        })
        if (seq1 < seq2) {
           
          route.push(route1)
          
        }

      })

      res.json(route);
      route.splice(0,route.length);


    }
  });

});


module.exports = router;
