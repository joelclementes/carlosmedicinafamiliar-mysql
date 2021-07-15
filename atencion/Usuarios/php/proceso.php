<?php 
include_once("../../BackEnd/dcec.php");

$oDcec = new dcec();
$proceso = $_POST["proceso"];

switch ($proceso){
    case "USUARIOS_TODOS":
        print $oDcec->usuarios_todos();
        break;
    case "USUARIO_GUARDA":
        print $oDcec->usuario_guarda(
            $_POST["id"],
            $_POST["nombre"],
            $_POST["clave"],
            $_POST["pwd"],
            $_POST["nuevo"]
        );
        break;
    case "USUARIO_SELECT_DATOS":
        print $oDcec->usuario_select_datos($_POST["idDelUsuario"]);
        break;
    case "USUARIO_BORRA_OPCION_MENU":
        print $oDcec->usuario_borra_opcion_menu($_POST["idQueSeBorra"]);
        break;
    case "USUARIO_AGREGA_OPCION_MENU":
        print $oDcec->usuario_agrega_opcion_menu($_POST["idUsuario"],$_POST["idMenu"]);
        break;
    case "USUARIO_ELIMINA":
        print $oDcec->usuario_elimina($_POST["idUsuario"]);
        break;

}
?>