<?php 
include_once("../../BackEnd/dcec.php");

$oDcec = new dcec();
$proceso = $_POST["proceso"];

switch ($proceso){
    case "PACIENTES_TODOS":
        print $oDcec->pacientes_todos();
        break;
    case "PACIENTE_GUARDA":
        print $oDcec->paciente_guarda(
            $_POST["id"],
            $_POST["nombre"],
            $_POST["apPaterno"],
            $_POST["apMaterno"],
            $_POST["fechaNacimiento"],
            $_POST["sexo"],
            $_POST["alergias"],
            $_POST["antPatFam"],
            $_POST["antPatPer"],
            $_POST["celular"],
            $_POST["contacto"],
            $_POST["correo"],
            $_POST["esDiabetico"],
            $_POST["esHipertenso"],
            $_POST["esDislipidemico"],
            $_POST["religion"],
            $_POST["nuevo"]
        );
        break;
    case "PACIENTE_SELECT_DATOS":
        print $oDcec->paciente_select_datos($_POST["idDelPaciente"]);
        break;
    case "PACIENTE_ELIMINA":
        print $oDcec->paciente_elimina($_POST["idPaciente"]);
        break;
}
?>