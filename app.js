//Require
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');

//import routes
var user_routes = require('./routes/user');
var login_routes = require('./login');
var search_routes = require('./routes/search');
var upload_routes = require('./routes/upload');
var matches_routes = require('./routes/matches');
var table_routes = require('./routes/table');
var bettype_routes = require('./routes/bettype');
var bettypeoption_routes = require('./routes/optionbettype');
var tablesubs_routes = require('./routes/tablesubscription');
var match_routes = require('./routes/match');
var forecast_routes = require('./routes/forecast');
var bet_routes = require('./routes/bet');
var matchesbytable_routes = require('./routes/matchbytable');
var optiontyperelation_routes = require('./routes/optiontyperelation');
var matchtyperelation_routes = require('./routes/matchtyperelation');


//init vars
var app = express();
var http = require('http').createServer(app);
var port = process.env.PORT || 7000;
// var io = require('socket.io')(http);
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//DB conection

// 'mongodb://localhost:27017/`byam`'
mongoose.connection.openUri('mongodb://udv7yz9gbu2w5kv8hugq:Q7SdmyQBCqOpexWRRiSX@bwszrod9a6ttuwm-mongodb.services.clever-cloud.com:27017/bwszrod9a6ttuwm', { useNewUrlParser: true }, (error, res) => {
    if (error)
        console.log(error);    
        console.log('Conectado a mongodb en clever');
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//rutas
app.use('/user', user_routes);
app.use('/login', login_routes);
app.use('/matches', matches_routes);
app.use('/table', table_routes);
app.use('/search', search_routes);
app.use('/table-subscription', tablesubs_routes);
app.use('/match', match_routes);
app.use('/bet-type', bettype_routes);
app.use('/matchesbytable', matchesbytable_routes);
app.use('/bet-type-option', bettypeoption_routes);
app.use('/option-type-relation', optiontyperelation_routes);
app.use('/match-type-relation', matchtyperelation_routes);
app.use('/upload', fileUpload(), upload_routes);
app.use('/forecast', forecast_routes);
app.use('/bet', bet_routes);

app.use(express.static(__dirname + '/public/dist/byam/'));

app.connectedUsers = [];

//escuchar peticiones
http.listen(port, () => {
    console.log('Servidor Node/Express corriendo en puerto 3000' + port +': \x1b[36m%s\x1b[0m', 'online');
});

// var currentConnections = {};
// io.on('connection', function (client) {
    
//     currentConnections[client.id] = {socket: client};    
    
//     client.on('disconnect', function (client) {
//         console.log('user disconnected');
//         delete currentConnections[client.id];
//     });

//     // socket.on('disconnect', function () {
//     //     console.log('user disconnected');
//     // });

//     client.on('configurar-usuario', function (user) {
//         // var users = app.connectedUsers.filter(function (value, index, arr) {
//         //     return value._id != user._id;
//         // });
//         // users.unshift(user);
//         console.log('configurar usuario');
//         client.broadcast.emit('user-conected', user);

//         // client.emit('user-conected', user);
//     });

//     client.on('user-disconnect', function (user) {
//         // console.log('disconected user', user);
//         // var users = app.connectedUsers.filter(function (value, index, arr) {
//         //     return value._id != user._id;
//         // });
//         // app.connectedUsers = users;
//         // client.emit('user-conected', app.connectedUsers);
//          console.log('user discconected', user);
//     });
// });

