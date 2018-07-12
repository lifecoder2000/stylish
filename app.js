const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const app = express();

// routes required
//const index_router = require('./routes/index');
let admin_router = require('./routes/admin');
let users_router = require('./routes/users');
let search_router = require('./routes/search');
let service_center_router = require('./routes/service_center');
let shopping_basket_router = require('./routes/shopping_basket');

// MongoDB connected
require('./database/db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '@#@$SSR#@$#$',
  resave: false,
  saveUninitialized: true
}));

// routes set
app.use('/admin', admin_router);
app.use('/user', users_router);
app.use('/search', search_router);
app.use('/service_center', service_center_router);
app.use('/shopping_basket', shopping_basket_router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;