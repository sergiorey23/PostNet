$(document).ready(function () {
    var mensaje;

    $(".enviar").click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var idElegido = $(this).attr('id').split('_')[1];
        var idElegidoenviar = idElegido;
        var valorNuevo = null;
        if (idElegido == 'fechanacimiento') {
            var selects = $("#divFechaNacimientoAntiguo").children();
            valorNuevo = selects[2].value + '/' + selects[1].value + '/' + selects[0].value;
        } else if (idElegido == 'estadocivil') {
            var valorNuevo = ($(".selectEstadoCivil").val());
            var valor = valorNuevo;
        } else if (idElegido == 'idioma') {
            var valorNuevo = ($(".selectIdioma").val());
            var valor = valorNuevo;
        } else if (idElegido == 'interes') {
            var valorNuevo = ($(".selectInteres").val());
            idElegidoenviar = "intereses";
            var valor = valorNuevo;
        } else if (idElegido == 'objetivos') {
            var valorNuevo = ($(".selectFinalidad").val());
            var valor = valorNuevo;

        } else if (idElegido == 'sexo') {
            if ($("#chHombreSexo").prop('checked')) {
                valorNuevo = "true";
            } else if ($("#chMujerSexo").prop('checked')) {
                valorNuevo = "false";
            } else {
                valorNuevo = null;
            }
        } else if (idElegido == 'GustosElegidos') {
            var idElegidoenviar = "gustos";
            $("#listaGustosElegidosMatch").val();
            var valorNuevo = [];
            for (let i = 0; i < $("#listaGustosElegidosMatch").children().length; i++) {
                valorNuevo.push($("#listaGustosElegidosMatch").children()[i].value);
            }
            valorNuevo.unshift("");
        } else {
            if (idElegido == "alias2") {
                var nuevo = $("#input" + idElegido + "Nuevo");
            } else {
                var nuevo = $("#input" + idElegido + "Nuevo");

            }
            var valorNuevo = nuevo.val();
            if (valorNuevo == '') {
                return;
            }
        }
        if (!valorNuevo) {
            return;
        }
        if (idElegido == "alias2") {
            idElegidoenviar = "alias";
        }
        $.ajax({
            type: "POST",
            url: '/perfil/update',
            data: {id: idElegidoenviar, value: valorNuevo},
            success: function (data) {
                if (data) {
                    if (idElegido == "alias2") {
                        $("#input" + idElegido + "Antiguo2").val(valorNuevo);
                    }
                    $("#input" + idElegido + "Antiguo").val(valorNuevo);

                    if (((idElegido) == "alias") || ((idElegido) == "alias2") || ((idElegido) == "nombre") || ((idElegido) == "apellidos")) {
                        location.reload();
                    }
                } else {
                    alert(false);
                }
            }
        });
    });



    /*Opciones info, te mueve hasta la seccion elegida*/
    $(".opcionInformacion").on("click", function () {
        var idbtn = "";
        idbtn += this.id;
        var btnElegido = idbtn.split('_', idbtn.length)[1];
        var zonaInfo = $("#" + btnElegido).offset().top;
        $("html, body").animate({scrollTop: zonaInfo + "px"});
    });


    /*EVENTO PULSAR BOTON EDITAR O BOTON ENVIAR DE LOS INPUT Y TEXTaREA*/

    $(".btnEditarInput").on("click", function () {
        var idbtn = "";
        idbtn += this.id;
        var posRow = idbtn.split('_', idbtn.length)[1];
        if (posRow == "Alias2") {
            $("#div" + posRow + "Antiguo").addClass("esconder");
            $("#divBtnEditar" + posRow).addClass("esconder");
            $("#div" + posRow + "Nuevo").removeClass("esconder");
            $("#divBtnEnviar" + posRow).removeClass("esconder");
        } else {
            $("#div" + posRow + "Antiguo").addClass("esconder");
            $("#divBtnEditar" + posRow).addClass("esconder");
            $("#div" + posRow + "Nuevo").removeClass("esconder");
            $("#divBtnEnviar" + posRow).removeClass("esconder");
        }
    });
    $(".btnEnviarInput").on("click", function () {
        var idbtn = "";
        idbtn += this.id;
        var posRow = idbtn.split('_', idbtn.length)[1];
        if (posRow == "Alias2") {
            $("#div" + posRow + "Antiguo").removeClass("esconder");
            $("#divBtnEditar" + posRow).removeClass("esconder");
            $("#div" + posRow + "Nuevo").addClass("esconder");
            $("#divBtnEnviar" + posRow).addClass("esconder");
        } else {
            $("#div" + posRow + "Antiguo").removeClass("esconder");
            $("#divBtnEditar" + posRow).removeClass("esconder");
            $("#div" + posRow + "Nuevo").addClass("esconder");
            $("#divBtnEnviar" + posRow).addClass("esconder");
        }
    });
    /*
     * TEXTAREA
     */
    $(".btnEditarTextArea").on("click", function () {
        var idbtn = "";
        idbtn += this.id;
        var posRow = idbtn.split('_', idbtn.length)[1];
        $("#div" + posRow + "Antiguo").addClass("esconder");
        $("#divBtnEditar" + posRow).addClass("esconder");
        $("#div" + posRow + "Nuevo").removeClass("esconder");
        $("#divBtnEnviar" + posRow).removeClass("esconder");
    });
    $(".btnEnviarTextArea").on("click", function () {
        var idbtn = "";
        idbtn += this.id;
        var posRow = idbtn.split('_', idbtn.length)[1];
        $("#div" + posRow + "Antiguo").removeClass("esconder");
        $("#divBtnEditar" + posRow).removeClass("esconder");
        $("#div" + posRow + "Nuevo").addClass("esconder");
        $("#divBtnEnviar" + posRow).addClass("esconder");
    });



    /*EVENTO PULSAR BOTON EDITAR O BOTON ENVIAR DE LOS select*/

    $(".btnEditarSelect").on("click", function () {
        var idbtn = "";
        idbtn += this.id;
        var selectElegido = idbtn.split('_', idbtn.length)[1];
        $(".select" + selectElegido).attr("disabled", false);
        $("#divBtnEditar" + selectElegido).addClass("esconder");
        $("#divBtnEnviar" + selectElegido).removeClass("esconder");
    });
    $(".btnEnviarSelect").on("click", function () {
        var idbtn = "";
        idbtn += this.id;
        var selectElegido = idbtn.split('_', idbtn.length)[1];

        $(".select" + selectElegido).attr("disabled", true);

        $("#divBtnEditar" + selectElegido).removeClass("esconder");
        $("#divBtnEnviar" + selectElegido).addClass("esconder");

    });

    /*
     * SELECT GUSTOS
     */
    $(".optionGustosMatch").on("dblclick", function (e) {
        var auxi;
        $(this).remove();
        auxi += $("#listaGustosElegidosMatch").html() + "<option class='optionGustosElegidosMatch'>" + ($(this).val()) + "</option>";
        $("#listaGustosElegidosMatch").html(auxi);
        $("#listaGustosElegidosMatch").pop(); //evito que se repitan
        e.preventDefault();
        e.stopPropagation();
    });


    $("#acceptarGustosElegidos").on("click", function () {
        $("#listaGustosElegidosMatch").prop("disabled", true);
    });
    $("#deshacerGustosElegidos").on("click", function () {
        $("#listaGustosElegidosMatch").prop("disabled", false);
        $("#listaGustosElegidosMatch").html("");
        $(".optionGustosMatch").attr("disabled", false);
        $(".optionGustosMatch").css('color', 'rgb(0, 0, 0)');
        auxi = "";
    });

    $("#acceptarObjetivosElegidos").on("click", function () {
        $("#listaObjetivosElegidosMatch").prop("disabled", true);
    });
    $("#deshacerObjetivosElegidos").on("click", function () {
        $("#listaObjetivosElegidosMatch").prop("disabled", false);
        $("#listaObjetivosElegidosMatch").html("");
    });




    /*SOLO PERMITE SELECCIONAR UN CHECKBOX*/
    $(".chEst").on("click", function () {
        $(".chEst").prop('checked', false);
        $(this).prop('checked', true);
    });
    $(".chSex").on("click", function () {
        $(".chSex").prop('checked', false);
        $(this).prop('checked', true);
    });
    $(".chInt").on("click", function () {
        $(".chInt").prop('checked', false);
        $(this).prop('checked', true);
    });






    /*Movimiento aside con el scroll*/
    $(document).scroll(function () {
        if ($(document).scrollTop() > 300) {
// Movemos la posición top del css segun el scroll
            $("#opcionesInformacion").css("top", $(document).scrollTop() - 290);
        } else {
            // Movemos a la posición inicial
            $("#opcionesInformacion").css("top", 10);
        }
    });
    crearFecha();

    controlarGustos();
    controlarSelects();
    controlarSexo();

    /*control per eliminar conta*/
    $("#btnEliminarCuenta").on('click', function (evt) {
        if (borrar == 2) {
            borrar = 0
        } else if (borrar == 1) {
            borrar++;
        }
        assegurar(evt);
    });





});
//hi ha una doble execcucio del event, he agut de crear una var global que controles l'error
var borrar = 0;
function assegurar(evt) {
    if (borrar == 0) {
        var respuesta = confirm("Quieres borrar tu cuenta?");
        if (respuesta == false) {
            alert("cancelado");
            evt.preventDefault();
        }
        borrar++;
    }
}

