const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const app = express();

// routes required
//const index_router = require('./routes/index');
const admin_router = require('./routes/admin');
const login_router = require('./routes/login');
const join_router = require('./routes/join');
const my_page_router = require('./routes/my_page');
const search_router = require('./routes/search');
const service_center_router = require('./routes/service_center');
const shopping_basket_router = require('./routes/shopping_basket');

// MongoDB connected
//require('./database/db');

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
//app.use('/', index_router);
app.use('/admin', admin_router);
app.use('/login', login_router);
app.use('/join', join_router);
app.use('/my_page', my_page_router);
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