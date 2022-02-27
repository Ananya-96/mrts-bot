
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Trains = require("../models/timing.js");
var routearray, routearray1;
var Route = require("../models/route.js");

//To display the complete timetable
router.get("/", function (req, res, next) {
  Trains.find(function (err, trains) {
    if (err) console.log(err);
    else {

      res.json(trains);
    }
  });
});

//To display the trains in that route
router.get("/routes/:routeid/days/:day", function (req, res, next) {

  Trains.find({ $and:[{routeid: req.params.routeid}, {day : req.params.day}] }, function (err, trains) {
    if (err) console.log(err);
    else {
      res.json(trains);
    }
  });
});

//To display the specified train
router.get("/trains/:trainid", function (req, res, next) {
  var trainid = parseInt(req.params.trainid);
  Trains.find({ trainid: trainid }, function (err, trains) {
    if (err) console.log(err);
    else {
      res.json(trains);
    }
  });
});

//To display trains in that route after now
router.get("/routes/:routeid/time", function (req, res, next) {

  var date = new Date();
  var time = date.toTimeString().split(' ')[0].split(':');
  var varnow = time[0] + time[1];
  var now = parseInt(varnow);
  Trains.aggregate([
    { $match: { routeid: req.params.routeid } },
    {
      $project:
        {
          stations:
            {
              $filter:
                {
                  input: "$stations",
                  as: "stations",
                  cond: {
                    $gte: ["$$stations.arrivalTime", now]
                  }
                }
            }
        }
    }
  ], function (err, trains) {
    if (err) {
      console.log("error in getting data %s", err);
    }
    else {

      res.json(trains);

    }
  });
});

//To display trains in that route after the given time
router.get("/routes/:routeid/time/:time/days/:day", function (req, res, next) {
  var day = req.params.day
  if (req.params.time == "first") {
    Trains.find({$and:[{ routeid: req.params.routeid},{day:day} ] }).sort({ startTime: 1 }).limit(1).exec(function (err, trains) {
      if (err) {
        console.log("error in getting data %s", err);
      }
      else {

        res.json(trains);

      }
    });
  }
  else if (req.params.time == "last") {
    Trains.find({$and:[{ routeid: req.params.routeid},{day:day} ] }).sort({ startTime: -1 }).limit(1).exec(function (err, trains) {
      if (err) {
        console.log("error in getting data %s", err);
      }
      else {

        res.json(trains);

      }
    });
  }
  else {
    var now = parseInt(req.params.time);
    Trains.aggregate([
      { $match: {$and:[{ routeid: req.params.routeid},{day:day} ] } },
      {
        $project:
          {
            stations:
              {
                $filter:
                  {
                    input: "$stations",
                    as: "stations",
                    cond: {
                      $gte: ["$$stations.arrivalTime", now]
                    }
                  }
              }
          }
      }
    ], function (err, trains) {
      if (err) {
        console.log("error in getting data %s", err);
      }
      else {

        res.json(trains);

      }
    });
  }
});

//To display the specified train after the given time
router.get("/trains/:trainid/time/:time", function (req, res, next) {
  if (req.params.time == "now") {
    var date = new Date();
    var time = date.toTimeString().split(' ')[0].split(':');
    var varnow = time[0] + time[1];
    var now = parseInt(varnow);
    Trains.find({ $and: [{ trainid: req.params.trainid }, { startTime: { $gte: now } }] }, function (err, trains) {
      if (err) {
        console.log("error in getting data %s", err);
      }
      else {

        res.json(trains);

      }
    });
  }
  else {
    var now = parseInt(req.params.time);
    Trains.find({ $and: [{ trainid: req.params.trainid }, { startTime: { $gte: now } }] }, function (err, trains) {
      if (err) {
        console.log("error in getting data %s", err);
      }
      else {

        res.json(trains);

      }
    });
  }
});


//To display all the routes between the source and destination
router.get("/station/:station1id/:station2id/time", function (req, res, next) {
  var station1id = parseInt(req.params.station1id);
  var station2id = parseInt(req.params.station2id);
  Trains.aggregate([

    {
      $project:

        {
          routeid: 1,
          stations:
            {
              $filter:
                {
                  input: "$stations",
                  as: "stations",
                  cond: {
                    $and: [
                      { $gte: ["$$stations.stationid", station1id] },
                      { $lte: ["$$stations.stationid", station2id] }
                    ]
                  }
                }
            }
        }
    }
  ], function (err, trains) {
    if (err) {
      console.log("error in getting data %s", err);
    }
    else {


      res.json(trains);

    }
  });
});

