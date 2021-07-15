<?php 
include_once("../../BackEnd/dcec.php");

$oSfi = new dcec();
$proceso = $_POST["proceso"];

switch ($proceso){
    case "USUARIO_SELECT":
        print $oSfi->usuario_select($_POST["datosLogin"]);
        break;
    case "VARIABLES_SESION":
        $usu = $_POST["usuario"];
        @session_start();
        $_SESSION["idUsuario"] = $usu["idUsuario"];
        $_SESSION["usuario"] = $usu["clave"];
        $_SESSION["nombreUsuario"] = $usu["nombreUsuario"];
        header("Location: ../../index.php?p=inicio");
        break;
}
?>