function controlarSelects() {
    var elegido = $(".selectEstadoCivil").attr("value");
    for (let i = 0; i < $(".selectEstadoCivil").children().length; i++) {
        if ($(".selectEstadoCivil").children()[i].value == elegido) {
            $(".optionEstadoCivil")[i].selected = true;
        }
    }
    var elegido = $(".selectIdioma").attr("value");
    for (let i = 0; i < $(".selectIdioma").children().length; i++) {
        if ($(".selectIdioma").children()[i].value == elegido) {
            $(".optionIdioma")[i].selected = true;
        }
    }
    var elegido = $(".selectInteres").attr("value");
    for (let i = 0; i < $(".selectInteres").children().length; i++) {
        if ($(".selectInteres").children()[i].value == elegido) {
            $(".optionInteres")[i].selected = true;
        }
    }
    var elegido = $(".selectFinalidad").attr("value");
    for (let i = 0; i < $(".selectFinalidad").children().length; i++) {
        if ($(".selectFinalidad").children()[i].value == elegido) {
            $(".optionFinalidad")[i].selected = true;
        }
    }
}

function controlarSexo() {
    if ($("#divSexoAntiguo").attr("value") == 'true') {
        $("#chHombreSexo").click();

    } else {
        $("#chMujerSexo").click();

    }
}

