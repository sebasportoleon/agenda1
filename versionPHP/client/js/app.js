class EventsManager{
  constructor(){
    this.obtenerDataInicial()
  }

  obtenerDataInicial(){
    var self = this;

      $.ajax({
        url: '../server/getEvents.php',
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        type: 'POST',
        beforeSend: function(){
          console.log('Recibiendo datos espere.......');
        }
      }).done(function(data){

        console.log(data);
        if (data.exito==true) {
          self.poblarCalendario(data.eventos);
        }else {
          window.location.href = 'index.html';
        }

      }).fail(function(){
        alert("error en la comunicación con el servidor");
      }).always(function(){

      });
  }

  poblarCalendario(eventos) {
    var self = this;
      $('.calendario').fullCalendar({
          header: {
      		left: 'prev,next today',
      		center: 'title',
      		right: 'month,agendaWeek,basicDay'
      	},
      	defaultDate: '2017-06-13',
        locale: 'es',
      	navLinks: true,
      	editable: true,
      	eventLimit: true,
        droppable: true,
        dragRevertDuration: 0,
        businessHours: true,
        timeFormat: 'H:mm',
        eventDrop: (event) => {
            console.log('Evento Drop');
            self.actualizarEvento(event);
        },
        events: eventos,
        eventDragStart: (event,jsEvent) => {
          $('.delete-btn').find('img').attr('src', "img/trash-open.png");
          $('.delete-btn').css('background-color', '#a70f19');
          console.log('Evento Drag Start');
          console.log(event);

        },
        eventDragStop: (event, jsEvent) =>{
          var trashEl = $('.delete-btn');
          var ofs = trashEl.offset();
          var x1 = ofs.left;
          var x2 = ofs.left + trashEl.outerWidth(true);
          var y1 = ofs.top;
          var y2 = ofs.top + trashEl.outerHeight(true);
          if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
              jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                self.eliminarEvento(event, jsEvent)
                $('.calendario').fullCalendar('removeEvents', event.id);
          }
          console.log('Evento Drag Stop');
          console.log(event);
        }
      })
  }

  anadirEvento(){

    var titulo = $('#titulo').val();
    var start_date = $('#start_date').val();
    var allDay = document.getElementById('allDay').checked;
    var end_date = "";
    var end_hour = "";
    var start_hour = "";

    switch(allDay){
      case true:
        allDay = '1';
        break;
      case false:
        allDay = '0';
        break;
    }

    if (!document.getElementById('allDay').checked) {
      end_date = $('#end_date').val();
      end_hour = $('#end_hour').val();
      start_hour = $('#start_hour').val();
    }

    var newEvento = [{
      titulo: titulo,
      start: start_date,
      allDay: allDay,
      end: end_date,
      startTime: start_hour,
      endTime: end_hour
    }];

    $.ajax({
      url: '../server/new_event.php',
      dataType: "json",
      cache: false,
      processData: false,
      contentType: false,
      data: JSON.stringify(newEvento),
      type: 'POST',
      beforeSend: function(){
        console.log('Creando evento espere.......');
      }
    }).done(function(data){
      console.log(data);

      if (data.exito==true) {
        alert('Se ha añadido el evento exitosamente')
        if (document.getElementById('allDay').checked) {
          $('.calendario').fullCalendar('renderEvent', {
            title: $('#titulo').val(),
            start: $('#start_date').val(),
            allDay: true
          })
        }else {
          $('.calendario').fullCalendar('renderEvent', {
            title: $('#titulo').val(),
            start: $('#start_date').val()+" "+$('#start_hour').val(),
            allDay: false,
            end: $('#end_date').val()+" "+$('#end_hour').val()
          })
        }
      }else {
        alert(data.exito);
      }

    }).fail(function(){
      alert("error en la comunicación con el servidor");
    }).always(function(){

    });
  }

  eliminarEvento(event, jsEvent){

    var evento = [{id: event.id}];

    $.ajax({
      url: '../server/delete_event.php',
      dataType: "json",
      cache: false,
      processData: false,
      contentType: false,
      data: JSON.stringify(evento),
      type: 'POST',
      beforeSend: function(){
        console.log('Eliminando evento espere.......');
      }
    }).done(function(data){

      if (data.exito==true){
        alert('Se ha eliminado el evento exitosamente')
      }else{
        alert(data.exito);
      }

    }).fail(function(){
      alert("error en la comunicación con el servidor");
    }).always(function(){

    });
    $('.delete-btn').find('img').attr('src', "img/trash.png");
    $('.delete-btn').css('background-color', '#8B0913')
  }

  actualizarEvento(evento) {
      let id = evento.id,
          start = moment(evento.start).format('YYYY-MM-DD HH:mm:ss'),
          end = moment(evento.end).format('YYYY-MM-DD HH:mm:ss'),
          start_date,
          end_date,
          start_hour,
          end_hour

      start_date = start.substr(0,10)
      end_date = end.substr(0,10)
      start_hour = start.substr(11,8)
      end_hour = end.substr(11,8)

      let updateEvento = [{
        id: id,
        start: start_date,
        end: end_date,
        startTime: start_hour,
        endTime: end_hour
      }];

      $.ajax({
        url: '../server/update_event.php',
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        data: JSON.stringify(updateEvento),
        type: 'POST',
        beforeSend: function(){
          console.log('Editando evento espere.......');
        }
      }).done(function(data){
        console.log(data);

        if (data.exito==true) {
          alert('Se ha actualizado el evento exitosamente')
        }else {
          alert(data.exito)
        }

      }).fail(function(){
        alert("error en la comunicación con el servidor");
      }).always(function(){

      });
  }
}

$(function(){
  initForm();
  var e = new EventsManager();
  $('form').submit(function(event){
    event.preventDefault()
    e.anadirEvento();
  });
});

function initForm(){
  $('#start_date, #titulo, #end_date').val('');
  $('#start_date, #end_date').datepicker({
    dateFormat: "yy-mm-dd"
  });
  $('.timepicker').timepicker({
    timeFormat: 'HH:mm',
    interval: 30,
    minTime: '5',
    maxTime: '23:30',
    defaultTime: '7',
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
