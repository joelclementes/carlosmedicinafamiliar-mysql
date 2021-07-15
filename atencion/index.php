<?php
if (!isset($_SESSION)) {
  @session_start();
}
$usuario = $_SESSION["usuario"];
$idUsuario = $_SESSION["idUsuario"];
$nombreUsuario = $_SESSION["nombreUsuario"];
$p = $_GET["p"];
$pag = $p . "/index.html";

if ($p == "expediente") {
  $pag = "Expediente/index.html";
}
if ($p == "inicio") {
  $pag = "";
}
if ($p == "cambioContrasena") {
  $pag = "paginas/perfil.php";
}

?>
<!DOCTYPE html>
<html lang="es">

<head>
  <title>Atención médica - Carlos Espinoza Clemente</title>

  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <?php
  include("estilos.php");
  include("scripts.php");
  ?>

</head>

<body>

  <?php
  if ($usuario == "") {
    require_once("Login/index.html");
  } else { ?>
    <div id="txtUsuario" hidden><?php echo $usuario; ?></div>
    <div id="txtIdUsuario" hidden><?php echo $idUsuario; ?></div>
    <div id="txtNombreUsuario" hidden><?php echo $nombreUsuario; ?></div>
    <?php require("Menu/index.html"); ?>
    <section class="container-fluid" style="margin-bottom: 70px;  margin-top: 18px;">
      <?php
      @include($pag);
      ?>
    </section>

  <?php } ?>
  <footer>
  <div class="container">
  <div class="row">
    <div class="col-sm">
      <h6>Dr. Carlos A. Espinoza Clemente</h6>
    </div>
    <div class="col-sm">
      <h6>Cédula profesional: 3875880</h6>
    </div>
    <div class="col-sm">
      <h6>Cédula profesional especialidad: 11522043</h6>
    </div>
  </div>
</div>
  </footer>
</body>

</html>
