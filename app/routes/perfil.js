var express = require('express');
var router = express.Router();
var con = require('../model/connection');
var cantidad = 0;
router.use(function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
});

router.get('/', (req, res) => {
    res.render('perfil', {user: req.session.user});
});


router.get('/publicaciones', function (req, res) {
    var q = req.query.cantidad || 0; //num de publicaciones que hay
    var username = req.session.user.alias;
    var query = "SELECT json_build_object('id', p.id, 'contenido', p.contenido, 'linkExterno', p.linkExterno, 'usuario', p.usuario, 'multimedia', p.multimedia, 'ubicacion', p.ubicacion, 'hora', p.hora, 'avatar', u.avatar, 'coments', (SELECT json_agg(json_build_object('id', c.id, 'idPublicacion', c.idPublicacion, 'cuenta', c.cuenta, 'content', c.content, 'fecha', c.fecha, 'avatar', u.avatar)) FROM comentario c, usuarios u WHERE p.id = c.idPublicacion and u.alias = c.cuenta)) json FROM publicacion p, usuarios u WHERE p.usuario = $1 and p.usuario = u.alias ORDER BY hora DESC LIMIT 5 OFFSET $2";

    con.map(query, [username, q], a => a.json)
            .then(data => {
                res.send(data); // your data tree
            })
            .catch(error => {
                console.log(error);
            });
});

router.get('/contactos', function (req, res) {
    if (req._parsedUrl.query == 'muro') {
        res.render('perfil', {user: req.session.user});
        return;
    }

    con.any('SELECT usuarios.alias, nombre, apellidos, aceptado, avatar FROM usuarios, contactos WHERE (contactos.alias = $1' +
            ' AND usuarios.alias = contactos.contactoNick AND aceptado = true) OR (contactos.contactoNick = $1 AND' +
            ' usuarios.alias = contactos.alias) ORDER BY fechacreacion ASC LIMIT 10', req.session.user.alias)
            .then(contactos => {
                res.send(contactos);
            }).catch(error => {
        console.log(error);
    });
});
router.get('/informacion', function (req, res) {
    if (req._parsedUrl.query == 'muro') {
        res.render('perfil', {user: req.session.user});
    }
});

router.get('/mensajes', function (req, res) {
    if (req._parsedUrl.query == 'muro') {
        res.render('perfil', {user: req.session.user});
        return;
    }

    con.any('SELECT DISTINCT ON (alias) alias, nombre, mensaje, avatar FROM usuarios, mensaje WHERE (emisor = $1 and receptor = alias) OR (emisor = alias and receptor = $1) ORDER BY alias, fecha DESC LIMIT 10', req.session.user.alias)
            .then(msgs => {
                res.send(msgs);
            }).catch(error => {
        console.log(error);
    });
});


router.get('/usuarios', function (req, res) {
    if (req._parsedUrl.query == 'muro') {
        res.render('perfil', {user: req.session.user});
        return;
    }
    try {
        con.any('SELECT usuarios.alias, nombre, apellidos, avatar FROM usuarios, contactos WHERE (contactos.alias = $1' +
                ' AND usuarios.alias = contactos.contactoNick AND aceptado = false)', req.session.user.alias)
                .then(usuariosConPeticion => {
                    con.any('SELECT alias, nombre, apellidos, avatar FROM usuarios WHERE alias != $1 and alias NOT IN (select contactoNick from contactos where alias = $1)' +
                            ' AND alias NOT IN (select alias from contactos where contactoNick = $1) ORDER BY fechacreacion ASC LIMIT 10', req.session.user.alias)
                            .then(users => {
                                res.send([usuariosConPeticion, users]);
                            });
                }).catch(error => {
            console.log(error);
        });
    } catch (e) {
        console.log(e);
        res.send(false);
    }
});

router.get('/eliminarContacto', function (req, res) {

    con.none('DELETE FROM contactos WHERE (alias = $1 AND contactoNick = $2) OR (alias = $2 AND contactoNick = $1)', [req.session.user.alias, req.query.alias])
            .then(result => {
                if (result == null) {
                    res.send(true);
                } else {
                    res.send(false);
                }
            }).catch(error => {
        console.log(error);
        res.send(false);
    });
});


router.post('/delPost', function (req, res) {

    con.none('DELETE FROM publicacion WHERE usuario = $1 and id = $2', [req.session.user.alias, req.body.idPost])
            .then(result => {
                if (result == null) {
                    res.send(true);
                } else {
                    res.send(false);
                }
            }).catch(error => {
        console.log(error);
        res.send(false);
    });
});

