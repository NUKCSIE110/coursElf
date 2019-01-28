var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var stylus = require("stylus");

//About security
var helmet = require("helmet");

//About optimize
var serveStatic = require("serve-static");
var compression = require("compression");
var minify = require("express-minify");

//About session
var session = require("express-session");
var MemoryStore = require("memorystore")(session);

//load .env
require("dotenv").load();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRouter = require("./routes/api");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(helmet());

//Initialize session
app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
    /*cookie: { secure: true }*/ //Will randomlize cookie
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compression());
app.use(minify());
app.use(stylus.middleware(path.join(__dirname, "public")));
app.use(serveStatic(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(function(req, res, next) {
    //console.log(req.sessionID);
    //console.log(req.session);
    next();
  });
}

//Set router
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (process.env.NODE_ENV === "development") {
    res.render("error");
  } else {
    res.render("error_production");
  }
});

console.log(process.env.NODE_ENV);

module.exports = app;
