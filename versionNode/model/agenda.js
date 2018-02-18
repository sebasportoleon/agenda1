exports = module.exports = function(app, mongoose){

  var Schema = mongoose.Schema

  var usuarioSchema = new Schema({
    correo: {type: String},
    clave: {type: String},
    nombre: {type: String},
    fechaNacimiento: {type: String},
    estado: {type: String, enum: ['A', 'I']},
    fechaCreado: {type: Date, default: Date.now}
  });

  var eventoSchema = new Schema({
    usuario: {type: String},
    titulo: {type: String},
    fechaInicio: {type: String},
    horaInicio: {type: String},
    fechaFin: {type: String},
    horaFin: {type: String},
    diaCompleto: {type: String},
    fechaCreado: {type: Date, default: Date.now}
  });

	mongoose.model('usuarios', usuarioSchema);
  mongoose.model('eventos', eventoSchema);

};
