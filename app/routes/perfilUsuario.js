var express = require('express');
var router = express.Router();
var con = require('../model/connection');
var contact = null;

router.use(function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
});

router.get('/', (req, res) => {
    //obtengo los parametros de la url, me permite recargar dentro de las pestañas
    contact = (req._parsedUrl.query).split("=")[1];
    contact= contact.split("?")[0];
    
    if (contact == req.session.user.alias) {
        res.redirect('/perfil');
        return;
    }
    con.any('select * from usuarios where alias = $1', [contact])
            .then(usuario => {
                console.log(usuario[0].portada);
                res.render('perfilUsuario', {user: req.session.user, usuario: usuario[0]});
            }).catch(error => {
        console.log(error);
    });
});

router.get('/publicaciones', function (req, res) {
    var q = req.query.cantidad || 0; //num de publicaciones que hay
    con.task(t => {
        const posts = post => t.any('select *, avatar from comentario, usuarios where idPublicacion = $1 and alias = cuenta', post.id)
                    .then(comments => {
                        post.coments = comments;
                        return post;
                    });
        return t.map('select *, avatar from publicacion, usuarios where usuario = $1 and usuario = alias ORDER BY hora DESC LIMIT 10 OFFSET $2', [contact, q], posts)
                .then(t.batch);
    })
            .then(posts => {
                res.send(posts);
            })
            .catch(error => {
                console.log(error);
            });
});

router.get('/contactos', function (req, res) {
    con.any('SELECT usuarios.alias, nombre, apellidos, aceptado, avatar FROM usuarios, contactos WHERE (contactos.alias = $1' +
            ' AND usuarios.alias = contactos.contactoNick AND aceptado = true) OR (contactos.contactoNick = $1 AND' +
            ' usuarios.alias = contactos.alias) ORDER BY fechacreacion ASC LIMIT 10', contact)
            .then(contactos => {
                con.any('SELECT usuarios.alias, aceptado FROM usuarios, contactos WHERE (contactos.alias = $1' +
                        ' AND usuarios.alias = contactos.contactoNick) OR (contactos.contactoNick = $1 AND' +
                        ' usuarios.alias = contactos. alias)', req.session.user.alias)
                        .then(misContactos => {
                            res.send({contactos, misContactos});
                        });
            });
});

module.exports = router;


