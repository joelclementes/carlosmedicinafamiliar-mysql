class Expediente {
  constructor(reset = false) {
    this.urlProceso = "Expediente/php/proceso.php";
    if (reset) {
      // En cada módulo hay que usar new Menu().fnCreaMenu() porque si no, desaparecen las opciones
      new Menu().fnCreaMenu();

      // Se llena el expediente del paciente
      new Expediente().fnMuestraExpediente()


      // Se llena combo de padecimientos
      new Expediente().fnLlenaComboPadecimientos();

      // Se muestran los datos del paciente
      new Expediente().fnPacienteMuestraDatos();

      // Se establece el plugin de WYSWYG a las cajas de texto con class="wyswyg"
      // $(".wyswyg").summernote({
      //   toolbar:[
      //     ['style', ['bold', 'italic', 'underline', 'clear']],
      //     ['para', ['ul', 'ol', 'paragraph']]
      //   ]
      // });
      $(".wyswyg").summernote({
        toolbar:[

        ]
      });

      //Cálulo de imc cuando se modifiquen valores
      $("#txtPeso").change(function () {
        $("#txtImc").val(CalculaImc($("#txtPeso").val(),$("#txtTalla").val()));
      });
      $("#txtTalla").change(function () {
        $("#txtImc").val(CalculaImc($("#txtPeso").val(),$("#txtTalla").val()));
      });

      // Cálculo de F.C. sugerida
      $("#txtPorcentajeFcm").change(function () {
        $("#txtFcm").val(CalculaFc($("#txtPorcentajeFcm").val(),localStorage.getItem("constanteFcmPaciente"),localStorage.getItem("edadPaciente")));
      });

      // Funciones de los botones cuando se hace clic en ellos.
      $("#btnGuardar").on("click", function () {
        new Expediente().fnAtencionGuarda();
      });
      $("#btnLimpiaDatos").on("click", function () {
        new Expediente().fnAtencionLimpiaDatos();
      });
    }
  }

  fnMuestraExpediente(){
    let parametros = {
      proceso: "EXPEDIENTE_SELECT",
      idPaciente: localStorage.getItem("idPacienteExpediente")
    }
    $.ajax({
      data: parametros,
      url: this.urlProceso,
      type: "POST",
      success: function (expediente){
        new Expediente().fnExpedienteConstruyeTabla(expediente);
      }
    })
  }

  fnExpedienteConstruyeTabla(expediente){
    expediente = JSON.parse(expediente);
    let listaExpediente = "";
    // <th class="text-center">Programar Consulta</th>
    listaExpediente += `
        <table class="table table-hover table-striped table-sm">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Motivo de la consulta</th>
                    <th>Atendido por</th>
                    <th class="text-center">Ver</th>
                    <th class="text-center">Impr receta PDF</th>
                </tr>
            </thead>
        <tbody>
    `;
    // Se crea la lista de usuarios asignando una función que se ejecuta cuando se hace clic en alguno de ellos.
    for (let e of expediente){
  //       listaExpediente +=`
  //  <tr class="paciente">
  //     <td><span class=" grpUsuarios">` + e.fecha + DiferenciaTiempo(new Date(),e.fechaBD) +`</span></td>
  //     <td ><span class=" grpUsuarios">`+ e.motivoDeConsulta +`</span></td>
  //     <td ><span class=" grpUsuarios">`+ e.atendidoPor+`</span></td>
  //     <td class="text-center"><button class="btn btn-outline-success" data-toggle="modal" data-target="#modalConsulta"><i class="fas fa-search"></i></button></td>
  //     <td class="text-center"><button class="btn btn-outline-success" data-toggle="modal" data-target="#modalConsulta" onclick="new Expediente().fnImprimeReceta(`+e.idExpediente+`)"><i class="fas fa-file-pdf"></i></button></td>
  //      `;
  listaExpediente +=`
  <tr class="paciente">
     <td><span class=" grpUsuarios">` + e.fecha +`</span></td>
     <td ><span class=" grpUsuarios">`+ e.motivoDeConsulta +`</span></td>
     <td ><span class=" grpUsuarios">`+ e.atendidoPor+`</span></td>
     <td class="text-center"><button class="btn btn-outline-success" data-toggle="modal" data-target="#modalConsulta"><i class="fas fa-search"></i></button></td>
     <td class="text-center"><button class="btn btn-outline-success" data-toggle="modal" data-target="#modalConsulta" onclick="new Expediente().fnImprimeReceta(`+e.idExpediente+`)"><i class="fas fa-file-pdf"></i></button></td>
      `;
    }
    listaExpediente += `</tr>`;
    $("#expediente").html(listaExpediente);
  }

  fnImprimeReceta(idExpediente){
    let parametros={
      proceso:"CONSULTA_SELECT",
      idExpediente: idExpediente
    }
    $.ajax({
      data: parametros,
      url: this.urlProceso,
      type:"POST",
      success: function (consulta){
        consulta = JSON.parse(consulta);
        let pagina = `Expediente/php/rptRecetaPdf.php?`
        +`&nc=`+consulta.nombreCompleto
        +`&edad=`+Edad(consulta.fechaDeNacimiento)+` años`
        +`&peso=`+consulta.peso
        +`&talla=`+consulta.talla
        +`&imc=`+consulta.imc
        +`&fco=`+consulta.fecha
        +`&ta=`+consulta.ta
        +`&fc=`+consulta.fc
        +`&temp=`+consulta.temp
        +`&dx=`+consulta.dx
        +`&rp=`+consulta.tratamiento;
        	AbrirVentana(pagina);
      }
    })
  }

  fnLlenaComboPadecimientos(){
    let parametros = {
      proceso: "PADECIMIENTOS_SELECT"
    }
    let strCbo = `<option value="0">Seleccione</option>`;
    $.ajax({
      data: parametros,
      url: this.urlProceso,
      type: "POST",
      success: function (padecimientos){
        padecimientos = JSON.parse(padecimientos);
        for (let p of padecimientos){
          strCbo += `<option value="`+p.idPadecimiento+`">`+p.descripcion+`</option>`;
        }
        $("#cboPadecimiento").html(strCbo);
      }
    })
  }

  fnPacienteMuestraDatos() {
    let parametros = {
      idPaciente: localStorage.getItem("idPacienteExpediente"),
      proceso: "PACIENTE_SELECT_DATOS",
    };
    $.ajax({
      data: parametros,
      url: this.urlProceso,
      type: "POST",
      success: function (paciente) {
        paciente = JSON.parse(paciente);
        new Expediente().fnPacienteMuestraDatosDelPaciente(paciente);
      },
    });
  }

  fnPacienteMuestraDatosDelPaciente(paciente) {
    $("#titulo").html(
      "Atendiendo a " +
        paciente.nombre +
        " " +
        paciente.apPaterno +
        " " +
        paciente.apMaterno
    );
    $("#edad").html(Edad(paciente.fechaDeNacimiento) + " años");
    $("#sexo").html(paciente.sexo);
    $("#alergias").html(paciente.alergias);
    $("#antPatFam").html(paciente.antPatFam);
    $("#antPatPer").html(paciente.antPatPer);
    $("#esDiabetico").html(paciente.esDiabetico == 0 ? "No" : "Si");
    $("#esHipertenso").html(paciente.esHipertenso == 0 ? "No" : "Si");
    $("#esDislipidemico").html(paciente.esDislipidemico == 0 ? "No" : "Si");
    $("#religion").html(paciente.religion);
    localStorage.setItem("constanteFcmPaciente", paciente.constanteFcm);
  }

  fnAtencionLimpiaDatos(){
    $("#txtMotivoDeConsulta").summernote("reset");
    $("#txtDiagnostico").summernote("reset");
    $("#txtTa").val("");
    $("#txtFc").val("");
    $("#txtTemperatura").val("");
    $("#txtGlucosa").val("");
    $("#txtPeso").val("");
    $("#txtTalla").val("");
    $("#txtImc").val("");
    $("#txtTratamiento").summernote("reset");
    $("#cboPadecimiento").val(0);
    $("#txtNota").summernote("reset");
    $("#mensajes").html("");
    $("#txtMotivoDeConsulta").summernote("focus");
  }

  fnAtencionGuarda(){
    $("#mensajes").html("");
    if($("#txtMotivoDeConsulta").val()=="" || $("#txtDiagnostico").val()=="" || $("#txtTratamiento").val()==""){
      let msg = `
      <div class="alert alert-warning" role="alert">
      ¡Faltan datos por capturar!
    </div>`;
      $("#mensajes").html(msg);
      return;
    }
    // fecha: new Date().toISOString().substring(0,10),
    let parametros = {
      proceso: "EXPEDIENTE_GUARDA_CONSULTA",
      motivoDeConsulta: $("#txtMotivoDeConsulta").val(),
      fecha: fechaDeHoy(),
      dx: $("#txtDiagnostico").val(),
      ta: $("#txtTa").val(),
      fc: $("#txtFc").val(),
      temp: $("#txtTemperatura").val(),
      glucosa: $("#txtGlucosa").val(),
      peso: ($("#txtPeso").val() == "" ? 0 : $("#txtPeso").val()),
      talla: ($("#txtTalla").val() == "" ? 0 : $("#txtTalla").val()),
      imc: ($("#txtImc").val() == "" ? 0 : $("#txtImc").val()),
      tratamiento: $("#txtTratamiento").val(),
      idPaciente: localStorage.getItem("idPacienteExpediente"),
      idPadecimiento: $("#cboPadecimiento").val(),
      estado: "Atendido",
      atendidoPor: localStorage.getItem("nombreUsuario"),
      nota: $("#txtNota").val()
    };
    $.ajax({
      data: parametros,
      url: this.urlProceso,
      type: "POST",
      success: function (paciente) {
        // paciente = JSON.parse(paciente);
        new Expediente().fnMuestraExpediente();

      },
    });
  }
  
}
window.onload = () => new Expediente(true);
