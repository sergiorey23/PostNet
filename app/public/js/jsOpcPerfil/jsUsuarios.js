function añadirUsuario(aliasContacto) {
    $.ajax({
        type: "GET",
        url: '/perfil/addContacto',
        data: {alias: aliasContacto},
        success: function (data) {
            if (data) {
                $("#RespuestaServidor").removeClass("esconder");
                $("#RespuestaServidor").html("Solicitud enviada");
                llamadaAjaxPerfil('usuarios');

            } else {
                $("#RespuestaServidor").removeClass("esconder");
                $("#RespuestaServidor").html("Error");
            }
            setTimeout(function () {
                $("#RespuestaServidor").addClass("esconder");
            }, 1500);
            $(".btnCancelarMensajeBD").click();
        },
        error: function (result) {
            $("#RespuestaServidor").html("Error");
            $(".btnCancelarMensajeBD").click();
            console.log(result);
        }
    });
    $("#opcRecomendaciones").click();
}

function cancelarPeticion(aliasContacto) {
    $.ajax({
        type: "GET",
        url: '/perfil/eliminarContacto',
        data: {alias: aliasContacto},
        success: function (data) {
            $("#RespuestaServidor").removeClass("esconder");
            $("#usuario" + aliasContacto).remove();
            if (data) {
                $("#RespuestaServidor").html("Contacto eliminado");
                llamadaAjaxPerfil('usuarios');

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
