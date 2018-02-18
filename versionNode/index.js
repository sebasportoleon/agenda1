var bodyParser = require('body-parser'),
    http       = require('http'),
    express    = require('express'),
    port       = port = process.env.PORT || 3000,
    app        = express(),
    Server     = http.createServer(app),
    mongoose   = require('mongoose'),
    cookieParser = require('cookie-parser'),
    session = require('express-session')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/agenda', function(err, res) {
  if(err){
    console.log('ERROR: connecting to Database. ' + err);
  }
});

var modelAgenda = require('./model/agenda')(app, mongoose);
    datos         = require('./Datos'),

app.use(cookieParser())
app.use(session({
  secret: 'ABgstdn28ru309563uhgkjg',
  resave: false,
  saveUninitialized: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/datos', datos)
app.use(express.static('client'))

Server.listen(port, function(){
  console.log("Servidor Corriendo en el puerto: "+ port);
})
