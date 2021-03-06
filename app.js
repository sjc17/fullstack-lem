require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const rateLimit = require('express-rate-limit');

const db = require('./database/db');
const { NODE_ENV } = require('./config');

const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Limit 100 requests per 15 minutes
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
}));

let serveFolder;
if (NODE_ENV === 'production') {
  serveFolder = 'client/dist';
} else {
  serveFolder = 'client/public';
}
console.log(`NODE_ENV: ${NODE_ENV}`);
console.log(`serveFolder: ${serveFolder}`);
app.use(express.static(path.join(__dirname, serveFolder)));

app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err.status || 500)
  res.sendStatus(err.status || 500);
  console.log(req.baseUrl);
  console.log(req.originalUrl);
});

module.exports = app;