router.post('/delComment', function (req, res) {
    
    con.none('DELETE FROM comentario WHERE cuenta = $1 and id = $2', [req.session.user.alias, req.body.idComment])
            .then(result => {
                if (result == null) {
                    res.send(true);
                } else {
                    res.send(false);
                }
            }).catch(error => {
        console.log(error);
        res.send(false);
    });
});

router.get('/aceptarPeticion', function (req, res) {

    con.none('UPDATE contactos SET aceptado = true WHERE alias = $1 AND contactoNick = $2', [req.query.alias, req.session.user.alias])
            .then(result => {
                if (result == null) {
                    req.send(true);
                    if (req.session.user.notifications.peticiones > 0)
                        req.session.user.notifications.peticiones--;
                } else {
                    console.log(result);
                    res.send(false);
                }
            }).catch(error => {
        console.log(error);
        res.send(false);
    });
});

router.post('/update', (req, res) => {
    if (req.body.value) {

        var updateQuery = 'update usuarios set ' + req.body.id + ' = $1 where alias = $2';
        con.none(updateQuery, [req.body.value, req.session.user.alias])
                .then(() => {
                    req.session.user[req.body.id] = req.body.value;
                    console.log(req.body.id + " modificado a " + req.body.value);
                    res.send(true);
                })
                .catch(error => {
                    console.log(error);
                    res.send(false);
                });
    } else {
        console.log("No data inserted");
        res.send(false);
    }
});

router.post('/publicar', (req, res) => {
    var insertQuery = 'INSERT INTO publicacion (contenido, linkexterno, usuario, multimedia, ubicacion) VALUES($1, $2, $3, $4, $5)';

    var location = null;
    if (req.body.location != '') {
        location = req.body.location;
    }
    var link = null;
    if (req.body.link != '') {
        link = req.body.link;
    }

    con.none(insertQuery, [req.body.text, link, req.session.user.alias, req.body.pic, location])
            .then(() => {
                console.log("Publicacion insertada!");
                res.send(true);
            })
            .catch(error => {
                console.log(error);
                res.send(false);
            });
});

router.post('/delComment', function (req, res) {
    
    con.none('DELETE FROM comentario WHERE cuenta = $1 and id = $2', [req.session.user.alias, req.body.idComment])
            .then(result => {
                if (result == null) {
                    res.send(true);
                } else {
                    res.send(false);
                }
            }).catch(error => {
        console.log(error);
        res.send(false);
    });
});

router.post('/enviarMensaje', (req, res) => {
    var insertQuery = 'INSERT INTO mensaje (emisor, receptor, mensaje) VALUES($1, $2, $3)';

    var contenido = null;
    if (!req.body.contenido || !req.body.alias) {
        res.send(false);
        return;
    }
    con.none(insertQuery, [req.session.user.alias, req.body.alias, req.body.contenido])
            .then(() => {
                console.log("Mensaje enviado!");
                res.send(true);
            })
            .catch(error => {
                console.log(error);
                res.send(false);
            });
});

router.get('/addContacto', function (req, res) {
    con.none('INSERT INTO contactos (alias, contactoNick) VALUES ($1, $2)', [req.session.user.alias, req.query.alias])
            .then(result => {
                if (result == null)
                    res.send(true);
                else {
                    console.log(result);
                    res.send(false);
                }
            })
            .catch(error => {
                console.log(error);
                res.send(false);
            });
});

router.post('/eliminar', (req, res) => {
    con.result('delete from usuarios where alias = $1', req.session.user.alias)
            .then(result => {
                res.redirect('/muro/logout');
            })
            .catch(error => {
                console.log(error);
                res.redirect('/perfil');
            });
});

router.post('/addComentario', function (req, res) {
    con.none('insert into comentario (idpublicacion, cuenta, content) values ($1, $2, $3)', [req.body.postId, req.session.user.alias, req.body.text])
            .then(result => {
                res.send(req.session.user.alias);
            }).catch(error => {
        console.log(error);
        res.send(false);
    });
});


router.post('/avatar', (req, res) => {
    con.none('update usuarios set avatar = $1 where alias = $2', [req.body.encodedPic, req.session.user.alias])
            .then(result => {
                console.log(result);
                req.session.user.avatar = req.body.encodedPic;
                res.send(true);
            }).catch(error => {
        console.log(error);
        res.send(false);
    });
});

router.post('/portada', (req, res) => {
    con.none('update usuarios set portada = $1 where alias = $2', [req.body.encodedPic, req.session.user.alias])
            .then(result => {
                req.session.user.portada = req.body.encodedPic;
                res.send(true);
            }).catch(error => {
        console.log(error);
        res.send(false);
    });
});

module.exports = router;
