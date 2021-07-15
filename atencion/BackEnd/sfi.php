<?php
include_once 'procesosBD.php';

class jsonUsu{
	public $usuDatos="";
    public $usuPermisos="";
    public $opcDisponibles="";
}

class sfi{

    private $SERVER = "localhost";
    private $USER = "root";
    private $PWD = "pwd12345";
    private $DB = "SFI";
    
    public function usuario_select($datosLogin){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta = "SELECT * FROM admusuarios WHERE clave = '".$datosLogin['claveLogin']."'";
        return $ProcesosBD->registro($consulta);
    }

    public function usuario_menu($idUsuario){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta = "SELECT * FROM admmenu m LEFT JOIN admusuariomenu um ON m.idMenu = um.idMenu WHERE um.idUsuario = ".$idUsuario." order by m.orden";
        return $ProcesosBD->tabla($consulta);
    }

    public function usuarios_todos(){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta = "SELECT * FROM admusuarios";
        return $ProcesosBD->tabla($consulta);
    }

    public function usuario_select_datos($idUsuario){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        
        $consulta = "SELECT idUsuario, nombreUsuario, clave FROM admusuarios WHERE idUsuario = '".$idUsuario."'";
        $consultaPermisos = "SELECT m.tituloMenu, um.id, um.idUsuario, um.idMenu  FROM admusuariomenu um LEFT JOIN admmenu m ON um.idMenu = m.idMenu WHERE um.idUsuario = ".$idUsuario." ORDER BY m.orden";
        $consultaOpciones = "SELECT * FROM admmenu ORDER BY orden";

        $usu = $ProcesosBD->registro($consulta);
        $per = $ProcesosBD->tabla($consultaPermisos);
        $opc = $ProcesosBD->tabla($consultaOpciones);

        $jsonUsu = new jsonUsu();
        $jsonUsu->usuDatos = $usu;
        $jsonUsu->usuPermisos = $per;
        $jsonUsu->opcionesDisponibles = $opc;

        return json_encode($jsonUsu);
    }
    
    public function usuario_borra_opcion_menu($id){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta = "DELETE FROM admusuariomenu WHERE id = ".$id;
        return $ProcesosBD->ejecutaSentencia($consulta);
    }

    public function usuario_agrega_opcion_menu($idUsuario,$idMenu){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);

        // Evaluamos si ya existe esa opción para el usuario
        $consultaExistente = "SELECT * FROM admusuariomenu WHERE idUsuario = ".$idUsuario." AND idMenu = ".$idMenu;
        $existe = $ProcesosBD->existeRegistro($consultaExistente);
        if($existe == 0){
            $consulta = "INSERT INTO admusuariomenu (idUsuario,idMenu) VALUES (".$idUsuario.",".$idMenu.")";
            return $ProcesosBD->ejecutaSentencia($consulta);
        }
    }
    
    public function usuario_guarda($id,$nombre,$clave,$pwd,$esNuevo){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);      
        
        // Evaluamos si existe un registro con la misma clave
        if($esNuevo==1){
            $consultaExistente = "SELECT * FROM admusuarios WHERE clave = '".$clave."'".$id;
        } else {
            $consultaExistente = "SELECT * FROM admusuarios WHERE clave = '".$clave."' AND idUsuario <> ".$id;
        }
        $existeClave = $ProcesosBD->existeRegistro($consultaExistente);
        // if($existeClave == 1 && $esNuevo == 1){
        if($existeClave == 1){
            return "Ya existe un usuario con esta clave";
        }
        $pwd2 = md5($pwd);
        if($esNuevo==1){
            $consulta = "INSERT INTO admusuarios (nombreUsuario, clave, pwd) VALUES ('".$nombre."','".$clave."','".$pwd2."')";
        } else {
            if($pwd==""){
                $consulta = "UPDATE admusuarios SET nombreUsuario = '".$nombre."', clave = '".$clave."' WHERE idUsuario = ".$id;
            } else {
                $consulta = "UPDATE admusuarios SET nombreUsuario = '".$nombre."', clave = '".$clave."', pwd = '".$pwd2."' WHERE idUsuario = ".$id;
            }
        }

        return $ProcesosBD->ejecutaSentencia($consulta);
    }

    public function usuario_elimina($idUsuario){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);

        $eliminaOpciones = "DELETE FROM admusuariomenu WHERE idUsuario = ".$idUsuario;
        $ProcesosBD->ejecutaSentencia($eliminaOpciones);

        $eliminaUsuario = "DELETE FROM admusuarios WHERE idUsuario = ".$idUsuario;
        return $ProcesosBD->ejecutaSentencia($eliminaUsuario);
    }

    public function calendario_select(){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta = "SELECT id, obligacion as 'title', inicia as 'start', termina as 'end', color, fundamentoLegal, disposicion FROM calendarioDeObligaciones";
        // $consulta = "SELECT * FROM calendarioDeObligaciones";
        return $ProcesosBD->tabla($consulta);      
    }

    public function calendario_guardaNuevoEvento($obligacion,$fundamento,$disposicion,$inicia,$termina,$color){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta = "INSERT INTO calendarioDeObligaciones (obligacion, fundamentoLegal, disposicion, inicia, termina, color) VALUES ('".$obligacion."','".$fundamento."','".$disposicion."','".$inicia."','".$termina."','".$color."')";
        return $ProcesosBD->ejecutaSentencia($consulta);     
    }

    public function calendario_guardaEventoEditado($id,$obligacion,$fundamento,$disposicion,$inicia,$termina,$color,$eliminar){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta = "";
        if($eliminar=="true"){
            $consulta = "DELETE FROM calendarioDeObligaciones WHERE id = ".$id;
        } else {
            $consulta = "UPDATE calendarioDeObligaciones SET obligacion = '".$obligacion."',fundamentoLegal = '".$fundamento."', disposicion = '".$disposicion."', inicia = '".$inicia."', termina = '".$termina."', color = '".$color."' WHERE id = ".$id;
        }
        // echo $consulta;
        return $ProcesosBD->ejecutaSentencia($consulta);     
    }

    public function calendario_cambiaFechaEvento($id,$inicia,$termina){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta = "UPDATE calendarioDeObligaciones SET inicia='".$inicia."', termina = '".$termina."' WHERE id = ".$id;
        return $ProcesosBD->ejecutaSentencia($consulta);      
    }

    public function grupos_select(){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta = "SELECT DISTINCT grupo as 'grupo' FROM faq";
        return $ProcesosBD->tabla($consulta);     
    }

    public function preguntas_select(){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta = "SELECT * FROM faq";
        return $ProcesosBD->tabla($consulta);     
    }
}
?>