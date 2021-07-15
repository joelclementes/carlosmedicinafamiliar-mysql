class Calendario {
    constructor(reset = false) {
        this.urlProceso = "CalendarioObligaciones/php/proceso.php";

        if (reset) {
            // En cada módulo hay que usar new Menu().fnCreaMenu() porque si no, desaparecen las opciones
            new Menu().fnCreaMenu();

            new Calendario().fnCalendarioLlenaConEventos();
            $(".textoObligacion").summernote();
            $("#btnGuardaEventoNuevo").on("click",function(){ new Calendario().fnCalendarioGuardaNuevoEvento(); });
            $("#btnGuardaEventoEditado").on("click",function(){ new Calendario().fnCalendarioGuardaEventoEditado(); });
        }
    }

    fnCalendarioLlenaConEventos(){
        let parametros = {
            proceso : "CALENDARIO_SELECT"
        }
        $.ajax({
            url : this.urlProceso,
            data: parametros,
            type: "POST",
            success: function(eventos){
                
                let date = new Date();
                let yyyy = date.getFullYear().toString();
                let mm = (date.getMonth()+1).toString().length == 1 ? "0"+(date.getMonth()+1).toString() : (date.getMonth()+1).toString();
                let dd  = (date.getDate()).toString().length == 1 ? "0"+(date.getDate()).toString() : (date.getDate()).toString();

                let jsonEventos = JSON.parse(eventos);

                $('#calendar').fullCalendar({
                     header: {
                        language: 'es',
                         left: 'prev,next today',
                         center: 'title',
                         right:''
                        //  right: 'month,basicWeek,basicDay',
                     },
                     firstDay:0,
                     defaultDate: yyyy+"-"+mm+"-"+dd,
                     editable: true,
                     eventStartEditable:true,
                     eventLimit: true, // permite el link "+ más" cuando hay muchos eventos el mismo día.
                     selectable: true,
                     selectHelper: true,
                     select: function(start, end) {
                         
                         $('#ModalAdd #start').val(moment(start).format('YYYY-MM-DD HH:mm:ss'));
                         $('#ModalAdd #end').val(moment(end).format('YYYY-MM-DD HH:mm:ss'));
                        //  $('#ModalAdd #start').val(moment(start).format('YYYY-MM-DD'));
                        //  $('#ModalAdd #end').val(moment(end).format('YYYY-MM-DD'));
                         $('#ModalAdd').modal('show');
                     },
                     eventRender: function(event, element) {
                         element.bind('dblclick', function() {
                            //  console.log(event);
                             $('#ModalEdit #id').val(event.id);
                             $('#ModalEdit #txtObligacion').val(event.title);
                             // ESTAS DOS LÍINEAS SIGUIENTES SUSTITUYEN A LA FUNCIÓN val() DE javascript, DEBIDO A QUE ESTAMOS USANDO EDITOR WYSWYG summernote
                             $('#ModalEdit #txtFundamentoLegal').summernote('code',event.fundamentoLegal);
                             $('#ModalEdit #txtDisposicion').summernote('code',event.disposicion);

                             $('#ModalEdit #start').val(event.start.format('YYYY-MM-DD'));
                             $('#ModalEdit #end').val(event.end.format('YYYY-MM-DD'));

                             $('#ModalEdit #color').val(event.color);
                             $('#ModalEdit').modal('show');
                         });
                     },
                     eventDrop: function(event, delta, revertFunc) { // si changement de position
         
                         new Calendario().fnCalendarioCambiaFechaEvento(event);
         
                     },
                     eventResize: function(event,dayDelta,minuteDelta,revertFunc) { // si changement de longueur
         
                         new Calendario().fnCalendarioCambiaFechaEvento(event);
         
                     },
                     events: 
                     // Formato [{},{}]
                        jsonEventos
                     
                 });
            }
        })
    }

    fnCalendarioCambiaFechaEvento(event){
        let id,start,end;

        id =  event.id;

        start = event.start.format('YYYY-MM-DD HH:mm:ss');
        if(event.end){
            end = event.end.format('YYYY-MM-DD HH:mm:ss');
        }else{
            end = start;
        }
        
        let parametros = {
            proceso : "CAMBIA_FECHA_EVENTO",
            id: id,
            inicia : start,
            termina : end
        }
        $.ajax({
         url: this.urlProceso,
         type: "POST",
         data: parametros,
         success: function(rep) {
                // if(rep == '1'){
                //     alert('Evento se ha guardado correctamente');
                // }else{
                //     alert('No se pudo guardar. Inténtalo de nuevo.'); 
                // }
            }
        });
    }

    fnCalendarioGuardaNuevoEvento(){
        let parametros = {
            proceso : "GUARDA_NUEVO_EVENTO",
            obligacion : $('#ModalAdd #txtObligacion').val(),
            fundamento : $("#ModalAdd #txtFundamentoLegal").val(),
            disposicion : $("#ModalAdd #txtDisposicion").val(),
            inicia : $("#ModalAdd #start").val(),
            termina : $("#ModalAdd #end").val(),
            color : $("#ModalAdd #color").val()
        }

        $.ajax({
            url: this.urlProceso,
            type: "POST",
            data: parametros,
            success: function(rep) {
                location.reload();
                   // if(rep == '1'){
                   //     alert('Evento se ha guardado correctamente');
                   // }else{
                   //     alert('No se pudo guardar. Inténtalo de nuevo.'); 
                   // }
               }
           });
    }

    fnCalendarioGuardaEventoEditado(){
        let parametros = {
            proceso : "GUARDA_EVENTO_EDITADO",
            id : $("#ModalEdit #id").val(),
            obligacion : $("#ModalEdit #txtObligacion").val(),
            fundamento : $("#ModalEdit #txtFundamentoLegal").val(),
            disposicion : $("#ModalEdit #txtDisposicion").val(),
            inicia : $("#ModalEdit #start").val(),
            termina : $("#ModalEdit #end").val(),
            color : $("#ModalEdit #color").val(),
            eliminar : $("#ModalEdit #chkEliminar").prop("checked")
        }

        // PROCESO ESPECIAL ////////////////////////////////////////////////////////////////////
        // Evaluamos que la fecha de término no sea igual o menor que la fecha de inicio.
        // Si así fuera, asignamos a la fecha de término un día posterior a la fecha de inicio.
        // De no hacerlo, causa error al querer editar después un evento.
        let fechaInicia = new Date(parametros.inicia);
        let fechaTermina = new Date(parametros.termina);
        if(fechaTermina<=fechaInicia){
            let fechaNuevaTermina = new Date(fechaInicia.getTime()+2*24*60*60*1000);
            let fechaNuevaTerminaFormateada = fechaNuevaTermina.getFullYear() + "-" + (fechaNuevaTermina.getMonth() + 1) + "-" + fechaNuevaTermina.getDate();
            parametros.termina = fechaNuevaTerminaFormateada;
        }

        $.ajax({
            url : this.urlProceso,
            type : "POST",
            data : parametros,
            success: function(resp){
                location.reload();
            }
        })
    }

}
window.onload = () => new Calendario(true);