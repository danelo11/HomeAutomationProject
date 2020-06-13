require('dotenv').config();
const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const methods = require('method-override');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');

//Initialitations
const app = express();
require('./db');
require('./config/passport')

//Settings
app.set('port', process.env.PORT || 5000); //contemplando la opcion del servidor remoto
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs' 
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(methods('_methods')); // para poder recibir sentencias extra además de get y post
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));

//Global variables

//Routes
app.use(require('./routes/users'));
app.use(require('./routes/sensors'));


//Static files
app.use(express.static(path.join(__dirname, 'public')));

//Server Listen
app.listen(app.get('port'), function(){
    console.log('Server listening on port:', app.get('port'));
})