function controlarGustos() {
    if ($("#listaGustosElegidosMatch").children().length != 0) {
        for (var i = 0; i < $("#listaGustosMatch").children("option").length; i++) {
            for (var e = 0; e < $("#listaGustosElegidosMatch").children("option").length; e++) {
                if ($("#listaGustosMatch").children("option")[i].value == $("#listaGustosElegidosMatch").children("option")[e].value) {
                    $("#listaGustosMatch").children("option")[i].remove();
                    break;
                }
            }
        }
        if ($("#listaGustosElegidosMatch").children("option")[0].value == "") {
            $("#listaGustosElegidosMatch").children("option")[0].remove();
        }
    }
}
function crearFecha() {
    var aux = "";
    /*
     * CREO LOS SELECT DE FECHA
     */
    for (let i = 01; i < 32; i++) {

        if (i < 10) {
            i = "0" + i;
        }
        aux += ("<option>" + i + "</option>");
    }
    $("#dia").html(aux);
    $("#dia").val($("#dia").attr('name'));
    aux = "";
    for (let i = 1; i < 13; i++) {
        if (i < 10) {
            i = "0" + i;
        }
        aux += ("<option>" + i + "</option>");
    }
    $("#mes").html(aux);
    $("#mes").val($("#mes").attr('name'));
    aux = "";

    for (let i = 1900; i < 2018; i++) {
        aux += ("<option value='" + i + "'>" + i + "</option>");
    }
    $("#año").html(aux);
    $("#año").val($("#año").attr('name'));
    aux = "";
}
