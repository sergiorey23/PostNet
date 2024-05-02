var datos = null;
var notificacionContacto = false;
$(document).ready(function () {

    /*PESTQAÑAS*/
    $(".opcPerf").on("click", function () {
        if (!($(this).hasClass('clickado'))) {
            $(".clickado").removeClass('clickado');
            $(this).addClass('clickado');
            esconderContent();
            var tab = $(".clickado").attr('name');

            window.history.pushState(null, "Titulo", "/perfil?" + tab); //para el historial
            if (tab == 'contactos' && notificacionContacto == true) {
                $(".notificacionContactos").addClass("esconder");
                $("#opcConta").css('background-color', 'beige');

            }
            if (tab != 'informacion') {
                llamadaAjaxPerfil($(this).attr('name'));
            }
        }
    });
    /*
     * Te situa en la opcion de perfil que hayas seleccionado desde el muro(accesos directos)
     */
    if (document.URL.split('?').pop() == "config") {
        $("#opcInfor").click();
        irAConf();
        config = true;
    } else if (document.URL.split('/').pop() == "contactos?muro") {
        $("#opcConta").click();
    } else if (document.URL.split('/').pop() == "informacion?muro") {
        $("#opcInfor").click();
    } else if (document.URL.split('/').pop() == "mensajes?muro") {
        $("#opcMensajes").click();

    } else if (document.URL.split('/').pop() == "usuarios?muro") {
        $("#opcRecomendaciones").click();
        /*
         * Nos permite al recargar el perfil que vaya a la pestaña que ya estamos
         */
    } else if (document.URL.split('?')[1] == 'publicaciones') {
        $("#opcPubli").click();

    } else if (document.URL.split('?')[1] == 'informacion') {
        $("#opcInfor").click();
    } else if (document.URL.split('?')[1] == 'mensajes') {
        $("#opcMensajes").click();

    } else if (document.URL.split('?')[1] == 'contactos') {
        $("#opcConta").click();

    } else if (document.URL.split('?')[1] == 'usuarios') {
        $("#opcRecomendaciones").click();
    } else if (document.URL.split('?')[1] == 'matcher') {
        $("#opcMatcher").click();

        /*
         * Si tienes notificaciones te mostrara la pestaña de color verde
         */
    } else if ($(".notificacionContactos").html() != undefined) {
        $("#opcConta").css('background-color', 'rgb(236, 181, 193)');
        var notificacionContacto = true;
        $("#opcPubli").click();
    } else if ($(".notificacionMensajes").html() != undefined) {
        $("#opcMensajes").click();
        $(".notificacionMensajes").addClass("esconder");
        $("#opcPubli").click();
    } else {
        $("#opcPubli").click();

    }
    controlNotificaciones();
});

function setPic(picName) {
    var file = null;
    if (picName == 'avatar') {
        file = document.querySelector(".inputSubirImagenPerfil").files[0];
    } else {
        file = document.querySelector(".inputSubirImagenPortada").files[0];
    }
    if (!file)
        return;
    var reader = new FileReader();
    reader.onload = function () {
        dataURLbase64 = reader.result;
        $.ajax({
            type: "POST",
            url: '/perfil/' + picName,
            data: {encodedPic: dataURLbase64},
            success: function (data) {
                if (data) {
                    if (picName == 'avatar')
                        $("#imagenPerfil").attr("src", dataURLbase64);
                    else
                        $("#fondoPortada").css("background-image", "url(" + dataURLbase64 + ")");
                }
            },
            error: function (result) {
                console.log(result);
            }
        });
    };
    reader.readAsDataURL(file);
}
function irAConf() {
    var zonaInfo = $("#configuracionCuenta").offset().top;
    $("html, body").animate({scrollTop: zonaInfo + "px"});
}
var config = false;
function llamadaAjaxPerfil(tab) {
    $.ajax({
        type: "GET",
        url: '/perfil/' + tab,
        success: function (data) {
            middlewareData(data, tab);
        },
        error: function (result) {
            console.log(result);
        }
    });
}