//To display the routes between the source and destination after now
var seq1, seq2, seq11, seq21, flag = 0, flag1 = 0;
var route = new Array();
var result = new Array();

//To display the routes between the source and destination after the given time
router.get("/stations/:station1id/:station2id/time/:time/days/:day", function (req, res, next) {
  var day = req.params.day
  if (req.params.time == "first") {

    var station1id = parseInt(req.params.station1id);
    var station2id = parseInt(req.params.station2id);

    Route.find({ $and: [{ route: { $elemMatch: { stationid: station1id } } }, { route: { $elemMatch: { stationid: station2id } } }] }).exec(function (err, routes) {
      if (err) {
        console.log("error in getting data %s", err);
      }
      else {

        routearray = routes;

        routearray.forEach(function (route1, index) {

          seq1 = 99999999;
          seq2 = -1;
          route1.route.forEach(function (route2, index) {
            if (route2.stationid == station1id) {
              seq1 = route2.seqno;

            }
            if (route2.stationid == station2id) {
              seq2 = route2.seqno;

            }



          });
          if (seq2 > seq1) {

            route.push(route1.name);
          }
        });
        Trains.aggregate([{ $match: { $and:[{ routeid: { $in: route } },{day:day}]} }]).sort({ startTime: 1 }).limit(1).exec(function (err, trains) {
          route.splice(0, route.length)
          res.json(trains);

        });


      }
    });

  }
  else if (req.params.time == "last") {

    var station1id = parseInt(req.params.station1id);
    var station2id = parseInt(req.params.station2id);

    Route.find({ $and: [{ route: { $elemMatch: { stationid: station1id } } }, { route: { $elemMatch: { stationid: station2id } } }] }).exec(function (err, routes) {
      if (err) {
        console.log("error in getting data %s", err);
      }
      else {

        routearray = routes;

        routearray.forEach(function (route1, index) {

          seq1 = 99999999;
          seq2 = -1;
          route1.route.forEach(function (route2, index) {
            if (route2.stationid == station1id) {
              seq1 = route2.seqno;

            }
            if (route2.stationid == station2id) {
              seq2 = route2.seqno;

            }



          });
          if (seq2 > seq1) {

            route.push(route1.name);
          }
        });
        Trains.aggregate([{ $match: { $and:[{ routeid: { $in: route } },{day:day}]} }]).sort({ startTime: -1 }).limit(1).exec(function (err, trains) {
          route.splice(0, route.length)
          res.json(trains);

        });


      }
    });

  }

  else {
    var station1id = parseInt(req.params.station1id);
    var station2id = parseInt(req.params.station2id);
    var now = parseInt(req.params.time);
    Route.find({ $and: [{ route: { $elemMatch: { stationid: station1id } } }, { route: { $elemMatch: { stationid: station2id } } }] }).exec(function (err, routes) {
      if (err) {
        console.log("error in getting data %s", err);
      }
      else {

        routearray = routes;

        routearray.forEach(function (route1, index) {

          seq1 = 99999999;
          seq2 = -1;
          route1.route.forEach(function (route2, index) {
            if (route2.stationid == station1id) {
              seq1 = route2.seqno;

            }
            if (route2.stationid == station2id) {
              seq2 = route2.seqno;

            }



          });
          if (seq2 > seq1) {

            route.push(route1.name);
          }
        });
        Trains.aggregate([{ $match: { $and:[{ routeid: { $in: route } },{day:day}]} }]).sort({ startTime: 1 }).exec( function (err, routes) {

          if (err) {
            console.log("error in getting data %s", err);
          }
          else {

            routearray1 = routes;
            routearray1.forEach(function (trains, index) {
              var resultRoute = new Object;
              resultRoute.name = trains.routeid;

              var stations = new Array();
              trains.stations.forEach(function (station, index) {
                if (station.stationid == station1id) {
                  seq11 = station.seqno;

                }
                if (station.stationid == station2id) {
                  seq21 = station.seqno;

                }
              });
              flag1 = 0;
              trains.stations.forEach(function (station, index) {
                if (station.stationid == station1id && station.arrivalTime >= now) {

                  flag1 = 1;
                }
                if (flag1 == 1) {
                  if (station.seqno >= seq11 && station.seqno <= seq21) {

                    stations.push(station);


                  }
                }

              });
              resultRoute.stations = stations;
              if(stations.length > 0)
              {result.push(resultRoute);}
            });
            res.json(result);

            route.splice(0, route.length);
            result.splice(0, result.length);
          }
        }
        );


      }
    });
  }
});



module.exports = router;
