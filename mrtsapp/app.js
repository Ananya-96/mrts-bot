var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var routes= require('./routes/route');
var station= require('./routes/station');
var timetable =require('./routes/timetable');
var fares = require('./routes/fare')
var metro = require('./routes/metro')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//paths to be used

app.use('/', index);
app.use('/routes', routes);
app.use('/stations', station);
app.use('/timetable', timetable);
app.use('/fares',fares)
app.use('/metro',metro)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var mongoose = require ('mongoose');

//set Promise to Node native Promise.
mongoose.Promise = global.Promise;

//Connect now to MongoDB
mongoose.connect("mongodb://ananya96:ananya96@ds127139.mlab.com:27139/heroku_tt47728r")
 .then (() => console.log ("Connected successfully"))
 .catch((err) => console.log ("error in connecting")) ;

module.exports = app;
