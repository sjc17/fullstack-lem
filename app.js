const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./database/db');

const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

const app = express();

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
app.use('/api', apiRouter);

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
  res.send(`Error status: ${err.status}.`);
});

module.exports = app;
