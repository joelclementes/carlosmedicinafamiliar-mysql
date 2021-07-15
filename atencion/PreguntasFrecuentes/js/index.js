class PreguntasFrecuentes {
    constructor(reset = false) {
        this.urlProceso = "PreguntasFrecuentes/php/proceso.php";
        if (reset) {
            // En cada módulo hay que usar new Menu().fnCreaMenu() porque si no, desaparecen las opciones
            new Menu().fnCreaMenu();
            new PreguntasFrecuentes().fnLlenaAcordeonPreguntas();
            new PreguntasFrecuentes().fnLlenaComboGrupo();
            $(".textoWysWyg").summernote();
            $("#btnNuevaPregunta").on("click", function () { new PreguntasFrecuentes().fnMuestraCapturaNueva(); })
        }
    }

    fnLlenaComboGrupo() {
        let parametros = {
            proceso: "GRUPOS_SELECT"
        }
        $.ajax({
            data: parametros,
            url: this.urlProceso,
            type: "POST",
            success: function(opciones) {
                new PreguntasFrecuentes().fnConstruyeCombo(opciones);
            }
        })
    }

    fnConstruyeCombo(opciones) {
        opciones = JSON.parse(opciones);
        let aOpciones = `<option value="">Seleccionar</option>`;
        for (let o of opciones) {
            aOpciones += `
            <option value="`+ o.grupo + `">` + o.grupo + `</option>
            `;
        }
        $("#cboGrupo").html(aOpciones);
    }

    fnMuestraCapturaNueva() {
        $('#ModalNuevaPregunta').modal('show');
    }

    fnLlenaAcordeonPreguntas() {
        let parametros = {
            proceso: "PREGUNTAS_SELECT"
        }
        $.ajax({
            data: parametros,
            url: this.urlProceso,
            type:"POST",
            success: function(preguntas){
                new PreguntasFrecuentes().fnConstruyeAcordeon(preguntas);
            }
        })
    }
    fnConstruyeAcordeon(preguntas){
        {/* <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick="new PreguntasFrecuentes().fnMuestraPregunta(`+p.id+`,'`+p.pregunta+`','`+p.respuesta+`')"></button> */}
        preguntas = JSON.parse(preguntas);
        let aAcord = ``;
        for (let p of preguntas){
            let pr = JSON.stringify(p);
            aAcord +=`
            <div class="card">
            <div class="card-header" id="p`+p.id+`">
              <h2 class="mb-0">
                <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" onClick="new PreguntasFrecuentes().fnMuestraPregunta(`+pr+`)">
                  `+p.pregunta+`
                </button>
              </h2>
            </div>
      
            <div id="collapseOne" class="collapse" aria-labelledby="p`+p.id+`" data-parent="#acordeonPreguntas">
              <div class="card-body">
                `+p.respuesta+`
              </div>
            </div>
          </div>
            `;
        }
        $("#acordeonPreguntas").html(aAcord);
    }


    fnMuestraPregunta(pregunta){
        console.log(pregunta);
        
    }

    fnPreguntasFrecuentesGuarda() {
        var nomUsuario = $("#txtNombreDelUsuario").val();
        var claUsuario = $("#txtClave").val();
        var pwdUsuario1 = $("#txtPwd").val();
        var pwdUsuario2 = $("#txtPwd2").val();
        var esNuevo = (localStorage.getItem("idUsuarioModificado") == null ? 1 : 0);

        //Validamos la información
        if (nomUsuario == "" || claUsuario == "") {
            $("#mensajesDeError").html("Faltan datos del usuario.");
            $("#mensajesDeError").attr("class", "alert alert-danger");
            return;
        }

        if (esNuevo == 1 && pwdUsuario1 == "") {
            $("#mensajesDeError").html("Falta contraseña.");
            $("#mensajesDeError").attr("class", "alert alert-danger");
            return;
        }

        if (pwdUsuario1 != pwdUsuario2) {
            $("#mensajesDeError").html("No coincide la confirmación de contraseña.");
            $("#mensajesDeError").attr("class", "alert alert-danger");
            return;
        }

        var parametros = {
            id: localStorage.getItem("idUsuarioModificado"),
            nombre: nomUsuario,
            clave: claUsuario,
            pwd: pwdUsuario1,
            nuevo: esNuevo
        }

        $.ajax({
            data: parametros,
            url: "Usuarios/php/usuario_guarda.php",
            type: "POST",
            success: function (resultado) {
                if (resultado != 1) {
                    $("#mensajesDeError").html(resultado);
                    $("#mensajesDeError").attr("class", "alert alert-danger");
                    return;
                } else {
                    new PreguntasFrecuentes().fnPreguntasFrecuentesLimpiaDatos();
                }
            }
        })
    }

    fnPreguntasFrecuentesLimpiaDatos() {
        $("#txtNombreDelUsuario").val("");
        $("#txtClave").val("");
        $("#txtPwd").val("");
        $("#txtPwd2").val("");
        $("#btnEliminarUsuario").attr("class", "btn btn-danger invisible");
        $("#nombreUsuarioModificado").html("Usuario nuevo. Guarda y después especifica permisos.");
        $("#ListaPermisos").html("");
        $("#ListaOpciones").html("");
        localStorage.removeItem("nombreUsuarioModificado");
        localStorage.removeItem("idUsuarioModificado");

        new PreguntasFrecuentes().fnPreguntasFrecuentesConsultarTodos();

        $("#mensajesDeError").attr("class", "alert alert-danger invisible");
    }

    fnPreguntasFrecuentesMuestraDatos(idUsuario) {
        $("#mensajesDeError").attr("class", "alert alert-danger invisible");
        $("#btnEliminarUsuario").attr("class", "btn btn-danger");
        $("#mensajesDeError").html("");
        $("#ListaPermisos").html("");
        $("#ListaOpciones").html("");
        var parametros = {
            idDelUsuario: idUsuario
        }
        $.ajax({
            data: parametros,
            url: "Usuarios/php/usuario_select_datos.php",
            type: "POST",
            success: function (usuario) {
                usuario = JSON.parse(usuario);
                var usuarioDatos = usuario.usuDatos; usuarioDatos = JSON.parse(usuarioDatos);
                var usuarioPermisos = usuario.usuPermisos; usuarioPermisos = JSON.parse(usuarioPermisos);
                var opcionesDisponibles = usuario.opcionesDisponibles; opcionesDisponibles = JSON.parse(opcionesDisponibles);

                //Colocamos información en divs que nos será de utilidad
                localStorage.setItem("idUsuarioModificado", usuarioDatos.idUsuario);

                $("#nombreUsuarioModificado").html("Modificando a: <b>" + usuarioDatos.nombreUsuario + "</b>");

                // Colocamos los datos del Usuario en el formulario
                $("#txtNombreDelUsuario").val(usuarioDatos.nombreUsuario);
                $("#txtClave").val(usuarioDatos.clave);

                // Mostramos las opciones a las que tiene permiso
                var listaPermisos = "";
                listaPermisos += `
                <div class="alert alert-warning" role="alert">
                    Opciones otorgadas al usuario. Haz clic para eliminar una.
                </div>
                <ul class="list-group">`;
                for (let usuarioPermiso of usuarioPermisos) {
                    listaPermisos += `
                        <li type="button" class="list-group-item list-group-item-action list-group-item-light" onClick="new PreguntasFrecuentes().fnPreguntasFrecuentesBorraPermiso(`+ usuarioPermiso.id + `)">` + usuarioPermiso.tituloMenu + `</li>`;
                }
                listaPermisos += `
                </ul>`;
                $("#ListaPermisos").html(listaPermisos);

                // Mostramos las opciones disponibles del sistema
                var listaOpciones = "";
                listaOpciones += `
                <div class="alert alert-primary" role="alert">
                    Opciones disponibles en el sistema. Haz clic para agregar una al usuario.
                </div>
                <ul class="list-group">`;
                for (let opcionDisponible of opcionesDisponibles) {
                    listaOpciones += `
                        <li type="button" class="list-group-item list-group-item-action list-group-item-light" onClick="new PreguntasFrecuentes().fnPreguntasFrecuentesAgregaPermiso(`+ opcionDisponible.idMenu + `)">` + opcionDisponible.tituloMenu + `</li>`;
                }
                listaOpciones += `
                </ul>`;
                $("#ListaOpciones").html(listaOpciones);
            }
        })
    }

    fnPreguntasFrecuentesBorraPermiso(id) {
        $.ajax({
            data: { idQueSeBorra: id },
            url: "Usuarios/php/usuario_borra_opcion_menu.php",
            type: "POST",
            success: function (resultado) {
                // Después de que se borra el registro se vuelven a mostrar los datos en pantalla
                new PreguntasFrecuentes().fnPreguntasFrecuentesMuestraDatos(localStorage.getItem("idUsuarioModificado"));
            }
        })
    }

    fnPreguntasFrecuentesAgregaPermiso(idMenu) {
        $.ajax({
            data: {
                idUsuario: localStorage.getItem("idUsuarioModificado"),
                idMenu: idMenu
            },
            url: "Usuarios/php/usuario_agrega_opcion_menu.php",
            type: "POST",
            success: function (resultado) {
                // Después de que se borra el registro se vuelven a mostrar los datos en pantalla
                new PreguntasFrecuentes().fnPreguntasFrecuentesMuestraDatos(localStorage.getItem("idUsuarioModificado"));
            }
        })
    }

    fnPreguntasFrecuentesElimina() {
        $.ajax({
            data: { idUsuario: localStorage.getItem("idUsuarioModificado") },
            url: "Usuarios/php/usuario_elimina.php",
            type: "POST",
            success: function (resultado) {
                // Después de que se borra el registro se vuelven a mostrar los datos en pantalla
                new PreguntasFrecuentes().fnPreguntasFrecuentesLimpiaDatos();
            }
        })
    }

}
window.onload = () => new PreguntasFrecuentes(true);