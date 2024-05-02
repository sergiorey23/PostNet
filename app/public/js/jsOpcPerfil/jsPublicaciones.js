$(document).ready(function () {
    $(".textoNuevaPublicacion").val("");
    $(".linkNuevaPublicacion").val("");
    var btnImgPulsada = false;
    var btnLinkPulsado = false;
    var btnLocationPulsado = false;
    var selectedFile = null;
    var dataURLbase64 = null;
    var youtube = false;
    $("#publicar").submit(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var text = $(".textoNuevaPublicacion").val().trim();
        var link = $(".linkNuevaPublicacion").val().trim();
        var location = $(".locationNuevaPublicacion").val().trim();
        if (text != "" || link != "") {
            if (link == '') {
                link = null;
            } else if (link.substring(0, 8) != 'https://') {
                link = 'https://' + link;
            }
            if(link) {
                if(link.includes('youtu')){
                    link = '<div class="embed-responsive embed-responsive-16by9"><iframe width="560" height="315" class="embed-responsive-item" src="'+link.replace("watch?v=", "embed/")+'" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>';
                }else{
                    link = '<a href="'+link+'"><p class="linkPublicacion">'+link+'</p></a>';
                }
            }

            if (selectedFile) {
                var reader = new FileReader();
                reader.onload = function () {
                    dataURLbase64 = reader.result;
                    publicarAjax(text, link, location);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                publicarAjax(text, link, location);
            }

        } else {
            alert("No puedes publicar sin nada.");
        }

    });

    function publicarAjax(text, link, location) {
        $.ajax({
            type: "POST",
            url: '/perfil/publicar',
            dataType: "html",
            data: {text: text, link: link, location: location, pic: dataURLbase64},
            success: function (data) {
                if (data) {
                    llamadaAjaxPerfil("publicaciones");
                    $(".textoNuevaPublicacion").val("");
                    $(".linkNuevaPublicacion").val("");
                    $(".imagenNuevaPublicacion").val("");
                    $(".locationNuevaPublicacion").val("");
                    dataURLbase64 = null;
                    selectedFile = false;
                }
            },
            error: function (result) {
                console.log(result);
                alert("Error:" +result);
            }
        });
    }
    const getLocation = () => {
        $.ajax({
            url: "https://geoip-db.com/jsonp",
            jsonpCallback: "callback",
            dataType: "jsonp",
            success: function( location ) {
                location = location.city+'('+location.country_name+')';
                $(".locationNuevaPublicacion").val(location);
            },
            error: function( result ){
                console.log(result);
                alert("Error:" +result);
            }
        });     
    }
    $("#opcImgNuevaPublic").on("click", function () {
        if (btnImgPulsada) {
            $("#divImagenNuevaPublicacion").addClass("esconderGran");
            btnImgPulsada = false;
        } else {
            $("#divImagenNuevaPublicacion").removeClass("esconderGran");
            btnImgPulsada = true;
        }
    });

    $("#opcLinkNuevaPublic").on("click", function () {
        if (btnLinkPulsado) {
            $("#divLinkNuevaPublicacion").addClass("esconderGran");
            btnLinkPulsado = false;
        } else {
            $("#divLinkNuevaPublicacion").removeClass("esconderGran");
            btnLinkPulsado = true;
        }
    });

    $("#opcLocationNuevaPublic").on("click", function () {
        if (btnLocationPulsado) {
            $("#divLocationNuevaPublicacion").addClass("esconderGran");
            btnLocationPulsado = false;
        } else {
            $("#divLocationNuevaPublicacion").removeClass("esconderGran");
            getLocation();
            btnLocationPulsado = true;
        }
    });

    $("#esconderNuevaPublicacion").on("click", function () {
        $(".nuevaPublicacion").addClass("esconder");//esconde el div para crear publicaciones
        $("#esconderNuevaPublicacion").addClass("esconder");//esconde el icono de las publicaciones
        $("#mostrarNuevaPublicacion").removeClass("esconder");//muestra el icono de las publicaciones
    });

    $("#mostrarNuevaPublicacion").on("click", function () {
        $(".nuevaPublicacion").removeClass("esconder"); //muestra el div para crear publicaciones
        $("#esconderNuevaPublicacion").removeClass("esconder");//muestra el icono de las publicaciones
        $("#mostrarNuevaPublicacion").addClass("esconder"); //esconde el icono de las publicaciones
    });


    //comprueva que haya algo sino le mete false (imagen)
    $(".imagenNuevaPublicacion").on('change', function (ev) {
        if (!(selectedFile = ev.target.files[0]))
            selectedFile = false;
    });
    $(document).on('scroll', function () {
        if ($('#opcPubli').hasClass('clickado')) {
            var num = 0;
            if ($(window).scrollTop() > $(document).height() - $(window).height()-2) {
                if(!scroll){
                    num = $('.publicacion').size();
                //obtengo la cantidad de publicaciones que hay
                $.ajax({
                    type: "GET",
                    url: '/perfil/publicaciones',
                    data: {cantidad: num},
                    success: function (data) {
                        mostrarPublicaciones(data);
                    },
                    error: function (result) {
                        console.log(result);
                    }
                });
                scroll = true;
            }else
            scroll = false;
        }
    }
});

});

function delPost(postId){
    $.ajax({
        type: "POST",
        url: '/perfil/delPost',
        data: {idPost: postId},
        success: function (data) {
            if (data) {
                $(".publicacion"+postId).remove();
            }
        },
        error: function (result) {
            console.log(result);
            alert("Error:" +result);
        }
    });
}

function delComment(commentId){
   $.ajax({
       type: "POST",
       url: '/perfil/delComment',
       data: {idPost: commentId},
       success: function (data) {
           if (data) {
               $(".comentario"+commentId).remove();
           }
       },
       error: function (result) {
           console.log(result);
           alert("Error:" +result);
       }
   });
}

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
            alert("Error"+result);
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