var express = require('express');
var router = express.Router();
var con = require('../model/connection');
var cantidad;

router.get('/', (req, res) => {
  if (req.session.user){
    var username = req.session.user.alias;
    //consulta el numero de publicaiones que tiene el usuario
    con.result('select * from publicacion where usuario = $1', username)
    .then(result => {
        //Obtiene las publicaciones del usuario y de sus contactos
        con.any('select publicacion.* from publicacion, contactos WHERE (contactos.alias = $1 AND contactos.contactoNick = usuario AND aceptado = true)' +
          'OR (contactos.contactoNick = $1 AND contactos.alias = usuario AND aceptado = true) OR usuario = $1 group by id ORDER BY hora DESC LIMIT 2', username)
        .then(posts => {
          //Consulta el número de contactos que tiene el usuario
          con.result('SELECT * FROM usuarios, contactos WHERE ((contactos.alias = $1'+
           ' AND usuarios.alias = contactos.contactoNick) OR (contactos.contactoNick = $1 AND usuarios.alias = contactos.alias)) AND aceptado = true', username)
          .then(contactos => {
                // Notificaciones
                con.result('SELECT * FROM contactos WHERE contactos.contactoNick = $1'+
                 ' AND aceptado = false', username)
                .then(peticiones => {
                  con.result('SELECT * FROM mensaje, contactos WHERE ((contactos.alias = $1'+
                   ' AND emisor = contactos.contactoNick) OR (contactos.contactoNick = $1 AND emisor = contactos.alias)) and leido = false', username)
                  .then(mensajes => {
                  // Recomendacion de usuarios
                  con.any('SELECT alias, nombre, apellidos, avatar FROM usuarios WHERE alias != $1 and alias NOT IN (select contactoNick from contactos where alias = $1)' +
                    ' AND alias NOT IN (select alias from contactos where contactoNick = $1) ORDER BY fechacreacion ASC LIMIT 5', username)
                  .then(usuarios => {
                    req.session.user.notifications = {
                      peticiones: peticiones.rowCount,
                      mensajes: mensajes.rowCount
                    };
                    cantidad = posts.length;
                    res.render('muro', {user: req.session.user, postsLength: result.rowCount, posts: posts, contactos: contactos.rowCount, usuarios: usuarios});
                  });
                });
                });
              });
        });
      }).catch(error => {
        console.log(error);
      });
    }else {
      res.redirect('/');
    }
  });

router.get('/buscar', function(req, res){
  con.any('SELECT alias, nombre, apellidos, avatar from usuarios where alias ~ $1 OR nombre ~ $1 OR apellidos ~ $1' , req.query.buscar)
  .then(buscados =>{
      // console.log(buscados);
      res.send(buscados);
    }).catch(error => {
      console.log("error");
    });
  });

router.get('/cargar', function(req, res){
  // var cantidad = req.query.cantidad || 0;
  con.any('select publicacion.* from publicacion, contactos WHERE (contactos.alias = $1 AND contactos.contactoNick = usuario AND aceptado = true)' +
    'OR (contactos.contactoNick = $1 AND contactos.alias = usuario AND aceptado = true) OR usuario = $1 group by id ORDER BY hora DESC LIMIT 2 OFFSET $2', [req.session.user.alias, cantidad])
  .then(posts =>{
    cantidad += posts.length;
    console.log(posts.length);
    res.send(posts);
  }).catch(error => {
    console.log("error");
  });
});

router.post('/addComentario', function (req, res) {
  if (req.session.user){
    var username = req.session.user.alias;
    con.none('insert into comentario (idPublicacion, cuenta, content) values ($1, $2, $3)',[req.body.postId, username, req.body.text])
    .then(result => {
      res.send({alias: username, avatar: req.session.user.avatar});
    }).catch(error => {
      console.log(error);
      res.send(false);
    });
  }else{
    res.redirect('/');
  }
});

router.get('/like', function (req, res) {
  if (req.session.user){
    var username = req.session.user.alias;
    con.none('UPDATE publiacion SET likes = likes + 1 where usuario = $1 and id = $2',[req.session.user.alias, req.body.idPost])
    .then(result => {
      if (result == null) {
        res.send(true);
      } else {
        console.log(result);
        res.send(false);
      }
    }).catch(error => {
      console.log(error);
      res.send(false);
    });
  }else{
    res.redirect('/');
  }
});

router.get('/comentarios', function (req, res) {
  if (req.session.user){
    con.any('SELECT *, usuarios.avatar FROM comentario, usuarios WHERE idPublicacion = $1 and alias = cuenta', req.query.pub)
    .then(coments => {
      con.any('SELECT avatar FROM publicacion, usuarios WHERE alias = usuario and id = $1', req.query.pub)
      .then(avatar => {
        res.send({pub: req.query.pub, avatar: avatar[0].avatar, coments: coments});
      });
    }).catch(error => {
      console.log(error);
      res.send(false);
    });
  }else{
    res.redirect('/');
  }
});

router.get('/perfil', function (req, res) {
  res.redirect('/perfil');
});

router.get('/logout', function (req, res) {
  if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
          if (err) {
            return next(err);
          } else {
            return res.redirect('/');
          }
        });
      }
    });

module.exports = router;
