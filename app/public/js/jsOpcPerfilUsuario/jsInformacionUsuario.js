/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
    var aux="";
   console.log(datosUsuario); 
    if(datosUsuario.nombre != null){
       aux+="<div style='display: flex;justify-content:  center;'>\n\
        <b><label class='titolInfUser'>\n\
            Nombre:\n\
        </label></b>\n\
        <p class='txtInfUser' style='margin-left: 10em;'>"+datosUsuario.nombre + "</p>\n\
        </div>";
   }

   if(datosUsuario.apellidos != null){
       aux+="<div style='display: flex;justify-content:  center;'>\n\
        <b><label class='titolInfUser'>\n\
            Apellidos:\n\
        </label></b>\n\
        <p class='txtInfUser' style='margin-left: 10em;'>"+datosUsuario.apellidos + "</p>\n\
        </div>";
   }

   if(datosUsuario.descripcion != null){
       aux+="<div style='display: flex;justify-content:  center;'>\n\
        <b><label class='titolInfUser'>\n\
            Descripcion personal:\n\
        </label></b>\n\
        <p class='txtInfUser' style='margin-left: 10em;'>"+datosUsuario.descripcion + "</p>\n\
        </div>";
   }

    if(datosUsuario.email != null){
       aux+="<div style='display: flex;justify-content:  center;'>\n\
        <b><label class='titolInfUser'>\n\
            Correo electrónico:\n\
        </label></b>\n\
        <p class='txtInfUser' style='margin-left: 10em;'>"+datosUsuario.email + "</p>\n\
        </div>";
    }
   if(datosUsuario.estadocivil != null){
       aux+="<div style='display: flex;justify-content:  center;'>\n\
        <b><label class='titolInfUser'>\n\
            Estado Civil:\n\
        </label></b>\n\
        <p class='txtInfUser' style='margin-left: 10em;'>"+datosUsuario.estadocivil + "</p>\n\
        </div>";
    }

    if(datosUsuario.fechanacimiento != null){
       aux+="<div style='display: flex;justify-content:  center;'>\n\
        <b><label class='titolInfUser'>\n\
            Fecha de nacimiento:\n\
        </label></b>\n\
        <p class='txtInfUser' style='margin-left: 10em;'>"+datosUsuario.fechanacimiento + "</p>\n\
        </div>";
    }
   $("#contenedorInformacionUsuario").html(aux);
});

