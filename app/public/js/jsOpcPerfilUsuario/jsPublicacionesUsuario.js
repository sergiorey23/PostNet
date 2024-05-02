$(document).ready(function () {
    $(document).on('scroll', function () {
        if ($('#opcPubliUsuario').hasClass('clickado')) {
            var num = 0;
            if ($(window).height() + $(window).scrollTop() == $(document).height()) {
                num = $('.publicacion').size();
                //obtengo la cantidad de publicaciones que hay
                $.ajax({
                    type: "GET",
                    url: '/contacto/publicaciones',
                    data: {cantidad: num},
                    success: function (data) {
                        mostrarPublicaciones(data);
                    },
                    error: function (result) {
                        console.log(result);
                    }
                });
            }
        }
    });

});



function comentar(idPost, comentario) {
    var content = comentario.value.trim();
    if (!content) {
        return;
    }
    $.ajax({
        type: "POST",
        url: '/perfil/addComentario',
        dataType: "html",
        data: {postId: idPost, text: content},
        success: function (alias) {
            if (alias) {
                llamadaAjaxPerfil("publicaciones");
            }
        },
        error: function (result) {
            console.log(result);
            alert("Error" + result);
        }
    });
}


function fecha_actual() {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1; //hoy es 0!
    var yyyy = hoy.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    hoy = mm + '/' + dd + '/' + yyyy;
    return hoy;
}