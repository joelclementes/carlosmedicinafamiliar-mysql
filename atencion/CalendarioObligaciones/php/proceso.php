<?php 
include_once("../../BackEnd/sfi.php");

$oSfi = new sfi();
$proceso = $_POST["proceso"];

switch ($proceso){
    case "CALENDARIO_SELECT":
        print $oSfi->calendario_select();
        break;
    case "GUARDA_NUEVO_EVENTO":
        $obligacion = $_POST["obligacion"];
        $fundamento = $_POST["fundamento"];
        $disposicion = $_POST["disposicion"];
        $inicia = $_POST['inicia'];
        $termina = $_POST['termina'];
        $color = $_POST["color"];
        print $oSfi->calendario_guardaNuevoEvento($obligacion,$fundamento,$disposicion,$inicia,$termina,$color);
        break;
    case "CAMBIA_FECHA_EVENTO":
        $id = $_POST['id'];
        $inicia = $_POST['inicia'];
        $termina = $_POST['termina'];
        print $oSfi->calendario_cambiaFechaEvento($id,$inicia,$termina);
        break;
    case "GUARDA_EVENTO_EDITADO":
        $id= $_POST["id"];
        $obligacion = $_POST["obligacion"];
        $fundamento = $_POST["fundamento"];
        $disposicion = $_POST["disposicion"];
        $inicia = $_POST['inicia'];
        $termina = $_POST['termina'];
        $color = $_POST["color"];
        $eliminar = $_POST["eliminar"];
        print $oSfi->calendario_guardaEventoEditado($id,$obligacion,$fundamento,$disposicion,$inicia,$termina,$color,$eliminar);
        break;
}
?>