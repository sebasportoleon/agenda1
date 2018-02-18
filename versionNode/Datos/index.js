var express = require('express')
var Router = express.Router()
var bcrypt = require('bcrypt')
const saltRounds = 12

var mongoose = require('mongoose')
var tbUsuarios = mongoose.model('usuarios')
var tbEventos = mongoose.model('eventos')

Router.get('/crearUsuarioTest', function(req, res){

  var uTest = 'diego@test.com.co'
      cTest = '123456'

  tbUsuarios.find({correo: uTest}, function(err, datos){
    if(err){
      res.json({exito: false})
    }else{
      if(datos.length != 0){
        res.json({
          exito: true,
          credenciales: 'Usuario : '+uTest+' Clave : '+cTest
        })
      }else{
        bcrypt.hash(cTest, saltRounds, function(err, hash) {          
          var usuarioTest = new tbUsuarios ({
            correo: uTest,
            clave: hash,
            nombre: 'USUARIO TEST',
            fechaNacimiento: '20-03-1987',
            estado: 'A'
        	});
          usuarioTest.save(function(err, usuarioTest){
        		if(err){
              res.json({exito: false})
            }else{
              res.json({
                exito: true,
                credenciales: 'Usuario : '+uTest+' Clave : '+cTest
              })
            }
        	})
        });
      }
    }
  })

})

Router.post('/login', function(req, res){
  var correo = req.body.user
      clave   = req.body.pass

  var login = {
    correo: correo,
    estado: 'A'
	};

	tbUsuarios.find(login, function(err, datos){
    if(err){
      res.json({exito: false})
    }else{
      if(datos.length != 0){
        bcrypt.compare(clave, datos[0].clave, function(err, ress){
          if(ress){// ress == true
            req.session.correo = datos[0].correo
            req.session.nombre = datos[0].nombre
            res.json({exito: true})
          }else{
            res.json({exito: false})
          }
        });
      }else{
        res.json({exito: false})
      }
    }
	});

})

Router.get('/salir', function(req, res){
  req.session.correo = null
  req.session.nombre = null
  if(req.session.correo == null){
    res.json({exito: true})
  }else{
    res.json({exito: false})
  }

})

Router.get('/eventos', function(req, res){
  tbEventos.find(function(err, eventos){
		if(err){
      res.json({exito: false})
    }else{
      var login = false
      var listEventos = []
      if(req.session.correo){
        login = true
      }
      for (var i = 0; i < eventos.length; i++){
        switch(eventos[i].diaCompleto){
          case '1':
            eventos[i].diaCompleto = true;
            break;
          case '0':
            eventos[i].diaCompleto = false;
            break;
        }

        var evento = {
          id: eventos[i]._id,
          title: eventos[i].titulo,
          start: eventos[i].fechaInicio + ' ' + eventos[i].horaInicio,
          end: eventos[i].fechaFin + ' ' + eventos[i].horaFin,
          allDay: eventos[i].diaCompleto
        }
        listEventos.push(evento)
      }
      res.json({login: login, eventos: listEventos})
    }
	});
})

Router.post('/crearEvento', function(req, res){

  var usuario = req.session.correo,
      titulo   = req.body.titulo,
      fechaInicio   = req.body.fechaInicio,
      horaInicio   = req.body.horaInicio,
      fechaFin   = req.body.fechaFin,
      horaFin   = req.body.horaFin,
      diaCompleto   = req.body.diaCompleto

  var evento = new tbEventos ({
    usuario: usuario,
    titulo: titulo,
    fechaInicio: fechaInicio,
    horaInicio: horaInicio,
    fechaFin: fechaFin,
    horaFin: horaFin,
    diaCompleto: diaCompleto
	});

	evento.save(function(err, evento){
		if(err){
      res.json({exito: false})
    }else{
      res.json({exito: true})
    }
	});

})

Router.post('/eliminarEvento', function(req, res){
  var idEvento = req.body.id;

  tbEventos.findById(idEvento, function(err, evento){
    if(err){
      res.json({exito: false})
    }else{
      evento.remove(function(err) {
        if(err){
          res.json({exito: false})
        }else{
          res.json({exito: true})
        }
      })
    }

  });
})

Router.post('/editarEvento', function(req, res){
  var idEvento = req.body.id;

  tbEventos.findById(idEvento, function(err, evento){
    if(err){
      res.json({exito: false})
    }else{
      evento.fechaInicio = req.body.fechaInicio
      evento.fechaFin =  req.body.fechaFin

      evento.save(function(err, evento) {
        if(err){
          res.json({exito: false})
        }else{
          res.json({exito: true})
        }
      })
    }

  });
})

module.exports = Router
