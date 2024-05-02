
function cancelarPeticion(aliasContacto) {
    $.ajax({
        type: "GET",
        url: '/perfil/eliminarContacto',
        data: {alias: aliasContacto},
        success: function (data) {
            if (data) {
                $("#RespuestaServidor").removeClass("esconder");
                $("#RespuestaServidor").html("Peticion cancelada");
                $("#contacto" + aliasContacto).find(".opcContacto").html('<button type="button" id="' + aliasContacto + '" class="btn btn-default btnAddContacto" onclick="añadirUsuario(\'' + aliasContacto + '\')">Añadir contacto</button>');
            } else
                $("#RespuestaServidor").html("Error");
            setTimeout(function () {
                $("#RespuestaServidor").addClass("esconder");
            }, 1500);
        },
        error: function (result) {
            $("#RespuestaServidor").html("Error");
            console.log(result);
        }
    });
}

function añadirUsuario(aliasContacto) {
    $.ajax({
        type: "GET",
        url: '/perfil/addContacto',
        data: {alias: aliasContacto},
        success: function (data) {
            if (data) {
                $("#RespuestaServidor").removeClass("esconder");
                $("#RespuestaServidor").html("Solicitud enviada");
                $("#contacto" + aliasContacto).find(".opcContacto").html('<button type="button" id="' + aliasContacto + '" class="btn btn-default bttCancelarPeticion" onclick="cancelarPeticion(\'' + aliasContacto + '\')">Cancelar petición</button>');
            } else {
                $("#RespuestaServidor").html("Error");
            }
            setTimeout(function () {
                $("#RespuestaServidor").addClass("esconder");
            }, 1500);
        },
        error: function (result) {
            console.log(result);
        }
    });
}

//BOTON ELIMINAR CONTACTO
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
                $("#RespuestaServidor").removeClass("esconder");
                $("#RespuestaServidor").html("Contacto eliminado");
                $("#contacto" + aliasContacto).find(".opcContacto").html('<button type="button" id="' + aliasContacto + '" class="btn btn-default btnAddContacto" onclick="añadirUsuario(\'' + aliasContacto + '\')">Añadir contacto</button>');
            } else
                $("#RespuestaServidor").html("Error");
            setTimeout(function () {
                $("#RespuestaServidor").addClass("esconder");
            }, 1500);
        },
        error: function (result) {
            $("#RespuestaServidor").html("Error");
            console.log(result);
        }
    });
}


