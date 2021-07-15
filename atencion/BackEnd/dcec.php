<?php
include_once 'procesosBD.php';

class jsonUsu{
	public $usuDatos="";
    public $usuPermisos="";
    public $opcDisponibles="";
}

class dcec{

    private $SERVER = "localhost";
    private $USER = "root";
    private $PWD = "pwd12345";
    private $DB = "dcec";
    
    /******************** MÉTODOS DE USUARIOS *********************/
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

    //*************** MÉTODOS DE PACIENTES ********************/
    public function pacientes_todos(){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        // $consulta = "SELECT * FROM paciente";
        $consulta = " SELECT p.idPaciente, p.nombre, p.apPaterno, p.apMaterno, count(e.idPaciente) AS consultas, date_format(p.fechaDeNacimiento,'%Y-%m-%d') AS fechaDeNacimiento, TIMESTAMPDIFF(YEAR, p.fechaDeNacimiento, CURDATE()) AS edad, p.sexo, IF(p.sexo='Masculino',220,226) AS constanteFcm, p.alergias, p.antPatFam, p.antPatPer, p.celular, p.contacto, p.correo, p.esDiabetico, p.esHipertenso, p.esDislipidemico
        FROM paciente p left join expediente e on p.idPaciente = e.idPaciente group by p.idPaciente order by p.apPaterno, p.apMaterno, p.nombre";
        return $ProcesosBD->tabla($consulta);
    }

    public function paciente_guarda($id,$nombre,$apPaterno,$apMaterno,$fechaNacimiento,$sexo,$alergias,$antPatFam,$antPatPer,$celular,$contacto,$correo,$esDiabetico,$esHipertenso,$esDislipidemico,$religion,$esNuevo){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);      

        if($esNuevo==1){
            $consulta = "INSERT INTO paciente (
                nombre, 
                apPaterno, 
                apMaterno, 
                fechaDeNacimiento, 
                sexo, 
                alergias, 
                antPatFam, 
                antPatPer, 
                celular, 
                contacto, 
                correo, 
                esDiabetico, 
                esHipertenso, 
                esDislipidemico, 
                religion ) VALUES ('".
                $nombre."','".
                $apPaterno."','".
                $apMaterno."','".
                $fechaNacimiento."','".
                $sexo."','".
                $alergias."','".
                $antPatFam."','".
                $antPatPer."','".
                $celular."','".
                $contacto."','".
                $correo."',".
                $esDiabetico.",".
                $esHipertenso.",".
                $esDislipidemico.",'".
                $religion."')";
        } else {
                $consulta = "UPDATE paciente SET 
                nombre = '".$nombre."', 
                apPaterno = '".$apPaterno."',
                apMaterno = '".$apMaterno."',
                fechaDeNacimiento = '".$fechaNacimiento."',
                sexo = '".$sexo."',
                alergias = '".$alergias."',
                antPatFam = '".$antPatFam."',
                antPatPer = '".$antPatPer."',
                celular = '".$celular."',
                contacto = '".$contacto."',
                correo = '".$correo."',
                esDiabetico = ".$esDiabetico.",
                esHipertenso = ".$esHipertenso.",
                esDislipidemico = ".$esDislipidemico.",
                religion = '".$religion."' WHERE idPaciente = ".$id;
                
        }
        return $ProcesosBD->ejecutaSentencia($consulta);
    }

    public function paciente_select_datos($idPaciente){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        
        $consulta = "SELECT *,IF(sexo='Masculino',220,226) AS constanteFcm FROM paciente WHERE idPaciente = '".$idPaciente."'";
        return $ProcesosBD->registro($consulta);
    }

    public function paciente_elimina($idPaciente){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta = "DELETE FROM paciente WHERE idPaciente = ".$idPaciente;
        return $ProcesosBD->ejecutaSentencia($consulta);
    }

    /****************************    MÉTODOS DE EXPEDIENTE ****************************/
    public function expediente_guarda_consulta($motivoDeConsulta,$fecha,$dx,$ta,$fc,$temp,$glucosa,$peso,$talla,$imc,$tratamiento,$idPaciente,$idPadecimiento,$estado,$atendidoPor,$nota){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta = "INSERT INTO expediente (
            motivoDeConsulta, 
            fecha, 
            dx, 
            ta, 
            fc, 
            temp, 
            glucosa, 
            peso, 
            talla, 
            imc, 
            tratamiento, 
            idPaciente, 
            idPadecimiento, 
            estado, 
            atendidoPor, 
            nota) VALUES (".
            "'".$motivoDeConsulta."',".
            "'".$fecha."',".
            "'".$dx."',".
            "'".$ta."',".
            "'".$fc."',".
            "'".$temp."',".
            "'".$glucosa."',".
            $peso.",".
            $talla.",".
            $imc.",".
            "'".$tratamiento."',".
            $idPaciente.",".
            $idPadecimiento.",".
            "'".$estado."',".
            "'".$atendidoPor."',".
            "'".$nota."')";
        return $ProcesosBD->ejecutaSentencia($consulta);
    }

    public function expediente_select($idPaciente){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta= "SELECT e.idExpediente, e.motivoDeConsulta, e.fecha AS fechaBD, date_format(e.fecha,' %d-%m-%Y') AS fecha, e.dx, e.ta, e.fc, e.temp, e.glucosa, e.peso, e.talla, e.imc, e.tratamiento, p.descripcion as padecimiento, e.estado, e.atendidoPor, e.nota 
        FROM expediente e LEFT JOIN catpadecimientos p on e.idPadecimiento = p.idPadecimiento WHERE e.idPaciente = ".$idPaciente." ORDER BY e.fecha DESC;";
        return $ProcesosBD->tabla($consulta);
    }

    public function consulta_select($idExpediente){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta= "SELECT 
        e.idExpediente,
        e.motivoDeConsulta,
        date_format(e.fecha,'%d/%m/%Y ') as fecha,
        date_format(e.fecha,'%H:%i ') as hora,
        convert(e.dx,char(2000)) as dx,
        e.ta,
        e.fc,
        e.temp,
        e.peso,
        e.talla,
        e.imc,
        e.glucosa,
        e.tratamiento,
        e.idPaciente,
        e.idPadecimiento,
        e.estado, 
        e.atendidoPor, 
        p.fechaDeNacimiento,
        concat(p.nombre,' ',p.apPaterno,' ',p.apMaterno) as nombreCompleto,
        e.nota
    FROM 
        expediente e LEFT JOIN paciente p on e.idPaciente = p.idPaciente 
    WHERE 
        e.idExpediente = ".$idExpediente;
        // echo $consulta;
        return $ProcesosBD->registro($consulta);
    }

    /**************************** MÉTODOS DE PADECIMIENTOS ****************************/
    public function padecimientos_select(){
        $ProcesosBD = new ProcesosBD($this->SERVER,$this->USER,$this->PWD,$this->DB);
        $consulta = "SELECT idPadecimiento, descripcion FROM catpadecimientos";
        return $ProcesosBD->tabla($consulta);      
    }

    /**************************** MÉTODOS DE CALENDARIO ****************************/
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
}
