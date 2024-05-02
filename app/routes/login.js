var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
router.get('/', authentificationMiddleware(), (req, res) => {
  res.redirect('/muro');
});

router.post('/login', (req, res) => {
 if (req.body.nomUser && req.body.password) {
   var con = require('../model/connection');
   var user = {
     username: req.body.nomUser,
     pass: req.body.password
   };
   con.one('select * from usuarios where alias = $1',[user.username])
   .then(userdb => {
    if(bcrypt.compareSync(user.pass, userdb.password)){
      req.session.user = userdb;
      req.session.user.fechanacimiento = userdb.fechanacimiento.toLocaleDateString().replace(/-/g,'/');
      res.redirect('/muro');
    }else{
      res.render('index', {incorrectValue: 'Error, usuario o contraseña incorrectos' });
    }
  })
   .catch(error => {
    var e = '';
    if(error.received == 0){
      e = 'Error, ' + user.username+ ' no existe.';
    }else{
      e = 'Error de conexión con el servidor';
    }
    res.render('index', {incorrectValue: e });
    console.log(error);
  });
   //.finally(con.$pool.end)  <= Para esto se necesita instalar el módulo de promise: Bluebird
 }else{
   res.render('index', {incorrectValue: 'Campos vacíos'});
   console.log('Campos en blanco');
 }
});

router.post('/sign-up', (req, res) => {

 if (req.body.email &&
   req.body.alias &&
   req.body.nombre &&
   req.body.apellidos &&
   req.body.pass && req.body.pass === req.body.pass2) {

   var date = req.body.year+'/'+req.body.month+'/'+req.body.day;
 var saltRounds = 10;
 var hash = bcrypt.hashSync(req.body.pass, saltRounds);
 var user = {
   alias: req.body.alias,
   email: req.body.email,
   nombre: req.body.nombre,
   apellidos: req.body.apellidos,
   password: hash,
   avatar: '../img/fotoPerfil.png',
   portada: '../img/fotoPortada.jpg',
   fechanacimiento: date
 };
 var con = require('../model/connection');
 var insertQuery = 'INSERT INTO usuarios(alias, email, password, nombre, apellidos, fechanacimiento, avatar, portada) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';

 con.none(insertQuery, [user.alias, user.email, user.password, user.nombre, user.apellidos, user.fechanacimiento, user.avatar, user.portada])
 .then(() => {
  console.log("Inserted!");
  req.session.user = user;
  res.redirect('/muro');
})
 .catch(error => {
  if(error.code == 23505)
    res.render('index', {incorrectValue: user.alias + " ya existe, por favor, introduzca uno diferente" });
  else
    console.log(error);
});
}else{
 res.render('index', {incorrectValue: 'Campos vacíos'});
 console.log('Campos en blanco');
}
});


function authentificationMiddleware() {
 return (req, res , next) =>{
   if (req.session.user){
    return next();
  }
  res.render('index', {incorrectValue: null});
};
}

module.exports = router;
