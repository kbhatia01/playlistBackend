var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./src/Controller/playlistController');
const mongoose = require('mongoose');
const config = require('./src/config/index.js')['devo'];
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
console.log(config.MONGO_DB_URL)
mongoose.connect(config.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err) {
  console.log(err);
});
mongoose.connection.on('connected', function () {
  console.log("hey");
});
app.use('/api', indexRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err)
  res.json({ error: 'error' });
});

app.listen("9000", function (err) {
  if (err) {
    console.log(res);
  }
})

module.exports = app;
