// server.js

// localhost:4000

// start database
//"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath C:\Users\rayho\OneDrive\NodeProject\nodetest2\data

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var socket = require('socket.io');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var paypal = require('paypal-rest-sdk');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

// using static files
app.use(express.static('./public'));


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'aurapursecret', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// websocket ==================================================================
// not in use. etninja tutorial part 2
var io = socket(port);
io.on('connection', function(socket){
    console.log('made socket connection');
});


// launch ======================================================================
// app.listen(port);
var server = app.listen(4000,function(){
    console.log('listening port 4000');
});


// websocket ==================================================================
// not in use. etninja tutorial part 2

/*
var io = socket(server);
io.on('connection', function(socket){
    console.log('made socket connection', socket.id);

    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    })
});
*/






console.log('The magic happens on port ' + port);

//"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath C:\Users\rayho\OneDrive\NodeProject\data