function middlewareData(data, tab) {

    switch (tab) {
        case "contactos":
            mostrarContactos(data);
            break;
        case "usuarios":
            $("#divContenedorUsuarios").empty(); //si entra con el scroll no lo vacia
            mostrarUsuarios(data);
            break;
        case "publicaciones":
            $("#divContenedorPublicaciones").empty(); //si entra con el scroll no lo vacia
            mostrarPublicaciones(data);
            break;
        case "mensajes":
            mostrarMensajes(data);
    }
}

function esconderContent() {
    $(".opcPerf").each(function (index) {
        if ($(this).hasClass("clickado")) {
            $("#tab" + index).removeClass("esconder");
        } else {
            $("#tab" + index).addClass("esconder");
        }
    });
}



function mostrarPublicaciones(publicaciones) {
    var aux = "";
    for (let i = 0; i < publicaciones.length; i++) {
        var horaPubl = publicaciones[i].hora.substr(0, 16);
        var fechaActual = hoyFecha();
        var tiempo = calcularDiferencia(horaPubl, fechaActual);
        aux += '<article class="publicacion publicacion'+publicaciones[i].id+'">\n\
            <div class="cabeçeraPublicacion row">\n\
            <div class="col-xs-3 col-md-2">\n\
            <img class="imgPerfilPublicacion" src="' + publicaciones[i].avatar + '" alt=""/>\n\
            </div>\n\
            <div class="col-xs-9 col-md-10">\n\
            <div class="row">\n\
            <p class="descripcionPublicacion ">\n\
            <a class="perfilUsuarioPublicacion"><span class="nombreUsuarioPublicacion">@' + publicaciones[i].usuario + '</span> </a>\n\
            </p>\n\
            </div>\n\
            <div class="row">\n\
            <p class="horaRealizacion col-xs-5">\n\
            <span class="esconderPetit"> Hace </span>' + tiempo + '\n\
            </p>\n\
            <span onclick="delPost(' + publicaciones[i].id + ')" class="glyphicon glyphicon-remove" style="position:  absolute;right: 8px;opacity:  0.5;cursor: pointer;"></span>\n\
            <p class="ubicacion col-xs-7">';
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
        if (publicaciones[i].contenido == null || publicaciones[i].contenido == "" || publicaciones[i].contenido == " ") {
            aux += '<div class="divTextoPublicacion" style="display:none">';
        } else {
            aux += '<div class="divTextoPublicacion">';
        }
        aux += '<p class="textoPublicacion">' + publicaciones[i].contenido + '</p> </div>';
//compruevo si la publicacion contiene algun link
        if (publicaciones[i].linkExterno == null) {
            aux += '<div class="divLinkPublicacion esconder"></div>';
        } else {
            aux += '<div class="divLinkPublicacion">'+publicaciones[i].linkExterno + '</div>';
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
<div class="divScroll">';
        if (publicaciones[i].coments) {
            for (let e = 0; e < publicaciones[i].coments.length; e++) {
                aux += '<div class="divComentario row comentario'+publicaciones[i].coments[e].id+'">\n\
        <div class="col-xs-2">\n\
        <a href="/contacto?contacto=' + publicaciones[i].coments[e].cuenta + '" class="perfilUsuarioComentario">\n\
        <img class="imgPerfilComentario" src="' + publicaciones[i].coments[e].avatar + '" alt=""/>\n\
        </a>\n\
        </div>\n\
        <div class="col-xs-10">\n\
        <p class="tituloComentario">\n\
        <a href="/contacto?contacto=' + publicaciones[i].coments[e].cuenta + '" class="perfilUsuarioComentario"><span class="nombreUsuarioComentario">' + publicaciones[i].coments[e].cuenta + '</span> </a>  comento esta publicación\n\
        </p>\n\
        <span onclick="delComment(' + publicaciones[i].coments[e].id + ')" class="glyphicon glyphicon-remove" style="position:absolute;opacity: 0.5; right:20px; top:5px cursor: pointer;"> </span>\n\
        <p class="comentario">' + publicaciones[i].coments[e].content + '</p>\n\
        </div>\n\
        </div>';
            }
        }
        aux += '</div>'; //cierro los comentarios

        //nuevo comentario
        aux += '<div class="divNuevoComentarioPub1">\n\
        <div class="row">\n\
        <div class = "col-xs-7 col-sm-7 col-md-9" > \n\
        <textarea class = "comentarioNuevo" id = "comentario' + i + '" rows = "3" > </textarea>\n\
        </div>\n\
        <div class="col-xs-5 col-sm-5 col-md-3" style="padding-left:5px;">\n\
        <button  type="button" class="enviarComentario btn btn-default" onClick="comentar(\'' + publicaciones[i].id + '\', comentario' + i + ')">Comentar </button>\n\
        </div>\n\
        </div>\n\
        </div>\n\
        </div>\n\
        </div>\n\
        </article>';
    }
    $("#divContenedorPublicaciones").html($("#divContenedorPublicaciones").html() + aux);
}

function mostrarMensajes(mensajes) {
    var aux = "";
    for (let i = 0; i < mensajes.length; i++) {
        aux += '<div class="col-xs-12 col-md-6 divMensajeContacto">\n\
        <div class="mensajeContacto" class="col-xs-12" onclick="mostrarChat(\'' + mensajes[i].alias + '\')">\n\
        <div class="col-xs-4">\n\
        <a href="contacto?contacto=' + mensajes[i].alias + '"><img class="imagenPerfilContactoMensaje img-thumbnail" src="' + mensajes[i].avatar + '"  alt=""/></a>\n\
        </div>\n\
        <div class="col-xs-8">\n\
      <div class="row aliasContactoMensaje">  <a href="contacto?contacto=' + mensajes[i].alias + '"><b>@' + mensajes[i].alias + '</b></a></div>\n\
        <div class="row textoUtlimoMensaje">\n\
        <p class="pUltMensaje">' + mensajes[i].mensaje + '</p>\n\
        </div>\n\
        </div>\n\
        </div>\n\
        </div>';
    }

    $("#divContenedorMensajes").html(aux);
}



function mostrarContactos(contactos) {
    $("#divContenedorContactos").empty();
    $("#peticionesContactos").empty();
    $("#tituloPeticiones").remove();
    var peticionesTitle = false;
    for (let i = 0; i < contactos.length; i++) {
        var contacto = ' <div class="row contacto ';
        if (!contactos[i].aceptado) {
            contacto += 'peticion ';
        }
        contacto += 'col-xs-12 col-md-5" id="contacto' + contactos[i].alias + '">\n\
        <div class="col-xs-5 col-sm-4 col-md-5 col-lg-4" >\n\
        <a href="contacto?contacto=' + contactos[i].alias + '"><img class="imgPerfilCon img-thumbnail" src="' + contactos[i].avatar + '" alt=""/></a>\n\
        </div>\n\
        <div class="col-xs-7 col-sm-8 col-md-7 col-lg-8">\n\
        <div class="infoContacto">\n\
        <a href="contacto?contacto=' + contactos[i].alias + '"><p class="aliasContacto"><b>@' + contactos[i].alias + '</b></p></a>\n\
        <p class="nombreContacto">' + contactos[i].nombre + " " + contactos[i].apellidos + '</p>\n\
        </div>\n\
        <div class="opcContacto">';
        if (contactos[i].aceptado) {
            contacto += '<button type="button" class="btn btn-default btnEnviarMensaje" onClick="mostrarMensaje(\'' + contactos[i].alias + '\',\'' + contactos[i].nombre + '\',\'' + contactos[i].apellidos + '\',\'' + contactos[i].avatar + '\')">Enviar mensaje</button>\n\
            <button type="button" class="btnEliminar" onclick="eliminarContacto(\'' + contactos[i].alias + '\')">\n\
            <p class="EliminarContacto" >Eliminar contacto</p>\n\
            </button>';
        } else {
            contacto += '<button type="button" class="btn btn-default btnEnviarMensaje" onClick="aceptarPeticion(\'' + contactos[i].alias + '\')">Aceptar petición</button>\n\
            <button type="button" class="btnEliminar" onclick="delContacto(\'' + contactos[i].alias + '\')">\n\
            <p class="EliminarContacto" >Rechazar petición</p>\n\
            </button>';
        }
        contacto += '</div>\n\
        </div>\n\
        </div>';
        if (contactos[i].aceptado) {
            $("#divContenedorContactos").append(contacto);
        } else {
            if (!peticionesTitle) {
                $("#peticionesContactos").before("<div class='divTituloMisContactos' id='tituloPeticiones'><h4 style='margin-left:40px;  font-size:25px;'>Peticiones</h4></div>");
                peticionesTitle = true;
            }

            $("#peticionesContactos").append(contacto);
        }
    }
}



function mostrarUsuarios(data) {
    var peticiones = data[0];
    var usuarios = data[1];
    var aux = "";
    for (let i = 0; i < peticiones.length; i++) {
        aux += '<div class="row contacto col-xs-12 col-md-5" id="usuario' + peticiones[i].alias + '">\n\
        <div class="col-xs-5 col-sm-4 col-md-5 col-lg-4" >\n\
        <a href="contacto?contacto=' + peticiones[i].alias + '"><img class="imgPerfilUsuario img-thumbnail" src="' + peticiones[i].avatar + '" alt=""/></a>\n\
        </div>\n\
        <div class="col-xs-7 col-sm-8 col-md-7 col-lg-8">\n\
        <div class="infoContacto">\n\
        <a href="contacto?contacto=' + peticiones[i].alias + '"><p class="aliasContacto"><b>@' + peticiones[i].alias + '</b></p></a>\n\
        <p class="nombreContacto">' + peticiones[i].nombre + " " + peticiones[i].apellidos + '</p>\n\
        </div>\n\
        <div class="opcContacto">\n\
        <button type="button" class="btn btn-default btnRechazarPeticion" onclick="cancelarPeticion(\'' + peticiones[i].alias + '\')">Cancelar petición</button>\n\
        </div>\n\
        </div>\n\
        </div>';
    }
    for (let i = 0; i < usuarios.length; i++) {
        aux += '<div class="row contacto col-xs-12 col-md-5" id="usuario' + usuarios[i].alias + '">\n\
        <div class="col-xs-5 col-sm-4 col-md-5 col-lg-4" >\n\
        <a href="contacto?contacto=' + usuarios[i].alias + '"><img class="imgPerfilUsuario img-thumbnail" src="' + usuarios[i].avatar + '" alt=""/></a>\n\
        </div>\n\
        <div class="col-xs-7 col-sm-8 col-md-7 col-lg-8">\n\
        <div class="infoContacto">\n\
        <a href="contacto?contacto=' + usuarios[i].alias + '"><p class="aliasContacto"><b>@' + usuarios[i].alias + '</b></p></a>\n\
        <p class="nombreContacto">' + usuarios[i].nombre + " " + usuarios[i].apellidos + '</p>\n\
        </div>\n\
        <div class="opcContacto">\n\
        <button type="button" id="' + usuarios[i].alias + '" class="btn btn-default btnAddContacto" onclick="añadirUsuario(\'' + usuarios[i].alias + '\')">Añadir contacto</button>\n\
        </div>\n\
        </div>\n\
        </div>';
    }
    $("#divContenedorUsuarios").html(aux);
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
        aux = "mas de" + difyyyy + "años";
    } else if (difmm != 0) {
        aux = "mas de " + difmm + "meses";
    } else if (difdd != 0) {
        if (difdd > 6) {
            aux = "mas de " + difdd + "dias";
        } else {
            aux = difdd + "dias y " + difh + "horas";
        }
    } else if (difh != 0) {
        aux = difh + " horas y " + difm + " minutos";
    } else if (difm != 0) {
        if (difm < 2) {
            aux = "menos de " + difm + " minuto";
        } else {
            aux = difm + " minutos";
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
