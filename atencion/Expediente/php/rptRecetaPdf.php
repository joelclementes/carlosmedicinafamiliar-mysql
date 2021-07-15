<?php 
require('../../fpdf/html2pdf.php');
$pdf = new PDF_HTML();

//$pdf->AliasNbPages();
$pdf->SetFillColor(232,232,232);
$pdf->SetLinewidth(.6);
// $pdf->AddPage('Portrait','Letter');
$pdf->AddPage('Portrait',[140,210]);
$pdf->SetMargins(10,.5,1,.5);

$pdf->WriteHTML('<img src="../../img/EncabezadoReceta-01.jpg" alt="Encabezado receta" width="340%">');

$pdf->SetY(30); $pdf->SetX(9);
$pdf->SetFont('Times','',12);
$pdf->Cell(42,8,"Nombre: ".utf8_decode($_GET["nc"] . ".   " . $_GET["edad"]),0,1);
$pdf->Ln(2);

$pdf->SetFont('Times','',8);

$pdf->SetY(30); $pdf->SetX(105);
$pdf->Cell(42,8,"Fecha: ".$_GET["fco"],0,1);
$pdf->Ln(2);

$pdf->SetY(33); $pdf->SetX(105);
$pdf->Cell(25,8,"T.A:".$_GET["ta"],0,1);

$pdf->SetY(36); $pdf->SetX(105);
$pdf->Cell(20,8,"F.C:".$_GET["fc"],0,1);

$pdf->SetY(39); $pdf->SetX(105);
$pdf->Cell(25,8,"Temp:".$_GET["temp"],0,1);

$pdf->SetY(42); $pdf->SetX(105);
$pdf->Cell(25,8,"Peso:".$_GET["peso"],0,1);

$pdf->SetY(45); $pdf->SetX(105);
$pdf->Cell(25,8,"Talla:".$_GET["talla"],0,1);

$pdf->SetY(48); $pdf->SetX(105);
$pdf->Cell(25,8,"IMC:".$_GET["imc"],0,1);

$pdf->Ln(2);

$pdf->SetFont('Times','',12);
$pdf->SetY(50); $pdf->SetX(10);
$pdf->WriteHTML(utf8_decode($_GET["rp"]));

$pdf->SetY(180); $pdf->SetX(10);
$pdf->WriteHTML('<img src="../../img/PieDePaginaReceta-02.jpg" alt="Encabezado receta" width="340%">');

$pdf->Output();
?>