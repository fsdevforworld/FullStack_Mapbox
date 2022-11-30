var express = require("express");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var env = require("node-env-file");
var cors = require("cors");

var app = express();

// if in development mode, load .env variables
if (app.get("env") === "development") {
  env(__dirname + "/.env");
}
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/api/coordinate", async function (req, res) {
  const bound = [
    [req.query.longitude1 * 1, req.query.latitude1 * 1],
    [req.query.longitude2 * 1, req.query.latitude2 * 1],
  ];
  let num = Math.random() * 10;
  num = 1 + (Math.ceil(num) % 5);
  let result = [];
  for (let i = 0; i < num; i++) {
    let difference1 = bound[1][0] - bound[0][0];
    let difference2 = bound[1][1] - bound[0][1];

    let rand1 = Math.random();
    rand1 = rand1 * difference1;
    rand1 = rand1 + bound[0][0];
    let rand2 = Math.random();
    rand2 = rand2 * difference2;
    rand2 = rand2 + bound[0][1];
    result.push([rand1, rand2]);
  }
  res.send({ result: result });
});

app.get("/api/getregion", async function (req, res) {
  const range = Math.random() / 10;
  const seed = [-100 + range * 20, 40 + range * 20];
  res.send({
    center: seed,
    bound: [
      [seed[0] - range, seed[1] - range],
      [seed[0] + range, seed[1] + range],
    ],
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {},
  });
});

module.exports = app;
