$(function(){
  var l = new Login();
})

class Login{
  constructor(){
    this.submitEvent()
  }

  submitEvent(){
    $('form').submit((event)=>{
      event.preventDefault()
      this.sendForm()
    })
  }

  sendForm(){
    let usuario = $('#user').val();
    let pass = $('#password').val();
    let login = [{
      correo: usuario,
      clave: pass
    }];

    $.ajax({
      url: '../server/check_login.php',
      dataType: "json",
      cache: false,
      processData: false,
      contentType: false,
      data: JSON.stringify(login),
      type: 'POST',
      beforeSend: function(){
        console.log('Enviando datos espere.......');
      }
    }).done(function(php_response){

      if (php_response.exito == true) {
        window.location.href = 'main.html';
      }else {
        alert("Usuario o Clave incorrectos !.");
      }

    }).fail(function(){
      alert("error en la comunicación con el servidor");
    }).always(function(){

    });
  }
}
