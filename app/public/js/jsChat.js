$(document).ready(function () {
    var socket = io();
    var result = null;
    var myMsg = false;
    $("#inputNuevoMensaje").on("keyup", function (e) {
        if (e.which == 13) {
            $("#btnEnviarMensaje").click();
        }
    });
    $("#btnEnviarMensaje").on("click", function () {
        var msg = $("#inputNuevoMensaje").val().trim();
        if (msg) {
            socket.emit('message', {
                contact: contacto.alias,
                message: msg
            });
            $('#inputNuevoMensaje').val('');
        } else {
            return;
        }
    });
    socket.on('message', function (data) {
        var hora = new Date();
        var h = hora.getHours();
        var m = hora.getMinutes();
        hora = addZero(h) + ":" + addZero(m);
        if(data.username == userAlias)
            result = "<div class='row divMensajeUsuario'><div class='col-xs-12 form-control mensaje mensajeUsuario'><p><b>" + data.message + "</b> <span '/style=font-size:10px;/'>" + hora + " </span></p></div></div>";
        else
            result = "<div class='row divMensajeContacto'><div class='col-xs-12 form-control mensaje mensajeContacto'><p><b>" + data.message + "</b> <span '/style=font-size:10px;/'>" + hora + " </span></p></div></div>";
        $("#mensajesAntiguos > div").append(result);
        $("#mensajesAntiguos").animate({scrollTop: $('#mensajesAntiguos')[0].scrollHeight}, 1000);
    });

    socket.on('disconnect', () => {
        log('you have been disconnected');
    });
    //scroll si llegas arriba
    $("#mensajesAntiguos").on("scroll", function () {
        if ($("#mensajesAntiguos").scrollTop() == 0) {
            var numMensajes = $("#mensajesAntiguos").children()[0].childElementCount;
            $.ajax({
                type: "GET",
                url: '/chat/cargarMas',
                data: {contacto: contacto.alias, num: numMensajes},
                success: function (data) {
                    mostrarMensajes(data.mensajes);
                },
                error: function (result) {
                    console.log(result);
                }
            });
        }
    });
    // Tell the server your username
    socket.emit('add user', userAlias);

    controlNotificaciones();
});

function mostrarMensajes(mensajes) {
    var aux = "";
    for (var i = 0; i < mensajes.length; i++) {
        console.log(calcularDiferencia(mensajes[i].fecha.substr(0, 10), hoyFecha()));
        var hora = mensajes[i].fecha.substr(11, 5);
        aux += "<div class='row divMensajeUsuario'><div class='col-xs-12 form-control mensaje'><p><b>" + mensajes[i].mensaje + "</b> <span '/style=font-size:10px;/'>" + hora + " </span></p></div></div>";
    }
    $("#mensajesAntiguos > div").html(aux + $("#mensajesAntiguos > div").html());
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
    if (difyyyy > 0) {
        aux = yyyy1 + "-" + mm1 + "-" + dd1;
    } else if (difmm > 0) {
        aux = mm1 + "-" + dd1;
    } else if (difdd > 0) {
        aux = dd1;
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
