$(document).ready(function () {
    //Llama al metodo que añade el mensaje a la BD
    $(".btnEnviarMensajeBD").click(function (e) {
        addMensaje(e);
    });
    //Cancela el div del mensaje escondiendolo(y vaciandolo)
    $(".btnCancelarMensajeBD").click(function () {
        esconderMensaje();
        $("#ContenidoMensaje").val("");

    });
});

//Abre el div para escribir el mensaje
function mostrarMensaje(alias, nombre, apellidos, avatar) {
    $(".nombreCompletoContactoEnviarMensaje").html("<b>" + nombre + " " + apellidos + "</b>");
    $(".imgPerfilMensaje").attr("src", avatar);
    $(".aliasContactoEnviarMensaje").html(alias);
    $(".enviarMensaje").removeClass("esconder");
    $(".divMensaje").removeClass("esconder");
    $(".enviarMensaje").css("display", "flex");
    $("body").css("overflow-y", "hidden");
    $("#ContenidoMensaje").focus();
}

//llamada ajax que añade el mensaje a la BD
function addMensaje() {
    //var nombreContacto=$(".nombreContactoEnviarMensaje").html();
    var aliasContacto = $(".aliasContactoEnviarMensaje").html();
    var contenidoMensaje = $("#ContenidoMensaje").val();
    if (contenidoMensaje == null || contenidoMensaje == "" || contenidoMensaje == " ") {
        alert("El mensaje no puede estar vacio");
    } else {
        $.ajax({
            type: "POST",
            url: '/perfil/enviarMensaje',
            data: {alias: aliasContacto, contenido: contenidoMensaje},
            success: function (data) {
                $("#RespuestaServidor").removeClass("esconder");
                $("#RespuestaServidor").html("Mensaje enviado");
                setTimeout(function () {
                    $("#RespuestaServidor").addClass("esconder");
                }, 1000);
                $(".btnCancelarMensajeBD").click();
            }
        });
    }
}

//Esconde el div donde se escribe el mensaje
function esconderMensaje() {
    $(".enviarMensaje").addClass("esconder");
    $(".enviarMensaje").css("display", "none");
    $("body").css("overflow-y", "visible");
}




function eliminarContacto(alias) {
    var r = confirm("Estas seguro que quieres eliminar " + alias);
    if (r) {
        delContacto(alias);
    }

}


function delContacto(aliasContacto) {
    $.ajax({
        type: "GET",
        url: '/perfil/eliminarContacto',
        data: {alias: aliasContacto},
        success: function (data) {
            $("#RespuestaServidor").removeClass("esconder");
            $("#contacto" + aliasContacto).remove();
            if (data) {
                if ($("#peticionesContactos").children().length < 1) {
                    $("#tituloPeticiones").remove();
                }
                $("#RespuestaServidor").html("Contacto eliminado");
            } else
                $("#RespuestaServidor").html("Error");
            $(".btnCancelarMensajeBD").click();
        },
        error: function (result) {
            $("#RespuestaServidor").html("Error");
            $(".btnCancelarMensajeBD").click();
            console.log(result);
        }
    });
}

function aceptarPeticion(aliasContacto) {
    $.ajax({
        type: "GET",
        url: '/perfil/aceptarPeticion',
        data: {alias: aliasContacto},
        success: function (data) {
            if (data) {
                $("#opcConta").removeClass('clickado');
                $("#opcConta").click();
                $("#RespuestaServidor").removeClass("esconder");
                $("#RespuestaServidor").html("Petición aceptada");
                setTimeout(function () {
                    $("#RespuestaServidor").addClass("esconder");
                }, 1500);
            } else
                $("#RespuestaServidor").html("Error");
            $(".btnCancelarMensajeBD").click();
        },
        error: function (result) {
            $("#RespuestaServidor").html("Error");
            console.log(result);
        }
    });
}


