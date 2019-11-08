var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var apiRoutes = express.Router();

apiRoutes.post('/pdf', (req, res) => {
  // res.set({
  //   'Content-Type': 'application/pdf'
  // })
  // fs.readFile('./public/nodejs.pdf', (err, data) => {
  fs.readFile('./public/20190909.pdf', (err, data) => {
    if (err) {
      console.log('文件读取发生错误');
    } else {
      // res.send(data);
      res.end(data)
    }
  })
  // res.sendFile('http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')
  // res.send(``)
});


app.use('/api', apiRoutes);

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
