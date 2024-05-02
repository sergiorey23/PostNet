var express = require('express');
var router = express.Router();
var con = require('../model/connection');

router.use(function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
});

router.get('/', (req, res) => {
    con.any('select * from mensaje where (emisor = $1 AND receptor = $2) OR (emisor = $2 AND receptor = $1)ORDER BY id DESC Limit 20', [req.session.user.alias, req.query.contacto])
    .then(mensajes => {
        mensajes.reverse();
        con.any('select nombre, apellidos, alias, avatar from usuarios where alias = $1', req.query.contacto)
        .then(contacto => {
            con.result('UPDATE mensaje SET leido = true WHERE receptor = $1 and emisor = $2 and leido = false', [req.session.user.alias, req.query.contacto])
            .then(result => {
                req.session.user.notifications.mensajes -= result.rowCount;
                res.render('chat', {contacto: contacto[0], user: req.session.user, mensajes: mensajes});
            });
        });
    }).catch(error => {
        console.log(error);
    });
});

router.get('/cargarMas', (req, res) => {
    var cantidad = req.query.num || 0;
    var ide = parseInt(cantidad) + 20;
    con.any('select * from mensaje WHERE id <= ((SELECT count(*) FROM (select * from mensaje where (emisor = $1 AND receptor = $2) OR (emisor = $2 AND receptor = $1)) as query1)- $3) AND id >((SELECT count(*) FROM (select * from mensaje where (emisor = $1 AND receptor = $2) OR (emisor = $2 AND receptor = $1)) as query2)- $4) ORDER BY fecha DESC;', [req.session.user.alias, req.query.contacto, cantidad, ide])
    .then(mensajes => {
        mensajes.reverse();
        res.send({mensajes: mensajes});
    }).catch(error => {
        console.log(error);
    });
});
var numUsers = 0;



module.exports = function (io) {
    //Socket.IO
    io.on('connection', function (socket) {
        var addedUser = false;
        var leido = false;
        console.log("new conection ", socket.id);
        socket.on('message', function (data) {
            console.log(data);
            console.log(numUsers);
            if(numUsers == 2)
                leido = true;
            else
                leido = false;

            con.none('insert into mensaje (emisor, receptor, mensaje, leido) values ($1, $2, $3, '+leido+')', [socket.username, data.contact, data.message])
            .then(result => {
                io.emit('message', {
                    username: socket.username,
                    message: data.message
                });
            }).catch(error => {
                console.log(error);
            });
        });

        socket.on('add user', (username) => {
          if (addedUser) return;
          // we store the username in the socket session for this client
          socket.username = username;
          ++numUsers;
          addedUser = true;
      });

         // when the user disconnects.. perform this
         socket.on('disconnect', () => {
            if (addedUser) {
              --numUsers;
              leido = false;
          }
      });
     });
    return router;
};
