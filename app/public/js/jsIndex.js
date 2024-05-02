$(document).ready(function () {
    /*
     * CREO LOS SELECT DE FECHA
     */
    for (let i = 01; i < 32; i++) {
        if (i < 10) {
            i = "0" + i;
        }
        aux = $("#dia").html() + "<option>" + i + "</option>";
        $("#dia").html(aux);
    }
    for (let i = 1; i < 13; i++) {
        if (i < 10) {
            i = "0" + i;
        }
        aux = $("#mes").html() + "<option>" + i + "</option>";
        $("#mes").html(aux);
    }
    for (let i = 1900; i < 2018; i++) {
        aux = $("#año").html() + "<option value='" + i + "'>" + i + "</option>";
        $("#año").html(aux);
    }
    $("#año option[value='2000']").attr("selected", true); //selecciono el año 2000 por defecto

    /*
     * Quita la classe error de los campos que la tengan
     */

    $("#inpNomIni").on("focus", function () {
        $("#inpNomIni").removeClass("error");
    });
    $("#inpPassIni").on("focus", function () {
        $("#inpPassIni").removeClass("error");
    });

    $("#aliasReg").on("focus", function () {
        $("#aliasReg").removeClass("error");
    });
    $("#nombreReg").on("focus", function () {
        $("#nombreReg").removeClass("error");
    });
    $("#apellidosReg").on("focus", function () {
        $("#apellidosReg").removeClass("error");
    });
    $("#contra1Reg").on("focus", function () {
        $("#contra1Reg").removeClass("error");
    });
    $("#contra2Reg").on("focus", function () {
        $("#contra2Reg").removeClass("error");
    });

    $("#año").on("focus", function () {
        $("#año").removeClass("error");
    });
    $("#mes").on("focus", function () {
        $("#mes").removeClass("error");
    });
    $("#dia").on("focus", function () {
        $("#dia").removeClass("error");
    });






});

//VALIDACION 1: Campos inicio vacios
function validaInicio() {
    var llenos = true;
    if ($("#inpNomIni").val() == "") {
        $("#inpNomIni").addClass("error");
        llenos = false;
    }
    if ($("#inpPassIni").val() == "") {
        $("#inpPassIni").addClass("error");
        llenos = false;
    }
    return llenos;
}


//VALIDACION 2: Campos registro vacios
function validaRegistro() {
    var enviar = true;
    var llenos = true;
    var numeros = false;
    var contraPeque = false;
    var menor = false;
    var caracterEstrany = false;
    var iguales = true;

    var errores = "Tienes los siguientes errores: \n"

    //CAMPOS VACIOS
    if ($("#aliasReg").val() == "") {
        $("#aliasReg").addClass("error");
        errores += "- El alias no ha sido introducido. \n";
        llenos = false;
    }
    if ($("#nombreReg").val() == "") {
        $("#nombreReg").addClass("error");
        errores += "- El nombre no ha sido introducido.\n";
        llenos = false;
    }
    if ($("#apellidosReg").val() == "") {
        $("#apellidosReg").addClass("error");
        errores += "- El apellido no ha sido introducido.\n";
        llenos = false;
    }
    if ($("#contra1Reg").val() == "") {
        $("#contra1Reg").addClass("error");
        errores += "- La contraseña no ha sido introducia. \n";
        llenos = false;
    }
    if ($("#contra2Reg").val() == "") {
        $("#contra2Reg").addClass("error");
        errores += "- La comprovacion de la contrasña no ha sido introducida. \n";
        llenos = false;
    }

    //NOMBRE Y APELLIDOS CON NUMEROS
    if (tieneNumeros($("#nombreReg").val())) {
        numeros = true;
        $("#nombreReg").addClass("error");
        errores += "- El nombre no puede contener numeros. \n";
    }
    if (tieneNumeros($("#apellidosReg").val())) {
        numeros = true;
        errores += "- El apellido no puede contener numeros. \n";
        $("#apellidosReg").addClass("error");
    }

    //CONTRASEÑA PEQUEÑA
    if (($("#contra1Reg").val().length < 6)) {
        contraPeque = true;
        $("#contra1Reg").addClass("error");
        errores += "- La contraseña debe tener mas de 6 caracters. \n";
    }
    if (($("#contra2Reg").val().length < 6)) {
        contraPeque = true;
        $("#contra2Reg").addClass("error");
    }
    //CONTRASEÑAS NO COINCIDENTES
    if (!($("#contra1Reg").val() == ($("#contra2Reg").val()))) {
        iguales = false;
        $("#contra1Reg").addClass("error");
        $("#contra2Reg").addClass("error");
        errores += "- Las contraseñas no coinciden. \n";
    }

    //MENOR DE 18 AÑOS
    //variables que contienen la fecha introducida

    var añoInt = $("#año").val();
    var mesInt = $("#mes").val();
    var diaInt = $("#dia").val();
    var fecha = diaInt + "/" + mesInt + "/" + añoInt;
    if (calcularEdad(fecha) < 18) {
        menor = true;
        errores += "- Debes cumplir 18 años.";
        $("#año").addClass("error");
        $("#dia").addClass("error");
        $("#mes").addClass("error");
    }


    //Inyeccion SQL
    if (validarCaracters($("#aliasReg").val())) {
        caracterEstrany = true;
        errores += "- El alias contiene caracters no validos \n";
        $("#aliasReg").addClass("error");
    }
    if (validarCaracters($("#nombreReg").val())) {
        caracterEstrany = true;
        errores += "- El nombre contiene caracters no validos \n";
        $("#nombreReg").addClass("error");
    }
    if (validarCaracters($("#apellidosReg").val())) {
        caracterEstrany = true;
        errores += "- El apellido contiene caracters no validos \n";
        $("#apellidosReg").addClass("error");
    }
    if (validarCaracters($("#contra1Reg").val())) {
        caracterEstrany = true; 
        errores += "- La contraseña contiene caracters no validos \n";
        $("#contra1Reg").addClass("error");
    }
    if (validarCaracters($("#contra2Reg").val())) {
        caracterEstrany = true;
        $("#contra2Reg").addClass("error");
    }

    if (llenos == false || numeros == true || contraPeque == true || iguales == false || menor == true || caracterEstrany == true) {
        alert(errores);
        enviar = false;
    }
    return enviar;
}

function tieneNumeros(val) {
    var num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (var i = 0; i < val.length; i++) {
        for (var e = 0; e < num.length; e++) {
            if (val[i] == num[e]) {
                return true;
            }
        }
    }
    return false;
}



function calcularEdad(fecha) {
    var hoy = new Date();
    var cumpleanos = new Date(fecha);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }

    return edad;
}




function validarCaracters(texto) {
    var valid = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz_ ";
    var tiene = false;
    var temp;
    for (var i = 0; i < texto.length; i++) {
        temp = "" + texto.substring(i, i + 1);
        if (valid.indexOf(temp) == "-1")
            tiene = true;
    }
    return tiene;
}