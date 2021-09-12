var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let serveFolder;
if (process.env.NODE_ENV === 'production') {
  serveFolder = 'client/dist';
} else {
  serveFolder = 'client/public';
}
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`serveFolder: ${serveFolder}`);
app.use(express.static(path.join(__dirname, serveFolder)));

app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  console.log(req.baseUrl);
  console.log(req.originalUrl);
  res.send('error');
});

module.exports = app;
