var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015'));
app.use(session({
        secret : 'cookie',
        resave : true,
        saveUninitialized: true
        }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//MW encargado de chequear en cada petición HTTP si ha transcurrido 1 minuto desde la ultima
app.use(function(req, res, next){

  if (req.session.user) {
    var tiempo = new Date();
    tiempo = tiempo.getTime();
    if ((tiempo-req.session.user.lastGet) > 120000) {
      delete req.session.user;
      res.redirect(req.session.redir.toString());
    } else {
      req.session.user.lastGet = tiempo;
    }
  }
  next();
});

//Esta función es necesaria para poder hacer accesible la sesion desde las vistas
app.use(function(req, res, next){
  if (!req.session.redir) {
    req.session.redir = '/';
  }
  //Guardar path en session.redir para el pos login
  if(!req.path.match(/\/login|\/logout|\/user/)){
    req.session.redir = req.path;
  }

  //Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});


app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});

module.exports = app;
