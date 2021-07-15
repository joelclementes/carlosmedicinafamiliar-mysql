<?php
include_once("../../BackEnd/dcec.php");

$oDcec = new dcec();
$proceso = $_POST["proceso"];

switch ($proceso) {
    case "PACIENTE_SELECT_DATOS":
        print $oDcec->paciente_select_datos($_POST["idPaciente"]);
        break;
    case "PADECIMIENTOS_SELECT":
        print $oDcec->padecimientos_select();
        break;
    case "EXPEDIENTE_GUARDA_CONSULTA":
        print $oDcec->expediente_guarda_consulta(
            $_POST["motivoDeConsulta"],
            $_POST["fecha"],
            $_POST["dx"],
            $_POST["ta"],
            $_POST["fc"],
            $_POST["temp"],
            $_POST["glucosa"],
            $_POST["peso"],
            $_POST["talla"],
            $_POST["imc"],
            $_POST["tratamiento"],
            $_POST["idPaciente"],
            $_POST["idPadecimiento"],
            $_POST["estado"],
            $_POST["atendidoPor"],
            $_POST["nota"]
        );
        break;
    case "EXPEDIENTE_SELECT":
        print $oDcec->expediente_select($_POST["idPaciente"]);
        break;
    case "CONSULTA_SELECT":
        print $oDcec->consulta_select($_POST["idExpediente"]);
        break;
}
