<?php 
include_once("../../BackEnd/dcec.php");

$oSfi = new dcec();
$metodo = $_POST["metodo"];

switch ($metodo){
    case "USUARIO_MENU":
        print $oSfi->usuario_menu($_POST["idUsuario"]);
        break;
}
?>