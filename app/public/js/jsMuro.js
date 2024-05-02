var numContactos;
var numUsuarios;
var $window = $(window);
var scroll = false;
$(document).ready(function () {
    // Evento que se genera cada vez que se mueve el scroll del navegador
    $(document).scroll(function () {
        // 40 es el valor de la altura del header
        // Si aumentas el header, aumenta este valor
        if ($(document).scrollTop() > 75) {
            // Movemos la posición top del css segun el scroll
            $("#barraIzquierda").css("top", 40);
            $("#barraDerecha").css("top", 40);
        } else {
            // Movemos a la posición inicial
            $("#barraIzquierda").css("top", 155);
            $("#barraDerecha").css("top", 155);
        }
    });

    const getComentarios = (postsIds) => {
        for (var id of postsIds) {
            $.ajax({
                type: "GET",
                url: '/muro/comentarios',
                dataType: "html",
                data: {pub: id},
                success: function (data) {
                    if (data) {
                        data = JSON.parse(data);
                        $("#imgPerfilPublicacion" + data.pub).attr('src', data.avatar);
                        if (data.coments.length > 0)
                            $("#commentPost_" + data.pub).append(mostrarComentarios(data.coments));
                    }
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }
    }
    $window.resize(function () {


        if ($window.width() <= 1030) {
            $("#barraIzquierda").css("display", 'none');
            $("#barraDerecha").css("display", 'none');
        }
        if ($window.width() >= 1030) {
            $("#barraIzquierda").css("display", 'inline');
            $("#barraDerecha").css("display", 'inline');
        }
    });

    /*CARGAR MAS PUBLICACIONES*/
    $window.scroll( function () {
        if ($(window).scrollTop() > $(document).height() - $(window).height()-2) {
            if(!scroll){
                $.ajax({
                    type: "GET",
                    url: '/muro/cargar',
                    success: function (data) {
                        if(data.length == 0)
                            return;
                        getComentarios(mostrarPublicaciones(data));
                    },
                    error: function (result) {
                        console.log(result);
                    }
                });
                scroll = true;
            }
            else
                scroll = false;
        }
    });
    if(posts.length > 0)
        getComentarios(mostrarPublicaciones(posts));

    controlNotificaciones();
});


function mostrarPublicaciones(publicaciones) {
    var aux = "";
    var postsId = [];
    for (let i = 0; i < publicaciones.length; i++) {
        var horaPubl = publicaciones[i].hora.substr(0, 16);
        var fechaActual = hoyFecha();
        var tiempo = calcularDiferencia(horaPubl, fechaActual);
        aux += '<article class="publicacion row" id="post_'+publicaciones[i].id+'">\n\
        <div class="col-xs-12 col-md-6">\n\
        <div class="cabeçeraPublicacion row">\n\
        <div class="col-xs-4 col-sm-2 col-md-2">\n\
        <a href="/contacto?contacto=' + publicaciones[i].usuario + '">\n\
        <img class="imgPerfilPublicacion" id="imgPerfilPublicacion' + publicaciones[i].id + '" src="" alt=""/>\n\
        </div>\n\
        <div class="col-xs-8 col-sm-10 col-md-10">\n\
        <p class="descripcionPublicacion row">\n\
        <a href="/contacto?contacto=' + publicaciones[i].usuario + '" class="perfilUsuarioPublicacion"><span class="nombreUsuarioPublicacion"><b>@' + publicaciones[i].usuario + '</span> </b></a>\n\
        </p>\n\
        <div class="row">\n\
        <p class="horaRealizacion col-xs-4">\n\
        <span class="esconderPetit"> Hace </span>' + tiempo + '\n\
        </p>\n\
        <p class="ubicacion col-xs-8">';
        if (publicaciones[i].ubicacion != null) {
            aux += '<span class="esconderPetit"> Desde </span> <sspan class = "lugarPublicacion"> ' + publicaciones[i].ubicacion + ' </span>';
        } else {
            aux += '<span class="esconderPetit"> Desde </span> <span class = "lugarPublicacion">  Barcelona </span>';
        }
        aux += '</p>\n\
        </div>\n\
        </div>\n\
        </div>\n\
        <div class="cuerpoPublicacion row">';
        if (publicaciones[i].contenido == " " || publicaciones[i].contenido == "" || publicaciones[i].contenido == null) {
            aux += '<div class="divTextoPublicacion col-md-12" style="display:none">';
        } else {
            aux += '<div class="divTextoPublicacion">';
        }
        aux += '<p class="textoPublicacion">' + publicaciones[i].contenido + '</p> </div>';
//compruevo si la publicacion contiene algun link
if (publicaciones[i].linkexterno == null) {
    aux += '<div class="divLinkPublicacion esconder" style="display:none"></div>';
} else {
    aux += '<div class="divLinkPublicacion">'+publicaciones[i].linkexterno + '</div>';
}
//compruevo si la publicacion contien imagen

if (publicaciones[i].multimedia == null || publicaciones[i].multimedia == "" || publicaciones[i].multimedia == " ") {
    aux += '<div class="divImagenPublicacion esconder" style="display:none">';
} else {
    aux += '<div class="divImagenPublicacion ">';
}
if (publicaciones[i].multimedia) {
    aux += '<a href="' + publicaciones[i].multimedia + '">\n\
    <img  src="' + publicaciones[i].multimedia + '" class="img-responsive imagenPublicacion">\n\
    </a>';
}
aux += '</div>\n\
</div>\n\
<div class="contenedorComentPub row">\n\
<div class="comentariosPublicacion">\n\
<div class="divScroll" id="commentPost_'+publicaciones[i].id+'">\n\
</div>';
        //nuevo comentario
        aux += '<div class="divNuevoComentarioPub1">\n\
        <div class="row">\n\
        <div class = "col-xs-7 col-sm-7 col-md-9" > \n\
        <textarea class = "comentarioNuevo" id = "comentario' + i + '" rows = "3" > </textarea>\n\
        </div>\n\
        <div class="col-xs-5 col-sm-5 col-md-3" style="padding-left:5px;">\n\
        <button  type="button" class="enviarComentario btn btn-default" onClick="setComentario(\'' + publicaciones[i].id + '\', comentario' + i + ')">Comentar </button>\n\
        </div>\n\
        </div>\n\
        </div>\n\
        </div>\n\
        </div>\n\
        </article>';
        postsId.push(publicaciones[i].id);
    }
    $("#divContenedorPublicacionesMuro").append(aux);
    return postsId;
}

function mostrarComentarios(comentarios) {
    var comentario = "";
    for (var comment of comentarios) {
        comentario += "<div class='divComentario row'><div class='col-xs-3'>\n\
        <a href='/contacto?contacto=" + comment.cuenta + "'/ class='perfilUsuarioComentario'>\n\
        <img class='imgPerfilComentario' src='" + comment.avatar + "' alt=''/>\n\
        </a>\n\
        </div>\n\
        <div class='col-xs-9'>\n\
        <p class='tituloComentario'>\n\
        <a href='/contacto?contacto=" + comment.cuenta + "'/ class='perfilUsuarioComentario'><span class='nombreUsuarioComentario'>";
        comentario += comment.cuenta + "</span>\n\
        </a>comento <span class='esconderPetit'>esta publicación</span></p>\n\
        <p class='comentario'>";
        comentario += comment.content + "</p>\n\
        </div>\n\
        </div>";
    }
    return comentario;
}

function addUser(alias) {
    $.ajax({
        type: "GET",
        url: '/perfil/addContacto',
        dataType: "html",
        data: {alias: alias},
        success: function (data) {
            if (data) {
                $("#" + alias).prev().remove();
                $("#" + alias).remove();
                if ($(".usuarioMuro").length < 1)
                    $("#barraIzquierda").remove();
            }
        },
        error: function (result) {
            console.log(result);
            alert("ErrorAñadirContacto:" + result);
        }
    });
}

function setComentario (idPost) {
  var element = $("#commentPost_"+idPost).next().find('.comentarioNuevo');
  var content = element.val().trim();
  if (!content){
    return;
}
$.ajax({
  type: "POST",
  url: '/muro/addComentario',
  dataType: "html",
  data: {postId: idPost, text: content},
  success: function (user) {
      if (user) {
        user = JSON.parse(user);
        var comentario = "<div class='divComentario row'><div class='col-xs-2'>\n\
        <a href='/contacto?contacto="+user.alias+"' class='perfilUsuarioComentario'>\n\
        <img class='imgPerfilComentario' src='"+user.avatar+"' alt=''/>\n\
        </a>\n\
        </div>\n\
        <div class='col-xs-10'>\n\
        <p class='tituloComentario'>\n\
        <a href='/contacto?contacto="+user.alias+"' class='perfilUsuarioComentario'><span class='nombreUsuarioComentario'>";
        comentario += user.alias + "</span>\n\
        </a>comento esta publicación</p>\n\
        <p class='comentario'>";
        comentario += content + "</p>\n\
        </div>\n\
        </div>";
        $("#commentPost_"+idPost).append(comentario);
        element.val('');
    }
},
error: function (result) {
  console.log(result);
  alert(result);
}
});
}



function calcularDiferencia(fechaIni, fechaFin) {
    var aux = "";
    var yyyy1 = parseInt(fechaIni.substr(0, 4));
    var yyyy2 = parseInt(fechaFin.substr(0, 4));
    var difyyyy = yyyy2 - yyyy1;
    var mm1 = parseInt(fechaIni.substr(5, 2));
    var mm2 = parseInt(fechaFin.substr(5, 2));
    var difmm = mm2 - mm1;
    var dd1 = parseInt(fechaIni.substr(8, 2));
    var dd2 = parseInt(fechaFin.substr(8, 2));
    var difdd = dd2 - dd1;
    var h1 = parseInt(fechaIni.substr(11, 2));
    var h2 = parseInt(fechaFin.substr(11, 2));
    var difh = h2 - h1;
    if (h1 > h2) {
        var difh = h1 - h2;
    } else {
        var difh = h2 - h1;
    }
    var m1 = parseInt(fechaIni.substr(14, 2));
    var m2 = parseInt(fechaFin.substr(14, 2));
    if (m1 > m2) {
        var difm = m1 - m2;
    } else {
        var difm = m2 - m1;
    }
    if (difyyyy != 0) {
        aux = "mas de" + difyyyy + " años";
    } else if (difmm != 0) {
        aux = "mas de " + difmm + " meses";
    } else if (difdd != 0) {
        if (difdd > 6) {
            aux = "mas de " + difdd + " dias";
        } else if (difdd == 1) {
            aux = difdd + " dia y " + difh + " h";
        } else {
            aux = difdd + " dias y " + difh + " h";
        }
    } else if (difh != 0) {
        aux = difh + " h y " + difm + " min";
    } else if (difm != 0) {
        if (difm < 2) {
            aux = "menos de " + difm + " min";
        } else {
            aux = difm + " m";
        }
    }
    return aux;
}


function hoyFecha() {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();
    var h = hoy.getHours();
    var m = hoy.getMinutes();
    dd = addZero(dd);
    mm = addZero(mm);
    h = addZero(h);
    m = addZero(m);
    return yyyy + '-' + mm + '-' + dd + " " + h + ":" + m;
}

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}
