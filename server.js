var express = require('express');
var path = require('path'); //rutas
var logger = require('morgan'); //consola
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
app.io = require('socket.io')();

var login = require('./app/routes/login');
var muro = require('./app/routes/muro');
var perfil = require('./app/routes/perfil');
var perfilUsuario = require('./app/routes/perfilUsuario');
var chat = require('./app/routes/chat')(app.io);

// settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));
app.use(logger('dev')); //info consola
app.use(express.static(path.join(__dirname, 'app/public'))); //obtiene recursos

// middlewares
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());

app.use(session({
  secret: 'postpass2018',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

//routes
app.use('/', login);
app.use('/muro', muro);
app.use('/perfil', perfil);
app.use('/chat', chat);
app.use('/contacto', perfilUsuario);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
