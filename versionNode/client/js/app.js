
class EventManager {
    constructor() {
        this.urlBase = "/datos"
        this.obtenerDataInicial()
        this.inicializarFormulario()
        this.guardarEvento()
        this.salirAgenda()
    }

    salirAgenda(){
      let url = this.urlBase + "/salir"
        $('#logout').on('click', (ev) => {
          ev.preventDefault()
          $.get(url, (datos) => {
            if(datos.exito == true){
              window.location.href = "/"
            }else{
              alert('Error al cerrar la sesion')
            }

          })
        })
    }

    obtenerDataInicial() {
        let url = this.urlBase + "/eventos"
        $.get(url, (datos) => {
          if(datos.login == true){
            this.inicializarCalendario(datos.eventos)
          }else{
            window.location.href = "/"
          }

        })
    }

    actualizarEvento(evento){
      let start = moment(evento.start).format('YYYY-MM-DD HH:mm:ss'),
          end = moment(evento.end).format('YYYY-MM-DD HH:mm:ss'),
          editEvento = {
            id: evento.id,
            fechaInicio: start.substr(0,10),
            fechaFin: end.substr(0,10)
          }
      $.post(this.urlBase + '/editarEvento', editEvento, (response) => {
        if(response.exito == true){
          alert('Evento Editado correctamente....')
        }else{
          alert('Intente nuevamente')
        }
      })
    }

    eliminarEvento(evento){
        let eventId = {id: evento.id}
        $.post(this.urlBase + '/eliminarEvento', eventId, (response) => {
          if(response.exito == true){
            alert('Evento Eliminado correctamente....')
          }else{
            alert('Intente nuevamente')
          }
        })
    }

    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            ev.preventDefault()
            let title = $('#titulo').val(),
            start = $('#start_date').val(),
            allDay = document.getElementById('allDay').checked,
            end = '',
            start_hour = '',
            end_hour = '';

            switch(allDay){
              case true:
                allDay = '1';
                break;
              case false:
                allDay = '0';
                break;
            }

            if (!$('#allDay').is(':checked')) {
                end = $('#end_date').val()
                start_hour = $('#start_hour').val()
                end_hour = $('#end_hour').val()
            }

            if (title != "" && start != ""){
              var evento = {
                titulo: title,
                fechaInicio: start,
                horaInicio: start_hour,
                fechaFin: end,
                horaFin: end_hour,
                diaCompleto: allDay
            	};

                $.post(this.urlBase+'/crearEvento', evento, (response) => {

                  if(response.exito == true){
                    var startFull = start + ' ' + start_hour
                    var endFull = end + ' ' + end_hour
                    if(document.getElementById('allDay').checked){
                      $('.calendario').fullCalendar('renderEvent', {
                        title: title,
                        start: startFull,
                        allDay: true,
                        end: endFull
                      })

                    }else{
                      $('.calendario').fullCalendar('renderEvent', {
                        title: title,
                        start: startFull,
                        allDay: false,
                        end: endFull
                      })
                    }
                    alert("Evento creado correctamente...")
                  }
                })

            } else {
                alert("Complete los campos obligatorios para el evento")
            }
        })
    }

    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function(){
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
            }else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
    }

    inicializarCalendario(eventos){
        $('.calendario').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,basicDay'
            },
            defaultDate: '2017-06-19',
            locale: 'es',
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            eventDrop: (event) => {
                this.actualizarEvento(event)
            },
            events: eventos,
            eventDragStart: (event,jsEvent) => {
                $('.delete').find('img').attr('src', "img/trash-open.png");
                $('.delete').css('background-color', '#a70f19');
            },
            eventDragStop: (event,jsEvent) => {
                var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if(jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2){
                      this.eliminarEvento(event)
                      $('.calendario').fullCalendar('removeEvents', event.id);
                }
                $('.delete').find('img').attr('src', "img/delete.png");
            }
          })
        }
    }

    const Manager = new EventManager()
