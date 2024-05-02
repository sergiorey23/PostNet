$(document).ready(function () {
    //quita el color gris al hacer focus
    //busca cada vez que se escribe una letra
    $("#buscador").on("keyup", function (e) {
        if (e.which != 13) {
            if ($("#buscador").css("background-color") == "rgba(75, 75, 75, 0.2)") {
                $("#buscador").css("background-color", "white");
            } else {
                if ($("#buscador").val() != "") {
                    buscar($("#buscador").val());
                }
            }
        }
    });

    //quita el color gris al hacer focus
    $("#buscador").on("focus", function (e) {
        $("#buscador").css("background-color", "white");

    });
    /*quita la informacion del buscar al quitar el foco, esta en un setTimeout para que de tiempo de pulsar en uno de los resultados*/
    $("#buscador").on("blur", function (e) {
        setTimeout(function () {
            $(".divResultadosBuscador").addClass("esconder");
            $(".containerResultadosBuscador").empty();
            $("#buscador").val("");

        }, 100);

    });
    //busco al pulsar en el boton del buscador
    $(".buscar").on("click", function () {
        if ($("#buscador").val() != "" && $("#buscador").val() != " ") {
            buscar($("#buscador").val());
        } else {
            $("#buscador").css("background-color", "rgba(75, 75, 75, 0.2)");
        }
    });
    //busca al pulsar intro
    $("#buscador").keypress(function (e) {
        if (e.which == 13) {
            if ($("#buscador").val() != "" && $("#buscador").val() != " ") {
                $(".divResultadosBuscador").removeClass("esconder");
                buscar($("#buscador").val());
                $(".containerResultadosBuscador").children("div")[0].click();

            } else {
                $("#buscador").css("background-color", "rgba(75, 75, 75, 0.2)");
            }
        }
    });
});
//Verifica que el usuario tiene nuevas notificaciones
function controlNotificaciones() {
    if (notiPeticiones != 0) {
        $("#notificacionContacto").html(notiPeticiones);
    }
    if (notiMensajes != 0) {
        $("#notificacionMensaje").html(notiMensajes);
    }
    $("#notificaciones").html(parseInt(notiPeticiones) + parseInt(notiMensajes));
}

function buscar(contenido) {
    $.ajax({
        type: "GET",
        url: '/muro/buscar',
        data: {buscar: contenido},
        success: function (data) {
            mostrarBuscados(data);
        }
    });

}

function mostrarBuscados(data) {
    var aux = "";
    for (var i = 0; i < data.length; i++) {
        aux += '<div class="row resultadoBuscador" onClick="mostrarPerfil(\'' + data[i].alias + '\')" id=\'usuarioBuscador' + data[i].alias + '\'>\n\
                        <div class="col-xs-4 col-md-4" style="padding-top:3px; padding-bottom:3px;">\n\
                            <img class="imagenPerfilUsuarioBuscador" width="60px" src="'+data[i].avatar+'"  alt=""/>\n\
                        </div>\n\
                        <div class="col-xs-8 col-md-8">\n\
                            <p class="aliasUsuarioBuscador"><b>@' + data[i].alias + '</b></p>\n\
                            <p class="nombreUsuarioBuscador">' + data[i].nombre + " " + data[i].apellidos + '</p>\n\
                        </div>\n\
                    </div>';



    }
    $(".containerResultadosBuscador").html(aux);
    $(".divResultadosBuscador").removeClass("esconder");
}
function mostrarPerfil(alias) {
    location.href = "contacto?contacto=" + alias;
}