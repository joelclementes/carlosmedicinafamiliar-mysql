class Pacientes {
    constructor(reset = false) {
        this.urlProceso = "Pacientes/php/proceso.php";
        if (reset) {
            // En cada módulo hay que usar new Menu().fnCreaMenu() porque si no, desaparecen las opciones
            new Menu().fnCreaMenu();

            // Eliminar items de localStorage
            localStorage.removeItem("idPacienteExpediente");
            localStorage.removeItem("constanteFcmPaciente");
            localStorage.removeItem("edadPaciente");


            // Se muestran todos los pacientes al cargar la página
            new Pacientes().fnPacientesConsultarTodos();

            // Funciones de los botones cuando se hace clic en ellos.
            
            $("#btnAgregar").on("click",function(){ localStorage.removeItem("idPacienteModificado");  })

            $("#btnGuardar").on("click",function(){  new Pacientes().fnPacienteGuarda();})
            $("#btnGuardarEd").on("click",function(){  new Pacientes().fnPacienteGuardaEd();})


            $("#btnCancelar").on("click",function(){ localStorage.removeItem("idPacienteModificado"); new Pacientes().fnPacienteLimpiaDatos();});
            $("#btnCancelarEd").on("click",function(){ localStorage.removeItem("idPacienteModificado"); new Pacientes().fnPacienteLimpiaDatosEd();});
            $("#btnEliminarUsuario").on("click",function(){ new Pacientes().fnUsuarioElimina(); });

            $("#tablaPacientes").tablesorter();

        }
    }

    fnPacientesConsultarTodos(){
        let parametros = {
            proceso : "PACIENTES_TODOS"
        }
        $.ajax({
            data : parametros,
            url : this.urlProceso,
            type : "POST",
            success: function(pacientes){
                new Pacientes().fnPacientesConstruyeTabla(pacientes);
            }
        })
    }

    fnPacientesConstruyeTabla(pacientes){
        pacientes = JSON.parse(pacientes);
        let listaPacientes = "";
        // <th class="text-center">Programar Consulta</th>
        listaPacientes += `
            <table id="tablaPacientes" class="table table-hover table-striped table-sm">
                <thead>
                    <tr>
                        <th>Paciente</th>
                        <th class="text-center">Consultas</th>
                        <th class="text-center">Datos del paciente</th>
                        <th class="text-center">Abrir expediente</th>
                        <th class="text-center">Eliminar</th>
                    </tr>
                </thead>
            <tbody>
        `;
        // Se crea la lista de usuarios asignando una función que se ejecuta cuando se hace clic en alguno de ellos.
        for (let p of pacientes){
            let nombrePaciente =  p.apPaterno + ' ' + p.apMaterno + ' ' + p.nombre;
            // listaPacientes += `
            // <a href="#" type="button" class="list-group-item list-group-item-action list-group-item-light" data-toggle="modal" data-target="#modalEditaPaciente" onclick="new Pacientes().fnPacienteMuestraDatos(`+p.idPaciente+`)">`+nombrePaciente+`</a>
            // `;
            
            // <td class="text-center"><button class="btn btn-outline-success" data-toggle="modal" data-target="#modalConsulta" onclick="new Pacientes().fnPacienteMuestraDatos(`+p.idPaciente+`)"><i class=" far fa-clock"></i></button></td>
            listaPacientes +=`
			 <tr class="paciente">
			 	<td><span class=" grpUsuarios">` + nombrePaciente + `</span></td>
			 	<td class="text-center"><span class=" grpUsuarios">`+ p.consultas +`</span></td>
			    <td class="text-center"><button class="btn btn-outline-dark" data-toggle="modal" data-target="#modalEditaPaciente" onclick="new Pacientes().fnPacienteMuestraDatos(`+p.idPaciente+`)"><i class=" fa fa-pencil-alt"></i></button></td>
                <td class="text-center"><button class="btn btn-outline-success" data-toggle="modal" data-target="#modalConsulta" onclick="new Pacientes().fnPacienteAbreExpediente(`+p.idPaciente+`)"><i class="fas fa-file-medical"></i></button></td>
                `;
                
			if(p.consultas==0){
				listaPacientes += `<td class="text-center"><button class="btn btn-outline-danger" onclick="new Pacientes().fnPacienteElimina(`+ p.idPaciente +`)"><i class=" far fa-trash-alt"></i></button></td>`;
			} else {
                listaPacientes += `<td></td>`;
			}
            listaPacientes += `</tr>

            `;
        }
        $("#ListaPacientes").html(listaPacientes);

    }

    fnPacienteGuarda(){
        let apPaterno = $("#txtApPater").val();
        let apMaterno = $("#txtApMater").val();
        let nombre = $("#txtNombre").val();
        let fechaNacimiento = $("#txtFechaNacimiento").val();
        let sexo = $("#cboSexo").val();
        let alergias = $("#txtAlergias").val();
        let antPatFam = $("#txtAntPatFam").val();
        let antPatPer = $("#txtAntPatPer").val();
        let esDiabetico = $("#chkEsDiabetico").prop('checked');
        let esHipertenso = $("#chkEsHipertenso").prop('checked');
        let esDislipidemico = $("#chkEsDislipidemico").prop('checked');
        let celular = $("#txtCelular").val();
        let religion = $("#txtReligion").val();
        let correo = $("#txtCorreo").val();
        let contacto = $("#txtContacto").val();

        let esNuevo = (localStorage.getItem("idPacienteModificado")==null ? 1 : 0);

        //Validamos la información
        if(apPaterno=="" || nombre=="" || alergias==""){
            $("#mensajesDeError").html("Faltan datos del paciente.");
            $("#mensajesDeError").attr("class","alert alert-danger");
            return;
        }

        let parametros = {
            proceso : "PACIENTE_GUARDA",
            id : localStorage.getItem("idPacienteModificado"),
            nombre : nombre,
            apPaterno : apPaterno,
            apMaterno : apMaterno,
            fechaNacimiento : fechaNacimiento,
            sexo : sexo,
            alergias : alergias,
            antPatFam : antPatFam,
            antPatPer : antPatPer,
            celular : celular,
            contacto : contacto,
            correo : correo,
            esDiabetico : esDiabetico,
            esHipertenso : esHipertenso,
            esDislipidemico : esDislipidemico,
            religion : religion,
            nuevo : esNuevo
        }

        $.ajax({
            data : parametros,
            url : this.urlProceso,
            type : "POST",
            success : function(resultado){
                if (resultado!=1){
                    $("#mensajesDeError").html(resultado);
                    $("#mensajesDeError").attr("class","alert alert-danger");
                    return;
                } else {
                    new Pacientes().fnPacienteLimpiaDatos();
                    location.reload();

                }
            }
        })
    }

    fnPacienteGuardaEd(){
        let apPaterno = $("#txtApPaterEd").val();
        let apMaterno = $("#txtApMaterEd").val();
        let nombre = $("#txtNombreEd").val();
        let fechaNacimiento = $("#txtFechaNacimientoEd").val();
        let sexo = $("#cboSexoEd").val();
        let alergias = $("#txtAlergiasEd").val();
        let antPatFam = $("#txtAntPatFamEd").val();
        let antPatPer = $("#txtAntPatPerEd").val();
        let esDiabetico = $("#chkEsDiabeticoEd").prop('checked');
        let esHipertenso = $("#chkEsHipertensoEd").prop('checked');
        let esDislipidemico = $("#chkEsDislipidemicoEd").prop('checked');
        let celular = $("#txtCelularEd").val();
        let religion = $("#txtReligionEd").val();
        let correo = $("#txtCorreoEd").val();
        let contacto = $("#txtContactoEd").val();

        let esNuevo = (localStorage.getItem("idPacienteModificado")==null ? 1 : 0);

        //Validamos la información
        if(apPaterno=="" || nombre=="" || alergias==""){
            $("#mensajesDeError").html("Faltan datos del paciente.");
            $("#mensajesDeError").attr("class","alert alert-danger");
            return;
        }

        let parametros = {
            proceso : "PACIENTE_GUARDA",
            id : localStorage.getItem("idPacienteModificado"),
            nombre : nombre,
            apPaterno : apPaterno,
            apMaterno : apMaterno,
            fechaNacimiento : fechaNacimiento,
            sexo : sexo,
            alergias : alergias,
            antPatFam : antPatFam,
            antPatPer : antPatPer,
            celular : celular,
            contacto : contacto,
            correo : correo,
            esDiabetico : esDiabetico,
            esHipertenso : esHipertenso,
            esDislipidemico : esDislipidemico,
            religion : religion,
            nuevo : esNuevo
        }

        $.ajax({
            data : parametros,
            url : this.urlProceso,
            type : "POST",
            success : function(resultado){
                if (resultado!=1){
                    $("#mensajesDeError").html(resultado);
                    $("#mensajesDeError").attr("class","alert alert-danger");
                    return;
                } else {
                    new Pacientes().fnPacientesConsultarTodos();
                }
            }
        })
    }

    fnPacienteLimpiaDatos(){
        $("#txtApPater").val("");
        $("#txtApMater").val("");
        $("#txtNombre").val("");
        $("#txtFechaNacimiento").val("");
        $("#cboSexo").val("");
        $("#txtAlergias").val("");
        $("#txtAntPatFam").val("");
        $("#txtAntPatPer").val("");
        $("#chkEsDiabetico").prop('checked');
        $("#chkEsHipertenso").prop('checked');
        $("#chkEsDislipidemico").prop('checked');
        $("#txtCelular").val("");
        $("#txtReligion").val("");
        $("#txtCorreo").val("");
        $("#txtContacto").val("");
        localStorage.removeItem("nombrePacienteModificado");
        localStorage.removeItem("idPacienteModificado");

        new Pacientes().fnPacientesConsultarTodos();

        $("#mensajesDeError").attr("class","alert alert-danger invisible");    
    }

    fnPacienteLimpiaDatosEd(){
        $("#txtApPaterEd").val("");
        $("#txtApMaterEd").val("");
        $("#txtNombreEd").val("");
        $("#txtFechaNacimientoEd").val("");
        $("#cboSexoEd").val("");
        $("#txtAlergiasEd").val("");
        $("#txtAntPatFamEd").val("");
        $("#txtAntPatPerEd").val("");
        $("#chkEsDiabeticoEd").prop('checked');
        $("#chkEsHipertensoEd").prop('checked');
        $("#chkEsDislipidemicoEd").prop('checked');
        $("#txtCelularEd").val("");
        $("#txtReligionEd").val("");
        $("#txtCorreoEd").val("");
        $("#txtContactoEd").val("");
        localStorage.removeItem("nombrePacienteModificado");
        localStorage.removeItem("idPacienteModificado");

        new Pacientes().fnPacientesConsultarTodos();

        $("#mensajesDeError").attr("class","alert alert-danger invisible");    
    }

    fnPacienteMuestraDatos(idPaciente){
        $("#mensajesDeError").attr("class","alert alert-danger invisible");
        $("#btnEliminarUsuario").attr("class","btn btn-danger");
        $("#mensajesDeError").html("");
        $("#ListaPermisos").html("");
        $("#ListaOpciones").html("");
        localStorage.removeItem("idPacienteModificado");
        let parametros = {
            proceso : "PACIENTE_SELECT_DATOS",
            idDelPaciente : idPaciente
        }
        $.ajax({
            data : parametros,
            url : this.urlProceso,
            type : "POST",
            success: function(paciente){
                paciente = JSON.parse(paciente);
                
                //Colocamos información en divs que nos será de utilidad
                localStorage.setItem("idPacienteModificado",paciente.idPaciente);

                // Colocamos los datos del paciente en el formulario
                $("#txtApPaterEd").val(paciente.apPaterno);
                $("#txtApMaterEd").val(paciente.apMaterno);
                $("#txtNombreEd").val(paciente.nombre);
                $("#txtFechaNacimientoEd").val(paciente.fechaDeNacimiento);
                $("#cboSexoEd").val(paciente.sexo);
                $("#txtAlergiasEd").val(paciente.alergias);
                $("#txtAntPatFamEd").val(paciente.antPatFam);
                $("#txtAntPatPerEd").val(paciente.antPatPer);

                $("#chkEsDiabeticoEd").prop("checked", 0);
                $("#chkEsDiabeticoEd").prop("checked",(paciente.esDiabetico==1 ? "checked" : ""));
        
                $("#chkEsHipertensoEd").prop("checked", 0);
                $("#chkEsHipertensoEd").prop("checked",(paciente.esHipertenso==1 ? "checked" : ""));
        
                $("#chkEsDislipidemicoEd").prop("checked", 0);
                $("#chkEsDislipidemicoEd").prop("checked",(paciente.esDislipidemico==1 ? "checked" : ""));

                $("#txtCelularEd").val(paciente.celular);
                $("#txtReligionEd").val(paciente.religion);
                $("#txtCorreoEd").val(paciente.correo);
                $("#txtContactoEd").val(paciente.contacto);

                
            }
        })
    }

    fnPacienteAbreExpediente(idPaciente){
        localStorage.setItem("idPacienteExpediente",idPaciente);
        localStorage.removeItem("edadPaciente");
        window.location.href = "?p=Expediente";
    }

    fnPacienteElimina(idPaciente){
        $.ajax({
            data : {
                proceso : "PACIENTE_ELIMINA",
                idPaciente : idPaciente
            },
            url : this.urlProceso,
            type : "POST",
            success : function(resultado){
                // Después de que se borra el registro se vuelven a mostrar los datos en pantalla
                new Pacientes().fnPacientesConsultarTodos();
            }
        })
    }

}
window.onload = () => new Pacientes(true);